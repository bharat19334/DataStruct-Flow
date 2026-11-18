"""
DSA Visual Tutor - High-Speed Production Backend
FastAPI + AsyncGroq + Cached Live Model Discovery + In-Memory Cache + Supabase History + Auth + ElevenLabs TTS
"""

import os
import sys
import json
import re
import hashlib
import asyncio
import subprocess
import tempfile
from typing import Optional, List

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import AsyncGroq

# Auth module import
from auth import (
    init_db,
    get_user_by_email,
    create_user,
    verify_password,
    create_access_token,
    SignupRequest,
    LoginRequest,
    AuthResponse,
)

load_dotenv()
init_db()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip().rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "").strip()
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM").strip()

# Initialize AsyncGroq client safely for Render Python environment
async_client = None
if GROQ_API_KEY:
    try:
        async_client = AsyncGroq(api_key=GROQ_API_KEY, http_client=httpx.AsyncClient(timeout=30))
    except Exception:
        async_client = AsyncGroq(api_key=GROQ_API_KEY)

# Cache live models once so we never hit 404 model_not_found AND never waste time on every request
_CACHED_MODELS: List[str] = []
_WORKING_MODEL: Optional[str] = None

# In-memory LRU-style dictionary cache for instant repeat responses & audio
_RESPONSE_CACHE: dict = {}
_AUDIO_CACHE: dict = {}
MAX_CACHE_SIZE = 300
MAX_AUDIO_CACHE_SIZE = 100

PISTON_URL = "https://emkc.org/api/v2/piston"
LANGUAGE_MAP = {
    "Python": "python",
    "C++": "cpp",
    "Java": "java",
    "JavaScript": "javascript",
}
FILE_EXTENSIONS = {
    "python": "main.py",
    "cpp": "main.cpp",
    "java": "Main.java",
    "javascript": "main.js",
}
_piston_runtime_cache: dict = {}

app = FastAPI(title="DSA Visual Tutor API (Turbo)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Request Models ----------

class QuestionRequest(BaseModel):
    question: str
    explain_language: Optional[str] = "english"
    user_name: Optional[str] = None
    user_identifier: Optional[str] = None


class DryRunRequest(BaseModel):
    question: str
    approach: str
    narrate_language: Optional[str] = "english"


class RunCodeRequest(BaseModel):
    code: str
    language: str = "Python"
    stdin: Optional[str] = ""


class TranslateRequest(BaseModel):
    text: str
    target: str = "english"


class TTSRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None


class TelemetryPing(BaseModel):
    device_hash: str
    platform: Optional[str] = "Coder"


class HistoryCreateRequest(BaseModel):
    user_identifier: str
    entry_type: str  # "question", "solved", "dryrun"
    question_text: str
    approach: Optional[str] = ""
    language: Optional[str] = ""
    code: Optional[str] = ""
    status: Optional[str] = ""


# ---------- Helper: Cache + Dynamic Cached Model Discovery ----------

def _get_cache_key(prefix: str, *args) -> str:
    raw = prefix + ":" + "|".join(str(a).strip().lower() for a in args)
    return hashlib.md5(raw.encode("utf-8")).hexdigest()


def _set_cache(key: str, val):
    if len(_RESPONSE_CACHE) >= MAX_CACHE_SIZE:
        first_key = next(iter(_RESPONSE_CACHE))
        _RESPONSE_CACHE.pop(first_key, None)
    _RESPONSE_CACHE[key] = val


def _set_audio_cache(key: str, audio_bytes: bytes):
    if len(_AUDIO_CACHE) >= MAX_AUDIO_CACHE_SIZE:
        first_key = next(iter(_AUDIO_CACHE))
        _AUDIO_CACHE.pop(first_key, None)
    _AUDIO_CACHE[key] = audio_bytes


async def get_cached_live_models() -> List[str]:
    """Groq API se live models ki list SIRF EK BAAR nikalta hai aur memory mein cache rakhta hai."""
    global _CACHED_MODELS
    if _CACHED_MODELS:
        return _CACHED_MODELS

    live_models = []
    if async_client is not None:
        try:
            models_resp = await async_client.models.list()
            for m in models_resp.data:
                m_id = m.id
                # Audio, whisper, guard aur embedding models ko skip karein
                if any(skip in m_id.lower() for skip in ["whisper", "guard", "tts", "embed", "playai", "allam", "vision"]):
                    continue
                live_models.append(m_id)
        except Exception:
            pass

    # Fast instruction models ko sabse aage rakhein
    preferred_keywords = ["llama-4", "llama-3.3", "llama-3.1", "gemma", "qwen", "deepseek", "llama"]
    sorted_models = sorted(
        live_models,
        key=lambda x: next((i for i, kw in enumerate(preferred_keywords) if kw in x.lower()), 999)
    )

    backups = [
        "meta-llama/llama-4-scout-17b-16e-instruct",
        "meta-llama/llama-4-maverick-17b-128e-instruct",
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "qwen/qwen3-32b",
        "qwen-qwq-32b",
        "deepseek-r1-distill-llama-70b",
    ]
    for b in backups:
        if b not in sorted_models:
            sorted_models.append(b)

    _CACHED_MODELS = sorted_models
    return _CACHED_MODELS


async def call_llm(system_prompt: str, user_prompt: str, max_tokens: int = 1024) -> str:
    global _WORKING_MODEL, _CACHED_MODELS
    if async_client is None:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY not set. Add it to Render Environment Variables."
        )

    models_to_try = list(await get_cached_live_models())
    if _WORKING_MODEL and _WORKING_MODEL in models_to_try:
        models_to_try.remove(_WORKING_MODEL)
        models_to_try.insert(0, _WORKING_MODEL)

    errors = []
    for model_to_use in models_to_try:
        try:
            response = await async_client.chat.completions.create(
                model=model_to_use,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.2,
                max_tokens=max_tokens,
            )
            content = response.choices[0].message.content or ""
            # DeepSeek R1 / Qwen jaise models ke <think>...</think> tags strip karein
            content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
            _WORKING_MODEL = model_to_use
            return content
        except Exception as e:
            errors.append(f"{model_to_use}: {str(e)}")
            continue

    # Agar saare models fail hue toh model cache clear karein taaki next attempt par fresh list aaye
    _CACHED_MODELS = []
    raise HTTPException(status_code=502, detail=f"Groq API error: {errors[0] if errors else 'No working models found'}")


