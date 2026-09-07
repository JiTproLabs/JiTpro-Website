import { useEffect, useState } from 'react';
import CommitmentTable from './CommitmentTable';
import './demoLab.css';

/**
 * TABLE FIDELITY TEST - dev-only visual QA.
 *
 * Two things, both demanded by the review and neither previously provided:
 *
 *   1. A TYPOGRAPHY COMPARISON. The same representative strings, at identical
 *      size / weight / width / line-height, in every candidate face, so the
 *      choice is made on the rendered result rather than on glyph analysis.
 *      Inter is included despite the forensic pass having excluded it on the
 *      single-storey `g`.
 *
 *   2. A SIDE-BY-SIDE TABLE TEST. The reference PNG's table area, cropped to
 *      the measured region (x223-1168, y388-976) and shown at 1:1, next to the
 *      live HTML table at the same effective dimensions, with all eight records
 *      so cumulative vertical drift is visible.
 *
 * The reference crop is produced with a negative offset inside a clipping box
 * rather than a new image asset, so nothing is added to `public/`.
 */

const TABLE = { x: 223, y: 388, w: 945, h: 588 };
const REF = `${import.meta.env.BASE_URL}assets/methodology/commitment-capture-1448.webp`;

const FONTS = [
  { id: 'Inter', label: 'Inter' },
  { id: 'Inter Tight', label: 'Inter Tight' },
  { id: 'Figtree', label: 'Figtree' },
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { id: 'Hanken Grotesk', label: 'Hanken Grotesk' },
  { id: 'Urbanist', label: 'Urbanist (previous)' },
  { id: 'system-ui', label: 'system UI' },
];

/** The strings the review asked to compare, as title + description pairs. */
const SPECIMEN: [string, string][] = [
  ['Exterior Window System', 'Finalize and approve exterior window system and details'],
  ['Interior Door Hardware', 'Select and approve interior door hardware set'],
  ['Lighting Package', 'Approve interior and exterior lighting fixtures and controls'],
  ['Switchgear & Panelboards', 'Order electrical switchgear and distribution panels'],
];

function ReferenceCrop({ opacity = 1 }: { opacity?: number }) {
  return (
    <div style={{ position: 'relative', width: TABLE.w, height: TABLE.h, overflow: 'hidden' }}>
      <img
        src={REF}
        width={1448}
        height={1086}
        alt="Reference table area"
        style={{ position: 'absolute', left: -TABLE.x, top: -TABLE.y, opacity, maxWidth: 'none' }}
      />
    </div>
  );
}

