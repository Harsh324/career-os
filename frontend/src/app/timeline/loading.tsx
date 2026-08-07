export default function TimelineLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-10 space-y-6 animate-pulse">
      <div className="space-y-2 border-b border-[#d0d7de] dark:border-[#30363d] pb-4">
        <div className="h-7 w-64 rounded-md bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
        <div className="h-4 w-96 rounded-md bg-[#afb8c1]/10 dark:bg-[#6e7681]/20" />
      </div>

      <div className="flex gap-2">
        <div className="h-7 w-24 rounded-full bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
        <div className="h-7 w-24 rounded-full bg-[#afb8c1]/10 dark:bg-[#6e7681]/20" />
      </div>

      <div className="relative border-l-2 border-[#d0d7de] dark:border-[#30363d] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 h-7 w-7 rounded-full bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
            <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-2 shadow-xs">
              <div className="h-5 w-48 rounded-md bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
              <div className="h-4 w-full rounded-md bg-[#afb8c1]/10 dark:bg-[#6e7681]/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
