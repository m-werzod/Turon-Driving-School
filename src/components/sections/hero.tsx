import { GraduationCap, MapPin, Route } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { StatChip } from "@/components/ui/stat-chip";
import { getSettings } from "@/server/content";
import type { Locale } from "@/i18n/routing";

/**
 * Home hero (TZ template T-01): headline, subline, dual CTA, and trust stat
 * chips (7 branches / own autodrome / graduates count). Server-rendered for
 * an instant LCP with no client JS.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const settings = await getSettings();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,var(--color-brand-100)_0%,transparent_70%)]"
      />
      <Container className="relative py-16 sm:py-24 lg:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-ink-600 sm:text-xl">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/register"
              className={buttonClasses({ variant: "primary", size: "lg" })}
            >
              {t("primaryCta")}
            </Link>
            <Link
              href="/pricing"
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              {t("secondaryCta")}
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <StatChip icon={MapPin} label={t("chipBranches")} />
            <StatChip icon={Route} label={t("chipAutodrome")} />
            <StatChip
              icon={GraduationCap}
              label={t("chipGraduates", { count: settings.counters.graduates.toLocaleString("ru-RU") })}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
