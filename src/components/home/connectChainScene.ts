/**
 * The Connect tab's visual, as pure state (Design System Section 54.4.3).
 *
 * ONE SCHEDULE. Connect continues Plan: it draws Plan's scene unchanged (the
 * same rows, application screen, timescale header and calendar grid) and the
 * same featured chain, laid out by the chain's own engine with its three
 * commitments kept and every status removed. Their required-by dates are
 * derived from that chain by the scheduling engine; nothing is authored here.
 *
 * ONE CLOCK (Sections 46.3, 54.4.3). `connectStateAt(scene, connect, frame, t)`
 * maps time to the camera and every opacity, in the same `PlanState` shape the
 * renderer already applies, plus the commitments' reveal.
 *
 *   1. The schedule      Plan's resting view, the application screen.
 *   2. Into the chain    zoom to the chain's start; the application and the
 *                        other rows fade out, the header and grid fade in.
 *   3. Forward           rest on Buyout, then travel forward, stopping at each
 *                        dependency in date order: diamond, connector, card,
 *                        then a hold to read it. On to Required On Site.
 *   4. The schedule      back to the application screen, and rest.
 */
import { buildChainLayout, type ChainCard, type Measure } from '../demo/screens/procurement-chain/chainLayout';
import { buildSteelWindowsPlannedChain, CHAIN_LABELS } from '../demo/screens/procurement-chain/chainScenario';
import type { ScheduleItem } from '../demo/screens/procurement-schedule/scheduleModel';
import {
  BUILD_MIN_SCALE,
  FOCAL_ITEM,
  OTHER_ITEMS,
  PLAN_FOCAL_REQUIRED_ON_SITE,
  REVEAL_RAMP,
  ZOOM_RAMP,
  buildScale,
  clamp01,
  ease,
  gridAt,
  headerAt,
  labelShiftsAt,
  lerp,
  lerpView,
  listLayout,
  scheduleView,
  sharedDomain,
  toScreen,
  viewInArea,
  type CameraView,
  type Frame,
  type PlanRow,
  type PlanScene,
  type PlanState,
} from './planChainScene';

/** Plan's featured chain, as planned: its commitments, and no status. */
export const CONNECT_ITEM: ScheduleItem = buildSteelWindowsPlannedChain(PLAN_FOCAL_REQUIRED_ON_SITE);

export const CONNECT_TIMING = {
  /** On Plan's resting view before the camera moves. */
  START_HOLD: 800,
  ZOOM_IN: 2400,
  /** On the chain's start, before the first move. */
  OPEN_HOLD: 1000,
  /** A move: a base plus its distance, so longer travel reads as longer. */
  MOVE_BASE: 900,
  MOVE_PER_PX: 1,
  MOVE_MIN: 1200,
  MOVE_MAX: 4000,
  /** A dependency's reveal, from the camera's arrival: diamond, connector, card. */
  MARK: 350,
  LEADER_AT: 200,
  LEADER: 500,
  CARD_AT: 550,
  CARD: 500,
  /** The card's rise as it fades in, canvas px. */
  CARD_RISE: 8,
  /** Held still to read the card. */
  READ: 2400,
  /** On Required On Site, before the return. */
  END_HOLD: 1200,
  ZOOM_OUT: 2400,
} as const;

/** Where the camera holds each station's point across the frame. */
const FRAC = { start: 0.04, dependency: 0.4, end: 0.95 } as const;
/** Canvas px across the frame at the build scale (Plan's BUILD_FRAME_VIEW_W). */
const VIEW_W = 700;
/** Below the bar: the first row of duration labels stays in view. */
const BELOW_BAR = 64;
/** Above the cards. */
const ABOVE_CARDS = 10;

export type Station = { x: number; frac: number; arrive: number; leave: number; card?: number };
export type Move = { from: Station; to: Station; start: number; end: number; dist: number };

export type ConnectScene = {
  /** The featured chain, with its cards, placed so its bar sits exactly where Plan's does. */
  focal: PlanRow;
  /** The cards in date order, and when each is revealed. */
  cards: (ChainCard & { revealAt: number })[];
  stations: Station[];
  moves: Move[];
  /** The canvas y the camera centres on in the chart. */
  cy: number;
  times: { zoomIn: number; travel: number; travelEnd: number; end: number };
};

export function buildConnectScene(scene: PlanScene, measure: Measure): ConnectScene {
  const domain = sharedDomain([FOCAL_ITEM, ...OTHER_ITEMS]);
  const layout = buildChainLayout(CONNECT_ITEM, { containerWidth: 0, measure, labels: CHAIN_LABELS, domain });
  const dy = scene.focal.dy + (scene.focal.layout.barTop - layout.barTop);
  const focal: PlanRow = { item: CONNECT_ITEM, layout, dy };
  const T = CONNECT_TIMING;

  const sorted = [...layout.commitments].sort((a, b) => a.markX - b.markX);
  const top = dy + Math.min(...sorted.map((c) => c.y)) - ABOVE_CARDS;
  const bottom = dy + layout.barBottom + BELOW_BAR;

  const stations: Station[] = [];
  const moves: Move[] = [];
  let clock: number = T.START_HOLD + T.ZOOM_IN;
  const first: Station = { x: scene.chainLeft, frac: FRAC.start, arrive: clock, leave: clock + T.OPEN_HOLD };
  stations.push(first);
  clock = first.leave;
  const travelTo = (x: number, frac: number, hold: number, card?: number) => {
    const from = stations[stations.length - 1];
    const dist = Math.abs(x - from.x - (frac - from.frac) * VIEW_W);
    const duration = Math.min(T.MOVE_MAX, Math.max(T.MOVE_MIN, T.MOVE_BASE + T.MOVE_PER_PX * dist));
    const to: Station = { x, frac, arrive: clock + duration, leave: clock + duration + hold, card };
    moves.push({ from, to, start: clock, end: to.arrive, dist });
    stations.push(to);
    clock = to.leave;
  };
  const cards = sorted.map((c, i) => {
    travelTo(c.markX, FRAC.dependency, T.CARD_AT + T.CARD + T.READ, i);
    return { ...c, revealAt: stations[stations.length - 1].arrive };
  });
  travelTo(scene.chainRight, FRAC.end, T.END_HOLD);

  return {
    focal,
    cards,
    stations,
    moves,
    cy: (top + bottom) / 2,
    times: { zoomIn: T.START_HOLD, travel: first.arrive, travelEnd: clock, end: clock + T.ZOOM_OUT },
  };
}

