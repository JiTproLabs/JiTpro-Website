import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CommitmentRegisterScreen from './CommitmentRegisterScreen';

/**
 * PROTOTYPE LAB - visual QA workspace. TEMPORARY, DEV-ONLY.
 *
 * Deliberately utilitarian (gate Section 7): its job is measurement, not
 * presentation. Nothing here is a marketing surface and nothing here is
 * production architecture.
 *
 * THE CANVAS IS ALWAYS 1448x1086 INTERNALLY. The workspace scales the whole
 * canvas with a CSS transform to fit the viewport, so A, B and the reference
 * PNG are compared at identical geometry (gate Section 8). `will-change` and
 * 3D transforms are deliberately absent: promoting the canvas to its own
 * composited layer would rasterize it once and then scale the bitmap, which is
 * exactly the blurring this whole migration exists to eliminate.
 */

const W = 1448;
const H = 1086;
const REF = `${import.meta.env.BASE_URL}assets/methodology/commitment-capture-1448.webp`;

type Mode = 'a' | 'b' | 'ref' | 'overlay-a' | 'overlay-b';

const MODES: { id: Mode; label: string }[] = [
  { id: 'ref', label: 'Reference PNG' },
  { id: 'a', label: 'Prototype A' },
  { id: 'b', label: 'Prototype B' },
  { id: 'overlay-a', label: 'Overlay: Ref / A' },
  { id: 'overlay-b', label: 'Overlay: Ref / B' },
];

function useFitScale(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, el.clientWidth / W));
    });
    ro.observe(el);
    setScale(Math.min(1, el.clientWidth / W));
    return () => ro.disconnect();
  }, [enabled]);
  return { ref, scale };
}

export default function DemoLab({ initial = 'overlay-a' }: { initial?: Mode }) {
  const [mode, setMode] = useState<Mode>(initial);
  const [opacity, setOpacity] = useState(50);
  const [fit, setFit] = useState(true);
  const [diff, setDiff] = useState(false);
  const { ref, scale: fitScale } = useFitScale(fit);
  const scale = fit ? fitScale : 1;

  // Keyboard: 1-5 switch modes, arrows nudge opacity, D toggles difference blend.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const i = Number(e.key);
      if (i >= 1 && i <= MODES.length) setMode(MODES[i - 1].id);
      if (e.key === 'ArrowLeft') setOpacity((o) => Math.max(0, o - 5));
      if (e.key === 'ArrowRight') setOpacity((o) => Math.min(100, o + 5));
      if (e.key.toLowerCase() === 'd') setDiff((d) => !d);
      if (e.key.toLowerCase() === 'f') setFit((f) => !f);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isOverlay = mode.startsWith('overlay');
  const variant: 'a' | 'b' = mode.endsWith('b') ? 'b' : 'a';

  return (
    <div style={{ minHeight: '100vh', background: '#1e1e1e', color: '#e6e6e6', fontFamily: 'ui-monospace, monospace' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 14,
          padding: '10px 16px',
          background: '#141414',
          borderBottom: '1px solid #333',
          fontSize: 12,
        }}
      >
        <strong style={{ letterSpacing: '0.08em' }}>COMMITMENT REGISTER · PROTOTYPE LAB</strong>

        <span style={{ display: 'flex', gap: 6 }}>
          {MODES.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              style={{
                padding: '5px 10px',
                borderRadius: 4,
                border: '1px solid #444',
                background: mode === m.id ? '#f59e0b' : '#222',
                color: mode === m.id ? '#111' : '#ddd',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 12,
              }}
            >
              {i + 1}. {m.label}
            </button>
          ))}
        </span>

        {isOverlay && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            reference opacity
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              style={{ width: 220 }}
            />
            <span style={{ width: 38, textAlign: 'right' }}>{opacity}%</span>
          </label>
        )}
        {isOverlay && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={diff} onChange={(e) => setDiff(e.target.checked)} />
            difference blend
          </label>
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={fit} onChange={(e) => setFit(e.target.checked)} />
          fit to window ({Math.round(scale * 100)}%)
        </label>
        <span style={{ color: '#888' }}>keys: 1-5 · ←/→ opacity · D diff · F fit</span>
      </div>

      <div ref={ref} style={{ padding: 16 }}>
        <div
          style={{
            position: 'relative',
            width: W * scale,
            height: H * scale,
            outline: '1px solid #444',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: W,
              height: H,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {mode !== 'ref' && <CommitmentRegisterScreen variant={variant} />}

            {(mode === 'ref' || isOverlay) && (
              <img
                src={REF}
                width={W}
                height={H}
                alt="Commitment Register reference"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: W,
                  height: H,
                  opacity: mode === 'ref' ? 1 : opacity / 100,
                  mixBlendMode: isOverlay && diff ? 'difference' : 'normal',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
