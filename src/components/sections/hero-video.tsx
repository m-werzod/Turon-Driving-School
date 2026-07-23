"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Full-bleed autoplaying hero background video with a cheap scroll-linked
 * parallax (translateY, rAF-throttled) and a pause/play control (WCAG 2.2
 * SC 2.2.2 — auto-playing content over 5s needs a way to pause it). Muted/
 * looped/inline so it autoplays on iOS without a user gesture; starts
 * paused for prefers-reduced-motion users instead of animating.
 */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      ref.current?.pause();
      setPlaying(false);
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

  function toggle() {
    const node = ref.current;
    if (!node) return;
    if (node.paused) {
      node.play();
      setPlaying(true);
    } else {
      node.pause();
      setPlaying(false);
    }
  }

  return (
    <>
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
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background video" : "Play background video"}
        className={cn(
          "absolute bottom-6 right-5 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/20 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-8 sm:right-8",
        )}
      >
        {playing ? (
          <Pause className="size-4" aria-hidden="true" />
        ) : (
          <Play className="ml-0.5 size-4" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
