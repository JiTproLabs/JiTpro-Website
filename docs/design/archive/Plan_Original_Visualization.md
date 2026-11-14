# Archive: the original Plan visualization

**Preserved:** 2026-11-11, ahead of the Plan redesign.
**Archive branch:** `archive/identify-original-visualization` (the shared archive for the homepage visualizations)
**Source commit (the exact code this record describes):** `6567fb010c08762cedfae0f492de1dabf3db11c1`
**Source branch at the time:** `feature/102926_homepage_update`

This file records what the original Plan visualization is, how it works, which
files build it, what it shares with Connect, and how to restore or reuse it.

The source commit is a complete, working snapshot of the repository. It also
holds Identify v2 and the finished Connect, so it is the last commit at which
all of the homepage visualizations are in their pre-Plan-redesign state.

## What the shared archive holds

| Version | Source commit | Record |
| --- | --- | --- |
| Identify v1 (register tour) | `e4e3a03dbcdf350ca656d6711642088b89b1ffc0` | `Identify_Original_Visualization.md` |
| Identify v2 (four-stage story) | `d40734896246c662d04184d7a22ccdd6e732507c` | `Identify_Redesign_v2.md` |
| **Plan original** | `6567fb010c08762cedfae0f492de1dabf3db11c1` | this file |

> **Standing instruction.** The homepage scroll interaction (Section C) must
> not change without Jeff's explicit authorization.

---

## A. Purpose

**Where it sits.** Homepage section 3, the audience section, *General
contractors*, second tab: Plan.

**The business concept.** Plan is step two of the JiTpro method. Starting from
when the field needs each item, JiTpro pulls backward through every procurement
activity to establish the work, its sequence and realistic durations.

**The copy at the time of archiving.**

| Element | Copy |
| --- | --- |
| Headline | Build a procurement plan that supports your schedule. |
| Description | Starting with when each product, material, and service is required in the field, pull backward through every procurement activity. Establish the work, sequence, and realistic durations needed to deliver everything on time. |

**The intended experience.** One real procurement chain, *Custom Steel Windows
and Doors*, is built backward from its Required On Site date, one activity at a
time, beside a six-step list. The camera then shows the whole chain, and
finally the whole project's Procurement Schedule in the JiTpro application.

---

## B. Visual presentation

Captures are in `docs/design/archive/plan-original/` (Section G). Times are
milliseconds after the tab's *played* state turns true.

### The data (unchanged by any redesign)

- **Item:** Custom Steel Windows and Doors, Required On Site 1 September 2027,
  starting 4 June 2026. 312 working days.
- **Ten activities,** built backward in this order:

| Activity | Working days | Dates |
| --- | --- | --- |
| Shipping and Delivery | 8 | 23 Aug – 1 Sep 2027 |
| Fabrication | 180 | 3 Dec 2026 – 20 Aug 2027 |
| Third Submittal Review | 5 | 25 Nov – 2 Dec 2026 |
| Second Revision Cycle | 7 | 16 – 24 Nov 2026 |
| Second Submittal Review | 10 | 30 Oct – 13 Nov 2026 |
| First Revision Cycle | 12 | 14 – 29 Oct 2026 |
| First Submittal Review | 15 | 22 Sep – 13 Oct 2026 |
| Submittal Preparation | 30 | 10 Aug – 21 Sep 2026 |
| Submittal Coordination | 25 | 6 Jul – 7 Aug 2026 |
| Buyout | 20 | 4 Jun – 2 Jul 2026 |

- **Milestones:** Initial Submittal (21 Sep 2026), First Resubmittal (29 Oct),
  Second Resubmittal (24 Nov), Final Approval and Release for Fabrication
  (2 Dec 2026), Required On Site (1 Sep 2027).
- **The six-step list,** in backward-planning order, each total summed from the
  chain: Required On Site (milestone); Fabrication & Delivery, 188; Review &
  Approvals, 49; Submittal Preparation, 30; Submittal Coordination, 25;
  Buyout, 20.
- **The schedule:** fifteen rows in strict Required On Site order. The featured
  chain is eighth. The other fourteen come from the shared schedule fixture,
  each lengthened by its own factor for this illustration.

### The sequence (24.9 s)

| Stage | Time | What happens | Capture |
| --- | --- | --- | --- |
| 1. Required On Site alone | 500 – 1500 | The green milestone, its dashed rule and its label fade in on the calendar. The first list entry appears on the rail and is highlighted. | `01` |
| 2. The backward build | 1500 – 19600 | A planning edge travels right to left, revealing each activity from its right end; the camera follows. After each activity it rests 650 ms (900 ms at a milestone, 1200 ms after Fabrication). Each list entry appears as its part starts to build and carries the highlight while it does. | `02` – `07` |
| 3. The whole chain | 19600 – 22500 | The camera pulls back over 1400 ms to the whole chain and holds 1500 ms. A summary line appears: start date, total duration, Required On Site. | `08` |
| 4. The schedule | 22500 – 24900 | The camera pulls back over 2400 ms to the whole application screen. The other fourteen rows and the application fade in. The six-step list leaves the frame and comes to rest in two columns beneath the copy. | `09`, `10` |

