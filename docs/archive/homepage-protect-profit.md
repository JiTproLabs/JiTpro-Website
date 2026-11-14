# Archive: homepage "Protect your profit. Protect your reputation."

**Removed from the homepage:** 2026-11-13, at the founder's direction.
**Source branch:** `feature/102926_homepage_update`
**Code:** `src/components/home/ProtectProfitSection.tsx`, kept in the codebase,
unchanged and unrendered (it was last changed in `52e7f36`).
**Suggested tag when this removal is committed:** `homepage-protect-profit-2026-11-13`,
on the last commit that still renders the section.

This file records what the section was, why it left, and how to restore it.

---

## 1. Why it left

The homepage already establishes that procurement failures cause schedule
disruption and profit erosion (the procurement section's *Those delays spread.
Costs grow. Profits shrink.* and *Fewer surprises*). Repeating the financial
argument here added length without new information. The homepage now runs from
the problem, to JiTpro's approach, to the benefits, to one invitation to begin
with a single project. The copy was not redistributed to other sections.

## 2. What the section was

Homepage section 5, the band that opened the closing act (Decision Log
2026-11-05), between *We're with you throughout the project* and the final
call to action. Mounted in `src/pages/Home.tsx` as `<ProtectProfitSection />`.

**Treatment.** The elevated band: `--jp-surface` with `border-y` hairlines in
`--jp-border` at 12% (Design System §48.6). No amber. The homepage's 5fr / 7fr
grid from `lg` on the shared left edge, stacked below.

**Copy, exactly as it appeared.**

- Left column
  - `h2`: *Protect your profit. Protect your reputation.*
  - Beneath it, at a bold heading-face register: *You bid the job at 12% profit. How much of that do you actually keep?*
    The 12% is the reader's own bid as an illustration, under the §20.1
    illustrative-figures rule (Decision Log 2026-11-05); the question stays open.
- Right column, at the secondary body register:
  1. *Every avoidable delay can cost you money.*
  2. *Every unexpected problem can hurt your client's trust.*
  3. *JiTpro helps you prevent the problems you can, and clearly explain the ones you can't.*
  4. *Fewer delays. Fewer surprises. Clear answers.* (semibold, primary ink)
  5. *That's what better planning looks like.*

## 3. What changed around it

- `src/pages/Home.tsx` no longer imports or renders it, and its section map
  no longer lists it.
- `NextProblemCTA` relied on this band's bottom hairline to mark its top
  boundary. It now follows *We're with you throughout the project* directly:
  the change from `--jp-surface-light` to `--jp-background` marks the boundary,
  so no hairline was added.

## 4. How to restore it

1. In `src/pages/Home.tsx`, import `ProtectProfitSection` from
   `../components/home/ProtectProfitSection` and render it between
   `<ThroughoutProjectSection />` and `<NextProblemCTA />`.
2. Restore the section-map line in that file's header comment.
3. Record the restoration in the Design System Decision Log.

Nothing else depends on the section, and it depends on nothing but the design
tokens.
