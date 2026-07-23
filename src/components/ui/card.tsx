import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Base surface for all card compositions (category, branch, price, result).
 * `interactive` adds the hover elevation + lift used when the whole card is
 * a link.
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
        "rounded-card bg-white ring-1 ring-ink-200/60 shadow-(--shadow-card)",
        interactive &&
          "transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-(--shadow-card-hover) hover:ring-ink-300/60",
        className,
      )}
    >
      {children}
    </div>
  );
}
