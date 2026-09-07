/**
 * PROCUREMENT SCHEDULE - data model, participants, phase families and the
 * working-day engine. PROTOTYPE ONLY.
 *
 * Everything the schedule renders is derived from this file. Geometry, labels,
 * dates, durations, accountability and inspection content all read the same
 * record, so a fixture change moves the bar and rewrites the popover together.
 * Nothing about a phase is authored twice.
 */

import { PEOPLE, ORGANIZATIONS } from '../../components/demo/fixtures/project';
import { iso, parse, prevWorkday, subWorkdays, snapBack, workdaysBetween } from './workCalendar';

/* ------------------------------------------------------------ participants */

/**
 * Additional representative participants. The approved production people and
 * organizations are reused as-is; these extend them for the trades, designers,
 * suppliers and the agency that a procurement schedule needs.
 *
 * Names are deliberately plain. Constructed for demonstration; no real firm or
 * person is depicted.
 */
export const SCHEDULE_PEOPLE = {
  ...PEOPLE,
  MO: { initials: 'MO', name: 'Miguel Ortiz', role: 'Superintendent' },
  NR: { initials: 'NR', name: 'Nathan Reyes', role: 'Electrical Engineer' },
  CF: { initials: 'CF', name: 'Claire Fielding', role: 'Lighting Designer' },
  RM: { initials: 'RM', name: 'Rachel Marston', role: 'Interior Designer' },
  PN: { initials: 'PN', name: 'Peter Novak', role: 'Project Coordinator' },
  TW: { initials: 'TW', name: 'Tom Whitfield', role: 'Detailing Manager' },
  ED: { initials: 'ED', name: 'Erin Doyle', role: 'Account Manager' },
  VS: { initials: 'VS', name: 'Victor Salas', role: 'Applications Engineer' },
  MR: { initials: 'MR', name: 'Marco Ruiz', role: 'Fabrication Manager' },
  DE: { initials: 'DE', name: 'Dana Ellis', role: 'Sales Manager' },
  NA: { initials: 'NA', name: 'Nils Andersen', role: 'Shop Manager' },
  GK: { initials: 'GK', name: 'Grace Kim', role: 'Specification Consultant' },
  RP: { initials: 'RP', name: 'Ruth Palmer', role: 'Order Manager' },
  CB: { initials: 'CB', name: 'Carl Bishop', role: 'Dispatch Manager' },
  RH: { initials: 'RH', name: 'Robert Hale', role: 'Estimator' },
  SB: { initials: 'SB', name: 'Sonia Brandt', role: 'Mechanical Engineer' },
  LV: { initials: 'LV', name: 'Lena Varga', role: 'Applications Engineer' },
  HK: { initials: 'HK', name: 'Henry Kato', role: 'Vertical Transportation Consultant' },
  OD: { initials: 'OD', name: 'Omar Diallo', role: 'Field Operations Manager' },
  IS: { initials: 'IS', name: 'Ingrid Sorensen', role: 'Fabrication Lead' },
  TF: { initials: 'TF', name: 'Tessa Fontaine', role: 'Civil Engineer' },
  AK: { initials: 'AK', name: 'Anders Klein', role: 'Geotechnical Engineer' },
} as const;

export type SchedulePersonKey = keyof typeof SCHEDULE_PEOPLE;

export const SCHEDULE_ORGS = {
  ...ORGANIZATIONS,
  electrical: 'Calder Power Engineering',
  lighting: 'Fielding Lighting Design',
  interiors: 'Marston Interior Design',
  heritage: 'Heritage Steel Window & Door',
  steel: 'Granite Ridge Steel Fabricators',
  lumber: 'Cascade Building Supply',
  switchgear: 'Northgate Electrical Systems',
  stone: 'Cordova Stone Works',
  tile: 'Meridian Tile Supply',
  casework: 'Harlow Cabinetmakers',
  plumbing: 'Waterline Fixture Group',
  doors: 'Ashgrove Door Company',
  logistics: 'Summit Freight Services',
  mechanical: 'Brandt Mechanical Engineering',
  hvac: 'Ridgeline Air Systems',
  vertical: 'Kato Vertical Transportation',
  elevator: 'Larkspur Elevator Systems',
  ornamental: 'Sorensen Ornamental Metalworks',
  civil: 'Fontaine Civil Engineering',
  geotech: 'Klein Geotechnical Consulting',
} as const;

