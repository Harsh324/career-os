"use client";

import React from "react";
import type { SiteSettings } from "@/lib/api/types";

export interface ProfileHeroBannerProps {
  meta: SiteSettings;
}

export function ProfileHeroBanner({ meta }: ProfileHeroBannerProps) {
  return (
    <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 sm:p-5 shadow-xs space-y-3 hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 hover:shadow-md transition-all duration-200">
      <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
        {meta.title || "Your Professional Title"}
      </h2>
      <p className="text-sm text-[#57606a] dark:text-[#c9d1d9] leading-relaxed font-sans">
        {meta.summary || "Your narrative professional bio summary..."}
      </p>

      {/* Dynamic Engineering Focus Row */}
      {meta.engineering_focus && meta.engineering_focus.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
          <span className="font-bold text-[#24292f] dark:text-[#f0f6fc]">Engineering Focus:</span>
          {meta.engineering_focus.map((focus, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>&bull;</span>}
              <span className="text-[#0969da] dark:text-[#58a6ff] font-semibold">{focus}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
