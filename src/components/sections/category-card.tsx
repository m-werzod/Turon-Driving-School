import { ArrowUpRight, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUzs, formatDuration } from "@/lib/format";
import { activePromo } from "@/lib/promo";
import type { Category, ContentLocale } from "@/content/types";

/** Category card for the hub grid and Home (TZ templates T-01/T-02). */
export function CategoryCard({ category }: { category: Category }) {
  const locale = useLocale() as ContentLocale;
  const t = useTranslations("common");
  const promo = activePromo(category.promo);
  const price = promo ? promo.price : category.basePrice;

  return (
    <Card interactive className="group relative h-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-brand-50 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <Link
        href={{ pathname: "/categories/[slug]", params: { slug: category.slug } }}
        className="relative flex h-full flex-col p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
      >
        <div className="flex items-center justify-between">
          <span className="grid size-14 place-items-center rounded-2xl bg-brand-900 text-xl font-black text-white shadow-(--shadow-glow-brand) transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
            {category.code}
          </span>
          {promo ? <Badge tone="accent">{t("promo")}</Badge> : null}
        </div>

        <h3 className="mt-5 font-display text-xl font-bold text-ink-900">
          {category.name[locale]}
        </h3>
        <p className="mt-1.5 text-pretty text-sm text-ink-600">{category.tagline[locale]}</p>

        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-ink-500">
          <Clock className="size-4 text-ink-400" aria-hidden="true" />
          {t("months", { months: formatDuration(category.durationMonths) })}
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-ink-100 pt-5">
          <div className="flex flex-col">
            {promo ? (
              <span className="text-xs font-medium text-ink-400 line-through">
                {formatUzs(category.basePrice, locale)}
              </span>
            ) : null}
            <p className="font-display text-lg font-extrabold text-ink-900">
              {t("priceFrom", { price: formatUzs(price, locale) })}
            </p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-accent-500 group-hover:text-white">
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
