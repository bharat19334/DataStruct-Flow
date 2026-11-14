"""
DSA Visual Tutor - Backend (Production Ready)
FastAPI + Groq powered API
"""

import os
import sys
import json
import re
import subprocess
import tempfile
from typing import Optional

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

# Primary aur Fallback models की list (agar ek deprecate ho toh dusra turant kaam karega)
 PRIMARY_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile").strip()
FALLBACK_MODELS = [
    PRIMARY_MODEL,
    "llama-3.1-8b-instant",
    "gemma2-9b-it",
    "mixtral-8x7b-32768",
]

# Render ke httpx compatibility bug se bachne ke liye custom http_client pass kiya hai
client = None
if GROQ_API_KEY:
    try:
        client = Groq(api_key=GROQ_API_KEY, http_client=httpx.Client())
    except Exception:
        client = Groq(api_key=GROQ_API_KEY)

LANGUAGE_MAP = {
    "Python": "python",
    "C++": "cpp",
    "Java": "java",
    "JavaScript": "javascript",
}

app = FastAPI(title="DSA Visual Tutor API")

# Explicit CORS setup taaki browser 'Failed to fetch' na de
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Request Models ----------

class QuestionRequest(BaseModel):
    question: str
    explain_language: Optional[str] = "english"


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


# ---------- Helper: Fault-Tolerant Groq Caller ----------

def call_llm(system_prompt: str, user_prompt: str, json_mode: bool = False) -> str:
    if client is None:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is missing on server. Add it in Render -> Environment."
        )

    last_error = None
    # Har model ko try karega jab tak success na mile
    for model_name in FALLBACK_MODELS:
        try:
            kwargs = {
                "model": model_name,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.3,
            }
            if json_mode:
                kwargs["response_format"] = {"type": "json_object"}

            response = client.chat.completions.create(**kwargs)
            return response.choices[0].message.content
        except Exception as e:
            last_error = str(e)
            continue

    # Agar saare models fail ho jayein (jaise Invalid API key), toh clean HTTPException dega (CORS break nahi hoga)
    raise HTTPException(status_code=502, detail=f"Groq API Error: {last_error}")


def extract_json(raw_text: str):
    """Clean markdown fences and extract valid JSON."""
    cleaned = re.sub(r"```json|```", "", raw_text).strip()
    match = re.search(r"(\{.*\}|\[.*\])", cleaned, re.DOTALL)
    if match:
        cleaned = match.group(1)
    return json.loads(cleaned)


# ---------- Endpoints ----------

@app.get("/")
def health():
    return {
        "status": "ok",
        "api_key_configured": bool(GROQ_API_KEY),
        "primary_model": PRIMARY_MODEL
    }


@app.post("/api/explain")
def explain_question(req: QuestionRequest):
    if req.explain_language == "hinglish":
        language_instruction = (
            "Respond in natural Hinglish (Hindi-English mix, written in Roman/English script "
            "— NOT Devanagari), the way an Indian CS student casually explains things to a "
            "friend. Keep technical terms (array, pointer, time complexity, etc.) in English."
        )
    else:
        language_instruction = "Respond in clear, simple English."

    system_prompt = (
        "You are a friendly DSA tutor for Indian CS students preparing for placements. "
        "Explain the given problem in simple language: what it's asking, a real-world "
        "analogy, and constraints/edge cases to watch for. Keep it under 150 words. "
        f"{language_instruction} "
        "Respond in plain text, no markdown headers."
    )
    text = call_llm(system_prompt, req.question)
    return {"explanation": text}


@app.post("/api/approaches")
def get_approaches(req: QuestionRequest):
    system_prompt = (
        "You are a DSA tutor. Given a problem, return ONLY valid JSON (no markdown, "
        "no commentary) — an array of approach objects, ordered from brute force to "
        "most optimal. Each object must have exactly these keys: "
        '"name" (string), "time_complexity" (string), "space_complexity" (string), '
        '"is_best" (boolean), "why" (1-2 sentence reasoning for why this is/isn\'t optimal). '
        "Include 2 to 4 approaches."
    )
    raw = call_llm(system_prompt, req.question)
    try:
        parsed = extract_json(raw)
        # Handle case if LLM wraps array inside an object key like {"approaches": [...]}
        if isinstance(parsed, dict) and "approaches" in parsed:
            approaches = parsed["approaches"]
        else:
            approaches = parsed
    except Exception:
        raise HTTPException(status_code=502, detail="LLM returned invalid JSON. Try again.")
    return {"approaches": approaches}


