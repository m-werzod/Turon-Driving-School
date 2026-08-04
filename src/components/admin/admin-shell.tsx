"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserCog,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { visibleGroups, type ModuleGroup } from "@/server/admin/rbac";
import type { SessionUser } from "@/server/admin/auth";
import { logoutAction } from "@/server/admin/logout-action";

interface NavItem {
  group: ModuleGroup;
  label: string;
  /** Present once the module has a real page; otherwise shown as "coming soon". */
  href?: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  {
    group: "dashboard",
    label: "Boshqaruv paneli",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  { group: "leads", label: "Mijozlar", icon: Users },
  { group: "content", label: "Kontent", icon: FolderKanban },
  { group: "users", label: "Foydalanuvchilar", icon: UserCog },
  { group: "settings", label: "Sozlamalar", icon: Settings },
  { group: "analytics", label: "Analitika", icon: BarChart3 },
];

const ROLE_LABEL: Record<SessionUser["role"], string> = {
  super_admin: "Super admin",
  content_manager: "Kontent menejeri",
  sales_manager: "Sotuv menejeri",
};

export function AdminShell({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visible = new Set(visibleGroups(user.role));
  const items = NAV_ITEMS.filter((item) => visible.has(item.group));

  return (
    <div className="flex min-h-dvh">
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-30 bg-ink-950/50 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-ink-200 bg-white transition-transform duration-300 ease-premium lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div>
            <p className="text-sm font-extrabold text-ink-900">
              Turon Avtomaktab
            </p>
            <p className="text-xs text-ink-500">Boshqaruv paneli</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Menyuni yopish"
            className="grid size-9 place-items-center rounded-lg text-ink-600 hover:bg-ink-100 lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              if (!item.href) {
                return (
                  <li key={item.group}>
                    <span className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-400">
                      <span className="flex items-center gap-3">
                        <Icon className="size-4.5" aria-hidden="true" />
                        {item.label}
                      </span>
                      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                        Tez orada
                      </span>
                    </span>
                  </li>
                );
              }
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.group}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                      active
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-700 hover:bg-ink-100",
                    )}
                  >
                    <Icon className="size-4.5" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-ink-100 px-4 py-4">
          <p className="truncate text-sm font-semibold text-ink-900">
            {user.displayName ?? user.username}
          </p>
          <p className="text-xs text-ink-500">{ROLE_LABEL[user.role]}</p>
          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-control bg-ink-50 px-4 py-2.5 text-sm font-semibold text-ink-700 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-ink-100"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Chiqish
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-ink-200 bg-white px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Menyuni ochish"
            className="grid size-10 place-items-center rounded-lg text-ink-700 hover:bg-ink-100 lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
