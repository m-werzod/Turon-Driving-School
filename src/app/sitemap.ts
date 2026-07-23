import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getBranches, getCategories } from "@/server/content";
import { SITE_URL } from "@/lib/site";

type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Sitemap for all public routes in both locales, each with hreflang
 * alternates and x-default → UZ (TZ doc 18 §2). Dynamic entity routes are
 * expanded from the content service.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, branches] = await Promise.all([
    getCategories(),
    getBranches(),
  ]);

  const staticHrefs: Href[] = [
    "/",
    "/categories",
    "/express-courses",
    "/pricing",
    "/branches",
    "/results",
    "/gallery",
    "/about",
    "/faq",
    "/contact",
    "/register",
    "/privacy",
  ];

  const dynamicHrefs: Href[] = [
    ...categories.map((category) => ({
      pathname: "/categories/[slug]" as const,
      params: { slug: category.slug },
    })),
    ...branches.map((branch) => ({
      pathname: "/branches/[slug]" as const,
      params: { slug: branch.slug },
    })),
  ];

  const now = new Date();

  return [...staticHrefs, ...dynamicHrefs].map((href) => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = absolute(getPathname({ href, locale }));
    }
    languages["x-default"] = absolute(
      getPathname({ href, locale: routing.defaultLocale }),
    );

    return {
      url: absolute(getPathname({ href, locale: routing.defaultLocale })),
      lastModified: now,
      changeFrequency: "weekly",
      alternates: { languages },
    };
  });
}

function absolute(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}
