import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCareerSDK } from "@/lib/get-career-os";
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

export async function generateStaticParams() {
  const sdk = await getCareerSDK();
  const experiences = sdk.experience();
  return experiences.filter((e) => e.slug).map((e) => ({ slug: e.slug! }));
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sdk = await getCareerSDK();
  const exp = sdk.experienceItem(slug);

  if (!exp) {
    return { title: "Experience Case Study Not Found" };
  }

  return {
    title: `${exp.title} at ${exp.companyData?.name || exp.company} — Technical Case Study`,
    description: exp.roleSummary || exp.description || `Engineering case study for ${exp.title}`,
  };
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { slug } = await params;
  const sdk = await getCareerSDK();
  const exp = sdk.experienceItem(slug);

  if (!exp) {
    notFound();
  }

  const company = exp.companyData;
  const allExperiences = sdk.experience();
  const allProjects = sdk.projects();
  const allBlogPosts = sdk.blog();

  // Find previous and next experiences for navigation
  const currentIndex = allExperiences.findIndex((e) => e.slug === slug);
  const prevExp = currentIndex > 0 ? allExperiences[currentIndex - 1] : undefined;
  const nextExp =
    currentIndex < allExperiences.length - 1 ? allExperiences[currentIndex + 1] : undefined;

  // Filter related blog posts matching technologies or backend/cloud tags
  const relatedBlog = allBlogPosts.filter((b) =>
    b.tags?.some((t) =>
      ["backend", "cloud", "ai", "platform-engineering", "architecture"].includes(t.toLowerCase())
    )
  );

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

      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-6">
          <div className="flex items-start gap-4">
            {/* Company Logo */}
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
                {exp.employmentType && (
                  <span className="rounded-full bg-[#0969da]/10 dark:bg-[#58a6ff]/15 border border-[#0969da]/30 dark:border-[#58a6ff]/30 px-3 py-1 text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] capitalize">
                    {exp.employmentType}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                <span className="text-base font-bold text-[#24292f] dark:text-[#f0f6fc]">
                  {company?.name || exp.company}
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
                    {exp.startDate} &mdash; {exp.endDate || "Present"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
            {company?.linkedin && (
              <a
                href={company.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] px-3.5 py-2 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-colors"
              >
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {exp.mission && (
          <div className="space-y-2">
            <h2 className="text-2xs font-mono font-bold text-[#57606a] dark:text-[#8b949e] uppercase tracking-wider">
              Engineering Mission
            </h2>
            <p className="text-sm sm:text-base font-semibold text-[#24292f] dark:text-[#c9d1d9] leading-relaxed max-w-3xl">
              {exp.mission}
            </p>
          </div>
        )}
      </div>

      {/* 2 & 3. ABOUT COMPANY & MY ROLE GRID */}
      <div className="grid gap-8 sm:grid-cols-2">
        {/* About Company */}
        {company && (
          <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
              <Building2 className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
              <span>About {company.name}</span>
            </h3>

            <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed">
              {company.description}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs text-[#57606a] dark:text-[#8b949e]">
              <div>
                <span className="block text-2xs uppercase text-[#8b949e]">Industry</span>
                <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  {company.industry}
                </span>
              </div>
              <div>
                <span className="block text-2xs uppercase text-[#8b949e]">Company Size</span>
                <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  {company.companySize}
                </span>
              </div>
              <div>
                <span className="block text-2xs uppercase text-[#8b949e]">Headquarters</span>
                <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  {company.headquarters}
                </span>
              </div>
              {company.founded && (
                <div>
                  <span className="block text-2xs uppercase text-[#8b949e]">Founded</span>
                  <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                    {company.founded}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Role & Ownership */}
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <ShieldCheck className="h-4 w-4 text-[#1f883d] dark:text-[#39d353]" />
            <span>Role Scope & Ownership</span>
          </h3>

          {exp.team && (
            <div className="space-y-1">
              <span className="text-2xs font-mono font-bold uppercase text-[#8b949e]">
                Team Structure
              </span>
              <p className="text-xs sm:text-sm text-[#24292f] dark:text-[#c9d1d9] leading-relaxed">
                {exp.team}
              </p>
            </div>
          )}

          {exp.ownership && (
            <div className="space-y-1 pt-2">
              <span className="text-2xs font-mono font-bold uppercase text-[#8b949e]">
                Technical Ownership
              </span>
              <p className="text-xs sm:text-sm text-[#24292f] dark:text-[#c9d1d9] leading-relaxed">
                {exp.ownership}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. HIGHLIGHTS & ENGINEERING CONTRIBUTIONS */}
      {exp.highlights && exp.highlights.length > 0 && (
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 sm:p-7 space-y-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <Sparkles className="h-5 w-5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Key Engineering Contributions</span>
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {exp.highlights.map((highlight, hIdx) => (
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

      {/* 5. TECHNICAL CHALLENGES */}
      {exp.challenges && exp.challenges.length > 0 && (
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 sm:p-7 space-y-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <Zap className="h-5 w-5 text-[#d97706] dark:text-[#f59e0b]" />
            <span>Technical Challenges & Architectural Solutions</span>
          </h3>

          <div className="space-y-6">
            {exp.challenges.map((c, cIdx) => (
              <div
                key={cIdx}
                className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/50 dark:bg-[#0d1117]/50 p-5 space-y-4"
              >
                <div className="space-y-1">
                  <span className="text-2xs font-mono font-bold uppercase text-[#cf222e] dark:text-[#ff7b72]">
                    Problem Statement
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                    {c.problem}
                  </p>
                </div>

                <div className="space-y-1 border-t border-[#d0d7de]/40 dark:border-[#30363d]/40 pt-3">
                  <span className="text-2xs font-mono font-bold uppercase text-[#0969da] dark:text-[#58a6ff]">
                    Architectural Solution
                  </span>
                  <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed">
                    {c.solution}
                  </p>
                </div>

                <div className="space-y-1 border-t border-[#d0d7de]/40 dark:border-[#30363d]/40 pt-3">
                  <span className="text-2xs font-mono font-bold uppercase text-[#1f883d] dark:text-[#39d353]">
                    Measured Engineering Impact
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#1f883d] dark:text-[#39d353]">
                    {c.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. ENGINEERING METRICS */}
      {exp.metrics && exp.metrics.length > 0 && (
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <Zap className="h-5 w-5 text-[#1f883d] dark:text-[#39d353]" />
            <span>Engineering Metrics</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {exp.metrics.map((m, mIdx) => (
              <div
                key={mIdx}
                className="rounded-xl border border-[#1f883d]/30 dark:border-[#39d353]/30 bg-[#1f883d]/10 dark:bg-[#238636]/20 p-4 text-center space-y-1"
              >
                <span className="block text-2xl sm:text-3xl font-extrabold font-mono text-[#1f883d] dark:text-[#39d353]">
                  {m.value}
                </span>
                <span className="block text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TECHNOLOGY STACK GROUPS */}
      {exp.techGroups && (
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <Cpu className="h-5 w-5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Technology Stack Architecture</span>
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            {Object.entries(exp.techGroups).map(([groupName, techList], gIdx) => (
              <div
                key={gIdx}
                className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/50 dark:bg-[#0d1117]/50 p-4 space-y-2"
              >
                <span className="block text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase">
                  {groupName}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {techList.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1.5 rounded-md bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] px-2.5 py-1 text-xs font-mono text-[#24292f] dark:text-[#c9d1d9]"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: getLanguageColor(tech) }}
                      />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. LESSONS LEARNED */}
      {exp.lessonsLearned && exp.lessonsLearned.length > 0 && (
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <BookOpen className="h-5 w-5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Engineering Lessons Learned</span>
          </h3>

          <div className="space-y-3">
            {exp.lessonsLearned.map((lesson, lIdx) => (
              <div
                key={lIdx}
                className="flex items-start gap-3 rounded-xl border border-[#d0d7de]/60 dark:border-[#30363d]/60 bg-[#f6f8fa]/40 dark:bg-[#0d1117]/40 p-3.5 text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e]"
              >
                <span className="font-mono text-xs font-bold text-[#0969da] dark:text-[#58a6ff] mt-0.5">
                  0{lIdx + 1}
                </span>
                <span className="leading-relaxed">{lesson}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. RELATED PROJECTS */}
      {exp.relatedProjects && exp.relatedProjects.length > 0 && (
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <Layers className="h-5 w-5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Related Projects & Deliverables</span>
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {exp.relatedProjects.map((pSlug, pIdx) => {
              const projectObj = allProjects.find((p) => p.slug === pSlug);
              return (
                <Link
                  key={pIdx}
                  href={`/projects/${pSlug}`}
                  className="group flex items-center justify-between rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/50 dark:bg-[#0d1117]/50 p-4 transition-all hover:border-[#0969da] dark:hover:border-[#58a6ff]"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
                      {projectObj?.title || pSlug}
                    </h4>
                    <p className="text-xs text-[#57606a] dark:text-[#8b949e] line-clamp-1">
                      {projectObj?.description || "View project details"}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 10. RELATED BLOG ARTICLES */}
      {relatedBlog.length > 0 && (
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <FileText className="h-5 w-5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Related Technical Writing & Architecture Notes</span>
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {relatedBlog.slice(0, 2).map((post, bIdx) => (
              <Link
                key={bIdx}
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/50 dark:bg-[#0d1117]/50 p-4 transition-all hover:border-[#0969da] dark:hover:border-[#58a6ff]"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e] line-clamp-2">
                    {post.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-2xs font-mono text-[#0969da] dark:text-[#58a6ff]">
                  <span>Read Article &rarr;</span>
                  <span>{post.publishedDate}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 11 & 12. PREVIOUS / NEXT EXPERIENCE NAVIGATION FOOTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#d0d7de] dark:border-[#30363d]">
        {prevExp ? (
          <Link
            href={`/experience/${prevExp.slug}`}
            className="group flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-4 py-3 text-xs font-mono text-[#24292f] dark:text-[#f0f6fc] hover:border-[#0969da] dark:hover:border-[#58a6ff] transition-colors w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff] transition-transform group-hover:-translate-x-1" />
            <div className="text-left">
              <span className="block text-3xs uppercase text-[#8b949e]">Previous Role</span>
              <span className="font-bold">{prevExp.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextExp && (
          <Link
            href={`/experience/${nextExp.slug}`}
            className="group flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-4 py-3 text-xs font-mono text-[#24292f] dark:text-[#f0f6fc] hover:border-[#0969da] dark:hover:border-[#58a6ff] transition-colors w-full sm:w-auto ml-auto"
          >
            <div className="text-right">
              <span className="block text-3xs uppercase text-[#8b949e]">Next Role</span>
              <span className="font-bold">{nextExp.title}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff] transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
