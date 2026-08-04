import type { ReactNode } from "react";
import { requireSessionUser } from "@/server/admin/auth";
import { AdminShell } from "@/components/admin/admin-shell";

/**
 * Enforces the admin session in a Node-runtime Server Component layout, not
 * middleware — middleware runs on the Edge runtime by default and the
 * `postgres` driver isn't Edge-compatible.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireSessionUser();
  return <AdminShell user={user}>{children}</AdminShell>;
}
