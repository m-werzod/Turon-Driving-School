import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows up to the limit then blocks within the window", () => {
    const key = `test-${Math.random()}`;
    const now = 1_000_000;
    for (let i = 0; i < 5; i += 1) {
      expect(checkRateLimit(key, now).allowed).toBe(true);
    }
    const blocked = checkRateLimit(key, now);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("allows again once the window has passed", () => {
    const key = `test-${Math.random()}`;
    const start = 2_000_000;
    for (let i = 0; i < 5; i += 1) checkRateLimit(key, start);
    expect(checkRateLimit(key, start).allowed).toBe(false);
    // 11 minutes later the earlier hits have aged out of the 10-minute window.
    expect(checkRateLimit(key, start + 11 * 60 * 1000).allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    const now = 3_000_000;
    for (let i = 0; i < 5; i += 1) checkRateLimit("key-a", now);
    expect(checkRateLimit("key-a", now).allowed).toBe(false);
    expect(checkRateLimit("key-b", now).allowed).toBe(true);
  });
});
