/**
 * The Identify register preview's camera (Design System Section 54.4.1,
 * amended 2026-11-10).
 *
 * The preview is the canonical Product Register screen — the fixed
 * 1448 x 1086 application canvas every other surface renders — and the
 * camera is the only thing that moves. It moves the canvas by transform
 * only (translate, then scale, from the canvas's top-left), so layout never
 * changes.
 *
 * ONE TIMELINE (§46.3). Every time is declared here, measured from the
 * moment the preview's single `played` state turns true (the same state the
 * checklist plays on).
 *
 * NO EMPTY SPACE. Every view is clamped so the canvas covers the whole
 * frame. Between two covering views, translate and scale interpolate on the
 * same progress, so each canvas edge moves linearly between two positions
 * outside the frame: every in-between frame covers it too.
 */

/** The canonical screen's canvas (JiTproShell, DemoScreenFrame). */
export const CANVAS = { w: 1448, h: 1086 } as const;

/**
 * The checklist's last line and check finish by 2070 ms (AudienceSection,
 * §54.2.1). The camera holds the overview until after that, so it never
 * moves beside the checklist (§46.4).
 */
export const CHECKLIST_END_MS = 2070;
export const CAMERA_HOLD_UNTIL_MS = 2400;

/** Canvas landmarks, measured from the master (ProductTable, ProductRegisterScreen). */
const MAIN_X = 206; // the main column's left edge, right of the sidebar
const TITLE_TOP = 70; // just above the page title
const TABLE_X = 227; // the table's left edge
const TABLE_TOP = 392; // just above the table header (y406)
const COL = {
  tradeToStatus: { from: 540, to: 842 },
  leadAndRoS: { from: 842, to: 1023 },
} as const;
const DETAIL_SOURCE_TOP = 560; // frames the panel's Procurement and Source Information

/** Canvas px across the frame while touring, and at rest. */
const TOUR_VIEW_W = 600;
const REST_VIEW_W = 700;
/** Below these the text stops being comfortably readable (narrow frames). */
const TOUR_MIN_SCALE = 0.85;
const REST_MIN_SCALE = 0.75;

type Stop = {
  id: 'overview' | 'items' | 'trades' | 'dates' | 'source' | 'rest';
  /** Arrival, ms after `played`. */
  at: number;
};

/** The progression (§54.4.1): each stop's arrival. */
export const STOPS: readonly Stop[] = [
  { id: 'overview', at: CAMERA_HOLD_UNTIL_MS },
  { id: 'items', at: CAMERA_HOLD_UNTIL_MS + 1400 },
  { id: 'trades', at: CAMERA_HOLD_UNTIL_MS + 2800 },
  { id: 'dates', at: CAMERA_HOLD_UNTIL_MS + 4000 },
  { id: 'source', at: CAMERA_HOLD_UNTIL_MS + 5400 },
  { id: 'rest', at: CAMERA_HOLD_UNTIL_MS + 7000 },
];
export const CAMERA_DURATION_MS = STOPS[STOPS.length - 1].at;

export type Frame = { w: number; h: number };
/** The canvas's top-left in the frame, and its scale. */
export type CameraView = { x: number; y: number; scale: number };

/** The smallest scale at which the canvas still covers the frame. */
export function coverScale(f: Frame): number {
  return Math.max(f.w / CANVAS.w, f.h / CANVAS.h);
}

/** Puts canvas point (left, top) at the frame's top-left, then clamps to cover. */
function viewAt(f: Frame, scale: number, left: number, top: number): CameraView {
  const s = Math.max(scale, coverScale(f));
  const clamp = (v: number, min: number) => Math.min(0, Math.max(min, v));
  return {
    x: clamp(-s * left, f.w - s * CANVAS.w),
    y: clamp(-s * top, f.h - s * CANVAS.h),
    scale: s,
  };
}

/** Puts a canvas x range's centre at the frame's centre. */
function centredOn(f: Frame, scale: number, from: number, to: number, top: number): CameraView {
  const s = Math.max(scale, coverScale(f));
  return viewAt(f, s, (from + to) / 2 - f.w / s / 2, top);
}

export function cameraView(f: Frame, id: Stop['id']): CameraView {
  const tour = Math.max(f.w / TOUR_VIEW_W, TOUR_MIN_SCALE);
  switch (id) {
    case 'overview':
      /* The whole interface, as large as covering allows: the full width,
         from the top. */
      return viewAt(f, coverScale(f), 0, 0);
    case 'items':
      return viewAt(f, tour, TABLE_X - 12, TABLE_TOP);
    case 'trades':
      return centredOn(f, tour, COL.tradeToStatus.from, COL.tradeToStatus.to, TABLE_TOP);
    case 'dates':
      return centredOn(f, tour, COL.leadAndRoS.from, COL.leadAndRoS.to, TABLE_TOP);
    case 'source':
      /* The Source column and the detail panel's Source Information. */
      return viewAt(f, tour, CANVAS.w, DETAIL_SOURCE_TOP);
    case 'rest':
      return viewAt(f, Math.max(f.w / REST_VIEW_W, REST_MIN_SCALE), MAIN_X, TITLE_TOP);
  }
}

export function transformOf(view: CameraView): string {
  return `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
}

/** Web Animations keyframes for the whole pass, from `played`. */
export function cameraKeyframes(f: Frame): Keyframe[] {
  const frame = (id: Stop['id'], ms: number): Keyframe => ({
    offset: ms / CAMERA_DURATION_MS,
    transform: transformOf(cameraView(f, id)),
    easing: 'ease-in-out',
  });
  return [frame('overview', 0), ...STOPS.map((s) => frame(s.id, s.at))];
}
