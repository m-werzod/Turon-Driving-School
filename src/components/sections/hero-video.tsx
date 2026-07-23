"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed autoplaying hero background video with a cheap scroll-linked
 * parallax (translateY, rAF-throttled). Muted/looped/inline so it autoplays
 * on iOS without a user gesture; stays paused on its poster frame for
 * prefers-reduced-motion users instead of animating.
 */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      ref.current?.pause();
      return;
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const node = ref.current;
        if (node) {
          const offset = Math.min(window.scrollY * 0.25, 160);
          node.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      className="absolute inset-0 h-full w-full scale-105 object-cover"
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
