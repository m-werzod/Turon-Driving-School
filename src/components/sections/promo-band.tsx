import { Sparkles } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PromoCountdown } from "./promo-countdown";
import { getCategories } from "@/server/content";
import { activePromo } from "@/lib/promo";
import { formatDeadline } from "@/lib/format";
import type { ContentLocale } from "@/content/types";

/**
 * Active-promo band with live countdown (TZ templates T-01/T-05). Picks the
 * soonest-ending active promo across categories. Renders nothing when no promo
 * is active — the auto-expiry contract (AF-02) means an ended promo simply
 * disappears on the next revalidation with no manual action.
 */
export async function PromoBand() {
  const locale = (await getLocale()) as ContentLocale;
  const t = await getTranslations("home.promo");
  const categories = await getCategories();

  const soonest = categories
    .map((category) => activePromo(category.promo))
    .filter((promo): promo is NonNullable<typeof promo> => promo !== null)
    .sort((a, b) => a.endsOn.localeCompare(b.endsOn))[0];

  if (!soonest) return null;

  return (
    <section className="border-y border-accent-200/60 bg-accent-50">
      <Container className="py-5">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-accent-500 text-white shadow-(--shadow-glow-accent) sm:grid">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-base font-bold text-ink-900 sm:text-lg">
                {t("title")}
              </p>
              <p className="text-sm text-ink-600">
                {t("subtitle")} · {formatDeadline(soonest.endsOn, locale)}
              </p>
            </div>
          </div>
          <PromoCountdown endsOn={soonest.endsOn} />
        </div>
      </Container>
    </section>
  );
}
