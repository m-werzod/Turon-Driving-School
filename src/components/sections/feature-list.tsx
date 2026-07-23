import { Check } from "lucide-react";

/** Checkmarked feature/requirement list, shared by content templates. */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-pretty text-ink-700">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Check className="size-3.5" aria-hidden="true" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Ordered, numbered process steps (TZ T-03/T-04 "how it works"). */
export function NumberedSteps({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={index}
          className="relative rounded-card bg-white p-6 ring-1 ring-ink-200 shadow-[var(--shadow-card)]"
        >
          <span className="grid size-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {index + 1}
          </span>
          <h3 className="mt-4 text-base font-bold text-ink-900">{step.title}</h3>
          <p className="mt-1.5 text-pretty text-sm text-ink-600">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
