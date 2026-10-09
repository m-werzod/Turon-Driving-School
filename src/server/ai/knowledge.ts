import "server-only";
import {
  getBranches,
  getCategories,
  getExpressCourses,
  getFaqItems,
  getResultPosts,
  getSettings,
} from "@/server/content";
import { activePromo } from "@/lib/promo";
import { formatUzs, formatDuration, formatMonth } from "@/lib/format";
import { formatUzPhone } from "@/lib/phone";
import { googleMapsUrl } from "@/lib/maps";
import type { ContentLocale } from "@/content/types";

/**
 * The assistant's entire view of the platform.
 *
 * Every fact the model is allowed to state comes from one of these readers,
 * which go through the same content service the pages use — so the chatbot
 * can never drift from what the site shows. Three hard rules hold here:
 *
 *  1. **Public data only.** The platform has no student accounts, payments
 *     or attendance (see `src/server/db/schema.ts` — leads and staff users
 *     only), so no reader can expose a person's records. There is nothing
 *     private to leak through this surface.
 *  2. **No raw query access.** The model picks from a fixed, named set of
 *     readers with validated arguments; it cannot compose SQL or widen a
 *     scope.
 *  3. **Absence is reported, never filled in.** A reader returns an explicit
 *     "not published" marker rather than omitting the field, so the model
 *     says the information is unavailable instead of inventing it.
 */

export type ToolName =
  | "list_categories"
  | "get_category"
  | "list_branches"
  | "get_branch"
  | "list_express_courses"
  | "search_faq"
  | "get_contact_info"
  | "get_results_summary"
  | "get_enrollment_info";

/** Marker the model is instructed to surface verbatim in meaning. */
const NOT_PUBLISHED = "NOT_PUBLISHED" as const;

function priceOf(
  basePrice: number | null,
  promo: { price: number; endsOn: string } | undefined,
  locale: ContentLocale,
) {
  const active = activePromo(promo);
  if (basePrice === null && !active) {
    return { status: NOT_PUBLISHED, note: "Price not published; advise calling the school." };
  }
  return {
    currentPrice: formatUzs(active ? active.price : (basePrice as number), locale),
    basePrice: basePrice === null ? NOT_PUBLISHED : formatUzs(basePrice, locale),
    promoActive: Boolean(active),
    promoEndsOn: active ? active.endsOn : null,
  };
}

export async function listCategories(locale: ContentLocale) {
  const categories = await getCategories();
  return categories.map((c) => ({
    slug: c.slug,
    code: c.code,
    name: c.name[locale],
    forWhom: c.tagline[locale],
    durationMonths: formatDuration(c.durationMonths),
    minAge: c.minAge,
    ...priceOf(c.basePrice, c.promo, locale),
    url: `/toifalar/${c.slug}`,
  }));
}

export async function getCategoryDetail(slug: string, locale: ContentLocale) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug.toLowerCase());
  if (!category) {
    return {
      error: "NOT_FOUND",
      availableSlugs: categories.map((c) => c.slug),
    };
  }
  const branches = await getBranches();
  return {
    slug: category.slug,
    code: category.code,
    name: category.name[locale],
    audience: category.audience[locale],
    durationMonths: formatDuration(category.durationMonths),
    minAge: category.minAge,
    ...priceOf(category.basePrice, category.promo, locale),
    included: category.included[locale],
    curriculum: category.curriculum[locale],
    requirements: category.requirements[locale],
    vehicles: category.vehicles[locale],
    offeredAtBranches: category.branchSlugs
      .map((s) => branches.find((b) => b.slug === s)?.name[locale])
      .filter(Boolean),
    faq: category.faq.map((f) => ({
      q: f.question[locale],
      a: f.answer[locale],
    })),
    url: `/toifalar/${category.slug}`,
  };
}

export async function listBranches(locale: ContentLocale) {
  const branches = await getBranches();
  return branches.map((b) => ({
    slug: b.slug,
    name: b.name[locale],
    district: b.district[locale],
    landmark: b.landmark[locale],
    phones: b.phones.map(formatUzPhone),
    hours: b.hours[locale],
    hasAutodrome: b.hasAutodrome,
    // Null means the school has not supplied a verified location; the model
    // must not improvise directions from the landmark text.
    mapUrl: googleMapsUrl(b) ?? NOT_PUBLISHED,
    url: `/filiallar/${b.slug}`,
  }));
}

