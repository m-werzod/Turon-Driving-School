# Open Items — Launch Blockers & Pending Client Input

Tracks every place the implementation depends on input the client has not yet
provided. Mirrors TZ doc 04 §13 and adds the concrete code locations affected.
**Nothing marked "Launch blocker" may go to production unresolved.**

| # | Item | Status | Affected code | Severity |
|---|---|---|---|---|
| 1 | E category confirmation | Awaiting client | `src/content/categories.ts` — add entry; routing and template T-03 need no change (namespace reserved per doc 04 §12) | Structure-safe |
| 2 | Authoritative price list (7 categories + 2 express packages) | Awaiting client | `src/content/categories.ts`, `src/content/express.ts` — values marked `PROVISIONAL` | **Launch blocker** |
| 3 | Official phone set (3 vs 4 numbers) + second Telegram channel role | Awaiting client | `src/content/settings.ts` — numbers marked `PROVISIONAL` | **Launch blocker** |
| 4 | Instructor public display decision | Awaiting client | About page omits the instructors grid until confirmed (doc 04 §13.4); content model already supports it | Structure-safe |
| 5 | License scan + number | Awaiting client | `src/content/settings.ts` `license` — About renders the license block only when present | **Launch blocker** |
| 6 | Logo file | Received — wired into `src/components/layout/logo.tsx` (`public/assets/logo/logo.png`) | Brand color palette is still provisional and marked for replacement (TZ ToC note on doc 05) | Palette confirmation pending |
| 7 | Domain name (.uz recommended) | Awaiting client | `NEXT_PUBLIC_SITE_URL` env — canonical URLs, sitemap, hreflang | **Launch blocker** |
| 8 | Real media (branch photos, gallery, results photos) | `src/content/gallery.ts` populated (autodrome/classroom/graduation/vehicles albums); lightbox grid UI still ships with the media milestone | Branch/result media fields still unpopulated; 2 corrupt source video files (`grad2.mp4`, `vdgr01.mp4`) need re-export | Launch content gate |
| 9 | Monthly exam-result figures | Awaiting client | `src/content/results.ts` — entries marked `PROVISIONAL`, must be replaced with real posts | **Launch blocker** |
| 10 | Testimonials | Awaiting collection + moderation | `src/content/testimonials.ts` — empty; Home section auto-hides while empty | Structure-safe |
| 11 | Branch geo coordinates | Approximate town centers seeded | `src/content/branches.ts` — verify each pin before launch; map deep links use landmark search queries meanwhile | Verify before launch |

## Resolution procedure

1. Client sends the asset/decision (per TZ ToC approval checklist).
2. Update the referenced content file(s); remove the `PROVISIONAL` marker.
3. Tick the row here; when all launch blockers are clear, the content gate
   (TZ doc 21 §4) can be signed off.
