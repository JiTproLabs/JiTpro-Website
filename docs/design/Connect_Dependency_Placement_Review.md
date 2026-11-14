# Connect: Windows & Doors Dependency Placement Review

**Status:** PLACEMENTS APPROVED BY THE FOUNDER on 2026-11-11 (Section 0) and **IMPLEMENTED the same day** in `connectChainScene.ts`, its tests and Design System Section 54.4.3, uncommitted and awaiting visual review. The open points in Section 0 were settled as: First Submittal Review; three working days; ten working days after Fabrication begins; the proposed card lines, including "for Submittal Preparation"; and Final Scope Clarification derived as three working days before Buyout finishes, not fixed to June 29.
**Prepared:** 2026-11-11
**Item:** Custom Steel Windows and Doors, Oak Ridge Residence
**Required On Site:** Wednesday, September 1, 2027
**Chain start:** Thursday, June 4, 2026 (312 working days)

**How to use this worksheet.** Review Sections 1 to 4, then fill in the three
**PROPOSED** columns in Section 5 for each dependency. Section 6 explains the
three fields and has a date lookup table, so no date has to be calculated by
hand and no screen position has to be specified.

**Where the figures come from.** Every date below was read from the code the
animation runs on, not retyped from earlier documents: the chain from
`src/components/demo/screens/procurement-chain/chainScenario.ts`, built by the
scheduling engine in `scheduleModel.ts` on the working-day calendar in
`workCalendar.ts`; the six dependencies from `src/components/home/connectChainScene.ts`.

---

## 0. Founder-approved placement decisions (2026-11-11)

These six placements were decided by Jeff Kaufman on 2026-11-11, after
reviewing this worksheet. **They supersede the original dates in Sections 2,
3 and 5,** which are kept below as the record of what the animation showed
before.

**Nothing has been implemented.** The next step is to apply these to the
Connect animation.

### The decisions, in Jeff's words

1. **Final Scope Clarification:** June 29, 2026, during Buyout.
2. **Structural Attachment Requirements:** midpoint of Submittal Coordination.
3. **Final Window & Door Design:** end of Submittal Coordination, immediately
   before Submittal Preparation begins.
4. **Frame Finish & Color Selection:** a few working days before the end of
   the First Review Cycle.
5. **Final Glazing Specification:** approximately 10 days after Fabrication
   begins.
6. **Final Field Dimensions:** keep its existing position, just before Release
   for Fabrication.

### Approved placements against the original ones

"Indicative date" is my reading of each rule on the chain's working-day
calendar. Where the decision gave an exact date or said to keep the existing
one, the date is final. Where it gave a rule, **the implementing session must
compute the date from the schedule data with the scheduling calendar** and
confirm it matches; do not copy the indicative date into the code as a typed
date.

| # in new order | Dependency | ORIGINAL date | ORIGINAL attachment | APPROVED placement | Governing rule to compute from the schedule | Indicative date | Date status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Final Scope Clarification | Jul 2, 2026 | Finish of Buyout | **June 29, 2026, during Buyout** | Exact date given. Equivalent rule: 3 working days before Buyout finishes (Jul 2). It is working day 17 of Buyout's 20. | **Mon Jun 29, 2026** | Final (exact date approved) |
| 2 | Structural Attachment Requirements | Jun 26, 2026 | 5 working days before the start of Submittal Coordination | **Midpoint of Submittal Coordination** | The middle working day of Submittal Coordination: working day 13 of its 25 (Jul 6 to Aug 7), which is 12 working days before it finishes. | Wed Jul 22, 2026 | Rule approved; date to be computed |
| 3 | Final Window & Door Design | Jul 6, 2026 | Start of Submittal Coordination | **End of Submittal Coordination, immediately before Submittal Preparation begins** | The finish of Submittal Coordination, which is the last working day before Submittal Preparation starts (Aug 10). | Fri Aug 7, 2026 | Rule approved; date to be computed |
| 4 | Frame Finish & Color Selection | Aug 10, 2026 | Start of Submittal Preparation | **A few working days before the end of the First Review Cycle** | N working days before the finish of the first review. **Two points to confirm, below.** With N = 3 and the review being First Submittal Review (finishes Oct 13): Oct 7. | Wed Oct 7, 2026 *(assumes N = 3 and First Submittal Review)* | Rule approved; N and the activity to be confirmed |
| 5 | Final Field Dimensions | Nov 30, 2026 | 2 working days before Release for Fabrication | **Keep its existing position** | Unchanged: 2 working days before the Release for Fabrication milestone (Dec 2). | **Mon Nov 30, 2026** | Final (unchanged) |
| 6 | Final Glazing Specification | Oct 14, 2026 | Start of First Revision Cycle | **Approximately 10 days after Fabrication begins** | 10 working days after Fabrication starts (Dec 3). **One point to confirm, below.** | Thu Dec 17, 2026 *(assumes working days)* | Rule approved; day type to be confirmed |

