"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck, Eye } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ExperienceDetailView } from "./ExperienceDetailView";
import type { Experience } from "@/lib/api/types";

export interface ExperiencePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Experience;
  isDraft?: boolean;
}

export function ExperiencePreviewModal({
  isOpen,
  onClose,
  data,
  isDraft = false,
}: ExperiencePreviewModalProps) {
  const badge = isDraft ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono font-medium rounded-full bg-[#fff8c5] dark:bg-[#382800] text-[#9a6700] dark:text-[#f2cc60] border border-[#d4a72c]/40 shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-[#d4a72c] animate-pulse" />
      Live Draft • Unsaved Changes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-medium rounded-full bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950] border border-[#4ac26b]/30 shrink-0">
      <ShieldCheck className="w-3 h-3" />
      Canonical Live State
    </span>
  );

  const footerActions = (
    <>
      {data.slug ? (
        <Link
          href={`/experience/${data.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#0969da] dark:text-[#58a6ff] hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Public Page in New Tab
        </Link>
      ) : (
        <div />
      )}

      <button
        type="button"
        onClick={onClose}
        className="px-4 py-1.5 text-xs font-medium rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors shadow-2xs cursor-pointer"
      >
        Close Preview
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Work Experience Presentation Preview</span>
        </div>
      }
      subtitle="Public portfolio presentation layer rendered with current experience data"
      badge={badge}
      maxWidth="4xl"
      footerActions={footerActions}
    >
      <div className="pt-1">
        <ExperienceDetailView experience={data} isInteractiveLinks={false} />
      </div>
    </Modal>
  );
}
