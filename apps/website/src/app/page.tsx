import Link from "next/link";
import { getCareerSDK } from "@/lib/get-career-os";
import {
  Briefcase,
  FolderGit2,
  Cpu,
  ArrowRight,
  ExternalLink,
  Calendar,
  Sparkles,
  Award,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";

export default async function HomePage() {
  const sdk = await getCareerSDK();
  const meta = sdk.meta();
  const featuredExperience = sdk.experience({ resumeInclude: true }).slice(0, 3);
  const featuredProjects = sdk.projects({ featured: true });
  const topSkills = sdk.skills().slice(0, 8);
  const featuredBlog = sdk.blog({ featured: true }).slice(0, 2);
  const awards = sdk.awards().slice(0, 2);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20 space-y-20">
      {/* Hero Section */}
      <section className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-zinc-800/80 pb-16">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Available for Select Consulting & Engineering Leadership</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-zinc-100">
            {meta.name}
          </h1>
          <h2 className="text-xl sm:text-2xl font-medium text-emerald-400 font-mono">
            {meta.title}
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            {meta.summary || meta.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              <span>Explore Projects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/experience"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-200 ring-1 ring-zinc-800 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <span>View Experience</span>
            </Link>
          </div>
        </div>

        {/* Identity Badge */}
        {meta.avatarUrl && (
          <div className="relative flex-shrink-0">
            <div className="h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-2xl ring-2 ring-emerald-500/30 bg-zinc-900 shadow-2xl">
              {/* eslint-disable-next-html-element-for-img */}
              <img
                src={meta.avatarUrl}
                alt={meta.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </section>

      {/* Featured Experience Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-100">
              <Briefcase className="h-5 w-5 text-emerald-400" />
              <span>Work Experience</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Proven track record in engineering leadership, systems architecture, and AI platforms.
            </p>
          </div>
          <Link
            href="/experience"
            className="flex items-center gap-1 text-xs sm:text-sm font-medium text-emerald-400 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6">
          {featuredExperience.map((exp, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/70"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-sm font-mono text-zinc-400">{exp.company}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {exp.startDate} &mdash; {exp.endDate || "Present"}
                  </span>
                </div>
              </div>

              {exp.body && <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{exp.body}</p>}

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-md bg-zinc-800/80 px-2.5 py-1 text-xs font-mono text-zinc-300 ring-1 ring-zinc-700/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Showcase */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-100">
              <FolderGit2 className="h-5 w-5 text-emerald-400" />
              <span>Featured Projects</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Open source platforms, compiler tools, and high-performance applications.
            </p>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-xs sm:text-sm font-medium text-emerald-400 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/70"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-emerald-400 ring-1 ring-emerald-500/30 capitalize">
                    {project.status}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-emerald-400"
                        aria-label="GitHub Repository"
                      >
                        <GithubIcon className="h-4 w-4" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-emerald-400"
                        aria-label="Live Demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-zinc-100">
                  {project.slug ? (
                    <Link
                      href={`/projects/${project.slug}`}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {project.title}
                    </Link>
                  ) : (
                    project.title
                  )}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{project.description}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.technologies?.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="rounded-md bg-zinc-800/60 px-2 py-0.5 text-xs font-mono text-zinc-300 ring-1 ring-zinc-700/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Tech Stack Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-100">
            <Cpu className="h-5 w-5 text-emerald-400" />
            <span>Core Expertise</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Primary technology stack and domain competencies.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {topSkills.map((skill, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-sm font-medium text-zinc-200 shadow-sm"
            >
              <span>{skill.name}</span>
              {skill.level && (
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400 uppercase">
                  {skill.level}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Honors & Awards Section (if available) */}
      {awards.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-100">
              <Award className="h-5 w-5 text-emerald-400" />
              <span>Honors & Recognition</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {awards.map((award, idx) => (
              <div key={idx} className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4">
                <h3 className="font-bold text-zinc-100">{award.title}</h3>
                <p className="text-xs font-mono text-zinc-400">{award.issuer} &bull; {award.date}</p>
                {award.description && <p className="mt-2 text-xs text-zinc-400">{award.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles Preview */}
      {featuredBlog.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Latest Articles</h2>
            <Link href="/blog" className="text-xs font-medium text-emerald-400 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredBlog.map((post, idx) => (
              <div key={idx} className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-2">
                <h3 className="font-bold text-zinc-100 hover:text-emerald-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-400">{post.description}</p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 pt-2">
                  <span>{post.publishedDate}</span>
                  {post.readingTimeMinutes && <span>{post.readingTimeMinutes} min read</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
