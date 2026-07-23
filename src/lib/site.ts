import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/** Absolute site origin, no trailing slash (docs/OPEN_ITEMS.md #7). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

type Href = Parameters<typeof getPathname>[0]["href"];

/** Absolute URL for a typed route in a given locale. */
export function absoluteUrl(href: Href, locale: Locale): string {
  const path = getPathname({ href, locale });
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/**
 * hreflang alternates for a route: one entry per locale plus x-default → UZ
 * (TZ §4). Returned in the shape Next.js metadata `alternates.languages`
 * expects, keyed by BCP-47 tag.
 */
export function languageAlternates(href: Href): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of routing.locales) {
    alternates[locale] = absoluteUrl(href, locale);
  }
  alternates["x-default"] = absoluteUrl(href, routing.defaultLocale);
  return alternates;
}
