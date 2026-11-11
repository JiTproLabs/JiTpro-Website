# Archive: the original Connect visualization

**Preserved:** 2026-11-11, ahead of the Connect redesign.
**Archive branch:** `archive/identify-original-visualization` (the shared archive for the homepage visualizations)
**Recovery commit (the exact code this record describes):** `01207d04066049aa08a32f3aa24dea736730dd97`
**Source branch at the time:** `feature/102926_homepage_update`

This file records what the original Connect visualization is, how it works,
which files build it, what it shares with Plan, and how to restore or reuse it.

The recovery commit is a complete, working snapshot of the repository. Connect
and Control are preserved together at this one commit. It also holds Identify
v2 and the redesigned Plan.

## What the shared archive holds

| Version | Recovery commit | Record |
| --- | --- | --- |
| Identify v1 (register tour) | `e4e3a03dbcdf350ca656d6711642088b89b1ffc0` | `Identify_Original_Visualization.md` |
| Identify v2 (four-stage story) | `d40734896246c662d04184d7a22ccdd6e732507c` | `Identify_Redesign_v2.md` |
| Plan original | `6567fb010c08762cedfae0f492de1dabf3db11c1` | `Plan_Original_Visualization.md` |
| **Connect original** | `01207d04066049aa08a32f3aa24dea736730dd97` | this file |
| Control original (placeholder) | `01207d04066049aa08a32f3aa24dea736730dd97` | `Control_Original_Visualization.md` |

> **Standing instruction.** The homepage scroll interaction (Section D) must
> not change without Jeff's explicit authorization.

---

## A. Purpose

**Where it sits.** Homepage section 3, the audience section, *General
contractors*, third tab of four: Identify, Plan, **Connect**, Control.

**Its role in the method.**
- *Identify* finds what the project must procure.
- *Plan* builds each item's procurement chain backward from its Required On
  Site date.
- **Connect** shows what that plan needs from other people: the decisions,
  information and approvals each activity depends on, who owes each one, when
  it is required, and which activity it is required for.
- *Control* watches performance against all of this.

**The line between Connect and Control.** Connect establishes requirements,
responsibilities and required-by dates. It shows nothing about performance: no
status, no lateness, no variance, no recovery. Those belong to Control. The
chain Connect draws is built with every status removed for exactly this reason.

**The copy.**

| Element | Copy |
| --- | --- |
| Headline | Make sure every procurement activity has what it needs to move forward, without interruption. |
| Description | Identify the decisions, information, approvals, and other requirements that each activity depends on. Connect them to the procurement schedule, establish responsibility, and make clear when each is needed. |
| Dependency summary | Design & Engineering · Owner Decisions & Selections · External Inputs & Commitments · Scope & Trade Commitments · Permits & Agency Requirements · Field & Installation Requirements |

The six categories are the kinds of requirement JiTpro identifies across a
project. They are not the three dependencies the animation shows. There is
deliberately no *Reviews & Approvals* category: reviews and approvals are
scheduled activities, which belong to Plan.

---

## B. Existing presentation

Captures are in `docs/design/archive/connect-original/` (Section I).

**The scene is Plan's scene.** Connect draws the same fifteen-row Procurement
Schedule, the same application screen, the same timescale header and calendar
grid, and the same featured chain, *Custom Steel Windows and Doors*, in the
same place. It has no step list, so the chain's area is the whole frame.

**The three dependencies,** in date order. Each is drawn as a diamond on the
chain at its required-by date, a connector, and a card above the bar.

| # | Dependency | Type shown | Owed by | Required by | Required for |
| --- | --- | --- | --- | --- | --- |
| 1 | Final Window & Door Design | Design Commitment | Architect | July 6, 2026 | Submittal Coordination |
| 2 | Frame Finish & Color Selection | Owner Selection | Owner | August 10, 2026 | Submittal Preparation |
| 3 | Final Glazing Specification | Design Commitment | Architect | October 14, 2026 | First Revision Cycle |

**Each card reads,** on four lines: the type; the name; *Required by* and the
date; the owner and the activity it is for (for example *Owner · for Submittal
Preparation*).

**The copy panel** carries the six-category dependency summary beneath the
description, in two columns of three, each an icon beside its label.

**Final resting state** (`10`). The whole JiTpro Procurement Schedule
application, exactly as Plan ends: sidebar, *Oak Ridge Residence*, the
*Procurement Schedule* heading and toolbar, fifteen chains, the featured row
tinted, the legend. The three cards are gone. The six-category summary is shown
beneath the copy. It never loops.

---

## C. Animation behavior

One clock, milliseconds after the tab's *played* state turns true. Total
**25.25 s**. Constants are `CONNECT_TIMING` in `connectChainScene.ts`.

