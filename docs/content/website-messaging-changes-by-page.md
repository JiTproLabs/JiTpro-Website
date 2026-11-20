# Website Messaging Changes, by Page

GitHub issue: [#86](https://github.com/JiTproLabs/JiTpro-Website/issues/86). Branch: `issue-86-website-messaging-audit`.

**Status (updated 2026-11-20):** first pass complete. 22 of the 23 changes are **Implemented** and live on `main` (squash commit `7d385f7`, PR [#87](https://github.com/JiTproLabs/JiTpro-Website/pull/87)). Only L6 (Product) is still **Proposed**. This branch is kept open for the remaining messaging work; it was brought level with `main` on 2026-11-20.

## Where we left off, and next steps

**How we work.** The founder marks a section **Approved** here (editing the copy if needed) and saves the file. Claude implements the exact approved text, relabels the section **Implemented**, and strikes through its `###` heading. When a batch is done, the branch goes to `main` through a squash-merged PR.

**Done (first pass):** Home (H9, M2), About (H1, M1), General Contractors (H3, H5, H6, H4, M3, H7), Owners and Developers (H8), Founder Story (H2), FAQ (M4, L2, L3, L4), Learn More (L5), How It Works (M5, L7), Why (L1, M6, M7).

**Next steps, in suggested order:**
1. **L6, Product page.** Review and approve, edit, or withdraw (Section 11 below).
2. **R1, the two new sentences.** Decide whether to add them now or later (Open question, at the end).
3. **Design System records.** Several entries still quote the old copy and need updating to match what is live: the Decision Log entry of 2026-11-13, §20.1 (homepage copy), §58 (the GC brush underline now sits under *prevent it*, not *coming*), §74, and the §10 vocabulary, verbs and service name (*JiTpro Project Readiness Engagement*). The proposed additions are in Section 10 of `website-messaging-recommendations.md`.
4. **Second pass: the 10 unlinked pages.** Preserved under Q3 and not yet reviewed. Do not delete, redirect, hide or change their indexing.
5. **Later, separate projects (not this branch):** the 13 software-positioning flags (Future Software-Positioning Project), investor pages (Q6), and SEO and metadata (Q7), including the GC page's meta description.

**Note on line numbers.** The file references below were taken from `main` at `2dd13fe`, before the first pass. For the implemented sections, the live copy is now the **Approved** text.

**Source documents:**
- `website-messaging-recommendations.md` gives the reasoning, the messaging principles and the deferred findings.
- `website-problem-language-audit.md` holds the full occurrence inventory.

**Conventions:**
- Line numbers refer to `main` at `2dd13fe`.
- **Existing** is the current copy and **Proposed** is the replacement, both shown in their full paragraph.
- Proposed copy contains no em dashes.

## Summary

There are 23 recommended changes: 9 high, 7 medium and 7 low. They are ordered by implementation sequence: homepage, About, role pages, then the other linked pages.

| # | Page | Changes | High | Medium | Low | IDs |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | Home (`/`) | 2 | 1 | 1 | 0 | H9, M2 |
| 2 | About (`/about`) | 2 | 1 | 1 | 0 | H1, M1 |
| 3 | General Contractors (`/roles/general-contractors`) | 6 | 5 | 1 | 0 | H3, H5, H6, H4, M3, H7 |
| 4 | Owners and Developers (`/roles/owners-developers`) | 1 | 1 | 0 | 0 | H8 |
| 5 | Architects and Engineers (`/roles/architects-engineers`) | 0 | 0 | 0 | 0 | none |
| 6 | Founder Story (`/founder-story`) | 1 | 1 | 0 | 0 | H2 |
| 7 | FAQ (`/faq`) | 4 | 0 | 1 | 3 | M4, L2, L3, L4 |
| 8 | Learn More (`/learn-more`) | 1 | 0 | 0 | 1 | L5 |
| 9 | How It Works (`/how-it-works`, footer) | 2 | 0 | 1 | 1 | M5, L7 |
| 10 | Why (`/why`, footer) | 3 | 0 | 2 | 1 | L1, M6, M7 |
| 11 | Product (`/product`, footer) | 1 | 0 | 0 | 1 | L6 |
| | **Total** | **23** | **9** | **7** | **7** | |

The IDs match the recommendations document: H is high, M is medium and L is low priority. Within each page, changes are listed in the order they appear on the page.

**Approved: Retain Existing Copy.** Do not change these.
- **Homepage hero:** *Broken schedules? Broken promises? Broken profits?*
- **Owners and Developers:** the whole *Where problems begin* section.

**Not part of this work:**
- the investor pages, deferred to the Future Investor Website Project;
- the ten unlinked pages, deferred to Second-Pass Review;
- software-platform wording, flagged for the Future Software-Positioning Project;
- SEO and metadata.

---

## 1. Home (`/`)

**Approved: Retain Existing Copy.** The hero, *Broken schedules? Broken promises? Broken profits?* (`src/components/home/ProfitHero.tsx:94`), stays exactly as written.

### ~~H9. *Fewer surprises. More control.*: the first benefit~~

- **File:** `src/components/home/FewerSurprisesSection.tsx:36`
- **Priority:** High

**Existing**
> **Fewer surprises. More control. Keep more of the profit you've earned.**
>
> **See problems earlier.** Identify procurement problems before they disrupt the field.
> **Manage change.** Understand what changed and how it affects your project.
> **Keep the record.** Know what happened, who was responsible, and why, without reconstructing the story six months later.

**Implemented**
> **Fewer surprises. More control. Keep more of the profit you've earned.**
>
> **Know the needs. Control the process.** Identify the decisions, approvals, and commitments the field depends on, and when each one is due.
> **Manage change as it happens.** Understand what changed and how it affects your project.
> **Keep the record.** Know what happened, who was responsible, and why, without reconstructing the story six months later.

**Why it's needed.** The heading promises control, and the first benefit then sells finding problems. It also uses *procurement*, which homepage copy avoids (Design System §20.1).

**What it communicates better.** The first benefit becomes the control work itself, in plain words.

### ~~M2. *Start with one project*: staying involved~~

- **File:** `src/components/home/ThroughoutProjectSection.tsx:45`
- **Priority:** Medium

**Existing**
> **Plan early. Stay involved.**
> We do the detailed procurement planning up front, then help your team stay ahead of decisions, commitments, and potential problems throughout the project.

**Implemented**
> **Plan early. Stay involved.**
> We do the detailed planning up front, then stay with your team through construction, with weekly guidance that keeps decisions, commitments, and open items on schedule.

**Why it's needed.** This is the homepage's only statement that JiTpro's work continues, and it ends on *potential problems*.

**What it communicates better.** It names the ongoing service, weekly guidance through construction, and uses the approved vocabulary (*open items*). *Procurement* is dropped to follow §20.1.

---

## 2. About (`/about`)

### ~~H1. Hero: the service description~~

- **File:** `src/pages/About.tsx:83`
- **Priority:** High

**Existing**
> JiTpro is a hands-on construction procurement and project-readiness service built by contractors, for contractors.
>
> We work side by side with you and your team to dig into the details, uncover problems before they reach the field, and put the planning, coordination, and accountability in place to protect your schedule, your profits, and your people.

**Implemented**
> JiTpro is a hands-on construction procurement and project-readiness service built by contractors, for contractors.
>
> We work side by side with you and your team to dig into the details, establish what's needed, who's responsible, and when each step must happen, so the field has what it needs to keep the project moving.

>Our goal is to protect your schedule, your profits, and your people.

**Why it's needed.** This is the site's definition of the company, and *uncover problems* sells detection.

**What it communicates better.** It names the real work: what is needed, who is responsible, and when.

### ~~M1. Hero: the closing statement~~

- **File:** `src/pages/About.tsx:91-92`
- **Priority:** Medium

**Existing**
> No new software to master. No additional full-time staff to hire. Just experienced professionals helping you get ahead of the problems that have held your projects back.

**Implemented**
> No new software to master. No additional full-time staff to hire. Just experienced professionals helping your team take precise upstream control to prevent compounding downstream schedule disruptions.

**Why it's needed.** The amber-barred statement is the hero's last word, and it ends on problems.

**What it communicates better.** It keeps the contrast with software and staffing, and ends on control and readiness.

---

## 3. General Contractors (`/roles/general-contractors`)

File: `src/pages/roles/GeneralContractors.tsx`. The changes are listed in page order: *We bring clarity to complexity*, the possibility section, *How we help*, then the closing offer.

### ~~H3. *We bring clarity to complexity*: what JiTpro does~~

- **File:** `GeneralContractors.tsx:407`
- **Priority:** High

**Existing**
> At JiTpro, we go deeper into the details of your project to uncover problems that traditional management practices often miss, long before they disrupt your schedule, exhaust your people, and consume your profits.
>
> We bring clarity to complexity.
>
> We identify what's needed, who's responsible, and when it needs to happen, so your team can prevent problems instead of constantly recovering from them.

**Implemented**
> At JiTpro, we go deeper into the details of your project to establish what the field will need, what must happen to make it ready, and who is responsible for each step, long before a missed requirement can disrupt your schedule, exhaust your people, and consume your profits.
>
> We bring clarity to complexity.
>
> We identify what's needed, who's responsible, and when it needs to happen, so your team can prevent problems instead of constantly recovering from them.

**Why it's needed.** It presents JiTpro as a detection service that finds what other methods *miss*.

**What it communicates better.** It follows the governing principle almost word for word. *A missed requirement* names the real cause of disruption. The consequences and the third paragraph are kept.

### ~~H5. The possibility section: heading and first paragraph~~

- **File:** `GeneralContractors.tsx:765` (h2) and `:65` (the first *Imagine* paragraph)
- **Priority:** High

**Existing**
> **What if you could see the problems coming?**
>
> Imagine knowing months in advance which decisions, approvals, products, and commitments could threaten your construction schedule.
>
> Imagine your owner knowing exactly when selections are required and why. Your architect knowing which information must be released. Your trade partners knowing what is expected and when.
>
> Imagine your project managers spending less time chasing answers and your superintendents spending more time building.

**Implemented** (heading shortened to fit, at the founder's direction; the brush underline is under *prevent it*. Approved long form: *What if you knew exactly what threatened your schedule, who was responsible, and what needed to happen to prevent it?*)
> **What if you knew what's at risk, who owns it, and how to prevent it?**
>
> Imagine knowing months in advance which decisions, approvals, products, and commitments your construction schedule depends on, and when each one is due.
>
> Imagine your owner knowing exactly when selections are required and why. Your architect knowing which information must be released. Your trade partners knowing what is expected and when.
>
> Imagine your project managers spending less time chasing answers and your superintendents spending more time building.

**Why it's needed.** The headline sells seeing problems, and the first paragraph calls normal requirements threats.

**What it communicates better.** It makes the same promise of foresight, now aimed at requirements and dates; an open item is not a problem. The brush underline stays on *coming*.

### ~~H6. The Reactive and Proactive comparison: the Proactive heading~~

- **File:** `GeneralContractors.tsx:667`
- **Priority:** High

**Existing**
> **Reactive.** Problems discovered in the field.
> Late decisions and approvals · Missing or incomplete products · Crews waiting and being reallocated · Schedule and profit at risk
>
> **Proactive.** Problems identified early enough to act.
> Decisions and approvals on time · Right products, ready when needed · Crews working productively · Schedule and profit protected

**Implemented**
> **Reactive.** Problems materialize in the field.
> Late decisions and approvals · Missing or incomplete products · Crews waiting and being reallocated · Schedule and profit at risk
>
> **Proactive.** Requirements managed upstream.
> Decisions and approvals on time · Right products, ready when needed · Crews working productively · Schedule and profit protected

**Why it's needed.** The Reactive side is accurate and stays. The Proactive side currently offers the same problems, only found sooner.

**What it communicates better.** Proactive becomes a different way of working, which is what its points already describe.

### ~~H4. *How we help*: step 1 title~~

- **File:** `GeneralContractors.tsx:72`
- **Priority:** High

**Existing**
> **We uncover the hidden risks.**
> We examine project scope, products, materials, services, and the information required to procure them. We identify gaps and unresolved conditions before they become field problems.

**Implemented**
> **We define what the project needs.**
> We examine project scope, products, materials, services, and the information required to procure them. We identify gaps and unresolved conditions before they become field problems.

**Why it's needed.** Only the title is detection-framed; the body is already right.

**What it communicates better.** The four steps now read as one process:
1. *We define what the project needs.*
2. *We establish clear commitments.*
3. *We bring order to the priorities.*
4. *We help your team stay ahead.*

### ~~M3. *How we help*: step 4 body~~

- **File:** `GeneralContractors.tsx:85`
- **Priority:** Medium

**Existing**
> **We help your team stay ahead.**
> We make emerging risks visible so your team can act while options remain, rather than paying to recover after disruptions occur.

**Implemented**
> **We help your team stay ahead.**
> Each week, we show your team what needs attention now and what is coming next, so open items get resolved while options remain, rather than paying to recover after disruptions occur.

**Why it's needed.** The step that should describe JiTpro's ongoing role describes risk visibility instead.

**What it communicates better.** It describes the weekly guidance the engagement actually provides.

### ~~H7. The closing offer~~

- **File:** `GeneralContractors.tsx:1068`
- **Priority:** High

**Existing**
> You don't have to overhaul your entire company to begin changing how you build.
>
> JiTpro starts with a Project Readiness Engagement. We take a detailed look at one project, identify the risks and missing commitments, and establish a structured procurement plan to help your team get ahead of them.

**Implemented**
> You don't have to overhaul your entire company to begin changing how you build.
>
> It starts with a JiTpro Project Readiness Engagement on one project. We work with your team to identify what the project needs, establish who is responsible for each requirement and when it is due, and build the procurement plan your team works from. Then we stay with the project, giving your team weekly guidance on what needs attention now and what is coming next.

**Why it's needed.** The existing paragraph reads as a one-time review, which the founder ruled out (Q2).

**What it communicates better.** It uses the official service name and says what the engagement includes: requirements, responsibility, dates, a plan, and ongoing weekly guidance.

---

## 4. Owners and Developers (`/roles/owners-developers`)

**Approved: Retain Existing Copy.** The whole *Where problems begin* section (`OwnersDevelopers.tsx:223-339`) stays as written, including:
- its heading;
- its paragraphs;
- *How one unanswered question becomes a project problem*.

### ~~H8. The *better way* section heading~~

- **File:** `src/pages/roles/OwnersDevelopers.tsx:443`
- **Priority:** High

**Existing**
> **Imagine a contractor who sees problems coming before you do.**
>
> A contractor who knows what decisions you'll need to make months before they're required.
>
> Who identifies missing information before it delays materials, equipment, or construction.
>
> Who coordinates with your architect, engineers, consultants, and trade partners so everyone knows what's needed, who's responsible, and when it needs to happen.

**Implemented**
> **Imagine a contractor who knows what's coming before you have to ask.**
>
> A contractor who knows what decisions you'll need to make months before they're required.
>
> Who identifies missing information before it delays materials, equipment, or construction.
>
> Who coordinates with your architect, engineers, consultants, and trade partners so everyone knows what's needed, who's responsible, and when it needs to happen.

**Why it's needed.** The heading sells problem detection, while the paragraphs under it already describe requirements and coordination.

**What it communicates better.** It matches the paragraphs and speaks to what an owner wants: a contractor who plans ahead and keeps them informed.

---

## 5. Architects and Engineers (`/roles/architects-engineers`)

**No changes.** The page's problem language is accurate. It includes:
- the hero's pain line, *a cycle of problems that could have been anticipated*;
- the model statement, *The problem isn't the work being requested. It's the lack of early visibility that turns predictable needs into urgent demands.*

---

## 6. Founder Story (`/founder-story`)

### ~~H2. The statement of purpose~~

- **File:** `src/pages/FounderStory.tsx:202`, following line 200
- **Priority:** High

**Existing**
> By the time the field discovers the problem, the best opportunity to prevent it has often passed.
>
> A practical, repeatable way to help general contractors look deeper into their projects, uncover problems earlier, and bring clarity and accountability to the work that must happen before construction can proceed as planned.

**Implemented**
> The greatest opportunity to protect your schedule comes long before work reaches the field.

>JiTpro gives general contractors a practical, repeatable way to establish exactly what needs to happen, who is responsible, and when it must be done, bringing clarity, control, and accountability to the work that keeps construction moving as planned.

**Why it's needed.** It is the founder's own account of what JiTpro is, and it currently describes finding problems sooner.

**What it communicates better.** The field discovers problems, while JiTpro identifies, assigns and times the work.

---

## 7. FAQ (`/faq`)

File: `src/content/faqContent.ts`. The FAQ page also publishes these answers as structured data. That happens automatically and needs no separate work under this issue.

### ~~L2. *What exactly does JiTpro do?*~~

- **File:** `faqContent.ts:39`
- **Priority:** Low

**Existing**
> We start by identifying the products, materials, and services your project needs. Then we uncover the information, decisions, approvals, and other requirements needed to get everything ready for construction.

**Implemented**
> We start by identifying the products, materials, and services your project needs. Then we establish the information, decisions, approvals, and other requirements needed to get everything ready for construction.

**Why and what it communicates better.** Requirements are established, not uncovered.

### ~~M4. *How does JiTpro help protect our schedule and profits?*: the last paragraph~~

- **File:** `faqContent.ts:73`
- **Priority:** Medium

**Existing**
> By identifying and addressing problems early, JiTpro helps protect your schedule, your people, and the profits you've earned.

**Implemented**
> By identifying requirements early, assigning responsibility, and controlling the sequence, JiTpro helps protect your schedule, your people, and the profits you've earned.

**Why it's needed.** The answer's conclusion credits *identifying and addressing problems*.

**What it communicates better.** It restates the control work described earlier in the same answer.

### ~~L3. *What does working with JiTpro actually look like?*~~

- **File:** `faqContent.ts:100`
- **Priority:** Low

**Existing**
> We uncover missing information, establish responsibilities, and develop a detailed procurement plan that sequences the work around when everything is needed on site.

**Implemented**
> We identify missing information, establish responsibilities, and develop a detailed procurement plan that sequences the work around when everything is needed on site.

**Why and what it communicates better.** It uses a control verb in place of *uncover*.

### ~~L4. *Will JiTpro replace our project management team?*~~

- **File:** `faqContent.ts:123`
- **Priority:** Low

**Existing**
> JiTpro takes that work off their shoulders, getting started immediately to identify requirements, uncover missing information, and establish a properly sequenced procurement plan.

**Implemented**
> JiTpro takes that work off their shoulders, getting started immediately to identify requirements, define missing information, and establish a properly sequenced procurement plan.

**Why and what it communicates better.** It uses a control verb in place of *uncover*. The next paragraph already says JiTpro stays involved.

---

## 8. Learn More (`/learn-more`)

### ~~L5. *Who it's for*: the first sentence~~

- **File:** `src/components/learn-more/WhoSection.tsx:50`
- **Priority:** Low

**Existing**
> JiTpro is preventive. It is at its most useful on a project early enough that decisions, information, and commitments can still be worked, for a contractor who has paid for preventable problems before and does not want to repeat it on the next one.

**Implemented**
> JiTpro works ahead of the field. It is at its most useful on a project early enough that decisions, information, and commitments can still be worked, for a contractor who has paid for preventable problems before and does not want to repeat it on the next one.

**Why and what it communicates better.** It defines JiTpro by when and how it works, not by prevention alone.

---

## 9. How It Works (`/how-it-works`, footer)

File: `src/pages/HowItWorks.tsx`. Both changes are in phase 01, *Assess the Project*. The page's software wording (*board*, *dashboard*) is flagged for the Future Software-Positioning Project and is not changed here.

### ~~M5. Phase 01 description~~

- **File:** `HowItWorks.tsx:9`
- **Priority:** Medium

**Existing**
> JiTpro reviews the drawings, specifications, schedule, and procurement strategy—looking for long-lead items, missing decisions, coordination risks, constraints, and schedule exposure before any of it can impact construction.
>
> The assessment answers the question every GC should be able to answer at award, and almost never can: where is this job already exposed?

**Implemented**
> JiTpro reviews the drawings, specifications, schedule, and procurement strategy to establish what the project will need, when the field needs it, and what must happen first: long-lead items, open decisions, coordination requirements, and constraints.
>
> The assessment answers the question every GC should be able to answer at award, and almost never can: where is this job already exposed?

**Why it's needed.** *Looking for … risks … exposure* frames the first phase as an inspection.

**What it communicates better.** Phase 01 becomes the start of planning, which fits the phases that follow.

### ~~L7. Phase 01 deliverable name~~

- **File:** `HowItWorks.tsx:13`
- **Priority:** Low

**Existing**
> Deliverables: Executive Procurement Risk Assessment · Initial Constraint Register · Priority Action List

**Implemented**
> Deliverables: Project Readiness Assessment · Initial Constraint Register · Priority Action List

**Why and what it communicates better.** This is a deliverable within the engagement, not the service name. The new name matches the JiTpro Project Readiness Engagement and drops *risk*.

---

## 10. Why (`/why`, footer)

File: `src/pages/Why.tsx`.

### ~~L1. *What JiTpro does*: card title~~

- **File:** `Why.tsx:53`
- **Priority:** Low

**Existing**
> **Exposes risk while it can still be controlled**
> Margin threats show up while there is still time to act—not after the recovery has started.

**Implemented** (title only; the body is unchanged)
> **Takes control while there is still time to act**
> Margin threats show up while there is still time to act—not after the recovery has started.

**Why and what it communicates better.** The title now states the action, not the exposure. The body keeps its existing dash because it is existing copy that is not being changed.

### ~~M6. *What JiTpro does*: closing line~~

- **File:** `Why.tsx:226`
- **Priority:** Medium

**Existing**
> Tracking tells you where things stand. Control means the unresolved commitments on your project are visible, owned, and sequenced while there is still time to act on them.
>
> **JiTpro makes invisible risk visible before it becomes field recovery.**

**Implemented**
> Tracking tells you where things stand. Control means the unresolved commitments on your project are visible, owned, and sequenced while there is still time to act on them.
>
> **JiTpro puts those commitments under control before they turn into field recovery.**

**Why it's needed.** The page defines control, then credits JiTpro only with making things visible.

**What it communicates better.** JiTpro does what the page itself calls control.

### ~~M7. *The JiTpro philosophy*: last line~~

- **File:** `Why.tsx:250`
- **Priority:** Medium

**Existing**
> Every project begins with margin.
> Every unresolved commitment quietly spends it.
> The field simply reveals what procurement failed to control.
> JiTpro exists to make those risks visible while they can still be managed.

**Implemented** (first line corrected at the founder's direction: approved as *antipated profit expectations*, implemented as *anticipated profit* so that *spends it* still reads)
> Every project begins with anticipated profit.
> Every unresolved commitment quietly spends it.
> The field simply reveals what procurement failed to control.
> JiTpro exists to bring those commitments under control while they can still be managed.

**Why and what it communicates better.** The same issue as M6. It also uses *commitment*, as the founder approved.

---

## 11. Product (`/product`, footer)

The page's software wording (*control system*, *board*) is flagged for the Future Software-Positioning Project and is not changed here.

### L6. *The problem*: JiTpro's answer

- **File:** `src/pages/Product.tsx:124`
- **Priority:** Low

**Existing**
> Most general contractors lose margin because procurement risk is invisible until it becomes a field problem. The owner decision that slipped, the submittal waiting on an answer, the long-lead release nobody flagged—none of it shows up until the field is already paying for it.
>
> **JiTpro brings that risk forward while there is still time to act on it.**

**Proposed** (second paragraph only)
> Most general contractors lose margin because procurement risk is invisible until it becomes a field problem. The owner decision that slipped, the submittal waiting on an answer, the long-lead release nobody flagged—none of it shows up until the field is already paying for it.
>
> **JiTpro puts those open items on a plan, with an owner and a date, while there is still time to act.**

**Why and what it communicates better.** The pain paragraph is accurate and unchanged. JiTpro's answer should be control, not earlier visibility.

---

## Open question

**R1.** Should two new sentences be added during this work, or later? They add copy rather than replace it.
- **General Contractors**, *How we help*: *We start with your construction schedule, establish when the field needs each product, material, and service, and work backward through every decision, approval, and commitment required to get it there.*
- **Owners and Developers:** *We stay with the project through construction, setting weekly priorities and a three-week look-ahead.*

The 23 changes above stand either way.
