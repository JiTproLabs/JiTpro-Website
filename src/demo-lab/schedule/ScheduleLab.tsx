import { useState } from 'react';
import ScheduleViewer, { CANVAS_H, CANVAS_W } from './ScheduleViewer';
import { SCHEDULE_ITEMS } from './scheduleFixture';
import { DATA_DATE } from './scheduleModel';

/**
 * PROCUREMENT SCHEDULE PROTOTYPE LAB - dev-only review workspace.
 *
 * Three views, because the content has intentionally changed and a pixel
 * overlay would therefore be misleading: comparison here is about shell,
 * density, Gantt proportions, toolbar, timeline treatment and legend placement,
 * not about matching bar positions whose data is deliberately different.
 *
 *   inspect  - the schedule at 1:1 with full inspection enabled
 *   embedded - the schedule at the Learn More column width, preview only
 *   compare  - the original raster beside the new prototype
 *
 * The schedule is presented through ScheduleViewer, the same component the
 * unlisted team review page renders. Only the dev controls around it live
 * here; there is no lab copy of the schedule.
 */

const W = CANVAS_W;
const H = CANVAS_H;
const REF = `${import.meta.env.BASE_URL}assets/methodology/procurement-schedule-1448.webp`;

type Mode = 'inspect' | 'embedded' | 'compare';

export default function ScheduleLab({ initial = 'inspect' }: { initial?: Mode }) {
  const [mode, setMode] = useState<Mode>(initial);
  const [fit, setFit] = useState(true);
  const [inspectScale, setInspectScale] = useState(1);

  const mono = { fontFamily: 'ui-monospace, monospace', fontSize: 12 };

  return (
    <div style={{ minHeight: '100vh', background: '#1e1e1e', color: '#e6e6e6', ...mono }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          padding: '10px 16px',
          background: '#141414',
          borderBottom: '1px solid #333',
        }}
      >
        <strong style={{ letterSpacing: '0.08em' }}>PROCUREMENT SCHEDULE · PROTOTYPE</strong>
        {(['inspect', 'embedded', 'compare'] as Mode[]).map((m, i) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{
              padding: '5px 10px',
              borderRadius: 4,
              border: '1px solid #444',
              background: mode === m ? '#f59e0b' : '#222',
              color: mode === m ? '#111' : '#ddd',
              cursor: 'pointer',
              ...mono,
            }}
          >
            {i + 1}. {m}
          </button>
        ))}
        {mode === 'inspect' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={fit} onChange={(e) => setFit(e.target.checked)} />
            fit to window ({Math.round(inspectScale * 100)}%)
          </label>
        )}
        <span style={{ color: '#888' }}>
          data date {DATA_DATE} · {SCHEDULE_ITEMS.length} items ·{' '}
          {SCHEDULE_ITEMS.reduce((n, i) => n + i.steps.length, 0)} steps
        </span>
      </div>

      <div style={{ padding: 16 }}>
        {mode === 'inspect' && (
          <>
            <Note>
              Full inspection. Hover or keyboard-focus any phase or milestone. Zoom controls are
              live. Escape dismisses the popover.
            </Note>
            <ScheduleViewer scale={fit ? undefined : 1} enabled onScale={setInspectScale} />
          </>
        )}

        {mode === 'embedded' && (
          <>
            <Note>
              Embedded preview at the Learn More content column width (433px). Phases are
              deliberately not individually interactive at this size; the whole screen is the
              enlarge target in production.
            </Note>
            <div style={{ width: 433 }}>
              <ScheduleViewer scale={433 / W} enabled={false} />
            </div>
          </>
        )}

        {mode === 'compare' && (
          <>
            <Note>
              Original raster (left) beside the prototype (right), both at 50%. Content differs by
              instruction, so compare shell, density, Gantt proportions, toolbar, timeline
              treatment and legend placement rather than bar positions.
            </Note>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <Cap>ORIGINAL RASTER</Cap>
                <img src={REF} width={W * 0.5} height={H * 0.5} alt="Original reference" />
              </div>
              <div>
                <Cap>PROTOTYPE</Cap>
                <ScheduleViewer scale={0.5} enabled={false} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <div style={{ color: '#9ad', marginBottom: 10, maxWidth: 900 }}>{children}</div>;
}
function Cap({ children }: { children: React.ReactNode }) {
  return <div style={{ color: '#9ad', marginBottom: 6 }}>{children}</div>;
}