export type ScheduleOrgKey = keyof typeof SCHEDULE_ORGS;

/* ---------------------------------------------------------- phase families */

/**
 * Nine families. The family is a VISUAL classification - it decides colour,
 * legend entry and marker shape. It is NOT a status and NOT the task's
 * identity: "Architect Review 2" and "Agency Review 1" are both REVIEW, and
 * inspection is where the exact task is read.
 */
export type PhaseFamily =
  | 'buyout'
  | 'coordination'
  | 'preparation'
  | 'review'
  | 'revision'
  | 'approval'
  | 'production'
  | 'logistics'
  | 'required';

export const PHASE_FAMILIES: { key: PhaseFamily; label: string }[] = [
  { key: 'buyout', label: 'Buyout' },
  { key: 'coordination', label: 'Coordination' },
  { key: 'preparation', label: 'Preparation' },
  { key: 'review', label: 'Review' },
  { key: 'revision', label: 'Revision' },
  { key: 'approval', label: 'Approval' },
  { key: 'production', label: 'Production' },
  { key: 'logistics', label: 'Logistics' },
  { key: 'required', label: 'Required On-Site' },
];

/**
 * Status is ORTHOGONAL to family (governing instruction Section 60). A REVIEW
 * phase is red-family whether it is complete or at risk; how it is performing
 * is carried by the status badge, never by the bar's hue.
 */
export type PhaseStatus = 'complete' | 'on-track' | 'at-risk' | 'upcoming';

export const STATUS_LABEL: Record<PhaseStatus, string> = {
  complete: 'Complete',
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  upcoming: 'Upcoming',
};

/* ------------------------------------------------------ working-day engine */

/**
 * THE CALENDAR LIVES IN workCalendar.ts. A working day is Monday to Friday and
 * not an observed U.S. federal holiday; every duration, gap and lead time in
 * this model is counted in those days and nothing here can count a day the
 * calendar excludes. The helpers are re-exported so existing consumers keep
 * one import path, and so the Gantt's shading and this engine cannot be
 * pointed at two different definitions of "working".
 */
export { iso, parse, prevWorkday, subWorkdays, snapBack, workdaysBetween };

/* --------------------------------------------------------------- the model */

/** Authored input. Durations are working days; `gap` is slack BEFORE the step. */
export type StepSpec = {
  id: string;
  name: string;
  family: PhaseFamily;
  kind: 'phase' | 'milestone';
  /** Working days. Duration phases only. */
  days?: number;
  /** Working days of float between this step and the one after it. */
  gap?: number;
  org: ScheduleOrgKey;
  owner: SchedulePersonKey;
  /** What this party owes the project during this step. */
  owed: string;
  /** Explicit status override; otherwise derived from the data date. */
  status?: PhaseStatus;
  commitmentId?: string;
};

/** Resolved output. This is what the Gantt and the popover both read. */
export type ScheduleStep = {
  id: string;
  scheduleItemId: string;
  kind: 'phase' | 'milestone';
  family: PhaseFamily;
  name: string;
  /** Duration phases: inclusive span. Milestones: start === end === the date. */
  startDate: string;
  endDate: string;
  durationWorkdays: number;
  status: PhaseStatus;
  responsibleOrganizationId: ScheduleOrgKey;
  responsibleOrganization: string;
  commitmentOwnerId: SchedulePersonKey;
  commitmentOwnerName: string;
  commitmentOwnerRole: string;
  whatIsOwed: string;
  nextStepId?: string;
  nextHandoffLabel?: string;
  nextHandoffParty?: string;
  /** Declared, not built. The future Commitment Register link. */
  commitmentId?: string;
  requiredOnSiteDate: string;
};

