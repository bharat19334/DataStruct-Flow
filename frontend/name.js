// Asks "What should we call you?" when the user enters the dashboard from the landing page
// (or if no name is saved yet). The first name is stored and sent to the backend so the
// theory explanation can address the student as "<Name> ji".
const NAME_KEY = "dsa_user_name";
const ASK_FLAG = "dsa_ask_name";

function getFirstName() {
  try {
    const full = (localStorage.getItem(NAME_KEY) || "").trim();
    if (!full) return "";
    const first = full.split(/\s+/)[0];
    return first.charAt(0).toUpperCase() + first.slice(1);
  } catch (e) {
    return "";
  }
}

function renderGreeting() {
  const el = document.getElementById("greeting");
  const n = getFirstName();
  if (el) el.textContent = n ? `Welcome, ${n}` : "";
}

function openNameModal() {
  let saved = "";
  try { saved = localStorage.getItem(NAME_KEY) || ""; } catch (e) {}

  const overlay = document.createElement("div");
  overlay.className = "name-overlay";
  overlay.innerHTML = `
    <form class="name-modal" autocomplete="off">
      <div class="panel-label">WELCOME</div>
      <h2 class="name-title">What should we call you?</h2>
      <p class="name-sub">Please enter your first name. It will be used to personalise your explanations.</p>
      <input class="name-input" type="text" maxlength="40" placeholder="Your first name" required />
      <button type="submit" class="btn-run"><span class="btn-run-text">Continue</span></button>
    </form>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector(".name-input");
  input.value = saved;
  input.focus();
  input.select();

  overlay.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim().replace(/[^\p{L}\s.'-]/gu, "");
    if (!val) return;
    try { localStorage.setItem(NAME_KEY, val); } catch (err) {}
    overlay.remove();
    renderGreeting();
  });
}

(function initName() {
  let ask = false;
  try {
    ask = sessionStorage.getItem(ASK_FLAG) === "1" || !localStorage.getItem(NAME_KEY);
    sessionStorage.removeItem(ASK_FLAG);
  } catch (e) { ask = true; }
  renderGreeting();
  if (ask) openNameModal();
})();
