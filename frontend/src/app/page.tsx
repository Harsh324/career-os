export const revalidate = 3600;

import Link from "next/link";
import Image from "next/image";
import {
  fetchExperiences,
  fetchProjects,
  fetchSiteSettings,
  fetchCertifications,
} from "@/lib/api/services";
import {
  Briefcase,
  Sparkles,
  Building2,
  MapPin,
  Mail,
  Pin,
  Award,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CertificationCard } from "@/components/certifications/CertificationCard";
import { EmailCopyButton } from "@/components/ui/EmailCopyButton";
import { DEFAULT_SITE_SETTINGS } from "@/lib/constants/site";
import type { Experience, Project, SiteSettings, Certification } from "@/lib/api/types";

export default async function HomePage() {
  let meta: SiteSettings = DEFAULT_SITE_SETTINGS;
  let experiences: Experience[] = [];
  let featuredProjects: Project[] = [];
  let certs: Certification[] = [];

  try {
    const [fetchedSettings, fetchedExp, fetchedProj, fetchedCerts] = await Promise.all([
      fetchSiteSettings(),
      fetchExperiences(),
      fetchProjects(true),
      fetchCertifications(),
    ]);

    if (fetchedSettings) meta = { ...meta, ...fetchedSettings };
    experiences = Array.isArray(fetchedExp) ? fetchedExp : [];
    featuredProjects = Array.isArray(fetchedProj) ? fetchedProj : [];
    certs = Array.isArray(fetchedCerts) ? fetchedCerts : [];
  } catch (err) {
    // API fallback during static compilation
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-4 sm:py-6">
      {/* GitHub 2-Column Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Column (GitHub Profile Card) */}
        <aside className="lg:col-span-1 space-y-5">
          {/* Avatar & Profile Identifiers */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
            {meta.avatar_url && (
              <div className="relative group">
                <div className="relative h-32 w-32 sm:h-44 sm:w-44 lg:h-52 lg:w-52 aspect-square overflow-hidden rounded-full border-2 border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] shadow-md">
                  <Image
                    src={meta.avatar_url}
                    alt={meta.name}
                    fill
                    priority
                    className="object-cover rounded-full"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1 w-full">
              <h1 className="text-2xl font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
                {meta.name}
              </h1>
              <p className="text-sm font-mono text-[#0969da] dark:text-[#58a6ff] font-semibold">
                {meta.title}
              </p>
              <p className="text-xs text-[#57606a] dark:text-[#8b949e] font-sans leading-normal">
                {meta.tagline || "3 Years of Backend Engineering Experience"}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="rounded-xl border border-[#1f883d]/30 dark:border-[#39d353]/30 bg-[#1f883d]/10 dark:bg-[#238636]/20 px-2.5 py-2 text-[11px] font-mono text-[#1f883d] dark:text-[#39d353] flex items-center gap-1.5 shadow-sm font-medium leading-tight">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39d353] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1f883d] dark:bg-[#39d353]"></span>
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353] flex-shrink-0" />
            <span className="whitespace-normal">Open to Backend & Cloud Roles</span>
          </div>

          {/* Core Tech Pills */}
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {["Python", "Django REST", "AWS", "Celery", "ECS/Fargate"].map((t, idx) => (
              <span
                key={idx}
                className="rounded-md bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] px-2 py-0.5 text-[#24292f] dark:text-[#c9d1d9] hover:border-[#0969da] dark:hover:border-[#58a6ff] hover:text-[#0969da] dark:hover:text-[#58a6ff] hover:bg-[#0969da]/10 dark:hover:bg-[#58a6ff]/15 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 select-none"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col gap-2 pt-1">
            <Link
              href="/experience"
              className="w-full text-center rounded-xl bg-[#0969da] px-3.5 py-2 text-xs font-mono font-semibold text-white shadow-sm hover:bg-[#085ac1] transition-colors"
            >
              View Experience &rarr;
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/projects"
                className="text-center rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3 py-2 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] shadow-xs hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/resume"
                className="text-center rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3 py-2 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] shadow-xs hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors"
              >
                Resume
              </Link>
            </div>
          </div>

          {/* Profile Metadata List */}
          <div className="space-y-2.5 text-xs text-[#57606a] dark:text-[#8b949e] font-sans border-t border-[#d0d7de] dark:border-[#30363d] pt-4">
            {experiences.length > 0 && (
              <div className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
                <Link
                  href={`/experience/${experiences[0].slug}`}
                  className="font-semibold text-[#24292f] dark:text-[#c9d1d9] hover:text-[#0969da] dark:hover:text-[#58a6ff] hover:underline"
                >
                  {experiences[0].company_detail?.name || experiences[0].title}
                </Link>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
              <span>{meta.location || "Tokyo, Japan"}</span>
            </div>

            {meta.email && (
              <div className="flex items-center gap-2.5">
                <EmailCopyButton email={meta.email} variant="link" />
              </div>
            )}

            {meta.github_url && (
              <div className="flex items-center gap-2.5">
                <GithubIcon className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
                <a href={meta.github_url} target="_blank" rel="noreferrer" className="hover:underline truncate font-mono text-[#0969da] dark:text-[#58a6ff]">
                  {meta.github_url.replace("https://", "")}
                </a>
              </div>
            )}

            {meta.linkedin_url && (
              <div className="flex items-center gap-2.5">
                <LinkedinIcon className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
                <a href={meta.linkedin_url} target="_blank" rel="noreferrer" className="hover:underline truncate font-mono text-[#0969da] dark:text-[#58a6ff]">
                  {meta.linkedin_url.replace("https://", "")}
                </a>
              </div>
            )}
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="lg:col-span-3 space-y-8">
          {/* Main Hero Role Banner */}
          <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 sm:p-5 shadow-xs space-y-3 hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 hover:shadow-md transition-all duration-200">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
              {meta.title}
            </h2>
            <p className="text-sm text-[#57606a] dark:text-[#c9d1d9] leading-relaxed font-sans">
              {meta.summary}
            </p>

            {/* Optional Compact Engineering Focus Row */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
              <span className="font-bold text-[#24292f] dark:text-[#f0f6fc]">Engineering Focus:</span>
              <span className="text-[#0969da] dark:text-[#58a6ff] font-semibold">Backend APIs</span>
              <span>&bull;</span>
              <span className="text-[#0969da] dark:text-[#58a6ff] font-semibold">Distributed Systems</span>
              <span>&bull;</span>
              <span className="text-[#0969da] dark:text-[#58a6ff] font-semibold">AWS Cloud</span>
              <span>&bull;</span>
              <span className="text-[#0969da] dark:text-[#58a6ff] font-semibold">AI Data Platforms</span>
            </div>
          </div>

          {/* Pinned / Primary Work Experience Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#d0d7de] dark:border-[#30363d] pb-2">
              <h2 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc]">
                <Briefcase className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Work Experience</span>
              </h2>
              <Link href="/experience" className="text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline">
                View all ({experiences.length}) &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {experiences.length === 0 ? (
                <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] p-6 text-center text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                  No experience records loaded yet.
                </div>
              ) : (
                experiences
                  .filter((exp) => exp.employment_type !== "internship")
                  .slice(0, 1)
                  .map((exp) => (
                    <ExperienceCard key={exp.slug} experience={exp} />
                  ))
              )}
            </div>
          </div>

          {/* Featured Projects Section */}
          {featuredProjects.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#d0d7de] dark:border-[#30363d] pb-2">
                <h2 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc]">
                  <Pin className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                  <span>Featured Projects</span>
                </h2>
                <Link href="/projects" className="text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline">
                  View all projects &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredProjects.slice(0, 2).map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </div>
          )}

          {/* AWS Certifications Section */}
          {certs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#d0d7de] dark:border-[#30363d] pb-2">
                <h2 className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc]">
                  <Award className="h-4 w-4 text-[#d97706] dark:text-[#f59e0b]" />
                  <span>AWS Certifications</span>
                </h2>
                <Link href="/resume" className="text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline">
                  Verify &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certs.map((cert) => (
                  <CertificationCard key={cert.slug} cert={cert} />
                ))}
              </div>
            </div>
          )}

          {/* Recruiter Contact CTA Banner */}
          <div className="rounded-2xl border border-[#0969da]/30 dark:border-[#58a6ff]/30 bg-gradient-to-r from-[#0969da]/5 via-transparent to-[#1f883d]/5 dark:from-[#388bfd]/10 dark:to-[#238636]/10 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="flex items-center justify-center sm:justify-start gap-2 text-base font-bold text-[#24292f] dark:text-[#f0f6fc]">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39d353] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1f883d] dark:bg-[#39d353]"></span>
                </span>
                <span>Open to Backend & Cloud Roles</span>
              </h3>
              <p className="text-xs text-[#57606a] dark:text-[#8b949e]">
                Currently open to full-time Backend and Cloud engineering opportunities in Tokyo & Remote.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {meta.email && (
                <EmailCopyButton email={meta.email} variant="button" />
              )}
              {meta.linkedin_url && (
                <a
                  href={meta.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-4 py-2 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] shadow-xs hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors flex items-center gap-1.5"
                >
                  <LinkedinIcon className="h-3.5 w-3.5 text-[#0a66c2]" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