def extract_json(raw_text: str):
    """Accurately extracts either a JSON Array [...] or JSON Object {...} depending on which appears first."""
    cleaned = re.sub(r"<think>.*?</think>", "", raw_text, flags=re.DOTALL).strip()
    cleaned = re.sub(r"```json|```", "", cleaned).strip()

    first_brace = cleaned.find("{")
    first_bracket = cleaned.find("[")

    if first_bracket != -1 and (first_brace == -1 or first_bracket < first_brace):
        last_bracket = cleaned.rfind("]")
        if last_bracket != -1:
            cleaned = cleaned[first_bracket:last_bracket + 1]
    elif first_brace != -1:
        last_brace = cleaned.rfind("}")
        if last_brace != -1:
            cleaned = cleaned[first_brace:last_brace + 1]

    return json.loads(cleaned)


# ---------- Helper: Supabase REST Functions ----------

async def supabase_insert_history(item: HistoryCreateRequest):
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ SUPABASE_URL or SUPABASE_KEY is missing in backend!")
        return None
    url = f"{SUPABASE_URL}/rest/v1/user_history"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    payload = {
        "user_identifier": item.user_identifier.strip().lower(),
        "entry_type": item.entry_type,
        "question_text": item.question_text,
        "approach": item.approach or "",
        "language": item.language or "",
        "code": item.code or "",
        "status": item.status or "",
    }
    try:
        async with httpx.AsyncClient(timeout=8) as http_c:
            res = await http_c.post(url, headers=headers, json=payload)
            print(f"🔍 Supabase Response Status: {res.status_code}, Body: {res.text}")
            if res.status_code in (200, 201):
                return res.json()
            else:
                print(f"❌ Supabase error response: {res.text}")
    except Exception as e:
        print(f"❌ Supabase connection exception: {str(e)}")
    return None


# ---------- Auth Endpoints ----------