**New chronological order:** Final Scope Clarification (Jun 29), Structural
Attachment Requirements (Jul 22), Final Window & Door Design (Aug 7), Frame
Finish & Color Selection (Oct 7), Final Field Dimensions (Nov 30), Final
Glazing Specification (Dec 17). The rail and the reveal order follow this.

**Effect on clustering.** The early cluster is gone. Gaps between neighbours,
on the indicative dates: 16, 12, 42, 35 and 13 working days. The closest pair
is now Final Field Dimensions and Final Glazing Specification, either side of
the Release for Fabrication milestone. One dependency now falls during
Fabrication.

### Points the implementing session must confirm with Jeff before coding

1. **Frame Finish & Color Selection: which activity is "the First Review
   Cycle"?** The chain has *First Submittal Review* (Sep 22 to Oct 13, the
   architect's review) and *First Revision Cycle* (Oct 14 to Oct 29, the
   fabricator's revision). I have read it as First Submittal Review. If it is
   the First Revision Cycle, three working days before its finish is Oct 26.
2. **Frame Finish & Color Selection: how many is "a few"?** I assumed 3
   working days.
3. **Final Glazing Specification: working days or calendar days?** 10 working
   days after Dec 3 is Dec 17, 2026. 10 calendar days is Sunday Dec 13, which
   would fall to Monday Dec 14.
4. **The "for *activity*" line on each card.** Proposed, for confirmation:

   | Dependency | Proposed card line |
   | --- | --- |
   | Final Scope Clarification | GC / Glazing Subcontractor · for Buyout |
   | Structural Attachment Requirements | Structural Engineer · for Submittal Coordination |
   | Final Window & Door Design | Architect · for Submittal Preparation |
   | Frame Finish & Color Selection | Owner · for First Submittal Review |
   | Final Field Dimensions | GC / Glazing Subcontractor · for Release for Fabrication |
   | Final Glazing Specification | Architect · for Fabrication |

   The third is a judgment: the design is due at the end of Submittal
   Coordination because Submittal Preparation cannot begin without it.

### Implementation notes for the next session

- **Change only Connect.** Apply the placements in
  `src/components/home/connectChainScene.ts`. Do not edit the shared chain
  scenario (`chainScenario.ts`), the schedule model, Plan, or any chain
  activity, date or duration.
- **Three of the six are the shared scenario's own commitments** (Final Window
  & Door Design, Frame Finish & Color Selection, Final Glazing Specification).
  Their approved dates differ from the dates the shared scenario derives, and
  two of the approved rules ("midpoint of", "days after the start of") cannot
  be expressed in the shared model, which only dates a requirement at or
  before an activity's start. Connect therefore needs to place all six itself,
  each by its rule, while the shared scenario stays as it is.
- **Every date must be derived** from the chain's steps with the working-day
  calendar (`workCalendar.ts`), as the three added dependencies already are.
  June 29 can be expressed as 3 working days before Buyout's finish, so that
  it, too, follows the chain.
- **Tests to update:** `connectChainScene.test.ts` asserts the original six
  dates, their order, and that the three shared commitments equal the shared
  scenario's. Those assertions must change to the approved rules.
