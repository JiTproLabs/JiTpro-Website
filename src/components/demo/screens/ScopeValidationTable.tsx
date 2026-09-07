import DemoStatusBadge from '../primitives/DemoStatusBadge';
import { COLUMNS, ROWS, ROW_HEIGHTS, SELECTED_ROW } from '../fixtures/scopeValidation';

/**
 * The Scope Validation table.
 *
 * GEOMETRY IS MEASURED from `assets-src/methodology/scope-validation.png`:
 * the table spans x223-1081 and y527-992; the header is 41px; the nine column
 * rules sit at x301, 443, 508, 611, 692, 750, 876 and 989; the row rules sit
 * at y622, 677, 730, 782, 835, 887, 939 and 992, which is why the rows carry
 * individual heights rather than one pitch.
 *
 * THE RULE AT x692 IS THE ONE CORRECTION. The master draws seven of its eight
 * column rules and omits the one between Drawings and Specs - pure white in
 * every body row, confirmed by pixel scan. Seven-of-eight reads as a defect
 * rather than as a convention (contrast the Scope Gap Analysis table, which
 * draws none of them and is reproduced that way), so the eighth is drawn.
 *
 * VALIDATION STATUS IS THE SHARED BADGE. This master measures it at the same
 * 25px height and the same ok/warn/error fills the Commitment Register was
 * approved with, so DemoStatusBadge carries it with four added statuses and
 * no change to the primitive's geometry or to any existing status.
 *
 * EIGHT ROWS, NOT FIFTEEN. The Scope Gap Analysis carries fifteen because its
 * rows are text; these rows carry a 25px badge, which sets a floor of roughly
 * 40px per row. Fifteen would need 29px and the badge would not fit.
 */

/** Cell text starts 9px inside the column edge (measured 9-14 across nine). */
const CELL_PAD = 9;
/**
 * 10.2, set by the widest cell rather than by the average. The master keeps
 * every cell on ONE line - confirmed by ink-row scan across all eight rows -
 * and its narrower face fits "Exterior Window Assemblies" in 123px where
 * Inter Tight needs 139 at 11px. 10.2 is the largest size at which the Scope
 * Description column still holds its widest value on one line.
 */
const BODY = 10.2;
/** The master sizes its badges to a common minimum: its Partial measures 80,
    the same as its Validated. */
const BADGE_MIN_W = 80;

function Cell({ w, children, first }: { w: number; children: React.ReactNode; first?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center"
      style={{
        width: w,
        paddingLeft: CELL_PAD,
        paddingRight: 2,
        borderLeft: first ? 'none' : '1px solid var(--jpd-border)',
        color: 'var(--jpd-text-body)',
        lineHeight: '15px',
      }}
    >
      {children}
    </div>
  );
}

export default function ScopeValidationTable() {
  return (
    <div
      style={{
        width: 859,
        border: '1px solid var(--jpd-border)',
        borderRadius: 6,
        overflow: 'hidden',
        background: 'var(--jpd-surface)',
      }}
    >
      <div className="flex" style={{ height: 41, background: 'var(--jpd-surface-header)' }}>
        {COLUMNS.map((c, i) => (
          <div
            key={c.key}
            className="flex shrink-0 items-center"
            style={{
              width: c.width,
              paddingLeft: CELL_PAD,
              paddingRight: 2,
              fontSize: 10,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
              color: 'var(--jpd-text-strong)',
              borderLeft: i === 0 ? 'none' : '1px solid var(--jpd-border)',
            }}
          >
            {c.label}
          </div>
        ))}
      </div>

      {ROWS.map((row, ri) => {
        const selected = ri === SELECTED_ROW;
        return (
          <div
            key={row.id}
            className="relative flex"
            style={{
              height: ROW_HEIGHTS[ri],
              background: selected ? 'var(--jpd-row-tint)' : 'transparent',
              /* Every row, the first included: the master rules the header
                 off from the body at y568. */
              borderTop: '1px solid var(--jpd-divider)',
            }}
          >
            {selected && (
              <span
                className="absolute"
                style={{ left: 0, top: 0, bottom: 0, width: 4, background: 'var(--jpd-row-bar)' }}
              />
            )}

            <Cell w={COLUMNS[0].width} first>
              <span style={{ fontSize: BODY, color: 'var(--jpd-text-secondary)' }}>{row.id}</span>
            </Cell>

            <Cell w={COLUMNS[1].width}>
              <span style={{ fontSize: BODY, fontWeight: 600, color: 'var(--jpd-text-strong)' }}>
                {row.description}
              </span>
            </Cell>

            <Cell w={COLUMNS[2].width}>
              <span style={{ fontSize: BODY, display: 'block' }}>{row.discipline}</span>
            </Cell>

            <Cell w={COLUMNS[3].width}>
              <DemoStatusBadge status={row.status} minWidth={BADGE_MIN_W} />
            </Cell>

            <Cell w={COLUMNS[4].width}>
              <span style={{ fontSize: BODY, display: 'block' }}>{row.drawings}</span>
            </Cell>

            <Cell w={COLUMNS[5].width}>
              <span style={{ fontSize: BODY }}>{row.specs}</span>
            </Cell>

            <Cell w={COLUMNS[6].width}>
              <span style={{ fontSize: BODY, display: 'block' }}>{row.contract}</span>
            </Cell>

            <Cell w={COLUMNS[7].width}>
              <span style={{ fontSize: BODY, display: 'block' }}>{row.communications}</span>
            </Cell>

            <Cell w={COLUMNS[8].width}>
              <span style={{ fontSize: BODY, whiteSpace: 'nowrap' }}>{row.lastValidated}</span>
            </Cell>
          </div>
        );
      })}
    </div>
  );
}
