import type { Metadata } from "next";
import { getCareerSDK } from "@/lib/get-career-os";
import { BookOpen, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Articles & Thoughts",
  description: "Technical articles, architecture papers, and thoughts on software engineering.",
};

export default async function BlogPage() {
  const sdk = await getCareerSDK();
  const posts = sdk.blog();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 border-b border-zinc-800 pb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-100">
          <BookOpen className="h-8 w-8 text-emerald-400" />
          <span>Articles & Technical Thoughts</span>
        </h1>
        <p className="text-base text-zinc-400">
          Articles on compiler design, monorepo architectures, and software platform engineering.
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post, idx) => (
          <article
            key={idx}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 transition-all hover:border-zinc-700 hover:bg-zinc-900/70"
          >
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1 text-emerald-400">
                <Calendar className="h-3.5 w-3.5" />
                {post.publishedDate}
              </span>
              {post.readingTimeMinutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTimeMinutes} min read
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-zinc-100 hover:text-emerald-400 transition-colors">
              {post.title}
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed">{post.description}</p>

            {post.body && (
              <div className="pt-2 text-xs text-zinc-400 italic">
                {post.body}
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="rounded bg-zinc-800/80 px-2 py-0.5 text-xs font-mono text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
