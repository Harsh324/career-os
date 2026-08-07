import type { Metadata } from "next";
import { fetchProjects } from "@/lib/api/services";
import { FolderGit2 } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "Projects Showcase",
  description: "Open-source software, platform engineering, system architecture, and full-stack applications.",
};

export default async function ProjectsPage() {
  let projects: Project[] = [];
  try {
    projects = await fetchProjects();
  } catch (err) {}

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1.5 border-b border-[#d0d7de] dark:border-[#30363d] pb-4">
        <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight sm:text-2xl text-[#24292f] dark:text-[#f0f6fc]">
          <FolderGit2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Projects Showcase</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e]">
          Open-source software, platform engineering, system architecture, and full-stack applications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, idx) => (
          <ProjectCard key={project.slug || idx} project={project} />
        ))}
      </div>
    </div>
  );
}
