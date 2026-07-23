"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * One-time scroll reveal (docs/DECISIONS.md D-04). Adds data-reveal, then
 * flips data-revealed once the element enters the viewport; the transition
 * lives in globals.css and is neutralized under prefers-reduced-motion, so
 * this component needs no motion-preference logic of its own. `delay` staggers
 * siblings in a grid.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: "scale" | "left" | "right";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || revealed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <Tag
      ref={ref}
      data-reveal={variant ?? ""}
      data-revealed={revealed ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className && cn(className)}
    >
      {children}
    </Tag>
  );
}
