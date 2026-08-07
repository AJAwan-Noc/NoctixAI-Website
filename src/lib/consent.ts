const STORAGE_KEY = "noctix-consent-v2";
const VERSION = 2;

export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  ts: number;
  v: number;
};

function isConsentState(value: unknown): value is ConsentState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.analytics === "boolean" &&
    typeof v.marketing === "boolean" &&
    typeof v.ts === "number" &&
    v.v === VERSION
  );
}

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isConsentState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsent(next: Omit<ConsentState, "ts" | "v">): void {
  if (typeof window === "undefined") return;
  const state: ConsentState = { ...next, ts: Date.now(), v: VERSION };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((cb) => cb(state));
}

const listeners = new Set<(state: ConsentState) => void>();

function handleStorageEvent(e: StorageEvent) {
  if (e.key !== STORAGE_KEY || !e.newValue) return;
  try {
    const parsed = JSON.parse(e.newValue);
    if (isConsentState(parsed)) {
      listeners.forEach((cb) => cb(parsed));
    }
  } catch {
    /* ignore */
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", handleStorageEvent);
}

export function onConsentChange(cb: (state: ConsentState) => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function hasConsent(kind: "analytics" | "marketing"): boolean {
  return readConsent()?.[kind] ?? false;
}
