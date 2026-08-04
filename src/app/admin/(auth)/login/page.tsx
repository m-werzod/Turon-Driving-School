import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDb } from "@/server/db/client";
import { getSessionUser } from "@/server/admin/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Kirish" };

export default async function LoginPage() {
  const dbConfigured = Boolean(getDb());

  if (dbConfigured) {
    const user = await getSessionUser();
    if (user) redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-extrabold tracking-tight text-ink-900">
            Turon Avtomaktab
          </p>
          <p className="mt-1 text-sm text-ink-500">
            Boshqaruv paneliga kirish
          </p>
        </div>

        {!dbConfigured ? (
          <p className="mb-4 rounded-control bg-danger-50 px-4 py-3 text-sm text-danger-700">
            Baza ulanmagan (DATABASE_URL sozlanmagan). Administrator
            konfiguratsiyani tekshirsin.
          </p>
        ) : null}

        <LoginForm disabled={!dbConfigured} />
      </div>
    </div>
  );
}
