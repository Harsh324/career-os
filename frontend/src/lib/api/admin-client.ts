import { getBaseURL } from "./client";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface DashboardStats {
  system_status: "operational" | "degraded" | "offline";
  user: AdminUser;
  counts: {
    experiences: number;
    projects: number;
    featured_projects: number;
    skills: number;
    certifications: number;
    education: number;
    timeline_events: number;
  };
  site_settings: {
    name: string;
    title: string;
    location: string;
    updated_at: string | null;
  };
}

let inMemoryToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

export const setAdminToken = (token: string | null) => {
  inMemoryToken = token;
};

export const getAdminToken = () => inMemoryToken;

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/**
 * Silent refresh helper communicating with Next.js /api/auth/refresh handler
 */
export async function refreshAdminSession(): Promise<{ access: string; user: AdminUser } | null> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      setAdminToken(null);
      return null;
    }

    const data = await res.json();
    if (data.access) {
      setAdminToken(data.access);
      return data;
    }
    return null;
  } catch {
    setAdminToken(null);
    return null;
  }
}

/**
 * Authenticated API client for administrative /dashboard requests.
 * Attaches in-memory JWT access token and automatically handles 401 silent token refresh.
 */
export async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const isDirectApi = endpoint.startsWith("http://") || endpoint.startsWith("https://");
  const url = isDirectApi ? endpoint : `${getBaseURL()}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (inMemoryToken) {
    headers.set("Authorization", `Bearer ${inMemoryToken}`);
  }

  let res = await fetch(url, {
    ...options,
    headers,
  });

  // If 401 Unauthorized, attempt silent refresh and retry once
  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshResult = await refreshAdminSession();
      isRefreshing = false;

      if (refreshResult && refreshResult.access) {
        onRefreshed(refreshResult.access);
      } else {
        onRefreshed(null);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("career-os:unauthorized"));
        }
        throw new Error("Authentication expired. Please log in again.");
      }
    } else {
      // Wait for concurrent refresh to complete
      await new Promise<string | null>((resolve) => {
        subscribeTokenRefresh((newToken) => resolve(newToken));
      });
    }

    // Retry original request with fresh access token
    if (inMemoryToken) {
      headers.set("Authorization", `Bearer ${inMemoryToken}`);
      res = await fetch(url, {
        ...options,
        headers,
      });
    }
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    let errorDetail = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.detail) errorDetail = parsed.detail;
      else if (parsed.error) errorDetail = parsed.error;
    } catch {
      if (errorText) errorDetail = errorText;
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

/**
 * Fetch aggregated dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return adminFetch<DashboardStats>("/auth/stats/");
}

/**
 * Fetch currently authenticated admin user
 */
export async function getAdminProfile(): Promise<AdminUser> {
  return adminFetch<AdminUser>("/auth/me/");
}
