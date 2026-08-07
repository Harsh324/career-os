export default function ProjectsLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-10 space-y-6 animate-pulse">
      <div className="space-y-2 border-b border-[#d0d7de] dark:border-[#30363d] pb-4">
        <div className="h-7 w-48 rounded-md bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
        <div className="h-4 w-96 rounded-md bg-[#afb8c1]/10 dark:bg-[#6e7681]/20" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-16 rounded-full bg-[#1f883d]/10 dark:bg-[#238636]/20" />
              <div className="h-4 w-12 rounded-md bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
            </div>
            <div className="h-6 w-3/4 rounded-md bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-full rounded-md bg-[#afb8c1]/10 dark:bg-[#6e7681]/20" />
              <div className="h-3.5 w-5/6 rounded-md bg-[#afb8c1]/10 dark:bg-[#6e7681]/20" />
            </div>
            <div className="flex gap-2 pt-3 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
              <div className="h-4 w-16 rounded-md bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
              <div className="h-4 w-16 rounded-md bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
