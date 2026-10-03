import type { EventType, TrackPayload } from "./events";

function id(storage: Storage, key: string) {
  try {
    let value = storage.getItem(key);
    if (!value) {
      value = crypto.randomUUID();
      storage.setItem(key, value);
    }
    return value;
  } catch {
    return "unknown";
  }
}

/** Fire-and-forget event. Never throws, never blocks the UI. */
export function track(type: EventType, extra: { game?: string } = {}) {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;

  const payload: TrackPayload = {
    type,
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    source: new URLSearchParams(window.location.search).get("utm_source") ?? undefined,
    vid: id(localStorage, "vybrid-vid"),
    sid: id(sessionStorage, "vybrid-sid"),
    ...extra,
  };
  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
      return;
    }
    void fetch("/api/track", { method: "POST", body, keepalive: true });
  } catch {
    /* analytics must never break the app */
  }
}
