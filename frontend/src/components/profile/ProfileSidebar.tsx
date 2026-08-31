"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Building2, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { EmailCopyButton } from "@/components/ui/EmailCopyButton";
import type { SiteSettings } from "@/lib/api/types";

export interface ProfileSidebarProps {
  meta: SiteSettings;
  currentCompany?: {
    name: string;
    slug: string;
  };
  showCTAs?: boolean;
  isInteractiveLinks?: boolean;
}

export function ProfileSidebar({
  meta,
  currentCompany,
  showCTAs = true,
  isInteractiveLinks = true,
}: ProfileSidebarProps) {
  return (
    <div className="space-y-5">
      {/* Avatar & Profile Identifiers */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
        {meta.avatar_url ? (
          <div className="relative group">
            <div className="relative h-32 w-32 sm:h-44 sm:w-44 lg:h-52 lg:w-52 aspect-square overflow-hidden rounded-full border-2 border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] shadow-md">
              <Image
                src={meta.avatar_url}
                alt={meta.name || "Profile avatar"}
                fill
                priority
                className="object-cover rounded-full"
                unoptimized
              />
            </div>
          </div>
        ) : (
          <div className="h-32 w-32 sm:h-44 sm:w-44 lg:h-52 lg:w-52 aspect-square rounded-full border-2 border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] flex items-center justify-center text-3xl sm:text-4xl font-bold text-[#57606a] dark:text-[#8b949e] shadow-md">
            {meta.name ? meta.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}

        <div className="space-y-1 w-full">
          <h1 className="text-2xl font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
            {meta.name || "Your Name"}
          </h1>
          <p className="text-sm font-mono text-[#0969da] dark:text-[#58a6ff] font-semibold">
            {meta.title || "Your Professional Title"}
          </p>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] font-sans leading-normal">
            {meta.tagline || "Your professional tagline"}
          </p>
        </div>
      </div>

      {/* Availability Status Badge */}
      {meta.open_to_work ? (
        <div className="rounded-xl border border-[#1f883d]/30 dark:border-[#39d353]/30 bg-[#1f883d]/10 dark:bg-[#238636]/20 px-2.5 py-2 text-[11px] font-mono text-[#1f883d] dark:text-[#39d353] flex items-center gap-1.5 shadow-sm font-medium leading-tight">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39d353] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1f883d] dark:bg-[#39d353]"></span>
          </span>
          <Sparkles className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353] flex-shrink-0" />
          <span className="whitespace-normal">Open to Backend & Cloud Roles</span>
        </div>
      ) : (
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] px-2.5 py-2 text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] flex items-center gap-1.5 shadow-2xs font-medium leading-tight">
          <span className="h-2 w-2 rounded-full bg-[#57606a] dark:bg-[#8b949e] flex-shrink-0"></span>
          <span className="whitespace-normal">Not Actively Looking</span>
        </div>
      )}

      {/* Core Tech Pills */}
      <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
        {["Python", "Django REST", "AWS", "Celery", "ECS/Fargate"].map((t, idx) => (
          <span
            key={idx}
            className="rounded-md bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] px-2 py-0.5 text-[#24292f] dark:text-[#c9d1d9] hover:border-[#0969da] dark:hover:border-[#58a6ff] hover:text-[#0969da] dark:hover:text-[#58a6ff] hover:bg-[#0969da]/10 dark:hover:bg-[#58a6ff]/15 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 select-none"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Hero CTAs */}
      {showCTAs && (
        <div className="flex flex-col gap-2 pt-1">
          <Link
            href="/experience"
            className="w-full text-center rounded-xl bg-[#0969da] px-3.5 py-2 text-xs font-mono font-semibold text-white shadow-sm hover:bg-[#085ac1] transition-colors"
          >
            View Experience &rarr;
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/projects"
              className="text-center rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3 py-2 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] shadow-xs hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/resume"
              className="text-center rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3 py-2 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] shadow-xs hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors"
            >
              Resume
            </Link>
          </div>
        </div>
      )}

      {/* Profile Metadata List */}
      <div className="space-y-2.5 text-xs text-[#57606a] dark:text-[#8b949e] font-sans border-t border-[#d0d7de] dark:border-[#30363d] pt-4">
        {currentCompany && (
          <div className="flex items-center gap-2.5">
            <Building2 className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
            {isInteractiveLinks ? (
              <Link
                href={`/experience/${currentCompany.slug}`}
                className="font-semibold text-[#24292f] dark:text-[#c9d1d9] hover:text-[#0969da] dark:hover:text-[#58a6ff] hover:underline"
              >
                {currentCompany.name}
              </Link>
            ) : (
              <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                {currentCompany.name}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <MapPin className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
          <span>{meta.location || "Location not set"}</span>
        </div>

        {meta.email && (
          <div className="flex items-center gap-2.5">
            <EmailCopyButton email={meta.email} variant="link" />
          </div>
        )}

        {meta.github_url && (
          <div className="flex items-center gap-2.5">
            <GithubIcon className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
            <a
              href={meta.github_url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline truncate font-mono text-[#0969da] dark:text-[#58a6ff]"
            >
              {meta.github_url.replace("https://", "")}
            </a>
          </div>
        )}

        {meta.linkedin_url && (
          <div className="flex items-center gap-2.5">
            <LinkedinIcon className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
            <a
              href={meta.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline truncate font-mono text-[#0969da] dark:text-[#58a6ff]"
            >
              {meta.linkedin_url.replace("https://", "")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
