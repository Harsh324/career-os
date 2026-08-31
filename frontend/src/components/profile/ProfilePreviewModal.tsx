"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck, Eye } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileHeroBanner } from "./ProfileHeroBanner";
import type { SiteSettings } from "@/lib/api/types";

export interface ProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SiteSettings;
  isDraft?: boolean;
}

export function ProfilePreviewModal({
  isOpen,
  onClose,
  data,
  isDraft = false,
}: ProfilePreviewModalProps) {
  const badge = isDraft ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-[#fff8c5] dark:bg-[#382800] text-[#9a6700] dark:text-[#f2cc60] border border-[#d4a72c]/40">
      <span className="w-1.5 h-1.5 rounded-full bg-[#d4a72c] animate-pulse" />
      Live Draft • Unsaved Changes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950] border border-[#4ac26b]/30">
      <ShieldCheck className="w-3 h-3" />
      Canonical Live State
    </span>
  );

  const footerActions = (
    <>
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open Public Portfolio in New Tab
      </Link>

      <button
        type="button"
        onClick={onClose}
        className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors"
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
          <span>Profile Presentation Preview</span>
        </div>
      }
      subtitle="Public portfolio presentation layer rendered with current form data"
      badge={badge}
      maxWidth="4xl"
      footerActions={footerActions}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
        {/* Left Column: Shared Profile Sidebar */}
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-6 md:pb-0 md:pr-6">
          <ProfileSidebar meta={data} showCTAs={false} isInteractiveLinks={false} />
        </div>

        {/* Right Column: Shared Hero Role Banner & Guidance */}
        <div className="md:col-span-2 space-y-4">
          <ProfileHeroBanner meta={data} />

          {/* Context Note */}
          <div className="p-4 rounded-xl bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#57606a] dark:text-[#8b949e] space-y-1 font-sans">
            <p className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
              Presentation Sync Guarantee
            </p>
            <p className="leading-relaxed text-[11px]">
              This preview consumes the exact same presentation components as the public homepage.
              Changes to name, headline, tagline, availability, bio summary, engineering focus, and
              social links reflect immediately here before saving.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
