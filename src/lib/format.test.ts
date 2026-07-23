import { describe, expect, it } from "vitest";
import { formatDeadline, formatDuration, formatMonth, formatUzs } from "./format";

describe("formatUzs", () => {
  const nbsp = "\u00a0";
  it("groups thousands with NBSP and appends the localized currency word", () => {
    expect(formatUzs(2_100_000, "uz")).toBe(`2${nbsp}100${nbsp}000${nbsp}so'm`);
    expect(formatUzs(2_100_000, "ru")).toBe(`2${nbsp}100${nbsp}000${nbsp}сум`);
  });
});

describe("formatMonth", () => {
  it("formats a YYYY-MM month per locale", () => {
    expect(formatMonth("2026-06", "uz")).toBe("Iyun 2026");
    expect(formatMonth("2026-06", "ru")).toBe("Июнь 2026");
  });
});

describe("formatDeadline", () => {
  it("formats an ISO date per locale", () => {
    expect(formatDeadline("2026-08-31", "uz")).toBe("31-avgust");
    expect(formatDeadline("2026-08-31", "ru")).toBe("31 августа");
  });
});

describe("formatDuration", () => {
  it("renders half-months with a comma", () => {
    expect(formatDuration(1.5)).toBe("1,5");
    expect(formatDuration(2)).toBe("2");
  });
});
