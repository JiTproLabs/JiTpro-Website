/**
 * THE PROCUREMENT CHAIN DEMONSTRATION SCENARIO - Custom Steel Windows and
 * Doors (Design System Section 51.2). REPRESENTATIVE DATA.
 *
 * Deliberately separate from the shared schedule fixture: the Heritage Steel
 * item there feeds the full Procurement Schedule, the product register, the
 * schedule lab and the homepage comparison, and must not move under them.
 *
 * EVERY DATE IS CALCULATED. The only authored date is the fixed Required On
 * Site date. Activity dates come from the existing backward pass; commitment
 * required-by dates come from the activities they unblock. The representative
 * agreed and actual dates are authored as WORKING-DAY OFFSETS from the
 * required-by dates the engine derives, so moving the Required On Site date
 * moves the whole demonstration and every story keeps its shape - a selection
 * provided six working days late stays six working days late.
 *
 * This applies to representative demonstration data only. Real project
 * actuals are recorded facts and are never derived this way.
 *
 * No second engine: the scenario is built by the existing `buildItem()`
 * twice - once to read the derived requirements, once with the offsets
 * applied. Nothing here schedules anything.
 */

import { buildItem, type CommitmentSpec, type IssueSpec, type ScheduleItem, type StepSpec } from '../procurement-schedule/scheduleModel';
import { addWorkdays, iso, parse } from '../procurement-schedule/workCalendar';

export const CHAIN_ITEM_ID = 'chain-steel-windows';
export const CHAIN_ITEM_NAME = 'Custom Steel Windows and Doors';

/** The fixed controlling deadline for this demonstration (approved 2026-11-07). */
export const CHAIN_REQUIRED_ON_SITE = '2027-11-30';

const P = (id: string, name: string, family: StepSpec['family'], days: number, org: StepSpec['org'], owner: StepSpec['owner'], owed: string): StepSpec =>
  ({ id, name, family, kind: 'phase', days, org, owner, owed });
const M = (id: string, name: string, family: StepSpec['family'], org: StepSpec['org'], owner: StepSpec['owner'], owed: string): StepSpec =>
  ({ id, name, family, kind: 'milestone', org, owner, owed });

/**
 * The approved sequence (Section 51.2): 312 working days of activity and six
 * zero-duration finish milestones. Review and revision cycles shorten as
 * issues are resolved (15/12, then 10/7, then a 5-day final review; revised
 * 2026-11-07). The full names are the record; the chain
 * may show the shorter authored labels below where space is limited.
 */
export const CHAIN_STEPS: StepSpec[] = [
  P('swd-1', 'Buyout', 'buyout', 20, 'gc', 'AW',
    'Scope, negotiate and award the custom steel window and door package.'),
  P('swd-2', 'Submittal Coordination', 'coordination', 25, 'heritage', 'PN',
    'Coordinate opening sizes, sightlines, thermal performance and structural attachment with the design team.'),
  P('swd-3', 'Submittal Preparation', 'preparation', 30, 'heritage', 'PN',
    'Produce elevation, section and jamb detail shop drawings for every opening.'),
  M('swd-4', 'Initial Submittal', 'preparation', 'heritage', 'PN',
    'Transmit the complete steel window and door shop drawing package.'),
  P('swd-5', 'First Submittal Review', 'review', 15, 'architect', 'JS',
    'Review sightlines, profiles and detailing against the design intent and return comments.'),
  P('swd-6', 'First Revision Cycle', 'revision', 12, 'heritage', 'PN',
    'Revise the shop drawings to resolve first-cycle comments.'),
  M('swd-7', 'First Resubmittal', 'revision', 'heritage', 'PN',
    'Return the first revised package with a response to each comment.'),
  P('swd-8', 'Second Submittal Review', 'review', 10, 'architect', 'JS',
    'Review the revised shop drawings and return any remaining coordinated comments.'),
  P('swd-9', 'Second Revision Cycle', 'revision', 7, 'heritage', 'PN',
    'Resolve the remaining second-cycle comments on jamb and head conditions.'),
  M('swd-10', 'Second Resubmittal', 'revision', 'heritage', 'PN',
    'Return the second revised package for final review.'),
  P('swd-11', 'Third Submittal Review', 'review', 5, 'architect', 'JS',
    'Confirm every comment is resolved and the package is ready for approval.'),
  M('swd-12', 'Final Approval', 'approval', 'architect', 'JS',
    'Approve the steel window and door shop drawings.'),
  M('swd-13', 'Release for Fabrication', 'approval', 'gc', 'DB',
    'Release the approved package and authorise fabrication.'),
  P('swd-14', 'Fabrication', 'production', 180, 'heritage', 'PN',
    'Fabricate, glaze and finish every custom steel window and door unit.'),
  P('swd-15', 'Shipping and Delivery', 'logistics', 8, 'logistics', 'CB',
    'Crate, transport and deliver the finished units to the site.'),
  M('swd-16', 'Required On Site', 'required', 'gc', 'MO',
    'Windows and doors on site so the building can be closed in.'),
];

