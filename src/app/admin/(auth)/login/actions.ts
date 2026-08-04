"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { checkRateLimit } from "@/server/rate-limit";
import { createSession, verifyCredentials } from "@/server/admin/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Login va parolni kiriting." };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const rate = checkRateLimit(`admin-login:${ip}`);
  if (!rate.allowed) {
    return {
      error: "Urinishlar soni ko'p. Birozdan so'ng qayta urinib ko'ring.",
    };
  }

  const user = await verifyCredentials(username, password);
  if (!user) {
    return { error: "Login yoki parol noto'g'ri." };
  }

  await createSession(user.id, {
    userAgent: headerList.get("user-agent"),
    ipAddress: ip,
  });

  redirect("/admin/dashboard");
}
