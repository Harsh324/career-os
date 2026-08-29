"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { sendTelemetryEvent, captureReferralCode } from "@/lib/analytics";

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathRef = useRef<string>("");

  useEffect(() => {
    captureReferralCode();
    const query = searchParams?.toString() ? `?${searchParams.toString()}` : "";
    const currentPath = pathname + query;

    if (prevPathRef.current !== currentPath) {
      sendTelemetryEvent("page_view", pathname ?? undefined);
      prevPathRef.current = currentPath;
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}
