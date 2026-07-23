import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type StatCardHref = Parameters<typeof Link>[0]["href"];

/**
 * Floating glass stat card used in the hero's trust strip. Big number,
 * short label, icon — legible over both video and light surfaces. Renders
 * as a link (with hover/focus affordance) when `href` is given, so each
 * stat can point at the page it actually backs (branches, results, about).
 */
export function StatCard({
  icon: Icon,
  value,
  label,
  href,
  className,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  href?: StatCardHref;
  className?: string;
}) {
  const content = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-500 text-white shadow-(--shadow-glow-accent) sm:size-11">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg font-extrabold text-ink-900 sm:text-xl">
          {value}
        </span>
        <span className="text-xs font-medium text-ink-600 sm:text-sm">{label}</span>
      </span>
    </>
  );

  const sharedClassName = cn(
    "glass-light flex items-center gap-3 rounded-2xl px-4 py-3.5 ring-1 ring-inset ring-white/60 shadow-(--shadow-card) sm:px-5 sm:py-4",
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          sharedClassName,
          "transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-(--shadow-card-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
        )}
      >
        {content}
      </Link>
    );
  }

  return <div className={sharedClassName}>{content}</div>;
}
