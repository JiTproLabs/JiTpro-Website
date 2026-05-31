import { useState, useEffect, useRef } from 'react';
import { Play, Pause, MousePointer2, Hand } from 'lucide-react';

// ============================================================================
// SCHEDULE DATA — real day counts per the user's spec
// ============================================================================

// Planned sub-phases for Bar 1 (Buyout / Submittal / Approval)
const PLANNED_BAR1 = [
  { id: 'buyout',    start: 0,  end: 5,  label: 'Buyout' },
  { id: 'submittal', start: 5,  end: 35, label: 'Submittal' },
  { id: 'review',    start: 35, end: 50, label: 'Review' },
];
// Planned sub-phases for Bar 2 (Fabrication / Delivery)
const PLANNED_BAR2 = [
  { id: 'fab',  start: 50,  end: 145, label: 'Fabrication' },
  { id: 'ship', start: 145, end: 153, label: 'Shipping' },
];
const PLANNED_BUFFER = { start: 153, end: 168 };
const PLANNED_ONSITE = 168;

// Actual sub-phases — Bar 1 stretches considerably due to slips
const ACTUAL_BAR1 = [
  { id: 'a-buyout',    start: 0,   end: 20,  label: 'Buyout',    tint: 'amber' as const },
  { id: 'a-submittal', start: 20,  end: 80,  label: 'Submittal', tint: 'amber' as const },
  { id: 'a-r1',        start: 80,  end: 95,  label: 'Review 1',  tint: 'amber' as const },
  { id: 'a-rev1',      start: 95,  end: 110, label: 'Rev. 1',    tint: 'red'   as const },
  { id: 'a-r2',        start: 110, end: 120, label: 'Review 2',  tint: 'amber' as const },
  { id: 'a-rev2',      start: 120, end: 128, label: 'Rev. 2',    tint: 'red'   as const },
  { id: 'a-r3',        start: 128, end: 137, label: 'Review 3',  tint: 'amber' as const },
];
const ACTUAL_BAR2 = { start: 137, end: 257, label: 'Fab + Delivery' };
const ACTUAL_END   = 257;
const ACTUAL_ONSITE = 168; // same milestone

// Visible chart timeline (gives the right side a little breathing room past day 257)
const CHART_DAYS = 270;
const PROJECT_START = new Date('2025-04-01T00:00:00');

// ============================================================================
// VIDEO SCRIPT — cursor anchors + bubble copy + timing
// ============================================================================

type AnchorRow = 'bar1' | 'bar2' | 'buffer';

interface Anchor {
  day: number;       // cursor target day
  motion: number;    // ms to move from previous anchor to this one
  row: AnchorRow;
  text: string;
}

const BUBBLE_FADE_MS = 350;
const BUBBLE_HOLD_MS = 1900;
const BUBBLE_CYCLE_MS = BUBBLE_FADE_MS * 2 + BUBBLE_HOLD_MS; // 2600

const PLANNED_ANCHORS: Anchor[] = [
  { day: 3,   motion: 1000, row: 'bar1',   text: 'Buyout planned for 5 days' },
  { day: 20,  motion: 1400, row: 'bar1',   text: '30-day submittal prep — confirmed by subcontractor' },
  { day: 45,  motion: 1400, row: 'bar1',   text: 'Assumed 1 round of review since this item is being expedited' },
  { day: 60,  motion: 1000, row: 'bar2',   text: 'Fabrication start date is critical' },
  { day: 130, motion: 2600, row: 'bar2',   text: '95 days for fabrication, 8 days for shipping' },
  { day: 160, motion: 1400, row: 'buffer', text: '15 days of buffer added' },
];

