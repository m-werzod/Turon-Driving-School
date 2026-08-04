import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../globals.css";

/**
 * Independent admin HTML shell — mirrors why app/layout.tsx is a passthrough
 * and app/[locale]/layout.tsx owns the real <html>/<body>: this is the
 * second, equally real shell. The admin panel is a single-language (Uzbek)
 * surface entirely outside next-intl's locale routing (no
 * NextIntlClientProvider, no [locale] segment).
 */

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Boshqaruv paneli",
    template: "%s — Turon Avtomaktab",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz" className={manrope.variable}>
      <body className="min-h-dvh bg-ink-50 text-ink-900">{children}</body>
    </html>
  );
}
