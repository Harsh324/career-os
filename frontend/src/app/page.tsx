import Link from "next/link";
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
  Link as LinkIcon,
  Pin,
  Award,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/SocialIcons";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CertificationCard } from "@/components/certifications/CertificationCard";
import { CopyPitchButton } from "@/components/ui/CopyPitchButton";
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
    experiences = fetchedExp;
    featuredProjects = fetchedProj;
    certs = fetchedCerts;
  } catch (err) {
    // API fallback during static compilation
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
      {/* GitHub 2-Column Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Column (GitHub Profile Card) */}
        <aside className="lg:col-span-1 space-y-5">
          {/* Avatar & Profile Identifiers */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
            {meta.avatar_url && (
              <div className="relative group">
                <div className="h-32 w-32 sm:h-44 sm:w-44 lg:h-60 lg:w-60 overflow-hidden rounded-full border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={meta.avatar_url}
                    alt={meta.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="space-y-0.5 w-full">
              <h1 className="text-2xl font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
                {meta.name}
              </h1>
              <p className="text-lg font-mono text-[#57606a] dark:text-[#8b949e]">
                {meta.name.toLowerCase().replace(/\s+/g, "")}
              </p>
            </div>
          </div>

          {/* Enhancement 4: Live Status Badge */}
          <div className="rounded-xl border border-[#1f883d]/30 dark:border-[#39d353]/30 bg-[#1f883d]/10 dark:bg-[#238636]/20 p-3 text-xs font-mono text-[#1f883d] dark:text-[#39d353] flex items-center gap-2 shadow-sm font-medium">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39d353] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1f883d] dark:bg-[#39d353]"></span>
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353] flex-shrink-0" />
            <span className="truncate">Tokyo, JP &bull; AWS Certified &bull; Open for Senior Roles</span>
          </div>

          {/* Enhancement 4: 1-Click Copy Recruiter Pitch Button */}
          <CopyPitchButton />

          {/* Bio Description */}
          <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#c9d1d9] leading-relaxed font-sans">
            {meta.summary || meta.tagline}
          </p>

          {/* Profile Metadata List */}
          <div className="space-y-2.5 text-xs text-[#57606a] dark:text-[#8b949e] font-sans border-t border-[#d0d7de] dark:border-[#30363d] pt-4">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
              <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">Backend Platform Engineering</span>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
              <span>{meta.location || "Tokyo, Japan"}</span>
            </div>

            {meta.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
                <a href={`mailto:${meta.email}`} className="text-[#0969da] dark:text-[#58a6ff] hover:underline truncate font-mono">
                  {meta.email}
                </a>
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
              {experiences.slice(0, 2).map((exp) => (
                <ExperienceCard key={exp.slug} experience={exp} />
              ))}
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
                {featuredProjects.slice(0, 4).map((project) => (
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
        </main>
      </div>
    </div>
  );
}
