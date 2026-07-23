/**
 * Role-based access control for the admin panel.
 *
 * This encodes the v1 permission matrix from TZ doc 04 §7.2 verbatim. The
 * full matrix and audit-log requirements are deferred to doc 11 (still
 * pending); when it lands, this table is the single place the matrix is
 * defined and enforced, so widening a role is a one-line change here rather
 * than scattered checks. RBAC is enforced server-side (doc 16 §4) — never
 * trust a client-provided role.
 */

export const ADMIN_ROLES = [
  "super_admin",
  "content_manager",
  "sales_manager",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

/** Coarse module groups from doc 04 §7.2 (not the finer §7.1 module list). */
export const MODULE_GROUPS = [
  "dashboard",
  "leads",
  "content",
  "users",
  "settings",
  "analytics",
] as const;

export type ModuleGroup = (typeof MODULE_GROUPS)[number];

export type Action = "view" | "edit";

/** "full" = view + edit · "view" = read only · "none" = no access. */
type Access = "full" | "view" | "none";

const MATRIX: Record<AdminRole, Record<ModuleGroup, Access>> = {
  super_admin: {
    dashboard: "full",
    leads: "full",
    content: "full",
    users: "full",
    settings: "full",
    analytics: "full",
  },
  content_manager: {
    dashboard: "view",
    leads: "none",
    content: "full",
    users: "none",
    settings: "none",
    analytics: "view",
  },
  sales_manager: {
    dashboard: "view",
    leads: "full",
    content: "view",
    users: "none",
    settings: "none",
    analytics: "view",
  },
};

/** True when `role` may perform `action` on `group`. */
export function can(
  role: AdminRole,
  group: ModuleGroup,
  action: Action,
): boolean {
  const access = MATRIX[role][group];
  if (access === "full") return true;
  if (access === "view") return action === "view";
  return false;
}

/** Module groups the role can at least view — drives admin nav visibility. */
export function visibleGroups(role: AdminRole): ModuleGroup[] {
  return MODULE_GROUPS.filter((group) => can(role, group, "view"));
}
