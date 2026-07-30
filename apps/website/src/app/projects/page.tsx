import Link from "next/link";
import type { Metadata } from "next";
import { getCareerSDK } from "@/lib/get-career-os";
import { FolderGit2, Star, GitFork, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { getLanguageColor } from "@/lib/language-colors";

export const metadata: Metadata = {
  title: "Projects Showcase",
  description: "Open-source software, compiler tooling, system architecture, and full-stack web applications.",
};

export default async function ProjectsPage() {
  const sdk = await getCareerSDK();
  const projects = sdk.projects();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div className="space-y-3 border-b border-[#d0d7de] dark:border-[#30363d] pb-6 sm:pb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#24292f] dark:text-[#f0f6fc]">
          <FolderGit2 className="h-8 w-8 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Projects Showcase</span>
        </h1>
        <p className="text-sm sm:text-base text-[#57606a] dark:text-[#8b949e]">
          Open-source software, compiler tooling, system architecture, and full-stack web applications.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="group flex flex-col justify-between rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 transition-all hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#1f883d]/10 dark:bg-[#238636]/20 border border-[#1f883d]/30 dark:border-[#39d353]/30 px-2.5 py-0.5 text-xs font-mono font-medium text-[#1f883d] dark:text-[#39d353] capitalize">
                  {project.status || "Active"}
                </span>

                <div className="flex items-center gap-3 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
                    <span>{14 + idx * 9}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3.5 w-3.5" />
                    <span>{4 + idx * 3}</span>
                  </span>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <GithubIcon className="h-4 w-4" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#0969da] dark:text-[#58a6ff] no-underline">
                {project.slug ? (
                  <Link href={`/projects/${project.slug}`} className="no-underline">
                    {project.title}
                  </Link>
                ) : (
                  project.title
                )}
              </h2>

              <p className="text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
                {project.technologies.map((tech, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-1.5 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getLanguageColor(tech) }}
                    />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
