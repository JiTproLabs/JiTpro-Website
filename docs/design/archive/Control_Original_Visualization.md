# Archive: the original Control section

**Preserved:** 2026-11-11, ahead of the Control redesign.
**Archive branch:** `archive/identify-original-visualization` (the shared archive for the homepage visualizations)
**Recovery commit (the exact code this record describes):** `01207d04066049aa08a32f3aa24dea736730dd97`
**Source branch at the time:** `feature/102926_homepage_update`

## Status in one line

**Control has approved copy and a reserved placeholder. It has no
visualization, no animation and no data of its own.** Nothing has been built
for it beyond what every unspecified tab receives. This record documents that
state exactly, so the redesign starts from a known point.

Connect and Control are preserved together at the one recovery commit. See
`Connect_Original_Visualization.md` for the full list of archived versions.

> **Standing instruction.** The homepage scroll interaction (Section D) must
> not change without Jeff's explicit authorization.

---

## A. Purpose

**Where it sits.** Homepage section 3, the audience section, *General
contractors*, fourth and last tab: Identify, Plan, Connect, **Control**.

**Its role in the method.** Identify finds what must be procured. Plan builds
each chain backward from its field date. Connect ties in what each activity
needs from others. **Control** is where performance is watched against all of
that: what needs attention today, what is coming, and what can wait.

**What the copy says.**

| Element | Copy |
| --- | --- |
| Tab label | Control |
| Headline | Know what needs your attention today, and what's coming tomorrow. |
| Description | Track commitments, identify emerging risks, and distinguish what requires action today from what can wait. Stay ahead of problems before they disrupt field execution or erode margins. |

**What belongs to Control and nowhere earlier.** The other three tabs
deliberately show no status, lateness, variance, risk or recovery, and their
records say so. Those subjects are reserved for Control.

---

## B. Existing presentation

Captures are in `docs/design/archive/control-original/` (Section I).

**Copy panel (left).** The headline and one description paragraph. No second
paragraph, closing statement, link, checklist or summary.

**Visual column (right).** The standard **reserved placeholder** in the 16:10
frame (capture `02`):

- the frame's 1 px border and light fill;
- a small monospace label, *Reserved*, at the top left;
- one line at the bottom left: *The visualization for "Control" is in
  development. This area is intentionally reserved.*;
- a hairline along its top edge, because it is not the first panel in the
  track.

It contains no illustration, icon, sample data or software screen.

**Final state.** The placeholder is static. What is shown on arrival is the
final state.

---

## C. Animation behavior

**Control has no animation of its own.**

The only motion a visitor sees is the section's shared tab transition on
arrival (capture `01`):

- the outgoing copy fades out in 150 ms; Control's copy fades in over 200 ms
  with an 8 px rise;
- the visual track slides up one panel in 450 ms, so the placeholder rises
  into the frame.

Under reduced motion the change is instant (capture `04`).

---

## D. Scroll behavior

Shared with every tab (full description in `Identify_Redesign_v2.md`,
Section F).

- **Activation.** Control is selected when scroll progress passes 2.75 steps
  into the pinned region (±0.06 hysteresis), or when its tab is clicked. One
  step is 60% of the view height.
- **Its zone** is 2.75 to 3.5: three-quarters of a step, as the last tab.
- **Playback.** The section passes a *played* flag to visuals that have one.
  Control's placeholder takes no such flag, so nothing plays.
- **Transition to the next section.** At 3.5 steps the region ends and the
  sticky presentation releases: the page scrolls on to the next homepage
  section. Scrolling back up re-enters at Control.
- **Pinning** applies at 1024 px wide and up, without reduced motion, when the
  presentation fits below the navigation. It does at 1280 × 800, 1440 × 900 and
  1920 × 1080.

**Shared scroll logic that must not be modified during the redesign:**
`src/components/home/audienceScroll.ts`, `src/components/home/audienceSelection.ts`,
and the pinning, scroll-selection and transition code in
`src/components/home/AudienceSection.tsx`.

