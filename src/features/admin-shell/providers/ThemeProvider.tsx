import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  applyStoredThemeClassToDocument,
  isDarkTheme,
  resolveInitialThemePreference,
  setStoredThemePreference,
  type ThemePreference,
} from "@/features/admin-shell/utils/themePreferenceStorage";

type ThemeContextValue = {
  isDarkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

// Run before the first paint so stored dark mode does not flash light theme.
applyStoredThemeClassToDocument();

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemePreference>(resolveInitialThemePreference);
  const isDarkMode = isDarkTheme(theme);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    setStoredThemePreference(theme);
  }, [isDarkMode, theme]);

  const setDarkMode = useCallback((enabled: boolean) => {
    setTheme(enabled ? "dark" : "light");
  }, []);

  const value = useMemo(
    () => ({ isDarkMode, setDarkMode }),
    [isDarkMode, setDarkMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook is intentionally colocated with its provider and private context.
// eslint-disable-next-line react-refresh/only-export-components -- provider + hook pattern
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
