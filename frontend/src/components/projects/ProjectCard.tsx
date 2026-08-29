"use client";

import React from "react";
import Link from "next/link";
import { FolderGit2, ExternalLink, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { getLanguageColor } from "@/lib/language-colors";
import { TechChip } from "@/components/ui/TechChip";
import type { Project } from "@/lib/api/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const techStack = project.tech_stack_detail || [];
  const displaySummary = project.summary || project.description || "";
  const hasLiveDemo = Boolean(project.demo && project.demo.trim().length > 0);

  return (
    <div className="group h-full flex flex-col justify-between rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-3.5 transition-all duration-200 hover:border-[#0969da]/60 dark:hover:border-[#58a6ff]/60 shadow-xs hover:shadow-md">
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Header bar: Repository & Demo Links */}
          <div className="flex items-center justify-between border-b border-[#d0d7de]/40 dark:border-[#30363d]/40 pb-2">
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff] flex-shrink-0" />
              <h3 className="font-bold text-base text-[#0969da] dark:text-[#58a6ff]">
                {project.slug ? (
                  <Link href={`/projects/${project.slug}`} className="hover:underline">
                    {project.title}
                  </Link>
                ) : (
                  project.title
                )}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
              {project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors flex items-center gap-1 font-semibold"
                  aria-label={`Source code for ${project.title}`}
                >
                  <GithubIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Source</span>
                </a>
              )}
              {hasLiveDemo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1f883d] dark:text-[#39d353] hover:underline transition-colors flex items-center gap-1 font-semibold"
                  aria-label={`Live system for ${project.title}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Live</span>
                </a>
              )}
            </div>
          </div>

          {/* Summary Description */}
          <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed">
            {displaySummary}
          </p>
        </div>

        {/* Action link to full project detail page */}
        {project.slug && (
          <div className="pt-1">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] hover:underline group/link"
            >
              <span>Details</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Footer tech stack */}
      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2.5 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 mt-auto">
          {techStack.map((tech, tIdx) => (
            <TechChip key={tIdx} name={tech.name} />
          ))}
        </div>
      )}
    </div>
  );
}