- **Design System:** Section 54.4.3 and the Decision Log list the original six
  dates and rules and must be amended.
- **Then** recheck the animation: the rail order, each card and diamond, the
  closing view of all six (now spanning Jun 29 to Dec 17, including the two
  milestone markers on Dec 2), and the phone layout.
- **Verification is batched.** The Connect redesign is still uncommitted and
  has not had the full test suite, lint or build run. Run them only when Jeff
  asks for the verify-and-commit pass.

---

## 1. The complete procurement chain

Sixteen entries: ten activities and six milestones. The chain is strictly
sequential. Each activity starts on the first working day after its
predecessor finishes; each milestone falls on the finish date of the activity
before it.

| # | Activity | Type | Start | Finish | Working days | Predecessor | Successor | Performed by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Buyout | Activity | Thu Jun 4, 2026 | Thu Jul 2, 2026 | 20 | (chain start) | 2 | General Contractor |
| 2 | Submittal Coordination | Activity | Mon Jul 6, 2026 | Fri Aug 7, 2026 | 25 | 1 | 3 | Heritage Steel Window & Door |
| 3 | Submittal Preparation | Activity | Mon Aug 10, 2026 | Mon Sep 21, 2026 | 30 | 2 | 4 | Heritage Steel Window & Door |
| 4 | **Initial Submittal** | Milestone | Mon Sep 21, 2026 | | 0 | 3 | 5 | Heritage Steel Window & Door |
| 5 | First Submittal Review | Activity | Tue Sep 22, 2026 | Tue Oct 13, 2026 | 15 | 4 | 6 | Sierra Ridge Architects |
| 6 | First Revision Cycle | Activity | Wed Oct 14, 2026 | Thu Oct 29, 2026 | 12 | 5 | 7 | Heritage Steel Window & Door |
| 7 | **First Resubmittal** | Milestone | Thu Oct 29, 2026 | | 0 | 6 | 8 | Heritage Steel Window & Door |
| 8 | Second Submittal Review | Activity | Fri Oct 30, 2026 | Fri Nov 13, 2026 | 10 | 7 | 9 | Sierra Ridge Architects |
| 9 | Second Revision Cycle | Activity | Mon Nov 16, 2026 | Tue Nov 24, 2026 | 7 | 8 | 10 | Heritage Steel Window & Door |
| 10 | **Second Resubmittal** | Milestone | Tue Nov 24, 2026 | | 0 | 9 | 11 | Heritage Steel Window & Door |
| 11 | Third Submittal Review | Activity | Wed Nov 25, 2026 | Wed Dec 2, 2026 | 5 | 10 | 12 | Sierra Ridge Architects |
| 12 | **Final Approval** | Milestone | Wed Dec 2, 2026 | | 0 | 11 | 13 | Sierra Ridge Architects |
| 13 | **Release for Fabrication** | Milestone | Wed Dec 2, 2026 | | 0 | 12 | 14 | General Contractor |
| 14 | Fabrication | Activity | Thu Dec 3, 2026 | Fri Aug 20, 2027 | 180 | 13 | 15 | Heritage Steel Window & Door |
| 15 | Shipping and Delivery | Activity | Mon Aug 23, 2027 | Wed Sep 1, 2027 | 8 | 14 | 16 | Summit Freight Services |
| 16 | **Required On Site** | Milestone | Wed Sep 1, 2027 | | 0 | 15 | (end) | General Contractor |

The ten activity durations total 312 working days.

**Non-working days the calendar observes inside this chain** (weekends are
also non-working): Jun 19, 2026 (Juneteenth); Jul 3, 2026 (Independence Day,
observed); Sep 7 (Labor Day); Oct 12 (Columbus Day); Nov 11 (Veterans Day);
Nov 26 (Thanksgiving); Dec 25, 2026; Jan 1, Jan 18, Feb 15, May 31, Jun 18 and
Jul 5, 2027. This is why Buyout finishes Thursday Jul 2 and Submittal
Coordination starts Monday Jul 6.

---

## 2. The six dependencies as originally placed (superseded by Section 0)

