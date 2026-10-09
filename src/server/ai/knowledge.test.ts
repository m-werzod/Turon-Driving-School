import { describe, expect, it } from "vitest";
import {
  getBranchDetail,
  getCategoryDetail,
  getContactInfo,
  getEnrollmentInfo,
  listBranches,
  listCategories,
} from "./knowledge";
import { runTool } from "./tools";

describe("knowledge readers are grounded in platform content", () => {
  it("lists every category with a resolvable price or an explicit gap", async () => {
    const rows = await listCategories("uz");
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      const hasPrice = "currentPrice" in row;
      const flagged = "status" in row && row.status === "NOT_PUBLISHED";
      expect(hasPrice || flagged, `${row.code} neither priced nor flagged`).toBe(true);
    }
  });

  it("flags the E category price as unpublished rather than inventing one", async () => {
    const detail = await getCategoryDetail("e", "uz");
    expect("status" in detail && detail.status).toBe("NOT_PUBLISHED");
  });

  it("returns a recoverable error for an unknown category", async () => {
    const detail = await getCategoryDetail("zzz", "uz");
    expect("error" in detail && detail.error).toBe("NOT_FOUND");
    expect("availableSlugs" in detail && detail.availableSlugs).toContain("b");
  });

  it("marks branches without a confirmed location as unpublished", async () => {
    const rows = await listBranches("uz");
    const kamuna = rows.find((b) => b.slug === "kamuna");
    expect(kamuna?.mapUrl).toBe("NOT_PUBLISHED");
    const kosonsoy = rows.find((b) => b.slug === "kosonsoy");
    expect(kosonsoy?.mapUrl).toContain("maps.app.goo.gl");
  });

  it("returns a recoverable error for an unknown branch", async () => {
    const detail = await getBranchDetail("nowhere", "uz");
    expect("error" in detail && detail.error).toBe("NOT_FOUND");
  });

  it("states plainly that online payment and a student portal do not exist", async () => {
    const info = await getEnrollmentInfo("uz");
    expect(info.onlinePaymentAvailable).toBe(false);
    expect(info.studentPortalAvailable).toBe(false);
  });

  it("exposes no private or personal fields in contact info", async () => {
    const info = await getContactInfo("ru");
    const serialized = JSON.stringify(info).toLowerCase();
    for (const forbidden of ["password", "token", "secret", "email", "lead"]) {
      expect(serialized, `leaked ${forbidden}`).not.toContain(forbidden);
    }
  });
});

describe("tool dispatch is closed and validated", () => {
  it("refuses an unknown tool name", async () => {
    const result = (await runTool("drop_table", {}, "uz")) as Record<string, unknown>;
    expect(result.error).toBe("UNKNOWN_TOOL");
  });

  it("rejects a slug that is not a plain slug", async () => {
    const result = (await runTool(
      "get_category",
      { slug: "b'; DROP TABLE categories;--" },
      "uz",
    )) as Record<string, unknown>;
    expect(result.error).toBe("INVALID_ARGUMENTS");
  });

  it("rejects a missing required argument", async () => {
    const result = (await runTool("get_branch", {}, "uz")) as Record<string, unknown>;
    expect(result.error).toBe("INVALID_ARGUMENTS");
  });

  it("runs a valid tool call", async () => {
    const result = (await runTool("get_category", { slug: "B" }, "uz")) as Record<
      string,
      unknown
    >;
    expect(result.code).toBe("B");
  });

  it("exposes no tool that reads leads, users or sessions", async () => {
    const { TOOLS } = await import("./tools");
    const names = Object.keys(TOOLS).join(" ");
    for (const forbidden of ["lead", "user", "session", "admin", "sql", "query_db"]) {
      expect(names, `tool surface exposes ${forbidden}`).not.toContain(forbidden);
    }
  });
});
