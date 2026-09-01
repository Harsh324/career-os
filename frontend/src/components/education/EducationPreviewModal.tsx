"use client";

import React, { useEffect } from "react";
import { X, Sparkles, GraduationCap } from "lucide-react";
import type { Education } from "@/lib/api/types";
import { EducationDetailView } from "./EducationDetailView";

interface EducationPreviewModalProps {
  education: Education;
  isOpen: boolean;
  onClose: () => void;
  isDirty?: boolean;
}

export function EducationPreviewModal({
  education,
  isOpen,
  onClose,
  isDirty = false,
}: EducationPreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="education-preview-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0969da]/10 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/20 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span id="education-preview-title" className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                  Education Record Preview
                </span>
                {isDirty ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#fff8c5] dark:bg-[#9e6a03]/20 text-[#9a6700] dark:text-[#d29922] border border-[#9a6700]/30 dark:border-[#d29922]/30">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Live Draft &bull; Unsaved Changes</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#dafbe1] dark:bg-[#1f883d]/20 text-[#1a7f37] dark:text-[#3fb950] border border-[#1a7f37]/30 dark:border-[#3fb950]/30">
                    <span>Canonical Live State</span>
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                {education.degree} &bull; {education.institution}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <EducationDetailView education={education} isDraftPreview={true} />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] flex items-center justify-between text-xs text-[#57606a] dark:text-[#8b949e] font-mono shrink-0">
          <span>Esc to exit preview</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#21262d] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] border border-[#d0d7de] dark:border-[#30363d] font-semibold text-[#24292f] dark:text-[#c9d1d9] transition-all cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