| ID | Dependency | Responsible party | Required by | Connected activity | Attached to | Rule that produces the date | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | Structural Attachment Requirements | Structural Engineer | Fri Jun 26, 2026 | 2 Submittal Coordination | **5 working days before the activity's START** | Start of Submittal Coordination (Jul 6) minus 5 working days | Added for Connect |
| B | Final Scope Clarification | GC / Glazing Subcontractor | Thu Jul 2, 2026 | 1 Buyout | **The activity's FINISH** | Finish of Buyout (Jul 2) | Added for Connect |
| C | Final Window & Door Design | Architect | Mon Jul 6, 2026 | 2 Submittal Coordination | **The activity's START** | Start of Submittal Coordination (Jul 6) | Shared chain data |
| D | Frame Finish & Color Selection | Owner | Mon Aug 10, 2026 | 3 Submittal Preparation | **The activity's START** | Start of Submittal Preparation (Aug 10) | Shared chain data |
| E | Final Glazing Specification | Architect | Wed Oct 14, 2026 | 6 First Revision Cycle | **The activity's START** | Start of First Revision Cycle (Oct 14) | Shared chain data |
| F | Final Field Dimensions | GC / Glazing Subcontractor | Mon Nov 30, 2026 | 13 Release for Fabrication | **2 working days before a MILESTONE** | Release for Fabrication (Dec 2) minus 2 working days | Added for Connect |

- **The animation's connection point is the required-by date.** Each diamond
  is drawn on the chain at that calendar date. No position is set by hand.
- **C, D and E** are the original three. Their rule is the schedule model's
  default: required on the first day of the activity they support.
- **A, B and F** were added on 2026-11-11. Their rules, including the "5" and
  the "2", were my choices and have not been approved.

---

## 3. Combined placement worksheet (original placements; superseded by Section 0)

The chain and the dependencies on one timeline. Dependency rows are marked ▶.

| Date | Chain event | Dependency due | Days since previous dependency |
| --- | --- | --- | --- |
| Thu Jun 4, 2026 | 1 Buyout starts | | |
| Fri Jun 26, 2026 | (Buyout, working day 16 of 20) | ▶ **A** Structural Attachment Requirements, for Submittal Coordination | |
| Thu Jul 2, 2026 | 1 Buyout finishes | ▶ **B** Final Scope Clarification, for Buyout | 4 working days after A |
| Mon Jul 6, 2026 | 2 Submittal Coordination starts | ▶ **C** Final Window & Door Design, for Submittal Coordination | 1 working day after B |
| Fri Aug 7, 2026 | 2 Submittal Coordination finishes | | |
| Mon Aug 10, 2026 | 3 Submittal Preparation starts | ▶ **D** Frame Finish & Color Selection, for Submittal Preparation | 25 working days after C |
| Mon Sep 21, 2026 | 3 Submittal Preparation finishes; **Initial Submittal** | | |
| Tue Sep 22, 2026 | 5 First Submittal Review starts | | |
| Tue Oct 13, 2026 | 5 First Submittal Review finishes | | |
| Wed Oct 14, 2026 | 6 First Revision Cycle starts | ▶ **E** Final Glazing Specification, for First Revision Cycle | 45 working days after D |
| Thu Oct 29, 2026 | 6 First Revision Cycle finishes; **First Resubmittal** | | |
| Fri Oct 30, 2026 | 8 Second Submittal Review starts | | |
| Fri Nov 13, 2026 | 8 Second Submittal Review finishes | | |
| Mon Nov 16, 2026 | 9 Second Revision Cycle starts | | |
| Tue Nov 24, 2026 | 9 Second Revision Cycle finishes; **Second Resubmittal** | | |
| Wed Nov 25, 2026 | 11 Third Submittal Review starts | | |
| Mon Nov 30, 2026 | (Third Submittal Review, working day 3 of 5) | ▶ **F** Final Field Dimensions, for Release for Fabrication | 31 working days after E |
| Wed Dec 2, 2026 | 11 Third Submittal Review finishes; **Final Approval**; **Release for Fabrication** | | |
| Thu Dec 3, 2026 | 14 Fabrication starts | | |
| Fri Aug 20, 2027 | 14 Fabrication finishes | | |
| Mon Aug 23, 2027 | 15 Shipping and Delivery starts | | |
| Wed Sep 1, 2027 | 15 Shipping and Delivery finishes; **Required On Site** | | |

