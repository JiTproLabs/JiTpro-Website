import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import snapshot from '../content/procurementScheduleSnapshot.json';

interface TimelineItem {
  name: string;
  days: number;
  color: string;
  milestone?: boolean;
}

interface SavedTimeline {
  id: string;
  name: string;
  delivery_date: string;
  status: string;
  timeline_data: TimelineItem[];
}

const timelines = snapshot as SavedTimeline[];

function isWorkday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function addWorkdays(date: Date, workdays: number): Date {
  const result = new Date(date);
  let remaining = workdays;
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    if (isWorkday(result)) remaining--;
  }
  return result;
}

function subtractWorkdays(date: Date, workdays: number): Date {
  const result = new Date(date);
  let remaining = workdays;
  while (remaining > 0) {
    result.setDate(result.getDate() - 1);
    if (isWorkday(result)) remaining--;
  }
  return result;
}

function nextWorkday(date: Date): Date {
  const result = new Date(date);
  while (!isWorkday(result)) {
    result.setDate(result.getDate() + 1);
  }
  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateFull(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

type ZoomLevel = 'quarters' | 'months' | 'weeks' | 'days';

function getEffectiveWorkdays(data: TimelineItem[]): number {
  return data.reduce((sum, d) => sum + (d.days > 0 ? d.days + 1 : 0), 0);
}

function getStartDate(deliveryDate: Date, data: TimelineItem[]): Date {
  return subtractWorkdays(deliveryDate, getEffectiveWorkdays(data));
}

function buildTicks(chartStart: Date, chartEnd: Date, zoom: ZoomLevel): { date: Date; label: string }[] {
  const ticks: { date: Date; label: string }[] = [];
  const d = new Date(chartStart);

  if (zoom === 'days') {
    while (d <= chartEnd) {
      ticks.push({ date: new Date(d), label: formatDateShort(d) });
      d.setDate(d.getDate() + 1);
    }
  } else if (zoom === 'weeks') {
    while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
    while (d <= chartEnd) {
      ticks.push({ date: new Date(d), label: formatDateShort(d) });
      d.setDate(d.getDate() + 7);
    }
  } else if (zoom === 'months') {
    d.setDate(1);
    if (d < chartStart) d.setMonth(d.getMonth() + 1);
    while (d <= chartEnd) {
      ticks.push({
        date: new Date(d),
        label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      });
      d.setMonth(d.getMonth() + 1);
    }
  } else {
    d.setDate(1);
    d.setMonth(Math.floor(d.getMonth() / 3) * 3);
    if (d < chartStart) d.setMonth(d.getMonth() + 3);
    while (d <= chartEnd) {
      const q = Math.floor(d.getMonth() / 3) + 1;
      ticks.push({
        date: new Date(d),
        label: `Q${q} ${d.getFullYear()}`,
      });
      d.setMonth(d.getMonth() + 3);
    }
  }

  return ticks;
}

function buildSubTicks(chartStart: Date, chartEnd: Date, zoom: ZoomLevel): Date[] {
  const ticks: Date[] = [];
  const d = new Date(chartStart);

  if (zoom === 'quarters') {
    while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
    while (d <= chartEnd) {
      ticks.push(new Date(d));
      d.setDate(d.getDate() + 7);
    }
  } else if (zoom === 'months') {
    while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
    while (d <= chartEnd) {
      ticks.push(new Date(d));
      d.setDate(d.getDate() + 7);
    }
  } else if (zoom === 'weeks') {
    while (d <= chartEnd) {
      ticks.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
  }

  return ticks;
}

function buildWeekendBands(chartStart: Date, chartEnd: Date, totalDays: number): { left: number; width: number }[] {
  const bands: { left: number; width: number }[] = [];
  const d = new Date(chartStart);

  while (d <= chartEnd) {
    const day = d.getDay();
    if (day === 6) {
      const satPos = (daysBetween(chartStart, d) / totalDays) * 100;
      const bandWidth = (2 / totalDays) * 100;
      bands.push({ left: satPos, width: bandWidth });
    }
    d.setDate(d.getDate() + 1);
  }

  return bands;
}

interface BarSegment {
  offset: number;
  width: number;
  color: string;
  name: string;
  days: number;
  startDate: Date;
  endDate: Date;
}

function computeBarSegments(data: TimelineItem[], totalWorkdays: number, timelineStart: Date): BarSegment[] {
  const segments: BarSegment[] = [];
  let cumDays = 0;
  let currentDate = new Date(timelineStart);

  for (const item of data) {
    const segStart = new Date(currentDate);

    if (item.days > 0) {
      const segEnd = addWorkdays(segStart, item.days);
      const offset = totalWorkdays > 0 ? (cumDays / totalWorkdays) * 100 : 0;
      const width = totalWorkdays > 0 ? (item.days / totalWorkdays) * 100 : 0;
      segments.push({ offset, width, color: item.color, name: item.name, days: item.days, startDate: segStart, endDate: segEnd });
      currentDate = nextWorkday(addWorkdays(segStart, item.days + 1));
    } else {
      currentDate = nextWorkday(new Date(segStart));
    }
    cumDays += item.days;
  }

  return segments;
}

export function InteractiveProcurementSchedule() {
  const [zoom, setZoom] = useState<ZoomLevel>('quarters');
  const [tooltip, setTooltip] = useState<{
    itemName: string;
    phaseName: string;
    startDate: string;
    endDate: string;
    days: number;
    rect: DOMRect;
  } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const itemRanges = useMemo(() => {
    const items = timelines.map((tl) => {
      const delivery = new Date(tl.delivery_date + 'T00:00:00');
      const start = getStartDate(delivery, tl.timeline_data);
      const totalWorkdays = tl.timeline_data.reduce((s, d) => s + d.days, 0);
      return { ...tl, start, delivery, totalWorkdays };
    });
    items.sort((a, b) => a.delivery.getTime() - b.delivery.getTime());
    return items;
  }, []);

  const { chartStart, chartEnd, totalDays } = useMemo(() => {
    if (itemRanges.length === 0) {
      const now = new Date();
      return { chartStart: now, chartEnd: addDays(now, 90), totalDays: 90 };
    }
    const earliest = itemRanges.reduce((min, r) => (r.start < min ? r.start : min), itemRanges[0].start);
    const latest = itemRanges.reduce((max, r) => (r.delivery > max ? r.delivery : max), itemRanges[0].delivery);
    const cs = addDays(earliest, -14);
    const ce = addDays(latest, 14);
    return { chartStart: cs, chartEnd: ce, totalDays: daysBetween(cs, ce) };
  }, [itemRanges]);

  const ticks = useMemo(() => buildTicks(chartStart, chartEnd, zoom), [chartStart, chartEnd, zoom]);
  const subTicks = useMemo(() => buildSubTicks(chartStart, chartEnd, zoom), [chartStart, chartEnd, zoom]);
  const weekendBands = useMemo(() => buildWeekendBands(chartStart, chartEnd, totalDays), [chartStart, chartEnd, totalDays]);

  const todayPos = useMemo(() => {
    const marker = new Date('2026-07-15T00:00:00');
    const d = daysBetween(chartStart, marker);
    if (d < 0 || d > totalDays) return null;
    return (d / totalDays) * 100;
  }, [chartStart, totalDays]);

  const chartMinWidth = useMemo(() => {
    if (zoom === 'days') return Math.max(totalDays * 30, 800);
    if (zoom === 'weeks') return Math.max((totalDays / 7) * 80, 800);
    if (zoom === 'months') return Math.max((totalDays / 30) * 120, 800);
    return 800;
  }, [zoom, totalDays]);

  const [labelWidth, setLabelWidth] = useState(224);
  const draggingCol = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);
  const labelColRef = useRef<HTMLDivElement>(null);

  const handleColDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingCol.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = labelWidth;
    document.body.style.cursor = 'col-resize';
  }, [labelWidth]);

  const handleColDragMove = useCallback((e: MouseEvent) => {
    if (!draggingCol.current) return;
    const delta = e.clientX - dragStartX.current;
    setLabelWidth(Math.max(120, Math.min(600, dragStartWidth.current + delta)));
  }, []);

  const handleColDragEnd = useCallback(() => {
    draggingCol.current = false;
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleColDragMove);
    document.addEventListener('mouseup', handleColDragEnd);
    return () => {
      document.removeEventListener('mousemove', handleColDragMove);
      document.removeEventListener('mouseup', handleColDragEnd);
    };
  }, [handleColDragMove, handleColDragEnd]);

  const handleColAutoFit = useCallback(() => {
    if (!labelColRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.font = '14px ui-sans-serif, system-ui, sans-serif';
    let maxWidth = 0;
    for (const item of itemRanges) {
      const width = ctx.measureText(item.name).width;
      if (width > maxWidth) maxWidth = width;
    }
    setLabelWidth(Math.max(120, Math.min(600, Math.ceil(maxWidth + 40))));
  }, [itemRanges]);

  // Dismiss tooltip when a touch lands outside any chart segment
  useEffect(() => {
    const handleOutsideTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (!target.closest('[data-segment]')) {
        setTooltip(null);
      }
    };
    document.addEventListener('touchstart', handleOutsideTouch);
    return () => document.removeEventListener('touchstart', handleOutsideTouch);
  }, []);

  return (
    <div className="rounded-lg bg-white shadow-xs border border-slate-200 flex flex-col h-[600px]">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Procurement Schedule</h2>
          <p className="mt-1 text-sm text-slate-600">
            {itemRanges.length} procurement item{itemRanges.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-slate-200 p-1">
          {(['quarters', 'months', 'weeks', 'days'] as ZoomLevel[]).map((z) => (
            <button
              key={z}
              onClick={() => setZoom(z)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                zoom === z
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {z.charAt(0).toUpperCase() + z.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {itemRanges.length === 0 ? (
        <p className="text-sm text-slate-500 py-8 text-center">
          No procurement items to display.
        </p>
      ) : (
        <div ref={chartRef} className="flex flex-col flex-1 min-h-0 overflow-x-auto">
          <div style={{ minWidth: chartMinWidth }} className="flex flex-col flex-1 min-h-0">
            <div className="flex border-b border-slate-200 shrink-0 bg-white z-20">
              <div
                ref={labelColRef}
                className="shrink-0 py-2 text-xs font-medium text-slate-500 relative select-none"
                style={{ width: labelWidth }}
              >
                <span className="pl-2">Item</span>
                <div
                  className="absolute top-0 right-0 h-full w-2 cursor-col-resize border-r border-slate-200 hover:border-slate-400 hover:bg-slate-100 transition-colors"
                  onMouseDown={handleColDragStart}
                  onDoubleClick={handleColAutoFit}
                />
              </div>
              <div className="flex-1 relative h-8 overflow-hidden">
                {weekendBands.map((band, i) => (
                  <div
                    key={`wh-${i}`}
                    className="absolute top-0 h-full bg-slate-100/60"
                    style={{ left: `${band.left}%`, width: `${band.width}%` }}
                  />
                ))}
                {subTicks.map((date, i) => {
                  const pos = (daysBetween(chartStart, date) / totalDays) * 100;
                  return (
                    <div
                      key={`st-${i}`}
                      className="absolute top-0 h-full border-l border-slate-100/70"
                      style={{ left: `${pos}%` }}
                    />
                  );
                })}
                {ticks.map((tick, i) => {
                  const pos = (daysBetween(chartStart, tick.date) / totalDays) * 100;
                  return (
                    <div
                      key={i}
                      className="absolute top-0 h-full border-l border-slate-200"
                      style={{ left: `${pos}%` }}
                    >
                      <span className="absolute top-1 left-1 whitespace-nowrap text-[10px] text-slate-400">
                        {tick.label}
                      </span>
                    </div>
                  );
                })}
                {todayPos !== null && (
                  <div
                    className="absolute top-0 h-full z-30 pointer-events-none"
                    style={{ left: `${todayPos}%`, borderLeft: '1px solid #475569' }}
                  />
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              {todayPos !== null && (
                <div className="sticky top-0 z-30 h-0 flex pointer-events-none">
                  <div className="shrink-0" style={{ width: labelWidth }} />
                  <div className="flex-1 relative">
                    <span
                      className="absolute top-1 text-[10px] font-medium text-slate-600 bg-white/85 px-1 rounded-sm select-none whitespace-nowrap"
                      style={{
                        left: `${todayPos}%`,
                        transform: 'translateX(-50%)',
                      }}
                    >
                      July 15, 2026
                    </span>
                  </div>
                </div>
              )}
              {itemRanges.map((item) => {
                const barLeft = (daysBetween(chartStart, item.start) / totalDays) * 100;
                const barWidth = (daysBetween(item.start, item.delivery) / totalDays) * 100;
                const barSegments = computeBarSegments(item.timeline_data, item.totalWorkdays, item.start);

                return (
                  <div
                    key={item.id}
                    className="flex border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <div
                      className="shrink-0 py-3 flex items-center bg-white relative select-none"
                      style={{ width: labelWidth }}
                    >
                      <div className="min-w-0 pl-2 pr-4">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {formatDateFull(item.start)} — {formatDateFull(item.delivery)}
                        </p>
                      </div>
                      <div
                        className="absolute top-0 right-0 h-full w-2 cursor-col-resize border-r border-slate-200 hover:border-slate-400 hover:bg-slate-100 transition-colors"
                        onMouseDown={handleColDragStart}
                        onDoubleClick={handleColAutoFit}
                      />
                    </div>
                    <div className="flex-1 relative py-3 overflow-hidden">
                      {weekendBands.map((band, i) => (
                        <div
                          key={`wr-${i}`}
                          className="absolute top-0 h-full bg-slate-100/60"
                          style={{ left: `${band.left}%`, width: `${band.width}%` }}
                        />
                      ))}
                      {subTicks.map((date, i) => {
                        const pos = (daysBetween(chartStart, date) / totalDays) * 100;
                        return (
                          <div
                            key={`sr-${i}`}
                            className="absolute top-0 h-full border-l border-slate-100/70"
                            style={{ left: `${pos}%` }}
                          />
                        );
                      })}
                      {ticks.map((tick, i) => {
                        const pos = (daysBetween(chartStart, tick.date) / totalDays) * 100;
                        return (
                          <div
                            key={i}
                            className="absolute top-0 h-full border-l border-slate-200/50"
                            style={{ left: `${pos}%` }}
                          />
                        );
                      })}

                      {todayPos !== null && (
                        <div
                          className="absolute top-0 h-full z-10 pointer-events-none"
                          style={{
                            left: `${todayPos}%`,
                            borderLeft: '1px solid #475569',
                          }}
                        />
                      )}

                      <div
                        className="absolute h-5 rounded-xs overflow-hidden"
                        style={{
                          left: `${Math.max(0, barLeft)}%`,
                          width: `${Math.max(0.5, barWidth)}%`,
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      >
                        <div className="relative w-full h-full flex">
                          {barSegments.map((seg, si) => {
                            const showTooltip = (rect: DOMRect) => {
                              setTooltip({
                                itemName: item.name,
                                phaseName: seg.name,
                                startDate: formatDateFull(seg.startDate),
                                endDate: formatDateFull(seg.endDate),
                                days: seg.days,
                                rect,
                              });
                            };
                            return (
                              <div
                                key={si}
                                data-segment="true"
                                className="h-full"
                                style={{
                                  width: `${seg.width}%`,
                                  backgroundColor: seg.color,
                                }}
                                onMouseEnter={(e) => showTooltip((e.currentTarget as HTMLElement).getBoundingClientRect())}
                                onMouseLeave={() => setTooltip(null)}
                                onTouchStart={(e) => showTooltip((e.currentTarget as HTMLElement).getBoundingClientRect())}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tooltip && (() => {
        const bubbleW = 220;
        const bubbleH = 96;
        const gap = 6;
        const { rect } = tooltip;

        const rawLeft = rect.left;
        const left = Math.min(Math.max(rawLeft, 8), window.innerWidth - bubbleW - 8);

        const belowTop = rect.bottom + gap;
        const aboveTop = rect.top - gap - bubbleH;
        const top = belowTop + bubbleH > window.innerHeight ? Math.max(aboveTop, 8) : belowTop;

        return (
          <div
            className="fixed z-50 pointer-events-none rounded-md border border-slate-200 bg-white px-3 py-2 shadow-lg text-sm"
            style={{ left, top, width: bubbleW }}
          >
            <p className="font-semibold text-slate-900">{tooltip.itemName}</p>
            <p className="text-slate-700">{tooltip.phaseName}</p>
            <p className="text-slate-600">{tooltip.startDate} — {tooltip.endDate}</p>
            <p className="text-slate-600">{tooltip.days} working days</p>
          </div>
        );
      })()}
    </div>
  );
}
