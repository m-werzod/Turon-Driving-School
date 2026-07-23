# Turon Avtomaktab — Master Documentation Plan (Table of Contents)

| Field | Value |
|---|---|
| Version | 1.0 (Draft — for approval before Phase 5) |
| Date | 2026-07-22 |
| Scope basis | Approved v1: marketing platform + admin CMS, lead-form + callback, no online payment, UZ/RU, English documentation |
| Estimated total volume | ~170–190 pages exported to PDF |

## How Phase 5 Works

Documents are generated in numeric order, one at a time, at full depth. When an output limit is reached mid-document, generation stops naturally and resumes exactly at the break on **"Continue"** — no repetition, no compression. Every document opens with the same metadata header used in `04_Information_Architecture.md` (ID, version, status, dependencies) so the set functions as a coherent repository.

Two documents have external dependencies: **05** requires the logo (color system is derived from it — until received, 05 ships with a provisional palette explicitly marked for replacement) and **06** requires the authoritative price list (structure is unaffected; only content values wait).

## Document Map & Page Estimates

| # | Document | Est. pages | Status |
|---|---|---|---|
| 00 | Project Overview | 5 | Pending |
| 01 | Business Analysis | 10 | Pending |
| 02 | Functional Requirements | 12 | Pending |
| 03 | Non-Functional Requirements | 7 | Pending |
| 04 | Information Architecture | 10 | **Delivered (v1.0 draft)** |
| 05 | UI/UX Design System | 14 | Pending — needs logo |
| 06 | Page Specifications | 20 | Pending — needs final prices |
| 07 | Component Library | 14 | Pending |
| 08 | Animation System | 6 | Pending |
| 09 | Content Strategy | 8 | Pending |
| 10 | Multilingual System | 6 | Pending |
| 11 | Admin Panel | 12 | Pending |
| 12 | Database Design | 8 | Pending |
| 13 | API Specification | 10 | Pending |
| 14 | Frontend Architecture | 12 | Pending |
| 15 | Backend Architecture | 10 | Pending |
| 16 | Security | 8 | Pending |
| 17 | Performance | 8 | Pending |
| 18 | SEO | 10 | Pending |
| 19 | Deployment | 8 | Pending |
| 20 | Testing & QA | 8 | Pending |
| 21 | Acceptance Criteria | 6 | Pending |
| 22 | Analytics & Measurement *(proposed addition)* | 5 | Awaiting your yes/no |

---

## 00 — Project Overview
1. Vision & positioning (the most professional driving-school platform in Uzbekistan)
2. Business goals & KPIs (registrations, conversion rate, lead response time, organic visibility)
3. Scope — v1 in / out, with rationale
4. Stakeholders & responsibilities
5. Constraints, assumptions & dependencies
6. Product roadmap (v1 → v2 test practice → v3 student cabinet)
7. Glossary (UZ domain terms: toifa, avtodrom, prava, etc.)
8. Document map & reading order