| Stage | Time | What happens | Capture |
| --- | --- | --- | --- |
| 1. The schedule | 0 – 800 | Plan's resting view, the whole application | `01` |
| 2. Into the chain | 800 – 3200 | The camera zooms to the start of the featured chain over 2.4 s. The other rows and the application fade out; the timescale header and grid fade in. | `02` |
| 3a. Buyout | 3200 – 4200 | Rest on the chain's start | `03` |
| 3b. First dependency | 4200 – 8850 | Travel 1.2 s to *Final Window & Door Design*; reveal; hold | `04` |
| 3c. Second dependency | 8850 – 13500 | Travel 1.2 s to *Frame Finish & Color Selection*; reveal; hold | `05` |
| 3d. Third dependency | 13500 – 18370 | Travel 1.4 s to *Final Glazing Specification*; reveal; hold | `06` |
| 3e. To Required On Site | 18370 – 22850 | Travel 3.3 s forward through Fabrication to the field date, easing the camera back to keep the long bar in frame; hold 1.2 s | `07`, `08` |
| 4. The schedule again | 22850 – 25250 | The camera returns to the whole application over 2.4 s. The cards fade first; the other rows and application fade back in. Over the last 650 ms the six-category summary beneath the copy is revealed. | `09`, `10` |

**A dependency's reveal,** from the camera's arrival:

| Element | Starts | Lasts |
| --- | --- | --- |
| Diamond on the chain | 0 ms | 350 ms, scaling from 40% |
| Connector | 200 ms | 500 ms, drawn from the diamond |
| Card | 550 ms | 500 ms, fading in with an 8 px rise |
| Held to read | 1050 ms | 2400 ms |

**Camera.**
- The build scale is Plan's: about 700 canvas px across the frame.
- The chain's start is held at 4% across the frame, each dependency at 40%,
  the field date at 95%.
- A move's time is 900 ms plus 1 ms per canvas px, between 1.2 and 4 s.
- On the zoom in and out, one point of the chain travels in a straight line on
  screen, so the chain moves evenly through the large change of scale.
- Everything is eased with no overshoot.

**The summary's reveal.** Each category fades in over 300 ms with a 6 px rise,
70 ms apart in reading order, the last finishing exactly as the camera comes to
rest. The list is in the copy panel; only its reveal is driven by the visual.

**Reduced motion:** no animation. The resting view is shown at once, with the
summary visible (`11`).

---

## D. Scroll behavior

Shared with every tab, and identical to Identify's and Plan's (full description
in `Identify_Redesign_v2.md`, Section F).

- **Activation.** *Played* = Connect is the selected tab and the section has
  been seen (35% of the sticky presentation in view, latched).
- **Pinning.** The section is a tall scroll region holding a `position: sticky`
  presentation 81 px from the top. One *step* of scroll is 60% of the view
  height. Connect owns progress 1.75 to 2.75.
- **Playback.** Scroll selects the tab; the animation then runs on its own
  clock and is never scrubbed. It plays once per entry, by scroll or by click.
  Leaving resets it to its opening frame; returning replays it.
- **Transition to Control.** Crossing progress 2.75 (±0.06 hysteresis) selects
  Control: copy cross-fades (150 ms out, 200 ms in with an 8 px rise) and the
  visual track slides up one panel in 450 ms.
- **Transition from Plan.** Connect opens on Plan's resting view, so a visitor
  who watched Plan finish sees the same screen, then the camera moves in.
- **When it pins:** at least 1024 px wide, reduced motion not requested, and
  the presentation fits below the navigation. Measured: 713 px in 719 at
  1280 × 800; 716 px at 1440 × 900 and 1920 × 1080.

**Shared scroll logic that must not be modified during the redesign:**
`src/components/home/audienceScroll.ts`, `src/components/home/audienceSelection.ts`,
and the pinning, scroll-selection and transition code in
`src/components/home/AudienceSection.tsx`.

**Connect drives the section's height.** Its copy panel is the tallest (391 px
at 1440 wide, 420 px at 1280), so it sets the stage height for every tab. On
desktop views at most 864 px tall the summary is set smaller and the section's
vertical padding is 48 px, to keep the section pinned at 1280 × 800.

---

## E. Technical architecture

### Connect-only files

| File | Purpose |
| --- | --- |
| `src/components/home/connectChainScene.ts` | Pure scene and state. Builds the chain with its commitments, the stations and moves, every time (`CONNECT_TIMING`), and `connectStateAt(scene, connect, frame, t)`, which returns Plan's state shape plus the cards' and categories' reveals. |
| `src/components/home/connectChainScene.test.ts` | 18 tests: the three dependencies and their dates, order, pacing, framing, the summary's reveal. |

