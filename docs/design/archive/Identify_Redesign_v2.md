# Archive: the Identify redesign (v2)

**Preserved:** 2026-11-11, approved, ahead of the Plan redesign.
**Archive branch:** `archive/identify-original-visualization` (the same branch that holds v1)
**v2 source commit (the exact approved code):** `d40734896246c662d04184d7a22ccdd6e732507c`
**Source branch:** `feature/102926_homepage_update`

This file records what the redesigned Identify visualization is, how it works,
which files build it, what it shares with the rest of the homepage, and how to
restore or reuse it.

## The two archived versions

| | Identify v1 | Identify v2 |
| --- | --- | --- |
| What it is | The original: a six-stop camera tour of the Procurement Register | The redesign: a four-stage story ending on the complete register |
| Source commit | `e4e3a03dbcdf350ca656d6711642088b89b1ffc0` | `d40734896246c662d04184d7a22ccdd6e732507c` |
| Record | `docs/design/archive/Identify_Original_Visualization.md` | this file |
| Media | `docs/design/archive/identify-original/` | `docs/design/archive/identify-redesign-v2/` |
| Length | 9.4 s | 13.0 s |

Both commits are complete, working snapshots of the whole repository. Both are
ancestors of the archive branch's tip, so either can be checked out, run or
read from at any time.

> **Standing instruction.** The homepage scroll interaction described in
> Section F must not change without Jeff's explicit authorization. It is
> identical in v1 and v2.

---

## A. Purpose and design philosophy

