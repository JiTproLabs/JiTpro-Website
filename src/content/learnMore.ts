/**
 * Content for the long-form explainer page at `/learn-more`
 * (Design System Section 50, approved 2026-09-03; argument revised
 * 2026-09-04).
 *
 * The copy lives here rather than inside the section components because the
 * page is ONE ARGUMENT IN NUMBERED PARTS (Section 50.1) and the argument has
 * to be readable as a whole. A reviewer checking whether section 02 sets up
 * section 03 should be able to read them side by side without opening two
 * components.
 *
 * WHAT THE ARGUMENT IS (revised 2026-09-04). The reader arrives from the
 * homepage having already accepted the belief. This page does not restart the
 * sales argument. It answers, in order, the questions a contractor actually
 * has next: what is JiTpro, why would I need it, what do you do on my project,
 * what does the JIT mean, what do I get, what changes, and how do I start.
 * The page previously made two passes at the same pain before it reached the
 * method. It now reaches the method once and early.
 *
 * BINDING CONSTRAINTS ON EVERY STRING IN THIS FILE:
 *
 *   - Section 20.1 applies in full (Section 50.2). "Procurement" stays
 *     retired, JiTpro is never described as software or as a layer, and the
 *     operating requirement is never stated as a guaranteed outcome. No
 *     delivery guarantee, no conformance warranty, no quantified improvement.
 *     THIS SURVIVES THE 2026-09-04 REVISION: section 04 explains where the
 *     just-in-time philosophy came from WITHOUT the retired word, and JiTpro
 *     is never named as a procurement service or a just-in-time procurement
 *     service anywhere on this page. JIT is the operating philosophy behind
 *     the method, never the product category.
 *   - Section 50.2, external parties: owners, architects, engineers, vendors
 *     and subcontractors are participants the project depends on, never
 *     adversaries. The failure named is always an unmanaged dependency.
 *   - Section 50.2, qualification: the "probably not for" list disqualifies by
 *     POSTURE or by PROJECT CONDITION, never by character.
 *   - Section 50.7: NO EM DASHES, including as `&mdash;`.
 *   - Section 20.1, long-lead terminology: no lead time is stated anywhere,
 *     and nothing here may imply JiTpro is a long-lead-item service.
 *   - Section 20.1, audience: no revenue band, employee count, or project
 *     value. The reader recognizes themselves through symptoms.
 *   - No price, term, duration, deliverable count, pilot structure, discount,
 *     or guarantee appears anywhere in this file. None is approved, and an
 *     absent decision is not permission to infer one (Appendix C).
 *   - "Control" is used sparingly and only where it is the precise word. The
 *     page's working vocabulary is dependencies, visibility, accountability,
 *     required-by dates, field need dates, commitments, and options.
 *
 * The guide (Section 50.4) is generated from GUIDE_SECTIONS, and each section
 * component takes its `id` and `ordinal` from the same list, so the table of
 * contents cannot drift from the page it addresses.
 */

export type GuideSection = {
  /** Stable anchor id. Matches the ordinal slug (Section 50.3). */
  id: string;
  /** Two-digit sequence marker, rendered per Section 48.9. */
  ordinal: string;
  /** Title as it appears in the guide and as the section's own h2 subject. */
  title: string;
};

/**
 * 03 IS THE METHOD AND 04 IS THE PHILOSOPHY BEHIND IT (revised 2026-09-04,
 * swapping the two). The reader asks what JiTpro does before asking where the
 * name came from, and the backward chain in 04 is far easier to read once the
 * five steps in 03 have named the work. Both sections sit on the light act
 * surface, so the swap changes the order of two sections and nothing about the
 * page's three acts (Section 50.7).
 */
export const GUIDE_SECTIONS: GuideSection[] = [
  { id: '00-what-jitpro-is', ordinal: '00', title: 'What JiTpro is' },
  { id: '01-why-projects-go-reactive', ordinal: '01', title: 'Why projects become reactive' },
  { id: '02-what-you-can-control', ordinal: '02', title: 'What you can actually control' },
  { id: '03-what-jitpro-does', ordinal: '03', title: 'What JiTpro actually does' },
  { id: '04-the-jit-in-jitpro', ordinal: '04', title: 'The JIT in JiTpro' },
  { id: '05-what-jitpro-produces', ordinal: '05', title: 'What JiTpro produces' },
  { id: '06-what-changes', ordinal: '06', title: 'What changes' },
  { id: '07-one-project', ordinal: '07', title: 'Start with one project' },
  { id: '08-first-project', ordinal: '08', title: 'What the first project looks like' },
  { id: '09-where-it-fits', ordinal: '09', title: 'Where JiTpro fits' },
  { id: '10-built-by-contractors', ordinal: '10', title: 'Built by contractors' },
  { id: '11-start', ordinal: '11', title: 'Start your first project' },
];

