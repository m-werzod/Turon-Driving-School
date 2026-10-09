import { describe, expect, it } from "vitest";
import { categories } from "./categories";

describe("category catalogue", () => {
  it("is ordered A first and D last, with E included", () => {
    const codes = categories.map((c) => c.code);
    expect(codes[0]).toBe("A");
    expect(codes[codes.length - 1]).toBe("D");
    expect(codes).toContain("E");
    expect(codes).toEqual(["A", "B", "BC", "C", "CE", "BE", "E", "D"]);
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

  it("only references categories that exist in relatedSlugs", () => {
    const slugs = new Set(categories.map((c) => c.slug));
    for (const category of categories) {
      for (const related of category.relatedSlugs) {
        expect(slugs.has(related), `${category.code} -> unknown ${related}`).toBe(true);
      }
    }
  });
});
