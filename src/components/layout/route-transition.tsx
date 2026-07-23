"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Branded transition flourish between routes. Most pages here are static/
 * prefetched (see the build output), so navigation itself is already
 * near-instant — this is a deliberately short, non-blocking fade+blur+logo
 * moment (~350ms) rather than a spinner that waits on real loading, which
 * would just add artificial delay. `pointer-events-none` throughout so it
 * never intercepts clicks, and it's skipped entirely under
 * prefers-reduced-motion.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (pathname === previousPathname.current) return;
    previousPathname.current = pathname;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 360);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-200 flex items-center justify-center bg-ink-950/60 backdrop-blur-md transition-opacity duration-300 ease-premium",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/assets/logo/logo.png"
          alt=""
          width={64}
          height={64}
          className="size-14 animate-pulse rounded-xl"
        />
        <span className="size-6 animate-spin rounded-full border-2 border-white/25 border-t-white" />
      </div>
    </div>
  );
}
