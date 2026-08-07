import * as React from "react";

export function GitNodeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Git Content Graph Branch & Nodes */}
      <path d="M6 3v18" />
      <circle cx="6" cy="6" r="3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.2" />
      <path d="M6 12a6 6 0 0 0 6-6h6" />
      <circle cx="18" cy="6" r="3" fill="currentColor" fillOpacity="0.9" />
    </svg>
  );
}
