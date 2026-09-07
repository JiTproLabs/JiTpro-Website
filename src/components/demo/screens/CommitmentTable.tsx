import { MoreHorizontal } from 'lucide-react';
import DemoAvatar from '../primitives/DemoAvatar';
import DemoStatusBadge from '../primitives/DemoStatusBadge';
import { COLUMNS, ROWS } from '../fixtures/commitmentRegister';

/**
 * The Commitment Register table. Part of the approved Visual Master v1.
 *
 * GEOMETRY IS MEASURED, AND THE MEASUREMENT WAS WRONG BEFORE. Ink-band analysis
 * of all eight reference rows (x419-563) gives an almost invariant result:
 *
 *   line 1 (title)        ink at row top + 16
 *   line 2 (description)  ink at row top + 34
 *   line 3 (description)  ink at row top + 51
 *   last ink bottom       row top + 60, leaving 8px before the divider
 *
 * That is ONE UNIFORM 17.5px LINE PITCH across all three lines, not a title
 * with its own leading followed by a separately-led description block. The
 * earlier build used 14px/13px type with mixed leading and a 3px gap, which
 * overflowed the 68.25px row, wrapped descriptions onto a third line, and
 * collided with the row below. Type size here is derived from the measured ink
 * WIDTHS of known strings (title "Interior Door Hardware" = 106px,
 * description "Approve interior and exterior" = 120px), not guessed.
 *
 * The pitch is set once on the cell and inherited, so the title and both
 * description lines sit on the same rhythm by construction and cannot drift
 * apart if a size is later adjusted.
 */

const ROW_H = 68.25;
const LINE = 17.5;
/** Cell text starts 11px inside the column edge (measured 429 in a 418 column). */
const CELL_PAD = 11;

function Cell({
  w,
  children,
  first,
  top,
}: {
  w: number;
  children: React.ReactNode;
  first?: boolean;
  top?: boolean;
}) {
  return (
    <div
      className="flex shrink-0"
      style={{
        width: w,
        paddingLeft: CELL_PAD,
        paddingRight: 5,
        alignItems: top ? 'flex-start' : 'center',
        /* 16 = measured ink top; 4.93 = Inter's cap offset inside a 17.5px
           line box at 10.5px. Recomputed if the face or size changes. */
        paddingTop: top ? 11 : 0,
        borderLeft: first ? 'none' : '1px solid var(--jpd-border)',
        color: 'var(--jpd-text-body)',
        lineHeight: `${LINE}px`,
      }}
    >
      <span style={{ width: '100%' }}>{children}</span>
    </div>
  );
}

export default function CommitmentTable() {
  return (
    <div style={{ border: '1px solid var(--jpd-border)', borderRadius: 6, overflow: 'hidden' }}>
      <div className="flex" style={{ height: 40, background: 'var(--jpd-surface-header)' }}>
        {COLUMNS.map((c, i) => (
          <div
            key={c.key}
            className="flex shrink-0 items-center"
            style={{
              width: c.width,
              paddingLeft: CELL_PAD,
              /* 1, not 4: the reference runs "Commitment Date" ink to x961 in
                 a column ending at x963, so the header row has almost no right
                 padding. At 4 that label overflowed its own cell. */
              paddingRight: 1,
              /* 9.6px, not 11.5. Reference header ink widths are 70px
                 ("Commitment ID"), 81px ("Commitment Type") and 79px
                 ("Commitment Date"), and EVERY header is a single line. At
                 11.5px those three wrapped to two lines inside the 40px header
                 row, which the reference never does. `nowrap` makes that
                 failure mode impossible if a label is ever lengthened. */
              fontSize: 9.6,
              fontWeight: 600,
              /* Every reference header is a single line, so nowrap is the
                 default. "Responsible Organization" is the one exception: it
                 is a NEW label with no reference precedent, and it is 8px
                 wider than the column can afford once COM-023's description
                 needs 246px to hold two lines. Letting this one heading wrap
                 to two lines inside the existing 40px header row buys those
                 8px without touching type size, row height, or the supplied
                 copy. Reversible in one line if you would rather I shorten a
                 description instead. */
              whiteSpace: c.key === 'org' ? 'normal' : 'nowrap',
              lineHeight: c.key === 'org' ? '11.5px' : 1.2,
              color: 'var(--jpd-text-strong)',
              borderLeft: i === 0 ? 'none' : '1px solid var(--jpd-border)',
            }}
          >
            {c.label}
          </div>
        ))}
      </div>

      {ROWS.map((row, ri) => {
        const selected = ri === 0;
        return (
          <div
            key={row.id}
            className="relative flex"
            style={{
              height: ROW_H,
              background: selected ? 'var(--jpd-row-tint)' : 'transparent',
              borderTop: ri === 0 ? 'none' : '1px solid var(--jpd-divider)',
            }}
          >
            {selected && (
              <span
                className="absolute"
                style={{ left: 0, top: 0, bottom: 0, width: 4, background: 'var(--jpd-row-bar)' }}
              />
            )}

            <Cell w={COLUMNS[0].width} first>
              <span style={{ fontSize: 12 }}>{row.id}</span>
            </Cell>

            <Cell w={COLUMNS[1].width}>
              <span style={{ fontSize: 11.5 }}>{row.type}</span>
            </Cell>

            {/* The three-line stack. One inherited 17.5px pitch; no margins. */}
            <Cell w={COLUMNS[2].width} top>
              <span
                style={{
                  display: 'block',
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: 'var(--jpd-text-strong)',
                }}
              >
                {row.title}
              </span>
              <span style={{ display: 'block', fontSize: 9.5, color: 'var(--jpd-text-body)' }}>
                {row.description}
              </span>
            </Cell>

            <Cell w={COLUMNS[3].width}>
              <span style={{ fontSize: 11 }}>{row.responsibleOrg}</span>
            </Cell>

            <Cell w={COLUMNS[4].width}>
              <span className="flex items-center" style={{ gap: 8 }}>
                <DemoAvatar initials={row.ownerInitials} size={25} />
                <span style={{ lineHeight: '14px' }}>
                  <span style={{ display: 'block', fontSize: 11 }}>{row.ownerName}</span>
                  <span style={{ display: 'block', fontSize: 10, color: 'var(--jpd-text-muted)' }}>
                    {row.ownerRole}
                  </span>
                </span>
              </span>
            </Cell>

            <Cell w={COLUMNS[5].width}>
              <DemoStatusBadge status={row.status} />
            </Cell>

            <Cell w={COLUMNS[6].width}>
              <span style={{ fontSize: 11.5 }}>{row.commitmentDate}</span>
            </Cell>

            {/* Target Date is now the last column and carries the row action,
                right-aligned, exactly as the Value cell did in the reference.
                The action keeps its position at the table's right edge. */}
            <Cell w={COLUMNS[7].width}>
              <span className="flex w-full items-center">
                <span style={{ fontSize: 11.5 }}>{row.targetDate}</span>
                <span
                  className="ml-auto flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 26,
                    border: '1px solid var(--jpd-border)',
                    borderRadius: 5,
                    marginRight: 4,
                  }}
                >
                  <MoreHorizontal size={14} strokeWidth={2} color="var(--jpd-text-muted)" />
                </span>
              </span>
            </Cell>
          </div>
        );
      })}
    </div>
  );
}
