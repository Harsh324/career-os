import React from "react";
import {
  Award,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
  Briefcase,
  FolderGit2,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import type { Certification } from "@/lib/api/types";
import { TechChip } from "@/components/ui/TechChip";

interface CertificationDetailViewProps {
  cert: Certification;
  isDraftPreview?: boolean;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function CertificationDetailView({ cert, isDraftPreview = false }: CertificationDetailViewProps) {
  const issueLabel = formatDate(cert.issue_date);
  const expiryLabel = cert.does_not_expire ? "Does not expire" : formatDate(cert.expiry_date);

  const statusConfig = {
    verified: {
      label: "Verified Credential",
      bg: "bg-[#dafbe1] dark:bg-[#1f883d]/20",
      text: "text-[#1a7f37] dark:text-[#3fb950]",
      border: "border-[#1a7f37]/30 dark:border-[#3fb950]/30",
      icon: CheckCircle2,
    },
    in_progress: {
      label: "In Progress",
      bg: "bg-[#fff8c5] dark:bg-[#9e6a03]/20",
      text: "text-[#9a6700] dark:text-[#d29922]",
      border: "border-[#9a6700]/30 dark:border-[#d29922]/30",
      icon: Clock,
    },
    expired: {
      label: "Expired",
      bg: "bg-[#ffebe9] dark:bg-[#cf222e]/20",
      text: "text-[#cf222e] dark:text-[#ff7b72]",
      border: "border-[#cf222e]/30 dark:border-[#ff7b72]/30",
      icon: AlertTriangle,
    },
  }[cert.verification_status || "verified"] || {
    label: "Verified Credential",
    bg: "bg-[#dafbe1] dark:bg-[#1f883d]/20",
    text: "text-[#1a7f37] dark:text-[#3fb950]",
    border: "border-[#1a7f37]/30 dark:border-[#3fb950]/30",
    icon: CheckCircle2,
  };

  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusConfig.label}</span>
            </span>

            {cert.category && (
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]">
                {cert.category}
              </span>
            )}
          </div>

          {cert.credential_url && (
            <a
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] bg-[#0969da]/10 dark:bg-[#58a6ff]/10 hover:bg-[#0969da]/20 dark:hover:bg-[#58a6ff]/20 transition-colors"
            >
              <span>Verify Official Credential</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#24292f] dark:text-[#f0f6fc] tracking-tight">
            {cert.name}
          </h1>
          <p className="text-sm font-mono font-medium text-[#0969da] dark:text-[#58a6ff] mt-1">
            {cert.issuer}
          </p>
        </div>

        {/* Credential Metadata Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 font-mono text-xs text-[#57606a] dark:text-[#8b949e]">
          {cert.credential_id && (
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#57606a] dark:text-[#8b949e]">
                Credential ID
              </span>
              <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9] truncate block" title={cert.credential_id}>
                {cert.credential_id}
              </span>
            </div>
          )}

          <div>
            <span className="block text-[10px] uppercase font-bold text-[#57606a] dark:text-[#8b949e]">
              Issued
            </span>
            <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">
              {issueLabel || cert.issue_date || "N/A"}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase font-bold text-[#57606a] dark:text-[#8b949e]">
              Expiration
            </span>
            <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">
              {expiryLabel || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Description / Competency Summary */}
      {cert.description && (
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-2.5 shadow-xs">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Validated Competency & Scope</span>
          </h2>
          <p className="text-sm text-[#24292f] dark:text-[#c9d1d9] leading-relaxed">
            {cert.description}
          </p>
        </section>
      )}

      {/* Connected Evidence Graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Validated Skills */}
        {cert.related_skills_detail && cert.related_skills_detail.length > 0 && (
          <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between font-mono text-xs font-bold text-[#57606a] dark:text-[#8b949e] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#8957e5] dark:text-[#a371f7]" />
                <span>Validated Skills ({cert.related_skills_detail.length})</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cert.related_skills_detail.map((sk) => (
                <span
                  key={sk.slug || sk.name}
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[#f6f8fa] dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] border border-[#d0d7de] dark:border-[#30363d]"
                >
                  {sk.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Technologies Covered */}
        {cert.related_technologies_detail && cert.related_technologies_detail.length > 0 && (
          <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between font-mono text-xs font-bold text-[#57606a] dark:text-[#8b949e] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Technologies ({cert.related_technologies_detail.length})</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-xs">
              {cert.related_technologies_detail.map((tech) => (
                <TechChip key={tech.slug || tech.name} name={tech.name} showDot={false} />
              ))}
            </div>
          </div>
        )}

        {/* Connected Experience Records */}
        {cert.related_experiences_detail && cert.related_experiences_detail.length > 0 && (
          <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between font-mono text-xs font-bold text-[#57606a] dark:text-[#8b949e] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#1a7f37] dark:text-[#3fb950]" />
                <span>Applied in Production</span>
              </span>
            </div>
            <div className="space-y-2 pt-1">
              {cert.related_experiences_detail.map((exp) => (
                <div key={exp.slug || exp.id} className="text-xs">
                  <div className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                    {exp.title}
                  </div>
                  <div className="text-[#57606a] dark:text-[#8b949e] font-mono text-[11px]">
                    {exp.company_name} &bull; {exp.start_date} – {exp.current_position ? "Present" : exp.end_date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected Projects */}
        {cert.related_projects_detail && cert.related_projects_detail.length > 0 && (
          <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between font-mono text-xs font-bold text-[#57606a] dark:text-[#8b949e] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
              <span className="flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Demonstrated in Projects</span>
              </span>
            </div>
            <div className="space-y-2 pt-1">
              {cert.related_projects_detail.map((proj) => (
                <div key={proj.slug || proj.id} className="text-xs">
                  <div className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                    {proj.title}
                  </div>
                  <div className="text-[#57606a] dark:text-[#8b949e] font-mono text-[11px] capitalize">
                    {proj.project_type} &bull; {proj.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
