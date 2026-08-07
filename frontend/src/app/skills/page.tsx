import type { Metadata } from "next";
import { fetchSkills, fetchCertifications } from "@/lib/api/services";
import { Cpu, Code2, Award } from "lucide-react";
import { getLanguageColor } from "@/lib/language-colors";
import { CertificationCard } from "@/components/certifications/CertificationCard";
import type { Skill, Certification } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "Skills & Technical Taxonomy",
  description: "Comprehensive breakdown of programming languages, frameworks, cloud infrastructure, AWS certifications, and engineering methodologies.",
};

export default async function SkillsPage() {
  let skills: Skill[] = [];
  let certs: Certification[] = [];

  try {
    const [fetchedSkills, fetchedCerts] = await Promise.all([
      fetchSkills(),
      fetchCertifications(),
    ]);
    skills = fetchedSkills;
    certs = fetchedCerts;
  } catch (err) {}

  const skillsByCategory: Record<string, Skill[]> = {};
  skills.forEach((sk) => {
    const cat = sk.category || "General";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(sk);
  });

  const totalSkills = skills.length || 1;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-1.5 border-b border-[#d0d7de] dark:border-[#30363d] pb-4">
        <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight sm:text-2xl text-[#24292f] dark:text-[#f0f6fc]">
          <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Skills & Technical Taxonomy</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e]">
          Categorized taxonomy of technical competencies, frameworks, cloud tooling, verified AWS certifications, and engineering methodologies.
        </p>
      </div>

      {/* GitHub Signature Multi-Segment Language Bar */}
      {skills.length > 0 && (
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 font-semibold text-[#24292f] dark:text-[#f0f6fc]">
              <Code2 className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
              <span>Technology & Stack Distribution</span>
            </span>
            <span className="text-[#57606a] dark:text-[#8b949e]">
              {skills.length} Total Competencies
            </span>
          </div>

          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#f6f8fa] dark:bg-[#21262d]">
            {skills.slice(0, 10).map((sk, idx) => {
              const color = getLanguageColor(sk.name);
              const flexWidth = Math.max(1, Math.round((1 / totalSkills) * 100));
              return (
                <div
                  key={sk.slug || idx}
                  style={{ width: `${flexWidth}%`, backgroundColor: color }}
                  title={`${sk.name} (${sk.experience_level})`}
                  className="h-full transition-all"
                />
              );
            })}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-mono text-[#57606a] dark:text-[#8b949e] pt-1">
            {skills.slice(0, 6).map((sk, idx) => (
              <div key={sk.slug || idx} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: getLanguageColor(sk.name) }}
                />
                <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">{sk.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified AWS Certifications Section */}
      {certs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#d0d7de] dark:border-[#30363d] pb-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc]">
              <Award className="h-5 w-5 text-[#d97706] dark:text-[#f59e0b]" />
              <span>Verified AWS Certifications</span>
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

      {/* Categorized Skills Grid */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-[#24292f] dark:text-[#f0f6fc]">
          Technical Competencies
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(skillsByCategory).map(([category, catSkills], idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
                <h3 className="font-mono text-xs font-bold tracking-wider text-[#0969da] dark:text-[#58a6ff] uppercase">
                  {category}
                </h3>
                <span className="rounded-full bg-[#afb8c1]/20 dark:bg-[#6e7681]/40 px-2 py-0.5 text-[11px] font-mono text-[#24292f] dark:text-[#c9d1d9]">
                  {catSkills.length}
                </span>
              </div>

              <div className="grid gap-2.5">
                {catSkills.map((skill, sIdx) => (
                  <div
                    key={skill.slug || sIdx}
                    className="flex flex-col space-y-2 rounded-lg bg-[#f6f8fa] dark:bg-[#21262d] p-3 border border-[#d0d7de]/60 dark:border-[#30363d]/60 hover:border-[#0969da]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getLanguageColor(skill.name) }}
                        />
                        <span className="text-sm font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                          {skill.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {skill.years && (
                          <span className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                            {skill.years} {skill.years === 1 ? "yr" : "yrs"}
                          </span>
                        )}
                        {skill.experience_level && (
                          <span className="rounded-full bg-[#1f883d]/10 dark:bg-[#238636]/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#1f883d] dark:text-[#39d353] border border-[#1f883d]/30 dark:border-[#39d353]/30 uppercase">
                            {skill.experience_level}
                          </span>
                        )}
                      </div>
                    </div>

                    {skill.technologies_detail && skill.technologies_detail.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#d0d7de]/40 dark:border-[#30363d]/40">
                        {skill.technologies_detail.map((tech, tIdx) => (
                          <span
                            key={tech.slug || tIdx}
                            className="rounded-md bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] px-2 py-0.5 text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