**Where it sits.** Homepage section 3, the audience section ("What JiTpro means
for:"). With *General contractors* selected, the default, the section has four
tabs: Identify, Plan, Connect and Control. Identify is the first.

**Why it was redesigned.** v1 demonstrated a sophisticated register. A visitor
could leave thinking "that is a very sophisticated database". The intended
conclusion is different: *JiTpro can help us find everything our project needs
and see what's missing before it becomes a problem.*

**Tesler's Law, the law of conservation of complexity.** Construction
procurement contains complexity that cannot be removed. Someone has to hold it.
JiTpro does not eliminate it; JiTpro organizes and manages it, so the general
contractor does not have to rebuild the picture from disconnected documents.

The visual shows that as one transformation:

**Scattered project information → identified requirements → visible scope gaps → an organized procurement inventory.**

- The opening shows the complexity as the contractor receives it: four separate
  sources.
- Nothing is thrown away. The same documents stay in view while their contents
  become one list.
- The list then shows which requirements are incomplete. *Identifying an item
  is not the same as establishing that its scope is complete.*
- The complexity is still there at the end, but JiTpro is holding it, in the
  real Procurement Register.

**What it deliberately does not claim.**
- It illustrates the JiTpro method. Nothing depicts document scanning, AI
  extraction or automatic validation.
- The conditions shown are representative, not findings from a real project.
- No late dates, missed commitments, schedule variance or recovery. Those
  belong to Plan, Connect and Control.

---

## B. Approved homepage copy

Used exactly as supplied (2026-11-11). Source: the `gc-identify` entry in
`src/content/homeAudiences.ts`.

| Element | Copy |
| --- | --- |
| Section label (tab) | Identify |
| Headline | You can't manage what you haven't identified. |
| Supporting copy, paragraph 1 | Every construction project contains hundreds of products, materials, and services scattered across drawings, specifications, and schedules. |
| Supporting copy, paragraph 2 | JiTpro brings these requirements together into a comprehensive procurement inventory, identifies missing or undefined scope, and helps establish what the project actually needs. |
| Closing statement | Know what you need. Know what's missing. |

- The copy is plain and static. Nothing in the copy panel animates.
- The closing statement is the heading face, semibold, in the strongest ink.
- **Withdrawn from v1:** the role link (*Explore JiTpro for general
  contractors*) and the three-line method checklist. `AudienceSection.tsx`
  still supports both for any tab; no tab uses them.
- The Identify copy panel is shorter than the tallest panel (Connect), so the
  section's height is the same as before.

---

## C. Animation storyboard

All times are milliseconds after the tab's *played* state turns true
(Section F). Captures are in `docs/design/archive/identify-redesign-v2/`
(Section H).

### Stage 1. Scattered project information (0 – 1600)

Four documents, each turned a degree or two, each with a caption. Nothing
moves. Capture `01`.

| Document | Drawn as | Caption |
| --- | --- | --- |
| Architectural | An elevation sheet with a title block, sheet A5.11 | Architectural drawings |
| Specifications | Two project-manual pages: Section 08 51 23 Steel Windows, Section 04 43 13 Stone Masonry Veneer | Specifications |
| Schedule | A bar-chart schedule with a month header | Construction schedule |
| Consultant | A mechanical floor plan with a duct run, sheet M1.02 | Consultant drawings |

This is also the parked state: what the frame shows before the section has
been seen, and whenever the tab is not selected.

### Stage 2. Identification of procurement requirements (1600 – 4800)

- **1600 – 2400.** The documents square up, shrink to half size and move to a
  column at the left, in one move. Their captions fade out. Capture `02`.
- **2000 – 2400.** A panel headed *Procurement inventory*, with *Oak Ridge
  Residence* at its right, fades in beside them.
- **2400 – 4500.** Six requirements appear one at a time, 350 ms apart, each
  fading in over 350 ms with a 4 px rise. Each shows its name and the document
  reference it was identified from. Captures `03`, `04`.

| # | Requirement | Reference |
| --- | --- | --- |
| 1 | Windows & Doors | A5.11 |
| 2 | Exterior Cladding | A4.20 |
| 3 | HVAC Equipment | M1.02 |
| 4 | Roofing | R1.01 |
| 5 | Lighting | E3.01 |
| 6 | Plumbing Fixtures | Spec 22 40 00 |

### Stage 3. Exposure of missing or undefined scope (4800 – 8200)

- **4800.** The three defined requirements are checked together, and a key to
  the three conditions appears at the foot of the panel.
- **5300, 5900, 6500.** Each requirement needing attention is marked in turn:
  its mark, a short note and a row tint, over 350 ms. Capture `05`.
- **6850 – 8200.** Everything is held so the last note can be read. Capture `06`.

| Condition | Mark | Requirements |
| --- | --- | --- |
| Defined | Green check | Windows & Doors, HVAC Equipment, Roofing |
| Missing information | Amber dot, amber note, amber row tint | Exterior Cladding: *Incomplete specification*. Plumbing Fixtures: *Undefined product selection* |
| Unresolved scope | Ringed question mark, dark note, neutral row tint | Lighting: *Unassigned scope responsibility* |

The marks are the register's own status vocabulary (the check of *Approved*,
the dot of *Pending*, the question mark of *TBD*), so the register that follows
reads in the same language.

### Stage 4. Procurement Register reveal (8200 – 13000)

| Time | What happens | Capture |
| --- | --- | --- |
| 8200 – 8800 | The story cross-fades into the real Procurement Register | `07` |
| 8800 – 9500 | The register holds on its heading, *Oak Ridge Residence* and the summary cards | `08` |
| 9500 – 10600 | One vertical pan down to the table header and first rows | |
| 10600 – 11300 | The rows are held close up: Product ID through Status | `09` |
| 11300 – 13000 | **The final zoom-out.** The camera pulls back once to the complete application | `10` |
| 13000 onward | **Rest.** The whole JiTpro Procurement Register | `11` |

**Final resting state.** The complete application at full frame width, from its
top: the JiTpro sidebar and navigation, the project selector, the heading
*Procurement Register*, five summary cards, search and filters, the product
table and the Product Detail panel. *Heritage Steel Windows* is the highlighted
first row and the detail panel describes it, so the Windows & Doors item that
Plan and Connect follow stays identifiable. It never loops.