const ACTUAL_ANCHORS: Anchor[] = [
  { day: 20,  motion: 2200, row: 'bar1', text: 'Buyout actually takes 20 days, not 5' },
  { day: 50,  motion: 1500, row: 'bar1', text: 'Submittal delayed while design catches up — adds 30 days' },
  { day: 110, motion: 2400, row: 'bar1', text: 'Review cycle 1: 15 days, then 15 days of revisions' },
  { day: 125, motion: 800,  row: 'bar1', text: 'Review cycle 2: 10 days, then 8 days of revisions' },
  { day: 137, motion: 700,  row: 'bar1', text: 'Review cycle 3 finally approves — 137 days in' },
  { day: 200, motion: 2600, row: 'bar2', text: 'Contractor missed fab window — vendor takes 120 days, not 103' },
  { day: 250, motion: 2000, row: 'bar2', text: 'Material arrives 89 days past required onsite date' },
];

// Transition timing between planned → actual scenes
const TRANS_PRE_MS  = 800;  // hold on planned end
const TRANS_ANIM_MS = 1500; // bars morph
const TRANS_POST_MS = 500;  // settle before actual
const TRANSITION_MS = TRANS_PRE_MS + TRANS_ANIM_MS + TRANS_POST_MS;

// Final motion after the last anchor in each scene
const FINAL_MOTION_PLANNED_MS = 800; // → onsite milestone
const FINAL_MOTION_ACTUAL_MS  = 700; // → end of late delivery

// ============================================================================
// SEGMENT BUILDER — derives one flat list of timed events from the anchors
// ============================================================================

type Scene = 'planned' | 'actual';
type RowKey = AnchorRow | 'onsite';

interface Segment {
  type: 'motion' | 'pause' | 'transition';
  startMs: number;
  endMs: number;
  // motion:
  fromDay?: number;
  toDay?: number;
  fromRow?: RowKey;
  toRow?: RowKey;
  // pause:
  atDay?: number;
  atRow?: AnchorRow;
  text?: string;
  scene?: Scene;
}

function buildSegments(): Segment[] {
  const segs: Segment[] = [];
  let t = 0;

  // Planned scene
  let lastDay = 0;
  let lastRow: RowKey = 'bar1';
  for (const a of PLANNED_ANCHORS) {
    segs.push({ type: 'motion', startMs: t, endMs: t + a.motion, fromDay: lastDay, toDay: a.day, fromRow: lastRow, toRow: a.row, scene: 'planned' });
    t += a.motion;
    segs.push({ type: 'pause', startMs: t, endMs: t + BUBBLE_CYCLE_MS, atDay: a.day, atRow: a.row, text: a.text, scene: 'planned' });
    t += BUBBLE_CYCLE_MS;
    lastDay = a.day; lastRow = a.row;
  }
  // Final glide to the planned onsite milestone
  segs.push({ type: 'motion', startMs: t, endMs: t + FINAL_MOTION_PLANNED_MS, fromDay: lastDay, toDay: PLANNED_ONSITE, fromRow: lastRow, toRow: 'onsite', scene: 'planned' });
  t += FINAL_MOTION_PLANNED_MS;

  // Transition
  segs.push({ type: 'transition', startMs: t, endMs: t + TRANSITION_MS });
  t += TRANSITION_MS;

  // Actual scene
  lastDay = 0; lastRow = 'bar1';
  for (const a of ACTUAL_ANCHORS) {
    segs.push({ type: 'motion', startMs: t, endMs: t + a.motion, fromDay: lastDay, toDay: a.day, fromRow: lastRow, toRow: a.row, scene: 'actual' });
    t += a.motion;
    segs.push({ type: 'pause', startMs: t, endMs: t + BUBBLE_CYCLE_MS, atDay: a.day, atRow: a.row, text: a.text, scene: 'actual' });
    t += BUBBLE_CYCLE_MS;
    lastDay = a.day; lastRow = a.row;
  }
  // Final glide past onsite to the late-delivery endpoint
  segs.push({ type: 'motion', startMs: t, endMs: t + FINAL_MOTION_ACTUAL_MS, fromDay: lastDay, toDay: ACTUAL_END, fromRow: lastRow, toRow: 'bar2', scene: 'actual' });
  t += FINAL_MOTION_ACTUAL_MS;

  return segs;
}

const SEGMENTS = buildSegments();
const TOTAL_MS = SEGMENTS[SEGMENTS.length - 1].endMs;

// ============================================================================
// LAYOUT CONSTANTS (percentages of the chart container)
// ============================================================================