### Clustering

| Cluster | Dependencies | Span | Share of the chain |
| --- | --- | --- | --- |
| **Early cluster** | A (Jun 26), B (Jul 2), C (Jul 6) | 5 working days from A to C | Three of the six dependencies fall in under 2% of the 312 working days |
| Spread | D (Aug 10), E (Oct 14), F (Nov 30) | 76 working days from D to F | |
| **Nothing after Dec 2, 2026** | | | No dependency is attached to Fabrication or Shipping and Delivery, which are 188 of the 312 working days (60%) |

- All six dependencies fall in the first 122 working days. The last 188 have
  none.
- In the animation, the early cluster is why the first three cards appear
  almost together: the camera barely moves between them.
- Activities with no dependency: First Submittal Review, Second Submittal
  Review, Second Revision Cycle, Third Submittal Review, Fabrication, Shipping
  and Delivery.

---

## 4. Possible construction-logic conflicts

These are flagged for your judgment. Nothing has been corrected.

### A. Structural Attachment Requirements (Structural Engineer, Jun 26, for Submittal Coordination)

- **It is attached to Submittal Coordination, but it falls during Buyout.** It
  is due on working day 16 of Buyout's 20, ten days before the activity it is
  labelled as supporting begins.
- **Should it support Buyout instead?** Attachment, movement and support
  conditions can affect the subcontractor's price and scope. If the glazing
  subcontract cannot be bought out without them, this is required before
  Buyout starts (Jun 4) or early within it, not on Jun 26.
- **Or is it a coordination input?** If it is needed for the shop drawings
  rather than for pricing, it could be required at the start of Submittal
  Coordination, or even of Submittal Preparation.
- **The "5 working days" is arbitrary.** I chose it to place this dependency
  before Final Window & Door Design, as you asked, while keeping it attached to
  Submittal Coordination. No schedule fact produces the number 5.

### B. Final Scope Clarification (GC / Glazing Subcontractor, Jul 2, for Buyout)

- **It is due on the last day of the activity it supports.** As drawn, the
  scope is clarified on the same day the subcontract is completed. If the
  clarification is an input to negotiating the subcontract, it belongs earlier:
  before Buyout starts, or some days before it finishes.
- **It is the only dependency attached to a FINISH.** The schedule model
  defines a dependency as something an activity cannot start without, required
  by that activity's start. "By the finish" is a different relationship and is
  not expressible in the shared model.
- **The responsible party includes the GC.** The shared model defines a
  commitment as an obligation outside the General Contractor's control. A
  requirement the GC owes itself may be better described as an internal task
  than as a dependency. This also applies to F.

### C. Final Window & Door Design (Architect, Jul 6, for Submittal Coordination)

- **Is the design needed before Buyout?** The subcontract is bought out
  Jun 4 to Jul 2, but the final design is not due until Jul 6. If the
  subcontractor prices and contracts against the final design, this is
  required before Buyout starts, about a month earlier.
- If Buyout proceeds on design-development documents and the final design is
  only needed for shop drawings, the current placement is right.

### D. Frame Finish & Color Selection (Owner, Aug 10, for Submittal Preparation)

- **Plausible as placed:** the finish must be known to prepare the submittal.
- **Check:** whether finish affects price or lead time enough that it is
  needed at Buyout, and whether the Owner's selection really can wait until
  after five weeks of coordination.

### E. Final Glazing Specification (Architect, Oct 14, for First Revision Cycle)

- **This is the one most worth questioning.** The glazing specification is not
  due until after the Initial Submittal (Sep 21) and after the architect's
  First Submittal Review (finishes Oct 13). The shop drawings are therefore
  prepared, submitted and reviewed without a final glazing specification.
