import type { Metadata } from "next";
import { fetchTimeline } from "@/lib/api/services";
import { History } from "lucide-react";
import { TimelineFilter } from "@/components/timeline/TimelineFilter";
import type { TimelineEvent } from "@/lib/api/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Career Milestones & Timeline",
  description: "Chronological history of major engineering achievements, project releases, and pivotal career events.",
};

export default async function TimelinePage() {
  let timeline: TimelineEvent[] = [];
  try {
    timeline = await fetchTimeline();
  } catch (err) {}

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="space-y-1.5 border-b border-[#d0d7de] dark:border-[#30363d] pb-4">
        <h1 className="flex items-center gap-2.5 text-lg font-bold tracking-tight sm:text-xl text-[#24292f] dark:text-[#f0f6fc]">
          <History className="h-4 w-4 sm:h-5 sm:w-5 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Career Milestones & Timeline</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e]">
          Chronological record of education at IIIT Nagpur, software engineering roles at SMS DataTech, and AWS certifications.
        </p>
      </div>

      <TimelineFilter timeline={timeline} />
    </div>
  );
}
