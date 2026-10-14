import { describe, expect, it } from "vitest";
import { categories } from "./categories";

describe("category catalogue", () => {
  it("is ordered per the client's explicit instruction: A, B, BE, BC, C, CE, D", () => {
    const codes = categories.map((c) => c.code);
    expect(codes).toEqual(["A", "B", "BE", "BC", "C", "CE", "D"]);
  });

  it("does not include the E category — reserved, not sold", () => {
    expect(categories.some((c) => c.slug === "e")).toBe(false);
    expect(categories.some((c) => c.code === "E")).toBe(false);
  });

  it("has unique slugs and codes", () => {
    expect(new Set(categories.map((c) => c.slug)).size).toBe(categories.length);
    expect(new Set(categories.map((c) => c.code)).size).toBe(categories.length);
  });

  it("never carries a promo without a base price to discount from", () => {
    for (const category of categories) {
      if (category.promo) {
        expect(category.basePrice, `${category.code} has a promo but no base price`)
          .not.toBeNull();
      }
    }
  });

  it("A and B carry exactly the client-confirmed promo pricing", () => {
    const a = categories.find((c) => c.code === "A");
    const b = categories.find((c) => c.code === "B");
    expect(a?.basePrice).toBe(1_725_000);
    expect(a?.promo?.price).toBe(1_450_000);
    expect(b?.basePrice).toBe(5_883_000);
    expect(b?.promo?.price).toBe(5_050_000);
  });

  it("only references categories that exist in relatedSlugs", () => {
    const slugs = new Set(categories.map((c) => c.slug));
    for (const category of categories) {
      for (const related of category.relatedSlugs) {
        expect(slugs.has(related), `${category.code} -> unknown ${related}`).toBe(true);
      }
    }
  });
});
