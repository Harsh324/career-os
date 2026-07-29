import type { Metadata } from "next";
import { getCareerSDK } from "@/lib/get-career-os";
import { Briefcase, Calendar, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Work Experience",
  description: "Detailed breakdown of engineering leadership, systems architecture, and software engineering roles.",
};

export default async function ExperiencePage() {
  const sdk = await getCareerSDK();
  const experiences = sdk.experience();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 border-b border-zinc-800 pb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-100">
          <Briefcase className="h-8 w-8 text-emerald-400" />
          <span>Work Experience</span>
        </h1>
        <p className="text-base text-zinc-400">
          Full history of leadership roles, system architecture work, and software engineering positions.
        </p>
      </div>

      <div className="space-y-12">
        {experiences.map((exp, idx) => (
          <div key={idx} className="relative pl-6 border-l-2 border-zinc-800 space-y-3">
            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-zinc-950" />

            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">{exp.title}</h2>
                <p className="text-sm font-mono font-medium text-emerald-400">{exp.company}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {exp.startDate} &mdash; {exp.endDate || "Present"}
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {exp.location}
                  </span>
                )}
              </div>
            </div>

            {exp.employmentType && (
              <span className="inline-block rounded bg-zinc-900 px-2 py-0.5 text-[11px] font-mono text-zinc-400 ring-1 ring-zinc-800 capitalize">
                {exp.employmentType}
              </span>
            )}

            {exp.body && <p className="text-sm text-zinc-300 leading-relaxed pt-1">{exp.body}</p>}

            {exp.technologies && exp.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {exp.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-mono text-zinc-300 ring-1 ring-zinc-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
