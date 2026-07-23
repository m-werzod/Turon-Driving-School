import type { ContentLocale } from "@/content/types";
import type { FooterData, HeaderData } from "@/components/layout/nav-data";
import { activePromo } from "@/lib/promo";
import { formatUzs } from "@/lib/format";
import {
  getBranches,
  getCategories,
  getSettings,
} from "./content";

/**
 * Builds the serializable navigation payload for the header and footer from
 * the content service, formatting prices and picking active promos on the
 * server so the client chrome receives only plain strings.
 */
export async function getHeaderData(locale: ContentLocale): Promise<HeaderData> {
  const [categories, branches, settings] = await Promise.all([
    getCategories(),
    getBranches(),
    getSettings(),
  ]);

  return {
    categories: categories.map((category) => {
      const promo = activePromo(category.promo);
      const price = promo ? promo.price : category.basePrice;
      return {
        slug: category.slug,
        code: category.code,
        name: category.name[locale],
        tagline: category.tagline[locale],
        priceFrom: formatUzs(price, locale),
      };
    }),
    branches: branches.map((branch) => ({
      slug: branch.slug,
      name: branch.name[locale],
      district: branch.district[locale],
      phones: branch.phones,
      hours: branch.hours[locale],
    })),
    phones: settings.phones.map((phone) => ({
      number: phone.number,
      label: phone.label[locale],
    })),
    telegramUrl: settings.telegramUrl,
    instagramUrl: settings.instagramUrl,
  };
}

export async function getFooterData(locale: ContentLocale): Promise<FooterData> {
  const [header, settings] = await Promise.all([
    getHeaderData(locale),
    getSettings(),
  ]);

  return {
    ...header,
    hours: settings.hours[locale],
    licenseNumber: settings.license?.number ?? null,
  };
}
