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
  isDarkTheme,
  resolveInitialThemePreference,
  setStoredThemePreference,
  type ThemePreference,
} from "@/features/admin-shell/utils/themePreferenceStorage";

type ThemePreferenceContextValue = {
  isDarkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
};

const ThemePreferenceContext =
  createContext<ThemePreferenceContextValue | null>(null);

type ThemePreferenceProviderProps = {
  children: ReactNode;
};

export function ThemePreferenceProvider({
  children,
}: ThemePreferenceProviderProps) {
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
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

// Hook is intentionally colocated with its provider and private context.
// eslint-disable-next-line react-refresh/only-export-components -- provider + hook pattern
export function useThemePreference() {
  const context = useContext(ThemePreferenceContext);
  if (!context) {
    throw new Error(
      "useThemePreference must be used within ThemePreferenceProvider",
    );
  }
  return context;
}
