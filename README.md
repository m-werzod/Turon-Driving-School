# Turon Avtomaktab — Web Platform

Premium, mobile-first web platform for Turon Avtomaktab (Namangan region, Uzbekistan):
public marketing site (UZ default + RU), lead capture with callback workflow, and an
admin CMS (next milestone). The Technical Specification in [`docs/`](./docs) is the
single source of truth for all product and engineering decisions.

## Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router, RSC-first) | Static/ISR rendering for content pages, streaming, first-class SEO |
| Language | TypeScript (strict) | Long-term maintainability |
| Styling | Tailwind CSS v4 + design tokens | Single spacing/color/typography system (TZ doc 05) |
| i18n | next-intl | Localized pathnames (UZ unprefixed default, `/ru` prefix) per TZ doc 04 §4 |
| Validation | Zod | One schema shared by client form and API |
| Database | PostgreSQL + Drizzle ORM | Lead persistence now, CMS entities next milestone |
| Icons | Lucide (UI) + official colored brand SVGs (external services only) | TZ design rules |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

The public site runs without a database. The lead endpoint (`POST /api/leads`)
requires `DATABASE_URL` and/or the Telegram bot variables — see `.env.example`.
At least one of the two channels must be configured in production.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run test` | Unit tests (Vitest) |
| `npm run db:generate` | Generate SQL migrations from the Drizzle schema |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` |

## Repository layout

```
docs/                TZ documents (source of truth) + engineering docs
drizzle/             Generated SQL migrations
src/
  app/               App Router routes ([locale] segment, api, sitemap, robots)
  components/        ui/ (primitives) · layout/ (header, footer, action bar) ·
                     sections/ (page building blocks) · forms/ · seo/
  content/           Typed content source consumed by the content service.
                     Interim stand-in for the CMS (milestone 2); every template
                     reads through src/server/content.ts, never from here directly.
  i18n/              Locale routing (localized pathnames), request config, messages
  lib/               Framework-free utilities (phone, format, urls)
  server/            Server-only services (content, leads, telegram, rate limit, db)
```

## Content status

Volatile content (prices, promos, results) is CMS-owned by contract (TZ doc 04 §2.5).
Until the admin CMS ships, `src/content/` holds the typed seed content. Entries that
await authoritative client input are marked `PROVISIONAL` and tracked in
[`docs/OPEN_ITEMS.md`](./docs/OPEN_ITEMS.md) — review that file before launch.
