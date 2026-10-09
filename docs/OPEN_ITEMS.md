# Open Items — Launch Blockers & Pending Client Input

Tracks every place the implementation depends on input the client has not yet
provided. Mirrors TZ doc 04 §13 and adds the concrete code locations affected.
**Nothing marked "Launch blocker" may go to production unresolved.**

| # | Item | Status | Affected code | Severity |
|---|---|---|---|---|
| 1 | E category confirmation | Awaiting client | `src/content/categories.ts` — add entry; routing and template T-03 need no change (namespace reserved per doc 04 §12) | Structure-safe |
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
| 12 | **E category price** | Awaiting client | `src/content/categories.ts` — `basePrice: null`. The category is listed and fully described, but renders "Narxni aniqlashtiring" / "Цена по запросу" and is excluded from the schema.org `Offer`. No price is guessed. | **Launch blocker** |
| 13 | Map links for Kamuna, Bog'ishamol, To'raqo'rg'on | Awaiting client | `src/content/branches.ts` — `googleMapsUrl: null`, so these three render no map, no directions buttons and no `GeoCoordinates`. Send a Google Maps share link per branch. | **Launch blocker** |
| 14 | Exact coordinates for the three share-link branches | Awaiting client | Only Namangan shahar has confirmed lat/lng. Kosonsoy, Buloq and Tergachi have share links but no coordinates, so their **Yandex** button, embedded map and schema.org `GeoCoordinates` are omitted (Google works). Open each link in a browser and send the expanded URL or the lat/lng. | Enhancement |
| 15 | `ANTHROPIC_API_KEY` for the chat assistant | Not set | Without it `/api/chat` returns 503 and the widget shows its unavailable state. **The live model call has never been executed** — see the delivery notes. | **Launch blocker for the chatbot** |

### E category — what was assumed

The school confirmed an E category exists and should sit between BE and D.
Its price was not supplied, so it is `null` by design. Its description was
written as a trailer entitlement (the standard meaning of E in Uzbek
licensing). **Confirm the wording and the price before launch** — if E means
something else here, only `src/content/categories.ts` needs editing.
