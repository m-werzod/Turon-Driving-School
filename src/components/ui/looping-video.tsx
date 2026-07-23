"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Muted, looping background video with a pause/play control (WCAG 2.2 SC
 * 2.2.2 — auto-playing content over 5s needs a way to pause it). Starts
 * paused for prefers-reduced-motion users instead of autoplaying.
 */
export function LoopingVideo({
  src,
  poster,
  className,
  controlClassName,
}: {
  src: string;
  poster: string;
  className?: string;
  controlClassName?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.pause();
      setPlaying(false);
    }
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
        className={className}
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
          "absolute z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/20 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          controlClassName,
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