/** Convenience lookup so a section cannot invent an id the guide does not know. */
export const SECTION = Object.fromEntries(
  GUIDE_SECTIONS.map((s) => [s.ordinal, s]),
) as Record<string, GuideSection>;

/** The anchor the opening's secondary action sends the reader to. */
export const GUIDE_ANCHOR_ID = 'in-this-guide';

/* ------------------------------------------------------------------ 00 */

export type GlanceItem = { label: string; body: string };

/**
 * Six items, scannable in well under a minute. Deliberately not cards with
 * icons (Sections 48.2, 48.4): hairline separation and whitespace.
 *
 * THIS IS THE FIFTEEN-SECOND ANSWER (revised 2026-09-04). A reader who reads
 * only this band has to come away knowing JiTpro is an active engagement on a
 * real project, and not software, a report, a dashboard, general consulting,
 * or a service defined by buying things. The "What it is not" item is load
 * bearing and is the shortest route there, because the reader arrives with
 * those guesses already in mind.
 */
export const GLANCE_ITEMS: GlanceItem[] = [
  {
    label: 'What it is',
    body: 'An active engagement on one of your projects. We work with your team on what the project will depend on, before the field depends on it.',
  },
  {
    label: 'What it is not',
    body: 'Not software for your team to run. Not a report that gets read once. Not another dashboard, and not general consulting.',
  },
  {
    label: 'Where we start',
    body: 'One project. Not the whole company.',
  },
  {
    label: 'What we look at',
    body: 'Scope, design and engineering information, decisions, selections, approvals, commitments, products, materials, services, and the coordination between them.',
  },
  {
    label: 'What we establish',
    body: 'What is required, who carries the next move, when it is required, and what work it releases.',
  },
  {
    label: 'What you end up with',
    body: 'The things your project is depending on, turned into things your team can see and manage.',
  },
];

/* ------------------------------------------------------------------ 01 */

/**
 * The lived reality, in the reader's own vocabulary. Each is a condition, not
 * an accusation: nothing here says anyone failed, only that something the
 * field will depend on is not yet resolved.
 *
 * SHORTENED 2026-09-04, from ten to six. The homepage has already done
 * recognition. This section exists to name the structural reason a project
 * goes reactive and then hand off to 02, and six conditions establish that as
 * well as ten did while costing the reader far less.
 */
export const DEPENDENCY_CONDITIONS: string[] = [
  'Design information that is not yet complete where the work has to be built.',
  'Selections and owner decisions still open while the work behind them gets closer.',
  'Scope that sits between two subcontracts and reads as neither one.',
  'Commitments made in meetings, on calls, in email, and in text messages.',
  'Products and materials waiting on approvals that nobody has put a date against.',
  'Dependencies nobody is tracking, because nobody has needed them yet.',
];

/* ------------------------------------------------------------------ 02 */

export type ControlPair = {
  /** The dependency category, stated once and read across both columns. */
  subject: string;
  /** The part that genuinely belongs to someone else. */
  outside: string;
  /** The part that has always belonged to the contractor. */
  inside: string;
};

/**
 * The paired-condition comparison (Section 50.6). The columns are
 * typographically equal and the contrast is carried by the words. The right
 * column is never a promise about the left one: it describes management of the
 * dependency, never control of the person.
 *
 * SHORTENED 2026-09-04, from seven pairs to four. The distinction is the
 * page's central turn and the reader has it by the second pair. The four that
 * remain cover the four kinds of party a project actually waits on: the owner,
 * the design team, the trades and suppliers, and the manufactured work itself.
 */
