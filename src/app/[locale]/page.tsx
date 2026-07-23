import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";
import { Hero } from "@/components/sections/hero";
import { PromoBand } from "@/components/sections/promo-band";
import { WhyGrid } from "@/components/sections/why-grid";
import { CategoryCard } from "@/components/sections/category-card";
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const contentLocale = locale as ContentLocale;

  const [categories, branches, faq, t, tExpress] = await Promise.all([
    getCategories(),
    getBranches(),
    getFeaturedFaqItems(),
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "home.express" }),
  ]);

  return (
    <>
      <Hero locale={locale} />
      <PromoBand />

      <Section>
        <SectionHeading
          title={t("categories.title")}
          lead={t("categories.subtitle")}
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={(index % 3) * 60}>
              <CategoryCard category={category} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/categories"
            className={buttonClasses({ variant: "secondary", size: "lg" })}
          >
            {t("categories.title")}
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </Section>

      <WhyGrid locale={locale} />

      {/* Express callout — high-urgency failed-exam segment (F-06) */}
      <Section>
        <div className="overflow-hidden rounded-card bg-ink-900 px-6 py-12 sm:px-12 sm:py-16">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">
              {tExpress("title")}
            </h2>
            <p className="text-pretty text-ink-300 sm:text-lg">{tExpress("subtitle")}</p>
            <Link
              href="/express-courses"
              className={buttonClasses({ variant: "accent", size: "lg" })}
            >
              {tExpress("cta")}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-ink-50/60">
        <SectionHeading title={t("branches.title")} lead={t("branches.subtitle")} />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {branches.slice(0, 6).map((branch, index) => (
            <Reveal key={branch.slug} delay={(index % 3) * 60}>
              <BranchCard branch={branch} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
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
        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion
            items={faq.map((item) => ({
              id: item.id,
              question: item.question[contentLocale],
              answer: item.answer[contentLocale],
            }))}
          />
          <div className="mt-8 flex justify-center">
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
