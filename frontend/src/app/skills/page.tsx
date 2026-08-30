import type { Metadata } from "next";
import { fetchSkills, fetchCertifications } from "@/lib/api/services";
import { Cpu, Award, Layers } from "lucide-react";
import { CertificationCard } from "@/components/certifications/CertificationCard";
import { TechChip } from "@/components/ui/TechChip";
import type { Skill, Certification } from "@/lib/api/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Technical Skills & Stack | Harsh Tripathi",
  description: "Core technical competencies in Python, Django, Celery, AWS, Docker, databases, and modern software engineering tools.",
};

export default async function SkillsPage() {
  let skills: Skill[] = [];
  let certs: Certification[] = [];

  try {
    const [fetchedSkills, fetchedCerts] = await Promise.all([
      fetchSkills().catch(() => []),
      fetchCertifications().catch(() => []),
    ]);
    skills = Array.isArray(fetchedSkills) ? fetchedSkills : [];
    certs = Array.isArray(fetchedCerts) ? fetchedCerts : [];
  } catch (err) {
    skills = [];
    certs = [];
  }

  // Target visual category order prioritizing Backend & Cloud
  const targetCategoryOrder = [
    "Backend Engineering",
    "Cloud & Infrastructure",
    "Architecture & Distributed Systems",
    "Databases & Caching",
    "AI & Data",
    "DevOps & CI/CD",
    "Supporting Technologies",
  ];

  // Dynamically derive core stack items from backend API (flagged with is_core=true) sorted by order
  const coreSkills = skills
    .filter((sk) => sk.is_core)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Group skills dynamically by category, preserving backend database ordering
  const skillsByCategory: Record<string, Skill[]> = {};
  skills.forEach((sk) => {
    const cat = sk.category || "Backend Engineering";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(sk);
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div className="space-y-1.5 border-b border-[#d0d7de] dark:border-[#30363d] pb-4">
        <h1 className="flex items-center gap-2.5 text-lg font-bold tracking-tight sm:text-xl text-[#24292f] dark:text-[#f0f6fc]">
          <Cpu className="h-4 w-4 sm:h-5 sm:w-5 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Technical Skills & Stack</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e]">
          Core technical competencies across backend engineering, cloud infrastructure, distributed systems, databases, AI/data workloads, and modern development tooling.
        </p>
      </div>

      {skills.length === 0 ? (
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] p-8 text-center text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
          No technical skills records loaded yet.
        </div>
      ) : (
        <>
          {/* Dynamic Core Stack Banner (Derived directly from DB/API) */}
          {coreSkills.length > 0 && (
            <section className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#57606a] dark:text-[#8b949e]">
                <Layers className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                <span>CORE STACK</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-0.5 font-mono text-xs">
                {coreSkills.map((skill) => (
                  <TechChip key={skill.slug || skill.id} name={skill.name} showDot={false} />
                ))}
              </div>
            </section>
          )}

          {/* Verified AWS Certifications Section */}
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
            <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
              Technical Competencies
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {targetCategoryOrder.map((category) => {
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
                      {catSkills.map((skill, sIdx) => (
                        <TechChip key={skill.slug || sIdx} name={skill.name} />
                      ))}
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

