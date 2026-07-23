import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle<typeof schema>>;

let cached: Database | null = null;

/**
 * Lazily connected database handle, or null when DATABASE_URL is not set.
 * The public site never touches the database; only the lead service does,
 * and it degrades to Telegram-only delivery without one (docs/DECISIONS.md
 * D-07).
 */
export function getDb(): Database | null {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  cached = drizzle(postgres(url, { max: 5, connect_timeout: 10 }), { schema });
  return cached;
}
