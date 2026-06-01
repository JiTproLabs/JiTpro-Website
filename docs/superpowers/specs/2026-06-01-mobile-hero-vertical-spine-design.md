# Mobile Hero — Vertical-Spine Procurement-Failure Sequence

**Date:** 2026-06-01
**Status:** Approved design, pending implementation plan
**Files in scope:** `src/components/hero/MobileHeroSequence.tsx`, `src/content/heroAnimationData.ts`, `src/components/hero/ProcurementFlowHero.tsx` (copy de-duplication only)

## Problem

The desktop hero (`ProcurementFlowHero.tsx`, driven by `heroAnimationData.ts`) and the
mobile hero (`MobileHeroSequence.tsx`) currently tell **opposite stories** that happen to
end on the same house render + hero copy.

- **Desktop:** a procurement *failure* drama. An intro title, a Gantt that fades in, a
  "Today" cursor that stops at 7 failure notes while 8 procurement-package cards cycle
  above it, a late-delivery dwell, a thesis line that morphs in
  (*"When Procurement Delays Compound, Margin Disappears."*), then house + copy. ~26s.
  The arc earns the headline *"Control Before You Build."* by showing the loss of control.
- **Mobile:** a procurement *success* demo. A single "Structural Steel" card whose progress
  bar fills cleanly through five positive steps to an *"On-Time Delivery ✓"* flash, then
  house + copy. ~9s. It shows control already achieved, undercutting the headline.

Desktop is the rule. Mobile must tell the **same story**, adapted to portrait.

## Goal

Rewrite the mobile hero as a condensed, portrait-native version of the desktop
failure→consequence→control narrative, sharing all narrative copy with desktop so the two
can never drift again.

## Decisions (resolved during brainstorming)

| Decision | Choice |
|----------|--------|
| Length/fidelity | **Condense** — same beats, fewer stops, ~13–14s (not the full ~26s / 7 stops). |
| Visual model | **Vertical spine** — time flows top→bottom; a horizontal "Today" marker sweeps down. |
| Package scale | **Cycle a few packages** — the top label swaps per stop, carrying desktop's "every package struggles" message. |
| Thesis beat | **Include** the morphing thesis line before house + copy. |
| Controls | **Match desktop** — Skip (after a few seconds) + Replay (when done), styled identically. |
| Timing engine | `requestAnimationFrame` elapsed clock (smooth sweep), not the current `setTimeout` step machine. |

## Story & beats (~13–14s)

| # | Phase | ~Time | What happens |
|---|-------|-------|--------------|
| 1 | `intro` | 1.5s | Dark hold, then the vertical spine fades in: 4 stage nodes labeled + Required Onsite diamond at the bottom. Marker hidden. Brief read. |
| 2 | `descend` | 7s | A horizontal **"Today"** marker sweeps down the spine, pausing at each stage. At each stop: the stage reddens, its failure note fades in beside it, and the **package label at the top swaps**. 4 stops. |
| 3 | `missed` | 1.5s | Marker reaches Required Onsite; diamond turns red; the missed-delivery line (`lateNote`) appears. Dwell. |
| 4 | `thesis` | 2.5s | Spine clears; the thesis line scales up in amber with a soft glow and holds. |
| 5 | `resolve` | — | House render fades in, then hero copy (eyebrow / headline / subhead). Holds. |

### The 4 condensed stops

Drawn verbatim from desktop's 7 `failureNotes` and `procurementPackages` in
`heroAnimationData.ts`, mapped to spine stages:

| Stage label | Failure note (exact) | Package (exact) |
|-------------|----------------------|-----------------|
| Buyout / Approval | `Subcontract Buyout Takes Longer Than Planned` | `Structural Steel Package` |
| Fabrication | `Fabrication Start Dates Continually Missed` | `Electrical Switch Gear` |
| Buffer | `Buffers Vanish` | `Plumbing Rough-In Package` |
| Required Onsite | `Original Onsite Date Missed` | `Interior Finishes` |

