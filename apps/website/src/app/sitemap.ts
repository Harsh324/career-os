import type { MetadataRoute } from "next";
import { getCareerSDK } from "@/lib/get-career-os";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://career-os.dev";
  const sdk = await getCareerSDK();
  const projects = sdk.projects();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/experience`, lastModified: new Date() },
    { url: `${baseUrl}/projects`, lastModified: new Date() },
    { url: `${baseUrl}/skills`, lastModified: new Date() },
    { url: `${baseUrl}/timeline`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(),
    }));

  return [...staticRoutes, ...projectRoutes];
}
