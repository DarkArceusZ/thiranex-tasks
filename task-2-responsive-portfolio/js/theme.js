(() => {
  const storageKey = "dark-portfolio-theme";
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");

  if (!toggle) {
    return;
  }

  let savedTheme;

  try {
    savedTheme = window.localStorage.getItem(storageKey);
  } catch {
    savedTheme = null;
  }

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    const label = toggle.querySelector("[data-theme-label]");

    root.dataset.theme = isDark ? "dark" : "light";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");

    if (label) {
      label.textContent = isDark ? "Light mode" : "Dark mode";
    }
  };

  applyTheme(savedTheme === "dark" ? "dark" : "light");

  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch {
      // The theme still changes for this visit if storage is unavailable.
    }
  });
})();