export default function TableFidelityTest() {
  const [font, setFont] = useState('Inter Tight');
  const [mode, setMode] = useState<'side' | 'overlay'>('side');
  const [opacity, setOpacity] = useState(50);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const i = Number(e.key);
      if (i >= 1 && i <= FONTS.length) setFont(FONTS[i - 1].id);
      if (e.key.toLowerCase() === 'o') setMode((m) => (m === 'side' ? 'overlay' : 'side'));
      if (e.key === 'ArrowLeft') setOpacity((o) => Math.max(0, o - 5));
      if (e.key === 'ArrowRight') setOpacity((o) => Math.min(100, o + 5));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const mono = { fontFamily: 'ui-monospace, monospace', fontSize: 12 };

  return (
    <div style={{ minHeight: '100vh', background: '#1e1e1e', color: '#e6e6e6', ...mono }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          padding: '10px 16px',
          background: '#141414',
          borderBottom: '1px solid #333',
        }}
      >
        <strong style={{ letterSpacing: '0.08em' }}>TABLE FIDELITY TEST</strong>
        <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FONTS.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFont(f.id)}
              style={{
                padding: '5px 10px',
                borderRadius: 4,
                border: '1px solid #444',
                background: font === f.id ? '#f59e0b' : '#222',
                color: font === f.id ? '#111' : '#ddd',
                cursor: 'pointer',
                ...mono,
              }}
            >
              {i + 1}. {f.label}
            </button>
          ))}
        </span>
        <button
          type="button"
          onClick={() => setMode(mode === 'side' ? 'overlay' : 'side')}
          style={{
            padding: '5px 10px',
            borderRadius: 4,
            border: '1px solid #444',
            background: '#222',
            color: '#ddd',
            cursor: 'pointer',
            ...mono,
          }}
        >
          {mode === 'side' ? 'O. switch to overlay' : 'O. switch to side-by-side'}
        </button>
        {mode === 'overlay' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            reference opacity
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              style={{ width: 200 }}
            />
            <span style={{ width: 38 }}>{opacity}%</span>
          </label>
        )}
        <span style={{ color: '#888' }}>keys: 1-7 font · O overlay · arrows opacity</span>
      </div>

      {/* ---------------------------------------------- typography specimen */}
      <div style={{ padding: '18px 16px 6px' }}>
        <div style={{ color: '#f59e0b', marginBottom: 10 }}>
          1 · TYPOGRAPHY CANDIDATES — identical size, weight, width and line-height
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Reference crop of the same four titles, for direct comparison */}
          <div>
            <div style={{ color: '#9ad', marginBottom: 6 }}>REFERENCE (crop)</div>
            <div
              style={{
                position: 'relative',
                width: 147,
                height: 4 * 68.25,
                overflow: 'hidden',
                outline: '1px solid #444',
              }}
            >
              <img
                src={REF}
                width={1448}
                height={1086}
                alt="Reference title column"
                style={{ position: 'absolute', left: -418, top: -429, maxWidth: 'none' }}
              />
            </div>
          </div>

          {FONTS.map((f) => (
            <div key={f.id}>
              <div style={{ color: font === f.id ? '#f59e0b' : '#9ad', marginBottom: 6 }}>
                {f.label}
              </div>
              <div
                className="jpd jpd-a"
                style={{
                  width: 147,
                  height: 4 * 68.25,
                  background: '#fefefe',
                  outline: '1px solid #444',
                  ['--jpd-font' as string]: f.id,
                }}
              >
                {SPECIMEN.map(([t, d]) => (
                  <div
                    key={t}
                    style={{
                      height: 68.25,
                      paddingLeft: 11,
                      paddingRight: 5,
                      paddingTop: 11,
                      lineHeight: '17.5px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: 'var(--jpd-text-strong)',
                      }}
                    >
                      {t}
                    </span>
                    <span style={{ display: 'block', fontSize: 9.5, color: 'var(--jpd-text-body)' }}>
                      {d}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {FONTS.map((f) => (
            <div key={f.id} className="jpd jpd-a" style={{ ['--jpd-font' as string]: f.id }}>
              <div style={{ color: '#9ad', ...mono, marginBottom: 2 }}>{f.label}</div>
              <div
                className="jpd-tight"
                style={{ fontSize: 32, fontWeight: 800, color: '#e6e6e6', lineHeight: '34px' }}
              >
                Commitment Register
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------- table comparison */}
      <div style={{ padding: '18px 16px 40px' }}>
        <div style={{ color: '#f59e0b', marginBottom: 10 }}>
          2 · TABLE — reference {mode === 'side' ? 'beside' : 'over'} live HTML, 1:1 at{' '}
          {TABLE.w}×{TABLE.h}, all eight records
        </div>

        {mode === 'side' ? (
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#9ad', marginBottom: 6 }}>REFERENCE PNG</div>
              <div style={{ outline: '1px solid #444' }}>
                <ReferenceCrop />
              </div>
            </div>
            <div>
              <div style={{ color: '#9ad', marginBottom: 6 }}>LIVE HTML — {font}</div>
              <div
                className="jpd jpd-a"
                style={{
                  width: TABLE.w,
                  background: '#fefefe',
                  outline: '1px solid #444',
                  ['--jpd-font' as string]: font,
                }}
              >
                <CommitmentTable />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', width: TABLE.w, outline: '1px solid #444' }}>
            <div
              className="jpd jpd-a"
              style={{ width: TABLE.w, background: '#fefefe', ['--jpd-font' as string]: font }}
            >
              <CommitmentTable />
            </div>
            <div style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
              <ReferenceCrop opacity={opacity / 100} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
