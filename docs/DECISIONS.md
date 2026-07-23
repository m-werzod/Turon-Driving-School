# Engineering Decision Record

Decisions taken where the corresponding TZ document is still pending (per the
Table of Contents, only doc 04 is delivered). Each decision anticipates the
pending doc's requirements; when that doc is authored, it either ratifies the
decision or supersedes it with an explicit migration note. Format: context →
decision → trade-offs.

## D-01 Framework: Next.js 15, App Router, RSC-first (anticipates doc 14 §1)

Content pages are static/ISR-rendered for Lighthouse-100 targets; the promo
countdown and forms are the only client islands. App Router gives streaming,
`generateMetadata`, typed routes, and first-class `hreflang`/sitemap support.
Trade-off: RSC discipline required (server/client boundary), accepted for the
performance ceiling it buys.

## D-02 i18n: next-intl with localized pathnames (anticipates doc 10)

Doc 04 §4 fixes the URL contract (UZ unprefixed, `/ru` prefix, localized section
slugs, shared entity slugs). next-intl's `pathnames` map implements exactly this
and keeps the slug table in one file (`src/i18n/routing.ts`). Locale detection is
disabled — first visit renders UZ; an explicit switch sets a cookie which custom
middleware honors on return visits at `/` only (doc 04 §4 "no auto-redirect" +
§5.6 cookie persistence). Accept-Language sniffing is deliberately not used.

## D-03 ORM: Drizzle + postgres-js (anticipates doc 15 §3)

Chosen over Prisma: no codegen step, no binary engine downloads, SQL-transparent
migrations, smaller cold starts. Schema lives in `src/server/db/schema.ts` and
implements the doc 04 §9 entity map. Trade-off: fewer batteries than Prisma
(no studio); acceptable — the admin panel (milestone 2) is the data UI.

## D-04 Motion: CSS transitions + IntersectionObserver reveals, no motion library yet (anticipates doc 08)

The role standard permits Framer Motion "where appropriate". For milestone 1 the
motion inventory (scroll reveals, menu overlay, accordion, countdown) is fully
achievable with transform/opacity CSS driven by a ~1 kB observer hook —
zero bundle cost, trivially 60 fps, `prefers-reduced-motion` honored at the CSS
layer. Framer Motion is deferred until a feature actually needs gesture physics
(lightbox swipe/zoom is the likely trigger in the media milestone). This is a
performance-budget decision, not a style one.

## D-05 Provisional design tokens (anticipates doc 05)

The palette derives from the logo, which has not been received (TZ ToC: doc 05
"ships with a provisional palette explicitly marked for replacement"). The
provisional system: deep ink-navy neutrals, a confident blue brand scale, amber
promo accent. All colors are CSS custom properties in `src/app/theme.css` —
replacement is a token edit, not a refactor. Typography: Inter variable
(latin + latin-ext + cyrillic subsets) — full UZ-Latin (incl. oʻ/gʻ) and RU
coverage from one family, per doc 05 §3's "ONE family" rule.

## D-06 Content service boundary (implements doc 04 §2.5 ahead of the CMS)

Templates read exclusively through `src/server/content.ts`. The v1 source is
typed modules in `src/content/`; milestone 2 replaces the service internals with
DB-backed queries + revalidation without touching any template. This keeps the
"CMS-driven volatility" contract structurally enforced from day one.

## D-07 Lead delivery: DB + Telegram dual-channel (implements flow F-02)

`POST /api/leads`: shared Zod schema → honeypot + per-IP sliding-window rate
limit → DB insert (status NEW, source page, locale) → Telegram `sendMessage`
with bounded retry. Either channel alone is sufficient to accept a lead
(graceful degradation, doc 04 §11 spirit); with neither configured the endpoint
refuses with 503 rather than silently dropping leads. The in-memory rate limiter
is documented as single-instance; the interface allows a Redis swap when the
hosting topology (doc 15/19) is decided.

## D-08 Maps: deep links now, embedded map deferred (partial doc 04 F-04)

Branch pages ship landmark addresses + Google/Yandex deep links (the two-tap
directions requirement). The interactive multi-pin hub map needs verified
coordinates and a tile-provider decision with CSP/performance implications
(docs 07 §9, 17 §8) — deferred to the media/maps milestone rather than shipping
an unverified embed. The hub meanwhile renders the full branch card list, which
satisfies the routing goal of the page.
