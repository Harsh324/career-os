import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { fetchExperienceBySlug, fetchExperiences } from "@/lib/api/services";
import { ExperienceDetailView } from "@/components/experience/ExperienceDetailView";
import type { Experience } from "@/lib/api/types";

export const revalidate = 3600;

interface ExperienceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const experiences = await fetchExperiences();
    if (experiences && experiences.length > 0) {
      return experiences.map((exp) => ({ slug: exp.slug }));
    }
  } catch (err) {}
  return [];
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  let exp: Experience | null = null;
  try {
    exp = await fetchExperienceBySlug(slug);
  } catch (e) {}

  if (!exp) {
    return { title: "Experience Not Found" };
  }

  return {
    title: `${exp.title} at ${exp.company_detail?.name || exp.title} — Engineering Details`,
    description: exp.summary || exp.mission || `Engineering details for ${exp.title}`,
  };
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { slug } = await params;
  let exp: Experience | null = null;
  let allExperiences: Experience[] = [];

  try {
    const [fetchedExp, fetchedAllExp] = await Promise.all([
      fetchExperienceBySlug(slug),
      fetchExperiences(),
    ]);
    exp = fetchedExp;
    allExperiences = fetchedAllExp;
  } catch (err) {}

  if (!exp) {
    notFound();
  }

  const currentIndex = allExperiences.findIndex((e) => e.slug === slug);
  const prevExp = currentIndex > 0 ? allExperiences[currentIndex - 1] : undefined;
  const nextExp =
    currentIndex < allExperiences.length - 1 ? allExperiences[currentIndex + 1] : undefined;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Back Navigation Link */}
      <Link
        href="/experience"
        className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0969da] dark:text-[#58a6ff] hover:underline transition-colors group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Back to Work Experience</span>
      </Link>

      {/* Shared Public Experience Detail Presentation */}
      <ExperienceDetailView experience={exp} />

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#d0d7de] dark:border-[#30363d]">
        {prevExp ? (
          <Link
            href={`/experience/${prevExp.slug}`}
            className="group flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3.5 py-2 text-xs font-mono text-[#24292f] dark:text-[#f0f6fc] hover:border-[#0969da] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#0969da] dark:text-[#58a6ff]" />
            <div>
              <span className="block text-[11px] uppercase text-[#8b949e]">Previous Role</span>
              <span className="font-bold">{prevExp.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextExp && (
          <Link
            href={`/experience/${nextExp.slug}`}
            className="group flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3.5 py-2 text-xs font-mono text-[#24292f] dark:text-[#f0f6fc] hover:border-[#0969da] transition-colors ml-auto"
          >
            <div className="text-right">
              <span className="block text-[11px] uppercase text-[#8b949e]">Next Role</span>
              <span className="font-bold">{nextExp.title}</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[#0969da] dark:text-[#58a6ff]" />
          </Link>
        )}
      </div>
    </div>
  );
}
