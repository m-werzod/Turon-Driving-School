import {
  boolean,
  check,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { Localized } from "@/content/types";

/**
 * Lead pipeline states per TZ admin flow AF-01. CMS content entities join
 * this schema in the admin-panel milestone (TZ doc 12); leads land first
 * because the money flow (F-01/F-02) must persist from day one.
 */
export const leadStatus = pgEnum("lead_status", [
  "new",
  "contacted",
  "registered",
  "lost",
  "enrolled",
]);

export const leadCourseType = pgEnum("lead_course_type", [
  "category",
  "express",
]);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    /** E.164, e.g. +998901234567. */
    phone: varchar("phone", { length: 13 }).notNull(),
    courseType: leadCourseType("course_type").notNull(),
    courseSlug: varchar("course_slug", { length: 30 }),
    branchSlug: varchar("branch_slug", { length: 50 }),
    locale: varchar("locale", { length: 2 }).notNull(),
    /** Internal pathname the form was submitted from (funnel analytics). */
    sourcePage: text("source_page").notNull(),
    status: leadStatus("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Admin pipeline board filters by status and orders newest-first (AF-01).
    index("leads_status_idx").on(table.status),
    index("leads_created_at_idx").on(table.createdAt),
  ],
);

export type LeadRow = typeof leads.$inferSelect;
export type NewLeadRow = typeof leads.$inferInsert;

/* -------------------------------------------------------------------------
 * Admin CMS schema (milestone 2). Bilingual text fields use jsonb columns
 * typed as `Localized<T>` so they round-trip to the exact shape templates
 * already read via src/server/content.ts (docs/DECISIONS.md D-06) — no
 * reshaping needed once a content.ts function switches from a static
 * src/content/*.ts module to a query against these tables. Entity slugs are
 * plain columns (locale-independent by contract, doc 04 §4).
 * ---------------------------------------------------------------------- */

/** Must match ADMIN_ROLES in src/server/admin/rbac.ts exactly. */
export const adminRole = pgEnum("admin_role", [
  "super_admin",
  "content_manager",
  "sales_manager",
]);

export const testimonialStatus = pgEnum("testimonial_status", [
  "pending",
  "approved",
  "hidden",
]);

export const newsStatus = pgEnum("news_status", [
  "draft",
  "scheduled",
  "published",
]);

export const mediaKind = pgEnum("media_kind", ["image", "video", "document"]);

export const pageStatus = pgEnum("page_status", ["draft", "published"]);

/** The fixed section-builder catalog (PART 5 of the CMS brief). */
export const sectionType = pgEnum("section_type", [
  "hero",
  "cards",
  "text",
  "faq",
  "video",
  "image",
  "pricing",
  "testimonials",
  "statistics",
  "custom_html",
  "button",
  "map",
  "accordion",
  "timeline",
  "gallery",
]);

// --- Auth -------------------------------------------------------------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  /** Self-describing scrypt string ("scrypt$N$r$p$saltHex$hashHex"). */
  passwordHash: text("password_hash").notNull(),
  role: adminRole("role").notNull().default("content_manager"),
  displayName: text("display_name"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** sha256 hex of the opaque session token; the raw token only ever lives in the cookie. */
    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    userAgent: text("user_agent"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_expires_at_idx").on(table.expiresAt),
  ],
);

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type SessionRow = typeof sessions.$inferSelect;
export type NewSessionRow = typeof sessions.$inferInsert;

