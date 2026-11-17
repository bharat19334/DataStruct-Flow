const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://datastruct-flow-backend.onrender.com";

// Wake up Render server immediately on page load to eliminate cold start delay
fetch(`${API_BASE}/`).catch(() => {});

const FAST_CACHE_KEY = "dsa_fast_cache_v1";

function getFastCache(key) {
  try {
    const store = JSON.parse(sessionStorage.getItem(FAST_CACHE_KEY) || "{}");
    return store[key.trim().toLowerCase()] || null;
  } catch (e) {
    return null;
  }
}

function setFastCache(key, data) {
  try {
    const store = JSON.parse(sessionStorage.getItem(FAST_CACHE_KEY) || "{}");
    store[key.trim().toLowerCase()] = data;
    sessionStorage.setItem(FAST_CACHE_KEY, JSON.stringify(store));
  } catch (e) {}
}

const questionInput = document.getElementById("questionInput");
const runBtn = document.getElementById("runBtn");
const apiStatus = document.getElementById("apiStatus");

const explainPanel = document.getElementById("explainPanel");
const explanationText = document.getElementById("explanationText");

const approachesPanel = document.getElementById("approachesPanel");
const approachesList = document.getElementById("approachesList");

const dryrunPanel = document.getElementById("dryrunPanel");
const dryrunApproachName = document.getElementById("dryrunApproachName");
const arrayStage = document.getElementById("arrayStage");
const pointerRow = document.getElementById("pointerRow");
const actionLine = document.getElementById("actionLine");
const stepCounter = document.getElementById("stepCounter");
const prevStepBtn = document.getElementById("prevStep");
const nextStepBtn = document.getElementById("nextStep");
const playStepBtn = document.getElementById("playStep");
const speedSelect = document.getElementById("speedSelect");

const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const errorBox = document.getElementById("errorBox");

const listenBtn = document.getElementById("listenBtn");
const listenText = document.getElementById("listenText");
const narrateToggle = document.getElementById("narrateToggle");
const narrateLangSelect = document.getElementById("narrateLangSelect");

let currentQuestion = "";
let currentSteps = [];
let currentStepIndex = 0;
let autoplayTimer = null;

// ---------- Text-to-speech ----------
const synth = window.speechSynthesis;
const translateGroup = document.getElementById("translateGroup");
let cachedVoices = [];

function loadVoices() {
  cachedVoices = synth ? synth.getVoices() : [];
}
if (synth) {
  loadVoices();
  synth.onvoiceschanged = loadVoices;
}

function langCodeFor(mode) {
  if (mode === "hinglish") return "en-IN";
  if (mode === "hindi") return "hi-IN";
  return "en-US";
}

function currentTranslateLang() {
  const activeBtn = translateGroup?.querySelector(".translate-btn.active");
  return activeBtn ? activeBtn.dataset.lang : "english";
}

function pickBestVoice(langCode) {
  if (!cachedVoices.length) return null;
  const candidates = cachedVoices.filter((v) => v.lang === langCode);
  const pool = candidates.length
    ? candidates
    : cachedVoices.filter((v) => v.lang.startsWith(langCode.split("-")[0]));
  if (!pool.length) return null;
  const preferred = pool.find((v) => /natural|online|google/i.test(v.name));
  return preferred || pool[0];
}

function speak(text, { onEnd, langMode } = {}) {
  if (!synth) return;
  synth.cancel();
  const mode = langMode || currentTranslateLang();
  const lang = langCodeFor(mode);
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  const voice = pickBestVoice(lang);
  if (voice) utter.voice = voice;
  utter.rate = 0.88;
  utter.pitch = 0.92;
  utter.volume = 1;
  utter.onend = () => {
    if (onEnd) onEnd();
  };
  synth.speak(utter);
}

function stopSpeaking() {
  if (synth) synth.cancel();
  listenBtn?.classList.remove("speaking");
  if (listenText) listenText.textContent = "listen";
}

// ---------- Translate (EN / Hinglish / हिंदी) ----------
let originalExplanationText = "";
let translationCache = {};

function resetTranslationState(englishText) {
  originalExplanationText = englishText;
  translationCache = { english: englishText };
  if (translateGroup) {
    translateGroup.querySelectorAll(".translate-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === "english");
    });
  }
}