@app.post("/api/dry-run")
def dry_run(req: DryRunRequest):
    if req.narrate_language == "hinglish":
        action_language_instruction = (
            "Write every 'action' description in natural Hinglish (Hindi-English mix, "
            "Roman script — NOT Devanagari). Keep technical terms in English."
        )
    else:
        action_language_instruction = "Write every 'action' description in clear, proper English."

    system_prompt = (
        "You are a DSA visualizer engine. Given a problem and approach, simulate the algorithm "
        "on a SMALL sample input and return ONLY valid JSON (no markdown, no code fences).\n\n"
        "STEP 1 — Decide structure_type:\n"
        "- \"array\" for array/string/two-pointer/sliding-window/sorting/searching problems.\n"
        "- \"tree\" for binary tree / BST problems.\n"
        "- \"graph\" for graph traversal / shortest-path / connectivity problems.\n\n"
        "STEP 2 — Return JSON in ONE of these two shapes:\n\n"
        "=== SHAPE A (structure_type = \"array\") ===\n"
        "{\n"
        '  "structure_type": "array",\n'
        '  "input": [ ... ],\n'
        '  "steps": [\n'
        "    {\n"
        '      "array": [ ... ],\n'
        '      "highlight": [ 0, 1 ],\n'
        '      "pointers": { "i": 0, "j": 1 },\n'
        '      "action": "2-3 sentences explaining the step clearly.",\n'
        '      "swapped": false\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "=== SHAPE B (structure_type = \"tree\" or \"graph\") ===\n"
        "{\n"
        '  "structure_type": "tree",\n'
        '  "nodes": [ { "id": "A", "value": 5, "x": 350, "y": 50 } ],\n'
        '  "edges": [ { "from": "A", "to": "B" } ],\n'
        '  "steps": [\n'
        "    {\n"
        '      "current": "A",\n'
        '      "visited": [ "A" ],\n'
        '      "frontier": [ "B" ],\n'
        '      "active_edge": { "from": "A", "to": "B" },\n'
        '      "pointers": { "curr": "A" },\n'
        '      "action": "2-3 sentences explaining the step clearly."\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "Keep steps between 5 and 12. "
        f"{action_language_instruction}"
    )
    user_prompt = f"Problem: {req.question}\nApproach to simulate: {req.approach}"
    raw = call_llm(system_prompt, user_prompt, json_mode=True)
    try:
        trace = extract_json(raw)
    except Exception:
        raise HTTPException(status_code=502, detail="LLM returned invalid JSON. Try again.")
    return trace


@app.post("/api/translate")
def translate_text(req: TranslateRequest):
    if req.target == "hinglish":
        instruction = (
            "Translate into natural Hinglish (Roman script — NOT Devanagari). "
            "Keep technical terms in English."
        )
    elif req.target == "hindi":
        instruction = (
            "Translate into simple Hindi using Devanagari script. Keep technical terms in English."
        )
    else:
        instruction = "Translate into clear, simple English."

    system_prompt = f"{instruction} Return ONLY the translated text, no preamble or quotes."
    translated = call_llm(system_prompt, req.text)
    return {"text": translated}


@app.post("/api/run-code")
async def run_code(req: RunCodeRequest):
    language_id = LANGUAGE_MAP.get(req.language, "python")

    if language_id == "python":
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as f:
            f.write(req.code)
            temp_file_name = f.name

        try:
            # sys.executable ensures exact Python binary on both Windows & Linux (Render)
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

    return {
        "stdout": f"Executed ({req.language}):\n" + req.code,
        "stderr": "",
        "compile_output": "",
        "exit_code": 0,
        "language": language_id,
        "version": "latest"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)