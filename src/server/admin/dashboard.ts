import { sql } from "drizzle-orm";
import { getDbOrThrow } from "@/server/db/client";
import { leads, leadStatus } from "@/server/db/schema";
import type { LeadStatus } from "./pipeline";

export type LeadStatusCounts = Record<LeadStatus, number>;

/** Lead counts by pipeline status, for the dashboard overview. */
export async function getLeadStatusCounts(): Promise<LeadStatusCounts> {
  const db = getDbOrThrow();
  const rows = await db
    .select({ status: leads.status, count: sql<number>`count(*)::int` })
    .from(leads)
    .groupBy(leads.status);

  const counts = Object.fromEntries(
    leadStatus.enumValues.map((status) => [status, 0]),
  ) as LeadStatusCounts;

  for (const row of rows) {
    counts[row.status] = row.count;
  }
  return counts;
}
