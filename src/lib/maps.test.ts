import { describe, expect, it } from "vitest";
import {
  googleMapsEmbedUrl,
  googleMapsUrl,
  hasVerifiedLocation,
  yandexMapsUrl,
} from "./maps";
import { branches } from "@/content/branches";
import type { Branch } from "@/content/types";

function makeBranch(overrides: Partial<Branch>): Branch {
  return {
    slug: "test",
    name: { uz: "Test", ru: "Тест" },
    district: { uz: "Test", ru: "Тест" },
    landmark: { uz: "Test", ru: "Тест" },
    phones: [],
    hours: { uz: "", ru: "" },
    googleMapsUrl: null,
    geo: null,
    categorySlugs: [],
    hasAutodrome: false,
    ...overrides,
  };
}

describe("googleMapsUrl", () => {
  it("uses the school's share link verbatim", () => {
    const url = "https://maps.app.goo.gl/sR7ztHrt53abtcZY7";
    expect(googleMapsUrl(makeBranch({ googleMapsUrl: url }))).toBe(url);
  });

  it("prefers the share link over coordinates", () => {
    const url = "https://maps.app.goo.gl/abc";
    expect(
      googleMapsUrl(makeBranch({ googleMapsUrl: url, geo: { lat: 41, lng: 71 } })),
    ).toBe(url);
  });

  it("falls back to confirmed coordinates", () => {
    expect(googleMapsUrl(makeBranch({ geo: { lat: 41.009022, lng: 71.591299 } }))).toBe(
      "https://www.google.com/maps/search/?api=1&query=41.009022,71.591299",
    );
  });

  it("returns null rather than guessing from a name search", () => {
    expect(googleMapsUrl(makeBranch({}))).toBeNull();
  });
});

describe("yandexMapsUrl", () => {
  it("builds a pin from coordinates in lng,lat order", () => {
    expect(
      yandexMapsUrl(makeBranch({ geo: { lat: 41.009022, lng: 71.591299 } })),
    ).toContain("pt=71.591299,41.009022");
  });

  it("returns null without coordinates, even with a Google link", () => {
    expect(
      yandexMapsUrl(makeBranch({ googleMapsUrl: "https://maps.app.goo.gl/abc" })),
    ).toBeNull();
  });
});

describe("googleMapsEmbedUrl", () => {
  it("embeds coordinates only — never a text search", () => {
    expect(googleMapsEmbedUrl(makeBranch({ geo: { lat: 41, lng: 71 } }))).toContain(
      "q=41,71",
    );
    expect(
      googleMapsEmbedUrl(makeBranch({ googleMapsUrl: "https://maps.app.goo.gl/x" })),
    ).toBeNull();
  });
});

describe("hasVerifiedLocation", () => {
  it("is true with either source and false with neither", () => {
    expect(hasVerifiedLocation(makeBranch({ googleMapsUrl: "x" }))).toBe(true);
    expect(hasVerifiedLocation(makeBranch({ geo: { lat: 1, lng: 2 } }))).toBe(true);
    expect(hasVerifiedLocation(makeBranch({}))).toBe(false);
  });
});

describe("branch content", () => {
  it("has the four school-confirmed branches locatable", () => {
    for (const slug of ["kosonsoy", "buloq-avtodrom", "namangan-shahar", "tergachi"]) {
      const branch = branches.find((b) => b.slug === slug);
      expect(branch, `branch ${slug} missing`).toBeDefined();
      expect(hasVerifiedLocation(branch!), `${slug} not locatable`).toBe(true);
    }
  });

  it("carries no coordinates for branches the school has not confirmed", () => {
    for (const slug of ["kamuna", "bogishamol", "toraqorgon"]) {
      const branch = branches.find((b) => b.slug === slug);
      expect(branch?.geo, `${slug} should have no approximated geo`).toBeNull();
      expect(branch?.googleMapsUrl).toBeNull();
    }
  });
});