/* ------------------------------------------------ external commitments */

/**
 * EXTERNAL COMMITMENT MILESTONES.
 *
 * A procurement bar is work the General Contractor can schedule and chase. A
 * commitment is the opposite: a decision, design, selection or piece of
 * information that someone OUTSIDE the GC's control has to provide before the
 * bar after it can start. The schedule has always depended on these. It has
 * never shown them, which is why they surface as emergencies - a selection
 * nobody was tracking turns out to have been needed six weeks ago.
 *
 * THE TWO DATES ARE NOT THE SAME THING, AND ONE MUST NEVER BECOME THE OTHER.
 *
 *   requiredBy   - schedule logic. Derived by walking back from the activity
 *                  this commitment unblocks, which was itself derived by
 *                  walking back from Required On-Site. Nobody negotiates it;
 *                  it is what the downstream sequence demands.
 *   committedFor - a team agreement. Authored, independent, nullable. What the
 *                  responsible party actually said they would do.
 *
 * Collapsing the two would destroy the only thing this feature is for. If the
 * Architect agrees to a date twelve days after the schedule needs it, the
 * schedule requirement does not move twelve days - the project acquires a
 * twelve-day problem, and the whole point is to see it in December rather than
 * in April. So `committedFor` is never written back onto `requiredBy`, and
 * `varianceWorkdays` is derived from the pair rather than stored over either.
 */
export type CommitmentType =
  | 'design'
  | 'selection'
  | 'engineering'
  | 'approval'
  | 'information';

export const COMMITMENT_TYPE_LABEL: Record<CommitmentType, string> = {
  design: 'Design Commitment',
  selection: 'Owner Selection',
  engineering: 'Engineering Commitment',
  approval: 'Design Approval',
  information: 'Information Required',
};

/**
 * The accountable party, as a role rather than a person. A person can leave
 * the project; the accountability does not. This is also the axis the future
 * Submittal Schedule export will group by, so it is a closed union rather than
 * free text.
 */
export type CommitmentOwnerRole =
  | 'Owner'
  | 'Architect'
  | 'Interior Designer'
  | 'Structural Engineer'
  | 'Mechanical Engineer'
  | 'Electrical Engineer'
  | 'Civil Engineer'
  | 'Geotechnical Engineer'
  | 'Lighting Designer'
  | 'Vertical Transportation Consultant';

export type CommitmentStatus = 'complete' | 'committed' | 'beyond-required' | 'open';

export const COMMITMENT_STATUS_LABEL: Record<CommitmentStatus, string> = {
  complete: 'Complete',
  committed: 'Committed',
  'beyond-required': 'Beyond Required',
  open: 'Open',
};

/** Authored input. */
export type CommitmentSpec = {
  id: string;
  name: string;
  type: CommitmentType;
  ownerRole: CommitmentOwnerRole;
  owner: SchedulePersonKey;
  org: ScheduleOrgKey;
  /**
   * The step this commitment unblocks. A commitment is never a free-floating
   * date: it exists because a specific downstream activity cannot proceed
   * without it, and that link is what makes `requiredBy` derivable at all.
   */
  requiredForStepId: string;
  /** Working days before that activity starts. 0 = by the day it begins. */
  leadDays?: number;
  /**
   * The agreed date, as authored. Absolute and independent - NOT computed from
   * `requiredBy`, and free to fall before, on or after it.
   */
  committedFor?: string;
  /**
   * The date this was ORIGINALLY required, where the current forecast has
   * since moved. Authored, and only where the two genuinely differ: the
   * current `requiredBy` is re-derived from a forecast that has already
   * absorbed the actual, so without this the original requirement would be
   * lost and the miss would become invisible. History is not overwritten.
   */
  baselineRequiredBy?: string;
  /** ACTUAL. When the party in fact provided it. Never inferred. */
  completedOn?: string;
  /** What is actually owed, in the responsible party's terms. */
  description: string;
};

