import type { Testimonial } from "./types";

/**
 * Testimonials await collection and moderation (docs/OPEN_ITEMS.md #10).
 * The Home testimonials section auto-hides while this list is empty —
 * fabricated reviews are prohibited by the content claims policy (TZ doc 09 §4).
 */
export const testimonials: Testimonial[] = [];
