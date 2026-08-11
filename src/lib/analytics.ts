import { hasConsent, onConsentChange } from "@/lib/consent";

export type ConversionEvent =
  | "lead_submit"
  | "guide_request"
  | "calculator_complete"
  | "booking_confirmed"
  | "service_page_engaged";

export const GA_MEASUREMENT_ID = "G-6XLEB0YVWY";
export const META_PIXEL_ID = "2177112686555151";

const EVENT_VALUE: Partial<Record<ConversionEvent, number>> = {
  lead_submit: 875,
  booking_confirmed: 875,
};

type FbqFn = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: FbqFn;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    fbq: FbqFn;
    _fbq: FbqFn;
  }
}

// Inject into <head> so Consent Mode defaults (storage denied) exist before any tag can read dataLayer.
export const consentDefaultScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied', functionality_storage: 'granted',
  security_storage: 'granted', wait_for_update: 500
});
`;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

/** Client-side UUID for the lead_submit browser/server event dedup pair. */
export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let gtagScriptRequested = false;

function loadGtagScript() {
  if (gtagScriptRequested || typeof document === "undefined") return;
  gtagScriptRequested = true;

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  console.log("[Analytics] loadGtagScript: appending script, src =", script.src);
  script.onload = () => console.log("[Analytics] gtag script onload fired:", script.src);
  script.onerror = (err) => console.log("[Analytics] gtag script onerror fired:", script.src, err);
  document.head.appendChild(script);
}

let fbqScriptRequested = false;

function loadFbqScript() {
  if (fbqScriptRequested || typeof window === "undefined" || typeof document === "undefined") {
    return;
  }
  fbqScriptRequested = true;

  if (!window.fbq) {
    // Meta's standard pixel bootstrap: queues calls until fbevents.js sets callMethod.
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq.queue.push(args);
      }
    } as FbqFn;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", META_PIXEL_ID);
}

export function sendPageView(pathname: string) {
  if (!hasConsent("analytics")) return;
  loadGtagScript();
  const params = {
    page_path: pathname,
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
    page_title: typeof document !== "undefined" ? document.title : undefined,
  };
  console.log("[Analytics] sendPageView: firing gtag('event', 'page_view', ...) with", params);
  gtag("event", "page_view", params);
}

// Loads gated scripts if consent already covers them, and on later grants so nothing needs a reload.
export function initAnalytics(onGrant: (kind: "analytics" | "marketing") => void): () => void {
  if (hasConsent("analytics")) {
    console.log("[Analytics] initAnalytics: hasConsent('analytics') branch entered");
    gtag("consent", "update", { analytics_storage: "granted" });
    console.log("[Analytics] initAnalytics: gtag('consent','update',...) ran");
    loadGtagScript();
    console.log("[Analytics] initAnalytics: loadGtagScript() invoked");
    onGrant("analytics");
  }
  if (hasConsent("marketing")) {
    loadFbqScript();
    onGrant("marketing");
  }

  return onConsentChange((state) => {
    if (state.analytics) {
      gtag("consent", "update", { analytics_storage: "granted" });
      loadGtagScript();
      onGrant("analytics");
    }
    if (state.marketing) {
      gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
      loadFbqScript();
      onGrant("marketing");
    }
  });
}

// For lead_submit, pass the same `eventId` sent to the backend as meta_event_id so Pixel/CAPI dedupe.
export function track(event: ConversionEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  if (hasConsent("analytics")) {
    loadGtagScript();
    const value = EVENT_VALUE[event];
    gtag("event", event, {
      ...(value !== undefined ? { value, currency: "USD" } : {}),
      ...params,
    });
  }

  if (event === "lead_submit" && hasConsent("marketing")) {
    loadFbqScript();
    const { eventId, ...rest } = params;
    if (typeof eventId === "string") {
      window.fbq(
        "track",
        "Lead",
        { value: EVENT_VALUE.lead_submit, currency: "USD", ...rest },
        { eventID: eventId },
      );
    }
  }
}
