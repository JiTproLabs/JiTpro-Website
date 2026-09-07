import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react';
import '../components/demo/tokens.css';

/**
 * SCREEN COMPARE LAB - visual QA workspace for any representative screen.
 * TEMPORARY, DEV-ONLY.
 *
 * The generalisation of the Commitment Register lab: give it the live screen
 * component and the basename of its capture in public/assets/methodology and
 * it offers the reference, the live render, the two side by side, and the
 * live render overlaid on the reference with an opacity slider and a
 * difference blend. Deliberately utilitarian: its job is measurement.
 *
 * THE CANVAS IS ALWAYS 1448x1086 INTERNALLY. Everything is scaled with one
 * CSS transform so reference and prototype are compared at identical
 * geometry. `will-change` and 3D transforms are deliberately absent, so the
 * canvas is never rasterised once and then resampled.
 */

const W = 1448;
const H = 1086;

type Mode = 'ref' | 'live' | 'side' | 'overlay';

const MODES: { id: Mode; label: string }[] = [
  { id: 'ref', label: 'Reference' },
  { id: 'live', label: 'Live' },
  { id: 'side', label: 'Side by side' },
  { id: 'overlay', label: 'Overlay' },
];

type Props = {
  /** The screen under test. */
  component: ComponentType;
  /** Capture basename in public/assets/methodology, without suffix. */
  reference: string;
  title: string;
  initial?: Mode;
};

export default function ScreenCompareLab({ component: Screen, reference, title, initial = 'overlay' }: Props) {
  const [mode, setMode] = useState<Mode>(initial);
  const [opacity, setOpacity] = useState(50);
  const [fit, setFit] = useState(true);
  const [diff, setDiff] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const ref = `${import.meta.env.BASE_URL}assets/methodology/${reference}-1448.webp`;

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => {
      const perCanvas = mode === 'side' ? (el.clientWidth - 48) / 2 : el.clientWidth - 32;
      setFitScale(Math.min(1, perCanvas / W));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  // Keyboard: 1-4 modes, arrows nudge opacity, D difference, F fit.
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

  const scale = fit ? fitScale : 1;
  const mono = { fontFamily: 'ui-monospace, monospace', fontSize: 12 };

  const Canvas = ({ children }: { children: React.ReactNode }) => (
    <div style={{ width: W * scale, height: H * scale, position: 'relative', flex: 'none' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
  const Reference = ({ opacity: o = 1, difference = false }: { opacity?: number; difference?: boolean }) => (
    <img
      src={ref}
      width={W}
      height={H}
      alt={`${title} reference`}
      style={{ position: 'absolute', top: 0, left: 0, width: W, height: H, opacity: o, mixBlendMode: difference ? 'difference' : 'normal', pointerEvents: 'none' }}
    />
  );

  return (
    <div style={{ minHeight: '100vh', background: '#1e1e1e', color: '#e6e6e6', ...mono }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', padding: '10px 16px', background: '#141414', borderBottom: '1px solid #333' }}>
        <strong style={{ letterSpacing: '0.08em' }}>{title.toUpperCase()} · PROTOTYPE</strong>
        {MODES.map((m, i) => (
          <button key={m.id} type="button" onClick={() => setMode(m.id)} style={{ padding: '5px 10px', borderRadius: 4, border: '1px solid #444', background: mode === m.id ? '#f59e0b' : '#222', color: mode === m.id ? '#111' : '#ddd', cursor: 'pointer', ...mono }}>
            {i + 1}. {m.label}
          </button>
        ))}
        {mode === 'overlay' && (
          <>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              reference opacity
              <input type="range" min={0} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
              {opacity}%
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" checked={diff} onChange={(e) => setDiff(e.target.checked)} />
              difference (D)
            </label>
          </>
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={fit} onChange={(e) => setFit(e.target.checked)} />
          fit to window ({Math.round(scale * 100)}%)
        </label>
        <span style={{ color: '#888' }}>keys: 1-4 mode · ←/→ opacity · D difference · F fit</span>
      </div>

      <div ref={areaRef} style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start', overflowX: 'auto' }}>
        {mode === 'ref' && (
          <Canvas>
            <Reference />
          </Canvas>
        )}
        {mode === 'live' && (
          <Canvas>
            <Screen />
          </Canvas>
        )}
        {mode === 'side' && (
          <>
            <div>
              <div style={{ color: '#9ad', marginBottom: 6 }}>REFERENCE</div>
              <Canvas>
                <Reference />
              </Canvas>
            </div>
            <div>
              <div style={{ color: '#9ad', marginBottom: 6 }}>LIVE</div>
              <Canvas>
                <Screen />
              </Canvas>
            </div>
          </>
        )}
        {mode === 'overlay' && (
          <Canvas>
            <Screen />
            <Reference opacity={opacity / 100} difference={diff} />
          </Canvas>
        )}
      </div>
    </div>
  );
}
