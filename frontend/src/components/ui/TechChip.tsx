import React from "react";
import { getLanguageColor } from "@/lib/language-colors";

interface TechChipProps {
  name: string;
  size?: "xs" | "sm";
  showDot?: boolean;
}

export function TechChip({ name, size = "xs", showDot = true }: TechChipProps) {
  const isSm = size === "sm";
  
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de]/60 dark:border-[#30363d]/60 font-mono font-medium text-[#24292f] dark:text-[#c9d1d9] hover:border-[#0969da]/60 dark:hover:border-[#58a6ff]/60 hover:text-[#0969da] dark:hover:text-[#58a6ff] hover:bg-[#0969da]/5 dark:hover:bg-[#58a6ff]/10 transition-colors select-none ${
        isSm ? "px-2.5 py-1 text-sm" : "px-2 py-0.5 text-[11px]"
      }`}
    >
      {showDot && (
        <span
          className={`${isSm ? "h-3 w-3" : "h-2 w-2"} rounded-full flex-shrink-0`}
          style={{ backgroundColor: getLanguageColor(name) }}
        />
      )}
      <span>{name}</span>
    </div>
  );
}
