import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Car, CalendarClock, FileText, MapPin, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PriceBlock } from "@/components/sections/price-block";
import { CheckList, NumberedSteps } from "@/components/sections/feature-list";
import { CategoryCard } from "@/components/sections/category-card";
import { LeadFormSection } from "@/components/sections/lead-form-section";
import { JsonLd } from "@/components/seo/json-ld";
import { getBranch, getCategories, getCategory, getSettings } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, courseSchema, faqSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import { formatDuration } from "@/lib/format";
import type { Locale } from "@/i18n/routing";
import type { ContentLocale } from "@/content/types";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  const t = await getTranslations({ locale, namespace: "categoryDetail.meta" });
  return buildMetadata({
    title: t("title", { name: category.name[locale] }),
    description: t("description", { name: category.name[locale] }),
    href: { pathname: "/categories/[slug]", params: { slug } },
    locale,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const contentLocale = locale as ContentLocale;

  const category = await getCategory(slug);
  if (!category) notFound();

  const [t, tCommon, tNav, settings, allCategories] = await Promise.all([
    getTranslations({ locale, namespace: "categoryDetail" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "nav" }),
    getSettings(),
    getCategories(),
  ]);

  const offeringBranches = await Promise.all(
    category.branchSlugs.map((branchSlug) => getBranch(branchSlug)),
  );
  const related = category.relatedSlugs
    .map((relatedSlug) => allCategories.find((c) => c.slug === relatedSlug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const processSteps = [1, 2, 3, 4, 5].map((n) => ({
    title: t(`process.s${n}Title`),
    body: t(`process.s${n}Body`),
  }));

  const breadcrumbEntries = [
    { name: tCommon("brand"), url: absoluteUrl("/", locale) },
    { name: tNav("categories"), url: absoluteUrl("/categories", locale) },
    {
      name: category.name[locale],
      url: absoluteUrl({ pathname: "/categories/[slug]", params: { slug } }, locale),
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: tNav("categories"), href: "/categories" },
          { label: category.name[locale] },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-12 sm:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-grid size-14 place-items-center rounded-2xl bg-brand-600 text-xl font-black text-white">
                {category.code}
              </span>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                {category.name[locale]}
              </h1>
              <p className="mt-3 max-w-xl text-pretty text-ink-600 sm:text-lg">
                {category.audience[locale]}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone="neutral">
                  <CalendarClock className="size-3.5" aria-hidden="true" />
                  {t("durationValue", { months: formatDuration(category.durationMonths) })}
                </Badge>
                <Badge tone="neutral">
                  <Users className="size-3.5" aria-hidden="true" />
                  {t("minAgeValue", { age: category.minAge })}
                </Badge>
              </div>
            </div>
            <Card className="p-6 sm:p-8">
              <p className="text-sm font-semibold text-ink-500">{t("priceLabel")}</p>
              <div className="mt-2">
                <PriceBlock basePrice={category.basePrice} promo={category.promo} size="lg" />
              </div>
              <a
                href="#lead-form"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-control bg-brand-600 font-semibold text-white transition-colors hover:bg-brand-700"
              >
                {tCommon("register")}
              </a>
            </Card>
          </div>
        </Container>
      </section>

      {/* Included + curriculum */}
      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-ink-900">{t("included")}</h2>
            <div className="mt-5">
              <CheckList items={category.included[contentLocale]} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink-900">{t("curriculum")}</h2>
            <div className="mt-5">
              <CheckList items={category.curriculum[contentLocale]} />
            </div>
          </div>
        </div>
      </Section>

      {/* Requirements + vehicles */}
      <Section className="bg-ink-50/60">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-ink-900">
              <FileText className="size-5 text-brand-600" aria-hidden="true" />
              {t("requirements")}
            </h2>
            <div className="mt-5">
              <CheckList items={category.requirements[contentLocale]} />
            </div>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-ink-900">
              <Car className="size-5 text-brand-600" aria-hidden="true" />
              {t("vehicles")}
            </h2>
            <div className="mt-5">
              <CheckList items={category.vehicles[contentLocale]} />
            </div>
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section>
        <SectionHeading title={t("process.title")} />
        <div className="mt-10">
          <NumberedSteps steps={processSteps} />
        </div>
      </Section>

      {/* Offering branches */}
      <Section className="bg-ink-50/60">
        <SectionHeading title={t("branchesTitle")} align="start" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offeringBranches
            .filter((branch): branch is NonNullable<typeof branch> => Boolean(branch))
            .map((branch) => (
              <Link
                key={branch.slug}
                href={{ pathname: "/branches/[slug]", params: { slug: branch.slug } }}
                className="flex items-center gap-3 rounded-card bg-white p-4 ring-1 ring-ink-200 transition-shadow hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <MapPin className="size-5 shrink-0 text-brand-600" aria-hidden="true" />
                <span>
                  <span className="block font-semibold text-ink-900">{branch.name[locale]}</span>
                  <span className="block text-sm text-ink-500">{branch.district[locale]}</span>
                </span>
              </Link>
            ))}
        </div>
      </Section>

      {/* Category FAQ */}
      {category.faq.length > 0 ? (
        <Section>
          <SectionHeading title={t("faqTitle")} />
          <div className="mx-auto mt-10 max-w-3xl">
            <Accordion
              items={category.faq.map((item, index) => ({
                id: `cat-faq-${index}`,
                question: item.question[contentLocale],
                answer: item.answer[contentLocale],
              }))}
            />
          </div>
        </Section>
      ) : null}

      {/* Inline lead form, category preselected */}
      <LeadFormSection
        locale={locale}
        title={t("form.title")}
        subtitle={t("form.subtitle")}
        preselect={{ courseType: "category", courseSlug: category.slug }}
        className="bg-ink-50/60"
      />

      {/* Related categories */}
      {related.length > 0 ? (
        <Section>
          <SectionHeading title={t("related")} align="start" />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedCategory, index) => (
              <Reveal key={relatedCategory.slug} delay={index * 60}>
                <CategoryCard category={relatedCategory} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <JsonLd data={courseSchema(category, settings, locale)} />
      {category.faq.length > 0 ? (
        <JsonLd
          data={faqSchema(
            category.faq.map((item, index) => ({
              id: `cat-faq-${index}`,
              topic: "process" as const,
              question: item.question,
              answer: item.answer,
              featured: false,
            })),
            locale,
          )}
        />
      ) : null}
      <JsonLd data={breadcrumbSchema(breadcrumbEntries)} />
    </>
  );
}
