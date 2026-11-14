const API_BASE = "https://datastruct-flow-backend.onrender.com";

const activeQuestion = localStorage.getItem("dsa_compiler_question");

const standardCompilerWrap = document.getElementById("standardCompilerWrap");
const leetcodeSplitWrap = document.getElementById("leetcodeSplitWrap");
const compilerHeaderMode = document.getElementById("compilerHeaderMode");

const CM_MODE_FOR = {
  Python: "python",
  "C++": "text/x-c++src",
  Java: "text/x-java",
  JavaScript: "javascript",
};

const BOILERPLATE_FOR = {
  Python: `print("Hello, DSA!")`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    cout << "Hello, DSA!" << endl;

    return 0;
}`,
  Java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Hello, DSA!");
    }
}`,
  JavaScript: `console.log("Hello, DSA!");`,
};

function switchLcSubTab(tab) {
  const tcContent = document.getElementById("lcTestcaseContent");
  const resContent = document.getElementById("lcResultContent");
  const btnTc = document.getElementById("btnTabTestcase");
  const btnRes = document.getElementById("btnTabResult");

  if (!tcContent || !resContent) return;

  if (tab === 'testcase') {
    tcContent.classList.remove("hidden");
    resContent.classList.add("hidden");
    if (btnTc) btnTc.classList.add("active");
    if (btnRes) btnRes.classList.remove("active");
  } else {
    tcContent.classList.add("hidden");
    resContent.classList.remove("hidden");
    if (btnRes) btnRes.classList.add("active");
    if (btnTc) btnTc.classList.remove("active");
  }
}