// --- Media --------------------------------------------------------------

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Public Vercel Blob URL; null for pure embeds (YouTube/Instagram/TikTok). */
  url: text("url"),
  /** Blob pathname, required to call del() — null for embeds. */
  pathname: text("pathname"),
  kind: mediaKind("kind").notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  sizeBytes: integer("size_bytes"),
  width: integer("width"),
  height: integer("height"),
  altText: jsonb("alt_text").$type<Localized<string>>(),
  title: text("title"),
  /** Filter-only "folder" — a pathname prefix convention, not a second hierarchy. */
  folder: varchar("folder", { length: 100 }),
  /** Poster frame for videos. */
  posterUrl: text("poster_url"),
  embedProvider: varchar("embed_provider", { length: 20 }),
  embedUrl: text("embed_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type MediaAssetRow = typeof mediaAssets.$inferSelect;
export type NewMediaAssetRow = typeof mediaAssets.$inferInsert;

// --- Site settings (singleton) ------------------------------------------

export const siteSettings = pgTable(
  "site_settings",
  {
    id: integer("id").primaryKey().default(1),
    brandName: text("brand_name").notNull(),
    phones: jsonb("phones")
      .$type<{ number: string; label: Localized<string> }[]>()
      .notNull(),
    telegramUrl: text("telegram_url"),
    instagramUrl: text("instagram_url"),
    whatsappUrl: text("whatsapp_url"),
    facebookUrl: text("facebook_url"),
    youtubeUrl: text("youtube_url"),
    tiktokUrl: text("tiktok_url"),
    hours: jsonb("hours").$type<Localized<string>>(),
    emails: text("emails").array(),
    branchesCount: integer("branches_count").notNull().default(0),
    graduatesCount: integer("graduates_count").notNull().default(0),
    yearsActive: integer("years_active").notNull().default(0),
    licenseNumber: text("license_number"),
    logoMediaId: uuid("logo_media_id").references(() => mediaAssets.id),
    faviconMediaId: uuid("favicon_media_id").references(() => mediaAssets.id),
    footerText: jsonb("footer_text").$type<Localized<string>>(),
    address: jsonb("address").$type<Localized<string>>(),
    copyrightText: jsonb("copyright_text").$type<Localized<string>>(),
    googleMapsApiKey: text("google_maps_api_key"),
    analyticsIds: jsonb("analytics_ids").$type<{
      gtag?: string;
      ym?: string;
      fbPixel?: string;
    }>(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [check("site_settings_singleton", sql`${table.id} = 1`)],
);

export type SiteSettingsRow = typeof siteSettings.$inferSelect;
export type NewSiteSettingsRow = typeof siteSettings.$inferInsert;

// --- Branches & courses ---------------------------------------------------

export const branches = pgTable(
  "branches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 60 }).notNull().unique(),
    name: jsonb("name").$type<Localized<string>>().notNull(),
    district: jsonb("district").$type<Localized<string>>().notNull(),
    landmark: jsonb("landmark").$type<Localized<string>>().notNull(),
    phones: text("phones").array().notNull(),
    hours: jsonb("hours").$type<Localized<string>>().notNull(),
    /** Official Google Maps share link from the school; used verbatim. */
    googleMapsUrl: text("google_maps_url"),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    hasAutodrome: boolean("has_autodrome").notNull().default(false),
    isOpen: boolean("is_open").notNull().default(true),
    managerName: text("manager_name"),
    managerPhone: varchar("manager_phone", { length: 20 }),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("branches_order_idx").on(table.order)],
);

export type BranchRow = typeof branches.$inferSelect;
export type NewBranchRow = typeof branches.$inferInsert;

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 30 }).notNull().unique(),
    code: varchar("code", { length: 10 }).notNull(),
    name: jsonb("name").$type<Localized<string>>().notNull(),
    tagline: jsonb("tagline").$type<Localized<string>>().notNull(),
    audience: jsonb("audience").$type<Localized<string>>().notNull(),
    durationMonths: integer("duration_months").notNull(),
    minAge: integer("min_age").notNull(),
    /** UZS; null when the school has not published a price yet. */
    basePrice: integer("base_price"),
    promoPrice: integer("promo_price"),
    promoEndsOn: date("promo_ends_on"),
    included: jsonb("included").$type<Localized<string[]>>().notNull(),
    curriculum: jsonb("curriculum").$type<Localized<string[]>>().notNull(),
    requirements: jsonb("requirements")
      .$type<Localized<string[]>>()
      .notNull(),
    vehicles: jsonb("vehicles").$type<Localized<string[]>>().notNull(),
    faq: jsonb("faq")
      .$type<{ question: Localized<string>; answer: Localized<string> }[]>()
      .notNull()
      .default([]),
    relatedSlugs: text("related_slugs").array().notNull().default([]),
    imageMediaId: uuid("image_media_id").references(() => mediaAssets.id),
    order: integer("order").notNull().default(0),
    isEnabled: boolean("is_enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("categories_order_idx").on(table.order)],
);

