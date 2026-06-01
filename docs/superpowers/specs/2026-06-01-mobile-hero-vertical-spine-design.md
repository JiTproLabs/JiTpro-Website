# Mobile Hero — Scrolling-Gantt Procurement-Failure Sequence

**Date:** 2026-06-01
**Status:** Approved design, in implementation
**Files in scope:** `src/components/hero/MobileHeroSequence.tsx`, `src/content/heroAnimationData.ts`, `src/components/hero/ProcurementFlowHero.tsx` (copy de-duplication only)

> **Revision note.** This design originally specified a *vertical spine* (time flowing
> top-to-bottom, a horizontal marker sweeping down). That was built and rejected on
> review: it inverts how contractors actually read a schedule (time goes left-to-right
> on a Gantt). This revision replaces it with a horizontal Gantt where the **Today line
> is stationary and the chart scrolls right-to-left past it** — the "fixed playhead,
> scrolling timeline" pattern. Everything else (story, shared data, intro framing line,
> thesis beat, controls) carries over.

## Problem

The desktop hero (`ProcurementFlowHero.tsx`, driven by `heroAnimationData.ts`) and the
mobile hero told **opposite stories**. Desktop is a procurement *failure* drama: an intro
framing line, a Gantt, a "Today" cursor that traverses the plan pausing at failure notes
while bars slip (Buyout extends, Fabrication is pushed and locked, the buffer is consumed,
the Required Onsite date is missed), then a thesis line, then house + hero copy. The mobile
version must tell the **same story**, adapted to a portrait phone.

## Goal

A condensed, portrait-native version of the desktop failure→consequence→control narrative
that reads the way contractors read schedules (horizontal time axis), sharing all narrative
content and the schedule data with desktop so the two cannot drift.

## Decisions (resolved during brainstorming)

| Decision | Choice |
|----------|--------|
| Mental model | **Horizontal Gantt, fixed Today line, chart scrolls right-to-left past it.** |
| Bar dynamics | **Full dynamic slip** — reproduce desktop exactly (Buyout pins to the line and stretches, Fabrication hugs the line then releases, buffer vanishes, Onsite overshoots into red). |
| Data source | Drive bars/triggers/lock from desktop's `traditionalScenario`; the chart literally shares the schedule, not just the copy. |
| Pause-stops | **5 key moments:** Buyout takes longer (0.08) → Submittals stall (0.20) → Buffers vanish (0.46) → Fabrication starts late / the lock (0.72) → Onsite missed (0.92). |
| Note placement | **Fixed full-width caption below the chart**, one note at a time; the relevant bar reddens at the line. |
| Intro framing line | Keep — *"Procurement looks manageable. Until time exposes what the plan missed."* reads first. |
| Thesis beat | Keep — *"When Procurement Delays Compound, Margin Disappears"* scales in before house + copy. |
| Controls / parity | Skip + Replay (match desktop), per-load replay flag, reduced-motion → jump to house + copy. |
| Timing engine | `requestAnimationFrame` elapsed clock. |

## How the dynamics map (why "full slip" is tractable)

Fixing the line and scrolling the chart is the same math as desktop, viewed from the line's
reference frame. Define `progress` = the plan-fraction currently at the Today line; it runs
`0 → LATE_BAR2_END (1.18)`, pausing at the 5 triggers — exactly desktop's `cursorX`. The
desktop bar formulas are reused verbatim as functions of `progress`:

```
buyoutEnd   = max(0.32, min(progress, 0.72))   // 0.72 = BAR_LOCK_AT_CURSOR
fabStart    = buyoutEnd
fabEnd      = fabStart + 0.46                   // FAB planned length
bufferStart = max(0.78, fabEnd)
bufferWidth = max(0, 0.92 - bufferStart)        // 0.92 = Required Onsite
```

Bars are drawn in plan-space and the whole timeline is translated by
`translateX = LINE_X − progress·SCALE`. The visible consequences fall out automatically:

- **Buyout** grows pinned to the line (right edge holds at the line while the left edge
  scrolls away and the bar stretches) until the lock.
- **Fabrication** hugs the right of the line and won't move (continually pushed into the
  future) until the lock, then releases and scrolls left past the line.
- **Buffer** shrinks to nothing as Fabrication's tail eats into it.
- **Required Onsite** diamond goes red as the line passes 0.92 while Fabrication overshoots.

## Beats & timeline (~20s)