The missed-delivery dwell line is `lateNote.text` =
`Late Material Delivery Impacts Downstream Work`. The thesis line is the final
`procurementPackages` entry = `When Procurement Delays Compound, Margin Disappears.`
The stage labels above are mobile-only display strings (shorter than the desktop bar
labels) and will be defined in the new `mobileSpine` data.

Reduced-motion: jump straight to phase 5 (house + copy), as today.

## Visual / layout spec

Inside the same full-viewport-height dark section (`100svh`, `bg-[#030a19]`) the mobile hero
already uses.

- **Spine:** a vertical line centered horizontally, occupying the middle ~70% of viewport
  height. The segment above the "Today" marker is amber/lit; below it is dim slate
  (time not yet arrived).
- **Stage node:** dot + label. Default slate; on the marker passing, transitions
  amber → red per desktop's `STAGE_COLORS` (warning amber → critical red). A short segment
  beside each node may extend/redden to echo the desktop "bar slips" idea without a full Gantt.
- **Today marker:** a horizontal line with a small "Today" tag, glides downward (rAF).
  Yellow while on schedule; shifts red once past the buffer (mirrors desktop `cursorBeyondOnsite`).
- **Failure note:** small amber text (~`text-xs`) fading in beside the active stage, with the
  amber dot + glow treatment from desktop's `FailureNoteBubble`. One on screen at a time.
- **Package label:** pinned near the top, in the desktop `PackageTitleCard` style
  (caption "Procurement Package" + name, amber accent strip). Swaps per stop.
- **Onsite milestone:** rotated-square diamond at the spine's bottom, slate → red on
  overshoot — same shape/colors as desktop.
- **Thesis line:** reuses the desktop morph feel — amber, scales up, soft amber glow.
- **House + copy:** unchanged from current mobile (house `mix-blend-lighten`, gradient scrim,
  centered copy), now sourced from shared `heroCopy`.

Palette, glow, and type treatments are lifted from the desktop constants so the two feel like
one design language.

## Architecture & data sharing

**`heroAnimationData.ts`:**
- Add `heroCopy = { eyebrow, headline, subhead }`; replace the hardcoded strings in **both**
  `ProcurementFlowHero.tsx` and `MobileHeroSequence.tsx` (currently duplicated) with it.
- Add a `mobileSpine` array of the 4 `{ stageLabel, note, package }` stops, referencing the
  existing note/package strings. The thesis line reuses the final `procurementPackages` entry;
  the missed-delivery line reuses `lateNote`.

**`MobileHeroSequence.tsx` (rewritten):**
- `requestAnimationFrame` `elapsed` clock + a local `MOBILE_TIMING` object and phase helpers
  (`intro` / `descend` / `missed` / `thesis` / `resolve`), structured like the desktop phase
  functions but condensed and local to mobile (mobile owns its own durations).
- Sub-components within the file: `Spine` (nodes + lit/dim line), `TodayMarker`, `StageNode`,
  `SpineNote`, plus the existing house/copy block. Each piece independently readable.
- **Parity:** adopt the desktop module-level `heroPlayedThisLoad` flag so returning to the
  homepage via SPA navigation skips the replay (only a refresh replays). Reduced-motion
  already handled (jump to `resolve`).
- **Controls:** Skip (appears after ~3s of play) and Replay (when complete), reusing the
  exact button styling from desktop.

**Out of scope:** desktop animation logic and layout (only its hardcoded copy is touched, to
move it into `heroCopy`). No changes to routing, the house asset, or other pages.

## Testing / verification

- Local preview via dev server at a phone width: DevTools device mode (honors `100svh`) or
  `npm run dev -- --host` on a real device. Screenshot the `descend`, `thesis`, and `resolve`
  phases at ~390px width.
- Verify reduced-motion jumps straight to house + copy.
- Verify SPA navigation away and back skips the replay; a hard refresh replays.
- Verify Skip and Replay behave like desktop.
- `npm run lint` and `npm run typecheck` pass.

## Success criteria

A visitor on a phone sees the same emotional arc as on desktop — procurement looks
manageable, time exposes what the plan missed across multiple packages, the onsite date is
missed, margin disappears — before the house resolves and *"Control Before You Build."* lands.
No narrative copy is duplicated between the two components.
