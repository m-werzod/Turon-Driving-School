import type { Locale } from "@/i18n/routing";
import type { Branch, Category, FaqItem, SiteSettings } from "@/content/types";
import { SITE_URL, absoluteUrl } from "./site";
import { activePromo } from "./promo";

/**
 * schema.org JSON-LD builders (TZ doc 18 §4). Each returns a plain object
 * consumed by <JsonLd>. All URLs are absolute and locale-correct.
 */

export function organizationSchema(
  settings: SiteSettings,
  locale: Locale,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    name: settings.brandName,
    url: absoluteUrl("/", locale),
    telephone: settings.phones[0]?.number,
    areaServed: "Namangan Region, Uzbekistan",
    sameAs: [settings.telegramUrl, settings.instagramUrl].filter(Boolean),
  };
}

export function branchSchema(
  branch: Branch,
  settings: SiteSettings,
  locale: Locale,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    name: `${settings.brandName} — ${branch.name[locale]}`,
    url: absoluteUrl(
      { pathname: "/branches/[slug]", params: { slug: branch.slug } },
      locale,
    ),
    telephone: branch.phones[0],
    address: {
      "@type": "PostalAddress",
      addressRegion: "Namangan",
      addressCountry: "UZ",
      description: branch.landmark[locale],
    },
    ...(branch.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: branch.geo.lat,
            longitude: branch.geo.lng,
          },
        }
      : {}),
    parentOrganization: {
      "@type": "DrivingSchool",
      name: settings.brandName,
      url: absoluteUrl("/", locale),
    },
  };
}

export function courseSchema(
  category: Category,
  settings: SiteSettings,
  locale: Locale,
): Record<string, unknown> {
  const promo = activePromo(category.promo);
  const price = promo ? promo.price : category.basePrice;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: category.name[locale],
    description: category.audience[locale],
    url: absoluteUrl(
      { pathname: "/categories/[slug]", params: { slug: category.slug } },
      locale,
    ),
    provider: {
      "@type": "DrivingSchool",
      name: settings.brandName,
      url: absoluteUrl("/", locale),
    },
    offers: {
      "@type": "Offer",
      price: String(price),
      priceCurrency: "UZS",
      category: "Paid",
      url: absoluteUrl(
        { pathname: "/categories/[slug]", params: { slug: category.slug } },
        locale,
      ),
    },
  };
}

export function faqSchema(
  items: FaqItem[],
  locale: Locale,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question[locale],
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer[locale],
      },
    })),
  };
}

export interface BreadcrumbEntry {
  name: string;
  url: string;
}

export function breadcrumbSchema(
  entries: BreadcrumbEntry[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.url,
    })),
  };
}

/** WebSite node for the homepage; anchors the site in search knowledge. */
export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Turon Avtomaktab",
    url: SITE_URL,
  };
}
