import type { Metadata } from "next";
import Link from "next/link";
import { getCareerSDK } from "@/lib/get-career-os";
import { FolderGit2, ExternalLink, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";

export const metadata: Metadata = {
  title: "Projects Showcase",
  description: "Open-source projects, developer tools, and engineering architectures.",
};

export default async function ProjectsPage() {
  const sdk = await getCareerSDK();
  const projects = sdk.projects();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 border-b border-zinc-800 pb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-100">
          <FolderGit2 className="h-8 w-8 text-emerald-400" />
          <span>Projects Showcase</span>
        </h1>
        <p className="text-base text-zinc-400">
          Open-source software, compilers, platform tooling, and active software projects.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/70"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400 ring-1 ring-emerald-500/30 capitalize">
                  {project.status}
                </span>
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-emerald-400"
                      aria-label="GitHub Repository"
                    >
                      <GithubIcon className="h-5 w-5" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-emerald-400"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-zinc-100">
                {project.slug ? (
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:text-emerald-400 transition-colors flex items-center justify-between"
                  >
                    <span>{project.title}</span>
                    <ArrowRight className="h-5 w-5 text-zinc-500" />
                  </Link>
                ) : (
                  project.title
                )}
              </h2>

              <p className="text-sm text-zinc-300 leading-relaxed">{project.description}</p>
            </div>

            <div className="mt-6 space-y-3 pt-4 border-t border-zinc-800/60">
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded bg-zinc-800/80 px-2.5 py-1 text-xs font-mono text-zinc-300 ring-1 ring-zinc-700/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
