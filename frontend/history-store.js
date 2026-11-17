const HISTORY_API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://datastruct-flow-backend.onrender.com";

// Wake up Render backend immediately in background
fetch(`${HISTORY_API_BASE}/`).catch(() => {});

function generateSecretToken() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}

// Har user + device ka apna unique secret identifier banata hai
function getUserIdentifier() {
  const rawName = (localStorage.getItem("dsa_user_name") || "coder")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const cleanName = rawName || "coder";

  // Har naam ke liye uske browser mein ek private secret key store hogi
  const tokenKey = `dsa_secret_token_${cleanName}`;
  let secret = localStorage.getItem(tokenKey);
  if (!secret) {
    secret = generateSecretToken();
    localStorage.setItem(tokenKey, secret);
  }

  return `${cleanName}_${secret}`;
}

// LocalStorage key bhi har unique user identifier ke liye alag hogi
function getLocalHistoryKey() {
  return `dsa_history_${getUserIdentifier()}`;
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(getLocalHistoryKey()) || "[]");
  } catch (e) {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(getLocalHistoryKey(), JSON.stringify(list.slice(0, 500)));
  } catch (e) {}
}

// entry: { type: "question" | "dryrun" | "solved", text, approach?, language?, code?, status? }
function addHistory(entry) {
  const list = getHistory();
  const last = list[0];
  if (
    last &&
    last.type === entry.type &&
    last.text === entry.text &&
    last.approach === entry.approach &&
    last.code === entry.code &&
    Date.now() - last.time < 3000
  ) {
    return;
  }

  const newItem = {
    id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
    time: Date.now(),
    ...entry,
  };

  list.unshift(newItem);
  saveHistory(list);

  // Non-blocking background sync to Supabase with unique secret user_identifier
  fetch(`${HISTORY_API_BASE}/api/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_identifier: getUserIdentifier(),
      entry_type: entry.type || "question",
      question_text: entry.text || "Untitled DSA Activity",
      approach: entry.approach || "",
      language: entry.language || "",
      code: entry.code || "",
      status: entry.status || "Completed",
    }),
  }).catch(() => {});
}

async function fetchSupabaseHistory() {
  try {
    const uid = encodeURIComponent(getUserIdentifier());
    const res = await fetch(`${HISTORY_API_BASE}/api/history?user_identifier=${uid}`);
    if (!res.ok) return getHistory();
    const data = await res.json();
    if (Array.isArray(data.history)) {
      const cloudMapped = data.history.map((row) => ({
        id: row.id,
        time: new Date(row.created_at).getTime(),
        type: row.entry_type,
        text: row.question_text,
        approach: row.approach,
        language: row.language,
        code: row.code,
        status: row.status,
        fromCloud: true,
      }));
      saveHistory(cloudMapped);
      return cloudMapped;
    }
  } catch (e) {}
  return getHistory();
}