/** Resolved output. What the marker and the popover both read. */
export type ScheduleCommitment = {
  id: string;
  scheduleItemId: string;
  name: string;
  type: CommitmentType;
  typeLabel: string;
  ownerRole: CommitmentOwnerRole;
  ownerId: SchedulePersonKey;
  ownerName: string;
  ownerTitle: string;
  ownerOrganizationId: ScheduleOrgKey;
  ownerOrganization: string;
  /** DERIVED from the downstream schedule. Never authored, never negotiated. */
  requiredBy: string;
  /** AUTHORED agreement. Null where no date has been committed yet. */
  committedFor: string | null;
  /**
   * Signed working days: positive = committed later than required, which is
   * the variance this feature exists to expose. Null when nothing is
   * committed. Derived from the pair; neither input is modified.
   */
  varianceWorkdays: number | null;
  /** The original requirement, where the forecast has since moved. */
  baselineRequiredBy: string | null;
  requiredForStepId: string;
  requiredForStepName: string;
  status: CommitmentStatus;
  completedDate: string | null;
  /**
   * Signed working days between what was ORIGINALLY required
   * (`baselineRequiredBy ?? requiredBy`) and when it was actually provided.
   * Only present where a real actual was recorded - it is a measurement, not
   * an assumption, so a commitment merely presumed settled has none.
   */
  completionVarianceWorkdays: number | null;
  description: string;
};

/* --------------------------------------------------- baseline, risk, health */

/**
 * PACKAGE HEALTH IS NOT PHASE STATUS, AND THE TWO MUST NOT MERGE.
 *
 *   PhaseStatus   - what is happening to THIS ACTIVITY (complete, on track,
 *                   at risk, upcoming). Per step.
 *   PackageHealth - is this procurement path positioned to satisfy the field
 *                   requirement? Per package.
 *
 * A package can be perfectly on track activity-by-activity and still fail to
 * meet the date the field needs the material, which is exactly the condition
 * worth surfacing. Collapsing the two would make that condition unsayable.
 *
 * DERIVED, NEVER AUTHORED. Health falls out of the facts: a forecast that
 * overshoots the requirement is `impacted`, a recorded exposure that has not
 * (yet) done so is `at-risk`, and everything else is `healthy`. Nothing can be
 * marked at risk by assertion - it has to have a reason attached.
 */
export type PackageHealth = 'healthy' | 'at-risk' | 'impacted';

export const PACKAGE_HEALTH_LABEL: Record<PackageHealth, string> = {
  healthy: 'Healthy',
  'at-risk': 'At Risk',
  impacted: 'Impacted',
};

export type IssueKind = 'lead-time' | 'missed-commitment';

export const ISSUE_KIND_LABEL: Record<IssueKind, string> = {
  'lead-time': 'Procurement Risk',
  'missed-commitment': 'Missed Commitment',
};

/** Authored. What went wrong, or what was learned, and when. */
export type IssueSpec = {
  id: string;
  kind: IssueKind;
  title: string;
  /** When the project LEARNED of it. Places the marker; not a schedule date. */
  identifiedOn: string;
  /** Why, in one representative sentence. */
  cause: string;
  /** What it did to the procurement path. */
  impact: string;
  /**
   * The existing commitment this issue stems from. The issue NEVER re-authors
   * that commitment's dates - it reads them - so the two can never disagree
   * about when something was required, agreed or delivered.
   */
  rootCommitmentId?: string;
  /** Lead-time risk only: the step whose duration changed, and by how much. */
  leadStepId?: string;
  baselineLeadWorkdays?: number;
};

export type ScheduleIssue = {
  id: string;
  scheduleItemId: string;
  kind: IssueKind;
  kindLabel: string;
  title: string;
  identifiedOn: string;
  cause: string;
  impact: string;
  /** Resolved root cause, where there is one. Read, never copied. */
  rootCommitment: ScheduleCommitment | null;
  /** Lead-time risk only. */
  baselineLeadWorkdays: number | null;
  currentLeadWorkdays: number | null;
};

