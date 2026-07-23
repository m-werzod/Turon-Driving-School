import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { GoogleMapsIcon, YandexMapsIcon } from "@/components/ui/brand-icons";
import { JsonLd } from "@/components/seo/json-ld";
import { getBranch, getBranches, getCategories, getSettings } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import { branchSchema, breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import { googleMapsUrl, yandexMapsUrl } from "@/lib/maps";
import { formatUzPhone, telHref } from "@/lib/phone";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  const branches = await getBranches();
  return branches.map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const branch = await getBranch(slug);
  if (!branch) return {};
  const t = await getTranslations({ locale, namespace: "branchDetail.meta" });
  return buildMetadata({
    title: t("title", { name: branch.name[locale] }),
    description: t("description", { name: branch.name[locale] }),
    href: { pathname: "/branches/[slug]", params: { slug } },
    locale,
  });
}

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const branch = await getBranch(slug);
  if (!branch) notFound();

  const [t, tCommon, tNav, settings, allCategories] = await Promise.all([
    getTranslations({ locale, namespace: "branchDetail" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "nav" }),
    getSettings(),
    getCategories(),
  ]);

  const offered = allCategories.filter((category) =>
    branch.categorySlugs.includes(category.slug),
  );
  const mapQuery = `${branch.name[locale]}, ${branch.landmark[locale]}`;

  const breadcrumbEntries = [
    { name: tCommon("brand"), url: absoluteUrl("/", locale) },
    { name: tNav("branches"), url: absoluteUrl("/branches", locale) },
    {
      name: branch.name[locale],
      url: absoluteUrl({ pathname: "/branches/[slug]", params: { slug } }, locale),
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: tNav("branches"), href: "/branches" },
          { label: branch.name[locale] },
        ]}
      />

      <section className="bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-12 sm:py-16">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {branch.name[locale]}
            </h1>
            {branch.hasAutodrome ? <Badge tone="brand">{t("autodromeBadge")}</Badge> : null}
          </div>
          <p className="mt-2 text-ink-500">{branch.district[locale]}</p>
        </Container>
      </section>

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Address + directions */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <MapPin className="size-5 text-brand-600" aria-hidden="true" />
              {t("landmark")}
            </h2>
            <p className="mt-3 text-pretty text-ink-700">{branch.landmark[locale]}</p>
            <div className="mt-5">
              <p className="text-sm font-semibold text-ink-500">{t("directionsTitle")}</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <a
                  href={googleMapsUrl(branch, mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-control bg-white px-5 py-3 text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-ink-50"
                >
                  <GoogleMapsIcon className="size-5" />
                  {t("openGoogle")}
                </a>
                <a
                  href={yandexMapsUrl(branch, mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-control bg-white px-5 py-3 text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-ink-50"
                >
                  <YandexMapsIcon className="size-5" />
                  {t("openYandex")}
                </a>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="flex flex-col gap-5 p-6">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-500">
                <Phone className="size-4" aria-hidden="true" />
                {t("phones")}
              </h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {branch.phones.map((phone) => (
                  <a
                    key={phone}
                    href={telHref(phone)}
                    className="text-lg font-bold text-brand-700 transition-colors hover:text-brand-800"
                  >
                    {formatUzPhone(phone)}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-500">
                <Clock className="size-4" aria-hidden="true" />
                {t("hours")}
              </h2>
              <p className="mt-2 font-medium text-ink-800">{branch.hours[locale]}</p>
            </div>
          </Card>
        </div>
      </Section>

      {offered.length > 0 ? (
        <Section className="bg-ink-50/60">
          <SectionHeading title={t("categoriesTitle")} align="start" />
          <div className="mt-8 flex flex-wrap gap-3">
            {offered.map((category) => (
              <Link
                key={category.slug}
                href={{ pathname: "/categories/[slug]", params: { slug: category.slug } }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <span className="grid size-6 place-items-center rounded-md bg-brand-50 text-xs font-black text-brand-700">
                  {category.code}
                </span>
                {category.name[locale]}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand locale={locale} />

      <JsonLd data={branchSchema(branch, settings, locale)} />
      <JsonLd data={breadcrumbSchema(breadcrumbEntries)} />
    </>
  );
}
