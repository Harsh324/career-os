import type { Metadata } from "next";
import { getCareerSDK } from "@/lib/get-career-os";
import { History, Calendar, Rocket, Award as AwardIcon, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Career Milestones & Timeline",
  description: "Chronological narrative of key career chapters, milestones, and achievements.",
};

export default async function TimelinePage() {
  const sdk = await getCareerSDK();
  const timeline = sdk.timeline();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 border-b border-zinc-800 pb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-100">
          <History className="h-8 w-8 text-emerald-400" />
          <span>Career Milestones</span>
        </h1>
        <p className="text-base text-zinc-400">
          Chronological narrative of major career chapters, achievements, and milestones.
        </p>
      </div>

      <div className="space-y-8 relative pl-6 border-l-2 border-zinc-800">
        {timeline.map((event, idx) => (
          <div key={idx} className="relative space-y-2">
            <div className="absolute -left-[31px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-emerald-400 ring-2 ring-emerald-500/40">
              {event.type === "milestone" ? (
                <Rocket className="h-3 w-3" />
              ) : event.type === "career" ? (
                <Briefcase className="h-3 w-3" />
              ) : (
                <AwardIcon className="h-3 w-3" />
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 font-semibold">
                <Calendar className="h-3.5 w-3.5" />
                {event.date}
              </span>
              <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-400 ring-1 ring-zinc-800 uppercase">
                {event.type}
              </span>
            </div>

            <h2 className="text-xl font-bold text-zinc-100">{event.title}</h2>

            {event.description && (
              <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">{event.description}</p>
            )}

            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {event.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-[11px] font-mono text-zinc-500">
                    #{tag}
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