/**
 * BASELINE. What was originally expected, resolved by re-running the SAME
 * backward pass with the original assumptions substituted. It is a derivation,
 * not a set of authored dates, so it cannot drift from the engine that
 * produces the forecast - and it is written to its own field, so it can never
 * overwrite the forecast it is compared against.
 */
export type BaselineOverride = { stepId: string; days: number };

export type ScheduleBaseline = {
  startDate: string;
  /** Working days the path had to be pulled forward against baseline. */
  pathAdvancedWorkdays: number;
  stepDates: Record<string, { startDate: string; endDate: string }>;
};

/** Authored risk/variance block. Optional: most packages have none. */
export type RiskSpec = {
  baselineOverrides?: BaselineOverride[];
  /**
   * CURRENT PREDICTED PERFORMANCE against the field requirement. Authored for
   * now; a forward scheduling engine would compute it later and nothing else
   * would need to change. It is a SEPARATE field from `requiredOnSiteDate` on
   * purpose - see the note there.
   */
  forecastOnSiteDate?: string;
  issues?: IssueSpec[];
};

export type ScheduleItem = {
  id: string;
  name: string;
  category: string;
  /**
   * THE FIELD REQUIREMENT. The date the field needs the material or equipment,
   * and the input the entire backward pass is derived from.
   *
   * IT DOES NOT MOVE BECAUSE PROCUREMENT PERFORMS BADLY. If the frame needs
   * steel on 15 March, a late submittal does not change when the frame needs
   * steel - it changes whether the steel will be there. Redefining this field
   * as "the revised requirement" would quietly erase the only fixed point the
   * schedule is measured against, and every variance in the system would then
   * be measured against a moving target.
   *
   * Whether the project is going to MEET it is a different value entirely:
   * `forecastOnSiteDate`.
   */
  requiredOnSiteDate: string;
  steps: ScheduleStep[];
  /** External dependencies this package cannot proceed without. */
  commitments: ScheduleCommitment[];
  /** Recorded exposures. Empty for a healthy package. */
  issues: ScheduleIssue[];
  /** What was originally expected, where it differs from the forecast. */
  baseline: ScheduleBaseline | null;
  /**
   * CURRENT PREDICTED ON-SITE. Null where the forecast still satisfies the
   * requirement, which is the normal case. Never written back into
   * `requiredOnSiteDate`.
   */
  forecastOnSiteDate: string | null;
  /** Working days by which the forecast overshoots the requirement. 0 = met. */
  forecastVarianceWorkdays: number;
  /** Derived from the facts above. Never authored. */
  health: PackageHealth;
  /** Derived: the step spanning the data date, if any. */
  currentStepId?: string;
  startDate: string;
  durationWorkdays: number;
};

/**
 * THE REPRESENTATIVE DATA DATE.
 *
 * Fixed in fixture data, never `new Date()`. The schedule runs into late 2027;
 * binding the marker to the real clock would put it far left of every bar today
 * and would keep drifting, making a static demonstration incoherent within
 * months.
 *
 * 2026-11-26 places the project EARLY in its own lifecycle, which is the point:
 * almost everything this board exists to show is still ahead of the line.
 * Four packages are in flight - the permit in corrections, concrete in
 * structural review, steel revising its first cycle, and Heritage Steel under
 * first architectural review - and the remaining eleven have not started. That
 * is a procurement schedule as it actually looks when the decisions it depends
 * on can still be influenced, rather than one already committed to its outcome.
 *
 * THIS DATE IS AN OBSERVATION POINT, NOT AN INPUT. Nothing about the schedule
 * is derived FROM it: every phase, Required On-Site date and commitment
 * Required By date comes from the backward pass and is unchanged by moving it.
 * What it drives is only what is TRUE AS OF a moment - step status, which
 * package is current, and whether a commitment has already been settled. Moving
 * the line re-reads the same schedule from a different day; it never rewrites
 * it.
 */
