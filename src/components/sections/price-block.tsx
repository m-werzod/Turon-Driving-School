import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { formatUzs } from "@/lib/format";
import { activePromo } from "@/lib/promo";
import type { ContentLocale, Promo } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Price display with promo handling (TZ template T-03 price block): when an
 * active promo exists, the base price is struck through and the promo price
 * is emphasized under a "Chegirma" badge (no deadline text in the badge
 * itself — the countdown on the promo band carries that). Otherwise only the
 * base price renders. Expired promos are filtered out server-side by
 * activePromo.
 * A null basePrice means the school has not published a price: we say so
 * plainly rather than showing a figure nobody confirmed.
 */
export function PriceBlock({
  basePrice,
  promo,
  size = "md",
}: {
  basePrice: number | null;
  promo?: Promo;
  size?: "md" | "lg";
}) {
  const locale = useLocale() as ContentLocale;
  const t = useTranslations("common");
  const active = activePromo(promo);

  const priceClass = cn(
    "font-bold tracking-tight text-ink-900",
    size === "lg" ? "text-3xl sm:text-4xl" : "text-2xl",
  );

  if (basePrice === null) {
    return (
      <p className={cn(priceClass, "text-xl sm:text-2xl")}>{t("priceOnRequest")}</p>
    );
  }

  if (!active) {
    return <p className={priceClass}>{formatUzs(basePrice, locale)}</p>;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline gap-2.5">
        <span className={priceClass}>{formatUzs(active.price, locale)}</span>
        <span
          className={cn(
            "font-medium text-ink-400 line-through",
            size === "lg" ? "text-xl" : "text-base",
          )}
        >
          {formatUzs(basePrice, locale)}
        </span>
      </div>
      <Badge tone="accent">{t("promo")}</Badge>
    </div>
  );
}