**A note for the redesign.** A Control visual with its own animation will need
the same `played` input the other three use (`owner selected && tab selected &&
seen`), which `AudienceSection.tsx` already computes for every tab. As the last
tab, Control's zone is shorter than Plan's or Connect's, and the section
releases at its end.

---

## E. Technical architecture

### Control-only files

**None.** There is no Control component, scene, data file, style or test.

### Control-specific parts of shared files

| File | The Control part |
| --- | --- |
| `src/content/homeAudiences.ts` | The `gc-control` entry: `id`, `label`, `headline`, `description`. Nothing else. |
| `src/components/home/AudienceSection.tsx` | No Control-specific code. `gc-control` falls through to the last line of the visual switch, `return <ReservedVisual key={tab.id} tab={tab} first={i === 0} />`, the same placeholder the architect and owner tabs use. `ReservedVisual` is defined at the foot of the file. |
| `src/content/homeAudiences.test.ts` | Control is covered only by the general tests: tab order (*Identify, Plan, Connect, Control*), unique ids, sentence case, no em dashes, non-empty headline and description. |

### Shared dependencies

| File | Purpose |
| --- | --- |
| `src/components/home/AudienceSection.tsx` | The section: state, pinning, scroll selection, the rail, copy and visual transitions |
| `src/components/home/audienceScroll.ts`, `audienceSelection.ts` (+ tests) | Scroll maths and the section's one state value |
| `src/index.css` | Design tokens |

### What exists elsewhere but is not part of Control

These are in the repository and concern Control's subject matter. **None is
mounted in, imported by, or specified for the Control tab.** They are listed so
the redesign can consider them; nothing here was completed or connected for
this archive.

| Item | What it is | Where it is used today |
| --- | --- | --- |
| `src/components/demo/screens/CommitmentRegisterScreen.tsx`, `src/components/demo/screens/CommitmentTable.tsx`, `src/components/demo/fixtures/commitmentRegister.ts` | A representative Commitment Register application screen, with On Track, At Risk and Overdue statuses | The demo registry and the development-only demo lab |
| `src/components/demo/screens/procurement-schedule/ProcurementScheduleScreen.tsx` and its parts | The full interactive Procurement Schedule screen, including package health and issues | `/procurement-schedule` and the demo lab |
| `src/components/demo/screens/procurement-schedule/scheduleModel.ts` | Types and derivations for commitment status, variance in working days, recorded issues, and package health (*healthy*, *at risk*, *impacted*) | The schedule screen. Plan and Connect strip these out before drawing. |
| `src/components/demo/screens/procurement-schedule/scheduleFixture.ts` | Fixture items, two of which carry authored risk scenarios (a missed commitment that was absorbed; one that was not) | The schedule screen. Plan lengthens these items and removes their commitments and issues. |
| `src/components/demo/screens/procurement-chain/chainScenario.ts` | `buildSteelWindowsChain`, the featured chain with its statuses, alongside `buildSteelWindowsPlannedChain`, which removes them for Connect | The chain figure and the demo lab |
| `src/components/demo/primitives/DemoStatusBadge.tsx` | Status badges including On Track, At Risk and Overdue | The demo screens |
| `src/components/ControlledProcurementSection.tsx` | A section from an earlier homepage | Unrendered; referenced only by a legacy page snapshot |

### What has not been developed

- A Control visualization of any kind.
- Any animation, scene, state function or timing for Control.
- Any Control-specific data: no late dates, variances, risks or recovery
  actions have been authored for the homepage's featured chain as Plan and
  Connect draw it.
- A Design System specification for the Control visual.
- Any Control-specific test.

---

## F. Data relationships

- **Control uses no data today.** The placeholder reads only the tab's label.
- **The data it would continue from** is the featured chain that Identify, Plan
  and Connect share: *Custom Steel Windows and Doors*, Required On Site
  1 September 2027, 312 working days from 4 June 2026, with three dependencies
  required by 6 July, 10 August and 14 October 2026 (see
  `Plan_Original_Visualization.md` and `Connect_Original_Visualization.md`).
