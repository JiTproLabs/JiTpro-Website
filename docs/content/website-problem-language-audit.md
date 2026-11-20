# Website Messaging Audit: Problems vs. Upstream Control

GitHub issue: [#86](https://github.com/JiTproLabs/JiTpro-Website/issues/86). Branch: `issue-86-website-messaging-audit`, from `main` at `2dd13fe` (2026-11-20).

**Status: revised 2026-11-20 after the founder's decisions on Q1 to Q8; ready for final founder review.** This is an audit only. No website copy, component, style, route or configuration was changed.

The recommendations, with every proposed change in its full paragraph, are in `website-messaging-recommendations.md`.

How this document is organised:
- **Part 1** records the founder decisions and the revised dispositions.
- **Part 2** preserves the original audit findings unchanged.
- **Part 3** is the complete occurrence inventory. For every line it shows both the original recommendation and the revised disposition, so no finding is lost.

---

# Part 1. Revision: founder decisions and revised dispositions

## 1.1 Founder decisions (2026-11-20)

| # | Decision |
| --- | --- |
| Q1 | **Stage vocabulary approved:** requirement, open item, constraint, risk and impact, with commitment as a separate management idea. No forced progression; an ordinary unresolved requirement is not automatically a problem. The Design System is not changed in this task. |
| Q2 | **Official service name: JiTpro Project Readiness Engagement.** An assessment may be part of it; copy must not imply a one-time inspection. |
| Q3 | **The ten unlinked pages are preserved.** Their review is deferred to a second pass; no deletion, redirect, hiding, rewrite or indexing change. Label: **Deferred: Second-Pass Review**. |
| Q4 | **Footer-linked pages are in first-pass scope** for problem-detection language. Software-platform language is listed separately, with no rewrite. Label: **Flagged: Future Software-Positioning Project**. |
| Q5 | **Owners *Where problems begin*: Approved: Retain Existing Copy**, the whole section. |
| Q6 | **Investor pages excluded.** Label: **Deferred: Future Investor Website Project**. |
| Q7 | **SEO and metadata are out of scope** for Issue #86. |
| Q8 | **Homepage hero *Broken schedules? Broken promises? Broken profits?*: Approved: Retain Existing Copy**, exactly as written. |

## 1.2 Revised dispositions

Every one of the 327 relevant lines (411 occurrences) from the original audit now has exactly one revised disposition.

| Revised disposition | Lines | Occurrences |
| --- | ---: | ---: |
| Change (recommended) | 23 | 39 |
| Keep (accurate as written) | 163 | 208 |
| Approved: Retain Existing Copy | 10 | 12 |
| Flagged: Future Software-Positioning Project | 4 | 5 |
| Deferred: Second-Pass Review | 79 | 94 |
| Deferred: Future Investor Website Project | 48 | 53 |
| **Total** | **327** | **411** |

**Recommended changes by priority:** 9 high, 7 medium, 7 low (23 in total).

One of them, H5, also covers a companion line with no search term, `GeneralContractors.tsx:65`. That line is not in the inventory and is not counted.

### How the original recommendations moved

| Original recommendation | Revised disposition | Lines |
| --- | --- | ---: |
| Change | Change | 21 |
| Change | Keep (withdrawn) | 8 |
| Change | Approved: Retain Existing Copy | 1 |
| Review | Change | 2 |
| Review | Keep | 3 |
| Review | Flagged: Future Software-Positioning Project | 4 |
| Review | Deferred: Future Investor Website Project | 9 |
| Archive | Deferred: Second-Pass Review | 75 |
| Keep | Keep | 152 |
| Keep | Approved: Retain Existing Copy | 9 |
| Keep | Deferred: Future Investor Website Project | 39 |
| Keep | Deferred: Second-Pass Review | 4 |
| **Total** | | **327** |

Three groups need explaining:
- **Keep to Deferred: Second-Pass Review (4 lines).** These are on `/the-real-procurement-timeline`, an unlinked page whose lines were originally marked Keep.
- **Keep to Deferred: Future Investor Website Project (39 lines).** These are investor lines that had been marked Keep.
- **Keep to Approved: Retain Existing Copy (9 lines).** These are in the Owners *Where problems begin* section.

## 1.3 Active recommended changes

The full format for each change is in the recommendations document, Section 5: page, location, priority, existing and proposed copy in context, and the reasons.

| ID | Priority | Page | Location | Existing wording (source line) |
| --- | --- | --- | --- | --- |
| H1 | High | About | `src/pages/About.tsx:83` | "We work side by side with you and your team to dig into the details, uncover problems before they reach the field," |
| H2 | High | Founder Story | `src/pages/FounderStory.tsx:202` | "A practical, repeatable way to help general contractors look deeper into their projects, uncover problems earlier, and bring clarity and accountability to the work that must happen before construction can proceed as planned." |
| H3 | High | General Contractors | `src/pages/roles/GeneralContractors.tsx:407` | "At JiTpro, we go deeper into the details of your project to uncover problems that traditional management practices often miss, long before they disrupt your schedule, exhaust your people, and consume your profits." |
| H4 | High | General Contractors | `src/pages/roles/GeneralContractors.tsx:72` | "We uncover the hidden risks." |
| H5 | High | General Contractors | `src/pages/roles/GeneralContractors.tsx:765` (and line 65) | "What if you could see the problems coming?" |
| H6 | High | General Contractors | `src/pages/roles/GeneralContractors.tsx:667` | "Problems identified early enough to act." |
| H7 | High | General Contractors | `src/pages/roles/GeneralContractors.tsx:1068` | "JiTpro starts with a Project Readiness Engagement. We take a detailed look at one project, identify the risks and missing commitments, and establish a structured procurement plan to help your team get ahead of them." |
| H8 | High | Owners and Developers | `src/pages/roles/OwnersDevelopers.tsx:443` | "Imagine a contractor who sees problems coming before you do." |
| H9 | High | Home | `src/components/home/FewerSurprisesSection.tsx:36` | "See problems earlier" / "Identify procurement problems before they disrupt the field." |
| M1 | Medium | About | `src/pages/About.tsx:92` | "ahead of the problems that have held your projects back." |
| M2 | Medium | Home | `src/components/home/ThroughoutProjectSection.tsx:45` | "We do the detailed procurement planning up front, then help your team stay ahead of decisions, commitments, and potential problems throughout the project." |
| M3 | Medium | General Contractors | `src/pages/roles/GeneralContractors.tsx:85` | "We make emerging risks visible so your team can act while options remain, rather than paying to recover after disruptions occur." |
| M4 | Medium | FAQ | `src/content/faqContent.ts:73` | "By identifying and addressing problems early, JiTpro helps protect your schedule, your people, and the profits you've earned." |
| M5 | Medium | How It Works | `src/pages/HowItWorks.tsx:9` | "JiTpro reviews the drawings, specifications, schedule, and procurement strategy—looking for long-lead items, missing decisions, coordination risks, constraints, and schedule exposure before any of it can impact construction." |
| M6 | Medium | Why | `src/pages/Why.tsx:226` | "JiTpro makes invisible risk visible before it becomes field recovery." |
| M7 | Medium | Why | `src/pages/Why.tsx:250` | "JiTpro exists to make those risks visible while they can still be managed." |
| L1 | Low | Why | `src/pages/Why.tsx:53` | "Exposes risk while it can still be controlled" |
| L2 | Low | FAQ | `src/content/faqContent.ts:39` | "… Then we uncover the information, decisions, approvals, and other requirements needed to get everything ready for construction." |
| L3 | Low | FAQ | `src/content/faqContent.ts:100` | "We uncover missing information, establish responsibilities, …" |
| L4 | Low | FAQ | `src/content/faqContent.ts:123` | "… identify requirements, uncover missing information, and establish a properly sequenced procurement plan." |
| L5 | Low | Learn More | `src/components/learn-more/WhoSection.tsx:50` | "JiTpro is preventive. …" |
| L6 | Low | Product | `src/pages/Product.tsx:124` | "JiTpro brings that risk forward while there is still time to act on it." |
| L7 | Low | How It Works | `src/pages/HowItWorks.tsx:13` | "Executive Procurement Risk Assessment" (a phase 01 deliverable) |

## 1.4 Approved: Retain Existing Copy

- **Homepage hero (Q8).** *Broken schedules? Broken promises? Broken profits?* (`src/components/home/ProfitHero.tsx:94`). It contains no audit term, so it has no inventory row.
- **Owners and Developers *Where problems begin* (Q5)**, `src/pages/roles/OwnersDevelopers.tsx:223-339`. Ten inventory lines:

| Location | Class | Existing wording |
| --- | :---: | --- |
| `OwnersDevelopers.tsx:183` | A | "Procurement delayed" (chain stage) |
| `OwnersDevelopers.tsx:189` | A | "Field work disrupted" (chain stage) |
| `OwnersDevelopers.tsx:241` | E | "Where problems begin" |
| `OwnersDevelopers.tsx:248` | A | "The problems that disrupt your project rarely begin in the field." |
| `OwnersDevelopers.tsx:269` | A | "When something is missing, the consequences can reach far beyond a single unanswered question. A missing decision delays an" |
| `OwnersDevelopers.tsx:270` | A | "approval. A delayed approval prevents a product from being ordered. The product arrives late. The work stops. Labor must be" |
| `OwnersDevelopers.tsx:274` | A | "Suddenly, what could have been resolved months earlier has become an expensive problem affecting your schedule, your budget, and" |
| `OwnersDevelopers.tsx:283` | B | "This is how small, unresolved problems become the chaos we've come to accept in construction." |
| `OwnersDevelopers.tsx:302` | B | "How one unanswered question becomes a project problem" |
| `OwnersDevelopers.tsx:334` | B | "The earlier these requirements are identified, the more time your team has to resolve them before they threaten your project." |

## 1.5 Original proposals withdrawn

The original audit proposed 30 changes. Re-checked against the decisions:
- 21 remain;
- 2 former founder-review items became changes (L6, L7);
- 9 were withdrawn.

| Location | Original | Revised | Reason |
| --- | --- | --- | --- |
| `OwnersDevelopers.tsx:283` | Change (Medium) | Approved: Retain | Inside *Where problems begin* (Q5). |
| `learn-more/ChangesSection.tsx:50` | Change (Medium) | Keep | In context the section teaches what learning late costs; line 98 says plainly it is no promise of a perfect project. |
| `learn-more/ChangesSection.tsx:53` | Change (Medium) | Keep | As line 50. |
| `learn-more/LearnMoreFinalCTA.tsx:62` | Change (Medium) | Keep | Leads with *early accountability*; *preventable problems* is qualified prevention. |
| `contact/Contact.tsx:188` | Change (Medium) | Keep | As LearnMoreFinalCTA.tsx:62. |
| `faqContent.ts:37` | Change (Medium) | Keep | Already leads with control; *before problems reach the field* names the impact correctly. |
| `About.tsx:205` | Change (Low) | Keep | Describes the GC team's own job, not JiTpro's service. |
| `ArchitectsEngineers.tsx:99` | Change (Low) | Keep | Pain-first hero language about a real experience. |
| `OwnersDevelopers.tsx:941` | Change (Low) | Keep | Identifying risks early is a real benefit, one quality among several. |

Three former **Review** items are resolved as **Keep**:
- `Footer.tsx:102`, the link label;
- `faqContent.ts:147`, where the problem named is project complexity;
- `Product.tsx:121`, an accurate account of open items becoming field problems.

Priorities that changed among the retained changes:
- **raised:** `GeneralContractors.tsx:1068` (H7), Medium to High because of Q2;
- **lowered:** `About.tsx:92` (M1), High to Medium;
- **lowered:** `WhoSection.tsx:50` (L5) and `Why.tsx:53` (L1), Medium to Low.

## 1.6 Flagged: Future Software-Positioning Project

Four inventory lines carry this label:

| Location | Existing wording | Conflict |
| --- | --- | --- |
| `Product.tsx:170` | "…and shows you where that path is at risk." | A product view, not people guiding the team. |
| `Product.tsx:324` | "One job, one procurement plan, one board your team can act on." | *Board* as the deliverable. |
| `ProjectManagers.tsx:86` | "… You do not have to remember what needs follow-up — the system handles it." | Automation in place of JiTpro's people. |
| `Subcontractors.tsx:92` | "… JiTpro records who caused the delay and when it occurred. …" | A claims and records feature. |

A separate scan of the six footer-linked pages for software wording (*system, board, dashboard, platform, notifications, records*) found nine more lines with no audit term. They are listed with these four in the recommendations document, Section 9. No rewrite is proposed for any of them.

## 1.7 Deferred findings

No recommendations. The original classifications stay in the inventory (Part 3).

| Deferred to | File | Lines |
| --- | --- | ---: |
| Future Investor Website Project | `src/content/appendixSources.ts` | 2 |
| Future Investor Website Project | `src/content/investorCopy.ts` | 20 |
| Future Investor Website Project | `src/content/investorStats.ts` | 1 |
| Future Investor Website Project | `src/pages/investor/EconomicCase.tsx` | 1 |
| Future Investor Website Project | `src/pages/investor/HiddenCost.tsx` | 4 |
| Future Investor Website Project | `src/pages/investor/InvestorDeckPage.tsx` | 14 |
| Future Investor Website Project | `src/pages/investor/InvestorHome.tsx` | 4 |
| Future Investor Website Project | `src/pages/investor/InvestorProduct.tsx` | 1 |
| Future Investor Website Project | `src/pages/investor/WhyNow.tsx` | 1 |
| **Investor subtotal** | | **48** |
| Second-Pass Review | `src/content/faqData.ts` (`/faq-legacy`) | 38 |
| Second-Pass Review | `src/pages/FAQLegacy.tsx` | 1 |
| Second-Pass Review | `src/pages/HomepageConcept.tsx` | 12 |
| Second-Pass Review | `src/pages/roles/GeneralContractorsConcept.tsx` | 7 |
| Second-Pass Review | `src/pages/BrokenBeforeJobStarts.tsx` | 8 |
| Second-Pass Review | `src/pages/CompanyProjectHealth.tsx` | 5 |
| Second-Pass Review | `src/pages/TheRealProcurementTimeline.tsx` | 1 |
| Second-Pass Review | `src/content/timelineData.ts` (`/the-real-procurement-timeline`) | 1 |
| Second-Pass Review | `src/content/timelineNotes.ts` (`/the-real-procurement-timeline`) | 3 |
| Second-Pass Review | `src/pages/Roles.tsx` | 2 |
| Second-Pass Review | `src/pages/Demo.tsx` | 1 |
| **Second-pass subtotal** | | **79** |

`/procurement-schedule` and `/thank-you` are among the ten unlinked pages but contain no relevant occurrence.

SEO and metadata (Q7) are out of scope. The original audit made no findings in them, and no recommendations are made.

---

# Part 2. Original audit findings (2026-11-20, first pass)

This part is preserved from the first pass. Where a founder decision changed a conclusion, Part 1 governs.

## 2.1 Original executive summary

JiTpro's website describes two different companies:

- **The body copy describes a control service.** These sections describe JiTpro accurately:
  - the homepage's *You may not call it procurement* section and audience tabs;
  - Learn More, the methodology stages and the Field Guide;
  - the Owners page's *Where problems begin*;
  - the FAQ.

  They say that information, decisions, approvals and commitments are normal requirements of construction. JiTpro identifies them, establishes who is responsible and when, and sequences them backward from when the field needs them. On the primary pages, 61 of 206 relevant occurrences (30%) are requirement language (category B), the largest category.
- **The headlines describe a problem-detection service.** The statements a visitor reads first often define JiTpro by finding problems early. There are 44 discovery-framed occurrences (category D), 24 of them on primary pages. Examples:
  - About hero: *uncover problems before they reach the field*;
  - Founder Story: *uncover problems earlier*;
  - General Contractors: *We uncover the hidden risks*, *What if you could see the problems coming?* and *Problems identified early enough to act*;
  - Owners: *Imagine a contractor who sees problems coming before you do*;
  - homepage: *See problems earlier*.
- **Most occurrences should stay as they are.** They are field consequences (A), industry pain (E), qualified prevention (C) or requirement language (B).
- **Three gaps sit outside individual lines:**
  1. No vocabulary distinguishes stages; *problem*, *risk* and *issue* cover everything from an open decision to a stopped crew.
  2. JiTpro's involvement through construction is barely stated.
  3. Several footer-linked pages describe a software system, which conflicts with the service-led positioning (Design System §76).

## 2.2 Scope and methodology

**Search.** Case-insensitive, for:
- problem(s);
- prevent, prevention, preventing, preventable;
- discover, discovery, discovered;
- uncover(ing);
- identify, identified, identifies, identification;
- risk(s), risky;
- issue(s), issued;
- disrupt, disruption(s), disrupted;
- delay(s), delayed;
- reactive, reaction, react(ing);
- anticipate, anticipates;
- predict, predictable, predictability;
- foresee, foresaw.

*Foresee* has no matches.

**What was searched.** For every route in `src/App.tsx`, I followed the page's imports to every source file it uses. This includes the shared layout, the content files (`src/content/*`) and the interactive illustrations with their data. Each occurrence is therefore attributed to the pages that display it.

**Excluded:**
- dependencies, build output and generated files;
- tests;
- internal documentation;
- the admin, review and demo-lab routes;
- the Field Guide PDF;
- SEO and metadata (Q7; out of scope for Issue #86).

**Internal sources consulted:** the Design System for approved terminology, specifically §20.1 homepage messaging standards, §76 service-led positioning, and §77 and §78.

**Filtering.** Of 694 raw matches, I set aside lines that are not marketing copy (listed in the appendix):
- 53 lines of code, comments or identifiers;
- 32 lines using a word in an unrelated sense, for example *Issue the building permit*.

That leaves **411 relevant occurrences on 327 lines.** Each line is classified by the meaning of its sentence and paragraph, not by its words. Where one line holds several terms, they share the classification.

**Pages found:**

| Tier | Pages | Reached by | Revised scope |
| --- | --- | --- | --- |
| 1, primary | `/`, `/about`, `/founder-story`, `/contact`, `/roles/general-contractors`, `/roles/owners-developers`, `/roles/architects-engineers`, `/learn-more`, `/field-guide`, `/faq` | Header navigation, homepage, lead-magnet band, footer | First pass |
| 2, footer-linked | `/product`, `/how-it-works`, `/why`, `/documentation`, `/roles/project-managers`, `/roles/subcontractors`, `/privacy` | Footer | First pass (Q4) |
| 2, footer-linked | `/investor` and its seven sub-pages | Footer | Deferred: Future Investor Website Project (Q6) |
| 3, unlinked | `/roles`, `/company-project-health`, `/broken-before-the-job-starts`, `/the-real-procurement-timeline`, `/procurement-schedule`, `/demo`, `/thank-you`, `/homepage-concept`, `/roles/general-contractors-concept`, `/faq-legacy` | Not linked from the site | Deferred: Second-Pass Review (Q3) |

**Not found:**
- **Leadership:** there is no Leadership page.
- **Methodology:** there is no separate Methodology page; the methodology stages are part of `/learn-more`.

## 2.3 Occurrences by search term

*Raw* counts every match in the files the pages use. *In copy* excludes code, comments and identifiers. *Relevant* also excludes unrelated senses.

| Term | Raw matches | In copy | Relevant |
| --- | ---: | ---: | ---: |
| problem | 96 | 85 | 84 |
| prevent | 32 | 31 | 29 |
| discover | 13 | 6 | 6 |
| uncover | 9 | 9 | 9 |
| identify | 102 | 70 | 68 |
| risk | 104 | 70 | 70 |
| issue | 60 | 32 | 6 |
| disruption | 31 | 31 | 30 |
| delay | 180 | 64 | 64 |
| reactive | 42 | 30 | 30 |
| anticipate | 4 | 4 | 4 |
| predict | 21 | 12 | 11 |
| foresee | 0 | 0 | 0 |
| **Total** | **694** | **444** | **411** |

*Issue* is mostly the verb (*issue the permit*), and *delay* and *identify* are mostly code. *Problem* is almost entirely copy.

## 2.4 Relevant occurrences by classification

| Category | All public pages | Primary pages (tier 1) |
| --- | ---: | ---: |
| A. Actual field problems | 61 | 28 |
| B. Upstream requirements and information | 97 | 61 |
| C. Prevention and protection | 90 | 41 |
| D. Problem discovery and prediction | 44 | 24 |
| E. Industry pain and consequences | 80 | 34 |
| F. Other or ambiguous | 39 | 18 |
| **Total** | **411** | **206** |

The classification of every line is unchanged by the revision.

## 2.5 Original recommendations by line (superseded by Part 1)

| Original recommendation | Lines | High | Medium | Low |
| --- | ---: | ---: | ---: | ---: |
| Change | 30 | 9 | 15 | 6 |
| Review (founder) | 18 | 0 | 1 | 17 |
| Archive (page-level decision) | 75 | 0 | 0 | 75 |
| Keep | 204 | 0 | 0 | 204 |
| **Total** | **327** | | | |

---

# Part 3. Complete occurrence inventory

One row per line.
- **Terms:** the search terms on the line.
- **Class:** A to F, as defined in the brief:
  - A: actual field problems;
  - B: upstream requirements and information;
  - C: prevention and protection;
  - D: problem discovery and prediction;
  - E: industry pain and consequences;
  - F: other or ambiguous.
- **Original rec.:** the first-pass recommendation.
- **Revised disposition:** the result after the founder decisions.
- **Priority:** given for active changes only.
- **Existing wording:** the exact source line, with JSX markup removed and entities decoded. A line that wraps mid-sentence in the source is shown as it stands.
- **Notes:** the revised note, including any proposed wording and the change ID (H1 to L7).

### Tier 1: primary pages (navigation, homepage, audience pages, Learn More, Field Guide, FAQ)


#### `src/components/Footer.tsx`

Rendered on: `(layout) MainLayout`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 102 | risk | "Documentation & Risk" | F | Partly | Review | Keep |  | Was founder review; resolved as Keep. The link label names the page. |

#### `src/components/about/AboutSections.tsx`

Rendered on: `/about`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 88 | prevent, problem | "themselves to exhaustion trying to overcome problems that could have been prevented months earlier." | E | Yes | Keep | Keep |  | Section 5 placeholder copy. Real pain, honestly stated. Revisit when Section 5 is designed. |
| 159 | problem | "Construction will always be demanding. Plans change. Problems arise. Difficult decisions must be made, often" | A | Yes | Keep | Keep |  | Honest: construction always involves change. Supports the no-guarantee position. |
| 165 | prevent | "by the relentless cycle of preventable emergencies. We've seen good people lose their passion for an" | E | Yes | Keep | Keep |  | Industry pain. |
| 180 | problem | "decisions, solve problems, and perform under pressure without being consumed by it." | F | Yes | Keep | Keep |  | Describes people solving problems; not a claim about JiTpro. |

#### `src/components/about/HowWeWorkTogetherSection.tsx`

Rendered on: `/about`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 425 | reactive | "JiTpro helps your existing team replace reactive management with a clearer path through the work, so the" | E | Yes | Keep | Keep |  | Approved 2026-11-19. Contrasts reactive management with a planned path. |
| 426 | disruption, prevent | "project moves forward with fewer preventable disruptions, less rework, and greater confidence in what's" | C | Yes | Keep | Keep |  | "Preventable" is qualified correctly. |
| 471 | reactive | "time reacting and more time moving the project forward." | C | Yes | Keep | Keep |  | Positive outcome of order. Model language. |

#### `src/components/demo/fixtures/commitmentRegister.ts`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 59 | risk | "{ icon: 'clock', value: '5', label: 'At Risk', tone: 'warn' }," | F | Yes | Keep | Keep |  | Status label in an illustrative register. Correct status vocabulary. |
| 208 | risk | "'at-risk': 'At Risk'," | F | Yes | Keep | Keep |  | Status label. |

#### `src/components/demo/fixtures/scopeGapAnalysis.ts`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 124 | identify | "{ icon: 'total', value: '34', label: 'Total Gaps Identified', tinted: true, iconTone: 'accent', valueTone: 'text' }," | B | Yes | Keep | Keep |  | Gaps identified: requirement language. |
| 191 | identify | "title: 'Floor finish not identified in drawings or specs'," | B | Yes | Keep | Keep |  | Unresolved condition, stated neutrally. |
| 336 | delay, risk | "body: 'Finishes may conflict, creating rework, delays, and potential water infiltration risks.'," | A | Yes | Keep | Keep |  | Consequence if unresolved. Accurate. |

#### `src/components/demo/fixtures/scopeValidation.ts`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 95 | identify | "{ icon: 'total', value: '428', label: 'Scope Items Identified', tone: 'neutral', valueTone: 'text' }," | B | Yes | Keep | Keep |  |  |
| 301 | identify | "plain: ['No project specification identified']," | B | Yes | Keep | Keep |  |  |

#### `src/components/demo/primitives/DemoStatusBadge.tsx`

Rendered on: `/`, `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 36 | risk | "'at-risk': 'At Risk'," | F | Yes | Keep | Keep |  | Status label. |

#### `src/components/demo/screens/procurement-chain/chainLayout.ts`

Rendered on: `/`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 302 | identify | "{ text: `Identified ${formatDate(i.identifiedOn)}`, font: 'cardBody' }," | B | Yes | Keep | Keep |  | Card label: the date an issue was identified. |

#### `src/components/demo/screens/procurement-schedule/GanttParts.tsx`

Rendered on: `/`, `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 96 | risk | "{it.health === 'impacted' ? 'IMPACTED' : 'AT RISK'}" | F | Yes | Keep | Keep |  | AT RISK versus IMPACTED: the demo already separates a potential risk from an actual impact. A model for the website copy. |

#### `src/components/demo/screens/procurement-schedule/PhaseInspector.tsx`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 542 | identify | "Identified" | B | Yes | Keep | Keep |  | Field label. |

#### `src/components/demo/screens/procurement-schedule/ProcurementScheduleScreen.tsx`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 363 | issue | "Triangle = issue affecting the procurement path" | F | Yes | Keep | Keep |  | Legend: an issue is a recorded condition affecting a path, not a defect in the plan. |

#### `src/components/demo/screens/procurement-schedule/ScheduleRowMarks.tsx`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 295 | identify | "aria-label={`${it.name}: ${is.title}, identified ${is.identifiedOn}, package ${it.health}`}" | B | Yes | Keep | Keep |  | Accessible label. |

#### `src/components/demo/screens/procurement-schedule/ScheduleScreenChrome.tsx`

Rendered on: `/`, `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 138 | risk | "{health.atRisk} AT RISK" | F | Yes | Keep | Keep |  | Status count. |

#### `src/components/demo/screens/procurement-schedule/scheduleFixture.ts`

Rendered on: `/`, `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 783 | delay | "impact: 'Completion of the Initial Submittal was delayed.'," | A | Yes | Keep | Keep |  | Recorded impact in the illustrative schedule. |
| 799 | issue | "title: 'Connection Design Criteria Issued Late'," | A | Yes | Keep | Keep |  |  |
| 802 | issue | "'Connection design criteria were issued after the date the structural engineer owed them, and detailing proceeded against an incomplete set.'," | A | Yes | Keep | Keep |  | Shows accountability for a missed commitment. |

#### `src/components/demo/screens/procurement-schedule/scheduleModel.ts`

Rendered on: `/`, `/learn-more`, `/roles/architects-engineers`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 119 | risk | "'at-risk': 'At Risk'," | F | Yes | Keep | Keep |  | Status label. |
| 382 | risk | "'at-risk': 'At Risk'," | F | Yes | Keep | Keep |  | Status label. |
| 389 | risk | "'lead-time': 'Procurement Risk'," | F | Partly | Keep | Keep |  | "Procurement Risk" names the lead-time issue category in the demo. Acceptable inside a schedule illustration. |

#### `src/components/home/FewerSurprisesSection.tsx`

Rendered on: `/`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 36 | disruption, identify, problem | "{ Icon: Search, title: 'See problems earlier', body: 'Identify procurement problems before they disrupt the field.' }," | D | No | Change | Change | High | H9. Proposed: title *Know what the field needs.*; body *Identify the decisions, approvals, and commitments the field depends on, and when each one is due.* |

#### `src/components/home/ProcurementSection.tsx`

Rendered on: `/`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 245 | identify | "needs must be identified, selected, coordinated, approved, purchased, and delivered. And timing is everything. Miss a" | B | Yes | Keep | Keep |  | Model language: requirements described as the normal work of construction. |
| 270 | delay | "When the field waits, delays spread. Costs grow." | A | Yes | Keep | Keep |  | Field consequence. Accurate. |

#### `src/components/home/ThroughoutProjectSection.tsx`

Rendered on: `/`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 45 | problem | "body: 'We do the detailed procurement planning up front, then help your team stay ahead of decisions, commitments, and potential problems throughout the project.'," | C | Partly | Change | Change | Medium | M2. Proposed: *We do the detailed planning up front, then stay with your team through construction, with weekly guidance that keeps decisions, commitments, and open items on schedule.* |

#### `src/components/home/architectVisuals.ts`

Rendered on: `/`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 88 | identify | "'Identify competing deadlines early'," | B | Yes | Keep | Keep |  |  |

#### `src/components/home/ownerScenes.ts`

Rendered on: `/`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 63 | delay | "export const GAMBLE_NOTICES = ['Change order', 'Schedule delay', 'Cost overrun', 'Decision needed now', 'More revisions', 'Another surprise'] as const;" | E | Yes | Keep | Keep |  | Animated notices in the owner "gamble" scene. |
| 75 | identify, risk | "lines: ['Critical needs identified', 'Decisions scheduled', 'Responsibilities assigned', 'Long-lead items planned', 'Key approvals tracked', 'Risks surfaced early']," | B | Partly | Keep | Keep |  | Five requirement statements and *Risks surfaced early*. Optional: *Changes managed early* keeps the list about control. |
| 292 | disruption, risk | "out: { head: 'Weak procurement planning creates waste across the entire project.', support: 'More disruption. Higher costs. Greater risk to your investment.' }," | E | Yes | Keep | Keep |  |  |
| 293 | disruption | "in: { head: 'Early, precise procurement planning protects your investment.', support: 'Less disruption. Better coordination. Greater cost control.' }," | C | Yes | Keep | Keep |  |  |
| 306 | predict | "support: 'More predictable schedules. Better cost control. Greater confidence in the finish.'," | C | Yes | Keep | Keep |  | Positive value (predictable schedules). |
| 317 | identify | "gates: ['Requirements identified', 'Commitments scheduled', 'Deliveries coordinated']," | B | Yes | Keep | Keep |  | Model language. |
| 318 | identify | "gatesShort: ['Identified', 'Scheduled', 'Coordinated']," | B | Yes | Keep | Keep |  |  |
| 487 | delay | "foot: { head: 'Delayed decisions can eliminate your options.', support: 'Less time. Fewer choices. Greater pressure.' }," | E | Yes | Keep | Keep |  | Consequence of late decisions, framed around options. Accurate. |
| 510 | discover | "found: 'New option discovered'," | F | Yes | Keep | Keep |  | An option discovered, not a problem. |

#### `src/components/learn-more/BuiltByContractorsSection.tsx`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 42 | problem | "JiTpro did not come out of a software company looking for a construction problem. It came out of years of building complex projects, and out of watching good teams pushed into expensive recovery because something important became visible too late." | E | Yes | Keep | Keep |  | Origin story; "became visible too late" is accurate. |
| 56 | prevent | "We do not accept that preventable chaos is simply part of construction." | E | Yes | Keep | Keep |  | Qualified with "preventable". |

#### `src/components/learn-more/ChangesSection.tsx`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 50 | problem | "heading="The same problem, found at two different times."" | D | Partly | Change | Keep |  | Was a Medium change; removed. In context the section teaches what learning late costs, and its closing line (98) states plainly that this is not a promise of a perfect project. Accurate as written. |
| 53 | problem | "Nothing below changes what the problem is. What changes is the moment your team learns about it, and therefore how many ways they still have to deal with it." | D | Partly | Change | Keep |  | Was a Medium change; removed with line 50. |
| 98 | prevent, problem | "None of this is a promise of a perfect project. Construction does not offer one, and finding a problem early does not make it go away. Your options do. What earlier visibility and explicit accountability give your team is time, and a far better chance to prevent or soften the recovery that would otherwise be paid for out of margin." | C | Yes | Keep | Keep |  | The site's best no-guarantee statement. Optional: *identifying a requirement early* for *finding a problem early*. |

#### `src/components/learn-more/ChaosSection.tsx`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 67 | problem | "The problem is not that a project depends on other people." | B | Yes | Keep | Keep |  | Model language: depending on others is normal; an unmanaged dependency is the problem. |
| 69 | problem | "The problem is a dependency nobody is managing, which stays invisible until the field needs it." | B | Yes | Keep | Keep |  | Model language. |

#### `src/components/learn-more/ControlSection.tsx`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 52 | identify | "What has always been yours is how the dependency is managed: whether it is identified early, what specifically is required, who carries the next move, when it is required, what work it releases, whether it is moving, and when it needs to be escalated." | B | Yes | Keep | Keep |  | Model language: identified, required, owned, timed, tracked, escalated. |

#### `src/components/learn-more/LearnMoreFinalCTA.tsx`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 62 | prevent, problem | "Let us look at where JiTpro can create early accountability and help your team get ahead of preventable problems. One project, your documents, your schedule, and your team, starting from wherever that project stands today." | C | Partly | Change | Keep |  | Was a Medium change; removed. It leads with *early accountability*; *get ahead of preventable problems* is qualified prevention (C). Accurate. |

#### `src/components/learn-more/LearnMoreHero.tsx`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 70 | identify | "JiTpro works with your team on one project. We examine the project as it actually stands, identify the scope, information, decisions, selections, approvals, commitments, products, materials, and services it is still depending on, and establish who carries each one and when it is required." | B | Yes | Keep | Keep |  | Model language: the clearest statement of what JiTpro does on the site. |
| 74 | problem | "That work happens before those dependencies reach the field as problems." | B | Yes | Keep | Keep |  | Correct sequence: dependencies become problems only when they reach the field unresolved. |

#### `src/components/learn-more/OneProjectSection.tsx`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 49 | problem | "body: 'We work with the documents, the schedule, and the team as they exist right now. That is the starting condition, not a problem to fix beforehand.'," | F | Yes | Keep | Keep |  | "Not a problem to fix": the reverse of problem framing. Good. |

#### `src/components/learn-more/WhoSection.tsx`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 50 | prevent, problem | "JiTpro is preventive. It is at its most useful on a project early enough that decisions, information, and commitments can still be worked, for a contractor who has paid for preventable problems before and does not want to repeat it on the next one." | C | Partly | Change | Change | Low | L5 (was Medium). Proposed first sentence: *JiTpro works ahead of the field.* The rest is unchanged. |

#### `src/content/faqContent.ts`

Rendered on: `/faq`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 37 | problem | "p('JiTpro helps general contractors take control of their projects before problems reach the field.')," | C | Partly | Change | Keep |  | Was a Medium change; removed. It already leads with control (*take control of their projects*); *before problems reach the field* names the impact correctly. |
| 39 | identify, uncover | "'We start by identifying the products, materials, and services your project needs. Then we uncover the information, decisions, approvals, and other requirements needed to get everything ready for construction.'," | B | Yes | Change | Change | Low | L2. Proposed: *Then we establish the information, decisions, approvals, and other requirements needed to get everything ready for construction.* |
| 44 | disruption, prevent | "p(strong('The result is early clarity, better planning, and fewer preventable disruptions.'))," | C | Yes | Keep | Keep |  |  |
| 55 | identify | "'JiTpro goes deeper. We identify the products, materials, services, and supporting requirements your project needs, then connect the decisions, approvals, and commitments that must happen before each item can be delivered.'," | B | Yes | Keep | Keep |  | Model language. |
| 66 | delay | "'Construction delays are expensive. Missing information, late decisions, delayed materials, and uncoordinated work lead to idle crews, overtime, rework, and costly schedule recovery.'," | A | Yes | Keep | Keep |  |  |
| 70 | disruption, identify, prevent, problem | "'JiTpro helps prevent these disruptions by identifying what your project needs, sequencing the work required to deliver it, and establishing clear responsibilities and deadlines before problems reach the field.'," | C | Yes | Keep | Keep |  | Prevention tied to the mechanism. Good. |
| 72 | delay | "callout('In construction, upfront investment in planning and quality control is consistently far less expensive than the cost of rework and delays.')," | A | Yes | Keep | Keep |  |  |
| 73 | identify, problem | "p("By identifying and addressing problems early, JiTpro helps protect your schedule, your people, and the profits you've earned.")," | D | No | Change | Change | Medium | M4. Proposed: *By identifying requirements early, assigning responsibility, and controlling the sequence, JiTpro helps protect your schedule, your people, and the profits you've earned.* |
| 86 | identify | "'We get to work early, digging into your project documents, identifying missing information, organizing procurement requirements, and establishing the decisions and commitments needed to keep construction moving.'," | B | Yes | Keep | Keep |  |  |
| 88 | problem | "callout("Your team can focus on getting the project started while we help make sure they're not inheriting tomorrow's problems.")," | E | Yes | Keep | Keep |  |  |
| 89 | prevent, problem | "p('The result is a stronger start, fewer preventable surprises, and a significant advantage over contractors who wait until problems reach the field.')," | C | Yes | Keep | Keep |  |  |
| 97 | identify | "'We start by reviewing your project documents and construction schedule to identify the products, materials, services, and supporting requirements your project needs.'," | B | Yes | Keep | Keep |  |  |
| 100 | uncover | "'We uncover missing information, establish responsibilities, and develop a detailed procurement plan that sequences the work around when everything is needed on site.'," | B | Yes | Change | Change | Low | L3. Proposed: *We identify missing information, establish responsibilities, ...* |
| 123 | identify, uncover | "'JiTpro takes that work off their shoulders, getting started immediately to identify requirements, uncover missing information, and establish a properly sequenced procurement plan.'," | B | Yes | Change | Change | Low | L4. Proposed: *... to identify requirements, define missing information, and establish a properly sequenced procurement plan.* |
| 139 | delay, disruption, problem | "p('The more complex the project, the more opportunities there are for missing information, delayed decisions, and procurement problems to disrupt construction.')," | E | Yes | Keep | Keep |  |  |
| 147 | problem | "p(strong("That's exactly the problem JiTpro is here to solve."))," | F | Partly | Review | Keep |  | Was founder review; resolved as Keep. "The problem" here is project complexity, which JiTpro does exist to manage. |
| 167 | problem, reactive | "p('The question is whether that work gets planned and organized early or handled reactively as problems arise.')," | E | Yes | Keep | Keep |  | Model contrast: planned early versus handled reactively. |
| 169 | delay, reactive | "'Reactive management comes at a much higher cost. Delays, wasted labor, rework, expediting, and constant firefighting consume valuable resources and erode your profits.'," | E | Yes | Keep | Keep |  |  |
| 171 | delay | "callout('In construction, upfront investment in planning and quality control is consistently far less expensive than the cost of rework and delays.')," | A | Yes | Keep | Keep |  | Repeats line 72. |

#### `src/content/homeAudiences.ts`

Rendered on: `/`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 107 | identify | "label: 'Identify'," | B | Yes | Keep | Keep |  | Tab label *Identify* (requirements). |
| 108 | identify | "headline: 'You can’t manage what you haven’t identified.'," | B | Yes | Keep | Keep |  | Model language. |
| 112 | identify | "'JiTpro brings these requirements together into a comprehensive procurement inventory, identifies missing or undefined scope, and helps establish what the project actually needs.'," | B | Yes | Keep | Keep |  |  |
| 130 | identify | "'Identify the decisions, information, approvals, and other requirements that each activity depends on. Connect them to the procurement schedule, establish responsibility, and make clear when each is needed.'," | B | Yes | Keep | Keep |  | Model language: identify, connect, assign, date. |
| 161 | reactive | "'When your general contractor plans procurement early, you know what design information, submittals, and approvals will be needed and when. Clear expectations give your team time to prepare instead of reacting to last-minute demands.'," | E | Yes | Keep | Keep |  |  |
| 168 | anticipate, prevent | "'Advance notice of upcoming requirements helps you allocate staff, coordinate consultants, and anticipate periods of heavy demand. With time to plan, your team can reduce unnecessary overtime, avoid repeated interruptions, and better protect your clients from preventable costs.'," | B | Yes | Keep | Keep |  |  |
| 175 | disruption, predict | "'When you recommend a general contractor, your professional reputation is part of that recommendation. Contractors who take procurement planning seriously help protect your work, reduce avoidable disruption, and deliver a more predictable experience for your clients.'," | C | Yes | Keep | Keep |  |  |
| 187 | risk | "label: 'Reduce risk'," | C | Yes | Keep | Keep |  | Owner tab *Reduce risk*: owners think in risk. Appropriate. |
| 190 | problem, risk | "'You’re trusting your general contractor with a substantial investment. You deserve confidence that they’re planning ahead, managing risks, and keeping you informed before problems threaten your budget or schedule.'," | C | Yes | Keep | Keep |  |  |
| 205 | predict | "label: 'More predictability'," | C | Yes | Keep | Keep |  |  |
| 206 | predict | "headline: 'Stay on course for a more predictable finish.'," | C | Yes | Keep | Keep |  |  |
| 211 | identify | "'JiTpro serves as your project’s procurement flight plan, helping your contractor identify what’s needed, who’s responsible, and when each step must be completed to keep construction on course.'," | B | Yes | Keep | Keep |  | Model language (what, who, when). |
| 212 | predict | "closing: 'A more predictable finish helps protect both your schedule and your budget.'," | C | Yes | Keep | Keep |  |  |
| 221 | identify | "'JiTpro helps your contractor identify what’s needed, who’s responsible, and when each action must be completed to keep procurement and construction moving as planned.'," | B | Yes | Keep | Keep |  |  |

#### `src/content/leadMagnets.ts`

Rendered on: `(layout) MainLayout`, `/field-guide`, `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 87 | identify | "'A 31-page guide for general contractors on identifying the decisions, information, products, materials, services, approvals, and commitments the field will depend on months from now, and establishing accountability while useful options still exist.'," | B | Yes | Keep | Keep |  | Model language for the Field Guide. |

#### `src/content/learnMore.ts`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 72 | reactive | "{ id: '01-why-projects-go-reactive', ordinal: '01', title: 'Why projects become reactive' }," | E | Yes | Keep | Keep |  | Chapter title *Why projects become reactive*. |
| 183 | identify | "'When the decision is identified, who carries it, the date it has to be made by, and what work is waiting behind it.'," | B | Yes | Keep | Keep |  |  |
| 489 | prevent, problem | "'You have already paid for preventable project problems, and you know roughly what they cost you.'," | E | Yes | Keep | Keep |  |  |
| 492 | prevent | "'You would rather prevent the next recovery effort than analyze the last one.'," | C | Yes | Keep | Keep |  |  |

#### `src/content/methodologyStages.ts`

Rendered on: `/learn-more`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 44 | identify | "body: 'We validate the contractor’s existing scope against the project documentation to determine whether the work required to complete the project has been identified and covered.'," | B | Yes | Keep | Keep |  |  |
| 53 | identify, uncover | "body: 'We identify missing, unclear, conflicting, or uncovered scope—and the decisions, information, and responsibilities that must be resolved before they become constraints against the schedule.'," | B | Yes | Keep | Keep |  | Model language: resolved before they become constraints against the schedule. |
| 56 | identify | "alt: 'The JiTpro Scope Gap Analysis Report for the same project: 34 gaps identified across the 428 scope items reviewed, sorted into definition, responsibility and interface types, with fifteen items listed — gaps alongside scope already found sufficiently defined — each carrying a responsible party, a required-by date and an impact level, and a detail panel setting out one gap’s finding, why it m" | B | Yes | Keep | Keep |  | Image alt text. |
| 65 | risk | "alt: 'The JiTpro Commitment Register for the same project: 23 commitments, each with an external party, an owner, a commitment date and a target date, tracked as on track, at risk or overdue.'," | F | Yes | Keep | Keep |  | Alt text: on track, at risk, overdue. |
| 71 | identify | "body: 'We identify and register the products, materials, and services the project will need, connecting what must arrive on site to the decisions, approvals, and Commitments required to get it there.'," | B | Yes | Keep | Keep |  |  |

#### `src/pages/About.tsx`

Rendered on: `/about`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 83 | problem, uncover | "We work side by side with you and your team to dig into the details, uncover problems before they reach the field," | D | No | Change | Change | High | H1. Proposed: *We work side by side with you and your team to identify what the field will need, establish who is responsible and when, and put the planning, coordination, and accountability in place to protect your schedule, your profits, and your people.* |
| 92 | problem | "ahead of the problems that have held your projects back." | D | Partly | Change | Change | Medium | M1 (was High). Proposed: *Just experienced professionals helping your team take control of the work ahead, before the field depends on it.* |
| 187 | identify | "hired. Hundreds of products, materials, services, decisions, and approvals need to be identified, coordinated, and" | B | Yes | Keep | Keep |  | Model language. |
| 205 | uncover | "At the very same time, they're supposed to dig into the details, uncover what's missing, establish" | B | Yes | Change | Keep |  | Was a Low change; removed. The sentence describes the GC team's own job, not JiTpro's service, so it does not misrepresent JiTpro. |
| 215 | delay | "By the time missing decisions, incomplete scope, and procurement delays become visible in the field, the" | B | Yes | Keep | Keep |  | Correct sequence: unresolved requirements become visible in the field too late. |

#### `src/pages/FounderStory.tsx`

Rendered on: `/founder-story`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 156 | problem | "'I spent the first half of my construction career in the field, as a carpenter, superintendent, and general contractor. I built projects, led crews, solved problems, and did whatever it took to get the work done.'," | F | Yes | Keep | Keep |  | Biography. |
| 158 | disruption | ""Crews ready to work with nothing to work with. Carefully planned activities disrupted because something that should have been taken care of weeks or months earlier hadn't been done."," | A | Yes | Keep | Keep |  | Field experience. Accurate and important. |
| 181 | problem | "'I never believed the office and the field should operate as separate worlds, each protecting its own responsibilities while problems fell through the cracks.'," | E | Yes | Keep | Keep |  |  |
| 183 | problem | ""I wasn't interested in passing problems down the line and leaving someone else to deal with the consequences."," | E | Yes | Keep | Keep |  |  |
| 200 | discover, prevent, problem | "'By the time the field discovers the problem, the best opportunity to prevent it has often passed.'," | A | Yes | Keep | Keep |  | The field discovers problems; JiTpro acts before. Correct use. |
| 202 | problem, uncover | "'A practical, repeatable way to help general contractors look deeper into their projects, uncover problems earlier, and bring clarity and accountability to the work that must happen before construction can proceed as planned.'," | D | No | Change | Change | High | H2. Proposed: *A practical, repeatable way to help general contractors identify what their projects will need, establish who is responsible and when, and bring clarity and accountability to the work that must happen before construction can proceed as planned.* |

#### `src/pages/contact/Contact.tsx`

Rendered on: `/contact`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 100 | problem | "body: 'You’ll be talking with people who understand the problems you’re trying to solve.'," | E | Yes | Keep | Keep |  |  |
| 188 | prevent, problem | "Tell us a little about your company and what you’re building. We’ll start with a conversation about where JiTpro can create early accountability and help your team get ahead of preventable problems." | C | Partly | Change | Keep |  | Was a Medium change; removed, as LearnMoreFinalCTA.tsx:62. |

#### `src/pages/roles/ArchitectsEngineers.tsx`

Rendered on: `/roles/architects-engineers`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 99 | anticipate, problem | "into a cycle of problems that could have been anticipated." | E | Yes | Change | Keep |  | Was an optional Low change; removed. Pain-first hero language describing a real experience; preserved. |
| 226 | disruption | "{ title: 'Disrupted workload', text: 'Your planned work is pushed aside.', Icon: LayersIcon }," | A | Yes | Keep | Keep |  |  |
| 367 | problem | "The problem isn't the work being requested." | B | Yes | Keep | Keep |  | Model language: the work is normal; the lack of early visibility is the problem. |
| 368 | predict | "It's the lack of early visibility that turns predictable needs into urgent demands." | B | Yes | Keep | Keep |  |  |
| 512 | delay | "'Documentation that protects your team when delays are disputed'," | F | Yes | Keep | Keep |  |  |
| 513 | identify | "'Early identification of missing owner decisions blocking your review'," | B | Yes | Keep | Keep |  |  |

#### `src/pages/roles/GeneralContractors.tsx`

Rendered on: `/roles/general-contractors`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 72 | risk, uncover | "title: 'We uncover the hidden risks.'," | D | No | Change | Change | High | H4. Proposed title: *We define what the project needs.* |
| 73 | identify, problem | "body: 'We examine project scope, products, materials, services, and the information required to procure them. We identify gaps and unresolved conditions before they become field problems.'," | B | Yes | Keep | Keep |  | The step body is already requirement language; only the title is discovery-framed. |
| 81 | identify | "body: 'We develop a procurement schedule that identifies what needs attention now to protect work planned for weeks or months ahead.'," | B | Yes | Keep | Keep |  |  |
| 85 | disruption, risk | "body: 'We make emerging risks visible so your team can act while options remain, rather than paying to recover after disruptions occur.'," | C | Partly | Change | Change | Medium | M3. Proposed: *Each week, we show your team what needs attention now and what is coming next, so open items get resolved while options remain, rather than paying to recover after disruptions occur.* |
| 407 | disruption, problem, uncover | "At JiTpro, we go deeper into the details of your project to uncover problems that traditional management practices often miss, long before they disrupt your schedule, exhaust your people, and consume your profits." | D | No | Change | Change | High | H3. Proposed: *At JiTpro, we go deeper into the details of your project to establish what the field will need, what must happen to make it ready, and who is responsible for each step, long before a missed requirement can disrupt your schedule, exhaust your people, and consume your profits.* |
| 415 | identify, prevent, problem | "We identify what's needed, who's responsible, and when it needs to happen, so your team can prevent problems instead of constantly recovering from them." | B | Yes | Keep | Keep |  | What, who, when. Accurate. |
| 494 | anticipate, delay, problem | ""You've experienced these problems across multiple projects. You've watched anticipated profits disappear into delays, inefficiencies, and expensive recovery efforts."," | E | Yes | Keep | Keep |  |  |
| 531 | prevent | "same preventable losses." | E | Yes | Keep | Keep |  |  |
| 657 | reactive | "label: 'Reactive'," | E | Yes | Keep | Keep |  | Panel label *Reactive*. |
| 658 | discover, problem | "heading: 'Problems discovered in the field.'," | A | Yes | Keep | Keep |  | Problems discovered in the field. Correct for the reactive side. |
| 659 | risk | "points: ['Late decisions and approvals', 'Missing or incomplete products', 'Crews waiting and being reallocated', 'Schedule and profit at risk']," | A | Yes | Keep | Keep |  |  |
| 667 | identify, problem | "heading: 'Problems identified early enough to act.'," | D | No | Change | Change | High | H6. Proposed: *Requirements managed before the field needs them.* |
| 765 | problem | "What if you could see the problems" | D | No | Change | Change | High | H5, with companion line 65. Proposed h2: *What if you knew what was coming?* |
| 794 | problem, reactive | "That's the difference between reacting to problems and" | C | Yes | Keep | Keep |  | Reacting versus managing ahead. Acceptable. |
| 1068 | identify, risk | "JiTpro starts with a Project Readiness Engagement. We take a detailed look at one project, identify the risks and missing commitments, and establish a structured procurement plan to help your team get ahead of them." | D | Partly | Change | Change | High | H7 (was Medium; raised by Q2). Proposed: the offer named *JiTpro Project Readiness Engagement*, described as planning plus weekly guidance, not a one-time look. |

#### `src/pages/roles/OwnersDevelopers.tsx`

Rendered on: `/roles/owners-developers`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 129 | discover | "Discover a Better Way to Build" | F | Yes | Keep | Keep |  | Hero action *Discover a Better Way to Build*. Not problem discovery. |
| 183 | delay | "title: 'Procurement delayed'," | A | Yes | Keep | Approved: Retain Existing Copy |  | Owners *Where problems begin* section, approved by the founder (Q5). No changes. Stage in the chain diagram. |
| 189 | disruption | "title: 'Field work disrupted'," | A | Yes | Keep | Approved: Retain Existing Copy |  | Owners *Where problems begin* section, approved by the founder (Q5). No changes. |
| 241 | problem | "Where problems begin" | E | Yes | Keep | Approved: Retain Existing Copy |  | Owners *Where problems begin* section, approved by the founder (Q5). No changes. Eyebrow *Where problems begin*. |
| 248 | disruption, problem | "The problems that disrupt your project rarely begin in the field." | A | Yes | Keep | Approved: Retain Existing Copy |  | Owners *Where problems begin* section, approved by the founder (Q5). No changes. Field problems rarely begin in the field. Accurate, and the paragraph after it calls the unanswered questions normal. |
| 269 | delay | "When something is missing, the consequences can reach far beyond a single unanswered question. A missing decision delays an" | A | Yes | Keep | Approved: Retain Existing Copy |  | Owners *Where problems begin* section, approved by the founder (Q5). No changes. Model escalation chain. |
| 270 | delay, prevent | "approval. A delayed approval prevents a product from being ordered. The product arrives late. The work stops. Labor must be" | A | Yes | Keep | Approved: Retain Existing Copy |  | Owners *Where problems begin* section, approved by the founder (Q5). No changes. |
| 274 | problem | "Suddenly, what could have been resolved months earlier has become an expensive problem affecting your schedule, your budget, and" | A | Yes | Keep | Approved: Retain Existing Copy |  | Owners *Where problems begin* section, approved by the founder (Q5). No changes. |
| 283 | problem | "This is how small, unresolved problems become the chaos we've come to accept in construction." | B | Partly | Change | Approved: Retain Existing Copy |  | Owners *Where problems begin* section, approved by the founder (Q5). No changes. Calls the upstream items problems. Proposed: *This is how small, unresolved questions become the chaos we've come to accept in construction.* |
| 302 | problem | "How one unanswered question becomes a project problem" | B | Yes | Keep | Approved: Retain Existing Copy |  | Owners *Where problems begin* section, approved by the founder (Q5). No changes. Model language: one unanswered question becomes a project problem. |
| 334 | identify | "The earlier these requirements are identified, the more time your team has to resolve them before they threaten your project." | B | Yes | Keep | Approved: Retain Existing Copy |  | Owners *Where problems begin* section, approved by the founder (Q5). No changes. Model language. |
| 385 | anticipate | "{ title: 'Anticipates', text: "Knows what's coming and plans for it.", Icon: CalendarDays }," | B | Yes | Keep | Keep |  | *Anticipates: knows what's coming and plans for it.* |
| 443 | problem | "Imagine a contractor who sees problems coming before you do." | D | No | Change | Change | High | H8. Proposed: *Imagine a contractor who knows what's coming before you have to ask.* |
| 448 | delay, identify | "Who identifies missing information before it delays materials, equipment, or construction." | B | Yes | Keep | Keep |  |  |
| 634 | disruption | "When decisions come late, materials aren't ready, and work is constantly disrupted, pressure builds for everyone. But when the" | A | Yes | Keep | Keep |  |  |
| 782 | identify | "JiTpro gives your contractor the time, visibility, and control to identify what's needed, resolve open items, and" | B | Yes | Keep | Keep |  |  |
| 818 | risk | "{ text: 'Can your contractor show you how risks are being addressed before they become emergencies?', Icon: ShieldCheck }," | C | Yes | Keep | Keep |  | Distinguishes risks from emergencies. Good. |
| 850 | identify | "have been identified before they become urgent. That products, materials, and services are being planned around when" | B | Yes | Keep | Keep |  |  |
| 851 | problem | "construction actually needs them. That responsibilities are clear, commitments are tracked, and potential problems" | C | Yes | Keep | Keep |  | Optional: *open items* for *potential problems*. |
| 941 | identify, risk | "You deserve a general contractor who plans ahead, identifies risks early, and demonstrates that the decisions, materials," | C | Partly | Change | Keep |  | Was a Low change; removed. Identifying risks early is a real benefit, stated as one quality among several. Accurate. |

### Tier 2: footer-linked pages (in first-pass scope, except the investor pages, which are deferred)


#### `src/content/appendixSources.ts`

Rendered on: `/investor/appendix`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 148 | delay | "sourceName: 'Industry surveys — construction delay cause analysis'," | A | Yes | Keep | Deferred: Future Investor Website Project |  | Investor source note. |
| 153 | delay | "notes: 'Multiple industry surveys cite owner-driven decisions (material selections, design approvals, change orders) as a leading cause of project delays. The 70% figure is a representative estimate from aggregated survey data.'," | A | Partly | Review | Deferred: Future Investor Website Project |  | Investor source: the 70% figure is labelled a representative estimate. Claim strength is outside this audit; flagged for the investor review (Q6). |

#### `src/content/investorCopy.ts`

Rendered on: `/investor/appendix`, `/investor/economics`, `/investor/hidden-cost`, `/investor/market`, `/investor/product`, `/investor/why-now`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 14 | problem | "title: 'The problem is embedded early'," | E | Yes | Keep | Deferred: Future Investor Website Project |  | Investor problem statement. |
| 16 | discover | "'Construction instability is not discovered during execution — it is introduced before execution begins.'," | B | Yes | Keep | Deferred: Future Investor Website Project |  | Instability introduced before execution, not discovered: consistent with the philosophy. |
| 18 | risk | "'Projects routinely start while design decisions remain unresolved, specifications are incomplete, procurement sequencing is undefined, and decision responsibilities are unassigned. This creates hidden schedule instability, margin leakage, and credibility risk from day one.'," | B | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 19 | risk | "'The industry rewards starting. It does not reward sequencing. The result is that early-phase risk — the most consequential kind — has no true owner.'," | E | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 120 | risk | "body: 'When projects begin before design decisions are finalized, every downstream activity inherits that uncertainty. Subcontractors price risk into bids. Procurement timelines become guesses. RFIs multiply. The cost is not a single event — it is a compounding tax on every phase of execution.'," | E | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 132 | delay | "body: 'On a $10M project, daily overhead and carry costs range from $10,000 to $50,000. A single week of delay caused by an unresolved owner selection or a late specification decision can cost $70,000–$350,000 — often exceeding the entire project profit.'," | A | Partly | Review | Deferred: Future Investor Website Project |  | Cost figures: claim strength for the investor review (Q6). |
| 135 | delay | "title: 'Delay economics'," | A | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 136 | delay, problem | "body: '70% of projects experience delays due to late owner selections. These delays are not caused by field execution problems — they are caused by decisions that were never assigned, never tracked, and never aligned to procurement deadlines. The cost is real, but the cause is invisible without structured procurement control.'," | A | Partly | Review | Deferred: Future Investor Website Project |  | 70% statistic: investor review (Q6). |
| 156 | disruption | "body: 'The construction workforce is aging and shrinking. Skilled labor shortages mean that schedule disruptions caused by procurement failures cannot be recovered through overtime or additional crews. When the schedule slips, it stays slipped.'," | E | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 164 | predict | "body: 'Owners — particularly in luxury residential — expect predictability. They expect their contractor to know what needs to happen, when, and to communicate proactively. Contractors without structured procurement control cannot deliver on this expectation consistently.'," | C | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 200 | identify | "title: 'Identify procurement tasks'," | B | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 201 | identify | "description: 'At contract award, JiTpro identifies every procurement action required across the project — materials, equipment, subcontractor commitments, owner selections, and design decisions.'," | B | Partly | Review | Deferred: Future Investor Website Project |  | "Identifies every procurement action" is absolute. Investor review (Q6). |
| 242 | delay | "title: 'How one avoided delay can justify software spend'," | C | Partly | Review | Deferred: Future Investor Website Project |  | "Software spend" conflicts with the service-led positioning (About §76). Investor review (Q6). |
| 243 | delay | "body: 'On a $10M project with $10,000–$50,000 in daily carry costs, avoiding a single week of procurement-driven delay saves $70,000–$350,000. JiTpro\'s cost per project is a fraction of the cost of one avoided delay. The ROI is not theoretical — it is arithmetic.'," | C | Partly | Review | Deferred: Future Investor Website Project |  | As line 242. |
| 247 | delay | "body: 'The cost of establishing procurement control before mobilization is small. The cost of failing to do so — rework, delays, margin erosion, credibility damage — is large and compounding. This is not a marginal improvement. It is an asymmetric investment: small cost, disproportionate downside protection.'," | E | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 255 | reactive | "body: 'JiTpro\'s value is not labor savings or time-tracking improvements. The first and most tangible win is avoided leakage — margin that would have been lost to unresolved decisions, missed procurement windows, and reactive schedule recovery. This is the value that contractors feel immediately.'," | C | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 264 | delay | "{ label: 'Cost of 1-week delay', value: '$70,000–$350,000' }," | A | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 266 | risk | "{ label: 'Margin at risk from early ambiguity', value: '$220,000–$650,000' }," | A | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 267 | delay | "{ label: 'JiTpro cost per project', value: 'A fraction of one avoided delay' }," | A | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 283 | identify | "{ term: 'Procurement', definition: 'The process of identifying, ordering, and receiving materials, equipment, and subcontractor services required for construction' }," | B | Yes | Keep | Deferred: Future Investor Website Project |  | Glossary. |

#### `src/content/investorStats.ts`

Rendered on: `/investor`, `/investor/appendix`, `/investor/economics`, `/investor/hidden-cost`, `/investor/market`, `/investor/why-now`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 140 | delay | "label: 'Of projects experience delays due to late owner selections'," | A | Partly | Review | Deferred: Future Investor Website Project |  | Investor statistic (Q6). |

#### `src/pages/Documentation.tsx`

Rendered on: `/documentation`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 34 | delay, prevent | "'It cannot prevent every owner delay.'," | C | Yes | Keep | Keep |  | Honest limit: cannot prevent every owner delay. |
| 64 | risk | "Documentation & Risk" | F | Yes | Keep | Keep |  | Section label. |
| 85 | delay | "You've watched a delay surface in the field months after the decision that caused" | A | Yes | Keep | Keep |  |  |
| 88 | problem | "You've watched everyone forget where the problem actually started." | E | Yes | Keep | Keep |  |  |
| 90 | problem | "You've been expected to recover problems you didn't create." | E | Yes | Keep | Keep |  |  |
| 130 | delay | "arrives late—everyone remembers the delay." | A | Yes | Keep | Keep |  |  |
| 146 | risk | "Silent risk transfer" | F | Yes | Keep | Keep |  |  |
| 252 | delay | "Before the delay, not after" | C | Yes | Keep | Keep |  |  |
| 254 | problem | "Good documentation changes behavior before problems occur." | C | Yes | Keep | Keep |  |  |
| 260 | problem | "runway. Vendors raise problems while options still exist." | C | Yes | Keep | Keep |  |  |
| 263 | delay | "Many delays simply never happen. The record is not a filing cabinet—it is one" | C | Partly | Keep | Keep |  | *Many delays simply never happen.* Qualified ("many"). Acceptable. |
| 363 | delay | "So when a delay becomes a schedule discussion, a change order discussion, or a" | A | Yes | Keep | Keep |  |  |

#### `src/pages/HowItWorks.tsx`

Rendered on: `/how-it-works`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 9 | risk | "'JiTpro reviews the drawings, specifications, schedule, and procurement strategy—looking for long-lead items, missing decisions, coordination risks, constraints, and schedule exposure before any of it can impact construction.'," | D | Partly | Change | Change | Medium | M5. Proposed: *JiTpro reviews the drawings, specifications, schedule, and procurement strategy to establish what the project will need, when the field needs it, and what must happen first: long-lead items, open decisions, coordination requirements, and constraints.* |
| 13 | risk | "'Executive Procurement Risk Assessment'," | D | Partly | Review | Change | Low | L7 (was founder review). A deliverable within the engagement, not the service name. Proposed: *Project Readiness Assessment*. |
| 35 | delay | "'Every decision, approval, review, and constraint is assigned to a responsible party with a required completion date—and linked to the procurement activity it can delay.'," | B | Yes | Keep | Keep |  | Model language: assigned, dated, linked to what it can delay. |
| 48 | delay, identify, risk | "'JiTpro monitors procurement progress week over week—identifying emerging risks, tracking deadlines, and keeping critical activities moving before delays reach the field.'," | C | Yes | Keep | Keep |  | Weekly monitoring through construction. Good. |
| 62 | delay, identify, problem | "'When a procurement activity starts to slip, JiTpro identifies the cause, recommends corrective action, and develops a recovery strategy—while the delay is still a paperwork problem, not a field problem.'," | C | Yes | Keep | Keep |  | Distinguishes a paperwork problem from a field problem. Good. |
| 200 | risk | "The Control Process starts with an assessment of one project—drawings, schedule, and procurement strategy—before a single package is at risk in the field." | C | Yes | Keep | Keep |  |  |

#### `src/pages/Product.tsx`

Rendered on: `/product`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 53 | risk | "consequence: 'Power-on date at risk'," | A | Yes | Keep | Keep |  |  |
| 86 | risk | "Start with one project. Protect the margin already at risk." | C | Yes | Keep | Keep |  |  |
| 114 | problem | "The problem" | F | Yes | Keep | Keep |  | Section label. |
| 121 | problem, risk | "Most general contractors lose margin because procurement risk is invisible until it becomes a field problem. The owner decision that slipped, the submittal waiting on an answer, the long-lead release nobody flagged—none of it shows up until the field is already paying for it." | B | Partly | Review | Keep |  | Was founder review; resolved as Keep. Describes how open items become field problems. Accurate. |
| 124 | risk | "JiTpro brings that risk forward while there is still time to act on it." | D | Partly | Review | Change | Low | L6 (was founder review). Proposed: *JiTpro puts those open items on a plan, with an owner and a date, while there is still time to act.* |
| 170 | risk | "JiTpro does not impose a generic workflow. It follows the path every package already takes—and shows you where that path is at risk." | D | Partly | Review | Flagged: Future Software-Positioning Project |  | Software positioning: "shows you where that path is at risk" describes a product view. See the software-positioning list. |
| 273 | risk | "Revenue at risk" | F | Yes | Keep | Keep |  | Illustration label. |
| 310 | risk | "One-of-a-kind projects concentrate procurement risk: more selections, more owner decisions, more long-lead packages—and more margin exposed when answers arrive late." | E | Yes | Keep | Keep |  |  |
| 324 | risk | "You do not need an enterprise transformation to control procurement. Start before the risk reaches the field—on your next project. One job, one procurement plan, one board your team can act on." | C | Partly | Review | Flagged: Future Software-Positioning Project |  | Software positioning: "one board your team can act on". |

#### `src/pages/Why.tsx`

Rendered on: `/why`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 53 | risk | "title: 'Exposes risk while it can still be controlled'," | D | Partly | Change | Change | Low | L1 (was Medium). Proposed title: *Takes control while there is still time to act* |
| 83 | delay | "item, missing scope clarification, delayed approval, and long-lead procurement item" | E | Yes | Keep | Keep |  |  |
| 84 | risk | "begins putting that margin at risk." | E | Yes | Keep | Keep |  |  |
| 145 | identify | "on. If they are not identified, owned, sequenced, and tracked early, they become" | B | Yes | Keep | Keep |  | Model language: identified, owned, sequenced, tracked. |
| 179 | problem | "The field rarely creates the problem. The field reveals it." | A | Yes | Keep | Keep |  | *The field rarely creates the problem. The field reveals it.* Strong and accurate. |
| 199 | problem | "None of these costs are the problem. They are the invoice for commitments that" | E | Yes | Keep | Keep |  |  |
| 226 | risk | "JiTpro makes invisible risk visible before it becomes field recovery." | D | Partly | Change | Change | Medium | M6. Proposed: *JiTpro puts those commitments under control before they turn into field recovery.* |
| 250 | risk | "JiTpro exists to make those risks visible while they can still be managed." | D | Partly | Change | Change | Medium | M7. Proposed: *JiTpro exists to bring those commitments under control while they can still be managed.* |

#### `src/pages/investor/EconomicCase.tsx`

Rendered on: `/investor/economics`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 70 | predict | "Small, predictable" | C | Yes | Keep | Deferred: Future Investor Website Project |  |  |

#### `src/pages/investor/HiddenCost.tsx`

Rendered on: `/investor/hidden-cost`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 25 | risk | "{ label: 'Incomplete design & specifications', impact: 'Unpriced risk enters bids' }," | E | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 26 | delay | "{ label: 'Unassigned decision responsibility', impact: 'Delays have no owner' }," | B | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 28 | reactive | "{ label: 'Reactive RFI generation', impact: 'Information gaps surface in field' }," | E | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 138 | delay | "Cost of delay — $10M project (illustrative)" | A | Yes | Keep | Deferred: Future Investor Website Project |  |  |

#### `src/pages/investor/InvestorDeckPage.tsx`

Rendered on: `/investor/deck`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 213 | problem | "{ id: 'problem', label: 'Problem' }," | F | Yes | Keep | Deferred: Future Investor Website Project |  | Deck section name. |
| 350 | problem | "01 — Problem" | F | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 360 | identify | "Procurement constraints are not identified or sequenced early" | B | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 372 | delay | "Late or incorrect procurement forces costly rework and delays" | A | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 383 | reactive | "'Reactive procurement'," | E | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 402 | identify | "Identifies scope gaps and missing design/specification" | B | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 433 | identify | "JiTpro enables contractors to control early execution by identifying, assigning," | B | Yes | Keep | Deferred: Future Investor Website Project |  | Model language: identifying, assigning, sequencing. |
| 434 | disruption | "and sequencing procurement constraints before they disrupt the schedule." | B | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 445 | identify, risk | "JiTpro identifies procurement risk before others do." | D | Partly | Review | Deferred: Future Investor Website Project |  | *JiTpro identifies procurement risk before others do.* Investor review (Q6). |
| 514 | identify | "'Constraints identified pre-construction'," | B | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 515 | reactive | "'Reduction in reactive procurement'," | C | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 541 | reactive | "'Reactive execution'," | E | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 615 | prevent | "It is deployed by operators who have lived the failure it prevents." | C | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 801 | prevent | "JiTpro prevents that." | C | Partly | Review | Deferred: Future Investor Website Project |  | *JiTpro prevents that.* Unqualified prevention claim. Investor review (Q6). |

#### `src/pages/investor/InvestorHome.tsx`

Rendered on: `/investor`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 94 | problem | "title="The problem is embedded early"" | E | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 95 | discover | "subtitle="Construction instability is not discovered during execution — it is introduced before execution begins."" | B | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 102 | risk | "credibility risk from day one." | E | Yes | Keep | Deferred: Future Investor Website Project |  |  |
| 106 | risk | "early-phase risk — the most consequential kind — has no true owner." | E | Yes | Keep | Deferred: Future Investor Website Project |  |  |

#### `src/pages/investor/InvestorProduct.tsx`

Rendered on: `/investor/product`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 29 | risk | "'Converts risk into sequence'," | B | Yes | Keep | Deferred: Future Investor Website Project |  | *Converts risk into sequence*: good control language. |

#### `src/pages/investor/WhyNow.tsx`

Rendered on: `/investor/why-now`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 16 | predict | "{ label: 'Owner expectations', description: 'Higher standards for predictability and communication' }," | C | Yes | Keep | Deferred: Future Investor Website Project |  |  |

#### `src/pages/roles/ProjectManagers.tsx`

Rendered on: `/roles/project-managers`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 31 | problem | "On the procurement side, you are responsible for making sure materials arrive when they are needed. That means tracking submittals, following up on approvals, monitoring lead times, and flagging problems before they hit the field. In practice, most of that tracking happens informally — and that is where things fall through." | B | Yes | Keep | Keep |  |  |
| 86 | risk | "JiTpro sends advance notifications when deadlines are approaching and escalates items that are at risk. You do not have to remember what needs follow-up — the system handles it." | C | Partly | Review | Flagged: Future Software-Positioning Project |  | Software positioning: "the system handles it". |
| 98 | delay | "Every action is recorded with timestamps. When you need to report to the owner, explain a delay, or support a schedule claim, the documentation is already built — you do not have to reconstruct it." | A | Yes | Keep | Keep |  |  |
| 116 | delay, risk | "'Early visibility into items at risk of causing schedule delay'," | C | Yes | Keep | Keep |  |  |

#### `src/pages/roles/Subcontractors.tsx`

Rendered on: `/roles/subcontractors`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 16 | problem | "You are often the first to feel the impact of late procurement decisions — and the last to know they are coming. When materials do not show up on time, your crew sits idle, your schedule compresses, and your margin disappears. JiTpro gives you visibility into the decisions that affect your work before they become problems." | E | Yes | Keep | Keep |  |  |
| 52 | delay | "You cannot order finishes, fixtures, or equipment until the owner makes a selection. If that decision is delayed, your procurement timeline compresses — but you are still expected to meet the original install date." | A | Yes | Keep | Keep |  |  |
| 64 | delay, problem | "When procurement delays compress your installation window, you are asked to accelerate — overtime crews, expedited shipping, out-of-sequence work. The cost of someone else's late decision becomes your problem." | E | Yes | Keep | Keep |  |  |
| 80 | delay | "JiTpro shows you where your submittals are in the review process, who is responsible for the next action, and how much time remains before a delay impacts your procurement timeline." | B | Yes | Keep | Keep |  |  |
| 86 | risk | "If an owner selection or design decision that affects your scope is running behind, JiTpro surfaces that risk early. You know about it before it becomes a compressed fabrication window." | C | Yes | Keep | Keep |  |  |
| 90 | delay | "Clear documentation of delay causes" | F | Yes | Keep | Keep |  |  |
| 92 | delay | "When procurement delays affect your work, JiTpro records who caused the delay and when it occurred. If you are asked to accelerate due to someone else's late decision, you have documentation to support your position." | F | Partly | Review | Flagged: Future Software-Positioning Project |  | Software positioning: "JiTpro records who caused the delay". |
| 98 | delay | "JiTpro maps dependencies between trades so you can see how upstream procurement delays might affect your start date. Better visibility means fewer surprises when you are ready to mobilize." | B | Yes | Keep | Keep |  |  |
| 114 | delay | "'Documentation to support change orders caused by others\' delays'," | F | Yes | Keep | Keep |  |  |

### Tier 3: unlinked pages. Deferred: Second-Pass Review


#### `src/content/faqData.ts`

Rendered on: `/faq-legacy`

Legacy FAQ, superseded 2026-11 by /faq (Design System §65). Not linked from the site. Its voice ("procurement instability", "operational control", "Control Tower") predates the current positioning. Deferred: Second-Pass Review (Q3); preserved unchanged, with no recommendations.

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 41 | problem | "question: 'What problem does JiTpro solve?'," | F | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 43 | disruption | "'JiTpro addresses the procurement-driven operational instability that develops between project award and field execution — the same instability that silently compounds into schedule disruption and margin erosion throughout the project lifecycle.'," | E | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 54 | disruption, reactive | "'When procurement instability is not controlled early, contractors are often forced into reactive management conditions involving stacked trades, labor disruption, expediting, overtime, rework, and schedule compression — all of which progressively erode margin.'," | E | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 61 | delay | "'Because procurement is where schedules begin to destabilize. Long before trades fall behind onsite, projects are already being impacted by unresolved constraints, incomplete information, delayed approvals, and procurement bottlenecks.'," | B | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 67 | identify, issue, prevent | "'Constraint management means identifying, tracking, sequencing, and resolving issues that prevent procurement activities from progressing on time. These may include:'," | B | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 76 | delay | "'Owner decision delays'," | A | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 83 | problem | "'It means that most field problems are actually symptoms of unresolved procurement and coordination failures that occurred months earlier.'," | E | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 96 | identify, problem, reactive | "'Traditional expediting often reacts blindly, or after problems occur. JiTpro focuses on identifying the causes of procurement instability before schedules begin to break.'," | D | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 114 | identify | "'No. JiTpro operates from a fundamentally different philosophy. Traditional CPM schedules model activities after assumptions are embedded into the project schedule. JiTpro focuses on identifying and stabilizing the procurement timelines and constraints that cause schedules to become unreliable in the first place.'," | F | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 134 | identify | "'JiTpro is designed to ensure that procurement activities are properly sequenced, constraints are identified early, and durations are built around defensible operational logic to provide the most accurate possible representation of when products, materials, and services can realistically arrive onsite.'," | B | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 136 | risk | "'While this may temporarily create the appearance of schedule alignment, it frequently introduces compounding operational risk throughout the project lifecycle.'," | E | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 160 | identify | "'Constraint identification'," | B | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 166 | risk | "'Procurement risk visibility'," | D | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 186 | prevent, reactive | "'JiTpro is not a recovery system. It is designed to prevent procurement instability from pushing projects into reactive management conditions in the first place.'," | C | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 192 | risk | "'No. JiTpro does not replace project management responsibilities or subcontractor management. It helps expose and organize procurement-related risk and dependencies.'," | D | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 218 | problem | "'Procurement instability is fundamentally an information and operational control problem. Maintaining visibility across procurement timelines, sequencing dependencies, constraints, approvals, fabrication status, and delivery coordination at scale requires purpose-built software infrastructure.'," | F | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 220 | disruption | "'The goal is not simply to digitize procurement. The goal is to maintain operational control before procurement instability compounds into schedule disruption and margin erosion.'," | C | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 232 | risk | "'JiTpro Control Tower is the project-specific operational layer focused on live procurement visibility, schedule risk, constraint escalation, and procurement execution management.'," | F | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 270 | disruption, identify | "'JiTpro uses AI to help organize, surface, and interpret procurement-related information so teams can identify constraints earlier, maintain visibility longer, and make more informed decisions before procurement instability compounds into schedule disruption and margin erosion.'," | D | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 278 | risk | "'Construction projects involve real-world constraints, financial exposure, sequencing risk, human coordination, and constantly changing conditions that still require experienced operational oversight and accountability.'," | E | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 296 | identify | "'Identify missing information'," | B | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 305 | disruption | "'The objective is maintaining operational control before procurement instability compounds into schedule disruption and margin erosion.'," | C | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 328 | disruption, reactive | "'When procurement constraints are left unresolved, projects progressively lose operational control through schedule disruption, labor inefficiency, stacked trades, expediting, overtime, rework, and reactive field management.'," | E | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 348 | disruption | "'Yes. Earlier clarity around procurement constraints and scope coordination can reduce downstream rework and schedule disruption.'," | C | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 364 | disruption | "'Schedule disruption'," | A | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 367 | delay | "'Delayed decisions'," | A | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 382 | disruption, reactive | "'The real question is whether procurement is being managed proactively through operational control, or reactively through chaos, schedule disruption, expediting, and margin erosion.'," | E | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 391 | risk | "'Each project carries different procurement risks, design complexity, owner decision dynamics, and schedule pressure. Pricing reflects that operational reality.'," | F | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 413 | reactive | "'Operational pressure, incomplete information, fragmented communication, changing decisions, and schedule compression create environments where unresolved procurement constraints quietly accumulate until projects become reactive.'," | E | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 422 | problem | "'The objective is not to replace personnel. The objective is to reduce the operational instability that overwhelms personnel once procurement problems begin compounding.'," | E | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 431 | delay | "'Procurement delays'," | A | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 433 | disruption | "'Labor disruption'," | A | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 440 | identify, issue | "'JiTpro focuses on identifying and stabilizing procurement constraints before those issues compound into operational and financial loss.'," | C | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 447 | disruption | "'As margins compress, operational inefficiency becomes significantly more dangerous. Small procurement disruptions that may have once been survivable can now materially impact profitability.'," | E | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 448 | reactive | "'Contractors who maintain operational control through procurement discipline gain a meaningful competitive advantage over contractors operating reactively.'," | E | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 454 | risk | "'No operational system can eliminate all project risk.'," | C | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 455 | disruption, prevent | "'However, JiTpro is built around the belief that maintaining operational control earlier in the project lifecycle significantly reduces preventable procurement-driven instability, schedule disruption, and margin erosion.'," | C | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 457 | predict | "'The goal is operational stability, predictability, and control.'," | C | Partly | Archive | Deferred: Second-Pass Review |  |  |

#### `src/content/timelineData.ts`

Rendered on: `/the-real-procurement-timeline`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 80 | predict | "subtitle: 'The same procurement, planned to match reality. Predictable. On-time per the proper sequence.'," | C | Yes | Keep | Deferred: Second-Pass Review |  |  |

#### `src/content/timelineNotes.ts`

Rendered on: `/the-real-procurement-timeline`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 34 | problem, risk | "31: 'Engineer finds more problems but stamps it "Approved as Noted" to move the project forward. Should have been another R&R. Risk transfers back to the GC and steel sub.'," | A | Yes | Keep | Deferred: Second-Pass Review |  | A reviewer finding defects in a submittal: a literal use. |
| 52 | issue | "62: 'Second-round review. Typically faster — most issues were caught the first time.'," | A | Yes | Keep | Deferred: Second-Pass Review |  |  |
| 58 | risk | "68: 'Approved — clean. Not "as noted." No risk transfer.'," | F | Yes | Keep | Deferred: Second-Pass Review |  |  |

#### `src/pages/BrokenBeforeJobStarts.tsx`

Rendered on: `/broken-before-the-job-starts`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 61 | delay | "delayed. Trades stack. The sequence breaks. And the story always starts the same:" | A | Yes | Archive | Deferred: Second-Pass Review |  | Unlisted legacy page (Q3). |
| 80 | problem | "random. It’s what shows up after the real problem." | E | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 84 | problem | "The problem is decisions made out of sequence with procurement. Not earlier. Not" | B | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 131 | reactive | "executing a plan — they’re reacting to one that never held together." | E | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 146 | reactive | "■ Management pulled into reaction" | E | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 163 | problem | "If this feels familiar, it’s not a field problem." | B | Yes | Archive | Deferred: Second-Pass Review |  | *Not a field problem. A procurement control problem.* Strong and accurate. |
| 165 | problem | "It’s a procurement control problem." | B | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 228 | reactive | "Control so the team isn’t overloaded reacting" | C | Yes | Archive | Deferred: Second-Pass Review |  |  |

#### `src/pages/CompanyProjectHealth.tsx`

Rendered on: `/company-project-health`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 23 | risk | "'Company leaders reduce burnout risk and protect the people they worked hard to hire.'," | C | Yes | Archive | Deferred: Second-Pass Review |  | Unlisted page (Q3). |
| 55 | identify | "Stress builds when decisions, approvals, lead times, scope gaps, and release requirements are not identified early enough or sequenced against the work that depends on them." | B | Yes | Archive | Deferred: Second-Pass Review |  | Model language: not identified early enough or sequenced against the work. |
| 61 | prevent | "The goal is not to push everyone harder. The goal is to remove preventable pressure before it becomes the way the job operates." | C | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 91 | risk | "Cognitive overload is a project risk" | E | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 111 | prevent, reactive | "When project teams can work in a controlled rhythm, companies reduce preventable stress, retain better people, and become more attractive to the kind of candidates who want to do excellent work without living in constant reaction." | E | Yes | Archive | Deferred: Second-Pass Review |  |  |

#### `src/pages/Demo.tsx`

Rendered on: `/demo`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 188 | delay | "Delay attribution and locked audit trails" | F | Partly | Archive | Deferred: Second-Pass Review |  | Software feature list on /demo (Q3, Q4). |

#### `src/pages/FAQLegacy.tsx`

Rendered on: `/faq-legacy`

Legacy FAQ, superseded 2026-11 by /faq (Design System §65). Not linked from the site. Its voice ("procurement instability", "operational control", "Control Tower") predates the current positioning. Deferred: Second-Pass Review (Q3); preserved unchanged, with no recommendations.

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 156 | disruption | "Procurement instability is the leading cause of schedule disruption and margin erosion in construction. These questions are organized by category to help contractors, owners, and project teams understand how JiTpro establishes operational control before procurement failures compound." | E | Partly | Archive | Deferred: Second-Pass Review |  |  |

#### `src/pages/HomepageConcept.tsx`

Rendered on: `/homepage-concept`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 240 | delay | "The field feels the delay last. Procurement gets blocked first." | A | Yes | Archive | Deferred: Second-Pass Review |  | Unlisted concept page (Q3). |
| 263 | risk | "Inherited risk" | F | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 266 | risk | "Inherited constraints become GC risk." | F | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 321 | delay | "A window package, steel item, cabinet release, tile selection, or equipment delay can consume the margin you thought you had." | A | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 372 | risk | "We turn the work your schedule depends on into a controlled sequence with owners, dates, risk signals, and accountability visible early." | B | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 388 | reactive | "Most systems show what is happening once the job is already moving. JiTpro gives the GC a plan to direct the decisions, approvals, releases, fabrication, and deliveries the field depends on — before missed timing forces the project into reactive firefighting." | C | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 415 | prevent | "Built by a contractor who got tired of watching good teams lose money to preventable project failure." | C | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 418 | problem | "“The painful part was not that projects were complex. The painful part was watching contractors lose margin on problems that were visible months earlier.”" | D | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 442 | risk | "Send the basics. We’ll review the decision, approval, submittal, release, fabrication, and delivery risks most likely to cost schedule or margin." | D | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 447 | risk | "Top procurement-risk points in plain English" | D | Partly | Archive | Deferred: Second-Pass Review |  |  |
| 460 | risk | "This review page is not wired to production submission yet. In the launched version, this would send the request for a next-project risk review." | F | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 519 | risk | "No long demo form. No generic sales pitch. One project. One honest look at the risk." | D | Partly | Archive | Deferred: Second-Pass Review |  |  |

#### `src/pages/Roles.tsx`

Rendered on: `/roles`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 9 | delay, risk | "'You carry the schedule and the risk. JiTpro gives you early control over the procurement decisions that protect your project — and defensible records when delays are not your fault.'," | C | Yes | Archive | Deferred: Second-Pass Review |  | Unlisted page (Q3). |
| 21 | delay, problem | "'You feel the impact of late decisions first. JiTpro gives you visibility into submittal status, upstream delays, and documentation to support your position when others cause the problem.'," | A | Yes | Archive | Deferred: Second-Pass Review |  |  |

#### `src/pages/TheRealProcurementTimeline.tsx`

Rendered on: `/the-real-procurement-timeline`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 428 | reactive | "is whether the team executes a plan they can trust, or reacts to a plan that" | E | Yes | Archive | Deferred: Second-Pass Review |  | Unlisted page (Q3). |

#### `src/pages/roles/GeneralContractorsConcept.tsx`

Rendered on: `/roles/general-contractors-concept`

| Line | Terms | Existing wording | Class | Accurate | Original rec. | Revised disposition | Priority | Notes |
| ---: | --- | --- | :---: | --- | --- | --- | --- | --- |
| 20 | problem | "body: 'Field teams resequence work, stack trades, and solve problems that were already moving upstream weeks earlier.'," | E | Yes | Archive | Deferred: Second-Pass Review |  | Unlisted concept page (Q3). |
| 34 | identify | "title: 'Identify the constraints'," | B | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 142 | prevent | "Every project already requires management of buyout, selections, submittals, approvals, releases, fabrication, delivery coordination, and follow-up. The question is not whether procurement work is happening. The question is whether it is sequenced early enough to prevent compounding margin loss later in the project." | B | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 165 | reactive | "Reactive procurement feels cheaper because nobody is measuring the time it burns." | E | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 200 | reactive | "This is not about adding more meetings or more paperwork. It is about giving the procurement process enough structure to support the schedule before the team is forced into reaction." | E | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 234 | reactive | "JiTpro helps the GC reveal inherited constraints, sequence procurement steps, coordinate decisions early, and keep the project from falling back into the same reactive pattern." | B | Yes | Archive | Deferred: Second-Pass Review |  |  |
| 257 | identify | "Start with one upcoming project. Identify the constraints. Sequence the procurement steps. Give the team a plan before the pressure starts." | B | Yes | Archive | Deferred: Second-Pass Review |  |  |

## Appendix: matches excluded as non-copy or unrelated

| File | Lines | Reason |
| --- | --- | --- |
| `src/components/about/HowWeWorkTogetherSection.tsx` | 106, 147, 179, 191, 227, 302, 453 | Not copy: code, comment or identifier |
| `src/components/demo/fixtures/commitmentRegister.ts` | 99, 168, 224 | Unrelated sense (for example *issue* a permit, *prevent* form abuse) |
| `src/components/demo/screens/procurement-chain/chainLayout.ts` | 122, 539 | Not copy: code, comment or identifier |
| `src/components/demo/screens/procurement-chain/chainScenario.ts` | 189 | Not copy: code, comment or identifier |
| `src/components/demo/screens/procurement-schedule/PhaseInspector.tsx` | 74, 460 | Not copy: code, comment or identifier |
| `src/components/demo/screens/procurement-schedule/ScheduleRowMarks.tsx` | 276, 284 | Not copy: code, comment or identifier |
| `src/components/demo/screens/procurement-schedule/scheduleFixture.ts` | 737 | Not copy: code, comment or identifier |
| `src/components/demo/screens/procurement-schedule/scheduleFixture.ts` | 75, 564, 567, 569, 575, 576, 585, 586, 587, 602, 603, 633, 651, 674, 693, 694, 713, 714, 727 | Unrelated sense (for example *issue* a permit, *prevent* form abuse) |
| `src/components/demo/screens/procurement-schedule/scheduleModel.ts` | 783, 795, 810 | Not copy: code, comment or identifier |
| `src/components/home/AudienceSection.tsx` | 622 | Not copy: code, comment or identifier |
| `src/components/home/IdentifyRegisterPreview.tsx` | 8, 9, 16, 19, 20, 107, 132, 143, 150, 152 | Not copy: code, comment or identifier |
| `src/components/home/OwnerVisual.tsx` | 924, 1117, 1265, 1312 | Not copy: code, comment or identifier |
| `src/components/home/ProfitHero.tsx` | 143 | Not copy: code, comment or identifier |
| `src/components/home/architectVisuals.ts` | 43, 118 | Unrelated sense (for example *issue* a permit, *prevent* form abuse) |
| `src/components/home/identifyRegisterPreviewData.ts` | 27 | Not copy: code, comment or identifier |
| `src/components/home/identifyStoryScene.ts` | 79, 154, 196, 197 | Not copy: code, comment or identifier |
| `src/components/home/ownerScenes.ts` | 1313, 1470, 1472 | Not copy: code, comment or identifier |
| `src/components/home/planChainScene.ts` | 53 | Not copy: code, comment or identifier |
| `src/components/turnstilePolicy.ts` | 63 | Not copy: code, comment or identifier |
| `src/content/privacyNotice.ts` | 81, 91, 106, 119 | Unrelated sense (for example *issue* a permit, *prevent* form abuse) |
| `src/content/timelineData.ts` | 48 | Unrelated sense (for example *issue* a permit, *prevent* form abuse) |
| `src/content/timelineNotes.ts` | 41 | Unrelated sense (for example *issue* a permit, *prevent* form abuse) |
| `src/pages/FAQ.tsx` | 52 | Not copy: code, comment or identifier |
| `src/pages/HowItWorks.tsx` | 75 | Unrelated sense (for example *issue* a permit, *prevent* form abuse) |
| `src/pages/Why.tsx` | 78 | Unrelated sense (for example *issue* a permit, *prevent* form abuse) |
| `src/pages/investor/EconomicCase.tsx` | 115 | Not copy: code, comment or identifier |
| `src/pages/investor/InvestorDeckPage.tsx` | 44, 86, 94, 279, 348 | Not copy: code, comment or identifier |
| `src/pages/roles/GeneralContractors.tsx` | 656 | Not copy: code, comment or identifier |
| `src/pages/roles/OwnersDevelopers.tsx` | 126 | Not copy: code, comment or identifier |
