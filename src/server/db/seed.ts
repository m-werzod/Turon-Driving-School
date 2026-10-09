/**
 * One-time seed script — run with `npm run db:seed`. NOT part of
 * `db:migrate`. Imports every existing src/content/*.ts module and inserts
 * it 1:1 into the new CMS tables, preserving slugs exactly (they're
 * load-bearing for URLs/sitemap/SEO), then seeds the temporary admin user.
 * Idempotent: each block checks whether its table already has rows before
 * inserting, so re-running after partial failure is safe.
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local is optional
}
try {
  process.loadEnvFile(".env");
} catch {
  // .env is optional
}

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { branches as branchesContent } from "@/content/branches";
import { categories as categoriesContent } from "@/content/categories";
import { expressCourses as expressCoursesContent } from "@/content/express";
import { faqItems as faqItemsContent } from "@/content/faq";
import { galleryAlbums as galleryAlbumsContent } from "@/content/gallery";
import { resultPosts as resultPostsContent } from "@/content/results";
import { settings as settingsContent } from "@/content/settings";
import { hashPassword } from "@/server/admin/password";

async function main() {
  // Prefer the direct (unpooled) connection — a one-shot script doesn't need
  // pgbouncer, and it avoids the prepared-statement caveat pooled Neon
  // connections have with postgres-js.
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set — nothing to seed against.");
  }

  const client = postgres(url, { max: 1, prepare: false });
  const db = drizzle(client, { schema });

  try {
    await seedSiteSettings(db);
    const branchIdBySlug = await seedBranches(db);
    const categoryIdBySlug = await seedCategories(db);
    await seedBranchCategories(db, branchIdBySlug, categoryIdBySlug);
    await seedExpressCourses(db);
    await seedGallery(db, branchIdBySlug);
    await seedFaqItems(db);
    await seedResultPosts(db, branchIdBySlug);
    await seedAdminUser(db);
  } finally {
    await client.end();
  }
}

type Db = ReturnType<typeof drizzle<typeof schema>>;

async function seedSiteSettings(db: Db) {
  const existing = await db.select().from(schema.siteSettings).limit(1);
  if (existing.length > 0) {
    console.log("[seed] site_settings already present — skipping");
    return;
  }
  await db.insert(schema.siteSettings).values({
    id: 1,
    brandName: settingsContent.brandName,
    phones: settingsContent.phones,
    telegramUrl: settingsContent.telegramUrl,
    instagramUrl: settingsContent.instagramUrl,
    hours: settingsContent.hours,
    branchesCount: settingsContent.counters.branches,
    graduatesCount: settingsContent.counters.graduates,
    yearsActive: settingsContent.counters.yearsActive,
    licenseNumber: settingsContent.license?.number ?? null,
  });
  console.log("[seed] site_settings seeded");
}

async function seedBranches(db: Db): Promise<Map<string, string>> {
  const idBySlug = new Map<string, string>();
  const existing = await db.select().from(schema.branches);
  if (existing.length > 0) {
    console.log(`[seed] branches already present (${existing.length}) — skipping`);
    for (const row of existing) idBySlug.set(row.slug, row.id);
    return idBySlug;
  }

  for (const [index, branch] of branchesContent.entries()) {
    const [row] = await db
      .insert(schema.branches)
      .values({
        slug: branch.slug,
        name: branch.name,
        district: branch.district,
        landmark: branch.landmark,
        phones: branch.phones,
        hours: branch.hours,
        googleMapsUrl: branch.googleMapsUrl,
        lat: branch.geo?.lat ?? null,
        lng: branch.geo?.lng ?? null,
        hasAutodrome: branch.hasAutodrome,
        order: index,
      })
      .returning({ id: schema.branches.id, slug: schema.branches.slug });
    idBySlug.set(row.slug, row.id);
  }
  console.log(`[seed] branches seeded (${branchesContent.length})`);
  return idBySlug;
}

async function seedCategories(db: Db): Promise<Map<string, string>> {
  const idBySlug = new Map<string, string>();
  const existing = await db.select().from(schema.categories);
  if (existing.length > 0) {
    console.log(`[seed] categories already present (${existing.length}) — skipping`);
    for (const row of existing) idBySlug.set(row.slug, row.id);
    return idBySlug;
  }

  for (const [index, category] of categoriesContent.entries()) {
    const [row] = await db
      .insert(schema.categories)
      .values({
        slug: category.slug,
        code: category.code,
        name: category.name,
        tagline: category.tagline,
        audience: category.audience,
        durationMonths: Math.round(category.durationMonths),
        minAge: category.minAge,
        basePrice: category.basePrice,
        promoPrice: category.promo?.price ?? null,
        promoEndsOn: category.promo?.endsOn ?? null,
        included: category.included,
        curriculum: category.curriculum,
        requirements: category.requirements,
        vehicles: category.vehicles,
        faq: category.faq,
        relatedSlugs: category.relatedSlugs,
        order: index,
      })
      .returning({ id: schema.categories.id, slug: schema.categories.slug });
    idBySlug.set(row.slug, row.id);
  }
  console.log(`[seed] categories seeded (${categoriesContent.length})`);
  return idBySlug;
}

async function seedBranchCategories(
  db: Db,
  branchIdBySlug: Map<string, string>,
  categoryIdBySlug: Map<string, string>,
) {
  const existing = await db.select().from(schema.branchCategories).limit(1);
  if (existing.length > 0) {
    console.log("[seed] branch_categories already present — skipping");
    return;
  }

  const rows: (typeof schema.branchCategories.$inferInsert)[] = [];
  for (const branch of branchesContent) {
    const branchId = branchIdBySlug.get(branch.slug);
    if (!branchId) continue;
    for (const categorySlug of branch.categorySlugs) {
      const categoryId = categoryIdBySlug.get(categorySlug);
      if (!categoryId) continue;
      rows.push({ branchId, categoryId });
    }
  }
  if (rows.length > 0) await db.insert(schema.branchCategories).values(rows);
  console.log(`[seed] branch_categories seeded (${rows.length})`);
}

async function seedExpressCourses(db: Db) {
  const existing = await db.select().from(schema.expressCourses).limit(1);
  if (existing.length > 0) {
    console.log("[seed] express_courses already present — skipping");
    return;
  }

  for (const [index, course] of expressCoursesContent.entries()) {
    await db.insert(schema.expressCourses).values({
      slug: course.slug,
      name: course.name,
      audience: course.audience,
      description: course.description,
      features: course.features,
      duration: course.duration,
      price: course.price,
      order: index,
    });
  }
  console.log(`[seed] express_courses seeded (${expressCoursesContent.length})`);
}

async function seedGallery(db: Db, branchIdBySlug: Map<string, string>) {
  const existing = await db.select().from(schema.galleryAlbums).limit(1);
  if (existing.length > 0) {
    console.log("[seed] gallery already present — skipping");
    return;
  }

  let mediaCount = 0;
  for (const [albumIndex, album] of galleryAlbumsContent.entries()) {
    const [albumRow] = await db
      .insert(schema.galleryAlbums)
      .values({
        title: album.title,
        kind: album.kind,
        branchId: album.branchSlug
          ? (branchIdBySlug.get(album.branchSlug) ?? null)
          : null,
        order: albumIndex,
      })
      .returning({ id: schema.galleryAlbums.id });

    for (const [itemIndex, item] of album.items.entries()) {
      const [mediaRow] = await db
        .insert(schema.mediaAssets)
        .values({
          url: item.src,
          kind: item.video ? "video" : "image",
          width: item.width,
          height: item.height,
          altText: item.alt,
          posterUrl: item.poster ?? null,
        })
        .returning({ id: schema.mediaAssets.id });

      await db.insert(schema.galleryAlbumItems).values({
        albumId: albumRow.id,
        mediaId: mediaRow.id,
        order: itemIndex,
      });
      mediaCount += 1;
    }
  }
  console.log(
    `[seed] gallery seeded (${galleryAlbumsContent.length} albums, ${mediaCount} media items)`,
  );
}

async function seedFaqItems(db: Db) {
  const existing = await db.select().from(schema.faqItems).limit(1);
  if (existing.length > 0) {
    console.log("[seed] faq_items already present — skipping");
    return;
  }

  for (const [index, item] of faqItemsContent.entries()) {
    await db.insert(schema.faqItems).values({
      topic: item.topic,
      question: item.question,
      answer: item.answer,
      featured: item.featured,
      order: index,
    });
  }
  console.log(`[seed] faq_items seeded (${faqItemsContent.length})`);
}

async function seedResultPosts(db: Db, branchIdBySlug: Map<string, string>) {
  const existing = await db.select().from(schema.resultPosts).limit(1);
  if (existing.length > 0) {
    console.log("[seed] result_posts already present — skipping");
    return;
  }

  let inserted = 0;
  for (const post of resultPostsContent) {
    const branchId = branchIdBySlug.get(post.branchSlug);
    if (!branchId) {
      console.warn(
        `[seed] skipping result post "${post.id}" — unknown branch slug "${post.branchSlug}"`,
      );
      continue;
    }
    await db.insert(schema.resultPosts).values({
      month: post.month,
      branchId,
      passedCount: post.passedCount,
      note: post.note ?? null,
    });
    inserted += 1;
  }
  console.log(`[seed] result_posts seeded (${inserted})`);
}

async function seedAdminUser(db: Db) {
  const username = process.env.ADMIN_SEED_USERNAME || "Admin";
  const password = process.env.ADMIN_SEED_PASSWORD || "Admin123";

  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.username, username))
    .limit(1);
  if (existing.length > 0) {
    console.log(`[seed] admin user "${username}" already exists — skipping`);
    return;
  }

  await db.insert(schema.users).values({
    username,
    passwordHash: await hashPassword(password),
    role: "super_admin",
    displayName: "Administrator",
  });
  console.log(
    `[seed] admin user "${username}" created — change this password after first login`,
  );
}

main()
  .then(() => {
    console.log("[seed] done");
    process.exit(0);
  })
  .catch((error) => {
    console.error("[seed] failed:", error);
    process.exit(1);
  });
