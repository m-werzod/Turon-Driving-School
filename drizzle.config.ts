import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Only db:migrate needs a live database; db:generate works offline.
    url: process.env.DATABASE_URL ?? "",
  },
});
