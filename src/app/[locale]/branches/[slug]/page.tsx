import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { YandexMapsIcon } from "@/components/ui/brand-icons";
import { JsonLd } from "@/components/seo/json-ld";
import { getBranch, getBranches, getCategories, getSettings } from "@/server/content";
import { buildMetadata } from "@/lib/metadata";
import { branchSchema, breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import { googleMapsEmbedUrl, googleMapsUrl, yandexMapsUrl } from "@/lib/maps";
import { facilityGallery, facilityPhoto } from "@/lib/branch-media";
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

  const [t, tCommon, tNav, settings, allCategories, branches] = await Promise.all([
    getTranslations({ locale, namespace: "branchDetail" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "nav" }),
    getSettings(),
    getCategories(),
    getBranches(),
  ]);

  const branchIndex = branches.findIndex((b) => b.slug === branch.slug);
  const heroPhoto = facilityPhoto(branch, branchIndex);
  const gallery = facilityGallery(branch, branchIndex);
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

      {/* Hero */}
      <section className="relative isolate flex min-h-[52vh] items-end overflow-hidden bg-ink-950 sm:min-h-[60vh]">
        <Image
          src={heroPhoto.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-ink-950/50 to-ink-950/20"
        />
        <Container className="relative py-10 sm:py-14">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              {branch.name[locale]}
            </h1>
            {branch.hasAutodrome ? <Badge tone="accent">{t("autodromeBadge")}</Badge> : null}
          </div>
          <p className="mt-2 flex items-center gap-2 text-white/70">
            <MapPin className="size-4" aria-hidden="true" />
            {branch.district[locale]}
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Embedded map */}
          <Card className="overflow-hidden lg:col-span-2">
            <iframe
              title={t("mapTitle", { name: branch.name[locale] })}
              src={googleMapsEmbedUrl(branch, mapQuery)}
              className="h-80 w-full sm:h-96"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex flex-col gap-3 p-6 sm:flex-row">
              <p className="flex flex-1 items-start gap-2 text-pretty text-sm text-ink-600">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent-500" aria-hidden="true" />
                {branch.landmark[locale]}
              </p>
              <div className="flex shrink-0 gap-2.5">
                <a
                  href={googleMapsUrl(branch, mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
                >
                  <Navigation className="size-4" aria-hidden="true" />
                  {t("openGoogle")}
                </a>
                <a
                  href={yandexMapsUrl(branch, mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-ink-50"
                >
                  <YandexMapsIcon className="size-4" />
                  {t("openYandex")}
                </a>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-500">
                <Phone className="size-4 text-accent-500" aria-hidden="true" />
                {t("phones")}
              </h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {branch.phones.map((phone) => (
                  <a
                    key={phone}
                    href={telHref(phone)}
                    className="font-display text-xl font-extrabold text-ink-900 transition-colors hover:text-accent-600"
                  >
                    {formatUzPhone(phone)}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-500">
                <Clock className="size-4 text-accent-500" aria-hidden="true" />
                {t("hours")}
              </h2>
              <p className="mt-2 font-medium text-ink-800">{branch.hours[locale]}</p>
            </div>
            <Link
              href="/register"
              className={buttonClasses({ variant: "primary", className: "mt-auto w-full" })}
            >
              {tNav("register")}
            </Link>
          </Card>
        </div>
      </Section>

      {/* Branch photo strip */}
      <Section className="bg-ink-50/70 pt-0">
        <SectionHeading title={t("galleryTitle")} align="start" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {gallery.map((photo, i) => (
            <div key={photo.src + i} className="relative aspect-4/3 overflow-hidden rounded-2xl">
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 ease-premium hover:scale-105"
              />
            </div>
          ))}
        </div>
      </Section>

      {offered.length > 0 ? (
        <Section>
          <SectionHeading title={t("categoriesTitle")} align="start" />
          <div className="mt-8 flex flex-wrap gap-3">
            {offered.map((category) => (
              <Link
                key={category.slug}
                href={{ pathname: "/categories/[slug]", params: { slug: category.slug } }}
                className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              >
                <span className="grid size-6 place-items-center rounded-md bg-brand-900 text-xs font-black text-white">
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
