import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Download, Filter, Plus, X } from 'lucide-react';
import JiTproShell from '../../shell/JiTproShell';
import DemoStatusBadge from '../../primitives/DemoStatusBadge';
import DemoAvatar from '../../primitives/DemoAvatar';
import DemoGantt, { type Zoom } from './DemoGantt';
import { useInspection } from '../../inspection';
import { SCHEDULE_ITEMS } from './scheduleFixture';
import { DATA_DATE, PHASE_FAMILIES, STATUS_LABEL, parse } from './scheduleModel';
import './scheduleTokens.css';
import '../../tokens.css';

/**
 * PROCUREMENT SCHEDULE - prototype screen.
 *
 * One canonical component. The embedded preview and the expanded inspection
 * view are the same tree; only the capabilities supplied through
 * InspectionContext differ. There is no separate "large" implementation.
 *
 * Shared chrome comes from the approved production JiTproShell (205px sidebar,
 * 60px top bar), NOT from the raster's 194/56 drift. Schedule-specific
 * composition follows the raster: left data area, period header, dense rows,
 * compact bars, legend beneath, pagination footer.
 */

const CANVAS_MAIN_W = 989;
const PAD_L = 18;
const PAD_R = 26;
const CONTENT_W = CANVAS_MAIN_W - PAD_L - PAD_R; // 945
const LEFT_W = 226;
const TIMELINE_W = CONTENT_W - LEFT_W; // 719
/**
 * ROW HEIGHT IS FITTED, NOT FIXED.
 *
 * 63px is the authored row - the height the reference screen was measured at,
 * and what the schedule uses whenever the space is there. It is a MAXIMUM now
 * rather than a constant: the canvas is a fixed 1086px box with
 * `overflow: hidden`, so twelve rows at 63 fitted and fifteen did not. The
 * bottom rows were not scrolled off, they were clipped away by the canvas.
 *
 * The fix deliberately does NOT scale the screen down. Scaling would shrink
 * the type along with the rows, and the whole reason this canvas is real DOM
 * rather than a bitmap is that its text stays sharp and readable. Instead only
 * the row pitch gives, and only as far as it must: the rows are the one part
 * of this layout with slack in them, because the bar is 18px inside a 63px
 * band and the label block needs about 43.
 *
 * 48px is the floor. Below that the two-line package name plus the Required
 * On-Site line stop fitting, and the point of compressing rows is to keep
 * those readable - a row too short to show what it is would defeat the fit it
 * was bought with. If a project ever has more rows than 48px each can hold,
 * the answer is pagination, which the screen already has, not a smaller floor.
 */
const ROW_H_MAX = 63;
const ROW_H_MIN = 48;
const HEADER_H = 30;

/**
 * Procurement items on the fictional project as a whole.
 *
 * The fixture authors fifteen of them in full. This number exists so the board
 * reads as a slice of a real project rather than as the whole of a small one -
 * a house of this scope carries far more than fifteen procurement items, and a
 * screen claiming otherwise would misrepresent the size of the problem JiTpro
 * is for. The rendered count stays derived from the fixture, so the two can
 * never drift into disagreeing about how many rows are actually on screen.
 */
const TOTAL_PROCUREMENT_ITEMS = 153;

const ZOOMS: Zoom[] = ['quarters', 'months', 'weeks', 'days'];
const ZOOM_LABEL: Record<Zoom, string> = {
  quarters: 'Quarters',
  months: 'Months',
  weeks: 'Weeks',
  days: 'Days',
};