export const CONTROL_PAIRS: ControlPair[] = [
  {
    subject: 'Owner decisions and selections',
    outside: 'When the owner decides, what they choose, and whether they revisit it later.',
    inside:
      'When the decision is identified, who carries it, the date it has to be made by, and what work is waiting behind it.',
  },
  {
    subject: 'Design and engineering information',
    outside: 'How quickly a question is answered, and how complete the answer is.',
    inside:
      'Which questions get asked, how early, what the answer is needed for, and when the field stops being able to wait for it.',
  },
  {
    subject: 'Subcontractor and vendor commitments',
    outside: 'Whether a date somebody agreed to is a date they hold.',
    inside:
      'That the commitment was made explicitly, recorded, dated, and tracked, so a slip is visible while it is still recoverable.',
  },
  {
    subject: 'Products, materials, and services',
    outside: 'How something is fabricated on somebody else’s floor, and when it ships.',
    inside:
      'That it is registered, that what it has to coordinate with is understood, and that every approval and release behind it carries an owner and a date.',
  },
];

/* ------------------------------------------------------------------ 03 */

export type MethodStep = { title: string; body: string };

/**
 * The method as the reader experiences it, in five verbs: understand, find,
 * assign, plan, track. That sequence is the mental model the section exists to
 * leave behind, and the lede states it in those words so the reader can carry
 * it out of the section.
 *
 * This is NOT a restatement of `src/content/methodologyStages.ts`, which is
 * product doctrine naming the five stages and what each PRODUCES. That
 * doctrine is rendered as written in section 05 and MUST NOT be reworded here
 * or there.
 *
 * NOTHING HERE MAY IMPLY JITPRO TAKES CONTRACTUAL AUTHORITY over a party
 * outside the contractor's company (Section 20.1 engagement model). Step three
 * establishes what is required, who owns the next move, and when. It does not
 * direct anyone the contractor does not already direct.
 */
export const METHOD_STEPS: MethodStep[] = [
  {
    title: 'Understand the project',
    body: 'Drawings, specifications, contracts and subcontracts, the schedule, the scope, the commitments already made, the products and materials and services in play, and where the project actually stands today. We start from your project, not from a template.',
  },
  {
    title: 'Find what is unresolved',
    body: 'Scope gaps, conflicting requirements, missing information, unclear responsibility, open decisions, incomplete selections, coordination that has not happened yet, commitments that were made but never captured, and dependencies the project is quietly assuming will resolve themselves.',
  },
  {
    title: 'Establish accountability',
    body: 'Each one that can be acted on becomes an explicit item: what is required, who owns the next move, when it is required, and what work depends on it. On the record, before it is urgent.',
  },
  {
    title: 'Plan backward from the field',
    body: 'Start with the question that has an answer. When does the field need it? Then work back through the decisions, information, coordination, approvals, releases, commitments, fabrication, and delivery that have to happen for that date to be possible.',
  },
  {
    title: 'Track what is moving',
    body: 'Watch whether the dependencies are actually moving, and surface the ones that are not while meaningful options still exist. The point is not to chase everything equally. The point is to know what needs attention.',
  },
];

/* ------------------------------------------------------------------ 04 */

export type ChainLink = {
  /** The step, stated as the thing that has to be true. */
  label: string;
  /** What the step waits on. Never a date, never a duration (Section 50.6). */
  note: string;
};

/**
 * The backward dependency sequence (Section 50.6). It reads backward BY
 * CONSTRUCTION: the field need date is stated first and every step after it is
 * earlier than the one before. Nothing here carries a date, a duration, or a
 * count, so the figure's provenance is methodological (Section 48.10).
 *
 * REPURPOSED 2026-09-04. The figure is unchanged in shape and unchanged in the
 * rules that govern it. What it now proves is the just-in-time point rather
 * than a general one about planning: a product does not arrive just in time
 * because somebody placed an order at a clever moment. It arrives because
 * every step in this chain happened early enough, and the chain is what an
 * order date was never able to tell you.
 */
export const BACKWARD_CHAIN: ChainLink[] = [
  {
    label: 'The field needs it',
    note: 'The crew is ready, the work in front of it is complete, and this is what the next activity depends on.',
  },
  {
    label: 'It has to be onsite',
    note: 'Received, inspected, and staged where the work is happening.',
  },
  {
    label: 'It has to be delivered',
    note: 'Released for shipment against a date the field can actually use.',
  },
  {
    label: 'It has to be fabricated',
    note: 'Built to what was approved, not to what was assumed.',
  },
  {
    label: 'It has to be approved',
    note: 'Reviewed and returned, with the comments resolved rather than carried forward.',
  },
  {
    label: 'It has to be coordinated',
    note: 'Checked against adjacent trades and the conditions it will actually meet in the field.',
  },
  {
    label: 'The selection has to be final',
    note: 'The choice is made and will not be revisited after the work behind it starts.',
  },
  {
    label: 'The design information has to exist',
    note: 'The detail, dimension, or performance requirement the item is built to.',
  },
  {
    label: 'The decision has to be made',
    note: 'Someone has to own it, and it has to be made by a date the rest of this chain can live with.',
  },
];