@app.post("/api/auth/signup", response_model=AuthResponse)
def signup(req: SignupRequest):
    existing = get_user_by_email(req.email.lower().strip())
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(req.name.strip(), req.email.lower().strip(), req.password)
    token = create_access_token({"sub": user["email"]})
    return AuthResponse(access_token=token, name=user["name"], email=user["email"])


@app.post("/api/auth/login", response_model=AuthResponse)
def login(req: LoginRequest):
    user = get_user_by_email(req.email.lower().strip())
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user["email"]})
    return AuthResponse(access_token=token, name=user["name"], email=user["email"])


# ---------- Core Endpoints ----------

@app.get("/")
async def health():
    models = await get_cached_live_models()
    return {
        "status": "ok",
        "active_model": _WORKING_MODEL,
        "detected_live_models": models[:8],
        "cache_entries": len(_RESPONSE_CACHE),
        "api_key_present": bool(GROQ_API_KEY),
        "supabase_connected": bool(SUPABASE_URL and SUPABASE_KEY),
        "elevenlabs_configured": bool(ELEVENLABS_API_KEY),
    }


@app.post("/api/explain")
async def explain_question(req: QuestionRequest):
    cache_key = _get_cache_key("explain", req.question, req.explain_language, req.user_name)
    if cache_key in _RESPONSE_CACHE:
        return {"explanation": _RESPONSE_CACHE[cache_key], "cached": True}

    if req.explain_language == "hinglish":
        language_instruction = (
            "Respond in natural Hinglish (Hindi-English mix, written in Roman/English script "
            "— NOT Devanagari), the way an Indian CS student casually explains things to a "
            "friend. Keep technical terms (array, pointer, time complexity, etc.) in English."
        )
    else:
        language_instruction = "Respond in clear, simple English."

    first_name = ""
    if req.user_name:
        parts = re.sub(r"[^\w\s]|\d|_", "", req.user_name).split()
        if parts:
            first_name = parts[0][:20].capitalize()
    name_instruction = (
        f"The student's name is {first_name}. Start the explanation by addressing them as "
        f"'{first_name}' (first name), and use '{first_name}' once more "
        "naturally later in the explanation. "
        if first_name else ""
    )

    system_prompt = (
        "You are a friendly DSA tutor for Indian CS students preparing for placements. "
        "Explain the given problem in simple language: what it's asking, a real-world "
        "analogy, and constraints/edge cases to watch for. Keep it under 150 words. "
        f"{name_instruction}"
        f"{language_instruction} "
        "Respond in plain text, no markdown headers."
    )
    text = await call_llm(system_prompt, req.question, max_tokens=450)
    _set_cache(cache_key, text)
    return {"explanation": text}


@app.post("/api/approaches")
async def get_approaches(req: QuestionRequest):
    cache_key = _get_cache_key("approaches", req.question)
    if cache_key in _RESPONSE_CACHE:
        return {"approaches": _RESPONSE_CACHE[cache_key], "cached": True}

    system_prompt = (
        "You are a DSA tutor. Given a problem or topic, return ONLY a valid JSON array "
        "(no markdown, no commentary) of 2 to 4 approach objects ordered from brute force "
        "to most optimal. Each object must have EXACTLY these keys: "
        '"name" (string), "time_complexity" (string), "space_complexity" (string), '
        '"is_best" (boolean), "why" (1-2 sentence reasoning). '
        "IMPORTANT: Your output MUST start with '[' and end with ']'."
    )
    raw = await call_llm(system_prompt, req.question, max_tokens=650)
    try:
        parsed = extract_json(raw)

        if isinstance(parsed, list):
            approaches = parsed
        elif isinstance(parsed, dict):
            found_list = None
            for val in parsed.values():
                if isinstance(val, list):
                    found_list = val
                    break
            if found_list is not None:
                approaches = found_list
            else:
                approaches = [parsed]
        else:
            approaches = []

        clean_approaches = []
        for idx, item in enumerate(approaches):
            if isinstance(item, dict):
                clean_approaches.append({
                    "name": str(item.get("name", f"Approach {idx + 1}")),
                    "time_complexity": str(item.get("time_complexity", "O(n)")),
                    "space_complexity": str(item.get("space_complexity", "O(1)")),
                    "is_best": bool(item.get("is_best", idx == len(approaches) - 1)),
                    "why": str(item.get("why", "Standard approach for this problem."))
                })

        if not clean_approaches:
            raise ValueError("Empty approaches list")

    except Exception:
        raise HTTPException(status_code=502, detail="LLM returned invalid JSON. Try again.")

    _set_cache(cache_key, clean_approaches)
    return {"approaches": clean_approaches}


