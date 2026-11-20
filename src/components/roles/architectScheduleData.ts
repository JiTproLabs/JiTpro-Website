import type { PhaseFamily } from '../demo/screens/procurement-schedule/scheduleModel';

/**
 * The illustrative procurement schedule of the Architects & Engineers page's
 * solution section (Design System §64). Static demonstration data: four
 * items, each with its own activities, durations and responsible parties,
 * scheduled backward from its own Required On-Site Date (RoSD).
 *
 * Simplified on purpose. Each item is drawn as one linear sequence with one
 * responsible party per activity; real procurement overlaps activities and
 * shares responsibility. Dates are illustrative, not project commitments.
 * Durations are calendar days.
 */

export type Team = 'owner' | 'design' | 'gc' | 'trade';

export const TEAM_LABEL: Record<Team, string> = {
  owner: 'Owner',
  design: 'Design Team',
  gc: 'GC',
  trade: 'Trade Partners',
};

interface ActivitySpec {
  name: string;
  /** The activity family: its colour in the approved chain palette (Design System §51.7). */
  family: PhaseFamily;
  team: Team;
  /** Who does it, in the visitor's words. */
  responsible: string;
  days: number;
}

interface ItemSpec {
  id: string;
  name: string;
  scope: string;
  /** ISO date, in SCHEDULE_YEAR. */
  rosd: string;
  /** In order, first to last; the last finishes on the RoSD. */
  activities: ActivitySpec[];
}

export const SCHEDULE_YEAR = 2027;
/** The shared calendar: January 1 through June 30. */
export const CALENDAR = { start: '2027-01-01', end: '2027-06-30' } as const;

const ITEMS: ItemSpec[] = [
  {
    id: 'windows',
    name: 'Custom Steel Windows',
    scope: 'Exterior envelope',
    rosd: '2027-05-15',
    activities: [
      { name: 'Window finish and hardware selections', family: 'coordination', team: 'owner', responsible: 'Owner', days: 8 },
      { name: 'Performance and engineering coordination', family: 'coordination', team: 'design', responsible: 'Architect and envelope consultant', days: 12 },
      { name: 'Buyout and subcontract award', family: 'buyout', team: 'gc', responsible: 'General contractor', days: 10 },
      { name: 'Shop drawing preparation', family: 'preparation', team: 'trade', responsible: 'Window manufacturer', days: 18 },
      { name: 'Architectural shop drawing review', family: 'review', team: 'design', responsible: 'Architect and structural engineer', days: 14 },
      { name: 'Release for fabrication', family: 'buyout', team: 'gc', responsible: 'General contractor', days: 3 },
      { name: 'Fabrication', family: 'production', team: 'trade', responsible: 'Window manufacturer', days: 49 },
      { name: 'Shipping and delivery', family: 'logistics', team: 'trade', responsible: 'Window manufacturer', days: 10 },
    ],
  },
  {
    id: 'doors',
    name: 'Exterior Doors',
    scope: 'Building openings',
    rosd: '2027-05-22',
    activities: [
      { name: 'Door finish and hardware selections', family: 'coordination', team: 'owner', responsible: 'Owner', days: 7 },
      { name: 'Door hardware coordination', family: 'coordination', team: 'design', responsible: 'Architect and hardware consultant', days: 10 },
      { name: 'Buyout and purchase order', family: 'buyout', team: 'gc', responsible: 'General contractor', days: 7 },
      { name: 'Hardware schedule and submittal preparation', family: 'preparation', team: 'trade', responsible: 'Door supplier', days: 14 },
      { name: 'Architectural submittal review', family: 'review', team: 'design', responsible: 'Architect', days: 10 },
      { name: 'Release for fabrication', family: 'buyout', team: 'gc', responsible: 'General contractor', days: 2 },
      { name: 'Fabrication', family: 'production', team: 'trade', responsible: 'Door manufacturer', days: 35 },
      { name: 'Delivery', family: 'logistics', team: 'trade', responsible: 'Door supplier', days: 7 },
    ],
  },
  {
    id: 'lighting',
    name: 'Architectural Lighting',
    scope: 'Interior finishes',
    rosd: '2027-06-12',
    activities: [
      { name: 'Fixture selections', family: 'coordination', team: 'owner', responsible: 'Owner', days: 14 },
      { name: 'Lighting and electrical coordination', family: 'coordination', team: 'design', responsible: 'Lighting designer and electrical engineer', days: 12 },
      { name: 'Electrical subcontract buyout', family: 'buyout', team: 'gc', responsible: 'General contractor', days: 7 },
      { name: 'Product data and submittal preparation', family: 'preparation', team: 'trade', responsible: 'Electrical subcontractor', days: 10 },
      { name: 'Lighting and electrical review', family: 'review', team: 'design', responsible: 'Lighting designer and electrical engineer', days: 10 },
      { name: 'Final fixture package approval', family: 'review', team: 'owner', responsible: 'Owner', days: 5 },
      { name: 'Release order', family: 'buyout', team: 'gc', responsible: 'General contractor', days: 2 },
      { name: 'Manufacturing', family: 'production', team: 'trade', responsible: 'Fixture manufacturer', days: 28 },
      { name: 'Shipping and delivery', family: 'logistics', team: 'trade', responsible: 'Electrical distributor', days: 7 },
    ],
  },
  {
    id: 'millwork',
    name: 'Custom Millwork',
    scope: 'Interior package',
    rosd: '2027-06-20',
    activities: [
      { name: 'Wood species and finish selections', family: 'coordination', team: 'owner', responsible: 'Owner', days: 10 },
      { name: 'Millwork detailing coordination', family: 'coordination', team: 'design', responsible: 'Architect and interior designer', days: 10 },
      { name: 'Buyout and subcontract award', family: 'buyout', team: 'gc', responsible: 'General contractor', days: 10 },
      { name: 'Field verification of dimensions', family: 'preparation', team: 'trade', responsible: 'Millwork subcontractor', days: 7 },
      { name: 'Shop drawing preparation', family: 'preparation', team: 'trade', responsible: 'Millwork subcontractor', days: 21 },
      { name: 'Architectural shop drawing review', family: 'review', team: 'design', responsible: 'Architect and interior designer', days: 12 },
      { name: 'Finish sample approval', family: 'review', team: 'owner', responsible: 'Owner', days: 7 },
      { name: 'Release for fabrication', family: 'buyout', team: 'gc', responsible: 'General contractor', days: 2 },
      { name: 'Fabrication', family: 'production', team: 'trade', responsible: 'Millwork subcontractor', days: 35 },
      { name: 'Delivery and staging', family: 'logistics', team: 'trade', responsible: 'Millwork subcontractor', days: 5 },
    ],
  },
];

