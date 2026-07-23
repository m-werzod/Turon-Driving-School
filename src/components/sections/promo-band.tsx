import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PromoCountdown } from "./promo-countdown";
import { getCategories } from "@/server/content";
import { activePromo } from "@/lib/promo";

/**
 * Active-promo band with live countdown (TZ templates T-01/T-05). Picks the
 * soonest-ending active promo across categories. Renders nothing when no promo
 * is active — the auto-expiry contract (AF-02) means an ended promo simply
 * disappears on the next revalidation with no manual action. The countdown's
 * own digits carry the deadline, so the copy stays free of a raw date string.
 */
export async function PromoBand() {
  const t = await getTranslations("home.promo");
  const categories = await getCategories();

  const soonest = categories
    .map((category) => activePromo(category.promo))
    .filter((promo): promo is NonNullable<typeof promo> => promo !== null)
    .sort((a, b) => a.endsOn.localeCompare(b.endsOn))[0];

  if (!soonest) return null;

  return (
    <section className="bg-ink-50/70 py-6 sm:py-8">
      <Container>
        <div className="relative isolate flex flex-col items-center gap-5 overflow-hidden rounded-card bg-linear-to-r from-accent-500 to-accent-600 px-6 py-6 text-center shadow-(--shadow-glow-accent) sm:flex-row sm:justify-between sm:px-8 sm:text-left">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-3xl"
          />
          <div className="relative flex items-center gap-3.5">
            <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-inset ring-white/25 sm:grid">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-base font-bold text-white sm:text-lg">
                {t("title")}
              </p>
              <p className="text-sm text-white/85">{t("subtitle")}</p>
            </div>
          </div>
          <div className="relative">
            <PromoCountdown endsOn={soonest.endsOn} />
          </div>
        </div>
      </Container>
    </section>
  );
}
