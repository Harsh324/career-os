import React from "react";
import { Cpu, Award, Layers, Sparkles } from "lucide-react";
import { CertificationCard } from "@/components/certifications/CertificationCard";
import { TechChip } from "@/components/ui/TechChip";
import type { Skill, Certification } from "@/lib/api/types";

interface SkillMatrixViewProps {
  skills: Skill[];
  certs?: Certification[];
  isDraftPreview?: boolean;
}

const TARGET_CATEGORY_ORDER = [
  "Backend Engineering",
  "Cloud & Infrastructure",
  "Architecture & Distributed Systems",
  "Databases & Caching",
  "AI & Data",
  "DevOps & CI/CD",
  "Supporting Technologies",
];

const PROFICIENCY_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  expert: {
    label: "Expert",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
  advanced: {
    label: "Advanced",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-500",
  },
  proficient: {
    label: "Proficient",
    badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    dotClass: "bg-purple-500",
  },
  familiar: {
    label: "Familiar",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  learning: {
    label: "Learning",
    badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
    dotClass: "bg-slate-500",
  },
};

export function SkillMatrixView({
  skills,
  certs = [],
  isDraftPreview = false,
}: SkillMatrixViewProps) {
  // Dynamically derive core stack items from backend API (flagged with is_core=true) sorted by order
  const coreSkills = skills
    .filter((sk) => sk.is_core && (isDraftPreview ? true : sk.is_published !== false))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Group skills dynamically by category, preserving backend database ordering
  const skillsByCategory: Record<string, Skill[]> = {};
  skills.forEach((sk) => {
    if (!isDraftPreview && sk.is_published === false) return;
    const cat = sk.category || "Backend Engineering";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(sk);
  });

  // Collect any categories present in skills that might not be in the default list
  const allCategories = Array.from(
    new Set([...TARGET_CATEGORY_ORDER, ...Object.keys(skillsByCategory)])
  );

  return (
    <div className="space-y-6">
      {/* Page Header (Rendered only if not in preview modal or handled inside modal header) */}
      {!isDraftPreview && (
        <div className="space-y-1.5 border-b border-[#d0d7de] dark:border-[#30363d] pb-4">
          <h1 className="flex items-center gap-2.5 text-lg font-bold tracking-tight sm:text-xl text-[#24292f] dark:text-[#f0f6fc]">
            <Cpu className="h-4 w-4 sm:h-5 sm:w-5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Technical Skills & Stack</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e]">
            Core technical competencies across backend engineering, cloud infrastructure, distributed systems, databases, AI/data workloads, and modern development tooling.
          </p>
        </div>
      )}

      {skills.length === 0 ? (
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] p-8 text-center text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
          No technical skills records loaded yet.
        </div>
      ) : (
        <>
          {/* Dynamic Core Stack Banner (Derived directly from DB/API) */}
          {coreSkills.length > 0 && (
            <section className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between font-mono text-xs font-bold text-[#57606a] dark:text-[#8b949e]">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                  <span>CORE STACK</span>
                </div>
                <span className="text-[10px] font-normal text-[#57606a] dark:text-[#8b949e]">
                  {coreSkills.length} Primary Competencies
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-0.5 font-mono text-xs">
                {coreSkills.map((skill) => (
                  <TechChip key={skill.slug || skill.id} name={skill.name} showDot={false} />
                ))}
              </div>
            </section>
          )}

          {/* Verified AWS Certifications Section (if certs provided) */}
          {certs.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#d0d7de] dark:border-[#30363d] pb-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                  <Award className="h-5 w-5 text-[#d97706] dark:text-[#f59e0b]" />
                  <span>AWS Certifications</span>
                </h2>
                <span className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                  Amazon Web Services
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {certs.map((cert) => (
                  <CertificationCard key={cert.slug || cert.id} cert={cert} />
                ))}
              </div>
            </section>
          )}

          {/* Categorized Skills Grid (Strictly Ordered by Backend & Cloud Priority) */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] flex items-center justify-between">
              <span>Technical Competencies</span>
              <span className="text-xs font-mono font-normal text-[#57606a] dark:text-[#8b949e]">
                {skills.filter((s) => isDraftPreview || s.is_published !== false).length} Total Skills
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {allCategories.map((category) => {
                const catSkills = skillsByCategory[category] || [];
                if (catSkills.length === 0) return null;
                return (
                  <div
                    key={category}
                    className={`rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs ${
                      category === "Supporting Technologies" ? "md:col-span-2" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
                      <h3 className="font-mono text-[11px] font-bold tracking-wider text-[#0969da] dark:text-[#58a6ff] uppercase">
                        {category}
                      </h3>
                      <span className="rounded-full bg-[#afb8c1]/20 dark:bg-[#6e7681]/40 px-2 py-0.5 text-[11px] font-mono text-[#24292f] dark:text-[#c9d1d9]">
                        {catSkills.length}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((skill, sIdx) => {
                        const prof = PROFICIENCY_CONFIG[skill.proficiency?.toLowerCase()] || PROFICIENCY_CONFIG.advanced;
                        return (
                          <div
                            key={skill.slug || sIdx}
                            className="group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-xs font-mono text-[#24292f] dark:text-[#c9d1d9] hover:border-[#0969da] dark:hover:border-[#58a6ff] transition-all"
                            title={skill.description || skill.evidence_context || `${skill.name} (${prof.label})`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${prof.dotClass}`} />
                            <span className="font-medium text-[#24292f] dark:text-[#f0f6fc]">
                              {skill.name}
                            </span>
                            {skill.is_core && (
                              <span title="Core Stack">
                                <Sparkles className="w-3 h-3 text-[#d97706] dark:text-[#f59e0b]" />
                              </span>
                            )}
                            {skill.years > 0 && (
                              <span className="text-[10px] text-[#57606a] dark:text-[#8b949e]">
                                {skill.years}y
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
