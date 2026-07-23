import type { Promo } from "@/content/types";

/** School operates in Uzbekistan time; promos expire at end of day there. */
const BUSINESS_UTC_OFFSET = "+05:00";

/**
 * Returns the promo if it is still active at `now`, otherwise null.
 * `endsOn` is inclusive through the end of that calendar day in Uzbekistan
 * time — the auto-expiry contract of TZ flow AF-02 (no manual action when a
 * promo ends; expired promos simply stop rendering on next revalidation).
 */
export function activePromo(
  promo: Promo | undefined,
  now: Date = new Date(),
): Promo | null {
  if (!promo) return null;
  const end = new Date(`${promo.endsOn}T23:59:59.999${BUSINESS_UTC_OFFSET}`);
  return now.getTime() <= end.getTime() ? promo : null;
}

/** Whole days remaining until expiry (0 on the last day), for countdowns. */
export function promoDaysLeft(promo: Promo, now: Date = new Date()): number {
  const end = new Date(`${promo.endsOn}T23:59:59.999${BUSINESS_UTC_OFFSET}`);
  const ms = end.getTime() - now.getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}