- **That chain's status fields exist but are unused on the homepage.** The
  chain scenario carries a status and completion fields for each commitment;
  Connect draws the chain with them removed. Whether and how Control uses them
  is a decision for the redesign.
- **The project** is *Oak Ridge Residence* throughout.

---

## G. Design decisions

From `docs/design/JiTpro_Design_System_v1.0.md`.

| Decision | Section |
| --- | --- |
| The audience section and its tabs; general contractors have four: Identify, Plan, Connect, Control | 46.12, 54 |
| Control's headline and description (founder-supplied, 2026-11-09) | 54.2 |
| "Margin" is permitted in the Control description, attached to no promise or figure | 54.3 |
| Until a tab's visual is specified and approved, it keeps the reserved placeholder: no illustration, icon, sample data or ornament | 46.8.1, 46.12 |
| Control keeps the reserved placeholder (stated in the Plan and Connect specifications) | 54.4.2, 54.4.3 |
| No visual may be built before the Design System specifies what it shows, its motion and its provenance, and the decision is logged | 46.12, 54.4, 49 |
| Late dates, missed commitments, variance and recovery belong to Control, not to the earlier tabs | 54.4.1, 54.4.3 |

There is no Section 54.4.4. The Control visual has no specification.

---

## H. Recovery instructions

### 1. Locate and review

```
git fetch origin
git log -1 01207d04066049aa08a32f3aa24dea736730dd97
git show 01207d0:src/content/homeAudiences.ts
git show 01207d0:src/components/home/AudienceSection.tsx
```

Run the archived site in a separate folder:

```
git worktree add ../JiTpro-Website-control-original 01207d0
cd ../JiTpro-Website-control-original
npm ci
npm run dev
```

### 2. Restore Control to its original state

There are no Control files to check out. Restoring the original means two
small manual edits on a new branch:

1. **The copy.** In `src/content/homeAudiences.ts`, set the `gc-control` entry
   back to the headline and description in Section A, and remove any fields
   added to it since.
2. **The visual.** In `src/components/home/AudienceSection.tsx`, remove any
   `if (tab.id === 'gc-control')` branch added to the visual switch, so the tab
   falls through to `ReservedVisual` again.

Then delete any Control-only files the redesign added, and run
`npm run typecheck`, `npm run lint`, `npm test` and `npm run build`.

> **Warning.** Do not check out the archived `AudienceSection.tsx` or
> `homeAudiences.ts` as whole files. Both also carry Identify, Plan and
> Connect, and the archived versions would overwrite any later work on them.

### 3. Reusable parts

- **`ReservedVisual`:** the approved placeholder, for any tab whose visual is
  not yet specified.
- **The existing demo screens and status vocabulary** listed in Section E, as
  candidate material for a Control visual. They are unchanged by this archive
  and remain in the current codebase.

---

## I. Visual references

All in `docs/design/archive/control-original/`. Captured 2026-11-11 from the
local development server in headless Chrome, with the working tree at the
recovery commit.

| File | Shows |
| --- | --- |
| `01-transition-from-connect-300ms.png` | 300 ms after arriving from Connect: the placeholder rising into the frame |
| `02-control-reserved-placeholder-1440x900.png` | The section at rest, 1440 × 900, pinned |
| `03-control-reserved-placeholder-1280x800.png` | The same at 1280 × 800, pinned |
| `04-control-reduced-motion-unpinned.png` | Reduced motion at 1440 × 900, unpinned |
| `05-control-phone-390-visual.png` | 390 × 844: the placeholder in the stacked layout |

No recording was made of Control alone, because it has no animation. Its
arrival from Connect is the last few seconds of
`docs/design/archive/connect-original/connect-original-scroll-recording.mp4`.
