import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCareerSDK } from "@/lib/get-career-os";
import { ArrowLeft, ExternalLink, Calendar, Layers, Cpu, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { CopyCodeButton } from "@/components/ui/CopyCodeButton";
import { getLanguageColor } from "@/lib/language-colors";
import { ProjectBodyRenderer } from "@/components/projects/ProjectBodyRenderer";

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
    title: `${project.title} — Engineering Case Study`,
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
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Back Navigation Link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0969da] dark:text-[#58a6ff] hover:underline transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Projects Showcase</span>
      </Link>

      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#1f883d]/10 dark:bg-[#238636]/20 border border-[#1f883d]/30 dark:border-[#39d353]/30 px-3 py-1 text-xs font-mono font-semibold text-[#1f883d] dark:text-[#39d353] flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39d353] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1f883d] dark:bg-[#39d353]"></span>
              </span>
              <span className="capitalize">{project.status || "Active Flagship"}</span>
            </span>

            {project.category && (
              <span className="rounded-full bg-[#0969da]/10 dark:bg-[#58a6ff]/15 border border-[#0969da]/30 dark:border-[#58a6ff]/30 px-3 py-1 text-xs font-mono font-medium text-[#0969da] dark:text-[#58a6ff]">
                {project.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] px-4 py-2 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-all shadow-xs"
              >
                <GithubIcon className="h-4 w-4" />
                <span>View Source</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1f883d] dark:bg-[#238636] px-4 py-2 text-xs font-mono font-semibold text-white hover:bg-[#116329] dark:hover:bg-[#2ea043] transition-all shadow-xs"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Live System</span>
              </a>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#24292f] dark:text-[#f0f6fc]">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-[#57606a] dark:text-[#8b949e] leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {project.startDate && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#57606a] dark:text-[#8b949e] pt-2">
              <Calendar className="h-4 w-4 text-[#1f883d] dark:text-[#39d353]" />
              <span>Project Inception: {project.startDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Architecture & Sidebar Stack */}
      <div className="grid gap-8 sm:grid-cols-3">
        {/* Left Column: System Architecture & Case Study */}
        <div className="sm:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-4">
              <h2 className="flex items-center gap-2.5 text-base font-bold text-[#24292f] dark:text-[#f0f6fc]">
                <Layers className="h-5 w-5 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Engineering Case Study</span>
              </h2>

              <span className="flex items-center gap-1 text-xs font-mono text-[#1f883d] dark:text-[#39d353] font-medium bg-[#1f883d]/10 dark:bg-[#238636]/20 px-2.5 py-1 rounded-md border border-[#1f883d]/30 dark:border-[#39d353]/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified Architecture</span>
              </span>
            </div>

            {project.body ? (
              <ProjectBodyRenderer content={project.body} />
            ) : (
              <p className="text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed">
                Architected and deployed as a high-performance system component following monorepo modularity principles and strict schema validation.
              </p>
            )}
          </div>

          {/* macOS Style Code Quickstart Window */}
          <div className="overflow-hidden rounded-2xl border border-[#30363d] bg-[#0d1117] shadow-lg">
            <div className="flex items-center justify-between bg-[#161b22] px-4 py-3 border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                <span className="ml-2 font-mono text-xs text-[#8b949e] font-medium">quickstart.sh</span>
              </div>

              <CopyCodeButton code={`pnpm install && pnpm build --filter ${project.slug}`} />
            </div>

            <div className="p-5 font-mono text-xs leading-relaxed text-[#e6edf3]">
              <p className="text-[#8b949e] mb-2"># Clone and build deterministic target</p>
              <div className="space-y-1">
                <p>
                  <span className="text-[#388bfd]">git clone</span> https://github.com/Harsh324/{project.slug}.git
                </p>
                <p>
                  <span className="text-[#388bfd]">cd</span> {project.slug}
                </p>
                <p>
                  <span className="text-[#388bfd]">pnpm</span> install && <span className="text-[#388bfd]">pnpm</span> build
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Tech Stack & System Guarantees */}
        <div className="space-y-6">
          {project.technologies && project.technologies.length > 0 && (
            <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-sm">
              <h3 className="flex items-center gap-2 text-xs font-mono font-bold text-[#57606a] dark:text-[#8b949e] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
                <Cpu className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Technologies</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, tIdx) => (
                  <div
                    key={tIdx}
                    className="flex items-center gap-2 rounded-lg bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] px-3 py-1.5 text-xs font-mono text-[#24292f] dark:text-[#c9d1d9] font-medium"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getLanguageColor(tech) }}
                    />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Guarantees Card */}
          <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-sm">
            <h3 className="flex items-center gap-2 text-xs font-mono font-bold text-[#57606a] dark:text-[#8b949e] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
              <ShieldCheck className="h-4 w-4 text-[#1f883d] dark:text-[#39d353]" />
              <span>Engineering Guarantees</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2.5 text-[#1f883d] dark:text-[#39d353]">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="font-semibold">Zod Schema Validation</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#1f883d] dark:text-[#39d353]">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="font-semibold">Turborepo Cached Builds</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#1f883d] dark:text-[#39d353]">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="font-semibold">Deterministic Output</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
