// Timeline data — extracted from reality.xml (MS Project export).
// Regenerate by running: node scripts/extract-timeline.mjs
// Then update this file with the relevant task UIDs grouped by section.

export interface TimelineTask {
  uid: number;
  name: string;
  start: string; // ISO date
  finish: string; // ISO date
  durationDays: number; // working days
  isMilestone: boolean;
}

export interface TimelineSchedule {
  id: 'happy' | 'reality' | 'aligned';
  title: string;
  subtitle: string;
  accentColor: 'cyan' | 'red' | 'amber';
  tasks: TimelineTask[];
}

// Time axis bounds — April 2026 through February 2027
export const AXIS_START = '2026-04-01T00:00:00';
export const AXIS_END = '2027-03-01T00:00:00';

// "Happy Path" — the naive schedule
export const happyPath: TimelineSchedule = {
  id: 'happy',
  title: 'Happy Path',
  subtitle: 'The procurement schedule a GC commits to when constraints aren’t fully understood.',
  accentColor: 'cyan',
  tasks: [
    { uid: 3, name: 'Buyout – Submittal – Approval', start: '2026-04-30', finish: '2026-07-08', durationDays: 50, isMilestone: false },
    { uid: 39, name: 'Fabrication Starts Here', start: '2026-07-08', finish: '2026-07-08', durationDays: 0, isMilestone: true },
    { uid: 4, name: 'Fabrication – Delivery', start: '2026-07-09', finish: '2026-09-16', durationDays: 50, isMilestone: false },
    { uid: 6, name: 'Buffer – For Good Measure', start: '2026-09-17', finish: '2026-10-07', durationDays: 15, isMilestone: false },
    { uid: 5, name: 'False Hope Delivery Date', start: '2026-10-07', finish: '2026-10-07', durationDays: 0, isMilestone: true },
  ],
};

// "What Really Happens" — what unfolds when a GC commits to the Happy Path
export const whatReallyHappens: TimelineSchedule = {
  id: 'reality',
  title: 'What Really Happens',
  subtitle: 'When a GC commits to the Happy Path. Compressing procurement logic doesn’t compress reality.',
  accentColor: 'red',
  tasks: [
    { uid: 14, name: 'Issue Contract/PO', start: '2026-04-30', finish: '2026-05-27', durationDays: 20, isMilestone: false },
    { uid: 15, name: 'Steel Contractor Has Questions', start: '2026-05-27', finish: '2026-05-27', durationDays: 0, isMilestone: true },
    { uid: 36, name: 'Forced Shop Drawing Start – Have to Push to Meet Deadlines', start: '2026-05-28', finish: '2026-07-08', durationDays: 30, isMilestone: false },
    { uid: 40, name: 'Original Start of Fabrication Date', start: '2026-07-08', finish: '2026-07-08', durationDays: 0, isMilestone: true },
    { uid: 16, name: 'GC Receives Submittal from Trade Partner', start: '2026-07-09', finish: '2026-07-09', durationDays: 1, isMilestone: false },
    { uid: 17, name: 'Expedited GC Review', start: '2026-07-10', finish: '2026-07-10', durationDays: 1, isMilestone: false },
    { uid: 18, name: 'Abbreviated Parallel Multidisciplinary Review', start: '2026-07-20', finish: '2026-07-20', durationDays: 1, isMilestone: false },
    { uid: 19, name: 'GC Submits to Structural Eng. W/ Request to Expedite Review', start: '2026-07-21', finish: '2026-07-21', durationDays: 1, isMilestone: false },
    { uid: 20, name: 'Reviewer/Approver Review', start: '2026-07-22', finish: '2026-08-11', durationDays: 15, isMilestone: false },
    { uid: 21, name: 'Revise & Resubmit Response', start: '2026-08-12', finish: '2026-08-12', durationDays: 1, isMilestone: false },
    { uid: 22, name: 'Steel Contractor Starts Revisions', start: '2026-08-13', finish: '2026-08-17', durationDays: 3, isMilestone: false },
    { uid: 38, name: 'Design Questions Pile Up', start: '2026-08-18', finish: '2026-09-09', durationDays: 17, isMilestone: false },
    { uid: 23, name: 'Steel Contractor Pushes to Finalize Submittal', start: '2026-09-10', finish: '2026-10-07', durationDays: 20, isMilestone: false },
    { uid: 41, name: 'Original Steel Onsite Date', start: '2026-10-07', finish: '2026-10-07', durationDays: 0, isMilestone: true },
    { uid: 24, name: 'GC Resubmits to Reviewer/Approver', start: '2026-10-08', finish: '2026-10-08', durationDays: 1, isMilestone: false },
    { uid: 25, name: 'REV 1 Reviewer/Approver Review', start: '2026-10-09', finish: '2026-10-22', durationDays: 10, isMilestone: false },
    { uid: 26, name: 'REV 1 Submittal – Revise & Resubmit', start: '2026-10-23', finish: '2026-10-23', durationDays: 1, isMilestone: false },
    { uid: 27, name: 'Submitter Preps REV 2 Submittal', start: '2026-10-26', finish: '2026-11-06', durationDays: 10, isMilestone: false },
    { uid: 29, name: 'GC Resubmits to Reviewer/Approver', start: '2026-11-09', finish: '2026-11-09', durationDays: 1, isMilestone: false },
    { uid: 30, name: 'REV 2 Reviewer/Approver Review', start: '2026-11-10', finish: '2026-11-18', durationDays: 7, isMilestone: false },
    { uid: 31, name: 'REV 2 Submittal – Approved', start: '2026-11-19', finish: '2026-11-19', durationDays: 1, isMilestone: false },
    { uid: 32, name: 'Procurement Authorized', start: '2026-11-20', finish: '2026-11-20', durationDays: 1, isMilestone: false },
    { uid: 33, name: 'Material/Product & Fabrication Lead-Time', start: '2026-11-23', finish: '2027-01-22', durationDays: 45, isMilestone: false },
    { uid: 34, name: 'Trucking/Shipping', start: '2027-01-25', finish: '2027-01-29', durationDays: 5, isMilestone: false },
    { uid: 35, name: 'Material/Product Arrives Onsite', start: '2027-01-29', finish: '2027-01-29', durationDays: 0, isMilestone: true },
  ],
};

