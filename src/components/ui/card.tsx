import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Base surface for all card compositions (category, branch, price, result).
 * `interactive` adds the hover elevation used when the whole card is a link.
 */
export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-card bg-white ring-1 ring-ink-200/70 shadow-[var(--shadow-card)]",
        interactive &&
          "transition-shadow transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
