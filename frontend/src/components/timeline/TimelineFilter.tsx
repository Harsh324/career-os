"use client";

import * as React from "react";
import {
  History,
  Milestone,
  Briefcase,
  GraduationCap,
  Rocket,
  Server,
  Award,
} from "lucide-react";
import type { TimelineEvent } from "@/lib/api/types";

interface TimelineFilterProps {
  timeline: TimelineEvent[];
}

export function TimelineFilter({ timeline }: TimelineFilterProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const categories = React.useMemo(() => {
    const cats = new Set<string>();
    timeline.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [timeline]);

  const filteredItems = React.useMemo(() => {
    if (selectedCategory === "all") return timeline;
    return timeline.filter(
      (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [timeline, selectedCategory]);

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
      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3 py-1 text-xs font-mono font-semibold transition-colors ${
              selectedCategory === "all"
                ? "bg-[#0969da] text-white dark:bg-[#58a6ff] dark:text-[#0d1117]"
                : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d] hover:text-[#0969da] dark:hover:text-[#58a6ff]"
            }`}
          >
            All Events ({timeline.length})
          </button>

          {categories.map((cat) => {
            const count = timeline.filter(
              (i) => i.category?.toLowerCase() === cat.toLowerCase()
            ).length;
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-mono font-semibold capitalize transition-colors ${
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
      <div className="relative border-l-2 border-[#d0d7de] dark:border-[#30363d] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
        {filteredItems.map((item, idx) => (
          <div key={item.slug || idx} className="relative group">
            {/* Timeline Node Icon */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#0969da] dark:text-[#58a6ff] shadow-xs group-hover:border-[#0969da] dark:group-hover:border-[#58a6ff] transition-colors">
              {getIcon(item.icon)}
            </div>

            <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-2 shadow-xs transition-all hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h2 className="text-base sm:text-lg font-bold text-[#24292f] dark:text-[#f0f6fc] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
                  {item.title}
                </h2>
                <span className="text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] rounded-full bg-[#f6f8fa] dark:bg-[#21262d] px-2.5 py-1 border border-[#d0d7de] dark:border-[#30363d] self-start sm:self-auto">
                  {item.date}
                </span>
              </div>

              {item.subtitle && (
                <p className="text-xs font-mono font-semibold text-[#1f883d] dark:text-[#39d353]">
                  {item.subtitle}
                </p>
              )}

              {item.description && (
                <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed pt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
