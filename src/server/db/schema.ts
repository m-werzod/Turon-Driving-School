import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

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
