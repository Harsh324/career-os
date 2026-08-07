"use client";

import * as React from "react";

type Theme = "dark" | "light";

interface ThemeProviderContextType {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = React.createContext<ThemeProviderContextType>({
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "career-os-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
}) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey) as Theme;
      if (saved === "dark" || saved === "light") return saved;
    }
    return defaultTheme;
  });

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
    },
    [storageKey]
  );

  return (
    <ThemeProviderContext.Provider
      value={{ theme, resolvedTheme: theme, setTheme }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => React.useContext(ThemeProviderContext);