@app.post("/api/analyze")
async def analyze_combined(req: QuestionRequest):
    """Combined parallel endpoint: runs explain + approaches concurrently."""
    exp_res, app_res = await asyncio.gather(
        explain_question(req),
        get_approaches(req)
    )
    return {
        "explanation": exp_res["explanation"],
        "approaches": app_res["approaches"]
    }


@app.post("/api/dry-run")
async def dry_run(req: DryRunRequest):
    cache_key = _get_cache_key("dryrun", req.question, req.approach, req.narrate_language)
    if cache_key in _RESPONSE_CACHE:
        return _RESPONSE_CACHE[cache_key]

    if req.narrate_language == "hinglish":
        action_language_instruction = (
            "Write every 'action' description in natural Hinglish (Hindi-English mix, "
            "Roman script — NOT Devanagari), keeping technical terms in English."
        )
    else:
        action_language_instruction = "Write every 'action' description in clear, proper English."

    system_prompt = (
        "You are a DSA visualizer engine for a student-facing learning tool. Given a problem "
        "and a chosen approach, simulate the algorithm on a SMALL sample input and return "
        "ONLY valid JSON (no markdown, no commentary, no code fences).\n\n"
        "STEP 1 — Decide the structure_type:\n"
        "- \"array\" for array/string/two-pointer/sliding-window/sorting/searching problems.\n"
        "- \"tree\" for binary tree / BST problems.\n"
        "- \"graph\" for graph traversal / shortest-path / connectivity problems.\n\n"
        "STEP 2 — Return JSON in ONE of these two shapes, matching structure_type:\n\n"
        "=== SHAPE A (structure_type = \"array\") ===\n"
        "{\n"
        '  "structure_type": "array",\n'
        '  "input": [ ... ],\n'
        '  "steps": [\n'
        "    {\n"
        '      "array": [ ... state AFTER this step\'s change, if any ... ],\n'
        '      "highlight": [ indices touched this step ],\n'
        '      "pointers": { "i": 0, "j": 1 },\n'
        '      "action": "2-3 full sentences explaining which pointer(s) are involved, what values they are looking at, what comparison or operation happens, and how pointers move next.",\n'
        '      "swapped": false\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "=== SHAPE B (structure_type = \"tree\" or \"graph\") ===\n"
        "{\n"
        '  "structure_type": "tree" | "graph",\n'
        '  "nodes": [ { "id": "A", "value": 5, "x": 0-700, "y": 0-320 } ],\n'
        '  "edges": [ { "from": "A", "to": "B" } ],\n'
        '  "steps": [\n'
        "    {\n"
        '      "current": "A",\n'
        '      "visited": [ "A", "B" ],\n'
        '      "frontier": [ "C", "D" ],\n'
        '      "active_edge": { "from": "A", "to": "B" } | null,\n'
        '      "pointers": { "queue_front": "C" },\n'
        '      "action": "2-3 full sentences explaining what node is visited, why it was chosen, and what happens next."\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "General rules: keep steps between 5 and 12. Use a small sample (max 7 array elements, "
        "or max 10 tree/graph nodes). "
        f"{action_language_instruction} "
        "Pick exactly one shape based on structure_type."
    )
    user_prompt = f"Problem: {req.question}\nApproach to simulate: {req.approach}"
    raw = await call_llm(system_prompt, user_prompt, max_tokens=1500)
    try:
        trace = extract_json(raw)
        if isinstance(trace, list):
            trace = {"structure_type": "array", "input": [2, 7, 11, 15], "steps": trace}
        if "structure_type" not in trace:
            trace["structure_type"] = "array"
        if "steps" not in trace or not isinstance(trace["steps"], list):
            trace["steps"] = []
    except Exception:
        raise HTTPException(status_code=502, detail="LLM returned invalid JSON. Try again.")

    _set_cache(cache_key, trace)
    return trace


