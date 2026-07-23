import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./container";

/**
 * Vertical rhythm primitive. Standardizes the block spacing between page
 * sections (mobile-first, expanding on larger viewports) so every template
 * shares one vertical scale. `bleed` opts out of the inner Container for
 * sections that manage their own full-width layout.
 */
export function Section({
  children,
  as: Tag = "section",
  className,
  containerClassName,
  bleed = false,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  containerClassName?: string;
  bleed?: boolean;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("py-20 sm:py-28 lg:py-32", className)}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </Tag>
  );
}

/**
 * Section heading block: optional eyebrow, title, and lead paragraph with
 * consistent type scale and spacing. Centered by default; `align="start"`
 * for left-aligned section intros.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "start";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em]",
            tone === "light"
              ? "bg-white/10 text-white ring-1 ring-inset ring-white/15"
              : "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-100",
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "text-balance font-display text-[2rem] font-extrabold leading-[1.08] tracking-tight sm:text-[2.75rem] lg:text-[3.25rem]",
          tone === "light" ? "text-white" : "text-ink-900",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "text-pretty text-base sm:text-lg",
            tone === "light" ? "text-white/70" : "text-ink-600",
            align === "center" ? "max-w-2xl" : "max-w-3xl",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
