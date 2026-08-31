"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { SkillMatrixView } from "./SkillMatrixView";
import type { Skill, Certification } from "@/lib/api/types";

interface SkillPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  certs?: Certification[];
  isDirty?: boolean;
  highlightSkillSlug?: string;
}

export function SkillPreviewModal({
  isOpen,
  onClose,
  skills,
  certs = [],
  isDirty = false,
  highlightSkillSlug,
}: SkillPreviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2">
          <span>Skills Matrix Preview</span>
          {highlightSkillSlug && (
            <span className="text-xs font-mono font-normal text-[#57606a] dark:text-[#8b949e]">
              ({highlightSkillSlug})
            </span>
          )}
        </div>
      }
      subtitle="Public presentation view of canonical technical competencies"
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
            Rendering <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">{skills.length}</span> competency records
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/skills"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Public Page</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#21262d] dark:bg-[#30363d] text-white hover:bg-[#30363d] dark:hover:bg-[#3c444d] transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      }
    >
      <div className="p-4 sm:p-6">
        <SkillMatrixView skills={skills} certs={certs} isDraftPreview={true} />
      </div>
    </Modal>
  );
}
