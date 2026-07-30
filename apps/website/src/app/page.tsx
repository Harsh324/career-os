import Link from "next/link";
import { getCareerSDK } from "@/lib/get-career-os";
import {
  Briefcase,
  FolderGit2,
  Sparkles,
  Award,
  Star,
  GitFork,
  Building2,
  MapPin,
  Mail,
  Link as LinkIcon,
  Users,
  Pin,
  BookOpen,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/SocialIcons";
import { GitNodeIcon } from "@/components/icons/GitNodeIcon";
import { getLanguageColor } from "@/lib/language-colors";
import { ExperienceCard } from "@/components/experience/ExperienceCard";

export default async function HomePage() {
  const sdk = await getCareerSDK();
  const meta = sdk.meta();
  const featuredExperience = sdk.experience({ resumeInclude: true });
  const featuredProjects = sdk.projects({ featured: true });
  const awards = sdk.awards();
  const featuredBlog = sdk.blog({ featured: true });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
      {/* GitHub 2-Column Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Column (GitHub Profile Card) */}
        <aside className="lg:col-span-1 space-y-5">
          {/* Avatar & Profile Identifiers */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
            {meta.avatarUrl && (
              <div className="relative group">
                <div className="h-32 w-32 sm:h-44 sm:w-44 lg:h-60 lg:w-60 overflow-hidden rounded-full border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={meta.avatarUrl}
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
                harsh324
              </p>
            </div>
          </div>

          {/* GitHub Octicon Status Badge */}
          <div className="rounded-xl border border-[#1f883d]/30 dark:border-[#39d353]/30 bg-[#1f883d]/10 dark:bg-[#238636]/20 p-3 text-xs font-mono text-[#1f883d] dark:text-[#39d353] flex items-center gap-2 shadow-sm font-medium">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39d353] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1f883d] dark:bg-[#39d353]"></span>
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353] flex-shrink-0" />
            <span className="truncate">Available for Consulting</span>
          </div>

          {/* Bio Description */}
          <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#c9d1d9] leading-relaxed font-sans">
            {meta.summary || meta.tagline}
          </p>

          {/* Follower Stats Bar */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#57606a] dark:text-[#8b949e] border-y border-[#d0d7de] dark:border-[#30363d] py-3">
            <Users className="h-4 w-4 text-[#57606a] dark:text-[#8b949e]" />
            <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">142</span> followers
            <span>&bull;</span>
            <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">38</span> following
          </div>

          {/* Profile Metadata List */}
          <div className="space-y-2.5 text-xs text-[#57606a] dark:text-[#8b949e] font-sans">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
              <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">SMS</span>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
              <span>{meta.location || "India"}</span>
            </div>

            {meta.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
                <a href={`mailto:${meta.email}`} className="text-[#0969da] dark:text-[#58a6ff] hover:underline truncate font-mono">
                  {meta.email}
                </a>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <LinkIcon className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0" />
              <a href="https://career-os.dev" target="_blank" rel="noopener noreferrer" className="text-[#0969da] dark:text-[#58a6ff] hover:underline truncate font-mono">
                https://career-os.dev
              </a>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {meta.social?.github && (
                <a href={meta.social.github} target="_blank" rel="noopener noreferrer" className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors">
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {meta.social?.linkedin && (
                <a href={meta.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors">
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
              {meta.social?.twitter && (
                <a href={meta.social.twitter} target="_blank" rel="noopener noreferrer" className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors">
                  <TwitterIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </aside>

        {/* Right Content Canvas (GitHub Main Feed) */}
        <main className="lg:col-span-3 space-y-8">
          {/* Platform Identity Callout Banner */}
          <div className="rounded-xl border border-[#0969da]/30 dark:border-[#58a6ff]/30 bg-[#0969da]/5 dark:bg-[#388bfd]/10 p-3.5 text-xs font-mono text-[#24292f] dark:text-[#c9d1d9] flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <GitNodeIcon className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff] flex-shrink-0" />
              <span>
                <strong className="text-[#0969da] dark:text-[#58a6ff]">Career OS Platform</strong> &bull; Version-controlled professional identity derived from structured Git content via <code className="text-[#0969da] dark:text-[#58a6ff]">@career-os/sdk</code>.
              </span>
            </div>
          </div>

          {/* 1. Work Experience Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                <Briefcase className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Work Experience & Technical Case Studies</span>
              </h2>
              <Link href="/experience" className="text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline">
                View full history &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {featuredExperience.map((exp, idx) => (
                <ExperienceCard key={exp.slug || idx} experience={exp} />
              ))}
            </div>
          </section>

          {/* 2. Pinned Projects Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                <Pin className="h-4 w-4 text-[#8b949e]" />
                <span>Pinned Projects</span>
              </h2>
              <Link href="/projects" className="text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline">
                View all projects &rarr;
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {featuredProjects.map((project, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col justify-between rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-3 shadow-sm hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 hover:shadow-md transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="h-4 w-4 text-[#57606a] dark:text-[#8b949e]" />
                        <h3 className="font-bold text-sm text-[#0969da] dark:text-[#58a6ff] no-underline">
                          {project.slug ? (
                            <Link href={`/projects/${project.slug}`} className="no-underline hover:no-underline">{project.title}</Link>
                          ) : (
                            project.title
                          )}
                        </h3>
                      </div>
                      <span className="rounded-full border border-[#d0d7de] dark:border-[#30363d] px-2 py-0.5 text-[10px] font-mono text-[#57606a] dark:text-[#8b949e] capitalize">
                        Public
                      </span>
                    </div>

                    <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* GitHub Repo Card Footer */}
                  <div className="flex items-center justify-between pt-2 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                    <div className="flex items-center gap-3">
                      {project.technologies && project.technologies[0] && (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: getLanguageColor(project.technologies[0]) }}
                          />
                          <span>{project.technologies[0]}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
                        <span>{12 + idx * 7}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-3.5 w-3.5" />
                        <span>{3 + idx * 2}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Honors & Recognition Section */}
          {awards.length > 0 && (
            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                <Award className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Honors & Recognition</span>
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {awards.map((award, idx) => (
                  <Link
                    key={idx}
                    href="/timeline"
                    className="group rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-1 shadow-sm transition-all hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 hover:shadow-md cursor-pointer no-underline hover:no-underline"
                  >
                    <h3 className="font-bold text-xs sm:text-sm text-[#0969da] dark:text-[#58a6ff] no-underline">{award.title}</h3>
                    <p className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">{award.issuer} &bull; {award.date}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 4. Latest Technical Articles */}
          {featuredBlog.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                  <BookOpen className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                  <span>Latest Technical Articles</span>
                </h2>
                <Link href="/blog" className="text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline">
                  View all articles &rarr;
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {featuredBlog.map((post, idx) => (
                  <Link
                    key={idx}
                    href="/blog"
                    className="group rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-1.5 shadow-sm transition-all hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 hover:shadow-md cursor-pointer no-underline hover:no-underline"
                  >
                    <h3 className="font-bold text-xs sm:text-sm text-[#0969da] dark:text-[#58a6ff] no-underline">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#57606a] dark:text-[#8b949e] line-clamp-2">{post.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