async function callApi(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

function recordCompilerActivity() {
  const today = new Date().toISOString().split('T')[0];
  let activityLog = JSON.parse(localStorage.getItem("dsa_activity_log") || "{}");
  activityLog[today] = (activityLog[today] || 0) + 1;
  localStorage.setItem("dsa_activity_log", JSON.stringify(activityLog));
}

if (activeQuestion) {
  // --- LEETCODE VIEW ---
  if (compilerHeaderMode) compilerHeaderMode.textContent = "problem solving workspace";
  if (standardCompilerWrap) standardCompilerWrap.classList.add("hidden");
  if (leetcodeSplitWrap) leetcodeSplitWrap.classList.remove("hidden");

  const lcProblemTitle = document.getElementById("lcProblemTitle");
  const lcProblemDescText = document.getElementById("lcProblemDescText");
  if (lcProblemTitle) lcProblemTitle.textContent = activeQuestion;
  if (lcProblemDescText) lcProblemDescText.textContent = "Loading problem breakdown...";

  callApi("/api/explain", { question: activeQuestion })
    .then((res) => {
      if (lcProblemDescText) {
        lcProblemDescText.innerHTML = `
          <p><strong>Problem Statement:</strong> ${activeQuestion}</p>
          <hr style="border: 0; border-top: 1px solid var(--panel-border); margin: 14px 0;">
          <p><strong>Tutor Breakdown:</strong></p>
          <p>${res.explanation}</p>
        `;
      }
    })
    .catch(() => {
      if (lcProblemDescText) lcProblemDescText.textContent = activeQuestion;
    });

  const codeEditorTextarea2 = document.getElementById("codeEditor2");
  const codeLangSelect2 = document.getElementById("codeLangSelect2");
  const runCodeBtn2 = document.getElementById("runCodeBtn2");
  const stdinInput2 = document.getElementById("stdinInput2");

  const editor2 = CodeMirror.fromTextArea(codeEditorTextarea2, {
    mode: CM_MODE_FOR[codeLangSelect2?.value] || "python",
    theme: "default",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    matchBrackets: true,
    autoCloseBrackets: true,
  });
  editor2.setSize("100%", "220px");
  editor2.setValue(BOILERPLATE_FOR[codeLangSelect2?.value || "Python"] || "");

  if (codeLangSelect2) {
    codeLangSelect2.addEventListener("change", () => {
      const lang = codeLangSelect2.value;
      editor2.setOption("mode", CM_MODE_FOR[lang] || "text/plain");
      editor2.setValue(BOILERPLATE_FOR[lang] || "");
    });
  }

  if (runCodeBtn2) {
    runCodeBtn2.addEventListener("click", async () => {
      const code = editor2.getValue();
      if (!code.trim()) return;

      runCodeBtn2.disabled = true;
      runCodeBtn2.textContent = "Running...";

      try {
        const result = await callApi("/api/run-code", {
          code,
          language: codeLangSelect2 ? codeLangSelect2.value : "Python",
          stdin: stdinInput2 ? stdinInput2.value : "",
        });
        recordCompilerActivity();
        renderOutput2(result);
        switchLcSubTab('result');
      } catch (err) {
        alert(err.message);
      } finally {
        runCodeBtn2.disabled = false;
        runCodeBtn2.textContent = "▶ Run";
      }
    });
  }

  function renderOutput2(result) {
    const codeOutput2 = document.getElementById("codeOutput2");
    const outputStatus2 = document.getElementById("outputStatus2");
    const outputMeta2 = document.getElementById("outputMeta2");
    const outputStdout2 = document.getElementById("outputStdout2");
    const outputStderr2 = document.getElementById("outputStderr2");

    if (codeOutput2) codeOutput2.classList.remove("hidden");
    const hasError = result.exit_code !== 0 || result.stderr || result.compile_output;
    if (outputStatus2) {
      outputStatus2.textContent = hasError ? "✗ ERROR" : "✓ ACCEPTED";
      outputStatus2.className = "output-status " + (hasError ? "fail" : "success");
    }
    if (outputMeta2) outputMeta2.textContent = `${result.language} ${result.version}`;
    if (outputStdout2) outputStdout2.textContent = result.stdout || "(no output)";

    const errorText = result.compile_output || result.stderr || "";
    if (outputStderr2) {
      if (errorText.trim()) {
        outputStderr2.textContent = errorText;
        outputStderr2.classList.remove("hidden");
      } else {
        outputStderr2.classList.add("hidden");
      }
    }
  }

} else {
  // --- STANDARD COMPILER VIEW ---
  if (compilerHeaderMode) compilerHeaderMode.textContent = "compiler workspace";
  if (leetcodeSplitWrap) leetcodeSplitWrap.classList.add("hidden");
  if (standardCompilerWrap) standardCompilerWrap.classList.remove("hidden");

  const codeEditorTextarea = document.getElementById("codeEditor");
  const codeLangSelect = document.getElementById("codeLangSelect");
  const runCodeBtn = document.getElementById("runCodeBtn");
  const stdinInput = document.getElementById("stdinInput");
  const codeOutput = document.getElementById("codeOutput");
  const outputStatus = document.getElementById("outputStatus");
  const outputMeta = document.getElementById("outputMeta");
  const outputStdout = document.getElementById("outputStdout");
  const outputStderr = document.getElementById("outputStderr");
  const errorBox = document.getElementById("errorBox");

  const editor = CodeMirror.fromTextArea(codeEditorTextarea, {
    mode: CM_MODE_FOR[codeLangSelect?.value] || "python",
    theme: "default",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    matchBrackets: true,
    autoCloseBrackets: true,
  });
  editor.setSize("100%", "280px");

  function isUnedited() {
    const current = editor.getValue().trim();
    return Object.values(BOILERPLATE_FOR).some((b) => b.trim() === current) || current === "";
  }

  if (codeLangSelect) {
    codeLangSelect.addEventListener("change", () => {
      const lang = codeLangSelect.value;
      editor.setOption("mode", CM_MODE_FOR[lang] || "text/plain");
      if (isUnedited()) {
        editor.setValue(BOILERPLATE_FOR[lang] || "");
      }
    });
  }

  if (runCodeBtn) {
    runCodeBtn.addEventListener("click", runCode);
  }

  async function runCode() {
    const code = editor.getValue();
    if (!code.trim()) return;

    if (errorBox) errorBox.classList.add("hidden");
    if (runCodeBtn) {
      runCodeBtn.disabled = true;
      const textSpan = runCodeBtn.querySelector(".btn-run-text");
      if (textSpan) textSpan.textContent = "running...";
    }

    try {
      const result = await callApi("/api/run-code", {
        code,
        language: codeLangSelect ? codeLangSelect.value : "Python",
        stdin: stdinInput ? stdinInput.value : "",
      });
      recordCompilerActivity();
      renderCodeOutput(result);
    } catch (err) {
      if (errorBox) {
        errorBox.textContent = "! " + err.message;
        errorBox.classList.remove("hidden");
      }
    } finally {
      if (runCodeBtn) {
        runCodeBtn.disabled = false;
        const textSpan = runCodeBtn.querySelector(".btn-run-text");
        if (textSpan) textSpan.textContent = "▶ run code";
      }
    }
  }

  function renderCodeOutput(result) {
    if (codeOutput) codeOutput.classList.remove("hidden");
    const hasError = result.exit_code !== 0 || result.stderr || result.compile_output;
    if (outputStatus) {
      outputStatus.textContent = hasError ? "✗ ERROR" : "✓ RUN SUCCESSFULLY";
      outputStatus.className = "output-status " + (hasError ? "fail" : "success");
    }
    if (outputMeta) outputMeta.textContent = `${result.language} ${result.version}`;
    if (outputStdout) outputStdout.textContent = result.stdout || "(no output)";

    const errorText = result.compile_output || result.stderr || "";
    if (outputStderr) {
      if (errorText.trim()) {
        outputStderr.textContent = errorText;
        outputStderr.classList.remove("hidden");
      } else {
        outputStderr.classList.add("hidden");
      }
    }

    if (codeOutput) {
      codeOutput.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}


// Manual Column Resizer for Standard Compiler
const splitter = document.getElementById("compilerSplitter");
const leftPanel = document.getElementById("compilerLeftPanel");
const rightPanel = document.getElementById("compilerRightPanel");
const container = document.getElementById("compilerResizerContainer");

if (splitter && leftPanel && rightPanel && container) {
  let isDragging = false;

  splitter.addEventListener("mousedown", (e) => {
    isDragging = true;
    splitter.classList.add("dragging");
    document.body.style.cursor = "col-resize";
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const containerRect = container.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const totalWidth = containerRect.width;

    // Calculate percentage for left panel (min 25%, max 75%)
    let leftPct = (offsetX / totalWidth) * 100;
    if (leftPct < 25) leftPct = 25;
    if (leftPct > 75) leftPct = 75;

    const rightPct = 100 - leftPct;
    container.style.gridTemplateColumns = `${leftPct}% 8px ${rightPct}%`;
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      splitter.classList.remove("dragging");
      document.body.style.cursor = "default";
    }
  });
}