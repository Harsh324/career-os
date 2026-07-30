import type { Metadata } from "next";
import Link from "next/link";
import { getCareerSDK } from "@/lib/get-career-os";
import { FileText, Calendar, Clock, Tag, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Technical Articles",
  description: "Technical writing, architectural design decisions, compiler engineering, and software craft.",
};

export default async function BlogPage() {
  const sdk = await getCareerSDK();
  const posts = sdk.blog();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div className="space-y-3 border-b border-[#d0d7de] dark:border-[#30363d] pb-6 sm:pb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#24292f] dark:text-[#f0f6fc]">
          <FileText className="h-8 w-8 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Blog & Technical Writing</span>
        </h1>
        <p className="text-sm sm:text-base text-[#57606a] dark:text-[#8b949e]">
          Technical articles, architectural decision records, and system engineering thoughts. Click any article to read the full breakdown.
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post, idx) => {
          const postSlug = post.slug || `post-${idx}`;
          return (
            <Link
              key={idx}
              href={`/blog/${postSlug}`}
              className="group block rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 space-y-3 shadow-sm transition-all hover:border-[#0969da]/60 dark:hover:border-[#58a6ff]/60 hover:shadow-md no-underline hover:no-underline"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d0d7de]/50 dark:border-[#30363d]/50 pb-3">
                <h2 className="text-xl font-bold text-[#0969da] dark:text-[#58a6ff] group-hover:underline flex items-center justify-between gap-2">
                  <span>{post.title}</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#0969da] dark:text-[#58a6ff] flex-shrink-0" />
                </h2>
                <div className="flex items-center gap-3 text-xs font-mono text-[#57606a] dark:text-[#8b949e] flex-shrink-0">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
                    <span>{post.publishedDate}</span>
                  </span>
                  {post.readingTimeMinutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{post.readingTimeMinutes} min read</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed">
                {post.description}
              </p>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#d0d7de]/50 dark:border-[#30363d]/50">
                  {post.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1 rounded-md bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] px-2.5 py-0.5 text-xs font-mono text-[#57606a] dark:text-[#c9d1d9]"
                    >
                      <Tag className="h-3 w-3 text-[#0969da] dark:text-[#58a6ff]" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
