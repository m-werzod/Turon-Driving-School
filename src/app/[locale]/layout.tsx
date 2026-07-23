import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Manrope } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getHeaderData, getFooterData } from "@/server/nav";
import { getSettings } from "@/server/content";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { StickyActionBar } from "@/components/layout/action-bar";
import { FloatingCallButton } from "@/components/layout/floating-call-button";
import { RouteTransition } from "@/components/layout/route-transition";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Turon Avtomaktab",
    template: "%s | Turon Avtomaktab",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const [headerData, footerData, settings] = await Promise.all([
    getHeaderData(typedLocale),
    getFooterData(typedLocale),
    getSettings(),
  ]);

  return (
    <html lang={locale} className={manrope.variable}>
      <body className="min-h-dvh bg-white">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-70 focus:rounded-control focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-white"
          >
            {locale === "ru" ? "К основному содержанию" : "Asosiy kontentga o'tish"}
          </a>
          <SiteHeader data={headerData} />
          <main id="main" className="pb-16 lg:pb-0">
            {children}
          </main>
          <SiteFooter data={footerData} />
          <StickyActionBar phones={headerData.phones} />
          <FloatingCallButton phones={headerData.phones} />
          <RouteTransition />
          <JsonLd data={organizationSchema(settings, typedLocale)} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
