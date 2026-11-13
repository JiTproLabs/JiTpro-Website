# JiTpro Design System v1.0

Status: Framework (Sections 1-44) + approved implementation standards (Part II, Sections 45-50)
Owner: Jeff Kaufman
Last updated: 2026-08-06
Applies to: Marketing Website, SaaS Application, Internal Dashboard, Printed Reports, Documentation

This document is the structure for the official JiTpro Design System. It is not the finished visual design. It defines where each design decision must live, what must be specified before implementation, and how future designers/developers/AI agents must use the system.

Important constraints for this version:
- Do not treat TODO placeholders as approved design decisions.
- Do not infer missing values from the current website without explicit approval.
- Do not choose fonts, colors, spacing, radii, shadows, or component variants from this framework alone.
- Do not implement UI by subjective judgment when a section below says TODO.
- The current design audit lives at `docs/design/current-design-audit.md` and should be used as evidence, not authority.

Normative language:
- MUST = required once the relevant decision is approved.
- SHOULD = preferred but may need context-specific judgment.
- MAY = optional.
- TODO = pending decision; do not invent.
- APPROVED = decided, in force, and binding on production code. An APPROVED rule overrides any conflicting TODO, audit finding, or existing implementation.

Document structure:
- Sections 1-44 define design philosophy and capture where each decision must live. They are preserved unchanged.
- Part II (Sections 45-50) defines the approved implementation standards derived from production work on the marketing website. Where Part II speaks, it is binding.
- A TODO that Part II has since answered is superseded by Part II. The original TODO text is retained for history, not as an open question.
- This document is now the single source of truth for colors, design tokens, typography, spacing, animation, visual hierarchy, component styling, interaction states, and accessibility expectations. Implementation conforms to this document; this document does not describe implementation after the fact.

---

## Decision Log

Purpose: Track every approved design-system decision so future UI work can cite authority rather than taste.

Decisions that belong here:
- Date of decision
- Decision owner/approver
- Scope affected
- Superseded rule, if any
- Link to supporting rationale, audit, mockup, or issue

Implementation notes:
- Add newest entries at the top.
- Every non-trivial token/component rule added later should have a corresponding log entry.

TODO:
- TODO: Add initial approver and governance process.
- TODO: Add first approved design-token decisions.

| Date | Decision | Scope | Owner | Source/Rationale |
| --- | --- | --- | --- | --- |
| 2026-11-13 | **Project owners → *Better decisions*: new closing statement, on two lines, with *Just in time.* underlined in amber (Section 54.2.4 amended).** *Not too early. Not too late. Timed to protect your choices and your project.* becomes *Not too early. Not too late. Just in time.* / *Protecting your choices and your project.* (founder, exact). The brief asked for *Just in time.* in amber; on the light surface amber text fails contrast (1.96:1, Section 8.8), so, on the founder's choice, the words stay navy and carry a decorative brand-amber underline. A tab's closing statement may now break into lines and name one phrase to emphasise this way. | Marketing website (homepage) | Jeff Kaufman | Founder direction and choice, 2026-11-13. |
| 2026-11-13 | **Project owners → *More predictability*: a runway that reads as a planned completion, a shallow approach, a full landing (Section 54.4.5 amended).** The short amber target made the aircraft look as if it barely reached its goal. The runway now has a touchdown point, a long **planned completion zone** (*PLANNED COMPLETION ZONE*, renamed from *PLANNED FINISH*) for touchdown, rollout and a controlled stop, a clear boundary post, and the red overrun (*ADDED TIME · ADDED COST*) beyond it, never entered. The composition uses the frame's width: the runway moves right and the approach becomes long and shallow (about 22°). The main gear touches down in the first third of the zone, the nose settles, and the aircraft rolls out and stops with runway left, where a small stop marker appears; the projected finish now converges on that stopping point. Waypoints, aircraft, copy and footer unchanged in substance; 18.7 s. | Marketing website (homepage) | Jeff Kaufman | Founder briefs *Runway and Landing Refinement* and *Flight Path and Screen Composition*, 2026-11-13. |
| 2026-11-13 | **Project owners → *More predictability*: a refined aircraft, a stable approach, and the story told by the forecast (Section 54.4.5 amended).** The toy-like airliner is replaced by a sleek single-engine executive turboprop in side profile (TBM-class in spirit; no real aircraft, brand or marking). The aircraft no longer drifts: it flies one continuous approach at an even speed, flares slightly and rolls out smoothly. The story moves to the **projected finish**, a band on the runway that opens wide and red in the added-cost zone and, as each procurement-planning waypoint appears on the approach (*Requirements identified*, *Commitments scheduled*, *Deliveries coordinated*), narrows and glides toward the planned finish, turning amber inside it; the aircraft touches down there; the added-cost zone stays, unused. The clock gains a horizontal-only scale and two speed curves (even, for flight; easing out, for a rollout). Copy and footer unchanged; 17.0 s. | Marketing website (homepage) | Jeff Kaufman | Founder brief *More Predictability Animation Refinement*, 2026-11-13. |
| 2026-11-13 | **Project owners → *More predictability*: new copy, and the visual redrawn as an approach and landing (Sections 54.2.4 and 54.4.5 amended; supersedes the calendar look-ahead).** **Copy (founder, exact):** headline *Stay on course for a more predictable finish.*; description *Your completion date and budget are closely connected. When construction runs longer than planned, added time can bring added cost. JiTpro helps your contractor identify and manage procurement requirements early, giving the project team a clearer path to keep construction moving toward its planned completion.*; closing statement *Better procurement planning. Fewer preventable delays. More confidence in where your project will land.* **Visual:** one aircraft, one planned approach, one runway, one planned finish (approach B: no comparison). It drifts high; a projected path and touchdown marker slide past the planned finish into an *ADDED TIME · ADDED COST* zone; three procurement-planning checkpoints (*Requirements identified*, *Commitments scheduled*, *Deliveries coordinated*) bring it back; it lands and rolls out inside the planned finish. Loss of predictability, never disaster; no guarantee. The persistent navy foot carries *Better procurement planning helps your project stay on course.* / *More predictable schedules. Better cost control. Greater confidence in the finish.* from the first frame. The visual now reads no project data: the owner-decisions data and look-ahead are withdrawn. | Marketing website (homepage) | Jeff Kaufman | Founder brief *More Predictability Section Redesign*, 2026-11-13. |
| 2026-11-13 | **Project owners → *Better decisions*: each lost choice says why (Section 54.4.5 amended).** The repeated *NO LONGER VIABLE* is replaced, in order of loss, by *LEAD TIME TOO LONG*, *PRODUCTION SLOT LOST*, *PRICE NO LONGER VIABLE* and *APPROVAL TIME EXHAUSTED* (founder, exact): four distinct sources of procurement risk, illustrative, meaning nonviable under the current requirements. Each reason sits to the left of its card (it fits there on every frame and stays clear of the narrowing corridor's walls), is read for 0.75 s (from 0.5), and goes; the card keeps its name and its red X. Everything else is unchanged; the visual runs about 1 s longer. | Marketing website (homepage) | Jeff Kaufman | Founder brief *Better Decisions Animation: Explain Why Options Become Nonviable*, 2026-11-13. |
| 2026-11-13 | **Project owners → *Better decisions*: options are discovered, then lost (Section 54.4.5 amended; supersedes the same day's emerging ghost cards).** An option nobody has identified is not on the picture: the stack opens with three known choices only, *CHOICE 1* to *3* (the cards are renamed from *OPTION A–F*), under *KNOWN OPTIONS*. On the way into the window the group stops three times and *CHOICE 4*, *5* and *6* are discovered one at a time, each with an amber outline and *NEW OPTION DISCOVERED*, read for half a second; the stack stays centred, moving up half a step as each arrives. At the right time all six are viable, under *SIX VIABLE OPTIONS*, held 4.6 s. On toward the narrow end the group stops for each loss: a red outline and *NO LONGER VIABLE*, read, then the red X; the card stays in place. *ONLY TWO VIABLE OPTIONS REMAIN* at the end. The optional reason lines are omitted for clarity. Three states: not yet discovered (not drawn), available, no longer viable. 33.6 s in all. The corridor, the house, the headings, the footer words, the close and its copy are unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder brief *Better Decisions Animation: Option Discovery and Viability*, 2026-11-13. |
| 2026-11-13 | **Project owners → *Better decisions*: fewer options known early, and emerging made unmistakable (Section 54.4.5 amended).** Early in a project only some options are known; more emerge as information develops; later, some are lost to time. The too-early stop moves from 129 to 96 units along the unchanged corridor, so it shows **three available (B, C, D) and three emerging (A, E, F)**, none crossed out; on the way into the window E, A and F become available one at a time, all six by the right time; the late stop is unchanged (two available, four unavailable). The emerging card is redrawn as a ghost (the whole card at 62%, an open dashed outline over paper at 40%, no offset, its name faint), so it can no longer be read as the grey-washed, crossed-out unavailable card. Copy, footer words, corridor, background, timing and the close are unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder direction, 2026-11-13. |
| 2026-11-13 | **Project owners → *Better decisions*: the closing foot gains an amber supporting line (Section 54.4.5 amended).** Beneath the unchanged *Correctly timed information and decisions protect your options.*: *JiTpro helps your contractor plan early and communicate exactly when decisions are needed.*, in the band's bold amber supporting style, the two set as the other feet are. On a narrow frame the line is set at 7 rather than 7.5 so it stays on one line. Nothing else changes. | Marketing website (homepage) | Jeff Kaufman | Founder direction, 2026-11-13. |
| 2026-11-13 | **Project owners → *Protect your investment*: two scenes presented like a short film; the scene headings removed (Section 54.4.5 amended; supersedes the same day's instant foot words and building opening).** *WEAK PROCUREMENT PLANNING* and *PRECISE PROCUREMENT PLANNING* are removed: the foot's words carry the distinction. Each scene now runs **message first, illustration second, hold, fade**: its foot words fade in (0.7 s) on an empty frame; after 0.4 s its illustration builds at its existing pace (scene 1: the contractor, then the four groups, then the friction, requests, effects and wasted money; scene 2: the shield, then the four groups again, then the coordination lines, calm words and protected value); complete, it is held 3 s. Scene 1 then **fades out as one** (0.8 s, every element and its words together), the frame is clear for 0.3 s, and scene 2 opens the same way. The navy bar and its amber edge are drawn once and never fade; only the words fade. The visual plays once and rests on scene 2's completed outcome (no restart, so no closing fade to an empty frame); reduced motion shows that frame. The four cards are drawn as two keyed copies of one drawing, one for each scene. 25.6 s in all. Illustrations, copy, labels, colours and geometry are unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder brief *Protect Your Investment Animation Refinement*, 2026-11-13. |
| 2026-11-13 | **Project owners → *Protect your investment*: new foot words, a foot that is never blank, and an opening that builds (Section 54.4.5 amended).** **Words (founder, exact):** *Weak procurement planning creates waste across the entire project.* / *More disruption. Higher costs. Greater risk to your investment.*; then *Early, precise procurement planning protects your investment.* / *Less disruption. Better coordination. Greater cost control.* They speak of the planning process, not of the contractor. **Never blank:** the second pair's layer had drawn the navy bar again over the first pair, so the first pair never showed, and the bar stood empty until 14.85 s. The bar is now drawn once; the bar and the first pair are shown from the first frame (played or parked) with no fade; at the turn, as the shield begins, the first pair is replaced directly by the second. **Opening:** the subject first (the sheet, the bar and its words, *WEAK PROCUREMENT PLANNING*), then the contractor's card fades in at 1.2 s, then the four groups from 2.1 s, 0.25 s apart, opacity only; the disorder follows from 3.8 s with its pacing unchanged (every later moment 1 s later; 23.8 s in all). The shield, the four calm words (*In control*, *Aligned*, *Coordinated*, *Ready*), the coordination lines, the house and the close are unchanged. The clock gains one thing: a cue with no duration is shown (or gone) at once, so an element can be present from the first frame. | Marketing website (homepage) | Jeff Kaufman | Founder brief *Protect Your Investment Animation Refinements*, 2026-11-13. |
| 2026-11-13 | **Project owners → *Better decisions*: the house render behind it, as in *Protect your investment* (Sections 48.8 and 54.4.5 amended).** The same asset and treatment (`HouseBackdrop`: the Hero's render, grey, inverted, `multiply`-merged, top-edge mask, its own proportions, bottom-anchored on the foot), stationary from the first frame to the close (no reveal, no change between stages), at a 16% resting opacity so the corridor, options and marker stay dominant. A third bounded use of the render under Section 48.8. Nothing in the animation, its copy or its foot changes; *Protect your investment* is unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder brief, 2026-11-13: visual depth and consistency between the two owner visuals. |
| 2026-11-13 | **Project owners → *Better decisions*: new copy, and the visual redrawn as a decision timing window (Sections 54.2.4 and 54.4.5 amended; supersedes the 2026-11-12 cone).** **Copy (founder-supplied, exact):** headline *The right information. The right decisions. At the right time.*; two paragraphs, *Every construction project depends on a continuous flow of information, decisions, and approvals from owners, designers, consultants, and trade partners.* and *JiTpro helps your contractor identify what's needed, who's responsible, and when each action must be completed to keep procurement and construction moving as planned.*; closing statement *Not too early. Not too late. Timed to protect your choices and your project.* **Visual:** the tapering cone told only the cost of lateness and so read as *decide as early as possible*. It is replaced by a lens-shaped corridor, narrow, widest, narrow, in which one amber *NOW* marker and six options travel left to right without a reset through three stages: *too early* (information still developing: three available, three emerging), *the right time* (all six available in a restrained amber decision window; the longest hold), and *too late* (options become limited: two available, four unavailable with the red X). One rule decides every option's state: it is available while the whole card fits the corridor, otherwise provisional before the peak and unavailable after it. Three card states, never confused: provisional (dashed, pale, never crossed), available (white, crisp), unavailable (washed, red X). The navy foot stays throughout; only its words change. It plays once and closes with the six options at rest in the decision window and *Correctly timed information and decisions protect your options.* Reused: the owner visuals' clock, two designs, card drawing, moving group and foot. No other tab, the navigation or the section layout changes. | Marketing website (homepage) | Jeff Kaufman | Founder brief *Better Decisions Section Redesign*, 2026-11-13. |
| 2026-11-12 | **Project owners → *Better decisions*: the illustration redrawn (Section 54.4.5 amended).** **Why.** Founder brief *Better Decisions Animation Visual Redesign*: the concept is right but the picture too plain, two lines, six abstract shapes and a dashed marker; it should be a polished architectural illustration for high-end custom residential builders and their clients. **What:** the behaviour, the stops (all six at a quarter of the way, two at 85%), the one-at-a-time losses, the persistent foot and the timing are kept. The six shapes become named paper cards, *OPTION A* to *OPTION F*; a lost card is washed (55%, so its name still shows), dashed and crossed corner to corner in red. The corridor gains a soft shadow, a restrained warming toward the tip, a finer grid within, a dash-dot centre line and a fine inner line along each wall. The marker becomes a solid amber line with a faint halo and a pointer beneath the time axis, which is now unbroken, with fine ticks; *Time passes* moves above its start and *More options* above the mouth, clear of the pointer's path. The group sets out a little further in (76 units) so the wider cards start inside the mouth; the column is 22 units apart (16-unit cards), 3 below the centre line. The close uses the same cards. **Not verified.** Judged in still renderings of the real layout at both frame sizes; not seen in motion in a browser. | Marketing website (homepage): the Better decisions tab | Jeff Kaufman | Founder brief 2026-11-12 (*Better Decisions Animation Visual Redesign*). Sections 8.8, 46.3, 54.4.5. |
| 2026-11-12 | **Project owners → *Protect your investment*: the foot's bar stays (Section 54.4.5 amended).** **Why.** Founder: the navy footer bar coming and going during the animation looked sloppy; the bar should be stable and anchored, and only its message should change, one for each state. **What:** the bar and its amber edge now come in with the opening and never fade; the first state's words (now *Weak procurement planning puts your investment at risk.*, was *Poor*, over *Preventable delays. Rising costs. Eroding profits.*) come in at 3.95 s as before and go with that state at 12.0 s; the second state's (*A coordinated contractor protects your investment.* over *JiTpro gets the field what it needs, when it needs it.*) now come in as that state is named, at 14.85 s, rather than after it is complete, and stay. The closing band that rose at 19.8 s is gone; the length is unchanged at 22.8 s. Nothing else in the visual changes. **Not verified.** Not seen in motion in a browser. | Marketing website (homepage): the Protect your investment tab | Jeff Kaufman | Founder brief 2026-11-12 (Protect your investment footer). Sections 46.3, 54.4.5. |
| 2026-11-12 | **Project owners → *Better decisions*: played once, closing on correctly timed decisions (Sections 46.6, 54.4.5 amended).** **Why.** Founder brief: the visual must not loop endlessly as a closed cycle; it is one narrative that runs once, pauses, and moves on to its next teaching moment, that identifying a decision early does not mean making it immediately. **What:** the loop and its recorded exception are withdrawn. The story runs once to the late stop, is held about a second once complete, and the illustration above the bar fades away together over 0.9 s; the bar stays. Then the six options return, all open, in a row; beneath them *JiTpro helps your contractor identify what decisions are needed, when they are needed, and why the timing matters.*; last, on the bar, *Correctly timed decisions protect your options.*, which becomes the visual's closing line. It rests there, and reduced motion shows that frame. 24.15 s, once. The clock's loop support is removed, as nothing else used it. **Not verified.** The close judged in still renderings at both frame sizes; not seen in motion in a browser. | Marketing website (homepage): the Better decisions tab | Jeff Kaufman | Founder brief 2026-11-12 (play once, pause, transition to correctly timed decisions). Sections 46.3, 46.5, 46.6, 54.4.5. |
| 2026-11-12 | **Project owners → *Better decisions*: the foot's bar stays (Section 54.4.5 amended).** **Why.** Founder: the navy bar fading in and out as the story moved on looked sloppy. **What:** the bar and its amber edge now come in once with the cone and never fade, through every pass of the loop; only the words change. The first foot's words come in at stop 1 and stay until stop 2, where they cross to the second foot's. Nothing else in the visual changes. **Not verified.** Not seen in motion in a browser. | Marketing website (homepage): the Better decisions tab | Jeff Kaufman | Founder brief 2026-11-12 (footer refinement). Sections 46.3, 54.4.5. |
| 2026-11-12 | **Project owners → *Better decisions*: final logic (Section 54.4.5 amended).** **Why.** Founder brief *Final Logic Correction*: the governing principle (early identification, realistic sequencing and timely completion of required decisions preserve the owner's options; identifying early is not deciding early; alternatives have different latest viable dates) and its exact staging. **What:** the cone, the moving group, the crossed-out treatment, the feet and the loop are kept. Stop 1 moves to a quarter of the way along the cone (all six viable) and stop 2 to 85% (two viable); each is held about five seconds. The callouts return, *DECISION IDENTIFIED EARLY* and *DECISION IDENTIFIED LATE*, in place of the longer messages. Options are now lost one at a time (the column is set 2 units off the centre line), each standing for an alternative with its own latest viable date; the cards are a little smaller (22 units) so that the cone holds all six at stop 1. No choice is shown being made. 22.2 s, looping from 2.4 s; reduced motion shows stop 2. **Not verified.** Judged in still renderings of the real layout at both frame sizes; not seen in motion in a browser. | Marketing website (homepage): the Better decisions tab | Jeff Kaufman | Founder brief 2026-11-12 (*Better Decisions Animation, Final Logic Correction*). Sections 46.3, 46.5, 46.6, 8.8, 54.4.5. |
| 2026-11-12 | **Project owners → *Better decisions*: the options travel with the line of time (Section 54.4.5 amended).** **Why.** Founder: the line moved alone while the options stayed put; the options must move with the line, as one, so that options available earlier are seen to be unavailable later. **What:** the line and the column of six options are one group, moved by the same cues. It stops early, where the cone holds all six; then carries on, and each option the narrowing cone has no room for is left outside its walls, crossed out in red and still seen; it stops near the narrow end with two. The callouts *Decision identified early / late* give way to the founder's messages at the top of the frame: *When decisions are timed properly, we don't run out of time and we don't lose options.* and *Decisions left too late reduce the options available.* (the brief's tighter form). The feet, the cone, the pressure and the loop are unchanged; 23.6 s, looping from 2.4 s; reduced motion shows the late stop. **Not verified.** Judged in still renderings of the real layout at both frame sizes; not seen in motion in a browser. | Marketing website (homepage): the Better decisions tab | Jeff Kaufman | Founder brief 2026-11-12 (*Refine the Better Decisions animation*, options moving with the line). Sections 46.3, 46.5, 46.6, 8.8, 54.4.5. |
| 2026-11-12 | **Project owners → *Better decisions*: one continuous story (Sections 46.6 and 54.4.5 amended).** **Why.** Founder: the early and late moments must not be two reset scenes; the same original set of options should be seen becoming limited as time passes. **What:** the cone is unchanged. Six options now stand in its wide part throughout; one line of time stops at the early stop (all six open, *DECISION IDENTIFIED EARLY*, foot *Early planning preserves your choices.* / *More options. Better decisions.*) and carries on, without a reset, to the late stop (two open, *DECISION IDENTIFIED LATE*, foot *Late planning limits your choices.* / *Less time. Fewer options. More pressure.*). Between them, each option becomes unavailable where it stands as soon as the cone at the line would no longer hold it: washed pale, dashed, a small red X; nothing moves or falls. The pressure (walls thickening and reddening) comes on as the cone narrows. 21.6 s, looping seamlessly from 2.4 s; reduced motion shows the late stop, which holds the whole story. **Withdrawn:** the second set of options at the late stop, the owner's amber choice and green check, *Fewer options remain*, and the *Precise / Weak procurement planning* headers. **Not verified.** Judged in still renderings of the real layout at both frame sizes; not seen in motion in a browser. | Marketing website (homepage): the Better decisions tab | Jeff Kaufman | Founder brief 2026-11-12 (*Refine the Better Decisions animation*). Sections 46.3, 46.5, 46.6, 8.8, 54.4.5. |
| 2026-11-12 | **Project owners → *Better decisions*: rebuilt as one still cone in which only the moment of identification moves; and it loops (Sections 46.6 and 54.4.5 amended).** **Why.** Founder: the travelling-options channel was the wrong metaphor; options must not flow through a funnel and happen to survive. The point is when the decision is identified: early, in the wide part of the cone, many options remain; too late, in the narrow part, few, under pressure. **What:** a static tapered cone with a time axis; a line, clipped to the cone, sweeps from the mouth and stops where the decision is identified; the options shown there are as many as the cone's height holds (six early, two late), computed from the position. Precise planning first (early; the owner chooses one, amber with a green check; foot *Early planning preserves your choices.* / *More options. Better decisions.*), then weak (too late; the walls thicken and redden; *Fewer options remain*; foot *Late planning limits your choices.* / *Less time. Fewer options. More pressure.*). Sub-labels *Decision identified early* and *Decision identified too late*. The copy outside the visual is unchanged. **Loop:** the founder asked twice for a smooth loop; Section 46.6 gains a recorded exception for this visual only. Seamless: the pass ends on the frame it returns to; the renderer loops only while the tab is selected and seen; reduced motion shows the first moment. The renderer gains an optional loop point and reduced-motion frame per visual; the other three owner visuals are unchanged. **Withdrawn:** the travelling options, the options squeezed out and their outlines, the held-open second channel, *Your decision*, *Pressure increases* and *More choices remain*. **Not verified.** Judged in still renderings of the real layout at both frame sizes; not seen in motion in a browser. | Marketing website (homepage): the Better decisions tab | Jeff Kaufman | Founder brief 2026-11-12 (*Rebuild the Better Decisions animation*). Sections 46.3, 46.5, 46.6, 8.8, 54.4.5. |
| 2026-11-12 | **Project owners → *Better decisions*: the visual redrawn as a sideways cone (Section 54.4.5 amended; supersedes the same day's two-state decision-and-timeline illustration, which was never shipped).** **Why.** Founder brief: a sharp, immediate picture that earlier there are more options and later fewer, with pressure rising as they narrow; explicitly not a vertical funnel, and not text-heavy. **What:** a horizontal channel, wide on the left and narrow on the right; six abstract option cards carried left to right along it to the owner's decision; an option is squeezed out, through the wall, when the wall reaches it, leaving a faint outline. Weak planning: straight walls closing from the start, four lost, the walls thickening and reddening toward the tip, two arrive. Precise planning: the same channel held open and closing late, two lost late, four arrive, and the owner chooses one, which steps forward in amber with a green check. Labels from the brief's list (*More options*, *Time passes*, *Pressure increases*, *Fewer choices remain*) and two AUTHORED (*Your decision*, *More choices remain*). Same headers and feet; the copy outside the visual is unchanged. 25.4 s, one pass, resting on the second state. **Loop:** the brief asks for a smooth loop; the founder's same-day decision for this tab (one pass, then rest; Sections 46.4 and 46.6) is kept, and is raised again in the report. **Withdrawn:** the decision card, the information card, the lettered option grid, the timeline with *Today*, *Identified early* and *Time to decide*, *Unavailable* and the *Decide now* slip. **Not verified.** Judged in still renderings of the real layout at both frame sizes; not seen in motion in a browser. | Marketing website (homepage): the Better decisions tab | Jeff Kaufman | Founder brief 2026-11-12 (*Revise the Better Decisions animation*). Sections 46.1–46.6, 8.8, 54.4.5. |
| 2026-11-12 | **Project owners → *Better decisions*: new copy, and the visual redrawn as a two-state illustration (Sections 54.2.4 and 54.4.5 amended).** **Copy:** headline *Stay in control of your project's decisions.*; paragraph *Your contractor manages hundreds of details, deadlines, and dependencies that affect your choices. JiTpro helps organize that complexity so your contractor can give you the information you need, when you need it.*; and a closing statement, the first on an owner tab, *More time to consider your options. Fewer last-minute surprises. Better decisions.* JiTpro still acts through the contractor. **Visual:** the sample-project request pile is replaced by an illustration of one decision, six abstract options and the time until the decision is needed: under weak planning the options close as the date nears and the owner is pressed; under precise planning the decision is identified early, the information is ready, and the owner chooses among all six when the time comes. Same family as *Protect your investment* (headers, sheet grid, cards, the same foot implementation); no shield and no stakeholder cards. 25.0 s, one pass, resting on the second state. **Loop:** the brief asked for a loop; the founder chose one pass and rest, in line with Sections 46.4 and 46.6 and the other three owner visuals. **Withdrawn:** the request pile, *Which decision do you need first?*, *Needed first*, the *Required by / Needed for / Supports* panel, the neutral *ASAP* tag and the closing line *Clear priorities. Better-informed decisions.* **Not verified.** Judged in still renderings at both frame sizes; not seen in motion in a browser. | Marketing website (homepage): the Better decisions tab | Jeff Kaufman | Founder brief 2026-11-12 (*Better Decisions Section Redesign*); loop decision by the founder the same day. Sections 46.1–46.6, 48.8, 54.2, 8.9, 45. |
| 2026-11-12 | **Project owners → *Protect your investment*: the calm words become parallel end states (Section 54.4.5 amended).** Owner *Informed* becomes *In control*; Vendors *Clarity* becomes *Ready*; Design team *Aligned* and Consultants *Coordinated* are unchanged. Same place, type, colour and check; nothing else changed. | Marketing website (homepage): these four words | Jeff Kaufman | Founder direction 2026-11-12. |
| 2026-11-12 | **Project owners → *Protect your investment*: the second state is renamed (Section 54.4.5 amended).** *Projects with tight procurement control* becomes *Precise procurement planning*, pairing with the first state's *Weak procurement planning*. Same place, size, capitals and navy; nothing else changed. | Marketing website (homepage): this one heading | Jeff Kaufman | Founder direction 2026-11-12. |
| 2026-11-12 | **Project owners → *Protect your investment*: weak planning costs each group something of its own (Section 54.4.5 amended).** First state only; the second state, the footers, the sequence and its timing are unchanged. **Header:** *Weak procurement planning*. **Requests:** the repeated *Urgent* / *ASAP* / *Revised* become each group's own: Owner *Surprise*, *Rushed decision*; Design team and Consultants *ASAP*, *No priority*; Vendors *Rushed deadlines* (the brief's fallback for *Unrealistic deadlines*, which does not fit), *Rescheduled*. **Effects:** *Last-minute decisions*, *Competing urgent requests* (twice), *Stop-start work*; the longer set on two lines inside the card. **Layout:** slips widen to their words at the unchanged type size and run outward from the inner corner over the card; the second slip moves from overlapping the card's foot to just below it, so the two-line effects stay clear. Card positions, connectors and every other element unchanged. *Rescheduled* is allowed by the founder despite this visual's no-*scheduled* rule: it names a disruption, not a timetable. **Not verified.** Fit was tested by measure in a face wider than the page's and judged in stills at both frame sizes; not seen in a browser. | Marketing website (homepage): this one visual | Jeff Kaufman | Founder direction 2026-11-12 (*stakeholder-specific problems*). Sections 46.3, 48.8, 8.9. |
| 2026-11-12 | **Project owners → *Protect your investment*: slowed (Section 54.4.5 amended).** Timing only; artwork, words, colours, layout and the order of events are unchanged. 13.7 s becomes 22.8 s. Movements run about 40% longer (fades, draws, flights and arrivals), steps within a state follow 30 to 40% further apart, and the long holds are where the story turns: the first state is held, complete, about 4 s before it is withdrawn (was about 1.2 s); the frame is clear 0.6 s between the states (was 0.4 s); the second state, complete, is held about 1.6 s before the close rises (was about 0.7 s); the close then rests indefinitely. One pass, no loop, as before. One path nudged: the desktop curve of the bills leaving the upper cards drops 4 units lower at its first bend, because the slower, more finely sampled flight showed the top-right card's first bill grazing the margin kept around the contractor's card. **Not verified.** Pace not seen in a browser. | Marketing website (homepage): this one visual | Jeff Kaufman | Founder direction 2026-11-12 (*slow down the procurement-control animation*). Sections 46.1, 46.2, 46.4, 46.5, 46.6. |
| 2026-11-12 | **Project owners → *Reduce risk*: the drawings show the Hero's house (Section 54.4.5 amended).** The sketch on the top sheet of the drawings, a generic gabled house, is replaced by a front elevation of the homepage hero's house, redrawn in the sheet's own line: pylon, roof pergola, great roof, glazed storeys, cantilevered balcony, garage, lower wing, entry steps. The render is the reference, not the artwork: it is not placed, traced or filtered onto the sheet, and the Section 48.8 scope of the render itself (hero atmosphere, and the backdrop of *Protect your investment*) is unchanged. Sheet, border, heading bar, title block, dimension string, position, size and timing are unchanged; the dimension string is lengthened to the new house's width. **Not verified.** Judged in still renderings at both frame sizes; not seen in a browser. | Marketing website (homepage): this one drawing | Jeff Kaufman | Founder direction 2026-11-12 (*use the same house as the homepage hero*). Sections 48.8, 8.9, 45. |
| 2026-11-12 | **Project owners → *Reduce risk*: one sentence of the tab copy revised (Section 54.2.4 amended).** *You deserve a contractor with a plan, not just a promise.* becomes *You deserve a contractor with a plan, not just assurances.* The sentence after it, the headline, the first paragraph and the visual's closing lockup (*Confidence requires a plan.* / *Your contractor's procurement plan.* / *Powered by JiTpro.*) are unchanged. Copy only. | Marketing website (homepage): this one sentence | Jeff Kaufman | Founder direction 2026-11-12. |
| 2026-11-12 | **Project owners → *Reduce risk*: the documents lie on a drawing sheet (Section 54.4.5 amended).** A background treatment only; the foreground, its layout, the sequence and the 16.9 s clock are unchanged. The frame's plain white is replaced, for this visual, by `--jp-surface-light` under a faint grid and a thin border in `--jp-ink-secondary` (7% and 22%): the grid and border of the visual's own closing stage, on the same pitch and inset, so the light opening and the navy close read as one sheet. The white papers now lift off the ground. **Chosen from the founder's options:** light neutral ground, faint grid, sheet border. **Not used:** radial gradient and vignette (these illustrations are flat; Section 54.4.5), ghosted linework, the house render, navy. No spacing was changed. **Not verified.** Not seen in a browser. | Marketing website (homepage): this one visual | Jeff Kaufman | Founder direction 2026-11-12 (*the white background feels too plain and empty*). Sections 47.4, 48.8, 8.8, 45. |
| 2026-11-12 | **Project owners → *Protect your investment*: the two states are renamed, and each has the same foot (Section 54.4.5 amended).** A content and layout update only; the picture, its sequence and its 13.7 s clock are unchanged. **Names.** *Contractor out of control* becomes *Projects with poor procurement planning*; *Contractor in control* becomes *Projects with tight procurement control*. Same place, size, capitals and colours. **Foot.** The first state gains the band the picture closes on, drawn by the same implementation: *Poor procurement planning puts your investment at risk.* in white over *Preventable delays. Rising costs. Eroding profits.* in amber. It rises at 2.3 s, once the friction is drawn, and is withdrawn with the first state at 6.6 s. The closing band keeps its line, *A coordinated contractor protects your investment.*, and its timing; the phrase beneath becomes *JiTpro gets the field what it needs, when it needs it.*, replacing *Powered by JiTpro.* **Language.** *Procurement* in the two names and the first foot is a further scoped exception to the Section 20.1 retired-language rule, for this visual only. *Rising costs* and *eroding profits* name risks, not amounts; the rule that no figure is shown stands. **Not verified.** Fit was measured from the strings at both frame sizes in a wider face than the page's; it has not been seen in a browser. | Marketing website (homepage): this one visual | Jeff Kaufman | Founder direction 2026-11-12 (*update the procurement-control animation*). Sections 20.1, 46.3, 48.8, 8.9. |
| 2026-11-12 | **Project owners → *Reduce risk*: the first half is slowed a little, and a turn line is added before the plan (Section 54.4.5 amended).** A timing and transition refinement only; documents, dice, question, notices, hand, plan, close and all existing copy are unchanged. **Pace.** Everything up to the end of the sweep runs about 15% slower, so each part can be taken in: the documents are in by 2.4 s (was 2.0), the question at 4.05 s (3.4), the six notices from 4.85 s to 7.13 s (4.1 to 6.06), the pause 0.85 s (0.7), the sweep 1.55 s (1.35). The plan's checklist and the close keep their pace. **The turn.** New copy, the founder's: *It doesn't have to be this way.* Once the hand has cleared the table and the documents step back, the line is shown alone in the middle of the frame for about a second and a half, then goes, and the plan arrives. Plain bold type in `--jpd-nav-bg-start`, the caption's own at a larger size; no rule, no accent. Not shown under reduced motion. **Length.** 16.9 s, where it had been 13.9 s; still one pass that resolves and rests (Section 46.6). **Not verified.** Pace and the line's legibility over the stepped-back documents have not been seen in a browser (Section 54.5). | Marketing website (homepage): this one visual | Jeff Kaufman | Founder direction 2026-11-12 (*slow the sequence slightly; add a brief transition message*). Sections 46.1, 46.2, 46.3, 46.6, 7.7. |
| 2026-11-12 | **Project owners → *Reduce risk*: the hand is redrawn as one finished illustration, and it pushes and is drawn back (Section 54.4.5 amended).** A targeted correction to the hand and its sweep; documents, dice, question, notices, pause, reset, plan, close, copy and the 13.9 s clock are unchanged. **Why.** The founder rejected the hand as *a thick diagonal bar with a crude attached hand*: stiff, awkward, cartoonish. Rendering the old sweep at the frame's size showed the cause was the motion as much as the drawing: the hand left by the top almost at once and a long parallel-sided navy sleeve did most of the pushing. **Illustration.** One finished vector drawing of a right hand and forearm, palm down, seen from above and a little to its leading side, in its own file (`SweepingHand.tsx`): a sleeve narrowing to the wrist, a cuff, the wrist, the back of the hand, four tapering fingers held together, the thumb a little apart. Curved outlines only; never bars, blocks or stepped rectangles; no nails, knuckles or skin. It is moved as one object and no finger is animated. **Colour.** The documents' own: white under light washes of `--jp-ink-secondary`, outlined in `--jpd-nav-bg-start`, a soft offset beneath. No skin tone, no amber, and no solid navy sleeve. **Size.** Set by the dice and notices it pushes (1.35 on a desktop frame, 0.82 on a narrow one), where it had been set by the documents. **Motion.** It reaches in from beyond the lower left corner, fingers first (turned 44° from upright, travelling at 38° above level), arrives at the dice, and pushes dice and notices off toward the upper right; then it slows, turns round a little past the middle of the frame and is drawn back the way it came. *Superseded:* the sideways sweep at 22° and 25° that left by the top and the right, and with it the rule that the forearm's underside is a leading side. The forearm no longer crosses the frame. **Contact.** Computed from the hand's outline: each notice and die waits until the hand comes within a sliver of it or something already moving runs into it (a pile goes as a pile; the dice knock on the notices beyond them). **Not done.** No rotation of the hand in travel (it would break the computed contact); no finger animation. **Not verified.** Judged in still renderings at the desktop and narrow frame sizes only; not yet seen in motion in a browser (Section 54.5). | Marketing website (homepage): the hand and its sweep in this one visual | Jeff Kaufman | Founder correction 2026-11-12 (*correct the hand in Project Owners → Reduce Risk*). Sections 46.1, 46.3, 46.4, 48.8, 8.9, 45. |
| 2026-11-12 | **Project owners → *Reduce risk*: the opening dialled in (Sections 54.4.5 and 54.5 amended).** A targeted refinement of everything before the plan; the plan, the navy close and the copy are unchanged. **Documents.** Three, where there were two: drawings, contract and a new specification page, spread across the frame and balanced. **Dice.** They roll across the documents and stop in the middle of the frame, on the contract beneath its promises, and are never covered. **Notices.** The same six, now on alternating sides of the dice in two mirrored columns, every heading readable, clear of the dice and of the contract's promises. **Question.** On one line along the foot; it stays through the surprises and the pause. **Pause.** 0.7 s, everything still. **Hand.** Redrawn as one flowing outline of hand and forearm; it leans in from the lower left and sweeps diagonally up to the right (the first, an upright arm moving level, was stiff and crude). Notices and dice go with it, the way it goes; the documents stay. **Reset.** The documents alone for a beat, then stepping back to 16% as the plan is laid over them. **Clock.** A push may go in any direction. 13.9 s. **Not verified.** Appearance, in a browser (open item 15). | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-12 (*Final Animation Refinement*). |
| 2026-11-12 | **Project owners → *Reduce risk*: six surprises, a pause, and a hand that sweeps them away (Sections 54.4.5 and 54.5 amended).** A targeted change to the middle of the animation. **Surprises.** Six notices where there were three, in this order: *Change order*, *Schedule delay*, *Cost overrun*, *Decision needed now*, *More revisions*, *Another surprise*; each arriving sooner and landing faster than the last; piled in two columns over the contract and the dice with every heading in view. **Pause.** 0.8 s with everything still. **Sweep.** A hand, drawn from above in the documents' own line, crosses the frame and pushes all six notices and both dice off the table; each moves only once the hand reaches it, and with it; the documents beneath stay. **Then** the existing plan sequence, on the cleared table. **Withdrawn.** The plan being laid over the dice, and a notice leaving as each of three lines is checked. **Clock.** A cue may be pushed by a sweeper. **Unchanged.** The documents, the dice and their roll, the caption, the plan card, the navy closing stage and the closing lockup (*Confidence requires a plan.*; the brief's *demands* was treated as a slip, see open item 15). 13.7 s. **Not verified.** Appearance, in a browser (open item 15). | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-12. |
| 2026-11-12 | **Project owners → *Protect your investment*: the retained-value symbol becomes a small shield with a dollar sign (Sections 54.4.5 and 54.5 amended).** An icon replacement only. The stacked coins are replaced, for all five parties, by one symbol in the picture's own language: a small navy shield with an amber edge and a white dollar sign. No gradient, figure or nested shield. It means financial value protected through disciplined procurement management, not guaranteed savings or immunity from legitimate costs. Its place on the four cards and its timing are unchanged. **One placement moved:** the contractor's symbol stands just outside the great shield, at its lower right, instead of on it, so that no shield is drawn inside another. Everything else is unchanged. **Not verified.** Appearance, in a browser (open item 16). | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-12. |
| 2026-11-12 | **Project owners → *Protect your investment*: the contractor loses money too, and all five keep their value in control (Sections 54.4.5 and 54.5 amended).** An enhancement to sharpen the contrast between the two states. **Out of control.** Bills now fall into the dumpster from five parties, not four: the general contractor as well as the owner, design team, consultants and vendors. Everyone loses when the project is not controlled. Fifteen bills in all; the contractor's fall straight down from the contractor's card. **In control.** After the shield, the lines and the calm words, a small stack of coins settles on each of the five, one by one, the contractor last: money no longer leaking away. Small and plain; no money bags, piggy banks or figures. **Timing.** The close moves from 10.6 s to 11.3 s to make room; 13.7 s in all. **Limit.** Value retained, never a sum saved; no amount anywhere. **Unchanged.** Composition, house background, cards, shield, copy, style. **Not verified.** Appearance, in a browser (open item 16). | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-12. |
| 2026-11-12 | **Project owners → *Protect your investment*: the dumpster redrawn as a plain steel box (Section 54.4.5 amended).** A targeted correction. The previous drawing (tapered sides, rollers, a hook-up bar) read as a small cart or coal bin. It is now a traditional construction roll-off dumpster: a rectangular steel box with an open top and a flat bottom, sitting directly on the ground, with corrugated sides, a top rail and corner posts, seen from slightly above and to one side so the opening and one end show. No wheels, handle, hook, lid or taper, and the Design System now forbids them. The bills' curved paths are unchanged in kind; each now comes to rest deeper inside, so the near wall hides all of it before it is removed. Everything else is unchanged. **Not verified.** Appearance, in a browser (open item 16). | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-12. |
| 2026-11-12 | **Project owners → *Protect your investment*: the bin becomes a jobsite dumpster, and the bills follow curved paths into it (Section 54.4.5 amended).** A focused refinement of the wasted-money passage; nothing else changes. **Why.** A household bin was the wrong object for a construction site, and the bills moved too fast, in straight lines aimed at its sides. **Dumpster.** A roll-off container in the visual's own vector style: long and low, open top visible, ribbed sides, top rail, hook-up bar, rollers; layered so bills fall inside it. **Bills.** Twelve, one at a time around the four groups, the gap shortening so the drain builds; each takes about 1.1 s along a smooth curve that comes over the dumpster and drops straight down through the open top, visible until it is inside. **Stop.** No new bill after the disorder is withdrawn; those in the air finish; the dumpster fades as the shield begins. **Clock.** A cue may follow a cubic curve. **Verified by test,** in both designs: entry through the open top, between the walls, moving downward; no crossing of the contractor's card; no fade in the air. **Not verified.** Appearance, in a browser (open item 16). | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-12. |
| 2026-11-12 | **Project owners → *Protect your investment*: wasted money shown in the first state (Sections 54.4.5 and 54.5 amended).** An addition, not a redesign. While the contractor is out of control, a small waste bin stands beneath the contractor and dollar bills fall into it from all four groups (Owner, Design team, Consultants, Vendors), three from each, staggered. The flow stops and the bin fades with the rest of the first state; the second state, the close, the house background, the copy, the timing (13.0 s) and every other element are unchanged, and nothing of it is in the resting or reduced-motion frame. **Meaning and limit.** Avoidable waste from poor coordination, not legitimate professional fees; no amount, count or saving is shown. **Motion.** Bills travel and turn once as they fall; no bounce, loop or spin (Section 46.4). | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-12. |
| 2026-11-12 | **Project owners → *Protect your investment*: the Hero's house render reused as the background (Sections 54.4.5 and 54.5 amended; a second bounded use under Section 48.8).** Founder direction: reuse the existing luxury-residence render and the Hero's way of drawing it, adapted to this section's light scheme; no new illustration, and the house is not redrawn in SVG. **How.** The same WebP asset as an image at its own proportions, uncropped, centred, its foot on the closing band, a top-edge mask, 30% resting opacity, the Hero's one-pass reveal. **Adapted for light.** The Hero uses `lighten` to melt the night sky into a dark page; here the render is made grey and inverted and `multiply` melts its (now white) sky into the light frame. **Unchanged.** The Hero; the contractor-centred composition, cards, connectors, shield, sequence, timing and copy. **Consistent with** the rule on decorative imagery recorded the same day: this is the brand's finished render, not a sketch. **Not verified.** Not seen in a browser (open item 16). | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-12. |
| 2026-11-12 | **Project owners → *Protect your investment*: the background's building and crane removed; a rule on decorative imagery (Section 54.4.5 amended).** A targeted removal: the faint framed building and tower crane along the foot of the frame are gone, and nothing replaces them. They read as unfinished placeholder sketches and weakened the frame. The shield, the four cards, the connectors, the type, the colours and the animation are unchanged; the faint grid and crop marks remain. **Rule, for every homepage visual:** no decorative architectural or construction imagery unless it meets the quality of the primary illustration and contributes to the story. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-12. |
| 2026-11-12 | **Project owners → *Protect your investment*: visual finish refined (Sections 54.4.5 and 54.5 amended).** The contractor-centred composition, message, timing and words are unchanged. **Why.** The frame read as flat, generic and under-finished. **What changed.** The shield is larger (146 × 172) with a soft offset beneath it, a fine inner line, a larger hat and name, and a short amber rule above the mark. Each card gains a navy cap, a line glyph and a soft offset. The connectors gain rounded corners and a node at each end. A faint drawing-sheet grid, crop marks and a low outline of construction give the frame a setting. **Restraint.** No gradient, glow, gloss, texture or three-dimensional rendering; depth is a flat offset only. **Not verified.** Nothing has been seen in a browser, and the founder's second visual reference was not available to the implementer (open item 16). | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-12 (final frame finish). |
| 2026-11-12 | **Project owners → *Protect your investment*: recomposed with the general contractor at the centre (Sections 54.4.5 and 54.5 amended).** **Why.** The shield-around-the-project version over-emphasized the project and the plan and put the contractor in a corner as the source of trouble. The contractor is JiTpro's customer and the owner's partner; the tab is about valuing a contractor in control, not guarding against one. **Rule (founder).** *The general contractor is the hero* and belongs in the middle of the picture; JiTpro is the framework that helps. **Visual.** The contractor in the middle; *Owner*, *Design team*, *Consultants*, *Vendors* in the corners. *Contractor out of control*: an askew card, jagged lines and rushed requests spreading outward, one effect on each group. *Contractor in control*: a shield drawn around the contractor with the JiTpro mark, level lines to the same four, one calm word on each (*Informed*, *Aligned*, *Coordinated*, *Clear*). The word *scheduled* is barred. The close keeps the whole connected picture above a navy band: *A coordinated contractor protects your entire investment.* over *Powered by JiTpro.* 13.0 s. **Copy.** Unchanged (the approved copy of the entries below). **Motion.** No exception to Section 46.4. **Withdrawn.** The house, the three professionals' work sheets, the redone copies, the bills, the statement *The costs don't stop with the contractor.*, the contractor's plan board and the *Scheduled* slips (never committed). **Unchanged.** *Reduce risk*, *More predictability*, *Better decisions* and everything outside this tab. **Not verified.** Nothing has been seen in a browser (open item 16). | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-12 (*Animation Correction*). |
| 2026-11-12 | **Project owners → *Protect your investment*: copy replaced (Sections 54.2, 54.2.4 and 54.5 amended).** Copy only, founder-supplied, verbatim. Headline *Protect your investment with a contractor who plans beyond the jobsite.*; first paragraph *Your investment extends beyond construction…*; second *JiTpro helps your general contractor coordinate these requirements across the entire project team, reducing avoidable rework, unnecessary professional fees, and costly disruptions.* **Why.** The general contractor is JiTpro's customer and the owner's partner, not an adversary; *Your contractor's chaos shouldn't become your expense.* cast the contractor as the problem. The value is coordination across the whole team the owner pays for. **Unchanged.** The visual, the layout and type, and every other tab. **Open.** Whether the visual's first telling and its statement should be softened to match (open item 16). | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-12 (copy only). |
| 2026-11-12 | **Project owners → *Protect your investment*: recomposed around the project and a shield (Sections 54.4.5 and 54.5 amended).** **Why.** The founder rejected the first illustration: it was too like *Reduce risk* (an enlarged card beside a slogan on a navy stage), static, and did not show the owner's wider exposure, protection, or the owner back in control. **Direction (founder).** Protect the owner's *entire* investment; protection shown through a stylized shield and a clear exposed-against-protected contrast; no warrior, character, historical or fantasy device, photograph or software. **Visual.** A hub: the owner's project (a house) in the middle, architect, engineer and designer in three corners, the contractor in the fourth. Requests fly out from the contractor; redone work; three bills fly in and land on the project; *The costs don't stop with the contractor.* Then the shield is drawn once around the project and stands, navy with an amber edge and the JiTpro mark; the contractor's board becomes a small coordination plan; lines run from the contractor into the shield and out to each professional, each receiving a *Scheduled* requirement. The close removes nothing: a navy band rises along the foot with *Protect your entire investment.* over *JiTpro helps your contractor protect more than the construction budget.* 15.0 s. **Copy.** Unchanged from the entry below (founder-supplied). **Limits.** As below, and: the shield is coordination, not immunity; requests still go out, through it. **Motion.** No exception to Section 46.4; nothing scales. **Withdrawn.** The three-column composition, its captions, the *Owner* pile, the worded four-line plan card and the navy-stage ending for this tab (never committed). **Unchanged.** *Reduce risk*, *More predictability*, *Better decisions* and everything outside this tab. **Not verified.** Nothing has been seen in a browser (open item 16). | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-12 (*Major Creative Correction*). |
| 2026-11-12 | **Project owners → *Protect your investment*: redrawn as an illustrated story, with new copy (Sections 54.2, 54.2.4, 54.4.5 and 54.5 amended).** **Why.** The tab should say what no other does: an owner's exposure reaches beyond the construction contract. A contractor's unplanned procurement interrupts the architect, engineer, designer and consultants; where the owner engages them, the owner may pay for the repeated work under separate agreements, and it may never appear as a change order. The 2026-11-11 visual (a procurement chain and a late discovery) was a technical diagram about rework. **Concept (founder).** *One problem, many bills*, in the illustrated language of *Reduce risk*, without its dice. **Copy (founder-supplied, unedited).** Headline *Your contractor's chaos shouldn't become your expense.*; two paragraphs. **Visual.** 15.0 s: the team's three work sheets; the contractor's rushed requests (*Urgent*, *ASAP*, *Revised*); the work redone; three *Additional services* bills travelling to one owner, *Different professionals. Same owner paying.*; then the same team with the contractor's coordination plan (*Requirements defined*, *Reviews scheduled*, *Decisions coordinated*, *Responsibilities assigned*) and a *Scheduled* requirement for each; closing on the navy stage with *Better coordination protects more than the construction budget.* **Limits.** No amount, percentage, saving or date; necessary services are not called waste; the bills are tied only to repeated work and only to owner-engaged professionals; nothing claims bills are prevented or eliminated; the owner operates nothing. **Motion.** No exception to Section 46.4. **Withdrawn.** The first visual, its five-stage chain and its field-dimension scenario are removed from the code (they remain in git, commit `c768c5a`). **Unchanged.** *Reduce risk*, *More predictability*, *Better decisions*, the general contractor and architect tabs, the shared schedule data, and the section's state, pinning, scroll and transitions. **Not verified.** Nothing has been seen in a browser (open item 16). | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-12 (*Protect Your Investment*). |
| 2026-11-12 | **Project owners → *Reduce risk*: approved copy, and a navy closing stage (Sections 54.2, 54.2.4, 54.4.5 and 54.5 amended).** **Copy (founder-approved).** The second paragraph becomes *You deserve a contractor with a plan, not just a promise. JiTpro helps them build and manage the procurement plan that supports that promise.* Headline and first paragraph unchanged. **Why the ending changed.** The previous closing frame worked in concept and was flat: the card too small, too much white, not conclusive, and the brand's navy barely used. **The closing frame now.** A navy stage (`--jpd-nav-bg-start`) is drawn across the frame with the faint grid and border of a drawing sheet; the plan, white, grows to ×1.4 (×1.18 on a narrow frame) at the left and is the hero; to its right the lockup is set in `--jpd-nav-text`: an amber rule, *Confidence* / *requires a plan.*, *Your contractor's procurement plan.*, and *Powered by JiTpro.* in amber. Hierarchy: plan, headline, supporting line. No interface, schedule or diagram is added. **Unchanged.** Scenes one to four, the six-line checklist, the timing (12.6 s), the other three owner tabs. **Not verified.** Nothing has been seen in a browser (open item 15). | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-12 (final frame). |
| 2026-11-12 | **Project owners → *Reduce risk*: the ending strengthened (Sections 54.4.5 and 54.5 amended).** The story and style are kept; only the ending changes. **Closing lockup (founder-supplied).** *Confidence requires a plan.* over *Your contractor's procurement plan. Powered by JiTpro.*, replacing *Less uncertainty. More control.* **The plan becomes the centrepiece.** Once its lines are checked and the contract is clear, the drawings and contract are let go and the plan travels to the middle of the frame and grows (a gentle camera push; ×1.16 on a desktop frame). Priority in the closing frame: the plan, the headline, the supporting line. **Checklist (founder-supplied), six lines:** *Critical needs identified*, *Decisions scheduled*, *Responsibilities assigned* (the founder's *clearly* omitted to fit), *Long-lead items planned*, *Key approvals tracked*, *Risks surfaced early*. The first three still each lift one notice off the contract; the last three follow quickly. The plan is now as tall as the contract. 12.6 s. **Supersedes** the resting frame of drawings, contract and plan together. **Motion.** A travelling cue may grow as it goes. **Unchanged.** Scenes one to three, the copy beside the visual, the other three owner tabs. **Not verified.** Nothing has been seen in a browser (open item 15). | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-12 (final scene). |
| 2026-11-12 | **Project owners → *Reduce risk*: refined (Sections 54.2, 54.2.4, 54.4.5 and 54.5 amended).** The illustrated direction is kept. **Message.** From *shouldn't be a gamble* to *shouldn't have to feel like a gamble*: the tab does not call construction or contractors a gamble; it says an owner's confidence should come from a credible management process, not from assurances. **Copy (founder-supplied, unadjusted).** Headline *Your construction project shouldn't have to feel like a gamble.*; two paragraphs, the second *JiTpro helps your contractor bring greater control and accountability to your project.* **Storytelling: every scene must have an obvious meaning.** (1) The dice now stop against the contract, beside its two promises, and the caption is the founder's *Hoping everything goes according to plan?* in place of *Are you taking a gamble?* (2) The dice and notices no longer simply clear. The contractor's plan arrives while the surprises are still on the contract and is laid over the dice; then each line is checked and the notice it answers is lifted away, one at a time. (3) The roll is reduced (two hops, under one turn) and the dice no longer roll out. 11.6 s. **Limit restated.** A notice leaving shows that the contractor has a process for what the owner feared; it is not a promise, and neither promise on the contract is shown as guaranteed. **Unchanged.** The objects, their style, the closing line, the other three owner tabs and everything outside this tab. **Not verified.** Nothing has been seen in a browser (open item 15). | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-12 (*Reduce Risk Refinement*). |
| 2026-11-12 | **Project owners → *Reduce risk*: redrawn as an illustrated story, with new copy (Sections 54.2, 54.2.4, 54.4.5 and 54.5 amended).** **Why.** The 2026-11-11 visual asked the viewer to read a phased schedule and follow three requirements to the phases they reached. It was accurate and too complicated: a homepage visitor should grasp the point in seconds, without understanding procurement (Tesler's law: the complexity is real, and it is the contractor's and JiTpro's to carry, not the visitor's). **Concept (founder).** *Don't gamble with your construction project*: a contract on a stack of drawings; a pair of dice; three unwelcome notices; then the contractor's plan. In the document style of Identify. No schedule, chart, chain, dashboard or casino. **Copy (founder-supplied, unadjusted).** Headline *Your construction project shouldn't be a gamble.*; two paragraphs, the second *JiTpro helps your contractor identify and manage those risks early, before they become your surprises.* **Visual.** 11.5 s, one pass, resting on the drawings, the contract and the plan; closing line *Less uncertainty. More control.* **Authored.** Three document headings. **Limits.** No amount, percentage or date; the notices are not counted, priced or attributed; the plan's checks claim planning, not outcomes; the owner operates nothing. **Motion.** The clock gained an arrival from an offset, a roll, and a turn. **Exception to Section 46.4, directed by the founder and awaiting his explicit confirmation:** the two dice turn and hop as they roll in; bounded as recorded in Section 54.4.5, and extended to nothing else. **Superseded.** The 2026-11-11 *Reduce risk* visual and copy (entry below); its data, geometry and tests are removed from the code. It was never committed, so it survives only as the description in the entry below. **Unchanged.** The other three owner tabs, the general contractor and architect tabs, the shared schedule data, and the section's state, pinning, scroll and transitions. **Not verified.** Nothing has been seen in a browser (open item 15). | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-12. |
| 2026-11-11 | **Project owners → *Reduce risk*: new copy and a new visual (Sections 54.2, 54.2.4, 54.4.5 and 54.5 amended).** **Why.** The first version, built the same day with the other three owner tabs, spoke from the contractor's seat: it asked the owner to find problems, and its visual walked a procurement chain to a design gap. Owners do not manage procurement; they hire a contractor to. The owner's risk is that the contractor loses control months before the owner can see it. The tab should leave an owner thinking *I want my general contractor using JiTpro, and I understand why that control is worth paying for* (Tesler's law of the conservation of complexity: the complexity does not vanish when a contractor is hired; someone must manage it). **Copy (founder-supplied).** Headline *Don't wait until construction is underway to discover your project is already in trouble.*; two paragraphs, the second beginning *JiTpro helps your general contractor*. **Visual.** The sample project in five schematic construction phases, reading *Project progressing*; beneath it, three requirements nobody is managing; time passes and the owner meets a schedule impact, potential cost and urgent requests, with *The problem didn't start today. It became visible today.*; then the same project at the same early point with the same three requirements identified, assigned, dated and tied to the phases they support, the owner's own decision marked, and *Fewer preventable surprises. More control over your project.* 16.2 s. **From the data.** The project's name; who is responsible and when for each requirement (Connect's *Final Window & Door Design*, the windows chain's *Final Approval*, the owner's tile selection). **Authored.** The five phases, undated; the plain wording; the illustrative premise that the three went unmanaged. The brief's example date (December 4) is not used. **Limits.** Nothing is shown resolved or guaranteed; cost is *potential*; no amount, change order or moved date; the late colour appears once, in the first telling only; the contractor is not blamed; the owner operates nothing. **Unchanged.** The other three owner tabs and their visuals, the general contractor and architect tabs, the shared schedule data, and the section's state, pinning, scroll and transitions. **Not verified.** Appearance and the longer copy's fit in the pinned section have not been checked in a browser (open item 15). | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-11. |
| 2026-11-11 | **Project owners: new copy on three tabs, and a visual on all four (Section 54.2 revised; new Sections 54.2.4 and 54.4.5; Sections 54.4 and 54.5 amended).** **Why.** The owner is not JiTpro's buyer; the general contractor is. The owner can ask for it. The tabs should leave an owner thinking *I want my general contractor using this on my project*, without casting the owner as the software's user. **Copy (founder-supplied).** *Reduce risk* unchanged. *Protect your investment*: *Keep preventable problems from becoming costly setbacks.* *More predictability*: *Know what's coming before it becomes urgent.* *Better decisions*: *Know what needs your decision, and why it matters.* Each new description says *JiTpro helps your contractor*. One paragraph each; the takeaway is the visual's closing line. **Visuals: four short stories of the one sample project,** 11 to 13 s each, each drawn for the frame in a desktop and a narrow design. (1) *Reduce risk*: backward from the windows' on-site date to one unresolved design requirement, what it could reach, its assignment and its resolution. (2) *Protect your investment*: the same chain with a mismatch found at delivery and its possible consequences, then with the field dimensions verified before fabrication. (3) *More predictability*: four items' on-site dates, their procurement drawn backward, and the owner's decision on each, as *coming up*, *prepare* and *decision required*. (4) *Better decisions*: four requests all marked ASAP, the question *which do you need first?*, then the same requests in date order with why the first one's date matters. **From the data.** The chain, both dependencies and all four owner decisions with their dates are read from the shared schedule and Connect; only short display names and two illustrative conditions are authored. The brief's example dates are not used. **Limits.** No figure, saving, guarantee or re-dated milestone; a consequence is shown as possible and is withdrawn when resolved; the owner operates nothing. **Not done.** No owner call to action (the section has none), and no replay control. Built in one pass without a mockup round, at the founder's direction. **Unchanged.** The general contractor tabs and visuals, the architect tabs, the shared schedule data, and the section's state, pinning, scroll and transitions. | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-11. |
| 2026-11-11 | **General contractors → *Control* is recomposed: a schedule and a priority list drawn for the frame (Section 54.4.4 rewritten).** **Why.** The first implementation ended on the whole application screen at about two fifths of its size, with the list squeezed beside it; the founder judged it a compressed administrative dashboard. **What changed, after two static mockups the founder reviewed.** (1) Control no longer ends on the application screen. The schedule is drawn for the frame, with no application chrome. (2) Seven representative chains of the fifteen on a desktop frame, five on a narrow one; every chain with a requirement is shown, and the foot says how many are shown. (3) Activities are drawn by state in three neutral tones (four new tokens, `--jpd-state-*`); amber is only Today and what needs attention. (4) A two-row calendar header, year over months. (5) The Today line is amber. (6) Current work and a commitment falling due are drawn differently, and neither as overdue: a bar divided at today into elapsed and still-to-run, and a diamond on a future date. (7) *Final Field Dimensions* from Connect is included, giving the General Contractor a priority. (8) The transition is the defining moment: the other chains recede, each requirement gains its party and date on its own row, and those same marks, parties and dates then move into the list. (9) A narrow frame lists the soonest three and says how many more. **Unchanged.** The date, the look-ahead rule, the opening three stages on the featured chain, the copy, *Identify*, *Plan*, *Connect* and the shared schedule data. About 18.5 s. | Marketing website (homepage) | Jeff Kaufman | Founder direction and approvals 2026-11-11. |
| 2026-11-11 | **General contractors → *Control*: new copy, and its visual (Section 54.2 revised; new Sections 54.2.3 and 54.4.4; Sections 54.3, 54.4 and 54.5 amended).** **Why.** The fourth tab was a placeholder. Its subject, in the founder's words: *replace constant urgency with deliberate timing.* A contractor who treats every open requirement as urgent cannot tell the architect which of six requests matters; JiTpro's backward-planned schedule can (Tesler's law of the conservation of complexity). **Copy (founder-supplied).** Headline *Replace constant urgency with deliberate timing.*; description as supplied, its first two paragraphs set as one to keep the panel within the pinned presentation; closing statement *Less chasing. Clearer priorities. Better coordination.* It replaces *Know what needs your attention today, and what's coming tomorrow.* and its description. **Visual: six stages on one clock, about 16.0 s.** (1) The featured chain, whole. (2) A Today line, fixed at the illustrative date of November 18, 2026, is drawn across it; earlier work is subdued. (3) The camera moves in: the activity needing attention is ringed in amber and annotated *Work on this now*; the next two are annotated *Not yet*. (4) The camera pulls back to the whole Procurement Schedule, the same line now crossing all fifteen chains. (5) Everything is subdued but the activities that need attention now, lit in amber. (6) Those activities become a list, *Today's priorities*, by responsible party, each with its required date and the activity it protects, then *Coming next*. **One rule.** An activity needs attention when it is under way today and its hand-off is due within a fifteen-working-day look-ahead. Nothing is prioritized by hand; the marks and the list come from the same rule. On this date four of fifteen chains qualify, across the architect, two consultants and a vendor. **Limits.** Plan's schedule is used unchanged; no chain, date or duration is authored. The sample is on plan: no late, at-risk or warning state appears. Nothing depicts JiTpro directing outside parties. **Departures from the brief, for founder decision (Section 54.5, items 7 to 9).** No replay control: no sibling visual has one, and the visual column cannot hold a focusable control. *Connect*'s dependencies are not shown, so the general contractor and the owner have no block on this date. The copy's fit in the pinned presentation is estimated, not measured. **Unchanged.** *Identify*, *Plan*, *Connect*, the shared schedule data, and the section's state, pinning, scroll and transitions. | Marketing website (homepage) | Jeff Kaufman | Founder brief 2026-11-11. |
| 2026-11-11 | **General contractors → *Connect*: the six dependencies are re-placed on the chain (Section 54.4.3 amended; supersedes the dates and rules in the entry below).** **Why.** As first placed, three of the six fell within five working days at the chain's start and none fell after Release for Fabrication; the founder reviewed each against construction logic (`docs/design/Connect_Dependency_Placement_Review.md`) and set where each belongs. **The six, in the new date order, each with its rule, its date on the current chain and the activity its card names:** *Final Scope Clarification* (three working days before Buyout finishes; 29 June 2026; for Buyout), *Structural Attachment Requirements* (the midpoint of Submittal Coordination; 22 July 2026; for Submittal Coordination), *Final Window & Door Design* (the day Submittal Coordination finishes, immediately before Submittal Preparation begins; 7 August 2026; for Submittal Preparation), *Frame Finish & Color Selection* (three working days before First Submittal Review finishes; 7 October 2026; for First Submittal Review), *Final Field Dimensions* (unchanged: two working days before Release for Fabrication; 30 November 2026; for Release for Fabrication), *Final Glazing Specification* (ten working days after Fabrication begins; 17 December 2026; for Fabrication). **Every date is derived** from the chain's own activity with the working-day calendar, never authored, so each follows its activity if the chain moves; this includes 29 June, which the founder ruled must stay linked to Buyout. **Connect places all six itself.** The shared chain scenario, its commitment model, the chain's activities, dates and durations, *Plan* and *Identify* are not modified; the shared scenario still derives its own three dates (6 July, 10 August and 14 October 2026) wherever else it is used. **Unchanged.** The animation's stages, timing, styling, cards, rail, one-card-at-a-time rule and closing view; only the order of the rail and the reveal, and where each diamond sits, follow the new dates. | Marketing website (homepage) | Jeff Kaufman | Founder decisions and approval 2026-11-11. |
| 2026-11-11 | **General contractors → *Connect* shows six dependencies, not three (Section 54.4.3 amended).** A chain of 312 working days depends on more than three outside requirements. **The six, in date order:** *Structural Attachment Requirements* (Structural Engineer; 26 June 2026; for Submittal Coordination), *Final Scope Clarification* (GC / Glazing Subcontractor; 2 July 2026; for Buyout), *Final Window & Door Design* (Architect; 6 July 2026; for Submittal Coordination), *Frame Finish & Color Selection* (Owner; 10 August 2026; for Submittal Preparation), *Final Glazing Specification* (Architect; 14 October 2026; for First Revision Cycle), *Final Field Dimensions* (GC / Glazing Subcontractor; 30 November 2026; for Release for Fabrication). **The three existing ones are unchanged** and still come from the shared chain scenario. **The three added ones exist for this visual only** (`connectChainScene.ts`): the shared scenario and its commitment model, which admits only the design team, the Owner and consultants as owners, are not modified. **Each added date is derived from the chain, by a stated rule, never authored as a date:** structural, five working days before Submittal Coordination begins (the model's lead-days rule); scope, the day Buyout completes; field dimensions, two working days before the Release for Fabrication milestone, clear of the approval milestones' own marks. *Final Field Dimensions* is an illustrative prerequisite of this custom package, not a claim about all window packages. **Presentation.** Three of the six fall within ten days, so laid out together their cards stacked three high and their connectors crossed. Each card is therefore laid out alone, directly above its date, and **one card is shown at a time**: a card and its connector give way as the camera leaves, and its diamond stays on the chain. The closing view shows the chain with all six diamonds, enlarged to stay readable, and no cards; the rail names them. **Rail.** Six dependency rows in date order, each its name on up to two lines, then three illustrative inputs (*Permit Requirement*, *Supplier Confirmation*, *Manufacturer Requirements*); *Structural Confirmation* and *Field Dimensions* were promoted to dependencies and the two inputs nearest them in meaning were dropped. **Pacing.** Moves, reveals and reads are each shortened; the pass is about 30.6 s for six, against 26.7 s for three. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-11. |
| 2026-11-11 | **General contractors → *Connect* is redesigned: loose information, captured, then connected (Section 54.4.3 amended).** **Why.** The earlier visual travelled along the chain revealing three cards. The tab should show what Connect does (Tesler's law of the conservation of complexity): the requirements a procurement activity depends on exist whether or not anyone manages them, scattered across people, documents and conversations; JiTpro captures them, establishes who is responsible, and connects each to the activity and date that needs it. The reader should conclude: *now we know what each procurement activity needs, who must provide it, and when.* **Copy and the six-category summary are unchanged.** **Visual: six stages on one clock, about 26.7 s.** (1) Plan's resting schedule. (2) The camera moves in to the chain's start; ten small project records appear around it and drift a few pixels, attached to nothing: the chain's three commitments, at full weight, and seven illustrative inputs, muted. (3) The drift stops; a rail headed *Captured requirements* appears at the left, where Plan's rail is, and each record travels once to its own row: the three commitments first, in date order, the rest beneath a rule. (4) For each commitment in date order its row is marked, the camera moves to its date, and its existing card, its diamond on the chain and the connector between them appear, the connector now drawn from the card down to the diamond; the row then carries the same diamond. (5) The camera eases back to show all three connections together, and holds. (6) The schedule again, with the copy's summary revealed as before. **Limits.** Only the three commitments are the chain's data. The illustrative inputs carry a short tag and a name and nothing else: no date, no owner, no connection, and they never gain one. Nothing depicts automatic capture. No status, lateness or variance appears; that is *Control*'s. **Unchanged.** The chain, its dates and the three required-by dates (6 July, 10 August and 14 October 2026); the card, connector and diamond designs; *Plan*; the section's state, pinning, scroll and height. **Changed from the original:** the camera no longer travels on to Required On Site before returning; it ends on the three connections instead. The original is archived: record `docs/design/archive/Connect_Original_Visualization.md`, source commit `01207d0`. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-11. |
| 2026-11-11 | **General contractors → *Plan* is redesigned: new copy, the work named before the chain is built, and the software never shrunk for the list (Sections 54.2, 54.2.1 and 54.4.2 amended).** **Why.** The earlier visual showed how much there is to a procurement chain. The tab should show how JiTpro makes it manageable (Tesler's law of the conservation of complexity): the work cannot be removed, so JiTpro establishes it, orders it, gives it realistic durations and plans it backward from the field's date. The reader should conclude that JiTpro knows what has to happen, how long it takes and when to start. **Copy (founder-supplied).** Headline *Know what needs to happen. Know when it needs to happen.*; two description paragraphs; closing statement *The right work. In the right order. At the right time.* **Visual: five stages on one clock, 29.1 s.** (1) The field's requirement: *Custom Steel Windows & Doors*, *Required On Site: September 1, 2027*, stated in the chart; then the milestone appears on the calendar, alone. (2) The work, named: the list begins with its heading and *Required On Site*, then the five groups of activity appear one at a time beside the chart, each with its working days and a bar to the longest group's scale, then their total, 312 working days. Nothing of the chain is drawn yet. (3) The backward build, unchanged: every activity, duration, date and milestone as before, with the group being built marked in the list. (4) The whole chain, held. (5) The whole Procurement Schedule. **The list at the end.** The application window always keeps the whole frame. Where the copy leaves free room beside the frame the list still rests there; with this copy it does not at desktop sizes, so the list stays on its rail and fades as the schedule is revealed. The in-frame resting layout beside a smaller window, and its reflow, are withdrawn. **Opening order (corrected the same day).** The frame opens on the calendar alone; the statement appears at 500 ms, the milestone at 900 ms, and the list not until 2700 ms, heading first. **Opening statement (added the same day, founder-supplied).** *Start with when the field needs it.* The rail itself turns to the application's navy and carries the statement beneath a short amber rule, then returns to its light surface by 2700 ms, when the list begins in its place; the introductory hold is 700 ms longer for it. The *Required On Site* list entry had appeared at 500 ms, alone on the rail, before the list it belongs to: a holdover from the original visual's opening. No list entry may appear before the list's heading. **Unchanged.** The chain's data, the build's pacing, the calendar, the camera, the final view, *Connect*, and the section's state, pinning, scroll and height. The pass is 4.2 s longer than the original's 24.9 s: the two new stages. The original is archived: record `docs/design/archive/Plan_Original_Visualization.md`, source commit `6567fb0`. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-11. |
| 2026-11-11 | **General contractors → *Identify* is redesigned: new copy, and its visual becomes a four-stage story ending in the register (Sections 54.2, 54.2.1 and 54.4.1 rewritten; Sections 54.3 and 54.4 amended).** **Why.** The camera tour showed a sophisticated register. The tab should instead show what Identify does for a contractor: the project's unavoidable complexity is organized and managed for them (Tesler's law of the conservation of complexity), so they can see what the project needs and what is missing. **Copy (founder-supplied).** Headline *You can't manage what you haven't identified.*; two description paragraphs; closing statement *Know what you need. Know what's missing.* The role link and the method checklist are withdrawn from the tab. **Visual.** One timeline of 13.0 s from the tab's *played* state: (1) four project documents, scattered; (2) the documents are gathered to one side and a six-row procurement inventory forms beside them, one requirement at a time; (3) each requirement is marked defined, missing information, or unresolved scope, in the application's existing status language; (4) the inventory cross-fades into the canonical register, which holds on its heading, makes one vertical pan to its rows, holds, and then pulls back once to the whole application and rests there, as *Plan* ends on the whole Schedule screen (the pull-back added the same day, founder direction). The six-stop pan-and-zoom tour is withdrawn; the camera now makes two moves. **Limits.** It illustrates the method: nothing depicts scanning, extraction or validation, the conditions are representative, and no dates, lateness or recovery appear (those belong to Plan, Connect and Control). **Unchanged.** The section's state, pinning, scroll zones, transitions, frame and height; the register screen; Plan, Connect and Control. The pass is 3.6 s longer than the original's 9.4 s: four stages each need reading time, and the closing pull-back takes 2.5 s with its hold. The original is archived: branch `archive/identify-original-visualization`, record `docs/design/archive/Identify_Original_Visualization.md`. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-11. |
| 2026-11-11 | **General contractors → *Connect*: new headline and description, and a six-category dependency summary beneath them (Section 54.2 revised; new Section 54.2.2; Sections 54.3 and 54.4.3 amended).** **Copy (founder-supplied).** The headline *Turn loose dependencies into managed commitments.* becomes *Make sure every procurement activity has what it needs to move forward, without interruption.* The description becomes *Identify the decisions, information, approvals, and other requirements that each activity depends on. Connect them to the procurement schedule, establish responsibility, and make clear when each is needed.* Typography and spacing are unchanged. **Summary.** Beneath the description, six categories in two columns of three, each a `lucide` icon beside its label: *Design & Engineering*, *Owner Decisions & Selections*, *External Inputs & Commitments*, *Scope & Trade Commitments*, *Permits & Agency Requirements*, *Field & Installation Requirements*. No cards, borders or fills; ink only. **The Plan/Connect distinction.** There is no *Reviews & Approvals* category. Reviews, revisions and approvals are scheduled procurement activities and belong to Plan; Connect names what those activities need from outside parties (an architect's required response, an owner's selection). The categories are the kinds of requirement JiTpro identifies across a project, not six dependencies shown in the animation, which keeps its three. **Reveal.** The summary is hidden while the animation plays and fades in with a 6 px rise, in reading order, on the Connect visual's own clock, finishing exactly as the camera comes to rest on the application screen; it then stays. The cards, camera, timing and final view are unchanged. **Fit.** At 1440 × 900 and 1920 × 1080 the section's height is unchanged. At 1280 × 800 the new headline wraps to a fourth line, so on short desktop views (from `lg`, at most 864 px tall) the summary is set a step smaller and tighter and the presentation's vertical padding is 48 px instead of 64 px, which keeps the section pinned. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-11. |
| 2026-11-10 | **General contractors → *Connect*: the plan's dependencies, revealed forward through Plan's chain (new Section 54.4.3; *Final Glazing Selection* renamed *Final Glazing Specification*).** Connect starts and ends on Plan's finished application screen, zooms into the featured chain at its start, travels forward through the completed chain (not rebuilding it), and reveals its three dependencies as their activities come into view: diamond, then connector, then the card fading in with an 8 px rise, each held 2.4 s to read. It then travels on to Required On Site and returns to the application. It reuses the chain's existing commitment cards, connectors and diamonds (Section 51.10) in their on-plan colours only: no committed, provided or late lines, no late colour, no issues. Those belong to *Control*. **One schedule:** Connect draws Plan's scene and chain unchanged; its dependency dates are derived from that chain (July 6, August 10 and October 14, 2026), per the founder's ruling that the current Plan schedule governs Connect. The timescale header, calendar grid, Plan, the copy and the pinned section are unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder direction and ruling 2026-11-10. |
| 2026-11-10 | **General contractors → *Plan*: a long activity's label stays inside the visible part of its bar (Section 54.4.2 amended).** Fabrication's in-bar label (its icon and *Fabrication*, white bold, the chain's existing chevron label) was centred on the whole 2104-canvas-px bar, so at the build scale it lay about 1000 px off-screen and was never seen while the chain built. For an activity longer than `LONG_SPAN` (1000 canvas px; in the approved scenario only Fabrication), the label is now centred within the part of the bar in view in the chain's area, as a scheduling tool keeps a long bar's label visible, and kept clear of its ends (the Final Approval and Release for Fabrication milestones at its start, the chevron point at its end). It is revealed as before, as the planning edge clears the bar's start, at the end of Fabrication's move, and stays centred in the visible part as the camera moves on, until the bar leaves the frame. Wherever the whole bar is in view (the whole-chain hold, the schedule), the offset is exactly zero, so the label is at the bar's true centre. The offset is derived from the camera in `planStateAt`, the one state. No change to the label's typography, the bar, its dates or duration, the milestones, the camera, the timing, the step list, the grid or the timescale header. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10: make the long Fabrication segment identifiable like the other activities. |
| 2026-11-10 | **General contractors → *Plan*: the resting step list is larger and centred beneath the description (Section 54.4.2 amended).** The list's resting scale rises from 85% to 104%, about 22% larger: labels about 13 px (from 10.6), durations about 11.4 px (from 9.4), markers in proportion, with fonts, weights and colours unchanged. The two columns of three are centred as a group in the free area beneath the copy, the gap between them equal to the margin either side (up to 72 px), and the rows open to share the area's height (up to 50 px a row); each entry stays left-aligned. The free area, the 20 px below the copy and the section's pinned height are unchanged, as are the labels, durations, the build, its timing, the list's synchronised appearance and its path out of the frame. One consequence of the move's existing geometry: larger entries open apart more slowly while the second column keeps moving left, so the columns' brief crossing lasts about half a second rather than a third. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10: the finished list read as a compact cluster, too small for its space. |
| 2026-11-10 | **General contractors → *Plan*: the chain's timescale moves to a header at the top of the chart, as in Microsoft Project and Primavera P6 (Section 54.4.2 amended).** The focal chain's month axis beneath the chain is withdrawn on the homepage. In its place, a two-tier timescale header is pinned to the top of the chain's area, in frame px, so it stays at the top and at a readable size however the camera zooms. Horizontally every label and division is placed through the same camera as the chain, from the one state, so it cannot drift from the bars. **Tiers.** At the build scale: months on top (*September 2027*, shortened to *Sep 2027* or *Sep* as space requires), 12 px / 700 in `--jpd-chain-ink`, the most prominent element. Below them, weeks, each marked at its Monday with that day's number, 11 px / 500 in `--jpd-chain-ink-secondary`. Zoomed out (the whole-chain hold), the header becomes years over months, crossfading as a week narrows from 10 to 6 screen px (low enough that Fabrication's pull-back, about 17 px a week, stays months over weeks; the switch happens only on the move out to the whole chain). A period's label stays in view while any of its period is visible (it is held at the chart's left edge until the next period pushes it out), as a scheduling tool's timescale does. Month boundaries are the strongest lines in the header (`--jpd-chain-grid-week`); week divisions are ticks in the lower tier; the header has a `--jpd-chain-grid-week` rule beneath it and sits on `--jpd-surface`. The day and week gridlines now run from the header down through the whole chart. The camera centres the chain in the chart beneath the header, so the vertical framing moves down by half the header's height; horizontal framing, scale and timing are unchanged. The header fades out with the chain's grid on the pull-back, where the application's own period header takes over. The interactive Procurement Chain figure keeps its axis beneath the chain (Section 51.3). Dates, durations, proportions, the step list and the application screen are unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10: a timescale below the bars feels wrong for a scheduling interface. |
| 2026-11-10 | **General contractors → *Plan*: slower, readable pacing, and a day-and-week calendar grid behind the chain (Sections 51.7 and 54.4.2 amended).** **Pacing.** Each activity's move is now 560 ms plus 1.25 ms per canvas px, from 700 to 3400 ms (was 420 ms plus 0.25 ms per px, from 520 to 1100 ms). Fabrication and Delivery's Fabrication move goes from about 0.95 s to about 3.2 s, so its length reads as time. Its camera pull-back now leads the edge (eased out over the move's first 30%, in over its last 30%), so its peak speed across the screen falls from about 1.4 to about 0.3 px/ms. The short activities go from 0.52 s to 0.7–1.0 s. The rest after each activity rises from 300 to **650 ms**, and to **900 ms** where the activity's start is a milestone (was 450 ms). An activity longer than 1000 canvas px (about 125 calendar days; in the approved scenario only Fabrication) rests a further 300 ms, 1200 ms in all, after the camera has eased back in. The build goes from about 9.2 s to about 18.1 s, and the whole pass from about 16.0 s to about 24.9 s. The step list's timing follows, because it is derived from the same steps. **Grid.** Behind the focal chain, a calendar grid in the style of a Microsoft Project Gantt: a hairline at every calendar-day boundary, a stronger line at every week boundary (Monday, as the Schedule's own week ticks), and the Schedule's non-working-day shading (weekends and observed federal holidays, from the same working-day calendar the backward pass counts). The chain's horizontal scale is linear in calendar days (8 canvas px a day, Section 51.3), and working days are only counted, never laid out, so the grid's lines fall exactly on the dates the bars start and end on. The grid is drawn in the chain's own coordinates, under the same camera, so it cannot drift. It is not clipped by the planning edge, because the calendar exists before the plan does. Its density adapts to the camera, as a project tool's timescale does: day lines and shading show only while a day spans at least about 3 screen px, and week lines while a week spans at least about 10, both from the one state. It fades out with the chain's own axis on the pull-back to the schedule. Colors come from the Schedule's grid tokens: the day line is `--jpd-grid-strong`, and the week line and shading are derived by `color-mix` from `--jpd-text-strong` (16% on the surface; 3%, about half the Schedule's `--jpd-nonworking`), so no value is authored. At equal weight the Schedule's own `--jpd-grid` day line was invisible on the chain's white ground, and its full non-working shading outweighed the lines. Dates, durations, proportions, the six-step list, the camera's framing and scale, and the application screen are unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10: the build, Fabrication especially, moved too quickly to follow, and the chain should read as placed on a real calendar. |
| 2026-11-10 | **General contractors → *Plan*: the build is framed beside the step list (Section 54.4.2 amended).** While the chain builds, everything left of the planning edge is unbuilt and blank. With the edge at about two fifths across, that left a wide empty band between the step list and the chain. The edge now sits about a fifth across the chain's area (0.22), and Required On Site appears a little left of centre (0.42, from about three fifths), so the built chain fills the space beside the list. The founder's starting value was 0.18. It moved to 0.22 because the *Final Approval / Release for Fabrication* label, centred on its diamond, would otherwise appear over the list. The pull-back to the whole chain keeps its endpoints, duration and easing, but the chain's left end now travels in a straight line on screen; plain interpolation swung it left mid-move, over the list. A regression test keeps the edge and every revealed label clear of the list through the build and the pull-back. Camera framing only: the build scale, the chain's dates, durations and proportions, the timing, the 1.5-second hold, the application view and the step list are unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10: make better use of the horizontal space during the backward build. |
| 2026-11-10 | **General contractors → *Plan*: the step list travels to the free area on one continuous path (Section 54.4.2 amended).** The previous move reflowed the list into two columns inside the frame first, which carried the second column about 150 px to the right before the whole list reversed and slid left: a visible bounce. That two-stage move is withdrawn. Each entry now travels on one path from the rail to its place beneath the copy: it never moves right and never reverses vertically, and it decelerates into place. With the list's fixed start and end, the copy above the free area, and the first column having to finish left of the second, no such path exists without the columns crossing. The rule that no entry ever passes over another is therefore relaxed for this move only: the columns cross once, briefly (about a third of a second), and the second column fades back while they overlap, in proportion to the overlap. The list never crosses the copy. The start, the final two columns, the timing on the pull-back's clock, and the in-frame fallbacks are unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10: remove the bounce; chose the dimmed crossing over a residual rightward move. |
| 2026-11-10 | **General contractors → *Plan*: the finished step list rests beside the frame, and the application window keeps the whole frame again (Section 54.4.2 amended).** The previous refinement shrank the final application window to about half its size, to make room for the list inside the frame. That is withdrawn. The window again takes the whole visual frame, exactly as before the list (0.385× at 1280 × 800, 0.413× at 1440 × 900 and 1920 × 1080). The finished list rests outside the frame, in the copy column's free area beneath the Plan copy: two columns at 85%, left-aligned with the copy, 20 px below it. The section measures that area. On the pull-back the same six entries reflow into two columns inside the frame, drop below the copy's last line, and slide out into it. The build, its timing, highlights and durations are unchanged. Where the copy is not beside the visual (below `lg`), the earlier in-frame arrangement remains the fallback. The section's height and pinning are unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10: the window had become too small. |
| 2026-11-10 | **General contractors → *Plan*: a synchronized step list beside the chain, which moves beside the finished application (Section 54.4.2 amended).** Six consolidated steps, exactly as the founder specified, in backward-planning order: *Required On Site*, *Fabrication & Delivery*, *Review & Approvals*, *Submittal Preparation*, *Submittal Coordination*, *Buyout*. Each is grouped by activity family, so every step and milestone of the chain belongs to exactly one group. Each group shows its working days, summed from the chain: 188, 49, 30, 25 and 20, totalling 312. Required On Site is shown as a milestone with its date. Each entry appears as its part of the chain starts to build. The step being built carries the Register's selected-row treatment. While the chain builds and holds, the list is a panel on the frame's left, in the application's side-panel surface, and the chain is framed beside it. On the pull-back, the same six entries shrink, reflow into two columns of three and move left of the application window, which now rests at the frame's right on the frame's own ground, on the same progress as the camera. Below a 460 px frame the list is a band beneath, and the window sits above it. No dependencies, decisions or commitments are listed: they belong to Connect. Section height, pinning, the chain's data and the timing are unchanged. **Supersedes:** the previous refinement's full-frame final view, now a window beside the list. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10. |
| 2026-11-10 | **The procurement section gains an amber supporting statement beneath its heading, revealed once on scroll (Section 20.1 amended).** Directly beneath the `h2` *Procurement is more than buying materials.*, in the heading's column: *It's a complex sequence of activities, each with real durations and dependencies.*, used exactly as supplied. It is set at the section's existing semibold heading-face statement register, in `--jp-brand-amber`. That is the static brand color for emphasis typography (Section 8.1.1), and it meets contrast on `--jp-background` (Section 8.8). It is the section's single amber element (Section 48.7). It fades in and rises 20 px over 700 ms, ease-out, once, when it is comfortably in view. Under reduced motion it is shown at once. **Supersedes in part:** the 2026-11-06 rule that this section carries no amber. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10. |
| 2026-11-10 | **General contractors → *Plan*: the backward build rests on each step (Section 54.4.2 amended).** After each activity's move, the planning edge and the camera hold for 300 ms on the completed, labelled activity before the next begins. Where the activity's start is a milestone (Initial Submittal, either resubmittal, or Final Approval with Release for Fabrication), the rest is 450 ms. Each rest is part of its step's own interval on the one clock, so no delay accumulates separately. The build grows from about 5.6 s to 9.2 s, and the whole pass from about 12.4 s to 16.0 s. Moves, data, the 1.5-second hold, the pull-back and the application screen are unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10: the build moved too quickly to register. |
| 2026-11-10 | **General contractors → *Plan*: the finished schedule resolves into the JiTpro Schedule module (Section 54.4.2 amended; the presentation frame of the previous refinement is withdrawn).** At the end of the pull-back the schedule appears inside the same application as the Procurement Register (Section 54.4.1). It uses the shared shell (`JiTproShell`, Schedule lit) with the Schedule screen's own page header *Procurement Schedule*, its toolbar (Months), its item column, its period header and gridlines, the featured row in the selected-row treatment, and a legend in the Schedule screen's chip style. The final view is framed as the Register's overview: the screen's full width, from its top. The Schedule screen's header, toolbar, item cell, period header and legend chip are extracted unchanged into shared parts (`ScheduleScreenChrome`, `GanttParts`, `ganttTicks`), and the existing screen renders pixel-identically. Every chain, date, duration and the row order are unchanged, and the build, hold and timing are unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10. |
| 2026-11-10 | **General contractors → *Plan*: the schedule's rows run in strict Required On Site order, and the featured chain is anchored on 1 September 2027 on the homepage (Section 54.4.2 amended).** The rows are ordered by Required On Site date, earliest at the top, as a procurement schedule reads. This replaces the specification-section order of the previous refinement. The featured chain's approved date, 30 November 2027, is the latest of the fifteen, so date order alone would put it in the bottom row. The founder chose to keep it in the middle third by moving its whole chain earlier. On the homepage, the chain is anchored on Wednesday 1 September 2027, between the fixture's 23 August and 13 September dates. That makes it eighth of fifteen. The same engine moves every date together (Section 51.13): the same activities, durations and 312 working days, starting 4 June 2026. The other fourteen chains keep their dates and their lengthened durations. The interactive chain, the lab and Section 51.2's scenario keep 30 November 2027. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10. |
| 2026-11-10 | **General contractors → *Plan*: the schedule is refined (Section 54.4.2 amended).** Three refinements. First, the surrounding chains are lengthened for this illustration: each fixture item is rebuilt through the same scheduling engine with its activity durations scaled by its own factor, 1.35× to 2.6×, so the chains run 162 to 287 working days, start and finish on different dates, and overlap. Second, the rows run in specification-section order rather than Required On Site order, which puts the unchanged featured chain eighth of fifteen, in the middle third, with the schedule's calendar axis at the foot. Third, the finished schedule is presented in the chain's own frame (Section 51.9): a dark header with the logo and the title *Procurement Schedule* over a bordered sheet, drawn at screen size so the heading reads at every width. The shared schedule fixture is unchanged, and the animation is otherwise unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10. |
| 2026-11-10 | **General contractors → *Plan*: new description, and its visual becomes the procurement chain, built backward and revealed as one row of the project schedule (new Section 54.4.2; Sections 51, 54.2, 54.3, 54.4 and 54.5 amended).** The description now begins from when each item is required in the field and pulls backward through every procurement activity. This distinguishes Plan from Identify and resolves open item 6. The visual is the first homepage placement of the procurement chain (Section 51), approved here as Section 51 requires. It draws the approved Custom Steel Windows and Doors chain with the chain's own layout engine, tokens, icons and type, with no commitments, issues or callouts. Required On Site appears alone. The chain then builds backward, one activity at a time, as the camera follows. The camera pulls back to the whole chain, holds it for 1.5 seconds, then pulls back again to reveal the project's procurement schedule. That schedule is the shared fixture's other fourteen items, drawn as chains on one calendar axis; the fixture's steel window package is left out because the focal chain is that package. It rests there. Section 51.12's backward build is implemented for this homepage illustration, amended in one respect: it advances one activity at a time, rather than at constant calendar speed. The chain's interactive figure is unchanged. Its drawing vocabulary moves into shared modules, and the layout engine gains an optional shared calendar domain. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10 (three instructions: the Plan tab, the schedule pullback, the 1.5-second hold). |
| 2026-11-10 | **General contractors → *Identify*: the preview becomes the complete register under the camera (Section 54.4.1 rewritten).** The three-column homepage sheet was a mistake: the register itself was simplified when only the view of it should have been. The preview now renders the canonical Product Register screen (`ProductRegisterScreen`, the same component as the Learn More page, the expanded view and the demo lab). That is its full 1448 × 1086 canvas: sidebar, project selector, heading, summary cards, search and filters, the ten-column table and the Product Detail panel. Only the heading differs: it reads *Procurement Register* here, through an optional `title` prop, and every other surface keeps *Product Register*. The camera opens on the interface's full width and holds until the checklist has finished. It then tours items and categories; trades, suppliers and statuses; lead times and Required On-Site dates; then Source with the panel's Source Information. It settles on the heading, cards and first rows. It never exposes space outside the interface. The row fade-in and first-row emphasis of the 2026-11-09 sheet are withdrawn: the canonical screen is not animated internally, and the camera is the one motion. Supersedes the 2026-11-09 crop and the earlier 2026-11-10 camera entry's views and timing. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10, against the master `assets-src/methodology/product-register.png`. |
| 2026-11-10 | **General contractors → *Identify*: the register preview gains a single guided pan-and-zoom pass (Section 54.4.1 amended).** The sheet becomes a whole sheet that a camera moves over, by transform only. When the tab plays, the camera opens on the whole register fitted to the frame. It holds while the rows arrive and the first row's emphasis lands. It then zooms toward *Item / Description*, pans to *Trade*, pans to *Source*, and eases back to the approved crop, where it stops. It runs once per entry to the tab and never loops. It starts only after the checklist has finished, so it is never a second focal motion beside the checklist (Section 46.4). Reduced motion shows the approved crop at once. Supersedes 54.4.1's *nothing is scaled* in motion only: at rest the preview is the approved, unscaled crop. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-10. |
| 2026-11-09 | **General contractors → *Identify* replaces its reserved placeholder with a cropped Procurement Register preview (new Section 54.4.1; Section 54.4 amended).** The frame crops a light register sheet on its right and bottom edges. It shows three columns, *Item / Description*, *Trade* and *Source*, with rows read from the existing register fixture. It uses the Product Register's own `--jpd-*` table treatment. The first row carries the register's selected-row tint and bar, as decoration. The rows fade in in order on the checklist's *played* state. The first row's emphasis arrives with the checklist's final line. Reduced motion shows everything at once. The frame, layout and fit are unchanged, and every other tab keeps its placeholder. | Marketing website (homepage) | Jeff Kaufman | Founder direction 2026-11-09. |
| 2026-11-09 | **The general contractor *Identify* tab is revised (Sections 54.2, 54.2.1 and 54.3 amended).** New headline *Identify everything your project needs.* and description (founder-supplied). Between headline and description, a link to the existing `/roles/general-contractors` page: *Explore JiTpro for general contractors* with a right arrow. It is in `--jp-background` ink, with amber only as a decorative underline, because Section 8.8 prohibits amber text on `--jp-surface-light` (1.96:1). The founder chose this over amber text. Beneath the description, a three-line checklist whose lines fade in in order, each with a check. It plays when the tab becomes selected after the section is first seen, never restarts while the tab stays selected, and appears statically under reduced motion. No other tab, the scroll mechanics, the dropdown or the visual column changes. | Marketing website (homepage) | Jeff Kaufman | Founder request 2026-11-09; color by founder decision the same day. |
| 2026-11-09 | **The *How we do it* band gains a closing text link (Section 54.1).** Beneath *Every product. Every required step. Every critical commitment.*: *One project at a time. Your team. Our expertise.* with a trailing right arrow, one Brand Amber link to the internal `/product` route. Its type sits below the closing statement. The hover gesture is a 4px rightward arrow movement only, with none under reduced motion. Focus uses the `--jp-text-primary` outline. It is the band's second amber element, and Section 8.1.1 assigns links to Brand Amber. The band's wording, layout and type are otherwise unchanged. | Marketing website (homepage) | Jeff Kaufman | Founder request 2026-11-09. |
| 2026-11-09 | **The pinned audience section settles into complete states (Section 46.12 revised; Section 46.9's continuity rule amended for this pattern only).** Scroll position now **selects** a tab, with a small hysteresis band at each zone boundary. Copy and visual reach that tab's resting state through short, self-completing CSS transitions:<br>• copy fade out (~150 ms), then fade in with an 8 px rise (~200 ms);<br>• a one-panel visual slide (~450 ms).<br>The same transitions serve the unpinned form. A tab click goes straight to the chosen tab, without passing through the tabs between. **Cause:** the earlier presentation tied opacity and track position continuously to scroll, so stopping mid-change left half-faded copy and a visual between panels. Sticky mechanism, region lengths, release, reverse scrolling, tab clicks, audience switching, copy and layout are unchanged. No wheel interception or scroll snapping. | Homepage audience section only. | Jeff Kaufman | Founder review of 2026-11-09. |
| 2026-11-09 | **The JetBrains Mono 700 face is loaded (implementation correction, no new convention).** Every bold data-face eyebrow (`font-mono font-bold`, Section 7.7) asked for weight 700, but the font import loaded only 400 and 500, so browsers synthesized the bold by thickening the 500 glyphs. That made small eyebrows soft, most visibly in dark ink on `--jp-surface-light`. Adding 700 to the existing import renders the specified weight as designed. The typeface, sizes, tracking, colors and markup are unchanged. | Every `font-mono font-bold` eyebrow site-wide. Nothing else uses a mono weight above 500. | Jeff Kaufman | Founder review of the audience-section eyebrow, 2026-11-09. Chrome confirmed only the 400 and 500 faces were available. |
| 2026-11-09 | **The homepage audience section gains a pinned, scroll-driven presentation (Section 46.12 amended; Section 46.9 noted).** From `lg`, without reduced motion, and when the presentation fits the view, the section pins below the navigation and the reader's normal scrolling advances through the selected audience's tabs (4, 3 or 4) before releasing. Scrolling up reverses it. It is native `position: sticky` in a tall region, and scroll progress is the single source of truth: tab, copy fade and offset, and visual track. There is no wheel interception, snapping or scroll lock. Each tab holds for half a step before the next eases in. The visual column becomes a vertical sliding viewport whose incoming visual rises into place; this applies in every presentation. A tab click scrolls to that tab's hold point. An audience change resets to the region's start. Otherwise the section is the existing unpinned tabbed section. Section 46.9's *indicator must not become navigation* rule is amended for this pattern only. Copy, tabs, layout, the visual placeholders, the *How we do it* band and every other section are unchanged. | Homepage audience section only. | Jeff Kaufman | Founder direction of 2026-11-09. |
| 2026-11-09 | **The audience section is made compact (Sections 46.12 and 54.2 revised).**<br>• **Heading.** The two-line display heading becomes the eyebrow *What JiTpro means for:*. It is founder-supplied and resolves open item 1.<br>• **Audience control.** It becomes a defined field beside the eyebrow: the heading face, semibold, at 1–1.25rem; a 1px `--jp-ink-secondary` border at 70%; `rounded-lg`; a trailing chevron. It is as wide as its longest name, which also removes the gap the previous size-to-name treatment left beside shorter names.<br>• **Spacing and tabs.** Section padding and inter-element spacing are reduced. The tabs become more compact, keeping their 44px height.<br>• **Content stage.** The columns are top-aligned. The visual moves from 4:3 to 16:10.<br>• **Fit.** The section aims to fit one desktop view at 1440 × 900 and 1920 × 1080, without a fixed height.<br>• **Unchanged:** labels stay in sentence case (*General contractors*), as Sections 7.7 and 48.1 require. Copy, selection logic, the visual placeholders and every other section are unchanged. | Homepage audience section only. | Jeff Kaufman | Founder layout review of 2026-11-09. |
| 2026-11-09 | **The *How we do it* band is restored, immediately before the audience section (Sections 20.1 and 54.1 amended; Section 46.11 note).** The step stack's intro panel (Decision Log 2026-11-06, heading revised 2026-11-07) left the homepage with *Know what's coming* earlier the same day, which was not intended. It returns as its own section between *Fewer surprises* and the audience section, with its approved copy, layout, typography, colors and spacing unchanged: the *How we do it* eyebrow (its only amber), the heading *The level of procurement planning every project needs, but few receive.*, the two paragraphs, and the closing statement *Every product. Every required step. Every critical commitment.* It sits on `--jp-surface` with the 12% `--jp-border` top hairline, in the 5fr/7fr grid, at least one view tall from `lg`. **Only difference:** it no longer sticks. Section 46.11's sticky mechanism exists only inside a stack, and outside one it would pin the band while the rest of the page scrolled over it. Its heading becomes the section's `h2`, with its register unchanged. The intro panel's scoped "procurement" exception (Section 20.1) carries over to the band. | Homepage only: this one band. The audience section, every other section and the retained step-stack code are unchanged. | Jeff Kaufman | Founder direction of 2026-11-09. |
| 2026-11-09 | **The homepage audience section replaces *Know what's coming* (new Sections 46.12 and 54; Section 20.1 amended; Sections 46.11, 52 and 53 lose their current production use).** Phase 1: the reader picks an audience from a native select set as the second line of the section heading, and a horizontal tab rail shows only that audience's tabs. **General contractors** (default) have four tabs: *Identify*, *Plan*, *Connect*, *Control*. **Architects and design teams** have three: *See what's coming*, *Plan your workload*, *Focus on priorities*. **Project owners** have four: *Reduce risk*, *Protect your investment*, *More predictability*, *Better decisions*. Each tab shows a headline and description beside a visual column about half the content width. Changing the audience selects its first tab. One state value drives everything (Section 46.3). Tabs follow the WAI-ARIA tabs pattern with manual activation, so hover and focus never commit (Section 46.8). Every rail and panel shares one grid cell, so selection never changes the section's height. The surface is `--jp-surface-light`, so the section opens the light act and section 4's hairline transition is unchanged. Selector state is in ink, and there is no amber. **Visual columns keep the reserved placeholder (Section 46.8.1).** The planned visualizations are recorded as direction only: simplified Product Register, Required On-Site and procurement schedule figures, and an animation of floating external dependencies becoming linked commitments. **Copy:** used as supplied. Labels are set in sentence case (Sections 7.7, 48.1). "Procurement" gains a scoped exception for this section's tab copy. Architects and owners are addressed in this section only; the engagement model is unchanged (Section 54.3). The heading line *What JiTpro means for* is **provisional**: it was authored with the implementation and awaits approval. `KnowWhatsComingSection` and its figures stay in the codebase, unrendered, preserved at tag `homepage-four-step-stack-2026-11-09`. | Homepage section 3 only. Every other homepage section, the Roles page, the shared demo modules and the retained step-stack code are unchanged. | Jeff Kaufman | Founder direction of 2026-11-09, inspired by an audience-based navigation pattern the founder supplied as a reference. Open items for founder review are listed in Section 54.5. |
| 2026-11-08 | **The typical construction schedule is removed from Step 03.** The illustrative two-activity *Typical construction schedule* row and its caption sentence leave the Build-the-chain figure. The JiTpro procurement schedule row, its month scale, Required On-Site target, key, inspection and provenance remain unchanged. This brings forward the comparison's withdrawal recorded in Section 53.2. The Procurement Chain replacement is still to be specified, so Step 03 shows the JiTpro schedule alone until then. The step's heading *The dates fit. But does the work?* and its comparison paragraph are left in place for a separate decision. | Homepage Step 03 only. | Jeff Kaufman | Founder direction, 2026-11-08. |
| 2026-11-07 | **Step-stack intro panel heading revised.** The heading *A level of procurement planning most projects never get.* (Decision Log 2026-11-06) becomes *The level of procurement planning every project needs, but few receive.* Copy only: the register, colour, measure and composition are unchanged, and "procurement" stays within the 2026-11-06 scoped exception. | Homepage step-stack intro panel heading. | Jeff Kaufman | Founder direction, 2026-11-07. |
| 2026-11-07 | **Hero message sequence (Section 20.1 hero copy revised).** Beneath the unchanged eyebrow and headline, one fixed message area shows *Late materials. Wrong products. Idle crews.* (ink), then *It doesn't have to be this way.* (Brand Amber), then *JiTpro helps get the field what it needs, when it needs it.* (Brand Amber), which stays. The sequence uses opacity fades only, runs once per page load and never loops, and reduced motion shows the final message immediately. The permanent amber turn line and the profit statement *Don't let preventable problems wipe out your profits.* are removed from the hero. Hero amber (Section 48.7) is now the eyebrow, the final message, the primary action and the lighting. *Revised the same day:* the area now waits 1.5 s, each of the first two messages holds 2 s, and only the final message is amber (*It doesn't have to be this way.* is now ink). | Homepage hero only. | Jeff Kaufman | Founder direction, 2026-11-07. |
| 2026-11-07 | **One Product Register across Steps 01 and 02 (new Section 52.5; Section 53.1.2–53.1.3 revised; supersedes the same-day four-row register view).** Step 01 shows the register before any Required On-Site date is established: em-dash placeholders in the column, and *Not yet established* in the detail panel. Step 02 ends on the **same `HomeProductRegister` component**, not a second table. The four markers land on their products' cells, which then establish their own dates: Structural Steel 8 Mar 2027, Roofing Membrane 29 Sep 2027, Heritage Steel Windows and Doors 30 Nov 2027, Tile Package 22 Feb 2028. The panel then shows 30 Nov 2027. Exterior Stone Veneer and Custom HVAC Equipment stay not yet established. This is a presentation state (`RoSDPresentation`); the data keeps every date. Step 02's frame is the register canvas (1280 × 740), with the approved schedule as a card at its top. The `--jpd-rosd-column` wash is withdrawn. **Governing direction: one Product Register. Step 01 identifies the products. Step 02 establishes and populates their Required On-Site Dates.** | Homepage Steps 01 and 02. All data, dates, working-day calculations, the Gantt design and the Procurement Chain are unchanged. | Jeff Kaufman | Founder review of Steps 01 and 02, 2026-11-07. |
| 2026-11-07 | **Step 02's register view is the Step 01 Product Register (Section 53.1.2 revised).** After visual review, the final four-row table read as a different interface. It is now built from Step 01's own register treatment, in HTML: page header, table frame, header row, 54px rows, cell padding and type, selected-row tint and bar, and the shared `DemoStatusBadge`. The Required On-Site column is the focus, with a green header and a faint derived wash (`--jpd-rosd-column`). The markers land in that column as its dates. **The principle: the homepage shows one consistent JiTpro software interface, not separate graphics that carry the same information.** The approved Gantt, markers, timing and data are unchanged. The markers now travel to their product's register row rather than along the schedule row, because the register uses Step 01's row metrics. | Homepage Step 02 register view only. Steps 01, 03 and 04, all data and the schedule view unchanged. | Jeff Kaufman | Founder visual review of 2026-11-07. |
| 2026-11-07 | **Homepage Step 02 specified and approved for implementation (Section 53.1, now APPROVED).** A four-activity construction schedule Gantt (Structural Steel Erection 15 Mar 2027, Roofing Installation 4 Oct 2027, Steel Windows and Doors Installation 1 Dec 2027, Floor and Wall Tile Installation 6 Mar 2028) whose green Required On-Site markers (8 Mar 2027, 29 Sep 2027, 30 Nov 2027, 22 Feb 2028) are lifted out of the schedule and carried into a four-row Product Register excerpt, Heritage Steel Windows and Doors emphasised throughout. Each RoSD is set by that product's own receiving, staging and inspection needs; **there is no universal offset rule**. The windows date is the Procurement Chain scenario's fixed date, never a copy. One five-second pass on one shared progress value, played once when the figure is substantially visible, then held; a quiet *Replay*; reduced motion shows the completed state; below `lg` a static text presentation. Not scroll-linked: the Section 46.11 stack is unchanged. **Consequential amendments:** Section 52.1, the homepage register now takes the Structural Steel, Roofing Membrane and Tile Package dates from the Step 02 activities, and Structural Steel replaces Passenger Elevator so the register keeps six rows; Section 51.7, `chainTokens.css` may also be imported by the Step 02 figure so the homepage shares one green Required On-Site treatment. No new token. | Homepage Step 02; the homepage register's curated data (Section 52.1). The full Product Register screen, shared fixtures, scheduling engine and Procurement Chain are unchanged. | Jeff Kaufman | Founder approval of 2026-11-07: dates, products and the register change approved after Claude reported that the Step 01 roofing (17 May 2027) and tile (13 Sep 2027) dates would contradict the new schedule. Activity durations (40, 20, 30, 35 working days) are illustrative, authored with the implementation, for review. |
| 2026-11-07 | **Homepage step direction recorded for Steps 02–04 (new Section 53). Not implemented.** **Step 02** will show how construction schedule activities establish Required On-Site dates: a simplified construction schedule Gantt of several field activities; the dates the field needs specific products and materials highlighted and identified as Required On-Site Dates; the Gantt fading away while the markers stay; the dates carried visually into the Product Register. **Step 03** will show backward procurement planning from the Required On-Site date with the Procurement Chain alone, with no comparison against a conventional construction schedule (restating the Step 03 entry above). **Step 04** will progressively introduce the chain's supporting commitments and issues. Each is approved for further design and development. Its visual and motion conventions (the fade, the carry into the register, the progressive reveal) are **not yet specified** and MUST be specified in this document, under Section 46, before code. | Homepage Steps 02–04 (direction only). No code changes. | Jeff Kaufman | Founder direction of 2026-11-07, recorded at the PC-to-MacBook handoff so the work resumes without reconstructing decisions. |
| 2026-11-07 | **Procurement Chain scenario review and revision durations revised: 312 working days (Section 51.2 updated).** First Submittal Review 15, First Revision Cycle 12, Second Submittal Review 10, Second Revision Cycle 7, Third Submittal Review 5 working days, replacing 15/12 for every cycle. All other durations and the fixed Required On Site date (30 Nov 2027) are unchanged. The engine derives a Buyout start of 31 Aug 2026 (previously 3 Aug 2026). A total of 310 was stated with the direction; the approved individual durations sum to 312, which is the recorded total. **Open, unchanged:** a proposal to move the demonstration data date from Thu 26 Nov 2026 (Thanksgiving) to Mon 30 Nov 2026 has not been decided; `DATA_DATE` remains 26 Nov 2026. | Procurement Chain scenario (`chainScenario.ts`) and Section 51.2. Neither the engine nor the shared schedule fixture changes. | Jeff Kaufman | Founder direction of 2026-11-07. Section 51.2 is updated after implementation to match the approved scenario (not to match accidental code); the dates were re-verified against the engine and an independent working-day count. |
| 2026-11-07 | **Homepage Step 01 shows a curated Product Register (new Section 52).** Beneath Step 01's unchanged title and description: a curated **Product Register** for the Oak Ridge Residence on a fixed 1280 × 740 application canvas. It has the sidebar with Products active, four summary cards, a simplified filter row, six products in six columns (Fabrication Duration replacing Lead Time), the **Heritage Steel Windows and Doors** row selected, and a simplified detail panel ending on Required On-Site. **One story, one source:** the selected item's Required On-Site (30 Nov 2027), fabrication duration (180 working days), supplier and category are derived from the Procurement Chain scenario that Steps 02–04 use. Its status is Pending. The older 7 Jun 2027 date and 14-week lead time are excluded. **Below `lg`** a simplified card of the selected product replaces the canvas, which is never shrunk past readability. This is the homepage's second approved product demonstration, alongside Step 03's (amending the *one approved homepage product demonstration* wording of 2026-11-06). The step stack, the full Product Register screen and its fixture are unchanged. | Homepage Step 01 only. | Jeff Kaufman | Founder-approved direction of 2026-11-07, following the Step 01 inspection report. Title kept as *Product Register* to match the JiTpro software demonstration. Status Pending so Step 01 agrees with the reviews still ahead in Step 03. |
| 2026-11-07 | **Procurement Chain milestones share one end-of-work rule with their chevrons (Sections 51.3 and 51.4 corrected).** A chevron's right edge and every finish milestone are now placed by one function of the finish date (`workEndX`). Work followed by more work ends at the start of the next working day, so the milestone sits on the joint. The chain's final work ends at the calendar end of its last day, the Required On Site instant. Dates, labels and accessible names are unchanged. Nothing is positioned by hand. | Procurement Chain layout only (`chainLayout.ts`). The full Procurement Schedule draws bars without the reach across non-working days, so its rule (Section 51.14) is unaffected. | Jeff Kaufman | Reported after the review-duration change: milestones not following the recalculated work. Root cause: two rules for one instant. Chevrons reached the next working day; diamonds stopped at the calendar end of their date. A sweep of 120 anchor dates found 167 of 720 milestone placements detached by 2–3 days, every one before a weekend or holiday. Guarded by new regression tests (anchor-date sweep and duration variants), which fail on the old rule. |
| 2026-11-07 | **The Procurement Chain header moves to the dark navy band (Section 51.9 amended).** The header background is `--jp-surface`, filling to the container's rounded top corners. The logo is the dark-ground variant `JiTpro_Amber_white_text.svg`, unmodified. The title is in `--jp-text-primary` and the subtitle in `--jp-text-secondary`. The logo divider is `--jp-border` at 25%. Everything below the header (chain, markers, calendar, summary, legend) stays white. Existing tokens only, with no gradient or effect; typography, spacing and proportions are unchanged. | Procurement Chain header only. | Jeff Kaufman | Founder-directed visual refinement after approval of the chain design. `--jp-surface` is the site's dark band tone (the Step 03 intro panel). The white-text logo is the approved dark-ground variant already in production on the investor navigation. Its file carries three designer spacing annotations in near-black at about 2px on display, effectively invisible on navy; the asset is left unmodified. |
| 2026-11-07 | **Homepage Step 03 drops the schedule comparison. The Procurement Chain is built as an isolated component (Sections 46.10, 51.2–51.4, 51.8 and 51.13 amended).** **Step 03 direction:** the typical-versus-JiTpro comparison is withdrawn from the approved direction. Step 03 will show only the JiTpro Procurement Chain for Custom Steel Windows and Doors, eventually revealed backward from the fixed Required On Site date. The comparison component stays live, unchanged, until the replacement is built, tested and visually approved, and no reusable scheduling component is deleted. **The chain:** one continuous bar of sequential activities, never parallel bars or extra lanes. Commitments sit above it, issues below it. It reads its own scenario (`chainScenario.ts`; Required On Site 30 Nov 2027, start 3 Aug 2026, 332 working days), leaving the shared Heritage fixture untouched. Display labels are authored, and representative agreed and actual dates are working-day offsets from engine-derived requirements, so the whole demonstration follows its anchor date. **Refinements made during implementation and recorded here, not invented in code:** `MIN_PX_PER_DAY` 8 rather than 7; chevron joints centred on their boundary date, so each chevron's area equals its span; Inter Tight throughout, because Inter is loaded only to weight 600. The four open decisions of Section 51.13 are resolved. Nine fixture packages with no review activity between resubmittal and approval are recorded as a methodology issue for separate review. | Procurement Chain (new, isolated, previewed at `/demo-lab/procurement-chain`, DEV only). The homepage is unchanged pending visual approval. | Jeff Kaufman | Founder decisions of 2026-11-07 (Phase 2 authorization and the final methodology clarification). Verified by the layout tests (`chainLayout.test.ts`: continuity, proportionality, date alignment of every mark, no overlapping cards or labels, relationships preserved when the anchor moves) and the engine tests. |
| 2026-11-07 | **Scheduling correction: activities consume time, milestones record events (new Section 51.14; Sections 51.2–51.5 and 51.13 corrected).** Zero-duration milestones no longer consume a working day. Finish milestones (the default) share the finish date of the step before them. Start milestones exist only when declared explicitly, never inferred from a name. Consecutive milestones may share a date. **Required On Site shares the finish date of Shipping and Delivery.** Explicit gaps are preserved exactly. The current and baseline schedules now come from one shared backward pass. **Rendering:** milestone marks sit at their instant (a finish milestone at the end of its date, where its predecessor's bar ends). Same-instant milestones are stacked vertically at the shared x, never moved to another date. **Fixture impact:** every package now spans its activity total plus explicit float only. Each one shortens by its number of milestones (4–7 working days), and no activity duration changes. Two representative stories pinned to the derived requirement were re-pinned to keep their authored variance: Structural Steel's late connection criteria (five working days late) and Heritage Steel's late finish selection (six working days late, with its issue date). The 338-working-day figure recorded earlier the same day is withdrawn. | Scheduling engine (`scheduleModel.ts`), the representative schedule fixture, the full Procurement Schedule, the homepage Build-the-chain comparison (dates and Required On-Site alignment only), the Procurement Chain specification. | Jeff Kaufman | The engine gave each milestone its own working day: the `Math.max(1, gap)` step back was applied to milestones as well as phases, so a predecessor could never finish on a milestone's date. Corrected under the founder-approved methodology of 2026-11-07. Verified by new engine unit tests (13 of 14 fail against the previous engine; the duration invariant passes on both), by the existing QA harness (0 errors before and after the re-pins), and by an independent working-day count for the 332-day scenario. |
| 2026-11-07 | **The Procurement Chain visualization is approved as a new standard (new Section 51).** One procurement item's backward-scheduled sequence is drawn as connected, color-coded chevrons on a single calendar-day axis. The approved visual reference is `docs/design/procurement-chain-reference/` (`procurement-chain.html`, `render.png`), approved for its visual character only. Its coordinates, dates, durations, hex values, typeface, placeholder logo and hand-drawn icons are not normative. **Five decisions.** (1) **Data:** the Heritage Steel item, to be updated to the approved custom steel windows and doors scenario (332 activity working days, with zero-duration milestones). All dates come from the existing backward pass and working-day calendar, unchanged. Required On Site is fixed, and the reference's dates are not to be trusted. (2) **Color:** the reference's hue structure, adjusted for WCAG AA white text at the lightest gradient stop. A dedicated `--jpd-chain-*` sub-namespace of the approved product-demo namespace, declared once in a new `chainTokens.css`. The existing `--jpd-phase-*` values are unchanged. Fabrication moves to a red-orange clear of the brand amber. (3) **Commitments above, issues below** (Decision Log 2026-11-06 convention retained), each at its record's actual date, interactive through the existing inspector. (4) **Zero-duration steps are milestones, not chevrons.** Required On Site gets distinct emphasis: a larger diamond, a full-height date rule and a terminal label. The reference's rounded end cap is withdrawn. (5) **Callouts use calendar dates** (*October 29, 2026*), never relative day numbers. **Proportional accuracy is mandatory.** Widths derive only from dates, and the figure scrolls horizontally rather than distorting durations (`MIN_PX_PER_DAY` floor). Segment geometry, milestone placement and clustering, label-fit tiers, composition, the real logo (`JiTpro_Amber.svg`), provenance and accessibility are specified in Section 51. A **backward-building animation** (a planning edge travelling right to left from the fixed Required On Site date, driven by one shared progress value, with reduced motion presenting the final state) is documented in Section 51.12 and **not authorized for implementation**. Four decisions remain open (Section 51.13). | Procurement Chain component (new, isolated). Not the full Procurement Schedule, `ScheduleRowMarks`, the `--jpd-phase-*` tokens, or the homepage; homepage placement needs its own entry. | Jeff Kaufman | Founder-approved design decisions of 2026-11-07, following the procurement-chain inspection report. Contrast ratios computed against WCAG 2.x relative luminance and recorded in Section 51.7. *Amended the same day by the scheduling correction (entry above):* this entry originally recorded the engine's behaviour as milestones each occupying one working day, giving a 338-working-day span for the approved scenario. That behaviour was an error and has been corrected. Milestones take zero working days, and the approved scenario spans exactly 332. |
| 2026-11-06 | **The homepage step-stack intro panel is rewritten and moves to the dark band tone (amending the intro-panel entry below).** Approved copy, exactly: eyebrow *How we do it* (uppercase via CSS); heading *A level of procurement planning most projects never get.*; *We examine your schedule, drawings, specifications, and project information to identify everything the field will need.*; *Then we build a detailed, step-by-step procurement plan that shows what needs to happen, in what order, who's responsible, and when each step must be completed.*; closing statement *Every product. Every required step. Every critical commitment.* It replaces the two lead-in sentences (*We start by looking at...*, *We do the detailed planning...*), which leave the page. **Surface:** `--jp-surface` with a `--jp-border` 12% top hairline (Section 48.6), so Step 01 rises dark-to-light over it; the step panels keep white / light / white / light. **Composition:** the homepage's 5fr/7fr grid from `lg`, columns vertically centred in the panel; left the eyebrow (standard eyebrow treatment, `--jp-brand-amber`, the panel's only amber, Section 48.7) and the heading at the homepage section-heading register in `--jp-text-primary`; right the two paragraphs at the secondary body register in `--jp-text-secondary` within the Section 7.7 measure, then the closing statement at the semibold heading-face statement register in `--jp-text-primary`, emphasized but a clear step below the heading. Stacked below `lg`. No new register, token or color. Still unnumbered, outside the list, and covered by Step 01; the stack mechanism, step copy, the Step 03 comparison and the edge treatment are unchanged. "Procurement" in the heading and second paragraph is a further scoped exception to the Section 20.1 retired-language rule. | Marketing website (homepage) | Jeff Kaufman | Sections 7.7, 20.1, 46.11, 48.6, 48.7. Approved copy and direction supplied by Jeff Kaufman 2026-11-06: the preceding section says why JiTpro's support is needed; this panel says what makes the plan different, without repeating it. |
| 2026-11-06 | **The homepage step stack opens with an unnumbered intro panel (Section 46.11 amended).** The two lead-in sentences, *We start by looking at your schedule, drawings, and project information.* and *We do the detailed planning so your team knows exactly what needs to happen.*, unchanged, leave their floating position above the stack and become its first panel: full width, at least one view tall from `lg`, on `--jp-surface-light` with the surface hairline along its top, the two sentences one per line at the existing bold heading-face statement register in `--jp-background`. It is not a step: no ordinal, no count, not part of the numbered list, which still begins at *01 What does the project need?* As the reader scrolls, Step 01 rises over it and covers it exactly as each later step covers the one before, so Step 01 now casts the passing-edge shadow too; the intro covers nothing and casts none. Surfaces read light (intro) / white / light / white / light, Step 03 still on white. Steps 01-04, their copy, the Step 03 comparison, the sticky mechanism, its `lg` / 40rem / reduced-motion conditions and the edge values are unchanged. | Marketing website (homepage) | Jeff Kaufman | Sections 7.7, 46.11, 48.6, 8.8. Direction supplied by Jeff Kaufman 2026-11-06: the lead-in read as floating copy above the first slide rather than as the opening of the sequence. |
| 2026-11-06 | **The homepage sticky step stack gains a passing edge on each incoming panel (Section 46.11 amended).** Steps 02-04 each keep their existing 1px top hairline (`--jp-ink-secondary` at 20%, the approved light-surface hairline, unchanged) and add one restrained upward shadow from that edge onto the panel being covered: `0 -10px 18px -14px`, coloured `--jp-background` mixed to 38% with `color-mix()`, so no colour literal exists. The negative spread holds it to a thin band at the edge; it is not a card shadow and nothing else gains one. Step 01 covers nothing and casts none. Like the stack itself it applies only from `lg`, on a view at least 40rem tall, without reduced motion. No rectangular border, rounding, amber or other effect. Surfaces, dimensions, content, typography and the sticky mechanism are unchanged. **Amends:** Section 46.11's "no shadows" for this one edge treatment. | Marketing website (homepage) | Jeff Kaufman | Sections 8.8, 45, 46.11, 48.6. Direction supplied by Jeff Kaufman 2026-11-06: the alternating surfaces alone did not define the transitions enough. |
| 2026-11-06 | **The homepage sticky step stack alternates its panel surfaces (Section 46.11 applied).** Step 01 `--jp-surface-white`, Step 02 `--jp-surface-light`, Step 03 `--jp-surface-white`, Step 04 `--jp-surface-light`, each fully opaque across the whole panel, so a rising panel visibly covers the one beneath it. Existing tokens only; no new color, token, shadow, gradient or border. Ink is unchanged and already approved on both grounds (Section 8.8: `--jp-background` 18.41:1, `--jp-ink-secondary` 6.92:1, its 85% label floor 4.79:1 on `--jp-surface-light`, higher on white). Step 03, which holds the Build-the-chain comparison and its `--jpd-*` demonstration palette, stays on white. **Amends:** Section 46.11's "on the section's existing surface" for this use, which now alternates between the two light surfaces of the section's act. Behavior, dimensions, typography and content are unchanged. | Marketing website (homepage) | Jeff Kaufman | Sections 8.8, 46.11, 48.6. Direction supplied by Jeff Kaufman 2026-11-06: with four white panels the transition between them was hard to see. |
| 2026-11-06 | **The four-step snap sequence is withdrawn the same day and replaced by a sticky step stack (Section 46.11 rewritten).** The snap implementation was not the intended interaction. As the reader scrolls, Step 01 holds still, Step 02 rises from the bottom of the view and progressively covers it, then Step 03, then Step 04; scrolling up uncovers them in reverse; after Step 04 the page scrolls normally. **Continuous and scroll-driven by the reader's own scroll**: plain `position: sticky` on each opaque full-width panel inside its own list, so nothing is animated, snapped, timed or intercepted, and no dependency is added. A panel taller than the view (Step 03, with the Build-the-chain comparison) takes a measured negative sticky offset so it scrolls fully into view and is covered only after its bottom has been reached. Active only from `lg`, on a view at least 40rem tall, and when `prefers-reduced-motion` is not `reduce`; otherwise the panels are ordinary content. The comparison's inspection card now mounts on `<body>` so a rising panel cannot paint over it. Panels, copy, registers, the `01 / 04` count, and the lead-in placement are unchanged from the snap entry below. **Supersedes:** the snap entry below in full (never released), and still the Section 46.10 manual-only rule for these four steps only. | Marketing website (homepage) | Jeff Kaufman | Sections 46.2, 46.5, 46.10, 46.11, 48.6, 49.1. Direction supplied by Jeff Kaufman 2026-11-06, with reference to the stacked-panel scroll of the *Meet the Operators* section on canaglobal.com (behaviour only, not its design). |
| 2026-11-06 | **The homepage *Know what's coming* four steps become a step snap sequence (new Section 46.11), superseding their Section 46.10 disclosure-list presentation.** Founder-approved direction. Each step is a full-width panel on `--jp-surface-white` with every description visible: the ordinal with a restrained `01 / 04` count (Section 48.9, data face), the step title at the existing extrabold statement register (the Zone 3 register), and the description at the secondary body register; hairlines in `--jp-ink-secondary` at 20% between panels. **Copy, order and the Step 03/04 distinction are unchanged.** From `lg`, and only when `prefers-reduced-motion` is not `reduce`, each panel is at least one viewport tall below the sticky navigation and is a native CSS scroll-snap point on the root scroller (`scroll-snap-type: y proximity`, `scroll-snap-align: start`, `scroll-snap-stop: always`, `scroll-padding-top` = the navigation bar). The root rule is switched on only while the steps are mounted. **Proximity, never mandatory; no wheel, key or touch interception; no scroll lock; no dependency.** Below `lg`, or under reduced motion, the steps scroll normally. Step 03 keeps the Build-the-chain comparison unchanged beneath its description and grows past one viewport to hold it, scrolling freely inside its own snap area. The comparison's 2026-11-06 panel breakout is withdrawn because the panel is already full width. **Supersedes:** the Section 46.10 manual-only, no-scroll-driven rule *for these four steps only* (Section 46.10 itself remains APPROVED for other uses), and the 2026-11-06 Section 46.10 Step 03 disclosed-content amendment. The lead-in sentences keep the shared left edge above the panels. No other homepage section and no other design-system rule is changed. | Marketing website (homepage) | Jeff Kaufman | Sections 46.10, 46.11, 46.2, 46.5, 48.6, 48.9, 49.1. Direction supplied by Jeff Kaufman 2026-11-06: the four steps read as full-screen presentation slides between normally scrolling content, with reference to the section-to-section behavior (not the branding) of the Webflow *Simple Snap Scroll with FullPage.js* demonstration. |
| 2026-11-06 | **Step 03 of the homepage *Know what's coming* steps gains the Build-the-chain comparison, the one approved homepage product demonstration (Section 46.10 amended; Sections 20.1 and 48.8 applied).** When *03 Build the chain.* is open, beneath its unchanged description: the heading *The dates fit. But does the work?*; the explanation *A schedule can look achievable when buyout, coordination, submittals, and approvals are compressed into a few activities. JiTpro plans each required step using realistic durations, then works backward to show when procurement must begin.*; two schedules of one item, Heritage Steel Windows & Exterior Doors, on one calendar scale with one Required On-Site date (7 Jun 2027): **Typical construction schedule**, an explicitly illustrative two-activity plan (*Buyout and Submittals*, 40 working days; *Fabrication and Delivery*, 60 working days) in the neutral `--jpd-summary-bar`, run through the demo's own backward pass and working-day calendar, so it starts 13 Jan 2027; and **JiTpro procurement schedule**, the existing fixture item drawn by the full schedule's own row renderer, starting 16 Jul 2026, with every phase and milestone, the external-commitment diamonds above the bar and the issue mark below it, inspectable by hover, keyboard and touch through the existing `PhaseInspector`; a key for the two mark positions; the instruction *Explore the segments and diamonds to see the work and commitments behind the dates.*; and a disclosure that the typical schedule is illustrative and the JiTpro schedule is representative demonstration data. The difference in start dates is the argument and falls out of the durations; nothing is positioned by hand, and the fixture is unchanged. **Planning view:** no data-date line and no completed-work dimming on the homepage (scoped `.jpd-plan`); the full Procurement Schedule keeps both. **Layout:** from `lg` the Step 03 panel breaks out of the 7fr column to the full container width (container-query units), its description padded back under the step title; the timeline is fitted to the width with a 2.5px-per-day floor, below which it scrolls horizontally inside the step. **Tokens:** the `--jpd-*` namespace (Decision Log 2026-09-04) inside `.jpd`; one alias added, `--jpd-summary-bar` (= `--jpd-text-muted`). **Scope:** this authorizes this one comparison inside Step 03 only; it does not restore the retired homepage product demonstrations. The illustrative durations are labelled as an assumption and MUST NOT be presented as industry averages, project records, or universal durations. "Procurement" in the label and explanation is a further scoped exception to the Section 20.1 retired-language rule. | Marketing website (homepage) | Jeff Kaufman | Sections 20.1, 46.10, 48.8, 48.10, 8.9, 45. Direction supplied by Jeff Kaufman 2026-11-06: making a bar shorter does not make the work take less time; realistic procurement planning exposes schedule assumptions that an oversimplified Gantt chart conceals. |
| 2026-11-06 | **The homepage procurement section gains a consequence statement, and the *Fewer surprises* opening paragraph is revised (Section 20.1 amendment extended).** The procurement section's closing paragraph now reads *That's why procurement is so difficult to get right. One missed decision or late approval can delay deliveries, disrupt crews, and push work further down the schedule.*, followed by *Those delays spread. Costs grow. Profits shrink.* at the existing bold heading-face statement register in primary ink (the register of the former Method section's statements), the column's strongest line and a step below the `h2`. *Fewer surprises*' opening paragraph now reads *You can't prevent every problem in construction. But many procurement problems can be identified and addressed before they disrupt the field.* **No new register, token, or treatment is created;** layouts and surfaces are unchanged. **Supersedes in part:** the Section 20.1 retired-language rule, whose scoped "procurement" exceptions now also cover that *Fewer surprises* paragraph. | Marketing website (homepage) | Jeff Kaufman | Sections 20.1, 7.7. Approved copy and direction supplied by Jeff Kaufman 2026-11-06: connect procurement failures to schedule disruption and lost profit before introducing JiTpro's solution. |
| 2026-11-06 | **The homepage gains a procurement section between the core belief and *Fewer surprises* (Section 20.1 amendment extended), and "procurement" is released for that section's copy.** The approved copy, exactly and in order: the `h2` *Procurement is more than buying materials.*; *Every product, material, and service your project needs depends on a series of intricate steps that must happen in the right order, at the right time, with realistic durations.*; *Drawings must be complete. Decisions must be made. Products must be selected. Subcontractors must be hired. Submittals must be approved. Materials must be ordered, built, and delivered.* (each sentence set on its own line); the key insight *And much of that work depends on people outside your company.*; and *That's why procurement is so difficult to get right. One missed decision or late approval can affect everything that follows.* On `--jp-background`, on the shared left edge, in the homepage's 5fr/7fr two-column composition from `lg` (stacked below). **No new register, token, or treatment is created:** the `h2` takes the homepage section-heading register, the paragraphs the secondary body register, and the key insight the semibold heading-face statement register in primary ink. No amber, cards, icons, or graphics. *Fewer surprises*' existing amber-start hairline is the seam beneath it. **Supersedes in part:** the Section 20.1 rule that "procurement" stays retired from homepage copy, now excepted for the core-belief supporting paragraph and this section only; and the six-section architecture, which gains this section as 1b without renumbering. | Marketing website (homepage) | Jeff Kaufman | Sections 7.7, 20.1, 48.6, 48.7. Approved copy and direction supplied by Jeff Kaufman 2026-11-06: explain why procurement is complex without making the homepage complicated. |
| 2026-11-06 | **The homepage core-belief closing statement is removed and the supporting statement takes Brand Amber (Section 20.1 core-belief bullet and Section 7.7 supporting-copy allowance amended).** *Broken schedules lead to broken profits.* leaves the band because the hero already carries the message. The supporting statement *Early, accurate procurement planning is the first real opportunity general contractors have to make sure the construction schedule can hold.* moves from the secondary body register to the existing semibold heading-face statement register in `--jp-brand-amber` (the register and color the homepage final CTA's amber line already uses), prominent but a clear step below the white `h2`. **No new register, token, or color is created.** **Supersedes in part:** the 2026-11-05 rule that the eyebrow is the band's only amber; the band now carries exactly two ambers, the eyebrow and the supporting statement, and nothing else in it may take amber (Section 48.7). | Marketing website (homepage) | Jeff Kaufman | Sections 7.7, 20.1, 48.7. Direction supplied by Jeff Kaufman 2026-11-06: remove the repeated hero message and highlight the planning statement. |
| 2026-11-06 | **The homepage core-belief statement and supporting paragraph are revised (Section 20.1 core-belief bullet amended), and "procurement" is released for this one sentence only.** The `h2` now reads *Even the most robust construction schedule can't hold if the field doesn't have what it needs, when it needs it.* and the supporting paragraph *Early, accurate procurement planning is the first real opportunity general contractors have to make sure the construction schedule can hold.* Eyebrow, closing statement, registers and layout are unchanged. **Supersedes in part:** the Section 20.1 rule that "procurement" stays retired from homepage copy, for the core-belief supporting paragraph only. The word remains retired everywhere else on the homepage. | Marketing website (homepage) | Jeff Kaufman | Section 20.1. Approved copy supplied by Jeff Kaufman 2026-11-06, with explicit direction to record a scoped exception rather than release the word. |
| 2026-11-06 | **The homepage core-belief band gains a supporting paragraph and a closing statement (Section 20.1 core-belief bullet amended), and the Section 7.7 eyebrow allowance is extended for this one use.** The band now reads, in order: the eyebrow *What we believe*; the `h2` *Even the best construction schedule can't hold if the field doesn't have what it needs, when it needs it.* (the quotation marks of the 2026-11-05 copy are dropped); the supporting paragraph *Late materials, wrong products, and missing services disrupt the schedule. Those disruptions spread, costs grow, and profits shrink.*; and the closing statement *Broken schedules lead to broken profits.* **No new register, token, or treatment is created:** the paragraph takes the homepage's secondary body register (`--jp-text-secondary`), centered on the Section 7.7 52ch measure as the hero's centered statements are; the closing statement takes the existing semibold heading-face statement register in primary ink, a clear step below the `h2`. The eyebrow remains the band's only amber. **Supersedes in part:** the 2026-11-05 rule that nothing but the eyebrow and statement appears in the band, and the Section 7.7 eyebrow allowance's "still no supporting body copy" for this band only. The flanked form and every other centered editorial statement are unchanged. | Marketing website (homepage) | Jeff Kaufman | Sections 7.7, 20.1, 48.6, 48.7. Approved copy and direction supplied by Jeff Kaufman 2026-11-06: connect the belief to its consequence in cost and profit, closing on the line the hero no longer carries. |
| 2026-11-05 | **`--jp-surface-white` (`#FFFFFF`) is added to the light surface set (Section 8.8), and the homepage *Know what's coming* section is divided into three zones, amending the same-day six-section surface assignment.** Zone 1, the challenge (h2 and the capacity copy), stays on `--jp-surface-light`. Zone 2, the process (the two lead-in sentences and the Section 46.10 step list), sits on `--jp-surface-white`. Zone 3, the result (the two concluding statements), sits on `--jp-surface`, so Section 3 now ends on a dark band before Section 4 returns to `--jp-surface-light`. From `lg` up, Zones 1 and 2 use the two-column 5fr/7fr composition Section 4 already uses; below `lg` they stack. Zone 3 holds the shared left edge; its three closing sentences are each set on their own line in the strongest dark-surface ink, with *You know what's coming.* in `--jp-brand-amber` as the band's only amber (Section 48.7). **No copy is added, removed, or reordered**, apart from the approved closing sentence now reading *Your team knows what to do and when to do it.* No card, icon, or new type register is created. **Supersedes in part:** the 2026-08-25 note that only one new light-surface value exists. White is the ramp's lightest endpoint, not a third intermediate gray, so it adds a clearly separate step rather than a near-duplicate of `--jp-surface-light`. | Marketing website (homepage) | Jeff Kaufman | Sections 8.8, 45.2, 46.10, 48.6, 48.7, 49.1. Direction supplied by Jeff Kaufman 2026-11-05: the section carried too much on one continuous ground. The white token was chosen over an ink tint (which is close to the rejected third gray) and over hairlines alone (separation too weak). |
| 2026-11-05 | **The homepage *Know what's coming* steps become a Section 46.10 step disclosure list, a new approved pattern, and the four questions are replaced by four approved steps.** The approved copy: *01 What does the project need?* — *Identify every product, material, and service required to complete the work.* · *02 When does it need to arrive on-site?* — *Establish when each item must be available to support the construction schedule.* · *03 Build the chain.* — *Identify and sequence every step required to get each item to the field, using realistic durations and working backward from its required on-site date.* · *04 Link everything required to support the chain.* — *Connect the decisions, information, approvals, and commitments each step depends on. Identify who's responsible and when action is required.* Each step is a full-width row (ordinal, title, trailing chevron) between ink hairlines; every row starts collapsed; click, tap, Enter, or Space toggles that row's description independently. Manual only: no scroll-driven or automatic expansion. **No new register, token, or icon is created:** the ordinal keeps Section 48.9 on light, the title keeps the section's existing heading register, the description takes the section's secondary body register, and the hover wash, focus outline, and chevron are the Section 46.8 light-surface row treatments reused. **Methodology distinction, carried by copy:** step 3 establishes the procurement chain (sequence and realistic durations); step 4 connects the requirements that keep that chain moving. The rows share one treatment so the distinction rests on the approved titles and descriptions, not on a visual device. | Marketing website (homepage) | Jeff Kaufman | Sections 46.10, 46.8, 46.2, 46.4, 46.5, 48.4, 48.9, 49.1. Direction and all step copy supplied by Jeff Kaufman 2026-11-05. **Why a new pattern:** Section 46.8 explicitly does not approve one collapsible body per row, and Section 46.9 is a scroll narrative that forbids disclosure semantics, so no existing standard covered a per-row click-to-expand list. **Known mismatch, left for review:** the lead-in above the list still reads *Then we answer four simple questions:* while steps 03 and 04 are now statements rather than questions; the lead-in is preserved as instructed. A later scroll-activated behavior is anticipated and requires its own entry. |
| 2026-11-05 | **The homepage gains a core-belief section between the hero and *Fewer surprises* (Section 20.1 amendment extended), and the Section 7.7 centered editorial statement gains an eyebrow allowance.** The section is the eyebrow *What we believe* and one statement, *"Even the best construction schedule can't hold if the field doesn't have what it needs, when it needs it."*, centered on the elevated band tone (`--jp-surface`, `border-y` hairlines in `--jp-border` at 12%, Section 48.6) as a subtle transition out of the hero. The statement is the section's `h2`. The eyebrow is the band's only amber. **Superseded in part:** the Section 7.7 centered-statement rule "no eyebrow" now permits one small eyebrow naming the kind of statement; the flanked form is unchanged. | Marketing website (homepage) | Jeff Kaufman | Sections 7.7, 20.1, 48.6, 48.7. Approved copy and direction supplied by Jeff Kaufman on 2026-11-05: state the belief behind JiTpro as a foundational statement, not a sales pitch. This is the page's one centered editorial statement under Section 7.7. |
| 2026-11-05 | **The homepage hero copy is approved (Section 20.1 amendment, hero copy bullet), superseding the provisional headline *Broken schedules lead to broken profits.*** The `h1` is three questions on separate lines, *Broken schedules? / Broken promises? / Broken profits?*, all in primary ink; the third line no longer takes amber. *It doesn't have to be this way.* follows in Brand Amber and is the hero's one amber statement. The problem statement, the call-to-action statement and the JiTpro value statement follow in primary ink. Eyebrow, background treatment (Section 48.8), primary action and quiet secondary are unchanged. | Marketing website (homepage hero) | Jeff Kaufman | Sections 20.1, 7.7, 48.7. Approved hero messaging supplied by Jeff Kaufman on 2026-11-05: move the GC from recognizing familiar problems to seeing that better outcomes are possible. The value statement frames JiTpro as help, not a delivery guarantee, as the Section 20.1 short operating promise requires. |
| 2026-11-05 | **Illustrative figures about the reader's own job are permitted on the homepage (Section 20.1 amendment extended).** A figure MAY describe the contractor's own estimate or bid as an illustration, phrased as the reader's example, never as JiTpro's results, typical industry margins, savings, or recovered amounts, never paired with a JiTpro outcome figure, and leaving the question it raises open. First approved use: Section 5 of the homepage, *You bid the job at 12% profit. How much of that do you actually keep?* | Marketing website (homepage) | Jeff Kaufman | Section 20.1. Direction supplied by Jeff Kaufman 2026-11-05: the questions separate estimated profit from retained profit, which is the value JiTpro protects. The 12% is an illustration of the reader's own bid, not an industry average, a performance claim, or a promised outcome; the general no-figures rule otherwise stands. |
| 2026-11-05 | **The homepage is replaced by six plain-English sections (Section 20.1 amended), superseding the 2026-08-26 five-section architecture and the hero records of 2026-08-27 and 2026-09-03.** The sections: **1 Hero** (*Broken schedules lead to broken profits.*) · **2 Fewer surprises** · **3 Know what's coming** · **4 Throughout the project** · **5 Protect your profit** · **6 Final CTA**. Surfaces keep the three-act logic: `--jp-background` for 1–2, `--jp-surface-light` for 3–4, `--jp-surface` for 5, `--jp-background` for 6. Both primary actions read *Let's talk about your project* and go to `/contact`; the hero's quiet secondary reads *See how JiTpro works* and goes to `/learn-more`, which remains the Section 50 destination of the homepage secondary action. **The hero is static**: the entrance animation and the hand-drawn underline leave the homepage, and the house render keeps its approved Section 48.8 treatment without the reveal. **No longer used on the homepage, approval retained**: the Section 46.8 stage selector with its Section 46.8.1 figure, the two Section 17.1 photographs (the project-team photograph and the terminal field band), and the Section 20.2 lead-magnet band. Each keeps its APPROVED status for a future use, and Learn More's band and screens are unchanged. Source files, screens, photographs and lead-capture infrastructure are kept, not deleted. | Marketing website (homepage) | Jeff Kaufman | Sections 20.1, 7.7, 48.1, 48.8, 46.8, 17.1, 20.2. Strategic messaging review by Jeff Kaufman, approved as Phase 1 on 2026-11-05: make JiTpro's financial value clear within seconds, in words a third-grader can read and a GC recognizes. Navigation, footer, and supporting pages are out of Phase 1 scope and unchanged. The prior homepage is preserved at tag `homepage-pre-messaging-simplification-2026-11-05` (commit `909fda1`). |
| 2026-09-16 | **Amendment A11: the lead-magnet offer band becomes a product-style feature band, and its action takes Brand Amber (Section 20.2 amended; new Section 20.2.1).** The band as first approved presented the offer as text plus a hairline action, and read as another content section rather than as a free publication the reader can have. Three clauses of Section 20.2 are amended and one section is added. **(a) Composition.** From `lg` the band is two columns: a copy column at left carrying the eyebrow, heading, supporting sentence and **the action directly beneath the copy**, and a publication column at right carrying the rendered cover. Below `lg` it stacks eyebrow, heading, copy, action, object, so the reader reaches the action before the picture. This supersedes the original right-aligned, bottom-aligned action. **(b) Amber budget.** The band carries exactly two amber elements of its own, the eyebrow and the action, and the action is now **Brand Amber fill with `--jp-background` ink**, matching the approved fulfilment-email CTA. This supersedes "the eyebrow is the band's only amber ... never Brand Amber". No glow, wash, halo or amber rule may be added; amber inside the publication's own artwork belongs to the publication and is not a licence to spend more (Section 48.7). **(c) Subordination moves from hue to weight.** Because the band's action is now amber, it MUST be visibly lesser than the page's commercial primary in every other respect: smaller padding, smaller type register, and no shadow, glow or elevation. It is explicitly accepted that the two amber buttons may share a viewport (measured at the time of amendment: 548px span against a 911px viewport on the homepage), and **vertical spacing MUST NOT be inflated to force them apart**, because whitespace added for that purpose reads as a hole. Section 48.1 is not weakened: its one-primary-action rule is scoped to a surface, and the band is its own surface under Section 48.6. **(d) New Section 20.2.1, the publication object.** The image MUST be a mechanical render of page 1 of the approved committed PDF, never a recreation, reinterpretation or HTML approximation, which keeps Section 48.8 satisfied by construction. It is generated with `pdftocairo` and encoded to WebP at 800px and 1600px, committed under `public/assets/guides/` with the asset's version label in the filename and declared in the lead-magnet registry, so the consistency test fails if a new PDF version ships without its cover. **An explicit 1px `--jp-border` hairline is REQUIRED rather than decorative:** the Field Guide cover's ground is `#02101B`, measuring **1.05:1 against `--jp-background`** and **1.08:1 against `--jp-surface`**, so without an explicit edge the object dissolves into the band. `--jp-surface` therefore becomes required rather than preferred for this band. Treatment is a slight perspective, two page-edge slivers, one restrained `color-mix` shadow and a faint technical grid; no gloss, reflection, sheen, motion or amber glow. On mobile the perspective reduces towards flat and the transformed element is contained so no rotation can cause horizontal overflow. The object is decorative in the accessibility tree (empty `alt`, hidden from assistive technology) because the heading and supporting sentence already name the publication, and it remains non-interactive. | Marketing website | Jeff Kaufman | Sections 20.2, 20.2.1, 26.1, 48.1, 48.6, 48.7, 48.8, 49.1. Direction supplied by Jeff Kaufman 2026-09-16 after reviewing the Sprint 5 homepage band and declining the visual treatment: the copy and placement were approved, the presentation was judged flat and generic and did not make the guide feel like something tangible the visitor could get. Recorded here before the component changed, per Section 49. The contrast figures and the 548px/911px viewport span were measured against the live preview and the committed PDF rather than estimated. Section 26.1 is unchanged and still governs hairline secondaries elsewhere; only this band's action leaves it. |
| 2026-09-12 | **Marketing lead-capture dialog approved (new Section 28.1).** The one approved dialog for marketing capture: a native `<dialog>` opened with `showModal()`, focus to the first field on open, Escape (via `cancel`) and backdrop click to close, body scroll locked, focus returned to the opener, `aria-labelledby` on the heading; the Section 27.1 card as the panel at 32rem maximum width, full width less 16px gutters below `sm`, height capped at `100dvh` less 2rem with internal scrolling; scrim `--jp-background` at 88%; a labelled quiet Close pill with a 44px hit area; 160ms opacity-only entrance, none under reduced motion; one amber action per dialog state. Drawers and confirmation dialogs remain undefined. | Marketing website | Jeff Kaufman | Lead-gen plan §26 A1; Round 6 approval 2026-09-12. First use: the Field Guide lead-capture dialog. Section 28 was entirely TODO and Section 41 prohibits inferring a convention from `DemoLightbox`, so the standard is recorded before the component exists (Section 49.1). |
| 2026-09-12 | **Marketing capture field, checkbox, and fine print approved (new Section 24.1).** Label above the field in the contact form's label style; the contact form's input recipe; no placeholder as a label; a single required field carries no asterisk; validation on submit and then live only for a field already marked invalid; a native 20px checkbox with `accent-color: var(--jp-brand-amber)` wrapped by its label at a 44px row height; fine print in `--jp-text-muted` with underlined links hovering to `--jp-brand-amber-active`. | Marketing website | Jeff Kaufman | Lead-gen plan §26 A2; Round 6 approval 2026-09-12. Resolves the Section 24 TODOs for field anatomy, label placement, required notation, and validation timing on marketing capture forms; other Section 24 TODOs remain open. |
| 2026-09-12 | **Marketing form errors and status (new Section 33.1) and submit-in-progress (new Section 32.1) approved.** No semantic error colour exists and none is created: a field error is the `AlertCircle` icon plus text in `--jp-text-primary` beneath the field with `role="alert"`, `aria-invalid`, and `aria-describedby`, the invalid field's border rising to `--jp-text-primary` at 60%; outcome states that still grant access reuse the success layout with one honest sentence. Submit in progress: the control's label becomes a progress phrase, the control is disabled with its idle width held, no spinner, the form is `aria-busy`, and a muted "Still working…" line appears after 15 seconds. | Marketing website | Jeff Kaufman | Lead-gen plan §26 A3, A4; Round 6 approval 2026-09-12. Section 8.3's semantic model beyond amber and success remains TODO; meaning is carried by icon, text, and placement (Section 8.7). |
| 2026-09-12 | **Minimum touch target approved: 44 by 44 CSS pixels for interactive controls on marketing surfaces (new Section 34.1, referenced from Section 36).** Quiet text links reach it with padding. | Marketing website | Jeff Kaufman | Lead-gen plan §26 A5; Round 6 approval 2026-09-12. Resolves the open TODO recorded in the 2026-09-03 quiet-secondary-action entry. |
| 2026-09-12 | **Hairline secondary button approved (new Section 26.1).** `rounded-xl`, 1px `--jp-border` at 30%, transparent, the primary's padding and type, label in `--jp-text-primary`; hover is one gesture, border and label together to `--jp-brand-amber-active`; focus `--jp-text-primary` outline at 3px offset; no fill, shadow, or movement. For an action alone on a quiet surface that must stay subordinate to the page's commercial primary. | Marketing website | Jeff Kaufman | Lead-gen plan §26 A6; Round 6 approval 2026-09-12. Section 48.1 already permitted "hairline-bordered" secondaries but never specified one; recorded here rather than inside the component (Section 49). |
| 2026-09-12 | **Lead-magnet offer band approved (new Section 20.2), and one such band permitted after the close of a long-form explainer page (Section 50.5 amended).** After the final commercial CTA and before the footer; never above the final CTA; never in the hero; elevated band tone; left-aligned, two columns from `lg`; the eyebrow is the band's only amber; the action is the Section 26.1 hairline secondary; copy under Section 20.1 using the main publication title; at most one per page. On `/learn-more` it sits outside the numbered sequence and the guide rail and is neither a fourth primary nor a second secondary action within the argument. | Marketing website | Jeff Kaufman | Lead-gen plan §26 A7, A8; Round 6 approval 2026-09-12 (Decisions D1.2, D1.7, D6.6). Recorded as a post-CTA band outside the five-section homepage doctrine of 2026-08-26. |
| 2026-09-12 | **No Section 20.1 terminology exception and no Section 7.7 amendment are required for the Field Guide offer.** Homepage, Learn More, and dialog strings use the publication's main title and avoid the retired word by construction; publication titles set as site headings take sentence case, while the email and the PDF retain the publication's title case. Recorded as notes in Sections 20.1 and 7.7. | Marketing website | Jeff Kaufman | Lead-gen plan §26 A9, A10; Round 6 approval 2026-09-12 (Decision D1.4). |
| 2026-09-04 | **The JiTpro representative product screens become HTML/React components, and four rules are amended to permit it.** The five raster interface captures are being replaced by canonical React implementations rendered at a fixed 1448×1086 application canvas and scaled to their container, so they stay sharp at any size and can be enlarged without a second asset. First migrated screen: the Commitment Register (approved as **Visual Master v1**); the other four keep their rasters until each is built. **(a) §46.8.1's no-second-interaction rule is amended for the homepage methodology figure.** The visual MAY now carry a single non-committing enlarge affordance: a focusable control that opens the expanded view. It does NOT change the selected stage, so the stage rail remains the only thing driving the section, and the prohibition on any other control, hover state, or focus target inside the figure stands. **(b) §48.10's provenance line is withdrawn for these demonstrations.** The caption beneath the representative screens is removed site-wide with no replacement. §48.10 continues to govern every other figure carrying numbers, names, or dates unchanged. **(c) §48.8's prohibition on fabricated product screenshots is scoped.** What is prohibited is an image presented as a capture of something it is not. An **approved representative interactive product demonstration**, implemented as HTML/React from constructed fixture data, is a distinct and permitted category. Fabricated screenshots remain prohibited. **(d) A bounded `--jpd-*` product-demo token namespace is approved** (`src/components/demo/tokens.css`), scoped under `.jpd`. The demo UI is a different product's palette — application greens, reds, ambers and neutral surfaces — which `--jp-*` was never designed to express; forcing the marketing tokens to carry application semantics, or scattering hex through components, are the failure modes this prevents. §45 and §8.9 are unchanged for every marketing surface. **Product-model decisions recorded with it:** *Responsible Organization* is the organization or project entity that owes a commitment (never the supplier or product source merely because it is named in a description); *Commitment Owner* is the specific named person accountable for resolving it; and **JiTpro does not manage budgets, costs, pricing, or contract values**, so the reference's Value column is deliberately absent and no financial field exists in the fixture model. | Marketing website | Jeff Kaufman | Sections 45, 46.8.1, 48.8, 48.9, 48.10, 49.1, 8.9. Direction supplied by Jeff Kaufman across the three-part Visual Fidelity Implementation Standard and the prototype validation gate, 2026-09-04. The migration exists because the rasters are 1448×1086 with no higher-resolution source anywhere in the repository, so an enlarged view could only ever be an upscale; HTML is resolution-independent by construction. Visual fidelity was verified by forensic measurement of `assets-src/methodology/commitment-capture.png` and confirmed at a maximum landmark deviation of 3px. Typeface for the demo UI is Inter Tight, already loaded site-wide; weights 400 and 500 were added to the existing import. |
| 2026-09-04 | **The homepage Problem section gains two supplied paragraphs, and the §7.7 centered figure-statement block becomes a three-element block, amending the 2026-08-27 pair.** (a) Movement A gains *The challenge isn't knowing that information is missing. It's knowing __what needs attention now, what can wait, and when waiting becomes a problem.__* after the condition list, set in the section's existing secondary body register with the emphasis in the established `font-semibold` primary-ink idiom. **This reframes the movement from DETECTION to PRIORITISATION:** the argument is no longer that the team cannot see the open items, it is that they cannot see which one is about to matter. Read with the same-day h2 revision (*isn't focused on today that will stop work*), movement A now argues attention rather than visibility. (b) The centered block below the copy gains *When critical information gets attention too late, the options disappear. Decisions get rushed. Products get expedited. Work gets resequenced. Crews wait. And problems that could have been resolved months earlier become expensive field problems.* between the statement and the terminal line. The 2026-08-27 entry approved that block as a PAIR; it is now a three-element block. **No new register is created:** all three elements sit in registers this section already used, and the two balanced statements keep their 46ch `text-balance` measure while the running paragraph between them takes a wider 58ch measure, because centered running copy held to a statement measure sets as a stack of fragments rather than a paragraph. No divider, no eyebrow, and no accent are added; the section's amber stays on the warming rail and the ordinals (§48.7). **The 2026-08-26 copy budget (~175 narrative words) is raised accordingly**, and the rule it existed to protect is carried explicitly in the component instead: nothing further may be added to movement A that re-narrates the ladder or the option-set economics. **Known overlap, accepted:** the cost paragraph names expediting, resequencing, and crews waiting, which the warming ladder and movement B's paragraph already carry. It was supplied as written with the overlap understood; movement B's paragraph is the place to cut if the repetition is trimmed later. Claim strength is unchanged: both paragraphs describe a failure condition and neither states an outcome, a guarantee, or a lead time (§20.1). | Marketing website | Jeff Kaufman | Sections 7.7, 20.1, 47.4, 48.6, 48.7, 49.1. Both paragraphs and the section rewrite supplied verbatim by Jeff Kaufman 2026-09-04. |
| 2026-09-04 | **The homepage hero's on-ramp line becomes _JiTpro puts you ahead._, superseding _JiTpro helps you stay ahead._ from the 2026-09-03 hero copy replacement.** One sentence, copy only. Its position, body size, `font-semibold` primary ink, measure, and place in the second entrance beat are unchanged, as are the eyebrow, H1, underline, sub-headline, both CTAs, the §48.7 three-element amber count, and the house-render treatment. **Claim strength, recorded rather than assumed:** the retired line was approved on the reasoning that *helps* reads as assistance rather than a guarantee, and the replacement is a stronger statement of what the engagement is for. It remains outside every §20.1 prohibition, which are about delivery, conformance, replacing the project or design team's responsibility, controlling supplier execution, and absolute *not late, not wrong* pairs. It warrants no schedule, no delivery, and no outcome on the reader's project, and it MUST NOT be extended, qualified, or restated anywhere on the site in a way that does. | Marketing website | Jeff Kaufman | Sections 20.1, 7.7, 48.6, 48.7, 49.1. Copy supplied verbatim by Jeff Kaufman 2026-09-04. A terminal full stop was added to match the paragraph it closes and the composition's other sentences; the wording is otherwise as supplied. |
| 2026-09-04 | **The homepage hero's house render is drawn whole rather than cropped, amending the sizing half of the 2026-09-03 house-render decision.** The layer is sized by the render's own intrinsic ratio (1600×954, `w-full h-auto`) instead of `object-cover` with per-breakpoint object-position crops, so the entire house is present at every width and is never stretched. Below `lg` it runs full-bleed at viewport width; from `lg` up its rendered width is capped (1120px, centered), so on wide and ultrawide monitors the render stops enlarging and `--jp-background` extends past its left and right edges rather than the composition zooming into a fragment. Two overlay adjustments follow from it and are part of this decision: the copy scrim is narrowed horizontally and lengthened vertically (44%×60% at 50% 44%) and given more centre density (80%), so it holds contrast behind the copy column without washing across the house's wings; and the bottom hand-off gradient is held lower (clear to 62%, 58% at 86%, full `--jp-background` at 100%), still resolving completely at the section's last pixel so the seam to the next section stays invisible, but no longer erasing the house at narrow widths where it occupies the lower band. The top-edge alpha mask shortens to 18% — with the layer now bounded to the image, the old 44% ramp consumed the upper storey. **Everything else in the 2026-09-03 treatment is untouched and remains binding:** one restrained resting opacity (55%), `mix-blend-mode: lighten` inside the section's `isolate` so the render's night sky and dark foreground melt into `--jp-background` (which is also what leaves the capped layer with no visible edge), `aria-hidden`, the entrance reveal on the shared `--hero-delay` timeline, and the rule that the render argues context and never mechanism. No copy, CTA, structural, typographic, spacing, or token change. | Marketing website | Jeff Kaufman | Sections 45.4, 46.1–46.5, 48.6, 48.7, 48.8, 49.1, 49.3. Direction supplied by Jeff Kaufman 2026-09-04: the house is part of the composition, not wallpaper — visitors should see substantially the entire house, centered, not scaling indefinitely on ultrawide and not reduced to a narrow slice on mobile, with edge darkening reduced while contrast behind the hero text is preserved. Recorded here before the component changed, per §49.1. |
| 2026-09-03 | **The hero copy is replaced end to end (copy only; no structural, visual, or token change), superseding the same-day preventable-chaos revision.** The approved surface: eyebrow *Built by contractors* (unchanged) — H1 *We refuse to accept that chaos is just part of construction.*, dropping *preventable* — sub-headline *As construction companies grow, keeping every decision, approval, product, material, and service ahead of the field gets harder.* — on-ramp *JiTpro helps you stay ahead.*, set at body size in `font-semibold` primary ink so it bridges into the action while staying subordinate to the H1 by size and position — primary CTA unchanged in label, treatment, and destination (*Start with one project* → /contact); secondary CTA unchanged in treatment and destination (/learn-more), its label gaining only a terminal full stop (*Or click here to learn more.*). **Retired copy:** the growth/accountability question and the *We've stood in your boots* paragraph; the hero no longer names profit and asks nothing. The question form is withdrawn and the sub-headline returns to the 2026-08-27 chain paragraph's upstream-work vocabulary — decision, approval, product, material, service, ahead of the field — as one declarative sentence. The centered composition, 52ch measure, entrance stagger, the §48.7 three-element amber count (eyebrow, underline, CTA — the on-ramp's emphasis is ink, not amber), and the house-render treatment approved earlier today are all untouched. | Marketing website | Jeff Kaufman | Sections 20.1, 7.7, 48.6, 48.7, 49.1. Direction and all copy supplied by Jeff Kaufman 2026-09-03 as a complete hero specification; an editorial note in the source brief was excluded as non-customer-facing, per that specification's own instruction. §20.1 holds: the growth framing (*As construction companies grow*) keeps the audience rule, chaos stays a condition of the industry rather than of the reader, and no outcome is warranted — *helps you stay ahead* is assistance, not a guarantee. Standing instruction reaffirmed: no em dashes in customer-facing copy. |
| 2026-09-03 | **The amber house render returns to the homepage hero as its background atmosphere, superseding the no-hero-graphic decision (2026-08-26, restated in the 2026-08-27 refusal-hero rebuild).** The brand's own cinematic night render (`assets/hero/house-render`) is placed as a full-bleed, bottom-anchored layer inside the hero's existing `aria-hidden` lighting stack: `object-cover` with per-breakpoint crops (the wide composition at desktop; a deliberate crop keyed to the render's central illuminated mass at narrow widths, never a shrunken desktop frame), the top edge dissolved by an alpha mask so the house emerges from the lower field, `mix-blend-mode: lighten` inside the section's `isolate` context so the render's night sky melts into `--jp-background` and only the lit architecture lifts out of the page's own dark, and one restrained resting opacity on the layer (§45.4). A center scrim in `color-mix`ed `--jp-background` keeps the copy column and the CTA on a dark ground. **The reveal is one more element of the hero's single entrance (§46.3):** the same per-page-load state and `--hero-delay` mechanism that stagger the copy drive a ~2s opacity emergence that begins after the copy's last beat has landed (§46.2) and never loops; reduced motion renders the resolved state — the house present, static (§46.5). **The §48.7 three-element amber count recorded earlier today is unchanged:** the house joins the lighting environment beside the existing warm key; it is atmosphere, not an accent, and MUST stay subordinate to the copy. No copy, CTA, structural, or token change anywhere, and the 2026-08-27 rule that the hero teaches no mechanism stands — the render argues context, never method. | Marketing website | Jeff Kaufman | Sections 45.4, 46.1–46.5, 48.6, 48.7, 48.8, 49.1. Direction supplied by Jeff Kaufman 2026-09-03: a premium, cinematic amber house gradually emerging behind the hero message, reinforcing construction context without competing with the text — the older JiTpro amber-house visual language as the reference point. §48.8 conformance: a purpose-built JiTpro render first shipped in the original cinematic hero, not stock or generic technology imagery; §48.8 gains a bounded exception recording it. Shipping asset optimized from the 1.8MB original PNG to `house-render-{800,1600}.webp` (42KB/130KB) via the established srcSet convention. |
| 2026-09-03 | **The in-page guide gains a persistent rail presentation at the wide breakpoint, and Section 50.9 is added to define it.** On `/learn-more` the guide moves from a one-time block in the document flow to a `position: sticky` rail beside the content, so a reader deep in section 08 can reach section 02 without scrolling back. **Section 50.4's prohibition on "a sticky rail that follows the reader" is withdrawn and replaced** by 50.9, which bounds it: sticky rather than fixed, inside the guide's own container so it cannot reach the header or the footer, one presentation rendered at a time, and an active state carried on three non-colour axes. **Section 50.7 is amended**: where the rail is present the surface acts are carried by the content column rather than the full page width, because a rail cannot cross from the dark ground to the light one and stay readable. Below the breakpoint the existing in-flow guide and the full-bleed acts are unchanged. Page copy, section order, and CTAs are untouched. | Marketing website | Jeff Kaufman | Sections 25, 46.5, 48.7, 48.9, 49.1, 50.4, 50.7. Direction and the reference behaviour supplied by Jeff Kaufman 2026-09-03 (structural reference only; no branding, copy, dimensions, or visual identity borrowed). Supersedes the 50.4 bullet approved earlier the same day. |
| 2026-09-03 | **The long-form explainer page is approved as a page type, and Section 50 is added to define it.** The homepage secondary action *Or click here to learn more*, which shipped with no destination, is wired to a new route `/learn-more`. The page carries the buyer from recognition to a reasonable first step across twelve numbered sections on the homepage's own three-act surface rhythm. Section 50 defines the page type, its numbered section headers, its in-page guide, its paired-condition comparison, its backward dependency sequence, and the conditions under which more than one primary action may appear on a single page. **Section 48.1's one-primary-action rule is amended, scoped to this page type only** (Section 50.5): a long-form page is a sequence of surfaces, not one surface, so a primary action MAY repeat, subject to the limits recorded there. Section 20.1's retired vocabulary and claim-strength rules are extended to this page (Section 50.2). Em dashes are prohibited in this page type's customer-facing copy (Section 50.7). | Marketing website | Jeff Kaufman | Sections 7.7, 20.1, 46.3, 46.5, 48.1, 48.6, 48.7, 48.9, 48.10, 49.1. Page architecture and copy direction supplied by Jeff Kaufman 2026-09-03. Structural reference (architecture only, no branding, copy, or visual identity borrowed): a third-party long-form offer page supplied with the direction. |
| 2026-09-03 | **The hero copy is revised again, superseding the same-day full recopy (copy only; no structural or token change).** H1 becomes *We refuse to accept that preventable chaos is just part of construction.*, retiring *We refuse to accept that someone else’s chaos should cost you profit.* The question becomes *As your company has grown, has it become harder to establish the early accountability needed to protect your profit?*, and the closing paragraph's middle sentence becomes *You can build accountability early, set expectations, and stop preventable problems from consuming your profit.* **The amber body line *Expensive problems destroy profit.* is REMOVED**, returning the hero to three amber elements — eyebrow, underline, CTA — and restoring the §48.7 count recorded 2026-08-27; the same-day amendment that raised it to four is withdrawn. Present tense, the centered composition, the 52ch measure, both bolded phrases, the primary CTA and the new secondary action are unchanged. | Marketing website | Jeff Kaufman | Sections 20.1, 7.7, 48.6, 48.7, 49.1. Direction and all copy supplied by Jeff Kaufman 2026-09-03 as a complete hero specification; the amber line's absence from that specification is read as its removal. **§20.1 tension resolved in the document's favour:** *preventable chaos* returns the refusal to a condition of the industry rather than a consequence to the reader, so the 2026-08-27 guardrail — the reader is never a victim of chaos, and the H1 is the founder's position rather than a claim about the reader's project — holds again without the narrowing recorded earlier today. Present tense is retained. With *profit* now named in both the question and the closing paragraph, a third statement of it in amber was restating rather than landing. |
| 2026-09-03 | **A quiet secondary action is added beneath the hero's primary CTA, and the site's text-link action treatment is specified (§48.1, §2276 button variants).** Copy: *Or click here to learn more*, stacked directly under *Start with one project* on the same centre axis. **The approved treatment:** a lucide `ChevronRight` at 15px, then the label with `underline decoration-1 underline-offset-4`; `--jp-text-secondary` at rest, **no fill, no border, and no amber at rest**, so the surface's amber budget is unchanged and the primary keeps it. The single hover gesture is the colour change to `--jp-brand-amber-active` (§8.1.1) — no underline change, no movement, no icon motion, per §48.1's one-gesture rule. Focus takes the standard `--jp-text-primary` outline at offset 2. It joins the primary's existing entrance beat rather than taking its own (§46.3): the CTA wrapper becomes `flex-col items-center` and the two actions rise as one idea. Spacing `mt-5 sm:mt-6`; hit area `px-3 py-3` (≈46px tall). **Destination deliberately unassigned** — shipped as a `type="button"` with no handler, route or href pending a separate decision. Nothing else in the hero changed. | Marketing website | Jeff Kaufman | Sections 48.1, 8.1.1, 46.3, 34, 36, 49.1. Direction supplied by Jeff Kaufman 2026-09-03; a reference image was cited for hierarchy only, explicitly not for colour or styling. §48.1 already permits a quiet text secondary action but had never specified one, so the underline weight, offset, indicator and hover were recorded here rather than settled inside the component (§49). A second amber control was never an option — §48.1 prohibits one — and amber at rest would have made the alternative compete with the recommended action. **Open TODO, not resolved by this entry:** Sections 34 and 36 still define no minimum touch target, so the hit area follows the existing quiet-control precedent in `BackwardPlannedTimeline` rather than a stated standard; the minimum still needs to be decided. |
| 2026-09-03 | **The hero is recopied end to end, superseding the 2026-08-27 refusal-hero copy and both same-day hero entries (copy only; no structural or token change).** The approved surface: eyebrow *Built by contractors* (unchanged) — H1 *We refuse to accept that someone else’s chaos should cost you profit.*, retiring *We refused to accept that chaos is just part of construction.* — question *As your company has grown, has it become harder to establish the early accountability that keeps project problems from becoming expensive?* — amber line *Expensive problems destroy profit.*, which gains a full stop and **`font-semibold`** — and the closing paragraph *__We’ve stood in your boots.__ You can establish early accountability, set expectations, and stop preventable problems from consuming your profit. __JiTpro gives you the structure to do it.__* Centering, the 52ch measure, registers, spacing, the underline, the lighting stack, the entrance stagger, the CTA and the §48.7 four-element amber count are all unchanged. **§20.1 is amended in two respects, deliberately:** the H1 moves from past tense (the founder's record) to **present tense** as a standing position, and the refusal now names a consequence **to the reader** (*cost you profit*) rather than a condition of the industry. **The 2026-08-27 guardrail is narrowed accordingly:** the reader is still never the source of the chaos — the H1 attributes it to *someone else* and the reader is the party who should not pay for it — but the prohibition on the hero making a claim about the reader's project no longer holds in absolute form, and *early accountability* replaces *control* as the hero's word for what the reader can establish. | Marketing website | Jeff Kaufman | Sections 20.1, 7.7, 48.6, 48.7, 49.1. Direction and all copy supplied by Jeff Kaufman 2026-09-03. Past tense made the refusal a piece of company history the reader had no stake in; present tense makes it a position the reader is being invited to share, and naming profit in the H1 puts the stake in the first line rather than three paragraphs down. *Early accountability* is the same idea the Method section already teaches (§46.8), so the hero and the method now use one vocabulary instead of two. **Guardrail that survives unchanged:** §20.1's audience rule — a successful contractor outgrowing their systems, never a dysfunctional one — and the question is framed as growth (*As your company has grown*) precisely to hold it. |
| 2026-09-03 | **No em dashes in customer-facing website copy (§7.7).** Rendered copy MUST use periods, commas, colons, semicolons, or sentence restructuring instead, chosen per sentence rather than by a single substitution. **Scope is rendered customer-facing copy only** — the rule does NOT reach source-code comments, JSDoc, JSX comments, internal design rationale, or technical documentation, and no CI check or lint rule is created at this time. **Applied to the homepage the same day, seven instances:** the dependency chain's terminal note and the Outcomes "Margin is protected" body split into two sentences; the final-CTA supporting copy closes on a new sentence (*…the project depends on. There is still time to act.*); the Method stage-output paragraph splits at the clause boundary; the Problem section's options list takes a serial comma before *or*; the figure caption takes a colon (*Structural steel erection on an active jobsite: the field everything upstream is planned backward from.*); and the Method thesis is tightened to *JiTpro builds accountability while there is still time to protect the field.*, retiring *JiTpro builds accountability early—while there is still time to protect the field.* No other homepage copy changed; pages outside the homepage are not yet swept. | Marketing website | Jeff Kaufman | Sections 7.7, 20.1, 49.1. Direction supplied by Jeff Kaufman 2026-09-03 following a homepage em-dash audit (7 visible instances; 88 further instances inside code comments deliberately left in place). The em dash had become the site's default connective, carrying emphasis the sentence structure should carry itself — recorded as a rule rather than as seven edits so it governs copy written later. **On the thesis:** *early* and *while there is still time* stated the same thing twice, so removing the dash removed the redundancy with it; the sentence still says WHEN the method acts, which is the §46.8 constraint that statement exists to satisfy. |
| 2026-09-03 | **The hero's second paragraph is rewritten, amending the same-day centered-hero entry (copy only).** The approved copy: *__We’ve stood in your boots.__ You can regain control, get ahead of project problems, and stop preventable problems from consuming your profit. __JiTpro gives you the structure to do it.__* It retires *__JiTpro is a consultancy-first program for growth-stage general contractors.__ We work alongside your team, on one project, to ensure the field has what it needs—Just-in-Time.* The paragraph now carries TWO bolded phrases in primary ink rather than a single leading one; register, measure, centering, spacing and the §48.7 amber count are unchanged, as is every other element on the surface. **Consequences recorded, not resolved:** the hero no longer states the consultancy-first program name or the one-project engagement scope — both remain load-bearing under §20.1 and must be carried by the Why JiTpro section, and *Just-in-Time* no longer appears above the fold. | Marketing website | Jeff Kaufman | Sections 20.1, 7.7, 48.6, 49.1. Direction and all copy supplied by Jeff Kaufman 2026-09-03. Following the question, a definitional sentence answered a question the reader had not asked; standing, then agency, then role is the order the question sets up. **The §20.1 guardrail holds:** "We’ve stood in your boots" is the founder's record, and "You can regain control" is addressed to a contractor who had control and outgrew the systems that carried it — not to a dysfunctional one. "Structure to do it" keeps JiTpro alongside the team rather than above it, satisfying the engagement-model rule the retired sentence carried explicitly. |
| 2026-09-03 | **The hero's body copy is recast as a question and set CENTERED on the hero axis, superseding the LEFT-set decision in the 2026-08-27 refusal-hero entry (§7.7, §48.6).** The approved copy replaces the chain paragraph with *As your company has grown, have you lost some of the control that once kept project problems from becoming expensive?* followed, tight beneath it, by *Expensive problems destroy profit* in `--jp-brand-amber`. Both hero paragraphs now take `text-center` and the measure narrows from 58ch to **52ch**, bringing them inside the bound of the 2026-08-08 centered-supporting-copy exception, whose allowance is **extended from the final-CTA composition to the hero's already-centered composition** — the same reasoning applies (short supporting copy following the composition it belongs to), and no general centered-body-copy allowance is created anywhere else. The amber line raises the hero's amber count from three elements to four (eyebrow, underline, this line, CTA), amending the §48.7 three-element bound recorded 2026-08-27 for this surface. Eyebrow, H1, underline, the JiTpro sentence, the CTA, the lighting stack and the entrance stagger are unchanged, as is every surface outside the hero. | Marketing website | Jeff Kaufman | Sections 7.7, 48.6, 48.7, 20.1, 49.1. Direction and all copy supplied by Jeff Kaufman 2026-09-03. The chain paragraph told the reader their own condition; the question asks it instead, which is what the refusal H1 above it had already earned the right to do. The LEFT-set rule was recorded because the chain paragraph was too long to center — at one question plus one line, that reason no longer holds, and holding the copy left inside a centered composition now reads as a stray column rather than as discipline. **Known tension, recorded rather than resolved:** the JiTpro sentence runs past the exception's four-rendered-line cap at some breakpoints; the cap is not amended, and if the sentence reads as centered prose in review the withdrawal precedent applies to the second paragraph alone. |
| 2026-08-27 | **The stage selector gains an inline copy placement, a row affordance, and an active wash (§46.8, three amendments).** The Method section's copy area moves from beneath the whole rail to directly beneath the active row, as the SAME single content area — one copy area in the document, moved, never five collapsible bodies — still reserving the tallest stage's height so the rail's height is identical for every selection. Each row gains one trailing chevron (`lucide-react`, sized to its type, `aria-hidden`) and the active row a neutral ink wash at or below the inactive hover weight. Stacked, the visual column now follows the active stage's copy instead of the whole rail, and **is mounted once** rather than rendered twice and toggled by breakpoint. **No amber anywhere in this selector**: on `--jp-surface-light` the amber tokens measure 1.96:1, below the 3:1 minimum for interface components, so the active state stays on the light ink ramp and is carried by four axes — filled node, connector tick, ink weight, and now the wash — none of which depend on hue. All methodology copy, titles, numbering, ordering, the spine's constant weight, and the no-autoplay rules are unchanged. | Marketing website | Jeff Kaufman | §§46.8, 46.8.1, 46.3, 48.4, 8.8, 35.1, 49.1. Direction supplied by Jeff Kaufman 2026-08-27: the rows did not read as operable, and copy rendered below all five rows could land outside the viewport at the moment it changed — the visitor clicks and apparently nothing happens. Adjacency is the fix, and moving one content area rather than giving each row its own is what preserves the reserved-height rule that keeps the visual column from moving. The single-mount rule for the stacked visual is recorded now, while the column is still a placeholder, because the cost of getting it wrong only appears once it holds embedded media. Amber was proposed for the selected state and is refused on contrast grounds, not taste. |
| 2026-08-27 | **The hero's JiTpro sentence is revised, amending the refusal-hero entry of the same day (copy only).** The second sentence becomes *We work alongside your team, on one project, to ensure the field has what it needs—Just-in-Time.*, retiring *…to get that work under control before it reaches the field.* The first sentence, the eyebrow, the H1, the chain paragraph, the CTA, and every visual decision in the refusal hero are unchanged. **Consequently the same-day "control is scoped, not retired" amendment to §20.1 is withdrawn** — it existed only to admit the sentence now removed, and no homepage copy relies on it. The 2026-08-27 accountability retirement of "control" therefore stands unqualified. | Marketing website | Jeff Kaufman | §20.1. Direction and copy supplied by Jeff Kaufman 2026-08-27. The revision names the operating requirement in the reader's terms — what the field needs, when it needs it — and lands the brand's own phrase where it explains itself rather than in a headline. **Flagged for review, not blocking:** *to ensure the field has what it needs* sits nearer §20.1's prohibited-formulations line than any current homepage string. It reads as the purpose of the engagement rather than as a warranty of delivery, which is why it is approved as written, but "ensure" is one edit away from the guaranteed-outcome framing §20.1 forbids and must not be strengthened. |
| 2026-08-27 | **The hero is rebuilt around a declarative belief, superseding the accountability hero and every same-day refinement of it (§20.1 messaging, §48.6, §48.7, §7.7, §27.1).** The approved copy: eyebrow *Built by contractors* — H1 *We refused to accept that chaos is just part of construction.* — then *As construction companies grow, keeping every decision, approval, product, material, and service ahead of the field gets harder. When that work falls behind, the project turns reactive—productivity suffers, schedules slip, recovery gets expensive, and profit disappears.* and *__JiTpro is a consultancy-first program for growth-stage general contractors.__ We work alongside your team, on one project, to get that work under control before it reaches the field.* CTA *Start with one project* unchanged in label, treatment and destination. **Structurally the hero stops explaining the mechanism:** the paired §27.1 panels and the three mechanism lines are removed, as are the accountability H1 and the flanked thesis. **The eyebrow is reinstated**, superseding the 2026-08-26 removal — the H1 is first person, and an unattributed first person reads as brand voice rather than as the founder's record. The centered H1 allowance, the hand-drawn underline, the entrance stagger, the lighting stack and the CTA carry over unchanged; the two body paragraphs are LEFT-set in a 58ch column inside the centered axis, since centered body copy stays prohibited and the §7.7 CTA exception's four-line cap does not reach this much copy. Amber on the surface drops from five elements to three (eyebrow, underline, CTA). Bottom padding grows from `pb-12/14/16` to `pb-16/20/24` because the panels' hard bottom edges no longer close the composition. **Preserved, not moved:** `src/components/home/HomeHero.before-refusal-hero.tsx` (compiling snapshot) and `src/archive/homepage/HeroAccountabilityComposition.md` (copy, load-bearing constraints, reasoning). Placement of that message in the buyer journey is explicitly DEFERRED and is not to be decided in code. Nothing outside the hero changed. | Marketing website | Jeff Kaufman | Sections 20.1, 48.6, 48.7, 7.7, 27.1, 46.3, 49.1. Direction and all copy supplied by Jeff Kaufman 2026-08-27. The hero was explaining the mechanism before the reader had a reason to care about it; leading with the belief puts the founder's position first and leaves the teaching to the Method section. **Guardrail, binding on any future edit:** the reader is never a victim of chaos. The claim is that the industry tolerates a reactive cost it need not, and that we refused to — §20.1's audience rule (successful contractor outgrowing their systems, never dysfunctional) governs, and "We refused" is the founder's record, never a promise about the reader's project. The word "control" returns in the second paragraph in its narrow sense — control of the upstream work, not of the reader's project — and §20.1 is amended to scope the 2026-08-27 retirement accordingly rather than leave the copy quietly non-conforming. |
| 2026-08-27 | **The flanked statement is sized to its content rather than to a fixed measure (Section 7.7).** The hero thesis group's `max-w-[42rem] sm:48rem lg:54rem` chain is replaced by `w-fit max-w-full`: the row resolves to the one-line width of rules, gaps and sentence, and clamps to the viewport where that does not fit. Type size, weight, ink, rule styling, gaps, spacing, centring, and copy are all unchanged, as is everything else in the hero. | Marketing website | Jeff Kaufman | Section 7.7. Direction supplied by Jeff Kaufman 2026-08-27: at 22px the sentence was wrapping after "from", breaking the clause mid-phrase. The fixed measure was derived from an estimate of Inter Tight's metrics that ran short of the real ones. Sizing to content removes the estimate from the design entirely — the rule now states the mechanism rather than a number, so the next register change cannot reintroduce the same defect. |
| 2026-08-27 | **The hero thesis is enlarged, its rules brought up to visibility, and it is pulled closer to the swoosh (Section 7.7, flanked form).** Copy unchanged. Register rises to 1.125 / 1.25 / 1.375rem (22px desktop) at unchanged **medium** weight in primary ink; the flanking rules go from `--jp-brand-amber` at 35% to **70%** and from `w-6/10/12` to `w-8/12/14`; the gap above closes from `mt-10 sm:mt-12 lg:mt-14` to `mt-7 sm:mt-8 lg:mt-9`. The group's measure widens to `lg:max-w-[54rem]` — required, not cosmetic: at 22px the sentence no longer holds one line inside 52rem. Consequently **the Section 7.7 proportion band is widened to three-quarters–five-sixths** (~82% here), since the one-line rule and the proportion rule pull against each other and the one-line rule wins. The rules stay below full-strength amber, so they are not the brightest accent on the surface. Headline, headline spacing, swoosh, divider, panels, CTA, and background are untouched. | Marketing website | Jeff Kaufman | Sections 7.7, 48.7, 47.3, 49.1. Direction supplied by Jeff Kaufman 2026-08-27: at 20px the statement lacked presence and the 35% rules did not read at all as framing. A 1px rule needs materially more opacity than a fill to register at the same apparent weight, which is why 35% looked like nothing while the same value reads correctly on a broad element. |
| 2026-08-27 | **The hero composition is refined for proportion and editorial restraint; the thesis loses its frame for the Section 7.7 flanked form, superseding both same-day thesis entries.** No copy changes anywhere. **Thesis:** the rounded border, padding, and fit-width box are removed and replaced by `rule — statement — rule` on one centre line, the rules short, 1px, `--jp-brand-amber` at 35% and `aria-hidden`. Its register drops to 1.0625 / 1.1875 / 1.25rem at **medium** weight in primary ink — subordinate by size and weight rather than by a container. **Swoosh:** thinner (centre body ~3.5 of 14 units, ~3.0 rendered px, from ~4.6/3.9px) and shorter (`w-56 sm:19rem lg:23rem xl:26rem`, from `w-64 sm:25rem lg:30rem xl:34rem`). The level body and the unequal end turns approved earlier the same day are unchanged and remain binding. **Headline:** the gap between the primary line and the amber turn opens from `mt-2` to `mt-3 sm:mt-4`, and the gap to the swoosh from `mt-4 sm:mt-5` to `mt-6 sm:mt-7 lg:mt-8`. **Proportion, now a rule of the treatment:** headline widest, thesis group ~80% of it, swoosh ~42%. Section padding, the hairline, the panels, the CTA, the lighting, and every surface outside the hero are untouched. | Marketing website | Jeff Kaufman | Sections 7.7, 27.1, 48.7, 47.3, 47.4, 49.1, 49.3. Direction supplied by Jeff Kaufman 2026-08-27. The frame was the defect: a bordered box around one sentence reads as a UI component on a marketing surface, and it competed with the panels below it instead of closing the argument above it. Two rules frame the sentence without enclosing it, which is the editorial convention the composition was reaching for. The proportions are recorded because the hierarchy was previously carried by weight alone — nesting the three widths is what makes the composition read as composed rather than stacked, and it lets the thesis step down in size and weight without losing its place. |
| 2026-08-27 | **The hero underline's sweep is turned at the ends over a LEVEL body, refining the same-day calligraphic-taper entry (geometry only).** The construction is unchanged — filled silhouette, one stroke, fine point to fullest body (~4 rendered px) to fine point, token amber via `currentColor`, ~12px tall, static, hero-only, one per surface. What changes is the sweep, and the rule is where the movement is allowed to live: **the body runs level and only the ends turn.** Across the middle ~50% of the length the midline is flat to within half a unit in the 14-unit box; the turns occupy roughly the outer 14% at each end, where the left tip curls DOWN below the body and the right tip flicks UP above it. **Tilting the body so it runs from one tip to the other is prohibited** — a stroke whose whole chord is diagonal reads as a line set on an angle rather than as a drawn gesture, and it is the specific way this treatment fails. Raising the middle instead is the other failure: that produces the prohibited smile/arc/bowl. **The two turns are also deliberately unequal**, the left curl travelling further than the right flick, since equal turns resolve into symmetry. The taper follows the same logic as nib behaviour — fullest along the level body, thinning as the stroke direction rotates into each turn. Width, thickness, color, position, and the relationship to the headline are untouched. | Marketing website | Jeff Kaufman | Section 48.7. Direction supplied by Jeff Kaufman 2026-08-27, in two passes: the taper read as correct but static and needed more movement and asymmetry; the first attempt at that supplied the movement by tilting the entire stroke, which read as "turned diagonally" rather than hand-drawn. Isolating the movement to the ends over a level body is what distinguishes a pen stroke from a rotated shape, and is recorded here as the binding rule rather than as one instance of geometry. |
| 2026-08-27 | **The thesis statement moves inside the hero, and the framed form gains its unfilled in-composition placement (Section 7.7, Section 27.1), amending the same-day entry that introduced it between the sections.** Copy unchanged: *JiTpro keeps preventable failures from becoming expensive field recoveries.* It now sits in the hero's headline block — H1, then the amber underline, then the thesis, then the existing hairline, then the paired panels — and the standalone band between sections is removed (`HomeThesisBand.tsx` deleted). **The frame loses its `--jp-surface` fill and keeps only the 15% hairline and `rounded-2xl`,** because a filled panel directly above two filled panels reads as a third card rather than as the headline's thesis. Width stays fit to the sentence; the register is unchanged (1.25 / 1.5 / 1.75, capped so the sentence holds one line from `lg` up and stays subordinate to the H1). It joins the headline's existing entrance beat rather than taking one of its own (Section 46.3) — headline, underline and thesis are one idea. Still no amber, still one per page. Hero copy, panel copy, CTA, lighting, and every other surface are unchanged. | Marketing website | Jeff Kaufman | Sections 7.7, 27.1, 46.3, 48.7, 47.4, 49.1. Direction supplied by Jeff Kaufman 2026-08-27. Placed after the hero the statement had drifted out of the composition it belonged to and read as a sixth section; the thesis answers the H1 directly and has to sit with it. The fill is what carried the card reading, so the fill is what was removed — the hairline still frames the sentence, and the hero's own ground running through it is what makes the treatment read as integrated rather than applied. The one-per-page bound now covers both placements so this cannot become a repeated band. |
| 2026-08-27 | **A framed thesis band is added between the hero and the Problem section, and the framed form of the centered editorial statement is approved (Section 7.7, Section 48.6, Section 27.1).** The approved copy, standing alone: *JiTpro keeps preventable failures from becoming expensive field recoveries.* It sits on `--jp-background` inside the Section 27.1 marketing panel, **width fit to the sentence** and centered in the shared container — never a full-width band. It takes the existing full-width-statement register entered low and capped at its 1.75rem step (1.25 / 1.5 / 1.75), which holds the sentence on one line from `lg` up inside the container and lets it wrap freely below; the cap is what keeps it visibly subordinate to the hero H1 (2.125–4rem extrabold). **No amber.** The hero directly above already spends the page's accent on the H1 turn, the underline, and the CTA; the panel's surface step and hairline are the emphasis (Section 48.7). No divider, no eyebrow, no supporting line, no new register, no new card style, no new token. The hero, the Problem section, and every other surface are unchanged. New file `src/components/home/HomeThesisBand.tsx`, matching the one-component-per-band homepage architecture. | Marketing website | Jeff Kaufman | Sections 7.7, 48.6, 48.7, 27.1, 47.3, 47.4, 49.1. Direction supplied by Jeff Kaufman 2026-08-27. The hero closes on accountability and the Problem section opens on a question; nothing between them stated what JiTpro is *for*, so the reader carried a claim into the problem argument without a thesis to hang it on. **Noted tension:** a centered organizing statement was removed from the hero earlier the same day for restating the H1 and weakening the hierarchy. This is approved as a different element in a different position — it is JiTpro's thesis rather than a restatement of the hero's condition, it sits *outside* the hero rather than between the H1 and its panels, and the frame marks it as a bridge rather than a second hero line. If it reads as a second hero statement in review, the withdrawal precedent applies and it should be removed rather than restyled. The one-per-page bound and the no-amber rule exist so this does not become a repeatable band pattern. |
| 2026-08-27 | **The Problem section's chain statement is recast as a centered two-part statement, and a narrow centered-figure-statement allowance is approved (Section 7.7, Section 48.6).** The approved copy: *Preventable schedule failures destroy margin.* with the supporting line *The schedule cannot hold if what the field needs arrives late or wrong.* — retiring *None of it looks like a schedule problem while there is still time to fix it.* The pair centers on the dependency chain's own axis directly above it, each measure held at or inside the existing 46ch heading measure. **No new type register is created:** the statement keeps the section's existing 1.3125/1.4375 semibold heading register and the supporting line takes the section's existing secondary body register, so the hierarchy between them is carried by size, weight, and text level alone. No divider, no eyebrow, no accent — the section's amber stays on the warming rail and the ordinals (Section 48.7), and the chain figure, both movements, and every other statement on the page are unchanged. **Consequential to this: "margin" is released from the Section 20.1 word retirement** ("procurement" stays retired), recording a rule the same-day approved hero copy had already superseded. | Marketing website | Jeff Kaufman | Sections 7.7, 48.6, 47.3, 47.4, 20.1, 49.1. Direction and all copy supplied by Jeff Kaufman 2026-08-27. The retired line described the *detection* problem a second time — the movement's h2 and body had already said the condition is invisible — and spent the position above the figure on restatement. The replacement names the stake (margin) and then the mechanism the chain is about to draw (what the field needs, arriving late or wrong), so the figure has an argument to prove. Centering is the point rather than a preference: held on the left edge, the pair read as a third paragraph of the copy column above it; on the figure's axis it reads as the figure's title. The allowance is bounded to full-container figures and one per section precisely because the shared left edge is what makes the departure legible (Section 48.6). Claim strength is unchanged: the supporting line states a failure condition, not the prohibited guarantee pair — "late or wrong" is the chain's own existing terminal language, not a promise that JiTpro prevents either. |
| 2026-08-27 | **The hero underline's geometry is refined to a calligraphic taper, amending the same-day entry that introduced it.** The treatment is now a FILLED SVG silhouette, not a stroked path: a fine point at the left, weight building to its fullest body (~4 rendered px) through the center, released back to a fine point at the right, over one subtle asymmetric sweep — pressure applied and released, not a uniform curved line. Superseded within that entry: the "3-unit stroke, rounded caps" construction. Everything else stands — token amber via `currentColor`, ~12px rendered height, most-of-the-measure width, static, hero-only, one per surface. | Marketing website | Jeff Kaufman | Section 48.7. Direction supplied by Jeff Kaufman 2026-08-27: the uniform stroke read as contrived and mechanically drawn; a calligraphic taper reads as one confident hand gesture, which is the treatment's entire job. |
| 2026-08-27 | **The hero H1 is recomposed as the page's one centered display moment, and a hand-drawn underline is approved as a hero-only treatment.** Copy unchanged. The H1 centers within a ~30ch measure so the wraps read as set lines; the first sentence holds `--jp-text-primary` on its own line and the second sentence takes `--jp-brand-amber` (an approved Section 8.8 hero-emphasis use — the amber IS the accountability turn, not decoration). Beneath it, the underline: ONE thin organic SVG stroke (3 units in a 14-unit viewBox, rounded caps, rendered ~12px tall), token amber via `currentColor` — never a color literal (Section 45) — spanning most but not all of the amber sentence's measure, close under the headline, static (no animation; Section 46.1 governs if that ever changes). It is a signature gesture of this one composition: reuse elsewhere requires its own entry, and a second underline on any surface is prohibited (Section 48.7 restraint). This extends the Section 48.6 centered allowance to the hero H1 composition. Everything else in the hero — panels, copy, CTA, background, structure — is unchanged. | Marketing website | Jeff Kaufman | Sections 48.6, 48.7, 8.8, 45, 47.3. Direction supplied by Jeff Kaufman 2026-08-27 (targeted visual polish: more impact, stronger hierarchy). No existing swoosh/underline treatment was found in the codebase to reuse, so this entry defines the pattern. The left-set H1 read as one long two-sentence paragraph; centering with the amber turn splits the claim into condition and consequence and gives the hero a single dominant focal point above the paired panels. |
| 2026-08-27 | **The hero's centered organizing statement is removed, amending the 2026-08-26 recomposition entry and withdrawing its Section 48.6 centered-hero allowance.** *Construction schedules break before the work reaches the field.* no longer appears; the hierarchy is now H1 → the paired problem/response panels, which sit directly under the H1 hairline in the space the statement occupied. Content-only: the H1, both panels, the mechanism preview, the CTA, the Section 27.1 panel treatment, and all spacing conventions are unchanged, and the entrance stagger simply drops to three elements. The final CTA remains Section 48.6's only approved centered departure on the homepage. | Marketing website | Jeff Kaufman | Sections 48.6, 47.3. Direction supplied by Jeff Kaufman 2026-08-27. The accountability H1 approved the same day carries the hero's causal claim on its own; a second display-adjacent statement between it and the panels restated the argument and weakened the hierarchy rather than organizing it. |
| 2026-08-27 | **The hero messaging shifts from early control to early accountability, superseding the copy quoted in the 2026-08-26 hero-recomposition entry (composition unchanged).** The approved strings: H1 *You don't own every decision. But you're accountable for what those decisions do to your project.* — problem-panel paragraphs *As projects grow, more of the decisions, approvals, products, materials, and services your schedule depends on sit outside your direct control.* and *When one falls behind, the problem eventually reaches the field. Work gets disrupted. The schedule slips. Recovery gets expensive. And your margin pays for it.* — response-panel heading *JiTpro makes accountability clear before the schedule is at risk.* (retiring *JiTpro brings control early.*). The intended hero sequence: the GC does not control every decision → is nevertheless accountable for the project → late decisions and commitments eventually reach the field → field disruption damages the schedule → recovery consumes margin → JiTpro establishes accountability while there is still time to act. The organizing statement, panel heading *The challenge is real.*, Section 20.1 orientation line, mechanism preview, and CTA are unchanged, as is every visual decision in the recomposition entry. "Procurement" remains banned from this hero. The full upstream enumeration remains load-bearing (Section 20.1, long-lead rule). | Marketing website | Jeff Kaufman | Section 20.1. Direction and all copy supplied by Jeff Kaufman 2026-08-27. GCs do not own or make every decision their projects depend on — owners, architects, engineers, consultants, subcontractors, and vendors control many of them — but when one falls behind and reaches the field, the GC is still accountable for the schedule and often pays for disruption and recovery through lost margin. "Control" claimed too much; accountability is the condition the reader actually lives in. |
| 2026-08-26 | **The hero (slot 01) is recomposed as a paired problem/response composition, amending the five-section entry's hero formulation.** Below the unchanged H1, a centered organizing statement — *Construction schedules break before the work reaches the field.* with the closing clause in `--jp-brand-amber` (an approved hero-emphasis use, Section 8.8) — sits above two panels of approximately equal width on desktop: **left, the problem** (heading *The challenge is real.*, a short amber accent rule, and the two approved recognition/consequence paragraphs unchanged) and **right, the response** (heading *JiTpro brings control early.*, the approved Section 20.1 orientation line unchanged, three compact mechanism lines — *See the work others own / Map what depends on what / Deliver what the field needs* — with small amber `lucide-react` check marks, and the existing primary CTA unchanged). The panels use the Section 27.1 marketing panel, stack problem-first below `lg`, and the mechanism items run horizontal only at `xl`. The mechanism lines are a compact preview only: the Method section remains the page's one full mechanism argument, and the hero lines MUST NOT grow into explanation. The centered statement extends the Section 48.6 allowance. Hero section height becomes content-driven: bottom padding drops below top padding because the panels' hard bottom edges close the composition; the empty dark field below the old loose columns is the defect being corrected. Superseded formulation: the hero as the page's fastest section carrying only H1, one recognition statement, one orientation statement, one CTA. All Section 20.1 messaging, claim-strength, engagement-model, and long-lead rules are unchanged. | Marketing website | Jeff Kaufman | Sections 27.1, 48.6, 48.7, 8.8, 20.1. Direction and all new copy supplied by Jeff Kaufman 2026-08-26. The loose two-column band read as lopsided — a large copy block against a short definition — and left hundreds of pixels of empty dark surface before section 02. Paired panels give the two halves equal visual weight and a shared bottom edge, and the organizing statement names the causal claim the two halves split between them. |
| 2026-08-26 | **The default card is defined (new Section 27.1): the dark-surface marketing panel.** `--jp-surface` on `--jp-background`, a 1px `--jp-border` border at 15% opacity, `rounded-2xl`, and internal padding from 24px (mobile) to 40px (wide desktop). Non-interactive; no hover state exists. One card style per surface (Section 48.2) stands — this is that style for dark marketing surfaces. First approved use: the hero problem/response panels (retired from the hero 2026-08-27 — preserved at `src/archive/homepage/HeroAccountabilityComposition.md`; the standard stands and is unchanged). | Marketing website | Jeff Kaufman | Sections 27, 12, 48.2, 8.5. Direction supplied by Jeff Kaufman 2026-08-26 (subtle token border, restrained rounding, generous controlled padding). The 15% border sits between the 12% hairline and the 30% control border so containers stay quieter than controls; `rounded-2xl` keeps cards one step more generous than the `rounded-xl` button per Section 12. |
| 2026-08-26 | **The homepage backward line is revised (Section 20.1), superseding the plural formulation of the same-day operating-requirement entry.** The approved line is now: *everything upstream is planned and managed backward from the point it is required onsite.* "Backward from those requirements" is retired, and the prohibition on the singular form is narrowed: a point-in-time anchor is approved for the planning-direction line, which states where backward planning starts; it remains prohibited as a restatement of the requirement itself. The requirement is unchanged — coordination AND timing, both load-bearing — and every claim-strength rule stands. Non-conforming and corrected in the same pass: `src/components/home/MethodSection.tsx`. | Marketing website | Jeff Kaufman | Section 20.1. Direction supplied by Jeff Kaufman 2026-08-26. "Those requirements" pointed the reader back at an abstraction; the revised line anchors the direction to the concrete quantity the method's own Backward Scheduling stage starts from — when each product, material, or service is required on site — in the reader's construction language. The coordination half is not lost: it is carried by the requirement statement the line sits directly beneath, which continues to state coordination and timing whole. |
| 2026-08-26 | **The homepage is compressed from the eight-slot buyer-journey architecture to five sections, superseding the eight-slot map and its beat plan.** The slots: **01 Hero** (recognition and orientation) · **02 Problem** (detection and the response window as two movements of one argument) · **03 Method** (the operating requirement, the five-stage Section 46.8 rail with the Section 46.8.1 figure, closing on the Section 17.1 terminal field band) · **04 Why JiTpro** (trust, the engagement model, and what changes) · **05 Timing and CTA**. The three-act logic is unchanged, carried by four surfaces: `--jp-background` for the hero and problem chapter, `--jp-surface-light` for the whole answer chapter, `--jp-surface` for Why JiTpro, `--jp-background` for the close. First-approved-use designations carry forward into the new slots: the light surface → the Method section; the terminal field band → closing the Method section; founder presence (Section 17.2) → the Why JiTpro section's trust movement; the Section 46.8/46.8.1 rail and figure → the Method section. Superseded as a *section* rule: detection and consequence as separate sections — the surviving form is intra-section: **two movements, one causal story told once**. Combined sections resolve Section 7.7's one-primary-statement rule by demoting movement headings to existing sub-registers (no new register is created), and the combined Problem section carries amber only in its warming rail and its ordinals — the detection reframe close is recast in ink. All 2026-08-25/26 messaging, claim-strength, long-lead, and light-surface rules are unchanged. | Marketing website | Jeff Kaufman | Sections 48.6, 7.7, 48.7, 46.8, 17.1, 17.2, 20.1; `docs/design/homepage-five-section-compression-plan.md` (approved by Jeff 2026-08-26). Measured at 1440×900 and 390px: the preserved pre-rebuild homepage is 10,775px / 9,855px, and the eight-slot build at beat three was already 8,320px / **11,043px — longer on mobile than the page it replaced**, before its trust section existed. The buyer journey (recognition → understanding → interest → respect → trust → timing) remains the organizing doctrine; the psychological stages share sections rather than each owning one. The compression principle is content-and-layout simplicity only — one idea, a short explanation, visual evidence, move on — and adopts no external visual language: tokens, typography, and the approved dark/light system are untouched. The eight-slot beat-three state is preserved at tag `homepage-eight-section-beat3-2026-08-26`. |
| 2026-08-26 | **The engagement model is codified (new Section 20.1 subsection).** JiTpro works with the **general contractor's internal construction management team**. JiTpro does NOT directly manage or coordinate owners, architects, engineers, consultants, subcontractors, vendors, or trade partners — the GC's internal team remains responsible for those project relationships and remains the point of coordination with the broader project team. JiTpro supports that team by organizing and clarifying what needs to happen, what information, decisions, and commitments are required, and when the team needs them. Homepage copy MUST NOT imply that JiTpro becomes another external project-team participant. First approved use: the homepage hero's engagement line and the Method and Why JiTpro sections. | Marketing website | Jeff Kaufman | Section 20.1. Direction supplied by Jeff Kaufman 2026-08-26. The homepage names who JiTpro works with in several places, and before this entry the boundary existed only as copy. A reader who concludes JiTpro inserts itself between the contractor and its project relationships has been told something untrue about the service — the method strengthens the existing management team rather than adding a coordination layer above it — and every future section would re-litigate that boundary without a rule to cite. |
| 2026-08-26 | **The homepage operating requirement is refined (Section 20.1), superseding part (b) of the 2026-08-25 entry.** The requirement's two load-bearing parts are now **coordination** — the right product is coordinated with what is actually being built in the field — and **timing** — it is onsite when the field needs it. Stated whole: *the right product has to be coordinated with what's being built in the field and be onsite when the field needs it.* The supporting line becomes plural: *everything upstream is planned and managed backward from those requirements*. Retired: "the correct product or specification has been defined and approved for installation … available at the moment the field is ready for it", and the singular "backward from that point". **The claim-strength rules of the 2026-08-25 entry are NOT loosened** — delivery guarantees, quality or conformance warranties, claims over supplier or fabricator execution, claims to replace PM or design-team responsibility, and "not late, not wrong" pairs remain prohibited; this refines what the requirement IS, not how strongly it may be asserted. Non-conforming and corrected in the same pass: `src/components/home/JiTproTurnSection.tsx` — its display statement, both halves of the What/When band, and its backward line. | Marketing website | Jeff Kaufman | Section 20.1. "Approved for installation" described one upstream event and mistook it for the requirement. What the field actually needs is that the product is **coordinated with what is being built** — a condition the upstream work must resolve long before the physical product exists, and long before any approval closes. The homepage's own tracked example makes the point: custom steel windows may arrive months after their openings are framed, so the coordination that makes them the *right* windows happens well ahead of the delivery, and an approval-shaped requirement cannot describe it. The supporting line moves to the plural for the same reason — "from that point" is a moment in time, which names the timing half and silently drops the coordination half. |
| 2026-08-26 | **Section 46.8 amended for the light surface and for a vertical rail, and Section 48.9 amended for ordinals on light.** (a) On an approved light surface a stage selector expresses the established selector treatment **in ink rather than amber**: active stage at the strongest ink, inactive at `--jp-ink-secondary`, hover and focus brightening toward the strongest ink with a subtle neutral wash — and the active stage MUST stay unmistakable **without depending on hue**, carried by at least two of geometry, ink weight, ink contrast, and position. (b) A **vertical** rail driving the Section 46.8.1 divided content stage MAY use a row-and-node geometry on a continuous spine instead of the pill; the pill remains the treatment for horizontal rails and short-copy-swap selectors, one geometry per surface, and **a spine that fills up to the active stage is prohibited** — a methodology is not a wizard. (c) Section 48.9 ordinals on an approved light surface take `--jp-ink-secondary` at or above the Section 8.8 opacity floor. On dark surfaces all three rules are unchanged; no new amber and no third light-surface ink level is created. First approved use: the homepage methodology section. | Marketing website | Jeff Kaufman | Sections 46.8, 46.8.1, 48.3, 48.9, 8.8, 8.1.1, 49.1. The homepage answer chapter is approved on `--jp-surface-light`, and the 2026-08-25 measurement puts `--jp-brand-amber` at **1.96:1** and `--jp-brand-amber-active` at **1.14:1** against it — below the 3:1 minimum for user-interface components. Section 46.8's active-state and Section 48.9's ordinal rules were both written on the assumption of a dark ground, so a light-surface selector had no conforming expression at all: the alternatives were an unreadable control, a third amber (forbidden by Section 8.1.1), or a convention invented inside the component (forbidden by Section 49.1). The resolution is the one Section 48.3 already took on the same date and for the same reason — the same convention restated in the surface's own hierarchy — so the amendment is a translation, not a new pattern. The hue-independence requirement exists because ink has one axis where amber had two: an amber enclosure on dark separates by hue *and* weight, and two ink levels alone would leave the active state resting on a contrast difference. The geometry allowance exists because the five-stage methodology rail runs vertically beside a persistent visual, where five stacked pills read as a filter chip group rather than an ordered method; the constant-weight spine requirement exists because a filling track asserts completion the selector does not mean. |
| 2026-08-26 | **Long-lead terminology bounded on the homepage (Section 20.1).** JiTpro is not a long-lead-item service and homepage copy MUST NOT imply that it is. "Long-lead" MAY describe a specific item or construction example whose lead time is genuinely relevant; it MUST NOT be used as shorthand for the overall problem JiTpro manages, as the defining category of its work, as a repeated proxy for project risk, in language implying JiTpro primarily manages long-lead packages, or in language suggesting that shorter-lead or apparently minor items receive less systematic attention. **No other narrow category may be substituted** — the message is that JiTpro systematically manages the upstream requirements for everything the field will depend on, some needing twelve months and some weeks. Review test: *would this sentence cause a general contractor to conclude that JiTpro is primarily a long-lead-item management service?* Naming specific packages in a worked example remains the intended use and reinforces the rule. Non-conforming and corrected in the same pass: the homepage hero's recognition sentence, which used "long-lead work" as shorthand for the whole problem space. | Marketing website | Jeff Kaufman | Section 20.1, and the homepage's own opening question. Obviously long-lead packages announce themselves, and contractors already treat them as important — so framing the work around them describes the part of the problem the buyer has already solved. A project also contains thousands of products, materials, services, decisions, approvals and commitments that look ordinary until scope stays unresolved, a selection is not made, information is missing, responsibility is unclear, an approval does not happen, a commitment is missed, or nobody considered the item important yet; any one of them can stop field work as effectively as a steel package. **Importance is not determined by lead time, dollar value, size, or how obviously critical something appears today.** That is the same claim the homepage already makes when it asks what the team cannot see today — and a long-lead framing answers that question with the obvious item, which defeats it. |
| 2026-08-25 | **Light surface approved as a contained extension of the neutral set (Section 8.8).** `--jp-surface-light` `#F1F5F9` is the approved light ground for sections whose narrative job is explanation, document logic, evidence, or detailed reading; the page canvas remains `--jp-background`. **Exactly one new value is introduced** — `--jp-ink-secondary` `#475569` — and the remainder of the light ramp is reuse: primary ink is `var(--jp-background)` (18.41:1), body and structure are `--jp-ink-secondary` (6.92:1), and the muted level is `--jp-ink-secondary` at a **normative 85% opacity floor** (4.79:1). A third light-surface gray was evaluated and REJECTED. Separately, **amber on light surfaces is bounded**: the existing amber tokens MUST NOT carry text, informational linework, controls, or other contrast-dependent elements on light surfaces where they fail the applicable contrast requirement; light-surface hierarchy defaults to approved ink values; decorative use remains governed by accessibility and the existing color-scarcity rules. **Section 48.3 is narrowly amended** so timeline and schedule structure on an approved light surface uses ink hierarchy rather than Brand Amber, with the terminus expressed by ink weight; on dark surfaces Section 48.3 is unchanged. First approved use: the homepage answer-and-methodology chapter. | All products | Jeff Kaufman | Sections 8.8, 8.1.1, 8.7, 45.2, 45.4, 48.3. The homepage is approved as three narrative acts — a dark problem chapter, a light answer-and-methodology chapter, a dark trust-and-action chapter — which requires a light ground the system did not have. Measured: `--jp-brand-amber` is **1.96:1** and `--jp-brand-amber-active` **1.14:1** against `#F1F5F9`, below both the 4.5:1 text minimum and the 3:1 minimum for meaningful graphics, and amber only reaches 4.5:1 against grounds darker than roughly `#3A3F47` — so no genuine light surface supports it and the alternative was a third amber, which Section 8.1.1 forbids. The rule is therefore written as a **contrast bound, not a doctrine**: it says where these two values may be relied upon to carry information and creates no rule about amber's role elsewhere. The muted level is expressed by opacity rather than by a new token per Section 45.4 and the 2026-08-06 slate resolution; `#475569` itself is a genuinely new level between `--jp-surface` and `--jp-text-muted`, not a near-duplicate. The surface/ink pair is a role inversion of two existing values, so the palette gains a surface without gaining a hue. |
| 2026-08-25 | **Homepage messaging standards approved (new Section 20.1)**, in three parts. (a) The 2026-08-04 retired-language record is formalized and scoped: the retired words "procurement" and "margin" may not appear in homepage copy, **but the mechanism they name must be taught** in operational construction language — retiring a word is not permission to describe the work vaguely. Brand Voice's teach-then-name sequence is homepage-exempt and unchanged elsewhere. (b) The homepage's account of purpose is expressed as an **operating requirement and the controls built around it**, never a guaranteed outcome: the correct product, approved for installation, available when the field is ready, with everything upstream planned and managed backward from that point. Delivery guarantees, quality/conformance warranties, claims to replace PM or design-team conformance responsibility, claims to control supplier execution, and absolute pairs of the "not late, not wrong" form are prohibited. (c) The homepage audience is stated **qualitatively only** — no revenue band, employee count, or project-value band — with recognition carried by symptoms rather than a management diagnosis, and the target contractor never portrayed as dysfunctional. Supersedes Section 20's founder-section and proof-section TODOs by reference to Sections 17.2 and 48.10. | Marketing website | Jeff Kaufman | Sections 20.1, 1, 2, 47.1, Brand Voice. (a) The ban existed with no owner, date, or entry, and was in unresolved tension with Brand Voice; scoping it to the word resolves both. (b) "Not late. Not wrong." reads as an outcome guarantee, and `src/content/faqData.ts:130-133` — live, one nav click from the homepage — answers "Does JiTpro guarantee that everything will arrive when desired?" with a flat **"No."** A homepage claim the company's own FAQ contradicts is worse than a weaker claim. Section 1 already holds the line: JiTpro creates visibility, not optimism. (c) No approved ICP number exists in this system; five live surfaces carry five different figures, so any band published now would contradict a sibling page. |
| 2026-08-25 | **Figure provenance approved as a new Section 48.10.** Every element of a figure carrying numbers, names, or dates is exactly one of three statuses — **Representative** (constructed to reflect realistic conditions; not from any actual engagement), **Illustrative** (added to demonstrate the method, no basis in the dataset), or **Methodological** (pure diagram, no data) — and the distinction must survive into the rendered page. Prohibited without exception: presenting representative or illustrative content as a customer result or actual project record; describing a synthetic dataset as real or as anonymized real; fabricating a count of anything the dataset does not contain; and rendering a derived value in a register implying precision the source does not carry. Required: one quiet provenance sentence in the caption register (never a disclaimer block or multi-key legend); weaker-provenance elements drawn *lighter* than data-derived ones; derived quantities expressed in the unit the source actually carries; and **at most one kind of absolute date per figure**, every other temporal value typeset as a duration or offset. First approved use: the homepage methodology figure. | All products | Jeff Kaufman | Sections 48.10, 48.8, 47.4. A figure is read as a claim about the world, and a figure whose status is unstated is read as the strongest status it could plausibly have. `src/content/procurementScheduleSnapshot.json` is **synthetic** — constructed to represent realistic sequencing and durations, not a client schedule — and confirmed to contain no scope gaps, no owners, and no responsible parties (verified: step keys are exactly `days`, `name`, `color`, `milestone`; all 42 rows `status: "draft"`). The register rule exists because the instinct is to emphasize whatever is currently being narrated, which is exactly backwards when the narrated element is the one with the weaker provenance. The one-absolute-date rule exists because a required onsite date and a backward-planned offset are different kinds of quantity, and blurring them misstates the method. |
| 2026-08-25 | **Founder presence approved as a new Section 17.2, explicitly REVERSING the 2026-08-04 homepage decision** that removed the founder section (recorded in `src/archive/homepage/README.md`). Founder presence is a credibility instrument answering one question — did the people who built this method actually do this work — and is finished once that question is answered. Required: the section is about the work and the experience, its heading names the work not the man, credibility comes from specific recognizable construction experience rather than credentials, and exactly one quiet path leads to the deeper story. Prohibited: an oversized founder card, a hero-scale portrait, a résumé or credential list, any career-volume figure, a display-scale first-person pull quote, and any treatment making the founder rather than the reader's project the subject of the page. Portraiture is restrained, late in the section, frameless and token-only. First approved use: the homepage trust section. | Marketing website | Jeff Kaufman | Sections 17.2, 17.1, 48.1, 47.1. The 2026-08-04 removal was right about what it removed — a founder-centric section competing with the contractor's own story — and wrong as a general rule, because it left the site with no owner for the trust question at all. The buyer-journey audit found Trust served by a single objection-handler in the last section of nine, while the strongest credibility writing on the public site sits unlinked on `/about`. The reversal is deliberately narrow: the constraints above are the decision, not the permission. |
| 2026-08-25 | **Section 48.8's crane prohibition NARROWED, and a terminal field band approved in Section 17.1.** What is prohibited is the cliché — a crane or any construction machine used as generic shorthand for "construction". A crane MAY appear in approved documentary photography when it is performing the specific work the section argues about and the section would be weaker without it; each such use is approved individually. Separately, a photograph MAY close a section as a **full-container terminal band** rather than an environmental composition beside the copy, provided the section has already made its argument in words and the band carries one short line naming what the reader is looking at. The band is a terminal beat, never a transition, and MUST NOT be a standalone section. First approved use: the structural-steel field condition closing the homepage methodology section. | Marketing website | Jeff Kaufman | Sections 48.8, 17.1, 47.4. The prohibition as written banned the machine rather than the cliché, which would exclude authentic documentary photography of the exact field condition a section is arguing about — and the homepage shipped such a photograph in commit `5ff4505` with no entry covering it, so the rule needed resolving either way. The band rule exists because the same photograph placed *between* two arguments is a palate cleanser and placed *at the end of one* is evidence; the wordless-section form was the defect, not the full-bleed presentation. |
| 2026-08-25 | **Section 46.9 retains APPROVED status with no current production use.** The homepage five-stage methodology — its only approved use — moves to the Section 46.8 stage selector with a Section 46.8.1 accumulating visual. Section 46.9 is **neither superseded nor retired**; the 2026-08-20 "first approved use" designation is released, and a future use requires a fresh entry naming it. Non-conforming as a result: `src/components/home/ReactiveProjectsSection.tsx` in its entirety — the 400vh region, the `useScroll` subscription and the pinned architecture are removed rather than migrated. | Marketing website | Jeff Kaufman | Sections 46.9, 46.8, 46.8.1, 49.1. The 2026-08-20 entry judged the methodology to be a narrative the visitor moves through, and was right about the accordion it rejected. It is reversed here on different grounds: that section's buyer-journey job is establishing competence, and competence is read from the relationship *between* the stages — a presentation that shows exactly one stage at a time by design forecloses the comparison it depends on. The pattern was not the defect; its content was. Retiring a pattern because one surface stopped using it would document a surface decision as a system decision. |
| 2026-08-25 | **Section 46.8 amended in three places for the divided content stage.** (a) **Hover no longer commits** where a selector drives a substantial content stage: click, tap and keyboard activation commit; hover and keyboard focus indicate availability only, using the inactive approach treatment and never the active amber enclosure. Hover-to-commit remains the default for selectors driving only a short copy swap, and a selector must apply one behaviour to all of its own stages. (b) **A rail MAY be laid out on either axis**, provided every stage number and title stays visible at every width — the axis is a composition decision, the visibility rule is not. (c) **The content area MAY be divided** into a copy column and a persistent visual column beside the rail; in the divided form both columns MUST reserve a height independent of the active index. New **Section 46.8.1** governs the visual column: one accumulating visual system rather than swapped illustrations, elements introduced at one stage persisting at every later stage, no second interaction, legible without motion, and a distinct compact composition rather than a scaled one. | Marketing website | Jeff Kaufman | Sections 46.8, 46.8.1, 46.3, 46.5, 35.1, 48.3. The hover rule was written for a three-stage rail above a short copy area, where an accidental change cost the reader one line. On a five-stage rail driving an accumulating figure, crossing the rail on the way elsewhere re-narrates the argument, and focus-to-commit destroys a keyboard reader's place mid-traversal. The divided stage and the accumulating visual are what convert five sentences that *assert* thoroughness into one object that *shows* what thoroughness produces — which is the difference between a method a reader is told about and one they watch happen. |
| 2026-08-20 | Section 46.9 REVISED from Scroll-Driven Process Accordion to **Scroll-Driven Sequential Process Reveal (process scrollytelling)**: one stage presented at a time inside the pinned presentation; continuous section-relative scroll progress is the single source of truth, driving enter → generous hold → exit choreography per stage and reversing naturally on upward scroll; the all-titles-visible rail and accordion button semantics (`aria-expanded`/`aria-controls`) are removed as misdescribing a narrative presentation. Stable outer geometry, no timers/autoplay, copy always in the document in reading order, Section 46.4 restraint, and the normal-flow narrow-viewport and reduced-motion fallbacks all carry over. Section 46.8 is unchanged. First approved use: the homepage five-step JiTpro process. | Marketing website | Jeff Kaufman | Section 46.9. The accordion presented the methodology as a menu of five visible rows; the methodology is a narrative the visitor moves through, and presenting one stage at a time with the reveal physically connected to scrolling makes the progression the experience rather than an interaction to discover. Continuous scroll-linked animation also removes the discrete threshold switching that made the accordion feel jerky. |
| 2026-08-20 | ~~Scroll-Driven Process Accordion approved as a new interaction pattern (Section 46.9): a genuine ordered process presented as a vertically stacked accordion whose active stage is driven by section-relative scroll progress, with click, tap, and keyboard focus activating any stage immediately and simple positional resumption of scroll control afterward — no timers or autoplay of any kind. Scroll is appropriate here because the visitor is progressing through a genuine ordered JiTpro methodology, and this is not autoplay because progression is directly controlled by the reader's own scrolling. A narrow recorded exception to Section 46.8's height rule permits a PINNED accordion's internal layout to unfold as stages change, because the pinned architecture keeps the presentation spatially stable in the viewport while the process unfolds — the surrounding document flow must never jump. Section 46.8 is unchanged and continues to govern stage selectors. First approved use: the homepage five-step JiTpro process section.~~ **Presentation SUPERSEDED same day by the Scroll-Driven Sequential Process Reveal entry above.** The interaction principles recorded here — reader-controlled progression, no timers or autoplay, stable pinned geometry, copy always in the document, Section 46.8 untouched — survive under the revised Section 46.9. Retained for history. | Marketing website | Jeff Kaufman | Section 46.9. Sections 46.3, 46.4, 46.5 apply in full. |
| 2026-08-18 | Integrated-photography tonal treatment amended: the global `brightness(0.70) saturate(0.75) contrast(0.95)` filter is removed; the token-only blending overlay is the sole darkening mechanism, and the photograph displays at its full natural brightness wherever the overlay has released. | Marketing website | Jeff Kaufman | Section 17.1. Direction supplied by Jeff 2026-08-18: with a uniform filter, even the fully unmasked right side of the scene rendered dim; the darkening's purpose is blending into the page, which the overlay accomplishes alone, so the revealed photograph should be the photograph. |
| 2026-08-18 | Integrated-photography composition amended from an editorial two-column image block to an environmental composition (Section 17.1): the photograph keeps its native aspect ratio and complete scene, fills the full height of the movement it supports, and reaches left beneath the copy; the dissolve spans the movement rather than the photograph - held solid across the reading zone, releasing rightward until the scene stands clear, with the photograph's left edge fully swallowed so no seam is findable. Supersedes the same-day 55-60/40-45 two-column crop language below; the tonal treatment, token-only gradients, no-frame rule, headline subordination, stacked tablet/mobile presentation, and delivery rules are unchanged. | Marketing website | Jeff Kaufman | Section 17.1. Direction supplied by Jeff 2026-08-18 after review: the cropped right-side block read as an image card beside the copy, with dark margins above and below; the section should instead read as one composed movement, with the photograph as the environment its right side emerges from. |
| 2026-08-18 | Documentary project-team photography approved for marketing argument sections, with the integrated treatment (Section 17.1): tonal integration at approximately `brightness(0.70) saturate(0.75) contrast(0.95)` tuned per photograph with the subject remaining unmistakable; a text-facing edge dissolve built only from `--jp-background` gradient stops; no card frame, border, or radius; photograph subordinate to the headline. Desktop uses an editorial two-column composition (text 55-60%, photograph 40-45%, photograph away from the shared left edge); tablet and mobile stack the photograph after the introductory copy in a wide cinematic crop with the dissolve removed. Section 48.8's prohibition on stock and generic construction imagery is narrowed, not lifted: approved photography must show the real working mechanism the section argues, and each use is approved individually. First approved use: the project-team meeting photograph in the homepage priority-clarity section, delivered as optimized responsive WebP with an explicit aspect ratio and eager loading. | Marketing website | Jeff Kaufman | Sections 17.1, 47.3, 48.2, 48.6, 48.8, 8.9. Direction supplied by Jeff 2026-08-18: the section argues that a capable team surrounded by project information can already contain the unresolved dependency that stops the field six months out, and the photograph is the evidence that makes that argument tangible - a competent team actively reviewing a project, not chaos, not decoration. |
| 2026-08-08 | One-time guided progression approved for the homepage Stage Selector: on first entry the selector advances 01 → 02 → 03 at reading pace using the existing selection visuals, then stops permanently at 03. Finite progression is approved for this use; looping and perpetual autoplay remain prohibited. Any deliberate interaction — hover, focus, click, or tap — cancels the remaining progression for the page visit; stages never change while the section is off-screen; the progression does not run under reduced motion. | Marketing website | Jeff Kaufman | Section 46.8. The selector's three stages are the section's argument, and a first-time visitor should see the argument reveal itself without having to discover the interaction. A single finite pass at reading pace is guidance, not autoplay: it runs once, only in view, stays silent under reduced motion, and surrenders control the instant the visitor expresses intent. |
| 2026-08-08 | Stage Selector visual treatment refined to the established pill-control language: selectors are `rounded-full` pill controls — active enclosed by `--jp-brand-amber` at roughly 30% border and 10% background tint with amber text emphasis; inactive muted with the same pill footprint, brightening toward primary text with a subtle neutral wash on hover/focus. Supersedes the hairline-band expression within Section 46.8. The Stage Selector's behavior — one active index, hover/focus/click/tap equivalence, no auto-advance, copy always in the document, stable section height — is unchanged. | Marketing website | Jeff Kaufman | Section 46.8. At rest, the hairline treatment read as three content columns rather than an interactive control, so interactivity was not obvious before the visitor moved the mouse. The FAQ category selector already established a recognizable selector-control language — muted at rest, brightening on approach, lighting amber when selected — and one selector language site-wide is worth more than two (Section 48 preamble). The FAQ's own literal color classes remain legacy non-conforming code (Section 49.4); the Stage Selector expresses the same treatment in approved tokens. |
| 2026-08-08 | Stage selector approved, superseding the sequence carousel for the homepage small miss → constraint → field impact progression. All three numbered stage titles stay visible as a rail of real controls above a single content area; one active index drives the presentation; hover, focus, click, and tap resolve to the same index; no auto-advance or auto-cycling; all stage copy stays in the document at all times; switching stages never changes section height; keyboard focus stays visible and unclipped; touch never depends on hover; selectors stack where a horizontal rail would cramp; reduced motion resolves selection instantly. | Marketing website | Jeff Kaufman | Section 46.8. The carousel was visually polished once discovered, but its affordance was too subtle: cropped neighbours and small chevrons asked the reader to discover the interaction rather than stating it. The selector rail makes the three explorable stages explicit — three visible titles, one active — and the architecture is simpler and more maintainable: the track-width/offset geometry, responsive peek tables, and breakpoint geometry listeners are removed outright. |
| 2026-08-08 | Centered CTA supporting copy approved as a narrow exception: short supporting body copy MAY be centered when it belongs to a deliberately centered call-to-action composition and directly supports the CTA heading and action - at most four rendered lines at the intended desktop composition, measure no more than roughly 52ch, never for ordinary explanatory sections or long-form copy, used sparingly. Ordinary body copy site-wide remains left-aligned. First approved use: the homepage final CTA, centered at `sm:` and above; the mobile presentation stays left-aligned. | Marketing website | Jeff Kaufman | Sections 7.7 and 48.6. The page's decision point had the weakest composition on the page - a narrow left column pressed against the widest empty space. Centering the close resolves the page on its own axis, and its supporting paragraph must be able to follow the composition it belongs to. Recorded separately from the centered-editorial-statement exception so neither quietly broadens the other. |
| 2026-08-08 | Centered editorial statement approved as a narrow page-level composition exception: a single short, heading-behaving statement MAY be set centered in its own full-width section as a deliberate pause or transition between arguments - constrained measure, no eyebrow, no supporting body copy, no controls, no graphic, used sparingly (at most one or two per page). Ordinary sections and body copy remain left-aligned on the shared left edge; NO centered-body-copy allowance is created. First approved use: the homepage thesis statement between the urgency and product sections. | Marketing website | Jeff Kaufman | Sections 7.7 and 48.6. The page's central claim was set as an ordinary closing paragraph inside a section, giving the thesis less visual presence than any section heading. Setting it alone and centered marks the page's turn from problem to answer; the exception is kept narrow because the interruption only carries meaning while the shared-left-edge discipline it interrupts remains the rule. |
| 2026-08-07 | `--jp-success` refined from `#10B981` to **`#059669`**. Visual refinement only — the semantic definition, the approved uses, and the prohibitions in Section 8.3.1 are all unchanged, and the token's use is not broadened. | All products | Jeff Kaufman | Section 8.3.1. `#10B981` read as electric against `--jp-background` and competed with the amber system for attention, which is the opposite of what a completed state should do: finished work should settle, not announce itself. `#059669` is more restrained and still unmistakably green. Contrast moves from roughly 8:1 to roughly 5.4:1, which remains clear of the WCAG AA minimum of 4.5:1 at body sizes. |
| 2026-08-07 | ~~`--jp-success` approved at `#10B981`.~~ **Value SUPERSEDED 2026-08-07 by `#059669` above.** The semantics recorded in this entry remain in force. | All products | Jeff Kaufman | Retained for history; only the hex was superseded. |
| 2026-08-07 | `--jp-success` approved as a semantic **state** color meaning confirmed successful completion. Restricted to completed milestones, completed timeline structure, and confirmed successful outcomes. NOT a second accent: prohibited on CTAs, headings, hover states, navigation, and any decorative or merely "positive-looking" use. First approved implementation is the marketing hero timeline's forward pass. The travelling marker remains `--jp-brand-amber-active` and the upper planning indicator remains `--jp-brand-amber`; neither turns green. | All products | Jeff Kaufman | Sections 8.3.1 and 8.8. Section 8.3 already reserved green for "successfully resolved, completed, or verified" states and forbade it as a branding or general accent color; this names the value and enforces the restriction. `#10B981` measures roughly 8:1 against `--jp-background`, clearly separable from both the neutral text ramp and the amber system, without the fluorescence of a lime or traffic-light green. Reconciles with the Section 8.1 exclusion list, which governs **brand identity** colors rather than semantic state — see 8.3.1. |
| 2026-08-07 | ~~Sequence carousel approved for ordered sets that carry a progression. Initializes only on section intersection, once, never auto-advances; one active index drives the layout; hover, focus and tap are equivalent; all stage copy stays in the document at all times. Supersedes the sequential scroll reveal recorded earlier the same day.~~ **SUPERSEDED 2026-08-08 by the stage selector above.** The interaction principles recorded here — entry on intersection, no auto-advance, one active index, equivalent inputs, copy always in the document — remain in force under the stage selector; only the moving-track presentation was superseded. Retained for history. | Marketing website | Jeff Kaufman | Section 46.7. The homepage "small miss → constraint → field impact" row is an argument in order. The reveal it replaces had two defects: it ran on load while the reader was still at the hero, so the section was already finished by the time it was reached; and a one-shot reveal gave the reader nothing to do with a progression they should be able to move through. Restricted to genuine progressions so it does not become a generic effect on every group of three. |
| 2026-08-06 | Token implementation architecture approved: approved `--jp-*` custom properties are declared in `:root` in `src/index.css`, and Tailwind v4 `@theme inline` aliases (`--color-jp-*`) reference those variables rather than restating their values. | All products | Jeff Kaufman | Section 45.2. Tailwind v4 only generates utilities from `--color-*` names, but Section 8.8 mandates the `--jp-*` names. Aliasing satisfies both from one authoritative declaration; restating the hex inside `@theme` would create the second definition site Section 45.2 forbids. |
| 2026-08-06 | Centered-caption exception approved: short figure captions and concise explanatory statements directly associated with a centered diagram MAY be centered when their measure is constrained. Ordinary body copy and long explanatory paragraphs remain left-aligned. | All products | Jeff Kaufman | Section 7.7. A caption belongs to its figure, not to the reading column. The prohibition in 7.7 exists to stop long centered prose, not to break the association between a centered visual and the one line that explains it. |
| 2026-08-06 | `slate-500` and `slate-200` resolved against the existing token set rather than by adding neutrals. Quieter-than-muted text is `--jp-text-muted` at reduced opacity; the replay control rests at `--jp-text-muted` and hovers to `--jp-text-primary`. | All products | Jeff Kaufman | Section 8.8. The approved neutral set already spans the required range. Two more near-identical grays is the specific failure this system exists to prevent, and neither use expresses a semantic level the three text tokens do not already cover. |
| 2026-08-06 | Subtle divider treatment approved: section dividers and structural hairlines use `--jp-border` at **12%** opacity. Replaces the ad-hoc `white/10` and `white/12` pair. Functional diagram hairlines may retain their existing perceptual weight; the base hue must always be `--jp-border`. | All products | Jeff Kaufman | Section 8.8. Two divider opacities two points apart are indistinguishable and fragment the palette for no gain. One approved level is named; opacity tokens are NOT created, per the standing preference against growing a token per component. |
| 2026-08-06 | Section step/sequence numbers (`01` / `02` / `03`) standardized on `--jp-brand-amber` at restrained opacity across every equivalent section. | Marketing website | Jeff Kaufman | Section 48.9. The homepage rendered the same component role in two unrelated conventions - amber in two sections, a neutral gray in a third. Equivalent roles must not carry different color conventions. |
| 2026-08-06 | Keyboard focus outline on amber controls and appropriate dark-surface controls approved as `--jp-text-primary`. No focus-specific color token is created. | All products | Jeff Kaufman | Sections 48.1 and 8.1.1. An amber outline on an amber button is low-contrast against the control it marks. `--jp-text-primary` is the highest-contrast value in the approved set against every dark surface, and reusing it avoids a token whose only job is to be visible. |
| 2026-08-06 | `--jp-brand-amber-active` approved for genuine interactive active states, hover included. Hover on a primary action is an active state, not a static one. | All products | Jeff Kaufman | Section 8.1.1. Active Amber's rule is that it must never be a *static* brand color; it has always been permitted for illuminated and active states. A hover is a real, transient active state, and expressing it as the brand amber dimmed would read as disabled rather than responsive. |
| 2026-08-06 | Hero cool depth wash `rgba(51,74,120,0.30)` **removed** rather than tokenized or replaced. **Supersedes** the same-date decision to replace it with a `slate-700`-derived treatment. No neutral token is added, and `--jp-hero-glow-cool` remains rejected. | Marketing website | Jeff Kaufman | Sections 8.8 and 47.4. The wash is decorative and carries no information. A decorative effect is not grounds for expanding the token system, and the restraint test in 47.4 answers the question directly: what is lost is that the hero looks plainer, which is the goal. |
| 2026-08-06 | ~~Hero cool depth wash `rgba(51,74,120,0.30)` to be replaced with a `slate-700` `#334155`-derived treatment during the homepage migration.~~ **SUPERSEDED 2026-08-06 by the removal decision above.** Retained for history. | Marketing website | Jeff Kaufman | Section 8.8. Superseded once implementation review established that no conformant expression of a `#334155`-derived treatment existed without adding a token the system did not want. |
| 2026-08-06 | Component-specific color token for the hero glow REJECTED. `--jp-hero-glow-cool` and any equivalent hero-scoped color token will not be created. | All products | Jeff Kaufman | Section 8.8. Component-scoped color tokens turn a shared system into a collection of private palettes, and each one makes the next easier to justify. A recurring cool-lighting role may be evaluated as a semantic token in future through Section 49; one hero is not a role. |
| 2026-08-06 | `--jp-shadow` remains RESERVED with no value. DEFERRED. | All products | Jeff Kaufman | Section 8.8. Review of the marketing homepage found no neutral shadow of any kind; the only shadows present are amber emphasis glows derived from `--jp-brand-amber`. A token is not approved merely because its name was reserved. |
| 2026-08-06 | `--jp-border` approved at `#94A3B8`, deliberately sharing its base value with `--jp-text-muted`. Opacity may vary by semantic use; recurring levels must be formalized through Section 49 rather than invented per component. | All products | Jeff Kaufman | Section 8.8. Neutral structure and de-emphasized text belong to the same tonal family; two different grays would fragment the palette for no communicative gain. They remain separate tokens because they express separate intents and a future decision may move one without the other. |
| 2026-08-06 | `--jp-text-primary` approved at `#F1F5F9`, consolidating the previous `#F8FAFC` and `#F1F5F9` usage into a single primary text color. | All products | Jeff Kaufman | Section 8.8. The two values differ by roughly seven points per channel and 0.87 in contrast ratio against `#020617` - imperceptible, and precisely the near-identical grays this system exists to prevent. Emphasis above body copy is carried by type scale and weight, not by a second, brighter white (Section 47.3). |
| 2026-08-06 | `--jp-text-muted` approved at `#94A3B8` as an ADDITION to the previously reserved token set. | All products | Jeff Kaufman | Section 8.8. Primary, secondary, and muted text are three genuinely different semantic levels. The muted level cannot be synthesised from `--jp-text-secondary` by opacity: `#CBD5E1` faded over `#020617` converges in the red channel but falls materially short in blue, because `#94A3B8` is the bluer color rather than merely the dimmer one. Approximating it would have shipped a visibly different value while claiming it was the same. |
| 2026-08-06 | Neutral token set approved: `--jp-background` `#020617`, `--jp-surface` `#0F172A`, `--jp-text-primary` `#F1F5F9`, `--jp-text-secondary` `#CBD5E1`, `--jp-text-muted` `#94A3B8`, `--jp-border` `#94A3B8`. | All products | Jeff Kaufman | Section 8.8. Values derived from the dominant neutrals already in production rather than newly chosen, so approval formalizes existing practice instead of imposing a new palette. Unblocks the homepage token migration. The approved amber system is unchanged. |
| 2026-08-06 | Design Decision Process approved: the Design System is updated before production code, never after. | All products | Jeff Kaufman | Section 49 |
| 2026-08-06 | Component consistency standard approved for buttons, cards, timeline, icons, badges, section spacing, accent usage, and illustration. | All products | Jeff Kaufman | Section 48 |
| 2026-08-06 | Visual hierarchy standard approved: the qualities JiTpro must project, and the qualities it must never project. | All products | Jeff Kaufman | Section 47 |
| 2026-08-06 | Animation standard approved: animation must communicate, never decorate; all elements of a single animated idea derive from one shared state. | All products | Jeff Kaufman | Section 46 |
| 2026-08-06 | Implementation standard approved: colors are consumed as CSS custom properties, defined once in `src/index.css`. | All products | Jeff Kaufman | Section 45 |
| 2026-08-06 | Color governance approved: production components may not reference Tailwind amber utilities, raw hex, or rgba amber literals. | All products | Jeff Kaufman | Section 8.9 |
| 2026-08-06 | Approved design token layer established (`--jp-*` CSS custom properties). | All products | Jeff Kaufman | Section 8.8 |
| 2026-08-06 | Active Amber approved as `#FDE68A` for illuminated/animated states only. Never a static brand color. | All products | Jeff Kaufman | Section 8.1.1; marketing hero timeline |
| 2026-08-06 | JiTpro Brand Amber approved as `#F59E0B` as the official primary brand color. | All products | Jeff Kaufman | Section 8.1.1; JiTpro logo artwork |
| TODO | TODO | TODO | TODO | TODO |

---

# 1. Brand Philosophy

Purpose: JiTpro exists to eliminate procurement chaos before it reaches the field. The software is built around one fundamental belief: “Most schedules don’t break in the field. They arrive broken.” JiTpro prevents that by exposing procurement problems while there is still time to solve them.

The design language must communicate this philosophy immediately. A user should feel that JiTpro brings order to complexity, makes hidden risk visible, and gives project teams a clear understanding of what is happening early enough to make informed decisions.

JiTpro gives project teams confidence that procurement is under control. It does not promise that every project will succeed. It promises that teams will see reality sooner, understand the implications, and have the visibility required to act before field recovery becomes the only option. JiTpro does not create optimism. It creates visibility.

Decisions that belong in this section:
- Core brand belief: JiTpro exists to expose procurement problems before they reach the field.
- Foundational thesis: most schedules do not break in the field; they arrive broken.
- Brand promise: JiTpro gives project teams confidence that procurement is under control by surfacing reality early enough to make informed decisions.
- Visual obligation: every interface must communicate order, clarity, control, and construction expertise before the user reads detailed copy.
- Professional posture: the interface must communicate confidence without arrogance, precision without rigidity, authority without intimidation, and sophistication without excess.
- Field-rooted credibility: JiTpro must feel like software built by construction professionals, not software engineers guessing how construction works.
- Design mission: every screen must answer one question: “What does the user need to understand right now?” Anything that does not help answer that question should be removed.
- Design standard: JiTpro is not attempting to imitate Linear, Apple, or Vercel. JiTpro seeks the same level of craftsmanship, restraint, consistency, and attention to detail while creating its own identity rooted in construction management.
- Approved brand values: precision, control, clarity, trust, accountability, professionalism, calm under pressure, executive confidence, construction expertise, and long-term reliability.
- Forbidden brand signals: playfulness, flashiness, chaos, trendiness, startup culture, hype, aggressive sales energy, and consumer-product aesthetics.

Implementation notes:
- This section guides visual decisions but does not prescribe specific fonts, colors, spacing, motion values, or component tokens. Those decisions belong in later chapters.
- Brand philosophy must align with JiTpro language governance and external positioning rules.
- Public-facing language should respect JiTpro governance: external category and product-form nouns must be verified against the JiTpro vault before being finalized.
- The interface should feel like a superintendent who has walked onto hundreds of complex projects: calm, experienced, prepared, methodical, never rushed, never surprised, and always organized.
- Clarity is always more important than decoration. Understanding is always more important than visual effects.
- Every future UI decision across the marketing website, SaaS application, internal dashboard, printed reports, and documentation must reinforce that JiTpro understands construction at an expert level.
- When a visual choice creates drama but reduces comprehension, choose comprehension.
- When a visual choice feels trendy but weakens long-term reliability, choose reliability.
- When a visual choice makes the interface feel clever but less accountable, choose accountability.

---

# 2. Product Personality

Purpose: Define the behavior of the JiTpro product itself. Product personality is not marketing language; it is how the software behaves through interface tone, density, motion, hierarchy, illustration, interaction, and future feature design.

JiTpro’s personality must be calm, precise, deliberate, intelligent, organized, professional, trustworthy, quietly confident, experienced, and methodical. The product should never appear rushed, excited, busy, or competing for the user’s attention. It should calmly guide the user toward the most important information.

The intended emotional experience is that the user can say: “I understand the project. I know where the risks are. I know what needs attention. I trust this information. I am in control.” JiTpro should reduce anxiety rather than create urgency. Urgency comes from project conditions, not from the software itself.

Decisions that belong in this section:
- Core personality attributes to express: calm, precise, deliberate, intelligent, organized, professional, trustworthy, quietly confident, experienced, and methodical.
- Personality attributes to avoid: rushed, excited, busy, attention-seeking, random, decorative, exaggerated, trendy, or visually noisy.
- Construction personality: JiTpro should feel like an experienced superintendent, a respected senior project manager, a trusted owner’s representative, and a disciplined operations executive.
- Non-goal personalities: JiTpro must never feel like a social media application, consumer productivity app, startup landing page, cryptocurrency website, gaming interface, or flashy sales presentation.
- Emotional outcome: the interface should help users understand the project, identify risk, know what needs attention, trust the information, and feel in control.
- Communication style: the interface communicates facts. It does not exaggerate, manufacture urgency, or use emotional language to influence decisions.
- Visual behavior: the interface must appear balanced, stable, predictable, intentional, consistent, orderly, and professional.
- Decision hierarchy: when design uncertainty exists, prioritize clarity first, then readability, information hierarchy, usability, accessibility, consistency, and finally beauty.
- AI design rule: future AI systems generating JiTpro interfaces should first ask, “What would the calmest, most experienced construction executive build?” not “What looks modern?”, “What is trending?”, or “What is visually impressive?”

Implementation notes:
- Product personality should inform typography, motion, color intensity, density, and component behavior.
- Do not translate personality attributes into specific fonts/colors until those decisions are approved in their own chapters.
- Beauty is important, but understanding is more important. Professional judgment must always outweigh visual novelty.
- The interface should not create artificial urgency. It should present information clearly and allow professionals to make informed decisions.
- Nothing should feel random. Nothing should feel decorative. Nothing should exist without purpose.
- Motion, illustration, layout, and interaction patterns must reinforce calm guidance rather than stimulation or spectacle.
- When a visual idea feels modern but weakens clarity, choose clarity.
- When an interaction feels impressive but interrupts comprehension, choose comprehension.
- When a layout feels visually rich but competes with the user’s task, simplify the layout.

---

# Brand Voice & Customer Education

Purpose: JiTpro is built by construction professionals. It should always sound like construction professionals speaking to other construction professionals. The website is not simply marketing software; it is teaching experienced builders to see their projects through a new framework.

Decisions that belong in this section:
- Core principle: never assume the visitor already understands JiTpro terminology. Start with the problems they already experience, then introduce the professional terminology, then explain how JiTpro organizes those problems.
- Educational posture: JiTpro must educate without talking down to the audience. The voice should make experienced builders feel understood, not corrected.
- Terminology strategy: many small and mid-sized general contractors do not believe they perform “procurement.” They associate procurement with large commercial contractors that have dedicated procurement departments. The website should intentionally create the realization that they perform procurement every day, even if they do not call it that.
- Aha moment: visitors should discover that JiTpro gives structure and visibility to work they already perform every day.
- Writing philosophy: write like one experienced contractor speaking to another. The voice should feel like someone who has successfully managed difficult projects, not someone trying to sell software.
- Teaching philosophy: every unfamiliar JiTpro concept should be introduced in three steps: start with a real construction situation, give that situation a name, then explain how JiTpro manages it.
- Trust standard: trust is earned through understanding. Visitors should feel, “This company understands my world,” “They’ve dealt with the same problems,” and “They’re putting words around problems I’ve always had.”
- Communication standard: every page should ask, “Would an experienced superintendent naturally explain it this way?” If not, rewrite it.

Implementation notes:
- Start with concrete construction situations before introducing JiTpro terminology.
- Do not introduce technical terminology without first creating context.
- Use plain English, construction vocabulary, specific examples, real project situations, practical explanations, honest observations, and professional confidence.
- Avoid corporate language, consulting jargon, MBA terminology, startup buzzwords, marketing exaggeration, and language that sounds like software being sold to outsiders.
- The website should never make visitors feel unintelligent for not knowing construction-management terminology. It should make them feel understood.
- When explaining procurement to small and mid-sized general contractors, use examples they recognize: waiting on cabinets, waiting on windows, waiting on owner selections, waiting on shop drawings, and waiting on long-lead materials. Then connect those examples to the professional term.
- A valid educational sequence is: “You probably don’t call it procurement. You call it waiting on cabinets. Waiting on windows. Waiting on owner selections. Waiting on shop drawings. Waiting on long-lead materials. That’s procurement.”
- The voice should be direct, practical, and professional. It should not exaggerate the problem or dramatize the solution.

---

# 3. User Experience Philosophy

Purpose: Define the experience JiTpro should create over the lifetime of a customer relationship. This chapter is not about interface elements; it is about how users should perceive the software after repeated use.

JiTpro should reduce uncertainty. Every interaction should leave the user feeling more informed than before. The software should never overwhelm users with information; it should progressively reveal the information that matters most. JiTpro must organize complexity, not merely display complexity.

Decisions that belong in this section:
- First impression: when a user first opens JiTpro, they should think, “This looks professional,” “This feels different,” “This software understands construction,” and “This appears trustworthy.” Nothing should feel flashy, experimental, or unfinished.
- After five minutes: users should understand where everything is, feel that the interface is logical, know they do not have to fight the software, and immediately recognize what deserves attention. The interface should feel intuitive rather than impressive.
- After one week: users should trust the information, rely on JiTpro daily, make better decisions, and spend less time searching for answers. Confidence should increase with continued use.
- After six months: users should not want to manage another project without JiTpro. The software should feel like part of how they run projects, helping teams notice problems earlier and make fewer avoidable mistakes.
- Interface philosophy: every screen should answer three questions immediately: What is happening? What needs attention? What should I do next?
- Cognitive-load standard: reduce unnecessary decisions, unnecessary movement, unnecessary reading, and unnecessary clicks. Every interaction should make the project feel simpler.
- Trust standard: trust must come from accurate information, predictable behavior, consistency, and disciplined presentation, not from marketing language, animation, or visual effects.
- Long-term relationship: JiTpro should quietly become trusted infrastructure because it consistently helps users understand the project better than any alternative.
- Guiding principle: every design decision should ask, “Will this help experienced construction professionals make better decisions with less effort?” If the answer is no, it should not be included.

Implementation notes:
- User experience goals must translate into hierarchy, navigation, disclosure patterns, dashboard structure, form flow, reporting, and state design later.
- Users should never need to search for the primary message of a screen.
- The software should reveal priority before detail, detail before exception, and exception before action only when that sequence helps comprehension.
- Never make the software more complicated than the project itself.
- Do not create artificial urgency. Urgency should come from real project conditions surfaced clearly by the system.
- Do not use animation, visual drama, or marketing copy as substitutes for accurate information and predictable behavior.
- The product should become indispensable quietly, through repeated usefulness rather than persuasion.

---

# 4. Design Principles

Purpose: Establish the non-negotiable rules that govern all visual and interaction decisions.

Decisions that belong in this section:
- Top-level design principles
- Priority order when principles conflict
- Accessibility principle
- Data clarity principle
- Motion restraint principle
- Construction-context principle
- Enterprise trust principle

Implementation notes:
- Principles must be actionable. Each principle should include “Do” and “Do not” examples once finalized.
- Principles should apply across all media, including printed reports.

Principle 1: Clarity Before Beauty
- Definition: Every interface must communicate information clearly before attempting to impress visually. Beautiful interfaces are valuable; understandable interfaces are essential.
- Use when: evaluating visual effects, layout density, animation, illustration, page composition, dashboard design, report design, and component styling.
- Do: make the primary message immediately understandable; remove visual effects that compete with comprehension; choose clear hierarchy over decorative impact.
- Do not: preserve a visual treatment only because it looks impressive; allow beauty to obscure meaning; make users work to understand the screen.

Principle 2: Information Has Hierarchy
- Definition: Not every piece of information deserves equal visual weight. JiTpro interfaces must immediately communicate what matters most, what requires attention, and what can wait.
- Use when: designing dashboards, tables, page headers, cards, alerts, charts, reports, navigation, and application workflows.
- Do: establish hierarchy primarily through typography, spacing, contrast, and layout; make the most important information easier to find than secondary information.
- Do not: give equal emphasis to all information; use excessive color as the primary hierarchy tool; make users determine priority by reading everything first.

Principle 3: Reduce Cognitive Load
- Definition: Construction projects are already complicated. JiTpro must not add unnecessary complexity. Every unnecessary click, animation, decision, paragraph, or visual element increases cognitive load.
- Use when: reviewing workflows, forms, navigation paths, data views, onboarding, help content, and reporting.
- Do: reduce, simplify, and clarify whenever possible; remove unnecessary decisions; make the next useful action obvious.
- Do not: create extra steps to satisfy internal structure; show complexity simply because it exists; make the software more complicated than the project.

Principle 4: Teach Before You Label
- Definition: JiTpro must never assume users already understand JiTpro terminology. Users should discover concepts through real construction situations before being asked to adopt vocabulary.
- Use when: writing marketing pages, onboarding flows, empty states, tooltips, documentation, feature labels, and explanatory UI.
- Do: start with a real construction situation, introduce the terminology, then explain how JiTpro organizes that situation.
- Do not: introduce technical terminology without context; force users to memorize vocabulary; make experienced builders feel unintelligent for not using JiTpro’s terms.

Principle 5: Every Pixel Must Earn Its Place
- Definition: Every element on the screen must exist for a reason. Decoration must never exist independently of function.
- Use when: adding icons, illustrations, dividers, badges, shadows, color accents, cards, animations, or supporting copy.
- Do: remove elements when removal makes the interface clearer; ensure every visual element supports comprehension, hierarchy, trust, or action.
- Do not: add ornament for its own sake; fill space because it is available; keep a visual element that does not help the user understand or act.

Principle 6: Construction First
- Definition: When generic SaaS conventions conflict with construction workflow, construction workflow wins. JiTpro must reflect how projects are actually managed.
- Use when: naming objects, structuring workflows, designing dashboards, mapping project roles, representing procurement steps, and choosing default information architecture.
- Do: privilege real project behavior, field experience, and construction decision-making patterns; make the product feel built by construction professionals.
- Do not: force construction work into generic software patterns; use startup SaaS conventions when they weaken project understanding; design for software neatness over jobsite reality.

Principle 7: Consistency Creates Trust
- Definition: Users trust software that behaves predictably. Consistency reduces uncertainty.
- Use when: defining components, navigation, button behavior, spacing, terminology, table actions, status states, reports, and documentation.
- Do: keep buttons, navigation, spacing, terminology, states, and component behavior consistent across surfaces.
- Do not: create one-off variants without a clear system reason; change terminology across pages; make similar actions behave differently.

Principle 8: Calm Interfaces Build Confidence
- Definition: JiTpro should never compete for attention. The interface should make users feel calmer after opening it than before.
- Use when: deciding color intensity, motion, alerts, whitespace, density, notifications, dashboards, and risk visualization.
- Do: use restraint, whitespace, sparse motion, and intentional color; let real project conditions create urgency rather than forcing urgency through interface drama.
- Do not: over-animate, over-color, crowd the page, or make normal states feel alarming.

Principle 9: Support Decision Making
- Definition: JiTpro exists to improve project decisions. Every screen should help users understand what happened, why it matters, and what they should do next.
- Use when: designing screens, reports, dashboards, charts, tables, alerts, forms, and workflows.
- Do: connect information to decision-making; surface meaning, consequence, and next action; question any element that does not contribute to better decisions.
- Do not: display information without context; prioritize data volume over decision value; make users infer the operational implication alone.

Principle 10: Craftsmanship Matters
- Definition: JiTpro should feel carefully built. Attention to detail communicates trust.
- Use when: refining spacing, typography, alignment, motion, component states, empty states, loading states, print layouts, and data displays.
- Do: make spacing deliberate, typography disciplined, motion subtle, and components engineered; treat small details as part of trust-building.
- Do not: accept rough alignment, inconsistent spacing, careless copy, unfinished states, or components that feel assembled rather than designed.

The JiTpro Standard
- The goal is not to create the most beautiful construction software. The goal is to create the clearest, most trustworthy, and most professionally crafted construction software.
- Visitors and users should leave with the impression that the same level of care used to build exceptional projects has been applied to building JiTpro itself.
- These principles take precedence over personal preference, design trends, and aesthetic experimentation.
- When uncertainty exists, use these principles to resolve the decision.

---

# 5. Visual Language

Purpose: Define the overall visual grammar of JiTpro: the recurring shapes, hierarchy, density, contrast, data patterns, and graphic motifs that make the interface recognizable.

Decisions that belong in this section:
- Overall visual direction
- Approved visual motifs
- Prohibited visual motifs
- Density rules
- Contrast style
- Use of construction, schedule, procurement, and control metaphors
- Relationship between cinematic marketing visuals and practical application UI

Implementation notes:
- This section should connect brand philosophy to concrete visual systems without choosing exact tokens.
- Approved motifs should later map to component patterns, chart patterns, iconography, and illustration rules.

Overall Character
- JiTpro should appear quiet, confident, purposeful, engineered, professional, disciplined, architectural, and timeless.
- Every screen should feel intentional. Nothing should feel accidental.
- The visual language must communicate that JiTpro is built to organize complex project reality, not decorate it.

Architectural Influence
- JiTpro’s visual language should resemble architectural drawings and well-organized construction documentation more than consumer software.
- Approved characteristics include strong alignment, consistent spacing, visible structure, predictable rhythm, clean geometry, order, and disciplined organization.
- The interface should feel designed by people who organize complex projects.

Restraint
- JiTpro should never rely on visual excess.
- Avoid visual noise, unnecessary decoration, and competing focal points.
- Whitespace is an active design element. Empty space improves understanding.
- The interface should never feel crowded.

Visual Hierarchy
- Users should immediately recognize primary information, supporting information, and reference information.
- Everything should have an obvious place in the hierarchy.
- Visual weight should come from typography, spacing, layout, and contrast—not decoration.

Balance
- Every page should feel visually balanced.
- No section should dominate the interface unnecessarily.
- No element should appear oversized simply to attract attention.
- Layout should create a feeling of stability.

Rhythm
- Pages should establish a consistent rhythm.
- Users should begin to anticipate spacing, alignment, and section organization.
- Predictability reduces cognitive effort and rewards familiarity.

Construction Identity
- JiTpro should visually reflect construction management through structure, organization, systems, sequences, timelines, relationships, dependencies, and professional documentation.
- Construction influence should feel authentic rather than decorative.
- Do not rely on hard-hat imagery, generic construction photography, or superficial construction clichés as the primary expression of the brand.

Premium Quality
- JiTpro should feel premium because of craftsmanship, not visual effects.
- Premium means excellent typography, excellent spacing, excellent alignment, excellent consistency, and excellent attention to detail.
- Premium does not mean large shadows, heavy gradients, flashy animation, glassmorphism, or visual gimmicks.

Timelessness
- JiTpro should still feel modern five years from now.
- Avoid temporary design trends.
- Choose solutions that prioritize clarity and longevity over novelty.

Recognition
- Users should eventually recognize a JiTpro screen without seeing the logo.
- The visual language itself should become part of the brand through repeated structure, rhythm, restraint, hierarchy, and construction-specific organization.

---

# 6. Inspiration and Non-Goals

Purpose: Record external references and explicitly define what JiTpro is not trying to become.

Decisions that belong in this section:
- Approved inspiration references
- What to borrow conceptually from each reference
- What not to borrow
- Explicit non-goals
- Competitive visual differentiation rules

Implementation notes:
- Inspiration is directional, not a license to copy.
- Each reference should be mapped to specific design qualities, not vague taste language.
- Current requested comparison references include Linear, Vercel, and Apple; final interpretation is TODO.

TODO:
- TODO: Define approved inspiration list.
- TODO: Define what JiTpro borrows from Linear, if anything.
- TODO: Define what JiTpro borrows from Vercel, if anything.
- TODO: Define what JiTpro borrows from Apple, if anything.
- TODO: Define explicit non-goals, e.g. what the system must not look or feel like.

Reference template:
- Reference: TODO
- Qualities to study: TODO
- Qualities to avoid: TODO
- JiTpro-specific adaptation: TODO

---

# 7. Typography

Purpose: Define the complete type system for marketing, application, dashboards, reports, documentation, data displays, and code.

Decisions that belong in this section:
- Font families
- Font loading strategy
- Heading system
- Body system
- Data typography
- Code typography
- Type scale
- Responsive typography
- Line-height rules
- Letter-spacing rules
- Font-weight rules
- Numeric/tabular rules
- Print typography rules

Implementation notes:
- Do not choose or implement fonts until approved.
- The type system must include web and print requirements.
- Data-heavy interfaces need rules for numbers, units, dates, statuses, table cells, and chart labels.
- Documentation needs readable long-form rules distinct from marketing hero copy.

Font Families
- Heading font: Inter Tight.
- Heading font purpose: headings, section titles, hero statements, major metrics, and large callouts.
- Body font: Inter.
- Body font purpose: paragraphs, navigation, forms, buttons, and general interface text.
- Data font: JetBrains Mono.
- Data font purpose: constraint IDs, procurement IDs, dates, lead times, durations, schedules, tables requiring numeric alignment, and technical data.

Typography Philosophy
- Typography is one of JiTpro’s primary brand assets.
- Typography must communicate professionalism, authority, precision, and calm confidence.
- Typography should establish hierarchy before color does. A page should remain understandable even when viewed without color.
- Typography should feel professional, measured, confident, intentional, architectural, and disciplined.
- Typography must never feel decorative, trendy, fashionable, or playful.

Font Weight Standards
- Inter Tight approved weights: 600, 700, 800.
- Inter approved weights: 400, 500, 600.
- JetBrains Mono approved weights: 400, 500.
- Limit the number of weights used throughout the product. Consistency is more important than variety.

Letter Spacing Standards
- Use additional tracking only where it improves hierarchy.
- Appropriate uses include section labels, navigation groups, and overlines.
- Avoid excessive tracking in paragraphs and headings.

Reading Experience
- Typography should reduce reading effort.
- Prefer shorter line lengths.
- Avoid walls of text.
- Use whitespace to improve comprehension.

Numeric Typography
- Whenever users compare numbers, dates, durations, procurement IDs, or schedules, use JetBrains Mono.
- Numeric information should feel engineered rather than decorative.

Guiding Principle
- Excellent typography should become invisible. Users should notice the information, not the font.
- Do not assign final pixel values in this chapter. Exact sizes must be defined later in implementation tokens.
- Font loading method, fallback stacks, and technical implementation remain implementation tasks that must preserve the approved family roles above.

## 7.1 Heading System

Purpose: Define all heading levels and display styles.

Decisions that belong here:
- Display heading levels
- Page heading levels
- Section heading levels
- Card heading levels
- Modal heading levels
- Report heading levels
- Documentation heading hierarchy

Implementation notes:
- Each heading token must include font family, size, weight, line-height, letter-spacing, text transform, margin behavior, and responsive behavior.

Heading hierarchy:
- Display XL: highest-impact typographic expression for rare, primary brand or product statements. Use for major hero statements and moments where one idea must dominate the page.
- Display L: large page-level statement for important marketing, product, dashboard, or report openings where Display XL would be excessive.
- Display M: supporting display style for major callouts, important metrics, and high-emphasis explanatory sections.
- Heading XL: primary page heading for standard application screens, documentation pages, reports, and internal dashboards.
- Heading L: section heading for major content areas within a page.
- Heading M: subsection heading for grouped content, panels, forms, and dashboard regions.
- Heading S: compact heading for cards, small panels, modal sections, table groups, and nested content.

Heading usage standards:
- Use Inter Tight for all heading levels.
- Use approved Inter Tight weights only: 600, 700, and 800.
- Headings should create structure before color is introduced.
- Headings should feel measured and authoritative, not decorative.
- Avoid excessive tracking in headings.
- Major metrics may use heading styles when they function as headline information.
- Print and report headings should preserve the same hierarchy, even when final print sizes differ from web sizes.

## 7.2 Body System

Purpose: Define readable text for paragraphs, labels, helper text, captions, and long-form content.

Decisions that belong here:
- Body size tokens
- Lead paragraph style
- Default paragraph style
- Small text style
- Caption style
- Label style
- Eyebrow style
- Helper text style
- Legal/disclaimer style

Implementation notes:
- Body typography must support marketing copy, form instructions, documentation, and dense app screens.

Body hierarchy:
- Body L: high-emphasis explanatory text, lead paragraphs, important product explanations, and report introductions.
- Body M: default paragraph and interface text for general reading, forms, navigation, tables with normal text, and application content.
- Body S: secondary supporting text, helper text, compact descriptions, metadata, dense interface content, and low-emphasis explanatory copy.
- Caption: short supporting text for images, charts, tables, footnotes, source notes, timestamps, and secondary metadata.
- Overline: short uppercase or label-style text used to introduce sections, navigation groups, categories, or structured page regions.

Body usage standards:
- Use Inter for body, navigation, forms, buttons, and general interface text.
- Use approved Inter weights only: 400, 500, and 600.
- Body text should reduce reading effort and avoid walls of text.
- Use shorter line lengths where possible.
- Use whitespace to improve comprehension.
- Labels, helper text, and error text should be clear and practical, not overly formal or promotional.
- Overlines may use additional tracking when it improves hierarchy.

## 7.3 Data Typography

Purpose: Define typography for data-dense UI such as dashboards, tables, charts, metrics, schedules, and printed reports.

Decisions that belong here:
- Metric values
- Units
- Dates
- Durations
- Currency
- Percentages
- Status text
- Table headers
- Table cells
- Chart labels
- Axis labels
- Callout numbers

Implementation notes:
- Consider tabular numbers where values must align.
- Data typography must prioritize scanning and accuracy.

Data typography standards:
- Data: use JetBrains Mono for constraint IDs, procurement IDs, dates, lead times, durations, schedules, and technical data.
- Metric values: use the appropriate heading level when the metric is a primary message; use JetBrains Mono when numeric comparison, precision, or alignment is more important than expressive hierarchy.
- Table headers: use clear, compact typography that prioritizes scanning and column recognition.
- Table cells: use Inter for normal prose values and JetBrains Mono for IDs, dates, durations, schedules, and aligned numeric values.
- Chart labels: use typography that supports interpretation without competing with the chart itself.
- Numeric alignment: whenever users compare numbers, dates, durations, procurement IDs, or schedules, use JetBrains Mono and align values predictably.
- Data typography should feel engineered rather than decorative.

## 7.4 Code Typography

Purpose: Define typography for code snippets, technical docs, configuration examples, API samples, and internal debugging surfaces.

Decisions that belong here:
- Code font family
- Inline code style
- Code block style
- Syntax highlighting style
- Terminal/output style

Implementation notes:
- Code typography must maintain contrast and legibility in both web documentation and printed exports.

Code typography standards:
- Code font: JetBrains Mono.
- Code: use for technical data, code snippets, configuration examples, API samples, terminal/output text, and internal debugging surfaces.
- Inline code should be visually distinct from body text without disrupting reading flow.
- Code blocks should prioritize legibility, line scanning, copyability, and clear separation from surrounding prose.
- Syntax highlighting may be used only when it improves comprehension. It should not create visual noise or rely on color alone.
- Use approved JetBrains Mono weights only: 400 and 500.

## 7.5 Scale

Purpose: Define the official type scale and naming model.

Decisions that belong here:
- Scale values
- Token names
- Mobile/desktop mapping
- Print mapping

Implementation notes:
- The scale should be tokenized before component implementation.

Official hierarchy names:
- Display XL
- Display L
- Display M
- Heading XL
- Heading L
- Heading M
- Heading S
- Body L
- Body M
- Body S
- Caption
- Overline
- Data
- Code

Scale standards:
- The typography scale is role-based. Each level exists because it serves a specific communication purpose.
- Do not assign pixel values in this chapter.
- Exact web, application, dashboard, documentation, and print sizes must be defined later as design tokens.
- Components must reference these named typography roles rather than inventing local type styles.

## 7.6 Responsive Typography

Purpose: Define how typography changes across screen sizes.

Decisions that belong here:
- Mobile type sizes
- Tablet type sizes
- Desktop type sizes
- Large-display type sizes
- Print equivalents
- Clamp/fluid rules, if any

Implementation notes:
- Avoid per-component subjective responsive overrides once this is approved.

Responsive typography standards:
- Typography must preserve hierarchy across viewport sizes.
- Display and heading styles may reduce in scale on smaller screens, but their relative importance must remain clear.
- Body text should remain comfortable to read on mobile, tablet, desktop, documentation, dashboard, and report contexts.
- Data typography must remain scannable and aligned across responsive table, schedule, chart, and dashboard layouts.
- Responsive changes should reduce reading effort, not merely fit text into available space.
- Avoid subjective per-component responsive overrides once final type tokens are approved.

---

## 7.7 APPROVED - Typography Standard

Status: APPROVED (2026-08-06). Binding on all production code.

### Typefaces

| Role | Family | Notes |
| --- | --- | --- |
| Headings | **Inter Tight** | The JiTpro heading face. Tight, editorial, confident at large sizes. Used for all headings and for short emphasis lines that behave as headings. |
| Body and UI | **Inter** | All body copy, labels, controls, and running text. |
| Data and annotation | **JetBrains Mono** | Reserved for technical annotation, eyebrows, small structural labels, and numeric/tabular data. Never for running prose. |

These are already declared in `src/index.css` under Tailwind's `@theme` block and are the approved values.

### Editorial hierarchy

- Hierarchy MUST be established by typography first - size, weight, and spacing - before color is introduced. A page must remain understandable in greyscale (see Section 7 preamble and 8.1).
- Each surface should have one clear primary statement. Competing headings at the same weight and scale are a hierarchy failure.
- Headings MUST use tight tracking at large sizes. Optical spacing loosens as type scales up; negative tracking compensates.
- A heading and the line that explains it SHOULD be set as one continuous thought - tight vertical spacing, differentiated size and weight - rather than two visually separate blocks.

### Sentence case, minimal uppercase

- Headings and body copy MUST be sentence case.
- Uppercase is permitted ONLY for small eyebrow and micro-label text, and MUST carry increased letter spacing when used.
- Uppercase MUST NOT be used for headings, body copy, buttons, or any text longer than a short phrase.
- Where uppercase is applied, it SHOULD be applied via CSS (`text-transform`) rather than authored in capitals, so assistive technology receives normally-cased text.

### Line length and readability

- Body copy MUST be constrained to a readable measure. The approved ceiling is **52-62 characters** per line; wider measures are a defect.
- Paragraphs SHOULD be short. Dense explanation blocks are contrary to the product's voice (Section 2).
- Body copy MUST be left-aligned. Long centered paragraphs are prohibited.
- Headlines SHOULD use balanced wrapping so no line is left with a single orphaned word.

**Centered captions - approved exception (2026-08-06).** Short figure captions and concise explanatory statements directly associated with a centered diagram or visualization MAY be centered, provided their measure is constrained. A caption belongs to its figure rather than to the reading column, and forcing it left would break the association the centering exists to express.

This exception is narrow:
- It applies ONLY to a caption bound to a specific centered visual, and only where that caption is short.
- It does NOT apply to ordinary body copy, lead paragraphs, or long explanatory prose, which remain left-aligned under the rule above.
- The constrained-measure ceiling in this section still applies. A centered caption is not exempt from 52-62 characters.

**Centered editorial statements - approved exception (2026-08-08).** A single short statement that behaves as a heading (see the typeface table above) MAY be set centered in its own full-width section when it serves as a deliberate page-level pause or transition between arguments. Set alone, the statement is not part of any section's reading column, so the left-alignment rule it would otherwise break does not describe it; the centering marks the moment as structural.

This exception is narrow:
- It applies ONLY to a single, short, heading-behaving statement standing alone in its own section - no eyebrow, no supporting body copy, no controls, no graphic.
- Its measure MUST remain tightly constrained (well inside the body-copy ceiling above) so it breaks as a few balanced lines, not a wide band of display type.
- It MUST be used sparingly. A page earns at most one or two such moments; a rhythm of centered bands is a different, unapproved design.
- **Eyebrow allowance (amended 2026-11-05, Decision Log).** The statement MAY carry one small eyebrow above it, in the standard eyebrow treatment, where the eyebrow names what kind of statement it is (first use: *What we believe* on the homepage). Nothing else is added: still no supporting body copy, no controls, no graphic. The flanked form below is not amended and keeps its no-eyebrow rule. **Supporting-copy allowance (amended 2026-11-06, Decision Log), homepage core belief only:** that band MAY carry one short supporting statement beneath the statement (the semibold heading-face statement register, centered, within the 52ch measure, prominent but secondary to the statement; revised 2026-11-06, the closing statement is withdrawn). No other centered editorial statement gains this allowance.
- Ordinary sections, headings, and body copy remain governed by the left-alignment rule above and the shared-left-edge rule in Section 48.6. This exception does not create any allowance for centered body copy.

**The flanked form - approved amendment (2026-08-27, superseding the framed form of the same day).** Such a statement MAY be set between two short horizontal rules - `rule - statement - rule`, all on one centre line - as the closing statement of a composition it belongs to.

- **The rules FRAME the statement; they MUST NOT enclose it.** No box, no rounded rectangle, no background fill, no shadow, no glow, no glass. A statement in a container reads as a UI component; the same statement between two rules reads as editorial. This is the whole point of the treatment, and it is the reason the earlier framed form was withdrawn.
- Exactly two rules, one each side, of equal length, `1px` tall, at a short fixed width that grows modestly with the breakpoint. They are decoration in the accessibility tree and MUST be `aria-hidden`.
- The rules MAY take `--jp-brand-amber` at a low opacity where the composition's existing accent already runs through them - they continue an accent, they do not open a new one (Section 48.7). They MUST NOT be the brightest amber on the surface.
- The statement MUST take an existing register on the surface, at **medium or semibold weight** - never the composition's heaviest weight - and MUST be dramatically smaller than the H1 it closes. It is the conclusion of the argument above it, not a second headline.
- It MUST hold ONE line at desktop widths and MUST wrap freely below them. **The group MUST be sized to its content** — `fit-content` capped at the available width — never to a fixed measure chosen to fit the sentence. A fixed measure has to be re-derived against real font metrics whenever the register changes, and one a few pixels short wraps the sentence mid-clause; sizing to content cannot be wrong and is never wider than the sentence needs.
- **Proportion is part of the treatment.** Within a composition the statement group sits at roughly three-quarters to five-sixths of the headline's visual width - the upper end where holding the sentence to one line requires it, and any accent stroke between them at roughly two-fifths to one-half. The nesting is what makes the composition read as composed rather than stacked.
- Everything the unframed exception forbids is still forbidden: no eyebrow, no supporting copy, no controls, no graphic, no divider.
- **At most one such statement per page.**
- **No current use (2026-08-27).** Its first and only use, the hero thesis, left the page with the refusal hero. The standard stands; a future use starts from this section, not from a copy of the retired markup.
- Where the statement sits inside a composition, it belongs to that composition's entrance state and MUST NOT be given a beat of its own (Section 46.3). A headline, its accent, and its statement are one idea.

### Whitespace

- Whitespace is a primary tool, not leftover space. Generous vertical rhythm between sections is required; crowding is treated as a defect.
- Type MUST NOT be tightened to fit more content into a viewport. Reduce the content instead.

### Publication titles set as headings (note, 2026-09-12)

A JiTpro publication's title (for example *What Will Stop Work Six Months From Now?*) is set as a site heading in **sentence case**, like every other heading under this section. The publication's own title-case presentation is reserved for the email that delivers it and for the document itself. No amendment to this section was required (Decision Log 2026-09-12).

---

# 8. Color System

Purpose: Define the complete color architecture for brand, surfaces, text, borders, semantic states, interaction, charts, accessibility, and print.

Decisions that belong in this section:
- Brand colors
- Surface colors
- Semantic colors
- Text hierarchy
- Border hierarchy
- Interactive colors
- Chart colors
- Print-safe colors
- Accessibility contrast requirements
- Dark/light theme policy

Implementation notes:
- Do not choose colors until approved.
- Every color must become a named token with usage rules.
- Color names should describe role, not raw appearance, unless defining brand primitives.
- Avoid using arbitrary one-off hex values after the system is approved.

Color system philosophy:
- The JiTpro color system is intentionally restrained. Color exists to communicate meaning; it does not exist for decoration.
- Whenever possible, hierarchy should be established using typography, spacing, alignment, and contrast before introducing color.
- The interface should remain understandable even if most colors were removed.
- JiTpro uses a disciplined construction-inspired palette. The product should feel professional, stable, confident, architectural, calm, and deliberate.
- The interface should never feel colorful. Most of the interface should consist of neutral tones. Color should be reserved for information that deserves attention.

Primary color families:
- Deep Navy: represents foundation, trust, stability, and professionalism.
- Slate: represents information, structure, organization, and hierarchy.
- White: represents readability, clarity, negative space, and focus.
- Amber: represents attention, important information, priority, decision points, and current focus.
- Red: represents immediate action required, critical issues, schedule impact, risk, failure, and escalation.

Visual balance standard:
- Approximately 90–95% of the interface should consist of Deep Navy, Slate, and White.
- Only a very small percentage of the interface should use Amber or Red.
- This restraint increases visual clarity and preserves the meaning of attention colors.

Construction philosophy:
- Construction projects are mostly stable. Only a few items require attention.
- The interface should visually reflect that reality: most information should appear neutral, and only exceptions should attract attention.

Future token standard:
- This chapter defines semantic meaning only.
- Specific hex values, CSS variables, Tailwind tokens, and implementation details will be documented later.
- Implementation follows philosophy.

## 8.1 Brand Colors

Purpose: Define official JiTpro brand colors and their allowed uses.

Decisions that belong here:
- Primary brand color
- Secondary brand color
- Accent color(s)
- Logo color rules
- Brand color do/don’t rules

Implementation notes:
- Brand colors should not automatically be used for every interaction state.

Primary brand palette:
- Deep Navy is the foundation color family. It is used for primary backgrounds, navigation, hero sections, major containers, and primary actions.
- Slate is the structural information color family. It is used for cards, surfaces, borders, tables, supporting interface elements, body text, and secondary interface components.
- White is the clarity color family. It is used for primary text, light surfaces, contrast, and whitespace.
- Amber is the attention color family. Amber is not simply an accent color; amber communicates “Look here.” It should be used sparingly for important information, priority, decision points, and current focus. Its effectiveness depends on restraint.
- Red is the escalation color family. It is used only for immediate action required, critical issues, schedule impact, risk, failure, and escalation. Red should never be decorative.

Brand color exclusions:
- Emerald, teal, mint, lime, purple, pink, neon colors, and bright cyan are intentionally excluded from the JiTpro brand identity.
- These colors may only appear if absolutely required for third-party integrations or data visualization.
- Excluded colors should never become part of the JiTpro visual identity.

Brand consistency rules:
- Avoid introducing additional accent colors.
- Avoid rainbow dashboards.
- Avoid decorative gradients.
- Avoid colorful cards.
- Avoid multiple competing accent colors.
- The JiTpro palette should become immediately recognizable through restraint and consistency.

### 8.1.1 APPROVED - Official Brand Colors

Status: APPROVED (2026-08-06). This subsection resolves the "Primary brand color" and "Accent color(s)" decisions listed above. It is binding.

**JiTpro Brand Amber - `#F59E0B`**

`#F59E0B` is the official primary brand color of JiTpro.

Evidence and provenance:
- The value is taken from the JiTpro logo artwork itself, not chosen independently. `public/assets/logo/JiTpro_Amber.svg` renders the mark in `fill="#f59e0b"` against a `#1e293b` wordmark, and `src/components/JiTproWordmark.tsx` uses the same value.
- It is already the dominant amber across the codebase by a wide margin, which makes it the lowest-risk canonical choice.
- It corresponds to Tailwind's `amber-500`, but Tailwind's name is an implementation coincidence, not the authority. The authority is this section.

Brand Amber MUST be used for:
- the logo
- primary call-to-action buttons
- hero eyebrow text
- hero emphasis typography
- timeline structure and static timeline elements
- icons that carry meaning
- links and primary accents

Brand Amber rules:
- Brand Amber is the resting, static identity color. It is what JiTpro looks like when nothing is happening.
- Brand Amber MUST NOT be applied to every interactive element. Its meaning depends on scarcity (see 8.6 and 8.1).
- Brand Amber MUST be referenced through the approved token (Section 8.8), never as a literal.

**JiTpro Active Amber - `#FDE68A`**

`#FDE68A` is the official illuminated/active amber.

Active Amber MUST be used only when an interface element is genuinely active:
- a moving timeline indicator or arrow
- the milestone a moving indicator has currently reached
- an active glow or illuminated state
- animation emphasis that marks "this, right now"
- an interactive control while it is being hovered, pressed, or otherwise engaged (approved 2026-08-06)

Active Amber rules:
- Active Amber MUST NEVER be used as a static brand color. It has no meaning at rest; it exists to distinguish the active element from the brand-colored elements around it.
- If Active Amber appears on a page with no animation and no active state, that is a defect.
- Active Amber MUST be referenced through the approved token (Section 8.8), never as a literal.

**Interactive active states - approved 2026-08-06.** Hover, press, and equivalent engaged states on a control are genuine active states and MAY use Active Amber. A primary action at rest is Brand Amber; the same action under the pointer is Active Amber. This is consistent with the rule above rather than an exception to it: the prohibition is on Active Amber as a *static* color, and a hover is by definition not static.

The corollary matters as much as the permission: where Active Amber expresses the hover, it IS the hover. Section 48.1 permits one hover gesture, and a color change to Active Amber consumes it. Lift, shadow, glow, and icon movement MUST NOT be layered on top of it.

Note also that an amber focus outline on an amber control is low-contrast against the control it is meant to mark. Keyboard focus on amber controls uses `--jp-text-primary` (Section 48.1).

Why two ambers and not one:
- A single amber cannot express both "this is JiTpro" and "this is happening now." The active element must read as brighter than the brand-colored structure it moves across, or the animation stops communicating.
- Two approved values is the minimum that preserves that distinction. Additional amber steps are NOT approved and MUST NOT be introduced without a Decision Log entry (Section 49).

## 8.2 Surface Colors

Purpose: Define backgrounds and elevation surfaces across marketing, app, dashboards, reports, and docs.

Decisions that belong here:
- Page backgrounds
- Section backgrounds
- Card backgrounds
- Elevated surfaces
- Overlay surfaces
- Disabled surfaces
- Print backgrounds

Implementation notes:
- Surface tokens must support dark and light contexts if both are approved.

Surface color standards:
- Deep Navy is the primary dark foundation for major backgrounds, navigation, hero sections, and large containers.
- Slate is the primary structural surface family for cards, tables, secondary panels, supporting interface elements, and organized information regions.
- White is used for readability, light surfaces, negative space, contrast, and focus.
- Surfaces should remain primarily neutral. They should not become vehicles for decorative color.
- Elevated surfaces should use neutral contrast and disciplined hierarchy before relying on accent color.
- Printed reports and documentation should preserve the same semantic discipline: neutral foundations first, attention colors only where meaning requires them.

Surface restraint rules:
- Do not create colorful card systems for visual variety.
- Do not use gradients as a substitute for hierarchy.
- Do not use accent surfaces unless the content deserves attention.
- Most surfaces should support comprehension quietly rather than compete for attention.

## 8.3 Semantic Colors

Purpose: Define status and feedback colors.

Decisions that belong here:
- Success
- Warning
- Danger/error
- Info
- Neutral
- Critical/escalated risk
- Pending
- Blocked
- Approved
- Disabled

Implementation notes:
- Semantic colors require foreground, background, border, and icon tokens.
- Semantic meaning must remain stable across surfaces.

Semantic color language:
- Deep Navy means foundation.
- Slate means information.
- White means readability.
- Amber means needs attention.
- Red means immediate action required.

Success / completed / verified:
- Green is reserved only for successfully resolved, completed, or verified states.
- Green must never be used as a branding color.
- Green must never be used as a general accent color.

Information / external / neutral reference:
- Blue is reserved only for informational states, external systems, and neutral references.
- Blue must never be used as a primary branding color.

Warning and attention:
- Amber communicates that something deserves attention, priority, current focus, or a decision point.
- Amber should not be used merely to make an element feel branded.

Danger, critical, and escalation:
- Red communicates immediate action required, critical issue, schedule impact, risk, failure, or escalation.
- Red should never be decorative.

Semantic discipline:
- Every color must communicate meaning.
- If a designer wants to introduce a new color, they must first answer: “What does this color communicate?”
- If the answer is simply “It looks good,” the color should not be added.

### 8.3.1 APPROVED - Success

Status: APPROVED (2026-08-07). Binding on all production code.

**JiTpro Success Green - `#059669`**, exposed as `--jp-success` (Section 8.8).

Success Green means exactly one thing: **this required step has been successfully completed.** It is a statement of fact about work that is finished, not a mood.

Approved uses:
- completed timeline milestones and their labels
- completed timeline structure - the portion of a sequence already executed
- confirmed successful outcome states

Prohibited uses:
- primary or secondary call-to-action buttons
- headings, body copy, or general accents
- hover, focus, or any other interaction state
- navigation
- icons that do not denote completion
- decoration, or any use whose justification is that the result "looks positive"

**Success Green MUST NOT become a second general JiTpro accent.** Its meaning survives only while it is rare and literal. A surface showing green that a reader cannot point at and say "that finished" is a defect.

**Relationship to the Section 8.1 exclusions.** Section 8.1 excludes emerald from the JiTpro *brand identity* - the colors that say "this is JiTpro". That exclusion stands and is unchanged: Success Green is never a brand color, never an identity color, and never an accent. This token lives under Section 8.3, which has always reserved green for "successfully resolved, completed, or verified" states and has always forbidden it as a branding or general accent color. Identity and state are different jobs; this is state.

**Why this value.** `#059669` measures approximately 5.4:1 against `--jp-background` - clear of the WCAG AA minimum of 4.5:1 at body sizes - and reads as unmistakably green rather than teal. It is materially darker and less saturated than a lime, a fluorescent, or a traffic-light green; the register is a considered emerald, not a safety vest.

Refined from `#10B981` on 2026-08-07. That value was electric against the dark canvas and competed with the amber system for attention, which is the opposite of what a completed state should do. Amber is what is happening now and has first call on the eye; completed work should settle behind it rather than announce itself.

**Color alone MUST NOT carry the meaning** (Section 8.7). Where Success Green marks completion, an accompanying label, state change, or text must carry the same information. Green reinforces a completed state that is already legible without it.

### The four-state color language

| State | Token | Means |
| --- | --- | --- |
| Not yet reached | `--jp-text-secondary`, `--jp-border` | Structure and work still ahead |
| Planned / required | `--jp-brand-amber` | JiTpro structure: what the plan requires |
| Happening now | `--jp-brand-amber-active` | The one element currently active |
| Successfully completed | `--jp-success` | Work confirmed finished |

The active element and the completed trail behind it MUST remain distinguishable. A marker moving through a sequence stays `--jp-brand-amber-active` for the whole of its travel; it does not adopt the completion color of the ground it has covered. Planning and directional graphics stay in the amber system and MUST NOT turn green - the plan is not the execution.

## 8.4 Text Hierarchy

Purpose: Define text color roles by emphasis and background context.

Decisions that belong here:
- Primary text
- Secondary text
- Muted text
- Disabled text
- Inverse text
- Link text
- Accent text
- Error text
- Data text

Implementation notes:
- Each text token must list valid surface backgrounds.

Text hierarchy standards:
- Text hierarchy should be established first through typography, spacing, alignment, and contrast.
- Text color should reinforce hierarchy, not create hierarchy alone.
- Primary text must provide maximum readability against its surface.
- Secondary text should support scanning and comprehension without competing with primary information.
- Muted text should be used for reference information, metadata, timestamps, supporting labels, and non-primary explanations.
- Disabled text should clearly indicate unavailable or inactive states without being mistaken for normal muted content.
- Inverse text must remain readable on Deep Navy, Slate, and any approved dark surface.
- Link and action text should communicate interactivity clearly, but should not overuse Amber unless the action deserves attention.
- Error text must use the Red semantic family only when immediate correction, risk, or failure needs to be communicated.

## 8.5 Border Hierarchy

Purpose: Define border colors by importance, elevation, and state.

Decisions that belong here:
- Subtle border
- Default border
- Strong border
- Interactive border
- Focus border
- Error border
- Selected border
- Divider color

Implementation notes:
- Borders must be defined separately for dark/light surfaces if both exist.

Border hierarchy standards:
- Borders should primarily use neutral tones derived from Slate and related structural surfaces.
- Subtle borders separate information without drawing attention.
- Default borders define cards, tables, forms, containers, and structured regions.
- Strong borders are reserved for active, selected, important, or high-contrast structural needs.
- Focus borders must be visible, accessible, and consistent across keyboard and pointer interaction.
- Error borders must use the Red semantic family only when correction, failure, risk, or immediate action is required.
- Selected borders may use Amber only when the selection represents focus, priority, or a meaningful current decision point.
- Dividers should support structure and scanning without making the interface feel busy.

## 8.6 Interactive Colors

Purpose: Define hover, active, pressed, selected, focus, disabled, and visited states.

Decisions that belong here:
- Primary action states
- Secondary action states
- Ghost action states
- Link states
- Nav item states
- Form control states
- Row/item selection states

Implementation notes:
- Interactive colors must include keyboard focus states, not only mouse hover.

Interactive color standards:
- Interactive states must be predictable, restrained, and meaningful.
- Primary actions may use Deep Navy or Amber depending on whether the action represents foundation/control or priority/attention.
- Amber must not be applied to every interactive element. Its meaning depends on scarcity.
- Secondary actions should rely primarily on Slate, White, border contrast, and clear typography.
- Ghost actions should remain quiet and should not compete with primary actions.
- Selected states should communicate current focus or active context without creating unnecessary visual noise.
- Disabled states should be neutral and clearly inactive.
- Hover, active, pressed, selected, focus, and disabled states must preserve semantic meaning and accessibility.
- Keyboard focus states are required wherever pointer hover states exist.

## 8.7 Accessibility Rules

Purpose: Define minimum color-contrast and non-color-cue requirements.

Decisions that belong here:
- Minimum contrast for body text
- Minimum contrast for large text
- Minimum contrast for UI controls
- Minimum contrast for charts
- Rules for color-blind-safe semantics
- Print contrast rules

Implementation notes:
- WCAG AA should be the minimum unless JiTpro approves a stricter rule.
- Status must not rely on color alone; include icon, label, shape, or text where needed.

Accessibility rules:
- Color must never be the only way information is communicated.
- The interface should remain understandable even if most colors were removed.
- Status, risk, warnings, errors, success, and informational states must include non-color cues such as text, iconography, shape, placement, label, or pattern where appropriate.
- Body text, large text, controls, charts, tables, and printed reports must meet the approved accessibility standard once specific color values are assigned.
- Charts and dashboards must avoid rainbow color systems and must not rely on color alone to explain meaning.
- Printed reports must preserve legibility and semantic meaning in grayscale or limited-color output where possible.

Guiding principle:
- The JiTpro interface should never become more colorful than the construction project it represents.
- Color should communicate priority, never decoration.

---

## 8.8 Approved Design Tokens

Status: APPROVED (2026-08-06). This subsection resolves the token questions raised in Sections 38 and 39 for color, including the neutral token values approved on the same date. It is binding.

Purpose: Give every approved color exactly one name, so that a color can be changed in one place and so that no component ever has to decide what "the amber" is.

Naming convention: `--jp-<role>` or `--jp-<family>-<role>`. Token names describe role, not appearance, with the single exception of the two brand primitives, which are named for the brand itself.

### Approved color tokens

**Brand colors** (approved 2026-08-06, Section 8.1.1):

| Token | Value | Status | Purpose |
| --- | --- | --- | --- |
| `--jp-brand-amber` | `#F59E0B` | APPROVED | Primary JiTpro brand color. Logo, CTA buttons, hero eyebrow, hero emphasis, timeline, icons, links, primary accents. |
| `--jp-brand-amber-active` | `#FDE68A` | APPROVED | Animated emphasis only. Active timeline arrow, active nodes, illuminated highlights, animated emphasis. Never static. |

There is no approved third amber. Any additional amber step requires approval through Section 49 before use.

**Amber on light surfaces (approved 2026-08-25).** The existing JiTpro amber tokens MUST NOT be used for text, informational linework, controls, or other contrast-dependent elements on light surfaces where they fail the applicable contrast requirement. Light-surface hierarchy defaults to approved ink values. Decorative use of brand amber remains governed separately by accessibility and the existing color-scarcity rules (Sections 8.7, 48.7).

Measured against `--jp-surface-light` (`#F1F5F9`): `--jp-brand-amber` is **1.96:1** and `--jp-brand-amber-active` is **1.14:1** — both below the 4.5:1 normal-text minimum and below the 3:1 minimum for user-interface components and meaningful graphics. This is a measurement, not a stylistic position: it states where these two values may be relied upon to carry information, and it creates no rule about amber's role elsewhere.

**Semantic state colors** (approved 2026-08-07, Section 8.3.1):

| Token | Value | Status | Purpose |
| --- | --- | --- | --- |
| `--jp-success` | `#059669` | APPROVED | Confirmed successful completion. Completed milestones, completed sequence structure, confirmed successful outcomes. Never a brand color, never an accent, never an interaction state. |

`--jp-success` is a **state** token, not a brand token. The restrictions in Section 8.3.1 are part of its definition: a use outside them is a defect even where the result looks agreeable.

**Neutral colors** (approved 2026-08-06):

| Token | Value | Status | Purpose |
| --- | --- | --- | --- |
| `--jp-background` | `#020617` | APPROVED | Primary page/background canvas. The deepest, least-lit surface in the hierarchy. |
| `--jp-surface` | `#0F172A` | APPROVED | Secondary elevated or alternating dark surface. Cards, panels, sheets, alternating sections. |
| `--jp-text-primary` | `#F1F5F9` | APPROVED | Primary headings and highest-emphasis text. |
| `--jp-text-secondary` | `#CBD5E1` | APPROVED | Normal body copy and secondary readable text. |
| `--jp-text-muted` | `#94A3B8` | APPROVED | Captions, supporting information, tertiary labels, and intentionally de-emphasized text. |
| `--jp-border` | `#94A3B8` | APPROVED | Structural separation: borders, hairlines, connector lines, dividers, table rules, input outlines, and similar neutral UI structure. Opacity varies by semantic use. |

**Light surface** (approved 2026-08-25):

| Token | Value | Status | Purpose |
| --- | --- | --- | --- |
| `--jp-surface-light` | `#F1F5F9` | APPROVED | The approved light ground, for sections whose narrative job is explanation, document logic, evidence, or detailed reading. Not a page canvas: the page canvas remains `--jp-background`. |
| `--jp-ink-secondary` | `#475569` | APPROVED | Body copy and structural linework **on `--jp-surface-light`**. 6.92:1 against that ground. |
| `--jp-surface-white` | `#FFFFFF` | APPROVED (2026-11-05) | The raised light ground: a section zone set one step lighter than `--jp-surface-light` to separate it within a light act. Never a page canvas and never a card fill. The light ramp applies unchanged and passes on it: `var(--jp-background)` 20.17:1, `--jp-ink-secondary` 7.58:1, `--jp-ink-secondary` at 85% 5.16:1. Amber is bounded on it exactly as on `--jp-surface-light`. First approved use: the *Know what's coming* process zone. |

Only one new value is introduced. The rest of the light ramp is reuse, and MUST be expressed that way rather than as new tokens:

| Role on `--jp-surface-light` | Expression | Ratio |
| --- | --- | --- |
| Primary / load-bearing ink | `var(--jp-background)` | 18.41:1 |
| Body copy, structure | `var(--jp-ink-secondary)` | 6.92:1 |
| Muted labels, captions, provenance | `--jp-ink-secondary` at **85% minimum** | 4.79:1 |
| Hairlines, dividers, non-text rules | `--jp-ink-secondary` at low opacity | not contrast-bound |

**The 85% floor is normative.** `--jp-ink-secondary` below 85% opacity measures under 4.5:1 against `--jp-surface-light` (the exact floor is 83%) and MUST NOT carry normal-size text. A third light-surface gray was evaluated and rejected: the muted level is reachable by opacity, and two more near-identical grays is the failure this system exists to prevent (Section 8.8, 2026-08-06).

`--jp-surface-light` and `--jp-background` are a deliberate role inversion — the light ground is the primary-text value, and the ink on it is the page canvas value — so the palette gains a surface without gaining a hue.

**Reserved, value deferred:**

| Token | Value | Status | Purpose |
| --- | --- | --- | --- |
| `--jp-shadow` | DEFERRED | Name approved, value deliberately withheld | Elevation shadow color. Depth is expressed through this token, never through a decorative glow. |

### Why three text levels, not two

The neutral set was originally reserved with two text tokens. Implementation review established that three are required.

`--jp-text-primary`, `--jp-text-secondary`, and `--jp-text-muted` represent three genuinely different semantic levels: what the reader must read first, what they read as the substance, and what supports without competing. Collapsing any two of them would remove a distinction the design actually uses.

The muted level in particular cannot be synthesised from the secondary level. `#CBD5E1` reduced in opacity over `#020617` does not reproduce `#94A3B8` - the red channel converges but the blue channel remains materially short, because `#94A3B8` is the bluer color, not merely the dimmer one. Approximating it with opacity would have produced a visibly different value while pretending to be the same one. `--jp-text-muted` is therefore an APPROVED addition to the reserved set rather than an opacity treatment of an existing token.

### Why `--jp-text-primary` consolidates two existing values

Production code previously used two near-identical values for high-emphasis text: `#F8FAFC` for section headings and `#F1F5F9` for sub-headings. They differ by roughly seven points per channel and by 0.87 in contrast ratio against `#020617` - a distinction no reader can perceive, and precisely the "multiple nearly identical grays" this system exists to prevent.

Both consolidate into `--jp-text-primary` at `#F1F5F9`, which is the more widely used of the two across the codebase. Emphasis above body copy is carried by type scale and weight, not by a second, imperceptibly brighter white (Section 47.3).

### Why `--jp-border` shares a value with `--jp-text-muted`

`--jp-border` and `--jp-text-muted` intentionally share the base value `#94A3B8`. They remain separate tokens because they express separate intents: one is text a reader consumes, the other is structure a reader should barely notice. A future decision may move one without the other, and the token names preserve that option.

Sharing a base value is deliberate rather than accidental. Neutral structure and de-emphasized text belong to the same tonal family; expressing them as two different grays would fragment the palette for no communicative gain.

Opacity rules for `--jp-border`:
- Opacity MAY vary according to semantic use. A section divider and a diagram hairline legitimately sit at different weights.
- Varying opacity is NOT permission to create unlimited new visual treatments. Existing approved opacity treatments SHOULD be reused wherever practical.
- If recurring opacity levels prove stable enough to warrant naming, semantic opacity or border tokens MUST be created through the normal approval process in Section 49 - not invented per component.

**Approved subtle divider treatment (2026-08-06).** Section dividers and structural hairlines use `--jp-border` at **12%** opacity. This is a single approved level, replacing the ad-hoc pair of white-alpha treatments previously in production; two divider weights two points apart are indistinguishable and fragment the palette for no communicative gain.

This does NOT make 12% mandatory for every use of `--jp-border`. Functional hairlines inside a diagram - connector lines, leader lines, gradient rules that must remain readable against the surface - MAY retain the perceptual weight their function requires. What is fixed is the hue: the base color MUST always be `--jp-border`, never white, never a slate utility, never a literal.

No opacity tokens are created at this time. If further recurring levels prove stable, they are formalized through Section 49.

### Resolution of `slate-500` and `slate-200` (2026-08-06)

Production contained two neutrals with no approved token: `#64748B` (`slate-500`) for de-emphasized sequence numbers and a quiet indicator, and `#E2E8F0` (`slate-200`) for one control's hover.

Neither becomes a token. The approved three-level text set already spans the required range, and neither use expresses a semantic level that set does not cover:
- Text quieter than muted is `--jp-text-muted` at reduced opacity, per Section 45.4.
- A control resting at `--jp-text-muted` brightens to `--jp-text-primary` on hover. Moving up the existing scale is the approved way to express engagement in neutral text.

Adding two more grays adjacent to values already approved is precisely the failure Section 8 exists to prevent.

### Why `--jp-shadow` remains deferred

No neutral shadow requirement currently exists. Review of the marketing homepage found no neutral shadow of any kind; the only shadows present are amber emphasis glows that derive from `--jp-brand-amber`.

A token is not approved merely because its name was reserved. `--jp-shadow` stays reserved with no value until a real elevation requirement appears, and MUST NOT be referenced in production until then.

### Rules for reserved tokens

- A reserved token MUST NOT be referenced in production code until its value is APPROVED and recorded in the Decision Log.
- Introducing a value for a reserved token is a design-system change and follows Section 49, not a component-level decision.
- The reserved list is deliberately small. Additional tokens require a Decision Log entry; the system should not grow a token per component.

### Recorded migration decision: hero cool depth wash

**Final decision (2026-08-06): the bespoke cool hero wash is REMOVED, not tokenized and not replaced.**

The marketing hero contained the bespoke literal `rgba(51, 74, 120, 0.30)`, used as a cool depth wash behind the hero content. It corresponded to no approved token and to no Tailwind slate - it is bluer than `slate-700` `#334155`.

Standing rejections, unchanged:
- This value does **not** become a component-specific design token. `--jp-hero-glow-cool`, or any equivalent hero-scoped color token, is explicitly rejected. Component-scoped color tokens defeat the purpose of the token layer: they turn a shared system into a collection of private palettes, and each one makes the next one easier to justify.
- `slate-700` `#334155` is **not** added to the neutral token set for this purpose.

Superseded: an earlier decision on the same date required the literal to be replaced with a `#334155`-derived opacity treatment. Implementation review established that no conformant expression of that treatment existed - a raw `rgba()` and a `slate-700` utility are both prohibited by Section 8.9, and a token was not wanted. A migration obligation with no conformant implementation is not a decision that can stand.

The wash is decorative. It carries no information, and Section 47.4 answers the question directly: what is lost by removing it is that the hero looks plainer, which is the goal. A decorative effect is not grounds for expanding the token system.

If a recurring cool-lighting role later emerges across multiple JiTpro interfaces, it MAY be evaluated as a semantic design token at that time, through Section 49. One hero is not a role.

### Token expansion, deferred

Motion, spacing, radius, elevation, typography, and breakpoint tokens are not yet approved. Sections 11, 12, 13, 15, and 35 remain the place those decisions live. Until they are approved, existing implementation values remain in force but MUST NOT be treated as canonical (Appendix C).

---

## 8.9 Color Governance

Status: APPROVED (2026-08-06). Binding on all production code.

Purpose: Prevent the failure this section exists because of - the same color arriving in five slightly different values because each component chose independently.

### Prohibited in production components

Production components MUST NOT reference:
- `amber-300`, `amber-400`, `amber-500`, or any other Tailwind amber utility
- raw hexadecimal color values (`#F59E0B`, `#fbbf24`, `#fde68a`, and so on)
- RGBA amber literals (`rgba(245, 158, 11, 0.5)` and similar)
- arbitrary-value Tailwind color syntax carrying a literal, such as `bg-[#F59E0B]` or `text-[rgba(245,158,11,0.8)]`

This prohibition applies equally to:
- Tailwind class names
- inline `style` objects
- SVG presentation attributes (`fill`, `stroke`, `stop-color`)
- CSS-in-JS and template literals
- generated or injected stylesheets

SVG is called out explicitly because it is where the drift historically began: SVG attributes cannot accept Tailwind class names, so authors reached for hex literals and the palette split.

### Required instead

- All components MUST reference the approved tokens from Section 8.8.
- Opacity variation on an approved color is permitted and is the correct way to express a lighter or dimmer treatment. It MUST be expressed against the token, not against a new literal.
- If a design calls for a color that no approved token expresses, the correct response is to stop and follow Section 49 - not to pick a near-miss value.

### Approval requirement

- All future brand colors MUST be approved inside this Design System, recorded in the Decision Log, and given a token, before any production use.
- A color that appears in a component but not in Section 8.8 is a defect, regardless of how good it looks.
- A Tailwind utility currently used in the website is not automatically an official token (Appendix C).

### Enforcement

- Code review MUST reject color literals in components.
- A lint rule forbidding hex and Tailwind color utilities in `src/components/**` and `src/pages/**` SHOULD be added; until it exists, review is the control.
- The audit at `docs/design/current-theme-audit.md` is evidence of the pre-governance state. It is a record of what exists, not a list of what is permitted.

---

# 9. Grid System

Purpose: Define the layout grid used to align content across surfaces.

Decisions that belong in this section:
- Column counts by breakpoint
- Gutters
- Margins
- Max widths
- Nested grid rules
- Dashboard grid rules
- Print/report grid rules

Implementation notes:
- Grid rules must cover marketing pages, application screens, dashboards, and reports separately if needed.
- Use token names and implementation mapping later; do not hard-code values here until approved.

Grid system philosophy:
- The JiTpro grid system exists to create consistency, predictability, and visual discipline.
- Users should never consciously notice the grid. They should simply feel that every page is organized.
- Every page should feel engineered rather than assembled.
- Alignment must be intentional. Content should naturally fall into predictable columns and rows.
- The grid should reduce cognitive effort by making page structure immediately understandable.

Marketing container strategy:
- The marketing website should use a consistent page container so pages feel related to one another.
- Container widths should not change arbitrarily between sections.
- Wider containers may be used for structured visual systems, feature grids, timelines, and comparison layouts when additional width improves comprehension.
- Narrower containers should be used only when doing so improves readability, focus, or hierarchy.
- Reading comfort takes priority over filling horizontal space.

Content-width standards:
- Readable text should never stretch excessively across large monitors.
- Long-form copy, educational explanations, and narrative sections should maintain comfortable line lengths.
- Large displays should provide stronger composition, not longer lines.
- Layouts must scale gracefully across desktop, tablet, and mobile devices without sacrificing clarity, readability, or hierarchy.

Marketing column model:
- Single-column layouts are preferred for storytelling, founder perspective, primary explanations, and sections where one message must be understood before the next.
- Two-column layouts are preferred for explanation, contrast, problem/response structures, text paired with visual support, and educational sections where one idea benefits from a supporting panel.
- Three-column layouts are preferred for feature comparisons, role comparisons, grouped benefits, structured lists, and parallel concepts of equal weight.
- Avoid unnecessary column complexity. If fewer columns communicate more clearly, use fewer columns.
- Avoid complex asymmetrical layouts unless they improve hierarchy and comprehension.

Alignment standards:
- Strong alignment is one of JiTpro’s defining visual characteristics.
- Margins, cards, buttons, text blocks, visual panels, and repeated section elements should align consistently.
- The interface should communicate order before the user reads a single word.
- Misalignment may be used only when it has a clear hierarchy or storytelling purpose.
- Random offsets, one-off indents, and decorative staggered layouts should be avoided.

Whitespace and grouping:
- Whitespace should be used to group related information and separate distinct ideas.
- Groups should be obvious without relying on borders.
- Spacing should communicate relationships naturally: items that belong together should feel connected, and separate ideas should have enough breathing room to be understood as separate.
- Whitespace should make the page easier to scan, not merely more spacious.

Future grid expansion:
- Application, dashboard, documentation, and printed report grids must be defined separately when those surfaces are formally specified.
- Breakpoint values, column counts by breakpoint, gutters, margins, and max-width tokens remain implementation-token decisions and must be documented later before being treated as final values.

---

# 10. Layout Rules

Purpose: Define how pages and screens are composed.

Decisions that belong in this section:
- Page shell rules
- Header/nav placement
- Footer placement
- Sidebar rules
- Content area rules
- Section stacking rules
- Empty margin rules
- Above-the-fold rules
- Print/report layout rules

Implementation notes:
- Layout rules should prevent each page from inventing its own composition system.
- Rules should describe hierarchy, alignment, and density, not just dimensions.

Marketing page layout model:
- Every marketing page should guide users through a clear story.
- Pages should never feel like collections of unrelated sections.
- Every section should naturally lead into the next.
- The page structure should create recognition before explanation and explanation before action.

Recommended marketing flow:
1. Problem
2. Recognition
3. Education
4. JiTpro Framework
5. Solution
6. Proof
7. Call to Action

Flow standards:
- The recommended flow is a default model, not a rigid template. Pages may adjust the sequence when the page purpose requires it, but the reading path must remain clear.
- A page should establish the problem before asking users to understand JiTpro’s framework.
- Education should make the user feel understood before product language becomes prominent.
- Proof should support the argument already developed by the page, not interrupt it.
- Calls to action should feel like a natural next step, not a visual interruption.

Reading-flow standards:
- Users should never wonder, “What am I supposed to read next?”
- Layouts should naturally guide the eye from primary message to supporting detail to next action.
- Typography, spacing, and hierarchy should guide reading flow before color, graphics, or animation are introduced.
- The most important idea in a section should be visually obvious without requiring the user to read everything first.

Section design standards:
- Every section should have one clear purpose.
- Avoid sections that attempt to communicate multiple unrelated ideas.
- One section should communicate one primary message.
- Supporting copy, cards, visuals, and actions within a section must reinforce that primary message.
- If a section requires several unrelated explanations, split it into separate sections or simplify the message.

Visual-balance standards:
- Every page should feel balanced from top to bottom.
- Avoid stacking multiple visually heavy sections together.
- Alternate information density with breathing room to create a comfortable reading rhythm.
- Dense informational sections should be followed by simpler, more focused sections when possible.
- Large visuals, complex diagrams, dense card grids, and heavy copy blocks should be distributed intentionally across the page.

Responsive layout philosophy:
- Responsive design is not simply shrinking desktop layouts.
- Each breakpoint must preserve clarity, readability, and hierarchy.
- Mobile users should receive the same message, not a reduced experience.
- Mobile layouts may simplify structure, reduce columns, reorder supporting visuals, or collapse secondary detail when doing so improves comprehension.
- Responsive changes should protect the story, hierarchy, and next action rather than merely fitting content into available space.

Header and section-header standards:
- Page headers should establish the primary page promise and orient the user immediately.
- Section headers should introduce one clear idea and prepare the user for the content that follows.
- Headings, supporting text, and visual content should work together as a single hierarchy.
- Headers should not be decorative labels. They should clarify the role of the page or section.

Guiding principle:
- If users notice the layout, it is probably trying too hard.
- Great layouts become invisible. They help users understand information more easily without calling attention to themselves.
- Layout exists to create clarity, rhythm, and trust.

Future layout expansion:
- SaaS application shell, internal dashboard shell, documentation layout, and printed report layout rules remain future decisions and must be defined in their respective chapters before implementation.

---

# 11. Spacing System

Purpose: Define spacing tokens and how they are applied to components, sections, page shells, reports, and data-dense screens.

Decisions that belong in this section:
- Base spacing unit
- Spacing scale
- Inset spacing
- Stack spacing
- Inline spacing
- Section spacing
- Component spacing
- Dense-mode spacing
- Print spacing

Implementation notes:
- Spacing tokens must be named and mapped to Tailwind once approved.
- Components should use semantic spacing roles where possible.

Spacing philosophy:
- Spacing is one of JiTpro’s most important design tools.
- Spacing creates clarity, hierarchy, and calm.
- Spacing reduces cognitive load.
- Whitespace is not empty space. Whitespace is an active design element.
- JiTpro should feel calm. The interface should breathe. Users should never feel visually crowded.
- Generous spacing communicates confidence. Crowded interfaces communicate uncertainty.
- Whenever possible, increase clarity by adjusting spacing before introducing additional colors, borders, or visual elements.

Base spacing system:
- JiTpro follows an 8-point spacing system.
- All major spacing should be based on multiples of eight.
- Approved conceptual increments include 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, and 128.
- Smaller adjustments may use 4-point increments when necessary.
- Avoid arbitrary spacing values unless absolutely required.
- Consistency is more important than mathematical perfection.
- Exact Tailwind classes, CSS variables, and implementation tokens will be defined later.

Vertical rhythm:
- Pages should establish a predictable reading rhythm.
- Users should naturally understand where one section ends and another begins.
- Every page should feel composed rather than assembled.
- The vertical rhythm should remain consistent across the entire website and application.

Whitespace:
- Whitespace should be treated as content.
- Empty space improves comprehension.
- Do not fill empty space simply because it exists.
- A page with fewer elements often communicates more effectively.

Section spacing:
- Major sections should feel distinct.
- Each section should have enough breathing room to establish separation without feeling disconnected.
- Avoid stacking large sections too closely together.
- Section spacing should support a clear reading sequence and predictable page rhythm.

Card spacing:
- Cards should never feel cramped.
- Internal spacing should prioritize readability.
- Content should never touch card edges.
- Cards should appear comfortable rather than compressed.
- Card spacing should clarify the relationship between title, supporting text, actions, metadata, and nested content.

Form spacing:
- Forms should guide users naturally from one field to the next.
- Labels, inputs, validation messages, and helper text should maintain consistent vertical spacing.
- Forms should feel calm and approachable.
- Form spacing should make it obvious which label, helper text, validation message, and control belong together.

Table density:
- Tables are one of JiTpro’s primary interface elements.
- Tables should prioritize readability over maximum information density.
- Rows should be comfortably scannable.
- Columns should align cleanly.
- Whitespace should help users compare information quickly.
- Dense modes may exist only when they preserve scanning, alignment, and comprehension.

Dashboard density:
- Dashboards should avoid becoming visually noisy.
- Information should be grouped into logical clusters.
- Spacing should communicate relationships before borders do.
- The user should immediately understand how the dashboard is organized.

Alignment:
- Strong alignment creates trust.
- Elements should line up intentionally.
- Random offsets should be avoided.
- Consistent alignment communicates craftsmanship.

Consistency:
- Spacing decisions should never vary randomly between pages.
- Users should begin to recognize the spacing system without consciously noticing it.
- Consistency reduces cognitive effort.

Print spacing:
- Printed reports should preserve the same spacing philosophy as digital surfaces.
- Print layouts should use whitespace to improve comprehension, separate sections, and make tables easier to scan.
- Print density should not sacrifice clarity for the sake of fitting more information on a page.

Guiding principle:
- If a layout feels busy, first increase whitespace.
- If a layout feels confusing, first improve alignment.
- Spacing should solve problems before additional visual decoration is introduced.

---

# 12. Border Radius Standards

Purpose: Define shape language and radius tokens.

Decisions that belong in this section:
- Radius scale
- Which components use which radii
- Rounded vs square UI policy
- Pill/badge rules
- Report/print shape rules

Implementation notes:
- Radius should communicate hierarchy and brand personality consistently.
- Avoid one-off arbitrary radii after tokens are approved.

Border radius philosophy:
- Border radius should communicate refinement, not personality.
- JiTpro should avoid both sharp, mechanical interfaces and overly rounded consumer interfaces.
- The goal is quiet sophistication.
- Corners should feel intentional, balanced, and professionally resolved.
- Rounded corners may improve readability and visual comfort, but they should never become the primary visual feature of a component.

Shape character:
- JiTpro interfaces should remain calm, precise, and professional.
- Excessive rounding can make interfaces feel playful, casual, or consumer-oriented.
- Sharp corners can feel unnecessarily harsh, rigid, or mechanical.
- The system should remain between those extremes: refined enough to feel comfortable, structured enough to feel serious.

Consistency standards:
- Use a very small number of radius sizes throughout the product.
- Avoid introducing new radius values for individual components.
- Consistency is more important than variety.
- Users should subconsciously recognize the design language through repeated corner behavior.
- Similar components should use similar radius treatment unless hierarchy or function clearly requires a difference.

Component character standards:
- Buttons should be slightly rounded, professional, and confident. Button corners should support clickability without making the button feel soft or playful.
- Inputs should remain consistent with buttons so form elements feel related to actions and controls.
- Cards should use more generous rounding than buttons so grouped content feels comfortable and approachable without becoming decorative.
- Panels should remain consistent with cards when they serve a similar grouping function.
- Tables should use minimal rounding so data remains visually structured, precise, and easy to scan.
- Modals and overlays may use enough radius to feel elevated and finished, but should remain disciplined and consistent with the broader system.
- Badges and pills may use stronger rounding when their shape helps identify compact labels or statuses, but should not introduce a playful tone.

Visual discipline:
- Corners should support the interface. They should never become a design motif by themselves.
- Do not vary corner radius to create novelty between sections.
- Do not use exaggerated rounded containers as a substitute for hierarchy, spacing, or content organization.
- Do not mix sharp, medium, and highly rounded shapes arbitrarily on the same screen.

Future radius specification:
- Exact radius tokens, component mappings, and print/report shape rules remain future implementation decisions.
- Once approved, radius values should be tokenized and reused consistently across components.

---

# 13. Elevation and Shadows

Purpose: Define depth, layering, shadows, borders, and overlays.

Decisions that belong in this section:
- Elevation scale
- Shadow tokens
- Border-as-elevation rules
- Overlay/scrim rules
- Sticky/nav elevation
- Modal/dialog elevation
- Print equivalents

Implementation notes:
- Dark interfaces should often rely on borders and surface contrast rather than heavy shadows.
- Elevation should be meaningful, not decorative.

Elevation and shadow philosophy:
- Shadows should communicate depth, never decoration.
- JiTpro should rely primarily on spacing, contrast, alignment, and hierarchy before using shadows.
- Shadows should be subtle, functional, and disciplined.
- Most components should appear grounded rather than floating.
- Depth should be understated and should support comprehension.

Shadow usage standards:
- Shadows may be used to communicate elevation, layer separation, interactive affordance, modal hierarchy, focus, or temporary overlap.
- Shadows should not be used simply to create visual interest.
- Large floating shadows should be avoided.
- Shadow use should be rare enough that elevation retains meaning when it appears.
- If a border, surface contrast, or spacing can communicate the same relationship more clearly, prefer that approach before adding shadow.

Visual discipline:
- Avoid heavy shadows.
- Avoid blur-heavy shadows.
- Avoid decorative glow effects.
- Avoid floating card aesthetics.
- Avoid large soft shadows common in startup landing pages.
- Avoid layered glass effects as a primary depth system.
- JiTpro should feel engineered rather than fashionable.

Hierarchy standards:
- Lower layers should appear stable and grounded.
- Higher layers should appear only slightly elevated unless they require modal priority.
- Cards should receive minimal elevation, if any.
- Modals and dialogs should receive the greatest elevation because they temporarily sit above the rest of the interface.
- Sticky navigation, dropdowns, and overlays may use elevation only to clarify layer order and preserve readability.
- Most layout hierarchy should come from spacing, alignment, typography, and surface contrast rather than shadows.

Border-as-elevation standards:
- Dark interfaces should often rely on borders, surface contrast, and controlled spacing instead of shadow.
- Borders may define containers, separate layers, and communicate structure without making elements appear to float.
- Border and surface contrast should be preferred when the interface needs to feel like professional documentation rather than layered paper.

Construction documentation standard:
- The interface should resemble professional documentation: structured, organized, precise, and clear.
- It should not resemble floating paper, stacked cards, layered glass, or decorative depth effects.
- Structure should come from organization, not visual tricks.

Guiding principle:
- If removing a shadow improves clarity, remove the shadow.
- If spacing can solve the problem, use spacing instead.
- Shadows should always be the secondary solution.

Future elevation specification:
- Exact elevation levels, shadow tokens, overlay treatments, modal treatments, sticky-header behavior, and print equivalents remain future implementation decisions.
- Once approved, shadow and elevation behavior should be tokenized and applied consistently across components.

---

# 14. Motion Philosophy

Purpose: Define why JiTpro uses motion and when motion should be avoided.

Decisions that belong in this section:
- Motion personality
- Allowed motion purposes
- Forbidden motion purposes
- Marketing vs app motion differences
- Data visualization motion rules
- Reduced-motion policy

Implementation notes:
- Motion should support comprehension, sequencing, feedback, or continuity.
- Motion should not delay task completion in the application.
- All motion must respect reduced-motion preferences.

TODO:
- TODO: Define approved motion personality.
- TODO: Define when cinematic motion is allowed.
- TODO: Define when motion must be minimal.
- TODO: Define reduced-motion requirements.

APPROVED resolution:
- The approved motion personality, the communicate-not-decorate rule, and the reduced-motion requirement are defined in **Section 46, Animation Standards**. Section 46 is binding and supersedes the TODOs above.

---

# 15. Motion Specifications

Purpose: Define exact motion tokens and component behavior once approved.

Decisions that belong in this section:
- Duration tokens
- Easing tokens
- Delay rules
- Enter/exit patterns
- Hover/focus transitions
- Loading animations
- Skeleton behavior
- Page transition rules
- Chart/timeline animation rules

Implementation notes:
- Motion tokens should map to CSS variables/Tailwind utilities/Framer Motion constants later.
- Do not implement new arbitrary timing values once this system is approved.

TODO:
- TODO: Define duration tokens.
- TODO: Define easing tokens.
- TODO: Define transition presets.
- TODO: Define page transition policy.
- TODO: Define chart/timeline animation policy.
- TODO: Define loading-state motion policy.

APPROVED resolution:
- The timeline animation policy, and the shared-state synchronization requirement that governs it, are defined in **Section 46, Animation Standards**. Section 46 is binding for any composed animation.
- Duration, easing, and transition tokens remain TODO. Until approved, existing implementation values remain in force but are not canonical (Appendix C).

---

# 16. Iconography

Purpose: Define icon style, sizing, semantic use, and library strategy.

Decisions that belong in this section:
- Icon library
- Stroke style
- Size scale
- Color rules
- Semantic icon mapping
- Custom icons
- Logo vs icon rules
- Print icon rules

Implementation notes:
- Current code uses `lucide-react`, but official strategy is TODO until approved.
- Icons must not carry meaning by color alone.

TODO:
- TODO: Approve icon library.
- TODO: Define icon size tokens.
- TODO: Define icon color rules.
- TODO: Define semantic icon map.
- TODO: Define custom icon policy.
- TODO: Define print icon behavior.

---

# 17. Photography

Purpose: Define photographic direction for marketing, founder content, reports, documentation, and application contexts.

Decisions that belong in this section:
- Subject matter
- Lighting style
- Cropping rules
- Color grading
- People/jobsite/product balance
- Founder photography rules
- Stock photography policy
- Report/document image rules

Implementation notes:
- Photography should support trust and field credibility.
- Do not add generic construction imagery without approved direction.

TODO:
- TODO: Define approved photography style.
- TODO: Define prohibited photography style.
- TODO: Define founder portrait usage rules.
- TODO: Define jobsite image rules.
- TODO: Define stock photography policy.
- TODO: Define image treatment overlays/crops.

## 17.1 APPROVED - Documentary project-team photography and the integrated treatment

Status: APPROVED (2026-08-18). Direction supplied by Jeff Kaufman. Binding on marketing surfaces.

### Role

Photography on marketing surfaces is **evidence for an argument the section is already making in words** - never decoration, never generic atmosphere, and never a hero background. A photograph earns its place the same way any visual does (Section 47.4): by making an abstract claim tangible. If the section's argument would read the same without the photograph, the photograph is wrong.

This narrows - it does not lift - Section 48.8's prohibition on stock photography and generic construction imagery. Approved photography must show the **real working mechanism** the section describes: a project team surrounded by project information - drawings, schedules, selections - doing the actual coordination work the copy argues about. Cranes-at-sunset, hard-hat handshakes, and imagery that would be equally at home on any other company's site remain prohibited. Each photograph and its placement require explicit approval recorded in the Decision Log.

### The integrated treatment

A photograph placed on a JiTpro dark surface MUST be integrated into the site's restrained visual language, not dropped in as a bright rectangle:

- **Tonal integration (amended 2026-08-18).** All darkening is carried by the blending overlay alone - the photograph itself carries no global brightness/saturation filter, so wherever the overlay has released, the scene stands at its full natural brightness. The subject - people, drawings, the work - MUST remain immediately recognizable within the blended zones; if the blending makes the subject ambiguous, it has gone too far.
- **Edge dissolve.** Where the photograph meets the reading column, its edge dissolves into the section background using gradient stops built **only** from `--jp-background` (Section 8.9 - no color literals, including in gradients and masks). The dissolve is invisible as a technique: no decorative gradient, no diagonal, no visible panel edge.
- **No frame.** No card border, no visible container, no corner radius. The photograph belongs to the section, not to a card (Section 48.2).
- **Subordinate to the headline.** The hierarchy of Section 47.3 stands: headline first, explanatory copy second, photograph third. A photograph MUST NOT compete with the section's headline for attention.

### Composition

- Desktop composition is environmental, not a two-column image card (amended 2026-08-18): the text holds the shared left edge (Section 48.6), and the photograph - at its native aspect ratio, the full original scene - fills the entire height of the movement it supports and forms the visual environment of its right side, reaching left beneath the copy as far as its proportions require.
- The dissolve spans the whole movement rather than the photograph: held near-solid across the reading zone - the copy fully readable while the left of the scene remains faintly present beneath it, never erased - then releasing rightward until the scene stands clear. The photograph's physical left edge is completely swallowed - there is no findable seam where it begins, and no dark margins above or below that would make it read as a placed rectangle.
- Prefer the complete native composition over deliberate cropping. Where a presentation cannot hold the full scene, crop via `object-fit: cover` with an intentional `object-position` toward the subject - the people, the drawings, the interaction. Never distort the source.
- Tablet and mobile stack: headline and introductory copy first, then the photograph in a wide cinematic crop with the same tonal treatment. The horizontal edge dissolve is removed where the stacked layout makes it meaningless.

### Delivery

- Ship an optimized WebP derived from the retained source asset, with responsive `srcset`/`sizes` so no width downloads substantially more image than it renders.
- Reserve the layout with an explicit aspect ratio - a photograph MUST NOT shift layout while loading.
- Photography adjacent to the initial viewport loads eagerly; lazy-loading that visibly pops in during the first scroll is prohibited.

### The terminal field band (approved 2026-08-25)

A photograph MAY be presented as a **full-container band closing the section whose argument it completes**, rather than as an environmental composition beside the copy. This is the one approved presentation in which the photograph is not flanked by the reading column.

The band is a **terminal beat, never a transition**. It exists to show the field condition the section has just explained, at the moment the explanation lands.

- The band MUST close a section that has already made its argument in words, and MUST carry **one short line naming what the reader is looking at** — the Section 17.1 role rule is not relaxed. A wordless band standing on its own is decorative pacing and is prohibited.
- The band MUST NOT be a standalone section. A photograph that separates two arguments is a palate cleanser; a photograph that concludes one is evidence.
- No dissolve: the dissolve exists only where text overlaps the image, which does not occur here. No frame, no border, no radius, no filter, no animation (Sections 17.1, 48.2).
- The band holds the section's own horizontal container and carries no vertical padding of its own, so it reads as part of the section rather than an inserted card.
- The existing crop ladder applies: the native composition at desktop, the established cinematic crops below it via `object-fit`, explicit aspect ratios reserving the layout.

First approved use: the structural-steel field condition closing the homepage methodology section (Decision Log 2026-08-25).

---

## 17.2 APPROVED - Founder presence on marketing surfaces

Status: APPROVED (2026-08-25). Direction supplied by Jeff Kaufman.

Founder presence is a **credibility instrument, not a biography**. It exists to answer one buyer question — *did the people who built this method actually do this work?* — and it is finished the moment that question is answered.

**Reverses the 2026-08-04 homepage decision** that removed the founder section outright (recorded in `src/archive/homepage/README.md`). That decision was right about what it removed — a founder-centric section competing with the contractor's own story — and wrong as a general rule, because it left the site with no owner for the trust question at all. The reversal is narrow and carries constraints, not a licence to restore what was removed.

**Required**
- The section is about **the work and the experience behind the method**, never about celebrating the person. Its heading names the work, not the man.
- Credibility MUST be carried by **specific construction experience** a contractor recognizes from their own projects — meetings attended, conditions managed, failures witnessed — never by generic credentials, years of service, or dollar volume.
- Exactly **one quiet path** to the deeper founder or about story: a text or hairline link, never a second primary action (Section 48.1).

**Prohibited**
- An oversized founder card, a hero-scale portrait, or a portrait that competes with the section heading.
- A résumé, a credential list, an accomplishments tally, or a figure describing career volume.
- A display-scale first-person pull quote.
- Any treatment in which the founder, rather than the reader's project, becomes the subject of the page.

**Portraiture**
- Restrained and late: the portrait is subordinate to the copy it supports and MUST NOT be the first thing the section presents.
- Frameless and token-only, consistent with Section 17.1 — no card, no border, no radius, no decorative treatment.
- The Section 17.1 delivery rules apply unchanged.

First approved use: the homepage trust section (Decision Log 2026-08-25).

---

# 18. Illustration Style

Purpose: Define non-photographic visuals including diagrams, hero graphics, procurement flows, timelines, and report illustrations.

Decisions that belong in this section:
- Illustration style
- Diagram style
- Use of construction/render imagery
- Use of timelines/Gantt/flow visuals
- Level of abstraction
- Stroke/fill rules
- Print behavior

Implementation notes:
- Illustration style must connect to JiTpro’s product logic, not generic SaaS decoration.
- Complex visuals should have simplified versions for mobile and print.

TODO:
- TODO: Define official illustration style.
- TODO: Define official diagram style.
- TODO: Define whether Gantt/timeline visuals are core brand primitives.
- TODO: Define mobile simplification rules.
- TODO: Define print simplification rules.

---

# 19. Charts and Data Visualization

Purpose: Define how JiTpro presents data, risk, schedule, constraints, procurement sequence, margin, and project health.

Decisions that belong in this section:
- Chart types
- Chart palette
- Status/risk encoding
- Axis/label typography
- Gridlines
- Legends
- Tooltips
- Empty states
- Thresholds
- Print/export rules

Implementation notes:
- Charts must prioritize interpretation and operational decision-making.
- Risk/status must use more than color alone.
- Data visualization rules must be consistent across app, dashboard, investor pages, and printed reports.

TODO:
- TODO: Define approved chart types.
- TODO: Define chart color palette.
- TODO: Define schedule/timeline visual standards.
- TODO: Define risk encoding system.
- TODO: Define chart label and tooltip rules.
- TODO: Define printed chart rules.
- TODO: Define data source/citation visual rules.

---

# 20. Marketing Website Guidelines

Purpose: Define how the design system applies to public marketing surfaces.

Decisions that belong in this section:
- Page structure
- Hero rules
- CTA rules
- Proof sections
- Founder sections
- Role pages
- Landing pages
- SEO/content page layout
- Forms on marketing pages

Implementation notes:
- Marketing pages can express the brand more cinematically than app pages only if approved.
- Marketing guidelines must still use official tokens/components.
- Public-facing wording must respect JiTpro external language governance.

TODO:
- TODO: Define marketing page template(s).
- TODO: Define homepage hero rules.
- TODO: Define role-page rules.
- TODO: Define CTA placement and style rules.
- TODO: Define founder/story section rules.
- TODO: Define proof/data section rules.

APPROVED resolution:
- Founder/story section rules are defined in **Section 17.2**, which is binding. That TODO is superseded.
- Proof and data-figure rules are defined in **Section 48.10**, which is binding. That TODO is superseded.
- Homepage messaging standards are defined in **Section 20.1** below. The remaining TODOs stay open.
- The lead-magnet offer band, one CTA placement and style, is defined in **Section 20.2** (2026-09-12). CTA placement and style rules for other surfaces remain TODO.

## 20.1 APPROVED - Homepage messaging standards

Status: APPROVED (2026-08-25). Direction supplied by Jeff Kaufman. Scope: the marketing homepage. Other surfaces are governed by their own decisions and are not changed by this section.

### Retired language: the word may not appear; the mechanism must

The 2026-08-04 rebuild retired **"procurement"** and **"margin"** from the homepage, along with describing JiTpro as software or as "a layer" (recorded in `src/archive/homepage/README.md`). That record had no owner, no date attribution, and no Decision Log entry. It is now recorded properly, and it is **scoped**:

- The retired **words** MUST NOT appear in homepage-facing copy.
- The **mechanism those words name MUST be taught**, in operational detail, using construction language the reader already owns: scope, products, materials, services, decisions, information, responsibilities, commitments, submittals, approvals, fabrication, release, delivery, Required Onsite Dates, and backward planning.
- Retiring a word is not permission to describe the work vaguely. A homepage that avoids the category word by becoming abstract has failed this rule, not satisfied it.
- This resolves the standing tension with the Brand Voice section's teach-then-name sequence: on the homepage the teaching happens and the naming does not. Brand Voice governs every other surface unchanged.
- **"Margin" is released from this retirement (2026-08-27).** The word names the consequence the reader actually carries, in the reader's own language, and the approved hero copy of 2026-08-27 already uses it (*And your margin pays for it.*). It remains subject to every claim-strength rule below: margin may be named as what a schedule failure costs the contractor, and MUST NOT be attached to a promise, a recovery figure, or any quantified improvement. **"Procurement" stays retired**, and describing JiTpro as software or as "a layer" stays retired.

### The operating requirement

The homepage's account of what JiTpro is for MUST be expressed as an **operating requirement and the controls built around it** — never as a guaranteed outcome.

The requirement has two parts, and both are load-bearing (**refined 2026-08-26**):

- **Coordination** — the right product is coordinated with what is actually being built in the field.
- **Timing** — it is onsite when the field needs it.

Stated whole: **the right product has to be coordinated with what's being built in the field and be onsite when the field needs it.**

JiTpro's role is to establish and manage the upstream planning, visibility, responsibilities, commitments, decisions, approvals, and timing that support those requirements. The planning direction is stated: **everything upstream is planned and managed backward from the point it is required onsite** (revised 2026-08-26, superseding "backward from those requirements"). The point-in-time anchor is approved for this direction line — it names where the method's Backward Scheduling stage actually starts — and MUST NOT be used as a restatement of the requirement itself, which keeps both halves: coordination is not a point in time, and the requirement statement the line sits beneath continues to carry it.

**Superseded formulation (2026-08-26).** "The correct product or specification has been defined and approved for installation … available at the moment the field is ready for it" MUST NOT be used on the homepage. Approval for installation is one upstream event among many, not the requirement itself.

**Prohibited formulations.** The homepage MUST NOT state or imply a delivery guarantee, a quality or conformance warranty, that JiTpro replaces the project manager's or design team's conformance responsibilities, or that JiTpro controls supplier or fabricator execution. Absolute pairs that read as guarantees — of the form "not late, not wrong" — MUST NOT be used. Section 1's position stands: JiTpro creates visibility, not optimism, and the live FAQ answers the guarantee question with a flat "No."

This is a rule about **claim strength, not ambition.** The objective is not weakened; it is described as a requirement JiTpro builds controls around rather than an outcome it warrants.

### The engagement model

Status: APPROVED (2026-08-26).

JiTpro works with the **general contractor's internal construction management team.**

- JiTpro does NOT directly manage or coordinate owners, architects, engineers, consultants, subcontractors, vendors, or trade partners.
- The GC's internal team remains responsible for those project relationships, and remains the point of coordination with the broader project team.
- JiTpro supports the GC's internal team by organizing and clarifying what needs to happen, what information, decisions, and commitments are required, and when the team needs them.
- Homepage copy MUST NOT imply that JiTpro becomes another external project-team participant, or that any project relationship moves from the contractor to JiTpro.

The engagement strengthens the existing management team. It does not replace it, and it does not add a coordination layer above it.

### Long-lead terminology

Status: APPROVED (2026-08-26).

**JiTpro is not a long-lead-item service, and homepage copy MUST NOT imply that it is.**

"Long-lead" MAY be used when describing a specific item or construction example whose lead time is genuinely relevant to the point being made.

It MUST NOT be used:

- as shorthand for the overall problem JiTpro manages;
- as the defining category of JiTpro's work;
- as a repeated proxy for project risk;
- in language implying JiTpro primarily manages long-lead packages;
- in language suggesting that shorter-lead or apparently minor items receive less systematic attention.

**Why this rule exists.** Construction teams already recognize obviously long-lead packages as requiring attention — structural steel, switchgear, windows, specialty equipment announce themselves. A project also contains thousands of products, materials, services, decisions, details, approvals and commitments that appear ordinary, and any one of them can stop field work when scope stays unresolved, a selection is not made, information is missing, responsibility is unclear, an approval does not happen, a commitment is missed, timing is not understood, or the item is simply overlooked because nobody considered it important yet. **Importance is not determined by lead time, dollar value, size, or how obviously critical something appears today.** That principle is central to JiTpro, and framing the work around long-lead items contradicts it.

**Do not substitute another narrow category.** The message is not "long-lead items plus some small ones." It is that JiTpro systematically manages the upstream requirements for **everything the field will depend on** — some needing twelve months, some weeks, some appearing entirely ordinary — and that the method determines what requires action and when, rather than assuming importance from an item's apparent size, cost, or lead time.

**Review test.** *Would this sentence cause a general contractor to conclude that JiTpro is primarily a long-lead-item management service?* If yes, revise it.

This rule does not restrict naming specific packages in a worked example. Using structural steel, electrical switchgear and lighting rough-in fixtures to demonstrate genuinely different requirement types and timing profiles is the intended use, and it reinforces the principle rather than undercutting it: the method establishes what the field will need and works backward, instead of deciding what matters from what looks important today.

### Audience: qualitative only

The homepage MUST NOT publish a revenue band, employee count, project-value band, or any other numerical qualification of its audience. No such figure is approved anywhere in this system, and the live surfaces that carry one do not agree with each other.

The audience is a **growth-stage general contractor: a successful contractor whose project complexity has begun to outgrow the systems used to manage it.** That sentence is the definition, not the copy — the homepage MUST let the reader recognize themselves through symptoms they would describe in their own words (more dependencies, more people, information in more places, more chasing, late discovery, manual systems getting harder to hold, growing dependence on intervention) rather than through a management-consulting diagnosis.

The target contractor MUST NOT be portrayed as dysfunctional, disorganized, or failing. They are successful and reaching the limits of the operating methods that brought them here. Copy implying otherwise is a defect against Section 2 and Section 47.1.

### Named publications (note, 2026-09-12)

When the homepage, `/learn-more`, or a dialog opened from either offers a JiTpro publication whose subtitle contains a retired word, the offer uses the publication's **main title** and describes it as *the JiTpro field guide*. No exception to the retired-language rule was granted or required; the full subtitle appears only on surfaces this section does not govern (the delivery email, the `/field-guide` landing page, the document itself). Decision Log 2026-09-12.

### Amendment (2026-11-05): the six-section homepage messaging

Status: APPROVED (2026-11-05). Direction supplied by Jeff Kaufman. Scope: the marketing homepage only (Phase 1 of the homepage messaging simplification). Every other rule in this section stands unless amended here.

- **Hero copy (revised 2026-11-05).** The hero reads, in order: the eyebrow *Your project. Your team. Our expertise.*; one `h1` of three questions on separate lines, *Broken schedules? / Broken promises? / Broken profits?*, all in primary ink; then **one shared message area** beneath the headline (revised 2026-11-07, founder direction), showing three messages one at a time, in order:
  1. *Late materials. Wrong products. Idle crews.* in primary ink
  2. *It doesn't have to be this way.* in primary ink
  3. *JiTpro helps get the field what it needs, when it needs it.* in `--jp-brand-amber`, the only amber message, which stays visible permanently.

  (Message 2 was amber in the first version of the same day.)

  **The message area:**
  - **Type and layout.** All three messages share one type style: the heading face at 1.25 / 1.5 / 1.625rem, bold, below the headline's scale so the headline stays dominant. They are stacked in one grid cell, so the area is always as tall as its tallest message and nothing below it (the actions included) ever moves.
  - **Motion.** Opacity only, on one clock (Section 46.3):
    - The area is empty for the first 1.5 s, so the headline is read first.
    - Each message fades in over 500 ms. The first two are fully visible for 2 s, then fade out over 500 ms.
    - The messages fade in at 1.5 s, 4.5 s and 7.5 s; the third is fully in at 8 s and stays.
    - Revised 2026-11-07: the first version started immediately and held each message for about 1.8 s, too short to read.
    - The sequence runs once and never loops (Section 46.6). It is the hero's only animation.
  - **Amber.** Message 3 is static Brand Amber, fading in by opacity alone. Its colour never animates, so the active amber of Section 8.1.1 does not apply. Brand Amber is about 8:1 on `--jp-background`.
  - **Once per page load.** Returning to the homepage within the same load shows message 3 at once.
  - **Reduced motion** (Section 46.5) shows message 3 immediately.
  - **Assistive technology.** All three messages stay in the document in order.

  *Superseded the same day:* the permanent amber turn line beneath the headline, followed by three static statements (the symptoms, *Don't let preventable problems wipe out your profits.*, and the value proposition). The profit statement is withdrawn from the hero. The copy is used exactly as approved, in sentence case (Section 7.7). The hero's amber is the eyebrow, the turn, the primary action and the lighting (Section 48.7). *Superseded:* the headline *Broken schedules lead to broken profits.*
- **Profit protection is an approved business outcome.** "Profit" and "profits" MAY name what JiTpro helps the contractor protect, as well as what schedule failure costs them. They remain subject to every claim-strength rule in this section: no figures, no percentages, no recovery amounts, no guarantees, except for the illustrative figures permitted in the next bullet. The same latitude applies to "margin", which was released on 2026-08-27.
- **Illustrative figures about the reader's own job.** A figure MAY appear when it plainly describes the contractor's own estimate or bid as an illustration (*You bid the job at 12% profit.*), never JiTpro's results, typical industry margins, savings, or recovered amounts. It MUST be phrased as the reader's example, MUST NOT be paired with any JiTpro outcome figure, and the question it raises MUST stay open (no implied answer about what JiTpro will return).
- **The short operating promise.** *Get the field what it needs, when it needs it.* is approved as the homepage's short form of the two-part operating requirement. It MUST be framed as help JiTpro gives the contractor's team (*We help you get the field what it needs, when it needs it.*), never as a delivery guarantee. The full statement, coordination AND timing, continues to govern every surface that explains the method.
- **Plain English on the homepage; operational detail elsewhere.** The homepage MAY teach the mechanism as a plain-English summary: what the project needs, when it needs it, who is responsible, and what is missing or putting the schedule at risk. The operational detail the retired-language rule requires is carried by the supporting surfaces, currently `/learn-more`. This is not permission to become abstract: every homepage section MUST still describe concrete work the contractor recognizes. "Procurement" stays retired from homepage copy (sole exceptions: the core-belief supporting paragraph, the *Procurement is more than buying materials* section, the *Fewer surprises* opening paragraph, the Step 03 Build-the-chain comparison, and the step-stack intro panel, 2026-11-06, which continues as the *How we do it* band, 2026-11-09; and the audience section's tab copy, 2026-11-09, Section 54.3), and describing JiTpro as software stays retired.
- **No absolute claims.** Phrasing of the form "no more guessing" reads as a promise that a problem disappears and MUST NOT be used. Use comparative language ("less guessing").
- **The core belief (added 2026-11-05).** Directly beneath the hero and before *Fewer surprises*, a centered editorial statement (Section 7.7, with its eyebrow allowance) on the elevated band tone (Section 48.6): the eyebrow *What we believe*, the statement *Even the most robust construction schedule can't hold if the field doesn't have what it needs, when it needs it.*, the supporting paragraph *Early, accurate procurement planning is the first real opportunity general contractors have to make sure the construction schedule can hold.*, used exactly as approved (revised on 2026-11-06; the statement's quotation marks are dropped, and the closing statement *Broken schedules lead to broken profits.* is withdrawn because the hero carries it). The supporting paragraph is the one approved homepage use of "procurement" (scoped exception, Decision Log 2026-11-06). The paragraph takes the semibold heading-face statement register in `--jp-brand-amber`, prominent but secondary to the white statement (Section 7.7 supporting-copy allowance). Nothing else appears in the band. Its two ambers are the eyebrow and the supporting paragraph; nothing else in the band takes amber.
- **Procurement is more than buying materials (added 2026-11-06).** Directly beneath the core belief and before *Fewer surprises*, on `--jp-background` and the shared left edge, in the 5fr/7fr two-column composition from `lg`: the `h2` *Procurement is more than buying materials.*, then beneath it in the same column the supporting statement *It's a complex sequence of activities, each with real durations and dependencies.* (added 2026-11-10), the opening paragraph, the six "must" sentences each on their own line, the key insight *And much of that work depends on people outside your company.* at the semibold statement register in primary ink, the closing paragraph, and the consequence *Those delays spread. Costs grow. Profits shrink.* at the bold statement register in primary ink, used exactly as approved (Decision Log 2026-11-06). Its use of "procurement" is a scoped exception to the retired-language rule.
  - **The supporting statement (2026-11-10)** is the section's one amber element (Section 48.7). It is set at the section's semibold heading-face statement register (the key insight's: 1.25rem, 1.4375rem from `sm`, 1.5rem from `lg`) in `--jp-brand-amber`, the static brand color (Section 8.1.1). Amber meets contrast on `--jp-background`. It sits 20 px (24 px from `sm`) below the heading. *(The 2026-11-06 "No amber" rule for this section is superseded for this statement only.)*
  - **Its reveal (Section 46).** It fades from 0 to full opacity and rises 20 px into place over 700 ms, `ease-out`, with no overshoot. The reveal runs once, when the statement is comfortably in view: at least half of it visible, above the bottom tenth of the view. It then stays. Scrolling away and back does not replay it. Transform and opacity only, so nothing around it moves. **Reduced motion:** it is shown at once, without movement (Section 46.5). The heading and the rest of the section are static, as before.
- **The engagement model is unchanged.** Copy describing the weekly cadence MUST keep the GC's team responsible for running the work (*Your PMs still run the job.*).
- **Section 3 becomes the audience section (amended 2026-11-09).** *Know what's coming* and its four-step stack leave the homepage. In their place, between *Fewer surprises* and *We're with you throughout the project*, are the *How we do it* band (the step stack's former intro panel, restored the same day as its own section, Section 54.1) and then the audience section of Section 54 (pattern: Section 46.12). It addresses general contractors (the default and the primary audience, unchanged), architects and design teams, and project owners. Architects and owners are addressed **in that section only**. Every other homepage section still speaks to the general contractor, and the audience definition above is not changed. The engagement model above applies to that section in full (Section 54.3). The retired section is preserved at tag `homepage-four-step-stack-2026-11-09`.

## 20.2 APPROVED - Lead-magnet offer band

Status: APPROVED (2026-09-12). **Amended 2026-09-16 (amendment A11): the band becomes a product-style feature band presenting the publication as an object, and its action takes Brand Amber.** Direction supplied by Jeff Kaufman. Scope: the marketing homepage and, under the Section 50.5 amendment, long-form explainer pages. First approved use: the Field Guide offer.

Purpose: offer a free JiTpro publication to a reader who has read the page's argument and did not take the commercial action, without competing with that action.

- **Placement.** After the page's final commercial CTA and before the footer. It MUST NOT appear above the final CTA and MUST NOT appear in the hero. At most one such band per page.
- **Surface.** The elevated band tone: `--jp-surface` with `border-y` hairlines in `--jp-border` at 12% (Section 48.6). It is a band, not a change of act. **`--jp-surface` is required rather than preferred (A11):** the publication object is itself a dark artwork, and Section 20.2.1 records the measured reason.
- **Composition (amended A11).** Left-aligned on the page's shared left edge. From `lg`, two columns: the **copy column** at left carrying eyebrow, one heading, one supporting sentence and **the action directly beneath the copy**; and the **publication column** at right carrying the object of Section 20.2.1. The columns are weighted so the object balances the text rather than decorating it. Below `lg` the band stacks in one deliberate order: eyebrow, heading, supporting sentence, action, object. The object is always last, so the reader reaches the action before the picture. Section widths, gutters, and vertical rhythm are the page's own.
  - *Superseded:* the original composition placed the action at the right, bottom-aligned, with no publication object.
- **Registers.** Eyebrow in the data face, small, uppercase via CSS with increased tracking (Section 7.7). Heading at a section register below the hero's. Supporting copy at the secondary body register within the Section 7.7 measure.
- **Amber budget (amended A11).** The band carries exactly two amber elements of its own: the eyebrow, and the action. The action takes **Brand Amber fill with `--jp-background` ink**, matching the approved fulfilment-email CTA. Nothing else in the band may introduce amber: no glow, no wash, no amber rule, and no amber behind the publication object. Where the object's own artwork contains amber, that amber belongs to the publication and is not a licence to add more (Section 48.7).
  - *Superseded:* the original rule read "The eyebrow is the band's only amber. The action takes the Section 26.1 hairline secondary treatment, never Brand Amber."
- **Subordination without hue (A11).** The band's action is Brand Amber, so colour can no longer separate it from the page's commercial primary. **Weight carries the hierarchy instead.** The band's action MUST be visibly lesser than the page's primary commercial action in every other respect: smaller horizontal and vertical padding, a smaller type register, and **no shadow, glow, or elevation of any kind**. The commercial primary keeps its larger scale and its elevation. A trailing `ArrowRight` is permitted as visual treatment and carries `aria-hidden`.
- **The two amber actions MAY share a viewport, and that is accepted (A11).** Section 48.1's one-primary-action rule is scoped to a surface, not to a page; the band is its own surface under Section 48.6, and the page's final CTA is another. Measured on the homepage at the time of the amendment, the two buttons span 548px against a 911px viewport, so a desktop reader will commonly see both. **Vertical spacing MUST NOT be inflated to force them apart**, because whitespace added for that purpose reads as a hole rather than as rhythm. The separation is carried by surface, scale, elevation and context.
- **Copy.** Governed by Section 20.1 in full. The publication is named by its main title in sentence case (Section 7.7 note). No reassurance line beneath the action unless the composition genuinely requires one; the offer is confident and simple.
- **Behaviour.** The action opens the Section 28.1 lead-capture dialog and records its placement. **Nothing else in the band is interactive, including the publication object** (unchanged).

## 20.2.1 APPROVED - The publication object

Status: APPROVED (2026-09-16, amendment A11). Direction supplied by Jeff Kaufman. Scope: the Section 20.2 lead-magnet offer band. First approved use: the JiTpro Construction Procurement Field Guide.

Purpose: show the reader the actual thing they are being given, so a free publication reads as a tangible, valuable object rather than as another content section.

- **It is a true render of the approved asset.** The image MUST be page 1 of the approved, committed PDF, rendered mechanically. The cover artwork is never recreated, redrawn, reinterpreted, restyled, or approximated in HTML, and no illustration or placeholder stands in for it. This keeps Section 48.8 satisfied by construction: the image is not a fabrication presented as a capture, it is the publication.
- **Generation.** `pdftocairo` renders page 1 at 1600px wide; the render is resized to 800px and 1600px and encoded as WebP. Both widths are committed under `public/assets/guides/` with the asset's version label in the filename, and served with `srcSet` following the site's existing responsive-image convention. No image-processing dependency is added to the project.
- **Version integrity.** The cover filenames carry the same version label as the PDF and are declared in the lead-magnet registry beside it. The registry consistency test MUST fail when a new asset version ships without its matching cover, so the two cannot drift.
- **The structural hairline is REQUIRED, not decoration.** A dark publication on a dark surface has almost no edge of its own. Measured for the Field Guide: the cover's ground is `#02101B`, giving **1.05:1 against `--jp-background`** and **1.08:1 against `--jp-surface`**. The object therefore MUST carry an explicit 1px hairline in `--jp-border` at low opacity to define its edge. Without it the object dissolves into the band, which is the failure this section exists to prevent. Any future dark publication is measured the same way before it is placed.
- **Dimensional treatment.** A slight perspective rotation, restrained enough to read as an object rather than as a marketing mock-up; two thin page-edge slivers on the trailing side for the stacked-page read; and one restrained drop shadow composed from `--jp-background` via `color-mix`. No gloss, no reflection, no gradient sheen, no floating, no motion.
- **Depth behind the object.** A very faint technical grid in `--jp-border` at low single-digit opacity is permitted. **An amber glow, wash, or halo is NOT permitted** (Section 20.2 amber budget).
- **Mobile.** The perspective reduces towards flat and the object is capped in width. The transformed element MUST be contained so that no rotation or offset can produce horizontal page overflow at any supported width.
- **Accessibility.** The object is decorative in the accessibility tree: the eyebrow, heading and supporting sentence already state what the publication is, so a screen reader repeating the cover text would be redundant. It carries an empty `alt` and is hidden from assistive technology. It is never focusable and never interactive.

---

# 21. Application Guidelines

Purpose: Define design rules for the JiTpro SaaS product interface.

Decisions that belong in this section:
- App shell
- Navigation model
- Screen density
- Primary workflows
- Data-entry rules
- Risk/status display
- Constraint/procurement objects
- Permissions/roles display
- In-product help

Implementation notes:
- Application UI must prioritize speed, clarity, and low cognitive load.
- Marketing drama should not compromise operational efficiency.

TODO:
- TODO: Define app shell.
- TODO: Define screen templates.
- TODO: Define density standards.
- TODO: Define object-detail page structure.
- TODO: Define workflow stepper/wizard rules.
- TODO: Define in-app help pattern.

---

# 22. Dashboard Guidelines

Purpose: Define dashboard rules for executives, internal operators, project health, procurement status, and analytics views.

Decisions that belong in this section:
- Dashboard information hierarchy
- KPI cards
- Alerts/risk panels
- Filters
- Time ranges
- Drill-down rules
- Density rules
- Internal vs customer dashboard differences

Implementation notes:
- Dashboards must answer what matters, what changed, what is at risk, and what action is required.
- Do not overload dashboards with charts without defined decision purpose.

TODO:
- TODO: Define dashboard layout templates.
- TODO: Define KPI card patterns.
- TODO: Define alert/risk summary patterns.
- TODO: Define filter placement.
- TODO: Define drill-down interaction rules.
- TODO: Define internal dashboard exceptions, if any.

---

# 23. Tables

Purpose: Define table structure for data-heavy application screens, dashboards, admin views, documentation, and reports.

Decisions that belong in this section:
- Table density
- Header style
- Cell typography
- Row height
- Alignment rules
- Sort/filter affordances
- Selection states
- Empty/error/loading states
- Responsive behavior
- Print behavior

Implementation notes:
- Numeric values should align consistently.
- Tables must support scanning, keyboard access, and export/print requirements.

Table philosophy:
- Tables are one of JiTpro’s most important interface components.
- JiTpro exists to help professionals understand large amounts of project information quickly.
- Tables should optimize comprehension rather than density.
- Users should be able to recognize priority, status, relationships, ownership, risk, and progress without reading every cell.
- Tables should feel engineered, structured, and intentional.

Construction documentation standard:
- Tables should resemble well-organized construction documentation.
- Tables should not feel like generic spreadsheets, raw databases, accounting software, or undifferentiated data dumps.
- Table structure should communicate project reality in a way that supports decision-making.
- Every table should help answer: What is happening? Who owns it? What needs attention? What happens next?

Readability standards:
- Rows should be easy to scan.
- Columns should align cleanly and predictably.
- Whitespace should separate information naturally without making the table feel loose or disconnected.
- Users should not need to visually hunt for values.
- Labels, values, statuses, and actions should be placed consistently so users can build scanning habits over time.

Hierarchy standards:
- Every table should immediately communicate the most important information, supporting information, and reference information.
- Typography and spacing should establish hierarchy before color is introduced.
- Primary identifiers, ownership, risk, and next-action information should be easier to find than secondary metadata.
- Reference information should remain available without competing with operationally important values.
- Numeric values, dates, durations, IDs, and schedule-related fields should align in ways that support comparison and scanning.

Density standards:
- Avoid excessive density that forces users to slow down and decode the table.
- Avoid excessive whitespace that hides relationships or weakens comparison.
- Tables should balance information richness with readability.
- The goal is rapid understanding, not maximum visible row count.
- Dense modes may exist only when they preserve scanning, alignment, hierarchy, and comprehension.

Status and risk standards:
- Status indicators should be immediately recognizable.
- Color may support status, but color alone must not carry meaning.
- Typography should support hierarchy.
- Icons, labels, shape, placement, or pattern may support recognition when appropriate.
- No single visual element should carry all status meaning.
- Risk, blocked, overdue, approved, completed, and pending states should remain visually distinct and semantically consistent across tables.

Sorting and filtering standards:
- Sorting and filtering controls should remain visually simple.
- The table content should remain the focus.
- Controls should never dominate the interface or compete with the data.
- Sort and filter affordances should be clear enough to discover but restrained enough to preserve table hierarchy.
- Active filters and sort states should be recognizable without creating visual noise.

Row behavior standards:
- Hover states should be subtle and should confirm interactivity without distracting from scanning.
- Selection states should be obvious and accessible.
- Expandable rows should remain predictable, stable, and easy to understand.
- Row interactions should never surprise the user.
- Actions inside rows should be clearly associated with the row they affect.
- Destructive row actions should follow the same danger-action rules defined for buttons and confirmation patterns.

Responsive table standards:
- Responsive table behavior must preserve the table’s message, not merely compress columns.
- Mobile views may simplify, stack, prioritize, or progressively disclose information when doing so improves comprehension.
- Important status, ownership, risk, and next-action information should remain visible or easily reachable on smaller screens.
- Responsive alternatives should maintain the same semantic hierarchy as the desktop table.

Empty, loading, and error states:
- Empty tables should explain what is missing and what the user can do next when an action is available.
- Loading states should preserve layout stability where possible.
- Error states should explain what happened, why the table is unavailable or incomplete, and what recovery path exists.
- These states should be calm, practical, and consistent with the rest of the table system.

Print and export standards:
- Printed and exported tables should preserve readability, alignment, and hierarchy.
- Tables should remain understandable in grayscale or limited-color output where possible.
- Print layouts should prioritize clear row/column relationships, legible text, and meaningful grouping over visual density.

Guiding principle:
- A project manager should be able to understand the condition of a project by scanning the table, not reading every cell.

Future table specification:
- Exact table density options, header styles, cell typography, row heights, action-column rules, responsive patterns, and print mappings remain future implementation decisions.
- Once approved, table behavior and visual treatment should be tokenized and reused consistently across application, dashboard, admin, documentation, and report surfaces.

---

# 24. Forms

Purpose: Define form design for marketing capture, application data entry, admin tools, and reports/documentation examples.

Decisions that belong in this section:
- Field layout
- Label placement
- Required/optional notation
- Input styles
- Select styles
- Radio/checkbox styles
- Validation behavior
- Error text
- Help text
- Disabled/read-only states
- Multi-step forms

Implementation notes:
- Form rules must include accessibility, keyboard behavior, and error recovery.
- Marketing forms and app forms may have different density, but shared primitives should remain consistent.

TODO:
- TODO: Define field component anatomy.
- TODO: Define label/help/error placement.
- TODO: Define required-field convention.
- TODO: Define validation timing.
- TODO: Define disabled/read-only states.
- TODO: Define multi-step form pattern.
- TODO: Define protected/contact form visual standard.

## 24.1 APPROVED - Marketing capture field, checkbox, and fine print

Status: APPROVED (2026-09-12). Direction supplied by Jeff Kaufman. Scope: marketing capture forms (the lead-capture dialog and its inline landing-page form). Application forms and the existing contact form are not changed by this section; the contact form's field recipe is adopted here so the two remain one family.

- **Field anatomy.** A visible `<label>` above the field: `text-sm font-semibold text-jp-text-secondary`. The input takes the contact form's recipe: `rounded-lg border border-jp-border/30 bg-jp-surface px-4 py-3 text-lg text-jp-text-primary`, focus `border-jp-brand-amber` with `ring-2 ring-jp-brand-amber-active/30`. A placeholder MUST NOT stand in for a label.
- **Required notation.** A form with a single required field carries no asterisk. Where a form has optional fields alongside required ones, required fields are marked and optional ones are not (unchanged from current practice).
- **Validation timing.** Validate on submit. After a field has been marked invalid, validate that field live so the error clears as the visitor corrects it. Do not validate while the visitor is first typing.
- **Checkbox.** A native `<input type="checkbox">` at 20px with `accent-color: var(--jp-brand-amber)`; the checked state is an active state and may carry amber (Section 8.1.1). The `<label>` wraps the control and its text with vertical padding so the row reaches the Section 34.1 minimum. Label text `text-[0.9375rem] text-jp-text-secondary`. Consent checkboxes MUST be unchecked by default.
- **Fine print.** `text-sm text-jp-text-muted`. Links are underlined with `underline-offset-4`; the single hover gesture is the colour change to `--jp-brand-amber-active`; focus takes the standard `--jp-text-primary` outline.
- **Disabled and busy.** Disabled controls take the contact form's disabled recipe (`bg-jp-surface text-jp-text-muted cursor-not-allowed`). Submit in progress follows Section 32.1.
- **Help and error text** sit beneath the field at `0.9375rem`; error treatment follows Section 33.1.

---

# 25. Navigation

Purpose: Define navigation patterns for marketing, SaaS app, internal dashboard, documentation, and reports.

Decisions that belong in this section:
- Marketing top nav
- App sidebar/topbar
- Breadcrumbs
- Tabs
- Secondary nav
- Mobile nav
- Footer nav
- Active/hover/focus states
- Logo placement

Implementation notes:
- Navigation must clearly distinguish current location, available actions, and account/project context.
- Marketing and app navigation may differ but must share token/component logic.

TODO:
- TODO: Define marketing navigation pattern.
- TODO: Define app navigation pattern.
- TODO: Define internal dashboard navigation pattern.
- TODO: Define documentation navigation pattern.
- TODO: Define mobile nav pattern.
- TODO: Define breadcrumb rules.
- TODO: Define tab rules.
- TODO: Define logo sizing/placement rules.

---

# 26. Buttons

Purpose: Define all button variants and their exact usage rules.

Decisions that belong in this section:
- Primary button
- Secondary button
- Tertiary/ghost button
- Destructive button
- Link button
- Icon button
- Loading button
- Disabled button
- Button sizes
- Button alignment rules

Implementation notes:
- Every button variant must define default, hover, active, focus, disabled, and loading states.
- Button hierarchy must prevent multiple competing primary CTAs unless explicitly allowed.

Button philosophy:
- Buttons represent decisions.
- Buttons exist to help users take action. They should not become visual decoration.
- Buttons should communicate confidence without demanding attention.
- Buttons should feel professional, calm, deliberate, and reliable.
- Buttons should never feel playful, oversized, promotional, or visually loud.
- Users should recognize important actions immediately through consistency rather than novelty.

Primary button:
- The primary button represents the recommended action.
- Every screen or section should make the recommended action easy to identify.
- Primary buttons should use the approved JiTpro brand palette and remain simple, clear, and dependable.
- Avoid excessive gradients, glowing effects, oversized shadows, decorative motion, or treatments that make the button feel promotional.
- A primary button should feel confident, not urgent unless the action itself is time-sensitive or critical.

Secondary button:
- Secondary buttons support alternative actions.
- Secondary buttons should remain visually subordinate to the primary button.
- Secondary buttons should never compete with the primary action for attention.
- Secondary actions should be clear enough to recognize, but restrained enough to preserve hierarchy.

Ghost and tertiary buttons:
- Ghost buttons are appropriate for navigation, tertiary actions, and low-priority interactions.
- Ghost buttons should rely primarily on typography, spacing, and subtle interaction behavior.
- Ghost buttons should not be used when the action is the primary decision on the screen.
- Low-priority actions should remain discoverable without distracting from the main task.

Danger button:
- Danger buttons are reserved for destructive, irreversible, or high-risk actions.
- Danger actions must be visually distinct from normal primary and secondary actions.
- Danger styling should never be used merely to create emphasis or urgency.
- Destructive actions should include clear language and, when appropriate, confirmation patterns before execution.

Button hierarchy:
- Every screen should have one obvious primary action unless the workflow explicitly requires multiple equal choices.
- Avoid presenting multiple competing primary buttons in the same decision area.
- Users should never wonder which action JiTpro recommends.
- Button hierarchy should be communicated through consistent variant usage, placement, wording, and spacing.
- Calls to action should feel like a natural next step in the page or workflow, not an interruption.

Interaction states:
- Hover states should be subtle and should confirm interactivity without creating visual noise.
- Focus states must be highly visible and consistent across keyboard and pointer workflows.
- Pressed states should feel responsive and confirm that the action has been engaged.
- Disabled states should remain readable while clearly indicating that interaction is unavailable.
- Loading states should preserve layout stability and communicate that the system is processing the action.
- Button state changes must not rely on color alone.

Motion standards:
- Button animations should be restrained and purposeful.
- Smooth transitions may be used to clarify state changes.
- Avoid bouncing, scaling, flashing, pulsing, or theatrical interaction effects.
- Motion should reinforce reliability rather than excitement.

Accessibility standards:
- Buttons must remain usable through keyboard navigation.
- Focus visibility is required for every interactive button.
- Button labels should clearly describe the action.
- Icon-only buttons require an accessible text label.
- Color alone must never communicate state, priority, or danger.

Construction philosophy:
- Buttons should feel like tools, not advertisements.
- They should communicate reliability rather than excitement.
- A user should trust a JiTpro button before they click it.

Future button specification:
- Exact button sizes, spacing, typography, icon placement, loading behavior, and variant tokens remain future implementation decisions.
- Once approved, button variants and states should be tokenized and reused consistently across marketing, application, dashboard, documentation, and report surfaces.

## 26.1 APPROVED - Hairline secondary button

Status: APPROVED (2026-09-12). Direction supplied by Jeff Kaufman. Scope: marketing surfaces. **Note (2026-09-16, amendment A11): the Section 20.2 lead-magnet offer band was this section's first approved use, and no longer uses it** - that band's action is now Brand Amber, subordinated by weight rather than by hue. This section is unchanged and continues to govern hairline secondary actions everywhere else.

Section 48.1 permits a secondary action to be "text or hairline-bordered". The text form is specified in the Decision Log entry of 2026-09-03. This is the hairline form.

- **Use.** An action that is the only action on a quiet surface but MUST remain visually subordinate to the page's commercial primary action. It is not a second primary and MUST NOT be used where a Brand Amber primary is present on the same surface.
- **Shape and type.** `rounded-xl`; the primary button's padding and type (`px-7 py-4 text-[0.9375rem] font-semibold`, `w-full max-w-md` below `sm`); an optional trailing `ArrowRight` at 18px, `aria-hidden`.
- **Rest.** 1px border in `--jp-border` at 30% (the control-border level of Section 8.5); transparent background; label in `--jp-text-primary`. No fill, no shadow.
- **Hover.** One gesture: the border and the label change together to `--jp-brand-amber-active` (Section 8.1.1, Section 48.1). No lift, no fill, no icon motion. `motion-reduce:transition-none`.
- **Focus.** `--jp-text-primary` outline at 2px with a 3px offset, clearing the control edge (Section 48.1).
- **Pressed and disabled.** Pressed holds the hover colours. Disabled takes the contact form's disabled recipe.
- **Hit area.** At least the Section 34.1 minimum.

---

# 27. Cards

Purpose: Define card patterns for marketing, app objects, dashboard metrics, reports, and documentation.

Decisions that belong in this section:
- Card anatomy
- Card variants
- Padding
- Border/radius/elevation
- Header/footer areas
- Interactive cards
- Metric cards
- Risk cards
- Print cards

Implementation notes:
- Cards should group related information, not be used as decoration by default.
- Interactive cards must have clear focus and hover states.

TODO:
- ~~TODO: Define default card.~~ Resolved 2026-08-26 — Section 27.1.
- TODO: Define elevated card.
- TODO: Define accent/callout card.
- TODO: Define risk/status card.
- TODO: Define metric card.
- TODO: Define interactive card behavior.
- TODO: Define print/report card rules.

## 27.1 APPROVED - Default card: the dark-surface marketing panel

Status: APPROVED (2026-08-26). First approved use: the homepage hero problem/response panels.

The default card for dark marketing surfaces:

- **Surface:** `--jp-surface` on `--jp-background`. The one-step elevation IS the card; no shadow is added (Section 13 remains deferred).
- **Border:** 1px `--jp-border` at 15% opacity — between the 12% hairline and the 30% control border, so containers stay quieter than controls (Section 8.5).
- **Radius:** `rounded-2xl` — one step more generous than the `rounded-xl` primary button, per the Section 12 rule that cards round more than buttons.
- **Padding:** 24px on mobile, 32px from `sm`, 40px at `xl`. Internal padding is consistent across paired cards on a surface.
- **Behavior:** non-interactive. A marketing panel has no hover state; interactivity lives on the controls inside it (Section 48.1).
- One card style per surface (Section 48.2). Paired cards share top and bottom edges on desktop via equal-height layout, not fixed heights.
- **The panel is for content, not for statements (2026-08-27).** A single sentence set inside this panel reads as a UI component rather than as editorial type; the briefly-approved framed and unfilled variants of it are withdrawn. A standalone statement takes the Section 7.7 flanked form instead.

---

# 28. Modals

Purpose: Define dialogs, confirmations, blocking modals, drawers, and overlays.

Decisions that belong in this section:
- Modal anatomy
- Modal sizes
- Dialog vs drawer rules
- Overlay/scrim behavior
- Header/body/footer layout
- Close behavior
- Confirmation patterns
- Accessibility/focus trapping

Implementation notes:
- Modals must be used sparingly and for focused tasks.
- Destructive confirmations require explicit copy and action hierarchy.

TODO:
- TODO: Define modal variants.
- TODO: Define modal sizes.
- TODO: Define drawer policy.
- TODO: Define overlay treatment.
- TODO: Define confirmation dialog rules.
- TODO: Define focus management requirements.

## 28.1 APPROVED - Marketing lead-capture dialog

Status: APPROVED (2026-09-12). Direction supplied by Jeff Kaufman. Scope: the marketing website's lead-capture dialog and any future marketing dialog of the same kind. First approved use: the Field Guide offer. Drawers, confirmation dialogs, and application dialogs remain TODO and are not defined by this section.

- **Element.** A native `<dialog>` opened with `showModal()`. The platform then owns focus trapping, background inertness, Escape, and top-layer stacking; none of these is reimplemented.
- **Open.** Focus moves to the first form field. The page behind is inert and its scroll is locked for the dialog's lifetime.
- **Close.** Escape closes through the `cancel` event so focus restoration runs; a click on the backdrop closes; a labelled Close control closes. On close, focus returns to the control that opened the dialog (WCAG 2.4.3).
- **Naming.** The dialog carries `aria-labelledby` pointing at its own heading. The heading is an `h2` at a section register, never the hero's.
- **Panel.** The Section 27.1 default card: `--jp-surface` on the scrim, 1px `--jp-border` at 15%, `rounded-2xl`, padding 24px, 32px from `sm`, 40px at `xl`. Maximum width 32rem. Below `sm` the panel is the viewport width less 16px gutters. Maximum height `calc(100dvh - 2rem)`; content scrolls inside the panel, never the page. One size.
- **Scrim.** `--jp-background` at 88% via `color-mix`. No blur, no gradient, no image.
- **Close control.** A labelled quiet pill ("Close" plus the `X` icon) at the panel's top-right, taking the established lightbox close treatment expressed in tokens: hairline border in `--jp-text-primary` at 26%, ground `--jp-background` at 72%, label `--jp-text-primary`; hover raises the ground and border; focus takes the standard outline. Hit area at least the Section 34.1 minimum. It is viewer chrome and MUST NOT read as a second call to action.
- **Entrance.** 160ms opacity only. No scale, no slide, no bounce. Under `prefers-reduced-motion: reduce` there is no animation (Section 46.5).
- **Actions.** One Brand Amber action per dialog state (Section 48.1). Secondary actions inside the dialog are quiet text links.
- **States.** The dialog's form follows Sections 24.1, 32.1, and 33.1. When the state changes to an outcome, focus moves to the outcome heading so the change is announced.
- **Mobile.** The panel MUST remain usable with the software keyboard open: the field, its error, and the submit control stay reachable by scrolling inside the panel; the outcome's primary action is visible without scrolling on a 667px-tall viewport.

---

# 29. Notifications

Purpose: Define system feedback including toasts, banners, alerts, inline messages, and status announcements.

Decisions that belong in this section:
- Toasts
- Banners
- Inline alerts
- Page-level alerts
- Status badges
- Persistence/dismissal behavior
- Severity levels
- Accessibility announcement behavior

Implementation notes:
- Notifications must be actionable, clear, and not overused.
- Severity must map to semantic tokens.

TODO:
- TODO: Define notification variants.
- TODO: Define toast position and duration.
- TODO: Define alert/banner anatomy.
- TODO: Define dismissal behavior.
- TODO: Define ARIA live-region policy.

---

# 30. Tooltips

Purpose: Define compact contextual help and data explanations.

Decisions that belong in this section:
- Tooltip anatomy
- Trigger behavior
- Placement
- Delay
- Content length limits
- Touch/mobile behavior
- Chart tooltip behavior
- Accessibility requirements

Implementation notes:
- Tooltips must not hide essential information.
- If content is required to complete a task, use inline help or disclosure instead.

TODO:
- TODO: Define tooltip style.
- TODO: Define trigger rules.
- TODO: Define delay and dismissal behavior.
- TODO: Define chart tooltip style.
- TODO: Define mobile tooltip alternative.

---

# 31. Empty States

Purpose: Define what users see when there is no data, no results, or no configured workflow.

Decisions that belong in this section:
- Empty-state anatomy
- Messaging tone
- Illustration/icon use
- Primary action placement
- Secondary help link
- Empty vs zero vs filtered state distinctions
- Dashboard/report empty states

Implementation notes:
- Empty states should teach the next step without blaming the user.
- Filtered empty states should preserve filter context.

TODO:
- TODO: Define empty-state variants.
- TODO: Define illustration/icon policy.
- TODO: Define empty-state CTA rules.
- TODO: Define filtered empty-state behavior.
- TODO: Define report/dashboard empty-state rules.

---

# 32. Loading States

Purpose: Define loading feedback for pages, components, data tables, dashboards, and forms.

Decisions that belong in this section:
- Skeletons
- Spinners
- Progress indicators
- Button loading states
- Table loading states
- Chart loading states
- Long-running process states
- Reduced-motion loading behavior

Implementation notes:
- Loading UI should preserve layout stability when possible.
- Do not use indefinite loaders when progress or staged feedback is available.

TODO:
- TODO: Define loading-state hierarchy.
- TODO: Define skeleton style.
- TODO: Define spinner/progress policy.
- TODO: Define form submit loading behavior.
- TODO: Define dashboard loading behavior.

## 32.1 APPROVED - Submit in progress on marketing forms

Status: APPROVED (2026-09-12). Direction supplied by Jeff Kaufman. Scope: marketing capture forms. Resolves the "form submit loading behavior" TODO above for that scope; the other TODOs remain open.

- The submit control's label changes to a short progress phrase ending in an ellipsis character (for example *Getting your guide…*). The label change is the loading indicator; there is no spinner.
- The control is disabled for the duration and its width is held at its idle width, so the layout does not shift.
- The form is marked `aria-busy="true"` while the request is in flight; its fields are disabled.
- After 15 seconds a muted line (*Still working…*) appears beneath the control. A hard timeout is handled by the form's failure rules, not by the loading state.
- No motion is introduced for loading; the rule of Section 46.4 applies.

---

# 33. Error States

Purpose: Define how JiTpro communicates errors, failures, invalid input, blocked states, and recovery paths.

Decisions that belong in this section:
- Inline validation errors
- Page-level errors
- Network/API errors
- Permission errors
- Empty/error distinction
- Destructive action failures
- Recovery actions
- Error tone

Implementation notes:
- Error messages should explain what happened, why it matters, and what the user can do next.
- Use semantic color, iconography, and text; do not rely on color alone.

TODO:
- TODO: Define error severity levels.
- TODO: Define inline validation style.
- TODO: Define page error style.
- TODO: Define permission error pattern.
- TODO: Define network error pattern.
- TODO: Define error-copy guidelines.

## 33.1 APPROVED - Marketing form errors and status

Status: APPROVED (2026-09-12). Direction supplied by Jeff Kaufman. Scope: marketing capture forms. Resolves the inline-validation and network-error patterns for that scope; page-level and permission errors remain TODO.

**No semantic error colour exists (Section 8.3) and none is created for this purpose.** Meaning is carried by icon, text, and placement (Section 8.7).

- **Inline field error.** Beneath the field: the lucide `AlertCircle` at 16px, `aria-hidden`, followed by the message in `--jp-text-primary` at `0.9375rem`. The container is `role="alert"`. The field carries `aria-invalid="true"` and `aria-describedby` pointing at the message. The invalid field's border rises from `--jp-border` at 30% to `--jp-text-primary` at 60%. Focus moves to the first invalid field on a failed submit.
- **Outcome states that still grant what was asked for** (the lead-gen system fails open) reuse the success layout, heading, and primary action; the one sentence beneath the heading states plainly what did not happen and what to do next. Where it reports that an email could not be sent, the sentence is preceded by the same `AlertCircle`. No red, no amber wash, no warning band.
- **Error copy.** Plain English; what happened and what to do next; never the internal cause (no databases, rate limits, verification, or networks). Sentence case; no em dashes (Section 7.7).
- **Recovery.** A quiet *Try again* text action appears only where retrying is genuinely useful.

---

# 34. Mobile Design

Purpose: Define mobile-specific UX and visual rules.

Decisions that belong in this section:
- Mobile layout model
- Mobile navigation
- Touch targets
- Mobile forms
- Mobile tables
- Mobile charts
- Mobile motion
- Mobile report/document behavior

Implementation notes:
- Mobile should be intentionally designed, not only stacked desktop layout.
- Data-dense components need explicit mobile alternatives.

TODO:
- TODO: Define mobile breakpoints.
- TODO: Define minimum touch target.
- TODO: Define mobile nav behavior.
- TODO: Define mobile table behavior.
- TODO: Define mobile chart behavior.
- TODO: Define mobile form behavior.
- TODO: Define mobile motion constraints.

## 34.1 APPROVED - Minimum touch target

Status: APPROVED (2026-09-12). Direction supplied by Jeff Kaufman. Scope: interactive controls on marketing surfaces. Resolves the minimum-touch-target TODO above and the open item recorded in the Decision Log entry of 2026-09-03.

- Every interactive control on a marketing surface MUST have a hit area of at least **44 by 44 CSS pixels**.
- Quiet text links and small controls reach the minimum with padding, not by enlarging their type.
- A checkbox reaches it through the label that wraps it (Section 24.1).
- Adjacent controls MUST NOT overlap hit areas.

---

# 35. Responsive Behavior

Purpose: Define how layouts and components adapt across viewport sizes and output media.

Decisions that belong in this section:
- Breakpoints
- Fluid vs fixed behavior
- Container behavior
- Component reflow rules
- Responsive typography
- Responsive spacing
- Responsive navigation
- Print/export behavior

Implementation notes:
- Each component should have documented responsive behavior before implementation.
- Avoid ad hoc breakpoints outside approved tokens.

## 35.1 Responsive Website Standards

Scope:
- This standard applies only to the JiTpro marketing website.
- It governs all marketing pages, landing pages, and public-facing web content.
- Application, dashboard, internal admin, documentation, and printed report responsive behavior may require separate standards.

Desktop-first design:
- The JiTpro marketing website must always be designed desktop-first.
- The primary audience—general contractors, project executives, owners, and project managers—consume marketing content predominantly on desktop and laptop computers during working hours.
- Desktop is therefore the primary design target for marketing pages.
- Desktop is considered the source of truth. Responsive layouts are adaptations of the desktop design, not the reverse.
- Hermes shall never allow responsive behavior to determine desktop information architecture. Desktop is designed first. Responsive layouts adapt from the desktop design, not vice versa.

Required design workflow:
- Every new marketing page, section, or component must be developed in the following order:
  1. Desktop (primary)
  2. Tablet
  3. Mobile Landscape
  4. Mobile Portrait
- Responsive behavior must be intentionally designed, not left to default framework behavior.
- No marketing page, section, or component is considered complete until responsive behavior has been reviewed at each supported breakpoint.

Minimum supported breakpoints:
- Desktop: 1920px and above
- Desktop: 1440px
- Laptop: 1280px
- Tablet Landscape
- Tablet Portrait
- Mobile Landscape
- Mobile Portrait

Preserve the desktop experience:
- Desktop layouts must never be compromised because of mobile constraints.
- If desktop and mobile require different interaction patterns, both experiences should be designed independently.
- Responsive adaptations must preserve messaging hierarchy, visual hierarchy, brand consistency, and user intent.
- Mobile constraints may require alternate presentation patterns, but they must not weaken the desktop communication model.

Responsive adaptation order:
- When adapting a desktop layout for smaller screens, use the following priority:
  1. Adjust spacing
  2. Adjust typography
  3. Resize components
  4. Reflow layouts
  5. Collapse secondary content
  6. Stack components only when necessary
- Stacking is the final option, not the default responsive solution.

Marketing dashboard rule:
- Marketing dashboards and illustrative data boards exist to communicate an idea, not to present real application UI.
- Desktop versions must remain highly scannable.
- Do not automatically convert desktop dashboard layouts into vertically stacked cards.
- Use responsive techniques appropriate for the available screen size while preserving the visual story.
- Desktop scanability is the governing principle for marketing dashboard layouts.

Hermes AI requirement:
- Before considering any marketing page complete, Hermes must verify:
  - Desktop layout is complete.
  - Tablet layout is complete.
  - Mobile layout is complete.
  - Typography scales correctly.
  - Spacing scales correctly.
  - No information hierarchy is lost.
  - No desktop interaction or information architecture is degraded because of mobile constraints.
- Responsive design is part of implementation, not a post-processing step.

Future TODO:
- TODO: Define exact official breakpoint token values for Tablet Landscape, Tablet Portrait, Mobile Landscape, and Mobile Portrait.
- TODO: Define print/export responsive equivalents.

---

# 36. Accessibility

Purpose: Define accessibility requirements for every JiTpro surface.

Decisions that belong in this section:
- WCAG target level
- Keyboard navigation
- Focus indicators
- Color contrast
- Reduced motion
- Screen reader behavior
- Form accessibility
- Chart accessibility
- Table accessibility
- Modal accessibility
- Print accessibility

Implementation notes:
- Accessibility is a design-system requirement, not a final QA pass.
- Components must document ARIA, keyboard, and focus behavior.

TODO:
- TODO: Approve WCAG target.
- TODO: Define focus-visible style.
- TODO: Define keyboard interaction standards.
- TODO: Define reduced-motion standards.
- TODO: Define chart accessibility standards.
- TODO: Define table accessibility standards.
- TODO: Define form accessibility standards.

APPROVED resolution (2026-09-12):
- The minimum touch target for marketing surfaces is defined in **Section 34.1** (44 by 44 CSS pixels).
- Dialog focus behaviour for marketing capture is defined in **Section 28.1**; form error announcement for marketing capture is defined in **Section 33.1**. The remaining TODOs stay open.

---

# 37. Component Library

Purpose: Define the official component inventory, ownership, status, and required documentation for each component.

Decisions that belong in this section:
- Component list
- Component maturity/status
- API/props conventions
- Variant rules
- Accessibility requirements
- Test requirements
- Story/demo requirements
- Cross-surface usage

Implementation notes:
- Each component should have anatomy, variants, states, responsive behavior, accessibility notes, and examples.
- Component implementation should not begin until its required tokens exist or are explicitly stubbed.

TODO:
- TODO: Define component library location.
- TODO: Define component status labels.
- TODO: Define required component documentation template.
- TODO: Define Storybook/component-preview strategy, if any.
- TODO: Define test/QA requirements.

Initial component inventory placeholder:
- Button: TODO
- Card: TODO
- Input: TODO
- Select: TODO
- Textarea: TODO
- Checkbox: TODO
- Radio: TODO
- Switch: TODO
- Label: TODO
- FormField: TODO
- Table: TODO
- Badge: TODO
- Alert: TODO
- Toast: TODO
- Tooltip: TODO
- Modal/Dialog: TODO
- Drawer: TODO
- Tabs: TODO
- Breadcrumb: TODO
- NavMenu: TODO
- Sidebar: TODO
- PageHeader: TODO
- SectionHeader: TODO
- EmptyState: TODO
- Skeleton: TODO
- Spinner/Progress: TODO
- MetricCard: TODO
- Chart primitives: TODO
- Timeline/Schedule primitives: TODO
- Logo/Wordmark: TODO

Component documentation template:
- Component name: TODO
- Purpose: TODO
- Anatomy: TODO
- Variants: TODO
- States: TODO
- Props/API: TODO
- Accessibility: TODO
- Responsive behavior: TODO
- Do: TODO
- Do not: TODO
- Examples: TODO

---

# 38. Design Tokens

Purpose: Define the machine-readable source of truth for visual decisions.

Decisions that belong in this section:
- Token format
- Token naming convention
- Token categories
- Token ownership
- Token versioning
- Export targets
- Relationship to Tailwind, CSS variables, reports, and docs

Implementation notes:
- Token categories should include color, typography, spacing, radius, shadow/elevation, motion, z-index, breakpoints, and component tokens.
- Consider compatibility with W3C Design Tokens format and/or DESIGN.md-style frontmatter in a future implementation.
- Tokens must separate primitive values from semantic roles.

TODO:
- TODO: Choose token storage format.
- TODO: Define primitive token naming.
- TODO: Define semantic token naming.
- TODO: Define component token naming.
- TODO: Define export pipeline.
- TODO: Define versioning policy.

Token category placeholders:
- Color primitives: TODO
- Color semantic roles: TODO
- Typography: TODO
- Spacing: TODO
- Radius: TODO
- Shadow/elevation: TODO
- Motion: TODO
- Breakpoints: TODO
- Z-index: TODO
- Component tokens: TODO
- Print tokens: TODO

APPROVED resolution (color only):
- Token storage format: **CSS custom properties**, defined once in `src/index.css`. See Section 45.
- Token naming convention: `--jp-<role>`. See Section 8.8.
- Approved color tokens and reserved token names: **Section 8.8**.
- Governance over which colors may exist at all: **Section 8.9**.
- The remaining categories in this section - typography, spacing, radius, shadow, motion, breakpoints, z-index, component, and print tokens - remain TODO and are not superseded.

---

# 39. Tailwind Architecture

Purpose: Define how the design system maps into Tailwind without losing semantic meaning.

Decisions that belong in this section:
- Tailwind config structure
- Theme extension strategy
- CSS variable strategy
- Token-to-Tailwind mapping
- Utility usage rules
- Arbitrary value policy
- Component class strategy
- Dark/light theme strategy

Implementation notes:
- Tailwind should consume approved tokens rather than become the source of truth by itself.
- Arbitrary utility values should be restricted after tokens are approved.
- Repeated class strings should move into components or documented variants.

TODO:
- TODO: Define Tailwind token mapping.
- TODO: Define CSS variable layer.
- TODO: Define arbitrary value policy.
- TODO: Define class composition strategy.
- TODO: Define dark/light theme class or data-attribute strategy.
- TODO: Define lint/enforcement strategy for non-token values.

APPROVED resolution (color only):
- CSS variable layer: approved. Defined in `src/index.css`. See Section 45.
- Token-to-Tailwind mapping for color: approved. Tokens are exposed through Tailwind's `@theme` block so a single definition serves both utility classes and raw `var()` references. See Section 45.
- Arbitrary value policy for color: approved and restrictive. Color literals in arbitrary-value syntax are prohibited in production components. See Section 8.9.
- Tailwind does not own JiTpro's color decisions. Tailwind's `amber-500` and JiTpro's Brand Amber currently share a value; that is coincidence, not authority. If they ever diverge, this document wins.
- The remaining TODOs in this section - class composition strategy, dark/light theme strategy, and lint enforcement tooling - are not superseded.

---

# 40. shadcn/ui Integration Strategy

Purpose: Define whether and how JiTpro will use shadcn/ui primitives without surrendering brand control.

Decisions that belong in this section:
- Whether shadcn/ui is approved
- Which components may be adopted
- Which components must be custom
- Token mapping to shadcn CSS variables
- Variant strategy
- Accessibility responsibilities
- Upgrade/ownership policy

Implementation notes:
- Current codebase audit found no shadcn/ui implementation.
- If adopted, shadcn must be styled through JiTpro tokens and component rules.
- Do not add shadcn/ui until this strategy is approved.

TODO:
- TODO: Decide whether shadcn/ui will be used.
- TODO: Define approved shadcn components.
- TODO: Define components that must remain custom.
- TODO: Define token mapping to shadcn CSS variables.
- TODO: Define installation and ownership policy.
- TODO: Define how shadcn updates are reviewed.

---

# 41. AI Development Rules

Purpose: Define how AI coding agents must use this design system when building JiTpro UI.

Decisions that belong in this section:
- Required files to read before UI work
- What agents may infer
- What agents must never infer
- Token/component usage rules
- When to ask for clarification
- How to handle TODOs
- How to document deviations

Implementation notes:
- AI agents must not invent unresolved design decisions.
- If a token/component is missing, agents should stop and ask or create a bounded proposal document, not silently choose values.
- Agents should cite this file and the relevant section in implementation notes.

TODO:
- TODO: Define mandatory pre-read list.
- TODO: Define AI stop conditions.
- TODO: Define deviation request format.
- TODO: Define how agents propose new components/tokens.
- TODO: Define review checklist for AI-generated UI.

Draft rule placeholders:
- Rule: Use approved tokens only. Status: TODO
- Rule: Do not use arbitrary colors unless approved. Status: TODO
- Rule: Do not introduce new component variants without documenting them. Status: TODO
- Rule: Ask when a section says TODO. Status: TODO

APPROVED resolution:

Mandatory pre-read before any visual work:
1. This document, `docs/design/JiTpro_Design_System_v1.0.md`, in full for the areas being touched.
2. Section 8.8 (approved tokens) and Section 8.9 (color governance) before touching any color.
3. Section 46 before touching any animation.
4. Section 49 before introducing any convention this document does not already define.

Approved agent rules:
- Rule: Use approved tokens only. Status: **APPROVED** (Section 8.8).
- Rule: Do not use arbitrary colors, Tailwind color utilities, hex, or rgba literals in production components. Status: **APPROVED** (Section 8.9).
- Rule: Do not introduce new component variants or visual conventions without updating this document first. Status: **APPROVED** (Section 49).
- Rule: Ask when a section says TODO; do not infer the value from existing code. Status: **APPROVED** (Appendix C).

Stop conditions - an agent MUST stop and ask rather than proceed when:
- a required color has no approved token;
- the design calls for a value this document marks TODO;
- the implementation it is asked to write would conflict with an APPROVED rule;
- it is about to introduce a visual convention that does not yet exist in this document.

An agent MUST NOT resolve any of the above by choosing a value that looks close enough. Silence in this document is not permission.

---

# 42. Component Naming Standards

Purpose: Define predictable naming for components, variants, tokens, files, and CSS classes.

Decisions that belong in this section:
- Component naming convention
- File naming convention
- Variant naming convention
- Token naming convention
- Data/status naming convention
- Prefix/scope rules
- Deprecated-name policy

Implementation notes:
- Names should describe component role, not visual appearance, where possible.
- Semantic names make future theme changes easier.

TODO:
- TODO: Define React component naming convention.
- TODO: Define file/path convention.
- TODO: Define token naming convention.
- TODO: Define variant naming convention.
- TODO: Define status/semantic naming convention.
- TODO: Define deprecated component/token policy.

---

# 43. Design Review Checklist

Purpose: Provide a repeatable review process before UI work is accepted.

Decisions that belong in this section:
- Review gates
- Accessibility checklist
- Token compliance checklist
- Responsive checklist
- Content/governance checklist
- Data visualization checklist
- Print/export checklist
- AI-agent compliance checklist

Implementation notes:
- This checklist should be run before merging design-system-affecting UI work.
- Checklist failures should produce either fixes or documented exceptions.

TODO:
- TODO: Define required review gates.
- TODO: Define who approves design deviations.
- TODO: Define accessibility review method.
- TODO: Define visual QA method.
- TODO: Define regression testing approach.

Checklist template:
- Uses approved tokens: TODO
- Uses approved components: TODO
- No arbitrary design values: TODO
- Responsive behavior documented: TODO
- Keyboard behavior verified: TODO
- Contrast verified: TODO
- Reduced motion verified: TODO
- Empty/loading/error states covered: TODO
- Content governance checked: TODO
- Print/export impact checked: TODO
- Deviation documented: TODO

---

# 44. Future Expansion

Purpose: Define how the design system grows without becoming inconsistent or ungoverned.

Decisions that belong in this section:
- Versioning policy
- Deprecation policy
- New-token proposal process
- New-component proposal process
- Cross-product expansion rules
- Documentation maintenance
- Design-system release notes
- Migration strategy

Implementation notes:
- Future expansion should preserve backward compatibility where possible.
- New patterns should be added because a real product need exists, not because a single page wants novelty.

TODO:
- TODO: Define versioning model.
- TODO: Define changelog format.
- TODO: Define deprecation process.
- TODO: Define migration process.
- TODO: Define design-system ownership.
- TODO: Define cadence for design-system audits.

---

## Appendix A: Required Future Artifacts

Purpose: List the supporting artifacts that should eventually accompany this document.

TODO artifacts:
- TODO: Token source file
- TODO: Tailwind token export
- TODO: CSS variable layer
- TODO: Component library directory
- TODO: Component documentation or Storybook
- TODO: Figma/design file, if used
- TODO: Print report template
- TODO: Chart/data visualization examples
- TODO: Accessibility test matrix
- TODO: AI implementation prompt template

---

## Appendix B: Open Questions

Purpose: Keep unresolved decisions visible.

Open questions:
- TODO: Should JiTpro maintain both dark and light themes, or one primary theme with contextual exceptions?
- TODO: What typography direction best fits JiTpro across web, app, reports, and documentation?
- ANSWERED (2026-08-06): The official palette is Brand Amber #F59E0B and Active Amber #FDE68A (Section 8.1.1). The semantic color model beyond amber remains TODO.
- TODO: Should shadcn/ui be adopted for app primitives?
- ANSWERED (2026-08-06): The source of truth for color tokens is CSS custom properties defined in src/index.css (Sections 8.8 and 45). Other token categories remain TODO.
- TODO: How should printed reports relate visually to the web/app design?
- ANSWERED (2026-08-06): The governance process for approving new visual conventions is defined in Section 49. Component-specific approval criteria remain TODO.

---

## Appendix C: Non-Decision Placeholder Policy

Purpose: Prevent this framework from being mistaken for a completed design system.

Rules:
- A TODO is not a decision.
- A current-code observation is not a decision.
- A design audit finding is not a decision.
- An inspiration reference is not a decision.
- A component name is not a decision until its anatomy, variants, states, and tokens are approved.
- A Tailwind utility currently used in the website is not automatically an official token.
- Note (2026-08-06): this policy remains in force for every section still marked TODO. It does NOT apply to Part II, or to Sections 7.7, 8.1.1, 8.8, and 8.9, which are approved decisions rather than placeholders.

TODO:
- TODO: Replace this section with formal governance once approved.

---

# Part II - Approved Implementation Standards

Status: APPROVED (2026-08-06).

Sections 1-44 describe how JiTpro design decisions should be reasoned about. Part II describes how JiTpro is actually built. These sections were derived from production work on the marketing website; they are not proposals.

Where Part II conflicts with existing implementation, **the implementation is wrong and must change.** Where Part II conflicts with a TODO in Sections 1-44, Part II wins.

---

# 45. Implementation Standard - Color in Code

Purpose: Define how approved colors reach production code, so that a color exists in exactly one place.

## 45.1 CSS Custom Properties are the mechanism

Colors MUST be implemented as CSS custom properties and consumed by reference. Duplicated color literals are the failure mode this standard exists to prevent.

Components MUST reference:

```
var(--jp-brand-amber)
```

Components MUST NOT reference:

```
#F59E0B
amber-500
rgba(245, 158, 11, 1)
```

## 45.2 Centralized definition

There MUST be exactly one definition site for color tokens.

Approved location: **`src/index.css`**, which already carries the Tailwind v4 `@theme` block and is loaded once for the whole application.

`src/styles/theme.css` is an acceptable alternative if the token layer grows large enough to warrant its own file. If it is adopted, `src/index.css` MUST import it and MUST NOT also define tokens. Two definition sites is the condition this standard forbids.

### Approved architecture: `:root` declaration with `@theme inline` aliases (2026-08-06)

The approved `--jp-*` names from Section 8.8 are declared once in `:root`. Tailwind v4 `@theme inline` aliases then reference those variables so components can also consume semantic utilities:

```css
:root {
  --jp-brand-amber: #F59E0B;
  /* ... */
}

@theme inline {
  --color-jp-brand-amber: var(--jp-brand-amber);
  /* ... */
}
```

Why this shape rather than declaring the values directly in `@theme`:
- Tailwind v4 generates utilities only from theme variables named `--color-*`. Section 8.8 mandates the names `--jp-*`. Neither requirement can be dropped, so the alias reconciles them.
- `@theme inline` substitutes the referenced value rather than emitting a second independent variable, which keeps `--jp-*` authoritative.
- The result serves all three consumers from one declaration: Tailwind utilities (`bg-jp-brand-amber`, `text-jp-text-muted/80`), raw CSS, and SVG presentation attributes via `var()`.

Rules:
- Authoritative hex values MUST appear only in the `:root` block. Restating a value inside `@theme` creates the second definition site this section forbids.
- `@theme` entries MUST be aliases (`var(--jp-*)`), never literals.
- A reserved token with no approved value MUST NOT be declared in either block. `--jp-shadow` is not defined (Section 8.8).

## 45.3 Why custom properties rather than Tailwind alone

- SVG presentation attributes (`fill`, `stroke`, `stop-color`) cannot accept Tailwind class names, but they can accept `var()`. A CSS variable is the only mechanism that serves markup, CSS, and SVG from one definition. This is precisely where the palette previously fractured.
- A custom property can be changed in one place and take effect everywhere, including inside inline styles and generated stylesheets.
- Defining tokens inside Tailwind's `@theme` block yields both a Tailwind utility for class-based usage and a raw custom property for SVG and arbitrary CSS, from a single declaration.

## 45.4 Opacity

Opacity variants MUST be derived from the token rather than authored as new literals. A dimmer brand amber is the brand amber at reduced opacity - it is not a different color, and it MUST NOT be written as one.

## 45.5 Migration expectation

Existing production code predates this standard and does not conform. That is expected. Conformance is scheduled work (Section 49.4), not a reason to weaken the standard. New and modified code MUST conform immediately.

---

# 46. Animation Standards

Purpose: Define why JiTpro animates, and the structural requirement that keeps composed animations correct.

## 46.1 Animation exists to communicate

**Animation exists to communicate. It never exists to decorate.**

Animation MUST:
- explain something that is genuinely hard to explain statically
- reinforce hierarchy by directing attention to what matters now
- improve understanding of sequence, causality, or state

Animation MUST NOT:
- exist because movement is possible
- exist to signal that the product is modern
- compete with the content beside it
- delay comprehension

If an animation were removed and nothing became harder to understand, it was decoration and should not have been built.

## 46.2 Comprehension is not gated on motion

- Essential copy MUST be readable without waiting for an animation to finish. Motion may resolve after the message has landed; the message may never wait for the motion.
- An animation MAY continue after the page is comprehensible. It MUST NOT be a precondition of comprehension.

## 46.3 Single shared state - the synchronization rule

This is the load-bearing rule of this section.

**Every element that participates in one animated idea MUST derive its behavior from one shared animation state.**

For the marketing timeline this means the moving indicator, milestone highlighting, milestone labels, connector lines, and the directional heading are all expressed as positions within a single cycle, from a single definition, with a single delay.

Prohibited:
- independent timers per element
- separate animation delays that happen to line up
- duplicated timing constants
- any arrangement in which two elements could drift out of agreement

Why this is mandatory rather than advisory: when a composed animation is assembled from independently timed parts, it does not fail loudly. It fails as a slow, hard-to-diagnose disagreement between elements - a label lighting before the indicator reaches it, an arrow pointing against its own travel. Deriving everything from one state makes those failures structurally impossible rather than merely unlikely.

Corollary: if two elements must always agree about a state, they MUST be driven by the same declaration, not by two declarations configured identically.

## 46.4 Restraint

Prohibited in all JiTpro products:
- spinning, bouncing, and elastic or overshooting easing
- pulsing or flashing as an ambient state
- particle effects, comet trails, and neon bloom
- looping motion that never resolves, where a single resolved pass would communicate the same thing
- animation on more than one focal element at a time within a viewport

Motion SHOULD be linear or gently eased. Constant-speed travel is preferred where an animation represents progress through a real sequence, because varying speed implies a meaning that is not there.

## 46.5 Reduced motion is a first-class state

`prefers-reduced-motion: reduce` MUST be honored, and MUST be designed rather than merely obeyed.

- Reduced motion MUST present the animation's **resolved, meaningful final state** - not an empty frame, and not a mid-animation frame.
- All information conveyed by the animation MUST remain available without it.
- Controls that exist only to drive animation, such as a replay control, SHOULD be hidden under reduced motion, since they have nothing to do.
- Reduced-motion behavior MUST be verified, not assumed.

## 46.7 Sequence carousel

Status: APPROVED (2026-08-07). **SUPERSEDED 2026-08-08 by the stage selector (Section 46.8) for the homepage small-miss progression — this pattern's only approved implementation.** Retained for history; a future genuine carousel use requires a fresh Decision Log entry.

An ordered set MAY be presented as an interactive carousel **only when the set is a genuine progression** - the order carries meaning, and showing every stage open at once would flatten an argument into a list. A group of three that happens to sit in a row is not a progression.

**Entry**
- The interaction MUST NOT begin on page load, component mount, or a timer. It initializes only when the section itself intersects the viewport, at roughly a third visible, once, and never resets.
- Motion MUST NOT occur off screen. A reader who never reaches the section must never have caused it to move.
- The only automatic behaviour is the carousel's own arrival. Auto-advancing through the stages is prohibited: the reader controls the progression.

**State**
- The whole layout derives from one active index plus one entered flag (Section 46.3). Competing per-item animation states are prohibited.
- Hover, keyboard focus, and tap MUST all resolve to that same active index. No input method may have behaviour the others lack.

**Motion**
- The track repositions around the selected stage; a stage MUST NOT travel independently across the surface.
- Permitted: width change, horizontal repositioning, clipped copy reveal, opacity, a subtle border response. Prohibited: bouncing, flipping, rotation, aggressive scaling, large vertical movement, springy easing, glow (Sections 46.4, 47.2).
- Copy MUST become readable promptly. A reader may not be made to wait out an animation before reading (Section 46.2).
- The interaction MUST NOT change the section's height. Stage copy is laid out at its open width regardless of the stage's current width, so switching stages never reflows the page.
- Exactly centring the first or last of three stages would push the far stage off the edge. Where that conflict exists the track SHOULD travel most of the way rather than all of it, so every stage stays on screen.

**Accessibility**
- Each stage MUST be operable by keyboard, with a real control and a visible focus ring that is not clipped by the carousel's overflow.
- All stage copy MUST be present in the document at all times. Visibility is a visual state, never a content state, so assistive technology and search engines receive the complete argument.
- An ordinal marker MAY take `--jp-brand-amber-active` as its stage becomes active and settle back to the resting `--jp-brand-amber` (Section 8.1.1).
- Under reduced motion, selection resolves instantly: the chosen stage and its complete copy appear with no travel, no expansion animation, and no illumination. The interaction itself MUST continue to work (Section 46.5).

**Responsive**
- Where three stages cannot hold a readable measure side by side, the layout MUST adapt to a single primary stage with its neighbours partially visible, rather than compressing three narrow columns or reducing type size (Section 7.7).
- Overflow MUST be contained by the carousel. The page itself must never scroll horizontally.

## 46.8 Stage selector

Status: APPROVED (2026-08-08). Supersedes the sequence carousel (Section 46.7) for the homepage small-miss progression.

A genuine progression MAY be presented as a stage selector: every numbered stage title always visible as a rail of selectable controls, with one content stage presenting the active stage — beneath the rail, or beside it in the divided form of Section 46.8.1 (amended 2026-08-25). The selector states the interaction structurally — every stage visible, one open — instead of asking the reader to discover it through affordance icons or cropped neighbours.

**Entry**
- The entry rules of Section 46.7 carry over unchanged: nothing animates on page load, component mount, or a timer; the presentation settles in only when the section itself intersects the viewport, at roughly a third visible, once, and never resets. Motion MUST NOT occur off screen.
- Auto-cycling, looping, and perpetual autoplay are prohibited. A stage selector MAY perform **one finite, first-entry guided progression** when the sequence itself communicates a narrative progression (2026-08-08), provided that it begins only after the section itself is visible; advances through the stages once and stops permanently at the final stage; never loops and never restarts; is cancelled immediately and for the remainder of the page visit by any deliberate visitor interaction with a selector (hover, keyboard focus, click, or tap); never changes stages while the section is off-screen; and does not run under reduced motion. Manual control is always available, and always wins.

**State**
- The whole presentation derives from one active index plus one entered flag (Section 46.3). Competing per-item animation states are prohibited.
- **Click, tap, and keyboard activation (Enter or Space) MUST all resolve to that same active index.** No committing input method may have behaviour the others lack, and touch MUST NOT depend on hover.
- **Hover and keyboard focus MAY indicate availability without committing selection (amended 2026-08-25).** Where a selector drives a substantial content stage — a full copy panel, or a persistent visual that accumulates across the stages (Section 46.8.1) — hover and keyboard focus MUST indicate availability only and MUST NOT change the active index. Crossing such a rail on the way elsewhere would otherwise re-narrate the argument, and focus-to-commit would destroy a keyboard reader's place mid-traversal. A selector MUST apply one behaviour to every one of its own stages; hover-to-commit remains permitted, and remains the default, where the selector drives only a short copy swap.
- Availability and selection MUST be visually distinguishable. Hover and focus use the inactive control's approach treatment — brightening toward primary text with a subtle neutral surface wash — never the active amber enclosure. Keyboard traversal MUST NOT be trapped: focus MAY move between selectors without committing, and Enter or Space commits.

**Selector rail**
- All stage numbers and titles remain visible at all times. No stage may be hidden behind an icon, an overflow, or a swipe.
- Selectors are real interactive controls, and the whole selector is the target — never only an icon.
- **A vertical rail row MAY carry one directional affordance at its trailing edge (amended 2026-08-27)** — a single chevron from the approved icon library, sized to its adjacent type and hidden from assistive technology (Section 48.4). It states that the row is operable before the reader hovers it, which hover alone cannot do on touch. One affordance per row, at the trailing edge only; it MUST NOT be the row's target, MUST NOT be the only signal that a row is selected, and MUST NOT appear on a rail that already reads as operable without it.
- **The active row MAY carry a neutral surface wash (amended 2026-08-27),** at a weight at or below the inactive hover wash so selection never reads louder than the control it sits among. On a light surface this wash is ink-based; amber is prohibited here (Section 8.8, amber on light surfaces).
- The active stage MUST be visually unmistakable without explanatory text. Selector controls use the established JiTpro selector treatment (2026-08-08): pill-shaped (`rounded-full`) controls whose active state is enclosed by `--jp-brand-amber` at restrained opacity — border at roughly 30%, background tint at roughly 10% — with amber text emphasis (Sections 8.1.1, 48.7). Inactive controls are muted but clearly available, brightening toward primary text with a subtle neutral surface wash on hover or focus, and keep the same pill footprint via a transparent border so geometry never shifts with state. Heavy borders, raised cards, shadows, and excessive fills remain prohibited.
- **On an approved light surface the selector expresses that same treatment in ink (amended 2026-08-26).** The amber tokens do not meet the contrast requirement on `--jp-surface-light` — 1.96:1 and 1.14:1, below the 3:1 minimum for user-interface components (Section 8.8, amber on light surfaces) — so the active enclosure, the ordinal, and the active label take the light ramp instead: the active stage at the strongest ink, inactive stages at `--jp-ink-secondary`, and hover and focus brightening toward the strongest ink with a subtle neutral wash. **The active stage MUST remain unmistakable without depending on hue**, carried by at least two of geometry, ink weight, ink contrast, and position, so nothing about which stage is open rests on a reader separating two ink values. This is the same convention expressed in the surface's own hierarchy rather than a second convention — the resolution Section 48.3 already applies to timeline and schedule structure. On dark surfaces the bullet above is unchanged, and no new amber and no third ink level is created (Sections 8.1.1, 8.8, 48.3).
- **A vertical rail MAY use a row-and-node geometry rather than the pill (amended 2026-08-26).** Where the rail runs vertically and drives the divided content stage of Section 46.8.1, each stage MAY be a full-width row on a continuous spine — a node on the spine, the stage number, and the stage title — instead of a pill. The pill remains the treatment for a horizontal rail and for any rail driving only a short copy swap; a surface MUST NOT carry both geometries. The spine MUST be drawn at one constant weight for its whole length: **a spine, rail, or track that fills up to the active stage is prohibited**, because it describes a wizard the visitor is advancing through rather than a method they are inspecting, and selecting the fourth stage does not mean the first three were completed.
- Where a horizontal rail cannot hold every stage title legibly, the selectors stack rather than shrink, truncate, or scroll horizontally. **A rail MAY be laid out on either axis (amended 2026-08-25)** — horizontal or vertical — provided every stage number and title stays visible at every supported width. The axis is a composition decision; the visibility rule is not.

**Content stage**
- One content area presents the active stage's copy. Neighbouring stages are not partially shown; the rail already communicates the set. The moving-track, partially-visible-neighbour geometry of Section 46.7 is the superseded presentation, not a variant of this one.
- **The content area MAY be divided into a copy column and a persistent visual column beside the rail, rather than a single area beneath it (amended 2026-08-25).** Section 46.8.1 governs the visual column. Every other rule in this section applies to the divided form unchanged.
- **The copy area MAY sit INSIDE the rail, directly beneath the active stage's own control (amended 2026-08-27).** A rail whose copy appears only below all five rows can put the change outside the viewport at the moment it is made, so the visitor operates a control and sees nothing happen. Placing the copy under the row that produced it makes cause and effect adjacent. This is a placement of the SAME single content area, not a new one:
  - **Exactly one copy area exists in the document.** It moves to the active stage; it is never duplicated per row. Five collapsible bodies, one per row, is a different pattern and is not approved here.
  - **It MUST reserve the tallest stage's height** whichever row it sits under, so the rail's overall height is identical for every selection. This is the same no-reflow rule as the bullet below, and it is what keeps a divided form's visual column from moving when the reader changes stages.
  - The copy is indented clear of the spine and node so it reads as belonging to its stage rather than restarting the rail.
- **Where the divided form stacks to one column, the visual column follows the active stage's copy rather than the whole rail (amended 2026-08-27)** — title, then copy, then visual, then the next stage. The stacked order exists so the visitor never operates a control at the top of a list and has to hunt below the fold for what changed. **The visual MUST be mounted once, not rendered twice and toggled with `hidden`/`lg:block`** — a visual column that will hold embedded media would otherwise load twice on every view.
- All stage copy MUST be present in the document at all times. Visibility is a visual state, never a content state, so assistive technology and search engines receive the complete argument.
- Switching stages MUST NOT change the section's height. The content area reserves the height of the tallest stage's copy, so selection never reflows the page. **In the divided form both columns MUST reserve a height independent of the active index** — the copy column by reserving the tallest stage's block, the visual column by holding a fixed aspect ratio (amended 2026-08-25).
- Copy MUST become readable promptly: a restrained cross-fade or equivalent short transition only.

### 46.8.1 The accumulating visual column

Status: APPROVED (2026-08-25).

Where a stage selector uses the divided content stage, the visual column MUST be **one visual system that accumulates across the stages**, never a set of separate illustrations swapped in and out.

- Elements introduced at one stage MUST persist as the same elements at every later stage. The only permitted removal is a label that a later stage's own structure supersedes; content the visual has established is never withdrawn.
- **Real product screens satisfy this requirement where they are screens of ONE continuous project (amended 2026-08-27).** A sequence of authentic interface captures is not "separate illustrations swapped in and out" when each later screen shows the state the earlier stages produced — the same project, the same items, carried forward. The test is traceability: an item visible at one stage MUST be findable at the next, as the same item. Screens of different projects, or screens whose content has no relationship to each other, fail this section however real each one is.
- **A stage without a screen keeps the reserved placeholder.** Filling a gap by repeating an adjacent stage's screen, or by showing a screen that does not belong to that stage, is prohibited: it makes a claim about what the stage produces that the image does not support.
- The visual MUST NOT introduce a second interaction, with ONE bounded exception. It has no controls, no hover states, and no focus targets of its own; the rail is the only element that DRIVES the section.
- **Amended 2026-09-04 (Decision Log):** where the visual is an approved representative product demonstration, it MAY carry a single **non-committing enlarge affordance** — one focusable control that opens the expanded view. It MUST NOT change the selected stage or any other section state. Nothing else inside the visual may gain a control, a hover state, or a focus target.
- Accumulation MUST be legible without motion. Under `prefers-reduced-motion: reduce` the selected stage's fully accumulated state appears at once (Section 46.5), and a stage selected directly from a distant stage resolves to the correct accumulated state without animating the intervening ones.
- Where the visual column cannot hold the visual at full legibility, the two columns reflow to one full-width column before any content is collapsed or stacked (Section 35.1). A distinct compact composition is authored rather than the wide drawing being scaled (Section 48.3).
- The visual MUST carry the section's meaning in the document as well as on screen: the per-stage meaning is stated in visible text beside it, so comprehension never depends on reading the drawing (Section 46.2).

**Accessibility and reduced motion**
- Each selector MUST be operable by keyboard, with a visible focus ring that is never clipped.
- An ordinal marker MAY take `--jp-brand-amber-active` as its stage becomes active and settle back to the resting `--jp-brand-amber` (Section 8.1.1).
- Under reduced motion, selection resolves instantly: the chosen stage's complete copy appears with no travel and no illumination, and the interaction itself MUST continue to work (Section 46.5).

## 46.9 Scroll-driven sequential process reveal (process scrollytelling)

Status: APPROVED (2026-08-20). REVISED the same day from the scroll-driven process accordion first recorded under this section — see the Decision Log; the accordion presentation is superseded, its interaction principles carried forward here. Does NOT supersede Section 46.8, which remains the approved pattern for stage selectors.

**Its mechanics are used by the pinned presentation of Section 46.12 (2026-11-09)**, which amends this section's indicator rule for that pattern only: there the tab rail is real navigation that moves the scroll position. **As of 2026-08-25 this section has no current production use of its own.** The homepage five-stage JiTpro methodology — its only approved use — moved to the Section 46.8 stage selector with a Section 46.8.1 accumulating visual, because that section's buyer-journey job is establishing competence, and competence is read from the relationship *between* the stages: a presentation that shows exactly one stage at a time by design forecloses the comparison it depends on. **Section 46.9 is neither superseded nor retired.** It remains APPROVED and available for a surface whose content is genuinely a narrative the visitor moves through rather than a method they should be able to see whole. The 2026-08-20 "first approved use" designation is released; a future use requires a fresh Decision Log entry naming it.

A genuine ordered process MAY be presented as a pinned, scroll-driven sequential reveal: one stage presented at a time inside a spatially stable presentation, with the visitor's own scrolling moving the narrative from stage to stage. This is a sequential narrative, not a menu.

**Source of truth**

- Section-relative scroll progress is the single source of truth. Every participating element — ordinal, title, body copy, any position indicator — derives from that one continuous value (Section 46.3). Competing per-stage animation states are prohibited.
- Scroll-linked animation SHOULD be continuous: the reveal tracks the visitor's scroll physically, so slow scrolling reveals slowly, fast scrolling progresses quickly, and scrolling backward reverses the sequence naturally. Discrete threshold-fired state switching is the failure mode this rule exists to prevent.
- No timers, no autoplay, no auto-cycling, and no permanent progression state. This is not autoplay: progression is directly controlled by the reader's own scrolling, in both directions.

**Presentation**

- One stage is presented at a time. Each stage's interval of the region contains an entrance, a generous hold, and an exit — and the hold MUST be the largest part, long enough that the body copy can be read comfortably at a normal scrolling pace.
- Adjacent stage transition windows may overlap only at visually negligible opacity; two stage titles or bodies must never be simultaneously readable (clarified 2026-08-20). A very brief neutral moment between stages — release, clear, reveal — is preferred over a readable crossfade.
- All stage copy remains present in the document, in reading order, at all times. Visibility is a visual state, never a content state.
- A restrained position indicator (for example `01 / 05`, or minimal neutral ticks) MAY accompany the active stage for orientation. It MUST remain subordinate to the stage and MUST NOT become navigation.

**Stable geometry**

- A deliberately tall outer region supplies the scroll distance; a pinned presentation inside it remains spatially stable in the viewport.
- The outer region's dimensions never change, document height is never animated, document flow outside the region never shifts, and no interaction causes page-level jerk. All stages share one stable presentation footprint; the content changes inside it.

**Motion**

- Permitted: opacity, clip/reveal, and small vertical entrance/exit offsets, directly scroll-linked or gently eased.
- Prohibited: bouncing, spring overshoot, scaling, rotation, pulsing, decorative glow, and large translations (Section 46.4).

**Responsive**

- Desktop and tablet MAY use the pinned architecture.
- Narrow viewports SHOULD present the stages sequentially in normal document flow: all copy visible, no interaction required, no sticky trap, no artificial page height, and no horizontal scrolling. The pinned presentation is cinematic; the narrow presentation prioritizes reading.

**Reduced motion**

- The normal-flow sequential presentation is used: no pinning, no scroll-linked animation, and no interaction required to access any copy (Section 46.5). Content and reading order are identical to the pinned presentation.

**Accessibility**

- DOM reading order is the process order and is never affected by the visual state. Assistive technology receives the complete process, in order, with no interaction required.
- Accordion button semantics (`aria-expanded`, `aria-controls`) are NOT used — they would misdescribe a narrative presentation as a disclosure widget.
- No precision scrolling may be required to reach any content: standard keyboard scrolling drives the same progression in the pinned presentation, and the narrow and reduced-motion presentations require no interaction at all.


## 46.10 Step disclosure list

Status: APPROVED (2026-11-05). First approved use: the homepage *Know what's coming* steps. Does NOT supersede Section 46.8 or Section 46.9.

**No current production use (2026-11-06).** The homepage steps moved to the Section 46.11 sticky step stack (Decision Log 2026-11-06). This pattern stays APPROVED for a future use, which starts from this section.

A short ordered process MAY be presented as a vertical list of steps whose titles are always visible and whose descriptions are disclosed on demand. This is a disclosure list, not a stage selector: there is no single active index and no reserved content area. Each row discloses its own description.

**Rows**
- One full-width row per step, in process order, separated by the surface's hairline (on light, `--jp-ink-secondary` at 20%). Hairlines sit between rows only.
- Each row is one real control: the ordinal (Section 48.9), the title, and one trailing chevron from the approved icon library, sized to the title and hidden from assistive technology (Section 48.4). The whole row is the target, never only the chevron.
- On an approved light surface, hover and keyboard focus use the Section 46.8 light-surface row treatment: a subtle `--jp-ink-secondary` wash (7%) and a `--jp-background` focus outline. Amber is prohibited (Section 8.8).
- Titles keep the strongest ink in both states. The open state is expressed by the description being present and the chevron turned, so it never depends on hue.

**State**
- Every row starts collapsed. Each row's open state is its own boolean; its chevron and its description derive from that one value (Section 46.3). Rows open and close independently.
- Click, tap, Enter, and Space all toggle the row. Expansion is manual only: no scroll-driven, timed, or automatic expansion without a further Decision Log entry.
- Semantics: the title is a heading containing a `button` with `aria-expanded` and `aria-controls` naming its description region. A collapsed description is removed from the accessibility tree and tab order.

**Motion**
- The description opens with a short height reveal (about 200 ms, gentle ease-out), and the chevron turns with the same duration and easing. No bounce, overshoot, scaling, or fade-in delay (Section 46.4). The copy is readable as soon as it is revealed (Section 46.2).
- Under `prefers-reduced-motion: reduce` the description appears and disappears without transition; the interaction is otherwise identical (Section 46.5).

**Disclosed content (amended 2026-11-06, Decision Log; superseded the same day by Section 46.11, no current use)**
- A row discloses its description and nothing else, with one exception: on the homepage, *03 Build the chain.* also discloses the Build-the-chain comparison beneath its description, and from `lg` that one panel MAY break out to the full content width. The comparison's own marks are inspectable; the row's open state is still the only thing the row control changes. No other row gains content. *(Direction changed 2026-11-07, Decision Log: the comparison is withdrawn from the approved direction. Step 03 will instead disclose the single JiTpro Procurement Chain for Custom Steel Windows and Doors (Section 51). The comparison stays live until that replacement is built, tested and visually approved.)*

## 46.11 Sticky step stack

Status: APPROVED (2026-11-06, replacing the same-day step snap sequence). First approved use: the homepage *Know what's coming* four steps. Does NOT supersede Section 46.8, 46.9 or 46.10.

**No current production use (2026-11-09).** The homepage section that used this pattern was replaced by the audience section (Section 54). Its implementation stays in the codebase, unrendered, and is preserved at tag `homepage-four-step-stack-2026-11-09` (`docs/archive/homepage-four-step-stack.md`). This pattern stays APPROVED. A future use starts from this section. The stack's intro panel continues on the homepage as the standalone *How we do it* band, which does not stick (Section 54.1).

A short ordered process MAY be presented as a stack of full-width panels, one per step, that the reader's own scroll lays one over another: each panel holds still as it reaches the top of the view and the next rises from below to cover it. Scrolling up uncovers them in reverse. Before and after the stack the page scrolls normally.

**Panels**
- One opaque full-width panel per step, in process order, on the section's existing surface, with that surface's hairline along its top edge. Panels MAY alternate between two approved surfaces of the same act so each rising panel reads against the one it covers (homepage: white / light / white / light, Decision Log 2026-11-06). Every panel uses one treatment: ordinal and count (`01 / 04`, Section 48.9), title, description. No cards, imagery, gradients, shadows or ornament, with one exception: each incoming panel MAY cast a single tight upward shadow from its top hairline onto the panel it covers, coloured from an approved token, never a card shadow (homepage values, Decision Log 2026-11-06).
- All copy is always visible. Nothing is disclosed, hidden or revealed by scroll position; the only change is which panel lies on top.
- From `lg` a panel is at least one view tall below the sticky navigation. A panel whose content needs more MAY grow, is never clipped, never given an inner scroll container, and is never covered before its last line has been in view.

**Mechanism**
- `position: sticky` only, the panels sticking inside their own list so the stack ends with its last panel. **Prohibited:** scroll snapping, wheel/key/touch interception, scroll locks, timed or automatic transitions, scroll-linked animation of the panels, and scroll-jacking libraries. The movement IS the reader's scroll; the reader can rest anywhere.
- Active only from `lg`, on a view at least 40rem tall, and when `prefers-reduced-motion` is not `reduce` (Section 46.5). Otherwise the panels are ordinary content in the same order.
- Interactive content inside a panel keeps working, and any popover it opens mounts outside the stack so a rising panel cannot cover it. Keyboard, find-in-page, anchor links and history behave as on any other content; headings and reading order are the process order.
- At most one such stack per page.
- **An intro panel (amended 2026-11-06).** The stack MAY open with ONE unnumbered panel that sets up the process: same panel treatment and dimensions, no ordinal or count, outside the numbered list, covered by the first step as each step covers the one before. It carries only approved copy at existing registers, and MAY take the act's dark band tone so the first step reads rising over it (homepage: Decision Log 2026-11-06).

## 46.12 Audience selector with tabbed content stage

Status: APPROVED (2026-11-09). Direction supplied by Jeff Kaufman. First approved use: the homepage audience section (Section 54). Does NOT supersede Sections 46.8–46.11.

A section MAY let the reader say who they are and then show tabs written for that reader. Two controls drive it: one **audience control** and one **tab rail**. Tabs are topics, not a progression, so they carry no ordinals (Section 48.9 does not apply). Where an audience's tabs read in an order, the copy carries that order.

**State**
- The whole presentation derives from one state value: the selected audience and the selected tab within it (Section 46.3). No other state exists.
- The section opens on its default audience and that audience's first tab. Changing the audience selects the new audience's first tab at once. Tab selections are not remembered per audience.
- Each audience shows only its own tabs. Audiences need not have the same number of tabs.
- Nothing happens on entry: no autoplay, no guided progression, no timers (Section 46.8, entry). **Scroll listening is permitted only for the pinned presentation below (amended 2026-11-09)**, where the reader's own scroll position is the input.

**The audience control**
- A native `<select>`, so keyboard, touch and assistive technology get the platform's own behaviour. A custom listbox is not approved.
- **It is introduced by a label, not set as display type (revised 2026-11-09).** The section heading is a small eyebrow: the data face, bold, uppercase via CSS with increased tracking (Section 7.7). The control sits beside the eyebrow from `sm`, vertically centred on it, and below it on narrower views. *Superseded the same day:* the control as the heading's second line at the heading's own register, which made the heading two lines of display type.
- **It is a defined field at a moderate register.** The heading face, semibold, at 1rem (base), 1.125rem (`sm`) and 1.25rem (`lg`). A 1px border, `rounded-lg`, horizontal padding of about 1rem, and a trailing `ChevronDown` from the approved icon library, sized to the type and hidden from assistive technology (Section 48.4). The field and its chevron are the affordance.
- It is as wide as its longest audience name (the native behaviour), so the field never changes size when the audience changes. It never truncates and never wraps.
- **On a light surface:**
  - The name is in the strongest ink (`var(--jp-background)`) over a transparent fill.
  - The border is `--jp-ink-secondary` at 70%, which is about 3.4:1 on `--jp-surface-light`. That clears the 3:1 interface-component minimum (Section 8.8).
  - On hover and keyboard focus the border moves to the strongest ink (moving up the existing scale, Section 8.8). Keyboard focus also takes the light-surface focus outline: `--jp-background`, offset clear of the border (Section 46.10).
  - Amber is prohibited (Section 8.8).
  - **The dark-surface treatment is not yet specified.**
- The heading carries the selected audience's name for assistive technology, so the heading is complete when read alone. The control has its own accessible label.
- Hit area at least 44 by 44 CSS pixels (Section 34.1).

**The tab rail**
- A horizontal rail of `rounded-full` pills: the Section 46.8 selector treatment, expressed in ink on light surfaces (Section 46.8, light amendment).
  - **Active:** a 1px border in the strongest ink, a wash of the strongest ink at about 5%, and a semibold label in the strongest ink.
  - **Inactive:** the same footprint through a transparent border, with the label in `--jp-ink-secondary`. On hover and focus it brightens to the strongest ink over a 7% `--jp-ink-secondary` wash.
  - The active tab is carried by geometry (the enclosure), weight and ink contrast, never by hue.
- Labels are in sentence case, in the body face (Sections 7.7, 48.1). Every label stays visible. Where one row cannot hold them all, the pills wrap to further rows. They never shrink, truncate or scroll horizontally (Section 46.8).
- Hover and focus show availability only; they never select a tab, because each tab drives a full content stage (Section 46.8). Click, tap, Enter and Space select it.
- **Semantics:** the WAI-ARIA tabs pattern with manual activation. `role="tablist"` with an accessible label; each tab is a `button` with `role="tab"`, `aria-selected` and `aria-controls`, using a roving tabindex. Left and Right arrows move focus and wrap around; Home and End go to the first and last tab. Enter and Space select. Tab leaves the rail for the active panel (`role="tabpanel"`, labelled by its tab).
- Each pill is at least 44px tall (Section 34.1).

**The content stage**
- The divided form: the copy column on the left (the tab's headline as `h3`, then its description) and the visual column on the right. From `lg` the two columns are equal, so the visual is about half the content width, and they are **top-aligned**: the headline starts level with the visual's top edge (revised 2026-11-09, superseding vertical centring). Below `lg`, one column: copy, then visual.
- **No reflow.** Every audience's rail shares one grid cell, and every tab's panel shares another. The section is always the height of the tallest rail and the tallest panel, and does not change when the tab or the audience changes (Section 46.8).
  - Inactive rails and panels are `visibility: hidden`. They stay in the document, so search engines receive every audience's copy (Section 46.8), but they leave the accessibility tree and tab order, because the tabs pattern exposes each panel through its tab.
- The visual column holds a fixed 16:10 aspect ratio (revised 2026-11-09 from 4:3, which made the stage taller than its copy needs). It is sized by the column width, never by a fixed height.
- **Compact on desktop (2026-11-09).** At common desktop views (1440 × 900 and 1920 × 1080), the whole section aims to fit within one view below the sticky navigation: eyebrow and control, rail, hairline, copy and visual. This is achieved by spacing and proportion alone. A fixed or viewport-locked height is prohibited. On smaller views, or at increased text zoom, the section takes its natural height and clips nothing.
- **Transition:** the copy fades out, then the incoming copy fades in, rising about 8 px (about 150 ms, then 200 ms; revised 2026-11-09 so two tabs' copy is never visible together). The visual column is a **vertical sliding viewport (amended 2026-11-09)**: the audience's visuals sit in one vertical track, and the incoming visual moves upward into place (about 450 ms, ease-out), so a later tab always arrives from below. Nothing scales, rotates or bounces (Section 46.4). Under reduced motion selection is instant, and the interaction is otherwise unchanged (Section 46.5).

**The visual column**
- Until a tab's visual is specified and approved, it keeps the **reserved placeholder** (Section 46.8.1). This is the methodology figure's frame:
  - a 1px border in `--jp-ink-secondary` at 25%, over a `--jp-ink-secondary` fill at 4%;
  - a data-face *Reserved* label;
  - one line naming the visualization the area is held for.
- No illustration, icon, imagery, sample data or ornament (Sections 47.4, 48.8). It is hidden from assistive technology, because the copy beside it carries the meaning (Section 46.2).
- **The visuals are NOT yet specified.** Before any is built, this document MUST specify:
  - what it shows;
  - whether one audience's visuals accumulate as one system (Section 46.8.1);
  - its motion (Sections 46.1–46.6);
  - its provenance (Section 48.10).
- The visual has no controls of its own (Section 46.8.1).

**Pinned scroll-driven presentation (APPROVED 2026-11-09)**

Where the view allows, the section MAY pin while the reader's normal scrolling advances through the selected audience's tabs. It adopts the mechanics of Section 46.9, with the amendments stated here.

- **Mechanism.** A tall scroll region holds a `position: sticky` presentation (header, rail and stage) just below the sticky navigation. The region's extra height is the scroll distance the tabs consume. The presentation releases when the last tab has been held, and scrolling up reverses the sequence. **Prohibited:** wheel, key or touch interception, scroll snapping, scroll locks, and scroll-jacking libraries (Sections 46.9, 46.11). The movement IS the reader's scroll.
- **One source of truth: scroll selects, transitions complete (revised 2026-11-09).** Section-relative scroll progress selects the tab, and nothing else (Section 46.3). Copy and visual then move to that tab's **complete resting state** through short, self-completing CSS transitions, the same ones the unpinned section uses. **No partial state can persist when scrolling stops:** the copy is always fully opaque and the visual always shows exactly one whole panel. This amends Section 46.9's *continuous scroll-linked animation* rule for this pattern only. *Superseded the same day:* opacity, offset and track position tied continuously to scroll, which left half-faded copy and a visual caught between panels wherever the reader stopped.
- **Zones and switching.** Each tab owns one step of scroll (the first and last own three-quarters of a step), and the tab changes when the reader crosses the boundary between zones. A small hysteresis band (about 6% of a step) around each boundary stops a reader resting on it from flickering between tabs. A fast scroll that crosses several zones selects the zone it lands in, and the transition goes straight there. The last tab's zone ends at the region's end, where the section releases.
- **The transition.** The outgoing copy fades out (about 150 ms). The incoming copy fades in and rises about 8 px (about 200 ms, starting as the outgoing copy finishes), so two tabs' copy is never readable at once (Section 46.9). The visual track slides one whole panel per tab (about 450 ms, ease-out), the incoming visual rising into place. A transition interrupted by a further change retargets smoothly and still finishes at a resting state.
- **The rail is real navigation (amending Section 46.9's indicator rule for this pattern only).** Clicking or tapping a tab, or selecting it with Enter or Space, selects it at once and scrolls the page smoothly into that tab's zone. While that scroll is under way, the tabs it passes are not selected, so the transition goes straight to the chosen tab. Scroll position and selection therefore always agree, and continued scrolling resumes from the chosen tab. The rail and the audience control stay stationary while pinned.
- **Audience change while pinned.** The new audience opens on its first tab: the page moves instantly to the start of the region. The region's height follows the new audience's tab count, so three tabs consume less scroll than four.
- **When it applies.** All three must hold: from `lg`; when `prefers-reduced-motion` is not `reduce`; and when the presentation's measured height fits the view below the sticky navigation. That last condition is re-measured on resize and zoom. Otherwise the section is the ordinary, unpinned tabbed section above, in normal document flow, with no scroll-driven behaviour and no artificial height. At increased zoom the presentation therefore never pins with clipped content.
- **Accessibility.** Unchanged from above: WAI-ARIA tabs, keyboard selection, visible focus, and every panel reachable through its tab. Keyboard scrolling (arrows, Page Up/Down, Space) drives the same progression as the wheel.

## 46.6 User control

Where an animation runs longer than a few seconds it SHOULD resolve once and stop rather than loop indefinitely, and SHOULD offer an explicit replay control. Perpetual motion in peripheral vision is a cost paid by every reader on every visit.

**Recorded exception withdrawn (founder direction, 2026-11-12):** the homepage *Project owners → Better decisions* visual looped for part of 2026-11-12; by the founder's later brief the same day it plays once and rests, like every other visual (Section 54.4.5). No visual loops; any that would needs its own recorded decision.

---

# 47. Visual Hierarchy Standard

Purpose: Define the qualities JiTpro must project, so visual decisions can be judged against something other than taste.

## 47.1 JiTpro should feel

- **Premium** - considered, and expensive to have made.
- **Executive** - respectful of a reader who decides rather than browses.
- **Disciplined** - consistent to the point of being predictable.
- **Technical** - precise, measured, construction-literate.
- **Purposeful** - every element earns its place.
- **Confident** - never straining for attention.
- **Calm** - the interface does not manufacture urgency; real project conditions do.
- **Construction-specific** - recognizable to someone who builds, not to someone who buys software.

## 47.2 JiTpro should never feel

- **Generic SaaS** - interchangeable with any other dark dashboard product.
- **Gaming** - glowing, neon, high-energy, score-like.
- **Playful** - cute, illustrated, informal.
- **Neon** - saturated color used for excitement rather than meaning.
- **Over-animated** - moving because it can.
- **Busy** - many competing elements at similar weight.
- **Decorative** - visual elements carrying no information.

## 47.3 How hierarchy is established

In priority order:
1. Typography - size, weight, and the relationship between a statement and its explanation.
2. Spacing - proximity, grouping, and generous separation between ideas.
3. Alignment - a consistent left edge across sections reads as discipline.
4. Contrast - light against dark, dense against open.
5. Color - **last**, and only for what genuinely deserves attention.

A layout that requires color to be understood has failed at steps 1-4.

## 47.4 The restraint test

Before adding any visual element it must survive one question: *what would be lost if this were removed?*

If the answer is "it would look plainer," remove it. Plainer is the goal.

---

# 48. Component Consistency Standard

Purpose: Define the shared conventions that make separate surfaces read as one product.

**Visual consistency is more important than novelty.** A component that is slightly worse but consistent with the rest of the product is preferred over one that is slightly better and unlike everything around it. Novelty in a single surface is a defect, not a contribution.

## 48.1 Buttons

- One primary action per surface. A second amber button competing with the first is prohibited.
- The primary action uses Brand Amber. Secondary actions are quiet - text or hairline-bordered - and MUST NOT approach the primary in visual weight.
- Buttons MUST be sentence case (Section 7.7).
- Hover MUST be a single restrained gesture. Multiple simultaneous hover effects are prohibited.
- **The approved hover gesture for a primary amber action is the color change from `--jp-brand-amber` to `--jp-brand-amber-active`** (Section 8.1.1, approved 2026-08-06). That change IS the gesture. Lift or translate, shadow or glow intensification, and movement of a nested icon MUST NOT accompany it, and MUST NOT be substituted for it.
- Focus MUST be visibly indicated with a high-contrast outline that clears the button edge. Focus indication is not optional and MUST be verified with real keyboard navigation, not programmatic focus.
- **Keyboard focus on amber controls, and on appropriate dark-surface controls, uses `--jp-text-primary`** (approved 2026-08-06), unless another approved accessibility rule applies. An amber outline on an amber control is low-contrast against the very control it marks. Outline offset MUST be preserved so the ring clears the control edge. No focus-specific color token exists and none is to be created.
- Touch targets MUST meet the minimum defined in Sections 34 and 36.

## 48.2 Cards

- Cards are for genuinely grouped content, not for visual variety.
- One card style per surface. Multiple competing card treatments on one page are prohibited.
- Cards MUST NOT be colored to create interest (Section 8.1).
- Prefer hairline separation and whitespace over a card when the content is not truly a discrete unit. Most content does not need a card.

## 48.3 Timeline

- The timeline is a JiTpro signature element and MUST remain construction-literate rather than abstract.
- Structure uses Brand Amber; the active element uses Active Amber (Section 8.1.1). **On an approved light surface, timeline and schedule structure uses ink hierarchy instead (amended 2026-08-25)** — load-bearing information takes the strongest ink, structure the secondary ink, supporting information the muted level — because the amber tokens do not meet the contrast requirement on that ground (Section 8.1.1). The terminus or active element is then expressed by ink weight rather than by hue. This amendment is scoped to light surfaces; on dark surfaces this bullet is unchanged.
- A moving indicator MUST NOT obscure the milestone it refers to. It stops adjacent to the milestone with a small visual gap.
- Every element of the timeline animation derives from one shared state (Section 46.3).
- Milestone labels MUST be legible at every supported width. Where a wide layout cannot hold them, a distinct compact layout is provided rather than shrinking type past legibility.

## 48.4 Icons

- Icons support meaning; they never fill space.
- One icon library (`lucide-react`). Mixing icon families is prohibited.
- Icons MUST be sized to their adjacent type, never oversized.
- Decorative icons MUST be hidden from assistive technology.
- Icons MUST NOT substitute for a label.

## 48.5 Badges

- Badges are for genuine status, never for emphasis or decoration.
- Pills and badges MUST NOT be used to make ordinary text look important.
- Badge color MUST carry semantic meaning (Section 8.3), and meaning MUST NOT be conveyed by color alone (Section 8.7).

## 48.6 Section spacing

- Sections share a consistent vertical rhythm and a consistent horizontal container. A shared left edge across every section is a primary signal of discipline.
- **Approved exception (2026-08-08):** a centered editorial statement standing alone in its own section (Section 7.7) deliberately departs from the shared left edge. The departure is the signal - it reads as a pause only because every ordinary section continues to hold the shared edge, so it MUST remain rare. The same narrow allowance covers a deliberately centered final-CTA composition (Section 7.7, centered CTA supporting copy), and the hero's centered H1 composition (approved 2026-08-27, Decision Log; an earlier 2026-08-26 allowance for a centered organizing statement was withdrawn the day that statement was removed). It also covers a centered figure statement introducing a full-container figure (Section 7.7, centered figure statement, approved 2026-08-27) - a departure inside a section rather than between sections, and bounded to one per section for that reason. And it covers the flanked thesis statement (Section 7.7, the flanked form, approved 2026-08-27), which is bounded to one per page; where that statement sits inside an already-centered composition it raises no left-edge question at all.
- Section boundaries SHOULD be expressed through spacing and hairline borders, not heavy dividers or alternating decoration.
- Where adjacent sections share a background, the transition MUST be seamless. A visible seam between two surfaces intended to read as one is a defect.

## 48.7 Accent usage

- Amber marks what deserves attention. Its effectiveness is a function of how little it is used.
- No surface should carry more than a small number of amber elements. If everything is accented, nothing is.
- Amber MUST NOT be used merely to indicate that something is interactive.

## 48.8 Illustration philosophy

- JiTpro does not use stock photography, illustrated characters, or generic technology imagery.
- Visuals MUST be purpose-built, informational, and construction-specific.
- Prohibited: hard hats, blueprints, skyline silhouettes, abstract node graphs, glowing networks, fake dashboards, and fabricated product screenshots.
- **The crane prohibition is narrowed (2026-08-25).** What is prohibited is the *cliché* — a crane, or any construction machine, used as a generic visual shorthand meaning "construction". A crane MAY appear in approved documentary photography (Section 17.1) when it is **performing the specific work the section is arguing about** and the section would be weaker without it. The test is the one this section already applies: if the image would be equally at home on any other company's site, it is wrong; if it is the literal field condition the surrounding copy has just explained, it is evidence. Each such use is approved individually and recorded in the Decision Log.
- A visual should show a real mechanism the reader recognizes from their own work. If a visual would be equally at home on any other company's site, it is wrong for JiTpro.
- **Representative interactive product demonstrations are a distinct, approved category (2026-09-04, Decision Log).** What this section prohibits is an image presented as a capture of something it is not. A JiTpro application screen implemented as HTML/React from constructed fixture data is not a screenshot and is not presented as one; it is a demonstration, resolution-independent by construction, and it is approved for the representative screens. Fabricated screenshots — images dressed as captures of a product state that does not exist — remain prohibited without exception.
- **The amber house render is approved as the homepage hero's background atmosphere (2026-09-03, Decision Log) — a bounded exception to the informational bar above.** It is a purpose-built JiTpro render, not stock: the finished built work at night in the brand's amber light, first shipped in the original cinematic hero. The exception is scoped to the homepage hero, and the treatment that keeps it subordinate to the copy — restrained opacity, the masked top edge, the `lighten` merge into `--jp-background`, the dark scrim under the copy column, `aria-hidden` — is part of the approval, not an implementation detail. It argues context, never mechanism, and it MUST NOT migrate to other surfaces or gain informational annotations without a new decision here.
- **The render is drawn whole, never cropped (amended 2026-09-04, Decision Log).** The layer takes the render's intrinsic ratio, so the entire house is visible at every width; it is never stretched to a ratio it was not authored at, and it is never cropped to a fragment of itself. Full-bleed below `lg`; from `lg` up the rendered width is capped and centered, and `--jp-background` extends past its flanks on wide and ultrawide screens rather than the composition enlarging without limit. The overlays serve the copy, not the frame: the scrim is sized to the copy column rather than the surface, and the bottom hand-off does its work in the final quarter so it resolves to `--jp-background` at the section edge without erasing the render above it.

## 48.9 Section step and sequence numbers

Status: APPROVED (2026-08-06).

Ordinal markers that number the steps or stages of a section - `01`, `02`, `03` - are one component role and MUST carry one convention.

- Step and sequence numbers use `--jp-brand-amber` at a restrained opacity. They are structural markers, not accents competing for attention (Section 48.7).
- **On an approved light surface the marker takes the light ramp's muted level instead (amended 2026-08-26)** — `--jp-ink-secondary` at or above the Section 8.8 opacity floor — because the amber tokens do not meet the contrast requirement on that ground. This is the same convention expressed in the surface's own hierarchy, not an unrelated one; the bullet above is unchanged on dark surfaces, and the two are not a per-section choice.
- Equivalent numbering in different sections MUST NOT use unrelated conventions. Amber in one section and a neutral gray in another is a consistency defect, not a per-section choice (Section 48 preamble).
- The number is set in the data face at small size with increased tracking (Sections 7.3, 7.7). It is a label, not a metric.
- Numbering MUST NOT be the only expression of sequence. The copy carries the order on its own (Section 8.7).

## 48.10 Figure provenance

Status: APPROVED (2026-08-25).

Any figure carrying numbers, names, or dates that a reader could mistake for evidence MUST make its provenance unmistakable. This section exists because a figure is read as a claim about the world, and a figure whose status is unstated is read as the strongest status it could plausibly have.

**The three statuses.** Every element in a figure is exactly one of these, and the distinction MUST survive into the rendered page:

| Status | Meaning |
| --- | --- |
| **Representative** | Constructed to reflect realistic conditions, sequencing, activities and durations. Not drawn from any actual engagement. |
| **Illustrative** | Added to demonstrate the method, with no basis in the underlying dataset at all. |
| **Methodological** | Pure diagram — the shape of the method, carrying no data of any kind. |

**Prohibited without exception**
- Presenting representative or illustrative content as a **customer result, client outcome, case study, or actual project record**.
- Describing a synthetic dataset as "real", "actual", "anonymized real", or as originating with a client.
- Fabricating a **count** of anything the dataset does not contain — findings, gaps, items resolved, projects served.
- Deriving a figure the source data cannot support, or presenting a derived value in a register that implies a precision the source does not carry.

**Required**
- **One quiet provenance line**, placed with the figure, in the caption register. One sentence. A figure is not a legal document and MUST NOT be burdened with a disclaimer block, a multi-key legend, or per-element asterisks.
- **Where a figure mixes statuses, the visual register MUST separate them.** Data-derived values and content with no basis in the data MUST NOT be rendered in the same visual weight; the element with weaker provenance is drawn *lighter*, never emphasized because it is the one currently being narrated.
- **A derived quantity MUST be expressed in the unit the source actually carries.** Where converting to a more familiar unit requires information the source does not hold — a work calendar, a holiday schedule, a rate — the conversion MUST NOT be performed and rendered as though it were derived. State the quantity in its native unit, or state the approximation as an approximation.
- **Exactly one kind of quantity per figure may be an absolute date.** Every other temporal value is a duration or an offset and MUST be typeset in a different register, so two quantities of different kinds never look like the same kind of thing.

**Representative product demonstrations are exempt from the provenance line (2026-09-04, Decision Log).** The caption beneath the JiTpro representative screens is withdrawn site-wide with no replacement. This exemption is scoped to those demonstrations and to nothing else: every other figure carrying numbers, names, or dates remains bound by this section in full.

**Product interface captures (2026-08-27).** A screenshot of the real product is not exempt from this section — the interface is authentic, but the project, quantities, names, parties, and dates inside it are content, and a reader reads them as a record. Where a capture carries any of these it MUST carry the provenance line, and the line MUST be placed with the figure rather than in a page footnote. A capture whose data is constructed is **representative**; describing it as a customer project, a case study, or an actual engagement is prohibited under the bullets above.

First approved use: the homepage methodology figure (Decision Log 2026-08-25). First product-capture use: the methodology stage screens (Decision Log 2026-08-27).

---

# 49. Design Decision Process

Purpose: Define how visual decisions are made, so conventions stop being invented inside components.

## 49.1 The required sequence

All future visual work MUST follow this order:

1. **Review** `docs/design/JiTpro_Design_System_v1.0.md`.
2. **Determine whether an existing standard already covers the situation.** If it does, conform to it. Preference, habit, and "this looks better here" are not grounds for deviation.
3. **If a new visual convention is genuinely required:**
   a. Update the Design System **first**.
   b. Record the decision in the Decision Log.
   c. Then update production code to match.

**A new visual convention MUST NEVER be invented inside a React component.**

## 49.2 Why the order is non-negotiable

A convention invented in a component is invisible. It does not announce itself, it is not reviewable as a decision, and the next author cannot tell it apart from an approved standard. Five components each making a locally reasonable choice is exactly how a single brand color becomes five values - the specific failure that produced this section.

Updating the document first makes a visual decision an explicit, reviewable act rather than a side effect of shipping a feature.

## 49.3 Handling conflict with existing implementation

When implementation conflicts with this document:
- **Update the implementation.** The document is the source of truth.
- Do **not** update the document to match what the code happens to do. Documenting an accident does not make it a decision.
- Do **not** silently create a new visual convention to resolve the conflict.
- If the standard itself is genuinely wrong, change the standard through 49.1 - deliberately, with a Decision Log entry - and then change the code.

## 49.4 Migration of pre-existing code

Code written before a standard was approved is non-conforming, not exempt.
- New code MUST conform immediately.
- Modified code SHOULD be brought into conformance as it is touched.
- Wholesale migration of existing surfaces is scheduled as explicit work and MUST NOT be attempted as an uncontrolled side effect of an unrelated change.

### Recorded future cleanup

Non-conforming code identified during a migration but deliberately left out of its scope is recorded here so it is not lost and not silently absorbed into an unrelated change.

| Recorded | Item | Why deferred |
| --- | --- | --- |
| 2026-08-06 | `src/index.css` carries nine unused hero keyframes (`heroPulse1-3`, `heroNodeSlow/Med/Fast`, `heroHouseBuild`, `heroWindowPulse`, `heroAmbientGlow`, `heroFlowMove`). They express ambient pulsing and glowing-network effects prohibited by Sections 46.4 and 48.8, and are referenced only by components the current homepage does not render. | Removing them touches legacy surfaces outside the homepage token migration. Scheduled as separate work per 49.4; the migration PR is not broadened to include it. |
| 2026-08-06 | Homepage decorative treatments - grain/noise overlay, amber radial glows, amber top hairline - raise Section 47.4 restraint questions but are conformant once tokenized. | Evaluated in a later visual-refinement pass. The token migration is conformance work, not a redesign. |

## 49.5 Proposing a change

A proposal to add or change a standard should state:
- what is being proposed, precisely enough to implement;
- what problem it solves that no existing standard solves;
- what it supersedes;
- what production code becomes non-conforming as a result.

Approval is recorded in the Decision Log with a date, owner, and rationale.

---

# 50. Long-Form Explainer Page Standard

Status: APPROVED (2026-09-03). Direction supplied by Jeff Kaufman. Scope: long-form explainer pages on the marketing website. The homepage, role pages, the investor sub-site, and application surfaces are governed by their own decisions and are not changed by this section.

Purpose: Define the one approved page type for a reader who has recognized the problem on the homepage but is not yet ready to act. Its job is a single continuous argument, read top to bottom, that moves the reader from *this sounds like my problem* to *starting with one project feels reasonable*.

First approved use: `/learn-more`, the destination of the homepage secondary action *Or click here to learn more* (Decision Log 2026-09-03).

## 50.1 What the page type is

- A long-form explainer page is **one argument in numbered parts**, not a collection of marketing modules. Every section exists to make the next one readable, and a section that could be removed without breaking the sequence does not belong.
- It is **the buyer's page, not the company's**. It explains the reader's condition, the operating philosophy, the method, what the method produces, what changes, who it is for, and how to begin. It is not a founder biography, a feature grid, a pricing page, or a press surface.
- It MUST read as a continuation of the surface that sent the reader there. Voice, palette, type registers, section spacing, and the shared left edge are the homepage's, unchanged.
- **At most one such page exists per audience.** A second long-form explainer competing with the first is a content decision requiring its own approval, not a variation of this standard.

## 50.2 Copy governance

- Section 20.1 applies to this page in full: the retired vocabulary, the operating requirement and its prohibited formulations, the engagement model, the long-lead rules, and the qualitative-audience rule. A page that avoids the retired words by becoming abstract has failed the rule, not satisfied it.
- The reader is the growth-stage general contractor of Section 20.1. **External parties MUST NOT be written as adversaries.** Owners, architects, engineers, consultants, vendors, and subcontractors are participants whose decisions the project depends on. The failure the page names is an unmanaged dependency, never an uncooperative person.
- **Qualification copy MUST disqualify by posture, never by character.** A statement of who the page is not for describes how a company chooses to operate; it MUST NOT insult the reader who recognizes themselves in it.
- Claim strength is governed by Section 20.1: more time, more visibility, more accountability, and fewer preventable field failures. Perfect schedules, guaranteed delivery, and quantified improvement are prohibited.

## 50.3 Numbered sections

- Sections are numbered from `00` and the numbering is continuous. The ordinal takes the Section 48.9 convention without exception: the data face, small, increased tracking, `--jp-brand-amber` at a restrained opacity on dark surfaces and `--jp-ink-secondary` at or above the Section 8.8 floor on the approved light surface.
- **The ordinal MUST NOT be the only expression of sequence** (Section 48.9). The argument reads in order without the numbers; they are wayfinding for a reader who scrolls back.
- Each numbered section carries **one `h2`**, its own primary statement (Section 7.7). Sections do not compete: a section heading is never set at the hero's register.
- Each numbered section MUST expose a stable `id` matching its ordinal slug, because the guide addresses it and a reader may arrive on a deep link.

## 50.4 The in-page guide

The guide is the page's table of contents, and it is a component role with one convention.

- It sits **near the top**, after the opening and the summary, and appears **exactly once** in any given layout. A guide repeated mid-page is not this component and is not approved. **Amended 2026-09-03:** at the wide breakpoint the guide MAY instead be presented as a persistent rail beside the content, under Section 50.9. The two presentations are the same component at two breakpoints, and exactly one of them is rendered at a time.
- It is an **ordered list of in-page anchors**, each showing the section ordinal and the section title. Nothing else: no descriptions, no icons, no progress state, no counts.
- Links MUST be real anchors (`href="#..."`), so they are keyboard reachable, focusable, announced as links, and openable in a new tab. A click handler on a non-link element is prohibited.
- Anchor movement uses the document's existing smooth scrolling and MUST resolve instantly under `prefers-reduced-motion: reduce` (Section 46.5).
- The guide is structure, not accent. Its ordinals follow Section 48.9; the titles are ordinary interface type. Hover and focus are a single restrained gesture (Section 48.1).
- An opening action that sends the reader to the guide is permitted and takes the quiet secondary treatment (Section 48.1). It is a navigation aid, never a second primary action.

## 50.5 Repeated primary actions - amendment to Section 48.1

Section 48.1 requires one primary action per surface. **A long-form explainer page is a sequence of surfaces rather than a single surface**, and the amendment is scoped to this page type only.

- A primary action MAY appear more than once on the page. **Exactly one primary action may appear per section**, and no two may be visible in the same viewport at any supported width.
- Every primary action on the page MUST carry **the same label and the same destination**. Two different primary offers on one page is a positioning decision, not a layout one, and is not approved here.
- Three is the working ceiling: the opening, the section that lowers the perceived commitment, and the close. A CTA between every section is prohibited (Section 47.4).
- Secondary actions remain quiet under Section 48.1 and MUST NOT accumulate. The page carries at most one secondary action.

**Amendment (2026-09-12, revised 2026-09-16 by amendment A11): one lead-magnet offer band after the close.** A Section 20.2 lead-magnet offer band MAY follow the page's closing section. It sits **outside** the numbered sequence and outside the guide: it is not a numbered section, carries no ordinal, and is not listed in the guide or the rail. **Since amendment A11 its action is Brand Amber rather than the Section 26.1 hairline secondary**, and it is therefore subordinated by weight instead of by hue, per Section 20.2: smaller padding, a smaller type register, and no shadow, glow or elevation beside the page's larger commercial primary. Within the meaning of this section the band is still neither a fourth primary action nor a second secondary action, because it is not part of the numbered argument at all: the argument itself still carries at most three identical primary actions and one secondary action, and the band is a separate surface following its close. It remains visually subordinate to the page's commercial offer. At most one such band per page (Section 20.2). Decision Log 2026-09-12 and 2026-09-16.

## 50.6 Approved figures for this page type

Two comparison figures and one sequence are approved. They are the page's only figure types, and no other is to be introduced inside a component (Section 49.1).

**The paired-condition comparison.** Two columns stating the same subject twice: the condition as it is, and the condition under the discipline the page argues for. It is approved for *what you do not control / what you can control* and for *without early control / with early control*.

- The two columns are **typographically equal**. The difference is the words, not the weight. Making the preferred column heavier, brighter, or amber turns an argument into an advertisement.
- **Colour MUST NOT carry the contrast** (Section 8.7, Section 47.3). Semantic tokens do not apply: neither column is a success state or an error state. Structure is hairline and ink.
- The pairing MUST survive a single-column stack. On narrow widths the two halves of a pair stay adjacent so the reader never reads one column of the comparison alone.
- Each column carries a short standing label so the reader always knows which side they are reading.

**The backward dependency sequence.** An ordered figure running from the field need date back through the prerequisites that make it possible.

- It reads **backward by construction**: the field date is stated first and every subsequent step is earlier. A figure that runs forward and is labelled backward is a defect.
- It is a diagram of the method and carries **no dates, no durations, and no counts**, so its provenance is methodological and it needs no provenance line (Section 48.10).
- It MUST be legible without motion (Section 46.2). Any animation derives from one shared state (Section 46.3), and reduced motion renders the resolved figure (Section 46.5).

**Product interface captures.** Where the page shows what the method produces, captures follow Section 48.10 in full, including the provenance line placed with the figure. One provenance line MAY serve a group of captures presented as one figure. Fabricated screenshots remain prohibited (Section 48.8); a stage with no capture shows nothing rather than borrowing a neighbour's (Section 46.8.1).

## 50.7 Surfaces, rhythm, and typography

- The page uses the homepage's surface acts: `--jp-background` for the problem, the approved `--jp-surface-light` for the method, and `--jp-surface` for the bands that summarize or qualify. Alternating surface for variety is prohibited (Section 48.6); each change MUST mark a change of act.
- **Where the persistent rail is present (Section 50.9), the acts are carried by the content column rather than by the full page width.** The rail keeps one constant ground for its whole length, and the act surfaces become full-height panels in the column beside it. This is required, not preferred: a rail that crossed from `--jp-background` into `--jp-surface-light` would be unreadable for the length of the crossing, and no per-scroll recolouring of the rail is approved to rescue it. Below that breakpoint the acts remain full-bleed page surfaces, unchanged.
- On `--jp-surface-light` hierarchy is ink and amber carries no information (Section 8.8).
- The shared left edge holds for every section. The Section 48.6 centered exceptions are available to the page opening and the closing CTA only, and are not repeated between them.
- Amber is spent per section, not per page: Section 48.7 applies to each surface independently, and a page-long amber rhythm of accented headings is a defect.
- **Em dashes MUST NOT appear in customer-facing copy on this page type**, including as `&mdash;`. Sentences are separated by full stops, colons, or parentheses.
- Body copy holds the Section 7.7 measure. A long page makes an over-wide measure worse, not more acceptable.

## 50.8 Accessibility

- Heading levels are continuous: one `h1` for the page, `h2` per numbered section, `h3` below it. Levels MUST NOT be chosen for size.
- Every anchor target MUST be a landmark or a heading a reader lands on with context, never a bare offset element.
- Guide links, in-section actions, and the primary actions MUST all be reachable and visibly focused with a keyboard (Section 48.1).
- All motion on the page respects `prefers-reduced-motion` (Section 46.5).

## 50.9 The persistent guide rail

Status: APPROVED (2026-09-03). Scope: the wide breakpoint of a long-form explainer page. Supersedes the Section 50.4 bullet prohibiting a rail, approved earlier the same day.

A guide that has scrolled out of the viewport is a table of contents the reader cannot use. At widths that can afford the column, the guide is therefore presented as a rail beside the content instead of a block above it.

**Sticky, never fixed.**

- The rail uses `position: sticky` inside the guide's own container. It MUST NOT use `position: fixed`.
- This is not a style preference. A sticky element is bounded by its container, so it enters when the guide area does, releases when the guide area ends, and **cannot reach the site header or the footer, or float over anything outside the guide**. A fixed element has to be taught all of that with measurements that go stale.
- The rail's sticky offset MUST clear the site header, and anchor destinations MUST carry a `scroll-margin-top` that clears it too. Both are derived from the header's actual height, never from a guessed number.

**One presentation at a time.**

- The rail and the in-flow guide are the same component at two breakpoints. Exactly one is rendered at any width; both existing in the layout simultaneously is a defect.
- Below the breakpoint the in-flow guide of Section 50.4 is unchanged. The rail model MUST NOT be forced onto narrow widths.
- The breakpoint is chosen by what the CONTENT column can still carry, not by a device name. A rail that squeezes the content it indexes has taken space from the thing the page exists to deliver.

**The page scrolls, not a pane.**

- The document scrolls normally. The content column MUST NOT become an independently scrolling region: two scrolling panes make a marketing page feel like an application window.
- The rail's own list MAY scroll, and only when the viewport is genuinely too short to hold it. At ordinary desktop heights the whole guide MUST be visible without scrolling inside it.

**The active state.**

- The rail MUST indicate which section the reader is in, and the indication MUST update both on click and on ordinary scrolling.
- **It MUST NOT be carried by colour alone** (Section 8.7). At least two non-colour axes are required. The approved treatment is three: the ordinal steps from its resting opacity to full `--jp-brand-amber`, the title steps up in weight and ink, and a hairline indicator is drawn against the active item. It MUST also be exposed to assistive technology, which is the fourth axis and the only one that does not depend on sight.
- The indicator continues the accent already running through the guide's ordinals (Section 48.9). It does not open a new one, and the rail MUST NOT accumulate further amber (Section 48.7).
- Detection MUST be passive and cheap. `IntersectionObserver` is the approved mechanism; a scroll handler that runs layout work on every frame is not, and no library is to be added for this.

**Accessibility.**

- The rail is a `<nav>` landmark containing an ordered list of real anchors, exactly as Section 50.4 requires. Keyboard reach, focus visibility, and open-in-new-tab all survive.
- Scrolling is the document's own smooth behaviour, which MUST resolve instantly under `prefers-reduced-motion: reduce` (Section 46.5).
- The rail MUST NOT obscure content at raised zoom levels. Because it is sticky inside a column rather than fixed over the page, it reflows with everything else; a rail that overlaps body text at 200% zoom is a defect.

---

# 51. Procurement Chain Visualization Standard

Status: APPROVED (2026-11-07). Direction supplied by Jeff Kaufman (Decision Log 2026-11-07). Scope: the **procurement chain**, a figure that shows one procurement item's backward-scheduled sequence as connected, color-coded chevrons on a calendar axis. It is built first as an isolated component. Placing it on the homepage or any other page requires its own approval and Decision Log entry. *The homepage audience section's general contractor Plan visual is the first such placement (approved 2026-11-10, Section 54.4.2).* This section does not change the full Procurement Schedule (`DemoGantt`), its row renderer (`ScheduleRowMarks`), the `--jpd-phase-*` family tokens, or the homepage Build-the-chain comparison.

**Approved visual reference:** `docs/design/procurement-chain-reference/procurement-chain.html` and `render.png`. The reference is approved for its **visual character**: connected chevrons, distinctive activity colors, subtle gradients and depth, clean typography, clear milestone diamonds, legible duration labels, clean commitment and issue callouts, generous whitespace, and the header and legend composition.

Nothing else in the reference is normative:
- its x coordinates
- its dates and durations, which are not mathematically correct and must never be copied
- its equal-width segments
- its hex values
- its typeface
- its placeholder logo
- its hand-drawn icons
- its callout copy.

Where this section and the reference disagree, this section governs.

## 51.1 Governing principle

**The scheduling engine is authoritative. The figure is a projection of it.**

- Every date, duration, milestone, commitment and issue comes from a `ScheduleItem` resolved by `buildItem()` (`scheduleModel.ts`), over the working-day calendar in `workCalendar.ts`. The figure MUST NOT compute, adjust, round, pad or author a schedule date.
- Every horizontal position is a function of a date, and every width is a function of two dates. No pixel position or width is ever authored.
- Proportional accuracy is mandatory. Durations MUST NOT be distorted to fit a viewport. When the figure is wider than its container, it scrolls (Section 51.9). It never compresses.
- Scheduling calculation and visual presentation are separated by a pure layout function (Section 51.11). The renderer draws the layout and computes nothing.

## 51.2 Data source and the approved scenario

**The chain is one continuous bar.** One procurement item, one bar of sequential activities, never parallel bars, branches or extra lanes. What other parties owe the chain (design information, selections, calculations, approvals, permits) are **commitments above the bar**, never bars of their own. What threatens it are **issues below the bar**.

The figure reads its own demonstration scenario, *Custom Steel Windows and Doors* (`chainScenario.ts`, decided 2026-11-07). It is deliberately separate from the shared schedule fixture, whose Heritage Steel item feeds the full Procurement Schedule, the product register, the schedule lab and the homepage comparison, and which is unchanged. The approved sequence is:

| # | Step | Kind | Working days |
| --- | --- | --- | --- |
| 1 | Buyout | phase | 20 |
| 2 | Submittal Coordination | phase | 25 |
| 3 | Submittal Preparation | phase | 30 |
| 4 | Initial Submittal | milestone | 0 |
| 5 | First Submittal Review | phase | 15 |
| 6 | First Revision Cycle | phase | 12 |
| 7 | First Resubmittal | milestone | 0 |
| 8 | Second Submittal Review | phase | 10 |
| 9 | Second Revision Cycle | phase | 7 |
| 10 | Second Resubmittal | milestone | 0 |
| 11 | Third Submittal Review | phase | 5 |
| 12 | Final Approval | milestone | 0 |
| 13 | Release for Fabrication | milestone | 0 |
| 14 | Fabrication | phase | 180 |
| 15 | Shipping and Delivery | phase | 8 |
| 16 | Required On Site | milestone (fixed) | 0 |

The duration-bearing activities total **312 working days**.

**Review and revision durations (revised 2026-11-07, Decision Log).** Review and revision cycles shorten as comments are resolved: 15 and 12 working days in the first cycle, 10 and 7 in the second, and a 5-day third review. Every other duration, and the fixed Required On Site date of 30 November 2027, is unchanged. This replaced the earlier 15/12 for all three cycles, which totalled 332 working days. *A total of 310 was stated when the change was directed; the approved individual durations sum to 312, so 312 is the recorded total.*

**Milestones add no time (corrected 2026-11-07, Section 51.14).** Activities consume time; milestones record events. The six milestones are zero-duration events that share a date with an activity and add no working day. With every step back to back (`gap: 1`), the span from the first day of Buyout through the Required On Site date is therefore **exactly 312 working days**, the same as the activity total. There is one total, not two. The figure shows what the engine produces and MUST NOT re-derive it.

*Superseded:* this section first recorded that each milestone occupied a working day of its own, giving a 338-working-day span. That was the engine's previous behaviour, and it was an error. The engine has been corrected and the 338-day figure withdrawn (Decision Log 2026-11-07, scheduling correction).

**Informative check, not a source of truth.** On 2026-11-07, running the approved 312-day scenario through the corrected engine with Required On Site fixed at 30 Nov 2027 gives the following. It matches an independent working-day count that shares no code with the engine.
- Buyout starts Mon 31 Aug 2026
- Submittal Preparation ends 17 Dec 2026, and Initial Submittal falls on the same date
- First Submittal Review runs 18 Dec 2026 – 11 Jan 2027; First Revision Cycle 12 – 28 Jan 2027
- Second Submittal Review runs 29 Jan – 11 Feb 2027; Second Revision Cycle 12 – 23 Feb 2027
- Third Submittal Review runs 24 Feb – 2 Mar 2027, and Final Approval and Release for Fabrication fall on 2 Mar 2027
- Fabrication runs 3 Mar – 17 Nov 2027
- Shipping and Delivery runs 18 – 30 Nov 2027, crossing Thanksgiving, and Required On Site falls on its last day.

These values illustrate the engine's behaviour. They MUST NOT be typed into a component or copy. The engine's regression test (`scheduleModel.test.ts`) deliberately pins the earlier 332-day sequence (start 3 Aug 2026) as an engine regression against an independent count, not as the scenario; the scenario's 312-day total is held by the layout tests (`chainLayout.test.ts`).

## 51.3 Horizontal axis: calendar time

- **One calendar-day scale for the whole figure:** `x(date) = (date − domainStart) in calendar days × pxPerDay`. This is the same convention the full Procurement Schedule uses, so the two can never disagree about where a date is.
- **The day slot.** A date D occupies the interval `[x(D), x(D) + pxPerDay)`. Commitment and issue marks sit at the centre of their day slot, `x(D) + pxPerDay / 2`, matching the existing convention. **Milestones are instants, not days** (Section 51.14). A finish milestone sits exactly where its predecessor's work ends on screen, by the shared `workEndX` rule (Section 51.4). In the chain that is the start of the next working day when more work follows, and the end of its date for the final work. A start milestone sits at the start of its date, `x(D)`.
- **Working-day durations, calendar-day widths.** A duration is labelled in working days, the unit the model stores (Section 48.10), and drawn across the calendar days it actually spans. A 15-working-day review that crosses a weekend and a holiday is therefore wider than a 15-working-day review that does not. That is correct, and it MUST NOT be "normalised".
- **Domain.** The domain runs from the first day of Buyout's month to the first day of the month after Required On Site, so the calendar axis starts and ends on whole months. The domain is padded, never the scale.
  - *Shared domain (2026-11-10).* Where several chains are drawn on one axis (Section 54.4.2), the layout takes one shared whole-month domain that contains every item's own. Only the origin moves; the scale, every width and every label tier are unchanged.
- **Scale.** `pxPerDay = max(containerWidth / domainDays, MIN_PX_PER_DAY)`. `MIN_PX_PER_DAY` is one named constant in the layout module, **8** (raised from the initially specified 7 during implementation: at 7, *Revision 2*'s 18-calendar-day chevron could not hold its label). At that scale every duration-bearing step in the approved scenario reaches label tier A or B (Section 51.6), and `chainLayout.test.ts` asserts it. It may only change with a test that proves the tier guarantee still holds.
- **Calendar axis.** A month band sits beneath the chain (month labels, with the year on the first month and on every January), with hairline ticks in the existing `--jpd-grid` and `--jpd-grid-strong` tokens.
- **Non-working-day shading** is not drawn in the first release; the chain is a planning view, like the homepage comparison. If it is added later, it MUST come from `nonWorkingRuns()` and follow Section 51.7's tokens.

## 51.4 Segment geometry

**Visual span.** A duration-bearing step is drawn from `x(startDate)` to `x(nextWorkday(endDate))`, meaning up to the start of the first working day after it ends. This absorbs the weekends and holidays that trail the step, so consecutive phases (`gap: 1`) meet with no visible hole, while real float (`gap > 1`) still shows as a gap of exactly its calendar length. Milestones take no span, so a chevron followed by a milestone and then another activity still meets that activity with no hole.

**One rule for where work ends** (corrected 2026-11-07). A chevron's right edge and the finish milestones that record its completion are both placed by the same pure function of the finish date, `workEndX(date)`:
- **Work that more work follows** ends at the start of the next working day. The chevron reaches across any non-working days in between, so the bar stays continuous. The finish milestone sits there too: on the joint, exactly where the work it completes ends on screen.
- **The chain's final work** has nothing after it to connect to, so it ends at the calendar end of its last day. That is the Required On Site instant, so the Required On Site diamond and date rule land on their own date.

The milestone's date, label and accessible name always state its true date. Only the drawing rule is shared.

*(Superseded twice the same day. First, a dedicated milestone day slot between chevrons. Then a rule that placed a milestone at the calendar end of its date while its chevron was drawn to the next working day. Under that rule, every milestone falling before a weekend or holiday sat days inside its chevron instead of at its end, which is about one placement in four across anchor dates.)*

**Chevron shape.** All values are in CSS px at the figure's base scale and are named constants in the layout module:
- Bar height `H = 56`.
- Point depth `D = round(0.3 × H) = 17`.
- Joint gap `G = 3`. Adjacent chevrons interlock with a constant `G` between one segment's point and the next segment's notch.
- **Each joint is centred on its boundary date** (refined 2026-11-07 during implementation). The slanted joint between two chevrons straddles the date where one activity ends and the next begins, by half the point depth either side. The point a chevron gains on its right is exactly the notch it loses on its left, so every chevron's area equals its span × `H`. The geometry never adds width to a duration, and the chain reads as one connected bar, as in the reference. *(The first text, "drawn inside the visual span", would have left a visible V-shaped hole at every joint.)*
- The first segment has a rounded leading end (radius `H / 2`), also drawn inside its span. Every other segment has a notched leading edge.
- If a segment is narrower than `2D + G`, `D` shrinks for that segment to `(span − G) / 2`. The span is never widened.

**Fill and depth.**
- Each segment fills with a vertical linear gradient. The top stop is the family token, and the bottom stop is the same token mixed toward `--jpd-text` at 12% (`color-mix(in srgb, <token> 88%, var(--jpd-text))`). The gradient only ever darkens, so text contrast is never lower than the token's flat-fill contrast (Section 51.7).
- A drop shadow sits under the bar: offset y 3, blur 4, colour `color-mix(in srgb, var(--jpd-text) 18%, transparent)`.
- No other shadow, glow or gradient.

**Each step stays its own element.** Every segment and every milestone is an independent, inspectable, focusable mark. The chain is never one path, one gradient or one image.

## 51.5 Milestones

**Placement.** At the milestone's instant (Section 51.3): the end of its date for a finish milestone, the start for a start milestone, on the bar's vertical centre line. A diamond overlapping its neighbouring chevrons is expected. The date governs position, never spacing.

**Shape.**
- A diamond `0.46 × H` across, filled with `--jpd-chain-milestone`, with a 2px `--jpd-surface` stroke so it separates from any chevron beneath it.
- Labels sit below the bar: the name in bold strong ink, then the date in the date register (Section 51.8).
- Labels stagger across two rows when neighbours would collide. A label in the second row gets a 1px stem back to its diamond.

**Milestones at the same instant** (for example Final Approval and Release for Fabrication, which share the date Third Submittal Review ends) are stacked vertically at that one x, in sequence order from top to bottom, as Section 51.14 specifies for every procurement schedule view. Their labels merge into one block that lists each name with the shared date. Each remains independently focusable.

**Near-coincident milestones** (different instants whose diamonds would still collide, i.e. closer than one diamond width plus 4px):
- each is drawn at its own true x, overlapping in date order with the later one on top
- labels merge as above
- hit areas are split at the midpoint between the two.

Positions are never nudged apart.

**Required On Site, the controlling deadline, gets distinct emphasis:**
- a diamond `1.35 ×` the standard size, in `--jpd-chain-ros`
- a dashed vertical date rule (1.5px, `--jpd-chain-ros`) through the full height of the figure, from the commitment band to the calendar axis
- a terminal label block to its right: **Required On Site** in bold, the date beneath it, and the qualifier *Fixed* in the muted register.

It is the only milestone with a full-height rule and the only one labelled to the right. It is drawn last, so nothing covers it. The reference's rounded end-cap chevron is withdrawn, because a chevron implies a duration and Required On Site has none.

## 51.6 Label-fit tiers

A segment's label content is chosen by measuring its inner width (visual span minus `2D`, minus 12px padding). Text is never compressed, scaled or clipped mid-word.

| Tier | Condition | Inside the chevron | Below the chevron |
| --- | --- | --- | --- |
| **A** | inner width ≥ icon + 8 + widest label line | icon, then the name (at most 2 lines) | duration |
| **B** | inner width ≥ icon | icon only | name (bold) above the duration |
| **C** | inner width < icon | nothing | duration only if it fits the span; otherwise none. The name and duration remain in the inspector, the screen-reader list and the legend |

- The label is the step's `name` from the model. No display name is invented in the view layer (Section 51.13).
- Duration labels read "N working days" and are centred under the visual span.
- When neighbouring below-bar labels would collide, the later one moves to a second row. They never overlap.
- Icons come from `lucide-react` only (Section 48.4), sized to the label, white on the chevron, and `aria-hidden`:

| Family | Icon |
| --- | --- |
| buyout | `Handshake` |
| coordination | `Network` |
| preparation | `FileText` |
| review | `Search` |
| revision | `RefreshCw` |
| production | `Factory` |
| logistics | `Truck` |

  Milestones carry no icon. The legend's Required On Site entry uses `CalendarDays`.

## 51.7 Color tokens

**Namespace and location.** The chain uses a dedicated sub-namespace, `--jpd-chain-*`, inside the approved product-demo namespace (Decision Log 2026-09-04 (d)). It follows the same precedent as the schedule's `--jpd-phase-*`. These tokens:
- are declared once, in a new file, `src/components/demo/screens/procurement-chain/chainTokens.css`, scoped under `.jpd`
- are imported only by the chain component, by the homepage Step 02 figure (Section 53.1), which reads `--jpd-chain-ros` and `--jpd-chain-rule` so the homepage has one green Required On-Site treatment (amended 2026-11-07, Decision Log), and by the homepage Plan visual (Section 54.4.2, 2026-11-10), which draws chains with them
- are the only place their values appear.

Components reference `var(--jpd-chain-*)`, including in SVG `fill`, `stroke` and `stop-color`, and never a literal (Section 45). The existing `--jpd-phase-*` values are **not** changed. The full schedule and the homepage comparison keep their palette until a separate decision migrates them.

**Activity families.** These follow the reference's hue structure, adjusted so white label text meets WCAG AA (4.5:1) at the lightest point of every gradient:

| Token | Value | Family / role | White text |
| --- | --- | --- | --- |
| `--jpd-chain-buyout` | `#1e40af` | Buyout | 8.72:1 |
| `--jpd-chain-coordination` | `#0e7490` | Submittal Coordination | 5.36:1 |
| `--jpd-chain-preparation` | `#1d5fe0` | Submittal Preparation | 5.58:1 |
| `--jpd-chain-review` | `#7c3aed` | Submittal Review | 5.70:1 |
| `--jpd-chain-revision` | `#5b21b6` | Revision Cycle | 8.98:1 |
| `--jpd-chain-production` | `#c2410c` | Fabrication | 5.18:1 |
| `--jpd-chain-logistics` | `#7c2d12` | Shipping and Delivery | 9.37:1 |
| `--jpd-chain-milestone` | `#0d1730` | All milestones except Required On Site | (mark) 17.76:1 on white |
| `--jpd-chain-ros` | `#15803d` | Required On Site | 5.02:1 |

**Adjustments from the reference, and why:**
- Fabrication `#f28c12` carried white text at 2.46:1. It moves to a red-orange that is clear of the brand amber: 2.41:1 against `--jp-brand-amber`, and never used for illuminated, animated or active states (Section 8.1.1). It is an activity hue, not a third amber.
- Coordination (4.14:1) and Required On Site (4.42:1) were darkened to pass.
- Buyout was deepened so it reads apart from Preparation.
- Review and Revision keep the reference's violet pairing, separated by lightness (1.58:1 between them), by icon and by label.

No pair of families is distinguished by color alone (Section 8.7). Icon, label, position and legend always carry the distinction.

**Aliases, not new values:**

| Token | Value |
| --- | --- |
| `--jpd-chain-commitment` | `var(--jpd-commitment)` |
| `--jpd-chain-commitment-late` | `var(--jpd-commitment-late)` |
| `--jpd-chain-issue-at-risk` | `var(--jpd-warn-fg)` (3.64:1 as a graphic, which passes the 3:1 non-text minimum, unlike `--jpd-warn-dot`) |
| `--jpd-chain-issue-impacted` | `var(--jpd-error-fg)` |
| `--jpd-chain-ink` | `var(--jpd-text-strong)` |
| `--jpd-chain-ink-secondary` | `var(--jpd-text-secondary)` |
| `--jpd-chain-on-fill` | `var(--jpd-surface)` |
| `--jpd-chain-grid-day` | `var(--jpd-grid-strong)` (calendar-day lines, Section 54.4.2; 2026-11-10) |

The calendar grid's week line and non-working shading (Section 54.4.2, 2026-11-10) are derived, never authored: `--jpd-chain-grid-week` is `color-mix(in srgb, var(--jpd-text-strong) 16%, var(--jpd-surface))`, a step darker than the day line, and `--jpd-chain-nonworking` is `color-mix(in srgb, var(--jpd-text-strong) 3%, transparent)`, about half the Schedule's `--jpd-nonworking`, so the shaded bands never outweigh the lines or the labels drawn over them.

Callout fills are derived, never authored: `color-mix(in srgb, var(--jpd-chain-commitment) 7%, var(--jpd-surface))`, and the same at 9% for the issue tone.

**Interaction states** reuse the existing demo treatment:
- Hover is `filter: brightness(1.12)`.
- The active or focused mark gets the existing double ring (a `--jpd-surface` inner ring and a `--jpd-text` outer ring), drawn in SVG as two strokes that follow the mark's own outline.

## 51.8 Typography and registers

- **Typeface.** The figure is set in **Inter Tight**, the face of the `--jpd` product-demo surfaces, throughout (amended 2026-11-07 during implementation). The site loads Inter only to weight 600, so bold chevron and label text in Inter would be synthesised. Inter Tight is loaded to 800. The reference's typeface is not adopted.
- **Base-scale sizes (CSS px):**

| Element | Size and weight |
| --- | --- |
| Title | 28 / 700 |
| Subtitle | 16 / 500 |
| Chevron label | 14 / 700, 13 / 600 for a parenthetical second line |
| Duration | 13 / 500 |
| Milestone name | 12 / 700, with its date at 12 / 500 |
| Callout title | 14 / 700 |
| Callout body | 13 / 500 |
| Legend title | 13 / 700 |
| Legend description | 12 / 500 |

  Below `sm`, the header stacks and the type steps down one level. The chain's own type never scales with the scroll width.
- **One kind of absolute date (Section 48.10).** Every absolute date in the figure, whether start, milestone, commitment, issue or Required On Site, is the same kind of quantity and uses one register. Dates are written out as *October 29, 2026* (`month: 'long'`, UTC), with no weekday. Durations use a different register ("N working days", medium weight, no date formatting). Relative day numbers ("Day 75") are not used.
- **Provenance.** The figure carries names, dates and durations from constructed data. So it carries the one-line provenance statement in the caption register, beneath the legend: it is representative demonstration data (Section 48.10). The product-screen exemption does not extend to this figure.

## 51.9 Composition and scrolling

From top to bottom:
1. **Header** (does not scroll), **on the dark navy band** (amended 2026-11-07):
   - **Background:** `--jp-surface`, the site's dark band tone, filling the header to the container's rounded top corners. Only the header is dark: the chain, markers, calendar, summary and legend stay on the white body.
   - **Logo:** the approved dark-ground asset `public/assets/logo/JiTpro_Amber_white_text.svg` (white wordmark, amber mark), used unmodified. It is the variant the dark investor navigation already uses, and its viewBox is already cropped to the artwork. Referenced through `import.meta.env.BASE_URL`, with its height matched to the title block and `alt="JiTpro"`.
   - **Divider:** a 1px vertical divider in `--jp-border` at 25% opacity.
   - **Text:** the title *Procurement Chain — {item name}* in `--jp-text-primary` (16.3:1 on the band), and a one-line subtitle in `--jp-text-secondary` (12.0:1).
   - Typography, spacing and proportions are unchanged from the light header. No new color, gradient or effect.
   - The reference's placeholder logo is never used.
2. **Commitment band:** callout cards, their leader lines, and the commitment marks on the bar's top edge (Section 51.10).
3. **The chain:** segments and milestone diamonds.
4. **Below-bar labels:** durations, tier-B names and milestone labels.
5. **Issue band:** issue marks on the bar's bottom edge, their leaders, and issue callout cards (Section 51.10).
6. **Calendar axis.**
7. **Summary row** (does not scroll): *Start:* {date} · *Total duration:* {N working days} · *Required On Site:* {date}, with the reference's arrow rules in `--jpd-chain-ink-secondary`.
8. **Legend card** (does not scroll): one swatch and description per activity family present in the item, then Milestone, Commitment and Issue. It is generated from the same records and tokens, so it cannot drift.

Bands 2 to 6 sit inside one horizontal scroll container:
- `overflow-x: auto`, `role="region"`, an `aria-label`, and `tabIndex=0` so the keyboard can scroll it.
- On first render it is scrolled to its **right end**, so the fixed Required On Site date is in view first. That is the direction the method works.
- Focusing a mark scrolls it into view.

## 51.10 Commitments above, issues below

The existing convention is unchanged (Decision Log 2026-11-06): commitments sit **above** the chain and issues **below** it. Both stay interactive and keep their records' relationships.

**Commitments.**
- The mark sits at the centre of `requiredBy`'s day slot, on the bar's top edge. It keeps the existing status semantics:

| Status | Mark |
| --- | --- |
| open | hollow |
| committed | filled |
| beyond-required | filled with the late tone |
| complete | filled at reduced weight in the full schedule only. The chain is a planning view and does not dim. |

- A callout card above carries:
  - the commitment's `typeLabel`
  - its `name`
  - **Required by:** {date}
  - the owner role
  - where they exist, **Committed for:** {date} and the variance in working days. A positive variance uses `--jpd-chain-commitment-late`.

  Format example only (the date is illustrative, not engine output): *Final Window & Door Design · Required by: October 29, 2026 · Architect*.
- Every value is read from the `ScheduleCommitment` record. `committedFor` is never shown in place of `requiredBy`.

**Issues.**
- The triangle mark sits at the centre of `identifiedOn`'s day slot, on the bar's bottom edge, toned by package health (at-risk or impacted aliases, Section 51.7).
- A callout card below carries:
  - `kindLabel`
  - `title`
  - **Identified:** {date}
  - `impact`
  - where the issue has a root commitment, its name.
- Issues stay at the date the project **learned** of the problem. That is what makes the early warning legible. The affected work is reached through the inspector (`rootCommitment.requiredForStepId`, `leadStepId`). A drawn connector to the affected step is not part of this release.

**Callout layout.**
- Cards are placed by one left-to-right pass that pushes overlapping cards apart horizontally, then into a second tier.
- The leader line always drops from the card to the mark's true x. Only the card moves, never the mark.
- Card width is 220 to 300px.
- Leaders are 1.5px in the mark's own token.

## 51.11 Architecture and interaction (informative)

The layout module is pure and DOM-free:

```
buildChainLayout(item: ScheduleItem, opts: { containerWidth: number; measureText: (s, font) => number })
  -> {
       pxPerDay, domainStart, width, height,
       segments:    { stepId, family, x0, x1, tier, labelLines, durationLabel, path, gradientId }[],
       milestones:  { stepId, cx, size, isRos, labelRow, cluster?: string }[],
       commitments: { commitmentId, cx, status, card: { x, y, w, h, tier } }[],
       issues:      { issueId, cx, health, card: { x, y, w, h, tier } }[],
       axis:        { months: { x, w, label }[] },
       summary:     { startDate, rosDate, totalWorkdays },
       revealOrder: string[]   // mark ids, Required On Site first, then backward
     }
```

- **Rendering is two layers built from the one layout.** The SVG visual layer draws every shape. An HTML hit layer of absolutely positioned `<button>`s, one per mark, carries the existing classes (`jpd-step`, `jpd-commit`, `jpd-issue`). That lets the unchanged `useMarkInspection` hook (whose selector matches `button.*`) and the unchanged `PhaseInspector` handle hover, focus, touch pinning and the popover. The chain band carries `data-gantt-row={item.id}`, so the inspector keeps its cards off the chain.
- **Accessibility.** Every mark is keyboard-reachable in date order and has an accessible name (name, dates, duration or owner). The screen-reader list (`.jpd-sr-list`) repeats the whole chain in order. Icons are `aria-hidden`. Meaning never depends on color alone.

## 51.12 Backward-building animation (documented; implemented for the homepage Plan visual, 2026-11-10)

*Implemented 2026-11-10 for the homepage Plan visual only (Section 54.4.2), which records its amendments. The interactive figure stays static.*

The future homepage presentation demonstrates the method: the date is fixed, and the work is derived backward from it. It is **not** a left-to-right wipe of a finished graphic. Building it requires its own approval.

**Narrative stages:**
1. Introduce the package (the header).
2. Establish the fixed Required On Site date: the diamond, the date rule and the label appear alone.
3. and 4. A **planning edge** travels **right to left** from Required On Site toward the start, at constant calendar speed (Section 46.4: travel through a real sequence is linear).
   - Each segment is revealed from its right end as the edge passes, by clipping to `[max(start, edge), visualEnd]`.
   - Its label and duration appear once the edge clears the segment's start.
   - Each milestone appears when the edge reaches its date.
   - A running readout gives the working days before Required On Site at the edge, computed with `workdaysBetween`.
5. The completed chain and the calendar axis resolve.
6. Commitments and then issues appear at their dates.

**One shared state (Section 46.3).** A single progress value `p ∈ [0, 1]` from one driver (scroll position or one clock) is mapped once, through one ordered table of stage boundaries, to the planning edge's date and the stage. Every element derives its visibility from that date and the layout's `revealOrder`, through one pure function `revealAt(layout, p)`. There are no per-element timers, delays or duplicated constants. Because the chain is wider than the viewport, the scroll container follows the edge during the reveal, and this is derived from the same `p`.

**Reduced motion (Section 46.5)** presents the completed final state, stage 6, immediately. The static figure is always complete and comprehensible without the animation (Section 46.2). No bounce, overshoot, pulse or loop (Section 46.4). Marks become interactive once they are revealed.

## 51.13 Open decisions

All four were resolved on 2026-11-07. Each one's record is kept below, so the reasoning survives.

1. ~~**Summary total.**~~ *Resolved by the 2026-11-07 scheduling correction:* milestones add no working days, so the activity total and the span from start to Required On Site are the same number (312 working days for the approved scenario since the 2026-11-07 review-duration revision; 332 before it). The summary row shows that single total, derived from the engine. The 338-working-day figure was an artefact of the engine error and no longer exists.
2. ~~**Required On Site date.**~~ *Resolved 2026-11-07:* **30 November 2027**, for this demonstration only, in its own scenario (Section 51.2). The chain therefore starts 31 August 2026 (3 August 2026 before the review-duration revision).
3. ~~**Step names.**~~ *Resolved 2026-11-07:* the approved full names stay in the data, the inspector and every accessible description. The chain may show shorter **authored** display labels (for example *Review 1*), declared in the scenario (`CHAIN_LABELS`), never invented by the renderer.
4. ~~**Commitment and issue content.**~~ *Resolved 2026-11-07:*
   - Three commitments and one issue, all connected to their records:
     - the Architect's final window and door design, required by Submittal Coordination
     - the Owner's frame finish and color selection, required by Submittal Preparation, provided six working days late
     - the Architect's final glazing selection, required by the First Revision Cycle, committed four working days late
     - the resulting *Frame Finish Selection Received Late* issue.
   - A subcontractor submittal-package commitment is **not** included. The commitment model defines a commitment as an obligation outside the General Contractor's control, owed by the design team, the Owner or consultants. The submittal package is the chain's own Initial Submittal milestone.

**Representative dates follow the anchor (2026-11-07).** In demonstration scenarios only, agreed and actual dates are authored as working-day offsets from the required-by dates the engine derives. Moving the Required On Site date moves every date, and every story keeps its shape: a selection six working days late stays six working days late. This is done with the existing engine, run once to read the derived requirements and once with the offsets applied. There is no second engine and no model change. Real project actuals are recorded facts and are never derived this way.

**Recorded methodology issues (pending separate review, not to be resolved by editing durations).** In the shared schedule fixture, nine packages go straight from a resubmittal milestone to an approval milestone with no review activity between them: Concrete, Switchgear, Mechanical, Elevator, Stone, Casework, Railings, Interior Doors and Lighting. Under Section 51.14, approval then falls on the day of resubmission. Casework holds four milestones on one date. The previous engine hid a one-day review there. Whether each package needs a review activity, and how long it should be, is a methodology question recorded here for separate review.

## 51.14 Activities and milestones: scheduling semantics and rendering

Status: APPROVED (2026-11-07, Decision Log *scheduling correction*). Direction supplied by Jeff Kaufman. **Scope: every procurement schedule view**: the full Procurement Schedule (`DemoGantt` / `ScheduleRowMarks`), the homepage Build-the-chain comparison, and the Procurement Chain. It governs the scheduling engine (`scheduleModel.ts`) as well as the drawing, because a mark can only be as truthful as the date it is drawn from.

**Governing rule: activities consume time; milestones record events. A zero-duration milestone never creates an additional day in a procurement schedule.**

**Activities (`kind: 'phase'`).**
- An activity is work and has a realistic duration in working days.
- Anything that takes time is an activity. That includes processing a submittal, reviewing it, and receiving, inspecting or staging material. It MUST NOT be hidden inside a milestone. If such work is needed, it is added as an activity, and its duration is counted.

**Milestones (`kind: 'milestone'`).**
- A milestone is an event at a point in time. It has one calendar date and zero duration. It never advances or delays the schedule and never consumes a working day.
- **Finish milestones (the default)** record the completion of the step before them. They share that step's finish date. Example: GC Submittal Processing finishes Wednesday, so *Submitted to Architect* is Wednesday and Architect Review begins Thursday.
- **Start milestones** mark the start of the step after them and share its start date. A milestone is a start milestone only when its specification says so explicitly (`anchor: 'start'`). The relationship is never inferred from the milestone's name.
- Several milestones in sequence share one date. Example: Final Approval and Release for Fabrication on the day the final review finishes.

**Required On Site** is a finish milestone. The final activity (Shipping and Delivery) finishes on the Required On Site date, and the milestone shares that date. If receiving, inspection or staging must happen before the material is ready for the field, those are activities with durations, or they are reflected in the Required On Site date itself.

**Gaps.**
- `gap: 1` (the default) means no slack: an activity starts on the next working day after its predecessor finishes, and a finish milestone falls on its predecessor's finish date.
- Each unit above 1 is one working day of explicit float, and is preserved exactly. Nothing compresses it.

**One engine.** The current schedule and the baseline are produced by the same backward pass (`backwardPass()`), so they cannot apply different milestone logic. The rule is held by the engine's unit tests (`scheduleModel.test.ts`), which assert that it holds, including a regression on the 332-working-day sequence as first approved (the scenario itself is now 312 working days, Section 51.2).

**Rendering.**
- **Milestone marks are drawn at their instant.** A finish milestone sits at the end of its date (`x(D) + pxPerDay`), so its diamond lands exactly where the predecessor's bar ends. A start milestone sits at `x(D)`. The Required On-Site mark and any Required On-Site date rule follow the same rule.
- A milestone is never moved to another date, or offset horizontally, for spacing.
- **Same-instant milestones are stacked vertically at the shared x,** in sequence order from top to bottom:
  - spacing at most 9px, reduced so the whole stack stays within 18px of the bar's centre line
  - horizontal position still states the date exactly
  - each milestone keeps its own mark, its own equal slice of the hit area, its own focus stop and its own accessible name
  - a Required On-Site rule keeps its full height and takes no pointer events; only its cap takes a stack position.
- Milestone hit areas sit above the activity bars they straddle. Commitment and issue markers sit above milestones, so the raised marker remains the more specific target where they overlap.

*Superseded:* the engine previously gave every milestone a working day of its own, so each milestone silently lengthened its package by a day, and diamonds were drawn at the start of that extra day. Both are withdrawn.

---

# 52. Homepage Product Register (Step 01)

Status: APPROVED (2026-11-07). Direction supplied by Jeff Kaufman (Decision Log 2026-11-07). Scope: Step 01 of the homepage *Know what's coming* step stack (Section 46.11). The full Product Register screen (`ProductRegisterScreen`), the application shell (`JiTproShell`) and the register fixture are not changed by this section.

**No current homepage use (2026-11-09).** Section 3 of the homepage is now the audience section (Section 54), so this register is no longer rendered. `HomeProductRegister` and `HomeProductRegisterFigure` stay in the codebase unchanged, preserved at tag `homepage-four-step-stack-2026-11-09`. A simplified version is planned for the audience section's visual column (Section 54.4). That use MUST be specified there before code. This section still governs the figure wherever it appears.

**Purpose.** Step 01 asks *What does the project need?* It shows a curated, credible view of the JiTpro **Product Register** and introduces the one item the homepage then follows through every step: **Heritage Steel Windows and Doors** on the Oak Ridge Residence. It is a website demonstration of the product, not a claim about a mobile interface.

## 52.1 One story, one source

The four homepage steps follow one example:
- Step 01 identifies the product.
- Step 02 establishes its Required On-Site date.
- Step 03 builds the chain backward from that date.
- Step 04 shows the complete chain with its commitments and issues.

**The selected item's facts come from the Procurement Chain scenario** (`chainScenario.ts`, Section 51.2), never from a second copy:
- **Required On-Site:** the scenario's fixed date (30 November 2027).
- **Fabrication duration:** the scenario's fabrication activity (180 working days). This is fabrication only, not the whole procurement duration. The column and field are labelled *Fabrication Duration* so the distinction is explicit.
- **Supplier:** the organization responsible for that fabrication (Heritage Steel Window & Door).
- **Category:** the scenario's category.

Authored on the homepage record: the product name, the description, the trade, and the register status (**Pending**, so the register agrees that the submittal reviews of Step 03 are still ahead). The older schedule package's Required On-Site date (7 June 2027) and its 14-week lead time MUST NOT appear in the homepage story.

The other five rows are, in order, Exterior Stone Veneer, Custom HVAC Equipment, Tile Package, Structural Steel and Roofing Membrane (amended 2026-11-07, Decision Log):
- **Exterior Stone Veneer and Custom HVAC Equipment** are read from the existing register fixture, Required On-Site date included.
- **Tile Package and Roofing Membrane** take every field from the register fixture **except** their Required On-Site dates, which come from the Step 02 construction activities they serve (Section 53.1): 22 February 2028 and 29 September 2027.
- **Structural Steel** replaces Passenger Elevator. It has no row in the full register fixture, so it is authored on the homepage record (name, description, trade, status **Approved**). Its category and supplier come from the shared schedule's structural steel package, and its Required On-Site date (8 March 2027) from Step 02.
- Fabrication durations come from each row's schedule package production activities, in working days. The roofing membrane has no schedule package, so its authored 14-week lead time is stated in working days on the fixture's own 5-working-day week, exactly as the fixture defines its weeks.

Every row carries its Required On-Site date as an ISO date, and the displayed date is formatted from it, so Steps 01 and 02 read one value and cannot disagree. The fixtures themselves are unchanged. *(Superseded: the earlier text read all five rows, Passenger Elevator included, from the register fixture. Their roofing date of 17 May 2027 and tile date of 13 September 2027 would have contradicted the Step 02 schedule.)*

## 52.2 Composition

A fixed **1280 × 740** application canvas, authored like the other representative screens and scaled as one unit, never reflowed (Decision Log 2026-09-04). It is built in its own component (`HomeProductRegister`) from the same tokens and primitives as the full screen, which stays untouched.
- **Sidebar:**
  - the wordmark
  - the project identity
  - the six application nav items, *Products* active
  - the signed-in user
- **Top bar:** the project selector, notifications and *Project Team*.
- **Main column:**
  - **Header:** *Product Register*, *Oak Ridge Residence*, one supporting line, and one primary action.
  - **Summary cards (four):** Total Products, Approved, Pending Approval, Long Lead Items, with the register's own totals.
  - **Filter row:** search, Status and Category selects, and *Filters*.
  - **Table:** six rows and six columns (Product / Description, Category, Trade, Status, Fabrication Duration, Required On-Site), then *Showing 6 of 246 products*.
- **Selected row:** Heritage Steel Windows and Doors, with the register's existing selected-row tint and left bar.
- **Detail panel:** product name, status, project, category, trade, supplier, fabrication duration, and **Required On-Site last, as the panel's strongest value**. In Step 01 that value is not yet established (Section 52.5). Step 02 establishes it.

No pagination, export, drawing references, contacts or related commitments: commitments belong to Step 04. Colors are `--jpd-*` tokens only, with no literals. The canvas sits in a 1px `--jp-ink-secondary` 20% hairline frame with rounded corners. No shadow, gradient or animation.

## 52.3 Responsive presentation

- **From `lg`:** the canvas is shown, scaled to the content width. At `lg` and wider the scale keeps table text readable.
- **Below `lg`:** the canvas is **not** shrunk. Instead, a simplified card of the selected product is shown in the same visual language: the product, status, the key fields, and Required On-Site, shown as *Not yet established* (Section 52.5). It makes no claim to be the mobile application.

## 52.4 Accessibility and provenance

- The scaled canvas is one labelled image (`role="img"`), as Section 46.8.1's frames are. Its interior is non-interactive and hidden from assistive technology, and the label states the selected product, its status and its fabrication duration, and that Required On-Site dates are not yet established.
- The small-screen card is real text.
- A one-line provenance statement in the caption register follows the figure, because this curated screen is a new figure rather than one of the exempt representative screens (Section 48.10).

## 52.5 One register, two steps: the Required On-Site presentation state

Status: APPROVED (2026-11-07, Decision Log).

**One Product Register.** Step 01 identifies the products, and Step 02 establishes and populates their Required On-Site dates. Both steps render the **same component**, `HomeProductRegister`, with the same data. Step 02 never draws an approximation of the register.

**A presentation state, not a data change.**
- Every row keeps its Required On-Site date in the data (Section 52.1).
- The component takes one presentation input, `rosd` (`RoSDPresentation` in `homeRegisterData.ts`):
  - `reveal(row)`: 0 shows the not-yet-established placeholder, and 1 shows the row's own date
  - `panel`: the same, for the detail panel.
- Between 0 and 1 the placeholder clears before the date arrives, so the two are never read together.
- The date slot never changes size.

**Not yet established.**
- **A table cell** shows a neutral em dash (`—`) in `--jpd-text-muted` at regular weight. The *Required On-Site* column is still present.
- **The detail panel** keeps its *Required On-Site* label. Its value reads *Not yet established* at 14/500 in `--jpd-text-muted`, in the slot the date will occupy.
- **Step 01** passes `RoSD_NOT_ESTABLISHED`: every cell and the panel are in this state.
- **Step 02** establishes the four dates its construction activities set (Section 53.1) and the panel's date. *Exterior Stone Veneer* and *Custom HVAC Equipment* stay not yet established, because no Step 02 activity sets their dates.

**Established.** The register's own date in its existing treatment: 12.5px body cell, 700 for the selected row, and 24/800 in the detail panel. Nothing is added to the register to mark a date as established.

---

# 53. Homepage step stack: approved direction for Steps 02–04 (not implemented)

Status: DIRECTION APPROVED for further design and development (2026-11-07, Decision Log). **Section 53.1 is now a specification, APPROVED 2026-11-07; Sections 53.2 and 53.3 are not.** Nothing in 53.2 or 53.3 authorizes code. Each step's composition, tokens and motion MUST be specified here (with motion under Section 46: one shared animation state, communicating rather than decorating, reduced motion presenting the final state) and recorded in the Decision Log before implementation.

**No current homepage use (2026-11-09).** The step stack these steps belonged to has left the homepage (Section 54). The Step 02 Required On-Site figure and the Step 03 procurement schedule stay in the codebase unchanged, preserved at tag `homepage-four-step-stack-2026-11-09`. Simplified versions are planned for the audience section (Section 54.4).

All four steps follow the one story of Section 52.1: Heritage Steel Windows and Doors, Oak Ridge Residence, Required On Site 30 November 2027, from the Procurement Chain scenario (Section 51.2).

## 53.1 Step 02: schedule activities establish Required On-Site dates

Status: APPROVED (2026-11-07, Decision Log). Component: `HomeRoSDFigure` (`src/components/demo/screens/home-schedule/`).

**The one idea.** The construction schedule establishes when the field needs something. JiTpro lifts those dates out of the schedule and attaches them to the products, so procurement can be planned backward from them (Step 03).

### 53.1.1 Data

Four construction activities, in this order. Start dates and Required On-Site Dates (RoSDs) are approved representative demonstration data:

| Activity | Starts | Product | RoSD |
| --- | --- | --- | --- |
| Structural Steel Erection | 15 Mar 2027 | Structural Steel | 8 Mar 2027 |
| Roofing Installation | 4 Oct 2027 | Roofing Membrane | 29 Sep 2027 |
| Steel Windows and Doors Installation | 1 Dec 2027 | Heritage Steel Windows and Doors | 30 Nov 2027 |
| Floor and Wall Tile Installation | 6 Mar 2028 | Tile Package | 22 Feb 2028 |

- **A RoSD is the date the product must be physically on site to support the work.** It is not derived from the start date. Each is set by that product's own needs, so the gaps differ, and there is **no universal offset rule**:
  - steel, about a week, to shake out the first erection sequence by piece mark and stage it within crane reach
  - roofing, three working days, because the materials must be crane-loaded and kept dry, and early delivery only adds weather and deck-load risk
  - windows and doors, the Procurement Chain scenario's fixed date
  - tile, nine working days, for lot and shade verification, conditioned storage and replacing short or damaged cartons. Monday 21 Feb 2028 is a holiday on the working-day calendar.
- **The windows RoSD is not stored here.** It is `CHAIN_REQUIRED_ON_SITE` (Section 51.2), read by reference.
- **Durations are illustrative**, in working days on the working-day calendar (`workCalendar.ts`): 40, 20, 30 and 35. The finish is the last working day of that count from the start, inclusive. Only the start dates and RoSDs are demonstration facts the homepage relies on.
- **One source.** The activities live in one module (`homeScheduleData.ts`) that imports nothing from the register. The homepage register (Section 52.1) reads the Structural Steel, Roofing Membrane and Tile Package RoSDs from it, and the figure joins activities to register rows by product id. A test asserts that every RoSD the figure shows equals the register row's ISO date, and that the windows date equals the chain scenario's.

### 53.1.2 Composition

**One frame, the Step 01 register canvas: 1280 × 740** (revised 2026-11-07, Decision Log). Step 02 ends on that very canvas, so the figure reserves its size for the whole pass and the page never changes height. Three layers share the frame's coordinates:
1. **The schedule card**, a 1280 × 388 SVG at the top of the frame. It has its own 1px `--jp-ink-secondary` 20% hairline frame, rounded 14px corners, no shadow, and the `.jpd` face (Inter Tight). The rest of the frame is empty while the schedule is shown.
2. **The Product Register**: `HomeProductRegister` itself, in the same hairline frame and scaled by the same transform as Step 01. Its Required On-Site dates are driven by the Section 52.5 presentation state.
3. **The markers**: one SVG above both layers, in the frame's `viewBox`.

**Schedule card**, from top to bottom:
1. **Title bar** (56): a `CalendarRange` icon, *Construction Schedule*, then *Oak Ridge Residence* in secondary ink. On the right, the legend: a green diamond and *Required On-Site Date (RoSD)*.
2. **Header band** (44, `--jpd-surface-header`): *Activity*, *Start* and *Duration* columns, then a two-tier timescale (years above, three-letter months below) over the timeline.
3. **Four rows** (72 each), separated by `--jpd-divider` hairlines. The windows row has the register's selected-row tint (`--jpd-row-tint`) and 4px bar (`--jpd-row-bar`).

**Schedule content:**
- **Columns:** *Activity* at x 24 (14/600), *Start* at x 348 (date register), *Duration* at x 468 ("N working days", 13/500). The timeline runs from x 600 to x 1256.
- **Timeline scale:** one calendar-day scale, `x(date) = 600 + (date − 1 Feb 2027) in calendar days × 656 / 486`, over Feb 2027 to May 2028 inclusive. Month hairlines are `--jpd-grid`, year boundaries `--jpd-grid-strong`.
- **Activity bars** (22 tall) run from the start of the start date to the end of the finish date. They are `--jpd-summary-bar`; the windows bar is `--jpd-text-strong`. There is no text on the bars.
- **RoSD markers** are the Procurement Chain's Required On Site treatment (Section 51.5) at homepage scale:
  - A `--jpd-chain-ros` diamond, 16px across (22px for windows, the chain's 1.35×), with a 2px `--jpd-surface` stroke, on the bar's centre line at the **end of the RoSD's date**, the Required On Site instant of Section 51.3. The windows marker therefore meets its bar's leading edge exactly.
  - A dashed `--jpd-chain-rule` date rule (1.5px) runs through the marker's own row, behind its bar, and reads against the month hairlines. It stays within its row because a rule from the header would cross the date labels of the rows above.
  - The date sits to the right of the diamond, above the bar, in strong ink at 13/700 (15/800 for windows).

**Where the markers land.**
- Each marker lands on its product's Required On-Site cell in the register, with its date text on the cell's own date text.
- The landing points are **read from the rendered register** (its `data-rosd-cell` cells), never restated, so a marker cannot miss its cell if the register changes.
- The register then shows its own date and the marker leaves (Section 53.1.3). The completed figure is therefore exactly the Step 01 register, with four dates established.

**Emphasis.** Heritage Steel Windows and Doors is the item Step 03 carries forward.
- In the schedule: its row tint and bar, its darker bar, and its larger marker and bolder date.
- In the register: Step 01's selected row and its detail panel, whose Required On-Site value is the register's strongest (Section 52.2) and is established last.
- Nothing else is emphasised.

**Dates** use the register's date form everywhere in the figure (*Nov 30, 2027*, `formatRegisterDate`), because the figure ends in the register (one date register per figure, Section 51.8).

**Tokens.** Existing tokens only, with no literals and no new value:
- `--jpd-*` from `tokens.css`
- `--jpd-grid`, `--jpd-grid-strong` and `--jpd-summary-bar` from `scheduleTokens.css`
- `--jpd-chain-ros` and `--jpd-chain-rule` from `chainTokens.css` (Section 51.7, amended).

*(Superseded the same day: a four-row register excerpt with its own columns, then a four-row table in Step 01's metrics with a green-washed Required On-Site column (`--jpd-rosd-column`, withdrawn). Both were still a second register. Decision Log 2026-11-07.)*

### 53.1.3 Motion

One pass of **5000 ms** on one progress value `p` from 0 to 1, from a single clock (Section 46.3). Every element's state is a pure function of `p`; nothing has its own timer or delay. Each window eases with smoothstep, and the moving markers ease in and out. There is no bounce, glow, scaling or loop (Section 46.4).

| Stage | `p` | What changes |
| --- | --- | --- |
| 1 Construction schedule | 0 – 0.14 | Nothing. The complete schedule is the first frame. |
| 2 Identify field demand | 0.14 – 0.30 | Markers, their dates, their date rules and the legend fade in. |
| 3 Extract the dates | 0.40 – 0.56 | The schedule card fades out entirely. Only the markers and their dates stay. |
| 4 The register | 0.56 – 0.70 | The Step 01 register fades in, exactly as Step 01 shows it: every Required On-Site date not yet established. |
| 4 Transfer | 0.64 – 0.86 | The four markers, with their dates, travel together as one group from the timeline into their products' Required On-Site cells. |
| 4 Hand-off | 0.86 – 0.94 | Each marker fades as the register establishes that cell's own date (`reveal` 0 → 1). |
| 4 Detail panel | 0.90 – 0.98 | The selected product's panel establishes its Required On-Site date (`panel` 0 → 1). |
| 5 Completed | 0.98 – 1 | Held: the Step 01 register with four dates established. |

- The schedule card is gone before the register appears, so the two views are never readable at once (as Section 46.9).
- The four markers move together, on one shared value, as one group. Moving them together is the single focal idea of that stage (Section 46.4). They pass over the register on their way to their cells.

**Trigger.**
- The pass plays automatically **once**, when at least 60% of the figure is in view (`IntersectionObserver`).
- Until then the first frame is shown, which is the complete schedule, so nothing is withheld (Section 46.2).
- The movement is **not** scroll-linked. Scrolling neither drives nor scrubs it, and the Section 46.11 stack is unchanged.
- After the pass, the completed state holds.

**Replay.** A quiet text control, *Replay* with the approved `RotateCcw` icon, beneath the figure on the right, in the light-surface treatment: `--jp-ink-secondary`, hover `--jp-background`, focus outline `--jp-background`, no amber (Section 46.10). It restarts the pass from `p = 0` (Section 46.6).

**Reduced motion** (Section 46.5): the completed state (`p = 1`) is shown immediately and Replay is hidden. The image's label (Section 53.1.5) carries each activity, its start and the RoSD it sets.

### 53.1.4 Responsive presentation

- **From `lg`:** the animated figure.
- **Below `lg`:** a static, real-text presentation, with no animation and no horizontal scrolling.
  - Four entries in activity order. Each gives the activity and its start date, then the product it needs and the RoSD beside a green diamond.
  - The windows entry has the selected-row tint and bar.

### 53.1.5 Accessibility and provenance

- The figure is one labelled image (`role="img"`), and its layers are hidden from assistive technology. Its label states every activity, its start date, the product it needs and that product's RoSD. It names Heritage Steel Windows and Doors as the selected item carried into Step 03, and names the products whose dates are not yet established.
- Replay is a real button outside the image, with its own accessible name.
- The small-screen presentation is real text.
- A one-line provenance statement in the caption register follows the figure (Section 48.10).

## 53.2 Step 03: backward planning from the Required On-Site date

The Procurement Chain (Section 51) alone, planned backward from the fixed Required On-Site date. There is no comparison with a conventional construction schedule (Decision Log 2026-11-07). The existing Build-the-chain comparison stays live until the replacement is built, tested and visually approved. The backward-building animation of Section 51.12 remains documented and not authorized.

## 53.3 Step 04: supporting commitments and issues

The complete chain, progressively introducing the commitments above it and the issues below it (Section 51.10). Open for specification: the order and trigger of the progressive reveal.

# 54. Homepage audience section (Phase 1)

Status: APPROVED (2026-11-09) for Phase 1. Direction supplied by Jeff Kaufman (Decision Log 2026-11-09). Pattern: Section 46.12. Implementation: `src/components/home/AudienceSection.tsx`, with the copy in `src/content/homeAudiences.ts`.

## 54.1 Placement and surface

- Homepage section 3. It follows the *How we do it* band and precedes *We're with you throughout the project*, replacing *Know what's coming* (Section 20.1, amended 2026-11-09).
- **The *How we do it* band (restored 2026-11-09).** Directly before this section: the step stack's former intro panel, as its own section. Its copy, composition and registers are exactly as approved (Decision Log 2026-11-06, heading 2026-11-07):
  - `--jp-surface` with the 12% `--jp-border` top hairline;
  - the *How we do it* eyebrow in `--jp-brand-amber`;
  - the heading at the homepage section-heading register;
  - the two paragraphs, then the semibold closing statement;
  - the 5fr/7fr grid from `lg`, at least one view tall.

  **Closing text link (added 2026-11-09).** Beneath the closing statement, the band's second and last amber element. It is a link, which Section 8.1.1 assigns to Brand Amber, so Section 48.7's scarcity holds:
  - copy, verbatim: *One project at a time. Your team. Our expertise.*, then a trailing right arrow (lucide `ArrowRight`, `aria-hidden`); destination the internal `/product` route (React Router `Link`, so it follows the deployment's base path), same tab;
  - text and arrow are one link in `--jp-brand-amber`: `font-heading`, semibold, `1rem` / `1.0625rem` from `sm`, below the closing statement's register; no underline;
  - spacing: a visible gap of 24px (32px from `sm`) below the closing statement. Its 12px vertical padding counts toward that gap and brings the link to the 44px minimum (Section 34.1) without enlarging its type;
  - it wraps as ordinary text, and the last word and the arrow never separate;
  - **hover**: the single gesture is the arrow moving 4px right over 200 ms ease-out. The text stays Brand Amber. This is a text link, not a Section 48.1 button, so the button rule against nested icon movement does not apply. Under reduced motion the arrow does not move;
  - **focus**: a 2px `--jp-text-primary` outline, offset 2px (the dark-surface focus rule of Section 48.1).

  It no longer sticks (Section 46.11 applies only inside a stack). The dark band followed by the light audience section is an intended change of surface, not a seam (Section 48.6). Implementation: `src/components/home/HowWeDoItSection.tsx`.
- **Surface:** `--jp-surface-light` for the whole section. It opens the light act, so section 4's in-container hairline still reads as a boundary inside one surface (Section 48.6).
- **Shared left edge:** the `max-w-7xl` container used by every homepage section.
- **Amber:** none. Every control and all hierarchy here is in ink (Section 8.8, amber on light surfaces).
- **Hairline:** one, between the tab rail and the content stage (`--jp-ink-secondary` at 20%, the approved light-surface hairline).
- The retired section's code (`KnowWhatsComingSection` and its figures) stays in the codebase, unrendered. It is preserved at tag `homepage-four-step-stack-2026-11-09` and documented in `docs/archive/homepage-four-step-stack.md`.

## 54.2 Copy

**Heading (revised 2026-11-09).** The eyebrow *What JiTpro means for:* (founder-supplied, uppercase via CSS), followed by the audience control (Section 46.12). For assistive technology, the `h2` is the eyebrow plus the selected audience's name. The earlier provisional two-line display heading is withdrawn.

**Audiences, tabs and tab copy.** Copy is used exactly as supplied. Option and tab labels are set in sentence case (Sections 7.7, 48.1). The supplied labels were in title case.

| Audience | Tab | Headline | Description |
| --- | --- | --- | --- |
| **General contractors** (default) | Identify | You can't manage what you haven't identified. | Every construction project contains hundreds of products, materials, and services scattered across drawings, specifications, and schedules. *(second paragraph)* JiTpro brings these requirements together into a comprehensive procurement inventory, identifies missing or undefined scope, and helps establish what the project actually needs. *(closing statement)* Know what you need. Know what's missing. |
| | Plan | Know what needs to happen. Know when it needs to happen. | Every product, material, and service follows its own procurement path, with activities that must happen in the right sequence and require real time to complete. *(second paragraph)* JiTpro starts with when the field needs each item, then works backward to establish the activities, durations, and dates required to deliver it on time. *(closing statement)* The right work. In the right order. At the right time. |
| | Connect | Make sure every procurement activity has what it needs to move forward, without interruption. | Identify the decisions, information, approvals, and other requirements that each activity depends on. Connect them to the procurement schedule, establish responsibility, and make clear when each is needed. |
| | Control | Replace constant urgency with deliberate timing. | JiTpro helps you establish clear priorities for your entire project team. Owners, architects, consultants, and vendors know what's expected of them, when it's needed, and what's coming next. *(second paragraph)* Instead of demanding everything at once, you can focus everyone on the right work at the right time. *(closing statement)* Less chasing. Clearer priorities. Better coordination. |
| **Architects & design teams** | See what's coming | Know what's coming before it becomes urgent. | See upcoming design questions, selections, and approvals early enough to prepare your team and coordinate its workload. |
| | Plan your workload | Fewer surprises. More predictable review schedules. | Understand when submittals, design clarifications, and consultant input will be needed, instead of constantly reacting to unexpected requests. |
| | Focus on priorities | Know which decisions really matter right now. | See how requested information affects downstream procurement and field work, so your team can focus its limited time on the right issues. |
| **Project owners** | Reduce risk | Your construction project shouldn't have to feel like a gamble. | You're trusting your general contractor with a substantial investment. You deserve confidence that they're planning ahead, managing risks, and keeping you informed before problems threaten your budget or schedule. *Second paragraph:* You deserve a contractor with a plan, not just assurances. JiTpro helps them build and manage the procurement plan that supports that promise. |
| | Protect your investment | Protect your investment with a contractor who plans beyond their own budget. | Your investment extends beyond what you pay your contractor. You're also paying architects, engineers, designers, and consultants whose time and resources depend on how well the entire project is coordinated. *Second paragraph:* JiTpro helps your general contractor plan beyond their own work, coordinating information, decisions, and responsibilities across the project team to reduce unnecessary costs and protect your investment. |
| | More predictability | Stay on course for a more predictable finish. (2026-11-13; was *Know what's coming before it becomes urgent.*) | Your completion date and budget are closely connected. When construction runs longer than planned, added time can bring added cost. JiTpro helps your contractor identify and manage procurement requirements early, giving the project team a clearer path to keep construction moving toward its planned completion. **Closing statement:** Better procurement planning. Fewer preventable delays. More confidence in where your project will land. |
| | Better decisions | The right information. The right decisions. At the right time. (2026-11-13; was *Stay in control of your project's decisions.*) | Every construction project depends on a continuous flow of information, decisions, and approvals from owners, designers, consultants, and trade partners. *Second paragraph:* JiTpro helps your contractor identify what's needed, who's responsible, and when each action must be completed to keep procurement and construction moving as planned. **Closing statement** (2026-11-13, on two lines): Not too early. Not too late. Just in time. / Protecting your choices and your project. *Just in time.* is underlined in brand amber. |

The copy MUST NOT be reworded as a side effect of layout or visualization work. A copy change is its own decision.

The general contractor *Control* copy was replaced on 2026-11-11 (founder-supplied; Section 54.2.3). It replaces *Know what needs your attention today, and what's coming tomorrow.* and its description.

The general contractor *Connect* headline and description were revised on 2026-11-11 (founder-supplied). They replace *Turn loose dependencies into managed commitments.* and *Connect outside decisions, information, and approvals to the procurement activities they support. Establish who owes what, when it's required, and what depends on it.* The panel also gained a dependency summary (Section 54.2.2).

The general contractor *Plan* copy was replaced on 2026-11-11 (founder-supplied; Section 54.2.1). It replaces *Build a procurement plan that supports your schedule.* and its description.

The general contractor *Plan* description was revised on 2026-11-10 (founder-supplied). It replaces *Identify every product, material, and service the project requires. Pull backward from when the field needs each one, establishing the actual work and realistic timeline required to get it there.* The new wording starts from the field requirement and works backward, which distinguishes Plan from Identify (open item 6, Section 54.5).

The general contractor *Identify* copy was replaced on 2026-11-11 (founder-supplied; Section 54.2.1). It replaces *Identify everything your project needs.*, its description, its role link and its checklist.

The general contractor *Identify* copy was first revised on 2026-11-09 (founder-supplied). It replaces *Find the problems before they reach the field.* and its description. The tab now states the first step of the method: identify and organize everything the project must procure.

### 54.2.1 Identify and Plan tabs: second paragraph and closing statement (rewritten 2026-11-11)

Status: APPROVED (founder direction, 2026-11-11). The general contractor *Identify* and *Plan* panels each carry two additions. *Control* gained both on 2026-11-11 (Section 54.2.3); no other tab has them. Implementation: `descriptionMore` and `closing` on the tab in `src/content/homeAudiences.ts`; rendered by `AudienceSection.tsx`.

- **Second paragraph.** The description is two paragraphs. The second is set exactly as the first (Section 46.12), 12 px beneath it.
- **Closing statement.** *Know what you need. Know what's missing.* on *Identify*; *The right work. In the right order. At the right time.* on *Plan*. One line beneath the description, 16 px below it: the heading face, semibold, at the description's size, in `--jp-background`, the strongest light-surface ink. No amber (Section 8.8). It is copy, not a control.
- **No motion.** Both are plain copy, shown with the panel. Nothing in the copy animates; the visual carries the sequence (Section 54.4.1).
- **Fit (Section 46.12 fit rule).** Each panel is shorter than the tallest panel (*Connect*) at 1280 × 800, 1440 × 900 and 1920 × 1080, so the section's height and pinning are unchanged.

**Withdrawn 2026-11-11.** The 2026-11-09 additions, a role link (*Explore JiTpro for general contractors*, to `/roles/general-contractors`) between headline and description and a three-line method checklist beneath the description, are no longer shown on this tab. Their specification and timing are preserved in `docs/design/archive/Identify_Original_Visualization.md`. `AudienceSection.tsx` still supports both for any tab; no tab uses them. Restoring either is a copy decision (Section 54.2).

### 54.2.2 Connect tab: dependency summary (2026-11-11)

Status: APPROVED (founder direction, 2026-11-11). The general contractor *Connect* panel carries one addition beneath its description. No other tab has it. Implementation: `CONNECT_DEPENDENCY_CATEGORIES` in `src/content/homeAudiences.ts`; `DependencySummary` in `AudienceSection.tsx`.

**The six categories,** founder-supplied, in two columns of three, read across each row:

| | |
| --- | --- |
| Design & Engineering | Owner Decisions & Selections |
| External Inputs & Commitments | Scope & Trade Commitments |
| Permits & Agency Requirements | Field & Installation Requirements |

- **What they are.** The kinds of requirement JiTpro identifies across a project: the information, decisions, authorizations and commitments a procurement activity needs from outside it. They are not the dependencies the animation demonstrates. The animation keeps its three (Section 54.4.3).
- **Not Plan's activities.** There is no *Reviews & Approvals* category, and none may be added. Reviews, revisions and approvals are scheduled procurement activities, which Plan shows (Section 54.4.2, the *Review & Approvals* step). Connect names what those activities need from outside parties: an architect's required response or an owner's selection is a Connect dependency; the scheduled review itself stays in Plan. A test keeps review, revision, approval and submittal out of the labels.
- The labels are used as supplied, in title case, as category names (as the Plan step list's entries are).

**Drawing.** A plain list, in the section's light-surface language:
- each entry is a `lucide` icon (18 px, stroke 2, `--jp-ink-secondary`, `aria-hidden`) beside its label (Inter semibold, `0.9375rem` from `sm`, `0.875rem` below, 20 px line, `--jp-background`). The icon is sized to its label and never stands in for it (Section 48.4);
- icons: `DraftingCompass`, `UserCheck`, `Handshake`, `FileSignature`, `Landmark`, `HardHat`, in the order above;
- no cards, borders, fills, numbers or controls, and no amber (Section 8.8);
- two equal columns within the description's `58ch` measure, 32 px between them (20 px below `sm`), 10 px between rows, 20 px below the description. A label that cannot fit its column wraps.

**It is copy, not illustration.** Unlike the Plan step list, which restates the visual and is hidden from assistive technology, the summary says something the visual does not. It is therefore a list in the copy panel, always in the document and exposed to assistive technology.

**Motion (Section 46).** Only its reveal belongs to the Connect visual. `connectStateAt` returns one value per category from the visual's one clock (Section 46.3), and the visual writes each entry's opacity and rise. Each entry fades in over 300 ms with a 6 px rise, the step list's gesture (Section 54.4.2), 70 ms apart in reading order. The sequence starts 650 ms before the end of the return to the schedule, so the last entry completes exactly as the camera comes to rest. The summary is hidden through the whole animation before that, and stays once shown. Leaving the tab hides it at once, as the panel fades out; returning plays the animation, and the reveal, again. **Reduced motion:** shown at once, with the visual's resting view (Section 46.5).

**Fit (Section 46.12 fit rule).** The panel MUST keep the pinned presentation within the view at 1280 × 800, 1440 × 900 and 1920 × 1080.
- At 1440 × 900 and 1920 × 1080 the headline takes three lines, and the spacing above is set so the panel is exactly as tall as the tallest panel already was (391 px). The section's height is unchanged (716 px).
- At 1280 × 800 the headline takes four lines in the narrower column, which alone uses most of the room the old panel had spare. **Short desktop views** (from `lg`, and at most 864 px tall) therefore take two adjustments: the summary is set at `0.8125rem` on an 18 px line, with 6 px between rows and 14 px below the description, so every label stays on one line; and the presentation's vertical padding is 48 px instead of 64 px, for every tab. The presentation is then 713 px in a 719 px view, where it was 716 px. Above 864 px tall the standard treatment fits.
- Between `lg` and about 1280 px wide the headline takes five lines. On such a view shorter than about 850 px the presentation no longer fits, and the section is the ordinary unpinned tabbed section (Section 46.12). This is narrower than the three sizes above and is accepted.
- In the unpinned and stacked forms the summary is ordinary content beneath the description. It never overlaps the visual, because it is in the copy's own flow.

### 54.2.3 Control tab: copy (2026-11-11)

Status: APPROVED (founder-supplied copy, 2026-11-11). Implementation: the `gc-control` tab in `src/content/homeAudiences.ts`, rendered by `AudienceSection.tsx` with the existing second-paragraph and closing-statement treatments (Section 54.2.1). Nothing new is drawn.

- **Wording.** Exactly as supplied.
- **Paragraphing (the one presentation adjustment).** The founder supplied three short paragraphs. The first two are set as one paragraph: *JiTpro helps you establish clear priorities for your entire project team. Owners, architects, consultants, and vendors know what's expected of them, when it's needed, and what's coming next.* The third is the second paragraph. Three separate paragraphs and a closing statement would make this the tallest panel and, on a 1280 × 800 view, taller than the pinned presentation allows (Section 46.12 fit rule). Estimated from the panel's type and measure, not yet measured in a browser: about 364 px at 1440 × 900 against the tallest panel's 391 px, and at most about 410 px at 1280 × 800 against about 417 px. **This fit MUST be confirmed in the browser at 1280 × 800, 1440 × 900 and 1920 × 1080 before the change is committed;** if the panel is the tallest, restore the fit before anything else.
- **Closing statement.** *Less chasing. Clearer priorities. Better coordination.*, in the closing-statement register.
- **The channel.** The copy names owners, architects, consultants and vendors as parties who *know what's expected of them*. The subject of the first sentence is the general contractor (*helps you establish*), so the priorities reach those parties through the general contractor's team, as Section 54.3 requires.

### 54.2.4 Project owners tabs: copy (2026-11-11)

Status: APPROVED (founder-supplied copy, 2026-11-11). Implementation: the four `owner-*` tabs in `src/content/homeAudiences.ts`.

- **Wording.** As supplied. *Reduce risk* was unchanged in the first pass and was rewritten later the same day (founder brief, 2026-11-11): the earlier headline *Find potential problems before they become expensive.* and its description spoke from the contractor's seat, as if the owner were the one finding problems; the second copy told the owner what to expect of their contractor (*Don't wait until construction is underway to discover your project is already in trouble.*). It was replaced again on 2026-11-12 (founder brief) with *Your construction project shouldn't be a gamble.*, and refined the same day to the present copy. The refinement is deliberate: the copy does not say that construction, or hiring a contractor, is a gamble. It says an owner should not have to *feel* they are gambling: confidence should come from a credible management process, not from assurances. Its second paragraph was replaced once more that day with the approved *You deserve a contractor with a plan, not just a promise. JiTpro helps them build and manage the procurement plan that supports that promise.* (its first sentence revised 2026-11-12 to end *not just assurances.*), which names the one thing the visual ends on: the plan. The founder allowed slight adjustment for fit; none was made. *Protect your investment*, *More predictability* and *Better decisions* each have a new headline and description; they replace *Pay for good planning, not expensive recovery.*, *A construction schedule backed by a real plan.* and *Know when decisions are needed, and why.* and their descriptions.
- **One paragraph each, except *Reduce risk*, *Protect your investment* and *Better decisions*,** which have two as supplied (`descriptionMore`). Only *Better decisions* and *More predictability* have a closing statement in the copy (2026-11-13: *Not too early. Not too late. Just in time.* / *Protecting your choices and your project.*, on two lines; *Better procurement planning. Fewer preventable delays. More confidence in where your project will land.*), in the general contractor tabs' closing-statement style. Each tab's takeaway is the closing line of its visual (Section 54.4.5), so the panels stay shorter than the tallest general contractor panel. *Reduce risk* has a short headline and two paragraphs, the second a single sentence; its fit in the pinned section has not been measured in a browser (open item 15).
- ***Protect your investment*, rewritten 2026-11-12 (founder brief).** The earlier copy (*Keep preventable problems from becoming costly setbacks.*) spoke of delay and rework in general. The new copy is about one thing no other tab says: the owner's financial exposure reaches beyond the construction contract. A contractor's poorly planned procurement interrupts the architect, the engineer, the designer and other consultants; some of them are paid by the owner under separate agreements; the cost may never appear as a change order. The copy states this as a possibility (*may spend*, *may be paying*), names no amount, and is not a discussion of change orders. Used as supplied, unedited. **Replaced the same day (founder brief, copy only, verbatim):** headline *Protect your investment with a contractor who plans beyond the jobsite.*, and the two paragraphs in Section 54.2. The earlier headline, *Your contractor's chaos shouldn't become your expense.*, set the owner against the contractor. The contractor is JiTpro's customer and the owner's partner, and both gain when the contractor can coordinate the whole team; the copy now says what a good contractor does rather than what a bad one costs. The visual is unchanged; its first telling still shows the uncoordinated case (open item 16). **Refined twice more that day (founder, copy only, verbatim):** the first sentence became *Your investment extends beyond what you pay your contractor.*; then the headline became *Protect your investment with a contractor who plans beyond their own budget.* and both paragraphs took the wording now in Section 54.2.
- ***Better decisions*' closing statement (2026-11-13, founder):** two lines, *Not too early. Not too late. Just in time.* and *Protecting your choices and your project.*, at the closing statement's register (bold heading face, `--jp-background`). **Just in time.** is emphasised by a brand-amber underline (`--jp-brand-amber`, 3 px, offset 5 px) beneath navy text, never by amber text: on `--jp-surface-light` amber text measures 1.96:1 (Section 8.8), so the amber is decorative and the words keep the ink's contrast. The founder chose this treatment over amber text and over no amber at all. It is the only amber in the panel copy.
- **The channel is named.** Each description says *JiTpro helps your contractor* (in *Reduce risk*, the second paragraph says *JiTpro helps them*, the contractor of the sentence before), so the owner is never cast as the user or buyer (Sections 20.1, 54.3). This resolves open item 2 for the owner tabs and open item 4.
- **A shared headline.** *Know what's coming before it becomes urgent.* is now the headline of both the owner *More predictability* tab and the architect *See what's coming* tab (open item 12).

## 54.3 Copy governance

- **"Procurement" (scoped exception, 2026-11-09).** The word appears in the general contractor *Identify* description (*procurement inventory*, revised 2026-11-11; previously *Procurement Register* in the description and checklist, added 2026-11-09), the general contractor *Plan* description (*procurement path*, revised 2026-11-11; previously *procurement plan* and *procurement activity*), the *Connect* headline and description (revised 2026-11-11), the architect *Focus on priorities* description, and the owner *Reduce risk* description. This is a scoped exception to Section 20.1's retired-language rule, limited to this section's tab copy.
- **Audience.** The general contractor is the default and remains the homepage's primary audience (Section 20.1, Audience). Architects and design teams, and project owners, are addressed in this section only, as other parties to the projects the general contractor's plan supports.
- **The engagement model is unchanged** (Section 20.1). JiTpro works with the general contractor's team. The architect and owner tabs describe what those parties gain from the plan the general contractor's team runs. This section, and anything added to it, MUST NOT state or imply that JiTpro coordinates architects or owners directly, or becomes another project-team participant.
- **"Margin."** No longer used in this section: the general contractor *Control* description that named it was replaced on 2026-11-11 (Section 54.2.3). The word remains permitted (released 2026-08-27).
- **Em dashes.** The supplied copy contains none (Section 7.7).

## 54.4 Visualizations: Phase 2 direction (not specified)

All four general contractor tabs now have a specified visual: *Identify* (Section 54.4.1), *Plan* (Section 54.4.2), *Connect* (Section 54.4.3) and *Control* (Section 54.4.4, added 2026-11-11). The four project owner tabs gained theirs the same day (Section 54.4.5). The architect tabs keep the reserved placeholder.

Every other tab's visual column shows the reserved placeholder (Section 46.12), except general contractors → *Identify*, which turns scattered project documents into a procurement inventory with its scope gaps in view and then into the register (Section 54.4.1), and general contractors → *Plan*, which builds a procurement chain backward and reveals the project schedule around it (Section 54.4.2). The founder's recorded direction for Phase 2 includes:

- simplified versions of the homepage Product Register (Section 52), the Required On-Site figure (Section 53.1) and the procurement schedule;
- new animations, including floating external dependencies transforming into structured, linked commitments.

None of these is specified. Nothing in this subsection authorizes code. Each visual MUST be specified under Section 46.12 and recorded in the Decision Log before implementation.

### 54.4.1 Identify: from scattered documents to the register (rewritten 2026-11-11)

Status: APPROVED (founder direction, 2026-11-11). Scope: the general contractor *Identify* visual only.

*Rewritten 2026-11-11.* The 2026-11-10 version was a six-stop pan-and-zoom tour of the complete register. It demonstrated the register rather than what Identify does. That version is withdrawn and archived: branch `archive/identify-original-visualization`, record `docs/design/archive/Identify_Original_Visualization.md`. Kept from it: the canonical register on its fixed canvas, the camera by `transform` only, the cover clamp, its overview of the whole application (now the resting view), the single *played* state, and the reduced-motion rule.

**What it communicates.** Construction procurement has complexity that cannot be removed. Someone must hold it. JiTpro organizes and manages it so the contractor does not have to rebuild it from separate documents (Tesler's law of the conservation of complexity). The visual shows that as one transformation: scattered project information, then identified requirements, then visible scope gaps, then an organized inventory. The reader should conclude that JiTpro helps find everything the project needs and shows what is missing. It demonstrates a process and its outcome, not a feature list.

**Implementation.** `src/components/home/IdentifyRegisterPreview.tsx` (the visual), `identifyStoryScene.ts` (content, timing and the state function) and `identifyRegisterCamera.ts` (the register's two views).

**Two layers in the existing 16:10 frame** (Section 46.12; the frame's size is unchanged, so fit and pinning are unaffected):
- **The story.** One SVG on a 480 × 300 design canvas, scaled as a unit to the frame. Nothing in it reflows, so nothing can overlap or clip at any frame size.
- **The register.** `ProductRegisterScreen` on its fixed 1448 × 1086 canvas, beneath the story until stage 4. It is the canonical screen the demo lab renders, never a homepage copy. The one homepage difference remains its heading, *Procurement Register* (open item 5, Section 54.5), through the screen's `title` prop.

**The four stages.** Times are milliseconds after *played*.

| Stage | Time | What is shown |
| --- | --- | --- |
| 1. Scattered project information | 0 – 1600 | Four documents, each turned a degree or two, with a caption: *Architectural drawings* (an elevation sheet, A5.11), *Specifications* (two project-manual sections), *Construction schedule* (a bar chart) and *Consultant drawings* (a mechanical plan, M1.02). Nothing moves. |
| 2. Identified requirements | 1600 – 4800 | The documents square up, shrink to half size and move to a column at the left, in one move (800 ms). Their captions fade out. A panel headed *Procurement inventory*, with the project's name, fades in beside them (from 2000 ms). Six requirements then appear in it one at a time, 350 ms apart from 2400 ms, each fading in over 350 ms with a 4 px rise. Each shows its name and the document reference it came from. |
| 3. Visible scope gaps | 4800 – 8200 | The three defined requirements are checked together, and a key to the three conditions appears. Then each requirement needing attention is marked in turn, 600 ms apart from 5300 ms: its mark, a short note, and a row tint. The last is complete by 6850 ms and is held until 8200 ms. |
| 4. The register | 8200 – 13000 | The story cross-fades into the register (600 ms), which arrives on its heading, project name and summary cards. It holds there until 9500 ms. The camera makes one vertical pan (1100 ms) down to the table's header and first rows and holds them close up until 11300 ms. It then pulls back once (1700 ms) to the whole application, and rests. |

**The six requirements,** in order: *Windows & Doors*, *Exterior Cladding*, *HVAC Equipment*, *Roofing*, *Lighting*, *Plumbing Fixtures*.
- *Windows & Doors* is first and is defined. It is the item *Plan* and *Connect* go on to follow (Sections 54.4.2, 54.4.3).
- The project is the register's own, read from the fixture (*Oak Ridge Residence*).
- Where a requirement is also one of the register's rows, its document reference is read from the register fixture, never restated.

**The three conditions.** Identifying an item is not the same as establishing that its scope is complete.

| Condition | Mark | Used for |
| --- | --- | --- |
| Defined | a check, `--jpd-ok-fg` | *Windows & Doors*, *HVAC Equipment*, *Roofing* |
| Missing information | the warn dot, `--jpd-warn-dot`; note in `--jpd-warn-fg`; row tint `--jpd-warn-bg` | *Exterior Cladding*: *Incomplete specification*. *Plumbing Fixtures*: *Undefined product selection* |
| Unresolved scope | a ringed question mark, `--jpd-text-strong`; row tint `--jpd-neutral-bg` | *Lighting*: *Unassigned scope responsibility* |

- The marks are the status badge's own vocabulary (`DemoStatusBadge`: the check of *Approved*, the dot of *Pending*, the question mark of *TBD*), so the register that follows reads in the same language. Shape carries each condition as well as hue (Section 8.8).
- The inventory's conditions agree with the register where they overlap: the windows are *Approved* there, and the stone veneer cladding is *Pending*. A test holds this.

**What it MUST NOT claim.**
- It illustrates the JiTpro method. Nothing may depict document scanning, AI extraction or automatic validation.
- The conditions are representative. They MUST NOT be presented as findings from a real project.
- No late dates, missed commitments, schedule variance or recovery. Those belong to *Plan*, *Connect* and *Control*.

**The camera.** Three views of the register and two moves: a vertical pan, then one pull-back.
- **Heading and rows.** These two views share one scale and one left edge, so the move between them is a pan, never a zoom. The table from *Product ID* through *Status* fills the frame's width (about 0.87× to 0.93× on desktop frames), and never below 0.75×, where the table text stops being readable. The rows view shows the table header and the first rows, with the *Status* column in view on desktop frames. On a narrow frame the 0.75× minimum applies and the view keeps the table's left, so names stay in view and the right-hand columns are cropped.
- **The pull-back (added 2026-11-11, founder direction).** After the rows are held close up, the camera pulls back once to the whole application and rests there. It starts from rest and spends longer slowing than starting, so the application settles into place; it never overshoots (Section 46.4).
- **Rest: the whole application.** The interface's full width, from its top, at the smallest scale that covers the frame: the sidebar and its navigation, the project selector, the heading, the five summary cards, search and filters, the table and the Product Detail panel. This is the framing *Plan* rests on (Section 54.4.2) and the original visualization's overview. The 4:3 canvas is taller than the 16:10 frame, so its lowest strip (the last row's foot and the pager) is below the frame, as in *Plan*. The first row, *Heritage Steel Windows*, is the screen's own selected row and the Product Detail panel describes it, so the windows item stays identifiable.
- **No empty space, ever.** Every view is clamped so the canvas covers the frame. Between two covering views, translate and scale ease on one shared progress, so every in-between frame covers the frame too.

**Drawing.**
- Documents: `--jp-surface-white` sheets with linework and lettering in `--jp-ink-secondary` and `--jp-background`. No amber (Section 8.8). They are recognizable as a drawing sheet, a project manual and a schedule, and no more detailed than that needs (Section 47.4).
- Inventory: the application's `--jpd-*` tokens, as the register uses, in the heading face; document references in the data face.

**Motion: one clock (Section 46.3).** One driver, milliseconds since *played* turned true, is mapped by one pure function, `identifyStateAt(t)`. It returns everything that moves: the documents' gathering, the panel, each row, each mark, the key, the cross-fade, the pan and the pull-back. The component only applies it.
- Each stage finishes before the next begins. Only one thing changes at a time, except the three defined checks, which appear together because they say one thing.
- Fades and one controlled move; nothing bounces, overshoots or loops (Section 46.4). Every element that moves carries part of the story (Section 46.1).
- **Length.** 13.0 s, against the original's 9.4 s. Four stages each need time to be read; the last note is held for more than a second before the register replaces it; and the rows are held for 700 ms before the 1.7 s pull-back.
- It runs once per entry to the tab, by scroll or by click. Leaving the tab returns it to the opening frame at once, so returning plays it again. A resize re-applies the current moment at the new size; nothing restarts.
- **Reduced motion:** no sequence. The resting view, the whole register application, is shown at once (Section 46.5). The copy carries the meaning without the visual (Section 46.2).
- There is no replay control (Section 46.6).

**Scroll.** Unchanged, and MUST NOT be changed without founder authorization. Scroll selects the tab (Section 46.12); the visual then runs on its own clock and is never scrubbed by scroll position.

**Accessibility.** The visual column stays `aria-hidden` (Section 46.12). Nothing in it is focusable.

### 54.4.2 Plan: the procurement chain, built backward, then the schedule (2026-11-10)

Status: APPROVED (founder direction, 2026-11-10). Scope: the general contractor *Plan* visual only. *Connect* is specified in Section 54.4.3 (2026-11-10). Control and every other audience's tabs keep the reserved placeholder. This is the first homepage placement of the procurement chain, which Section 51 requires to be approved.

**Redesigned 2026-11-11 (founder direction).** The storytelling changed; the methodology and the data did not. The original is archived (`docs/design/archive/Plan_Original_Visualization.md`, source commit `6567fb0`).

- **What it must communicate.** Procurement's complexity is inherent: many items, different activities for each, real durations, a required sequence, reviews and revisions, fabrication and delivery, and a date the field needs. JiTpro does not remove that work. It establishes it, orders it, gives it realistic durations and plans it backward (Tesler's law of the conservation of complexity). The reader should conclude: *JiTpro knows what has to happen, how long it takes, and when we need to start.*
- **Progressive disclosure, in five stages:** the field's requirement; the work, named; the backward build; the completed chain; the whole Procurement Schedule. Stages 1 and 2 are new or changed. The build, the hold and the reveal are as specified below, except where marked *redesigned 2026-11-11*.
- **Stage 1, the field's requirement.** The frame opens on the calendar alone: nothing else is shown while the panel slides in. At 500 ms a plain statement appears at the chart's top left, clear of the milestone's date rule: the item's name, *Custom Steel Windows & Doors* (16/700, `--jpd-text-strong`), over *Required On Site:* and the date in full (12.5, the date in 700). It is read from the chain's item and its date, never authored. At 900 ms, once the statement is fully shown, the Required On Site milestone appears on the calendar: its diamond, date rule and label. It is then held until 2700 ms, so the date registers before anything else happens. **The rail's opening state (redesigned 2026-11-11, founder direction; it supersedes the same day's plain line and inset navy card).** Through this stage the rail itself is the introduction. It is not a card: the rail's own box, edge to edge and full height, changes state and never moves.
  - **Ground:** the application's navy, `--jpd-nav-bg-start`, the sidebar's own, flat. No gradient, shadow, rounded corners or icon.
  - **Accent:** a short horizontal rule, 28 × 3 px, in the application's amber `--jpd-accent`, 14 px above the statement and aligned to its left edge.
  - **Statement,** exactly as supplied: *Start with when the field needs it.* The application face at 21/600 on a 26 px line, `--jpd-nav-text`, left-aligned, balanced wrapping. Nothing else: no eyebrow and no supporting text.
  - **Layout:** 22 px at each side; the rule and statement, as one block, vertically centred in the rail. On a phone the rail is the band beneath the chart and the same state fills it.
  - **In:** the ground fades in from 450 ms (300 ms), after the panel's slide; the rule from 600 ms (250 ms), drawn out from its left end; the statement from 700 ms (400 ms) with an 8 px rise. Meanwhile the requirement and the milestone are established in the chart, as above.
  - **Hold:** about one second with everything shown.
  - **Out:** the rule and statement fade from 2150 ms (250 ms), without moving; the ground returns to the rail's light surface from 2350 ms, complete at 2700 ms, exactly as the list begins. No flash and no reflow.
- **Stage 2, the work, named.** At 2700 ms the requirement statement fades and the item's name becomes the heading of the list on the rail (13.5/700). The list's six entries then appear beneath it one at a time, 330 ms apart from 2850 ms, in backward order: *Required On Site* first, then the five groups of work. Each group shows its working days and, beneath them, a 2.5 px bar in its family token whose length is its working days to the longest group's scale, so 188 days reads as several times 49. At 4800 ms a *Total* line appears beneath the list: the chain's 312 working days, summed from its activities. Nothing of the chain is drawn during this stage. The build begins at 5700 ms. **The list is whole or absent:** no entry, *Required On Site* included, may appear before the list's heading *(corrected 2026-11-11)*.
- **MUST NOT.** The six groups summarize the chain; they never replace it. The chain's activities, durations, dates, milestones and sequence MUST NOT be changed for the animation's sake. *Connect* reads the same chain (Section 54.4.3).
- **Length.** 29.1 s, against the original's 24.9 s: the two stages before the build. The build's own pacing is unchanged.


**What it teaches.** The JiTpro planning principle: *start with the Required On Site date, then build backward.* It then shows that this level of planning is applied to every procurement item on the project, not to one. Implementation: `src/components/home/PlanChainPreview.tsx`, with the scene, timeline and camera in `planChainScene.ts`.

**Built from the procurement chain, not redrawn.**
- Every row is laid out by the chain's own pure layout engine (`buildChainLayout`, Section 51.11), at its approved scale of 8 px per calendar day (`MIN_PX_PER_DAY`). Every position is a function of a date (Section 51.1).
- It uses the chain's tokens (`--jpd-chain-*`, Section 51.7), gradients and shadow (Section 51.4), family icons (Section 51.6), milestone diamonds and the Required On Site treatment (Section 51.5), and type (Section 51.8). The drawing vocabulary is shared with the interactive figure through `chainVocabulary.ts`, `ChainText.tsx` and `useChainMeasure.ts`, so the two cannot drift.
- **The procurement chain only.** No commitments, no issues, no callouts, no header and no legend. Commitments and issues are removed from every item before layout, so the bar sits where it would with none.

**The scene.** One canvas, drawn once:
- **The focal chain** is the approved *Custom Steel Windows and Doors* scenario (Section 51.2), with its authored labels, durations, milestone labels, Required On Site date rule and label, and the calendar axis beneath it.
- **The project schedule** is the focal chain plus the shared schedule fixture's other fourteen items (`scheduleFixture.ts`). Each is drawn as its own chain, bars and milestones only, on **one shared calendar axis** (Section 51.3, shared domain). The fixture's own steel window package (*Heritage Steel Windows & Exterior Doors*) is left out, because the focal chain is that package. Two steel window packages on one schedule would misstate the project.
- **The surrounding chains are lengthened for this illustration (refined 2026-11-10).** The fixture's chains run 72 to 159 working days, short beside the focal chain's 312, and read as unrealistically uniform. Each is therefore rebuilt through the same scheduling engine (`lengthened()`). Every activity's duration is scaled by the item's own factor, 1.35× to 2.6×, rounded, and at least one working day. Its Required On Site date, sequence, milestones and any explicit float are kept. The chains then run 162 to 287 working days, no two start or finish on the same date, and their activity periods overlap. At a factor of 1 the rebuild reproduces the fixture's dates exactly (`planChainScene.test.ts`). These lengths are representative, homepage-only, and do not change the fixture or any surface that reads it.
- **Row order (refined twice, 2026-11-10): strict Required On Site order,** earliest at the top, as a procurement schedule reads. *(The first refinement's specification-section order is withdrawn.)* The chains' different lengths keep their starts staggered, so the schedule reads in sequence without becoming uniform.
- **The featured chain's homepage date.** The approved scenario's Required On Site date, 30 November 2027, is the latest of the fifteen. On the homepage the whole chain is therefore anchored earlier, on **Wednesday 1 September 2027** (`PLAN_FOCAL_REQUIRED_ON_SITE`), between the fixture's 23 August and 13 September dates. The same engine moves every date together (Section 51.13, representative dates follow the anchor). Its activities, sequence, working-day durations and 312-working-day total are unchanged; it starts 4 June 2026. Its anchor label and summary row state the homepage dates. It is **eighth of fifteen, in the middle third**, and keeps that place throughout the animation. The rows beneath it clear its duration and milestone labels. The interactive chain, the lab and Section 51.2's scenario keep 30 November 2027.
- **Two calendar axes, handed over.** While building and holding, the focal chain keeps its own calendar axis beneath its labels (Section 51.9). On the pull-back it fades out, and the application's period header takes over as the schedule's calendar.
- **The rows are the application's rows (refined 2026-11-10).** The shared calendar domain maps exactly onto the Schedule screen's timeline, and each chain's bar is centred in its row band. Row height is the screen's: as tall as fits above the Register overview's crop line, within 34 to 48 screen px (39 px today). Item names take one line below 46 px. The featured row is taller by the height of its labels.
- The preview's ground is `--jpd-surface`, the chain's white body. The frame's size is unchanged, so the section's fit and pinning are unaffected (Section 46.12).

**Motion: one clock (Sections 46.3 and 51.12).** One driver, milliseconds since the tab's *played* state turned true, is mapped by one pure function, `planStateAt(scene, frame, t)`. It produces the camera, the planning edge and every opacity. *Played* is the same state the Identify visual and checklist use (Section 54.2.1). The renderer applies the state each animation frame and computes nothing.

| Stage | When | What |
| --- | --- | --- |
| 1. The field's requirement | 500–2700 ms | *(Redesigned 2026-11-11.)* The requirement is stated at the chart's top left from 500 ms (the item's name and its date). From 900 ms Required On Site appears on the calendar: its diamond, date rule and label; it is held to 2700 ms. The rail is in its navy opening state, carrying *Start with when the field needs it.*; it has returned to its light surface by 2700 ms. The camera is at the build scale, with the date a little left of centre (about 0.42 across the chain's area, the frame beside the step list). Only the timescale header and the calendar grid are otherwise present, and before 500 ms they are all that is shown. |
| 2. The work, named | 2700–5700 ms | *(New 2026-11-11.)* The statement hands the item's name to the list's heading. The six entries appear one at a time, 330 ms apart, *Required On Site* first, each group with its working days and its bar; then their total at 4800 ms. The camera and the chart do not move. |
| 3. The backward build | from 5700 ms, about 18.1 s | A planning edge travels right to left, one activity at a time, from Shipping and Delivery back to Buyout. Each activity is revealed from its right end. Its icon, name and duration appear as the edge clears its start, and each milestone and its label as the edge reaches it. The camera follows the edge, which sits about a fifth across the chain's area (0.22), so the built chain fills the area beside the step list rather than trailing unbuilt space. The margin is set so a milestone label, centred on its diamond, clears the step list as it appears. |
| 4. The whole chain | about 1.4 s, then a 1.5 s hold | The camera pulls back until the whole chain, Required On Site label included, fills the frame's width. The chain's left end travels in a straight line on screen between the two views, so the pull-back never carries the chain over the step list. The chain's own summary row (Section 51.9: start, total duration, Required On Site) fades in at the frame's foot. The view holds still for 1.5 seconds. |
| 5. The schedule | about 2.4 s | The camera pulls back again, to the whole project schedule. The other items fade in as it does, and the summary row fades out. From about a third of the way through, the JiTpro Schedule module fades in around the chains. The camera comes to rest on the whole application screen as a window at the frame's right, while the step list moves into the room to its left (see *The step list*). |

- **The application screen (refined 2026-11-10; replaces the presentation frame).** The finished schedule is the JiTpro **Schedule module**, in the same application as the Procurement Register (Section 54.4.1). It is built from that application's existing parts, not redrawn:
  - **the shell:** `JiTproShell`, unchanged, the Register's own sidebar, logo, *Oak Ridge Residence* project card, navigation and top bar, with **Schedule** lit in the amber indicator;
  - **the Schedule screen's page header and toolbar** (`ScheduleHeader`, `ScheduleToolbar`, extracted unchanged from `ProcurementScheduleScreen`): *Procurement Schedule*, *15 procurement items · backward-planned from each Required On-Site date*, Export and Add Item, and the zoom bands with **Months** selected, Today, the period arrows and Filters. Health counts are not shown, because the Plan stage has no issues;
  - **the schedule box:** the Schedule screen's item column (`GanttItemHeader`, `GanttItemCell`, extracted unchanged from `DemoGantt`), with each item's name and Required On-Site date. Health badges are off for the same reason. Then the period header (`GanttPeriodHeader`, months from the shared `buildTicks`), month gridlines and row separators in `--jpd-grid`. The featured row takes the selected-row treatment (`--jpd-row-tint` with the `--jpd-row-bar` amber bar), as the Register's first row does. No detail panel, so the schedule fills the workspace;
  - **the legend:** the Schedule screen's chip (`LegendChip`), one per activity family drawn, in the chain tokens and the chain's family names (`FAMILY_LEGEND`), then *Milestone* and *Required On Site*.

  The chains are drawn over the screen's timeline at their scene positions, and the screen fades in beneath them during the pull-back. *(Refined twice 2026-11-10.)* The camera's final view is the **whole application screen filling the visual frame**: its full width, from its top, the Register overview's framing. Only where the list cannot rest outside the frame (below `lg`, see *The step list*) does the window shrink beside or above the list, with a 1px `--jpd-grid-strong` edge on the visual frame's own ground. While the chain builds and holds, the screen is hidden and the preview is the chain's white ground alone.
- **Build scale.** About 700 canvas px across the frame: about 0.8× at 1280 × 800 and 0.85× at 1440 × 900, so the chain's type stays readable. While a long activity builds (Fabrication), the camera eases back to keep it in frame, to no less than 0.3×, and returns at the activity's end. *(Refined 2026-11-10.)* The pull-back leads the edge: it eases out over the move's first 30% of time and back in over its last 30%, holding between. Timed on the edge's eased position, it had lagged, so content crossed the screen fastest while the view was still close. Fabrication's content now crosses the screen at about 0.3 px/ms at most, from about 1.4.
- **One activity at a time (amends Section 51.12).** Section 51.12 specified constant calendar speed. At that speed the short review and revision cycles pass too fast to read, while Fabrication takes most of the build. Each activity therefore gets its own interval: 560 ms plus 1.25 ms per canvas px, from 700 to 3400 ms (refined 2026-11-10, from 420 ms plus 0.25 ms per px, 520 to 1100 ms). Within it the edge eases in and out. In the approved scenario the short activities take 700 to 990 ms and Fabrication takes about 3.2 s, so the longest work reads as long and its pan stays slow enough to follow.
- **A rest on each step (refined 2026-11-10).** After each activity's move, the edge and the camera hold still for **650 ms** (`STEP_DWELL`) on the completed activity, with its name, duration and any milestone fully shown, before the next activity begins. Where the activity's start is a milestone, the rest is **900 ms** (`MILESTONE_DWELL` adds 250 ms). An activity longer than 1000 canvas px (`LONG_SPAN`; in the approved scenario, Fabrication) rests a further 300 ms (`LONG_SETTLE`), because the camera has just eased back in from its pull-back. (Refined 2026-11-10, from 300 and 450 ms.) In the approved scenario those are Initial Submittal, First and Second Resubmittal, and Final Approval with Release for Fabrication. Each rest is part of its step's own interval on the one clock, so nothing accumulates separately, and the build is exactly the sum of its moves and rests. The build takes about 18.1 s, and the whole pass about 24.9 s.
- **The calendar grid (refined 2026-11-10).** Behind the focal chain, as in a Microsoft Project Gantt: a hairline at each calendar-day boundary (`--jpd-chain-grid-day`), a stronger line at each week boundary, Monday (`--jpd-chain-grid-week`), and non-working days shaded (`--jpd-chain-nonworking`: weekends and observed federal holidays, from `nonWorkingRuns`, the calendar the backward pass counts). The chain's x scale is linear in calendar days, so a day line is at `PAD_L + n × pxPerDay` and every bar starts and ends on one. Working days are counted, not laid out; the shading is what shows the difference. The grid sits behind every mark, label and milestone, spans the chain's whole domain, and is not clipped by the planning edge. It is drawn in the chain's coordinates under the one camera, so it never moves independently of the chain. Its density follows the camera, from the same state: day lines and shading fade in between 3 and 5 screen px a day, week lines between 10 and 18 px a week. At the build scale (about 6.5 px a day) both show. While Fabrication's pull-back passes about 2.4 px a day, only weeks remain. At the whole-chain hold, only the month axis remains. On the pull-back to the schedule the grid fades with the chain's own axis, and the application's month grid takes over.
- **The timescale header (refined 2026-11-10).** As in Microsoft Project and Primavera P6, the time scale sits above the bars: a two-tier header, 38 px high (21 + 17), pinned to the top of the chain's area in frame px, on `--jpd-surface` with a `--jpd-chain-grid-week` rule beneath. It replaces, on the homepage, the chain's own month axis beneath the chain. Every label and division is placed horizontally through the same camera as the chain, from `planStateAt`'s state, so it stays aligned with the bars and gridlines throughout the animation; vertically it never moves. At the build scale the upper tier is months (*September 2027*, else *Sep 2027*, else *Sep*, the longest that fits), 12 px / 700 `--jpd-chain-ink`; the lower tier is weeks, ticked at each Monday and numbered with its day of the month, 11 px / 500 `--jpd-chain-ink-secondary`, shown while a week spans at least about 24 px. Zoomed out, the header becomes years over months (*Sep*, else *S*), crossfading as a week narrows from 10 to 6 screen px. A period's label is held at the chart's left edge while its period is still in view, until the next period pushes it out. Month (or year) boundaries cross the whole header in `--jpd-chain-grid-week`; week ticks cross only the lower tier. The chain is centred in the chart beneath the header. The header fades out with the grid on the pull-back to the schedule.
- **A long activity's label stays in view (refined 2026-11-10).** An activity longer than `LONG_SPAN` (Fabrication) is wider than the build view, so its in-bar label (icon and name, the chain's chevron label) is centred within the part of the bar in view in the chain's area, kept clear of the bar's ends by 34 canvas px, rather than on the whole bar. It is revealed when the edge clears the bar's start and stays centred in the visible part as the camera moves on. Wherever the whole bar is in view the offset is zero.
- **The whole chain is legible as a structure, not as text.** At the hold, the chain is about 0.14× (its labels are not readable), so the summary row states its start, total and Required On Site in readable type. The final schedule view is smaller still. It is meant to be read as *many chains like this one*, not in detail.
- All camera moves are gently eased (Section 46.4): no overshoot, bounce or loop. Scale interpolates geometrically, so a large pull-back reads as even.
- It runs once per entry to the tab, by scroll or by click, and rests. Leaving the tab parks it at stage 1, ready to replay. A resize re-frames the same moment, because every view is computed from the frame.
- **Reduced motion:** no animation. The resting view, the whole schedule with every row, is shown at once (Section 46.5).
- There is no replay control (Section 46.6), and the visual has no controls of its own (Section 46.12).

**The step list (refined 2026-11-10).** A short, readable statement of the plan the chain is building, beside the chain. It is the same plan in two coordinated views. Implementation: `PLAN_STEP_GROUPS`, `listLayout()`, `listItemAt()` and the list state in `planChainScene.ts`, applied by `PlanChainPreview.tsx`.

- **Exactly six steps, founder-specified, in backward-planning order:**

  | Entry | Groups the chain's | Shown |
  | --- | --- | --- |
  | Required On Site | the Required On Site milestone | *Milestone · Sep 1, 2027* |
  | Fabrication & Delivery | Fabrication, Shipping and Delivery | *188 working days* |
  | Review & Approvals | the three reviews, both revisions and resubmittals, Final Approval, Release for Fabrication | *49 working days* |
  | Submittal Preparation | Submittal Preparation and Initial Submittal | *30 working days* |
  | Submittal Coordination | Submittal Coordination | *25 working days* |
  | Buyout | Buyout | *20 working days* |

- **Durations are read, never authored.** Membership is by activity family, so every step and milestone of the chain belongs to exactly one entry. Each entry's working days are the sum of its activities' durations, and they total the chain's 312. A milestone shows *Milestone* and its date in the application's short date register. A test pins all of this to the chain.
- **No dependencies.** Decisions, information and commitments owed to the chain are not listed. They are the *Connect* stage's subject.
- **Each entry** is a family swatch (the chain token, at the Schedule screen's legend-chip geometry), or the Required On Site diamond, then the label (12.5/600, `--jpd-text-strong`) over its duration (11/400, `--jpd-text-secondary`, secondary to the label). It is set in Inter Tight, as the application is.
- **Named first, then in sync with the build, on the one clock (redesigned 2026-11-11).** Every entry appears before the build, in stage 2, beneath the list's heading: a 300 ms fade with a 6 px rise, 330 ms apart, *Required On Site* first. No entry is marked before the build. During the build, **the step being built** carries the Register's selected-row treatment (`--jpd-row-tint` with the 3px `--jpd-row-bar` amber bar, the application's own selection, not a marketing accent), from the start of its group's first activity to the end of its last activity's rest. One entry is marked at a time, and none once the build is done. *Required On Site*, a milestone with nothing to build, is never marked. *(Superseded: each entry appearing only as its group started to build, and the Required On Site entry opening the visual alone on the rail.)*
- **While building and holding:** the list is a rail at the frame's left, about a third of its width (176 to 220 px), on the application's side-panel surface (`--jpd-surface-sunken`, `--jpd-border-subtle` edge), one entry per row. The chain is framed in the rest of the frame, at the same build scale as before the list. Its summary row sits beneath the chain, not the list.
- **On the pull-back, the same list moves out of the frame (refined 2026-11-10).** Its six entries are never replaced: they are the same elements, placed by transforms, on exactly the camera's eased progress. **One continuous path (amended 2026-11-10).** Every entry travels straight from the rail toward its place, scaling to its resting size as it goes, while the rail's surface fades. It moves left from the first frame, at its fastest early, and decelerates into place; it never moves right, and it never reverses vertically. The list drops below the copy's last line while still inside the frame and between the copy and the frame, then slides into the free area. The first column leads; the second follows a little behind, so the columns open into two of three (reading down the first, then the second). Because the first column starts above the second and must finish to its left, the columns cross once, briefly (about half a second since the list rests larger, from about a third), as the first passes down beside the second; while they overlap, the second column fades back (to 40% at most, in proportion to the overlap) and returns as they separate. No other entries overlap, and the list never crosses the copy. Tests check, through every frame of the move, that each entry moves monotonically, that only the columns cross and only briefly, and that the copy stays clear. The in-frame fallbacks keep their earlier movement: no entry passes over another.
- **Where the finished list rests: outside the frame (refined 2026-11-10).** The section measures the **free area beneath the tab's copy** in the copy column, beside the visual: from 20 px below the copy's last line to the foot of the stage, the column's full width. It measures in layout px, summed up the offset chain, so the copy panels' entrance transforms do not move it. The section then passes the area to the visual, in the frame's coordinates, with an unclipped layer beside the frame for content to rest in. The list rests there in two columns of three at 104% (refined 2026-11-10, from 85%: labels about 13 px, durations about 11.4 px, markers about 11.4 px; every part of an entry scales together, so the type keeps its weights, colours and proportions). The group is centred in the free area: the gap between the columns equals the margin either side, up to 72 px, and the rows open to share the area's height, up to 50 px a row; each entry stays left-aligned in itself, and the list keeps its 20 px below the copy. No card, border or other decoration is added. Where the area is smaller, the scale and spacing reduce with it, down to the 70% floor below which the list rests inside the frame instead. The application window keeps the whole frame. The list is not interactive and is hidden from assistive technology, like the visual. Measured at 1280 × 800, 1440 × 900 and 1920 × 1080, the area is about 560–600 × 123 px. At 104% the list's entries take about 354 × 121 px of it.
- **Where there is no free area (redesigned 2026-11-11).** With the 2026-11-11 copy the *Plan* panel leaves no free area at 1280 × 800, 1440 × 900 or 1920 × 1080. The application window still keeps the whole frame: the software is never shrunk to make room for the list. The list, its heading and its total stay on the rail and fade in the first third of the pull-back, before the application fades in. The reader has had the list beside the chain through the build and the hold. *(Withdrawn: the list resting inside the frame in two columns at 72%, left of a smaller application window, and the reflow that took it there.)* Below a 460 px frame (phones) it is still a band of two columns beneath the chain throughout, with the application window above it at the end; the heading and total are not shown there, and the stage-1 statement is.
- **Reduced motion:** the final state at once: the application filling the frame, the list resting beneath the copy where there is a free area and absent where there is not, and no step marked.
- **Fit.** The list builds inside the visual frame and rests in space the section already has. The section's height and pinning are unchanged at 1280 × 800, 1440 × 900 and 1920 × 1080.

**Accessibility.** The visual column stays `aria-hidden` (Section 46.12). The copy carries the meaning, and the preview contains no focusable elements.

**Provenance.** Representative demonstration data: the chain's own scenario, and the full schedule's fixture items, lengthened as described above. The frame carries no caption, because the visual column carries none (Section 46.12).

### 54.4.3 Connect: the plan's commitments, forward through the chain (2026-11-10)

Status: APPROVED (founder direction, 2026-11-10). Scope: the general contractor *Connect* visual only. Control and every other audience's tabs keep the reserved placeholder.

**Redesigned 2026-11-11 (founder direction).** The storytelling changed; the chain, its dates, the three dependencies and the card design did not. Where this block and the specification below differ, this block governs. The original is archived (`docs/design/archive/Connect_Original_Visualization.md`, source commit `01207d0`). Implementation: `connectChainScene.ts` (the inputs, the rail's layout, the timeline and `connectStateAt`) and the `variant="connect"` branches of `PlanChainPreview.tsx`.

**Six dependencies (amended 2026-11-11, founder direction).** Where this paragraph and the bullets below differ, this paragraph governs; the bullets' *three* now reads *six*.
- **The six (placements approved by the founder, 2026-11-11; they supersede the dates first recorded here and the three-dependency table below).** In date order, with who owes each, the rule that places it, the date that rule gives on the current chain, and the activity its card names:

  | Dependency | Responsible | Placement rule | Required by | Card: *for* |
  | --- | --- | --- | --- | --- |
  | Final Scope Clarification | GC / Glazing Subcontractor | Three working days before Buyout finishes | June 29, 2026 | Buyout |
  | Structural Attachment Requirements | Structural Engineer | The midpoint of Submittal Coordination: its middle working day | July 22, 2026 | Submittal Coordination |
  | Final Window & Door Design | Architect | The day Submittal Coordination finishes, the last working day before Submittal Preparation begins | August 7, 2026 | Submittal Preparation |
  | Frame Finish & Color Selection | Owner | Three working days before First Submittal Review finishes | October 7, 2026 | First Submittal Review |
  | Final Field Dimensions | GC / Glazing Subcontractor | Two working days before the Release for Fabrication milestone (unchanged) | November 30, 2026 | Release for Fabrication |
  | Final Glazing Specification | Architect | Ten working days after Fabrication begins | December 17, 2026 | Fabrication |

  The rail and the reveal follow this order. One dependency now falls during Fabrication, and the closing view runs from June 29 to December 17, 2026.
- **Provenance.** Three are the shared chain scenario's own commitments; three are added for this visual only, in `connectChainScene.ts`. Connect places all six itself: the approved rules include ones the shared commitment model cannot express (an activity's midpoint; days after an activity begins), and they move the shared three from the dates that model derives. The shared scenario and commitment model MUST NOT be changed to hold these placements or the added three without a separate decision; that model limits commitment owners to the design team, the Owner and consultants. For the shared three, Connect changes only the date, the activity named and the description; who owes each, its name and its type stay the shared scenario's. Every date MUST be derived from one of the chain's own activities by its rule above, with the working-day calendar, and MUST NOT be authored as a date, so each follows its activity if the chain's dates change. The chain's activities, dates and durations are untouched.
- **One card at a time.** Each card is laid out alone by the chain's engine, directly above its own date, on one baseline. A card and its connector give way (350 ms) as the camera leaves; its diamond stays. Two cards are never fully shown together, so dependencies that fall close together never stack, and no connector crosses another card.
- **Each reveal:** card (400 ms, 8 px rise), diamond (from 300 ms), connector drawn from the card to the diamond (from 450 ms, 400 ms), then 1.4 s to read. A move between dependencies takes 550 ms plus 1 ms per canvas px, from 650 ms.
- **The closing view** shows the chain from the first required-by date to the last with all six diamonds and no cards. The diamonds are drawn larger as the camera eases back, at least about 9 px on screen and never more than 3.5 times their drawn size, so the six points read; the rail names them.
- **The inputs.** Nine: the six dependencies, each its name on up to two lines (10.5/600) on the commitment colours, and three illustrative inputs. In the rail the dependencies take six rows 34 px apart, then a hairline, then the illustrative three 25 px apart. On a phone only the six are shown, in two columns of three in the band.
- **Length.** About 30.6 s.


- **What it must communicate.** *Loose information → captured requirements → organized accountability → connected procurement commitments.* The requirements exist whether or not anyone manages them. JiTpro does not remove them; it makes them visible, establishes responsibility and connects them to the activities and dates they support.
- **The inputs.** Ten small project records, in frame px over the chart:
  - **The three commitments,** the chain's own data, at full weight: the commitment's type label (data face, 7 px, uppercase) over its name (10.5/600, `--jpd-text-strong`), on `--jpd-chain-commitment-fill` with a 1 px `--jpd-chain-commitment` edge, the card's own colours.
  - **Seven illustrative inputs,** at 62% weight: a short tag in a hairline box and a name (9.5/500, `--jpd-text-secondary`) on `--jpd-surface` with a `--jpd-border` edge. *Structural Confirmation*, *Supplier Confirmation*, *Field Dimensions*, *Permit Requirement*, *Trade Scope Clarification*, *Manufacturer Requirements*, *Engineering Information*.
  - **MUST NOT.** An illustrative input carries no date, no owner and no connection, and MUST NOT be given one. None may restate a scheduled activity of the chain (those are *Plan*'s). Nothing may depict scanning, extraction or automatic capture.
- **Loose.** The inputs appear one at a time, 140 ms apart, from 2000 ms, during the zoom. Each rests at its own place, a share of the frame, clear of the header, the bar and its labels, and drifts on its own slow, irregular path: two sines each way, at most about 10 px across and 6 px up and down, periods of 5.6 to 8.5 s. No rotation, no orbit, no bounce. The three commitments never touch one another.
- **Captured.** At 4500 ms the drift dies away over 600 ms and a rail fades in at the frame's left: Plan's rail, the same width (176 to 220 px) on the same `--jpd-surface-sunken` surface with the same edge, headed *Captured requirements* (13.5/700). It appears in place and never moves. Each input then travels once, straight to its own row, 110 ms apart, over 850 ms, easing out with no overshoot, and its edge and fill fade as it becomes a row. The three commitments take the first three rows, in date order, 36 px apart; a hairline; then the illustrative inputs, 26 px apart. One left edge, one pitch per group. The last is in place at about 6800 ms; a 700 ms hold follows.
- **Connected.** For each commitment in date order: its row takes the Register's selected-row treatment as the camera sets off; on arrival its card fades in with an 8 px rise (500 ms), then its diamond on the chain (from 450 ms), then the connector, drawn from the card down to the diamond (from 650 ms, 500 ms). It is held 2.2 s to be read. The row then carries the same diamond at its right edge: connected. One row is marked at a time.
- **Framing beside the rail.** The chain's start is held 36% across the frame and each dependency's date 64% across, so the card and its diamond are always in the chart, never under the rail.
- **All three.** After the third, the camera eases back over 1.5 s until all three cards and their diamonds are in the chart together, and holds 1.4 s. The rail names what the small cards are. *(Withdrawn: the onward travel through Fabrication to Required On Site.)*
- **The schedule again.** As before: 2.4 s to the whole application; the cards, the rail and its rows fade first; the copy's six-category summary is revealed over the last 650 ms (Section 54.2.2).
- **Phones (frames under 460 px).** Only the three commitments are shown. The rail is a band across the foot of the frame holding their three rows, with no heading, and the chart's content is centred in the room above it.
- **Length.** About 26.7 s, against the original's 25.25 s.
- **Reduced motion:** the resting view at once, the application screen with the summary visible, as before (Section 46.5). Nothing of the inputs or the rail is shown.


**What it argues.** Plan builds the schedule; Connect shows what that schedule needs from other participants. Shown: **what is needed, who owes it, when it is required, and which activity depends on it.** Not shown, because they belong to *Control*: committed or provided dates, actual against planned dates, variances, late or missed indicators, risk indicators, issues, corrective or recovery actions, and any late or warning colour.

**One schedule (founder ruling 2026-11-10).** Connect is a continuation of Plan, not a separate schedule. It draws Plan's scene (Section 54.4.2) unchanged: the same featured Custom Steel Windows and Doors chain, Required On Site September 1, 2027, the same rows, application screen, timescale header and calendar grid. Its dependency dates are derived from that chain by the scheduling engine, never authored: each is required on the first day of the activity it supports. Implementation: `connectChainScene.ts` builds on `buildPlanScene()`; `PlanChainPreview` renders both tabs (`variant="connect"`).

**The three dependencies.** *(Superseded for Connect, 2026-11-11: Connect shows six, placed as in the table at the head of this section. The table below is the shared scenario's own derivation, which is unchanged, and the record of what Connect first showed.)* The approved scenario's commitments (Section 51), status-free:

| Dependency | Type | Responsible | Required by | Supports |
| --- | --- | --- | --- | --- |
| Final Window & Door Design | Design Commitment | Architect | July 6, 2026 | Submittal Coordination |
| Frame Finish & Color Selection | Owner Selection | Owner | August 10, 2026 | Submittal Preparation |
| Final Glazing Specification | Design Commitment | Architect | October 14, 2026 | First Revision Cycle |

*Final Glazing Selection* is renamed *Final Glazing Specification* at its source (the chain scenario and the schedule fixture), 2026-11-10.

**Drawing: the chain's existing commitment design (Section 51.10), reused.** The chain is laid out by the chain's own engine with these commitments, so each card is the engine's card, above the chain, tiered the engine's way, with its leader and diamond at the required-by date: the `kicker` type line, the name in `cardTitle`, *Required by* date and *Responsible · for Activity* in `cardBody`, `--jpd-chain-commitment-fill` with a 1.5px `--jpd-chain-commitment` border at radius 10, the leader in `--jpd-chain-commitment`, the 14px diamond filled `--jpd-chain-commitment`. Never `--jpd-chain-commitment-late`, and no committed, provided or late line. The chain is placed so its bar sits exactly where Plan's does; the cards rise above it into the space the hidden rows leave.

**Motion: one clock** (Sections 46.3, 54.4.2). `connectStateAt(scene, frame, t)` produces the camera and every opacity; the renderer applies it.

| Stage | When | What |
| --- | --- | --- |
| 1. The schedule | 0–800 ms | Plan's resting view: the whole application screen filling the frame. |
| 2. Into the chain | about 2.4 s | The camera zooms into the featured chain, its start in view, at Plan's build scale; the chain's start travels in a straight line on screen. The application and the other rows fade out, and the timescale header and grid fade in, as Plan's pull-back in reverse. |
| 3. Forward | about 18 s | The camera rests on Buyout, then travels forward, never backward, stopping at each dependency in date order with its required-by date about two fifths across the frame. At each stop the diamond appears (350 ms), the connector draws from the diamond up to the card (500 ms), and the card fades in rising 8 px (500 ms); the camera then holds 2.4 s to read it. Revealed cards stay. After the third, the camera travels on to Required On Site, easing back for the long move as Plan does for Fabrication, and holds 1.2 s. |
| 4. The schedule again | about 2.4 s | The camera returns to the whole application screen. The cards, connectors and diamonds, the header and the grid fade out; the other rows and the application fade back in, as in Plan's stage 4. It rests there. Over the last 650 ms the copy's dependency summary is revealed (Section 54.2.2), completing as the camera stops. |

- Moves take 900 ms plus 1 ms per canvas px, from 1200 to 4000 ms, eased in and out; a move longer than the build view eases the camera back to no less than 0.3×, leading the move as in Plan. The chain is centred vertically in the chart beneath the timescale header, with the cards above and the first row of labels below in view.
- There is no step list. The frame is the chain's area throughout.
- **The dependency summary (added 2026-11-11).** The six categories beneath the copy (Section 54.2.2) are revealed from this clock: `connectStateAt` returns `categories`, one value per category, and the visual applies them to the copy's list. Nothing else in the state changes: the cards, the camera, the timing and the final view are as before. The three dependencies above remain the only ones animated.
- It runs once per entry to the tab and rests; leaving parks it. **Reduced motion:** no animation; the resting view, the application screen, is shown (Section 46.5), as in Plan, with the dependency summary visible.

### 54.4.4 Control: one date across the schedule, and today's priorities by party (2026-11-11)

Status: APPROVED (founder brief, then founder approval of the recomposed static composition, 2026-11-11); **implemented and awaiting the founder's review in the browser.** Scope: the general contractor *Control* visual only. Implementation: `controlChainScene.ts` (the date, the rules, the board's layout, the timeline and `controlStateAt`), `ControlLayer.tsx` (the close-up), `ControlBoard.tsx` (the schedule and the list), `controlLayerApply.ts` (applies the state), and the `variant="control"` branch of `PlanChainPreview.tsx`.

**Recomposed 2026-11-11 (founder direction).** The first implementation ended on the whole application screen, scaled to about two fifths, with the list beside it: bars about 3 px tall and type about 4 px. It read as a compressed dashboard. It is withdrawn. The schedule and the list are now drawn for the frame, at the frame's size, and never share it.

**What it must communicate.** *Replace constant urgency with deliberate timing.* Procurement's complexity cannot be removed (Tesler's law of the conservation of complexity); JiTpro carries it, so the general contractor can tell the whole project team what matters now. The reader should recognize a professional procurement schedule at once, see what needs attention today, and see that the priorities are *generated from that schedule*, not assembled as a separate task list.

**One schedule (as Section 54.4.3).** Control reads the schedule Plan and Connect draw: the featured *Custom Steel Windows and Doors* chain, the fourteen other items, and Connect's six dependencies. No chain, activity, date, duration or dependency is changed or authored.

**A date, and one rule.**
- **Today** is fixed and illustrative: **Wednesday, November 18, 2026** (`CONTROL_TODAY`). It is never the visitor's clock.
- **Every activity's state is derived** from its own planned dates (`activityStateAt`): *complete* (planned to finish before today), *needs attention* (under way today, hand-off due within the look-ahead), *in progress* (under way, hand-off further out), *scheduled* (starts after today).
- **The look-ahead is fifteen working days** (`LOOKAHEAD_WORKDAYS`), a three-week look-ahead. Priority is never assigned; it follows from when each hand-off is required.
- **The sample project is on plan.** Work planned to finish before today is shown as done. This is representative demonstration data.

**Why something needs attention today: two kinds, drawn differently (founder direction 2026-11-11).** A required date after today MUST NOT read as overdue.

| Kind | What it is | In the schedule | In the list |
| --- | --- | --- | --- |
| Current work | An activity under way today whose hand-off is due within the look-ahead | Its bar, taller, in two parts divided at today: the part elapsed solid amber; the part still to run, to its due date, open (a `--jpd-row-tint` fill with an amber edge) | Its date, with the working days remaining beneath |
| A commitment falling due | One of Connect's dependencies (Section 54.4.3) required within the look-ahead | An amber diamond on its required-by date, right of the Today line | The same |
| Overdue | Required before today and not provided | **Not present in the sample; no treatment is specified.** If the data ever contains one, specify it here first. It MUST NOT be drawn as either of the above | |

**On this date** five requirements need attention, across four of the fifteen chains:

| Party | Kind | Required action | Item | Required | Protects |
| --- | --- | --- | --- | --- | --- |
| Subcontractors & Vendors | Current work | Second Revision Cycle | Steel Windows & Doors | Nov 24 | Third Submittal Review |
| General Contractor | Commitment | Final Field Dimensions | Steel Windows & Doors | Nov 30 | Release for Fabrication |
| Architect | Current work | Material Selection Coordination | Exterior Stone | Dec 4 | Sample Coordination |
| Consultants | Current work | Mechanical Engineer Review | HVAC Equipment | Dec 8 | Revision |
| Consultants | Current work | Review | Lumber & Framing | Dec 10 | Revision if required |

- *Final Field Dimensions* is read from Connect's data, so Connect and Control agree (resolved 2026-11-11: the first implementation left dependencies out).
- **Party groups.** Owner, Architect, Consultants, Subcontractors & Vendors, General Contractor. The schedule data does not separate subcontractors from vendors, so they are one group until it does (founder ruling 2026-11-11).
- **A party with nothing required** is listed as such, with its real next activity. On this date that is the Owner. It MUST NOT be given a requirement by hand.
- Long work under way, such as steel fabrication, is not a priority merely for being open.

**The board: drawn for the frame.** Two designs, each on its own canvas and scaled to the frame as vector, never the application screen scaled down:

| | Desktop frame (from 460 px) | Narrow frame |
| --- | --- | --- |
| Canvas | 560 × 350 | 340 × 212 |
| Chains shown | Seven of fifteen | Five of fifteen |
| Row height | 36 px: the item's name (12.5/600) over where it stands today (10) | 26 px: the name (11.5/600) |
| Calendar | September 2026 to November 2027 | September 2026 to June 2027 |
| Priorities listed | All five | The soonest three, and *2 more required by Dec 10* |

- **The chains shown** are a presentation choice, not a change to the data. Every chain with a requirement is shown, so no priority names work the reader has not seen: *Lumber & Framing*, *Exterior Stone*, *HVAC Equipment*, *Steel Windows & Doors*. The others show different stages on the same date: *Structural Steel* (fabrication under way), *Electrical Switchgear* (a review begun the day before; desktop only), *Cabinetry & Casework* (not yet started; desktop only). They keep the schedule's Required On Site order. The foot states *7 of 15 items*.
- **Display names** are shortened (`BOARD_NAME`), for example *HVAC Equipment* for *Custom Air Handling & HVAC Equipment*. The data is unchanged.
- **No application chrome.** No sidebar, top bar, notifications, Export, Add Item, filters or zoom controls. A title strip, a calendar header, the rows and a key.
- **The calendar header is two rows (founder direction 2026-11-11):** the year over its months, so the turn from December 2026 to January 2027 is legible. A stronger line marks each year.
- **Bars** are 12 px (10 px narrow), with a hairline between neighbours: *complete* solid `--jpd-state-complete`; *under way* solid `--jpd-state-active`; *scheduled* an outline, `--jpd-state-scheduled-edge` on `--jpd-state-scheduled-fill`. State is carried by form as well as tone (Section 8.8). The chain's family colours (Section 51.7) are not used here, so amber is the only hue.
- **Required On Site** is the chain's diamond, `--jpd-chain-ros`, on its date, with the date beside it where there is room.
- **Today** is one 2 px amber line across every row, with a flag in the title strip: *Today · Nov 18* (9.5/800, uppercase by CSS, `--jpd-nav-bg-start` on `--jpd-accent`).
- **Amber means Today and what needs attention, and nothing else.** A row with a requirement also takes a 3 px amber marker at its left edge.
- **The key:** *Due within 3 weeks*, *Under way*, *Scheduled*, and on a desktop frame *Complete* and *Required on site*.

**New tokens (approved in principle 2026-11-11; `scheduleTokens.css`).** Activity state without family, each at least 3:1 on `--jpd-surface`:

| Token | Value | Use |
| --- | --- | --- |
| `--jpd-state-complete` | `#8793a1` | A complete activity's bar |
| `--jpd-state-active` | `#3f4b5a` | An activity under way |
| `--jpd-state-scheduled-fill` | `#eef1f4` | A scheduled activity's fill |
| `--jpd-state-scheduled-edge` | `#7f8b99` | A scheduled activity's outline |

Everything else is an existing token: `--jpd-accent`, `--jpd-row-tint`, `--jpd-nav-bg-start`, `--jpd-chain-ros`, `--jpd-grid`, `--jpd-grid-strong`, `--jpd-surface-header`, `--jpd-surface` and the `--jpd-text-*` inks.

**The stages,** on one clock (Section 46.3), about 18.5 s:

| Stage | When | What |
| --- | --- | --- |
| 1. The chain | 0 – 1000 ms | The featured chain, whole, with its summary row, as Plan holds it. |
| 2. Today | 1000 – 2600 ms | An amber line is drawn downward at today (500 ms); its flag follows; work before it is subdued. Held about 1.1 s. |
| 3. Now, and not yet | 2600 – 7830 ms | The camera moves in to today (1.6 s). The activity needing attention (*Second Revision Cycle*) takes an amber ring, then *Work on this now*. About 1.3 s later the next two activities are each annotated *Not yet*. Held 1.5 s. |
| A. The schedule | 7830 – 13460 ms | The view opens out (2.2 s) from exactly where the close-up left today and the featured row: the board's calendar starts as wide as the chain's and eases to its own scale while the other rows, the calendar and the names fade in and the chain's own drawing fades out. Held 900 ms. Each requirement is then lit, 220 ms apart in date order. Held 1.3 s. |
| T. The transition | 13460 – 16430 ms | The other chains recede to 16%, and a priority chain's own other activities to 30%. For each requirement, in order, a connector is drawn from its mark to its required date at the row's right, and its responsible party takes the line beneath the item's name. Held 1.5 s. |
| B. By party | 16430 ms to the end | The same marks, parties and dates move into the list (1.1 s): each amber mark becomes the amber rule of its row, each date travels straight down its own column, each party travels to its group's heading, and the title becomes *Today's Priorities*. The Today flag moves to the list's corner and stays. Each row's wording then appears, 150 ms apart; then any party with nothing required. It rests there. |

**The list.**
- **Desktop:** a column header (*Responsible party*, *Required action*, *Required by*); then 45 px rows. The party (11/700) once per group; the required action (13.5/700) beside its amber rule, with the item and *protects* next activity beneath (10.5); the date (14/700) at the right with the working days remaining beneath (9.5). No text is truncated. Parties appear in order of their soonest date.
- **Narrow:** 50 px rows: the party above the action, *Protects …* beneath, the date at the right.
- **A requirement on the same chain as another** (the featured chain has two) takes its own lane in the transition, above or below the bar, and that row's name gives way to the two parties.

**What it MUST NOT claim.**
- That JiTpro directs owners, architects, consultants or vendors. The list is what the general contractor's team can communicate (Sections 20.1, 54.3).
- That anything is late, at risk, recovered or guaranteed, or that a future date is overdue.
- That work marked *Not yet* can be ignored.
- Priorities MUST come from the rules. Nothing may be marked, listed or left out by hand, and the look-ahead MUST NOT be tuned per item. The choice of which chains to show MUST NOT hide a chain that has a requirement.

**Motion.** One state, `controlStateAt(scene, control, frame, t)`: Plan's `PlanState` for the chain, plus the close-up's line, wash, ring and annotations, plus the board's progress values. The renderer applies it and decides nothing. Fades, one drawn line, drawn connectors, one camera move and two eased changes of layout; nothing bounces, pulses or loops (Section 46.4). It runs once per entry to the tab and rests; leaving parks it at stage 1. A resize re-frames the same moment. **Reduced motion:** the resting state at once, the list (Section 46.5).

**No replay control (open item 7, Section 54.5).** Unchanged: left for a founder decision that covers all four tabs.

**Accessibility.** The visual column stays `aria-hidden`; nothing in it is focusable. The copy carries the meaning (Section 46.2).

**Provenance.** Representative demonstration data: Plan's schedule, Connect's dependencies and one illustrative date. The frame carries no caption (Section 46.12).

### 54.4.5 Project owners: four visuals (2026-11-11; *Reduce risk* and *Protect your investment* redrawn as illustrations, 2026-11-12)

Status: APPROVED in direction (founder brief, 2026-11-11, which directed all four to be built in one pass without a mockup round); **implemented and awaiting the founder's review in the browser.** Scope: the four *Project owners* tabs. Implementation: `ownerScenes.ts` (the data read from the sample project, each visual's cues, the clock and the layouts), `OwnerVisual.tsx` (the drawing), wired in `AudienceSection.tsx`.

**Who it speaks to.** The owner is not JiTpro's user or buyer; the general contractor is (Sections 20.1, 54.3). Each visual shows what the contractor's procurement planning lets the owner see or avoid, so that the owner concludes: *I want my general contractor using this on my project.* A visual MUST NOT depict the owner operating software, MUST NOT suggest JiTpro replaces the contractor's project management, and MUST NOT promise an outcome, a saving, a figure or a date.

**Illustrations, not data (2026-11-13).** All four owner visuals are illustrations and read no project data. *More predictability* read the sample project's owner decisions (a calendar look-ahead) until it was redrawn as an approach and landing on 2026-11-13; that data, its look-ahead window and its date wording are withdrawn with it.

**The four visuals.** Each is one clock of cues (Section 46.3), ends on a closing line supplied by the founder, and rests there.

| Tab | Length | What happens | Closing line |
| --- | --- | --- | --- |
| Reduce risk | 16.9 s | Redrawn 2026-11-12 as an illustration and refined several times; specified below. *Trust:* three project documents spread across the frame: drawings, a construction contract naming a *Budget* and a *Completion date*, and a specification. *Uncertainty:* a pair of dice rolls across them and stops in the middle of the frame: *Hoping everything goes according to plan?* *Surprises:* six notices land either side of the dice, never on them, faster and faster: *Change order*, *Schedule delay*, *Cost overrun*, *Decision needed now*, *More revisions*, *Another surprise*. A brief pause. *The sweep:* a hand reaches in from the lower left and pushes up to the right; all six notices and both dice go off the table ahead of it, and the hand is drawn back the way it came; the documents stay. *Reset:* the documents are seen alone for a beat, then step back. *The turn:* one line alone on the cleared table, *It doesn't have to be this way.*, read once and gone. *A better alternative:* the contractor's plan slides in and its six lines are checked. *Confidence:* a navy stage is drawn across the frame and the plan, enlarged, stands on it beside the closing lockup. | *Confidence requires a plan.* over *Your contractor's procurement plan. Powered by JiTpro.* |
| Protect your investment | 25.6 s | Redrawn 2026-11-12 as an illustration, and recomposed twice the same day; specified below. The general contractor stands in the middle; *Owner*, *Design team*, *Consultants* and *Vendors* stand in the four corners. *Contractor out of control*: the contractor's card sits askew; jagged lines run outward to all four; rushed requests follow them, each group's its own; each group shows what it costs. All of that is withdrawn. *Contractor in control*: a shield is drawn around the contractor, with JiTpro; a level line reaches each of the same four, and each settles: Owner *In control*, Design team *Aligned*, Consultants *Coordinated*, Vendors *Ready* (2026-11-12; they had been *Informed*, *Aligned*, *Coordinated*, *Clarity*). Nothing is taken away for the close. A navy foot bar is there throughout; only its words change, one pair for each state. | *Weak procurement planning creates waste across the entire project.* / *More disruption. Higher costs. Greater risk to your investment.*, from the first frame; then *Early, precise procurement planning protects your investment.* / *Less disruption. Better coordination. Greater cost control.* (2026-11-13) |
| More predictability | 18.7 s | Redrawn 2026-11-13 as an approach and landing, refined the same day; specified below. One executive turboprop on a stable approach to one runway, with a long *PLANNED COMPLETION ZONE*, a boundary, and beyond it *ADDED TIME · ADDED COST*. Its *PROJECTED FINISH* opens wide and red in the overrun; three procurement-planning waypoints appear on a long, shallow approach, each narrowing the forecast and drawing it into the planned zone; it touches down early in the zone, rolls out and stops with runway to spare. | *Better procurement planning helps your project stay on course.* / *More predictable schedules. Better cost control. Greater confidence in the finish.*, from the first frame |
| Better decisions | 34.6 s, once | Redrawn 2026-11-13 as a decision timing window; refined the same day for option discovery; specified below. A lens-shaped corridor, narrow, widest, narrow. One amber *NOW* marker and a stack of choices travel together, left to right, without a reset: *too early*, three known choices; three more *discovered* one at a time; *the right time*, six viable in the amber decision window; four *no longer viable* one at a time, crossed out in place; *too late*, two remain. Then the six rest, all available, in the decision window. | *Premature decisions can limit your choices.* / *Incomplete information. Unnecessary commitments.*; *The right timing preserves your choices.* / *Enough information. Enough time. Better decisions.*; *Delayed decisions can eliminate your options.* / *Less time. Fewer choices. Greater pressure.*; closing on *Correctly timed information and decisions protect your options.* / *JiTpro helps your contractor plan early and communicate exactly when decisions are needed.* |

**Reduce risk, redrawn as an illustration (2026-11-12).** Status: APPROVED in direction (founder brief, 2026-11-12, which directed it to be built in this pass without a storyboard or mockup round); **implemented, refined once on the founder's review (brief of 2026-11-12, *Reduce Risk Refinement*: the direction is kept; the message and the storytelling are sharpened), and awaiting his review in the browser.** It replaces the 2026-11-11 visual (five construction phases over a layer of unmanaged requirements), which the founder judged too complicated: the viewer had to read a timeline and follow dependencies to get the point. Implementation: `GAMBLE_*`, `gambleGeometry` and `riskScene` in `ownerScenes.ts`; `RiskVisual` in `OwnerVisual.tsx`.

- **The idea** (Tesler's law, the conservation of complexity). Procurement is complex, and the contractor carries that complexity; the owner should not have to understand it to see why it matters. So this visual shows no procurement at all. Its story is five feelings in order: **trust, uncertainty, surprises, better management, confidence.** It does not say that construction is a gamble or that contractors cannot be trusted; it says an owner should not have to *feel* they are gambling, and that confidence comes from a contractor's credible process. It is not meant to frighten. *Think like a genius. Speak like a third grader.*
- **MUST NOT appear:** a procurement schedule, a Gantt chart, a chain, a dependency diagram, an application screen or dashboard, a casino or any gambling imagery other than the two dice, a character, a figure, an amount, a percentage or a date.
- **Every scene has an obvious meaning** (added on refinement). One dominant idea at a time. Nothing appears, moves or leaves without the picture saying why: the project begins as *real documents*; the dice roll *across them* and stop in the middle, so what is being gambled is plain; the notices gather *around the dice and never over them*, so the metaphor stays in view while the pressure builds; they and the dice do not simply vanish, *a hand sweeps them away*; the documents are left, then step back; and the plan takes their place. The opening is stable, the middle crowded, the end orderly: the contrast carries the story.
- **The objects,** in the document style of Identify (Section 54.4.1): white paper (`--jp-surface-white`) outlined and detailed in one ink (`--jp-ink-secondary`) at several strengths, text lines drawn as bars rather than written small, a soft offset beneath each sheet in place of a shadow.
  - **Three project documents** (founder, 2026-11-12; there had been two, and the opening was sparse), spread across the frame, overlapping a little, balanced about the middle: the drawings to the left, the contract in the middle, the specification to the right, the two outer ones turned slightly in opposite directions. They are never swept away; when the plan arrives they step back to 16% and the plan is laid over them.
  - **The drawings:** three sheets, slightly turned; the top one a front elevation with a dimension string and a title block. **The house is the Hero's house (2026-11-12),** redrawn flat in the documents' line as a plan set would show it, never the render itself placed or traced on the sheet: the tall pylon with its slot of light, the slatted roof pergola, the great roof and its overhang, the glazed upper storey behind its balcony rail, the cantilevered slab, the glazed ground storey with the stair seen through it, the garage, the lower wing to the left, and the entry steps. Line only, `--jp-ink-secondary` at two strengths; no fill, no shading, no amber. (It replaces a generic gabled house, which the founder set aside: the drawings should show the kind of house JiTpro's contractors build.) No lettering.
  - **The contract:** headed *Construction contract* (*Contract* on a narrow frame), with two prominent lines in `--jpd-nav-bg-start`: a dollar sign in a ring beside *BUDGET*, and a calendar beside *COMPLETION DATE*. Where a figure would be written there is a bar. Two signatures at the foot.
  - **The specification:** a bound page with three punched holes down its margin, headed *Specifications* (*Specs* on a narrow frame), with three sections of text under sub-headings, all drawn as bars.
  - **The ground** (2026-11-12): the documents lie on a drawing sheet, not on a blank frame. `--jp-surface-light`, a cool off-white, so the white papers lift off it; over it the faint grid and the border the closing stage has, on the same pitch and inset (28 and 10 on a desktop frame, 21.2 and 6 on a narrow one), here in `--jp-ink-secondary` at 7% and 22%. It is there from the first moment to the close, where the navy stage covers it. Flat: no gradient, vignette, glow or image, and no house render. It is a surface, never a second picture: nothing is drawn on it but the grid and the border.
  - **The dice:** two, in `--jpd-accent` with `--jpd-nav-bg-start` pips, resting on a three and a five (not a pair, not a seven; the faces mean nothing). They roll in from the right, across the specification and the contract, and stop **in the middle of the frame**, on the contract beneath its two promises. **They are never covered:** from the moment they stop until the hand takes them they are in full view and are the focal point.
  - **The notices:** six forms, each with a `--jpd-chain-commitment-late` edge, lettered in navy: *CHANGE ORDER*, *SCHEDULE DELAY*, *COST OVERRUN*, *DECISION NEEDED NOW*, *MORE REVISIONS*, *ANOTHER SURPRISE*. *Decision needed now* alone is lettered in the late colour. They arrive on alternating sides and pile in two columns of three, one to the left of the dice and one to the right, mirrored; within a column each lands a little lower than the one above and turned the other way, overlapping it only slightly, so every heading stays readable. No notice, however turned, comes within 12 px of a die (8 on a narrow frame), and none covers the contract's two promises.
  - **The hand (redrawn 2026-11-12, founder correction):** ONE FINISHED ILLUSTRATION of a right hand and forearm, palm down, seen from above and a little to its leading side, drawn once as curved outlines in its own file (`SweepingHand.tsx`) and placed, turned and moved as a single object. **It is never built from bars, blocks, thick strokes or stepped rectangles, and no part of it is animated separately: no finger moves.** The silhouette: a sleeve that narrows toward the wrist and gathers in two soft creases at the elbow; a shirt cuff; the wrist; the heel and back of the hand; four fingers held together, tapering to rounded tips of natural lengths; the thumb held a little apart. Detail stops there: no nails, no knuckles, no skin. **Colour:** the documents' own. The hand is `--jp-surface-white` under a 6% wash of `--jp-ink-secondary`, with a 16% sliver along its leading side (the side turned toward the viewer); the sleeve carries a 22% wash; the cuff is white; every outline is `--jpd-nav-bg-start` at about 1.4 px; a soft offset of ink at 13% lies beneath it, never a blur. No skin tone, no amber (the dice are the accent), and no solid navy sleeve: a dark sleeve reads as a bar. **Size:** set by what it pushes, the dice and the notices, not by the documents: the illustration is drawn at 1.35 on a desktop frame and 0.82 on a narrow one, so a die is about a finger and a half wide. **Attitude:** turned 44° from upright, fingers toward the upper right, and travelling at 38° above level: it leads with its fingers and goes slightly side-on. Its middle fingertip is aimed at the dice. **It is never an arm that crosses the frame.** Two earlier drawings were rejected by the founder: an upright arm made of rounded rectangles moving level (stiff and crude), and a hand on a long parallel-sided navy sleeve that swept sideways and left by the top and right, so that the sleeve did most of the pushing (*a thick diagonal bar with a crude attached hand*).
  - **The plan:** a sheet with a `--jpd-accent` band across its top, the kicker *Your contractor's*, the title *Procurement plan*, the word *JiTpro* at its head, and six lines (founder, second refinement), each with a box that is then checked in `--jpd-ok-fg`: *Critical needs identified*, *Decisions scheduled*, *Responsibilities assigned*, *Long-lead items planned*, *Key approvals tracked*, *Risks surfaced early*. The founder's *Responsibilities clearly assigned* is set without *clearly* so the line fits the card at its type size. It stands as tall as the contract beside it.
- **Amber follows the point** (the von Restorff effect). While the gamble is on, the dice are the only amber thing in the frame. Once the plan has covered them, the plan is. The two are never both in view at rest. On the closing stage amber is used three times, all small: the band across the plan, the short rule above the headline, and the words *Powered by JiTpro.*
- **The sequence,** one clock (Section 46.3), 16.9 s (slowed about 15% up to the end of the sweep, 2026-11-12, so each part can be taken in; the plan and the close keep their pace). (1) *Trust,* to 2.4 s: the drawings, the contract and the specification, one after another, then the contract's two promises. (2) *Uncertainty,* from 2.4 s: the dice roll in from the right across the documents and stop in the middle of the frame; at 4.05 s the question appears on one line beneath everything, *Hoping everything goes according to plan?*, and stays. (3) *Surprises,* from 4.85 s: six notices, one at a time on alternating sides of the dice, each sooner after the last (490 ms falling to 305) and quicker to land (500 ms falling to 300): mounting pressure. The sixth is down at 7.13 s. (4) *The pause,* 0.85 s: documents, dice, question and six notices are all in view and nothing moves. (5) *The sweep,* at 7.98 s, 1.55 s long: the question goes; the hand reaches in from beyond the lower left corner, fingers first, and pushes up and to the right. Each notice and each die stays exactly where it is until it is reached, by the hand's own outline or by something already moving that runs into it (the hand takes the nearest notice and arrives at the dice; a pile of notices goes as a pile; the dice knock on the notices beyond them), then travels the way the hand is going, turning a little, until it is off the canvas. The hand keeps exactly with what it pushes for the first 45% of the sweep's time, by which point everything is moving; then it slows, turns round a little past the middle of the frame, and is drawn back the way it came, out of sight by the end, while what it pushed carries on off the table. Nothing is faded out; things leave because they are pushed. The three documents do not move, and the forearm never crosses the frame. (6) *The reset,* at 9.68 s: the documents are seen alone for a beat, then step back together to 16%. (7) *The turn* (added 2026-11-12), at 9.78 s: as the documents step back, one line appears alone in the middle of the cleared table, where the dice were: *It doesn't have to be this way.* (the founder's words; set with a typographic apostrophe). It is the caption's own type, larger (22 px on a desktop frame, 14 px on a narrow one), bold, `--jpd-nav-bg-start`, centred; no rule, no accent, no box. It fades in over 0.35 s, is held 1.1 s with nothing else moving, and fades over 0.3 s; it is gone before the plan sets out. It is never shown under reduced motion, whose state is the close. (8) *A better alternative,* at 11.53 s: the contractor's plan slides in from the right and settles over them; its six lines appear and are checked one at a time. (9) *Confidence,* at 14.5 s: a navy stage is drawn across the whole frame and the plan, the one thing left on it, travels to the left and grows (×1.4 on a desktop frame, ×1.18 on a narrow one); the closing lockup appears to its right. It rests there. That is also the reduced-motion state (Section 46.5): the hand, the notices and the dice are never shown under reduced motion. It does not loop.
- **The closing frame** (founder, second and third refinements: the ending is the emotional and visual centrepiece, and must feel conclusive, branded and reassuring, not a small card in a white box). Priority, in order: the plan; the headline; the supporting line. Nothing else is in the frame. The owner should leave thinking *This is the kind of contractor process I want behind my project.*
  - **The stage:** the whole frame in `--jpd-nav-bg-start`, the brand's navy, for assurance and to give the white plan something to stand on. On it, very faintly, the grid of a drawing sheet (`--jpd-nav-text` at 5.5%) and a thin sheet border (20%) set in from the edge. No other texture, and none of the earlier objects.
  - **The plan,** the hero: white on navy, at the left, about 77% of the frame's height on a desktop frame and 89% on a narrow one, with an even margin above and below.
  - **The lockup,** to its right, set flush left on one edge and centred on the plan's height: a short amber rule; *Confidence* / *requires a plan.* on two lines, 24 / 15 in `--jpd-nav-text`, the largest type in the frame; *Your contractor's procurement plan.* at 11.5 / 9 in `--jpd-nav-text` at 78% (on two lines on a narrow frame); then *Powered by JiTpro.* in bold `--jpd-accent`.
  - It adds no interface, schedule or diagram: composition, colour and hierarchy only (Tesler's law). This tab's closing differs from the other three owner tabs, which keep a single line beneath a rule on the white frame.
- **The words.** The founder's, as supplied: the two promises, the caption (set on two lines), the three notices, the plan's six lines (one shortened, above), and the closing lockup. AUTHORED, for the founder's review: the document headings *Construction contract*, *Your contractor's* and *Procurement plan*.
- **What it must not say.** Not every change order is a failure of management, and not every delay is preventable: the notices are the owner's fear, shown once, never counted, priced or attributed. The sweep is the turn of the story: the pile of surprises is cleared away and a plan is laid in its place. It is not a claim that no change order, overrun or delay will occur, and neither the budget nor the completion date is shown as guaranteed: both are simply back in view before the close. (An earlier version lifted one notice away as each of three plan lines was checked; that pairing is withdrawn.) *Powered by JiTpro* names what stands behind the contractor's plan; the plan remains the contractor's. The plan is the contractor's. The owner operates nothing, and no software is drawn.
- **A scoped exception to Section 46.4 (founder briefs, 2026-11-12: *the dice may roll and bounce*; on refinement, *the dice can roll*, with no excessive spinning or bouncing).** Section 46.4 prohibits spinning and bouncing. Here two dice turn and hop once as they roll in, because rolling is what dice do and the roll is the metaphor (Section 46.1): it is the depiction of an object, not an easing applied to an interface element. On refinement it was reduced: two hops, the second lower than the first; less than one turn; about one second; the dice never pass their resting place, nothing overshoots, nothing loops, and the dice no longer roll away. The exception covers this one roll and nothing else. (Section 46.4 also bars *scaling* in some component contexts; the closing push is a single eased camera move onto the subject, of the kind Identify's pull-back already makes, Section 54.4.1.) **It needs the founder's explicit confirmation as an amendment to an APPROVED section** (open item 15).
- **The clock** gained three things for this visual, all pure and unit-tested: a cue may *arrive from* an offset and a turn, slowing as it lands; may *roll in*, as above; and a travelling cue may turn as it goes. Each element has a turn as well as an opacity, a rise and a travel. The plan also arrives from an offset, settling with a slight turn, and a travelling cue may now grow as it goes (the closing push; one scale, no overshoot). The other three visuals use none of them and are unchanged. For the sweep it gained one more: a cue may be *pushed* in any direction, staying put until the sweep reaches it and then moving exactly with it, the same way; the hand and everything it pushes share one sweep. The hand's withdrawal uses the existing travel: it is the same sweep less a return of the same length, so no second clock exists. **Contact is computed, not placed** (revised 2026-11-12): the layout carries the hand's outline, and works out how far the sweep must travel before that outline comes within a sliver of each notice and die, or before something already moving runs into it. Tests follow every notice and die at both sizes: untouched until reached; set moving by the hand or by a thing already moving, each traced back to the hand; never run through by the hand; the hand's fingertips within a finger's width of each die as it goes; off the canvas by three-quarters of the way through. They confirm the hand is carried as one object (never turned or scaled), goes out once and comes back along one line, is in the frame, fingertips and all, at its furthest, and is wholly out of sight, cut end of the sleeve included, before and after.
- **Composition** (desktop 560 × 350 / narrow 340 × 212). Drawings left, contract centred, specification right; the dice at the centre of the frame; a column of three notices either side of them; the question on one line along the foot. The plan is laid at the right, over the documents once they have stepped back, on top of everything. At the close the plan stands at the left of the navy stage and the lockup to its right. Type: document headings 8.5 / 7.5; the promises 10 / 8.5; the question 13 / 10; notice headings 12 / 8.5; plan title 12.5 / 10; plan lines 10.5 / 8.5 (14.7 / 10 once enlarged). On a narrow frame *Completion date* is set on two lines and every object is redrawn at its own size rather than scaled down.

**Protect your investment, redrawn as an illustration (2026-11-12; recomposed twice the same day).** Status: APPROVED in direction (founder briefs, 2026-11-12, which directed it to be built without a storyboard or mockup round); **implemented and awaiting the founder's review in the browser.** Three versions preceded it, each withdrawn: the 2026-11-11 procurement-chain diagram; a three-column *one problem, many bills* story ending on an enlarged plan card (too like *Reduce risk*, and static); and a hub with the owner's project in the middle of a shield (it made the project and the plan the subject, and cast the contractor as the source of the trouble in a corner). Implementation: `TEAM*`, `teamGeometry`, `zigzag`, `shieldPath` and `investmentScene` in `ownerScenes.ts`; `InvestmentVisual` in `OwnerVisual.tsx`.

- **The general contractor is the hero.** This is the rule the composition is built on. The contractor stands in the middle of the frame from the first moment to the last: not the project, not a plan card, not JiTpro by itself. The tab is not about an owner protecting themselves from their contractor; it is about an owner valuing a contractor who controls the process well enough to protect the owner's whole investment. JiTpro is the framework that helps the contractor do it. The owner should think: *This is the kind of contractor I want on my project.*
- **Two states of one picture.** *Contractor out of control*: disorder propagates outward from the middle through everyone. *Contractor in control*: the same network, calm and coordinated. The emotional contrast is **chaos to calm, friction to coordination, stress to control**; the second state is peace and clarity, not merely efficiency, and is given at least as long on screen as the first.
- **The four groups** the contractor's coordination reaches, one card in each corner: *Owner* (top left), *Design team* (top right), *Consultants* (bottom right), *Vendors* (bottom left). Vendors are usually managed through the contractor; their disruption still reaches cost, timing and the owner's risk, so they belong in the picture.

  | Group | Out of control (in `--jpd-chain-commitment-late`) | In control (a check in `--jpd-ok-fg`, the word in navy) |
  | --- | --- | --- |
  | Owner | Cost exposure | Informed |
  | Design team | Repeated revisions | Aligned |
  | Consultants | Extra review | Coordinated |
  | Vendors | Stop-start flow | Clarity |

  The effects are four of those the brief lists, one per group; the calm words are four of those it offers. **The word *scheduled* MUST NOT appear** on the cards or in the close: it is too narrow and too mechanical. This is about coordination, collaboration and clarity, not a timetable.
- **A distinct identity.** The same family as *Reduce risk* (paper cards in `--jp-surface-white` and `--jp-ink-secondary`, navy and amber) and a different picture: a connected ecosystem with its centre occupied. It MUST NOT end on a card beside a slogan, MUST NOT use the full navy stage, and MUST NOT leave the centre to anything but the contractor.
- **MUST NOT appear:** a figure of a person, a warrior, a crest or other historical or fantasy device, an insurance-style badge, a photograph, an application screen, schedule, chart or dependency diagram, an amount, percentage or date.
- **The objects.**
  - **The contractor, out of control:** a plain card turned five degrees, outlined in the late colour, with a hard hat tipped on it and the name *General contractor* (*Contractor* on a narrow frame).
  - **The contractor, in control:** the same hat and name, upright, in `--jpd-nav-text` inside a shield filled `--jpd-nav-bg-start` and edged `--jpd-accent`, with the word *JiTpro* beneath in amber. The shield is a flat top with rounded shoulders, upright sides, drawing in to a point: modern and plain. It is the anchor of the whole picture and the largest thing in it (146 × 172 / 88 × 104). Its depth is a soft offset beneath it and a second, fine line just inside its edge; beneath the name a short amber rule sets off the mark. No gloss, gradient or glow.
  - **Friction:** a jagged line in the late colour from the contractor out to each group.
  - **Rushed requests** (each group's own, 2026-11-12): eight small slips outlined and lettered in the late colour, two to each group: Owner *SURPRISE*, *RUSHED DECISION*; Design team *ASAP*, *NO PRIORITY*; Consultants *ASAP*, *NO PRIORITY*; Vendors *RUSHED DEADLINES*, *RESCHEDULED*. (The founder's *Unrealistic deadlines* is set as the brief's own fallback, *Rushed deadlines*: the longer would run off the frame at the slip's type size.) The type is one size on every slip (9.5 px on a desktop frame, 7.5 px on a narrow one, bold capitals, the late colour) and a slip is as wide as its words need, never narrower than before and never squeezed. Each rests with its inner end at the card's inner corner and runs outward over the card, never toward the contractor: the first across the card's top edge, the second just below its foot, clear of the words on the card.
  - **What it costs each group** (2026-11-12), on the card in the late colour: Owner *Last-minute decisions*; Design team *Competing urgent requests*; Consultants *Competing urgent requests*; Vendors *Stop-start work*. One line, or two where one will not fit between the card's edges (*Competing* / *urgent requests*), centred on the same line as the calm word that replaces it.
  - **Wasted money** (founder direction, 2026-11-12; refined the same day), in the first state only. **The dumpster:** a construction roll-off dumpster, low in the middle of the frame beneath the contractor. It is **a plain rectangular steel box: open top, flat bottom, sitting directly on the ground**; corrugated sides, a rail along the top edge, a skid line along the foot, a post at each corner; long and low (104 × 38 / 66 × 22), navy, heavy and grounded. It is seen from slightly above and to one side, so the open top (the shadowed inside of the box, about a third of its height) and one end show. It MUST NOT have wheels, rollers, a handle, a hook, a lid, tapering sides, or anything else that makes it read as a cart, a coal bin or a household bin: two earlier drawings (a lidded bin; then a tapered container on rollers with a hook-up bar) were rejected by the founder for exactly that. It is drawn in two layers, its end and interior behind and its near wall in front, so that what falls in goes *inside*; a bill comes to rest far enough below the near edge that the wall hides all of it. **The bills:** a paper note with a dollar sign on an amber disc and no figure. Fifteen: three from each of **five** parties, the contractor and the four groups (founder, 2026-11-12: everyone loses money when the project is not controlled, the contractor included). They are launched one at a time, the contractor first in each round and then the groups in turn, each a little sooner than the last (195 ms apart falling to about 100), so the drain builds; never more than eleven in the air. The contractor's own bills leave the foot of the contractor's card and fall the short way straight down (0.8 s). **The path** is a smooth curve of about 1.1 s, never a straight dash: from an upper card a bill drops from the foot of the card and sweeps in beneath the contractor; from a lower card it lifts off the inner edge and over; either way it comes over the dumpster and its last stretch is straight down through the open top, gathering speed as a falling thing does, to rest below the front edge. It stays fully visible until it is inside, never crosses a wall, and never crosses the contractor's card; later bills land further along the container. **The stop:** no bill is launched after the first state is withdrawn; those in the air finish their fall; the dumpster fades as the shield begins to be drawn. Nothing of it remains in the second state or at rest, so reduced motion never shows it. It stands for *avoidable waste caused by poor coordination*, never for professional fees as such; it MUST NOT carry an amount, a count or a saving. Each of these properties is held by a unit test that follows every bill along its path in both designs.
  - **Protected value** (founder direction, 2026-11-12; the symbol replaced the same day), in the second state only: **a small shield with a dollar sign**, the same for all five. It is the picture's own shield in small: `--jpd-nav-bg-start`, an `--jpd-accent` edge, a `--jpd-nav-text` dollar sign in the middle, a soft offset beneath, and nothing else. No gradient, no figure, no second shield inside it; 18 × 21 on a desktop frame and 13 × 15 on a narrow one, the dollar sign about 12 and 8 px. On a group's card it rests at the inner foot, where the second rushed request had been. For the contractor it stands just outside the great shield, at its lower right, never on it: a shield drawn on the shield would be one nested in another. The five settle one by one, the four groups and then the contractor, only after every group is connected and calm, and they remain at rest. It answers the dumpster: where money was leaving, value is now protected. It stands for *financial value protected through disciplined procurement management*, not for guaranteed savings and not for immunity from legitimate project costs; it MUST NOT carry an amount. (It replaces a small stack of coins, which the founder set aside; money bags, piggy banks and anything that reads as *rich* remain out of bounds.)
  - **Coordination:** a level navy line from the shield to each group, with two rounded corners, an amber node where it leaves the shield and a navy node where it reaches the card. On each side one turns up and one down; none shares a path.
  - **The state** is no longer named above the picture (founder, 2026-11-13): *Weak procurement planning* and *Precise procurement planning* had stood above the contractor in small capitals; the foot's words now carry the distinction, and nothing replaces them.
  - **The foot** (2026-11-12): one band, `--jpd-nav-bg-start` along the foot of the frame, an `--jpd-accent` edge along its top, carrying a line in bold `--jpd-nav-text` and a phrase beneath it in bold `--jpd-accent`, centred, at the same sizes and positions in both states. **The bar is scenery** (founder, later 2026-11-12): it comes in with the opening and stays to the end, never fading; only its words change, one pair for each state, by a plain fade (0.5 s, rising 5 units). One implementation draws both under one bar. *Weak planning:* *Weak procurement planning creates waste across the entire project.* over *More disruption. Higher costs. Greater risk to your investment.* *Precise planning:* *Early, precise procurement planning protects your investment.* over *Less disruption. Better coordination. Greater cost control.* (founder, 2026-11-13; they had been *Weak procurement planning puts your investment at risk.* / *Preventable delays. Rising costs. Eroding profits.* and *A coordinated contractor protects your investment.* / *JiTpro gets the field what it needs, when it needs it.*). The words speak of the planning process, never of the contractor as the problem or the hero. **The bar is drawn once and never fades** (2026-11-13): it and its amber edge are there from the first frame to the end, and no later layer can cover its words. **The words fade with the story** (founder, later 2026-11-13, superseding the same day's instant words): each scene opens on its words, faded in over 0.7 s, and the first scene's words fade out with that scene; the words are blank only before the first fade and in the short beat between the scenes. The second pair stays to the end.
- **The sequence,** one clock (Section 46.3), 25.6 s, played once. **Two scenes, each like a short film** (founder, 2026-11-13): message first, illustration second, hold the outcome, fade out, then the next scene. *The frame,* from the first frame: the sheet and the foot's bar with its amber edge; nothing else. **Scene 1, weak procurement planning.** (1) 0.4–1.1 s: *Weak procurement planning creates waste across the entire project.* / *More disruption. Higher costs. Greater risk to your investment.* fades in. (2) After a 0.4 s pause, 1.5 s: the contractor's card fades in where it stands (opacity only). (3) From 2.3 s: the Owner, Design team, Consultants and Vendors cards fade in, 0.25 s apart, opacity only. (4) From 4.0 s, at its existing pace: the jagged lines are drawn outward; a rushed request flies along each to its group; from 6.15 s a jobsite dumpster, and bills falling into it from the contractor and all four groups, faster as it goes on; from 6.2 s each group's effect; from 7.8 s a second request lands on each. Restrained: nothing shakes, flashes or loops. (5) Complete when the last bill is in (about 11.25 s); **held 3 s.** (6) At 14.25 s **the whole scene fades out as one** over 0.8 s, every element and its words together; the bar stays. (7) The frame is clear for 0.3 s. **Scene 2, precise procurement planning.** (8) 15.35–16.05 s: *Early, precise procurement planning protects your investment.* / *Less disruption. Better coordination. Greater cost control.* fades in; it stays. (9) After a 0.4 s pause, 16.45 s: the shield's edge is drawn around the contractor in amber over 1.3 s; the shield fills and stands. (10) From 18.15 s: the same four cards fade in again, 0.2 s apart. (11) From 19.6 s a level line reaches each group in turn, and its calm word appears with a check (*In control*, *Aligned*, *Coordinated*, *Ready*). (12) From 21.05 s a small shield with a dollar sign settles on each of the four groups and last beside the contractor, all in by 22.6 s. (13) **Held 3 s**, and it rests there from 25.6 s: the visual plays once and does not restart, so its outcome is its last frame, not a fade to an empty frame. That is also the reduced-motion state (Section 46.5).
- **The words.** The founder's: the four groups, the two states' names, the effects and calm words (chosen from the brief's lists), the request marks, the closing line (the first of the three offered, because it names the hero and the whole investment; the others were *Control at the center protects the whole project.* and *When your contractor is in control, your project team works better.*), and the phrase beneath it. **Revised by the founder 2026-11-12:** the two states' names, the first state's foot (*Weak procurement planning puts your investment at risk.*, *Poor* until the founder's later brief the same day, / *Preventable delays. Rising costs. Eroding profits.*) and the phrase beneath the closing line (*JiTpro gets the field what it needs, when it needs it.*, replacing *Powered by JiTpro.* from *Reduce risk*'s close) are the founder's words exactly. Nothing here is authored except the choice among the brief's own words, and the shortening of two effects: *repeated revisions* and *stop-start flow* are the brief's; *cost exposure* and *extra review* are the brief's. The closing line was shortened by the founder the same day to *A coordinated contractor protects your investment.* (*entire* removed).
- **What it must not say.** It does not set the owner against the contractor: the first state shows what any contractor's loss of control costs everyone, the contractor included, and the second shows the same contractor leading. The shield is control of the process, not immunity: JiTpro does not block reality. No amount, percentage, saving or return is shown; *cost exposure* is exposure, not a bill. Nothing claims the calm state removes all cost or friction. The owner operates nothing.
- **Finish** (founder, refinement of 2026-11-12: the same composition, better art direction; *more confident and polished, not a different style*). Restraint is the rule: nothing photographic, three-dimensional, glossy or poster-like; no gradient, glow or ornament.
  - **Depth** is a soft, flat offset beneath an object (`--jp-ink-secondary` at 7 to 16%), never a blur.
  - **The cards** each carry a navy cap along the top, one line glyph in a tinted square (a house for the owner, a set square for the design team, a magnifier for the consultants, a package for the vendors; one weight, one colour), the group's name beside it, and its state on the line beneath.
  - **The background** is a drawing sheet, barely there: a grid at 5% and crop marks in the four corners. It is present from the first frame and never moves. Nothing else: a low outline of a framed building and a tower crane was added along the foot and removed the same day at the founder's direction, because it looked like an unfinished placeholder sketch. **Rule (founder, 2026-11-12), for every homepage visual:** decorative architectural or construction imagery MUST NOT be introduced unless it meets the same quality as the primary illustration and contributes to the story. A clean, restrained background is the default; the primary composition provides the interest.
  - **The house** (founder direction, 2026-11-12): the Hero's own house render (Section 48.8) stands behind the picture as construction context. It is the same asset (`public/assets/hero/house-render-800.webp` and `-1600.webp`), drawn the Hero's way: an image sized by its own 1600 × 954 proportions, never cropped, stretched or redrawn; centred and bottom-anchored, its foot on the closing band's top edge; a short top-edge mask softening the roofline; a restrained resting opacity (30%); the Hero's one-pass reveal, which reduced motion disables. It is turned over for a light surface: where the Hero melts the night sky into a dark page with `lighten`, here the render is made grey and inverted, so its sky is white and its lit edges and glass become soft grey line and tone, and `multiply` melts the white into the frame. It is atmosphere only: beneath the grid, the cards, the lines and the shield; aria-hidden; never annotated; never the subject. This is a second bounded use of the render under Section 48.8, limited to this visual. The Hero is unchanged. *(2026-11-13: a third bounded use, behind Better decisions, is recorded with that visual.)*
  - **Colour:** navy is concentrated in the shield, the card caps, the connectors and the band; amber on the shield's edge, its rule and mark, the nodes on its edge, and the band's edge and second line.
- **Composition** (desktop 560 × 350 / narrow 340 × 212). Shield 146 × 172 / 88 × 104, centred between the four cards; cards 124 × 66 / 100 × 46, mirrored about the middle, their words set from the outer edge so the inner corners are free for what arrives. Type: group names 10 / 8; effect and calm words 9.5 and 10.5 / 7.5 and 8.5; request slips 9.5 / 7.5; the state 9 / 7.5; the closing line 17 / 10 over 11 / 7.5, on the band. The narrow design keeps the same picture with every object redrawn at its own size.
- **Motion** uses arrival from an offset, drawn lines, and, for the bills, travel along a curve (a cubic path, added to the clock for this visual and unit-tested). Nothing rolls, bounces, spins, shakes or scales: Section 46.4 is observed without exception in this visual.

**Rules of the story.**
- **A possible consequence is never shown as inevitable.** In *Reduce risk* the three notices are the owner's fear of a gamble, carry no amount or date, and each is lifted away as the plan answers it. In *Protect your investment* the first state is a contractor out of control, shown as a condition and not as a finding about any contractor; it carries no amount and is withdrawn before the shield is drawn.
- **Not every cost is the contractor's doing, and not every one is the owner's.** Consequences are named, never priced. In *Protect your investment* the contractor is the hero: the picture shows what control at the centre is worth to everyone around it.
- **The owner's decisions are never all due at once,** and none is shown as late or overdue.
- ***ASAP*** appears only in *Protect your investment*, on slips in the late colour, where it is the disorder itself. (*Better decisions* used it as a neutral tag until it was redrawn, 2026-11-12.)
- **Each visual stands alone.** None depends on having watched another.

- ***More predictability*: an approach and landing (redrawn 2026-11-13; founder brief *More Predictability Section Redesign*).** Status: APPROVED in direction; implemented, awaiting the founder's review in the browser. Implementation: `LANDING_*`, `landingGeometry` and `predictabilityScene` in `ownerScenes.ts`; `PredictabilityVisual` in `OwnerVisual.tsx`.
  - **The idea.** The owner cares about schedule and cost predictability, and the two are connected: added time can bring added cost. **One aircraft, one approach, one runway, one planned landing zone**: one project with one intended outcome, never two projects or two contractors compared. Procurement planning is what keeps the approach stable. It shows **loss of predictability, never disaster**: no crash, no wild excursion off the runway. It promises nothing: no guaranteed date or budget, no claim that risk is eliminated. The contractor is neither hero nor villain; the process is the subject.
  - **The scene,** in side elevation, as an architectural sheet (the owner visuals' faint grid on `--jp-surface-light`), composed across the whole width (refined 2026-11-13, founder briefs *Runway and Landing Refinement* and *Flight Path and Screen Composition*): a long, shallow approach from the left, and the runway to the right. **The runway** is a slender navy slab with a dashed centre marking and threshold bars, standing for the project's finish, and it has **three distinct elements**: (A) a restrained **touchdown point** early in the planned zone, two short paper-white bars across the runway, where the main gear first meets it (not the finish); (B) the **planned completion zone**, an amber zone long enough for touchdown, a normal rollout and a controlled stop, with *PLANNED COMPLETION ZONE* beneath it (navy); (C) beyond a clean navy **boundary post** standing above the runway at the end of the planned zone, the **overrun**, a restrained late-colour tint with *ADDED TIME* over *ADDED COST* beneath it (late colour, two lines to fit its zone), which begins only after the boundary and is never entered. The **planned approach**: a dashed navy curve the aircraft flies, from its start down to the touchdown point.
  - **The aircraft** (refined 2026-11-13, founder brief *More Predictability Animation Refinement*: the first was a toy-like airliner): a sleek single-engine **executive turboprop** in side profile, in the spirit of the TBM class but no actual aircraft, brand or marking: a slender fuselage tapering to a long tail cone; a long nose with its cowling, a spinner and the faint disc of its propeller; a raked windshield and a short row of cabin windows; a low wing; a tall swept fin and a slim tailplane; slender gear down for landing. Flat navy (`--jpd-nav-bg-start`) with one thin amber cheat line, paper-white windows and a faint highlight along the cabin: precision, speed, control, confidence; never cartoonish, chunky or a jet. It comes to rest wholly inside the planned finish.
  - **The house behind it:** the same stationary house as *Better decisions* (`HouseBackdrop`, still, 16%), so the three illustrated owner visuals read as one family; a fourth bounded use of the render under Section 48.8, limited to these visuals.
  - **A stable, shallow approach** (refined 2026-11-13): a long final approach at a gentle angle (about 22°, flattening slightly into the flare), using the frame's width; never steep, never a dive. The aircraft never floats off its path: it flies one continuous approach at an even pace, lifting its nose three degrees into the flare. **The main gear touches down first**, at the touchdown point, in the first third of the planned completion zone; **the nose settles** over 0.7 s; then it **rolls out**, aligned with the runway and its wheels on it, decelerating smoothly from its approach pace to a **complete stop** with clear runway left before the boundary. A small amber stop marker appears at its nose: a controlled finish within the planned completion window. What changes during the approach is not the aircraft but **the forecast of where the project will finish**.
  - **The projected finish:** a band lying on the runway, *PROJECTED FINISH* above it in small capitals, with a short tick at its centre. It opens wide and in the late colour, in the overrun zone: reduced predictability, not failure. **Procurement planning, three waypoints** on the planned approach, each appearing just ahead of the aircraft: a small amber waypoint and, beneath and to its left, *REQUIREMENTS IDENTIFIED*, *COMMITMENTS SCHEDULED*, *DELIVERIES COORDINATED* (*IDENTIFIED*, *SCHEDULED*, *COORDINATED* on a narrow frame). **As each appears, the projected finish narrows and glides toward the planned finish in one continuous eased move**; with the third it lies inside the planned completion zone, at the stopping point, and turns amber. As the aircraft passes each waypoint it fills with a check. As it passes the last, the words *PROJECTED FINISH* give way (before the aircraft comes down over them); the amber band stays where the aircraft will stop, and the aircraft touches down and rolls out to rest on it: the projected finish has become the actual one. The band then fades, the stop marker appears, the planned completion zone brightens and its label is checked. The overrun stays visible, unused.
  - **The foot** (the owner visuals' band): *Better procurement planning helps your project stay on course.* over *More predictable schedules. Better cost control. Greater confidence in the finish.* It is shown with the bar from the first frame, played or not, and never changes, so it is never blank.
  - **The sequence,** one clock, about 18.7 s, played once, then rest (reduced motion shows the rest at once). (1) From the first frame: the sheet, the bar and its words. (2) 0.2–1.7 s the runway, the touchdown point, the planned completion zone and its label, the boundary, the overrun and its label. (3) 1.8 s the planned approach; 2.1 s the projected finish, wide and red in the overrun. (4) From 2.4 s the aircraft flies in and on down the approach at an even pace for 9 s. (5) Each waypoint appears 2.2 s before the aircraft reaches it, and the projected finish moves with it over 1.1 s, ending amber at the stopping point. Each waypoint is checked as the aircraft passes. (6) At 11.4 s the main gear touches down; the nose settles; the rollout slows to a stop over about 4.7 s. (7) At the stop: the stop marker, and the planned completion zone checked. Held, and it rests.
  - **Colour.** Tokens only: navy (`--jpd-nav-bg-start`) for the aircraft, the runway, the planned approach and the zone label; `--jpd-accent` for the planned finish, the checkpoints and the marker on course; `--jpd-chain-commitment-late` for the added-cost zone, the projected path and the marker off course; linework `--jp-ink-secondary`; paper `--jp-surface-white`.
  - **Composition** (desktop 560 × 350 / narrow 340 × 212, the narrow one the desktop layout at 0.6 with its own type): labels 7.5 / 6.5; zone labels 8.5 / 6.5; everything above the foot's bar; no label overlaps the approach, the aircraft's path or another label.

- ***Better decisions*: the decision timing window (redrawn 2026-11-13; founder brief *Better Decisions Section Redesign*, which replaces the tapering cone of 2026-11-12).** Status: APPROVED in direction (founder brief, 2026-11-13); implemented, awaiting the founder's review in the browser. Implementation: `WINDOW_*`, `windowGeometry` and `decisionsScene` in `ownerScenes.ts`; `DecisionsVisual` in `OwnerVisual.tsx`.
  - **The governing principle.** JiTpro is not about making every decision as early as possible. It is about identifying requirements early, understanding their dependencies, and establishing when information, decisions, approvals and commitments must be complete to support procurement and the field. Early planning is not premature execution. Poor timing harms a decision two ways: **too early**, the project does not yet know enough to evaluate the alternatives, and premature commitment can eliminate better ones or cause rework; **too late**, the time left no longer supports some alternatives' procurement (lead times, coordination, approvals, cost). **Correctly timed**, the responsible party has the information to act and enough time remains for the downstream procurement. The contractor identifies what is needed, who is responsible and when; the owner keeps authority over their decisions. Nobody is drawn, and nobody is blamed.
  - **Why the cone was replaced.** It showed only the cost of lateness, and so read as *decide as early as possible*. The window shows both edges.
  - **The corridor:** a conceptual window of opportunity, not a funnel and not a model. Symmetric about a level centre line; narrow at the left (half-height 40 units), widening smoothly to its broadest a little before the middle (92 units, at 48% of its length), and narrowing again to a slender right end (12 units). Each side of the peak is a smooth eased curve, level where it meets the peak, so the shape reads as an elongated lens: no kink, no exaggerated curve, nothing in three dimensions. Its height at a moment is how much room there is for a sound decision. **Two readings, one shape:** left of the peak, height is *information readiness*; right of it, *time remaining*. Drawn as an architectural sheet: a soft offset shadow, white paper, a fine second line inside each wall, a dash-dot centre line, a finer grid within. Inside, a quiet horizontal tone: neutral at the left, clear in the middle, a breath of the late colour at the right. Over the left, a pale neutral **haze** (information still developing) that clears as the marker passes into the window.
  - **The decision window:** where the corridor holds all six options, a restrained `--jpd-accent` band (10% at its centre, fading to nothing at its edges) with an amber hairline at each boundary, clipped to the corridor. It comes in as the marker enters it, and stays to the end.
  - **The stage names,** small capitals beneath the corridor: *TOO EARLY* (`--jpd-text-secondary`), *RIGHT TIME* (`--jpd-nav-bg-start`, bold), *TOO LATE* (`--jpd-chain-commitment-late`). **Time,** beneath them: one unbroken axis with fine ticks and an arrowhead; *TIME PASSES* beneath its end, right-aligned, clear of the marker's pointer at every stop.
  - **The marker:** a solid `--jpd-accent` line with a faint halo, topped by a compact amber tag lettered *NOW* in navy, its pointer riding the time axis. It and the six options are **one group**, moved by the same two cues, so they never drift apart.
  - **The six choices** (founder brief *Option Discovery and Viability*, 2026-11-13, replacing *OPTION A* to *OPTION F*): *CHOICE 1* to *CHOICE 6*, numbered in the order they become known, in a stack on the marker. Illustrative alternatives, never products; the number is not a claim. **Three states, never confused:**
    - **Not yet discovered:** not drawn at all. No placeholder, ghost, dashed card or faint label: a choice nobody has identified is not on the picture. (Supersedes the same day's *emerging* ghost card.)
    - **Available:** a clean white card with a crisp, solid outline and a soft offset; *CHOICE* and its number in navy.
    - **No longer viable:** previously viable, no longer feasible in the time left. The card stays in its place, desaturated under a pale wash, its outline solid and faint, with the established red X in `--jpd-chain-commitment-late`. Nothing falls away.
  - **The stack** keeps one order, *CHOICE 1* at the top, and stays centred on the marker: each discovery adds a card beneath, and the stack moves up half a step as it arrives. It sits 3 units below the centre line so that no two choices are lost at once. **Discovery is the story's, loss is the corridor's:** the three discoveries are set at three stops on the way into the window (140, 185 and 230 units along), where the growing stack still fits the corridor; a choice is lost where, with all six known, its card no longer fits the narrowing corridor (Choices 6, 1, 5 and 2, in that order). The corridor remains a picture of changing flexibility, not a mechanism that removes choices.
  - **The group's status,** in small capitals on a thin strip of paper above the stack, travelling with it (so the marker's line passes behind it): *KNOWN OPTIONS* (navy) at the first stop; *SIX VIABLE OPTIONS* (navy) at the right time; *ONLY TWO VIABLE OPTIONS REMAIN* (late colour) at the last.
  - **Callouts,** brief, beside the card concerned, travelling with it: *NEW OPTION DISCOVERED* (navy on an amber pill) as a choice arrives, with an amber outline around its card; as one is lost, with a red outline around its card, **the reason it is no longer viable** (founder brief *Explain Why Options Become Nonviable*, 2026-11-13, replacing a repeated *NO LONGER VIABLE*), in the late colour on a paper pill with a late-colour edge, set to the card's **left**, in the clear space toward the decision window (the right is where the corridor narrows, and the longer reasons do not fit there on a narrow frame). In order of loss: *LEAD TIME TOO LONG*, *PRODUCTION SLOT LOST*, *PRICE NO LONGER VIABLE*, *APPROVAL TIME EXHAUSTED*: lead time, manufacturing capacity, cost and approvals. They are illustrative: each choice is nonviable under the project's current requirements (it might still be possible at more cost, revised scope or a later date), and no project need meet these four. A discovery is read for about half a second, a reason for 0.75 s; then the callout and its outline go.
  - **Stage 1, too early.** The marker stands where the corridor is still narrow (96 units along): only *CHOICE 1*, *2* and *3*, all available, under *KNOWN OPTIONS*. Heading *INFORMATION STILL DEVELOPING* (`--jpd-text-secondary`). Foot: *Premature decisions can limit your choices.* / *Incomplete information. Unnecessary commitments.*
  - **Discovery, one at a time.** The group moves on and stops three times; at each, the stack moves up half a step as the next choice fades in beneath it with its amber outline and *NEW OPTION DISCOVERED*; read; the callout and outline go, and the card stays as a normal choice. *CHOICE 4*, then *5*, then *6*. The haze clears as the group goes; the amber window comes in on the last leg.
  - **Stage 2, the right time** (the principal outcome, held longest, 4.6 s). All six visible and viable, none crossed out, in the amber window, under *SIX VIABLE OPTIONS*. Heading *THE RIGHT TIME TO DECIDE* (navy). Foot: *The right timing preserves your choices.* / *Enough information. Enough time. Better decisions.* No selection is shown.
  - **Loss, one at a time.** The group moves on toward the narrow end and stops at each point where a choice no longer fits: a red outline and the reason; read; the red X; the callout and outline go; the card stays, crossed out. *CHOICE 6*, *1*, *5*, then *2*. The restrained risk treatment comes on near the end (the walls thicken outward and redden, a faint late-colour wash inside); nothing flashes, shakes or pulses.
  - **Stage 3, too late.** *CHOICE 3* and *4* remain viable; the other four stay crossed out in place; *ONLY TWO VIABLE OPTIONS REMAIN*. Heading *OPTIONS BECOME LIMITED* (late colour). Foot: *Delayed decisions can eliminate your options.* / *Less time. Fewer choices. Greater pressure.* The loss of flexibility, never blame.
  - **The close, once** (Section 46.6): after the late hold, the moving group, the heading and the risk treatment fade out together; the corridor, its amber window and the stage names stay. The six options return, all available, in a column inside the decision window, one after another; and last, on the foot, *Correctly timed information and decisions protect your options.* over the amber line *JiTpro helps your contractor plan early and communicate exactly when decisions are needed.* (founder, 2026-11-13; set at the band's supporting size, a half-point smaller on a narrow frame, 7, so it stays on one line). Then it rests. This replaces the cone's close (a row of six and a line about JiTpro): the window itself now carries that meaning, and the section copy says the rest.
  - **The foot is scenery:** the navy bar and its amber edge come in once and stay throughout; only the words cross-fade (out over 0.4–0.5 s, the next in over 0.6 s, rising 3 units).
  - **The sequence,** one clock (Section 46.3), one pass of about 34.6 s, then rest. (1) To 2.0 s: the sheet, the corridor and its walls drawn from the left, the haze, the stage names, the axis and *TIME PASSES*, and the foot's bar. (2) From 2.0 s the marker; from 2.3 s *CHOICE 1* to *3*, 0.11 s apart; *KNOWN OPTIONS* at about 3.0 s; the heading at 3.0 s; the foot's words at 3.3 s; held to 5.9 s. (3) The group moves in legs, each 0.5 to 1.3 s by its length, and stops: *CHOICE 4* is discovered at about 6.5 s, *5* at about 8.4 s, *6* at about 10.3 s (each stop about 1.35 s: the card, its outline and callout, half a second's read, then the callout goes); then on into the window, the amber window coming in. (4) The right time at about 12.2 s: the heading, the foot's words and *SIX VIABLE OPTIONS*; held 4.6 s. (5) On toward the narrow end, stopping for each loss (each about 1.95 s: the outline and the reason, 0.75 s to read it, the X, then the reason goes): *CHOICE 6* (*Lead time too long*) at about 17.5 s, *1* (*Production slot lost*) at about 19.9 s, *5* (*Price no longer viable*) at about 22.4 s, *2* (*Approval time exhausted*) at about 24.8 s; the risk treatment from about 17.6 s. (6) Too late at about 27.3 s: the heading, the foot's words and *ONLY TWO VIABLE OPTIONS REMAIN*; held 3.8 s. (7) At about 31.1 s the group, its labels, the heading and the risk fade together over 0.9 s; from about 32.2 s the six choices in the window; the closing line at about 33.0 s; rest from about 34.6 s.
  - **Colour.** Tokens only (Section 8.8): linework, grid, haze and axis `--jp-ink-secondary`; paper `--jp-surface-white`; provisional fill and the unavailable wash `--jp-surface-light`; the marker, its tag, its pointer and the decision window `--jpd-accent`; the risk treatment's walls thicken by at most 3.5 units, at 75% of the late colour at the tip; the tag's lettering, the options' letters and the right-time heading `--jpd-nav-bg-start`; the red X, the risk treatment, *TOO LATE* and the late heading `--jpd-chain-commitment-late`, the gradients' stops taking the tokens with an opacity (each gradient's and clip's id carries the design's name, as both designs are on the page).
  - **Composition** (desktop 560 × 350 / narrow 340 × 212, the narrow one the desktop layout at 0.6 with its own type): heading 10 / 8, centred at the top; the *NOW* tag between the heading and the corridor; the corridor 40–520 units long about a centre line at 146; options 60 × 16 / 42 × 10, named at 8.5 / 6.5 (the least that stays legible, as before); stage names 7.5 / 7; *TIME PASSES* 8.5 / 7. Everything above the foot's bar; nothing overlaps at any frame.
  - **Reduced motion:** the resting close, at once: the corridor with its decision window and stage names, the six available options in the window, and the closing line (Section 46.5).
  - **The house behind it** (founder brief *Add Architectural Background to Better Decisions Animation*, 2026-11-13): the same render and treatment as *Protect your investment* (`HouseBackdrop`; `house-render-800/1600.webp`, sized by its own 1600 × 954 proportions, never cropped, stretched or redrawn; centred and bottom-anchored on the foot's top edge; the top-edge mask; grey, inverted and `multiply`-merged into the frame), for one visual family. Two differences, both from the brief: it is **stationary**, present from the first frame to the close with no reveal and no change at any stage, so nothing about it animates; and it is **quieter**, at a 16% resting opacity (against 30% in *Protect your investment*), because here the corridor, the options and the marker must stay dominant. It sits beneath everything: the sheet's grid, the corridor (whose paper covers it), the cards, the marker and the words; aria-hidden, never annotated, never the subject. A third bounded use of the render under Section 48.8, limited to this visual; the Hero and *Protect your investment* are unchanged.

**Drawing.** Each visual is drawn for the frame as vector, in two designs: 560 × 350 for a frame from 460 px, and 340 × 212 for a narrower one, each scaled to the frame as one. The narrow design uses shorter labels and a one-line row where needed. No application screen is drawn or scaled down.
- **Tokens,** all existing: stages `--jpd-state-scheduled-fill` with a `--jpd-state-scheduled-edge` outline; Required On Site `--jpd-chain-ros`; the one thing each scene is about `--jpd-accent`, with `--jpd-row-tint` for a window of time; resolved `--jpd-ok-fg`; a late discovery `--jpd-chain-commitment-late`, used for one mark, one card kicker and one dashed outline, and for nothing else; the consequence chips `--jpd-warn-bg` and `--jpd-warn-border`; kicker text for an open condition `--jpd-warn-fg`; inks `--jpd-text-strong`, `--jpd-text-secondary`, `--jpd-nav-bg-start`. *Reduce risk* draws its documents in Identify's two tokens, `--jp-surface-white` and `--jp-ink-secondary` (Section 54.4.1), and sets its closing lockup in `--jpd-nav-text` on `--jpd-nav-bg-start`; *Protect your investment* does the same.
- **Type** (desktop / narrow): titles 13.5 / 10.5; stage labels 10 / 8; card titles 13 / 10.5; card rows 10 / 8.5; the closing line 14.5 / 11, beneath a 24 × 3 px amber rule. No text below 7.5 px at scale 1.
- **Amber is the scene's one focal point** (Section 48.7): the open requirement, the verified requirement, the owner's windows and decisions, the one needed first.

**Motion.** `ownerStateAt(scene, t)` gives every keyed element its opacity, rise, drawn length and travel; the component applies them and decides nothing. Fades with a small rise, lines drawn along their length, and one move (the requests into date order); nothing bounces, pulses or loops (Section 46.4). Each runs once per entry to its tab and rests; leaving parks it on its empty opening frame; an inactive tab's visual does not run. A resize re-frames the same moment in the other design. **Reduced motion:** the resting state at once (Section 46.5). No replay control (open item 7).

**Accessibility.** The visual column stays `aria-hidden`; nothing in it is focusable. The copy carries the meaning (Section 46.2). The tabs, their keyboard behaviour and the pinned scroll are the section's own and are unchanged (Section 46.12).

**Not included.** A call to action for owners. The section has none for any audience, and adding one is a homepage decision of its own (open item 13).


## 54.5 Open items for founder review

1. ~~The provisional heading line.~~ **Resolved 2026-11-09:** the founder supplied *What JiTpro means for:* as an eyebrow (Section 54.2).
2. **The engagement-model channel.** The owner *Better decisions* tab (*Receive advance notice of selections and approvals*) and the architect tabs (*See upcoming design questions…*) do not say who provides the notice or visibility. A reader could infer that JiTpro contacts them directly, which Section 20.1 prohibits. Decide whether the wording needs to name the general contractor's team as the channel.
3. **Long-lead.** The owner *Reduce risk* description names *long-lead requirements* as one of three things early planning exposes. Recorded for review against the Section 20.1 long-lead review test.
4. ~~**The commercial model.**~~ **Resolved 2026-11-11:** the owner *Protect your investment* headline that could be read as the owner paying JiTpro was replaced (Section 54.2.4).
5. **Procurement Register and Product Register (2026-11-09).** The *Identify* copy names a *Procurement Register*; the homepage figure and Section 52 name the *Product Register*. Confirm whether they are the same artifact and which name the site uses.
6. ~~**Identify and Plan overlap (2026-11-09).**~~ **Resolved 2026-11-10:** the founder supplied a new *Plan* description that starts from the field requirement and pulls backward (Section 54.2), so it no longer restates *Identify*.
7. **A replay control for the tab visuals (2026-11-11).** The *Control* brief asked for one. Sections 46.12 and 54.4.1 to 54.4.3 give the visuals no controls, and Section 46.6 says a long animation SHOULD offer one. Decide whether all four general contractor visuals gain a replay control, placed outside the hidden visual column, or none does (Section 54.4.4).
8. **The Control panel's fit (2026-11-11).** The new *Control* copy has not been measured in a browser against the pinned presentation (Section 54.2.3).
9. ~~**Control shows activities only (2026-11-11).**~~ **Resolved 2026-11-11:** the founder ruled that Control includes Connect's dependencies that fall due; *Final Field Dimensions* is the General Contractor's priority (Section 54.4.4).
10. **The four activity-state tokens (2026-11-11).** `--jpd-state-complete`, `--jpd-state-active`, `--jpd-state-scheduled-fill` and `--jpd-state-scheduled-edge` were approved in principle from a static mockup; confirm their values in the browser (Section 54.4.4).
11. **The framing chain's activity is named only *Review* (2026-11-11).** The shared schedule fixture names it so, and the Control list repeats it. Decide whether the fixture should name it more precisely.
12. **One headline on two tabs (2026-11-11).** *Know what's coming before it becomes urgent.* heads both the owner *More predictability* tab and the architect *See what's coming* tab. Decide whether one should change.
13. **A call to action for owners (2026-11-11).** The brief asks that any owner call to action be about bringing JiTpro into the conversation with their contractor. The section has no call to action for any audience; adding one is a separate decision.
14. **The owner visuals were built without a mockup round (2026-11-11),** at the founder's direction. Their composition, and the shortened display names need the founder's eye in the browser (Section 54.4.5).
15. **The redrawn *Reduce risk* tab (2026-11-12).** (a) **Section 46.4.** The dice turn and hop as they roll in, at the founder's direction; Section 46.4 prohibits spinning and bouncing. The exception is recorded and bounded in Section 54.4.5 (reduced on refinement) and needs the founder's explicit confirmation, or the roll must become a plain slide. (b) The illustration has not been seen in a browser: the look of the drawings, contract, dice and notices, how much of each promise a notice covers, how the plan sits over the notices' right ends, and the narrow design all need the founder's eye. (c) Each notice leaves as one line of the plan is checked. Confirm that this reads as *the contractor has a process for this* and not as a promise that such things will not happen. (d) The headings *Construction contract*, *Your contractor's* and *Procurement plan* are authored. (e) The word *JiTpro* on the plan is set in type, not the wordmark artwork (`JiTproWordmark.tsx`), which was not placed inside the drawing unseen; say if the artwork should be used or the word removed. (f) Whether the copy fits the pinned section at 1280 × 800 has not been measured. (g) The closing frame is a navy stage with the plan and the lockup alone on it. Its balance, the faintness of the grid, the size of the card and the change from a white frame to a navy one all need judging in the browser; so does the frame's proportion (the stage is drawn past the canvas so a frame that is not 16:10 is still wholly navy). (h) *Responsibilities clearly assigned* is set without *clearly*. (i) It runs 12.6 s, a little past the 9 to 12 s suggested, for the six lines and the closing push. (j) The card's kicker (*Your contractor's*), title (*Procurement plan*) and mark (*JiTpro*) now say what the supporting line beneath also says; say if the card's header should be simplified. (k) The six notices, the pause and the hand (2026-11-12) have not been seen in a browser: whether six headings read at a glance or crowd the frame, whether the hand is recognizable and its sweep satisfying rather than abrupt, and how it all reads on a narrow frame. *The hand and its motion were replaced the same day (the redrawn illustration, pushing and drawn back); that too has been judged only in still renderings at the frame's size, not in motion in a browser.* (l) The brief for that change quoted the closing line as *Confidence demands a plan.*; the approved and implemented line is *Confidence requires a plan.*, which was kept, since the brief said to preserve the existing close. Say if *demands* is wanted. (c), above, is superseded: notices no longer leave as lines are checked. (m) The reworked opening (2026-11-12) has not been seen in a browser: the balance of the three documents, the new specification page, the dice at the centre of the contract, the two columns of notices, the redrawn hand (graceful, or still stiff?), the diagonal sweep, and the documents stepping back to 16% beneath the plan (enough of a reset, or should they clear entirely?). (n) The question now stays on screen through the surprises and the pause, on one line along the foot, and goes as the hand comes in.
16. **The redrawn *Protect your investment* tab (2026-11-12, recomposed twice).** (a) Nothing has been seen in a browser: the contractor's two states (the tipped card against the shield), the shield's shape (strong and modern, or too like a badge?), the amount of disorder in the first state (eight slips and four jagged lines: restrained enough?), the four cards' balance, the closing band, and the narrow design all need the founder's eye. (b) *JiTpro* on the shield is set in type, not the wordmark artwork. (c) The choice of one effect and one calm word per group, from the brief's lists. (d) On a narrow frame the closing line is 10 px to fit one line; say if it should be set on two lines instead. (e) The copy beside it has two paragraphs and a long headline; its fit in the pinned section at 1280 × 800 has not been measured. (f) The copy names *architects, engineers, designers, and consultants*; the visual groups them as *Design team* and *Consultants*, and adds *Vendors*, as the brief directs. (h) The finish was refined against a second visual reference the founder described but which was not available to the implementer; the shield's depth, the card glyphs, the background grid, and the connector nodes were chosen from the brief's wording alone and need his eye. (g) The visual follows the section's convention (one pass when the tab is first shown, then rest). (i) The Hero's house render behind the picture has not been seen in a browser: whether the inverted, grey treatment reads as a quiet drawing of the house or as a photographic negative; whether 30% is too strong or too faint behind the cards; and how it sits before the closing band rises, when the strip beneath it is empty. (j) The dumpster and bills have not been seen in a browser. The paths are verified by calculation (every bill enters through the open top, clear of the walls and of the contractor's card, in both designs), but whether the dumpster reads as a roll-off container at its size, whether the curves look natural, and whether up to eight bills in the air beside the request slips is a steady drain or clutter, all need the founder's eye. (k) Fifteen bills, up to eleven in the air, is the densest the first state has been; and the protected-value shields are small (18 × 21 on a desktop frame, 13 × 15 on a narrow one). Whether the first reads as a steady drain, whether the dollar sign is legible in the second, and whether the contractor's shield, standing just outside the great shield rather than on it, reads as the contractor's, all need judging in the browser.
