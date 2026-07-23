"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/** Guarantees the overlay reads as an actual loading state, not a flicker. */
const MIN_VISIBLE_MS = 280;
/** Safety net for navigations that never change the stripped pathname (e.g. same-route edge cases). */
const MAX_VISIBLE_MS = 5000;

/**
 * Blocking-feeling transition overlay: shows the instant a real internal
 * link is activated (via a document-level click listener, so it fires
 * before the browser/Next even starts the client-side transition) and
 * stays up — blurred, full-bleed — until the destination route has
 * actually committed (`usePathname` change), with a small minimum-visible
 * floor so it never reads as a single-frame flash. `pointer-events-none`
 * throughout so it never blocks the click that triggered it; skipped
 * entirely under prefers-reduced-motion.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const previousPathname = useRef(pathname);
  const shownAt = useRef<number | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function prefersReducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function show() {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (maxTimer.current) clearTimeout(maxTimer.current);
      shownAt.current = Date.now();
      setVisible(true);
      maxTimer.current = setTimeout(hide, MAX_VISIBLE_MS);
    }

    function hide() {
      if (maxTimer.current) clearTimeout(maxTimer.current);
      const elapsed = shownAt.current ? Date.now() - shownAt.current : MIN_VISIBLE_MS;
      const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);
      hideTimer.current = setTimeout(() => setVisible(false), remaining);
    }

    function onClick(event: MouseEvent) {
      if (prefersReducedMotion()) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      show();
    }

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (maxTimer.current) clearTimeout(maxTimer.current);
    };
  }, []);

  useEffect(() => {
    if (pathname === previousPathname.current) return;
    previousPathname.current = pathname;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (maxTimer.current) clearTimeout(maxTimer.current);
    const elapsed = shownAt.current ? Date.now() - shownAt.current : MIN_VISIBLE_MS;
    const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);
    hideTimer.current = setTimeout(() => setVisible(false), remaining);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-200 flex items-center justify-center bg-ink-950/70 backdrop-blur-lg transition-opacity duration-200 ease-premium",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/assets/logo/logo.png"
          alt=""
          width={64}
          height={64}
          className="size-14 animate-pulse rounded-xl"
        />
        <span className="size-7 animate-spin rounded-full border-2 border-white/25 border-t-white" />
      </div>
    </div>
  );
}