export type CategoryRow = typeof categories.$inferSelect;
export type NewCategoryRow = typeof categories.$inferInsert;

export const branchCategories = pgTable(
  "branch_categories",
  {
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.branchId, table.categoryId] }),
    index("branch_categories_category_idx").on(table.categoryId),
  ],
);

export const expressCourses = pgTable(
  "express_courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 40 }).notNull().unique(),
    name: jsonb("name").$type<Localized<string>>().notNull(),
    audience: jsonb("audience").$type<Localized<string>>().notNull(),
    description: jsonb("description").$type<Localized<string>>().notNull(),
    features: jsonb("features").$type<Localized<string[]>>().notNull(),
    duration: jsonb("duration").$type<Localized<string>>().notNull(),
    /** UZS. */
    price: integer("price").notNull(),
    order: integer("order").notNull().default(0),
    isEnabled: boolean("is_enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("express_courses_order_idx").on(table.order)],
);

export type ExpressCourseRow = typeof expressCourses.$inferSelect;
export type NewExpressCourseRow = typeof expressCourses.$inferInsert;

// --- Teachers -------------------------------------------------------------

export const teachers = pgTable(
  "teachers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Proper names aren't translated. */
    fullName: text("full_name").notNull(),
    photoMediaId: uuid("photo_media_id").references(() => mediaAssets.id),
    bio: jsonb("bio").$type<Localized<string>>(),
    experienceYears: integer("experience_years"),
    certificates: jsonb("certificates")
      .$type<{ title: Localized<string>; mediaId: string | null }[]>()
      .notNull()
      .default([]),
    phone: varchar("phone", { length: 20 }),
    socials: jsonb("socials")
      .$type<{ platform: string; url: string }[]>()
      .notNull()
      .default([]),
    branchId: uuid("branch_id").references(() => branches.id, {
      onDelete: "set null",
    }),
    order: integer("order").notNull().default(0),
    isEnabled: boolean("is_enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("teachers_order_idx").on(table.order)],
);

export type TeacherRow = typeof teachers.$inferSelect;
export type NewTeacherRow = typeof teachers.$inferInsert;

export const teacherCategories = pgTable(
  "teacher_categories",
  {
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.teacherId, table.categoryId] })],
);

// --- Testimonials, gallery, FAQ, results ----------------------------------

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    quote: jsonb("quote").$type<Localized<string>>().notNull(),
    photoMediaId: uuid("photo_media_id").references(() => mediaAssets.id),
    rating: smallint("rating").notNull().default(5),
    status: testimonialStatus("status").notNull().default("pending"),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "testimonials_rating_range",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),
    index("testimonials_status_idx").on(table.status),
  ],
);

export type TestimonialRow = typeof testimonials.$inferSelect;
export type NewTestimonialRow = typeof testimonials.$inferInsert;

export const galleryAlbums = pgTable(
  "gallery_albums",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: jsonb("title").$type<Localized<string>>().notNull(),
    /** Mirrors AlbumKind in src/content/types.ts. */
    kind: varchar("kind", { length: 20 }).notNull(),
    branchId: uuid("branch_id").references(() => branches.id, {
      onDelete: "set null",
    }),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("gallery_albums_order_idx").on(table.order)],
);

export type GalleryAlbumRow = typeof galleryAlbums.$inferSelect;
export type NewGalleryAlbumRow = typeof galleryAlbums.$inferInsert;

export const galleryAlbumItems = pgTable(
  "gallery_album_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    albumId: uuid("album_id")
      .notNull()
      .references(() => galleryAlbums.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("gallery_album_items_album_idx").on(table.albumId)],
);

export type GalleryAlbumItemRow = typeof galleryAlbumItems.$inferSelect;
export type NewGalleryAlbumItemRow = typeof galleryAlbumItems.$inferInsert;

export const faqItems = pgTable(
  "faq_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Mirrors FaqTopic in src/content/types.ts. */
    topic: varchar("topic", { length: 20 }).notNull(),
    question: jsonb("question").$type<Localized<string>>().notNull(),
    answer: jsonb("answer").$type<Localized<string>>().notNull(),
    featured: boolean("featured").notNull().default(false),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("faq_items_order_idx").on(table.order)],
);

