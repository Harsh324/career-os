import Link from "next/link";
import { fetchSiteSettings } from "@/lib/api/services";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/SocialIcons";
import { GitNodeIcon } from "@/components/icons/GitNodeIcon";
import { DEFAULT_SITE_SETTINGS } from "@/lib/constants/site";

export async function Footer() {
  let meta = DEFAULT_SITE_SETTINGS;

  try {
    const fetched = await fetchSiteSettings();
    if (fetched) meta = { ...meta, ...fetched };
  } catch (err) {}

  return (
    <footer className="w-full border-t border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] transition-colors">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:px-6 py-8 sm:flex-row text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0969da]/10 dark:bg-[#388bfd]/15 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30 dark:border-[#58a6ff]/30">
            <GitNodeIcon className="h-3.5 w-3.5" />
          </div>
          <span className="font-sans font-semibold text-[#24292f] dark:text-[#f0f6fc]">
            Powered by <span className="font-bold text-[#0969da] dark:text-[#58a6ff]">Career OS v2</span>
          </span>
          <span>&bull;</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-sans">
          <Link href="/experience" className="hover:text-[#0969da] dark:hover:text-[#58a6ff] hover:underline">
            Experience
          </Link>
          <Link href="/projects" className="hover:text-[#0969da] dark:hover:text-[#58a6ff] hover:underline">
            Projects
          </Link>
          <Link href="/skills" className="hover:text-[#0969da] dark:hover:text-[#58a6ff] hover:underline">
            Skills
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {meta.github_url && (
            <a
              href={meta.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          )}
          {meta.linkedin_url && (
            <a
              href={meta.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          )}
          {meta.twitter_url && (
            <a
              href={meta.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors"
              aria-label="Twitter Profile"
            >
              <TwitterIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
