// Mobile procurement-failure hero — portrait port of the desktop ProcurementFlowHero
// story as a "fixed playhead, scrolling timeline" Gantt: the Today line is stationary
// and the schedule scrolls right-to-left past it, pausing at each failure note. The
// bar dynamics are the desktop's exact slip math viewed from the line's reference
// frame (Buyout pins to the line and stretches, Fabrication hugs the line then releases,
// the buffer vanishes, the Onsite date overshoots into red). It ends on the same thesis
// line, house render, and hero copy as desktop.
//
// Phases (mobile-local; see PH):
//   intro    — framing line reads, then the planned chart fades in (line at start)
//   advance  — chart scrolls left through 5 stops; bars slip; caption + package update
//   missed   — chart at terminal slip; Onsite red; late-delivery caption; dwell
//   thesis   — chart clears; thesis line scales up in amber and holds
//   resolve  — thesis fades out as house + hero copy fade in
//
// Narrative content (notes, packages, thesis, late line, hero copy) and the schedule
// geometry are shared with desktop via heroAnimationData so the two cannot drift.
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  heroCopy, introTitle, thesisLine, mobileStops, mobileLateLine,
  traditionalScenario, BAR_LOCK_AT_CURSOR,
} from '../../../content/heroAnimationData';

// ===== Schedule geometry (plan-space fractions, shared with desktop) =====
const BUYOUT_END   = traditionalScenario.bars.find(b => b.id === 'buyout')!.end;   // 0.32
const FAB          = traditionalScenario.bars.find(b => b.id === 'fab')!;
const FAB_LEN      = FAB.end - FAB.start;                                           // 0.46
const BUFFER_START = traditionalScenario.bars.find(b => b.id === 'buffer')!.start;  // 0.78
const ONSITE       = traditionalScenario.onsite.position;                           // 0.92
const LOCK         = BAR_LOCK_AT_CURSOR;                                            // 0.72
// Terminal scroll position: the Today line runs all the way to the end of the last
// task — Fabrication's late finish — so the schedule completes rather than stopping
// mid-task. The zoom (SCALE) below keeps the missed Onsite diamond on screen here.
const TERMINAL     = LOCK + FAB_LEN;                                               // 1.18

const TRIGGERS = mobileStops.map(s => s.trigger);

// ===== Intro sub-stage timings (ms within the intro phase) =====
const TITLE_IN_MS   = 600;
const TITLE_HOLD_MS = 1700;
const TITLE_OUT_MS  = 500;
const SPINE_IN_MS   = 800;  // chart fades in (starts during the title fade-out)
const TITLE_OUT_AT  = TITLE_IN_MS + TITLE_HOLD_MS;       // 2300
const CHART_IN_AT   = TITLE_OUT_AT + TITLE_OUT_MS - 200; // 2600 (200ms overlap)

// ===== Advance sub-schedule =====
// `progress` (plan-fraction at the Today line) walks 0 → TERMINAL, pausing at each
// trigger. Identical structure to the desktop cursor traversal.
const ADV_TRAVEL_MS = 4500;
const ADV_PAUSE_MS  = 1200;
const CHECK = [0, ...TRIGGERS, TERMINAL];                 // 7 checkpoints
const SEG = CHECK.slice(1).map((v, i) => v - CHECK[i]);   // 6 segments
const SEG_SUM = SEG.reduce((a, b) => a + b, 0);           // == TERMINAL
const SEG_DUR = SEG.map(s => ADV_TRAVEL_MS * (s / SEG_SUM));
const ADVANCE_MS = ADV_TRAVEL_MS + TRIGGERS.length * ADV_PAUSE_MS; // 4500 + 6000 = 10500

// ===== Phase timing (ms) =====
const PH = {
  intro:   CHART_IN_AT + SPINE_IN_MS, // 3400
  advance: ADVANCE_MS,                // 10500
  missed:  1600,
  thesis:  2600,
  resolve: 2800,
} as const;
type MPhase = keyof typeof PH;
const ORDER: MPhase[] = ['intro', 'advance', 'missed', 'thesis', 'resolve'];
const TOTAL_MS = ORDER.reduce((s, p) => s + PH[p], 0);

