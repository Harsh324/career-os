import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchBlogPostBySlug, fetchSiteSettings } from "@/lib/api/services";
import { ArrowLeft, Calendar, Tag, BookOpen, UserCheck } from "lucide-react";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  let post = null;
  try {
    post = await fetchBlogPostBySlug(slug);
  } catch (err) {}

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: `${post.title} — Career OS Blog`,
    description: post.summary,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let post = null;
  let meta = { name: "Harsh Tripathi", title: "Backend & Cloud Engineer" };

  try {
    const [fetchedPost, fetchedSettings] = await Promise.all([
      fetchBlogPostBySlug(slug),
      fetchSiteSettings(),
    ]);
    post = fetchedPost;
    if (fetchedSettings) meta = { ...meta, ...fetchedSettings };
  } catch (err) {}

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Back Navigation Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0969da] dark:text-[#58a6ff] hover:underline transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to All Articles</span>
      </Link>

      {/* Article Header Metadata */}
      <div className="space-y-4 border-b border-[#d0d7de] dark:border-[#30363d] pb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#24292f] dark:text-[#f0f6fc] leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-[#57606a] dark:text-[#8b949e] leading-relaxed">
          {post.summary}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
          {/* Author info */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-[#0969da]/10 dark:bg-[#388bfd]/20 text-[#0969da] dark:text-[#58a6ff] flex items-center justify-center font-bold text-xs border border-[#0969da]/30">
              HT
            </div>
            <div>
              <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">{meta.name}</span>
              <span className="text-[11px] block text-[#57606a] dark:text-[#8b949e]">{meta.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] px-2.5 py-1 text-xs font-mono text-[#57606a] dark:text-[#c9d1d9]"
              >
                <Tag className="h-3 w-3 text-[#0969da] dark:text-[#58a6ff]" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Article Body Container */}
      <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#d0d7de]/50 dark:border-[#30363d]/50 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
            <BookOpen className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Technical Deep-Dive</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#1f883d] dark:text-[#39d353]">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Peer Reviewed</span>
          </div>
        </div>

        {/* Render Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base text-[#24292f] dark:text-[#c9d1d9] leading-relaxed space-y-4 font-sans">
          {post.content}
        </div>
      </div>
    </article>
  );
}