The register screen is 4:3 and the frame is 16:10, so the lowest strip of the
screen (the eighth row and the pager) is below the frame. Plan's final view is
framed the same way.

---

## D. Technical architecture

### Identify-only files

Used by nothing else. They can be replaced without touching another tab.

| File | Purpose |
| --- | --- |
| `src/components/home/IdentifyRegisterPreview.tsx` | The visual. Two layers in the frame: the story (one SVG on a 480 × 300 canvas, scaled as a unit) over the register (the canonical screen on its 1448 × 1086 canvas). Draws the four documents, the inventory and the marks. Runs one `requestAnimationFrame` loop and applies the state each frame. Handles reduced motion and resize. |
| `src/components/home/identifyStoryScene.ts` | Content, timing and state, with no DOM dependency: the documents and their positions, the six requirements and conditions, every timing constant (`IDENTIFY_TIMING`), and `identifyStateAt(t)`, the one function that maps time to everything that moves. |
| `src/components/home/identifyStoryScene.test.ts` | 20 tests: content rules, layout bounds, stage order, reading time, monotonic motion, the pull-back's easing, total length. |
| `src/components/home/identifyRegisterCamera.ts` | The register's three views (`inventory`, `items`, `overview`), the cover clamp, and `cameraAt(frame, pan, out)`. No clock of its own. |
| `src/components/home/identifyRegisterCamera.test.ts` | Tests per frame size: the canvas always covers the frame; the pan is vertical at one scale; the end is the whole application. |
| `src/components/home/identifyRegisterPreviewData.ts` (+ test) | Supplies `PREVIEW_TITLE` (*Procurement Register*). Its other exports are unused leftovers from an early v1 draft. |

### Identify-specific parts of shared files

| File | The Identify part | Also serves |
| --- | --- | --- |
| `src/content/homeAudiences.ts` | The `gc-identify` entry; the optional `descriptionMore` and `closing` fields on `AudienceTab` | Every audience and tab's copy |
| `src/content/homeAudiences.test.ts` | The two Identify copy tests | All copy tests |
| `src/components/home/AudienceSection.tsx` | The `IdentifyRegisterPreview` mount; the two blocks that render `descriptionMore` and `closing` | The whole section: state, pinning, scroll selection, rail, transitions, and the Plan and Connect mounts |
| `src/components/demo/screens/ProductRegisterScreen.tsx` | The optional `title` prop (unchanged since v1) | The demo lab and the demo registry |

### Shared dependencies (do not modify for Identify alone)

| File | Purpose | Also used by |
| --- | --- | --- |
| `src/components/home/audienceScroll.ts`, `audienceSelection.ts` (+ tests) | Scroll maths and the section's one state value | All tabs, all audiences |
| `src/components/demo/screens/ProductTable.tsx` | The register's table | Only the register screen |
| `src/components/demo/fixtures/productRegister.ts`, `project.ts` | Register rows and project name. The story reads its project name and four document references from these. | The archived four-step register figure |
| `src/components/demo/shell/JiTproShell.tsx` | The application shell | **Plan and Connect**, other demo screens |
| `src/components/demo/tokens.css` | The `--jpd-*` application tokens, used by the inventory and its marks | **Plan and Connect**, every demo screen |
| `src/components/demo/primitives/DemoStatusBadge.tsx` | The register's status badges | Other demo screens |
| `src/components/demo/screens/procurement-schedule/scheduleFixture.ts`, `scheduleModel.ts`, `workCalendar.ts` | Schedule data the register fixture derives from | **Plan and Connect** |
| `src/index.css` | Design tokens and fonts | The whole site |

### State management

- **Section state:** `{ audienceId, tabIndex }` in `AudienceSection`, plus the
  latched flag `seen`.
- **`played`** = this tab is selected, its audience is selected, and `seen`. It
  is the visual's only input.
- **One clock.** On `played`, a layout effect records the start time and each
  animation frame calls `identifyStateAt(now - start)`, then writes transforms
  and opacities directly to the DOM. There is no React state inside the visual.