if (translateGroup) {
  translateGroup.addEventListener("click", async (e) => {
    const btn = e.target.closest(".translate-btn");
    if (!btn || !originalExplanationText) return;
    const target = btn.dataset.lang;

    translateGroup.querySelectorAll(".translate-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    stopSpeaking();

    if (translationCache[target]) {
      explanationText.textContent = translationCache[target];
      return;
    }

    btn.classList.add("loading");
    try {
      const res = await callApi("/api/translate", {
        text: originalExplanationText,
        target,
      });
      translationCache[target] = res.text;
      explanationText.textContent = res.text;
    } catch (err) {
      showError(err.message);
      btn.classList.remove("active");
    } finally {
      btn.classList.remove("loading");
    }
  });
}

if (listenBtn) {
  listenBtn.addEventListener("click", () => {
    if (!synth) {
      showError("Voice not supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (synth.speaking) {
      stopSpeaking();
      return;
    }
    listenBtn.classList.add("speaking");
    listenText.textContent = "stop";
    speak(explanationText.textContent, {
      onEnd: () => {
        listenBtn.classList.remove("speaking");
        listenText.textContent = "listen";
      },
    });
  });
}

function setStatus(live, label) {
  apiStatus.innerHTML = `<span class="dot ${live ? "dot-live" : "dot-idle"}"></span> ${label}`;
}

function showLoader(text) {
  loaderText.textContent = text;
  loader.classList.remove("hidden");
}
function hideLoader() {
  loader.classList.add("hidden");
}

function showError(msg) {
  errorBox.textContent = "! " + msg;
  errorBox.classList.remove("hidden");
}
function hideError() {
  errorBox.classList.add("hidden");
}

async function callApi(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

runBtn.addEventListener("click", runTutor);
questionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) runTutor();
});

// TURBO EXECUTION: Save to History + Check Browser Cache + Parallel Backend Execution
async function runTutor() {
  const question = questionInput.value.trim();
  if (!question) return;
  currentQuestion = question;

  // 1. Save Asked Question to History & Supabase immediately
  if (typeof addHistory === "function") {
    addHistory({
      type: "question",
      text: question,
      status: "Asked in Dashboard",
    });
  }

  hideError();
  stopSpeaking();
  dryrunPanel.classList.add("hidden");

  // 2. Check Instant Browser Cache first (0ms response if already asked)
  const cachedData = getFastCache("q:" + question);
  if (cachedData && cachedData.explanation && cachedData.approaches) {
    explanationText.textContent = cachedData.explanation;
    resetTranslationState(cachedData.explanation);
    explainPanel.classList.remove("hidden");
    renderApproaches(cachedData.approaches);
    approachesPanel.classList.remove("hidden");
    setStatus(false, "loaded instantly from cache");
    return;
  }

  explainPanel.classList.add("hidden");
  approachesPanel.classList.add("hidden");
  setStatus(true, "thinking...");
  showLoader("understanding & comparing approaches...");

  try {
    let savedExp = "";
    let savedApp = [];

    const explainPromise = callApi("/api/explain", {
      question,
      user_name: typeof getFirstName === "function" ? getFirstName() : "",
    }).then((explainRes) => {
      savedExp = explainRes.explanation;
      explanationText.textContent = explainRes.explanation;
      resetTranslationState(explainRes.explanation);
      // Also store explanation in localStorage so Compiler page can reuse it without re-fetching
      try {
        localStorage.setItem("dsa_last_explanation_" + question.trim().toLowerCase(), explainRes.explanation);
      } catch (e) {}
      explainPanel.classList.remove("hidden");
    });

    const approachesPromise = callApi("/api/approaches", { question }).then((approachRes) => {
      savedApp = approachRes.approaches;
      renderApproaches(approachRes.approaches);
      approachesPanel.classList.remove("hidden");
    });

    await Promise.all([explainPromise, approachesPromise]);

    setFastCache("q:" + question, { explanation: savedExp, approaches: savedApp });
    hideLoader();
    setStatus(false, "pick an approach to dry-run");
  } catch (err) {
    hideLoader();
    showError(err.message);
    setStatus(false, "error");
  }
}

function renderApproaches(approaches) {
  approachesList.innerHTML = "";
  approaches.forEach((a) => {
    const card = document.createElement("div");
    card.className = "approach-card" + (a.is_best ? " best" : "");
    card.innerHTML = `
      <div class="approach-top">
        <span class="approach-name">${a.name}</span>
        <span class="approach-badge ${a.is_best ? "badge-best" : "badge-normal"}">
          ${a.is_best ? "BEST FIT" : "ALTERNATIVE"}
        </span>
      </div>
      <div class="approach-complexity">time ${a.time_complexity} · space ${a.space_complexity}</div>
      <p class="approach-why">${a.why}</p>
    `;
    card.addEventListener("click", () => runDryRun(a.name));
    approachesList.appendChild(card);
  });
}

