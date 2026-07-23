import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Floating glass stat card used in the hero's trust strip. Big number,
 * short label, icon — legible over both video and light surfaces.
 */
export function StatCard({
  icon: Icon,
  value,
  label,
  className,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-light flex items-center gap-3 rounded-2xl px-4 py-3.5 ring-1 ring-inset ring-white/60 shadow-(--shadow-card) sm:px-5 sm:py-4",
        className,
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-500 text-white shadow-(--shadow-glow-accent) sm:size-11">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg font-extrabold text-ink-900 sm:text-xl">
          {value}
        </span>
        <span className="text-xs font-medium text-ink-600 sm:text-sm">{label}</span>
      </span>
    </div>
  );
}
