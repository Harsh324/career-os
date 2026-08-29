import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 3600;
import Link from "next/link";
import { fetchProjectBySlug, fetchProjects } from "@/lib/api/services";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Layers,
  Cpu,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { ProjectBodyRenderer } from "@/components/projects/ProjectBodyRenderer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechChip } from "@/components/ui/TechChip";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const projects = await fetchProjects();
    if (projects && projects.length > 0) {
      return projects.map((p) => ({ slug: p.slug }));
    }
  } catch (err) {}
  return [
    { slug: "constellation" },
    { slug: "career-os" },
    { slug: "fintrack-ai" },
  ];
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  let project = null;
  try {
    project = await fetchProjectBySlug(slug);
  } catch (err) {}

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} — Architecture & Engineering`,
    description: project.summary || project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  let project = null;
  try {
    project = await fetchProjectBySlug(slug);
  } catch (err) {}

  if (!project) {
    notFound();
  }

  const hasLiveDemo = Boolean(project.demo && project.demo.trim().length > 0);

  // Constellation specific rich structured features
  const constellationFeatures = [
    {
      title: "Standardized Service Templates",
      desc: "Modular Docker Compose configs with isolated internal networks, standardized environment variables, and health checks for every service.",
    },
    {
      title: "Zero-Trust Ingress & Routing",
      desc: "Secure outbound Cloudflare Tunnels with automatic SSL and Traefik v3 reverse proxy for automatic service discovery.",
    },
    {
      title: "3-Tier Observability Platform",
      desc: "External Cloudflare Workers for instant Telegram outage alerts, Uptime Kuma for internal health checks, and Beszel for server metrics.",
    },
    {
      title: "Persistent Data & Backups",
      desc: "Shared PostgreSQL 17, Redis, and MinIO storage with automated daily age-encrypted S3 backups and 14-day retention.",
    },
  ];

  const constellationStackCategories = [
    { category: "Runtime & Host", tech: ["Docker CE (v29.x)", "Docker Compose v2", "Ubuntu 24.04 LTS"] },
    { category: "Networking & Ingress", tech: ["Cloudflare Tunnel", "Traefik v3", "Tailscale Mesh VPN", "UFW"] },
    { category: "Data & Storage", tech: ["PostgreSQL 17", "Redis 7.4", "MinIO Object Storage"] },
    { category: "Observability", tech: ["Cloudflare Workers", "Uptime Kuma", "Beszel"] },
    { category: "Tooling & Portal", tech: ["Next.js (SSG)", "TypeScript", "Bash / Makefile", "Age Encryption"] },
  ];

  // Default features for other projects
  const featuresMap: Record<string, string[]> = {
    "fintrack-ai": [
      "Automated transaction categorization system",
      "PostgreSQL query optimization & schema indexing",
      "Redis caching layer for session and transient state management",
      "RESTful API endpoints with structured JSON schemas",
    ],
    "career-os": [
      "Centralized Django REST Framework backend source of truth",
      "Dynamic Next.js 15 App Router portfolio presentation",
      "Idempotent database seeding & environment configuration",
      "Structured resume management & project case studies",
    ],
  };

  const projectFeatures = featuresMap[slug] || [
    "Modular system architecture and clean component separation",
    "Production containerization and backend API integration",
    "Optimized data querying and structured state management",
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Back Navigation Link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0969da] dark:text-[#58a6ff] hover:underline transition-colors group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Back to Projects Showcase</span>
      </Link>

      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-4">
          <div className="flex items-center gap-2">
            <StatusBadge 
              label={project.status || "Active"} 
              variant={(!project.status || project.status.toLowerCase() === "active") ? "green" : project.status.toLowerCase() === "archived" ? "gray" : "blue"} 
            />
          </div>

          <div className="flex items-center gap-2.5">
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] px-3 py-1.5 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-all shadow-xs"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>View Source</span>
              </a>
            )}
            {hasLiveDemo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0969da] px-3 py-1.5 text-xs font-mono font-semibold text-white hover:bg-[#085ac1] transition-all shadow-xs"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Live System</span>
              </a>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
            {project.title}
          </h1>

          <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed max-w-3xl font-medium">
            {slug === "constellation"
              ? "Self-hosted platform for running containerized services with zero open public ports, automated backups, and 3-tier monitoring."
              : slug === "career-os"
              ? "Backend-driven engineering portfolio platform built with Django REST Framework, PostgreSQL, Next.js, and Docker. Centralizes experience, projects, skills, certifications, and resume data behind a single backend source of truth."
              : slug === "fintrack-ai"
              ? "Automated financial transaction analysis backend platform. Built with Django REST Framework, PostgreSQL, and Redis query caching for transaction ingestion and category rules."
              : project.summary || project.description}
          </p>

          {project.description && slug === "constellation" && (
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed max-w-3xl pt-1">
              Built on Ubuntu Linux with Cloudflare Tunnels, Traefik reverse proxy, shared PostgreSQL/Redis storage, and automated encrypted daily S3 backups.
            </p>
          )}

          {project.timeline && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] pt-1">
              <Calendar className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
              <span>Timeline: {project.timeline}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Column: Architecture & Engineering (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                <Layers className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Architecture & System Design</span>
              </h2>
            </div>

            {/* Architecture Flow Diagram */}
            {slug === "constellation" && (
              <div className="rounded-lg border border-[#d0d7de]/80 dark:border-[#30363d] bg-[#f6f8fa]/70 dark:bg-[#0d1117]/70 p-3.5 space-y-2.5">
                <span className="text-[11px] font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider block">
                  SYSTEM ARCHITECTURE FLOW
                </span>
                <div className="space-y-1.5 font-mono text-[11px] text-[#24292f] dark:text-[#c9d1d9]">
                  <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0969da] dark:bg-[#58a6ff] flex-shrink-0" />
                    <span className="font-semibold">Zero-Trust Ingress (Cloudflare Tunnel & Tailscale)</span>
                  </div>
                  <div className="text-center text-[#8b949e] font-bold text-[9px]">&darr; Secure Gateway Routing</div>
                  <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#1f883d] dark:bg-[#39d353] flex-shrink-0" />
                    <span className="font-semibold">Traefik v3 Reverse Proxy & Dynamic Service Discovery</span>
                  </div>
                  <div className="text-center text-[#8b949e] font-bold text-[9px]">&darr; Isolated Internal Network</div>
                  <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#d97706] dark:bg-[#f59e0b] flex-shrink-0" />
                    <span className="font-semibold">Backend Services, Data Tier (PostgreSQL / Redis) & Monitoring</span>
                  </div>
                </div>
              </div>
            )}

            {slug === "career-os" && (
              <div className="rounded-lg border border-[#d0d7de]/80 dark:border-[#30363d] bg-[#f6f8fa]/70 dark:bg-[#0d1117]/70 p-3.5 space-y-2.5">
                <span className="text-[11px] font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider block">
                  Centralized Architecture Flow
                </span>
                <div className="space-y-1.5 font-mono text-[11px] text-[#24292f] dark:text-[#c9d1d9]">
                  <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                    <span className="h-2 w-2 rounded-full bg-[#0969da] dark:bg-[#58a6ff]" />
                    <span>Next.js 15 App Router Frontend</span>
                  </div>
                  <div className="text-center text-[#8b949e] font-bold text-[9px]">&darr; REST API Request</div>
                  <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                    <span className="h-2 w-2 rounded-full bg-[#1f883d] dark:bg-[#39d353]" />
                    <span>Django REST Framework (DRF) Central API</span>
                  </div>
                  <div className="text-center text-[#8b949e] font-bold text-[9px]">&darr; Single Source of Truth</div>
                  <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                    <span className="h-2 w-2 rounded-full bg-[#d97706] dark:bg-[#f59e0b]" />
                    <span>PostgreSQL Storage (Experiences, Projects, Skills)</span>
                  </div>
                </div>
              </div>
            )}

            {slug === "fintrack-ai" && (
              <div className="rounded-lg border border-[#d0d7de]/80 dark:border-[#30363d] bg-[#f6f8fa]/70 dark:bg-[#0d1117]/70 p-3.5 space-y-2.5">
                <span className="text-[11px] font-mono font-bold text-[#1f883d] dark:text-[#39d353] uppercase tracking-wider block">
                  Backend Pipeline Architecture
                </span>
                <div className="space-y-1.5 font-mono text-[11px] text-[#24292f] dark:text-[#c9d1d9]">
                  <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                    <span className="h-2 w-2 rounded-full bg-[#0969da] dark:bg-[#58a6ff]" />
                    <span>Financial Transaction Stream Input</span>
                  </div>
                  <div className="text-center text-[#8b949e] font-bold text-[9px]">&darr; Processing</div>
                  <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                    <span className="h-2 w-2 rounded-full bg-[#d97706] dark:bg-[#f59e0b]" />
                    <span>Automated Categorization Engine</span>
                  </div>
                  <div className="text-center text-[#8b949e] font-bold text-[9px]">&darr; Storage & Caching</div>
                  <div className="flex items-center gap-2 rounded-md bg-white dark:bg-[#161b22] p-2 border border-[#d0d7de] dark:border-[#30363d]">
                    <span className="h-2 w-2 rounded-full bg-[#1f883d] dark:bg-[#39d353]" />
                    <span>PostgreSQL Database & Redis Query Cache</span>
                  </div>
                </div>
              </div>
            )}

            {project.description && slug !== "constellation" && (
              <div className="pt-2">
                <ProjectBodyRenderer content={project.description} />
              </div>
            )}

            {/* Standardized Problem -> Solution -> Impact Card */}
            <div className="border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 pt-4 space-y-3">
              <h3 className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5 text-[#d97706] dark:text-[#f59e0b]" />
                <span>{slug === "career-os" ? "Technical Implementation" : "Technical Problem & Solution"}</span>
              </h3>

              <div className="rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/50 dark:bg-[#0d1117]/50 p-3.5 space-y-3">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-[#cf222e] dark:text-[#ff7b72]">
                    Problem
                  </span>
                  <p className="text-xs font-medium text-[#24292f] dark:text-[#f0f6fc]">
                    {project.problem ||
                      "Exposing self-hosted services directly to the internet creates firewall attack surfaces, while unmanaged containers risk data loss without automated backups and health monitoring."}
                  </p>
                </div>

                <div className="border-t border-[#d0d7de]/40 dark:border-[#30363d]/40 pt-2.5">
                  <span className="text-[9px] font-mono font-bold uppercase text-[#0969da] dark:text-[#58a6ff]">
                    Solution
                  </span>
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e]">
                    {project.solution ||
                      "Built an automated infrastructure setup with zero open inbound ports using Cloudflare Tunnels, Traefik v3 dynamic routing, isolated internal container networks, and encrypted offsite backups."}
                  </p>
                </div>

                <div className="border-t border-[#d0d7de]/40 dark:border-[#30363d]/40 pt-2.5">
                  <span className="text-[9px] font-mono font-bold uppercase text-[#1f883d] dark:text-[#39d353]">
                    Technical Outcome
                  </span>
                  <p className="text-xs font-semibold text-[#1f883d] dark:text-[#39d353]">
                    {slug === "constellation"
                      ? "Zero inbound attack surface, 100% automated encrypted daily backups with 14-day retention, and real-time Telegram alerts for service outages."
                      : slug === "fintrack-ai"
                      ? "Enabled automated transaction categorization and reliable expense processing via standardized PostgreSQL schemas."
                      : "Centralized content schema management across portfolio UI, PDF generators, and APIs."}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 pt-4 space-y-3">
              <h3 className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Key Architecture Features</span>
              </h3>

              {slug === "constellation" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {constellationFeatures.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="rounded-lg border border-[#d0d7de]/60 dark:border-[#30363d]/60 bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60 p-3 space-y-1"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#24292f] dark:text-[#f0f6fc]">
                        <CheckCircle2 className="h-4 w-4 text-[#1f883d] dark:text-[#39d353] flex-shrink-0" />
                        <span>{feat.title}</span>
                      </div>
                      <p className="text-[11px] text-[#57606a] dark:text-[#8b949e] leading-relaxed pl-5">
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {projectFeatures.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-start gap-2 rounded-lg border border-[#d0d7de]/60 dark:border-[#30363d]/60 bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60 p-2.5 text-xs text-[#24292f] dark:text-[#c9d1d9]"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#1f883d] dark:text-[#39d353] mt-0.5 flex-shrink-0" />
                      <span className="font-medium leading-normal">{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Tech Stack & Scope (Span 1) */}
        <div className="space-y-5">
          {/* Tech Stack Card */}
          <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-3 shadow-xs">
            <h3 className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#57606a] dark:text-[#8b949e] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
              <Cpu className="h-3.5 w-3.5 text-[#0969da] dark:text-[#58a6ff]" />
              <span>Technical Stack</span>
            </h3>

            {slug === "constellation" ? (
              <div className="space-y-3 text-xs">
                {constellationStackCategories.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase text-[#8b949e] block">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {group.tech.map((tItem, tIdx) => (
                        <TechChip key={tIdx} name={tItem} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              project.tech_stack_detail && project.tech_stack_detail.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack_detail.map((tech: any, tIdx: number) => (
                    <TechChip key={tIdx} name={tech.name} />
                  ))}
                </div>
              )
            )}
          </div>

          {/* Scope & Ownership Card */}
          <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-3 shadow-xs">
            <h3 className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#57606a] dark:text-[#8b949e] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
              <span>Technical Focus</span>
            </h3>

            <div className="space-y-2 text-xs text-[#57606a] dark:text-[#8b949e]">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-[#8b949e] block">
                  Role
                </span>
                <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                  Solo Developer
                </span>
              </div>

              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-[#8b949e] block">
                  Technical Focus
                </span>
                <span className="text-[#24292f] dark:text-[#c9d1d9]">
                  {slug === "constellation"
                    ? "Platform Engineering, Self-Hosting & Container Orchestration"
                    : "Backend Architecture, API Design & Containerization"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
