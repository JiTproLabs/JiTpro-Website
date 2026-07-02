# JiTpro Design System v1.0

Status: Framework / decision-capture structure
Owner: TODO
Last updated: TODO
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
- TODO: Define default card.
- TODO: Define elevated card.
- TODO: Define accent/callout card.
- TODO: Define risk/status card.
- TODO: Define metric card.
- TODO: Define interactive card behavior.
- TODO: Define print/report card rules.

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
- TODO: What is the official JiTpro color palette and semantic color model?
- TODO: Should shadcn/ui be adopted for app primitives?
- TODO: What is the source of truth for tokens: markdown, JSON, TypeScript, CSS variables, or a design-token tool?
- TODO: How should printed reports relate visually to the web/app design?
- TODO: What is the governance process for approving new components?

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

TODO:
- TODO: Replace this section with formal governance once approved.