export type JitDistinction = { label: string; body: string };

/**
 * The three positions on the timeline, and section 04's real work. Just in
 * time is widely misread in construction as "at the last minute", and a reader
 * who leaves this page with that reading has been actively misinformed. The
 * middle entry exists because the opposite misreading is just as wrong: JiTpro
 * does not ask that every decision be made on day one.
 *
 * These take the item-grid treatment already used in sections 00, 07 and 08
 * (hairline above, label, one short body). No new convention (Section 49.1).
 */
export const JIT_DISTINCTIONS: JitDistinction[] = [
  {
    label: 'Not too late',
    body: 'The field should not be the first place a dependency becomes urgent. By then the chain behind it has already run out of room, and the options that are left are the expensive ones.',
  },
  {
    label: 'Not unnecessarily early',
    body: 'This is not a demand that every decision be made on day one, or that everything be bought immediately. Deciding early and deciding blind are not the same thing.',
  },
  {
    label: 'Just in time',
    body: 'Understand when the project actually needs something, then establish when each dependency behind it has to be resolved to support that need.',
  },
];

/* ------------------------------------------------------------------ 05 */

/**
 * What each methodology stage PRODUCES, explained for a reader deciding
 * whether this is worth their next project.
 *
 * Keyed by the stage `id` in `src/content/methodologyStages.ts`. The stage
 * titles and screen captures come from that file unchanged; these three lines
 * are the long-form page's own addition. REVISED 2026-09-04 to lead with the
 * question each output answers, because that is the form the reader's own
 * question arrives in.
 *
 * THE PRODUCT REGISTER IS NOT A PRODUCTS-ONLY REGISTER. Its doctrine title is
 * fixed and may not be renamed here, so the lines below carry the breadth
 * instead: products, materials, equipment, and services, and the dependencies
 * behind each of them. Nothing in this file may narrow JiTpro to long-lead
 * items or to buying things (Section 20.1).
 */
export type ProducedOutput = {
  /** Methodology stage id this expands. */
  stageId: string;
  /** The question the reader is actually asking, in their own words. */
  question: string;
  /** What the reader is looking at. */
  what: string;
  /** Why a contractor cares, in field and decision terms. */
  matters: string;
};

export const PRODUCED_OUTPUTS: ProducedOutput[] = [
  {
    stageId: 'scope-validation',
    question: 'Does the contracted scope actually cover what the project requires?',
    what: 'A check of the requirements carried across the project documents against the coverage you actually hold, marking where they agree, where they conflict, where a requirement is carried by only one source, and where the language is ambiguous.',
    matters:
      'Scope you believe is covered and scope that is genuinely covered are not the same thing. This is where the difference shows up, while it is still a conversation.',
  },
  {
    stageId: 'scope-gap-analysis',
    question: 'Where are requirements missing, conflicting, unclear, or unassigned?',
    what: 'Every gap the validation found, sorted by what kind of gap it is, each one carrying a responsible party and the date it becomes a constraint.',
    matters:
      'A gap with a name, an owner, and a required-by date can be managed intentionally. The same gap without them is a surprise waiting for the field to find it.',
  },
  {
    stageId: 'commitment-capture',
    question: 'Who committed to do what, and by when?',
    what: 'The record of what people agreed to do, taken out of meetings, calls, email, text messages, and individual memory, and held in one place with an owner and a date.',
    matters:
      'Your team already chases these. The register is what lets them chase the few that are actually slipping instead of all of them.',
  },
  {
    stageId: 'product-register',
    question: 'What does the project depend on, and what has to happen before each item can support the field?',
    what: 'The products, materials, equipment, and services the project will depend on, each showing what it is waiting on, the approvals and commitments behind it, and the date it has to be onsite for the field to keep moving.',
    matters:
      'Importance is not determined by size, cost, or how obviously critical something looks today. An ordinary item can stop a crew just as completely as an obvious one.',
  },
  {
    stageId: 'backward-scheduling',
    question: 'Starting from the field need date, when does everything behind it have to happen?',
    what: 'A schedule built backward from the date the field needs each item, through the decisions, information, coordination, approvals, releases, and commitments required to get there.',
    matters:
      'This is what turns a required onsite date into an actionable date for a decision, an approval, or a release, long before anyone would otherwise be looking at it.',
  },
];