export const DATA_DATE = '2026-11-26';

/* --------------------------------------------------- backward-schedule pass */

/**
 * Resolve one item by walking its sequence BACKWARD from the Required On-Site
 * date. Nothing here is positioned; only dates are produced. Pixels come later,
 * from these dates.
 */
/**
 * The backward pass, as a pure function of (Required On-Site, specs) -> dates.
 *
 * Extracted so the BASELINE can be produced by the very same engine with the
 * original assumptions substituted, rather than by authoring a second set of
 * dates that could drift from it. One engine, two inputs, two outputs; neither
 * output can overwrite the other.
 */
function walkBack(
  requiredOnSiteDate: string,
  specs: StepSpec[],
): { id: string; startDate: string; endDate: string }[] {
  const dates: { id: string; startDate: string; endDate: string }[] = [];
  let cursor = snapBack(parse(requiredOnSiteDate));
  for (let i = specs.length - 1; i >= 0; i--) {
    const sp = specs[i];
    let start: Date;
    let end: Date;
    if (sp.kind === 'milestone') {
      end = new Date(cursor);
      start = new Date(cursor);
      cursor = subWorkdays(cursor, Math.max(1, sp.gap ?? 1));
    } else {
      const d = Math.max(1, sp.days ?? 1);
      end = new Date(cursor);
      start = subWorkdays(end, d - 1);
      cursor = subWorkdays(start, Math.max(1, sp.gap ?? 1));
    }
    dates.unshift({ id: sp.id, startDate: iso(start), endDate: iso(end) });
  }
  return dates;
}

