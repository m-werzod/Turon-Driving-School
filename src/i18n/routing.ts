import { defineRouting } from "next-intl/routing";

/**
 * URL & locale contract from TZ doc 04 §3.2 and §4:
 * - UZ is the default locale, served unprefixed at the root.
 * - RU is served under the /ru prefix.
 * - Section slugs are localized per language; entity slugs (category codes,
 *   branch names) are identical across locales and live in the [slug] params.
 * - No Accept-Language/geo detection (see src/middleware.ts for the
 *   cookie-honoring rule on return visits).
 */
export const routing = defineRouting({
  locales: ["uz", "ru"],
  defaultLocale: "uz",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: {
    name: "locale",
    maxAge: 60 * 60 * 24 * 365,
  },
  pathnames: {
    "/": "/",
    "/categories": { uz: "/toifalar", ru: "/kategorii" },
    "/categories/[slug]": { uz: "/toifalar/[slug]", ru: "/kategorii/[slug]" },
    "/express-courses": { uz: "/express-kurslar", ru: "/ekspress-kursy" },
    "/pricing": { uz: "/narxlar", ru: "/tseny" },
    "/branches": { uz: "/filiallar", ru: "/filialy" },
    "/branches/[slug]": { uz: "/filiallar/[slug]", ru: "/filialy/[slug]" },
    "/results": { uz: "/natijalar", ru: "/rezultaty" },
    "/gallery": { uz: "/galereya", ru: "/galereya" },
    "/about": { uz: "/biz-haqimizda", ru: "/o-nas" },
    "/faq": { uz: "/savol-javob", ru: "/faq" },
    "/contact": { uz: "/aloqa", ru: "/kontakty" },
    "/register": { uz: "/royxatdan-otish", ru: "/registratsiya" },
    "/privacy": {
      uz: "/maxfiylik-siyosati",
      ru: "/politika-konfidentsialnosti",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
