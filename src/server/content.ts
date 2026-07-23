import { branches } from "@/content/branches";
import { categories } from "@/content/categories";
import { expressCourses } from "@/content/express";
import { faqItems } from "@/content/faq";
import { galleryAlbums } from "@/content/gallery";
import { resultPosts } from "@/content/results";
import { settings } from "@/content/settings";
import { testimonials } from "@/content/testimonials";
import type {
  Branch,
  Category,
  ExpressCourse,
  FaqItem,
  GalleryAlbum,
  ResultPost,
  SiteSettings,
  Testimonial,
} from "@/content/types";

/**
 * Content service — the single read boundary between templates and content
 * (TZ doc 04 §2.5). Templates never import from src/content directly; when
 * the admin CMS ships (milestone 2), these functions switch to database
 * queries + cache revalidation without touching a single template. The
 * async signatures are that future contract.
 */

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(slug: string): Promise<Category | null> {
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getBranches(): Promise<Branch[]> {
  return branches;
}

export async function getBranch(slug: string): Promise<Branch | null> {
  return branches.find((branch) => branch.slug === slug) ?? null;
}

export async function getExpressCourses(): Promise<ExpressCourse[]> {
  return expressCourses;
}

export async function getFaqItems(): Promise<FaqItem[]> {
  return faqItems;
}

export async function getFeaturedFaqItems(): Promise<FaqItem[]> {
  return faqItems.filter((item) => item.featured).slice(0, 5);
}

/** Result posts, newest month first. */
export async function getResultPosts(): Promise<ResultPost[]> {
  return [...resultPosts].sort((a, b) => b.month.localeCompare(a.month));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}

export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  return galleryAlbums;
}

export async function getSettings(): Promise<SiteSettings> {
  return settings;
}