export type FaqItemRow = typeof faqItems.$inferSelect;
export type NewFaqItemRow = typeof faqItems.$inferInsert;

export const resultPosts = pgTable(
  "result_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** YYYY-MM. */
    month: varchar("month", { length: 7 }).notNull(),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "cascade" }),
    passedCount: integer("passed_count").notNull(),
    note: jsonb("note").$type<Localized<string>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("result_posts_month_idx").on(table.month)],
);

export type ResultPostRow = typeof resultPosts.$inferSelect;
export type NewResultPostRow = typeof resultPosts.$inferInsert;

// --- News -------------------------------------------------------------

export const newsCategories = pgTable("news_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  name: jsonb("name").$type<Localized<string>>().notNull(),
  order: integer("order").notNull().default(0),
});

export type NewsCategoryRow = typeof newsCategories.$inferSelect;
export type NewNewsCategoryRow = typeof newsCategories.$inferInsert;

export const newsTags = pgTable("news_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  name: jsonb("name").$type<Localized<string>>().notNull(),
});

export type NewsTagRow = typeof newsTags.$inferSelect;
export type NewNewsTagRow = typeof newsTags.$inferInsert;

export const newsPosts = pgTable(
  "news_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    title: jsonb("title").$type<Localized<string>>().notNull(),
    excerpt: jsonb("excerpt").$type<Localized<string>>(),
    /** Sanitized rich-text HTML — never render without re-sanitizing on output too. */
    contentHtml: jsonb("content_html").$type<Localized<string>>().notNull(),
    featuredImageId: uuid("featured_image_id").references(
      () => mediaAssets.id,
    ),
    categoryId: uuid("category_id").references(() => newsCategories.id, {
      onDelete: "set null",
    }),
    status: newsStatus("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    authorUserId: uuid("author_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    isPinned: boolean("is_pinned").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),
    readingTimeMinutes: integer("reading_time_minutes").notNull().default(1),
    seoTitle: jsonb("seo_title").$type<Localized<string>>(),
    seoDescription: jsonb("seo_description").$type<Localized<string>>(),
    seoKeywords: text("seo_keywords"),
    ogImageId: uuid("og_image_id").references(() => mediaAssets.id),
    canonicalUrl: text("canonical_url"),
    robotsNoindex: boolean("robots_noindex").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("news_posts_status_published_idx").on(
      table.status,
      table.publishedAt,
    ),
    index("news_posts_category_idx").on(table.categoryId),
  ],
);

export type NewsPostRow = typeof newsPosts.$inferSelect;
export type NewNewsPostRow = typeof newsPosts.$inferInsert;

export const newsPostTags = pgTable(
  "news_post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => newsPosts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => newsTags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.tagId] })],
);

export const newsPostGallery = pgTable(
  "news_post_gallery",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => newsPosts.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
  },
  (table) => [index("news_post_gallery_post_idx").on(table.postId)],
);

// --- Section manager (page builder) ---------------------------------------

/** Shared SEO-override shape, reused by pages and (inline) by news posts. */
export interface SeoOverride {
  title?: Localized<string>;
  description?: Localized<string>;
  keywords?: string;
  ogImageId?: string;
  canonical?: string;
  robotsNoindex?: boolean;
}

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** "home", "contact", or a future custom page — not a public URL by itself. */
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  /** Internal admin-facing label, not rendered publicly. */
  title: jsonb("title").$type<Localized<string>>().notNull(),
  status: pageStatus("status").notNull().default("draft"),
  seo: jsonb("seo").$type<SeoOverride>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type PageRow = typeof pages.$inferSelect;
export type NewPageRow = typeof pages.$inferInsert;

export const pageSections = pgTable(
  "page_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    type: sectionType("type").notNull(),
    order: integer("order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    /** Discriminated-union config per `type` — validated at the Zod boundary, not the DB (src/server/admin/blocks/schema.ts). */
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("page_sections_page_order_idx").on(table.pageId, table.order)],
);

export type PageSectionRow = typeof pageSections.$inferSelect;
export type NewPageSectionRow = typeof pageSections.$inferInsert;
