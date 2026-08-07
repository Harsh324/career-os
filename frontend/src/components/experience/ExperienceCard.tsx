import React from "react";
import Link from "next/link";
import { Building2, Calendar, TrendingUp, Zap, Cpu, Cloud } from "lucide-react";
import type { Experience } from "@/lib/api/types";

interface ExperienceCardProps {
  experience: Experience;
  compact?: boolean;
}

export function ExperienceCard({ experience: exp }: ExperienceCardProps) {
  const company = exp.company_detail;
  const detailUrl = `/experience/${exp.slug || "software-engineer-sms"}`;
  const isCurrentRole = exp.current_position || !exp.end_date || exp.end_date.toLowerCase() === "present";
  const metricsList = exp.metrics && exp.metrics.length > 0
    ? exp.metrics
    : [
        { label: "API Speed", value: "+20-30%", icon: TrendingUp },
        { label: "Daily Internal Requests", value: "1,000+", icon: Zap },
        { label: "LLM Extraction", value: "AI Scraping", icon: Cpu },
        { label: "Deployments", value: "AWS ECS/Fargate", icon: Cloud },
      ];
  const techList = exp.technologies_detail ? exp.technologies_detail.slice(0, 5).map((t) => t.name) : [];

  return (
    <Link
      href={detailUrl}
      className="group flex flex-col justify-between rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 hover:shadow-md transition-all no-underline cursor-pointer block"
    >
      <div className="space-y-3">
        {/* 1. Header: Logo, Company Name, Role, Badge & Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {company?.logo ? (
              <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-full w-full object-contain filter dark:brightness-110"
                />
              </div>
            ) : (
              <Building2 className="h-4 w-4 text-[#57606a] dark:text-[#8b949e]" />
            )}
            <h3 className="font-bold text-base text-[#0969da] dark:text-[#58a6ff]">
              {company?.name || "SMS DataTech"}
            </h3>
            <span className="text-xs text-[#57606a] dark:text-[#8b949e] font-mono">
              &bull; {exp.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCurrentRole && (
              <span className="rounded-full border border-[#1f883d]/30 dark:border-[#39d353]/30 bg-[#1f883d]/10 dark:bg-[#39d353]/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#1f883d] dark:text-[#39d353]">
                Current Role
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border border-[#d0d7de] dark:border-[#30363d] px-2.5 py-0.5 text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
              <Calendar className="h-3 w-3" />
              <span>{exp.start_date} &mdash; {exp.end_date || "Present"}</span>
            </span>
          </div>
        </div>

        {/* Enhancement 2: High-Impact Visual Metric Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {metricsList.map((m: any, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-lg border border-[#0969da]/20 dark:border-[#58a6ff]/20 bg-[#0969da]/5 dark:bg-[#58a6ff]/10 px-2.5 py-1 text-[11px] font-mono font-semibold text-[#0969da] dark:text-[#58a6ff]"
            >
              <Zap className="h-3 w-3 text-[#0969da] dark:text-[#58a6ff]" />
              <span>{m.value} {m.label}</span>
            </span>
          ))}
        </div>

        {/* Subtitle */}
        {exp.subtitle && (
          <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
            {exp.subtitle}
          </p>
        )}

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed line-clamp-3">
          {exp.mission || exp.summary}
        </p>
      </div>

      {/* Footer tech list */}
      {techList.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
          {techList.map((tech, tIdx) => (
            <span
              key={tIdx}
              className="rounded-md bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de]/60 dark:border-[#30363d]/60 px-2 py-0.5 text-[10px]"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
