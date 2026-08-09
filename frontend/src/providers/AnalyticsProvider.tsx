"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { sendTelemetryEvent, captureReferralCode } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathRef = useRef<string>("");

  useEffect(() => {
    captureReferralCode();
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    if (prevPathRef.current !== currentPath) {
      sendTelemetryEvent("page_view", pathname);
      prevPathRef.current = currentPath;
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