## 01 — Business Analysis
1. Business context & current state (Telegram/Instagram-only presence, promo-driven sales)
2. Market & competitor analysis (Namangan region landscape; web-presence gap; positioning opportunity)
3. Target audiences & personas (first-license B seeker; commercial C/CE/D career driver; failed-exam express segment; parents paying for young drivers)
4. Customer journey maps per persona
5. Sales funnel definition & conversion strategy (site's role: capture, prove, route to call)
6. Value proposition & messaging pillars (results, 7 branches, own autodrome, installment-friendly payment)
7. Business requirements catalog (BR-xx, traceable into doc 02)
8. Risks & mitigations (price volatility, content supply, seasonality)

## 02 — Functional Requirements
1. Requirement conventions (FR-xx numbering, priority, traceability to BR-xx)
2. Public platform modules: home, categories, express, pricing & promo engine, branches & maps, results, gallery & lightbox, about, FAQ, contact
3. Lead capture module (form fields, validation, consent, success states, anti-spam)
4. Notification module (Telegram bot delivery, failure fallback)
5. Internationalization requirements (locale parity, switcher, slug mapping)
6. Admin modules (per §7 of doc 04): requirements per module
7. Search-engine & sharing requirements (sitemaps, OG image generation)
8. Event-tracking requirements (what must be measurable — detailed in doc 22)
9. Out-of-scope register (explicitly not in v1)

## 03 — Non-Functional Requirements
1. Performance budgets (Core Web Vitals targets per template; media weight ceilings)
2. Availability & reliability targets; graceful degradation (static fallback with phones)
3. Scalability assumptions (traffic model, promo-day spikes)
4. Accessibility baseline (WCAG 2.2 AA — expanded in docs 05/06/20)
5. Compatibility matrix (devices, browsers, Android skew typical for the market, low-bandwidth behavior)
6. Localization NFRs (script coverage UZ Latin + RU Cyrillic)
7. Compliance & data protection (Uzbekistan personal-data legislation incl. data-localization implications for lead storage — validated with counsel, designed for in docs 15/16/19)
8. Maintainability & content-operations NFRs (non-technical staff proficiency targets)

## 04 — Information Architecture
**Delivered.** Page inventory & site map · URL/locale strategy · navigation architecture · user flows F-01–F-07 · admin IA & flows · content hierarchy per template · entity relationships · internal linking · error/redirect policy · v2 reserved namespaces.

## 05 — UI/UX Design System
1. Brand foundation (logo usage, clear space, don'ts) — *pending logo*
2. Color system (logo-derived palette; semantic tokens; contrast-verified pairs; single system as required)
3. Typography system (ONE recommended family with full UZ-Latin + Cyrillic coverage; comparison of candidates; type scale, weights, line-height rules)
4. Spacing system (single scale; layout grid mobile/tablet/desktop)
5. Radius & elevation system
6. Iconography (Lucide as the single UI set; sizing/stroke rules; official colored brand SVGs strictly for external services; explicit no-emoji policy)
7. Imagery & video art direction (how raw school media becomes premium: cropping, color treatment, density rules)
8. Interaction states (hover, focus-visible, active, disabled, loading, skeletons; desktop cursor behavior)
9. Motion tokens (durations, easings — consumed by doc 08)
10. Accessibility tokens (focus rings, minimum targets, contrast enforcement)
11. Dark mode decision (recommendation + rationale)
12. Design tokens export format (single source for code)

## 06 — Page Specifications
1. Specification conventions (per-section: purpose, content slots, media specs, states, responsive behavior, SEO meta, tracked events)
2–16. Full specs for T-00 global elements and templates T-01 → T-15 (every section of every page, including empty/loading/error states and bilingual content slots)
17. Success & confirmation states (lead submitted; promo expired states)
18. Copy slot inventory handed to doc 09

## 07 — Component Library
1. Component conventions (naming, props, variants, states, a11y contract per component)
2. Primitives: buttons, links, inputs, select, phone input with +998 mask, checkbox/consent, textarea
3. Composition: cards (category, branch, price w/ promo + countdown, result, testimonial), badges, stat chips
4. Navigation set: header, mobile overlay menu, dropdowns, breadcrumbs, footer, language switcher, sticky mobile action bar
5. Media set: responsive image, video player, gallery grid, lightbox (swipe, zoom, video), filter bar
6. Forms: lead form (all placements: page, inline, modal), validation & error presentation, success module
7. Feedback: toasts, skeletons, spinners, empty states
8. Overlay: modal/sheet system, call sheet (multi-number)
9. Map components: multi-pin map, single-branch map, external deep links
10. Admin component set (tables, pipeline board, bilingual field editor, media picker)
11. Component ↔ page traceability matrix

## 08 — Animation System
1. Motion principles (calm, purposeful, premium — never decorative noise)
2. Token set (durations/easings from doc 05)
3. Page-level transitions & route changes
4. Scroll-triggered reveals (rules, thresholds, one-time vs repeat)
5. Micro-interactions catalog (buttons, cards, accordion, menu, lightbox, countdown)
6. Reduced-motion strategy (full parity without motion)
7. Performance rules (transform/opacity only; main-thread budgets)

## 09 — Content Strategy
1. Voice & tone (UZ and RU registers; migrating from emoji-urgency to premium-confident)
2. Messaging hierarchy per funnel stage
3. Copy guidelines & microcopy standards (CTAs, forms, errors — bilingual)
4. Claims policy (evidence-based reformulation of claims like "100% guarantee" — legal and brand risk)
5. Photography & video direction (shot lists per page; standards for future shoots)
6. Content inventory & migration plan (curating the existing ~1,700 media items from Telegram; selection criteria)
7. Editorial workflow & governance (who writes UZ, who translates RU, review, cadence for results posts)
8. Launch content checklist (every slot from doc 06 with owner)

## 10 — Multilingual System
1. Locale architecture (UZ default unprefixed, `/ru` prefix — as fixed in doc 04)
2. Slug mapping implementation & switcher behavior
3. Translation data model (field-level bilingual entities; publish gate requiring both locales)
4. CMS translation workflow & missing-translation prevention
5. Formatting standards (so'm currency, number grouping, phone formats, dates in both languages)
6. Typography/script considerations (UZ apostrophe ʻ handling, Cyrillic rendering)
7. hreflang & SEO integration (with doc 18)

## 11 — Admin Panel
1. Admin UX principles for non-technical staff (zero-training target)
2. Authentication & session model (with doc 16)
3. Roles & permissions — full matrix (expanding doc 04 §7.2)
4. Module specifications (each module from doc 04 §7.1: screens, fields, validations, empty states)
5. Leads module deep-spec (pipeline board, statuses, notes, assignment, export, response-time metrics)
6. Pricing & promo engine deep-spec (auto-expiry, scheduling, preview)
7. Media Library deep-spec (upload pipeline, optimization, tagging, usage tracking, deletion protection)
8. Bilingual editing UX (side-by-side, completeness indicators)
9. Audit log & activity history
10. Admin analytics dashboard (embedded views from doc 22)

## 12 — Database Design
1. Engine & rationale (PostgreSQL) and modeling conventions
2. Full ER diagram (physical, expanding doc 04 §9)
3. Table-by-table specification (columns, types, constraints, defaults)
4. Localization pattern decision (JSONB bilingual fields vs translation tables — comparison, one recommendation)
5. Indexing & query patterns (public reads, admin filters, lead pipeline)
6. Data lifecycle (lead retention policy, media references, soft deletes)
7. Migrations & seed strategy (7 categories, 7 branches, settings singleton)
8. Backup & restore requirements (with doc 19)

## 13 — API Specification
1. API style decision (server actions + typed procedures vs REST — comparison, one recommendation)
2. Conventions (auth, validation schemas, error model, pagination)
3. Public endpoints (content reads, lead submission)
4. Admin endpoints (per module CRUD, media upload, lead transitions)
5. Integration contracts (Telegram Bot API notification; maps deep links; analytics events)
6. Rate limiting & abuse controls (with doc 16)
7. Revalidation/webhook contracts (CMS publish → cache invalidation)
8. Versioning & stability policy

## 14 — Frontend Architecture
1. Stack decision with comparison (framework, language, styling approach, component tooling) — one recommendation, fully justified
2. Rendering strategy per route (static/ISR/dynamic; promo-countdown handling)
3. Project structure (folder tree) & conventions
4. State management decision (server-first; minimal client state — comparison + recommendation)
5. Forms & validation stack (comparison + recommendation)
6. i18n implementation (library comparison + recommendation; slug-map wiring)
7. Media pipeline client-side (responsive images, video posters, lazy strategies, gallery virtualization)
8. Animation implementation (library decision consuming doc 08)
9. Error boundaries, fallbacks & offline-tolerant behaviors
10. Frontend testing hooks (with doc 20)

## 15 — Backend Architecture
1. Runtime & hosting topology decision (incl. data-localization constraint from doc 03 — comparison of Vercel-only vs UZ-hosted vs hybrid; one recommendation)
2. CMS strategy decision (headless SaaS vs self-hosted framework vs custom admin — comparison against the doc 11 requirements; one recommendation)
3. ORM decision (comparison + recommendation)
4. Service architecture (content, leads, notifications, media)
5. Telegram notification service (delivery guarantees, retry, failure alerting)
6. Scheduled jobs (promo expiry, sitemap refresh, backup triggers)
7. Caching & revalidation architecture
8. Environments & configuration management
9. Media storage decision (Cloudinary vs alternatives — cost model at this media volume; one recommendation)

## 16 — Security
1. Threat model (spam/abuse on lead forms; admin compromise; media hotlinking; defacement)
2. OWASP Top 10 mapping — control per risk
3. Authentication (admin): password policy, sessions, optional 2FA recommendation
4. Authorization: RBAC enforcement server-side
5. Input validation & output encoding strategy (XSS, SQLi, CSRF)
6. Rate limiting & bot mitigation (honeypot, per-IP/route limits, escalation to challenge)
7. Security headers & CSP (concrete header set)
8. File-upload security (type sniffing, size limits, processing isolation)
9. Secrets management & dependency hygiene
10. Personal-data protection (lead data handling, retention, UZ localization compliance design)
11. Backup, recovery & incident response runbook

## 17 — Performance
1. Performance budgets per template (weight, requests, LCP element identified per page)
2. Achieving Lighthouse 100 / 100 / 100 / 100 — honest, technique-by-technique plan and the discipline required to keep it
3. Image strategy (formats, srcset matrix, art direction, CDN transforms)
4. Video strategy (posters, lazy playback, streaming vs progressive, when to embed vs self-host)
5. Font loading strategy (subsetting for Latin-ext + Cyrillic, fallback metrics)
6. JavaScript budget & code-splitting rules
7. Caching & CDN architecture (with docs 15/19)
8. Third-party policy (analytics loaded without wrecking scores)
9. Monitoring: lab + field (CI checks, real-user vitals)

## 18 — SEO
1. Keyword & intent map (UZ + RU: category terms, "prava narxi", branch/geo terms, express/failed-exam terms)
2. Technical SEO (crawlability, canonicals, hreflang, sitemap strategy, robots)
3. Metadata system (title/description templates per template type, bilingual)
4. Structured data plan (DrivingSchool/LocalBusiness per branch, Course per category, FAQPage, BreadcrumbList — JSON-LD specs)
5. Open Graph system (dynamic OG image generation per page type)
6. Local SEO program (Google Business Profile ×7, Yandex Maps ×7, 2GIS, directory listings, NAP consistency using official numbers)
7. Content SEO roadmap (v1 on-page; v2 `/blog` plan)
8. Launch SEO checklist & post-launch monitoring

## 19 — Deployment
1. Hosting architecture decision (executes doc 15 topology; DNS, SSL, domains incl. `.uz`)
2. Environments (local, staging, production) & promotion rules
3. CI/CD pipeline (checks: types, tests, Lighthouse CI, a11y gate)
4. Media storage & CDN provisioning
5. Observability (error tracking, uptime, log strategy, alert routing — incl. Telegram alerts to the dev)
6. Backup & disaster recovery procedures (RPO/RTO targets)
7. Launch runbook (cutover, DNS, verification checklist)
8. Operations runbook (routine tasks, promo-season checklist)

## 20 — Testing & QA
1. Test strategy & pyramid (what's unit vs integration vs E2E for this platform)
2. E2E suites (lead submission incl. Telegram delivery, language switching, promo expiry behavior, gallery)
3. Visual regression approach
4. Accessibility testing protocol (automated + manual screen-reader passes, keyboard maps)
5. Performance testing (budget enforcement in CI, throttled-network passes)
6. i18n QA (parity checks, overflow/truncation in both scripts)
7. Device/browser lab matrix (market-realistic Android set + iOS)
8. UAT plan with the client (scripted scenarios for staff)
9. Defect workflow & severity definitions

## 21 — Acceptance Criteria
1. Global definition of done
2. Per-module acceptance checklists (public modules, admin modules, integrations)
3. Quality gates: Lighthouse 100×4 verification protocol, WCAG 2.2 AA audit sign-off
4. Content-completeness gate (every doc 06 slot filled, both locales)
5. SEO launch gate (doc 18 checklist executed)
6. Security gate (doc 16 checklist executed)
7. Client sign-off procedure

## 22 — Analytics & Measurement *(proposed addition)*
Rationale: your stated goal is increased registrations and conversion; without a defined measurement layer, "increase" is unverifiable. Small document, high leverage.
1. KPI framework tied to doc 00 goals
2. Event taxonomy (CTA clicks, form starts/submits, calls tapped, promo interactions — per template)
3. Tooling decision (privacy-respecting, performance-safe analytics + search consoles for Google/Yandex)
4. Funnel & campaign attribution (UTM conventions for Telegram/Instagram posts)
5. Dashboards (admin-embedded views; monthly report template for the client)

---

## Approval Checklist (Phase 4 gate)

- [ ] Approve `04_Information_Architecture.md` (or request changes)
- [ ] Approve this Table of Contents (confirm or strike doc 22)
- [ ] Confirm/deny the E category
- [ ] Send: logo file, authoritative price list (incl. express), official phone set, domain status
- [ ] Reply **"Approved"** (with any modifications) → Phase 5 begins at `00_Project_Overview.md`
