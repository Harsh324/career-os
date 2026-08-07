import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchExperienceBySlug, fetchExperiences, fetchProjects, fetchBlogPosts } from "@/lib/api/services";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BookOpen,
  Layers,
  Cpu,
  Sparkles,
  FileText,
} from "lucide-react";
import { getLanguageColor } from "@/lib/language-colors";

interface ExperienceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  let exp = null;
  try {
    exp = await fetchExperienceBySlug(slug);
  } catch (e) {}

  if (!exp) {
    return { title: "Experience Case Study Not Found" };
  }

  return {
    title: `${exp.title} at ${exp.company_detail?.name || "Company"} — Technical Case Study`,
    description: exp.summary || exp.mission || `Engineering case study for ${exp.title}`,
  };
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { slug } = await params;
  let exp = null;
  let allExperiences: any[] = [];

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

  const company = exp.company_detail;

  const currentIndex = allExperiences.findIndex((e) => e.slug === slug);
  const prevExp = currentIndex > 0 ? allExperiences[currentIndex - 1] : undefined;
  const nextExp =
    currentIndex < allExperiences.length - 1 ? allExperiences[currentIndex + 1] : undefined;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Navigation Link */}
      <Link
        href="/experience"
        className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0969da] dark:text-[#58a6ff] hover:underline transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Work Experience</span>
      </Link>

      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-6">
          <div className="flex items-start gap-4">
            {company?.logo ? (
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-2 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-full w-full object-contain filter dark:brightness-110"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff]">
                <Building2 className="h-8 w-8" />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24292f] dark:text-[#f0f6fc]">
                  {exp.title}
                </h1>
                {exp.employment_type && (
                  <span className="rounded-full bg-[#0969da]/10 dark:bg-[#58a6ff]/15 border border-[#0969da]/30 dark:border-[#58a6ff]/30 px-3 py-1 text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] capitalize">
                    {exp.employment_type}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                <span className="text-base font-bold text-[#24292f] dark:text-[#f0f6fc]">
                  {company?.name || "SMS DataTech"}
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#57606a] dark:text-[#8b949e]" />
                    <span>{exp.location}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
                  <span>
                    {exp.start_date} &mdash; {exp.end_date || "Present"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {company?.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0969da] dark:bg-[#58a6ff] px-4 py-2 text-xs font-mono font-semibold text-white dark:text-[#0d1117] hover:bg-[#085ac1] dark:hover:bg-[#4796efff] transition-all shadow-xs"
              >
                <span>Official Website</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {exp.mission && (
          <div className="space-y-2">
            <h2 className="text-[10px] font-mono font-bold text-[#57606a] dark:text-[#8b949e] uppercase tracking-wider">
              Engineering Mission
            </h2>
            <p className="text-sm sm:text-base font-semibold text-[#24292f] dark:text-[#c9d1d9] leading-relaxed max-w-3xl">
              {exp.mission}
            </p>
          </div>
        )}
      </div>

      {/* ABOUT COMPANY & ROLE */}
      <div className="grid gap-8 sm:grid-cols-2">
        {company && (
          <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
              <Building2 className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
              <span>About {company.name}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed">
              {company.description}
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <ShieldCheck className="h-4 w-4 text-[#1f883d] dark:text-[#39d353]" />
            <span>Role Scope & Ownership</span>
          </h3>
          {exp.team && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#8b949e]">Team</span>
              <p className="text-xs sm:text-sm text-[#24292f] dark:text-[#c9d1d9]">{exp.team}</p>
            </div>
          )}
          {exp.ownership && (
            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-mono font-bold uppercase text-[#8b949e]">Ownership</span>
              <p className="text-xs sm:text-sm text-[#24292f] dark:text-[#c9d1d9]">{exp.ownership}</p>
            </div>
          )}
        </div>
      </div>

      {/* HIGHLIGHTS */}
      {exp.highlights && exp.highlights.length > 0 && (
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 sm:p-7 space-y-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <Sparkles className="h-5 w-5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Key Engineering Contributions</span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {exp.highlights.map((highlight: string, hIdx: number) => (
              <div
                key={hIdx}
                className="flex items-start gap-3 rounded-xl border border-[#d0d7de]/60 dark:border-[#30363d]/60 bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60 p-4 text-xs sm:text-sm text-[#24292f] dark:text-[#c9d1d9]"
              >
                <CheckCircle2 className="h-5 w-5 text-[#1f883d] dark:text-[#39d353] mt-0.5 flex-shrink-0" />
                <span className="font-medium leading-relaxed">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TECHNICAL CHALLENGES */}
      {exp.challenges && exp.challenges.length > 0 && (
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 sm:p-7 space-y-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <Zap className="h-5 w-5 text-[#d97706] dark:text-[#f59e0b]" />
            <span>Technical Challenges & Solutions</span>
          </h3>
          <div className="space-y-6">
            {exp.challenges.map((c: any, cIdx: number) => (
              <div key={cIdx} className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/50 dark:bg-[#0d1117]/50 p-5 space-y-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#cf222e] dark:text-[#ff7b72]">Problem</span>
                  <p className="text-xs sm:text-sm font-semibold text-[#24292f] dark:text-[#f0f6fc]">{c.problem}</p>
                </div>
                <div className="border-t border-[#d0d7de]/40 dark:border-[#30363d]/40 pt-3">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#0969da] dark:text-[#58a6ff]">Solution</span>
                  <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e]">{c.solution}</p>
                </div>
                {c.impact && (
                  <div className="border-t border-[#d0d7de]/40 dark:border-[#30363d]/40 pt-3">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#1f883d] dark:text-[#39d353]">Impact</span>
                    <p className="text-xs sm:text-sm font-semibold text-[#1f883d] dark:text-[#39d353]">{c.impact}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* METRICS */}
      {exp.metrics && exp.metrics.length > 0 && (
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <Zap className="h-5 w-5 text-[#1f883d] dark:text-[#39d353]" />
            <span>Engineering Metrics</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {exp.metrics.map((m: any, mIdx: number) => (
              <div key={mIdx} className="rounded-xl border border-[#1f883d]/30 dark:border-[#39d353]/30 bg-[#1f883d]/10 dark:bg-[#238636]/20 p-4 text-center space-y-1">
                <span className="block text-2xl sm:text-3xl font-extrabold font-mono text-[#1f883d] dark:text-[#39d353]">{m.value}</span>
                <span className="block text-xs font-mono text-[#57606a] dark:text-[#8b949e]">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#d0d7de] dark:border-[#30363d]">
        {prevExp ? (
          <Link href={`/experience/${prevExp.slug}`} className="group flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-4 py-3 text-xs font-mono text-[#24292f] dark:text-[#f0f6fc] hover:border-[#0969da] transition-colors">
            <ArrowLeft className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
            <div>
              <span className="block text-[9px] uppercase text-[#8b949e]">Previous Role</span>
              <span className="font-bold">{prevExp.title}</span>
            </div>
          </Link>
        ) : <div />}

        {nextExp && (
          <Link href={`/experience/${nextExp.slug}`} className="group flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-4 py-3 text-xs font-mono text-[#24292f] dark:text-[#f0f6fc] hover:border-[#0969da] transition-colors ml-auto">
            <div className="text-right">
              <span className="block text-[9px] uppercase text-[#8b949e]">Next Role</span>
              <span className="font-bold">{nextExp.title}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
          </Link>
        )}
      </div>
    </div>
  );
}