- **Styles and assets.** Tailwind utilities, `--jp-*` tokens for the documents,
  `--jpd-*` tokens for the inventory and register. No images, no video, no
  animation library.

### What changed from v1

| | v1 | v2 |
| --- | --- | --- |
| Driver | Web Animations keyframes on the canvas | One `requestAnimationFrame` loop and a pure state function, as Plan and Connect use |
| Camera | Six stops with zooms, 2400 ms hold for the checklist | Three views, two moves: a pan and one pull-back |
| Layers | Register only | Story layer over the register |
| Copy | Headline, role link, description, animated checklist | Headline, two paragraphs, closing statement, all static |
| Kept | The canonical register screen, transform-only camera, cover clamp, the overview framing, the `played` trigger, the reduced-motion rule | |

---

## E. Animation timing

All values are from `IDENTIFY_TIMING` in `identifyStoryScene.ts`, in
milliseconds after `played`.

| Constant | Value | Meaning |
| --- | --- | --- |
| `GATHER_AT` / `GATHER` | 1600 / 800 | Documents begin to gather; duration |
| `PANEL_AT` / `PANEL` | 2000 / 400 | Inventory panel fade |
| `ROW_AT` / `ROW_STAGGER` / `ROW` | 2400 / 350 / 350 | First row; spacing; each row's fade |
| `ROW_RISE` | 4 | Row rise, px on the story canvas |
| `DEFINED_AT` | 4800 | Defined checks and the key |
| `GAP_AT` / `GAP_STAGGER` / `MARK` | 5300 / 600 / 350 | First gap; spacing; each mark's fade |
| `REGISTER_AT` / `CROSSFADE` | 8200 / 600 | Story to register |
| `PAN_AT` / `PAN` | 9500 / 1100 | Heading to rows |
| `OUT_AT` / `OUT` | 11300 / 1700 | Rows to the whole application |
| `IDENTIFY_DURATION_MS` | 13000 | The whole pass |

**Easing.**
- Everything except the pull-back uses `ease`, a smoothstep: it eases in and
  out with no overshoot.
- The pull-back uses `settle(u) = 1 - (1 - ease(u))²`. It starts from rest and
  spends longer slowing than starting, so the application settles into place.

**Camera positions** (`identifyRegisterCamera.ts`; canvas 1448 × 1086).

| View | Canvas point at the frame's top-left | Scale |
| --- | --- | --- |
| `inventory` (heading) | x 215, y 70 | Frame width ÷ 642, minimum 0.75. About 0.93 in a 600 px frame, 0.87 in a 560 px frame |
| `items` (rows) | x 215, y 392 | The same |
| `overview` (rest) | x 0, y 0 | The smallest scale that covers the frame. About 0.41 in a 600 px frame, 0.39 in a 560 px frame |

- Every view is clamped so the canvas covers the frame. Between two views,
  translate and scale move on one shared progress, so no in-between frame shows
  empty space.
- On a narrow frame (a phone) the 0.75 minimum applies to the first two views,
  so the Status column is cropped in the close-up.

**Story canvas positions** (480 × 300). Each sheet is drawn at 188 × 118.

| Document | Scattered (x, y, turn) | Gathered (x, y), at half size |
| --- | --- | --- |
| Architectural | 34, 20, −2° | 20, 22 |
| Specifications | 258, 20, 1.5° | 20, 88 |
| Schedule | 38, 160, 1.5° | 20, 154 |
| Consultant | 256, 160, −1.5° | 20, 220 |

The inventory panel is at x 130, y 16, 334 × 268, with a 30 px header and
34 px rows.

---

## F. Scroll behavior

**Unchanged from v1 in every respect.** v2 changed nothing in
`audienceScroll.ts`, `audienceSelection.ts` or the pinning code in
`AudienceSection.tsx`.

**The animation is not scrubbed by scroll.** Scroll decides which tab is
selected. The animation then plays automatically on its own clock.

### Section activation

Two conditions together make the tab *played*:

