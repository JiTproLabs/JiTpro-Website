# Homepage redesign: status and resume point

Recorded 2026-11-07 on branch `feature/102926_homepage_update`, at the PC-to-MacBook
handoff. This is a tracking record. **It does not authorize anything.** The binding
specifications are in `docs/design/JiTpro_Design_System_v1.0.md`. Where this note and
that document disagree, the Design System governs.

## Where things stand

| Area | Status | Authority |
| --- | --- | --- |
| Step 01: simplified Product Register | **Implemented.** Ready for final visual refinements after browser review. | DS §52 |
| Procurement Chain | **Implemented.** A new React/SVG visualization, isolated and previewed at `/demo-lab/procurement-chain` (DEV only). | DS §51 |
| Scheduling engine | **Corrected and tested.** Zero-duration milestones no longer consume working days. | DS §51.14 |
| Chain scenario | **Updated.** Review/revision durations are now 15/12, 10/7, then 5, for a total of **312 working days**. Required On Site is fixed at 30 Nov 2027, so Buyout starts 31 Aug 2026. | DS §51.2 |
| Step 02 | **Next priority.** Direction approved; not implemented. | DS §53.1 |
| Step 03 | Direction approved: backward planning from the Required On-Site date with the Procurement Chain alone, with **no** comparison against a conventional schedule. The old comparison stays live until the replacement is approved. | DS §53.2, §51 |
| Step 04 | Direction approved: progressively introduce supporting commitments and issues. | DS §53.3 |

## Step 02: the approved concept

Step 02 shows how construction schedule activities establish Required On-Site Dates (RoSDs).
1. A simplified construction schedule Gantt with several field activities.
2. Highlight the dates the field requires specific products and materials.
3. Identify those dates as Required On-Site Dates.
4. Fade the Gantt away while the RoSD markers stay.
5. Carry those dates visually into the Product Register.

Before any code, the composition, tokens and motion must be specified in the Design System and
recorded in the Decision Log (§49, §46).

## Unresolved decisions

- **Demonstration data date.** The proposal is to move it from Thu 26 Nov 2026 (Thanksgiving) to
  Mon 30 Nov 2026. Undecided; `DATA_DATE` in `scheduleModel.ts` is unchanged.
- **Step 01 visual review** (not yet seen in a browser):
  - column fit
  - legibility at `lg`, where the canvas is about 75% scale
  - the badge reads "Pending" while the KPI card reads "Pending Approval"
  - Step 01 is taller than one viewport
- **Methodology issue.** Nine shared-fixture packages have no review activity between resubmittal
  and approval (DS §51.13). Recorded for separate review.
- The 310 total stated with the duration change versus the 312 the durations sum to: 312 is recorded.

## Visual references

- `docs/design/procurement-chain-reference/procurement-chain.html` and `render.png`: the
  approved visual character of the chain (DS §51).

## Resume

```
git fetch origin
git checkout feature/102926_homepage_update
git pull
npm ci
npm run dev          # homepage at http://localhost:5173/ ; chain at /demo-lab/procurement-chain
npm test && npm run typecheck && npm run lint
```

`.env` (Supabase/Resend keys) is not in git. Copy it separately if the MacBook needs the demo-request
function.
