import type { ReactNode } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Download, Filter, Plus } from 'lucide-react';
import type { Zoom } from './ganttTicks';

/**
 * The Procurement Schedule screen's page header, toolbar and legend chip.
 * Extracted unchanged from `ProcurementScheduleScreen` (2026-11-10) so the
 * full screen and the homepage Plan schedule (Design System Section 54.4.2)
 * render one definition of the Schedule module's chrome.
 */

const ZOOMS: Zoom[] = ['quarters', 'months', 'weeks', 'days'];
const ZOOM_LABEL: Record<Zoom, string> = {
  quarters: 'Quarters',
  months: 'Months',
  weeks: 'Weeks',
  days: 'Days',
};

/** The page header: title, item count and method line, Export and Add Item. */
export function ScheduleHeader({ itemCount }: { itemCount: number }) {
  return (
    <div className="flex items-start" style={{ paddingTop: 22, paddingLeft: 10 }}>
      <div>
        <h1
          className="jpd-tight"
          style={{ fontSize: 25, fontWeight: 800, lineHeight: '27px', color: 'var(--jpd-text)' }}
        >
          Procurement Schedule
        </h1>
        <div
          style={{ fontSize: 12.5, marginTop: 8, color: 'var(--jpd-text-secondary)' }}
        >
          {itemCount} procurement items · backward-planned from each Required
          On-Site date
        </div>
      </div>

      <div className="ml-auto flex items-start" style={{ gap: 22 }}>
        <div
          className="flex items-stretch overflow-hidden"
          style={{ height: 34, borderRadius: 6, border: '1px solid var(--jpd-border)' }}
        >
          <span
            className="flex items-center"
            style={{ gap: 7, padding: '0 12px', fontSize: 12.5, fontWeight: 600 }}
          >
            <Download size={14} strokeWidth={2} />
            Export
          </span>
          <span
            className="flex items-center justify-center"
            style={{ width: 30, borderLeft: '1px solid var(--jpd-border)' }}
          >
            <ChevronDown size={14} strokeWidth={2} />
          </span>
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            width: 128,
            height: 34,
            borderRadius: 6,
            background: 'var(--jpd-action)',
            color: '#fff',
            fontSize: 12.5,
            fontWeight: 600,
            gap: 7,
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Item
        </div>
      </div>
    </div>
  );
}

/** The toolbar: the zoom bands, health counts when any exist, and navigation. */
export function ScheduleToolbar({
  zoom,
  onZoom,
  enabled,
  health,
}: {
  zoom: Zoom;
  onZoom: (z: Zoom) => void;
  enabled: boolean;
  health: { atRisk: number; impacted: number };
}) {
  return (
    <div className="flex items-center" style={{ marginTop: 16, paddingLeft: 2 }}>
      <div
        className="flex items-center"
        style={{
          height: 32,
          border: '1px solid var(--jpd-border)',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        {ZOOMS.map((z) => {
          const on = z === zoom;
          return (
            <button
              key={z}
              type="button"
              onClick={() => enabled && onZoom(z)}
              tabIndex={enabled ? 0 : -1}
              style={{
                height: '100%',
                padding: '0 15px',
                fontSize: 12,
                fontWeight: on ? 600 : 500,
                border: 0,
                cursor: enabled ? 'pointer' : 'default',
                background: on ? 'var(--jpd-nav-bg-start)' : 'transparent',
                color: on ? '#fff' : 'var(--jpd-text-body)',
              }}
            >
              {ZOOM_LABEL[z]}
            </button>
          );
        })}
      </div>

      {/* Sits in existing toolbar whitespace rather than in the page
          header, so nothing above the schedule had to be rearranged. */}
      {(health.atRisk > 0 || health.impacted > 0) && (
        <span className="flex items-center" style={{ marginLeft: 18, gap: 10 }}>
          {health.impacted > 0 && (
            <span className="jpd-health jpd-health--impacted">
              {health.impacted} IMPACTED
            </span>
          )}
          {health.atRisk > 0 && (
            <span className="jpd-health jpd-health--at-risk">
              {health.atRisk} AT RISK
            </span>
          )}
        </span>
      )}

      <div className="ml-auto flex items-center" style={{ gap: 9 }}>
        <Btn>Today</Btn>
        <Btn square>
          <ChevronLeft size={14} strokeWidth={2} />
        </Btn>
        <Btn square>
          <ChevronRight size={14} strokeWidth={2} />
        </Btn>
        <span style={{ width: 12 }} />
        <Btn>
          <Filter size={13} strokeWidth={2} />
          <span style={{ marginLeft: 6 }}>Filters</span>
        </Btn>
      </div>
    </div>
  );
}

/** One legend entry: a family chip (or a diamond for a dated event) and its label. */
export function LegendChip({ color, diamond, label }: { color: string; diamond?: boolean; label: string }) {
  return (
    <span className="flex items-center" style={{ gap: 6 }}>
      {diamond ? (
        <span
          style={{
            width: 9,
            height: 9,
            transform: 'rotate(45deg)',
            background: color,
            borderRadius: 1,
          }}
        />
      ) : (
        <span
          style={{
            width: 11,
            height: 11,
            borderRadius: 2,
            background: color,
          }}
        />
      )}
      <span style={{ fontSize: 10.5, color: 'var(--jpd-text-body)' }}>{label}</span>
    </span>
  );
}

function Btn({ children, square }: { children: ReactNode; square?: boolean }) {
  return (
    <span
      className="flex items-center justify-center"
      style={{
        height: 32,
        width: square ? 32 : undefined,
        padding: square ? 0 : '0 13px',
        border: '1px solid var(--jpd-border)',
        borderRadius: 6,
        fontSize: 12.5,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}