- If glazing make-up affects frame depth, weight, attachment or cost, it is
  needed for Submittal Preparation (Aug 10) or earlier.
- As placed it reads as a late design decision absorbed in a revision cycle.
  That may be a realistic story, but it is closer to a Control story (a late
  input causing a revision) than a planned requirement.

### F. Final Field Dimensions (GC / Glazing Subcontractor, Nov 30, for Release for Fabrication)

- **It lands in the middle of the architect's Third Submittal Review.** It is
  due on working day 3 of that 5-day review, two working days before Final
  Approval and Release for Fabrication, which share Dec 2.
- **Can openings be measured in the field by late 2026?** The windows are
  required on site Sep 1, 2027. Whether the structure and rough openings exist
  nine months earlier depends on the construction schedule, which this chain
  does not contain. If they do not, fabrication would have to be released on
  guaranteed dimensions and this dependency would not belong here.
- **Should it precede the final review?** If field dimensions change the shop
  drawings, they are needed before the last resubmittal (Nov 24), not after it.
- **The "2 working days" is arbitrary.** I chose it only so the marker does not
  sit on top of the two milestone markers on Dec 2.

### Across all six

- **Four of the six are attached to a start; one to a finish; one to a
  milestone with an offset.** Three different conventions in six items.
- **Two activities each support two dependencies** only loosely: Submittal
  Coordination is named by both A and C.
- **Nothing is attached to Fabrication or delivery.** Site access, storage,
  installation readiness or delivery coordination are the kinds of requirement
  that would fall there, if you want the dependencies to span the chain.
- **The three additions are not in the shared schedule data.** If the approved
  set should become part of the product's representative data, that is a
  separate decision, because the shared model does not allow a General
  Contractor owner.

---

## 5. Placement worksheet: your corrections

> **Completed.** The decisions are recorded in Section 0. The blank table
> below is kept as the form that was offered.

Fill in the three **PROPOSED** columns. Leave a row blank to keep it as it is.
Write "remove" in the first proposed column to drop a dependency. Add rows at
the bottom for new ones.

