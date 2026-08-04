import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Only db:migrate needs a live database; db:generate works offline.
    // Prefer the direct (unpooled) connection — migrations run DDL over a
    // single long-lived session, which a transaction-mode pooler doesn't
    // suit as well as the app's per-request pooled connection does.
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "",
  },
});
