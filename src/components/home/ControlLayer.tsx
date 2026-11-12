import type { MutableRefObject } from 'react';
import { v } from '../demo/screens/procurement-chain/chainVocabulary';
import ControlBoard from './ControlBoard';
import { TAG, shortDay, type ControlScene } from './controlChainScene';
import type { ControlRefs } from './controlLayerApply';

/**
 * What the Control visual draws over Plan's chain (Design System Section
 * 54.4.4). Close up: the Today line and its flag, the wash over finished
 * work, the ring on the activity that needs attention, and the annotations.
 * Then the board (ControlBoard.tsx): the schedule drawn for the frame, its
 * transition and the list of priorities.
 *
 * Everything is placed, every animation frame, from `controlStateAt`'s one
 * state by `applyControl` in controlLayerApply.ts (Section 46.3). This file
 * computes nothing: no positions, no timing, no states.
 *
 * Colour: the application's own tokens only. Amber (`--jpd-accent`) is Today
 * and what needs attention, and nothing else. No late or warning colour.
 */

const FACE = '"Inter Tight", Inter, system-ui, sans-serif';

export default function ControlLayer({ control, refs, uid }: { control: ControlScene; refs: MutableRefObject<ControlRefs>; uid: string }) {
  return (
    <>
      {/* Close up: work before today, subdued. */}
      <div
        ref={(el) => {
          refs.current.wash = el;
        }}
        className="pointer-events-none absolute top-0 left-0"
        style={{ visibility: 'hidden', opacity: 0, background: v('--jpd-surface') }}
      />

      {/* Close up: the activity that needs attention now. A ring, so its own label stays readable. */}
      <div
        ref={(el) => {
          refs.current.mark = el;
        }}
        className="pointer-events-none absolute top-0 left-0 rounded-[4px]"
        style={{ visibility: 'hidden', opacity: 0, border: `2px solid ${v('--jpd-accent')}` }}
      />

      {/* TODAY, on the chain: one line from the one camera, and its flag. */}
      <div
        ref={(el) => {
          refs.current.line = el;
        }}
        className="pointer-events-none absolute top-0 left-0"
        style={{ visibility: 'hidden', opacity: 0, width: 2, background: v('--jpd-accent') }}
      />
      <div
        ref={(el) => {
          refs.current.label = el;
        }}
        className="pointer-events-none absolute top-0 left-0 whitespace-nowrap rounded-r-[3px] uppercase"
        style={{
          visibility: 'hidden',
          opacity: 0,
          padding: '3px 8px',
          fontFamily: FACE,
          fontSize: 9.5,
          lineHeight: '12px',
          fontWeight: 800,
          letterSpacing: '0.09em',
          color: v('--jpd-nav-bg-start'),
          background: v('--jpd-accent'),
        }}
      >
        {`Today · ${shortDay(control.today)}`}
      </div>

      {/* Close up: what needs attention, and what does not yet. */}
      {control.tags.map((g, i) => {
        const now = g.kind === 'now';
        return (
          <div
            key={`${g.kind}-${g.id}`}
            ref={(el) => {
              refs.current.tags[i] = el;
            }}
            className="pointer-events-none absolute top-0 left-0 flex flex-col items-center"
            style={{ visibility: 'hidden', opacity: 0, fontFamily: FACE }}
          >
            <span
              className="whitespace-nowrap rounded-[3px] uppercase"
              style={{
                padding: now ? '3px 8px' : '2px 6px',
                fontSize: now ? 10 : 9,
                lineHeight: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: now ? v('--jpd-nav-bg-start') : v('--jpd-text-secondary'),
                background: now ? v('--jpd-accent') : v('--jpd-surface'),
                border: now ? 'none' : `1px solid ${v('--jpd-text-muted')}`,
              }}
            >
              {g.text}
            </span>
            {/* A stem from the annotation to its activity. */}
            <span style={{ width: 1.5, height: TAG.stem[g.kind], background: now ? v('--jpd-accent') : v('--jpd-text-muted') }} />
          </div>
        );
      })}

      {/* THE BOARD: the schedule, its transition and the list, one design per frame size. */}
      <div
        ref={(el) => {
          refs.current.boards = el;
        }}
        className="pointer-events-none absolute inset-0"
      >
        <ControlBoard board={control.boards.desktop} today={control.today} uid={uid} />
        <ControlBoard board={control.boards.phone} today={control.today} uid={uid} />
      </div>
    </>
  );
}
