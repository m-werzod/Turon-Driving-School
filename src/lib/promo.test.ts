import { describe, expect, it } from "vitest";
import { activePromo, promoDaysLeft } from "./promo";

const promo = { price: 2_000_000, endsOn: "2026-08-31" };

describe("activePromo", () => {
  it("returns null when undefined", () => {
    expect(activePromo(undefined)).toBeNull();
  });

  it("keeps a promo before its deadline", () => {
    const now = new Date("2026-08-01T10:00:00+05:00");
    expect(activePromo(promo, now)).toEqual(promo);
  });

  it("keeps a promo through the last day (inclusive)", () => {
    const now = new Date("2026-08-31T20:00:00+05:00");
    expect(activePromo(promo, now)).toEqual(promo);
  });

  it("drops a promo after the deadline", () => {
    const now = new Date("2026-09-01T00:30:00+05:00");
    expect(activePromo(promo, now)).toBeNull();
  });
});

describe("promoDaysLeft", () => {
  it("counts whole days remaining", () => {
    const now = new Date("2026-08-29T12:00:00+05:00");
    expect(promoDaysLeft(promo, now)).toBe(2);
  });

  it("never goes negative", () => {
    const now = new Date("2026-09-10T12:00:00+05:00");
    expect(promoDaysLeft(promo, now)).toBe(0);
  });
});
