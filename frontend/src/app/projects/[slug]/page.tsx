import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProjectBySlug, fetchProjects } from "@/lib/api/services";
import { ProjectDetailView } from "@/components/project/ProjectDetailView";

export const revalidate = 3600;

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const projects = await fetchProjects();
    if (projects && projects.length > 0) {
      return projects.map((p) => ({ slug: p.slug }));
    }
  } catch (err) {}
  return [];
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  let project = null;
  try {
    project = await fetchProjectBySlug(slug);
  } catch (err) {}

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} — Architecture & Engineering`,
    description: project.summary || project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  let project = null;
  try {
    project = await fetchProjectBySlug(slug);
  } catch (err) {}

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <ProjectDetailView project={project} backHref="/projects" backLabel="Back to Projects Showcase" />
    </div>
  );
}