| ID | Dependency | Responsible party | CURRENT: supports | CURRENT: needed before | CURRENT: lead | CURRENT: date | PROPOSED: supports (activity # from Section 1) | PROPOSED: needed before (START or FINISH) | PROPOSED: lead (working days before, 0 = on that day) | Resulting date (I will fill in) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | Structural Attachment Requirements | Structural Engineer | 2 Submittal Coordination | START | 5 | Jun 26, 2026 | | | | |
| B | Final Scope Clarification | GC / Glazing Subcontractor | 1 Buyout | FINISH | 0 | Jul 2, 2026 | | | | |
| C | Final Window & Door Design | Architect | 2 Submittal Coordination | START | 0 | Jul 6, 2026 | | | | |
| D | Frame Finish & Color Selection | Owner | 3 Submittal Preparation | START | 0 | Aug 10, 2026 | | | | |
| E | Final Glazing Specification | Architect | 6 First Revision Cycle | START | 0 | Oct 14, 2026 | | | | |
| F | Final Field Dimensions | GC / Glazing Subcontractor | 13 Release for Fabrication | MILESTONE | 2 | Nov 30, 2026 | | | | |
| G | *(new, optional)* | | | | | | | | | |
| H | *(new, optional)* | | | | | | | | | |

**Other decisions to record here:**

| Question | Your decision |
| --- | --- |
| Responsible-party wording for B and F: "GC / Glazing Subcontractor", "General Contractor / Glazing Subcontractor", or one party only? | |
| May a dependency be due before the chain's first day (Jun 4, 2026)? The animation's calendar begins in May 2026, so a few weeks earlier can be shown. | |
| Minimum spacing you want between neighbouring dependencies, if any (the animation shows one card at a time, so close dates are possible but read as a cluster). | |
| Should any dependency fall during Fabrication or Shipping and Delivery? | |
| Should the approved set be added to the shared schedule data, or stay in Connect only? | |

---

## 6. How to specify a placement

Give three things for each dependency. I derive the date; you never specify a
date or a position directly.

1. **The activity it supports.** Use the number from Section 1, for example
   `3 Submittal Preparation`. A milestone can be named too, for example
   `13 Release for Fabrication`.
2. **Whether it must be satisfied before that activity STARTS or FINISHES.**
   - *START* means the activity cannot begin without it. This is the schedule
     model's own rule and the one the original three use.
   - *FINISH* means the activity can begin but cannot be completed without it.
   - For a milestone, START and FINISH are the same date.
3. **The lead, in working days.** How many working days before that start or
   finish it is required. `0` means on that day. The calendar skips weekends
   and the holidays listed in Section 1.

**Example.** "Structural Attachment Requirements: supports 1 Buyout, needed
before START, lead 0" gives Thursday, June 4, 2026. "Final Glazing
Specification: supports 3 Submittal Preparation, needed before START, lead 10"
gives Monday, July 27, 2026.

### Date lookup

Dates for the most common choices, computed on the chain's working-day
calendar. Any other lead can be derived the same way.

| # | Activity | START (lead 0) | START, lead 5 | START, lead 10 | FINISH (lead 0) | FINISH, lead 5 | FINISH, lead 10 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Buyout | Jun 4, 2026 | May 28, 2026 | May 20, 2026 | Jul 2, 2026 | Jun 25, 2026 | Jun 17, 2026 |
| 2 | Submittal Coordination | Jul 6, 2026 | Jun 26, 2026 | Jun 18, 2026 | Aug 7, 2026 | Jul 31, 2026 | Jul 24, 2026 |
| 3 | Submittal Preparation | Aug 10, 2026 | Aug 3, 2026 | Jul 27, 2026 | Sep 21, 2026 | Sep 14, 2026 | Sep 4, 2026 |
| 5 | First Submittal Review | Sep 22, 2026 | Sep 15, 2026 | Sep 8, 2026 | Oct 13, 2026 | Oct 5, 2026 | Sep 28, 2026 |
| 6 | First Revision Cycle | Oct 14, 2026 | Oct 6, 2026 | Sep 29, 2026 | Oct 29, 2026 | Oct 22, 2026 | Oct 15, 2026 |
| 8 | Second Submittal Review | Oct 30, 2026 | Oct 23, 2026 | Oct 16, 2026 | Nov 13, 2026 | Nov 5, 2026 | Oct 29, 2026 |
| 9 | Second Revision Cycle | Nov 16, 2026 | Nov 6, 2026 | Oct 30, 2026 | Nov 24, 2026 | Nov 17, 2026 | Nov 9, 2026 |
| 11 | Third Submittal Review | Nov 25, 2026 | Nov 18, 2026 | Nov 10, 2026 | Dec 2, 2026 | Nov 24, 2026 | Nov 17, 2026 |
| 13 | Release for Fabrication (milestone) | Dec 2, 2026 | Nov 24, 2026 | Nov 17, 2026 | same | same | same |
| 14 | Fabrication | Dec 3, 2026 | Nov 25, 2026 | Nov 18, 2026 | Aug 20, 2027 | Aug 13, 2027 | Aug 6, 2027 |
| 15 | Shipping and Delivery | Aug 23, 2027 | Aug 16, 2027 | Aug 9, 2027 | Sep 1, 2027 | Aug 25, 2027 | Aug 18, 2027 |

Milestones 4, 7, 10, 12 and 16 share the finish date of the activity before
them (Sep 21, Oct 29, Nov 24, Dec 2, 2026 and Sep 1, 2027).

### What happens to your answers

- Each dependency's date will be computed from the activity, the START or
  FINISH choice and the lead, by the same scheduling calendar the chain uses.
- The diamond, the connector and the card move to that date automatically.
- The card's last line will read "*responsible party* · for *activity*", using
  the activity you name.
- The rail lists the dependencies in required-by order, so its order follows
  your dates.
- No chain activity, date or duration changes.
- One limit to know: two dependencies on the same date would put two diamonds
  on the same point. If you want that, say so and I will propose how to show
  it.
