import { cache } from "react";
import { apiClient, getBaseURL } from "./client";
import type {
  Certification,
  Education,
  Experience,
  Project,
  SEOMetadata,
  SiteSettings,
  Skill,
  Technology,
  TimelineEvent,
  MediaAsset,
} from "./types";
import { DEFAULT_SITE_SETTINGS } from "../constants/site";

interface DRFListResponse<T> {
  count?: number;
  results?: T[];
}

function extractResults<T>(data: DRFListResponse<T> | T[]): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export const fetchSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return DEFAULT_SITE_SETTINGS as SiteSettings;
  }
  try {
    const res = await apiClient.get<SiteSettings>("/settings/");
    return res.data || (DEFAULT_SITE_SETTINGS as SiteSettings);
  } catch (err) {
    return DEFAULT_SITE_SETTINGS as SiteSettings;
  }
});

export const fetchExperiences = cache(async (): Promise<Experience[]> => {
  try {
    const res = await apiClient.get<DRFListResponse<Experience> | Experience[]>("/experience/");
    return extractResults(res.data);
  } catch (err) {
    return [];
  }
});

export const fetchExperienceBySlug = cache(async (slug: string): Promise<Experience | null> => {
  try {
    const res = await apiClient.get<Experience>(`/experience/${slug}/`);
    return res.data;
  } catch (err) {
    return null;
  }
});

export const fetchProjects = cache(async (featured?: boolean): Promise<Project[]> => {
  try {
    const params: Record<string, string> = featured !== undefined ? { featured: String(featured) } : {};
    const res = await apiClient.get<DRFListResponse<Project> | Project[]>("/projects/", { params });
    return extractResults(res.data);
  } catch (err) {
    return [];
  }
});

export const fetchProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  try {
    const res = await apiClient.get<Project>(`/projects/${slug}/`);
    return res.data;
  } catch (err) {
    return null;
  }
});

export const fetchSkills = cache(async (): Promise<Skill[]> => {
  try {
    const res = await apiClient.get<DRFListResponse<Skill> | Skill[]>("/skills/");
    return extractResults(res.data);
  } catch (err) {
    return [];
  }
});

export const fetchTechnologies = cache(async (): Promise<Technology[]> => {
  try {
    const res = await apiClient.get<DRFListResponse<Technology> | Technology[]>("/technologies/");
    return extractResults(res.data);
  } catch (err) {
    return [];
  }
});

export const fetchTimeline = cache(async (): Promise<TimelineEvent[]> => {
  try {
    const res = await apiClient.get<DRFListResponse<TimelineEvent> | TimelineEvent[]>("/timeline/");
    return extractResults(res.data);
  } catch (err) {
    return [];
  }
});

export const fetchEducation = cache(async (): Promise<Education[]> => {
  try {
    const res = await apiClient.get<DRFListResponse<Education> | Education[]>("/education/");
    return extractResults(res.data);
  } catch (err) {
    return [];
  }
});

export const fetchCertifications = cache(async (): Promise<Certification[]> => {
  try {
    const res = await apiClient.get<DRFListResponse<Certification> | Certification[]>("/certifications/");
    return extractResults(res.data);
  } catch (err) {
    return [];
  }
});

export const fetchMediaAssets = cache(
  async (params?: { asset_type?: string; featured?: boolean }): Promise<MediaAsset[]> => {
    try {
      const queryParams: Record<string, string> = {};
      if (params?.asset_type) queryParams.asset_type = params.asset_type;
      if (params?.featured !== undefined) queryParams.featured = String(params.featured);

      const res = await apiClient.get<DRFListResponse<MediaAsset> | MediaAsset[]>("/media/", {
        params: queryParams,
      });
      return extractResults(res.data);
    } catch (err) {
      return [];
    }
  }
);

export const fetchMediaAssetBySlug = cache(async (slug: string): Promise<MediaAsset | null> => {
  try {
    const res = await apiClient.get<MediaAsset>(`/media/${slug}/`);
    return res.data;
  } catch (err) {
    return null;
  }
});

export const fetchSEOMetadata = cache(async (pageIdentifier: string): Promise<SEOMetadata | null> => {
  try {
    const res = await apiClient.get<SEOMetadata>(`/seo/${pageIdentifier}/`);
    return res.data;
  } catch (err) {
    return null;
  }
});

export interface ChatActionCard {
  type: string;
  label: string;
  url: string;
  icon?: string;
  variant?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
  mode?: string;
  sources?: string[];
  actions?: ChatActionCard[];
  suggestions?: string[];
}

export async function sendChatMessage(
  messages: ChatMessage[] | string
): Promise<ChatResponse> {
  try {
    const payload = typeof messages === "string" ? { message: messages } : { messages };
    const res = await apiClient.post<ChatResponse>(
      "/assistant/chat/",
      payload
    );
    return res.data;
  } catch (err: any) {
    return {
      reply: "Sorry, I encountered an error connecting to Harsh's AI assistant backend.",
    };
  }
}

export async function streamChatMessage(
  messages: ChatMessage[],
  callbacks: {
    onChunk: (chunk: string) => void;
    onMeta?: (meta: { mode?: string; sources?: string[] }) => void;
    onDone?: (data: { actions?: ChatActionCard[]; suggestions?: string[] }) => void;
    onError?: (err: any) => void;
  }
): Promise<void> {
  const baseUrl = getBaseURL();

  try {
    const res = await fetch(`${baseUrl}/assistant/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
      body: JSON.stringify({ messages, stream: true }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    if (!res.body) {
      // Non-streaming fallback
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      callbacks.onChunk(data.reply || "");
      callbacks.onMeta?.({ mode: data.mode, sources: data.sources });
      callbacks.onDone?.({ actions: data.actions, suggestions: data.suggestions });
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data: ")) {
          const jsonStr = trimmed.slice(6).trim();
          if (jsonStr && jsonStr !== "[DONE]") {
            try {
              const data = JSON.parse(jsonStr);
              if (data.type === "meta") {
                callbacks.onMeta?.({ mode: data.mode, sources: data.sources });
              } else if (data.type === "chunk") {
                callbacks.onChunk(data.chunk || "");
              } else if (data.type === "done") {
                callbacks.onDone?.({ actions: data.actions, suggestions: data.suggestions });
              }
            } catch (e) {
              // Ignore parse errors on partial chunks
            }
          }
        }
      }
    }
  } catch (err) {
    callbacks.onError?.(err);
  }
}

export async function fetchJsonResume(): Promise<any> {
  try {
    const res = await apiClient.get("/settings/json-resume/");
    return res.data;
  } catch (err) {
    return {};
  }
}
