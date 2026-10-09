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


## D-13 Chat assistant replaces the floating call button

The bottom-right floating slot now holds the AI assistant, not a `tel:` link.
Calling did not get harder: the mobile sticky action bar still carries a
one-tap call, and every phone number remains in the footer, on the contact
page, on each branch page and in the mobile overlay menu. One floating
element is a deliberate limit — two competing circular buttons in the same
corner is the pattern this replaces.

**Grounding.** The model is given no business facts in its prompt. Every
claim must come from a tool call, and the tools (`src/server/ai/tools.ts`)
read through the same content service the pages use, so the assistant cannot
drift from what the site shows. Readers return an explicit `NOT_PUBLISHED`
marker instead of omitting a field, and the prompt requires the model to
report that as "not published" rather than fill the gap. Prices are re-read
on every question, never reused from earlier in the conversation.

**What it cannot do.** The platform has no student accounts, payments,
attendance or schedules (`src/server/db/schema.ts` has leads and staff users
only). There is therefore no reader for personal data and nothing private to
leak through this endpoint, and the prompt states plainly that these
features do not exist so the model cannot imply otherwise. The assistant
informs; it never claims to have performed an action.

**Security.** The API key is server-only. The tool surface is a closed set
with Zod-validated arguments — no SQL, no free-form queries, no way to widen
a scope. Visitor text is framed as data in the system prompt, with explicit
instructions to decline attempts to override the rules or reveal the prompt.
The endpoint is rate-limited per IP (20 requests / 5 min, looser than the
lead form's 5 / 10 min because chat is naturally chattier), history is
capped, and the tool loop is bounded at four rounds with tools withdrawn on
the final round so it must answer with what it has.

**No streaming.** Answers wait on tool results anyway, so the first token
could not arrive earlier; a plain request/response with a typing indicator is
simpler and has fewer failure modes than a streamed tool loop. Revisit if
answers ever grow long enough for progressive rendering to matter.

## D-14 Header: desktop nav at xl, phone number dropped from the row

The desktop header needs about 1080px before six nav items, the locale
switcher and the CTA start colliding. At lg it was silently overlapping —
"Galereya" and "Biz haqimizda" sat behind the switcher. The full row now
appears at xl (1280px); below that the overlay menu carries the same
navigation, so nothing becomes unreachable.

The phone number is no longer in the header. The row is capped at
`max-w-7xl`, so a wider viewport gives it no extra room, and even at 1920px
it overflowed the nav by ~65px. Widening the container only at 2xl was
tried and rejected: it made the header inconsistent with page content and
still left the nav tight. The number stays one tap away in the footer, on
the contact page, on every branch page, in the mobile menu and in the mobile
action bar.

Related: the wordmark now shows "Turon" alone below `sm`. The full
"Turon Avtomaktab" was pushing the mobile header ~21px past the viewport —
a pre-existing horizontal overflow, measured at 320-414px.
