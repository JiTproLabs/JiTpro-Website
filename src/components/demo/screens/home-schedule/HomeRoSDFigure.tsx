import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { CalendarRange, RotateCcw } from 'lucide-react';
import HomeProductRegister from '../home-register/HomeProductRegister';
import { formatRegisterDate, HOME_PAGE, HOME_ROWS, type HomeRegisterRow, type RoSDPresentation } from '../home-register/homeRegisterData';
import { CANVAS, ESTABLISHED_PRODUCT_IDS, FRAME, G, GANTT_TOP, MONTHS, RoSD_ROWS, ROWS_BOTTOM, YEARS, type RoSDRow } from './homeRoSDLayout';
import '../../tokens.css';
import '../procurement-schedule/scheduleTokens.css';
import '../procurement-chain/chainTokens.css';

/**
 * HOMEPAGE STEP 02 - schedule activities establish Required On-Site Dates
 * (Design System Section 53.1).
 *
 * The frame is the Step 01 register canvas (1280 x 740). It opens on the
 * construction schedule, a 1280 x 388 card centred in it. The schedule's
 * green RoSD markers are identified, the schedule fades, and the SAME
 * register component Step 01 shows (HomeProductRegister) appears with its
 * dates not yet established. The four markers travel into their products'
 * Required On-Site cells and hand over to the register's own dates; the
 * selected product's detail panel then shows its date. Heritage Steel
 * Windows and Doors is emphasised throughout.
 *
 * ONE SHARED STATE (Section 46.3). Everything is a pure function of one
 * progress value `p`, advanced by one clock over one 5000 ms pass. No element
 * has its own timer or delay. The pass plays once, when the figure is
 * substantially in view, then holds; Replay restarts it. It is never
 * scroll-linked, so the Section 46.11 stack is untouched. Reduced motion
 * shows the completed state and hides Replay (Section 46.5).
 */

const DURATION_MS = 5000;

/** Stage windows, as fractions of the pass (Section 53.1.3). */
const STAGE = {
  identify: [0.14, 0.3],
  extract: [0.4, 0.56],
  register: [0.56, 0.7],
  transfer: [0.64, 0.86],
  handoff: [0.86, 0.94],
  panel: [0.9, 0.98],
} as const;