| # | Phase | ~Time | What happens |
|---|-------|-------|--------------|
| 1 | `intro` | 3.4s | Framing line fades in, holds (read), fades out as the planned chart fades in (line at project start). |
| 2 | `advance` | 10.5s | Chart scrolls right-to-left, pausing at the 5 triggers. Bars slip dynamically per the formulas above; the package label (top) and caption (below) update at each stop. |
| 3 | `missed` | 1.6s | `progress` at the end (1.18); Fabrication overshoots the red Onsite diamond; caption reads *"Late Material Delivery Impacts Downstream Work."* Dwell. |
| 4 | `thesis` | 2.6s | Chart clears; thesis line scales up in amber and holds. |
| 5 | `resolve` | 2.8s | Thesis fades out as the house render and hero copy fade in. Holds. |

Reduced-motion: jump straight to phase 5.

### The 5 stops (verbatim from `traditionalScenario`)

| Trigger | Failure note | Package |
|---------|--------------|---------|
| 0.08 | `Subcontract Buyout Takes Longer Than Planned` | `Structural Steel Package` |
| 0.20 | `Submittals Stall Due to Incomplete Design` | `Steel Windows & Doors` |
| 0.46 | `Buffers Vanish` | `Electrical Switch Gear` |
| 0.72 | `Fabrication Starts Late` | `Plumbing Rough-In Package` |
| 0.92 | `Original Onsite Date Missed` | `Statuary Marble Slabs` |

Missed-dwell caption = `lateNote.text` (`Late Material Delivery Impacts Downstream Work`).
Thesis line = final `procurementPackages` entry (`When Procurement Delays Compound, Margin
Disappears`). Intro framing line = `traditionalScenario.title`.

## Visual / layout spec

Inside the existing full-viewport-height dark section (`100svh`, `bg-[#030a19]`).

- **Row-label gutter:** fixed, opaque (`bg-[#030a19]`) strip on the left holding short row
  labels (Buyout, Fabrication, Buffer, Required Onsite). Drawn above the scrolling bars so
  bars scrolling left vanish behind it.
- **Scrolling timeline:** a translated layer holding the bars (drawn in plan-space ×
  `SCALE`) and the Onsite diamond. Bar fills use the desktop slate→amber→red stage palette.
- **Today line:** fixed vertical line (~38–40% from the left, just right of the gutter) with
  a small "Today" tag; yellow on schedule, red once `progress` passes the Onsite date.
- **Package label:** desktop `PackageTitleCard` style, pinned near the top; crossfades per stop.
- **Caption:** fixed full-width line below the chart; amber for failure notes, red for the
  missed-delivery line; one at a time, crossfading on change.
- **Thesis / house / copy:** unchanged from the prior build (centered amber thesis; house
  `mix-blend-lighten` + scrim; centered copy from shared `heroCopy`).

`SCALE`, gutter width, and the Today line's x-position are tuned during build via phone-width
screenshots (zoom = how many stages are visible ahead of the line).

## Architecture & data sharing

- **`heroAnimationData.ts`:** keep `heroCopy`, `introTitle`, `thesisLine`, `mobileLateLine`.
  Replace the vertical-spine `mobileSpine`/`MobileSpineStop` with `mobileStops` (5 ×
  `{trigger, note, package}`). Bar geometry and the lock point come from the existing
  `traditionalScenario` + `BAR_LOCK_AT_CURSOR`.
- **`MobileHeroSequence.tsx` (rewritten):** rAF `elapsed` clock; local `PH` phase map
  (`intro` / `advance` / `missed` / `thesis` / `resolve`) and helpers; a `progressAt()`
  checkpoint/pause walker mapping advance-time → `progress`; the desktop `dyn` bar formulas;
  render layers (gutter overlay, translated timeline, Today line, caption, package, thesis,
  house, copy). Skip/Replay buttons, per-load `heroPlayedThisLoad` flag, reduced-motion all
  carry over.
- **Out of scope:** desktop animation logic/layout (only its hardcoded copy was moved into
  `heroCopy`). No routing, asset, or other-page changes.

## Testing / verification

- Phone-width screenshots (390×844) of `intro`, each `advance` stop, `missed`, `thesis`,
  `resolve`; tune `SCALE`/line position from them.
- Reduced-motion jumps straight to house + copy.
- SPA navigation away/back skips the replay; a hard refresh replays.
- Skip and Replay behave like desktop.
- Desktop hero still renders (shared-data refactor).
- `npm run lint` and `npm run typecheck` pass.

## Success criteria

On a phone, a contractor sees a Gantt they recognize: the plan scrolls past a fixed Today
line, Buyout drags, Fabrication keeps slipping, the buffer evaporates, the onsite date is
missed and margin disappears — then the house resolves and *"Control Before You Build."*
lands. No narrative copy or schedule data is duplicated between the two heroes.