export async function getBranchDetail(slug: string, locale: ContentLocale) {
  const branches = await getBranches();
  const branch = branches.find((b) => b.slug === slug.toLowerCase());
  if (!branch) {
    return { error: "NOT_FOUND", availableSlugs: branches.map((b) => b.slug) };
  }
  const categories = await getCategories();
  return {
    slug: branch.slug,
    name: branch.name[locale],
    district: branch.district[locale],
    landmark: branch.landmark[locale],
    phones: branch.phones.map(formatUzPhone),
    hours: branch.hours[locale],
    hasAutodrome: branch.hasAutodrome,
    mapUrl: googleMapsUrl(branch) ?? NOT_PUBLISHED,
    categoriesOffered: branch.categorySlugs
      .map((s) => categories.find((c) => c.slug === s)?.name[locale])
      .filter(Boolean),
    url: `/filiallar/${branch.slug}`,
  };
}

export async function listExpressCourses(locale: ContentLocale) {
  const courses = await getExpressCourses();
  return courses.map((c) => ({
    slug: c.slug,
    name: c.name[locale],
    forWhom: c.audience[locale],
    description: c.description[locale],
    features: c.features[locale],
    duration: c.duration[locale],
    price: formatUzs(c.price, locale),
    url: "/express-kurslar",
  }));
}

export async function searchFaq(query: string, locale: ContentLocale) {
  const items = await getFaqItems();
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scored = items
    .map((item) => {
      const haystack =
        `${item.question[locale]} ${item.answer[locale]} ${item.topic}`.toLowerCase();
      const score = terms.reduce(
        (acc, term) => acc + (haystack.includes(term) ? 1 : 0),
        0,
      );
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // No keyword hit: hand back the featured set rather than nothing, so the
  // model still answers from real content instead of improvising.
  const chosen = scored.length > 0 ? scored.map((s) => s.item) : items.slice(0, 5);

  return chosen.map((item) => ({
    topic: item.topic,
    q: item.question[locale],
    a: item.answer[locale],
  }));
}

export async function getContactInfo(locale: ContentLocale) {
  const settings = await getSettings();
  return {
    brand: settings.brandName,
    phones: settings.phones.map((p) => ({
      number: formatUzPhone(p.number),
      label: p.label[locale],
    })),
    hours: settings.hours[locale],
    telegram: settings.telegramUrl,
    instagram: settings.instagramUrl,
    branchCount: settings.counters.branches,
    license: settings.license?.number ?? NOT_PUBLISHED,
    contactPageUrl: "/aloqa",
  };
}

export async function getResultsSummary(locale: ContentLocale) {
  const [posts, branches, settings] = await Promise.all([
    getResultPosts(),
    getBranches(),
    getSettings(),
  ]);
  if (posts.length === 0) {
    return { status: NOT_PUBLISHED, note: "No exam results published yet." };
  }
  return {
    totalGraduates: settings.counters.graduates,
    yearsActive: settings.counters.yearsActive,
    recent: posts.slice(0, 6).map((p) => ({
      month: formatMonth(p.month, locale),
      branch: branches.find((b) => b.slug === p.branchSlug)?.name[locale] ?? p.branchSlug,
      passed: p.passedCount,
    })),
    url: "/natijalar",
  };
}

/**
 * How enrolment actually works here: a lead form plus a callback. There is
 * no online payment and no student portal, and the model is told so
 * explicitly so it cannot imply either exists.
 */
export async function getEnrollmentInfo(locale: ContentLocale) {
  const faq = await getFaqItems();
  const enrolment = faq.filter(
    (f) => f.topic === "enrollment" || f.topic === "documents",
  );
  return {
    howItWorks:
      locale === "ru"
        ? "Посетитель оставляет заявку на сайте (имя и телефон) или звонит; менеджер перезванивает в рабочее время, помогает выбрать категорию и филиал и записывает в группу. Место бронируется предоплатой в филиале."
        : "Tashrifchi saytda ariza qoldiradi (ism va telefon) yoki qo'ng'iroq qiladi; menejer ish vaqtida qayta qo'ng'iroq qilib, toifa va filialni tanlashga yordam beradi va guruhga yozadi. O'rin filialda oldindan to'lov bilan band qilinadi.",
    registerUrl: "/royxatdan-otish",
    onlinePaymentAvailable: false,
    studentPortalAvailable: false,
    documents: enrolment.map((f) => ({ q: f.question[locale], a: f.answer[locale] })),
  };
}