const smooth = (p: number, [a, b]: readonly [number, number]) => {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const v = (token: string) => `var(${token})`;

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia(REDUCED_QUERY).matches;

function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReduced);
  useEffect(() => {
    const mq = window.matchMedia(REDUCED_QUERY);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return reduced;
}

/** The one clock: plays once at 60% visibility, holds at p = 1, replays on demand. */
function useOnePass(target: RefObject<Element | null>, reduced: boolean) {
  const [p, setP] = useState(() => (prefersReduced() ? 1 : 0));
  const raf = useRef(0);
  const played = useRef(false);

  const play = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    setP(0);
    const tick = (now: number) => {
      const next = Math.min(1, (now - t0) / DURATION_MS);
      setP(next);
      if (next < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (reduced) {
      cancelAnimationFrame(raf.current);
      played.current = true;
      setP(1);
      return;
    }
    const el = target.current;
    if (!el || played.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6 && !played.current) {
          played.current = true;
          io.disconnect();
          play();
        }
      },
      { threshold: [0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, play, target]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { p, replay: play };
}

/* ------------------------------------------------------------------ marks */

const diamond = (x: number, y: number, size: number) => {
  const r = size / 2;
  return `M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y} Z`;
};

const ink = { fill: v('--jpd-text-strong') } as const;
const secondary = { fill: v('--jpd-text-secondary') } as const;
const nums: CSSProperties = { fontVariantNumeric: 'tabular-nums' };

/** Where a marker lands: its row's Required On-Site cell, in frame coordinates. */
type Target = { x: number; y: number; h: number };
/** Step 01's cell padding (HomeProductRegister Cell): the date's text starts here. */
const CELL_PAD = 12;
const FRAME_BORDER = 1;

function Marker({ row, t, target, opacity }: { row: RoSDRow; t: number; target: Target | undefined; opacity: number }) {
  const fromX = row.from.x;
  const fromY = GANTT_TOP + row.from.y;
  const fromLabelY = GANTT_TOP + row.from.labelY;
  // The label lands on the cell's own date text; the diamond just before it.
  // FRAME_BORDER: the register's 1px frame, which offsets its content.
  const toX = target ? FRAME_BORDER + target.x + CELL_PAD - row.labelDx : fromX;
  const toY = target ? FRAME_BORDER + target.y + target.h / 2 : fromY;
  const toLabelY = target ? toY + 7 : fromLabelY;
  const x = lerp(fromX, toX, t);
  const y = lerp(fromY, toY, t);
  const labelY = lerp(fromLabelY, toLabelY, t);
  return (
    <g opacity={opacity}>
      <path
        d={diamond(x, y, row.diamond)}
        style={{ fill: v('--jpd-chain-ros'), stroke: v('--jpd-surface'), strokeWidth: 2, strokeLinejoin: 'round' }}
      />
      <text
        x={x + row.labelDx}
        y={labelY}
        style={{ ...ink, ...nums, fontSize: row.emphasis ? 15 : 13, fontWeight: row.emphasis ? 800 : 700 }}
      >
        {formatRegisterDate(row.activity.requiredOnSiteDate)}
      </text>
    </g>
  );
}

/* ------------------------------------------------------- schedule layer */

/** The construction schedule (SVG), drawn in its own card. The card fades out in stage 3. */
function ScheduleLayer({ markersIn }: { markersIn: number }) {
  const headerY = G.TITLE_H;
  const textBase = G.TITLE_H + 26;
  return (
    <svg viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`} className="block h-full w-full" aria-hidden="true">
      <rect width={CANVAS.w} height={CANVAS.h} style={{ fill: v('--jpd-surface') }} />
      <g>
        <rect y={headerY} width={CANVAS.w} height={G.HEADER_H} style={{ fill: v('--jpd-surface-header') }} />
        <line x1={0} x2={CANVAS.w} y1={headerY} y2={headerY} style={{ stroke: v('--jpd-border'), strokeWidth: 1 }} />
        {RoSD_ROWS.map((r) => (
          <g key={`row-${r.activity.id}`}>
            {r.emphasis && (
              <>
                <rect y={r.top} width={CANVAS.w} height={G.ROW_H} style={{ fill: v('--jpd-row-tint') }} />
                <rect y={r.top} width={4} height={G.ROW_H} style={{ fill: v('--jpd-row-bar') }} />
              </>
            )}
            <line x1={0} x2={CANVAS.w} y1={r.top} y2={r.top} style={{ stroke: v('--jpd-divider'), strokeWidth: 1 }} />
          </g>
        ))}

        {/* Legend: what the green diamond means. Arrives with the markers. */}
        <g opacity={markersIn}>
          <path d={diamond(CANVAS.w - 248, G.TITLE_H / 2, 14)} style={{ fill: v('--jpd-chain-ros'), stroke: v('--jpd-surface'), strokeWidth: 2 }} />
          <text x={CANVAS.w - 234} y={G.TITLE_H / 2 + 4.5} style={{ ...secondary, fontSize: 13, fontWeight: 600 }}>
            Required On-Site Date (RoSD)
          </text>
        </g>
        <CalendarRange x={24} y={18} width={20} height={20} strokeWidth={1.9} style={{ color: v('--jpd-text-strong') }} />
        <text x={54} y={34} style={{ ...ink, fontSize: 17, fontWeight: 700 }}>
          Construction Schedule
          <tspan dx={14} style={{ ...secondary, fontSize: 14, fontWeight: 500 }}>
            {HOME_PAGE.project}
          </tspan>
        </text>

        <text x={G.COL_ACTIVITY} y={textBase} style={{ ...ink, fontSize: 12, fontWeight: 600 }}>Activity</text>
        <text x={G.COL_START} y={textBase} style={{ ...ink, fontSize: 12, fontWeight: 600 }}>Start</text>
        <text x={G.COL_DURATION} y={textBase} style={{ ...ink, fontSize: 12, fontWeight: 600 }}>Duration</text>
        <line x1={G.TL_X0} x2={G.TL_X0} y1={headerY} y2={ROWS_BOTTOM} style={{ stroke: v('--jpd-border'), strokeWidth: 1 }} />

        {/* Timescale: years above months, hairlines through the rows. */}
        <line x1={G.TL_X0} x2={G.TL_X1} y1={headerY + G.YEAR_H} y2={headerY + G.YEAR_H} style={{ stroke: v('--jpd-grid-strong'), strokeWidth: 1 }} />
        {YEARS.map((y) => (
          <text key={y.label} x={y.x0 + 6} y={headerY + 15} style={{ ...ink, fontSize: 11, fontWeight: 700 }}>
            {y.label}
          </text>
        ))}
        {MONTHS.map((m) => (
          <g key={`${m.label}-${m.x0}`}>
            <line
              x1={m.x0}
              x2={m.x0}
              y1={m.yearStart ? headerY : headerY + G.YEAR_H}
              y2={ROWS_BOTTOM}
              style={{ stroke: v(m.yearStart ? '--jpd-grid-strong' : '--jpd-grid'), strokeWidth: 1 }}
            />
            <text
              x={(m.x0 + m.x1) / 2}
              y={headerY + G.HEADER_H - 7}
              textAnchor="middle"
              style={{ ...secondary, fontSize: 10.5, fontWeight: 500 }}
            >
              {m.label}
            </text>
          </g>
        ))}

        {RoSD_ROWS.map((r) => {
          const mid = r.top + G.ROW_H / 2 + 5;
          return (
            <g key={`sched-${r.activity.id}`}>
              <text x={G.COL_ACTIVITY} y={mid} style={{ ...ink, fontSize: 14, fontWeight: r.emphasis ? 700 : 600 }}>
                {r.activity.name}
              </text>
              <text x={G.COL_START} y={mid} style={{ ...ink, ...nums, fontSize: 13, fontWeight: 500 }}>
                {formatRegisterDate(r.activity.startDate)}
              </text>
              <text x={G.COL_DURATION} y={mid} style={{ ...secondary, ...nums, fontSize: 13, fontWeight: 500 }}>
                {r.activity.durationWorkdays} working days
              </text>
              {/* The RoSD's date rule, within its own row. Arrives with the
                  marker and leaves with the schedule. */}
              <line
                x1={r.from.x}
                x2={r.from.x}
                y1={r.top + 6}
                y2={r.top + G.ROW_H - 6}
                opacity={markersIn}
                style={{ stroke: v('--jpd-chain-rule'), strokeWidth: 1.5, strokeDasharray: '4 4' }}
              />
              <rect
                x={r.bar.x0}
                y={r.bar.y - G.BAR_H / 2}
                width={r.bar.x1 - r.bar.x0}
                height={G.BAR_H}
                rx={4}
                style={{ fill: v(r.emphasis ? '--jpd-text-strong' : '--jpd-summary-bar') }}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ----------------------------------------------------------------- canvas */

/** Offset of `el` within `root`, in unscaled CSS px (offsets ignore transforms). */
function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return n === root ? { x, y } : null;
}

/**
 * Three layers in one frame coordinate system (1280 x 740): the schedule
 * card, the shared register scaled exactly as Step 01 scales it, and the
 * markers above both (viewBox). Marker landing points are read from the
 * rendered register's own date cells, so a marker cannot miss its cell.
 */
function Canvas({ p }: { p: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [targets, setTargets] = useState<Record<string, Target>>({});

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / FRAME.w);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mounted = scale > 0;
  useLayoutEffect(() => {
    const root = registerRef.current;
    if (!mounted || !root) return;
    const next: Record<string, Target> = {};
    root.querySelectorAll<HTMLElement>('[data-rosd-cell]').forEach((cell) => {
      const at = offsetWithin(cell, root);
      if (at) next[cell.dataset.rosdCell!] = { x: at.x, y: at.y, h: cell.offsetHeight };
    });
    setTargets(next);
  }, [mounted]);

  const markersIn = smooth(p, STAGE.identify);
  const handoff = smooth(p, STAGE.handoff);
  const rosd: RoSDPresentation = {
    reveal: (row: HomeRegisterRow) => (ESTABLISHED_PRODUCT_IDS.has(row.id) ? handoff : 0),
    panel: smooth(p, STAGE.panel),
  };
  const pct = (n: number, of: number) => `${(n / of) * 100}%`;

  return (
    <div ref={boxRef} className="relative w-full" style={{ aspectRatio: `${FRAME.w} / ${FRAME.h}` }}>
      {/* The schedule card. */}
      <div
        className="jpd absolute left-0 w-full overflow-hidden rounded-[14px] border border-jp-ink-secondary/20"
        style={{ top: pct(GANTT_TOP, FRAME.h), height: pct(CANVAS.h, FRAME.h), opacity: 1 - smooth(p, STAGE.extract) }}
      >
        <ScheduleLayer markersIn={markersIn} />
      </div>

      {/* The Step 01 register: the same component, framed and scaled as Step 01 frames and scales it. */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[14px] border border-jp-ink-secondary/20"
        style={{ opacity: smooth(p, STAGE.register) }}
      >
        {mounted && (
          <div
            ref={registerRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: FRAME.w,
              height: FRAME.h,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <HomeProductRegister rosd={rosd} />
          </div>
        )}
      </div>

      {/* The markers, above both. They hand over to the register's own dates. */}
      <svg viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} className="jpd pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <g opacity={markersIn}>
          {RoSD_ROWS.map((r) => (
            <Marker
              key={`m-${r.activity.id}`}
              row={r}
              t={smooth(p, STAGE.transfer)}
              target={targets[r.product.id]}
              opacity={1 - handoff}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------- presentations */

const LABEL =
  `Construction schedule for the ${HOME_PAGE.project}, and the Required On-Site Dates it sets. ` +
  RoSD_ROWS.map(
    (r) =>
      `${r.activity.name} starts ${formatRegisterDate(r.activity.startDate)}, so ${r.product.name} ` +
      `must be on site by ${formatRegisterDate(r.activity.requiredOnSiteDate)}.`,
  ).join(' ') +
  ` The dates are carried into the Product Register, where ${RoSD_ROWS.find((r) => r.emphasis)!.product.name} ` +
  'is selected: the item the next step plans backward from. ' +
  `Not yet established: ${HOME_ROWS.filter((r) => !ESTABLISHED_PRODUCT_IDS.has(r.id))
    .map((r) => r.name)
    .join(' and ')}.`;

/** Below lg: the completed idea as real text, no motion (Section 53.1.4). */
function StaticList() {
  return (
    <div
      className="jpd overflow-hidden rounded-[14px] border border-jp-ink-secondary/20"
      style={{ background: 'var(--jpd-surface)', color: 'var(--jpd-text)' }}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 text-[0.8125rem] font-semibold"
        style={{ background: 'var(--jpd-surface-header)', color: 'var(--jpd-text-secondary)' }}
      >
        <span>Required On-Site Dates · {HOME_PAGE.project}</span>
      </div>
      <ol>
        {RoSD_ROWS.map((r) => (
          <li
            key={r.activity.id}
            className="relative border-t px-5 py-4 first:border-t-0"
            style={{
              borderColor: 'var(--jpd-divider)',
              background: r.emphasis ? 'var(--jpd-row-tint)' : undefined,
            }}
          >
            {r.emphasis && (
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1" style={{ background: 'var(--jpd-row-bar)' }} />
            )}
            <p className="text-[0.8125rem]" style={{ color: 'var(--jpd-text-secondary)' }}>
              {r.activity.name} · starts {formatRegisterDate(r.activity.startDate)}
            </p>
            <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className={`text-[1rem] ${r.emphasis ? 'font-extrabold' : 'font-bold'}`}>{r.product.name}</p>
              <p className="inline-flex items-center gap-2 text-[0.9375rem] font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" className="shrink-0">
                  <path d={diamond(6, 6, 11)} style={{ fill: 'var(--jpd-chain-ros)' }} />
                </svg>
                <span>
                  <span className="sr-only">Required on site </span>
                  {formatRegisterDate(r.activity.requiredOnSiteDate)}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function HomeRoSDFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { p, replay } = useOnePass(ref, reduced);
  return (
    <figure className="m-0">
      <div className="hidden lg:block">
        <div
          ref={ref}
          role="img"
          aria-label={LABEL}
        >
          <Canvas p={p} />
        </div>
      </div>
      <div className="lg:hidden">
        <StaticList />
      </div>
      <div className="mt-3 flex items-start justify-between gap-6">
        <figcaption className="text-[0.8125rem] leading-snug text-jp-ink-secondary">
          Representative demonstration data. Each Required On-Site Date reflects that product&apos;s own receiving,
          staging, and inspection needs.
        </figcaption>
        {/* Quiet, like the hero's Replay: the step has no call to action and
            this must not read as one. Only where the animation runs. */}
        {!reduced && (
          <button
            type="button"
            onClick={replay}
            aria-label="Replay the Required On-Site Date animation"
            className="-my-2 hidden shrink-0 items-center gap-1.5 rounded px-3 py-2.5 font-mono text-[0.6875rem] tracking-[0.1em] text-jp-ink-secondary transition-colors duration-200 hover:text-jp-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-background motion-reduce:hidden motion-reduce:transition-none lg:inline-flex"
          >
            <RotateCcw size={13} aria-hidden="true" className="shrink-0" />
            Replay
          </button>
        )}
      </div>
    </figure>
  );
}
