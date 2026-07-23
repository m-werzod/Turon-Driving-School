import type { LucideIcon } from "lucide-react";

/**
 * Designed empty state for content that is awaiting curation (results,
 * gallery, testimonials). Every list-driven template renders this instead of
 * a blank area when its data is not yet populated (the role standard's
 * "support empty state" requirement).
 */
export function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-card border border-dashed border-ink-200 bg-ink-50/50 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-white text-ink-400 ring-1 ring-ink-200">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-lg font-bold text-ink-900">{title}</p>
        <p className="text-pretty text-sm text-ink-600">{body}</p>
      </div>
    </div>
  );
}
