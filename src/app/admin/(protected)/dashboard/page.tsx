import type { Metadata } from "next";
import { Users } from "lucide-react";
import { requireSessionUser } from "@/server/admin/auth";
import { getLeadStatusCounts } from "@/server/admin/dashboard";
import { can } from "@/server/admin/rbac";

export const metadata: Metadata = { title: "Boshqaruv paneli" };

const STATUS_LABEL: Record<string, string> = {
  new: "Yangi",
  contacted: "Bog'lanildi",
  registered: "Ro'yxatdan o'tdi",
  lost: "Yo'qotildi",
  enrolled: "O'qishga kirdi",
};

export default async function DashboardPage() {
  const user = await requireSessionUser();
  const canViewLeads = can(user.role, "leads", "view");
  const leadCounts = canViewLeads ? await getLeadStatusCounts() : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">
          Xush kelibsiz, {user.displayName ?? user.username}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Turon Avtomaktab boshqaruv paneli.
        </p>
      </div>

      {leadCounts ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(leadCounts).map(([status, count]) => (
            <div
              key={status}
              className="flex items-center gap-3 rounded-card bg-white px-4 py-4 shadow-(--shadow-card) ring-1 ring-ink-100"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Users className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-xl font-extrabold text-ink-900">
                  {count}
                </span>
                <span className="text-xs font-medium text-ink-600">
                  {STATUS_LABEL[status] ?? status}
                </span>
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="rounded-card bg-white p-6 shadow-(--shadow-card) ring-1 ring-ink-100">
        <p className="text-sm text-ink-600">
          Kontent boshqaruvi (filiallar, kurslar, o&apos;qituvchilar,
          yangiliklar va boshqalar) tez orada shu paneldan boshqariladi.
        </p>
      </div>
    </div>
  );
}