async function runDryRun(approachName) {
  hideError();
  stopAutoplay();
  stopSpeaking();

  // Save Dry Run activity to History & Supabase
  if (typeof addHistory === "function") {
    addHistory({
      type: "dryrun",
      text: currentQuestion,
      approach: approachName,
      status: "Visualized Dry Run",
    });
  }

  const lang = narrateLangSelect ? narrateLangSelect.value : "english";
  const cacheKey = `dr:${currentQuestion}|${approachName}|${lang}`;
  const cachedTrace = getFastCache(cacheKey);

  if (cachedTrace) {
    currentSteps = cachedTrace.steps || [];
    currentStepIndex = 0;
    dryrunApproachName.textContent = approachName;
    dryrunPanel.classList.remove("hidden");
    renderStep();
    dryrunPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    setStatus(false, "dry run ready (cached)");
    return;
  }

  setStatus(true, "building dry run...");
  showLoader("simulating step-by-step trace...");
  try {
    const trace = await callApi("/api/dry-run", {
      question: currentQuestion,
      approach: approachName,
      narrate_language: lang,
    });
    setFastCache(cacheKey, trace);
    currentSteps = trace.steps || [];
    currentStepIndex = 0;
    dryrunApproachName.textContent = approachName;
    dryrunPanel.classList.remove("hidden");
    renderStep();
    dryrunPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    setStatus(false, "dry run ready");
  } catch (err) {
    showError(err.message);
    setStatus(false, "error");
  } finally {
    hideLoader();
  }
}

function renderStep() {
  if (!currentSteps.length) return;
  const step = currentSteps[currentStepIndex];
  const arr = step.array || [];
  const maxVal = Math.max(...arr.map((v) => Math.abs(v)), 1);

  const oldBars = Array.from(arrayStage.children);
  const oldRects = new Map();
  oldBars.forEach((bar) => oldRects.set(bar.dataset.slot, bar.getBoundingClientRect()));

  arrayStage.innerHTML = "";
  arr.forEach((val, idx) => {
    const bar = document.createElement("div");
    const heightPct = 30 + (Math.abs(val) / maxVal) * 60;
    bar.className = "array-bar";
    bar.style.height = `${heightPct}%`;
    bar.textContent = val;
    bar.dataset.slot = `${val}`;
    if (step.highlight && step.highlight.includes(idx)) {
      bar.classList.add(step.swapped ? "swapped" : "highlight");
    }
    arrayStage.appendChild(bar);
  });

  const newBars = Array.from(arrayStage.children);
  newBars.forEach((bar) => {
    const oldRect = oldRects.get(bar.dataset.slot);
    if (!oldRect) return;
    const newRect = bar.getBoundingClientRect();
    const deltaX = oldRect.left - newRect.left;
    if (Math.abs(deltaX) > 2) {
      bar.style.transition = "none";
      bar.style.transform = `translateX(${deltaX}px)`;
      requestAnimationFrame(() => {
        bar.style.transition =
          "transform 0.35s ease, height 0.25s ease, background 0.25s ease, border-color 0.25s ease";
        bar.style.transform = "translateX(0)";
      });
    }
  });

  pointerRow.innerHTML = "";
  if (step.pointers) {
    Object.entries(step.pointers).forEach(([name, idx]) => {
      const tag = document.createElement("div");
      tag.className = "pointer-tag";
      tag.innerHTML = `<span class="name">${name}</span>=${idx}`;
      pointerRow.appendChild(tag);
    });
  }

  actionLine.textContent = "// " + (step.action || "");
  stepCounter.textContent = `${currentStepIndex + 1} / ${currentSteps.length}`;

  if (narrateToggle && narrateToggle.checked && step.action) {
    speak(step.action, { langMode: narrateLangSelect ? narrateLangSelect.value : "english" });
  }
}

prevStepBtn.addEventListener("click", () => {
  stopAutoplay();
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderStep();
  }
});

nextStepBtn.addEventListener("click", () => {
  stopAutoplay();
  if (currentStepIndex < currentSteps.length - 1) {
    currentStepIndex++;
    renderStep();
  }
});

playStepBtn.addEventListener("click", () => {
  if (autoplayTimer) {
    stopAutoplay();
    return;
  }
  playStepBtn.textContent = "⏸ pause";
  const speed = parseInt(speedSelect.value, 10) || 1100;
  autoplayTimer = setInterval(() => {
    if (currentStepIndex < currentSteps.length - 1) {
      currentStepIndex++;
      renderStep();
    } else {
      stopAutoplay();
    }
  }, speed);
});

speedSelect.addEventListener("change", () => {
  if (autoplayTimer) {
    stopAutoplay();
    playStepBtn.click();
  }
});

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    playStepBtn.textContent = "▶ auto";
  }
}

// Auto-run question if user clicked "▶ Visualize" from Practice or History page
window.addEventListener("DOMContentLoaded", () => {
  const prefill = localStorage.getItem("dsa_prefill_question");
  if (prefill && questionInput) {
    localStorage.removeItem("dsa_prefill_question");
    questionInput.value = prefill;
    runTutor();
  }
});