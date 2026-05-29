// LEGACY — backup of the previous hero animation data (PI cards + streams metaphor).
// Replaced by the Gantt/two-scenario hero on 2026-05-28. Kept for safe revert.
// To restore: rename this back to heroAnimationData.ts and restore ProcurementFlowHero.legacy.tsx.

// PI CARDS AND PATHS ARE ONE LINKED UNIT.
// Never modify a card's label, notes, or order without updating its geometry.
// The number of processNotes determines how many streams and convergences the path has.
// streams = processNotes.length + 1, convergences = processNotes.length

function sr(s: number) { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

function makePath(start: [number, number], end: [number, number], seed: number, curve: number = 30): [number, number][] {
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return [start, end];
  const perpX = -dy / len;
  const perpY = dx / len;
  const offset = (sr(seed) - 0.5) * curve;
  const ctrl: [number, number] = [
    Math.round(midX + perpX * offset),
    Math.round(Math.max(50, Math.min(660, midY + perpY * offset))),
  ];
  return [start, ctrl, end];
}

function toPathStr(pts: [number, number][]): string {
  if (pts.length === 3) {
    return `M ${pts[0][0]} ${pts[0][1]} Q ${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]}`;
  }
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
}

// ===== PI CARD DEFINITIONS =====

export interface CardConfig {
  label: string;
  yPosition: number;
  processNotes: string[];
}

export const cardConfigs: CardConfig[] = [
  {
    label: 'Structural Steel',
    yPosition: 240,
    processNotes: ['Buyout Complete', 'Architectural & Engineer Coordination', 'Submittal & Review Cycle', 'Fabrication Approved'],
  },
  {
    label: 'Steel Door & Window Package',
    yPosition: 420,
    processNotes: ['Shop Drawings Submitted', 'Glazing Spec Approved', 'Frame Fabrication Complete'],
  },
  {
    label: 'Custom Cabinetry',
    yPosition: 350,
    processNotes: ['Buyout Cabinet Purchase Order', 'Submittal Coordination', 'Review and Approval', 'Start Fabrication'],
  },
  {
    label: 'HVAC Equipment',
    yPosition: 410,
    processNotes: ['Load Calcs Approved', 'Equipment Order Placed', 'Factory Testing Complete'],
  },
  {
    label: 'Statuary Marble Countertops',
    yPosition: 300,
    processNotes: ['Selection Approved', 'Slab Layout Confirmed', 'Fabrication Complete'],
  },
  {
    label: 'Lighting Package',
    yPosition: 370,
    processNotes: ['Fixture Schedule Confirmed', 'Submittal Approved', 'Lead Time Confirmed'],
  },
];

// ===== DYNAMIC TIMING =====

export const PAUSE_FRAC = 0.05;

export function getTimingForCard(numConv: number) {
  const convFracs: number[] = [];
  for (let i = 0; i < numConv; i++) {
    convFracs.push(((i + 1) / (numConv + 1.5)) * 0.82);
  }
  const finalFrac = convFracs[numConv - 1] + PAUSE_FRAC;
  return { convFracs, finalFrac };
}

// ===== STREAM GEOMETRY PER CARD (dynamic convergence count) =====

export interface CardGeometry {
  streams: { waypoints: [number, number][]; pathStr: string }[];
  mergedPaths: { waypoints: [number, number][]; pathStr: string }[];
  convergences: [number, number][];
  cardEndpoint: [number, number];
}

function buildCardGeometry(cardY: number, seed: number, numConv: number): CardGeometry {
  const numStreams = numConv + 1;
  const roomAbove = cardY - 140;
  const roomBelow = 560 - cardY;
  const maxSpread = Math.min(roomAbove, roomBelow, 200);
  const spread = Math.max(80, Math.min(maxSpread, 120 + numStreams * 15));

  const startYs: number[] = [];
  const startXs: number[] = [];
  for (let i = 0; i < numStreams; i++) {
    const t = numStreams === 1 ? 0.5 : i / (numStreams - 1);
    const y = cardY + (t - 0.5) * spread * 2.5;
    startYs.push(Math.max(140, Math.min(580, Math.round(y + (sr(seed + i) - 0.5) * 60))));
    startXs.push(Math.round(10 + sr(seed + i * 3 + 20) * 120));
  }
  startYs.sort((a, b) => a - b);

  const convergences: [number, number][] = [];
  // First merge: randomly weight toward upper or lower stream
  const firstBias = sr(seed + 50) > 0.5 ? 0.7 : 0.3;
  let mergedY = startYs[0] * firstBias + startYs[1] * (1 - firstBias);
  for (let i = 0; i < numConv; i++) {
    const t = (i + 1) / (numConv + 1);
    const cx = Math.round(150 + t * 850 + (sr(seed + 10 + i) - 0.5) * 25);
    if (i > 0) {
      // Randomly weight toward the existing merged line or the incoming stream
      const bias = sr(seed + 50 + i * 7) > 0.5 ? 0.7 : 0.3;
      mergedY = mergedY * bias + startYs[i + 1] * (1 - bias);
    }
    const cy = Math.round(mergedY * (1 - t * 0.5) + cardY * t * 0.5);
    convergences.push([cx, Math.max(160, Math.min(560, cy))]);
  }

  // Stream 0 → conv0, Stream 1 → conv0, Stream i (i>=2) → conv[i-1]
  const streams: [number, number][][] = [];
  streams.push(makePath([startXs[0], startYs[0]], convergences[0], seed * 100, 35));
  streams.push(makePath([startXs[1], startYs[1]], convergences[0], seed * 100 + 50, 35));
  for (let i = 2; i < numStreams; i++) {
    streams.push(makePath([startXs[i], startYs[i]], convergences[i - 1], seed * 100 + i * 50, 30));
  }

  // Merged paths: conv[i] → conv[i+1], last → card
  const merged: [number, number][][] = [];
  for (let i = 0; i < numConv - 1; i++) {
    merged.push(makePath(convergences[i], convergences[i + 1], seed * 100 + 200 + i * 50, 18));
  }
  merged.push(makePath(convergences[numConv - 1], [1100, cardY], seed * 100 + 300, 10));

  return {
    streams: streams.map(wp => ({ waypoints: wp, pathStr: toPathStr(wp) })),
    mergedPaths: merged.map(wp => ({ waypoints: wp, pathStr: toPathStr(wp) })),
    convergences,
    cardEndpoint: [1100, cardY],
  };
}

export const cardGeometries: CardGeometry[] = cardConfigs.map((c, i) =>
  buildCardGeometry(c.yPosition, (i + 1) * 7, c.processNotes.length)
);

// ===== CHAOTIC FRAGMENTS PER CARD =====

export const chaoticFragments: string[][] = cardConfigs.map((c, ci) => {
  const count = 40 + c.processNotes.length * 5;
  const frags: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = 10 + sr(ci * 500 + i * 3) * 230;
    const y = c.yPosition - 220 + sr(ci * 500 + i * 3 + 1) * 440;
    const clampedY = Math.max(20, Math.min(680, y));
    const len = 12 + sr(ci * 500 + i * 3 + 2) * 55;
    const angle = (sr(ci * 500 + i * 5) - 0.3) * 1.0;
    const ex = Math.round(x + len * Math.cos(angle));
    const ey = Math.round(Math.max(20, Math.min(680, clampedY + len * Math.sin(angle))));
    frags.push(`M ${Math.round(x)} ${Math.round(clampedY)} L ${ex} ${ey}`);
  }
  return frags;
});

