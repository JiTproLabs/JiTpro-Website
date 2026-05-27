# Handoff — Interactive Procurement Schedule on Home page

**Date:** 2026-05-21
**Owner:** Jeff Kaufman (jeffk@kaufmanbuilding.com)
**Status:** Implemented locally, not yet committed or deployed in either repo.

## What was built

A read-only interactive procurement schedule embedded mid-page on the marketing home page. Visitors can hover/tap segments to see phase details, zoom across quarters/months/weeks/days, scroll horizontally on phones. No edit paths, no Supabase connection from the marketing site, no router navigation away from `/`.

Mounted on `src/pages/Home.tsx` directly after the DIAGNOSIS section ("JiTpro makes those constraints visible…") under the heading **"Here's what it looks like."**

## Architecture

The marketing site is data-frozen by design:

```
JiTpro-App (sandbox/demo app)                 JiTpro-Website (this repo, marketing)
  procurement_timelines (Supabase)              src/content/procurementScheduleSnapshot.json
        │                                              ▲
        │  npm run snapshot:procurement-schedule       │
        ▼                                              │
  scripts/snapshot-procurement-schedule.mjs ───────────┘
                                                       │
                                                       ▼
                                          src/components/InteractiveProcurementSchedule.tsx
                                                       │
                                                       ▼
                                          src/pages/Home.tsx  (full-width section)
```

The component is read-only. It imports the JSON snapshot at build time — **do not connect it to a live Supabase source**. To refresh the displayed schedule, regenerate the snapshot in JiTpro-App.

## Files changed

### JiTpro-Website (this repo)

| Path | What |
|---|---|
| `src/content/procurementScheduleSnapshot.json` | **NEW** — 42 rows, ~129 KB. Frozen snapshot of sandbox `procurement_timelines`. |
| `src/components/InteractiveProcurementSchedule.tsx` | **NEW** — read-only Gantt-style component. Hover/tap tooltips, four zoom levels, weekend shading, today line, resizable label column. |
| `src/pages/Home.tsx` | **MODIFIED** — added import + new full-width `<section className="px-6 pb-24">` between DIAGNOSIS and STAKEHOLDER ROUTER. |
| `docs/handoff/2026-05-21-interactive-procurement-schedule.md` | This file. |

### JiTpro-App (sibling repo, `../JiTpro-App`)

| Path | What |
|---|---|
| `scripts/snapshot-procurement-schedule.mjs` | **NEW** — Node script to refresh the marketing snapshot. Reads `VITE_SANDBOX_SUPABASE_URL` / `VITE_SANDBOX_SUPABASE_ANON_KEY` from `.env` via Node's native `--env-file` flag (no `dotenv` dependency). |
| `package.json` | **MODIFIED** — added `"snapshot:procurement-schedule": "node --env-file=.env scripts/snapshot-procurement-schedule.mjs"`. No new dependencies. |
| `CLAUDE.md` | **MODIFIED** — appended section `## Updating the marketing site's interactive procurement schedule` with the trigger phrase. |
| `claude-memory/wiki/interactive-procurement-schedule-snapshot.md` | **NEW** — same content as the CLAUDE.md section, sized for memory recall. |

Spec lives at `JiTpro-App/docs/superpowers/specs/2026-05-21-marketing-interactive-procurement-schedule-design.md`.

## Decisions made (override if needed)

1. **Placement:** Option A — immediately after DIAGNOSIS, before STAKEHOLDER ROUTER.
2. **Heading:** "Here's what it looks like." (threads from DIAGNOSIS's closing line)
3. **Container height:** `h-[600px]` (fixed, fits inside long marketing page without hijacking page scroll).
4. **Section width:** `max-w-6xl` for the schedule wrapper; inner copy block stays `max-w-3xl` to match other Home sections.
5. **Section background:** white (no `bg-slate-50`) so the next section's slate-50 still creates visual contrast.
6. **Section padding:** `pb-24` only (no `pt`) — schedule butts up against DIAGNOSIS to avoid doubled vertical gap.
7. **Today line styling:** `2px solid #1e293b` (slate-800) with a slate-800 "Today" pill in the calendar header. Initially was `1px dashed #b0b8c4`; changed at user request for more prominence.
8. **Bar hover:** removed `cursor-pointer` and `hover:opacity-90` from the source demo since bars are non-interactive on the marketing site.
9. **Touch behavior:** `touchstart` on segments shows tooltip; document-level `touchstart` outside any `[data-segment]` element dismisses it.
10. **Sort:** baked `delivery_asc` (URL `?sort=` removed; snapshot is pre-sorted by `delivery_date asc`).
11. **`status` field:** captured in the JSON but currently unused visually. Left in for future use (e.g., status legend or coloring).
12. **Component framing:** white card with `shadow-sm border border-slate-200`, matches the source demo's aesthetic.

## Snapshot refresh — known blocker

The snapshot script currently **returns 0 rows** because `procurement_timelines` has RLS requiring `auth.uid() = user_id`. The anon key alone reads nothing. The current snapshot in `src/content/procurementScheduleSnapshot.json` was produced by:

1. Running the equivalent SELECT in the Supabase SQL Editor (sandbox project) with `jsonb_pretty(jsonb_agg(...))`.
2. Saving the result to `JiTpro-App/scripts/_temp_snapshot_input.json` (manual paste).
3. Running a one-off extractor that parsed and wrote the inner array to the destination.

Both temp files were deleted after use. The npm script and discoverability anchors are in place but **need an auth path wired in before they actually produce data**. Options:

- Add a sandbox service-role key (e.g. `SANDBOX_SUPABASE_SERVICE_ROLE_KEY`) and update the script to use it — bypasses RLS, single credential.
- Add sandbox login credentials and have the script `signInWithPassword` before the query.
- Keep the manual SQL-editor path until the marketing site changes frequently enough to justify automation.

## Verification status (as of handoff)

User verified locally that:
- Schedule renders below DIAGNOSIS.
- Hover tooltip shows item name, phase name, start, end, days.
- Zoom buttons change density.
- Bar clicks do nothing.
- Mobile viewport shows horizontal scroll and tap-to-show tooltip.
- Today line was upgraded to a prominent slate-800 2px line with a "Today" pill at the top.

Neither repo has been committed or pushed. Both working trees are dirty.

## To continue this work

Likely next steps (none of these are committed work; the user will pick):
- Commit the changes in both repos (the user's pattern is to commit explicitly, not have Claude do it autonomously — see `JiTpro-App/CLAUDE.md`).
- Solve the RLS blocker so the snapshot script actually runs end-to-end.
- Polish: e.g., status-coloring on bars, sticky "Today" pill when scrolled, legend, mobile-specific tweaks after testing on real devices.
- Consider whether the section heading and copy still feel right after seeing it in context.

## Tone & style note for the next session

- The user's CLAUDE.md in JiTpro-App requires **a short plan before edits** and forbids unrequested commits/refactors. JiTpro-Website did not have a CLAUDE.md as of this handoff; apply the same restraint.
- The user prefers concise responses; avoid trailing summaries unless explicitly asked.
