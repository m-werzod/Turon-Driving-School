import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Horizontal content frame with the platform's single max-width and
 * responsive gutters. Every section composes its width from this — page
 * templates never set their own horizontal padding.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}
