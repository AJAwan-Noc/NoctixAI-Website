import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { initAnalytics, sendPageView, track } from "@/lib/analytics";

const SERVICE_PAGE_PATTERN = /^\/services\/[^/]+/;
const ENGAGED_SCROLL_FRACTION = 0.5;
const ENGAGED_DWELL_MS = 30000;

function useServicePageEngagement(pathname: string) {
  useEffect(() => {
    if (!SERVICE_PAGE_PATTERN.test(pathname) || typeof window === "undefined") return;

    let scrolled = false;
    let dwelled = false;
    let fired = false;

    function maybeFire() {
      if (fired || !scrolled || !dwelled) return;
      fired = true;
      track("service_page_engaged", { page_path: pathname });
    }

    const timer = setTimeout(() => {
      dwelled = true;
      maybeFire();
    }, ENGAGED_DWELL_MS);

    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0 || window.scrollY / max >= ENGAGED_SCROLL_FRACTION) {
        scrolled = true;
        maybeFire();
        window.removeEventListener("scroll", onScroll);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);
}

export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  // Covers the page the user is already on when consent is granted mid-session.
  useEffect(() => {
    return initAnalytics((kind) => {
      if (kind === "analytics") sendPageView(pathnameRef.current);
    });
  }, []);

  // Skip the first render -- initAnalytics() above already covers the initial page view.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sendPageView(pathname);
  }, [pathname]);

  useServicePageEngagement(pathname);

  return null;
}
