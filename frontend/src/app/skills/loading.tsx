export default function SkillsLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-10 space-y-6 animate-pulse">
      <div className="space-y-2 border-b border-[#d0d7de] dark:border-[#30363d] pb-4">
        <div className="h-7 w-60 rounded-md bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
        <div className="h-4 w-96 rounded-md bg-[#afb8c1]/10 dark:bg-[#6e7681]/20" />
      </div>

      <div className="h-20 w-full rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4" />

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs"
          >
            <div className="h-4 w-32 rounded-md bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
            <div className="space-y-2">
              <div className="h-10 w-full rounded-lg bg-[#f6f8fa] dark:bg-[#21262d]" />
              <div className="h-10 w-full rounded-lg bg-[#f6f8fa] dark:bg-[#21262d]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
