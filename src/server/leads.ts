import type { LeadInput } from "@/lib/lead-schema";
import { normalizeUzPhone } from "@/lib/phone";
import { getDb } from "./db/client";
import { leads } from "./db/schema";
import { isTelegramConfigured, sendLeadNotification } from "./telegram";

export interface LeadResult {
  /** True when at least one delivery channel accepted the lead. */
  accepted: boolean;
  stored: boolean;
  notified: boolean;
}

/**
 * Persists and fans out a validated lead (TZ flow F-02): database insert +
 * Telegram notification to the managers group. Either channel alone is
 * sufficient for acceptance; with neither configured the caller must refuse
 * the submission rather than silently drop it (docs/DECISIONS.md D-07).
 */
export async function createLead(input: LeadInput): Promise<LeadResult> {
  const phone = normalizeUzPhone(input.phone);
  if (!phone) return { accepted: false, stored: false, notified: false };

  let stored = false;
  const db = getDb();
  if (db) {
    try {
      await db.insert(leads).values({
        name: input.name,
        phone,
        courseType: input.courseType,
        courseSlug: input.courseSlug ?? null,
        branchSlug: input.branchSlug ?? null,
        locale: input.locale,
        sourcePage: input.sourcePage,
      });
      stored = true;
    } catch (error) {
      console.error("[leads] database insert failed", error);
    }
  }

  const notified = await sendLeadNotification({ ...input, phone });

  return { accepted: stored || notified, stored, notified };
}

/** True when at least one lead delivery channel is configured. */
export function isLeadPipelineConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL) || isTelegramConfigured();
}