function phaseStartM(id: MPhase): number {
  let t = 0;
  for (const p of ORDER) { if (p === id) return t; t += PH[p]; }
  return t;
}
function currentPhaseM(e: number): MPhase {
  let t = 0;
  for (const p of ORDER) { if (e < t + PH[p]) return p; t += PH[p]; }
  return 'resolve';
}
function progM(id: MPhase, e: number): number {
  const s = phaseStartM(id);
  return Math.max(0, Math.min(1, (e - s) / PH[id]));
}
function smooth(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/** Plan-fraction at the Today line for ms elapsed inside the advance phase. */
function progressAt(e: number): number {
  let t = 0;
  for (let i = 0; i < SEG.length; i++) {
    if (e < t + SEG_DUR[i]) {
      const f = smooth((e - t) / SEG_DUR[i]);
      return CHECK[i] + SEG[i] * f;
    }
    t += SEG_DUR[i];
    // Checkpoints 1..TRIGGERS.length are triggers → pause there (not the final one).
    if (i < SEG.length - 1) {
      if (e < t + ADV_PAUSE_MS) return CHECK[i + 1];
      t += ADV_PAUSE_MS;
    }
  }
  return TERMINAL;
}

// ===== Dynamic bar geometry (desktop math as a function of progress) =====
function dyn(p: number) {
  const buyoutEnd = Math.max(BUYOUT_END, Math.min(p, LOCK));
  const fabStart = buyoutEnd;
  const fabEnd = fabStart + FAB_LEN;
  const bufferStart = Math.max(BUFFER_START, fabEnd);
  const bufferWidth = Math.max(0, ONSITE - bufferStart);
  return { buyoutEnd, fabStart, fabEnd, bufferStart, bufferWidth };
}

type Stage = 0 | 1 | 2; // planned / warning / critical
const STAGE: { bar: string; border: string }[] = [
  { bar: 'rgba(100,116,139,0.35)', border: 'rgba(148,163,184,0.55)' },
  { bar: 'rgba(245,158,11,0.32)',  border: 'rgba(245,158,11,0.85)' },
  { bar: 'rgba(220,38,38,0.34)',   border: 'rgba(220,38,38,0.85)' },
];

// ===== Chart layout (px) — tuned for ~390px-wide portrait =====
const CW      = 344;  // centered chart width (leaves a horizontal margin each side)
const LABEL_W = 90;   // fixed row-label gutter width (within the chart)
const LINE_X  = 170;  // Today line x within the chart (kept near horizontal center)
const SCALE   = 150;  // px per plan-fraction (zoom). Chosen so the whole slipped
                      // schedule stays on screen — from the planned start through the
                      // line reaching Fabrication's late end (Onsite diamond included).
const ROW_H   = 22;
const ROW_GAP = 16;
const BAR_H   = 15;
const CHART_H = 4 * ROW_H + 3 * ROW_GAP; // 136
const CHART_TOP_PCT = 40;
const rowTop = (r: number) => r * (ROW_H + ROW_GAP);

const ROWS = [
  { row: 0, label: 'Buyout' },
  { row: 1, label: 'Fabrication' },
  { row: 2, label: 'Buffer' },
  { row: 3, label: 'Required Onsite' },
];

// Per-page-load "already played" flag (mirrors desktop). Resets on a full refresh
// (replays); persists across SPA navigation (skips on return).
let mobileHeroPlayedThisLoad = false;

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(mq.matches);
    const h = (e: MediaQueryListEvent) => setR(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return r;
}

export default function MobileHeroSequence() {
  const reducedMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const [skipped, setSkipped] = useState(() => mobileHeroPlayedThisLoad);
  const [replayKey, setReplayKey] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!skipped) mobileHeroPlayedThisLoad = true;
  }, [skipped]);

  useEffect(() => {
    if (reducedMotion || skipped) {
      setElapsed(TOTAL_MS);
      return;
    }
    const step = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const e = now - startRef.current;
      setElapsed(Math.min(e, TOTAL_MS));
      if (e < TOTAL_MS) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [reducedMotion, skipped, replayKey]);

  const handleReplay = () => {
    setSkipped(false);
    setElapsed(0);
    setReplayKey(k => k + 1);
  };

  const phase = currentPhaseM(elapsed);
  const complete = elapsed >= TOTAL_MS || skipped;
  const showSkip = !reducedMotion && !complete && elapsed > 2500;
  const showReplay = !reducedMotion && complete;

  // ===== Per-frame derived state =====

  // Intro framing line — reads alone, then fades as the chart fades in.
  const titleOpacity = (() => {
    if (phase !== 'intro') return 0;
    const e = elapsed - phaseStartM('intro');
    if (e < TITLE_IN_MS) return e / TITLE_IN_MS;
    if (e < TITLE_OUT_AT) return 1;
    if (e < TITLE_OUT_AT + TITLE_OUT_MS) return 1 - (e - TITLE_OUT_AT) / TITLE_OUT_MS;
    return 0;
  })();

  // Whole-chart opacity. Fades in after the framing line, holds through advance/missed,
  // clears at the start of thesis.
  const chartOpacity = (() => {
    if (phase === 'intro') {
      const e = elapsed - phaseStartM('intro');
      return smooth(Math.max(0, (e - CHART_IN_AT) / SPINE_IN_MS));
    }
    if (phase === 'advance' || phase === 'missed') return 1;
    if (phase === 'thesis') return Math.max(0, 1 - progM('thesis', elapsed) / 0.22);
    return 0;
  })();

  // Plan-fraction at the Today line.
  const progress = (() => {
    if (phase === 'intro') return 0;
    if (phase === 'advance') return progressAt(elapsed - phaseStartM('advance'));
    return TERMINAL; // missed / thesis / resolve hold at terminal slip
  })();

  const beyondOnsite = progress > ONSITE - 1e-3; // red from the onsite stop onward

  // Which stop is currently in effect (last trigger reached).
  const activeIdx = (() => {
    let idx = -1;
    for (let i = 0; i < TRIGGERS.length; i++) if (progress >= TRIGGERS[i] - 1e-4) idx = i;
    return idx;
  })();

  const showChartUi = phase === 'advance' || phase === 'missed';
  const packageIdx = showChartUi ? Math.max(0, activeIdx) : -1;

  // Caption (one at a time): failure note during advance, late line during missed.
  const caption = (() => {
    if (phase === 'advance' && activeIdx >= 0) {
      return { key: activeIdx, text: mobileStops[activeIdx].note, red: false };
    }
    if (phase === 'missed') return { key: 99, text: mobileLateLine, red: true };
    return null;
  })();

  // Dynamic bars.
  const d = dyn(progress);
  const bars = [
    { id: 'buyout', row: 0, start: 0,            width: d.buyoutEnd,            stage: (progress <= 0 ? 0 : progress > BUYOUT_END ? 2 : 1) as Stage },
    { id: 'fab',    row: 1, start: d.fabStart,   width: d.fabEnd - d.fabStart,  stage: (progress < BUYOUT_END ? 0 : d.fabEnd > ONSITE ? 2 : 1) as Stage },
    { id: 'buffer', row: 2, start: d.bufferStart, width: d.bufferWidth,         stage: (d.bufferStart > BUFFER_START + 1e-6 ? 1 : 0) as Stage },
  ];

  // Thesis line — scales up in amber, then fades as the hero copy arrives.
  const thesisOpacity = (() => {
    if (phase === 'thesis')  return smooth(Math.max(0, (progM('thesis', elapsed) - 0.12) / 0.4));
    if (phase === 'resolve') return Math.max(0, 1 - progM('resolve', elapsed) / 0.4);
    return 0;
  })();
  const thesisScale = phase === 'resolve' ? 1 : 0.82 + 0.18 * thesisOpacity;

  // House + hero copy fade in during resolve.
  const houseOpacity = phase === 'resolve' ? Math.min(1, progM('resolve', elapsed) / 0.5) : 0;
  const copyOpacity = phase === 'resolve'
    ? Math.max(0, Math.min(1, (progM('resolve', elapsed) - 0.3) / 0.5))
    : 0;

  const lineColor = beyondOnsite
    ? 'linear-gradient(to bottom, rgba(220,38,38,0.95), rgba(220,38,38,0.5))'
    : 'linear-gradient(to bottom, rgba(253,224,71,0.95), rgba(245,158,11,0.5))';

  return (
    <section className="relative overflow-hidden bg-[#030a19]" style={{ minHeight: '100svh' }}>
      {/* House render — fades in during resolve */}
      <div
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        style={{ opacity: houseOpacity }}
      >
        <img
          src={`${import.meta.env.BASE_URL}assets/hero/house-render.png`}
          alt="" aria-hidden="true"
          className="w-[90%] max-w-md h-auto object-contain"
          style={{ mixBlendMode: 'lighten' }}
        />
      </div>
      {houseOpacity > 0.001 && (
        <div
          className="absolute inset-0 bg-linear-to-t from-[#030a19]/60 via-[#030a19]/30 to-[#030a19]/70 pointer-events-none"
          style={{ opacity: houseOpacity }}
        />
      )}

      {/* Package label — pinned near the top, cycles per stop */}
      <div className="absolute left-6 right-6 flex justify-center pointer-events-none" style={{ top: '16%' }}>
        <AnimatePresence mode="wait">
          {packageIdx >= 0 && (
            <motion.div
              key={packageIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32 }}
              className="relative inline-flex flex-col items-start gap-0.5 pl-3 pr-4 py-2 rounded-md border bg-slate-900/85 backdrop-blur-xs"
              style={{ borderColor: 'rgba(245,158,11,0.40)' }}
            >
              <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-l" style={{ background: 'rgba(251,191,36,0.80)' }} />
              <span className="text-[9px] uppercase tracking-[0.2em] text-amber-300/60 font-medium">
                Procurement Package
              </span>
              <span className="text-sm font-semibold text-amber-100 tracking-tight whitespace-nowrap">
                {mobileStops[packageIdx].package}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrolling Gantt */}
      {chartOpacity > 0.001 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ top: `${CHART_TOP_PCT}%`, width: `${CW}px`, height: `${CHART_H}px`, opacity: chartOpacity }}
        >
          {/* Translated timeline layer (bars + onsite milestone) */}
          <div className="absolute inset-y-0 left-0 right-0" style={{ transform: `translateX(${LINE_X - progress * SCALE}px)` }}>
            {bars.map(b => b.width > 0.0001 && (
              <div
                key={b.id}
                className="absolute rounded-[3px] border overflow-hidden"
                style={{
                  left: `${b.start * SCALE}px`,
                  width: `${b.width * SCALE}px`,
                  top: `${rowTop(b.row) + (ROW_H - BAR_H) / 2}px`,
                  height: `${BAR_H}px`,
                  background: STAGE[b.stage].bar,
                  borderColor: STAGE[b.stage].border,
                  transition: 'background 300ms, border-color 300ms',
                }}
              />
            ))}
            {/* Required Onsite milestone (diamond) */}
            <div
              className="absolute"
              style={{
                left: `${ONSITE * SCALE}px`,
                top: `${rowTop(3) + ROW_H / 2}px`,
                transform: 'translate(-50%, -50%) rotate(45deg)',
                width: '11px', height: '11px',
                background: beyondOnsite ? 'rgba(220,38,38,0.85)' : 'rgba(148,163,184,0.6)',
                border: '1.5px solid',
                borderColor: beyondOnsite ? 'rgba(254,226,226,0.95)' : 'rgba(203,213,225,0.85)',
                transition: 'background 400ms, border-color 400ms',
              }}
            />
          </div>

          {/* Opaque mask — covers the gutter and the left margin so bars scrolling
              off the left vanish cleanly (extends well past the chart's left edge). */}
          <div className="absolute inset-y-0 bg-[#030a19]" style={{ left: `-${CW}px`, width: `${CW + LABEL_W}px`, zIndex: 10 }} />
          {/* Fixed row labels */}
          <div className="absolute inset-y-0 left-0" style={{ width: `${LABEL_W}px`, zIndex: 11 }}>
            {ROWS.map(r => (
              <div
                key={r.row}
                className="absolute text-[11px] font-medium text-slate-400 text-right pr-2 leading-tight"
                style={{ left: 0, right: 0, top: `${rowTop(r.row) + ROW_H / 2}px`, transform: 'translateY(-50%)' }}
              >
                {r.label}
              </div>
            ))}
          </div>

          {/* Fixed Today line */}
          <div
            className="absolute"
            style={{
              left: `${LINE_X}px`, top: 0, bottom: 0, width: '2px', zIndex: 20,
              background: lineColor,
              boxShadow: beyondOnsite ? '0 0 10px rgba(220,38,38,0.4)' : '0 0 10px rgba(245,158,11,0.35)',
            }}
          >
            <span
              className="absolute -translate-x-1/2 text-[8px] uppercase tracking-[0.18em] font-semibold px-1.5 py-0.5 rounded-full"
              style={{
                left: '1px', top: '-18px',
                color: beyondOnsite ? 'rgba(254,226,226,0.95)' : 'rgba(254,243,199,0.95)',
                background: '#030a19',
                border: `1px solid ${beyondOnsite ? 'rgba(220,38,38,0.7)' : 'rgba(245,158,11,0.7)'}`,
              }}
            >
              Today
            </span>
          </div>
        </div>
      )}

      {/* Failure-note caption — fixed below the chart, one at a time */}
      <div
        className="absolute left-0 right-0 px-6 text-center pointer-events-none"
        style={{ top: `calc(${CHART_TOP_PCT}% + ${CHART_H + 22}px)` }}
      >
        <AnimatePresence mode="wait">
          {caption && (
            <motion.p
              key={caption.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-xs font-semibold ${caption.red ? 'text-red-300' : 'text-amber-200/95'}`}
              style={{ textShadow: caption.red ? '0 0 8px rgba(248,113,113,0.45)' : '0 0 8px rgba(245,158,11,0.4)' }}
            >
              <span className={`inline-block w-1 h-1 mr-1.5 rounded-full align-middle ${caption.red ? 'bg-red-300' : 'bg-amber-300'}`} />
              {caption.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Intro framing line — reads alone before the chart appears */}
      {titleOpacity > 0.001 && (
        <div className="absolute inset-0 flex items-center justify-center px-8 pointer-events-none">
          <p
            className="text-center text-xl font-semibold tracking-tight leading-snug text-amber-300/90"
            style={{ opacity: titleOpacity }}
          >
            {introTitle}
          </p>
        </div>
      )}

      {/* Thesis line — scales up in amber, then fades as the hero copy arrives */}
      {thesisOpacity > 0.001 && (
        <div className="absolute inset-0 flex items-center justify-center px-8 pointer-events-none">
          <p
            className="text-center text-2xl font-bold tracking-tight"
            style={{
              opacity: thesisOpacity,
              transform: `scale(${thesisScale})`,
              color: 'rgb(252,211,77)',
              textShadow: '0 0 24px rgba(245,158,11,0.55)',
            }}
          >
            {thesisLine}
          </p>
        </div>
      )}

      {/* Hero copy — fades in over the house at the end */}
      {copyOpacity > 0.001 && (
        <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
          <div className="text-center px-2" style={{ opacity: copyOpacity }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/90 mb-5 leading-relaxed">
              {heroCopy.eyebrow}
            </p>
            <h1 className="text-4xl font-bold text-white mb-5 tracking-tight leading-[1.08]">
              {heroCopy.headline}
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              {heroCopy.subhead}
            </p>
          </div>
        </div>
      )}

      {/* Skip / Replay controls — styled to match desktop */}
      {showSkip && (
        <button
          onClick={() => setSkipped(true)}
          className="absolute top-4 right-4 z-30 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-white/45 hover:text-white/85 border border-white/10 hover:border-white/30 rounded-full transition-colors bg-[#030a19]/40 backdrop-blur-xs"
        >
          Skip animation
        </button>
      )}
      {showReplay && (
        <button
          onClick={handleReplay}
          className="absolute top-4 right-4 z-30 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-white/45 hover:text-white/85 border border-white/10 hover:border-white/30 rounded-full transition-colors bg-[#030a19]/40 backdrop-blur-xs"
        >
          Replay animation
        </button>
      )}
    </section>
  );
}