const fmt = (d: string) =>
  parse(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

export default function ProcurementScheduleScreen() {
  const { enabled } = useInspection();
  const [zoom, setZoom] = useState<Zoom>('quarters');
  const [selectedItemId, setSelectedItemId] = useState(SCHEDULE_ITEMS[4].id); // Heritage Steel

  const item = useMemo(
    () => SCHEDULE_ITEMS.find((i) => i.id === selectedItemId) ?? SCHEDULE_ITEMS[0],
    [selectedItemId],
  );
  const current = item.steps.find((s) => s.id === item.currentStepId);

  /**
   * THE FIT PASS.
   *
   * Available height is measured, never assumed. The two refs bracket the
   * schedule: everything above it and everything below it are whatever the
   * layout actually produced, so a page header that wraps to a second line or
   * a legend that wraps to a second row is accounted for without a single
   * hard-coded offset.
   *
   *   available = canvas height - space above the schedule - space below it
   *
   * `offsetTop`/`offsetHeight` are read rather than `getBoundingClientRect()`
   * because these are LAYOUT pixels. The canvas is scaled by a CSS transform
   * in every presentation context, and a client rect would report the scaled
   * size - so the fit would come out different in the embedded preview, the
   * lightbox and the lab, which is exactly wrong. The canvas is a fixed
   * 1086px box; the fit must be identical at every scale.
   *
   * `gapBelow` is measured from the schedule's own bottom, so it is the
   * distance from the schedule to the end of the page and does NOT move when
   * the row height changes. That is what makes this converge in one pass
   * instead of oscillating: nothing the effect writes can alter what it reads.
   */
  const ganttRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState(ROW_H_MAX);

  useLayoutEffect(() => {
    const gantt = ganttRef.current;
    const foot = footRef.current;
    if (!gantt || !foot) return;

    const measure = () => {
      const canvas = gantt.offsetParent as HTMLElement | null;
      if (!canvas) return;
      const above = gantt.offsetTop;
      const below = foot.offsetTop + foot.offsetHeight - (gantt.offsetTop + gantt.offsetHeight);
      // The schedule box's own chrome: the period header band and its border.
      const forRows = canvas.clientHeight - above - below - HEADER_H - 2;
      const fitted = Math.floor(forRows / SCHEDULE_ITEMS.length);
      setRowHeight(Math.max(ROW_H_MIN, Math.min(ROW_H_MAX, fitted)));
    };
    measure();

    // The canvas is fixed at 1086px today, but it is the wrapper's job to say
    // so, not this screen's. Observing it means a canvas that ever changes
    // size - or content above the schedule that reflows - refits by itself.
    const ro = new ResizeObserver(measure);
    const canvas = gantt.offsetParent as HTMLElement | null;
    if (canvas) ro.observe(canvas);
    ro.observe(foot);
    return () => ro.disconnect();
  }, []);

  /**
   * The attention summary. Derived, so it cannot disagree with the chips on
   * the rows: both read the same `health` value off the same records.
   *
   * At Risk and Impacted are reported SEPARATELY rather than as one combined
   * attention count, because they call for different actions - an at-risk
   * package needs watching, an impacted one needs a decision about a field
   * date that is not going to be met.
   */
  const healthCounts = useMemo(() => {
    let atRisk = 0;
    let impacted = 0;
    for (const it of SCHEDULE_ITEMS) {
      if (it.health === 'at-risk') atRisk++;
      else if (it.health === 'impacted') impacted++;
    }
    return { atRisk, impacted };
  }, []);

  /** Families actually present, so the legend cannot list what is not drawn. */
  const usedFamilies = useMemo(() => {
    const used = new Set<string>();
    for (const it of SCHEDULE_ITEMS) for (const s of it.steps) used.add(s.family);
    return PHASE_FAMILIES.filter((f) => used.has(f.key));
  }, []);

  return (
    <JiTproShell
      activeNav="Schedule"
      panel={
        <aside
          className="shrink-0"
          style={{
            width: 254,
            background: 'var(--jpd-surface-sunken)',
            borderLeft: '1px solid var(--jpd-border-subtle)',
            paddingLeft: 20,
            paddingRight: 16,
            paddingTop: 24,
            overflow: 'hidden',
          }}
        >
          <div className="flex items-start">
            <span style={{ fontSize: 15, fontWeight: 600 }}>Schedule Item Detail</span>
            <X size={17} strokeWidth={2} className="ml-auto" />
          </div>

          <div style={{ fontSize: 17, fontWeight: 700, lineHeight: '21px', marginTop: 18 }}>
            {item.name}
          </div>

          <div style={{ marginTop: 13 }}>
            <DemoStatusBadge
              status={
                current
                  ? current.status === 'at-risk'
                    ? 'at-risk'
                    : 'on-track'
                  : item.requiredOnSiteDate < DATA_DATE
                    ? 'on-track'
                    : 'on-track'
              }
            />
          </div>

          <Rule />

          {/* Required On-Site is the panel's headline fact, not a buried row. */}
          <div
            style={{
              marginTop: 14,
              padding: '10px 11px',
              borderRadius: 6,
              background: 'var(--jpd-row-tint)',
              border: '1px solid #f6dfae',
            }}
          >
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#8a6d3b',
              }}
            >
              REQUIRED ON-SITE
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>
              {fmt(item.requiredOnSiteDate)}
            </div>
          </div>

          <Field label="Category" value={item.category} />
          <Field label="Procurement Start" value={fmt(item.startDate)} />
          <Field
            label="Overall Duration"
            value={`${item.durationWorkdays} working days`}
          />
          <Field label="Phases & Milestones" value={`${item.steps.length} steps`} />

          <Rule />

          <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 14 }}>Current Phase</div>
          {current ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>{current.name}</div>
              <div style={{ fontSize: 12, color: 'var(--jpd-text-muted)', marginTop: 2 }}>
                {fmt(current.startDate)}
                {current.kind === 'phase' ? ` → ${fmt(current.endDate)}` : ''}
              </div>

              <FieldLabel>Responsible Organization</FieldLabel>
              <div style={{ fontSize: 13.5, marginTop: 4 }}>{current.responsibleOrganization}</div>

              <FieldLabel>Commitment Owner</FieldLabel>
              <div className="flex items-center" style={{ gap: 9, marginTop: 6 }}>
                <DemoAvatar initials={current.commitmentOwnerId.slice(0, 2)} size={30} />
                <span>
                  <span style={{ display: 'block', fontSize: 13 }}>
                    {current.commitmentOwnerName}
                  </span>
                  <span
                    style={{ display: 'block', fontSize: 11, color: 'var(--jpd-text-muted)' }}
                  >
                    {current.commitmentOwnerRole}
                  </span>
                </span>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--jpd-text-muted)', marginTop: 6 }}>
              {item.requiredOnSiteDate < DATA_DATE
                ? 'All phases complete as of the schedule data date.'
                : 'Not yet started as of the schedule data date.'}
            </div>
          )}

          <Rule />
          <div style={{ fontSize: 11.5, color: 'var(--jpd-text-muted)', marginTop: 12 }}>
            Schedule data date {fmt(DATA_DATE)}
          </div>
        </aside>
      }
    >
      <main
        className="shrink-0"
        style={{
          width: CANVAS_MAIN_W,
          paddingLeft: PAD_L,
          paddingRight: PAD_R,
          background: 'var(--jpd-surface)',
        }}
      >
        {/* -------------------------------------------------- PAGE HEADER */}
        <div className="flex items-start" style={{ paddingTop: 22, paddingLeft: 10 }}>
          <div>
            <h1
              className="jpd-tight"
              style={{ fontSize: 25, fontWeight: 800, lineHeight: '27px', color: 'var(--jpd-text)' }}
            >
              Procurement Schedule
            </h1>
            <div
              style={{ fontSize: 12.5, marginTop: 8, color: 'var(--jpd-text-secondary)' }}
            >
              {SCHEDULE_ITEMS.length} procurement items · backward-planned from each Required
              On-Site date
            </div>
          </div>

          <div className="ml-auto flex items-start" style={{ gap: 22 }}>
            <div
              className="flex items-stretch overflow-hidden"
              style={{ height: 34, borderRadius: 6, border: '1px solid var(--jpd-border)' }}
            >
              <span
                className="flex items-center"
                style={{ gap: 7, padding: '0 12px', fontSize: 12.5, fontWeight: 600 }}
              >
                <Download size={14} strokeWidth={2} />
                Export
              </span>
              <span
                className="flex items-center justify-center"
                style={{ width: 30, borderLeft: '1px solid var(--jpd-border)' }}
              >
                <ChevronDown size={14} strokeWidth={2} />
              </span>
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: 128,
                height: 34,
                borderRadius: 6,
                background: 'var(--jpd-action)',
                color: '#fff',
                fontSize: 12.5,
                fontWeight: 600,
                gap: 7,
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              Add Item
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ TOOLBAR */}
        <div className="flex items-center" style={{ marginTop: 16, paddingLeft: 2 }}>
          <div
            className="flex items-center"
            style={{
              height: 32,
              border: '1px solid var(--jpd-border)',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            {ZOOMS.map((z) => {
              const on = z === zoom;
              return (
                <button
                  key={z}
                  type="button"
                  onClick={() => enabled && setZoom(z)}
                  tabIndex={enabled ? 0 : -1}
                  style={{
                    height: '100%',
                    padding: '0 15px',
                    fontSize: 12,
                    fontWeight: on ? 600 : 500,
                    border: 0,
                    cursor: enabled ? 'pointer' : 'default',
                    background: on ? 'var(--jpd-nav-bg-start)' : 'transparent',
                    color: on ? '#fff' : 'var(--jpd-text-body)',
                  }}
                >
                  {ZOOM_LABEL[z]}
                </button>
              );
            })}
          </div>

          {/* Sits in existing toolbar whitespace rather than in the page
              header, so nothing above the schedule had to be rearranged. */}
          {(healthCounts.atRisk > 0 || healthCounts.impacted > 0) && (
            <span className="flex items-center" style={{ marginLeft: 18, gap: 10 }}>
              {healthCounts.impacted > 0 && (
                <span className="jpd-health jpd-health--impacted">
                  {healthCounts.impacted} IMPACTED
                </span>
              )}
              {healthCounts.atRisk > 0 && (
                <span className="jpd-health jpd-health--at-risk">
                  {healthCounts.atRisk} AT RISK
                </span>
              )}
            </span>
          )}

          <div className="ml-auto flex items-center" style={{ gap: 9 }}>
            <Btn>Today</Btn>
            <Btn square>
              <ChevronLeft size={14} strokeWidth={2} />
            </Btn>
            <Btn square>
              <ChevronRight size={14} strokeWidth={2} />
            </Btn>
            <span style={{ width: 12 }} />
            <Btn>
              <Filter size={13} strokeWidth={2} />
              <span style={{ marginLeft: 6 }}>Filters</span>
            </Btn>
          </div>
        </div>

        {/* -------------------------------------------------------- GANTT */}
        <div
          ref={ganttRef}
          style={{
            marginTop: 14,
            border: '1px solid var(--jpd-border)',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <DemoGantt
            items={SCHEDULE_ITEMS}
            zoom={zoom}
            viewportWidth={TIMELINE_W}
            leftWidth={LEFT_W}
            rowHeight={rowHeight}
            headerHeight={HEADER_H}
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
          />
        </div>

        {/* ------------------------------------------------------- LEGEND
            Generated from the same family definitions the bars read, so it
            cannot drift the way the reference raster's legend did. */}
        <div
          className="flex items-center"
          style={{ marginTop: 12, paddingLeft: 2, gap: 15, flexWrap: 'wrap' }}
        >
          {usedFamilies.map((f) => (
            <span key={f.key} className="flex items-center" style={{ gap: 6 }}>
              {f.key === 'required' ? (
                <span
                  style={{
                    width: 9,
                    height: 9,
                    transform: 'rotate(45deg)',
                    background: `var(--jpd-phase-${f.key})`,
                    borderRadius: 1,
                  }}
                />
              ) : (
                <span
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 2,
                    background: `var(--jpd-phase-${f.key})`,
                  }}
                />
              )}
              <span style={{ fontSize: 10.5, color: 'var(--jpd-text-body)' }}>{f.label}</span>
            </span>
          ))}
          <span className="flex items-center" style={{ gap: 6, marginLeft: 4 }}>
            <span
              style={{
                width: 9,
                height: 9,
                transform: 'rotate(45deg)',
                border: '1.5px solid var(--jpd-text-muted)',
                borderRadius: 1,
              }}
            />
            <span style={{ fontSize: 10.5, color: 'var(--jpd-text-muted)' }}>
              Diamond = milestone (point in time)
            </span>
          </span>

          {/* Every mark drawn on this timeline earns a legend entry, for the
              same reason each family does: a mark the legend does not explain
              is a mark the viewer has to guess at. */}
          <span className="flex items-center" style={{ gap: 6, marginLeft: 4 }}>
            <span
              style={{
                width: 10,
                height: 9,
                clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                background: 'var(--jpd-warn-dot)',
              }}
            />
            <span style={{ fontSize: 10.5, color: 'var(--jpd-text-body)' }}>
              Triangle = issue affecting the procurement path
            </span>
          </span>

          <span className="flex items-center" style={{ gap: 6, marginLeft: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                transform: 'rotate(45deg)',
                border: '1.5px solid var(--jpd-commitment)',
                background: 'var(--jpd-surface)',
                borderRadius: 1,
              }}
            />
            <span style={{ fontSize: 10.5, color: 'var(--jpd-text-body)' }}>
              Raised diamond = external commitment owed to the project
            </span>
          </span>

          {/* The shading is a mark like any other and is explained beside
              them. Same swatch geometry as a family chip; the hairline is
              there only so a near-white swatch is visible on the legend. */}
          <span className="flex items-center" style={{ gap: 6, marginLeft: 4 }}>
            <span
              style={{
                width: 11,
                height: 11,
                borderRadius: 2,
                background: 'var(--jpd-nonworking)',
                boxShadow: 'inset 0 0 0 1px var(--jpd-grid-strong)',
              }}
            />
            <span style={{ fontSize: 10.5, color: 'var(--jpd-text-muted)' }}>
              Shaded = non-working day (weekend or U.S. federal holiday)
            </span>
          </span>
        </div>

        {/* ---------------------------------------------------- PAGINATION */}
        <div
          ref={footRef}
          className="flex items-center"
          style={{ marginTop: 12, paddingLeft: 2, height: 34 }}
        >
          <span style={{ fontSize: 12.5 }}>
            Showing {SCHEDULE_ITEMS.length} of {TOTAL_PROCUREMENT_ITEMS} procurement items
          </span>
          <span className="ml-auto flex items-center" style={{ gap: 12 }}>
            <span style={{ fontSize: 12.5 }}>Rows per page:</span>
            <span
              className="flex items-center justify-between"
              style={{
                width: 66,
                height: 32,
                border: '1px solid var(--jpd-border)',
                borderRadius: 6,
                padding: '0 10px',
                fontSize: 12.5,
              }}
            >
              25
              <ChevronDown size={14} strokeWidth={2} />
            </span>
          </span>
        </div>
      </main>
    </JiTproShell>
  );
}

/* ------------------------------------------------------------------ atoms */

function Btn({ children, square }: { children: React.ReactNode; square?: boolean }) {
  return (
    <span
      className="flex items-center justify-center"
      style={{
        height: 32,
        width: square ? 32 : undefined,
        padding: square ? 0 : '0 13px',
        border: '1px solid var(--jpd-border)',
        borderRadius: 6,
        fontSize: 12.5,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function Rule() {
  return <div style={{ height: 1, background: '#ebebeb', marginTop: 15 }} />;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        marginTop: 13,
        color: 'var(--jpd-text-secondary)',
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ fontSize: 13.5, marginTop: 4 }}>{value}</div>
    </>
  );
}

export { STATUS_LABEL };
