import type { Metadata } from "next";
import { getCareerSDK } from "@/lib/get-career-os";
import { Briefcase } from "lucide-react";
import { ExperienceCard } from "@/components/experience/ExperienceCard";

export const metadata: Metadata = {
  title: "Work Experience & Case Studies",
  description: "Engineering leadership, cloud architecture roles, and backend platform technical case studies.",
};

export default async function ExperiencePage() {
  const sdk = await getCareerSDK();
  const experiences = sdk.experience();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div className="space-y-3 border-b border-[#d0d7de] dark:border-[#30363d] pb-6 sm:pb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#24292f] dark:text-[#f0f6fc]">
          <Briefcase className="h-8 w-8 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Work Experience & Technical Case Studies</span>
        </h1>
        <p className="text-sm sm:text-base text-[#57606a] dark:text-[#8b949e]">
          Engineering leadership, backend platform architecture, cloud infrastructure, and technical ownership.
        </p>
      </div>

      <div className="space-y-6">
        {experiences.map((exp, idx) => (
          <ExperienceCard key={exp.slug || idx} experience={exp} />
        ))}
      </div>
    </div>
  );
}
