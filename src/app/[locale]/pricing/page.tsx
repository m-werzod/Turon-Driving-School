import type { Metadata } from "next";
import { CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";
import { PromoBand } from "@/components/sections/promo-band";
import { PriceBlock } from "@/components/sections/price-block";
import { CtaBand } from "@/components/sections/cta-band";
import {
  getCategories,
  getExpressCourses,
  getFaqItems,
} from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import { formatUzs, formatDuration } from "@/lib/format";
import type { Locale } from "@/i18n/routing";
import type { ContentLocale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricingPage.meta" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    href: "/pricing",
    locale,
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const contentLocale = locale as ContentLocale;

  const [categories, express, faq, t, tCommon] = await Promise.all([
    getCategories(),
    getExpressCourses(),
    getFaqItems(),
    getTranslations({ locale, namespace: "pricingPage" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  const paymentFaq = faq.filter((item) => item.topic === "payment");
  const terms = [
    { icon: Wallet, title: t("terms.t1Title"), body: t("terms.t1Body") },
    { icon: CreditCard, title: t("terms.t2Title"), body: t("terms.t2Body") },
    { icon: ShieldCheck, title: t("terms.t3Title"), body: t("terms.t3Body") },
  ];

  return (
    <>
      <PromoBand />

      <Section>
        <SectionHeading title={t("title")} lead={t("intro")} />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={(index % 3) * 60}>
              <Card className="flex h-full flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-50 font-black text-brand-700">
                    {category.code}
                  </span>
                  <div>
                    <h2 className="font-bold text-ink-900">{category.name[contentLocale]}</h2>
                    <p className="text-sm text-ink-500">
                      {tCommon("months", { months: formatDuration(category.durationMonths) })}
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <PriceBlock basePrice={category.basePrice} promo={category.promo} />
                </div>
                <Link
                  href={{ pathname: "/categories/[slug]", params: { slug: category.slug } }}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-control bg-ink-900 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
                >
                  {t("cardCta")}
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-ink-50/60">
        <SectionHeading title={t("expressTitle")} align="start" />
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {express.map((course) => (
            <Card key={course.slug} className="flex items-center justify-between gap-4 p-6">
              <div>
                <h3 className="font-bold text-ink-900">{course.name[contentLocale]}</h3>
                <p className="text-sm text-ink-500">{course.duration[contentLocale]}</p>
              </div>
              <p className="text-xl font-bold text-ink-900">
                {formatUzs(course.price, contentLocale)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title={t("terms.title")} />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {terms.map((term) => (
            <div key={term.title} className="flex flex-col items-center gap-3 text-center">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-600 text-white">
                <term.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="font-bold text-ink-900">{term.title}</h3>
              <p className="text-pretty text-sm text-ink-600">{term.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {paymentFaq.length > 0 ? (
        <Section className="bg-ink-50/60">
          <SectionHeading title={t("faqTitle")} />
          <div className="mx-auto mt-10 max-w-3xl">
            <Accordion
              items={paymentFaq.map((item) => ({
                id: item.id,
                question: item.question[contentLocale],
                answer: item.answer[contentLocale],
              }))}
            />
          </div>
        </Section>
      ) : null}

      <CtaBand locale={locale} />
    </>
  );
}
