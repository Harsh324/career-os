"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error?: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-[#f0f6fc] flex min-h-screen flex-col items-center justify-center p-6 text-center font-sans">
        <div className="space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-[#f0f6fc]">System Error Occurred</h2>
          <p className="text-xs text-[#8b949e]">
            An unexpected application error occurred.
          </p>
          {reset && (
            <button
              onClick={() => reset()}
              className="rounded-xl bg-[#0969da] px-4 py-2 text-xs font-mono font-semibold text-white shadow-xs hover:bg-[#085ac1] transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </body>
    </html>
  );
}
