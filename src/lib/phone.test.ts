import { describe, expect, it } from "vitest";
import {
  formatUzPhone,
  isValidUzPhone,
  normalizeUzPhone,
  telHref,
} from "./phone";

describe("normalizeUzPhone", () => {
  it("accepts a spaced +998 number", () => {
    expect(normalizeUzPhone("+998 90 123 45 67")).toBe("+998901234567");
  });

  it("accepts a 12-digit 998 number without plus", () => {
    expect(normalizeUzPhone("998901234567")).toBe("+998901234567");
  });

  it("accepts a bare 9-digit national number", () => {
    expect(normalizeUzPhone("901234567")).toBe("+998901234567");
  });

  it("rejects too few digits", () => {
    expect(normalizeUzPhone("12345")).toBeNull();
  });

  it("rejects a wrong country code length", () => {
    expect(normalizeUzPhone("99890123456")).toBeNull();
  });
});

describe("isValidUzPhone", () => {
  it("is true for a valid number and false otherwise", () => {
    expect(isValidUzPhone("+998901234567")).toBe(true);
    expect(isValidUzPhone("hello")).toBe(false);
  });
});

describe("formatUzPhone", () => {
  it("groups an E.164 number for display", () => {
    expect(formatUzPhone("+998901234567")).toBe("+998 90 123 45 67");
  });

  it("returns the input unchanged when not E.164", () => {
    expect(formatUzPhone("+7900")).toBe("+7900");
  });
});

describe("telHref", () => {
  it("builds a tel: link", () => {
    expect(telHref("+998901234567")).toBe("tel:+998901234567");
  });
});
