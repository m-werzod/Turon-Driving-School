import type { ContentLocale } from "@/content/types";
import type { LeadFormOptions } from "@/components/forms/lead-form";
import {
  getBranches,
  getCategories,
  getExpressCourses,
  getSettings,
} from "./content";

/** Builds the serializable option lists the lead form select inputs need. */
export async function getLeadFormOptions(
  locale: ContentLocale,
): Promise<LeadFormOptions> {
  const [categories, express, branches, settings] = await Promise.all([
    getCategories(),
    getExpressCourses(),
    getBranches(),
    getSettings(),
  ]);

  return {
    categories: categories.map((category) => ({
      slug: category.slug,
      label: category.name[locale],
    })),
    express: express.map((course) => ({
      slug: course.slug,
      label: course.name[locale],
    })),
    branches: branches.map((branch) => ({
      slug: branch.slug,
      label: branch.name[locale],
    })),
    telegramUrl: settings.telegramUrl,
  };
}
