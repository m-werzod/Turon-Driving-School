import type { Branch } from "@/content/types";

/**
 * External map links (TZ flow F-04).
 *
 * Precedence is strict and there is deliberately **no text-search fallback**:
 * a search for a branch name can resolve to a same-named place in the wrong
 * district, and confidently wrong directions are worse than none. A branch is
 * locatable only from a source the school supplied (docs/DECISIONS.md D-09).
 * Every function returns null when that source is missing, and the UI then
 * omits the affordance entirely.
 */

/**
 * Google Maps link. Prefers the school's official share link (the exact pin
 * staff dropped, including the right place entity), then confirmed
 * coordinates.
 */
export function googleMapsUrl(branch: Branch): string | null {
  if (branch.googleMapsUrl) return branch.googleMapsUrl;
  if (branch.geo) {
    return `https://www.google.com/maps/search/?api=1&query=${branch.geo.lat},${branch.geo.lng}`;
  }
  return null;
}

/**
 * Yandex Maps link, from confirmed coordinates only — a Google share link
 * cannot be translated into a Yandex pin without resolving it first.
 */
export function yandexMapsUrl(branch: Branch): string | null {
  if (!branch.geo) return null;
  const { lat, lng } = branch.geo;
  return `https://yandex.com/maps/?pt=${lng},${lat}&z=17&l=map&mode=search`;
}

/**
 * No-API-key embeddable map (the classic `output=embed` share link, distinct
 * from the billed Maps Embed API). Coordinates only: embedding a text search
 * would render a map of the wrong place inside the page.
 */
export function googleMapsEmbedUrl(branch: Branch): string | null {
  if (!branch.geo) return null;
  return `https://www.google.com/maps?q=${branch.geo.lat},${branch.geo.lng}&z=16&output=embed`;
}

/** True when at least one accurate map destination exists for this branch. */
export function hasVerifiedLocation(branch: Branch): boolean {
  return Boolean(branch.googleMapsUrl || branch.geo);
}
