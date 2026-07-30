import type { Metadata } from "next";
import { getCareerSDK } from "@/lib/get-career-os";
import { Cpu } from "lucide-react";
import { getLanguageColor } from "@/lib/language-colors";

export const metadata: Metadata = {
  title: "Skills & Technical Taxonomy",
  description: "Comprehensive breakdown of programming languages, frameworks, cloud infrastructure, and engineering methodologies.",
};

export default async function SkillsPage() {
  const sdk = await getCareerSDK();
  const skillsByCategory = sdk.skillsByCategory();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div className="space-y-3 border-b border-[#d0d7de] dark:border-[#30363d] pb-6 sm:pb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#24292f] dark:text-[#f0f6fc]">
          <Cpu className="h-8 w-8 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Skills & Technical Taxonomy</span>
        </h1>
        <p className="text-sm sm:text-base text-[#57606a] dark:text-[#8b949e]">
          Categorized taxonomy of technical competencies, frameworks, cloud tooling, and engineering methodologies.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(skillsByCategory).map(([category, skills], idx) => (
          <div key={idx} className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 shadow-sm">
            <h2 className="font-mono text-xs font-bold tracking-wider text-[#0969da] dark:text-[#58a6ff] uppercase">
              {category}
            </h2>

            <div className="grid gap-2.5">
              {skills.map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center justify-between rounded-lg bg-[#f6f8fa] dark:bg-[#21262d] p-3 border border-[#d0d7de]/60 dark:border-[#30363d]/60"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getLanguageColor(skill.name) }}
                    />
                    <span className="text-sm font-semibold text-[#24292f] dark:text-[#f0f6fc]">{skill.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {skill.yearsOfExperience && (
                      <span className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                        {skill.yearsOfExperience} yrs
                      </span>
                    )}
                    {skill.level && (
                      <span className="rounded-full bg-[#1f883d]/10 dark:bg-[#238636]/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#1f883d] dark:text-[#39d353] border border-[#1f883d]/30 dark:border-[#39d353]/30 uppercase">
                        {skill.level}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