@app.post("/api/translate")
async def translate_text(req: TranslateRequest):
    cache_key = _get_cache_key("translate", req.text, req.target)
    if cache_key in _RESPONSE_CACHE:
        return {"text": _RESPONSE_CACHE[cache_key]}

    if req.target == "hinglish":
        instruction = (
            "Translate/rewrite the following text into natural Hinglish (Hindi-English mix, "
            "Roman script — NOT Devanagari). Keep technical terms in English."
        )
    elif req.target == "hindi":
        instruction = (
            "Translate the following text into clear, simple Hindi using Devanagari script. "
            "Keep technical programming terms in English/Roman script."
        )
    else:
        instruction = "Translate/rewrite the following text into clear, simple English."

    system_prompt = (
        f"{instruction} Return ONLY the translated text, no preamble, no quotes, "
        "no markdown formatting."
    )
    translated = await call_llm(system_prompt, req.text, max_tokens=500)
    _set_cache(cache_key, translated)
    return {"text": translated}


# ---------- ElevenLabs TTS Voice Endpoint (with Memory Cache) ----------

@app.post("/api/tts")
async def generate_tts(req: TTSRequest):
    if not ELEVENLABS_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="ELEVENLABS_API_KEY not set in Render Environment Variables."
        )

    clean_text = (req.text or "").strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Empty text for TTS")

    voice_id = (req.voice_id or ELEVENLABS_VOICE_ID or "21m00Tcm4TlvDq8ikWAM").strip()
    audio_key = _get_cache_key("tts", voice_id, clean_text)

    # Return cached MP3 bytes immediately if already generated once
    if audio_key in _AUDIO_CACHE:
        return Response(content=_AUDIO_CACHE[audio_key], media_type="audio/mpeg")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
    }
    payload = {
        "text": clean_text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.50,
            "similarity_boost": 0.78,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            res = await client.post(url, headers=headers, json=payload)
            if res.status_code != 200:
                raise HTTPException(
                    status_code=res.status_code,
                    detail=f"ElevenLabs API error: {res.text}"
                )
            _set_audio_cache(audio_key, res.content)
            return Response(content=res.content, media_type="audio/mpeg")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS connection failed: {str(e)}")


# ---------- Supabase History Endpoints ----------

@app.post("/api/history")
async def save_user_history(req: HistoryCreateRequest):
    saved = await supabase_insert_history(req)
    return {"status": "ok", "supabase_synced": bool(saved), "data": saved}


@app.get("/api/history")
async def fetch_user_history(user_identifier: str = "guest", limit: int = 100):
    if not SUPABASE_URL or not SUPABASE_KEY:
        return {"history": [], "supabase_connected": False}

    clean_id = user_identifier.strip().lower()
    url = (
        f"{SUPABASE_URL}/rest/v1/user_history"
        f"?user_identifier=eq.{clean_id}&order=created_at.desc&limit={limit}"
    )
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    try:
        async with httpx.AsyncClient(timeout=8) as http_c:
            res = await http_c.get(url, headers=headers)
            if res.status_code == 200:
                return {"history": res.json(), "supabase_connected": True}
    except Exception:
        pass
    return {"history": [], "supabase_connected": False}


@app.delete("/api/history")
async def clear_user_history(user_identifier: str):
    if not SUPABASE_URL or not SUPABASE_KEY:
        return {"status": "skipped"}
    clean_id = user_identifier.strip().lower()
    url = f"{SUPABASE_URL}/rest/v1/user_history?user_identifier=eq.{clean_id}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    try:
        async with httpx.AsyncClient(timeout=8) as http_c:
            await http_c.delete(url, headers=headers)
    except Exception:
        pass
    return {"status": "cleared"}


# ---------- Compiler (Local Python + Piston API for C++/Java/JS) ----------

async def get_piston_version(language_id: str) -> str:
    if language_id in _piston_runtime_cache:
        return _piston_runtime_cache[language_id]
    try:
        async with httpx.AsyncClient(timeout=15) as http_client:
            res = await http_client.get(f"{PISTON_URL}/runtimes")
            res.raise_for_status()
            runtimes = res.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Could not reach code execution service: {e}")

    for rt in runtimes:
        if rt["language"] == language_id:
            _piston_runtime_cache[language_id] = rt["version"]
            return rt["version"]
    raise HTTPException(status_code=400, detail=f"Unsupported language: {language_id}")


@app.post("/api/run-code")
async def run_code(req: RunCodeRequest):
    language_id = LANGUAGE_MAP.get(req.language, "python")

    if language_id == "python":
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as f:
            f.write(req.code)
            temp_file_name = f.name

        try:
            process = subprocess.run(
                [sys.executable, temp_file_name],
                input=req.stdin or "",
                text=True,
                capture_output=True,
                timeout=5
            )
            os.unlink(temp_file_name)
            return {
                "stdout": process.stdout,
                "stderr": process.stderr,
                "compile_output": "",
                "exit_code": process.returncode,
                "language": "python",
                "version": "3.x"
            }
        except subprocess.TimeoutExpired:
            if os.path.exists(temp_file_name):
                os.unlink(temp_file_name)
            return {
                "stdout": "",
                "stderr": "Error: Code execution timed out (limit: 5 seconds).",
                "compile_output": "",
                "exit_code": -1,
                "language": "python",
                "version": "3.x"
            }
        except Exception as e:
            if os.path.exists(temp_file_name):
                os.unlink(temp_file_name)
            return {
                "stdout": "",
                "stderr": str(e),
                "compile_output": "",
                "exit_code": -1,
                "language": "python",
                "version": "3.x"
            }

    # Execute C++, Java, JavaScript via Piston API
    try:
        version = await get_piston_version(language_id)
        payload = {
            "language": language_id,
            "version": version,
            "files": [{"name": FILE_EXTENSIONS.get(language_id, "main.txt"), "content": req.code}],
            "stdin": req.stdin or "",
        }
        async with httpx.AsyncClient(timeout=15) as http_client:
            res = await http_client.post(f"{PISTON_URL}/execute", json=payload)
            res.raise_for_status()
            data = res.json()
            run_data = data.get("run", {})
            compile_data = data.get("compile", {})
            return {
                "stdout": run_data.get("stdout", ""),
                "stderr": run_data.get("stderr", ""),
                "compile_output": compile_data.get("output", "") if compile_data.get("code", 0) != 0 else "",
                "exit_code": run_data.get("code", 0),
                "language": language_id,
                "version": version,
            }
    except Exception as e:
        return {
            "stdout": "",
            "stderr": f"Execution service error: {str(e)}",
            "compile_output": "",
            "exit_code": -1,
            "language": language_id,
            "version": "latest"
        }


# ---------- Zero-Duplicate Unique Visitor Counter ----------

TELEMETRY_FILE = os.path.join(os.path.dirname(__file__), "visitors_store.json")
BASE_CODERS_COUNT = 54


def _load_telemetry() -> dict:
    if os.path.exists(TELEMETRY_FILE):
        try:
            with open(TELEMETRY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"fingerprints": [], "ips": [], "recent": []}


def _save_telemetry(data: dict):
    try:
        with open(TELEMETRY_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f)
    except Exception:
        pass


@app.post("/api/telemetry/visit")
def register_unique_visit(req: TelemetryPing, request: Request):
    data = _load_telemetry()
    forwarded = request.headers.get("x-forwarded-for")
    client_ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")
    ip_hash = hashlib.sha256(client_ip.encode()).hexdigest()[:16]
    clean_fp = req.device_hash.strip()[:32]
    combined_key = f"{clean_fp}_{ip_hash}"

    is_new_device = False
    if clean_fp not in data["fingerprints"] and combined_key not in data["ips"]:
        data["fingerprints"].append(clean_fp)
        data["ips"].append(combined_key)
        is_new_device = True

        short_id = clean_fp[:5].lower()
        masked_email = f"coder.{short_id}***@gmail.com"
        data["recent"].insert(0, {
            "id": f"DEV-{clean_fp[:6].upper()}",
            "email": masked_email,
            "platform": req.platform,
            "action": "Active on DSA Workspace"
        })
        data["recent"] = data["recent"][:10]
        _save_telemetry(data)

    total_unique = BASE_CODERS_COUNT + len(data["fingerprints"])
    return {
        "total_unique_coders": total_unique,
        "is_new_device": is_new_device,
        "device_badge": f"DEV-{clean_fp[:6].upper()}",
        "recent_devices": data["recent"]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)