import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCareerSDK } from "@/lib/get-career-os";
import { ArrowLeft, ExternalLink, Calendar, Code } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const sdk = await getCareerSDK();
  const projects = sdk.projects();
  return projects.filter((p) => p.slug).map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sdk = await getCareerSDK();
  const project = sdk.project(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const sdk = await getCareerSDK();
  const project = sdk.project(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Projects</span>
      </Link>

      <div className="space-y-4 border-b border-zinc-800 pb-8">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400 ring-1 ring-emerald-500/30 capitalize">
            {project.status}
          </span>
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-300 ring-1 ring-zinc-800 hover:bg-zinc-800 hover:text-emerald-400 transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
                <span>Source</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-100">
          {project.title}
        </h1>

        <p className="text-lg text-zinc-300 leading-relaxed">{project.description}</p>

        {project.startDate && (
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <span>Started {project.startDate}</span>
          </div>
        )}
      </div>

      {/* Tech Stack */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-mono font-semibold text-zinc-400 uppercase tracking-wider">
            <Code className="h-4 w-4 text-emerald-400" />
            <span>Tech Stack</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-200 ring-1 ring-zinc-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Markdown Body Content */}
      {project.body && (
        <div className="prose prose-invert max-w-none pt-6 text-zinc-300 leading-relaxed space-y-4">
          <p>{project.body}</p>
        </div>
      )}
    </div>
  );
}
