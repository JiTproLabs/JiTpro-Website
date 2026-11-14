import type { CSSProperties } from 'react';
import { FONT, type TextBlock, type TextLine } from './chainLayout';
import { v } from './chainVocabulary';

const TONE: Record<NonNullable<TextLine['tone']>, string> = {
  ink: v('--jpd-chain-ink'),
  secondary: v('--jpd-chain-ink-secondary'),
  late: v('--jpd-chain-commitment-late'),
};

/** A laid-out text block, in the chain's registers (Section 51.8). */
export default function ChainText({ block, fill, halo }: { block: TextBlock; fill?: string; halo?: boolean }) {
  const haloStyle: CSSProperties = halo
    ? { paintOrder: 'stroke', stroke: v('--jpd-surface'), strokeWidth: 4, strokeLinejoin: 'round' }
    : {};
  return (
    <text textAnchor={block.anchor} aria-hidden="true">
      {block.lines.map((l, i) => (
        <tspan
          key={i}
          x={block.x}
          y={l.baseline}
          style={{ font: FONT[l.font], fill: fill ?? TONE[l.tone ?? 'ink'], ...haloStyle }}
        >
          {l.text}
        </tspan>
      ))}
    </text>
  );
}
