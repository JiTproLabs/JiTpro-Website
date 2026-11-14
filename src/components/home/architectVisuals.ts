/**
 * The Architects tabs' visuals (Design System Section 54.4.6): three static
 * document compositions. Each is the general contractor's plan behind and an
 * architect-facing document in front.
 *
 * ILLUSTRATIONS, NOT DATA (founder, 2026-11-13). The front sheets carry
 * representative, technically credible content for the homepage's sample
 * project (Sierra Ridge Architects, November 18, 2026). They are not computed
 * from the schedule and are not required to match the general contractor tabs
 * date for date. The back sheets draw Plan's schedule as texture.
 *
 * No motion: nothing here has a clock.
 */

export type ArchitectTabId = 'arch-see-whats-coming' | 'arch-plan-workload' | 'arch-protect-reputation';
export const ARCHITECT_TABS: readonly ArchitectTabId[] = ['arch-see-whats-coming', 'arch-plan-workload', 'arch-protect-reputation'];
export const isArchitectTab = (id: string): id is ArchitectTabId => (ARCHITECT_TABS as readonly string[]).includes(id);

/** The owner visuals' canvases, so the two families share their frames. Below this frame width the narrow design shows. */
export const ARCH_CANVAS = { desktop: { w: 560, h: 350 }, phone: { w: 340, h: 212 } } as const;
export const ARCH_NARROW_BELOW = 460;

