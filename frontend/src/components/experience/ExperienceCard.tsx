import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, Calendar, ArrowRight } from "lucide-react";
import { TechChip } from "@/components/ui/TechChip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Experience, Metric } from "@/lib/api/types";

interface ExperienceCardProps {
  experience: Experience;
  compact?: boolean;
}

function deduplicateTechList(techs: string[]): string[] {
  const unique = Array.from(new Set(techs));

  // If specific SQL databases exist, remove generic "SQL"
  const hasSpecificDb = unique.some((t) => /postgres|mysql|sqlite|mariadb/i.test(t));
  let filtered = hasSpecificDb ? unique.filter((t) => t.trim().toLowerCase() !== "sql") : unique;

  // If specific AWS infrastructure exists, remove generic "AWS"
  const hasSpecificAws = filtered.some((t) => /aws ecs|aws lambda|cloudformation|s3|ec2|fargate|dynamodb/i.test(t));
  if (hasSpecificAws) {
    filtered = filtered.filter((t) => t.trim().toLowerCase() !== "aws");
  }

  // If Django REST Framework exists, remove generic "Django"
  const hasDrf = filtered.some((t) => /django rest framework|drf/i.test(t));
  if (hasDrf) {
    filtered = filtered.filter((t) => t.trim().toLowerCase() !== "django");
  }

  return filtered;
}

export function ExperienceCard({ experience: exp }: ExperienceCardProps) {
  const company = exp.company_detail;
  const detailUrl = `/experience/${exp.slug}`;
  const isCurrentRole = exp.current_position || (!exp.end_date || exp.end_date.toLowerCase() === "present");
  const isInternship = exp.employment_type === "internship" || exp.slug?.includes("intern");
  const isFullTime = exp.employment_type === "full-time";

  const displaySummary = exp.summary || exp.mission || "";
  const rawTechList = exp.technologies_detail
    ? exp.technologies_detail.map((t) => t.name)
    : [];
  const displayTechList = deduplicateTechList(rawTechList);
  const metricsList = exp.metrics && exp.metrics.length > 0 ? exp.metrics : [];

  return (
    <Link
      href={detailUrl}
      className={`group flex flex-col justify-between rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] ${
        isInternship ? "p-4 space-y-3 bg-[#f6f8fa]/40 dark:bg-[#161b22]/70" : "p-5 space-y-4"
      } shadow-xs hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 hover:shadow-md transition-all no-underline cursor-pointer block`}
    >
      <div className="space-y-3">
        {/* 1. Header: Logo, Company Name, Role */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {company?.logo ? (
              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-transparent p-0.5">
                <Image
                  src={company.logo}
                  alt={company.name}
                  fill
                  className="object-contain invert dark:invert-0 p-0.5"
                />
              </div>
            ) : (
              <Building2 className="h-5 w-5 text-[#57606a] dark:text-[#8b949e]" />
            )}
            <div>
              <h3 className="font-bold text-base text-[#24292f] dark:text-[#f0f6fc] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
                {company?.name || exp.title}
              </h3>
              <p className="text-xs font-mono text-[#0969da] dark:text-[#58a6ff] font-semibold">
                {exp.title}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isCurrentRole && (
              <StatusBadge label="Current Role" variant="green" />
            )}
            {isFullTime && !isCurrentRole && (
              <StatusBadge label="Full-Time" variant="blue" />
            )}
            {isInternship && (
              <StatusBadge label="Internship Transitioned to Full-Time" variant="gray" />
            )}
            <span className="inline-flex items-center gap-1 rounded-full border border-[#d0d7de] dark:border-[#30363d] px-2.5 py-0.5 text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
              <Calendar className="h-3 w-3 text-[#57606a] dark:text-[#8b949e]" />
              <span>{exp.start_date} &mdash; {exp.end_date || "Present"}</span>
            </span>
          </div>
        </div>

        {/* 2. Impact Metrics (Only displayed when real metrics exist) */}
        {metricsList.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {metricsList.map((m: Metric, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#1f883d]/25 dark:border-[#39d353]/25 bg-[#1f883d]/5 dark:bg-[#39d353]/10 px-2.5 py-1 text-xs font-mono font-semibold text-[#1f883d] dark:text-[#39d353]"
              >
                <span>{m.value}</span>
                <span className="text-[#57606a] dark:text-[#8b949e] font-normal">{m.label}</span>
              </span>
            ))}
          </div>
        )}

        {/* 3. Short Summary */}
        <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed">
          {displaySummary}
        </p>
      </div>

      {/* 4. Compact Secondary Technology Tags & Details Link */}
      <div className="space-y-3">
        {displayTechList.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
            {displayTechList.map((tech, tIdx) => (
              <TechChip key={tIdx} name={tech} />
            ))}
          </div>
        )}

        <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] group-hover:underline flex-shrink-0">
          <span>Details</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}