/**
 * AUTHORED DISPLAY LABELS. Shorter names the chain may show where space is
 * limited (approved 2026-11-07). Authored here, never invented by the
 * renderer; the full names above remain in the inspector and in every
 * accessible description.
 */
export const CHAIN_LABELS: Record<string, string> = {
  'swd-1': 'Buyout',
  'swd-2': 'Submittal Coordination',
  'swd-3': 'Submittal Preparation',
  'swd-4': 'Initial Submittal',
  'swd-5': 'Review 1',
  'swd-6': 'Revision 1',
  'swd-7': 'Resubmittal 1',
  'swd-8': 'Review 2',
  'swd-9': 'Revision 2',
  'swd-10': 'Resubmittal 2',
  'swd-11': 'Review 3',
  'swd-12': 'Final Approval',
  'swd-13': 'Release for Fabrication',
  'swd-14': 'Fabrication',
  'swd-15': 'Shipping & Delivery',
  'swd-16': 'Required On Site',
};

/**
 * COMMITMENTS. External dependencies the chain cannot proceed without. Each
 * names what is required, who owes it, and the activity it unblocks; the
 * required-by date is DERIVED from that activity, never authored.
 *
 * A subcontractor submittal-package commitment is not included: the
 * commitment model defines a commitment as an obligation outside the General
 * Contractor's control and its owner roles are the design team, the Owner
 * and consultants. The submittal package is the chain's own Initial
 * Submittal milestone.
 */
const BASE_COMMITMENTS: CommitmentSpec[] = [
  {
    id: 'swd-c1', name: 'Final Window & Door Design', type: 'design',
    ownerRole: 'Architect', owner: 'JS', org: 'architect', requiredForStepId: 'swd-2',
    description: 'Fix opening sizes, sightlines and profiles so submittal coordination can proceed against them.',
  },
  {
    id: 'swd-c2', name: 'Frame Finish & Color Selection', type: 'selection',
    ownerRole: 'Owner', owner: 'EM', org: 'owner', requiredForStepId: 'swd-3',
    description: 'Select the frame finish and color the shop drawings and the fabrication order are prepared against.',
  },
  {
    // 'design', not 'selection': the model labels every selection an "Owner
    // Selection", and this one is owed by the Architect.
    id: 'swd-c3', name: 'Final Glazing Selection', type: 'design',
    ownerRole: 'Architect', owner: 'JS', org: 'architect', requiredForStepId: 'swd-6',
    description: 'Confirm the glazing make-up, coating and performance so the first revision cycle can incorporate it.',
  },
];

/**
 * THE REPRESENTATIVE STORY, as working-day offsets from derived requirements.
 *   swd-c2  agreed for the day it was required; provided six working days
 *           late. The issue below is identified the day it arrives.
 *   swd-c3  agreed for four working days after the date the chain needs it -
 *           a variance visible months before it bites.
 */
const FINISH_SELECTION_DAYS_LATE = 6;
const GLAZING_COMMITTED_DAYS_LATE = 4;

/**
 * Build the demonstration for any Required On Site date. The default is the
 * approved demonstration date; the lab passes others to prove that every
 * date follows the anchor.
 */
export function buildSteelWindowsChain(requiredOnSiteDate: string = CHAIN_REQUIRED_ON_SITE): ScheduleItem {
  // Pass 1: let the engine derive each commitment's required-by date.
  const draft = buildItem(CHAIN_ITEM_ID, CHAIN_ITEM_NAME, 'Exterior Enclosure', requiredOnSiteDate, CHAIN_STEPS, BASE_COMMITMENTS);
  const requiredBy = (id: string) => parse(draft.commitments.find((c) => c.id === id)!.requiredBy);
  const offset = (id: string, days: number) => iso(addWorkdays(requiredBy(id), days));

  const finishProvided = offset('swd-c2', FINISH_SELECTION_DAYS_LATE);
  const commitments: CommitmentSpec[] = BASE_COMMITMENTS.map((c) => {
    if (c.id === 'swd-c2') return { ...c, committedFor: offset('swd-c2', 0), completedOn: finishProvided };
    if (c.id === 'swd-c3') return { ...c, committedFor: offset('swd-c3', GLAZING_COMMITTED_DAYS_LATE) };
    return c;
  });

  const issues: IssueSpec[] = [
    {
      id: 'swd-i1',
      kind: 'missed-commitment',
      title: 'Frame Finish Selection Received Late',
      identifiedOn: finishProvided,
      cause: 'The Owner provided the frame finish and color selection after the date it was agreed and required.',
      impact: 'Submittal preparation began with the finish unconfirmed, and finish details had to be absorbed within the planned preparation time.',
      rootCommitmentId: 'swd-c2',
    },
  ];

  // Pass 2: the same engine, with the representative offsets applied.
  return buildItem(CHAIN_ITEM_ID, CHAIN_ITEM_NAME, 'Exterior Enclosure', requiredOnSiteDate, CHAIN_STEPS, commitments, { issues });
}
