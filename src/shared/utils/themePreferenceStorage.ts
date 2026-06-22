export const THEME_STORAGE_KEY = "DC-theme";

export type ThemePreference = "light" | "dark";

export function getStoredThemePreference(): ThemePreference | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  return null;
}

export function setStoredThemePreference(theme: ThemePreference) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function isDarkTheme(theme: ThemePreference) {
  return theme === "dark";
}

export function resolveInitialThemePreference(): ThemePreference {
  const stored = getStoredThemePreference();
  if (stored) return stored;
  return document.body.classList.contains("dark") ? "dark" : "light";
}

export function applyStoredThemeClassToDocument() {
  const stored = getStoredThemePreference();
  document.body.classList.toggle("dark", stored === "dark");
}
