import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "brand" | "accent" | "neutral" | "success";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  accent: "bg-accent-50 text-accent-700 ring-accent-200",
  neutral: "bg-ink-100 text-ink-700 ring-ink-200",
  success: "bg-success-50 text-success-700 ring-success-600/20",
};

/** Small status/label pill. Accent tone is reserved for promo/urgency. */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
