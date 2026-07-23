import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, LayoutGrid } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";
import { Hero } from "@/components/sections/hero";
import { PromoBand } from "@/components/sections/promo-band";
import { WhyGrid } from "@/components/sections/why-grid";
import { BranchCard } from "@/components/sections/branch-card";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getBranches,
  getCategories,
  getFeaturedFaqItems,
} from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import { websiteSchema } from "@/lib/schema";
import { formatUzs } from "@/lib/format";
import { activePromo } from "@/lib/promo";
import type { Locale } from "@/i18n/routing";
import type { ContentLocale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/",
    locale,
  });
}

/**
 * Home is deliberately a short funnel — Hero → Why → Categories → Express →
 * Branches → FAQ → CTA — not a scroll-forever brochure. The deeper
 * storytelling sections (student success, learning process, autodrome,
 * fleet, video stories) live on /results, /about and /gallery instead,
 * where they're contextually at home and don't bloat the landing page.
 * Testimonials are intentionally omitted — content/testimonials.ts is
 * still empty (no real quotes collected yet) and this build doesn't
 * fabricate customer testimonials; the section reappears automatically once
 * real ones are added, same as the FAQ/results empty-state pattern.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const contentLocale = locale as ContentLocale;

  const [categories, branches, faq, t, tExpress, tCommon] = await Promise.all([
    getCategories(),
    getBranches(),
    getFeaturedFaqItems(),
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "home.express" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  const cheapestPrice = categories.reduce((min, category) => {
    const promo = activePromo(category.promo);
    const price = promo ? promo.price : category.basePrice;
    return price < min ? price : min;
  }, Infinity);

  return (
    <>
      <Hero locale={locale} />
      <PromoBand />

      <WhyGrid locale={locale} />

      <Section>
        <SectionHeading
          eyebrow={t("categories.title")}
          title={t("categories.title")}
          lead={t("categories.subtitle")}
        />
        <Reveal className="mt-14">
          <Link
            href="/categories"
            className="group relative flex flex-col gap-8 overflow-hidden rounded-card bg-white p-8 shadow-(--shadow-card) ring-1 ring-inset ring-ink-100 transition-shadow duration-300 hover:shadow-(--shadow-card-hover) sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-brand-50 blur-3xl"
            />
            <div className="relative flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category.slug}
                    className="grid size-9 place-items-center rounded-lg bg-brand-900 text-xs font-black text-white"
                  >
                    {category.code}
                  </span>
                ))}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-ink-900 sm:text-2xl">
                  {t("categories.cardHeading")}
                </h3>
                <p className="mt-2 max-w-md text-pretty text-sm text-ink-600 sm:text-base">
                  {t("categories.cardBody")}
                </p>
              </div>
              <p className="font-display text-lg font-extrabold text-ink-900">
                {tCommon("priceFrom", { price: formatUzs(cheapestPrice, contentLocale) })}
              </p>
            </div>

            <span
              className={buttonClasses({
                variant: "primary",
                size: "lg",
                className: "relative shrink-0",
              })}
            >
              <LayoutGrid className="size-5" aria-hidden="true" />
              {t("categories.cta")}
              <ArrowUpRight
                className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </Reveal>
      </Section>

      {/* Express callout — high-urgency failed-exam segment (F-06) */}
      <Section className="bg-ink-50/70">
        <div className="relative isolate overflow-hidden rounded-card bg-ink-900 px-6 py-14 sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-accent-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-brand-500/20 blur-3xl"
          />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <h2 className="text-balance font-display text-2xl font-extrabold text-white sm:text-4xl">
              {tExpress("title")}
            </h2>
            <p className="text-pretty text-base text-white/60 sm:text-lg">{tExpress("subtitle")}</p>
            <Link
              href="/express-courses"
              className={buttonClasses({ variant: "primary", size: "lg" })}
            >
              {tExpress("cta")}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-ink-50/70">
        <SectionHeading eyebrow={t("branches.title")} title={t("branches.title")} lead={t("branches.subtitle")} />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {branches.slice(0, 6).map((branch, index) => (
            <Reveal key={branch.slug} delay={(index % 3) * 60}>
              <BranchCard branch={branch} index={index} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/branches"
            className={buttonClasses({ variant: "secondary", size: "lg" })}
          >
            {t("branches.title")}
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </Section>

      <Section>
        <SectionHeading title={t("faq.title")} />
        <div className="mx-auto mt-14 max-w-3xl">
          <Accordion
            items={faq.map((item) => ({
              id: item.id,
              question: item.question[contentLocale],
              answer: item.answer[contentLocale],
            }))}
          />
          <div className="mt-10 flex justify-center">
            <Link
              href="/faq"
              className={buttonClasses({ variant: "ghost", size: "lg" })}
            >
              {t("faq.cta")}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      <CtaBand locale={locale} />
      <JsonLd data={websiteSchema()} />
    </>
  );
}