### Connect-specific parts of shared files

| File | The Connect part | Also serves |
| --- | --- | --- |
| `src/components/home/PlanChainPreview.tsx` | `variant="connect"`: the commitment diamonds, connectors and cards (`commitRefs`), the `categoriesRef` reveal, and the branches that omit the step list | Plan |
| `src/components/home/AudienceSection.tsx` | The `gc-connect` mount, `categoriesRef`, `DependencySummary`, `CATEGORY_ICON`, and the short-desktop spacing rules | Every tab |
| `src/content/homeAudiences.ts` | The `gc-connect` entry, `CONNECT_DEPENDENCY_CATEGORIES`, the `dependencyCategories` field | Every tab's copy |
| `src/content/homeAudiences.test.ts` | The Connect copy and category tests | All copy tests |

### Shared dependencies

| File | Purpose |
| --- | --- |
| `src/components/home/planChainScene.ts` | **Plan's scene, which Connect draws.** Connect imports the items, the scene type, the camera helpers (`viewInArea`, `lerpView`, `scheduleView`, `toScreen`, `buildScale`), the grid and header (`gridAt`, `headerAt`), `labelShiftsAt`, `listLayout` and the `PlanState` type. |
| `src/components/demo/screens/procurement-chain/chainScenario.ts` | **The authoritative chain and its commitments.** `buildSteelWindowsPlannedChain` returns the chain with its three commitments and no status. |
| `src/components/demo/screens/procurement-chain/chainLayout.ts`, `chainVocabulary.ts`, `ChainText.tsx`, `useChainMeasure.ts`, `chainTokens.css` | The chain's layout engine (which places the cards), tokens, icons and type |
| `src/components/demo/screens/procurement-schedule/scheduleModel.ts`, `scheduleFixture.ts`, `workCalendar.ts` | The scheduling engine that derives each required-by date, the other fourteen items, and the working-day calendar |
| `src/components/demo/screens/procurement-schedule/GanttParts.tsx`, `ScheduleScreenChrome.tsx`, `ganttTicks.ts`, `scheduleTokens.css` | The Schedule screen's chrome |
| `src/components/demo/shell/JiTproShell.tsx`, `src/components/demo/tokens.css` | The application shell and tokens |

### State management

- `played` is the only input. One clock; `connectStateAt` returns everything
  that moves; the renderer applies it and computes nothing.
- The renderer is Plan's. It treats Connect as a second timeline over the same
  scene.

---

## F. Data relationships

- **One chain.** Connect's chain is Plan's chain: `buildSteelWindowsPlannedChain`
  anchored on `PLAN_FOCAL_REQUIRED_ON_SITE`, **1 September 2027**. Same
  activities, durations, dates and milestones; 312 working days from
  4 June 2026.
- **Dates are derived, not authored.** Each dependency's required-by date is
  the start of the activity it is required for, computed by the scheduling
  engine from the chain. Moving the anchor moves all three.

| Dependency | Required for | That activity starts | Required by |
| --- | --- | --- | --- |
| Final Window & Door Design | Submittal Coordination | 6 Jul 2026 | 6 Jul 2026 |
| Frame Finish & Color Selection | Submittal Preparation | 10 Aug 2026 | 10 Aug 2026 |
| Final Glazing Specification | First Revision Cycle | 14 Oct 2026 | 14 Oct 2026 |

- **These current, Plan-derived dates are the authoritative ones.** Earlier
  versions of the chain used a 30 November 2027 anchor and different dates;
  those are historical and must not be reintroduced.
- **People and organizations** come from `src/components/demo/fixtures/project.ts`:
  Jane Smith, Lead Architect, Sierra Ridge Architects; Elizabeth Morgan, Owner.
  The cards show the role only.
- **Placement.** The chain's bar sits exactly where Plan's does, so the two
  tabs' schedules coincide.
- **Not shown.** The chain's data carries status and completion fields; Connect
  draws none of them.
- **The project** is the same one Identify's register shows: *Oak Ridge
  Residence*, with *Heritage Steel Windows* as its selected product.

---

## G. Design decisions

Recorded in the Decision Log of `docs/design/JiTpro_Design_System_v1.0.md` and
specified in Sections 54.2.2 and 54.4.3.

| Date | Decision | Section |
| --- | --- | --- |
| 2026-11-10 | Connect starts and ends on Plan's resting view and reveals the plan's dependencies forward through Plan's chain. *Final Glazing Selection* renamed *Final Glazing Specification*. | 54.4.3 |
| 2026-11-11 | New headline and description; the six-category dependency summary beneath the copy, revealed as the animation comes to rest | 54.2, 54.2.2 |
| 2026-11-11 | Short-desktop spacing so the section stays pinned at 1280 × 800 | 54.2.2 |

