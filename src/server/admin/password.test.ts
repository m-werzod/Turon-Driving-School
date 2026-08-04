import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password hashing", () => {
  it("verifies a correct password against its own hash", async () => {
    const hash = await hashPassword("Admin123");
    expect(await verifyPassword("Admin123", hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("Admin123");
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("produces a different hash (different salt) each time", async () => {
    const a = await hashPassword("Admin123");
    const b = await hashPassword("Admin123");
    expect(a).not.toBe(b);
  });

  it("rejects malformed stored hashes instead of throwing", async () => {
    await expect(verifyPassword("Admin123", "not-a-hash")).resolves.toBe(
      false,
    );
  });
});