// ===== NOTE POSITIONS (safe zones around hero text) =====

export const convergencePoints = [
  { x: 380, y: 120 }, { x: 560, y: 105 }, { x: 740, y: 115 }, { x: 920, y: 100 },
  { x: 400, y: 575 }, { x: 600, y: 590 }, { x: 780, y: 570 },
  { x: 200, y: 160 }, { x: 280, y: 120 },
  { x: 260, y: 280 }, { x: 240, y: 400 }, { x: 280, y: 340 },
  { x: 220, y: 520 }, { x: 300, y: 570 },
  { x: 1080, y: 160 }, { x: 1120, y: 250 },
  { x: 1100, y: 340 }, { x: 1080, y: 440 },
  { x: 1060, y: 560 }, { x: 920, y: 580 },
];

// ===== AMBIENT BACKGROUND FLOWS =====

export interface AmbientFlow { path: string; dur: number; dashLen: number; opacity: number }

const _af: AmbientFlow[] = [];
for (let i = 0; i < 25; i++) {
  const startY = 25 + Math.sin(i * 7.3 + 2.1) * 0.5 * 660 + 330;
  const endY = 200 + Math.sin(i * 3.7 + 5.9) * 0.5 * 320 + 160;
  const pts: [number, number][] = [];
  for (let j = 0; j <= 7; j++) {
    const t = j / 7;
    pts.push([Math.round(5 + t * 950), Math.round(Math.max(15, Math.min(690, startY + (endY - startY) * t + (1 - t * t) * Math.sin(i * 11.3 + j * 4.7) * 100)))]);
  }
  _af.push({
    path: pts.map((p, k) => `${k === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' '),
    dur: 6 + (Math.sin(i * 5.1) * 0.5 + 0.5) * 8,
    dashLen: 60 + (Math.sin(i * 8.3) * 0.5 + 0.5) * 160,
    opacity: 0.04 + (Math.sin(i * 2.9) * 0.5 + 0.5) * 0.06,
  });
}
export const ambientFlows = _af;

// ===== AMBIENT GLOW =====

export const ambientGlows = [
  { cx: 200, cy: 180, r: 120, dur: 8 },
  { cx: 450, cy: 350, r: 140, dur: 10 },
  { cx: 300, cy: 550, r: 110, dur: 9 },
  { cx: 650, cy: 250, r: 100, dur: 11 },
];

// ===== TIMING =====

export const CHAOS_MS = 1000;
export const FLOW_MS = 8500;
export const COMPLETE_MS = 1200;
export const OVERLAP_MS = 600;         // delay AFTER completing starts before next card begins
export const CARD_TOTAL_MS = CHAOS_MS + FLOW_MS + COMPLETE_MS;

export const HOUSE_HOLD_MS = 10000;
export const HOUSE_FADE_MS = 3000;
