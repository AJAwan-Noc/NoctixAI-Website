import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "noctix-theme";

/** Read the current theme as already applied to <html> by the no-flash script. */
function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  // Sync once on mount in case SSR HTML didn't have the class yet.
  useEffect(() => {
    setThemeState(readInitialTheme());
  }, []);

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", t === "dark");
    root.style.colorScheme = t;
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
    setThemeState(t);
  }, []);

  // Follow OS changes only when the user hasn't made an explicit choice yet.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored === "light" || stored === "dark") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      let s: string | null = null;
      try {
        s = localStorage.getItem(STORAGE_KEY);
      } catch {
        s = null;
      }
      if (s === "light" || s === "dark") return;
      const next: Theme = e.matches ? "dark" : "light";
      const root = document.documentElement;
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      setThemeState(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((t: Theme) => applyTheme(t), [applyTheme]);
  const toggleTheme = useCallback(
    () => applyTheme(theme === "dark" ? "light" : "dark"),
    [theme, applyTheme],
  );

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Safe SSR fallback — avoids throwing during tree-shaking checks.
    return {
      theme: "dark",
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return ctx;
}

/**
 * Inline script string that runs before paint to set the `dark` class
 * on <html>, preventing a light/dark flash on first load.
 */
export const noFlashScript = `
(function(){try{
  var s=localStorage.getItem('${STORAGE_KEY}');
  var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  var r=document.documentElement;
  if(t==='dark') r.classList.add('dark'); else r.classList.remove('dark');
  r.style.colorScheme=t;
}catch(e){document.documentElement.classList.add('dark');}})();
`;
