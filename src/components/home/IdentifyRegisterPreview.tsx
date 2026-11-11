import { useLayoutEffect, useRef } from 'react';
import ProductRegisterScreen from '../demo/screens/ProductRegisterScreen';
import { CANVAS, cameraAt, transformOf, type Frame } from './identifyRegisterCamera';
import { PREVIEW_TITLE } from './identifyRegisterPreviewData';
import {
  CONDITION_LABEL,
  DOCUMENTS,
  IDENTIFY_DURATION_MS,
  IDENTIFY_TIMING,
  INVENTORY_PROJECT,
  INVENTORY_TITLE,
  PANEL,
  REQUIREMENTS,
  SHEET,
  STORY,
  identifyStateAt,
  type Condition,
  type DocumentKind,
  type IdentifyState,
} from './identifyStoryScene';
import '../demo/tokens.css';

/**
 * The Identify tab's visual (Design System Section 54.4.1, rewritten
 * 2026-11-11): scattered project information becomes an organized
 * procurement inventory with its scope gaps in view, and that inventory is
 * the JiTpro Procurement Register.
 *
 * TWO LAYERS IN THE FRAME.
 *
 *   THE STORY   one SVG on a 480 x 300 design canvas, scaled as a unit to
 *               the 16:10 frame, so nothing in it can reflow, overlap or
 *               clip at any size. Four project documents; the inventory that
 *               forms beside them; each requirement's condition.
 *   THE REGISTER the canonical `ProductRegisterScreen` on its fixed
 *               1448 x 1086 canvas, under the camera (identifyRegisterCamera).
 *               It is the same component the demo lab renders, never a
 *               homepage copy; only its heading differs (*Procurement
 *               Register*, §54.5 open item 5).
 *
 * ONE CLOCK (§46.3). Everything that moves is read each frame from
 * `identifyStateAt(t)`; this component only applies it. Not played: parked
 * on the opening frame, the scattered documents. Played: one pass, then
 * rest on the whole register application. It never loops. Reduced motion: the resting
 * view at once (§46.5). A resize re-applies the current moment; nothing
 * restarts.
 *
 * Illustration only: the visual column is aria-hidden (§46.12), nothing here
 * is focusable, and nothing depicts scanning, extraction or validation.
 *
 * The original visualization, a six-stop camera tour of the register, is
 * archived: docs/design/archive/Identify_Original_Visualization.md.
 */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/* Light-surface inks for the documents (§8.8): no amber. */
const PAPER = 'var(--jp-surface-white)';
const INK = 'var(--jp-ink-secondary)';
const INK_STRONG = 'var(--jp-background)';

/* The inventory is drawn in the application's own tokens, as the register is. */
const APP = {
  surface: 'var(--jpd-surface)',
  divider: 'var(--jpd-divider)',
  strong: 'var(--jpd-text-strong)',
  secondary: 'var(--jpd-text-secondary)',
  muted: 'var(--jpd-text-muted)',
} as const;

/** Each condition in the application's existing status language (DemoStatusBadge). */
const CONDITION_TONE: Record<Condition, { ink: string; tint: string | null }> = {
  defined: { ink: 'var(--jpd-ok-fg)', tint: null },
  'missing-info': { ink: 'var(--jpd-warn-fg)', tint: 'var(--jpd-warn-bg)' },
  unresolved: { ink: 'var(--jpd-text-strong)', tint: 'var(--jpd-neutral-bg)' },
};

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

