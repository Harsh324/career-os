export default function HomeLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-5">
          <div className="h-44 w-44 rounded-full bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
          <div className="h-6 w-36 rounded-md bg-[#afb8c1]/20 dark:bg-[#6e7681]/40" />
          <div className="h-4 w-48 rounded-md bg-[#afb8c1]/10 dark:bg-[#6e7681]/20" />
        </aside>

        <main className="lg:col-span-3 space-y-6">
          <div className="h-12 w-full rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22]" />
          <div className="space-y-4">
            <div className="h-28 w-full rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22]" />
            <div className="h-28 w-full rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22]" />
          </div>
        </main>
      </div>
    </div>
  );
}
