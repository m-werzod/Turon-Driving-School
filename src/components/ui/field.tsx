import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Shared input/select surface classes for consistent form controls. */
export const controlClasses =
  "block w-full rounded-control border-0 bg-white px-4 text-base text-ink-900 ring-1 ring-inset ring-ink-300 transition-shadow placeholder:text-ink-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 focus-visible:outline-none aria-[invalid=true]:ring-danger-600";

/**
 * Labeled field wrapper with accessible error wiring. Passes an id and the
 * aria-describedby/aria-invalid attributes to the control via render prop so
 * screen readers announce validation errors (WCAG 2.2).
 */
export function Field({
  id,
  label,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  }) => ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink-800">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
