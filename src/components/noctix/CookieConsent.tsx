import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STORAGE_KEY = "noctix-cookie-consent";

type Choice = "accepted" | "declined";

function readChoice(): Choice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { choice?: Choice };
    return parsed.choice === "accepted" || parsed.choice === "declined" ? parsed.choice : null;
  } catch {
    return null;
  }
}

function writeChoice(choice: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, ts: Date.now(), v: 1 }));
  } catch {
    /* ignore */
  }
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (readChoice() === null) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = (choice: Choice) => {
    writeChoice(choice);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[60] md:right-auto md:max-w-md"
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
        >
          <div className="relative overflow-hidden border border-foreground/15 bg-background/85 p-5 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
            <button
              onClick={() => dismiss("declined")}
              aria-label="Dismiss"
              className="absolute right-3 top-3 text-foreground/40 hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
              Cookies
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/75">
              We use a few first-party cookies to remember your preferences (like theme) so the site
              loads the way you left it next time. No tracking, no ads.{" "}
              <Link
                to="/privacy"
                hash="cookies"
                className="text-foreground underline decoration-[var(--lime)]/50 underline-offset-4 hover:decoration-[var(--lime)]"
              >
                Cookie Policy
              </Link>
              .
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => dismiss("accepted")}
                className="inline-flex h-9 items-center bg-foreground px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-90"
              >
                Accept
              </button>
              <button
                onClick={() => dismiss("declined")}
                className="inline-flex h-9 items-center border border-foreground/20 px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground hover:border-foreground/40"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
