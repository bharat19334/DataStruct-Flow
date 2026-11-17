const HISTORY_KEY = "dsa_history_v1";
const HISTORY_API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://datastruct-flow-backend.onrender.com";

// Wake up Render backend immediately in background
fetch(`${HISTORY_API_BASE}/`).catch(() => {});

function getUserIdentifier() {
  const email = localStorage.getItem("dsa_user_email");
  if (email) return email.trim().toLowerCase();
  const name = localStorage.getItem("dsa_user_name");
  if (name) return name.trim().toLowerCase();
  let guestId = localStorage.getItem("dsa_guest_id");
  if (!guestId) {
    guestId = "guest_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("dsa_guest_id", guestId);
  }
  return guestId;
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 500)));
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

  // Non-blocking background sync to Supabase
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
    if (Array.isArray(data.history) && data.history.length > 0) {
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