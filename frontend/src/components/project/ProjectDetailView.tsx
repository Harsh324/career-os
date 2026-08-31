"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Layers,
  Cpu,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Sparkles,
  BookOpen,
  FolderGit2,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { ProjectBodyRenderer } from "@/components/projects/ProjectBodyRenderer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechChip } from "@/components/ui/TechChip";
import type { Project } from "@/lib/api/types";

interface ProjectDetailViewProps {
  project: Partial<Project>;
  backHref?: string;
  backLabel?: string;
  isDraftPreview?: boolean;
}

export function ProjectDetailView({
  project,
  backHref = "/projects",
  backLabel = "Back to Projects Showcase",
  isDraftPreview = false,
}: ProjectDetailViewProps) {
  const hasLiveDemo = Boolean(project.demo && project.demo.trim().length > 0);
  const hasDocsUrl = Boolean(project.docs_url && project.docs_url.trim().length > 0);

  // Status mapping for badge
  const getStatusLabelAndVariant = (status?: string): { label: string; variant: "green" | "blue" | "gray" } => {
    switch (status?.toLowerCase()) {
      case "in_development":
      case "active development":
        return { label: "In Development", variant: "blue" };
      case "deployed":
        return { label: "Deployed", variant: "green" };
      case "archived":
        return { label: "Archived", variant: "gray" };
      case "active":
      default:
        return { label: "Active", variant: "green" };
    }
  };

  const { label: statusLabel, variant: statusVariant } = getStatusLabelAndVariant(project.status);

  // Project type display label
  const getProjectTypeLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "infrastructure":
        return "Infrastructure & Homelab";
      case "platform":
        return "Platform & Tooling";
      case "open_source":
        return "Open Source Library";
      case "experiment":
        return "Research & Experiment";
      case "application":
      default:
        return "Application / Product";
    }
  };

  const projectTypeLabel = getProjectTypeLabel(project.project_type);

  // Filter public highlights
  const publicHighlights = (project.highlights || []).filter(
    (h) => typeof h === "string" || h.is_public !== false
  );

  return (
    <div className="w-full space-y-6">
      {/* Back Navigation Link (shown unless in modal preview) */}
      {!isDraftPreview && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0969da] dark:text-[#58a6ff] hover:underline transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>{backLabel}</span>
        </Link>
      )}

      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={statusLabel} variant={statusVariant} />
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#eaeef2] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de]/50 dark:border-[#30363d]">
              {projectTypeLabel}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] px-3 py-1.5 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-all shadow-xs"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>View Source</span>
              </a>
            )}
            {hasDocsUrl && (
              <a
                href={project.docs_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] px-3 py-1.5 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-all shadow-xs"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Documentation</span>
              </a>
            )}
            {hasLiveDemo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0969da] px-3 py-1.5 text-xs font-mono font-semibold text-white hover:bg-[#085ac1] transition-all shadow-xs"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Live System</span>
              </a>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
            {project.title || "Untitled Project"}
          </h1>

          {project.summary && (
            <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed max-w-3xl font-medium">
              {project.summary}
            </p>
          )}

          {project.timeline && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] pt-1">
              <Calendar className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
              <span>Timeline: {project.timeline}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Column: Architecture & Engineering (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                <Layers className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Architecture & System Design</span>
              </h2>
            </div>

            {/* Dynamic Architecture Flow Steps */}
            {project.architecture_flow && project.architecture_flow.length > 0 && (
              <div className="rounded-lg border border-[#d0d7de]/80 dark:border-[#30363d] bg-[#f6f8fa]/70 dark:bg-[#0d1117]/70 p-4 space-y-3">
                <span className="text-[11px] font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider block">
                  SYSTEM ARCHITECTURE FLOW
                </span>
                <div className="space-y-2 font-mono text-[11px] text-[#24292f] dark:text-[#c9d1d9]">
                  {project.architecture_flow.map((flowStep, idx) => (
                    <React.Fragment key={idx}>
                      <div className="flex items-start sm:items-center gap-2.5 rounded-md bg-white dark:bg-[#161b22] p-2.5 border border-[#d0d7de] dark:border-[#30363d]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#0969da] dark:bg-[#58a6ff] mt-0.5 sm:mt-0 flex-shrink-0" />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 w-full">
                          <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                            {flowStep.title}
                          </span>
                          {flowStep.detail && (
                            <span className="text-[10px] text-[#57606a] dark:text-[#8b949e]">
                              {flowStep.detail}
                            </span>
                          )}
                        </div>
                      </div>
                      {idx < (project.architecture_flow?.length || 0) - 1 && (
                        <div className="text-center text-[#8b949e] font-bold text-[10px] leading-none py-0.5">
                          &darr;
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Body Description */}
            {project.description && (
              <div className="pt-1">
                <ProjectBodyRenderer content={project.description} />
              </div>
            )}

            {/* Standardized Problem -> Solution -> Impact Card */}
            {(project.problem || project.solution || project.technical_outcome) && (
              <div className="border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 pt-4 space-y-3">
                <h3 className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] uppercase tracking-wider">
                  <Zap className="h-3.5 w-3.5 text-[#d97706] dark:text-[#f59e0b]" />
                  <span>Technical Problem, Solution & Outcome</span>
                </h3>

                <div className="rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/50 dark:bg-[#0d1117]/50 p-3.5 space-y-3">
                  {project.problem && (
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase text-[#cf222e] dark:text-[#ff7b72] block mb-1">
                        Problem
                      </span>
                      <p className="text-xs font-medium text-[#24292f] dark:text-[#f0f6fc] leading-relaxed">
                        {project.problem}
                      </p>
                    </div>
                  )}

                  {project.solution && (
                    <div className="border-t border-[#d0d7de]/40 dark:border-[#30363d]/40 pt-2.5">
                      <span className="text-[9px] font-mono font-bold uppercase text-[#0969da] dark:text-[#58a6ff] block mb-1">
                        Solution
                      </span>
                      <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                  )}

                  {project.technical_outcome && (
                    <div className="border-t border-[#d0d7de]/40 dark:border-[#30363d]/40 pt-2.5">
                      <span className="text-[9px] font-mono font-bold uppercase text-[#1f883d] dark:text-[#39d353] block mb-1">
                        Technical Outcome
                      </span>
                      <p className="text-xs font-semibold text-[#1f883d] dark:text-[#39d353] leading-relaxed">
                        {project.technical_outcome}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key Features Grid */}
            {project.key_features && project.key_features.length > 0 && (
              <div className="border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 pt-4 space-y-3">
                <h3 className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-[#0969da] dark:text-[#58a6ff]" />
                  <span>Key Architectural Features</span>
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  {project.key_features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="rounded-lg border border-[#d0d7de]/60 dark:border-[#30363d]/60 bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60 p-3 space-y-1"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#24292f] dark:text-[#f0f6fc]">
                        <CheckCircle2 className="h-4 w-4 text-[#1f883d] dark:text-[#39d353] flex-shrink-0" />
                        <span>{feat.title}</span>
                      </div>
                      {feat.desc && (
                        <p className="text-[11px] text-[#57606a] dark:text-[#8b949e] leading-relaxed pl-5 font-sans">
                          {feat.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievement Highlights / Evidence */}
            {publicHighlights.length > 0 && (
              <div className="border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 pt-4 space-y-3">
                <h3 className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] uppercase tracking-wider">
                  <FolderGit2 className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
                  <span>Engineering Highlights & Evidence</span>
                </h3>

                <div className="space-y-2">
                  {publicHighlights.map((hl, hIdx) => {
                    const text = typeof hl === "string" ? hl : hl.text;
                    return (
                      <div
                        key={hIdx}
                        className="flex items-start gap-2.5 text-xs text-[#24292f] dark:text-[#c9d1d9] leading-relaxed bg-[#f6f8fa]/40 dark:bg-[#0d1117]/40 p-2.5 rounded-lg border border-[#d0d7de]/40 dark:border-[#30363d]/40"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#1f883d] dark:text-[#39d353] mt-1.5 flex-shrink-0" />
                        <span>{text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Tech Stack & Scope (Span 1) */}
        <div className="space-y-5">
          {/* Tech Stack Card */}
          {project.tech_stack_detail && project.tech_stack_detail.length > 0 && (
            <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-3 shadow-xs">
              <h3 className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#57606a] dark:text-[#8b949e] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
                <Cpu className="h-3.5 w-3.5 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Technical Stack</span>
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack_detail.map((tech, tIdx) => (
                  <TechChip key={tech.id || tIdx} name={tech.name} />
                ))}
              </div>
            </div>
          )}

          {/* Project Details & Metadata Card */}
          <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-3 shadow-xs">
            <h3 className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#57606a] dark:text-[#8b949e] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
              <span>Project Classification</span>
            </h3>

            <div className="space-y-2.5 text-xs text-[#57606a] dark:text-[#8b949e]">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-[#8b949e] block">
                  Category
                </span>
                <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                  {projectTypeLabel}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-[#8b949e] block">
                  Status
                </span>
                <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                  {statusLabel}
                </span>
              </div>

              {project.timeline && (
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-[#8b949e] block">
                    Timeline
                  </span>
                  <span className="text-[#24292f] dark:text-[#c9d1d9]">
                    {project.timeline}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
