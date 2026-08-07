import type { Metadata } from "next";
import { fetchExperiences } from "@/lib/api/services";
import { Briefcase } from "lucide-react";
import { ExperienceCard } from "@/components/experience/ExperienceCard";

export const metadata: Metadata = {
  title: "Work Experience",
  description: "Software engineering leadership, backend platform architecture, and cloud infrastructure experience.",
};

export default async function ExperiencePage() {
  let experiences: any[] = [];
  try {
    experiences = await fetchExperiences();
  } catch (err) {
    // API fallback
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1.5 border-b border-[#d0d7de] dark:border-[#30363d] pb-4">
        <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight sm:text-2xl text-[#24292f] dark:text-[#f0f6fc]">
          <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Work Experience</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e]">
          Software engineering leadership, backend platform architecture, cloud infrastructure, and technical ownership.
        </p>
      </div>

      <div className="space-y-4">
        {experiences.map((exp, idx) => (
          <ExperienceCard key={exp.slug || idx} experience={exp} />
        ))}
      </div>
    </div>
  );
}
