"use client";

const SESSION_STORAGE_KEY = "career_os_session_key";
const REF_STORAGE_KEY = "career_os_ref_code";

function getOrCreateSessionKey(): string {
  if (typeof window === "undefined") return "";
  let key = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!key) {
    key = "s_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_STORAGE_KEY, key);
  }
  return key;
}

export function captureReferralCode(): string {
  if (typeof window === "undefined") return "";
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref") || urlParams.get("utm_source") || "";
    if (ref) {
      sessionStorage.setItem(REF_STORAGE_KEY, ref);
      return ref;
    }
    return sessionStorage.getItem(REF_STORAGE_KEY) || "";
  } catch (err) {
    return "";
  }
}

export function sendTelemetryEvent(
  eventType: string,
  path?: string,
  eventTarget: string = "",
  eventData: Record<string, any> = {}
) {
  if (typeof window === "undefined") return;

  try {
    const sessionKey = getOrCreateSessionKey();
    const refCode = captureReferralCode();
    const currentPath = path || window.location.pathname;
    const referrer = document.referrer || "";

    const payload = {
      session_key: sessionKey,
      event_type: eventType,
      path: currentPath,
      event_target: eventTarget,
      event_data: eventData,
      referrer: referrer,
      ref_code: refCode,
    };

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1";
    const endpoint = `${apiUrl}/analytics/event/`;

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    // Silent fail for non-blocking telemetry
  }
}
