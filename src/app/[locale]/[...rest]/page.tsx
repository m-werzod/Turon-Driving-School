import { notFound } from "next/navigation";

/**
 * Catch-all under a locale so any unmatched path (in either locale) renders
 * the localized 404 within the locale chrome (TZ §11). Excluded from static
 * generation — it exists only to trigger notFound().
 */
export default function CatchAllPage() {
  notFound();
}