export function buildItem(
  id: string,
  name: string,
  category: string,
  requiredOnSiteDate: string,
  specs: StepSpec[],
  commitmentSpecs: CommitmentSpec[] = [],
  risk: RiskSpec = {},
): ScheduleItem {
  const ros = parse(requiredOnSiteDate);
  const out: ScheduleStep[] = [];
  let cursor = snapBack(ros);

  for (let i = specs.length - 1; i >= 0; i--) {
    const s = specs[i];
    let start: Date;
    let end: Date;

    if (s.kind === 'milestone') {
      end = new Date(cursor);
      start = new Date(cursor);
      cursor = subWorkdays(cursor, Math.max(1, s.gap ?? 1));
    } else {
      const d = Math.max(1, s.days ?? 1);
      end = new Date(cursor);
      start = subWorkdays(end, d - 1);
      cursor = subWorkdays(start, Math.max(1, s.gap ?? 1));
    }

    const person = SCHEDULE_PEOPLE[s.owner];
    out.unshift({
      id: s.id,
      scheduleItemId: id,
      kind: s.kind,
      family: s.family,
      name: s.name,
      startDate: iso(start),
      endDate: iso(end),
      durationWorkdays: s.kind === 'milestone' ? 0 : workdaysBetween(start, end),
      status: s.status ?? 'upcoming',
      responsibleOrganizationId: s.org,
      responsibleOrganization: SCHEDULE_ORGS[s.org],
      commitmentOwnerId: s.owner,
      commitmentOwnerName: person.name,
      commitmentOwnerRole: person.role,
      whatIsOwed: s.owed,
      commitmentId: s.commitmentId,
      requiredOnSiteDate,
    });
  }

  // Handoffs: each step points at the next, and names the party receiving it.
  for (let i = 0; i < out.length; i++) {
    const next = out[i + 1];
    if (next) {
      out[i].nextStepId = next.id;
      out[i].nextHandoffLabel = next.name;
      out[i].nextHandoffParty = next.responsibleOrganization;
    }
  }

  // Status, derived from the fixed data date unless the spec overrode it.
  const dd = parse(DATA_DATE);
  for (let i = 0; i < out.length; i++) {
    if (specs[i].status) continue;
    const st = parse(out[i].startDate);
    const en = parse(out[i].endDate);
    out[i].status = en < dd ? 'complete' : st > dd ? 'upcoming' : 'on-track';
  }

  /**
   * COMMITMENTS ARE RESOLVED AFTER THE SCHEDULE, AND ONLY READ IT.
   *
   * This pass runs against the finished `out` array and writes nothing back
   * into it. That is the guarantee the whole feature rests on: adding,
   * removing or re-dating a commitment cannot move a single procurement date.
   * A commitment is a REPORT on the schedule, never an input to it - if a
   * commitment cannot be met, the answer is to renegotiate the commitment or
   * accept the variance, not to silently slide the bar that needed it.
   */
  const byId = new Map(out.map((s) => [s.id, s]));
  const commitments: ScheduleCommitment[] = commitmentSpecs.map((c) => {
    const target = byId.get(c.requiredForStepId);
    if (!target) throw new Error(`${c.id}: requiredForStepId "${c.requiredForStepId}" not in ${id}`);

    // Walk back from the activity this unblocks. That activity's own date came
    // from the backward pass out of Required On-Site, so the chain from field
    // need to decision date is unbroken.
    const requiredBy = iso(subWorkdays(parse(target.startDate), Math.max(0, c.leadDays ?? 0)));
    const committedFor = c.committedFor ?? null;

    // Signed working days between the two independent dates. Positive means
    // the team agreed to a date the schedule cannot absorb.
    //
    // Measured against the ORIGINAL requirement where one exists, for the same
    // reason the completion variance is: once the forecast has re-planned
    // around a slip, `requiredBy` has moved to meet it, and comparing against
    // the moved date would report that everyone was on time.
    let varianceWorkdays: number | null = null;
    if (committedFor) {
      const r = parse(c.baselineRequiredBy ?? requiredBy);
      const f = parse(committedFor);
      varianceWorkdays =
        f >= r ? workdaysBetween(r, f) - 1 : -(workdaysBetween(f, r) - 1);
    }

    const dd = parse(DATA_DATE);
    // Anything the schedule needed before the data date has been resolved one
    // way or another by now; the representative project is not carrying
    // months-overdue selections. The agreed date is what actually happened
    // where one exists, otherwise the required date.
    const settled = parse(requiredBy) < dd;
    const status: CommitmentStatus = settled
      ? 'complete'
      : committedFor == null
        ? 'open'
        : (varianceWorkdays ?? 0) > 0
          ? 'beyond-required'
          : 'committed';

    /**
     * ACTUAL, and the miss measured against the ORIGINAL requirement.
     *
     * `baselineRequiredBy` is the date this was first needed. The current
     * `requiredBy` is re-derived from a forecast that has already absorbed the
     * slip, so measuring against it would report a variance of zero and the
     * miss would vanish. Measuring against the baseline is what makes a missed
     * commitment stay missed once the plan has moved around it.
     */
    const baselineRequiredBy = c.baselineRequiredBy ?? null;
    const completedDate = c.completedOn ?? (settled ? (committedFor ?? requiredBy) : null);
    let completionVarianceWorkdays: number | null = null;
    if (c.completedOn) {
      const owed = parse(baselineRequiredBy ?? requiredBy);
      const done = parse(c.completedOn);
      completionVarianceWorkdays =
        done >= owed ? workdaysBetween(owed, done) - 1 : -(workdaysBetween(done, owed) - 1);
    }

    const person = SCHEDULE_PEOPLE[c.owner];
    return {
      id: c.id,
      scheduleItemId: id,
      name: c.name,
      type: c.type,
      typeLabel: COMMITMENT_TYPE_LABEL[c.type],
      ownerRole: c.ownerRole,
      ownerId: c.owner,
      ownerName: person.name,
      ownerTitle: person.role,
      ownerOrganizationId: c.org,
      ownerOrganization: SCHEDULE_ORGS[c.org],
      requiredBy,
      committedFor,
      varianceWorkdays,
      baselineRequiredBy,
      requiredForStepId: c.requiredForStepId,
      requiredForStepName: target.name,
      status,
      completedDate,
      completionVarianceWorkdays,
      description: c.description,
    };
  });

  /**
   * BASELINE, by re-running the same engine with the original assumptions.
   *
   * Written to its own field. `out` is already final and is never revisited,
   * so a baseline can be added, changed or removed without any forecast date
   * moving - the same read-only guarantee the commitments pass gives.
   */
  let baseline: ScheduleBaseline | null = null;
  if (risk.baselineOverrides?.length) {
    const byStep = new Map(risk.baselineOverrides.map((o) => [o.stepId, o.days]));
    const baseSpecs = specs.map((sp) =>
      byStep.has(sp.id) ? { ...sp, days: byStep.get(sp.id) } : sp,
    );
    const dates = walkBack(requiredOnSiteDate, baseSpecs);
    const stepDates: ScheduleBaseline['stepDates'] = {};
    for (const d of dates) stepDates[d.id] = { startDate: d.startDate, endDate: d.endDate };
    // A shorter original lead time means the path could have STARTED LATER.
    // The gap between the two starts is how far it had to be pulled forward.
    const advanced = workdaysBetween(parse(out[0].startDate), parse(dates[0].startDate)) - 1;
    baseline = {
      startDate: dates[0].startDate,
      pathAdvancedWorkdays: Math.max(0, advanced),
      stepDates,
    };
  }

  /**
   * FORECAST vs REQUIREMENT. The requirement does not move; this is the
   * separate question of whether it will be met. Absent (null) means the
   * forecast satisfies it, which is the normal case for most packages.
   */
  const forecastOnSiteDate = risk.forecastOnSiteDate ?? null;
  const forecastVarianceWorkdays =
    forecastOnSiteDate && forecastOnSiteDate > requiredOnSiteDate
      ? workdaysBetween(parse(requiredOnSiteDate), parse(forecastOnSiteDate)) - 1
      : 0;

  const byCommitmentId = new Map(commitments.map((c) => [c.id, c]));
  const issues: ScheduleIssue[] = (risk.issues ?? []).map((i) => {
    const root = i.rootCommitmentId ? byCommitmentId.get(i.rootCommitmentId) : undefined;
    if (i.rootCommitmentId && !root)
      throw new Error(`${i.id}: rootCommitmentId "${i.rootCommitmentId}" not in ${id}`);
    const leadStep = i.leadStepId ? byId.get(i.leadStepId) : undefined;
    if (i.leadStepId && !leadStep) throw new Error(`${i.id}: leadStepId does not resolve`);
    return {
      id: i.id,
      scheduleItemId: id,
      kind: i.kind,
      kindLabel: ISSUE_KIND_LABEL[i.kind],
      title: i.title,
      identifiedOn: i.identifiedOn,
      cause: i.cause,
      impact: i.impact,
      // Read, not copied: the issue and the commitment can never disagree
      // about when something was required, agreed or delivered.
      rootCommitment: root ?? null,
      baselineLeadWorkdays: i.baselineLeadWorkdays ?? null,
      currentLeadWorkdays: leadStep ? leadStep.durationWorkdays : null,
    };
  });

  // Health is a consequence, not a label. A package is impacted when the
  // forecast overshoots the field requirement, at risk when an exposure has
  // been recorded but the requirement still holds, healthy otherwise.
  const health: PackageHealth =
    forecastVarianceWorkdays > 0 ? 'impacted' : issues.length > 0 ? 'at-risk' : 'healthy';

  const current = out.find((s) => s.status === 'on-track' || s.status === 'at-risk');
  return {
    id,
    name,
    category,
    requiredOnSiteDate,
    steps: out,
    commitments,
    issues,
    baseline,
    forecastOnSiteDate,
    forecastVarianceWorkdays,
    health,
    currentStepId: current?.id,
    startDate: out[0].startDate,
    durationWorkdays: workdaysBetween(parse(out[0].startDate), parse(requiredOnSiteDate)),
  };
}
