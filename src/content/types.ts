/**
 * Content entity types implementing the IA-level content model
 * (TZ doc 04 §9). Every public-facing text field is bilingual by contract
 * (doc 04 §2.3): `Localized<T>` requires both locales, so a missing
 * translation is a type error — the doc F-07 "missing translation must be
 * impossible" rule, enforced at compile time until the CMS publish gate
 * (milestone 2) takes over.
 */

export type ContentLocale = "uz" | "ru";

export type Localized<T = string> = Record<ContentLocale, T>;

/** Promotional price valid through the end of `endsOn` (ISO date, inclusive). */
export interface Promo {
  price: number;
  endsOn: string;
}

export interface CategoryFaqItem {
  question: Localized;
  answer: Localized;
}

export interface Category {
  slug: string;
  /** Official license category code shown on cards and in the hero. */
  code: string;
  name: Localized;
  /** One-line descriptor used in navigation dropdowns and cards. */
  tagline: Localized;
  /** Who the course is for — category hero subline. */
  audience: Localized;
  durationMonths: number;
  minAge: number;
  /** Base price in UZS. */
  basePrice: number;
  promo?: Promo;
  included: Localized<string[]>;
  curriculum: Localized<string[]>;
  requirements: Localized<string[]>;
  vehicles: Localized<string[]>;
  branchSlugs: string[];
  faq: CategoryFaqItem[];
  relatedSlugs: string[];
}

export interface ExpressCourse {
  slug: "theory" | "practice";
  name: Localized;
  audience: Localized;
  description: Localized;
  features: Localized<string[]>;
  duration: Localized;
  /** Price in UZS. */
  price: number;
}

export interface Branch {
  slug: string;
  name: Localized;
  district: Localized;
  /** Landmark-based address — the format locals actually use (doc 04 F-04). */
  landmark: Localized;
  /** E.164 numbers, e.g. +998901234567. */
  phones: string[];
  hours: Localized;
  /** Approximate until verified (docs/OPEN_ITEMS.md #11). */
  geo: { lat: number; lng: number } | null;
  categorySlugs: string[];
  hasAutodrome: boolean;
}

export type FaqTopic =
  | "enrollment"
  | "payment"
  | "process"
  | "exams"
  | "documents";

export interface FaqItem {
  id: string;
  topic: FaqTopic;
  question: Localized;
  answer: Localized;
  /** Featured items form the Home top-5 block (template T-01). */
  featured: boolean;
}

export interface ResultPost {
  id: string;
  /** Calendar month the exams took place in, formatted YYYY-MM. */
  month: string;
  branchSlug: string;
  passedCount: number;
  note?: Localized;
}

export interface Testimonial {
  id: string;
  name: string;
  categorySlug: string;
  quote: Localized;
}

export interface MediaItem {
  src: string;
  alt: Localized;
  width: number;
  height: number;
  video?: boolean;
  /** Poster frame shown before a video loads/plays; ignored for photos. */
  poster?: string;
}

export type AlbumKind =
  | "autodrome"
  | "classroom"
  | "graduation"
  | "vehicles"
  | "certificates"
  | "students"
  | "instructors"
  | "events";

export interface GalleryAlbum {
  id: string;
  title: Localized;
  kind: AlbumKind;
  branchSlug?: string;
  items: MediaItem[];
}

export interface SiteSettings {
  brandName: string;
  phones: { number: string; label: Localized }[];
  telegramUrl: string;
  instagramUrl: string;
  hours: Localized;
  counters: {
    branches: number;
    graduates: number;
    yearsActive: number;
  };
  /** About-page license block renders only when present (OPEN_ITEMS #5). */
  license: { number: string } | null;
}
