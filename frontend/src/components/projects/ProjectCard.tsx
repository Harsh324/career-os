"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FolderGit2, ExternalLink, Code2, ChevronDown, ChevronUp, Cpu, Server } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { getLanguageColor } from "@/lib/language-colors";
import type { Project } from "@/lib/api/types";

interface ProjectCardProps {
  project: Project;
}

const DEFAULT_ARCH_HIGHLIGHTS: Record<string, string[]> = {
  "career-os": [
    "Django REST Framework + PostgreSQL ContentGraph ORM schema",
    "Celery asynchronous task queue for AI draft generation",
    "Docker containerization & docker-compose production orchestration",
  ],
  "fintrack-ai": [
    "Python microservice for LLM transaction classification",
    "PostgreSQL indexing & DRF REST API streaming endpoints",
    "Redis caching for high-frequency financial query optimization",
  ],
  default: [
    "Clean RESTful API design with Django DRF & PostgreSQL",
    "Docker containerized microservices architecture",
    "Asynchronous background processing & Redis caching",
  ],
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [showArchitecture, setShowArchitecture] = useState(false);
  const techStack = project.tech_stack_detail || [];

  const archHighlights =
    DEFAULT_ARCH_HIGHLIGHTS[project.slug || ""] || DEFAULT_ARCH_HIGHLIGHTS["default"];

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 transition-all hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 shadow-xs">
      <div className="space-y-3">
        {/* Header bar: Status badge & external links */}
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#1f883d]/10 dark:bg-[#238636]/20 border border-[#1f883d]/30 dark:border-[#39d353]/30 px-2.5 py-0.5 text-xs font-mono font-medium text-[#1f883d] dark:text-[#39d353] capitalize">
            {project.status || "Active"}
          </span>

          <div className="flex items-center gap-3 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors"
                aria-label={`Source code for ${project.title}`}
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors"
                aria-label={`Live demo for ${project.title}`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <FolderGit2 className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
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

        {/* Summary */}
        <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed line-clamp-3">
          {project.summary || project.description}
        </p>

        {/* Enhancement 3: Expandable Architecture Highlights Drawer */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowArchitecture(!showArchitecture)}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>{showArchitecture ? "Hide Architecture Highlights" : "Key Backend Architecture"}</span>
            {showArchitecture ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showArchitecture && (
            <div className="mt-2.5 p-3 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de]/80 dark:border-[#30363d] text-xs font-mono space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-[#24292f] dark:text-[#f0f6fc] font-bold border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-1">
                <Server className="h-3.5 w-3.5 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Architectural Overview:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#57606a] dark:text-[#8b949e]">
                {archHighlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Footer tech stack */}
      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
          {techStack.map((tech, tIdx) => (
            <div key={tIdx} className="flex items-center gap-1.5 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: getLanguageColor(tech.name) }}
              />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
