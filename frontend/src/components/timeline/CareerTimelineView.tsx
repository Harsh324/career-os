"use client";

import React, { useMemo, useState } from "react";
import {
  History,
  Milestone,
  Briefcase,
  GraduationCap,
  Rocket,
  Server,
  Award,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { TimelineEvent } from "@/lib/api/types";

interface CareerTimelineViewProps {
  timeline: TimelineEvent[];
  isDraftPreview?: boolean;
  activeItemSlug?: string;
}

export function CareerTimelineView({
  timeline,
  isDraftPreview = false,
  activeItemSlug,
}: CareerTimelineViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    timeline.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [timeline]);

  const filteredItems = useMemo(() => {
    let items = timeline.filter((item) => isDraftPreview || item.is_published !== false);
    if (selectedCategory !== "all") {
      items = items.filter(
        (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    return items;
  }, [timeline, selectedCategory, isDraftPreview]);

  const getSourceBadge = (sourceType?: string) => {
    switch (sourceType) {
      case "experience":
        return (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
            Experience
          </span>
        );
      case "education":
        return (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
            Education
          </span>
        );
      case "certification":
        return (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            Certification
          </span>
        );
      case "project":
        return (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
            Project
          </span>
        );
      case "manual_milestone":
        return (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            Manual Milestone
          </span>
        );
      default:
        return null;
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap":
        return <GraduationCap className="h-3.5 w-3.5" />;
      case "Rocket":
        return <Rocket className="h-3.5 w-3.5" />;
      case "Server":
        return <Server className="h-3.5 w-3.5" />;
      case "Award":
        return <Award className="h-3.5 w-3.5" />;
      case "Milestone":
        return <Milestone className="h-3.5 w-3.5" />;
      default:
        return <Briefcase className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Pills (rendered only when more than 1 item) */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-2.5 py-1 text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#0969da] text-white dark:bg-[#58a6ff] dark:text-[#0d1117]"
                : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d] hover:text-[#0969da] dark:hover:text-[#58a6ff]"
            }`}
          >
            All Events ({timeline.filter((t) => isDraftPreview || t.is_published !== false).length})
          </button>

          {categories.map((cat) => {
            const count = timeline.filter(
              (i) =>
                (isDraftPreview || i.is_published !== false) &&
                i.category?.toLowerCase() === cat.toLowerCase()
            ).length;
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-mono font-semibold capitalize transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#0969da] text-white dark:bg-[#58a6ff] dark:text-[#0d1117]"
                    : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d] hover:text-[#0969da] dark:hover:text-[#58a6ff]"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Timeline Stream */}
      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] p-8 text-center text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
          No timeline events found.
        </div>
      ) : (
        <div className="relative border-l-2 border-[#d0d7de] dark:border-[#30363d] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
          {filteredItems.map((item, idx) => {
            const isHighlighted =
              activeItemSlug && item.slug === activeItemSlug;
            const isKeyMilestone =
              item.is_milestone ||
              item.title === "Backend & Cloud Engineer" ||
              item.title.includes("AWS") ||
              item.title.includes("Graduat");

            return (
              <div key={item.slug || idx} className="relative group">
                {/* Timeline Node Icon */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white dark:bg-[#161b22] text-[#0969da] dark:text-[#58a6ff] shadow-xs transition-colors ${
                    isHighlighted
                      ? "border-[#0969da] dark:border-[#58a6ff] ring-4 ring-[#0969da]/20 dark:ring-[#58a6ff]/20"
                      : "border-[#d0d7de] dark:border-[#30363d] group-hover:border-[#0969da] dark:group-hover:border-[#58a6ff]"
                  }`}
                >
                  {getIcon(item.icon)}
                </div>

                <div
                  className={`rounded-xl border bg-white dark:bg-[#161b22] p-4 sm:p-5 space-y-2 shadow-xs transition-all hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 hover:shadow-md ${
                    isHighlighted
                      ? "border-[#0969da] dark:border-[#58a6ff] ring-2 ring-[#0969da]/10 dark:ring-[#58a6ff]/10"
                      : isKeyMilestone
                      ? "border-[#0969da]/40 dark:border-[#58a6ff]/40 bg-[#f6f8fa]/30 dark:bg-[#161b22]"
                      : "border-[#d0d7de] dark:border-[#30363d]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
                        {item.title}
                      </h3>
                      {item.is_milestone && (
                        <StatusBadge label="Key Milestone" variant="blue" />
                      )}
                      {item.category && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]">
                          {item.category}
                        </span>
                      )}
                      {getSourceBadge(item.source_type)}
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] rounded-full bg-[#f6f8fa] dark:bg-[#21262d] px-2.5 py-0.5 border border-[#d0d7de] dark:border-[#30363d] self-start sm:self-auto shrink-0">
                      {item.date}
                    </span>
                  </div>

                  {item.subtitle && (
                    <p className="text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff]">
                      {item.subtitle}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {item.link && (
                    <div className="pt-1">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline"
                      >
                        <span>View Verified Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
