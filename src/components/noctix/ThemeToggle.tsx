import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  /** Renders as a wider row with a label — used inside the mobile menu drawer. */
  variant?: "icon" | "row";
}

export function ThemeToggle({ className = "", variant = "icon" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={`flex items-center justify-between border-b border-foreground/5 py-3 text-foreground/80 transition-colors hover:text-[var(--lime)] ${className}`}
      >
        <span className="font-mono text-[12px] uppercase tracking-[0.25em]">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
        <span className="relative inline-flex h-5 w-5 items-center justify-center">
          <Icon isDark={isDark} />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex h-9 w-9 items-center justify-center border border-foreground/20 text-foreground/80 transition-colors hover:border-[var(--lime)] hover:text-[var(--lime)] ${className}`}
    >
      <Icon isDark={isDark} />
    </button>
  );
}

function Icon({ isDark }: { isDark: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {isDark ? (
        <motion.span
          key="moon"
          initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
          transition={{ duration: 0.18 }}
          className="absolute inline-flex"
        >
          <Moon className="h-4 w-4" />
        </motion.span>
      ) : (
        <motion.span
          key="sun"
          initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
          transition={{ duration: 0.18 }}
          className="absolute inline-flex"
        >
          <Sun className="h-4 w-4" />
        </motion.span>
      )}
    </AnimatePresence>
  );
}
