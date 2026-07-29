import Link from "next/link";
import { Terminal } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/SocialIcons";
import type { CareerMeta } from "@career-os/sdk";

export function Footer({ meta }: { meta?: CareerMeta }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/90 py-12 text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Column */}
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-base font-bold text-zinc-100 transition-colors hover:text-emerald-400"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
                <Terminal className="h-4 w-4" />
              </div>
              <span>{meta?.name ?? "Career OS"}</span>
            </Link>
            <p className="text-xs text-zinc-500 max-w-sm">
              {meta?.tagline ?? "Open engineering platform for professional identity."}
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-2 text-xs">
            <p className="font-mono text-xs font-semibold tracking-wider text-zinc-300 uppercase">
              Navigation
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/experience" className="hover:text-emerald-400 transition-colors">
                  Work Experience
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-emerald-400 transition-colors">
                  Projects Showcase
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-emerald-400 transition-colors">
                  Skills & Taxonomy
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="hover:text-emerald-400 transition-colors">
                  Career Milestones
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-400 transition-colors">
                  Articles & Thoughts
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Social Links */}
          <div className="space-y-3">
            <p className="font-mono text-xs font-semibold tracking-wider text-zinc-300 uppercase">
              Connect
            </p>
            <div className="flex items-center gap-3">
              {meta?.social?.github && (
                <a
                  href={meta.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 ring-1 ring-zinc-800 transition-colors hover:bg-zinc-800 hover:text-emerald-400"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {meta?.social?.linkedin && (
                <a
                  href={meta.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 ring-1 ring-zinc-800 transition-colors hover:bg-zinc-800 hover:text-emerald-400"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
              {meta?.social?.twitter && (
                <a
                  href={meta.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter Profile"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 ring-1 ring-zinc-800 transition-colors hover:bg-zinc-800 hover:text-emerald-400"
                >
                  <TwitterIcon className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="text-[11px] text-zinc-600 font-mono">
              Powered by <span className="text-zinc-400">Career OS</span> &bull; Version-controlled Git Content
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-900 pt-6 text-center text-xs text-zinc-600">
          &copy; {currentYear} {meta?.name ?? "Developer"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
