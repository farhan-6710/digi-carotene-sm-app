import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "digi-carotene-theme";
const THEME_CHANGE_EVENT = "digi-carotene-theme-change";

export type Theme = "light" | "dark";

function readTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem(STORAGE_KEY, theme);
}

function subscribe(onStoreChange: () => void) {
  const notify = () => onStoreChange();

  window.addEventListener(THEME_CHANGE_EVENT, notify);
  window.addEventListener("storage", notify);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}

/** Call once before React mounts to avoid a flash of the wrong theme. */
export function initTheme() {
  applyTheme(readTheme());
}

function setTheme(theme: Theme) {
  applyTheme(theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light");

  const setDarkMode = useCallback((enabled: boolean) => {
    setTheme(enabled ? "dark" : "light");
  }, []);

  return {
    isDarkMode: theme === "dark",
    setDarkMode,
  };
}
