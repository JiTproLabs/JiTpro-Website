import { v } from '../demo/screens/procurement-chain/chainVocabulary';
import { SWEEP_HAND } from './ownerScenes';

/**
 * The hand that clears the table in Project Owners, Reduce risk (Design
 * System Section 54.4.5): ONE FINISHED ILLUSTRATION of a right hand and
 * forearm, palm down, seen from above and a little to its leading side.
 * It is drawn once, here, as curved outlines, and is placed, leaned and moved
 * by its caller as a single object. Nothing in it is animated separately and
 * nothing in it is built from boxes or bars.
 *
 * DRAWN ABOUT THE WRIST. The origin is the wrist; the fingers point up the
 * page (negative y) and the forearm runs down it; the little-finger side
 * lies along x = 0 and everything else is to its left. The sweep's contact
 * is computed from this outline: `SWEEP_HAND` in `ownerScenes.ts` carries
 * its fingertip, its length of sleeve and the points of its outline that
 * can meet something. CHANGE THE DRAWING AND THOSE POINTS TOGETHER.
 *
 * The silhouette: a sleeve that narrows toward the wrist, a shirt cuff, the
 * wrist, the heel and back of the hand, four fingers held together and
 * tapering to rounded tips of natural lengths, and the thumb held a little
 * apart. Detail stops there: no nails, no knuckles, no skin.
 *
 * Colour: the documents' own (white paper, one ink at several strengths)
 * with the navy line. No skin tone and no amber: the dice are the accent.
 */

const PAPER = 'var(--jp-surface-white)';
const INK = 'var(--jp-ink-secondary)';
const navy = v('--jpd-nav-bg-start');

/* The leading edge of the hand, from the wrist up to the side of the little finger's tip. */
const EDGE = 'C-6 -8 -1 -20 -0.5 -36C0 -48 -1.5 -58 -2 -68C-2.5 -82 -5.5 -100 -7 -113';

/* The hand, one closed outline: leading edge, little finger, ring, middle and index fingers, the web, the thumb, the wrist. */
const HAND = [
  `M-8 5${EDGE}`,
  'C-7 -116 -9 -118 -12 -118C-15 -118 -17 -116 -17 -113C-17.6 -110 -18.6 -107 -19.2 -104',
  'C-19.4 -116 -21 -130 -21.9 -138.5C-21.9 -141.9 -24.1 -144.1 -27.5 -144.1C-30.9 -144.1 -33.1 -141.9 -33.1 -138.5C-33.6 -135 -34.5 -131 -35 -128',
  'C-35.2 -136 -36.6 -144 -37.2 -150C-37.2 -153.5 -39.5 -155.8 -43 -155.8C-46.5 -155.8 -48.8 -153.5 -48.8 -150C-49.6 -142 -50.3 -134 -50.5 -127',
  'C-50.6 -131 -51.3 -134 -51.8 -137C-51.8 -140.4 -54.1 -142.7 -57.5 -142.7C-60.9 -142.7 -63.2 -140.4 -63.2 -137C-64.8 -120 -66.3 -100 -66 -84',
  'C-66 -72 -65.5 -61 -69.5 -57.5C-72.5 -55 -81 -77.9 -85.5 -86.8',
  'C-87.1 -90.1 -90.5 -91.2 -93.8 -89.5C-97.1 -87.9 -98.2 -84.5 -96.5 -81.2',
  'C-92 -72.3 -89.5 -62 -87 -54C-84 -44 -78 -30 -70 -18C-64 -9 -56 -3 -53 5Z',
].join('');

/* The side of the hand that is turned toward the viewer: a sliver of tone along the leading edge. */
const SIDE = `M-8 5${EDGE}L-11 -109C-9.5 -98 -7.5 -82 -7 -68C-6.5 -56 -5.5 -46 -6 -36C-6.5 -22 -10 -10 -12 5Z`;

/* Where the fingers lie against each other: three fine lines from between the tips to the knuckles. */
const BETWEEN = 'M-19.2 -104C-18.8 -95 -18 -86 -17 -77M-35 -128C-35 -114 -34.4 -100 -33.4 -87M-50.5 -127C-50.8 -114 -50.8 -102 -50.2 -91';

/* The sleeve: narrow at the cuff, widening toward the elbow, then running on out of the picture. */
const SLEEVE = `M0 13L0 ${SWEEP_HAND.arm}L-88 ${SWEEP_HAND.arm}L-86 300C-82 200 -70 80 -62 13Z`;
const CUFF = 'M-58 3C-44 0 -20 0 -4 3L-2.5 17C-20 13.5 -44 13.5 -61 17Z';
/* Two soft creases where the sleeve gathers at the elbow. */
const CREASES = 'M-83 232C-70 240 -56 242 -44 238M-81 256C-72 260 -64 261 -57 259';

export function SweepingHand() {
  const line = { stroke: navy, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  const wash = (opacity: number) => ({ fill: INK, fillOpacity: opacity });
  return (
    <>
      {/* It is above the table: a soft offset beneath it, never a blur. */}
      <path d={HAND} transform="translate(4 6)" style={wash(0.13)} />
      <path d={SLEEVE} transform="translate(4 6)" style={wash(0.13)} />
      <path d={SLEEVE} style={{ fill: PAPER }} />
      <path d={SLEEVE} style={{ ...wash(0.22), ...line, strokeWidth: 1.4 }} />
      <path d={CREASES} style={{ fill: 'none', ...line, strokeOpacity: 0.4, strokeWidth: 1 }} />
      <path d={CUFF} style={{ fill: PAPER, ...line, strokeWidth: 1.3 }} />
      <path d={HAND} style={{ fill: PAPER }} />
      <path d={HAND} style={wash(0.06)} />
      <path d={SIDE} style={wash(0.16)} />
      <path d={BETWEEN} style={{ fill: 'none', ...line, strokeOpacity: 0.5, strokeWidth: 1 }} />
      <path d={HAND} style={{ fill: 'none', ...line, strokeWidth: 1.5 }} />
    </>
  );
}
