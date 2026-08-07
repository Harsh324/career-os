import React from "react";
import { Award, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import type { Certification } from "@/lib/api/types";

interface CertificationCardProps {
  cert: Certification;
}

export function CertificationCard({ cert }: CertificationCardProps) {
  return (
    <div className="group flex flex-col justify-between rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 sm:p-5 space-y-3 shadow-xs hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 transition-all">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#d97706] dark:text-[#f59e0b] flex-shrink-0" />
            <span className="text-xs font-mono font-semibold text-[#1f883d] dark:text-[#39d353] flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Verified Credential</span>
            </span>
          </div>

          {cert.credential_url && (
            <a
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline"
              aria-label={`Verify ${cert.name}`}
            >
              <span>Verify</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <h3 className="font-bold text-sm sm:text-base text-[#24292f] dark:text-[#f0f6fc] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
          {cert.name}
        </h3>

        <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
          {cert.issuer || "Amazon Web Services"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#57606a] dark:text-[#8b949e] pt-2 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-[#1f883d] dark:text-[#39d353]" />
          <span>Active: {cert.issue_date}</span>
        </span>
        {cert.expiry_date && <span>Expires: {cert.expiry_date}</span>}
      </div>
    </div>
  );
}
