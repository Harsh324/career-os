import type { Metadata } from "next";
import { getCareerSDK } from "@/lib/get-career-os";
import { Cpu, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Skills & Technical Taxonomy",
  description: "Comprehensive breakdown of programming languages, frameworks, cloud infrastructure, and engineering methodologies.",
};

export default async function SkillsPage() {
  const sdk = await getCareerSDK();
  const skillsByCategory = sdk.skillsByCategory();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      <div className="space-y-3 border-b border-zinc-800 pb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-100">
          <Cpu className="h-8 w-8 text-emerald-400" />
          <span>Skills & Technical Taxonomy</span>
        </h1>
        <p className="text-base text-zinc-400">
          Categorized taxonomy of technical competencies, frameworks, cloud tooling, and engineering methodologies.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {Object.entries(skillsByCategory).map(([category, skills], idx) => (
          <div key={idx} className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-4">
            <h2 className="font-mono text-sm font-bold tracking-wider text-emerald-400 uppercase">
              {category}
            </h2>

            <div className="grid gap-3">
              {skills.map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center justify-between rounded-lg bg-zinc-900/80 p-3 ring-1 ring-zinc-800"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-zinc-200">{skill.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {skill.yearsOfExperience && (
                      <span className="text-xs font-mono text-zinc-500">
                        {skill.yearsOfExperience} yrs
                      </span>
                    )}
                    {skill.level && (
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400 ring-1 ring-emerald-500/30 uppercase">
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
