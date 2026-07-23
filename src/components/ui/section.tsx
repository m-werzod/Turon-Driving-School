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
    <Tag id={id} className={cn("py-14 sm:py-20 lg:py-24", className)}>
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
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "text-pretty text-base text-ink-600 sm:text-lg",
            align === "center" ? "max-w-2xl" : "max-w-3xl",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
