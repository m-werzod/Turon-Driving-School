import type { Branch } from "@/content/types";

/**
 * External map deep links (TZ flow F-04). When verified coordinates exist we
 * link straight to the point; otherwise we fall back to a search query built
 * from the branch name + district so the link still resolves to the right
 * area (coordinates tracked in docs/OPEN_ITEMS.md #11).
 */
export function googleMapsUrl(branch: Branch, query: string): string {
  if (branch.geo) {
    return `https://www.google.com/maps/search/?api=1&query=${branch.geo.lat},${branch.geo.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function yandexMapsUrl(branch: Branch, query: string): string {
  if (branch.geo) {
    return `https://yandex.com/maps/?pt=${branch.geo.lng},${branch.geo.lat}&z=16&l=map`;
  }
  return `https://yandex.com/maps/?text=${encodeURIComponent(query)}`;
}

/**
 * No-API-key embeddable map (the classic `output=embed` share link, distinct
 * from the billed Maps Embed API). Falls back to a text search embed when a
 * branch has no verified coordinates yet (docs/OPEN_ITEMS.md #11).
 */
export function googleMapsEmbedUrl(branch: Branch, query: string): string {
  if (branch.geo) {
    return `https://www.google.com/maps?q=${branch.geo.lat},${branch.geo.lng}&z=16&output=embed`;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