**Fabrication.** Its move takes about 3.2 s, several times any other, and the
camera eases back to keep the long bar in frame, then in again. Its in-bar
label stays centred in the visible part of the bar.

**The calendar.** A two-tier timescale header pinned to the top of the chart:
months over weeks while building, years over months at the whole-chain hold.
Day lines, week lines and non-working shading fade with zoom. All of it is
placed through the same camera as the chain, so it cannot drift.

**The step list's three layouts.**
- *Aside* (used at desktop sizes with this copy): the list builds on a rail
  inside the frame, then travels out to the free area beneath the copy while
  the application window keeps the whole frame.
- *Side* (no free area): the list rests inside the frame in two columns beside
  a smaller application window.
- *Stacked* (frames under 460 px, phones): a band of two columns beneath the
  chain throughout.

**Final resting state.** The JiTpro Procurement Schedule: sidebar, *Oak Ridge
Residence*, the *Procurement Schedule* heading and toolbar, fifteen chains on a
monthly timeline, the featured row tinted, and the legend. The list rests
beneath the copy. It never loops.

---

## C. Scroll behavior

Identical to Identify's (see `Identify_Redesign_v2.md`, Section F). In brief:

- Scroll selects the tab; the animation plays on its own clock and is never
  scrubbed by scroll position.
- Plan owns scroll progress 0.75 to 1.75 of the pinned region (one step, 60% of
  the view height).
- *Played* = Plan is selected and the section has been seen. Entering the zone
  by scroll or by click plays the pass once; leaving resets it to its opening
  frame; returning replays it.
- **Reduced motion:** unpinned, and the resting view is shown at once
  (capture `11`).
- **Phone:** the stacked layout (captures `12`, `13`).

---

## D. Technical architecture

### Plan-only files

| File | Purpose |
| --- | --- |
| `src/components/home/planChainScene.test.ts` | About 90 tests of the scene: data, order, pacing, framing per frame size, the list's paths, the grid and the header. |

### Shared between Plan and Connect

**Connect draws Plan's scene and ends on Plan's resting view.** Almost nothing
in Plan is Plan-only.

| File | Purpose | Connect's use |
| --- | --- | --- |
| `src/components/home/planChainScene.ts` | Pure scene and state: the fifteen rows, the application screen's layout (`APP`), the build steps and their timing (`TIMING`), the step list and its three layouts (`listLayout`, `listItemAt`), the camera (`viewInArea`, `chainView`, `scheduleView`), the calendar grid and timescale header, and `planStateAt(scene, frame, t)`. | Imports the scene, items, camera helpers, grid, header and `PlanState`. `connectStateAt` returns the same state shape. |
| `src/components/home/PlanChainPreview.tsx` | The renderer for both tabs (`variant="plan"` or `"connect"`): the chain SVG, the other rows, the application chrome, the header, the grid, the step list, and the one `requestAnimationFrame` loop that applies the state. | The same component. |
| `src/components/home/connectChainScene.ts` (+ test) | Connect's own timeline over Plan's scene. | Connect only. |
| `src/components/home/AudienceSection.tsx` | Mounts both, measures the free area beneath each tab's copy (`spare`) and passes it to Plan as `aside`. | Mounts Connect with `categoriesRef`. |

### Shared with the wider demo system

| File | Purpose |
| --- | --- |
| `src/components/demo/screens/procurement-chain/chainScenario.ts` | **The authoritative chain:** `buildSteelWindowsChain` and its labels. |
| `src/components/demo/screens/procurement-chain/chainLayout.ts`, `chainVocabulary.ts`, `ChainText.tsx`, `useChainMeasure.ts`, `chainTokens.css` | The chain's layout engine, tokens, icons and type. |
| `src/components/demo/screens/procurement-schedule/scheduleFixture.ts`, `scheduleModel.ts`, `workCalendar.ts` | The other fourteen items, the scheduling engine and the working-day calendar. |
| `src/components/demo/screens/procurement-schedule/GanttParts.tsx`, `ScheduleScreenChrome.tsx`, `ganttTicks.ts`, `scheduleTokens.css` | The Schedule screen's header, toolbar, item column and legend. |
| `src/components/demo/shell/JiTproShell.tsx`, `src/components/demo/tokens.css` | The application shell and tokens, also used by Identify. |

### State management

- `played` is the only input. One clock: `planStateAt(scene, frame, t)` returns
  the camera, the planning edge, every opacity, the list's state, the grid and
  the header. The renderer applies it and computes nothing.
