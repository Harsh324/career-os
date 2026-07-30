import Link from "next/link";
import { getCareerSDK } from "@/lib/get-career-os";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/SocialIcons";
import { GitNodeIcon } from "@/components/icons/GitNodeIcon";

export async function Footer() {
  const sdk = await getCareerSDK();
  const meta = sdk.meta();

  return (
    <footer className="w-full border-t border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] transition-colors">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:px-6 py-8 sm:flex-row text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0969da]/10 dark:bg-[#388bfd]/15 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30 dark:border-[#58a6ff]/30">
            <GitNodeIcon className="h-3.5 w-3.5" />
          </div>
          <span className="font-sans font-semibold text-[#24292f] dark:text-[#f0f6fc]">
            Powered by <span className="font-bold text-[#0969da] dark:text-[#58a6ff]">Career OS</span>
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
          <Link href="/blog" className="hover:text-[#0969da] dark:hover:text-[#58a6ff] hover:underline">
            Blog
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {meta.social?.github && (
            <a
              href={meta.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          )}
          {meta.social?.linkedin && (
            <a
              href={meta.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          )}
          {meta.social?.twitter && (
            <a
              href={meta.social.twitter}
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
