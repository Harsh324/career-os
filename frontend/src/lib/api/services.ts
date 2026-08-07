import { cache } from "react";
import { apiClient } from "./client";
import type {
  BlogPost,
  Certification,
  Education,
  Experience,
  Project,
  SEOMetadata,
  SiteSettings,
  Skill,
  Technology,
  TimelineEvent,
} from "./types";

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
  const res = await apiClient.get<SiteSettings>("/settings/");
  return res.data;
});

export const fetchExperiences = cache(async (): Promise<Experience[]> => {
  const res = await apiClient.get<DRFListResponse<Experience> | Experience[]>("/experience/");
  return extractResults(res.data);
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
  const params = featured !== undefined ? { featured: String(featured) } : {};
  const res = await apiClient.get<DRFListResponse<Project> | Project[]>("/projects/", { params });
  return extractResults(res.data);
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
  const res = await apiClient.get<DRFListResponse<Skill> | Skill[]>("/skills/");
  return extractResults(res.data);
});

export const fetchTechnologies = cache(async (): Promise<Technology[]> => {
  const res = await apiClient.get<DRFListResponse<Technology> | Technology[]>("/technologies/");
  return extractResults(res.data);
});

export const fetchTimeline = cache(async (): Promise<TimelineEvent[]> => {
  const res = await apiClient.get<DRFListResponse<TimelineEvent> | TimelineEvent[]>("/timeline/");
  return extractResults(res.data);
});

export const fetchEducation = cache(async (): Promise<Education[]> => {
  const res = await apiClient.get<DRFListResponse<Education> | Education[]>("/education/");
  return extractResults(res.data);
});

export const fetchCertifications = cache(async (): Promise<Certification[]> => {
  const res = await apiClient.get<DRFListResponse<Certification> | Certification[]>("/certifications/");
  return extractResults(res.data);
});

export const fetchBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const res = await apiClient.get<DRFListResponse<BlogPost> | BlogPost[]>("/blog/");
  return extractResults(res.data);
});

export const fetchBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const res = await apiClient.get<BlogPost>(`/blog/${slug}/`);
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

export async function sendChatMessage(
  message: string
): Promise<{ reply: string; mode?: string; sources?: string[] }> {
  try {
    const res = await apiClient.post<{ reply: string; mode?: string; sources?: string[] }>(
      "/assistant/chat/",
      { message }
    );
    return res.data;
  } catch (err: any) {
    return {
      reply: "Sorry, I encountered an error connecting to Harsh's AI assistant backend.",
    };
  }
}

export async function fetchJsonResume(): Promise<any> {
  const res = await apiClient.get("/settings/json-resume/");
  return res.data;
}