- Every view is computed from the frame's size, so a resize re-frames the same
  moment.

---

## E. Design decisions

Recorded in the Decision Log of `docs/design/JiTpro_Design_System_v1.0.md`
(entries of 2026-11-10) and specified in Section 54.4.2.

- **One real chain, never simplified.** Activities, durations and dates are
  read from the chain scenario; the six groups only summarize them.
- **Backward.** The plan is built from the field date toward the start.
- **Long work reads as long.** Step time is a base plus a share of the bar's
  length; Fabrication takes about 3.2 s.
- **A rest after each activity,** long enough to read its label.
- **A professional timescale,** pinned above the bars, as in scheduling tools.
- **One clock** (Section 46.3); no overshoot or bounce (Section 46.4).
- **The list rests outside the frame** where the copy leaves room, so the
  application keeps the whole frame.
- **Reduced motion** shows the resting view at once (Section 46.5).

---

## F. How to restore or reuse it

### 1. Locate and review

```
git fetch origin
git log -1 6567fb010c08762cedfae0f492de1dabf3db11c1
git show 6567fb0:src/components/home/planChainScene.ts
```

Run the archived site in a separate folder:

```
git worktree add ../JiTpro-Website-plan-original 6567fb0
cd ../JiTpro-Website-plan-original
npm ci
npm run dev
```

### 2. Restore the complete original Plan

Do this on a new branch, not on `main`.

Plan and Connect share their scene and renderer, so the original Plan cannot be
restored file by file without also affecting Connect. Choose one:

- **Restore both together** (simplest, if Connect has not changed since):

  ```
  git checkout 6567fb0 -- \
    src/components/home/planChainScene.ts \
    src/components/home/planChainScene.test.ts \
    src/components/home/PlanChainPreview.tsx \
    src/components/home/connectChainScene.ts \
    src/components/home/connectChainScene.test.ts
  ```

  Then re-apply by hand, from `git diff 6567fb0 -- <file>`, the Plan parts of
  `src/content/homeAudiences.ts` (the `gc-plan` entry) and of
  `src/components/home/AudienceSection.tsx` (the `gc-plan` mount and its
  `aside` prop).

- **Restore Plan's behaviour only:** compare `planChainScene.ts` and
  `PlanChainPreview.tsx` with the archive and re-apply the Plan-specific parts
  (the `TIMING` table, `planStateBase`, the list's `appearAt` rule and
  `listLayout`), leaving later Connect work in place.

Then run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and
check the section at 1280 × 800, 1440 × 900 and 1920 × 1080, including the
Connect tab.

> **Warning.** Do not check out the archived `AudienceSection.tsx`,
> `homeAudiences.ts` or anything under `src/components/demo/`. Those files also
> drive Identify, Connect and Control.

### 3. Reusable parts

- **The scene engine** (`buildPlanScene`): fifteen chains on one calendar axis,
  placed into an application screen.
- **The backward build** (`BuildStep`, the planning edge and `revealAt`).
- **The camera helpers** (`viewInArea`, `lerpView`, `lerpViewAnchored`,
  `chainView`, `scheduleView`).
- **The timescale header and calendar grid** (`buildTimescale`, `headerAt`,
  `calendarGrid`, `gridAt`).
- **The long-bar label** (`labelShiftsAt`).
- **The step list and its travelling layouts** (`listLayout`, `listItemAt`,
  `listCrossingFade`), including the move to the free area beneath the copy.

---

## G. Visual references

All in `docs/design/archive/plan-original/`. Captured 2026-11-11 from the local
development server in headless Chrome, with the working tree at the source
commit.

| File | Shows |
| --- | --- |
| `01-required-on-site-alone.png` | 1100 ms: the milestone alone |
| `02-shipping-and-delivery-built.png` | 2700 ms |
| `03-fabrication-building-camera-pulled-back.png` | 4400 ms |
| `04-fabrication-built.png` | 6800 ms: Fabrication complete, its release milestones |
| `05-review-and-revision-cycles.png` | 12300 ms |
| `06-submittal-preparation-built.png` | 16200 ms |
| `07-buyout-built-chain-complete.png` | 19400 ms |
| `08-whole-chain-held.png` | 21900 ms: the whole chain and its summary line |
| `09-pulling-back-list-leaving-frame.png` | 23600 ms |
| `10-final-procurement-schedule-list-beneath-copy.png` | 25600 ms: the final view |
| `11-reduced-motion-unpinned-resting-view.png` | Reduced motion at 1440 × 900 |
| `12-phone-390-building.png`, `13-phone-390-final.png` | 390 × 844, stacked |
| `plan-original-scroll-recording.mp4` | 33 s at 1440 × 900: scrolling in, the complete pass, then on to Connect |

Captures `01` to `10` and the recording are 1440 × 900, pinned.
