import type { AttributionFields } from "@/lib/lead-schema";

const STORAGE_KEY = "noctix-attribution";

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

/** First-touch capture: writes once per session, never overwrites an existing record. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const data: AttributionFields = {};

    for (const key of UTM_PARAMS) {
      const value = params.get(key);
      if (value) data[key] = value;
    }
    if (document.referrer) data.referrer = document.referrer;
    data.source_path = window.location.pathname;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable (private mode, quota, etc.) -- attribution is best-effort
  }
}

export function getAttribution(): AttributionFields {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
