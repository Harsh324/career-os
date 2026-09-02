import { getBaseURL } from "./client";
import type {
  Experience,
  Company,
  Technology,
  Project,
  SiteSettings,
  Skill,
  Certification,
  Education,
  TimelineEvent,
  MediaAsset,
} from "./types";

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
    media_assets?: number;
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

  // Handle 204 No Content
  if (res.status === 204) {
    return {} as T;
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

/**
 * Fetch full profile settings for admin control plane (including target_roles)
 */
export async function getProfileSettings(): Promise<SiteSettings> {
  return adminFetch<SiteSettings>("/settings/");
}

/**
 * Partial update canonical profile settings
 */
export async function updateProfileSettings(
  data: Partial<SiteSettings>
): Promise<SiteSettings> {
  return adminFetch<SiteSettings>("/settings/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Fetch all experiences for admin control plane (including drafts)
 */
export async function getAdminExperiences(): Promise<Experience[]> {
  const data = await adminFetch<any>("/experience/");
  return Array.isArray(data) ? data : data.results || [];
}

/**
 * Fetch single experience by slug for admin editor
 */
export async function getAdminExperienceBySlug(slug: string): Promise<Experience> {
  return adminFetch<Experience>(`/experience/${slug}/`);
}

/**
 * Create a new canonical experience
 */
export async function createAdminExperience(data: Partial<Experience>): Promise<Experience> {
  return adminFetch<Experience>("/experience/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing experience
 */
export async function updateAdminExperience(
  slug: string,
  data: Partial<Experience>
): Promise<Experience> {
  return adminFetch<Experience>(`/experience/${slug}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete an experience
 */
export async function deleteAdminExperience(slug: string): Promise<void> {
  return adminFetch<void>(`/experience/${slug}/`, {
    method: "DELETE",
  });
}

/**
 * Fetch all companies for selector dropdown
 */
export async function getAdminCompanies(): Promise<Company[]> {
  const data = await adminFetch<any>("/companies/");
  return Array.isArray(data) ? data : data.results || [];
}

/**
 * Create a new company inline
 */
export async function createAdminCompany(data: Partial<Company>): Promise<Company> {
  return adminFetch<Company>("/companies/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Fetch all technologies for tagging
 */
export async function getAdminTechnologies(): Promise<Technology[]> {
  const data = await adminFetch<any>("/technologies/");
  return Array.isArray(data) ? data : data.results || [];
}

/**
 * Fetch all projects for admin list
 */
export async function getAdminProjects(): Promise<Project[]> {
  const data = await adminFetch<any>("/projects/");
  return Array.isArray(data) ? data : data.results || [];
}

/**
 * Fetch single project by slug for admin editor
 */
export async function getAdminProjectBySlug(slug: string): Promise<Project> {
  return adminFetch<Project>(`/projects/${slug}/`);
}

/**
 * Create a new project record
 */
export async function createAdminProject(data: Partial<Project>): Promise<Project> {
  return adminFetch<Project>("/projects/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing project
 */
export async function updateAdminProject(
  slug: string,
  data: Partial<Project>
): Promise<Project> {
  return adminFetch<Project>(`/projects/${slug}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a project record
 */
export async function deleteAdminProject(slug: string): Promise<void> {
  return adminFetch<void>(`/projects/${slug}/`, {
    method: "DELETE",
  });
}

/**
 * Fetch all skills for admin list
 */
export async function getAdminSkills(): Promise<Skill[]> {
  const data = await adminFetch<any>("/skills/");
  return Array.isArray(data) ? data : data.results || [];
}

/**
 * Fetch single skill by slug for admin editor
 */
export async function getAdminSkillBySlug(slug: string): Promise<Skill> {
  return adminFetch<Skill>(`/skills/${slug}/`);
}

/**
 * Create a new skill record
 */
export async function createAdminSkill(data: Partial<Skill>): Promise<Skill> {
  return adminFetch<Skill>("/skills/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing skill
 */
export async function updateAdminSkill(
  slug: string,
  data: Partial<Skill>
): Promise<Skill> {
  return adminFetch<Skill>(`/skills/${slug}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a skill record
 */
export async function deleteAdminSkill(slug: string): Promise<void> {
  return adminFetch<void>(`/skills/${slug}/`, {
    method: "DELETE",
  });
}

/**
 * Fetch all certifications for admin list
 */
export async function getAdminCertifications(): Promise<Certification[]> {
  const data = await adminFetch<any>("/certifications/");
  return Array.isArray(data) ? data : data.results || [];
}

/**
 * Fetch single certification by slug for admin editor
 */
export async function getAdminCertificationBySlug(slug: string): Promise<Certification> {
  return adminFetch<Certification>(`/certifications/${slug}/`);
}

/**
 * Create a new certification record
 */
export async function createAdminCertification(
  data: Partial<Certification>
): Promise<Certification> {
  return adminFetch<Certification>("/certifications/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing certification
 */
export async function updateAdminCertification(
  slug: string,
  data: Partial<Certification>
): Promise<Certification> {
  return adminFetch<Certification>(`/certifications/${slug}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a certification record
 */
export async function deleteAdminCertification(slug: string): Promise<void> {
  return adminFetch<void>(`/certifications/${slug}/`, {
    method: "DELETE",
  });
}

/**
 * Fetch all education records for admin list
 */
export async function getAdminEducation(): Promise<Education[]> {
  const data = await adminFetch<any>("/education/");
  return Array.isArray(data) ? data : data.results || [];
}

/**
 * Fetch single education record by slug for admin editor
 */
export async function getAdminEducationBySlug(slug: string): Promise<Education> {
  return adminFetch<Education>(`/education/${slug}/`);
}

/**
 * Create a new education record
 */
export async function createAdminEducation(data: Partial<Education>): Promise<Education> {
  return adminFetch<Education>("/education/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing education record
 */
export async function updateAdminEducation(
  slug: string,
  data: Partial<Education>
): Promise<Education> {
  return adminFetch<Education>(`/education/${slug}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete an education record
 */
export async function deleteAdminEducation(slug: string): Promise<void> {
  return adminFetch<void>(`/education/${slug}/`, {
    method: "DELETE",
  });
}

/**
 * Fetch all timeline events for admin list
 */
export async function getAdminTimelineEvents(): Promise<TimelineEvent[]> {
  const data = await adminFetch<any>("/timeline/");
  return Array.isArray(data) ? data : data.results || [];
}

/**
 * Fetch single timeline event by slug for admin editor
 */
export async function getAdminTimelineEventBySlug(slug: string): Promise<TimelineEvent> {
  return adminFetch<TimelineEvent>(`/timeline/${slug}/`);
}

/**
 * Create a new timeline event
 */
export async function createAdminTimelineEvent(
  data: Partial<TimelineEvent>
): Promise<TimelineEvent> {
  return adminFetch<TimelineEvent>("/timeline/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing timeline event
 */
export async function updateAdminTimelineEvent(
  slug: string,
  data: Partial<TimelineEvent>
): Promise<TimelineEvent> {
  return adminFetch<TimelineEvent>(`/timeline/${slug}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a timeline event
 */
export async function deleteAdminTimelineEvent(slug: string): Promise<void> {
  return adminFetch<void>(`/timeline/${slug}/`, {
    method: "DELETE",
  });
}

/**
 * Fetch all media assets for admin list
 */
export async function getAdminMediaAssets(params?: {
  asset_type?: string;
  is_published?: boolean;
  is_featured?: boolean;
  search?: string;
}): Promise<MediaAsset[]> {
  const query = new URLSearchParams();
  if (params?.asset_type && params.asset_type !== "all") query.set("asset_type", params.asset_type);
  if (params?.is_published !== undefined) query.set("is_published", String(params.is_published));
  if (params?.is_featured !== undefined) query.set("is_featured", String(params.is_featured));
  if (params?.search) query.set("search", params.search);

  const qs = query.toString() ? `?${query.toString()}` : "";
  const data = await adminFetch<any>(`/media/${qs}`);
  return Array.isArray(data) ? data : data.results || [];
}

/**
 * Fetch single media asset by slug for admin editor
 */
export async function getAdminMediaAssetBySlug(slug: string): Promise<MediaAsset> {
  return adminFetch<MediaAsset>(`/media/${slug}/`);
}

/**
 * Create a new media asset
 */
export async function createAdminMediaAsset(
  data: FormData | Partial<MediaAsset>
): Promise<MediaAsset> {
  const isFormData = data instanceof FormData;
  return adminFetch<MediaAsset>("/media/", {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data),
  });
}

/**
 * Update an existing media asset
 */
export async function updateAdminMediaAsset(
  slug: string,
  data: FormData | Partial<MediaAsset>
): Promise<MediaAsset> {
  const isFormData = data instanceof FormData;
  return adminFetch<MediaAsset>(`/media/${slug}/`, {
    method: "PATCH",
    body: isFormData ? data : JSON.stringify(data),
  });
}

/**
 * Delete a media asset
 */
export async function deleteAdminMediaAsset(slug: string): Promise<void> {
  return adminFetch<void>(`/media/${slug}/`, {
    method: "DELETE",
  });
}


