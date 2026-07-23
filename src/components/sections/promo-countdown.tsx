"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { useLocale } from "next-intl";
import type { ContentLocale } from "@/content/types";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

const LABELS: Record<ContentLocale, { d: string; h: string; m: string; s: string }> = {
  uz: { d: "kun", h: "soat", m: "daq", s: "son" },
  ru: { d: "дн", h: "ч", m: "мин", s: "с" },
};

/**
 * Live countdown to a promo deadline (TZ template T-05). Renders on the
 * client only after mount to avoid hydration mismatch; the server shows the
 * static deadline date alongside. Auto-expiry (AF-02): once the target passes,
 * the component renders nothing and the page's next revalidation drops the
 * promo entirely.
 */
export function PromoCountdown({ endsOn }: { endsOn: string }) {
  const locale = useLocale() as ContentLocale;
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const target = new Date(`${endsOn}T23:59:59.999+05:00`).getTime();

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      setRemaining({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff / 3_600_000) % 24),
        minutes: Math.floor((diff / 60_000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        expired: false,
      });
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsOn]);

  if (!remaining || remaining.expired) return null;

  const labels = LABELS[locale];
  const units = [
    { value: remaining.days, label: labels.d },
    { value: remaining.hours, label: labels.h },
    { value: remaining.minutes, label: labels.m },
    { value: remaining.seconds, label: labels.s },
  ];

  return (
    <div className="inline-flex items-center gap-3">
      <Timer className="size-5 text-white/80" aria-hidden="true" />
      <div className="flex items-center gap-1.5" role="timer" aria-live="off">
        {units.map((unit, index) => (
          <div key={unit.label} className="flex items-center gap-1.5">
            <div className="flex min-w-11 flex-col items-center rounded-xl bg-ink-950/90 px-2 py-1.5 shadow-(--shadow-card)">
              <span className="font-mono text-lg font-bold tabular-nums text-white">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-medium uppercase text-white/50">
                {unit.label}
              </span>
            </div>
            {index < units.length - 1 ? (
              <span className="text-lg font-bold text-white/40" aria-hidden="true">
                :
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
