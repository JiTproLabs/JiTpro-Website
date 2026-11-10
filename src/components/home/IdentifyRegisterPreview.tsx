import { PREVIEW_COLUMNS, PREVIEW_PROJECT, PREVIEW_ROWS, PREVIEW_TITLE } from './identifyRegisterPreviewData';
import '../demo/tokens.css';

/**
 * The Identify tab's visual: a CROPPED view of a JiTpro Procurement Register
 * (Design System Section 54.4.1).
 *
 * The existing register's visual language, not a new one: the `--jpd-*`
 * tokens and `.jpd` typeface, and the Product Register table's header, cell,
 * rule and selected-row treatments (`ProductTable`, `HomeProductRegister`).
 * Rows are read from the register fixture (identifyRegisterPreviewData.ts).
 *
 * THE CROP. A light sheet set into the existing 16:10 frame, inset at its
 * top and left; its right and bottom edges run past the frame, which crops
 * them. Three columns only (Item / Description, Trade, Source); the Source
 * column runs on past the right edge. More rows than fit, so the lowest
 * visible row is always cut. Real, reflowed text: nothing is scaled, and the
 * frame's size never changes.
 *
 * MOTION (§46): one input, `played`, the same state the checklist uses. The
 * sheet and headers are always there; on `played` the rows fade in in order
 * after the visual's slide, and the first row's register emphasis (tint and
 * amber bar, decoration on this light ground, §8.8) arrives with the
 * checklist's final check. Not played: everything resets at once. Nothing
 * moves at rest. Reduced motion: everything appears at once.
 *
 * Illustration only: the visual column is aria-hidden (§46.12).
 */

const ROW_DELAY = ['delay-[500ms]', 'delay-[700ms]', 'delay-[900ms]', 'delay-[1100ms]', 'delay-[1300ms]', 'delay-[1500ms]'];
/** With the checklist's final check (§54.2.1). */
const EMPHASIS_DELAY = 'delay-[1870ms]';
const MOTION = 'ease-out motion-reduce:transition-none';

/** Item flexes; Trade fixed; Source wide enough to run past the frame. */
const GRID = 'grid grid-cols-[minmax(0,1fr)_5.25rem_6.5rem] sm:grid-cols-[minmax(0,1fr)_6.5rem_8rem]';

export default function IdentifyRegisterPreview({ played }: { played: boolean }) {
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="jpd absolute top-6 left-6 -right-10 -bottom-10 overflow-hidden rounded-tl-[8px] border border-jp-ink-secondary/20 lg:top-7 lg:left-8"
        style={{ background: 'var(--jpd-surface)', color: 'var(--jpd-text)' }}
      >
        {/* Title strip */}
        <div className="flex items-baseline gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--jpd-divider)' }}>
          <span className="jpd-tight" style={{ fontSize: 14, fontWeight: 800, lineHeight: '20px' }}>
            {PREVIEW_TITLE}
          </span>
          <span className="truncate" style={{ fontSize: 12, lineHeight: '20px', color: 'var(--jpd-text-secondary)' }}>
            {PREVIEW_PROJECT}
          </span>
        </div>

        {/* Column headers */}
        <div className={GRID} style={{ height: 36, background: 'var(--jpd-surface-header)' }}>
          {PREVIEW_COLUMNS.map((label, i) => (
            <div
              key={label}
              className="flex items-center truncate px-3"
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: 'var(--jpd-text-strong)',
                borderLeft: i === 0 ? 'none' : '1px solid var(--jpd-border)',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Rows */}
        {PREVIEW_ROWS.map((row, r) => {
          const first = r === 0;
          return (
            <div
              key={row.id}
              className={`relative ${GRID} transition-[opacity,translate] ${MOTION} ${
                played ? `translate-y-0 opacity-100 duration-300 ${ROW_DELAY[r] ?? ''}` : 'translate-y-1 opacity-0 duration-0'
              }`}
              style={{ height: 52, borderTop: '1px solid var(--jpd-divider)' }}
            >
              {first && (
                /* The register's selected-row treatment, as emphasis. */
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 transition-opacity ${MOTION} ${
                    played ? `opacity-100 duration-[400ms] ${EMPHASIS_DELAY}` : 'opacity-0 duration-0'
                  }`}
                  style={{ background: 'var(--jpd-row-tint)' }}
                >
                  <span className="absolute inset-y-0 left-0 w-1" style={{ background: 'var(--jpd-row-bar)' }} />
                </span>
              )}
              <div className="relative flex min-w-0 flex-col justify-center px-3">
                <span className="truncate" style={{ fontSize: 13, fontWeight: 700, lineHeight: '17px', color: 'var(--jpd-text-strong)' }}>
                  {row.name}
                </span>
                <span className="truncate" style={{ fontSize: 12, lineHeight: '17px', color: 'var(--jpd-text-secondary)' }}>
                  {row.description}
                </span>
              </div>
              <Cell>{row.trade}</Cell>
              <Cell>{row.source}</Cell>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Cell({ children }: { children: string }) {
  return (
    <div
      className="relative flex items-center truncate px-3"
      style={{ fontSize: 12.5, color: 'var(--jpd-text-body)', borderLeft: '1px solid var(--jpd-border)' }}
    >
      {children}
    </div>
  );
}