const LABEL_COL_PCT = 22; // left column for row labels (P6-style)
const RIGHT_PAD_PCT = 4;
const BAR_AREA_PCT = 100 - LABEL_COL_PCT - RIGHT_PAD_PCT;

const ROW_Y_PCT: Record<RowKey, number> = {
  bar1:   22,
  bar2:   46,
  buffer: 64,
  onsite: 76,
};
const BAR_HEIGHT_PCT = 7;

function dayToXPct(day: number): number {
  return LABEL_COL_PCT + (day / CHART_DAYS) * BAR_AREA_PCT;
}
function dayWidthPct(days: number): number {
  return (days / CHART_DAYS) * BAR_AREA_PCT;
}
function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}
function formatDate(day: number): string {
  const d = new Date(PROJECT_START);
  d.setDate(d.getDate() + day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ============================================================================
// STATE EXTRACTORS — pure functions of elapsedMs
// ============================================================================

function getCurrentScene(elapsedMs: number): Scene | 'transition' {
  for (const s of SEGMENTS) {
    if (elapsedMs < s.endMs) return s.type === 'transition' ? 'transition' : s.scene!;
  }
  return 'actual';
}

interface CursorState {
  day: number;
  yPct: number;
  visible: boolean;
  isHand: boolean;
}

function getCursorState(elapsedMs: number): CursorState {
  const seg = SEGMENTS.find(s => elapsedMs >= s.startMs && elapsedMs < s.endMs)
    ?? SEGMENTS[SEGMENTS.length - 1];

  if (seg.type === 'motion') {
    const t = (elapsedMs - seg.startMs) / (seg.endMs - seg.startMs);
    const e = smoothstep(t);
    const day = (seg.fromDay ?? 0) + ((seg.toDay ?? 0) - (seg.fromDay ?? 0)) * e;
    const fromY = ROW_Y_PCT[seg.fromRow ?? 'bar1'];
    const toY   = ROW_Y_PCT[seg.toRow   ?? 'bar1'];
    return { day, yPct: fromY + (toY - fromY) * e, visible: true, isHand: false };
  }
  if (seg.type === 'pause') {
    return { day: seg.atDay ?? 0, yPct: ROW_Y_PCT[seg.atRow ?? 'bar1'], visible: true, isHand: true };
  }
  // Transition — cursor visible at last planned position during PRE, fades during anim, hidden after.
  const into = elapsedMs - seg.startMs;
  if (into < TRANS_PRE_MS) {
    return { day: PLANNED_ONSITE, yPct: ROW_Y_PCT.onsite, visible: true, isHand: false };
  }
  if (into < TRANS_PRE_MS + TRANS_ANIM_MS / 2) {
    return { day: PLANNED_ONSITE, yPct: ROW_Y_PCT.onsite, visible: true, isHand: false };
  }
  return { day: 0, yPct: ROW_Y_PCT.bar1, visible: false, isHand: false };
}

interface BubbleState {
  text: string;
  opacity: number;
  anchorDay: number;
  anchorRow: AnchorRow;
}

function getActiveBubble(elapsedMs: number): BubbleState | null {
  for (const s of SEGMENTS) {
    if (s.type !== 'pause') continue;
    if (elapsedMs < s.startMs) break;
    if (elapsedMs >= s.endMs) continue;
    const into = elapsedMs - s.startMs;
    let opacity: number;
    if (into < BUBBLE_FADE_MS) opacity = into / BUBBLE_FADE_MS;
    else if (into < BUBBLE_FADE_MS + BUBBLE_HOLD_MS) opacity = 1;
    else opacity = Math.max(0, 1 - (into - BUBBLE_FADE_MS - BUBBLE_HOLD_MS) / BUBBLE_FADE_MS);
    return { text: s.text!, opacity, anchorDay: s.atDay!, anchorRow: s.atRow! };
  }
  return null;
}

function getTransitionT(elapsedMs: number): number {
  const seg = SEGMENTS.find(s => s.type === 'transition');
  if (!seg) return 0;
  if (elapsedMs < seg.startMs + TRANS_PRE_MS) return 0;
  const animEnd = seg.startMs + TRANS_PRE_MS + TRANS_ANIM_MS;
  if (elapsedMs >= animEnd) return 1;
  return smoothstep((elapsedMs - seg.startMs - TRANS_PRE_MS) / TRANS_ANIM_MS);
}

// ============================================================================
// SECTION (top-level)
// ============================================================================

type Playback = 'initial' | 'playing' | 'paused' | 'ended';

export default function TypicalScheduleSection() {
  const [elapsed, setElapsed] = useState(0);
  const [playback, setPlayback] = useState<Playback>('initial');
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (playback !== 'playing') { lastFrameRef.current = null; return; }
    const step = (now: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = now;
      const delta = now - lastFrameRef.current;
      lastFrameRef.current = now;
      setElapsed(prev => {
        const next = prev + delta;
        if (next >= TOTAL_MS) { setPlayback('ended'); return TOTAL_MS; }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); lastFrameRef.current = null; };
  }, [playback]);

  const handlePlay = () => {
    if (playback === 'ended') setElapsed(0);
    setPlayback('playing');
  };
  const handlePause = () => setPlayback('paused');

  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 lg:items-center">
          {/* LEFT — context */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-snug">
              Typical Procurement Schedules Hide the Real Risks
            </h2>
            <div className="text-lg text-slate-600 leading-relaxed space-y-5 mb-6">
              <p>Most schedules show a clean sequence: buyout, fabrication, delivery, onsite.</p>
              <p>
                What they don't show is everything that quietly slips inside each phase — the
                design that wasn't ready, the buyout that took an extra cycle, the buffers that
                get consumed without anyone noticing.
              </p>
              <p className="text-slate-900 font-medium">
                The result: late deliveries that didn't have to happen.
              </p>
            </div>
            <p className="text-sm text-slate-500 italic">
              Press play to watch a real procurement schedule — then watch what actually happens.
            </p>
          </div>

          {/* RIGHT — video player */}
          <div>
            <VideoPlayer
              elapsed={elapsed}
              playback={playback}
              onPlay={handlePlay}
              onPause={handlePause}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VIDEO PLAYER (fixed aspect ratio; nothing inside ever resizes)
// ============================================================================

function VideoPlayer({
  elapsed, playback, onPlay, onPause,
}: {
  elapsed: number;
  playback: Playback;
  onPlay: () => void;
  onPause: () => void;
}) {
  const scene    = getCurrentScene(elapsed);
  const cursor   = getCursorState(elapsed);
  const bubble   = getActiveBubble(elapsed);
  const transT   = getTransitionT(elapsed);
  const progress = elapsed / TOTAL_MS;

  const title =
    scene === 'planned'    ? 'Planned Procurement Schedule' :
    scene === 'transition' ? "What Actually Happens…" :
                             'Actual Procurement Schedule';

  return (
    <div
      className="relative bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col select-none"
      style={{ aspectRatio: '720 / 500' }}
    >
      {/* Title strip */}
      <div className="h-7 px-4 flex items-center bg-slate-800/90 border-b border-slate-700 text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-300">
        {title}
      </div>

      {/* Chart area */}
      <div className="flex-1 relative bg-[#0f172a]">
        <ChartArea scene={scene} transT={transT} cursor={cursor} bubble={bubble} />
      </div>

      {/* Bottom controls strip */}
      <div className="relative h-1 bg-slate-800">
        <div className="absolute inset-y-0 left-0 bg-amber-500" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* Centered Play / Replay overlay (initial + ended only) */}
      {(playback === 'initial' || playback === 'ended') && (
        <button
          type="button"
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center group bg-black/30 backdrop-blur-[2px]"
          aria-label={playback === 'ended' ? 'Replay' : 'Play'}
        >
          <span className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white shadow-2xl flex items-center justify-center transition">
            <Play className="w-10 h-10 text-slate-900 ml-1" fill="currentColor" />
          </span>
          {playback === 'ended' && (
            <span className="absolute bottom-10 text-xs uppercase tracking-[0.2em] text-white/90 font-semibold">
              Replay
            </span>
          )}
        </button>
      )}

      {/* Corner play/pause button — NOT centered (only visible mid-playback) */}
      {(playback === 'playing' || playback === 'paused') && (
        <button
          type="button"
          onClick={playback === 'playing' ? onPause : onPlay}
          className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center transition"
          aria-label={playback === 'playing' ? 'Pause' : 'Play'}
        >
          {playback === 'playing'
            ? <Pause className="w-4 h-4" fill="currentColor" />
            : <Play  className="w-4 h-4 ml-0.5" fill="currentColor" />
          }
        </button>
      )}
    </div>
  );
}

// ============================================================================
// CHART AREA — bars, axis, cursor, bubble all live here
// ============================================================================

function ChartArea({
  scene, transT, cursor, bubble,
}: {
  scene: Scene | 'transition';
  transT: number;
  cursor: CursorState;
  bubble: BubbleState | null;
}) {
  // The Buffer row only renders during Planned (in actual the buffer is gone).
  // The chart itself never resizes — only the row's contents change.

  return (
    <div className="absolute inset-0">
      {/* Row labels (left column) */}
      <RowLabel y={ROW_Y_PCT.bar1}>Buyout / Submittal / Approval</RowLabel>
      <RowLabel y={ROW_Y_PCT.bar2}>Fabrication / Delivery</RowLabel>
      <RowLabel y={ROW_Y_PCT.buffer} faded={scene !== 'planned' && transT > 0.5}>Buffer</RowLabel>
      <RowLabel y={ROW_Y_PCT.onsite}>Required On-Site</RowLabel>

      {/* Onsite reference dashed line — spans whole chart */}
      <div
        className="absolute border-l border-dashed border-slate-600 pointer-events-none"
        style={{ left: `${dayToXPct(PLANNED_ONSITE)}%`, top: '12%', bottom: '14%' }}
      />

      {/* Bars — morph from planned to actual based on transT */}
      <Bars transT={transT} />

      {/* Onsite diamond */}
      <OnsiteMilestone alarmed={transT > 0.6} />

      {/* Date axis */}
      <DateAxis />

      {/* Cursor */}
      <Cursor cursor={cursor} />

      {/* Bubble */}
      {bubble && <BubbleCallout bubble={bubble} />}
    </div>
  );
}

function RowLabel({ y, children, faded = false }: { y: number; children: React.ReactNode; faded?: boolean }) {
  return (
    <div
      className={`absolute text-[10px] md:text-[11px] uppercase tracking-wider font-medium pr-2 text-right transition-opacity duration-500 ${
        faded ? 'text-slate-600' : 'text-slate-400'
      }`}
      style={{
        left: 0,
        width: `${LABEL_COL_PCT - 1}%`,
        top: `${y}%`,
        transform: 'translateY(-50%)',
        opacity: faded ? 0.35 : 1,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// BARS — render planned sub-segments and morph to actual via transT
// ============================================================================

function Bars({ transT }: { transT: number }) {
  // For each "logical bar", we interpolate sub-segment positions between
  // planned and actual. To keep things sane we crossfade between the two sets:
  //  - Planned set fully visible at transT=0, fades out toward transT=0.5
  //  - Actual set fades in from transT=0.5 to transT=1
  // The Onsite milestone and Buffer follow similar rules.
  const plannedOpacity = transT < 0.5 ? 1 - transT * 1.4 : 0;
  const actualOpacity  = transT > 0.4 ? Math.min(1, (transT - 0.4) / 0.5) : 0;

  return (
    <>
      {/* Planned bars */}
      <g style={{ opacity: Math.max(0, plannedOpacity) }}>
        {/* Bar 1 sub-segments */}
        {PLANNED_BAR1.map(s => (
          <Segment key={s.id}
            startDay={s.start} endDay={s.end}
            y={ROW_Y_PCT.bar1}
            tint="planned" label={s.label}
          />
        ))}
        {/* Bar 2 sub-segments */}
        {PLANNED_BAR2.map(s => (
          <Segment key={s.id}
            startDay={s.start} endDay={s.end}
            y={ROW_Y_PCT.bar2}
            tint="planned" label={s.label}
          />
        ))}
        {/* Buffer */}
        <Segment
          startDay={PLANNED_BUFFER.start} endDay={PLANNED_BUFFER.end}
          y={ROW_Y_PCT.buffer}
          tint="buffer" label="Buffer"
        />
      </g>

      {/* Actual bars */}
      <g style={{ opacity: Math.max(0, actualOpacity) }}>
        {ACTUAL_BAR1.map(s => (
          <Segment key={s.id}
            startDay={s.start} endDay={s.end}
            y={ROW_Y_PCT.bar1}
            tint={s.tint === 'red' ? 'actualBad' : 'actual'}
            label={s.label}
          />
        ))}
        {/* Actual Bar 2 — split visually at onsite into amber (on-time portion) + red (late portion) */}
        <Segment
          startDay={ACTUAL_BAR2.start}
          endDay={Math.min(ACTUAL_ONSITE, ACTUAL_BAR2.end)}
          y={ROW_Y_PCT.bar2}
          tint="actual" label="Fab + Delivery"
        />
        {ACTUAL_BAR2.end > ACTUAL_ONSITE && (
          <Segment
            startDay={ACTUAL_ONSITE}
            endDay={ACTUAL_BAR2.end}
            y={ROW_Y_PCT.bar2}
            tint="late" label="Late"
          />
        )}
      </g>
    </>
  );
}

function Segment({
  startDay, endDay, y, tint, label,
}: {
  startDay: number; endDay: number; y: number;
  tint: 'planned' | 'actual' | 'actualBad' | 'late' | 'buffer';
  label: string;
}) {
  const palette = {
    planned:   { bg: 'rgba(148, 163, 184, 0.45)', border: 'rgba(148, 163, 184, 0.95)', text: 'rgb(226, 232, 240)' },
    actual:    { bg: 'rgba(252, 211, 77, 0.70)',  border: 'rgba(245, 158, 11, 1)',     text: 'rgb(120, 53, 15)' },
    actualBad: { bg: 'rgba(251, 146, 60, 0.75)',  border: 'rgba(234, 88, 12, 1)',      text: 'rgb(120, 53, 15)' },
    late:      { bg: 'rgba(248, 113, 113, 0.85)', border: 'rgba(220, 38, 38, 1)',      text: 'rgb(127, 29, 29)' },
    buffer:    { bg: 'transparent',                border: 'rgba(148, 163, 184, 0.85)', text: 'rgb(148, 163, 184)' },
  }[tint];

  const w = dayWidthPct(endDay - startDay);
  return (
    <div
      className="absolute rounded-[2px] flex items-center overflow-hidden"
      style={{
        left: `${dayToXPct(startDay)}%`,
        top:  `${y}%`,
        width: `${w}%`,
        height: `${BAR_HEIGHT_PCT}%`,
        transform: 'translateY(-50%)',
        background: palette.bg,
        backgroundImage: tint === 'buffer'
          ? 'repeating-linear-gradient(45deg, transparent 0 4px, rgba(148,163,184,0.30) 4px 6px)'
          : undefined,
        border: `1px ${tint === 'buffer' ? 'dashed' : 'solid'} ${palette.border}`,
      }}
    >
      {/* Sub-segment label — only render when bar is wide enough */}
      {w > 5 && (
        <span
          className="px-1.5 text-[9px] font-medium tracking-wide whitespace-nowrap"
          style={{ color: palette.text }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function OnsiteMilestone({ alarmed }: { alarmed: boolean }) {
  return (
    <div
      className="absolute transition-colors duration-500"
      style={{
        left: `calc(${dayToXPct(PLANNED_ONSITE)}% - 8px)`,
        top: `${ROW_Y_PCT.onsite}%`,
        transform: 'translateY(-50%) rotate(45deg)',
        width: 14, height: 14,
        background: alarmed ? 'rgb(220, 38, 38)' : 'rgb(148, 163, 184)',
        border: '2px solid',
        borderColor: alarmed ? 'rgb(254, 226, 226)' : 'rgb(203, 213, 225)',
      }}
      aria-label="Required Onsite Date"
    />
  );
}

// ============================================================================
// CURSOR — mouse-pointer SVG that flips to a hand on bar hover
// ============================================================================

function Cursor({ cursor }: { cursor: CursorState }) {
  if (!cursor.visible) return null;
  const Icon = cursor.isHand ? Hand : MousePointer2;
  return (
    <div
      className="absolute pointer-events-none transition-opacity duration-150"
      style={{
        left: `${dayToXPct(cursor.day)}%`,
        top:  `${cursor.yPct}%`,
        transform: 'translate(-3px, -3px)',
        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.55))',
      }}
    >
      <Icon
        className="w-5 h-5"
        color="white"
        strokeWidth={1.5}
        fill={cursor.isHand ? 'rgba(255,255,255,0.15)' : 'white'}
      />
    </div>
  );
}

// ============================================================================
// BUBBLE — fades in over its anchor with a leader pointing down to it
// ============================================================================

function BubbleCallout({ bubble }: { bubble: BubbleState }) {
  if (bubble.opacity <= 0.001) return null;
  const anchorX = dayToXPct(bubble.anchorDay);
  const anchorY = ROW_Y_PCT[bubble.anchorRow];

  // Bubble vertical: sits above the anchor row. Keep distance modest so leader fits.
  const bubbleBottomPct = 100 - (anchorY - BAR_HEIGHT_PCT / 2 - 1); // 1% gap above bar
  // Bubble horizontal: anchored at anchorX, but clamped to stay in chart.
  // We use translate(-50%) for centering and then clamp via two helper offsets:
  //  - If anchorX is in the left edge zone, shift right; right edge zone shift left.
  let shift = '-50%';
  if (anchorX < LABEL_COL_PCT + 12) shift = '-10%';
  else if (anchorX > 100 - 12)       shift = '-90%';

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${anchorX}%`,
        bottom: `${bubbleBottomPct}%`,
        transform: `translateX(${shift})`,
        opacity: bubble.opacity,
        maxWidth: '220px',
        minWidth: '160px',
      }}
    >
      <div className="relative bg-white border border-slate-300 rounded-md px-3 py-2 shadow-[0_4px_14px_rgba(0,0,0,0.35)] text-[11px] leading-snug text-slate-800 font-medium">
        {bubble.text}
      </div>
      {/* Leader line + arrow tip pointing down at the anchor */}
      <div
        className="absolute"
        style={{
          left: shift === '-10%' ? '10%' : shift === '-90%' ? '90%' : '50%',
          top: '100%',
          width: '1px',
          height: '10px',
          background: 'rgba(148, 163, 184, 0.85)',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        className="absolute w-2 h-2 bg-white border-r border-b border-slate-300 rotate-45"
        style={{
          left: shift === '-10%' ? '10%' : shift === '-90%' ? '90%' : '50%',
          top: 'calc(100% + 4px)',
          transform: 'translateX(-50%) rotate(45deg)',
        }}
      />
    </div>
  );
}

// ============================================================================
// DATE AXIS — tick marks every 30 days with date labels
// ============================================================================

function DateAxis() {
  const ticks: number[] = [];
  for (let d = 0; d <= CHART_DAYS; d += 30) ticks.push(d);
  return (
    <div className="absolute left-0 right-0" style={{ top: '86%', height: '14%' }}>
      {/* baseline */}
      <div
        className="absolute h-px bg-slate-700"
        style={{ left: `${LABEL_COL_PCT}%`, right: `${RIGHT_PAD_PCT}%`, top: 0 }}
      />
      {ticks.map(d => (
        <div key={d} className="absolute" style={{ left: `${dayToXPct(d)}%`, top: 0 }}>
          <div className="w-px h-1.5 bg-slate-600" />
          <div className="text-[9px] text-slate-400 mt-0.5 -translate-x-1/2 whitespace-nowrap">
            {formatDate(d)}
          </div>
        </div>
      ))}
    </div>
  );
}
