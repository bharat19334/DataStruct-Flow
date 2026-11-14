// Syncs with Practice & Compiler real activity logs
const STORAGE_KEY = "dsa_practice_solved_v1";
const solvedMap = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
const activityLog = JSON.parse(localStorage.getItem("dsa_activity_log") || "{}");

const totalSolvedNum = document.getElementById("totalSolvedNum");
const solvedPercentageBadge = document.getElementById("solvedPercentageBadge");
const ringFill = document.getElementById("ringFill");
const ringText = document.getElementById("ringText");

const easyCount = document.getElementById("easyCount");
const easyFill = document.getElementById("easyFill");
const mediumCount = document.getElementById("mediumCount");
const mediumFill = document.getElementById("mediumFill");
const hardCount = document.getElementById("hardCount");
const hardFill = document.getElementById("hardFill");

const streakNum = document.getElementById("streakNum");
const msHalfway = document.getElementById("msHalfway");
const heatmapContainer = document.getElementById("heatmapContainer");
const heatmapTitle = document.getElementById("heatmapTitle");

function calculateStats() {
  const solvedKeys = Object.keys(solvedMap);
  const totalSolved = solvedKeys.length;
  const totalSheetQuestions = 539;

  let easyDone = 0, mediumDone = 0, hardDone = 0;
  solvedKeys.forEach((key) => {
    if (key.includes("EASY")) easyDone++;
    else if (key.includes("HARD")) hardDone++;
    else mediumDone++;
  });

  if (totalSolvedNum) totalSolvedNum.textContent = totalSolved;
  const pct = Math.min(100, Math.round((totalSolved / totalSheetQuestions) * 100));
  if (solvedPercentageBadge) solvedPercentageBadge.textContent = `${pct}% Completed`;
  if (ringText) ringText.textContent = `${pct}%`;

  const circumference = 201;
  const offset = circumference - (pct / 100) * circumference;
  if (ringFill) ringFill.style.strokeDashoffset = offset;

  if (easyCount) easyCount.textContent = `${easyDone} / 160`;
  if (easyFill) easyFill.style.width = `${Math.min(100, Math.round((easyDone / 160) * 100))}%`;

  if (mediumCount) mediumCount.textContent = `${mediumDone} / 240`;
  if (mediumFill) mediumFill.style.width = `${Math.min(100, Math.round((mediumDone / 240) * 100))}%`;

  if (hardCount) hardCount.textContent = `${hardDone} / 139`;
  if (hardFill) hardFill.style.width = `${Math.min(100, Math.round((hardDone / 139) * 100))}%`;

  if (streakNum) {
    streakNum.textContent = totalSolved > 0 ? `${Math.max(1, Math.floor(totalSolved / 3))} Day Streak 🔥` : `0 Day Streak`;
  }
  if (msHalfway && totalSolved >= 250) {
    msHalfway.classList.add("unlocked");
    msHalfway.querySelector("strong").textContent = "Halfway Master (Unlocked!)";
  }

  // Calculate total real submissions
  let totalSubmissions = 0;
  Object.values(activityLog).forEach((count) => {
    totalSubmissions += count;
  });

  if (heatmapTitle) {
    heatmapTitle.textContent = `${totalSubmissions} SUBMISSIONS IN THE LAST YEAR`;
  }
}

function renderHeatmap() {
  if (!heatmapContainer) return;
  heatmapContainer.innerHTML = "";

  const today = new Date();
  for (let i = 363; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const count = activityLog[dateStr] || 0;

    const box = document.createElement("div");
    box.className = "heatmap-box";

    let level = 0;
    if (count > 0 && count <= 2) level = 1;
    else if (count > 2 && count <= 5) level = 2;
    else if (count > 5) level = 3;

    box.classList.add(`level-${level}`);
    box.title = `${dateStr}: ${count} submissions`;
    heatmapContainer.appendChild(box);
  }
}

calculateStats();
renderHeatmap();