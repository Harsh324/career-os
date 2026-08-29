import type { MetadataRoute } from "next";
import { fetchExperiences, fetchProjects } from "@/lib/api/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://career-os.dev";
  let projects: any[] = [];
  let experiences: any[] = [];
  try {
    const [fetchedProj, fetchedExp] = await Promise.all([
      fetchProjects(),
      fetchExperiences(),
    ]);
    projects = fetchedProj;
    experiences = fetchedExp;
  } catch (err) {}

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/experience`, lastModified: new Date() },
    { url: `${baseUrl}/projects`, lastModified: new Date() },
    { url: `${baseUrl}/skills`, lastModified: new Date() },
    { url: `${baseUrl}/timeline`, lastModified: new Date() },
    { url: `${baseUrl}/resume`, lastModified: new Date() },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    }));

  const experienceRoutes: MetadataRoute.Sitemap = experiences
    .filter((e) => e.slug)
    .map((e) => ({
      url: `${baseUrl}/experience/${e.slug}`,
      lastModified: e.updated_at ? new Date(e.updated_at) : new Date(),
    }));

  return [...staticRoutes, ...projectRoutes, ...experienceRoutes];
}
