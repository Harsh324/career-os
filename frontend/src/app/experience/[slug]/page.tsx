import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 3600;
import Link from "next/link";
import { fetchExperienceBySlug, fetchExperiences } from "@/lib/api/services";
import type { Experience, TechnicalChallenge, Metric } from "@/lib/api/types";
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
  Sparkles,
  Award,
  Layers,
} from "lucide-react";

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
  return [
    { slug: "software-engineer-sms-datatech" },
    { slug: "software-engineer-intern-sms-datatech" },
  ];
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

  const company = exp.company_detail;
  const isInternship = exp.employment_type === "internship" || slug.includes("intern");

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

      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-4">
          <div className="flex items-start gap-3.5">
            {company?.logo ? (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-transparent p-1.5 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-full w-full object-contain invert dark:invert-0"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff]">
                <Building2 className="h-6 w-6" />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
                  {exp.title}
                </h1>
                {exp.employment_type && (
                  <span className="rounded-full bg-[#0969da]/10 dark:bg-[#58a6ff]/15 border border-[#0969da]/30 dark:border-[#58a6ff]/30 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] capitalize">
                    {exp.employment_type}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
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

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {company?.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0969da] dark:bg-[#58a6ff] px-3 py-1.5 text-xs font-mono font-semibold text-white dark:text-[#0d1117] hover:bg-[#085ac1] dark:hover:bg-[#4796efff] transition-all shadow-xs"
              >
                <span>Official Website</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {exp.mission && (
          <div className="space-y-1">
            <h2 className="text-[10px] font-mono font-bold text-[#57606a] dark:text-[#8b949e] uppercase tracking-wider">
              {isInternship ? "Internship Overview" : "Engineering Mission"}
            </h2>
            <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed max-w-3xl font-medium">
              {isInternship
                ? "Backend engineering internship focused on Django REST Framework and MySQL development for the POGO internal dashboard."
                : exp.mission}
            </p>
          </div>
        )}
      </div>

      {/* KEY CONTRIBUTIONS / WHAT I WORKED ON */}
      {exp.highlights && exp.highlights.length > 0 && (
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-3.5 shadow-xs">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
            <Sparkles className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
            <span>{isInternship ? "What I Worked On" : "Key Engineering Contributions"}</span>
          </h3>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {exp.highlights.map((highlight: string, hIdx: number) => (
              <div
                key={hIdx}
                className="flex items-start gap-2.5 rounded-lg border border-[#d0d7de]/60 dark:border-[#30363d]/60 bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60 p-3 text-xs text-[#24292f] dark:text-[#c9d1d9]"
              >
                <CheckCircle2 className="h-4 w-4 text-[#1f883d] dark:text-[#39d353] mt-0.5 flex-shrink-0" />
                <span className="font-medium leading-relaxed">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYSTEM ARCHITECTURE OVERVIEW (Full-time role only) */}
      {!isInternship && (
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
            <Layers className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Production System Architecture & Data Pipeline</span>
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Box 1: Async Pipeline */}
            <div className="rounded-lg border border-[#d0d7de]/80 dark:border-[#30363d] bg-[#f6f8fa]/70 dark:bg-[#0d1117]/70 p-3.5 space-y-2.5">
              <span className="text-[11px] font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider block">
                Asynchronous Data Extraction Pipeline
              </span>
              <div className="space-y-1.5 font-mono text-[11px] text-[#24292f] dark:text-[#c9d1d9]">
                <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                  <span className="h-2 w-2 rounded-full bg-[#0969da] dark:bg-[#58a6ff]" />
                  <span>Request / Web Clients / Internal API Requests</span>
                </div>
                <div className="text-center text-[#8b949e] font-bold text-[9px]">&darr; API Dispatch</div>
                <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                  <span className="h-2 w-2 rounded-full bg-[#d97706] dark:bg-[#f59e0b]" />
                  <span>Celery Task Queue & Distributed Workers</span>
                </div>
                <div className="text-center text-[#8b949e] font-bold text-[9px]">&darr; Worker Processing</div>
                <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                  <span className="h-2 w-2 rounded-full bg-[#1f883d] dark:bg-[#39d353]" />
                  <span>AI / Data Extraction & Transformation</span>
                </div>
                <div className="text-center text-[#8b949e] font-bold text-[9px]">&darr; Validation & Storage</div>
                <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                  <span className="h-2 w-2 rounded-full bg-[#8a2be2]" />
                  <span>PostgreSQL Storage & Downstream Systems</span>
                </div>
              </div>
            </div>

            {/* Box 2: AWS Infrastructure */}
            <div className="rounded-lg border border-[#d0d7de]/80 dark:border-[#30363d] bg-[#f6f8fa]/70 dark:bg-[#0d1117]/70 p-3.5 space-y-2.5">
              <span className="text-[11px] font-mono font-bold text-[#1f883d] dark:text-[#39d353] uppercase tracking-wider block">
                AWS Deployment & Infrastructure Architecture
              </span>
              <div className="space-y-1.5 font-mono text-[11px] text-[#24292f] dark:text-[#c9d1d9]">
                <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                  <span className="h-2 w-2 rounded-full bg-[#0969da] dark:bg-[#58a6ff]" />
                  <span>AWS CloudFormation IaC Automation</span>
                </div>
                <div className="text-center text-[#8b949e] font-bold text-[9px]">&darr; Container Deployment</div>
                <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                  <span className="h-2 w-2 rounded-full bg-[#1f883d] dark:bg-[#39d353]" />
                  <span>Docker Containerized Microservices</span>
                </div>
                <div className="text-center text-[#8b949e] font-bold text-[9px]">&darr; Orchestration & Monitoring</div>
                <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                  <span className="h-2 w-2 rounded-full bg-[#8a2be2]" />
                  <span>AWS ECS / Fargate & CloudWatch Monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TECHNICAL CHALLENGES (Full-time only) */}
      {!isInternship && exp.challenges && exp.challenges.length > 0 && (
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
            <Zap className="h-4 w-4 text-[#d97706] dark:text-[#f59e0b]" />
            <span>Technical Challenges & Solutions</span>
          </h3>
          <div className="space-y-3.5">
            {exp.challenges.map((c: TechnicalChallenge, cIdx: number) => (
              <div key={cIdx} className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/50 dark:bg-[#0d1117]/50 p-3.5 space-y-2.5">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-[#cf222e] dark:text-[#ff7b72]">Problem</span>
                  <p className="text-xs font-semibold text-[#24292f] dark:text-[#f0f6fc]">{c.problem}</p>
                </div>
                <div className="border-t border-[#d0d7de]/40 dark:border-[#30363d]/40 pt-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-[#0969da] dark:text-[#58a6ff]">Solution</span>
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e]">{c.solution}</p>
                </div>
                {c.impact && (
                  <div className="border-t border-[#d0d7de]/40 dark:border-[#30363d]/40 pt-2">
                    <span className="text-[11px] font-mono font-bold uppercase text-[#1f883d] dark:text-[#39d353]">Impact</span>
                    <p className="text-xs font-semibold text-[#1f883d] dark:text-[#39d353]">{c.impact}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* METRICS (Full-time only, if real metrics exist) */}
      {!isInternship && exp.metrics && exp.metrics.length > 0 && (
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-3.5 shadow-xs">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
            <Zap className="h-4 w-4 text-[#1f883d] dark:text-[#39d353]" />
            <span>Engineering Highlights</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {exp.metrics.map((m: Metric, mIdx: number) => (
              <div key={mIdx} className="rounded-xl border border-[#1f883d]/30 dark:border-[#39d353]/30 bg-[#1f883d]/10 dark:bg-[#238636]/20 p-3 text-center space-y-0.5">
                <span className="block text-xl sm:text-2xl font-extrabold font-mono text-[#1f883d] dark:text-[#39d353]">{m.value}</span>
                <span className="block text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABOUT COMPANY & ROLE SCOPE */}
      <div className="grid gap-4 sm:grid-cols-2">
        {company && (
          <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-2.5 shadow-xs">
            <h3 className="flex items-center gap-2 text-xs font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2">
              <Building2 className="h-3.5 w-3.5 text-[#0969da] dark:text-[#58a6ff]" />
              <span>About {company.name}</span>
            </h3>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed">
              {company.description}
            </p>
          </div>
        )}

        {!isInternship && (
          <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-2.5 shadow-xs">
            <h3 className="flex items-center gap-2 text-xs font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
              <span>Role Scope & Ownership</span>
            </h3>
            {exp.team && (
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono font-bold uppercase text-[#8b949e]">Team</span>
                <p className="text-xs text-[#24292f] dark:text-[#c9d1d9]">{exp.team}</p>
              </div>
            )}
            <div className="space-y-0.5 pt-1">
              <span className="text-[11px] font-mono font-bold uppercase text-[#8b949e]">Ownership</span>
              <p className="text-xs text-[#24292f] dark:text-[#c9d1d9]">
                Primary ownership of AI scraping platform backend, Celery async queue architecture, and AWS CloudFormation infrastructure.
              </p>
            </div>
          </div>
        )}

        {isInternship && (
          <div className="rounded-xl border border-[#1f883d]/30 dark:border-[#39d353]/30 bg-[#1f883d]/5 dark:bg-[#238636]/10 p-4 space-y-2 shadow-xs flex flex-col justify-center">
            <h3 className="flex items-center gap-2 text-xs font-mono font-bold text-[#1f883d] dark:text-[#39d353]">
              <Award className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
              <span>Outcome</span>
            </h3>
            <p className="text-xs font-semibold text-[#24292f] dark:text-[#f0f6fc] leading-relaxed">
              Successfully transitioned to full-time Software Engineer (Backend and Cloud).
            </p>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#d0d7de] dark:border-[#30363d]">
        {prevExp ? (
          <Link href={`/experience/${prevExp.slug}`} className="group flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3.5 py-2 text-xs font-mono text-[#24292f] dark:text-[#f0f6fc] hover:border-[#0969da] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 text-[#0969da] dark:text-[#58a6ff]" />
            <div>
              <span className="block text-[11px] uppercase text-[#8b949e]">Previous Role</span>
              <span className="font-bold">{prevExp.title}</span>
            </div>
          </Link>
        ) : <div />}

        {nextExp && (
          <Link href={`/experience/${nextExp.slug}`} className="group flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3.5 py-2 text-xs font-mono text-[#24292f] dark:text-[#f0f6fc] hover:border-[#0969da] transition-colors ml-auto">
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

