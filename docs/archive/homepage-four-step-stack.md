# Archive: homepage four-step stack ("Know what's coming")

**Preserved:** 2026-11-09, ahead of the audience-based homepage redesign.
**Archive branch:** `archive/homepage-four-step-stack-2026-11-09`
**Annotated tag:** `homepage-four-step-stack-2026-11-09`
**Source branch:** `feature/102926_homepage_update` (code state as of `abf801f`)

This file records what the four-step homepage section was, which files built
it, what it shares with the rest of the site, and how to restore or reuse it.
The branch and tag hold the code; this file is the map to it.

---

## 1. What the section is

Homepage section 3, "Know what's coming. From day one." It opens the light
act of the six-section homepage (Decision Log 2026-11-05) and is mounted in
`src/pages/Home.tsx` as `<KnowWhatsComingSection />`.

It has three zones:

1. **The challenge** (`--jp-surface-light`). The heading and the capacity
   message: every contractor knows planning ahead matters, but the start of a
   job crowds it out; JiTpro provides dedicated planning support from the start.
2. **The process** — a **sticky step stack** (Design System §46.11). An
   unnumbered intro panel ("How we do it", on `--jp-surface`) followed by four
   full-view numbered panels. From `lg`, on a view at least 40rem tall, with
   motion allowed, each panel is `position: sticky`, so the next step rises from
   below and covers the last; scrolling up uncovers it. Nothing is animated,
   snapped or intercepted — the movement is the reader's own scroll. Otherwise
   the panels are ordinary stacked content. Panel surfaces alternate white /
   light / white / light. Ordinals read "01 / 04" in ink (§48.9 on light
   surfaces); amber carries nothing in the step panels.
3. **The result** (`--jp-surface`). "You know what's coming. Your team knows
   what to do and when to do it. Your client knows what to expect."

### The four steps

| Step | Title | Visualization |
|---|---|---|
| 01 | What does the project need? | Curated **Product Register** figure (§52) |
| 02 | When does it need to arrive on-site? | **Required On-Site Date** figure: schedule activities establish each item's RoSD and carry it into the register (§53.1) |
| 03 | Build the chain. | **Procurement schedule** with inspectable phase marks (Decision Log 2026-11-06; its typical-schedule comparison removed 2026-11-08) |
| 04 | Link everything required to support the chain. | None — copy only |

All three figures follow one story item (custom steel windows) from one data
source, so the register, the RoSD figure and the schedule agree.

---

## 2. Files

### Section-only (used by nothing else)

| File | Role |
|---|---|
| `src/components/home/KnowWhatsComingSection.tsx` | The section: copy, `STEPS`, zones, and `useStackOffsets()` (per-panel sticky offset; taller panels stick only once fully seen) |
| `src/index.css` — `.jp-step-stack`, `.jp-step-cover` (approx. lines 237–269) | Sticky behaviour and the "passing edge" shadow, inside a `min-width: 64rem` / `min-height: 40rem` / `prefers-reduced-motion: no-preference` media query |
| `src/components/demo/screens/home-register/HomeProductRegister.tsx` | Step 01 register screen (also rendered inside Step 02's figure) |
| `src/components/demo/screens/home-register/HomeProductRegisterFigure.tsx` | Step 01 figure wrapper and scaling |
| `src/components/demo/screens/home-register/homeRegisterData.ts` (+ `.test.ts`) | Curated register rows, KPIs, selected item, RoSD presentation |
| `src/components/demo/screens/home-schedule/HomeRoSDFigure.tsx` | Step 02 animated RoSD figure (with replay control) |
| `src/components/demo/screens/home-schedule/homeRoSDLayout.ts` | Step 02 geometry |
| `src/components/demo/screens/home-schedule/homeScheduleData.ts` | Field activities and RoSD derivation |
| `src/components/demo/screens/home-schedule/homeRoSD.test.ts` | Step 02 tests |
| `src/components/home/BuildTheChainComparison.tsx` | Step 03 procurement schedule figure |

### Shared (used elsewhere — do not delete with the section)

| Module | Also used by |
|---|---|
| `demo/screens/procurement-schedule/` — `scheduleModel`, `scheduleFixture`, `workCalendar`, `ScheduleRowMarks`, `PhaseInspector`, `useMarkInspection`, `scheduleTokens.css` | `DemoGantt`, `ScheduleViewer`, `ProcurementScheduleScreen`, `/review/procurement-schedule`, demo labs, `fixtures/productRegister` |
| `demo/screens/procurement-chain/` — `chainScenario`, `chainTokens.css` (and `ProcurementChain.tsx`) | Procurement Chain demo lab; `chainScenario` feeds the home register/schedule data |
| `demo/fixtures/productRegister.ts`, `demo/fixtures/project.ts` | Product Register screen, shell, schedule model |
| `demo/primitives/DemoStatusBadge.tsx` | All demo screens |
| `demo/inspection.ts`, `demo/tokens.css` | Demo screens |
| `src/components/JiTproWordmark.tsx` | Footer, demo shell, several pages |

### Governance and reference

- `docs/design/JiTpro_Design_System_v1.0.md`
  - §46.11 Sticky step stack
  - §52 Homepage Product Register (Step 01), incl. §52.5 the RoSD presentation state
  - §53 Homepage step stack: Steps 02–04 (§53.1 Step 02, §53.2 Step 03, §53.3 Step 04).
    Note: the §53 heading still reads "(not implemented)" although Steps 02
    and 03 were implemented; recorded here, not changed.
  - Decision Log entries 2026-11-05 through 2026-11-08
- `docs/design/procurement-chain-reference/` (HTML reference and render)
- `docs/handoff/2026-11-07-homepage-redesign-status.md`

---

## 3. Restoring or reusing

Use the tag (`homepage-four-step-stack-2026-11-09`); it is the fixed reference.

**Run the archived homepage side by side** without disturbing your branch:

```sh
git worktree add ../jitpro-four-step homepage-four-step-stack-2026-11-09
cd ../jitpro-four-step && npm install && npm run dev
# when finished:
git worktree remove ../jitpro-four-step
```

**Read one archived file** without checking anything out:

```sh
git show homepage-four-step-stack-2026-11-09:src/components/home/KnowWhatsComingSection.tsx
```

**Restore files into the current branch:**

```sh
git checkout homepage-four-step-stack-2026-11-09 -- \
  src/components/home/KnowWhatsComingSection.tsx \
  src/components/home/BuildTheChainComparison.tsx \
  src/components/demo/screens/home-register \
  src/components/demo/screens/home-schedule
```

Then re-add `<KnowWhatsComingSection />` to `src/pages/Home.tsx` and the
`.jp-step-stack` / `.jp-step-cover` rules to `src/index.css` (copy them from
`git show homepage-four-step-stack-2026-11-09:src/index.css`).

**Caution — shared modules may drift.** If the redesign changes the shared
procurement-schedule or procurement-chain modules, the restored section may
no longer compile or may render differently. Compare against the archived
versions (`git diff homepage-four-step-stack-2026-11-09 -- src/components/demo/screens/procurement-schedule src/components/demo/screens/procurement-chain`)
and restore those at the tag only if nothing else depends on the newer
behaviour. Run `npm run typecheck` and `npm test` after any restore.

**Reusing a figure in the redesign.** The three figures are self-contained and
take no props: `HomeProductRegisterFigure`, `HomeRoSDFigure`,
`BuildTheChainComparison`. Their governing standards (§52, §53) still apply
wherever they are placed.
