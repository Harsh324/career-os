import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, Calendar } from "lucide-react";
import type { ExperienceWithCompany } from "@career-os/sdk";

interface ExperienceCardProps {
  experience: ExperienceWithCompany;
  compact?: boolean;
}

export function ExperienceCard({ experience: exp }: ExperienceCardProps) {
  const company = exp.companyData;
  const detailUrl = `/experience/${exp.slug || "software-engineer-sms"}`;
  const isCurrentRole = !exp.endDate || exp.endDate.toLowerCase() === "present";
  const primaryMetric = exp.metrics?.[0];

  return (
    <Link
      href={detailUrl}
      className="group flex flex-col justify-between rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-3 shadow-xs hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 hover:shadow-md transition-all no-underline cursor-pointer block"
    >
      <div className="space-y-2">
        {/* 1. Header: Logo, Company Name, Role, Badge & Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {company?.logo ? (
              <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-0.5">
                {/* eslint-disable-next-html-element-for-img */}
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-full w-full object-contain filter dark:brightness-110"
                />
              </div>
            ) : (
              <Building2 className="h-4 w-4 text-[#57606a] dark:text-[#8b949e]" />
            )}
            <h3 className="font-bold text-sm text-[#0969da] dark:text-[#58a6ff]">
              {company?.name || exp.company}
            </h3>
            <span className="text-xs text-[#57606a] dark:text-[#8b949e] font-mono">
              &bull; {exp.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCurrentRole && (
              <span className="rounded-full border border-[#1f883d]/30 dark:border-[#39d353]/30 bg-[#1f883d]/10 dark:bg-[#39d353]/15 px-2 py-0.5 text-[10px] font-mono font-bold text-[#1f883d] dark:text-[#39d353]">
                Current
              </span>
            )}
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#d0d7de] dark:border-[#30363d] px-2 py-0.5 text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
              <Calendar className="h-3 w-3" />
              <span>{exp.startDate} &mdash; {exp.endDate || "Present"}</span>
            </span>
          </div>
        </div>

        {/* Subtitle if available */}
        {exp.subtitle && (
          <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
            {exp.subtitle}
          </p>
        )}

        {/* 2. Description (identical font size & color to ProjectCard) */}
        <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed line-clamp-2">
          {exp.mission || exp.roleSummary || exp.body}
        </p>
      </div>

      {/* 3. Footer (identical font-mono text-xs styling to ProjectCard) */}
      <div className="flex items-center justify-between pt-2 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
        <div className="flex items-center gap-3">
          {(exp.coreStack.length > 0 || exp.technologies.length > 0) && (
            <span>
              {(exp.coreStack.length > 0 ? exp.coreStack : exp.technologies.slice(0, 4)).join(
                " • "
              )}
            </span>
          )}
          {primaryMetric && (
            <span className="rounded-full border border-[#1f883d]/30 dark:border-[#39d353]/30 px-2 py-0.5 text-[10px] font-mono text-[#1f883d] dark:text-[#39d353]">
              ⚡ {primaryMetric.value} {primaryMetric.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[#0969da] dark:text-[#58a6ff] group-hover:underline">
          <span>Read Case Study</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