1. **The section has been seen.** An `IntersectionObserver` on the sticky
   presentation fires once at least 35% of it is in view, and latches.
2. **Identify is the selected tab.** It is on arrival, as the first tab.

So the animation starts as the section scrolls into view, slightly before it
pins.

### Pinned-section behavior

- The section is a tall scroll region holding a `position: sticky`
  presentation, stuck 81 px from the top, under the navigation.
- *Step* = 60% of the view height. *Progress* = pixels scrolled into the
  region ÷ step.
- No wheel, key or touch interception, no snapping, no scroll lock, no scroll
  library.

| Progress | Tab |
| --- | --- |
| 0 to 0.75 | Identify |
| 0.75 to 1.75 | Plan |
| 1.75 to 2.75 | Connect |
| 2.75 to 3.5 | Control, then the section releases |

Pinning applies only when the view is at least 1024 px wide, reduced motion is
not requested, and the presentation fits below the navigation.

**Measured with v2 in place:**

| View | Presentation height | Pinned |
| --- | --- | --- |
| 1280 × 800 | 713 px in 719 | Yes |
| 1440 × 900 | 716 px in 819 | Yes |
| 1920 × 1080 | 716 px in 999 | Yes |
| 390 × 844 | 1173 px, stacked | No |

These are the same heights as before the redesign.

### Playback and completion

- Scrolling within Identify's zone (the first 405 px at 900 px tall) changes
  nothing. The pass runs for 13.0 s and rests.
- A visitor who scrolls on sooner leaves it unfinished. There is no wait.

### Handoff to Plan

- Crossing progress 0.75 selects Plan, with a ±0.06 hysteresis band.
- The Identify copy fades out in 150 ms; the Plan copy fades in over 200 ms,
  rising 8 px. The visual track slides up one panel in 450 ms.
- The Identify visual returns to its opening frame, the scattered documents, at
  once, hidden by the outgoing slide.
- Scrolling back into Identify's zone replays the whole pass from the start.
- Clicking a tab selects it and smooth-scrolls into its zone.

### Responsive and reduced-motion behavior

- **Unpinned desktop and stacked phone layouts:** the same pass plays when the
  section is seen; tabs change by click. The story layer scales with the frame,
  so nothing overlaps or clips. On a phone its text is small (about 8–9 px).
- **On a phone** the section is tall and the visual is at its foot, so the pass
  may finish before the visitor scrolls down to it. They then see the resting
  view. v1 behaved the same way.
- **Reduced motion:** the section never pins, there is no sequence, and the
  resting view, the whole register application, is shown at once (capture `12`).

---

## G. Restoration instructions

### 1. Locate the versions in Git

```
git fetch origin
git log -1 d40734896246c662d04184d7a22ccdd6e732507c    # Identify v2
git log -1 e4e3a03dbcdf350ca656d6711642088b89b1ffc0    # Identify v1
git log --oneline --graph -8 origin/archive/identify-original-visualization
```

### 2. Review or run the archived v2

Read a file without changing your working tree:

```
git show d407348:src/components/home/identifyStoryScene.ts
```

Run the whole archived site in a separate folder:

```
git worktree add ../JiTpro-Website-identify-v2 d407348
cd ../JiTpro-Website-identify-v2
npm ci
npm run dev
```

Remove it afterwards with `git worktree remove ../JiTpro-Website-identify-v2`.
Use `e4e3a03` in place of `d407348` to run v1.

### 3. Restore Identify v2 into a later branch

Do this on a new branch, not on `main`.

**Step 1. Restore the Identify-only files.** Safe: nothing else uses them.

```
git checkout d407348 -- \
  src/components/home/IdentifyRegisterPreview.tsx \
  src/components/home/identifyStoryScene.ts \
  src/components/home/identifyStoryScene.test.ts \
  src/components/home/identifyRegisterCamera.ts \
  src/components/home/identifyRegisterCamera.test.ts \
  src/components/home/identifyRegisterPreviewData.ts \
  src/components/home/identifyRegisterPreviewData.test.ts
```