/* ------------------------------------------------------------------ 06 */

export type ChangePair = { without: string; with: string };

/**
 * The second paired-condition comparison (Section 50.6). Same rules: equal
 * typography, no colour carrying the contrast, and each row is one subject
 * read twice. The right column deliberately stops short of a promise
 * (Section 20.1 claim strength): better chances and more time, never
 * guaranteed schedules.
 *
 * REDUCED 2026-09-04, from eight rows to four, and the four are the four
 * outcomes the section is actually arguing: problems become visible earlier,
 * accountability becomes explicit, the team keeps more options, and margin is
 * not forced to be the first recovery tool. The rows that went were four more
 * illustrations of those same four ideas.
 */
export const CHANGE_PAIRS: ChangePair[] = [
  {
    without: 'A missing detail is found by the crew that needs it now.',
    with: 'The same missing detail is found while it is still paperwork.',
  },
  {
    without: 'It is unclear who owns the next move, or when it was due.',
    with: 'What is required, who owns it, when it is due, and what waits on it are visible.',
  },
  {
    without: 'The options still available are the expensive ones.',
    with: 'There is time to clarify, coordinate, substitute where appropriate, or escalate.',
  },
  {
    without: 'Margin pays for expediting, remobilization, rework, and downtime.',
    with: 'Recovery cost is not the first tool the project reaches for.',
  },
];

/* ------------------------------------------------------------------ 08 */

export type Phase = { name: string; body: string };

/**
 * Deliberately high level. No durations, no deliverable counts, and no
 * commercial terms are stated here, because none are approved (Appendix C: a
 * TODO is not permission, and neither is an absent decision). A paid initial
 * engagement structure is in development, and nothing about it may appear on
 * this page until it is approved and recorded.
 *
 * REFRAMED 2026-09-04 to the reader's own steps: bring us a project, we put
 * JiTpro to work on it, you see it against real work. The middle step is two
 * phases because interrogating the project and building the structure are
 * genuinely sequential: you cannot assign accountability for a dependency you
 * have not found, and you cannot date one you have not assigned.
 */
export const FIRST_PROJECT_PHASES: Phase[] = [
  {
    name: 'Bring us a project',
    body: 'Ideally one early enough that meaningful options still exist. We start from what you already have: the documents, the contracts and subcontracts, the schedule, the team, and where the project stands today.',
  },
  {
    name: 'We interrogate it',
    body: 'The scope, the information the project is waiting on, the decisions and selections still open, the commitments already made, and the products, materials, and services the field will depend on.',
  },
  {
    name: 'We build the structure',
    body: 'Each dependency gets what is required, an owner for the next move, a required-by date, and a place in the chain that leads back from the date the field needs the result.',
  },
  {
    name: 'You see it on real work',
    body: 'You judge JiTpro against your own project rather than against a demonstration. Nobody is asked to reorganize the company around a system they have not watched work.',
  },
];

/* ------------------------------------------------------------------ 09 */

/**
 * Qualification by posture or by project condition, never by character
 * (Section 50.2).
 *
 * THE POSITIONING IS PREVENTIVE (2026-09-04). JiTpro is not a rescue service
 * for a project already in recovery, and the first entry in the second column
 * says so plainly: a reader who brings us the wrong project is a worse outcome
 * than a reader who brings us none. The reader this page is written for has
 * paid for preventable problems before and does not want to repeat it on the
 * next one.
 */
export const FIT_FOR: string[] = [
  'You have already paid for preventable project problems, and you know roughly what they cost you.',
  'You are growing, and staying personally ahead of everything is harder than it used to be.',
  'You have a project coming up that is early enough for decisions and information to still be worked.',
  'You would rather prevent the next recovery effort than analyze the last one.',
];

export const FIT_NOT_FOR: string[] = [
  'A project is already deep in recovery, and what it needs is somebody to take it over.',
  'Firefighting is accepted as simply part of being a builder.',
  'Naming dependencies, owners, and dates early is treated as somebody else’s job.',
];