Principles:

- **One schedule.** Connect continues Plan; it never redraws it (54.4.3).
- **Forward.** Plan builds backward; Connect reads forward in date order.
- **What, who, when, for what.** And nothing about performance.
- **One clock** (46.3); no overshoot (46.4); reduced motion shows the resting
  view at once (46.5).
- **The summary is copy, not illustration:** it stays in the document and is
  exposed to assistive technology; only its reveal is animated (54.2.2).
- **No amber on the light surface** (8.8).

---

## H. Recovery instructions

### 1. Locate and review

```
git fetch origin
git log -1 01207d04066049aa08a32f3aa24dea736730dd97
git show 01207d0:src/components/home/connectChainScene.ts
```

Run the archived site in a separate folder:

```
git worktree add ../JiTpro-Website-connect-original 01207d0
cd ../JiTpro-Website-connect-original
npm ci
npm run dev
```

Remove it afterwards with `git worktree remove ../JiTpro-Website-connect-original`.

### 2. Restore the complete original Connect

Do this on a new branch, not on `main`.

**Step 1. Restore the Connect-only files.** Safe if Plan's scene still exports
what they import.

```
git checkout 01207d0 -- \
  src/components/home/connectChainScene.ts \
  src/components/home/connectChainScene.test.ts
```

**Step 2. Re-apply the Connect parts of shared files by hand.** Compare each
with `git diff 01207d0 -- <file>` and copy across only the parts listed in
Section E:

- `src/components/home/PlanChainPreview.tsx`: the `variant="connect"`
  branches, `commitRefs` and the `categoriesRef` reveal;
- `src/components/home/AudienceSection.tsx`: the `gc-connect` mount,
  `categoriesRef`, `DependencySummary`, `CATEGORY_ICON`;
- `src/content/homeAudiences.ts`: the `gc-connect` entry and
  `CONNECT_DEPENDENCY_CATEGORIES`.

**Step 3. Verify.** `npm run typecheck`, `npm run lint`, `npm test`,
`npm run build`, then check Plan and Connect at 1280 × 800, 1440 × 900 and
1920 × 1080.

> **Warning.** Do not check out the archived `PlanChainPreview.tsx`,
> `planChainScene.ts`, `AudienceSection.tsx`, `homeAudiences.ts` or anything
> under `src/components/demo/`. Those files also drive Identify, Plan and
> Control. Checking out the old version would silently discard later work on
> those tabs. If Plan's scene has changed its exports since, restore Connect by
> adapting it to the new scene rather than by rolling the scene back.

### 3. Reusable parts

- **Stations and moves** (`buildConnectScene`): a camera path through points of
  interest, each with an arrival, a staged reveal and a hold.
- **The staged reveal** of diamond, connector and card.
- **`lerpViewAnchored2`:** a zoom in which one canvas point travels in a
  straight line on screen.
- **The commitment cards,** placed by the chain's own layout engine.
- **A copy element revealed from the visual's clock** (`categoriesRef`).
- **The six-category summary** (`DependencySummary`).

---

## I. Visual references

All in `docs/design/archive/connect-original/`. Captured 2026-11-11 from the
local development server in headless Chrome, with the working tree at the
recovery commit.

| File | Shows |
| --- | --- |
| `01-initial-procurement-schedule.png` | 500 ms: the initial Procurement Schedule |
| `02-zooming-into-the-featured-chain.png` | 2100 ms: the zoom into the featured chain |
| `03-chain-start-buyout.png` | 3800 ms: resting on Buyout |
| `04-first-dependency-final-window-and-door-design.png` | 6900 ms: the first dependency |
| `05-second-dependency-frame-finish-and-color-selection.png` | 11600 ms: the second dependency |
| `06-third-dependency-final-glazing-specification.png` | 16500 ms: the third dependency |
| `07-travelling-forward-through-fabrication.png` | 20000 ms |
| `08-required-on-site-all-dependencies-placed.png` | 22300 ms: the completed presentation at the field date |
| `09-returning-to-the-schedule.png` | 24000 ms |
| `10-final-resting-state-with-dependency-summary.png` | 26000 ms: the final resting state |
| `11-reduced-motion-unpinned-resting-view.png` | Reduced motion at 1440 × 900 |
| `12-phone-390-second-dependency.png`, `13-phone-390-final.png` | 390 × 844 |
| `connect-original-scroll-recording.mp4` | 36 s at 1440 × 900: arriving on Plan, scrolling into Connect, the complete Connect pass, then on to Control |

Captures `01` to `10` and the recording are 1440 × 900, pinned. In the
recording Plan has only just begun when the scroll moves on, so the transition
shown is from Plan's opening, not from Plan's resting view.
