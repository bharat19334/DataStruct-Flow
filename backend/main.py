"""
DSA Visual Tutor - High-Speed Production Backend
FastAPI + AsyncGroq + In-Memory Cache + Supabase History + Auth
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

# Initialize AsyncGroq client for non-blocking parallel calls
async_client = AsyncGroq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# Fast models prioritized first (skipping slow <think> models unless fallback needed)
FAST_MODELS = [
    "llama-3.3-70b-versatile",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
    "llama-3.1-8b-instant",
]
_WORKING_MODEL: Optional[str] = FAST_MODELS[0]

# In-memory LRU-style dictionary cache for instant repeat responses
_RESPONSE_CACHE: dict = {}
MAX_CACHE_SIZE = 300

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


# ---------- Helper: Cache + Fast Async Groq Caller ----------

def _get_cache_key(prefix: str, *args) -> str:
    raw = prefix + ":" + "|".join(str(a).strip().lower() for a in args)
    return hashlib.md5(raw.encode("utf-8")).hexdigest()


def _set_cache(key: str, val):
    if len(_RESPONSE_CACHE) >= MAX_CACHE_SIZE:
        first_key = next(iter(_RESPONSE_CACHE))
        _RESPONSE_CACHE.pop(first_key, None)
    _RESPONSE_CACHE[key] = val


async def call_llm(system_prompt: str, user_prompt: str, max_tokens: int = 1024) -> str:
    global _WORKING_MODEL
    if async_client is None:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY not set in Environment Variables."
        )

    models_to_try = list(FAST_MODELS)
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
            content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
            _WORKING_MODEL = model_to_use
            return content
        except Exception as e:
            errors.append(f"{model_to_use}: {str(e)}")
            continue

    raise HTTPException(status_code=502, detail=f"Groq API error: {errors[0] if errors else 'No working models'}")


def extract_json(raw_text: str):
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
        async with httpx.AsyncClient(timeout=8) as client:
            res = await client.post(url, headers=headers, json=payload)
            if res.status_code in (200, 201):
                return res.json()
    except Exception:
        pass
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
def health():
    return {
        "status": "ok",
        "active_model": _WORKING_MODEL,
        "cache_entries": len(_RESPONSE_CACHE),
        "api_key_present": bool(GROQ_API_KEY),
        "supabase_connected": bool(SUPABASE_URL and SUPABASE_KEY),
    }


@app.post("/api/explain")
async def explain_question(req: QuestionRequest):
    cache_key = _get_cache_key("explain", req.question, req.explain_language, req.user_name)
    if cache_key in _RESPONSE_CACHE:
        return {"explanation": _RESPONSE_CACHE[cache_key], "cached": True}

    if req.explain_language == "hinglish":
        language_instruction = (
            "Respond in natural Hinglish (Hindi-English mix, written in Roman script). "
            "Keep technical terms in English."
        )
    else:
        language_instruction = "Respond in clear, simple English."

    first_name = ""
    if req.user_name:
        parts = re.sub(r"[^\w\s]|\d|_", "", req.user_name).split()
        if parts:
            first_name = parts[0][:20].capitalize()
    name_instruction = (
        f"Address the student as '{first_name} ji' at the start and once naturally later. "
        if first_name else ""
    )

    system_prompt = (
        "You are a friendly DSA tutor for Indian CS students preparing for placements. "
        "Explain the given problem in simple language: what it's asking, a real-world "
        "analogy, and constraints/edge cases to watch for. Keep it under 140 words. "
        f"{name_instruction}{language_instruction} "
        "Respond in plain text, no markdown headers."
    )
    text = await call_llm(system_prompt, req.question, max_tokens=400)
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
    raw = await call_llm(system_prompt, req.question, max_tokens=600)
    try:
        parsed = extract_json(raw)
        if isinstance(parsed, list):
            approaches = parsed
        elif isinstance(parsed, dict):
            found_list = next((v for v in parsed.values() if isinstance(v, list)), None)
            approaches = found_list if found_list is not None else [parsed]
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
            raise ValueError("Empty approaches")
    except Exception:
        raise HTTPException(status_code=502, detail="LLM returned invalid JSON. Try again.")

    _set_cache(cache_key, clean_approaches)
    return {"approaches": clean_approaches}


@app.post("/api/analyze")
async def analyze_combined(req: QuestionRequest):
    """Combined parallel endpoint: runs explain + approaches concurrently for 2x speed."""
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
            "Write every 'action' description in natural Hinglish (Roman script)."
        )
    else:
        action_language_instruction = "Write every 'action' description in clear, proper English."

    system_prompt = (
        "You are a DSA visualizer engine. Given a problem and a chosen approach, simulate the "
        "algorithm on a SMALL sample input and return ONLY valid JSON (no markdown).\n\n"
        "STEP 1 — Decide structure_type: \"array\", \"tree\", or \"graph\".\n"
        "STEP 2 — Return JSON in ONE of these two shapes:\n"
        "=== SHAPE A (structure_type = \"array\") ===\n"
        '{"structure_type": "array", "input": [...], "steps": [{"array": [...], "highlight": [0], '
        '"pointers": {"i": 0}, "action": "2 sentences explaining pointers, comparison, and next move.", "swapped": false}]}\n'
        "=== SHAPE B (structure_type = \"tree\" or \"graph\") ===\n"
        '{"structure_type": "tree", "nodes": [{"id": "A", "value": 5, "x": 350, "y": 50}], '
        '"edges": [{"from": "A", "to": "B"}], "steps": [{"current": "A", "visited": ["A"], '
        '"frontier": ["B"], "active_edge": {"from": "A", "to": "B"}, "pointers": {"curr": "A"}, '
        '"action": "2 sentences explaining node visit and neighbours."}]}\n'
        "Keep steps between 5 and 10. Max 6 array elements or 8 nodes. "
        f"{action_language_instruction}"
    )
    user_prompt = f"Problem: {req.question}\nApproach to simulate: {req.approach}"
    raw = await call_llm(system_prompt, user_prompt, max_tokens=1400)
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
        instruction = "Translate into natural Hinglish (Roman script). Keep technical terms in English."
    elif req.target == "hindi":
        instruction = "Translate into clear Hindi using Devanagari script. Keep technical terms in English."
    else:
        instruction = "Translate into clear, simple English."

    system_prompt = f"{instruction} Return ONLY the translated text, no preamble."
    translated = await call_llm(system_prompt, req.text, max_tokens=500)
    _set_cache(cache_key, translated)
    return {"text": translated}


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
        async with httpx.AsyncClient(timeout=8) as client:
            res = await client.get(url, headers=headers)
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
        async with httpx.AsyncClient(timeout=8) as client:
            await client.delete(url, headers=headers)
    except Exception:
        pass
    return {"status": "cleared"}


# ---------- Compiler (Local Python + Piston API for C++/Java/JS) ----------

async def get_piston_version(language_id: str) -> str:
    if language_id in _piston_runtime_cache:
        return _piston_runtime_cache[language_id]
    async with httpx.AsyncClient(timeout=10) as http_client:
        res = await http_client.get(f"{PISTON_URL}/runtimes")
        res.raise_for_status()
        for rt in res.json():
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
                "stderr": "Error: Code execution timed out (5s limit).",
                "compile_output": "",
                "exit_code": -1,
                "language": "python",
                "version": "3.x"
            }

    # Piston Execution for C++, Java, JavaScript
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


# ---------- Unique Visitor Telemetry ----------

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
        data["recent"].insert(0, {
            "id": f"DEV-{clean_fp[:6].upper()}",
            "email": f"coder.{short_id}***@gmail.com",
            "platform": req.platform,
            "action": "Active on DSA Workspace"
        })
        data["recent"] = data["recent"][:10]
        _save_telemetry(data)

    return {
        "total_unique_coders": BASE_CODERS_COUNT + len(data["fingerprints"]),
        "is_new_device": is_new_device,
        "device_badge": f"DEV-{clean_fp[:6].upper()}",
        "recent_devices": data["recent"]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)