/** The illustrative date the sheets are issued on (the Control tab's). */
export const AS_OF = '2026-11-18';
export const ARCHITECT_FIRM = 'Sierra Ridge Architects';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** `2026-12-02` as `Dec 2`. */
export const monthDay = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}`;
export const monthName = (monthIndex: number) => MONTHS[monthIndex];
/** Whole days since the epoch, for placing dates on an axis. */
export const dayNumber = (iso: string) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10))) / 864e5;

/* ------------------------------------------------------ 1. See what's coming */

export type Deliverable = { what: string; pkg: string; by: string; why: readonly string[] };
/** The architect's next five deliverables, soonest first. The first is the one amber row. */
export const DELIVERABLES: readonly Deliverable[] = [
  { what: 'Third submittal review', pkg: 'Steel windows & doors', by: '2026-12-02', why: ['Final approval releases 36 weeks', 'of fabrication'] },
  { what: 'Material selection', pkg: 'Exterior stone · coordination', by: '2026-12-04', why: ['Owner selection and stone', 'sample coordination follow'] },
  { what: 'Final glazing specification', pkg: 'Steel windows & doors', by: '2026-12-17', why: ['Needed as fabrication', 'proceeds'] },
  { what: 'Joint pattern approved', pkg: 'Exterior stone', by: '2026-12-31', why: ['Stone layout drawings begin'] },
  { what: 'Final door schedule issued', pkg: 'Interior doors', by: '2027-01-07', why: ['Door and hardware', 'coordination begins'] },
];
export const DELIVERABLES_FOOTNOTE = 'Planned reviews and known design information. RFIs are answered as questions arise.';

/* ------------------------------------------------------ 2. Plan your workload */

/** Five Monday-to-Friday weeks; the week at PEAK is the one amber column. */
export const WEEKS = ['2027-04-19', '2027-04-26', '2027-05-03', '2027-05-10', '2027-05-17'] as const;
export const WEEKS_END = '2027-05-21';
export const PEAK = 3;

/** A bar: a span, or a single due date. A span that ends inside the weeks ends in a due mark; one that runs on, in a chevron. */
export type WorkBar = { name: string; start?: string; end?: string; due?: string };
export type WorkLane = { label: string; who: string; bars: readonly WorkBar[] };
export const WORK_LANES: readonly WorkLane[] = [
  {
    label: 'Submittal reviews',
    who: 'Architect',
    bars: [
      { name: 'Interior doors', start: '2027-04-23', end: '2027-05-27' },
      { name: 'Cabinetry', start: '2027-04-27', end: '2027-05-21' },
      { name: 'Metal railings', start: '2027-05-10', end: '2027-06-01' },
    ],
  },
  { label: 'Design deliverables', who: 'Architect', bars: [] },
  { label: 'Owner selections', who: 'Owner decides; architect supports', bars: [{ name: 'Plumbing fixtures', start: '2027-03-19', end: '2027-05-12' }] },
  {
    label: 'Consultant work',
    who: 'Lighting & interior designers',
    bars: [
      { name: 'Lighting fixture schedule', start: '2027-04-06', end: '2027-05-07' },
      { name: 'Plumbing fixture schedule', start: '2027-05-13', end: '2027-06-09' },
    ],
  },
];
/** The lanes that are the architect's own work (the narrow frame fills these). */
export const OWN_LANES = 2;
export const EMPTY_LANE = 'None due in these weeks';
export const PLANNING_NOTE = {
  title: 'Planning note · week of May 10',
  tips: [
    'Coordinate consultant availability',
    'Establish realistic review periods',
    'Adjust staffing or review capacity',
    'Coordinate submission timing with the GC',
    'Identify competing deadlines early',
  ],
} as const;
export const PHONE_NOTE = 'Time to plan: consultants, review periods, capacity.';

/** The Friday of a week that starts on `monday`. */
const friday = (monday: string) => new Date((dayNumber(monday) + 4) * 864e5).toISOString().slice(0, 10);
/** Whether a bar is in play in a week: a span that overlaps it, or a due date inside it. */
export const inWeek = (bar: WorkBar, monday: string) => {
  const fri = friday(monday);
  return bar.due !== undefined ? bar.due >= monday && bar.due <= fri : bar.start! <= fri && bar.end! >= monday;
};
/** Each week's count of scheduled items (items, not hours), and the architect's own share. */
export const weekTotals = () =>
  WEEKS.map((w) => ({
    all: WORK_LANES.reduce((n, l) => n + l.bars.filter((b) => inWeek(b, w)).length, 0),
    own: WORK_LANES.slice(0, OWN_LANES).reduce((n, l) => n + l.bars.filter((b) => inWeek(b, w)).length, 0),
  }));

/* ------------------------------------------------------ 3. Protect your reputation */

export type Commitment = { what: string; pkg: string; who: string; via?: string; by: string; supports: readonly string[]; chain?: boolean };
/** A planned architect review the stone chain protects, in working days. */
export const STONE_REVIEW_DAYS = 17;
/** Grouped by package. The stone rows are one chain across three parties: owner, architect, fabricator. */
export const COMMITMENTS: readonly Commitment[] = [
  { what: 'Final field dimensions', pkg: 'Steel windows & doors', who: 'General contractor', via: 'with the glazing sub', by: '2026-11-30', supports: ['Window release', 'for fabrication'] },
  { what: 'Final glazing specification', pkg: 'Steel windows & doors', who: 'Architect', by: '2026-12-17', supports: ['Window fabrication'] },
  { what: 'Stone material & blend selected', pkg: 'Exterior stone', who: 'Owner', by: '2026-12-07', supports: ['Stone sample coordination'], chain: true },
  { what: 'Joint pattern approved', pkg: 'Exterior stone', who: 'Architect', by: '2026-12-31', supports: ['Stone layout drawings'], chain: true },
  { what: 'Stone submittal issued', pkg: 'Exterior stone', who: 'Stone fabricator', via: 'via the GC', by: '2027-02-08', supports: [`A planned ${STONE_REVIEW_DAYS}-day`, 'architect review'], chain: true },
];
/** The stone chain's last step, the architect's approval, drawn on the back sheet. */
export const STONE_APPROVAL = '2027-03-22';
/** Founder-approved copy (2026-11-13). */
export const COMMITMENTS_CLOSING = 'Clear expectations. Coordinated commitments. Fewer surprises.';
export const COORDINATION_LANES = ['Owner', 'Architect', 'Consultants', 'General contractor', 'Trades & suppliers'] as const;
