import type { leadStatus } from "@/server/db/schema";

/**
 * Lead pipeline state machine from TZ admin flow AF-01:
 *
 *   new → contacted → registered → enrolled
 *              └────→ lost
 *
 * `lost` and `enrolled` are terminal. Every transition must be validated
 * server-side before it is persisted (each records timestamp + actor per
 * AF-01); this pure function is that gate and is exhaustively unit-tested.
 */

export type LeadStatus = (typeof leadStatus.enumValues)[number];

const TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ["contacted"],
  contacted: ["registered", "lost"],
  registered: ["enrolled"],
  lost: [],
  enrolled: [],
};

/** Statuses a lead may move to next from its current status. */
export function nextStatuses(from: LeadStatus): LeadStatus[] {
  return TRANSITIONS[from];
}

/** True when moving from → to is a legal pipeline transition. */
export function canTransition(from: LeadStatus, to: LeadStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

/** Terminal statuses have no outgoing transitions. */
export function isTerminal(status: LeadStatus): boolean {
  return TRANSITIONS[status].length === 0;
}