// "What Should Happen" — the same procurement, planned to match reality
export const whatShouldHappen: TimelineSchedule = {
  id: 'aligned',
  title: 'What Should Happen',
  subtitle: 'The same procurement, planned to match reality. Predictable. On-time per the proper sequence.',
  accentColor: 'amber',
  tasks: [
    { uid: 51, name: 'Commitment Buyout', start: '2026-04-30', finish: '2026-05-27', durationDays: 20, isMilestone: false },
    { uid: 52, name: 'Submittal Prep – Trade Partner and GC Working Together to Develop Submittal Information', start: '2026-05-28', finish: '2026-07-29', durationDays: 45, isMilestone: false },
    { uid: 53, name: 'GC Receives Submittal from Trade Partner', start: '2026-07-30', finish: '2026-07-30', durationDays: 1, isMilestone: false },
    { uid: 54, name: 'GC Submittal Review for Compliance', start: '2026-07-31', finish: '2026-08-10', durationDays: 7, isMilestone: false },
    { uid: 55, name: 'Parallel, Multidisciplinary Review', start: '2026-08-07', finish: '2026-08-17', durationDays: 7, isMilestone: false },
    { uid: 56, name: 'GC Submits to Reviewer/Approver', start: '2026-08-18', finish: '2026-08-18', durationDays: 1, isMilestone: false },
    { uid: 57, name: 'Reviewer/Approver Review', start: '2026-08-19', finish: '2026-09-08', durationDays: 15, isMilestone: false },
    { uid: 58, name: 'Revise & Resubmit Response', start: '2026-09-09', finish: '2026-09-09', durationDays: 1, isMilestone: false },
    { uid: 59, name: 'Submitter Revisions', start: '2026-09-10', finish: '2026-09-30', durationDays: 15, isMilestone: false },
    { uid: 60, name: 'Trade Partner Resubmits to GC', start: '2026-10-01', finish: '2026-10-01', durationDays: 1, isMilestone: false },
    { uid: 61, name: 'GC Resubmits to Reviewer/Approver', start: '2026-10-02', finish: '2026-10-02', durationDays: 1, isMilestone: false },
    { uid: 62, name: 'REV 1 Reviewer/Approver Review', start: '2026-10-05', finish: '2026-10-16', durationDays: 10, isMilestone: false },
    { uid: 63, name: 'REV 1 Submittal – Revise & Resubmit', start: '2026-10-19', finish: '2026-10-19', durationDays: 1, isMilestone: false },
    { uid: 64, name: 'Submitter Preps REV 2 Submittal', start: '2026-10-20', finish: '2026-11-02', durationDays: 10, isMilestone: false },
    { uid: 65, name: 'Trade Partner Submits REV 2 to GC', start: '2026-11-03', finish: '2026-11-03', durationDays: 1, isMilestone: false },
    { uid: 66, name: 'GC Resubmits to Reviewer/Approver', start: '2026-11-04', finish: '2026-11-04', durationDays: 1, isMilestone: false },
    { uid: 67, name: 'REV 2 Reviewer/Approver Review', start: '2026-11-05', finish: '2026-11-13', durationDays: 7, isMilestone: false },
    { uid: 68, name: 'REV 2 Submittal – Approved', start: '2026-11-16', finish: '2026-11-16', durationDays: 1, isMilestone: false },
    { uid: 69, name: 'Procurement Authorized', start: '2026-11-17', finish: '2026-11-17', durationDays: 1, isMilestone: false },
    { uid: 70, name: 'Material/Product & Fabrication Lead-Time', start: '2026-11-18', finish: '2027-01-19', durationDays: 45, isMilestone: false },
    { uid: 71, name: 'Trucking/Shipping', start: '2027-01-20', finish: '2027-02-02', durationDays: 10, isMilestone: false },
    { uid: 72, name: 'Material/Product Arrives Onsite', start: '2027-02-02', finish: '2027-02-02', durationDays: 0, isMilestone: true },
  ],
};

export const allSchedules: TimelineSchedule[] = [happyPath, whatReallyHappens, whatShouldHappen];
