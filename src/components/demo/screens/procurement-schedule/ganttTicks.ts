/**
 * The Gantt's period header bands (quarters, months, weeks, days). Shared by
 * the full Procurement Schedule (`DemoGantt`) and the homepage Plan schedule
 * (Design System Section 54.4.2), so both label time identically.
 */

export type Zoom = 'quarters' | 'months' | 'weeks' | 'days';

export type Tick = { key: string; label: string; start: Date; end: Date };

export function buildTicks(domainStart: Date, domainEnd: Date, zoom: Zoom): Tick[] {
  const ticks: Tick[] = [];
  const c = new Date(domainStart);
  if (zoom === 'quarters') {
    c.setUTCDate(1);
    c.setUTCMonth(Math.floor(c.getUTCMonth() / 3) * 3);
    while (c < domainEnd) {
      const s = new Date(c);
      const e = new Date(c);
      e.setUTCMonth(e.getUTCMonth() + 3);
      ticks.push({
        key: s.toISOString(),
        label: `Q${Math.floor(s.getUTCMonth() / 3) + 1} ${s.getUTCFullYear()}`,
        start: s,
        end: e,
      });
      c.setUTCMonth(c.getUTCMonth() + 3);
    }
  } else if (zoom === 'months') {
    c.setUTCDate(1);
    while (c < domainEnd) {
      const s = new Date(c);
      const e = new Date(c);
      e.setUTCMonth(e.getUTCMonth() + 1);
      ticks.push({
        key: s.toISOString(),
        label: s.toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' }),
        start: s,
        end: e,
      });
      c.setUTCMonth(c.getUTCMonth() + 1);
    }
  } else if (zoom === 'weeks') {
    while (c.getUTCDay() !== 1) c.setUTCDate(c.getUTCDate() - 1);
    while (c < domainEnd) {
      const s = new Date(c);
      const e = new Date(c);
      e.setUTCDate(e.getUTCDate() + 7);
      ticks.push({
        key: s.toISOString(),
        label: s.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        start: s,
        end: e,
      });
      c.setUTCDate(c.getUTCDate() + 7);
    }
  } else {
    while (c < domainEnd) {
      const s = new Date(c);
      const e = new Date(c);
      e.setUTCDate(e.getUTCDate() + 1);
      ticks.push({
        key: s.toISOString(),
        label: String(s.getUTCDate()),
        start: s,
        end: e,
      });
      c.setUTCDate(c.getUTCDate() + 1);
    }
  }
  return ticks;
}
