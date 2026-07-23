import { GraduationCap, MapPin, Route, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { HeroVideo } from "./hero-video";
import { getSettings } from "@/server/content";
import type { Locale } from "@/i18n/routing";

/**
 * Home hero (TZ template T-01, redesigned): full-bleed autodrome footage,
 * dark gradient + brand wash overlay, large display headline, dual CTA, and
 * a strip of glass stat cards sitting cleanly below the video (not
 * overlapping it). Server-rendered copy; only the parallax video wrapper is
 * a client island.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const settings = await getSettings();

  return (
    <div className="relative -mt-20 lg:-mt-24">
      <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink-950 sm:min-h-screen">
        <HeroVideo
          src="/assets/videos/hero/hero-autodrome.mp4"
          poster="/assets/videos/hero/hero-poster.jpg"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 bg-linear-to-t from-ink-950 via-ink-950/55 to-ink-950/30"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 bg-linear-to-r from-ink-950/70 via-transparent to-brand-950/40"
        />

        <Container className="relative z-10 pb-24 pt-40 sm:pb-28 lg:pb-32">
          <div className="flex max-w-3xl flex-col items-start text-left">
            <span className="glass-dark inline-flex items-center gap-2 rounded-pill px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white ring-1 ring-inset ring-white/15 sm:text-sm">
              <ShieldCheck className="size-4 text-accent-400" aria-hidden="true" />
              {t("eyebrow")}
            </span>

            <h1 className="mt-6 text-balance font-display text-[2.75rem] font-extrabold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-[5.25rem]">
              {t("title")}
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-base text-white/75 sm:text-xl">
              {t("subtitle")}
            </p>

            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/register" className={buttonClasses({ variant: "primary", size: "lg" })}>
                {t("primaryCta")}
              </Link>
              <Link href="/pricing" className={buttonClasses({ variant: "glass", size: "lg" })}>
                {t("secondaryCta")}
              </Link>
            </div>
          </div>
        </Container>

        <div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 sm:flex"
        >
          <span className="h-9 w-5 rounded-pill border border-white/30 p-1">
            <span className="block size-1.5 animate-float rounded-full bg-white/70" />
          </span>
        </div>
      </section>

      <Container className="relative z-10 mt-8 sm:mt-10">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
          <StatCard
            icon={MapPin}
            value={String(settings.counters.branches)}
            label={t("statBranchesLabel")}
            href="/branches"
          />
          <StatCard
            icon={Route}
            value={t("statAutodromeValue")}
            label={t("statAutodromeLabel")}
            href={{ pathname: "/branches/[slug]", params: { slug: "buloq-avtodrom" } }}
          />
          <StatCard
            icon={GraduationCap}
            value={`${settings.counters.graduates.toLocaleString("ru-RU")}+`}
            label={t("statGraduatesLabel")}
            href="/results"
          />
          <StatCard
            icon={ShieldCheck}
            value={`${settings.counters.yearsActive}+`}
            label={t("statYearsLabel")}
            href="/about"
          />
        </div>
      </Container>
    </div>
  );
}
