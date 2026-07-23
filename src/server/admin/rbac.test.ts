import { describe, expect, it } from "vitest";
import { ADMIN_ROLES, can, MODULE_GROUPS, visibleGroups } from "./rbac";

describe("rbac matrix (doc 04 §7.2)", () => {
  it("super_admin has full access to every module group", () => {
    for (const group of MODULE_GROUPS) {
      expect(can("super_admin", group, "edit")).toBe(true);
    }
  });

  it("content_manager edits content but cannot touch leads, users or settings", () => {
    expect(can("content_manager", "content", "edit")).toBe(true);
    expect(can("content_manager", "leads", "view")).toBe(false);
    expect(can("content_manager", "users", "view")).toBe(false);
    expect(can("content_manager", "settings", "view")).toBe(false);
  });

  it("content_manager can view but not edit the dashboard and analytics", () => {
    expect(can("content_manager", "dashboard", "view")).toBe(true);
    expect(can("content_manager", "dashboard", "edit")).toBe(false);
    expect(can("content_manager", "analytics", "view")).toBe(true);
    expect(can("content_manager", "analytics", "edit")).toBe(false);
  });

  it("sales_manager fully manages leads but only views content", () => {
    expect(can("sales_manager", "leads", "edit")).toBe(true);
    expect(can("sales_manager", "content", "view")).toBe(true);
    expect(can("sales_manager", "content", "edit")).toBe(false);
    expect(can("sales_manager", "users", "view")).toBe(false);
  });

  it("only super_admin can reach users & settings", () => {
    for (const role of ADMIN_ROLES) {
      const expected = role === "super_admin";
      expect(can(role, "users", "view")).toBe(expected);
      expect(can(role, "settings", "view")).toBe(expected);
    }
  });

  it("visibleGroups omits groups the role cannot view", () => {
    expect(visibleGroups("sales_manager")).not.toContain("users");
    expect(visibleGroups("sales_manager")).toContain("leads");
    expect(visibleGroups("content_manager")).not.toContain("leads");
    expect(visibleGroups("super_admin")).toEqual([...MODULE_GROUPS]);
  });
});
