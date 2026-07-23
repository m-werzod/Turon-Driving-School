import { ArrowRight, Clock } from "lucide-react";
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
    <Card interactive className="group h-full">
      <Link
        href={{ pathname: "/categories/[slug]", params: { slug: category.slug } }}
        className="flex h-full flex-col p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        <div className="flex items-center justify-between">
          <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-lg font-black text-brand-700">
            {category.code}
          </span>
          {promo ? <Badge tone="accent">{t("promo")}</Badge> : null}
        </div>

        <h3 className="mt-4 text-lg font-bold text-ink-900">{category.name[locale]}</h3>
        <p className="mt-1 text-pretty text-sm text-ink-600">{category.tagline[locale]}</p>

        <div className="mt-4 flex items-center gap-1.5 text-sm text-ink-500">
          <Clock className="size-4 text-ink-400" aria-hidden="true" />
          {t("months", { months: formatDuration(category.durationMonths) })}
        </div>

        <div className="mt-auto flex items-end justify-between pt-5">
          <p className="text-base font-bold text-ink-900">
            {t("priceFrom", { price: formatUzs(price, locale) })}
          </p>
          <span className="grid size-9 place-items-center rounded-full bg-ink-100 text-ink-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
