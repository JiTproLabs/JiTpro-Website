/**
 * The Identify visual's camera over the register (Design System Section
 * 54.4.1, rewritten 2026-11-11).
 *
 * The register is the canonical Product Register screen — the fixed
 * 1448 x 1086 application canvas every other surface renders — and the
 * camera is the only thing that moves it. It moves the canvas by transform
 * only (translate, then scale, from the canvas's top-left), so layout never
 * changes.
 *
 * THREE VIEWS, TWO MOVES. The register arrives on its heading and summary
 * cards (`inventory`); the camera makes one vertical pan down to its rows
 * (`items`), at the same scale and left edge, so that move is a pan and
 * never a zoom; then, after a hold, it pulls back once to the whole
 * application (`overview`) and rests, as Plan's visual ends on the whole
 * Schedule screen (§54.4.2). The six-stop tour of the original visualization
 * (archived, see docs/design/archive/Identify_Original_Visualization.md) is
 * withdrawn; its cover-clamping and its overview are kept.
 *
 * NO EMPTY SPACE. Each view is clamped so the canvas covers the whole frame.
 * Between two covering views, translate and scale interpolate on the same
 * progress, so each canvas edge moves linearly between two positions outside
 * the frame: every in-between frame covers it too.
 *
 * The camera has no clock of its own: `identifyStateAt` (identifyStoryScene.ts)
 * supplies both moves' progress from the visual's one timeline (§46.3).
 */

/** The canonical screen's canvas (JiTproShell, DemoScreenFrame). */
export const CANVAS = { w: 1448, h: 1086 } as const;

/** Canvas landmarks, measured from the master (ProductTable, ProductRegisterScreen). */
const TITLE_TOP = 70; // just above the page title
const TABLE_TOP = 392; // just above the table header (y406)
/** From just left of the table (x227) to just right of the Status column (x842). */
const VIEW_LEFT = 215;
const VIEW_RIGHT = 857;

/** Below this the table text stops being comfortably readable (narrow frames). */
export const MIN_SCALE = 0.75;

export type ViewId = 'inventory' | 'items' | 'overview';
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

/**
 * The one scale both views use: the table from Product ID through Status
 * across the frame, and never below the readable minimum. On a narrow frame
 * the minimum wins and the view keeps the table's left: the names stay in
 * view and the right-hand columns are cropped.
 */
export function viewScale(f: Frame): number {
  return Math.max(f.w / (VIEW_RIGHT - VIEW_LEFT), MIN_SCALE);
}

export function cameraView(f: Frame, id: ViewId): CameraView {
  /* The whole application, as Plan's visual rests on it: its full width,
     from its top, at the smallest scale that covers the frame. The 4:3
     canvas is taller than the 16:10 frame, so its lowest strip (the last
     row's foot and the pager) is below the frame. */
  if (id === 'overview') return viewAt(f, coverScale(f), 0, 0);
  return viewAt(f, viewScale(f), VIEW_LEFT, id === 'inventory' ? TITLE_TOP : TABLE_TOP);
}

/** Weighted, so each end of a move is its view exactly. */
function between(a: CameraView, b: CameraView, u: number): CameraView {
  const mix = (from: number, to: number) => from * (1 - u) + to * u;
  return { x: mix(a.x, b.x), y: mix(a.y, b.y), scale: mix(a.scale, b.scale) };
}

/**
 * The camera `pan` of the way (0 to 1) from the heading to the rows, then
 * `out` of the way (0 to 1) from there back to the whole application.
 */
export function cameraAt(f: Frame, pan: number, out = 0): CameraView {
  const rows = between(cameraView(f, 'inventory'), cameraView(f, 'items'), pan);
  return out > 0 ? between(rows, cameraView(f, 'overview'), out) : rows;
}

export function transformOf(view: CameraView): string {
  return `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
}