export default function IdentifyRegisterPreview({ played }: { played: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<SVGSVGElement>(null);
  const panelRef = useRef<SVGGElement>(null);
  const legendRef = useRef<SVGGElement>(null);
  const docRefs = useRef<(SVGGElement | null)[]>([]);
  const captionRefs = useRef<(SVGTextElement | null)[]>([]);
  const rowRefs = useRef<(SVGGElement | null)[]>([]);
  const markRefs = useRef<(SVGGElement | null)[]>([]);
  const tintRefs = useRef<(SVGRectElement | null)[]>([]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const story = storyRef.current;
    if (!frame || !canvas || !story) return;
    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    let size: Frame = { w: frame.clientWidth, h: frame.clientHeight };

    const layer = (el: HTMLElement | SVGElement, opacity: number) => {
      el.style.opacity = String(opacity);
      // Nothing to paint while it is invisible.
      el.style.visibility = opacity > 0 ? 'visible' : 'hidden';
    };

    const apply = (s: IdentifyState) => {
      canvas.style.transform = transformOf(cameraAt(size, s.pan, s.out));
      layer(canvas, s.register);
      layer(story, s.story);

      // The documents: one move, from scattered to gathered and squared up.
      DOCUMENTS.forEach((d, i) => {
        const k = lerp(1, SHEET.gathered, s.gather);
        const x = lerp(d.from.x, d.to.x, s.gather);
        const y = lerp(d.from.y, d.to.y, s.gather);
        const turn = d.from.rotate * (1 - s.gather);
        docRefs.current[i]?.setAttribute(
          'transform',
          `translate(${x} ${y}) rotate(${turn} ${(SHEET.w * k) / 2} ${(SHEET.h * k) / 2}) scale(${k})`,
        );
        const caption = captionRefs.current[i];
        if (caption) caption.style.opacity = String(1 - s.gather);
      });

      if (panelRef.current) panelRef.current.style.opacity = String(s.panel);
      if (legendRef.current) legendRef.current.style.opacity = String(s.legend);
      REQUIREMENTS.forEach((_, i) => {
        const row = rowRefs.current[i];
        if (row) {
          row.style.opacity = String(s.rows[i]);
          row.setAttribute('transform', `translate(0 ${(1 - s.rows[i]) * IDENTIFY_TIMING.ROW_RISE})`);
        }
        const mark = markRefs.current[i];
        if (mark) mark.style.opacity = String(s.marks[i]);
        const tint = tintRefs.current[i];
        if (tint) tint.style.opacity = String(s.marks[i]);
      });
    };

    /* Where the visual is outside a pass: the opening frame, or the resting
       view once played or under reduced motion. */
    let t = reduced ? IDENTIFY_DURATION_MS : 0;
    apply(identifyStateAt(t));

    let raf = 0;
    if (played && !reduced) {
      const start = performance.now();
      const tick = (now: number) => {
        t = Math.min(IDENTIFY_DURATION_MS, Math.max(0, now - start));
        apply(identifyStateAt(t));
        raf = t < IDENTIFY_DURATION_MS ? requestAnimationFrame(tick) : 0;
      };
      raf = requestAnimationFrame(tick);
    }

    /* A real size change re-applies the current moment at the new size. */
    const ro = new ResizeObserver(() => {
      const next: Frame = { w: frame.clientWidth, h: frame.clientHeight };
      if (next.w === size.w && next.h === size.h) return;
      size = next;
      apply(identifyStateAt(t));
    });
    ro.observe(frame);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [played]);

  const rowTop = (i: number) => PANEL.y + PANEL.header + i * PANEL.row;
  const right = PANEL.x + PANEL.w;
  const legendY = rowTop(REQUIREMENTS.length) + 20;

  return (
    <div ref={frameRef} className="jpd relative h-full overflow-hidden">
      {/* THE REGISTER, beneath the story until stage 4. */}
      <div
        ref={canvasRef}
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: CANVAS.w, height: CANVAS.h }}
      >
        <ProductRegisterScreen title={PREVIEW_TITLE} />
      </div>

      {/* THE STORY: documents, then the inventory they become. */}
      <svg
        ref={storyRef}
        viewBox={`0 0 ${STORY.w} ${STORY.h}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full font-heading"
      >
        {/* The inventory panel. Drawn first, so the documents pass over it. */}
        <g ref={panelRef}>
          <rect
            x={PANEL.x}
            y={PANEL.y}
            width={PANEL.w}
            height={PANEL.h}
            rx={4}
            style={{ fill: APP.surface, stroke: INK, strokeOpacity: 0.25, strokeWidth: 0.75 }}
          />
          <text x={PANEL.x + 12} y={PANEL.y + 19} fontSize={11} fontWeight={700} style={{ fill: APP.strong }}>
            {INVENTORY_TITLE}
          </text>
          <text x={right - 12} y={PANEL.y + 19} fontSize={8.5} textAnchor="end" style={{ fill: APP.muted }}>
            {INVENTORY_PROJECT}
          </text>
          <line
            x1={PANEL.x}
            x2={right}
            y1={PANEL.y + PANEL.header}
            y2={PANEL.y + PANEL.header}
            style={{ stroke: INK, strokeOpacity: 0.25, strokeWidth: 0.75 }}
          />
        </g>

        {REQUIREMENTS.map((r, i) => {
          const y = rowTop(i);
          const tone = CONDITION_TONE[r.condition];
          return (
            <g
              key={r.id}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
            >
              {tone.tint && (
                <rect
                  ref={(el) => {
                    tintRefs.current[i] = el;
                  }}
                  x={PANEL.x + 0.5}
                  y={y + 0.5}
                  width={PANEL.w - 1}
                  height={PANEL.row - 1}
                  style={{ fill: tone.tint }}
                />
              )}
              <line x1={PANEL.x} x2={right} y1={y + PANEL.row} y2={y + PANEL.row} style={{ stroke: APP.divider }} />
              <text x={PANEL.x + 12} y={y + 15.5} fontSize={12} fontWeight={600} style={{ fill: APP.strong }}>
                {r.name}
              </text>
              <text x={PANEL.x + 12} y={y + 27} fontSize={7.5} className="font-mono" style={{ fill: APP.muted }}>
                {r.source}
              </text>
              <g
                ref={(el) => {
                  markRefs.current[i] = el;
                }}
              >
                {r.note && (
                  <text x={right - 31} y={y + 20.5} fontSize={9.5} fontWeight={600} textAnchor="end" style={{ fill: tone.ink }}>
                    {r.note}
                  </text>
                )}
                <ConditionMark condition={r.condition} cx={right - 17} cy={y + 17} />
              </g>
            </g>
          );
        })}

        {/* The key to the three conditions. */}
        <g ref={legendRef}>
          {(
            [
              ['defined', PANEL.x + 18],
              ['missing-info', PANEL.x + 88],
              ['unresolved', PANEL.x + 218],
            ] as const
          ).map(([condition, x]) => (
            <g key={condition}>
              <ConditionMark condition={condition} cx={x} cy={legendY - 3} />
              <text x={x + 10} y={legendY} fontSize={8.5} style={{ fill: APP.secondary }}>
                {CONDITION_LABEL[condition]}
              </text>
            </g>
          ))}
        </g>

        {/* The documents. */}
        {DOCUMENTS.map((d, i) => (
          <g
            key={d.kind}
            ref={(el) => {
              docRefs.current[i] = el;
            }}
          >
            <DocumentSheet kind={d.kind} />
            <text
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              x={SHEET.w / 2}
              y={SHEET.h + 12}
              fontSize={7}
              fontWeight={700}
              textAnchor="middle"
              letterSpacing="0.12em"
              className="font-mono uppercase"
              style={{ fill: INK }}
            >
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * A condition's mark, in the status badge's own vocabulary (DemoStatusBadge):
 * a check for defined, the warn dot for missing information, a question mark
 * for unresolved scope. Shape carries the meaning as well as hue.
 */
function ConditionMark({ condition, cx, cy }: { condition: Condition; cx: number; cy: number }) {
  if (condition === 'defined') {
    return (
      <path
        d={`M${cx - 4.5} ${cy + 0.5} l3 3 l6 -7`}
        fill="none"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: 'var(--jpd-ok-fg)' }}
      />
    );
  }
  if (condition === 'missing-info') {
    return <circle cx={cx} cy={cy} r={3.75} style={{ fill: 'var(--jpd-warn-dot)' }} />;
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="none" strokeWidth={1.2} style={{ stroke: APP.strong }} />
      <text x={cx} y={cy + 2.7} fontSize={7.5} fontWeight={700} textAnchor="middle" style={{ fill: APP.strong }}>
        ?
      </text>
    </g>
  );
}

/* --------------------------------------------------------------- documents
   Four construction documents, drawn at SHEET size in light-surface ink.
   They are illustration: recognizable as a drawing sheet, a project manual
   and a schedule, and no more detailed than that needs. */

const line = (opacity: number, width = 0.6) => ({ stroke: INK, strokeOpacity: opacity, strokeWidth: width, fill: 'none' });
const wash = (opacity: number) => ({ fill: INK, fillOpacity: opacity });

/** A drawing sheet: its edge, its border and a title block down the right. */
function SheetFrame({ number, title }: { number: string; title: string }) {
  return (
    <>
      <rect width={SHEET.w} height={SHEET.h} style={{ fill: PAPER, stroke: INK, strokeOpacity: 0.5, strokeWidth: 0.75 }} />
      <rect x={5} y={5} width={SHEET.w - 10} height={SHEET.h - 10} style={line(0.45)} />
      <line x1={148} x2={148} y1={5} y2={SHEET.h - 5} style={line(0.45)} />
      <line x1={148} x2={183} y1={72} y2={72} style={line(0.35)} />
      <line x1={148} x2={183} y1={92} y2={92} style={line(0.35)} />
      {[14, 20, 26, 32].map((y) => (
        <rect key={y} x={153} y={y} width={y === 32 ? 16 : 25} height={1.6} style={wash(0.3)} />
      ))}
      <text x={165.5} y={84} fontSize={4.6} fontWeight={600} textAnchor="middle" style={{ fill: INK }}>
        {title}
      </text>
      <text x={165.5} y={106} fontSize={8.5} fontWeight={700} textAnchor="middle" style={{ fill: INK_STRONG }}>
        {number}
      </text>
    </>
  );
}

function DocumentSheet({ kind }: { kind: DocumentKind }) {
  switch (kind) {
    case 'architectural':
      return (
        <>
          <SheetFrame number="A5.11" title="ELEVATIONS" />
          {/* An exterior elevation: gable, walls, windows and a door. */}
          <polyline points="20,48 76,20 132,48" style={line(0.7, 0.8)} />
          <rect x={26} y={48} width={100} height={48} style={line(0.7, 0.8)} />
          <line x1={12} x2={142} y1={96} y2={96} style={line(0.8, 1)} />
          {[34, 54, 94, 110].flatMap((x) =>
            [56, 76].map((y) => (
              <g key={`${x}-${y}`}>
                <rect x={x} y={y} width={12} height={13} style={line(0.75)} />
                <line x1={x + 6} x2={x + 6} y1={y} y2={y + 13} style={line(0.5, 0.4)} />
              </g>
            )),
          )}
          <rect x={72} y={74} width={13} height={22} style={line(0.75)} />
          {/* A dimension string beneath it. */}
          <line x1={26} x2={126} y1={104} y2={104} style={line(0.5, 0.4)} />
          {[26, 76, 126].map((x) => (
            <line key={x} x1={x} x2={x} y1={101.5} y2={106.5} style={line(0.5, 0.4)} />
          ))}
          <text x={12} y={14} fontSize={4.6} fontWeight={600} style={{ fill: INK }}>
            SOUTH ELEVATION
          </text>
        </>
      );
    case 'specifications':
      return (
        <>
          {(
            [
              [8, '08 51 23', 'STEEL WINDOWS'],
              [100, '04 43 13', 'STONE MASONRY VENEER'],
            ] as const
          ).map(([x, section, title]) => (
            <g key={section} transform={`translate(${x} 2)`}>
              <rect width={80} height={114} style={{ fill: PAPER, stroke: INK, strokeOpacity: 0.5, strokeWidth: 0.75 }} />
              <text x={8} y={13} fontSize={5} fontWeight={700} style={{ fill: INK_STRONG }}>
                {`SECTION ${section}`}
              </text>
              <text x={8} y={20} fontSize={4.6} fontWeight={600} style={{ fill: INK }}>
                {title}
              </text>
              <line x1={8} x2={72} y1={24} y2={24} style={line(0.45)} />
              {(
                [
                  [32, 'PART 1  GENERAL', [58, 64, 50, 61, 40]],
                  [68, 'PART 2  PRODUCTS', [62, 54, 64, 46, 60, 34]],
                ] as const
              ).map(([y, part, widths]) => (
                <g key={part}>
                  <text x={8} y={y} fontSize={4.4} fontWeight={700} style={{ fill: INK }}>
                    {part}
                  </text>
                  {widths.map((w, n) => (
                    <rect key={n} x={8} y={y + 4.5 + n * 5} width={w} height={1.6} style={wash(0.3)} />
                  ))}
                </g>
              ))}
            </g>
          ))}
        </>
      );
    case 'schedule':
      return (
        <>
          <rect width={SHEET.w} height={SHEET.h} style={{ fill: PAPER, stroke: INK, strokeOpacity: 0.5, strokeWidth: 0.75 }} />
          <rect x={0.4} y={0.4} width={SHEET.w - 0.8} height={15} style={wash(0.1)} />
          <text x={8} y={10.5} fontSize={5} fontWeight={700} style={{ fill: INK_STRONG }}>
            CONSTRUCTION SCHEDULE
          </text>
          <line x1={62} x2={62} y1={15.4} y2={SHEET.h} style={line(0.35)} />
          {['J', 'F', 'M', 'A', 'M', 'J'].map((m, n) => (
            <g key={n}>
              <line x1={62 + n * 20} x2={62 + n * 20} y1={15.4} y2={SHEET.h} style={line(0.2, 0.4)} />
              <text x={72 + n * 20} y={24} fontSize={4.6} fontWeight={600} textAnchor="middle" style={{ fill: INK }}>
                {m}
              </text>
            </g>
          ))}
          <line x1={0} x2={SHEET.w} y1={27.5} y2={27.5} style={line(0.3)} />
          {(
            [
              [40, 0, 22],
              [32, 10, 28],
              [44, 24, 30],
              [36, 40, 24],
              [42, 52, 34],
              [30, 68, 28],
              [38, 86, 28],
            ] as const
          ).map(([label, start, length], n) => (
            <g key={n}>
              <rect x={8} y={35 + n * 11.5} width={label} height={1.8} style={wash(0.35)} />
              <rect x={66 + start} y={33.4 + n * 11.5} width={length} height={5} rx={1} style={wash(0.55)} />
            </g>
          ))}
        </>
      );
    case 'consultant':
      return (
        <>
          <SheetFrame number="M1.02" title="MECHANICAL" />
          {/* A floor plan with one duct run and its diffusers. */}
          <rect x={14} y={18} width={126} height={86} style={line(0.75, 1.1)} />
          <line x1={72} x2={72} y1={52} y2={104} style={line(0.6, 0.8)} />
          <line x1={14} x2={140} y1={52} y2={52} style={line(0.6, 0.8)} />
          <line x1={106} x2={106} y1={52} y2={104} style={line(0.6, 0.8)} />
          <rect x={20} y={24} width={18} height={13} style={line(0.75)} />
          <text x={29} y={32.6} fontSize={4.4} fontWeight={700} textAnchor="middle" style={{ fill: INK }}>
            AHU
          </text>
          <rect x={38} y={28} width={94} height={5} style={line(0.65)} />
          {[44, 88, 122].map((x) => (
            <g key={x}>
              <rect x={x - 1.75} y={33} width={3.5} height={39} style={line(0.65)} />
              <rect x={x - 5} y={72} width={10} height={10} style={line(0.75)} />
              <line x1={x - 5} x2={x + 5} y1={72} y2={82} style={line(0.5, 0.4)} />
              <line x1={x + 5} x2={x - 5} y1={72} y2={82} style={line(0.5, 0.4)} />
            </g>
          ))}
          <text x={12} y={14} fontSize={4.6} fontWeight={600} style={{ fill: INK }}>
            LEVEL 1 MECHANICAL PLAN
          </text>
        </>
      );
  }
}
