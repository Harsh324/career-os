import React from "react";

interface StatusBadgeProps {
  label: string;
  variant: "green" | "blue" | "gray";
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ label, variant, dot = false, className = "" }: StatusBadgeProps) {
  const baseStyles = "inline-flex items-center gap-1.5 font-mono font-semibold rounded-full px-2.5 py-1 select-none ";
  let variantStyles = "";
  let dotStyles = "";
  
  if (variant === "green") {
    // Green filled: Active status, Current Role, Verified
    variantStyles = "bg-[#1f883d]/10 dark:bg-[#238636]/20 text-[#1f883d] dark:text-[#39d353] border border-[#1f883d]/30 dark:border-[#39d353]/30 text-[11px] shadow-sm";
    dotStyles = "bg-[#1f883d] dark:bg-[#39d353]";
  } else if (variant === "blue") {
    // Blue outlined: Type labels (Full-Time, Internship, Key Milestone)
    variantStyles = "bg-[#0969da]/5 dark:bg-[#58a6ff]/10 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30 dark:border-[#58a6ff]/30 text-[10px]";
    dotStyles = "bg-[#0969da] dark:bg-[#58a6ff]";
  } else if (variant === "gray") {
    // Gray outlined: Neutral metadata
    variantStyles = "bg-[#f6f8fa]/50 dark:bg-[#21262d]/50 text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d] text-[10px]";
    dotStyles = "bg-[#57606a] dark:bg-[#8b949e]";
  }

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {dot && (
        <span className="relative flex h-2 w-2 flex-shrink-0">
          {variant === "green" && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39d353] opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotStyles}`}></span>
        </span>
      )}
      <span>{label}</span>
    </span>
  );
}
