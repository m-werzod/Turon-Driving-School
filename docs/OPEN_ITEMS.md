# Open Items — Launch Blockers & Pending Client Input

Tracks every place the implementation depends on input the client has not yet
provided. Mirrors TZ doc 04 §13 and adds the concrete code locations affected.
**Nothing marked "Launch blocker" may go to production unresolved.**

| # | Item | Status | Affected code | Severity |
|---|---|---|---|---|
| 1 | E category confirmation | **Resolved 2026-10-14 — not sold.** Reserved namespace only; no entry in `src/content/categories.ts`, `/toifalar/e` 404s. An earlier pass briefly added it; removed again to match this decision. | `src/content/categories.ts` | Closed |
| 2 | Authoritative price list (7 categories + 2 express packages) | Received (Telegram, 2026-07-22) — wired into `src/content/categories.ts`, `src/content/express.ts`; promo `endsOn` set to 2026-07-31 per "iyul oyi oxirigacha" | Confirm the *next* promo deadline before 2026-08-01 so prices don't silently read as expired | Resolved — recheck monthly |
| 3 | Official phone set (3 vs 4 numbers) + second Telegram channel role | Received (Telegram, 2026-07-22) — 3 numbers wired into `src/content/settings.ts`, inherited by all branches | Telegram channel role still unconfirmed | Resolved (phones) |
| 4 | Instructor public display decision | Awaiting client | About page omits the instructors grid until confirmed (doc 04 §13.4); content model already supports it | Structure-safe |
| 5 | License scan + number | Awaiting client | `src/content/settings.ts` `license` — About renders the license block only when present | **Launch blocker** |
| 6 | Logo file | Received — wired into `src/components/layout/logo.tsx` (`public/assets/logo/logo.png`) | Brand color palette is still provisional and marked for replacement (TZ ToC note on doc 05) | Palette confirmation pending |
| 7 | Domain name (.uz recommended) | Awaiting client | `NEXT_PUBLIC_SITE_URL` env — canonical URLs, sitemap, hreflang | **Launch blocker** |
| 8 | Real media (branch photos, gallery, results photos) | `src/content/gallery.ts` populated (autodrome/classroom/graduation/vehicles albums); lightbox grid UI still ships with the media milestone | Branch/result media fields still unpopulated; 2 corrupt source video files (`grad2.mp4`, `vdgr01.mp4`) need re-export | Launch content gate |
| 9 | Monthly exam-result figures | Awaiting client | `src/content/results.ts` — entries marked `PROVISIONAL`, must be replaced with real posts | **Launch blocker** |
| 10 | Testimonials | Awaiting collection + moderation | `src/content/testimonials.ts` — empty; Home section auto-hides while empty | Structure-safe |
| 11 | Branch geo coordinates | **Resolved** — approximated pins removed (docs/DECISIONS.md D-09). Four locations are school-confirmed; the remaining three are tracked as #13/#14 below. | `src/content/branches.ts` | Superseded |

## Resolution procedure

1. Client sends the asset/decision (per TZ ToC approval checklist).
2. Update the referenced content file(s); remove the `PROVISIONAL` marker.
3. Tick the row here; when all launch blockers are clear, the content gate
   (TZ doc 21 §4) can be signed off.


## Added 2026-10-09

| # | Item | Status | Affected code | Severity |
|---|---|---|---|---|
| 12 | ~~E category price~~ | **Superseded 2026-10-14** — E removed from the catalogue entirely per row #1; "price on request" rendering no longer applies. | `src/content/categories.ts` | Closed |
| 13 | Map links for Kamuna, Bog'ishamol, To'raqo'rg'on | Awaiting client | `src/content/branches.ts` — `googleMapsUrl: null`, so these three render no map, no directions buttons and no `GeoCoordinates`. Send a Google Maps share link per branch. | **Launch blocker** |
| 14 | Exact coordinates for the three share-link branches | Awaiting client | Only Namangan shahar has confirmed lat/lng. Kosonsoy, Buloq and Tergachi have share links but no coordinates, so their **Yandex** button, embedded map and schema.org `GeoCoordinates` are omitted (Google works). Open each link in a browser and send the expanded URL or the lat/lng. | Enhancement |
| 15 | `ANTHROPIC_API_KEY` for the chat assistant | Not set | Without it `/api/chat` returns 503 and the widget shows its unavailable state. **The live model call has never been executed** — see the delivery notes. | **Launch blocker for the chatbot** |

### E category — resolved

A prior pass added an E entry (trailer entitlement, price on request). The
client's instruction on 2026-10-14, giving the exact 7-item category order
(A, B, BE, BC, C, CE, D) with E absent, matches their original answer to
this item ("not sold — leave reserved") and supersedes that addition. E is
removed from `src/content/categories.ts`; the `/toifalar/e` URL namespace
stays reserved per TZ doc 04 §12 but renders the ordinary 404, same as any
unbuilt route.

### Promo deadline — placeholder, needs confirmation

All seven categories' `endsOn` was `2026-07-31`, which had lapsed by
2026-10-14 — every card silently fell back to its flat base price with no
strikethrough (`activePromo()` correctly honors expiry; this was not a
bug). Extended to `2026-10-31` as a placeholder so the already-approved
discounted prices render again. **Confirm the real deadline with the
client** and update `src/content/categories.ts` (`promo.endsOn` on all
seven entries) before launch.
