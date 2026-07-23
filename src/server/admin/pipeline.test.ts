import { describe, expect, it } from "vitest";
import { canTransition, isTerminal, nextStatuses } from "./pipeline";

describe("lead pipeline (doc 04 AF-01)", () => {
  it("follows the happy path new → contacted → registered → enrolled", () => {
    expect(canTransition("new", "contacted")).toBe(true);
    expect(canTransition("contacted", "registered")).toBe(true);
    expect(canTransition("registered", "enrolled")).toBe(true);
  });

  it("allows contacted → lost", () => {
    expect(canTransition("contacted", "lost")).toBe(true);
  });

  it("forbids skipping stages", () => {
    expect(canTransition("new", "registered")).toBe(false);
    expect(canTransition("new", "enrolled")).toBe(false);
    expect(canTransition("contacted", "enrolled")).toBe(false);
  });

  it("forbids moving out of terminal states", () => {
    expect(isTerminal("lost")).toBe(true);
    expect(isTerminal("enrolled")).toBe(true);
    expect(nextStatuses("lost")).toEqual([]);
    expect(nextStatuses("enrolled")).toEqual([]);
  });

  it("does not allow a status to transition to itself", () => {
    expect(canTransition("new", "new")).toBe(false);
    expect(canTransition("contacted", "contacted")).toBe(false);
  });

  it("exposes exactly the legal next statuses", () => {
    expect(nextStatuses("new")).toEqual(["contacted"]);
    expect(nextStatuses("contacted")).toEqual(["registered", "lost"]);
    expect(nextStatuses("registered")).toEqual(["enrolled"]);
  });
});