/** A dependency's reveal, 0 to 1 each. */
export type CardState = { mark: number; leader: number; card: number };

export type ConnectState = PlanState & { cards: CardState[] };

/**
 * As lerpView, but the screen point showing canvas point (ax, ay) travels in
 * a straight line, so the chain's start (or end) moves evenly on screen
 * through a large zoom. Same endpoints, scale path and easing.
 */
function lerpViewAnchored2(a: CameraView, b: CameraView, u: number, f: Frame, ax: number, ay: number): CameraView {
  if (u <= 0) return a;
  if (u >= 1) return b;
  const v = lerpView(a, b, u);
  const sx = (w: CameraView) => f.w / 2 + w.scale * (ax - w.cx);
  const sy = (w: CameraView) => f.h / 2 + w.scale * (ay - w.cy);
  return {
    scale: v.scale,
    cx: ax - (lerp(sx(a), sx(b), u) - f.w / 2) / v.scale,
    cy: ay - (lerp(sy(a), sy(b), u) - f.h / 2) / v.scale,
  };
}

/** The frame Connect draws in: no step list, so the chain's area is the whole frame. */
export const connectFrame = (f: Frame): Frame => ({ w: f.w, h: f.h, list: false });

export function connectStateAt(scene: PlanScene, c: ConnectScene, frame: Frame, t: number): ConnectState {
  const f = connectFrame(frame);
  const T = CONNECT_TIMING;
  const sB = buildScale(f);
  const area = listLayout(f).area;
  const { k, ox, oy } = scene.place;
  const app = scheduleView(scene, f);
  const stationView = (s: Station) => toScreen(scene, viewInArea(f, s.x, s.frac, sB, c.cy));
  const first = c.stations[0];
  const last = c.stations[c.stations.length - 1];
  const barCy = c.focal.dy + c.focal.layout.barTop + (c.focal.layout.barBottom - c.focal.layout.barTop) / 2;

  let view: CameraView;
  let others = 0;
  let appO = 0;
  let focalAxis = 1;
  let layer = 1;

  if (t < c.times.zoomIn) {
    view = app;
    others = 1;
    appO = 1;
    focalAxis = 0;
  } else if (t < c.times.travel) {
    const u = ease((t - c.times.zoomIn) / T.ZOOM_IN);
    view = lerpViewAnchored2(app, stationView(first), u, f, ox + k * scene.chainLeft, oy + k * barCy);
    others = 1 - ease((u - 0.15) / 0.5);
    appO = 1 - ease((u - 0.25) / 0.45);
    focalAxis = ease((u - 0.6) / 0.4);
  } else if (t < c.times.travelEnd) {
    const move = c.moves.find((m) => t >= m.start && t < m.end);
    if (!move) {
      const at = [...c.stations].reverse().find((s) => t >= s.arrive)!;
      view = stationView(at);
    } else {
      const tau = clamp01((t - move.start) / (move.end - move.start));
      const u = ease(tau);
      // A long move eases the camera back, leading the move, as Plan's long activity does.
      const fit = Math.min(sB, Math.max(BUILD_MIN_SCALE, (area.w * 0.85) / move.dist));
      const back = tau < 0.5 ? ease(tau / ZOOM_RAMP) : ease((1 - tau) / ZOOM_RAMP);
      const scale = sB - (sB - fit) * back;
      view = toScreen(scene, viewInArea(f, lerp(move.from.x, move.to.x, u), lerp(move.from.frac, move.to.frac, u), scale, c.cy));
    }
  } else {
    const u = ease((t - c.times.travelEnd) / T.ZOOM_OUT);
    view = lerpViewAnchored2(stationView(last), app, u, f, ox + k * scene.rosX, oy + k * barCy);
    layer = 1 - ease(u / 0.25);
    focalAxis = 1 - ease(u / 0.3);
    others = ease((u - 0.1) / 0.6);
    appO = ease((u - 0.3) / 0.55);
  }

  const cards = c.cards.map((card) => {
    const local = t - card.revealAt;
    return {
      mark: layer * ease(local / T.MARK),
      leader: layer * ease((local - T.LEADER_AT) / T.LEADER),
      card: layer * ease((local - T.CARD_AT) / T.CARD),
    };
  });

  return {
    view,
    edgeX: scene.steps[scene.steps.length - 1].to - 2 * REVEAL_RAMP,
    ros: 1,
    others,
    summary: 0,
    focalAxis,
    app: appO,
    list: { appear: scene.list.map(() => 0), active: scene.list.map(() => 0), morph: 0 },
    grid: gridAt(scene, view, focalAxis),
    header: headerAt(scene, f, view, focalAxis),
    labelShift: labelShiftsAt(scene, f, view),
    cards,
  };
}
