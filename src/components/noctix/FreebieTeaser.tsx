import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const DISMISS_KEY = "noctix_freebie_teaser_dismissed";
const CLAIMED_KEY = "noctix_freebie_claimed";
const EXCLUDED_PATHS = ["/automation-playbook", "/savings-calculator"];
const SCROLL_THRESHOLD = 0.4;
const TIME_THRESHOLD_MS = 25000;

export function FreebieTeaser() {
  const [visible, setVisible] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (EXCLUDED_PATHS.includes(pathname)) return;
    if (typeof window === "undefined") return;

    let alreadyHandled = false;
    try {
      alreadyHandled = Boolean(
        localStorage.getItem(DISMISS_KEY) || localStorage.getItem(CLAIMED_KEY),
      );
    } catch {
      alreadyHandled = false;
    }
    if (alreadyHandled) return;

    let shown = false;
    function show() {
      if (shown) return;
      shown = true;
      setVisible(true);
    }

    const timer = setTimeout(show, TIME_THRESHOLD_MS);

    function onScroll() {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && scrolled / max >= SCROLL_THRESHOLD) {
        show();
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore -- worst case it can show again next visit
    }
  }

  if (!visible || EXCLUDED_PATHS.includes(pathname)) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[60] max-w-xs border border-foreground/15 bg-background/95 p-4 shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-2 text-foreground/40 hover:text-foreground/70"
      >
        &times;
      </button>
      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--lime)]">
        Free guide
      </div>
      <p className="mt-2 text-sm font-medium">12 automations worth building, free.</p>
      <p className="mt-1 text-xs text-foreground/55">
        A real guide, not a newsletter signup. One email, no spam.
      </p>
      <Link
        to="/automation-playbook"
        className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--lime)] hover:underline"
      >
        Get the guide -&gt;
      </Link>
    </div>
  );
}
