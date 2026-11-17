const HISTORY_API_BASE = "https://datastruct-flow-backend.onrender.com";
const PERMANENT_HISTORY_KEY = "dsa_history_master_v1";
const DEVICE_UID_KEY = "dsa_device_uid_v1";

// Wake up Render backend in background
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

// Har browser/device ka ek fixed secret identifier jo kabhi nahi badlega
function getUserIdentifier() {
  let uid = localStorage.getItem(DEVICE_UID_KEY);
  if (!uid) {
    uid = "usr_" + generateSecretToken();
    localStorage.setItem(DEVICE_UID_KEY, uid);
  }
  return uid;
}

function getLocalHistoryKey() {
  return PERMANENT_HISTORY_KEY;
}

function getHistory() {
  try {
    const current = JSON.parse(localStorage.getItem(PERMANENT_HISTORY_KEY) || "[]");
    // Purani keys mein agar koi data pada ho toh use bhi utha kar merge kar lein
    const oldV1 = JSON.parse(localStorage.getItem("dsa_history_v1") || "[]");
    if (oldV1.length > 0 && current.length === 0) {
      localStorage.setItem(PERMANENT_HISTORY_KEY, JSON.stringify(oldV1));
      return oldV1;
    }
    return current;
  } catch (e) {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(PERMANENT_HISTORY_KEY, JSON.stringify(list.slice(0, 500)));
  } catch (e) {}
}

// entry: { type: "question" | "dryrun" | "solved", text, approach?, language?, code?, status? }
function addHistory(entry) {
  if (!entry || !entry.text) return;

  const list = getHistory();
  const last = list[0];
  if (
    last &&
    last.type === entry.type &&
    last.text === entry.text &&
    last.approach === entry.approach &&
    last.code === entry.code &&
    Date.now() - last.time < 2500
  ) {
    return;
  }

  const newItem = {
    id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
    time: Date.now(),
    type: entry.type || "question",
    text: entry.text.trim(),
    approach: entry.approach || "",
    language: entry.language || "",
    code: entry.code || "",
    status: entry.status || "Completed",
  };

  // 1. Pehle turant browser ke localStorage mein save karein (Guaranteed Instant Display)
  list.unshift(newItem);
  saveHistory(list);

  // 2. Background mein Supabase par sync karein
  fetch(`${HISTORY_API_BASE}/api/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_identifier: getUserIdentifier(),
      entry_type: newItem.type,
      question_text: newItem.text,
      approach: newItem.approach,
      language: newItem.language,
      code: newItem.code,
      status: newItem.status,
    }),
  }).catch(() => {});
}

// Local data aur Supabase data ko smartly merge karega (Local data ko kabhi delete nahi karega!)
async function fetchSupabaseHistory() {
  const localItems = getHistory();
  try {
    const uid = encodeURIComponent(getUserIdentifier());
    const res = await fetch(`${HISTORY_API_BASE}/api/history?user_identifier=${uid}`);
    if (!res.ok) return localItems;

    const data = await res.json();
    if (Array.isArray(data.history) && data.history.length > 0) {
      const cloudMapped = data.history.map((row) => ({
        id: row.id,
        time: new Date(row.created_at).getTime(),
        type: row.entry_type || "question",
        text: row.question_text || "",
        approach: row.approach || "",
        language: row.language || "",
        code: row.code || "",
        status: row.status || "",
        fromCloud: true,
      }));

      // Merge cloud items with local items without losing any local unsynced items
      const combined = [...localItems];
      cloudMapped.forEach((cItem) => {
        const alreadyExists = combined.some(
          (lItem) =>
            lItem.type === cItem.type &&
            lItem.text === cItem.text &&
            Math.abs((lItem.time || 0) - (cItem.time || 0)) < 60000
        );
        if (!alreadyExists) {
          combined.push(cItem);
        }
      });

      combined.sort((a, b) => (b.time || 0) - (a.time || 0));
      saveHistory(combined);
      return combined;
    }
  } catch (e) {}

  return localItems;
}