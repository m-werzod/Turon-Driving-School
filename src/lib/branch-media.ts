import type { Branch } from "@/content/types";

/**
 * Representative facility photos per branch. We don't have a photo taken at
 * each specific address, so branches rotate through real autodrome /
 * classroom / vehicle shots — authentic Turon photos, not stock imagery.
 */
const FACILITY_PHOTOS = [
  { src: "/assets/photos/classrooms/2.png", w: 1280, h: 960 },
  { src: "/assets/photos/vehicles/image.png", w: 1280, h: 960 },
  { src: "/assets/photos/classrooms/image3.png", w: 1280, h: 960 },
  { src: "/assets/photos/vehicles/image%20copy.png", w: 1280, h: 960 },
  { src: "/assets/photos/classrooms/image4.png", w: 1280, h: 960 },
  { src: "/assets/photos/vehicles/image%20copy%203.png", w: 960, h: 1280 },
];
const AUTODROME_PHOTOS = [
  { src: "/assets/photos/autodrome/fullshown.png", w: 1024, h: 1024 },
  { src: "/assets/photos/autodrome/image.png", w: 1024, h: 1024 },
  { src: "/assets/photos/autodrome/image%20copy%203.png", w: 1280, h: 960 },
];

export function facilityPhoto(branch: Branch, index: number) {
  return branch.hasAutodrome ? AUTODROME_PHOTOS[0] : FACILITY_PHOTOS[index % FACILITY_PHOTOS.length];
}

/** A small distinct set for the branch detail page's photo strip. */
export function facilityGallery(branch: Branch, index: number) {
  const pool = branch.hasAutodrome ? AUTODROME_PHOTOS : FACILITY_PHOTOS;
  return [pool[index % pool.length], pool[(index + 1) % pool.length], pool[(index + 2) % pool.length]];
}
