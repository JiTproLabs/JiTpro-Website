# Archive: the original Identify visualization

**Preserved:** 2026-11-11, ahead of the Identify redesign.
**Archive branch:** `archive/identify-original-visualization`
**Source commit (the exact code this record describes):** `e4e3a03dbcdf350ca656d6711642088b89b1ffc0`
**Source branch at the time:** `feature/102926_homepage_update`

This file records what the original Identify visualization is, how it works,
which files build it, what it shares with the rest of the homepage, and how to
restore or reuse it. The branch holds the code; this file is the map to it.

The archive branch is the source commit plus one further commit that adds only
this record and the media in `identify-original/`. Every code path below is
valid at the source commit.

> **Standing instruction for the redesign.** The homepage scroll interaction
> described in Section C must remain unchanged in the redesigned version unless
> Jeff explicitly authorizes a change. The redesign replaces the visual
> storytelling inside the existing scroll experience. It does not change how the
> visitor moves through the section.

---

## A. Purpose

**Where it sits.** Homepage section 3, the audience section ("What JiTpro means
for:"). With *General contractors* selected, the default, the section has four
tabs: Identify, Plan, Connect and Control. Identify is the first tab and the
first thing a visitor sees in the section.

**The business concept.** Identify is step one of the JiTpro method: before
anything can be planned, someone has to find everything the project needs.
JiTpro reviews the scope, drawings, specifications and schedules and turns them
into one comprehensive Procurement Register of every product, material and
service.

**The intended experience.** The copy states the step. The visual proves the
result is real: it shows the actual JiTpro register screen, not a simplified
drawing of one, and a camera guides the visitor around it. The visitor should
come away believing that the register exists, that it is thorough (246 products,
ten columns of detail per item), and that each entry traces back to a source
drawing.

The governing decision (Design System Section 54.4.1): *the camera, not the
content, decides what is seen.* The register is never simplified for the
homepage.

---

## B. Visual presentation

Reference captures are in `docs/design/archive/identify-original/` (Section G).
All times are milliseconds after the tab's *played* state turns true (Section C).

### The copy panel (left column)

| Element | Content |
| --- | --- |
| Headline | *Identify everything your project needs.* |
| Role link | *Explore JiTpro for general contractors* with an arrow, to `/roles/general-contractors` |
| Description | *Review the project scope, drawings, specifications, and schedules to identify every product, material, and service required for construction. Organize these requirements into a comprehensive Procurement Register.* |
| Checklist | *Review project scope* / *Identify products, materials, and services* / *Build the Procurement Register* |

The role link and checklist are Identify-only additions (Design System 54.2.1).

**Checklist sequence.** Each line fades in over 300 ms and rises 4 px, at 400,
1075 and 1750 ms. Each line's check mark follows its text by 120 ms. The last
check completes by 2070 ms. The final line is semibold in the strongest ink.

### The visual (right column)

**Initial state** (`01-initial-overview-checklist-not-started.png`). The 16:10
frame shows the *overview*: the whole register interface across its full width,
from its top, at the smallest scale that covers the frame (about 0.41× in a
598 px wide frame). Visible: the JiTpro sidebar, the project selector, the
heading *Procurement Register*, five summary cards, search and filters, the
table's upper rows, and the Product Detail panel. The lowest strip of the
screen is below the frame.

**How the register appears.** It does not animate in. The register is the
canonical `ProductRegisterScreen` on its fixed 1448 × 1086 canvas, already
complete. Only the camera moves, by CSS `transform` (translate and scale from
the canvas's top-left). Layout never changes.

**Camera sequence.** One pass, eased `ease-in-out`, with no hold between moves:

| Arrives at | Stop | What is in view | Capture |
| --- | --- | --- | --- |
| 0, held to 2400 | Overview | The whole interface | `01`, `02` |
| 3800 | Items and categories | Zoom to the table's left: Product ID, Product / Description, Category, Trade, Supplier | `03` (mid-zoom), `04` |
| 5200 | Trades, suppliers and statuses | Pan right, centred on Trade through Status | `05` |
| 6400 | Lead times and Required On-Site | Pan right, centred on those two columns | `06` |
| 7800 | Source | Pan right and down to the canvas's right edge: the Source column and the detail panel's Procurement and Source Information | `07` |
| 9400 | Rest | The register heading, subtitle, summary cards, filters and first rows | `08` |

**Zoom behaviour.**
- *Tour scale:* about 600 canvas px across the frame, about 1× on desktop, never
  below 0.85×.
- *Rest scale:* about 700 canvas px across the frame, about 0.85× on desktop,
  never below 0.75×.
- The overview holds until the checklist has finished, so the camera is never a
  second motion competing with it (Design System 46.4).
- Every view is clamped so the canvas always covers the frame. Nothing outside
  the interface is ever shown, at a stop or between stops.

**Highlighted record.** The first row, *PRD-0246 Heritage Steel Windows*, is the
screen's own selected row (amber left edge, tinted row). The Product Detail
panel on the right describes the same item. This is the canonical screen's
selection, not a homepage effect; nothing is highlighted by the animation.

**Final resting state** (`08-final-resting-view.png`). The camera stops on the
heading *Procurement Register*, *Oak Ridge Residence*, the summary cards (246
Total Products, 162 Approved, 38 Pending Approval, 24 Long Lead), the filters,
the table header and the selected first row. It never loops.

---

## C. Scroll behavior

**The most important fact: the Identify animation is not scrubbed by scroll.**
Scroll decides *which tab is selected*. The animation then runs on its own
clock. A visitor who stops scrolling part-way never sees a half-finished state
caused by scroll position.

### The mechanism

- The section is a tall scroll region holding a `position: sticky` presentation
  (header, tab rail, copy and visual), stuck 81 px from the top, just under the
  navigation.
- The region's extra height is the scroll distance the tabs consume. It is an
  empty spacer `div` after the sticky presentation.
- *Step* = 60% of the view height (`STEP_OF_VIEW = 0.6`).
- *Progress* = pixels scrolled into the region ÷ step.
- Each tab owns one step; the first and last tabs own three-quarters of a step.
- Region height for four tabs = 3.5 steps.
- No wheel, key or touch interception. No scroll snapping, no scroll lock, no
  scroll library. The movement is the visitor's own scrolling.

| Progress | Tab |
| --- | --- |
| 0 to 0.75 | Identify |
| 0.75 to 1.75 | Plan |
| 1.75 to 2.75 | Connect |
| 2.75 to 3.5 | Control, then the section releases |

**Measured at 1440 × 900:** sticky presentation 716 px tall in a 819 px space;
step 540 px; added scroll distance 1890 px; whole section 2606 px. Identify
owns the first 405 px of scroll.

### When the animation begins

Two conditions together make the tab *played*:

1. **The section has been seen.** An `IntersectionObserver` on the sticky
   presentation fires once at least 35% of it is in view. This latches for the
   page's lifetime.
2. **Identify is the selected tab.** It is on arrival, as the first tab.

In practice the animation starts as the section scrolls into view, slightly
before it pins. Both the checklist and the camera start from this one state
(Design System 46.3).

### How scroll progress relates to the animation

- Scrolling within Identify's zone changes nothing. The animation keeps running
  on time, or stays at rest.
- The pass takes 9.4 s. A visitor who scrolls on sooner leaves it unfinished;
  there is no wait and no lock.

### When the animation completes

At 9400 ms the camera reaches the rest view and stays. Nothing loops.

### The transition to Plan

- Crossing progress 0.75 selects Plan. A hysteresis band of ±0.06 of a step
  (about 32 px at 900 px tall) stops flicker for a visitor resting on the
  boundary.
- The Identify copy fades out in 150 ms. The Plan copy then fades in over
  200 ms, rising 8 px. Two tabs' copy is never visible together.
- The visual track slides up one whole panel in 450 ms, `ease-out`, so Plan
  rises from below.
- The Identify checklist resets instantly and the camera returns to the
  overview at once, both hidden by the outgoing transition.
- Scrolling back up into Identify's zone reselects it and **plays the whole
  sequence again from the start**.
- Clicking a tab selects it at once and smooth-scrolls the page into that tab's
  zone (progress = index + 0.25). Tabs passed on the way are not selected.

### Responsive behavior

Pinning applies only when all three hold; otherwise the section is an ordinary
tabbed section with no added height and no scroll behaviour:

1. the view is at least 1024 px wide (`lg`);
2. reduced motion is not requested;
3. the presentation's measured height fits the view below the navigation
   (re-measured on resize, zoom and content change).

| View | Presentation | Identify visual |
| --- | --- | --- |
| Desktop that fits (for example 1440 × 900, 1920 × 1080, 1280 × 800) | Pinned | Camera pass on entry |
| Desktop too short or zoomed | Unpinned, side by side | Camera pass when the section is seen; tabs change by click |
| Below 1024 px wide | Unpinned, stacked: copy above visual | Same camera pass. The frame is narrow, so the scale floors apply (tour 0.85×, rest 0.75×) and less of the register is in view. See `10` and `11`. |

A real resize of the frame during the pass ends it at the rest view.

### Reduced-motion behavior

With `prefers-reduced-motion: reduce` (capture `09`):

- the section never pins;
- the checklist appears at once;
- there is no camera; the rest view is shown immediately;
- tab changes are instant.

Nothing in the visual depends on motion to be understood.

---

## D. Technical architecture

### Identify-only files

These are used by nothing else. They can be replaced without touching another
tab.

| File | Purpose |
| --- | --- |
| `src/components/home/IdentifyRegisterPreview.tsx` | The visual. Renders the register on its fixed canvas inside a clipping frame and runs the camera with the Web Animations API from the single `played` prop. Handles reduced motion and resize. |
| `src/components/home/identifyRegisterCamera.ts` | The camera as pure functions: canvas size, landmarks, the six stops and their times, scale rules, cover clamping, and keyframe generation. Every timing constant lives here. |
| `src/components/home/identifyRegisterCamera.test.ts` | Tests: overview holds past the checklist; stops in order, once; canvas always covers the frame; readable scales. |
| `src/components/home/identifyRegisterPreviewData.ts` | Supplies `PREVIEW_TITLE` (*Procurement Register*). Its other exports (`PREVIEW_ROWS`, `PREVIEW_COLUMNS`, `PREVIEW_PROJECT`, `PREVIEW_ROW_IDS`) are left over from the withdrawn three-column sheet and are used only by its test. |
| `src/components/home/identifyRegisterPreviewData.test.ts` | Tests for the data file above. |

### Identify-specific parts of shared files

| File | The Identify part | Also serves |
| --- | --- | --- |
| `src/content/homeAudiences.ts` | The `gc-identify` entry: label, headline, description, `roleLink`, `checklist`. The optional `roleLink` and `checklist` fields on `AudienceTab`. | Every audience and tab's copy |
| `src/content/homeAudiences.test.ts` | The test that only `gc-identify` carries the role link and checklist | All copy tests |
| `src/components/home/AudienceSection.tsx` | The `IdentifyRegisterPreview` import and its mount (`if (tab.id === 'gc-identify')`); the `RoleLink` and `MethodChecklist` components; `CHECK_LINE_DELAY`, `CHECK_MARK_DELAY`, `CHECK_MOTION` | The whole section: state, pinning, scroll selection, rail, copy transitions, visual track, and the Plan and Connect mounts |
| `src/components/demo/screens/ProductRegisterScreen.tsx` | The optional `title` prop, added so the homepage heading reads *Procurement Register* | The demo lab (`/demo-lab/product-register`, `/demo-lab/product-register-compare`) and the demo registry (`src/components/demo/registry.ts`) |

### Shared dependencies (do not modify for Identify alone)

| File | Purpose | Also used by |
| --- | --- | --- |
| `src/components/home/audienceScroll.ts` (+ `.test.ts`) | Scroll maths: step, zones, hysteresis, region height | All tabs, all audiences |
| `src/components/home/audienceSelection.ts` (+ `.test.ts`) | The section's one state value and keyboard focus rules | All tabs, all audiences |
| `src/components/demo/screens/ProductTable.tsx` | The ten-column table | Only `ProductRegisterScreen` |
| `src/components/demo/fixtures/productRegister.ts` | Register data: rows, cards, toolbar, detail panel, page title | The archived four-step register figure |
| `src/components/demo/fixtures/project.ts` | Project name and details | The archived four-step register figure |
| `src/components/demo/shell/JiTproShell.tsx` | The application shell: sidebar and top bar | **Plan and Connect** (`PlanChainPreview.tsx`), and the other demo screens |
| `src/components/demo/tokens.css` | The `--jpd-*` demo UI tokens | **Plan and Connect**, and every demo screen |
| `src/components/demo/primitives/DemoStatusBadge.tsx` | Status pills | The schedule screen and other demo screens |
| `src/components/demo/screens/procurement-schedule/scheduleFixture.ts`, `scheduleModel.ts`, `workCalendar.ts` | Schedule data the register fixture reads its dates from | **Plan and Connect**, the schedule screen |
| `src/components/JiTproWordmark.tsx` | The logo in the shell | The footer and several pages |
| `src/index.css` | Design tokens; loads Inter Tight 400/500 for the demo UI | The whole site |
| `src/pages/Home.tsx` | Mounts `<AudienceSection />` | The homepage |

### State management

- **One section state:** `{ audienceId, tabIndex }` in `AudienceSection`.
- **One derived flag:** `seen` (the section has been in view).
- **`played`** = this tab is selected, its audience is selected, and `seen`.
  It is the only input to both the checklist and the camera.
- The camera keeps no React state. A layout effect keyed on `played` sets the
  parked transform and, when played, starts one `Element.animate()` call.

### Styles and assets

- Tailwind utilities and the `--jp-*` tokens for the section; `--jpd-*` tokens
  for the register screen.
- No images, video or animation library. Icons are `lucide-react`.
- The register screen's design master is `assets-src/methodology/product-register.png`.

---

## E. Design decisions

Each is recorded in the Decision Log of
`docs/design/JiTpro_Design_System_v1.0.md`.

| Date | Decision | Section |
| --- | --- | --- |
| 2026-11-09 | The audience section replaces *Know what's coming*, with a pinned, scroll-selected tab presentation | 46.12, 54 |
| 2026-11-09 | Scroll selects, transitions complete: scroll picks a whole tab and never renders a partial state | 46.12 |
| 2026-11-09 | Identify copy revised; role link and checklist added | 54.2, 54.2.1 |
| 2026-11-09 | Checklist line spacing settled at 675 ms after trying 180 and 450 ms | 54.2.1 |
| 2026-11-09 | First visual: a cropped three-column register sheet | 54.4.1 |
| 2026-11-10 | A guided pan-and-zoom pass added | 54.4.1 |
| 2026-11-10 | The three-column sheet withdrawn as a mistake; the visual becomes the complete canonical register under a camera | 54.4.1 |

The principles behind them:

- **Show the real deliverable.** The register is the same component the demo
  lab renders, never a homepage copy (54.4.1).
- **One state drives everything.** Checklist and camera share `played` (46.3).
- **One focal motion at a time.** The camera waits for the checklist (46.4).
- **Animation communicates.** Each stop shows a different kind of information
  the register holds (46.1).
- **No empty space.** The canvas always covers the frame (54.4.1).
- **Reduced motion is a first-class state.** The rest view, at once (46.5).
- **No controls in the visual.** Re-entering the tab replays it (46.6, 46.12).
- **The copy carries the meaning.** The visual column is `aria-hidden` (46.2).
- **No amber on the light surface,** except the role link's decorative
  underline (8.8).
- **The pinned section must fit** at 1280 × 800, 1440 × 900 and 1920 × 1080
  (46.12, 54.2.1).

Open item at the time of archiving (54.5, item 5): whether *Procurement
Register* and *Product Register* are the same artefact under two names.

---

## F. How to restore or reuse it

### 1. Locate the original in Git

```
git fetch origin
git log -1 e4e3a03dbcdf350ca656d6711642088b89b1ffc0
git log --oneline -3 origin/archive/identify-original-visualization
```

The branch tip is the record commit; its parent is the source commit above.

### 2. Review the archived code

Read without changing your working tree:

```
git show e4e3a03:src/components/home/IdentifyRegisterPreview.tsx
git show e4e3a03:src/components/home/identifyRegisterCamera.ts
```

Or run the archived site in a separate folder:

```
git worktree add ../JiTpro-Website-identify-original archive/identify-original-visualization
cd ../JiTpro-Website-identify-original
npm ci
npm run dev
```

Remove it afterwards with `git worktree remove ../JiTpro-Website-identify-original`.

### 3. Restore the complete original Identify visualization

Do this on a new branch, not on `main`.

**Step 1. Restore the Identify-only files.** Safe: nothing else uses them.

```
git checkout e4e3a03 -- \
  src/components/home/IdentifyRegisterPreview.tsx \
  src/components/home/identifyRegisterCamera.ts \
  src/components/home/identifyRegisterCamera.test.ts \
  src/components/home/identifyRegisterPreviewData.ts \
  src/components/home/identifyRegisterPreviewData.test.ts
```

**Step 2. Re-apply the Identify parts of shared files by hand.** Compare each
with `git diff e4e3a03 -- <file>` and copy across only the Identify parts listed
in Section D:

- `src/components/home/AudienceSection.tsx`: the import, the `gc-identify`
  mount, `RoleLink`, `MethodChecklist` and the three `CHECK_*` constants;
- `src/content/homeAudiences.ts`: the `gc-identify` entry;
- `src/components/demo/screens/ProductRegisterScreen.tsx`: the `title` prop.

**Step 3. Verify.** `npm run typecheck`, `npm run lint`, `npm test`,
`npm run build`, then check the section at 1280 × 800, 1440 × 900 and
1920 × 1080.

> **Warning.** Do not run `git checkout e4e3a03 -- src/components/home/AudienceSection.tsx`,
> `src/content/homeAudiences.ts`, or anything under `src/components/demo/`.
> Those files also drive Plan, Connect and Control. Checking out the old
> version would silently discard every later change to those tabs, including
> the Connect dependency summary that was in progress when this archive was
> made.

### 4. Reuse individual components or techniques

- **The camera over a fixed canvas.** `identifyRegisterCamera.ts` is pure and
  has no DOM dependency. Change `CANVAS`, the landmarks and `STOPS` to tour any
  fixed-size screen. `IdentifyRegisterPreview.tsx` shows the 30 lines needed to
  run it.
- **The cover clamp** (`coverScale`, `viewAt`): guarantees a scaled canvas
  never exposes its edge inside a frame.
- **The method checklist** (`MethodChecklist` in `AudienceSection.tsx`): a
  staged list driven by one boolean, using only CSS transitions and delays.
- **The role link** (`RoleLink`): an ink link with a decorative amber underline
  for light surfaces.
- **The register screen.** `ProductRegisterScreen` remains in the codebase and
  is not affected by this archive.

---

## G. Visual references

All in `docs/design/archive/identify-original/`. Captured 2026-11-11 from the
local development server in headless Chrome.

| File | Shows |
| --- | --- |
| `01-initial-overview-checklist-not-started.png` | Initial state, 150 ms: overview, checklist not yet started |
| `02-overview-held-checklist-complete.png` | 2250 ms: overview held, checklist complete |
| `03-intermediate-zooming-to-items.png` | 3100 ms: camera mid-zoom |
| `04-items-and-categories.png` | 3800 ms: items and categories; the selected first row |
| `05-trades-suppliers-statuses.png` | 5200 ms |
| `06-lead-times-and-required-on-site.png` | 6400 ms |
| `07-source-column-and-detail-panel.png` | 7800 ms: Source column and the detail panel |
| `08-final-resting-view.png` | 10200 ms: final resting view |
| `09-reduced-motion-unpinned-resting-view.png` | Reduced motion at 1440 × 900: unpinned, rest view at once |
| `10-phone-390-stacked-copy.png` | 390 × 844: stacked copy |
| `11-phone-390-stacked-visual-at-rest.png` | 390 × 844: the visual at rest |
| `identify-original-scroll-recording.mp4` | 18 s recording at 1440 × 900: scrolling into the section, the full Identify pass, then scrolling on to Plan |

Captures `01` to `08` and the recording are 1440 × 900, pinned.

**Capture note.** The working tree held uncommitted Connect changes when the
captures were made (the Connect headline, description and dependency summary,
and 48 px section padding on desktop views at most 864 px tall). None of them
changes Identify at the sizes captured, and none is in the archived source
commit. The last seconds of the recording show Plan, which those changes also
leave untouched.
