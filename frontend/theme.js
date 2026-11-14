// Theme Manager: Default Light, toggles to Dark on click and saves preference
(function() {
  const savedTheme = localStorage.getItem("dsa_theme");
  // Default is light unless explicitly set to dark
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("dsa_theme", newTheme);
  
  // Update toggle button icon/text if present
  updateThemeToggleUI();
}

function updateThemeToggleUI() {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  btn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

document.addEventListener("DOMContentLoaded", () => {
  updateThemeToggleUI();
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.addEventListener("click", toggleTheme);
  }
});