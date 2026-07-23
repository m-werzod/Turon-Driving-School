"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AccordionEntry {
  id: string;
  question: string;
  answer: string;
}

/**
 * Accessible single-open accordion for FAQ blocks (TZ template T-11).
 * Native button + region wiring: aria-expanded, aria-controls, and a
 * grid-rows height transition that collapses to zero under reduced motion
 * via the same CSS the rest of the site uses.
 */
export function Accordion({ items }: { items: AccordionEntry[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  return (
    <div className="divide-y divide-ink-200 overflow-hidden rounded-card ring-1 ring-ink-200 bg-white">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;
        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-ink-900 transition-colors hover:bg-ink-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-600 sm:px-6"
              >
                <span className="text-pretty">{item.question}</span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-ink-400 transition-transform duration-300",
                    isOpen && "rotate-180 text-brand-600",
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-5 text-pretty text-ink-600 sm:px-6"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
