import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <main className="flex flex-col items-center justify-center px-6 text-center max-w-3xl space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Career OS Platform v0.1.0 (Alpha)
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
          Your Professional Identity,{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            Version-Controlled.
          </span>
        </h1>

        <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
          Write once in Markdown. Career OS parses your canonical career data and synthesizes your portfolio website, resume, GitHub profile README, and AI recruiter assets.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-semibold px-6 py-2.5 rounded-lg transition">
            Explore Portfolio
          </Button>
          <a
            href="https://github.com/Harsh324/career-os"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200 text-sm font-medium transition"
          >
            GitHub Repository →
          </a>
        </div>
      </main>
    </div>
  );
}
