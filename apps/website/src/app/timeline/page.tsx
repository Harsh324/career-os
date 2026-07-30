import type { Metadata } from "next";
import { getCareerSDK } from "@/lib/get-career-os";
import { History, Milestone, Briefcase, GraduationCap, FileCode2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Career Milestones & Timeline",
  description: "Chronological history of major engineering achievements, publications, and pivotal career events.",
};

export default async function TimelinePage() {
  const sdk = await getCareerSDK();
  const timeline = sdk.timeline();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div className="space-y-3 border-b border-[#d0d7de] dark:border-[#30363d] pb-6 sm:pb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#24292f] dark:text-[#f0f6fc]">
          <History className="h-8 w-8 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Career Milestones & Timeline</span>
        </h1>
        <p className="text-sm sm:text-base text-[#57606a] dark:text-[#8b949e]">
          Chronological timeline of pivotal engineering achievements, honors, leadership milestones, and publications.
        </p>
      </div>

      <div className="relative border-l-2 border-[#d0d7de] dark:border-[#30363d] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Node Icon */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#0969da] dark:text-[#58a6ff] shadow-sm group-hover:border-[#0969da] transition-colors">
              {item.type === "milestone" ? (
                <Milestone className="h-3.5 w-3.5" />
              ) : item.type === "education" ? (
                <GraduationCap className="h-3.5 w-3.5" />
              ) : item.type === "publication" ? (
                <FileCode2 className="h-3.5 w-3.5" />
              ) : (
                <Briefcase className="h-3.5 w-3.5" />
              )}
            </div>

            <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-2 shadow-sm transition-all hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h2 className="text-base sm:text-lg font-bold text-[#24292f] dark:text-[#f0f6fc] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
                  {item.title}
                </h2>
                <span className="text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] rounded-full bg-[#f6f8fa] dark:bg-[#21262d] px-2.5 py-1 border border-[#d0d7de] dark:border-[#30363d] self-start sm:self-auto">
                  {item.date}
                </span>
              </div>

              {item.description && (
                <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed pt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
