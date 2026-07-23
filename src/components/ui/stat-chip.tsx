import type { LucideIcon } from "lucide-react";

/** Trust stat used in the hero chip row (TZ template T-01). */
export function StatChip({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-ink-700 ring-1 ring-inset ring-ink-200 backdrop-blur">
      <Icon className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
      {label}
    </span>
  );
}
