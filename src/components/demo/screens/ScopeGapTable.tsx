import { MoreHorizontal } from 'lucide-react';
import {
  COLUMNS,
  GAP_TYPE_LABEL,
  IMPACT_LABEL,
  ROWS,
  SELECTED_ROW,
  isUrgent,
  type GapRow,
} from '../fixtures/scopeGapAnalysis';

/**
 * The Scope Gap Analysis table.
 *
 * GEOMETRY IS MEASURED from `assets-src/methodology/scope-gap-analysis.png`:
 * the table spans x215-1141 and starts at y438; the header is 43px; the
 * selected row carries a 4px bar and the tint. Cell text starts 12px inside
 * its column, as in the Product Register.
 *
 * TWO THINGS DIFFER FROM THE PRODUCT REGISTER'S TABLE, and both are the
 * master's, not a preference:
 *
 * 1. THERE ARE NO VERTICAL COLUMN RULES. The master draws the outer box and
 *    the row rules and nothing else; column position is carried entirely by
 *    the alignment of the text. Verified by pixel scan across every body row
 *    - the same scan finds all nine of the Product Register's rules - so this
 *    is an absence in the design, not a faint line lost to rasterisation.
 * 2. GAP TYPE AND IMPACT ARE COLOURED TEXT, not status badges. So
 *    DemoStatusBadge is deliberately not used here; forcing it on would put a
 *    filled pill where the master has a word.
 *
 * ROW PITCH IS THE ONE DELIBERATE DEPARTURE. The master shows 8 rows on a
 * hand-set 58-74px pitch; this table shows 15 on a uniform 35px pitch, which
 * is what fitting 15 rows into the same 1086px canvas costs. The cells still
 * run to two lines - the information architecture is unchanged - on a 14px
 * leading rather than the master's 19px. Nothing else about the table moves:
 * the box, the column boundaries, the type sizes, the weights and the colours
 * are all as measured.
 */

/** Cell text starts 12px inside the column edge. */
const CELL_PAD = 12;

/**
 * Body type: one size, weight carries the hierarchy (measured at 3x).
 *
 * 10.6 rather than the 11 the master's set widths solve to. At 11 two Gap
 * Titles break to a third line - "Attachment responsibility between steel and
 * glazing open", which the master itself sets on three lines in its 74px row,
 * and one of the added rows - and a third line does not fit a 35px row. The
 * whole table steps down together rather than one column stepping down alone.
 */
const BODY = 10.6;
/** Two-line cells. The master's 19px leading, closed up to fit 15 rows. */
const LEADING = '14px';

const TYPE_COLOR: Record<GapRow['type'], string> = {
  definition: 'var(--jpd-gap-warn)',
  responsibility: 'var(--jpd-gap-warn)',
  interface: 'var(--jpd-gap-error)',
  validated: 'var(--jpd-gap-ok)',
};

const IMPACT_COLOR: Record<GapRow['impact'], string> = {
  high: 'var(--jpd-gap-error)',
  medium: 'var(--jpd-gap-warn)',
  low: 'var(--jpd-gap-ok)',
};

function Cell({
  w,
  children,
  align,
}: {
  w: number;
  children: React.ReactNode;
  align?: 'center';
}) {
  return (
    <div
      className="flex shrink-0 items-center"
      style={{
        width: w,
        paddingLeft: align === 'center' ? 0 : CELL_PAD,
        paddingRight: align === 'center' ? 0 : 6,
        justifyContent: align === 'center' ? 'center' : undefined,
        color: 'var(--jpd-text-body)',
        lineHeight: LEADING,
      }}
    >
      {children}
    </div>
  );
}

export default function ScopeGapTable() {
  return (
    <div
      style={{
        width: 927,
        border: '1px solid var(--jpd-border)',
        borderRadius: 6,
        overflow: 'hidden',
        background: 'var(--jpd-surface)',
      }}
    >
      <div className="flex" style={{ height: 43, background: 'var(--jpd-surface-header)' }}>
        {COLUMNS.map((c) => (
          <div
            key={c.key}
            className="flex shrink-0 items-center"
            style={{
              width: c.width,
              paddingLeft: c.key === 'action' ? 0 : CELL_PAD,
              justifyContent: c.key === 'action' ? 'center' : undefined,
              fontSize: BODY,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
              color: 'var(--jpd-text-strong)',
            }}
          >
            {c.label}
          </div>
        ))}
      </div>

      {ROWS.map((row, ri) => {
        const selected = ri === SELECTED_ROW;
        const urgent = isUrgent(row);
        return (
          <div
            key={row.scope}
            className="relative flex"
            style={{
              height: 35,
              background: selected ? 'var(--jpd-row-tint)' : 'transparent',
              /* Every row, the first included: the master rules the header
                 off from the body at y482. */
              borderTop: '1px solid var(--jpd-divider)',
            }}
          >
            {selected && (
              <span
                className="absolute"
                style={{ left: 0, top: 0, bottom: 0, width: 4, background: 'var(--jpd-row-bar)' }}
              />
            )}

            <Cell w={COLUMNS[0].width}>
              <span style={{ fontSize: BODY, fontWeight: 700, color: 'var(--jpd-text-strong)' }}>
                {row.scope}
              </span>
            </Cell>

            <Cell w={COLUMNS[1].width}>
              <span style={{ fontSize: BODY, fontWeight: 700, whiteSpace: 'nowrap', color: TYPE_COLOR[row.type] }}>
                {GAP_TYPE_LABEL[row.type]}
              </span>
            </Cell>

            <Cell w={COLUMNS[2].width}>
              <span style={{ fontSize: BODY, color: 'var(--jpd-text-strong)' }}>{row.title}</span>
            </Cell>

            <Cell w={COLUMNS[3].width}>
              <span style={{ fontSize: BODY, color: 'var(--jpd-text-strong)' }}>
                {row.description}
              </span>
            </Cell>

            <Cell w={COLUMNS[4].width}>
              <span style={{ fontSize: BODY, color: 'var(--jpd-text-strong)' }}>
                {row.responsibleParty}
              </span>
            </Cell>

            <Cell w={COLUMNS[5].width}>
              <span
                style={{
                  fontSize: BODY,
                  fontWeight: urgent ? 700 : 400,
                  color: urgent ? 'var(--jpd-gap-error)' : 'var(--jpd-text-strong)',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.requiredBy}
              </span>
            </Cell>

            <Cell w={COLUMNS[6].width}>
              <span style={{ fontSize: BODY, fontWeight: 700, color: IMPACT_COLOR[row.impact] }}>
                {IMPACT_LABEL[row.impact]}
              </span>
            </Cell>

            {/* The row action: a 30x25 bordered button centred in its column. */}
            <Cell w={COLUMNS[7].width} align="center">
              <span
                className="flex items-center justify-center"
                style={{
                  width: 30,
                  height: 25,
                  border: '1px solid var(--jpd-border)',
                  borderRadius: 6,
                  background: 'var(--jpd-surface)',
                }}
              >
                <MoreHorizontal size={14} strokeWidth={2} color="var(--jpd-text-strong)" />
              </span>
            </Cell>
          </div>
        );
      })}
    </div>
  );
}