const DAY = 86_400_000;
/** Whole days since 1970-01-01, UTC, so no time zone or daylight saving can move a date. */
export const dayNumber = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d) / DAY;
};
const isoOf = (day: number) => new Date(day * DAY).toISOString().slice(0, 10);

export const CALENDAR_START = dayNumber(CALENDAR.start);
/** Days on the calendar, inclusive of both ends. */
export const CALENDAR_DAYS = dayNumber(CALENDAR.end) - CALENDAR_START + 1;

export interface ScheduledActivity extends ActivitySpec {
  id: string;
  /** Inclusive first and last day, as ISO dates. */
  start: string;
  finish: string;
  /** The calendar fraction where it starts, and the fraction it spans (0 to 1). */
  left: number;
  width: number;
  /** The next activity's name, or null for the last. */
  next: string | null;
}

export interface ScheduledItem extends Omit<ItemSpec, 'activities'> {
  activities: ScheduledActivity[];
  /** The calendar fraction of the RoSD's end. */
  rosdAt: number;
}

/** Schedule each item backward from its RoSD: the last activity finishes on it, each earlier one the day before the next starts. */
export function scheduleItem(item: ItemSpec): ScheduledItem {
  let cursor = dayNumber(item.rosd);
  const backward = [...item.activities].reverse().map((a) => {
    const finish = cursor;
    const start = finish - a.days + 1;
    cursor = start - 1;
    return { a, start, finish };
  });
  const forward = backward.reverse();
  return {
    ...item,
    rosdAt: (dayNumber(item.rosd) - CALENDAR_START + 1) / CALENDAR_DAYS,
    activities: forward.map(({ a, start, finish }, i) => ({
      ...a,
      id: `${item.id}-${i}`,
      start: isoOf(start),
      finish: isoOf(finish),
      left: (start - CALENDAR_START) / CALENDAR_DAYS,
      width: a.days / CALENDAR_DAYS,
      next: forward[i + 1]?.a.name ?? null,
    })),
  };
}

export const SCHEDULE: ScheduledItem[] = ITEMS.map(scheduleItem);

/** The month labels and their calendar fractions. */
export const MONTHS = Array.from({ length: 6 }, (_, m) => ({
  label: new Date(Date.UTC(SCHEDULE_YEAR, m, 1)).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
  at: (Date.UTC(SCHEDULE_YEAR, m, 1) / DAY - CALENDAR_START) / CALENDAR_DAYS,
}));

/** "May 15" */
export const shortDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
/** "May 15" with the full month: "January 29" */
export const longDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });
