import { AlertCircle, Check, HelpCircle } from 'lucide-react';

/**
 * The status badge. The second element the approved screen genuinely reuses:
 * once per table row and once in the detail panel, identical in both.
 *
 * A rounded rectangle, NOT a pill - measured 25px tall with a ~5px radius. The
 * tones stay semantically distinct and are never collapsed onto the brand
 * accent.
 *
 * The Commitment Register's three statuses are the original set and render
 * exactly as they did. The Product Register adds four (approved, pending,
 * long-lead, tbd) on the same geometry: the ok, warn and neutral tones, with
 * the master's own marks - a check, a dot, a small diamond, a question mark.
 */
export type DemoStatus =
  | 'on-track'
  | 'at-risk'
  | 'overdue'
  | 'approved'
  | 'pending'
  | 'long-lead'
  | 'tbd';

export const STATUS_LABEL: Record<DemoStatus, string> = {
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  overdue: 'Overdue',
  approved: 'Approved',
  pending: 'Pending',
  'long-lead': 'Long Lead',
  tbd: 'TBD',
};

const OK = { bg: 'var(--jpd-ok-bg)', bd: 'var(--jpd-ok-border)', fg: 'var(--jpd-ok-fg)' } as const;
const WARN = { bg: 'var(--jpd-warn-bg)', bd: 'var(--jpd-warn-border)', fg: 'var(--jpd-warn-fg)' } as const;
const ERROR = { bg: 'var(--jpd-error-bg)', bd: 'var(--jpd-error-border)', fg: 'var(--jpd-error-fg)' } as const;
const NEUTRAL = { bg: 'var(--jpd-neutral-bg)', bd: 'var(--jpd-border)', fg: 'var(--jpd-text-strong)' } as const;

const TONE: Record<DemoStatus, { bg: string; bd: string; fg: string }> = {
  'on-track': OK,
  'at-risk': WARN,
  overdue: ERROR,
  approved: OK,
  pending: WARN,
  'long-lead': WARN,
  tbd: NEUTRAL,
};

function Mark({ status }: { status: DemoStatus }) {
  switch (status) {
    case 'on-track':
    case 'approved':
      return <Check size={11} strokeWidth={3} />;
    case 'overdue':
      return <AlertCircle size={11} strokeWidth={2.5} />;
    case 'long-lead':
      return (
        <span
          style={{
            width: 6,
            height: 6,
            transform: 'rotate(45deg)',
            background: 'var(--jpd-warn-dot)',
            display: 'block',
          }}
        />
      );
    case 'tbd':
      return <HelpCircle size={11} strokeWidth={2.25} />;
    default:
      return (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: 'var(--jpd-warn-dot)',
            display: 'block',
          }}
        />
      );
  }
}

export default function DemoStatusBadge({ status }: { status: DemoStatus }) {
  const tone = TONE[status];

  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: 4,
        height: 25,
        padding: '0 8px',
        borderRadius: 5,
        background: tone.bg,
        border: `1px solid ${tone.bd}`,
        color: tone.fg,
        fontSize: 11,
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <Mark status={status} />
      {STATUS_LABEL[status]}
    </span>
  );
}
