import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL, absoluteUrl, languageAlternates } from "./site";

type Href = Parameters<typeof getPathname>[0]["href"];

const OG_LOCALE: Record<Locale, string> = {
  uz: "uz_UZ",
  ru: "ru_RU",
};

/**
 * Assembles per-page metadata to one standard (TZ doc 18 §3): title,
 * description, canonical, hreflang alternates, and Open Graph / Twitter cards.
 * Every page builds its metadata through this helper so the SEO surface never
 * drifts between templates.
 */
export function buildMetadata({
  title,
  description,
  href,
  locale,
  index = true,
}: {
  title: string;
  description: string;
  href: Href;
  locale: Locale;
  index?: boolean;
}): Metadata {
  const canonical = absoluteUrl(href, locale);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(href),
    },
    robots: index
      ? undefined
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: "Turon Avtomaktab",
      title,
      description,
      url: canonical,
      locale: OG_LOCALE[locale],
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
