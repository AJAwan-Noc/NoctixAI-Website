import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { readConsent, writeConsent } from "@/lib/consent";

const buttonClass =
  "inline-flex h-9 items-center justify-center border border-foreground/20 px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground";

function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center border transition-colors ${
        checked ? "border-[var(--lime)] bg-[var(--lime)]/20" : "border-foreground/25 bg-transparent"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span
        className={`block h-3 w-3 transition-transform ${
          checked ? "translate-x-4 bg-[var(--lime)]" : "translate-x-1 bg-foreground/50"
        }`}
      />
    </button>
  );
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (readConsent() === null) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const acceptAll = () => {
    writeConsent({ analytics: true, marketing: true });
    setOpen(false);
  };

  const rejectAll = () => {
    writeConsent({ analytics: false, marketing: false });
    setOpen(false);
  };

  const savePreferences = () => {
    writeConsent({ analytics, marketing });
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
              onClick={rejectAll}
              aria-label="Dismiss (rejects optional cookies)"
              className="absolute right-3 top-3 text-foreground/40 hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
              Cookies
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/75">
              We store your theme preference locally — that's strictly necessary and always on. With
              your permission, we'd also use analytics to understand which pages are useful, and
              advertising cookies to measure ad performance.{" "}
              <Link
                to="/privacy"
                hash="cookies"
                className="text-foreground underline decoration-[var(--lime)]/50 underline-offset-4 hover:decoration-[var(--lime)]"
              >
                Cookie Policy
              </Link>
              .
            </p>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3 border-t border-foreground/10 pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">
                          Strictly necessary
                        </div>
                        <p className="mt-1 text-xs text-foreground/55">
                          Theme preference and your consent choice. Required for the site to work.
                        </p>
                      </div>
                      <Toggle checked disabled label="Strictly necessary (always on)" />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">
                          Analytics
                        </div>
                        <p className="mt-1 text-xs text-foreground/55">
                          Helps us understand which pages are useful.
                        </p>
                      </div>
                      <Toggle checked={analytics} onChange={setAnalytics} label="Analytics" />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">
                          Marketing
                        </div>
                        <p className="mt-1 text-xs text-foreground/55">
                          Advertising measurement, e.g. conversion tracking.
                        </p>
                      </div>
                      <Toggle checked={marketing} onChange={setMarketing} label="Marketing" />
                    </div>
                    <button onClick={savePreferences} className={`${buttonClass} w-full`}>
                      Save preferences
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button onClick={acceptAll} className={buttonClass}>
                Accept all
              </button>
              <button onClick={rejectAll} className={buttonClass}>
                Reject all
              </button>
              <button onClick={() => setExpanded((v) => !v)} className={buttonClass}>
                Manage
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
