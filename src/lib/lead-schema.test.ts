import { describe, expect, it } from "vitest";
import { leadSchema } from "./lead-schema";

const base = {
  name: "Aziz",
  phone: "+998 90 123 45 67",
  courseType: "category" as const,
  courseSlug: "b",
  branchSlug: "kosonsoy",
  consent: true as const,
  locale: "uz" as const,
  sourcePage: "/toifalar/b",
};

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    expect(leadSchema.safeParse(base).success).toBe(true);
  });

  it("requires consent to be true", () => {
    const result = leadSchema.safeParse({ ...base, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid phone", () => {
    const result = leadSchema.safeParse({ ...base, phone: "123" });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short name", () => {
    const result = leadSchema.safeParse({ ...base, name: "A" });
    expect(result.success).toBe(false);
  });

  it("allows optional course and branch to be omitted", () => {
    const { courseSlug, branchSlug, ...rest } = base;
    void courseSlug;
    void branchSlug;
    expect(leadSchema.safeParse(rest).success).toBe(true);
  });
});