**Step 2. Re-apply the Identify parts of shared files by hand.** Compare each
with `git diff d407348 -- <file>` and copy across only the Identify parts
listed in Section D:

- `src/content/homeAudiences.ts`: the `gc-identify` entry, and the
  `descriptionMore` and `closing` fields on `AudienceTab`;
- `src/content/homeAudiences.test.ts`: the two Identify tests;
- `src/components/home/AudienceSection.tsx`: the `gc-identify` mount and the
  two blocks that render `descriptionMore` and `closing`;
- `src/components/demo/screens/ProductRegisterScreen.tsx`: the `title` prop,
  if it has been removed.

**Step 3. Verify.** `npm run typecheck`, `npm run lint`, `npm test`,
`npm run build`, then check the section at 1280 × 800, 1440 × 900 and
1920 × 1080.

> **Warning.** Do not run `git checkout d407348 --` on
> `src/components/home/AudienceSection.tsx`, `src/content/homeAudiences.ts`, or
> anything under `src/components/demo/`. Those files also drive Plan, Connect
> and Control. Checking out the archived version would silently discard every
> later change to those tabs.

### 4. Restore Identify v1 instead

Follow Section F of `docs/design/archive/Identify_Original_Visualization.md`.
v1 and v2 share three filenames (`IdentifyRegisterPreview.tsx`,
`identifyRegisterCamera.ts` and its test), so restoring one replaces the other.
v1 does not use `identifyStoryScene.ts`.

### 5. Reuse parts of v2

- **A staged story from one pure function.** `identifyStoryScene.ts` shows the
  pattern: timing constants, then one function from time to state, fully
  testable without a browser.
- **A scaled SVG story layer.** Drawing on a fixed design canvas and scaling it
  as a unit removes every overlap and clipping question across screen sizes.
- **The document drawings.** `DocumentSheet` in `IdentifyRegisterPreview.tsx`
  draws four construction documents from tokens alone.
- **The camera with a pull-back.** `cameraAt(frame, pan, out)` composes a pan
  and a zoom-out over any fixed canvas, with the cover clamp.
- **The `settle` easing** for any move that should come gently to rest.

---

## H. Visual references

All in `docs/design/archive/identify-redesign-v2/`. Captured 2026-11-11 from the
local development server in headless Chrome, with the working tree at the v2
source commit.

| File | Shows |
| --- | --- |
| `01-documents-scattered.png` | Stage 1, 300 ms: the initial document presentation |
| `02-documents-gathering.png` | 2050 ms: documents moving to the side, panel fading in |
| `03-requirements-being-identified.png` | 3500 ms: the inventory part-formed |
| `04-requirements-identified.png` | Stage 2 complete, 4700 ms: six identified requirements |
| `05-first-scope-gap-marked.png` | 5900 ms: defined checks and the first gap |
| `06-scope-gaps-visible.png` | Stage 3 complete, 7600 ms: all conditions and the key |
| `07-crossfade-to-register.png` | 8500 ms: story giving way to the register |
| `08-register-heading.png` | 9300 ms: the register's heading and summary cards |
| `09-register-rows-close-up.png` | 11000 ms: the Procurement Register close-up |
| `10-pulling-back.png` | 12000 ms: mid zoom-out |
| `11-final-full-procurement-register.png` | 13600 ms: the final full Procurement Register view |
| `12-reduced-motion-unpinned-resting-view.png` | Reduced motion at 1440 × 900 |
| `13-phone-390-stacked-copy.png` | 390 × 844: the stacked copy |
| `14-phone-390-stacked-visual-at-rest.png` | 390 × 844: the visual at rest |
| `identify-redesign-v2-scroll-recording.mp4` | 21 s recording at 1440 × 900: scrolling into the section, the complete pass including the final zoom-out, then scrolling on to Plan |

Captures `01` to `11` and the recording are 1440 × 900, pinned.
