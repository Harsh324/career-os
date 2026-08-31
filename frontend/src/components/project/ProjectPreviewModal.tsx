"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ProjectDetailView } from "./ProjectDetailView";
import type { Project } from "@/lib/api/types";

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Partial<Project>;
  isDirty?: boolean;
}

export function ProjectPreviewModal({
  isOpen,
  onClose,
  project,
  isDirty = false,
}: ProjectPreviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2">
          <span>{project.title || "Project Preview"}</span>
          <span className="text-xs font-mono font-normal text-[#57606a] dark:text-[#8b949e]">
            ({project.slug || "new-project"})
          </span>
        </div>
      }
      subtitle="Recruiter-facing showcase presentation view"
      badge={
        isDirty ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#fff8c5] dark:bg-[#3b2300] text-[#9a6700] dark:text-[#f5d90a] border border-[#d4a72c]/40">
            <Sparkles className="w-3 h-3 animate-pulse" />
            Live Draft • Unsaved Changes
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950] border border-[#2da44e]/30">
            <CheckCircle2 className="w-3 h-3" />
            Canonical Live State
          </span>
        )
      }
      footerActions={
        <div className="flex items-center justify-between w-full">
          <div className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
            Status: <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">{project.status || "active"}</span>
            {project.is_published === false && (
              <span className="ml-2 text-[#cf222e] dark:text-[#ff7b72] font-semibold">(Unpublished Draft)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {project.slug && (
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Public Page</span>
              </Link>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#24292f] dark:bg-[#f0f6fc] text-white dark:text-[#24292f] hover:opacity-90 transition-opacity"
            >
              Close Preview
            </button>
          </div>
        </div>
      }
    >
      <div className="py-2">
        <ProjectDetailView project={project} isDraftPreview={true} />
      </div>
    </Modal>
  );
}
