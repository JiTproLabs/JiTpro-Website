import { MoreHorizontal } from 'lucide-react';
import DemoStatusBadge from '../primitives/DemoStatusBadge';
import { COLUMNS, ROWS, ROW_HEIGHTS } from '../fixtures/productRegister';

/**
 * The Product Register table.
 *
 * GEOMETRY IS MEASURED from `assets-src/methodology/product-register.png`:
 * the table spans x227-1168 and y406-959; the header is 47px; the ten column
 * rules sit at x305, 467, 540, 612, 745, 842, 915, 1023 and 1102; the row
 * rules sit at y522, 593, 653, 711, 771, 832, 893 and 959, which is why the
 * rows carry individual heights rather than one pitch. Cell text starts 12px
 * inside its column rule. The two-line product cell runs an 18px pitch and is
 * centred in its row, as the master centres it.
 *
 * Same construction as the Commitment Register table: fixed-width flex cells,
 * a left rule on every cell but the first, and one status badge primitive.
 */

/** Cell text starts 12px inside the column edge (measured 317 in a 305 column). */
const CELL_PAD = 12;

function Cell({
  w,
  children,
  first,
  stack,
}: {
  w: number;
  children: React.ReactNode;
  first?: boolean;
  /** The two-line product cell sits exactly on the row centre; every
      single-line cell in the master sits 2px above it. */
  stack?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center"
      style={{
        width: w,
        paddingLeft: CELL_PAD,
        paddingRight: 5,
        borderLeft: first ? 'none' : '1px solid var(--jpd-border)',
        color: 'var(--jpd-text-body)',
        lineHeight: '15px',
      }}
    >
      <span style={{ width: '100%', position: 'relative', top: stack ? 0 : -2 }}>{children}</span>
    </div>
  );
}

export default function ProductTable() {
  return (
    <div style={{ border: '1px solid var(--jpd-border)', borderRadius: 6, overflow: 'hidden' }}>
      <div className="flex" style={{ height: 47, background: 'var(--jpd-surface-header)' }}>
        {COLUMNS.map((c, i) => (
          <div
            key={c.key}
            className="flex shrink-0 items-center"
            style={{
              width: c.width,
              paddingLeft: CELL_PAD,
              paddingRight: 1,
              fontSize: 9.6,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
              color: 'var(--jpd-text-strong)',
              borderLeft: i === 0 ? 'none' : '1px solid var(--jpd-border)',
              /* The master centres the two headings over the marks they
                 label - the badge and the row action - and left-aligns the
                 rest over their text. */
              ...(c.key === 'status' || c.key === 'action'
                ? { justifyContent: 'center', paddingLeft: 0, paddingRight: 0 }
                : null),
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
              height: ROW_HEIGHTS[ri],
              background: selected ? 'var(--jpd-row-tint)' : 'transparent',
              /* Every row, including the first: the master rules the header
                 off from the body at y454. */
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
              <span style={{ fontSize: 11.5, color: 'var(--jpd-text-secondary)' }}>{row.id}</span>
            </Cell>

            {/* The two-line product cell. One 18px pitch, centred in the row. */}
            <Cell w={COLUMNS[1].width} stack>
              <span
                style={{
                  display: 'block',
                  fontSize: 10.5,
                  fontWeight: 700,
                  lineHeight: '18px',
                  color: 'var(--jpd-text-strong)',
                }}
              >
                {row.name}
              </span>
              <span style={{ display: 'block', fontSize: 10.5, lineHeight: '18px', color: 'var(--jpd-text-body)' }}>
                {row.description}
              </span>
            </Cell>

            <Cell w={COLUMNS[2].width}>
              <span style={{ fontSize: 11, lineHeight: '17px', display: 'block' }}>{row.category}</span>
            </Cell>

            <Cell w={COLUMNS[3].width}>
              <span style={{ fontSize: 11 }}>{row.trade}</span>
            </Cell>

            <Cell w={COLUMNS[4].width}>
              <span style={{ fontSize: 11, lineHeight: '17px', display: 'block' }}>{row.supplier}</span>
            </Cell>

            <Cell w={COLUMNS[5].width}>
              <DemoStatusBadge status={row.status} />
            </Cell>

            <Cell w={COLUMNS[6].width}>
              <span style={{ fontSize: 11.5 }}>{row.leadTime}</span>
            </Cell>

            <Cell w={COLUMNS[7].width}>
              <span style={{ fontSize: 11.5 }}>{row.requiredOnSite}</span>
            </Cell>

            <Cell w={COLUMNS[8].width}>
              <span style={{ fontSize: 11.5 }}>{row.source}</span>
            </Cell>

            {/* The row action: a 30x25 bordered button centred in its column. */}
            <div
              className="flex shrink-0 items-center justify-center"
              style={{ width: COLUMNS[9].width, borderLeft: '1px solid var(--jpd-border)' }}
            >
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
