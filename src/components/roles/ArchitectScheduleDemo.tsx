import { DoorClosed, DraftingCompass, Grid2x2, HardHat, LampCeiling, PanelsTopLeft, User, Wrench, type LucideIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { gradientBottom, tokenFor, v } from '../demo/screens/procurement-chain/chainVocabulary';
import type { PhaseFamily } from '../demo/screens/procurement-schedule/scheduleModel';
import { MONTHS, SCHEDULE, SCHEDULE_YEAR, TEAM_LABEL, longDate, shortDate, type ScheduledActivity, type ScheduledItem, type Team } from './architectScheduleData';
import '../demo/tokens.css';
import '../demo/screens/procurement-chain/chainTokens.css';

/**
 * The interactive procurement schedule of the Architects & Engineers page's
 * solution section (Design System §64). A website demonstration, not the
 * application: static illustrative data (architectScheduleData.ts), no
 * persistence, no scheduling engine.
 *
 *   ONE BAR PER ITEM. Each procurement item is one continuous bar of
 *   adjoining segments on a shared January to June calendar, each segment
 *   placed and sized by its own dates. Segments are coloured by activity
 *   family in the approved Procurement Chain palette (--jpd-chain-*, §51.7):
 *   the repository's authoritative scheme, kept rather than replaced by
 *   team colours.
 *
 *   RESPONSIBILITY BY EMPHASIS. The team filter never moves, resizes,
 *   removes or rejoins a segment: the chosen team's segments stay at full
 *   strength with a light outline, every other segment dims in place, so an
 *   architect sees their commitments and everything around them. Design Team
 *   is selected on load.
 *
 *   DETAIL. Choosing a segment shows its item, activity, responsible party,
 *   dates, the next activity and the RoSD in a panel beneath the chart.
 *
 * Below `md` the chart scrolls sideways inside its own frame, never the page,
 * so the calendar is never compressed. Opacity transitions only, and none
 * under reduced motion.
 */

type Filter = 'all' | Team;

const FILTERS: ReadonlyArray<{ id: Filter; label: string; Icon?: LucideIcon }> = [
  { id: 'all', label: 'All Teams' },
  { id: 'design', label: 'Design Team', Icon: DraftingCompass },
  { id: 'owner', label: 'Owner', Icon: User },
  { id: 'gc', label: 'GC', Icon: HardHat },
  { id: 'trade', label: 'Trade Partners', Icon: Wrench },
];

const ITEM_ICON: Record<string, LucideIcon> = {
  windows: Grid2x2,
  doors: DoorClosed,
  lighting: LampCeiling,
  millwork: PanelsTopLeft,
};

/** The activity families this schedule uses, in legend order, with this demonstration's legend copy. */
const LEGEND: ReadonlyArray<{ family: PhaseFamily; label: string }> = [
  { family: 'coordination', label: 'Selections and coordination' },
  { family: 'buyout', label: 'Buyout and release' },
  { family: 'preparation', label: 'Submittal preparation' },
  { family: 'review', label: 'Review and approval' },
  { family: 'production', label: 'Fabrication' },
  { family: 'logistics', label: 'Shipping and delivery' },
];

/** The §51.4 segment fill: the family token, darkening 12% toward the bottom. */
/** "Architect (Design Team)"; the team only when it adds something. */
const partyOf = (a: ScheduledActivity) => (a.responsible === TEAM_LABEL[a.team] ? a.responsible : `${a.responsible} (${TEAM_LABEL[a.team]})`);

const segmentFill = (f: PhaseFamily) => ({ backgroundImage: `linear-gradient(180deg, ${v(tokenFor(f))}, ${gradientBottom(f)})` });

/** Another team's segment while a team is chosen: the family muted toward the neutral border ink. It stays legible
 *  against the panel (about 3:1) and keeps its family's hue, so the bar still reads whole. */
const mutedFill = (f: PhaseFamily) => ({
  backgroundColor: `color-mix(in oklab, ${v(tokenFor(f))} 35%, color-mix(in oklab, var(--jp-border) 55%, var(--jp-surface)))`,
});

const GRID_COLUMNS = 'grid-cols-[minmax(11rem,15rem)_8rem_minmax(26rem,1fr)] xl:grid-cols-[minmax(11.5rem,15.5rem)_8.25rem_minmax(0,1fr)]';

function RosdMark({ at }: { at: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-1/2 z-20 block size-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[3px] border-2 border-jp-brand-amber bg-jp-text-primary shadow-[0_0_10px_color-mix(in_oklab,var(--jp-brand-amber)_55%,transparent)] lg:size-[1.125rem]"
      style={{ left: `${at * 100}%` }}
    />
  );
}

function Bar({
  item,
  filter,
  selected,
  onSelect,
}: {
  item: ScheduledItem;
  filter: Filter;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const last = item.activities.length - 1;
  return (
    <div className="jpd relative h-14 lg:h-[3.75rem]">
      {item.activities.map((a, i) => {
        const on = filter === 'all' || a.team === filter;
        const isSelected = a.id === selected;
        return (
          <button
            key={a.id}
            type="button"
            aria-pressed={isSelected}
            aria-label={`${item.name}: ${a.name}. ${partyOf(a)}. ${longDate(a.start)} to ${longDate(a.finish)}, ${a.days} days.`}
            onClick={() => onSelect(a.id)}
            className={`absolute top-1/2 h-[1.125rem] -translate-y-1/2 cursor-pointer focus-visible:z-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-text-primary lg:h-5 ${
              i === 0 ? 'rounded-l-full' : ''
            } ${i === last ? 'rounded-r-full' : ''} ${isSelected ? 'z-10 outline-2 outline-offset-2 outline-jp-text-primary' : ''}`}
            style={{ left: `${a.left * 100}%`, width: `${a.width * 100}%`, ...(on ? segmentFill(a.family) : mutedFill(a.family)) }}
          >
            {/* Responsibility outline (a team filter is on), and a hairline where one activity meets the next. */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 ${i === 0 ? 'rounded-l-full' : ''} ${i === last ? 'rounded-r-full' : ''} ${
                on && filter !== 'all' ? 'shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--jp-text-primary)_85%,transparent)]' : ''
              } ${i > 0 ? 'border-l border-jp-background/45' : ''}`}
            />
          </button>
        );
      })}
      {/* The bar's outline, around all its segments: one continuous shape under every filter. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 h-[1.125rem] -translate-y-1/2 rounded-full shadow-[0_0_0_1px_color-mix(in_oklab,var(--jp-border)_45%,transparent)] lg:h-5"
        style={{ left: `${item.activities[0].left * 100}%`, width: `${(item.rosdAt - item.activities[0].left) * 100}%` }}
      />
      <RosdMark at={item.rosdAt} />
    </div>
  );
}

function Detail({ item, activity }: { item: ScheduledItem; activity: ScheduledActivity }) {
  const rows: Array<[string, string]> = [
    ['Activity', activity.name],
    ['Responsible party', partyOf(activity)],
    ['Scheduled', `${longDate(activity.start)} to ${longDate(activity.finish)} (${activity.days} days)`],
    ['Required completion', longDate(activity.finish)],
    ['Next activity', activity.next ?? 'Delivered to site'],
    ['Required On-Site Date', longDate(item.rosd)],
  ];
  return (
    <div className="flex gap-4 sm:gap-5">
      <span aria-hidden="true" className="jpd block w-1.5 shrink-0 rounded-full" style={segmentFill(activity.family)} />
      <div className="min-w-0 flex-1">
        <p className="font-heading text-[1.0625rem] font-bold text-jp-text-primary lg:text-[1.125rem]">{item.name}</p>
        <dl className="mt-2 grid gap-x-8 gap-y-1.5 text-[0.875rem] sm:grid-cols-2 lg:grid-cols-3 lg:text-[0.9375rem]">
          {rows.map(([term, value]) => (
            <div key={term} className="min-w-0">
              <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-jp-text-muted">{term}</dt>
              <dd className="text-jp-text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function ArchitectScheduleDemo() {
  const [filter, setFilter] = useState<Filter>('design');
  const [selected, setSelected] = useState('windows-4');
  const titleId = useId();
  const descId = useId();
  const owner = SCHEDULE.find((item) => item.activities.some((a) => a.id === selected))!;
  const activity = owner.activities.find((a) => a.id === selected)!;

  return (
    <div
      className="relative rounded-2xl border border-jp-brand-amber/70 p-5 shadow-[0_0_0_1px_color-mix(in_oklab,var(--jp-brand-amber)_12%,transparent),0_0_42px_-6px_color-mix(in_oklab,var(--jp-brand-amber)_30%,transparent)] sm:p-7 lg:p-[clamp(1.5rem,2.1vw,2.25rem)]"
      style={{ backgroundImage: 'linear-gradient(180deg, color-mix(in oklab, var(--jp-surface) 82%, var(--jp-border)), color-mix(in oklab, var(--jp-surface) 55%, var(--jp-background)))' }}
    >
      <h3 id={titleId} className="font-heading text-[1.375rem] font-bold leading-tight tracking-[-0.015em] text-jp-text-primary sm:text-[1.625rem] lg:text-[clamp(1.5rem,1.75vw,1.875rem)]">
        Project Procurement Schedule
      </h3>
      <p id={descId} className="mt-1.5 text-[0.9375rem] text-jp-text-secondary lg:text-[clamp(0.9375rem,1.05vw,1.0625rem)]">
        <span className="font-semibold text-jp-text-primary">Illustrative project, {SCHEDULE_YEAR}</span>
        <span aria-hidden="true" className="mx-2.5 text-jp-text-muted">|</span>
        Filter by responsible team to see relevant commitments
        <span className="sr-only">
          . Four procurement items, each drawn as one continuous bar of activities on a January to June calendar, scheduled backward from
          its Required On-Site Date. Choose a team to highlight its activities; choose an activity for its details.
        </span>
      </p>

      <div role="group" aria-label="Filter by responsible team" className="mt-5 flex flex-wrap gap-2.5 lg:mt-6 lg:gap-3">
        {FILTERS.map(({ id, label, Icon }) => {
          const active = filter === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-[0.9375rem] font-semibold transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none lg:px-5 lg:text-[1rem] ${
                active
                  ? 'border-jp-brand-amber bg-jp-brand-amber text-jp-background shadow-[0_8px_22px_-10px_color-mix(in_oklab,var(--jp-brand-amber)_70%,transparent)]'
                  : 'cursor-pointer border-jp-border/40 text-jp-text-primary hover:border-jp-brand-amber-active hover:text-jp-brand-amber-active'
              }`}
            >
              {Icon ? <Icon aria-hidden="true" size={18} strokeWidth={1.75} className={active ? 'text-jp-background' : 'text-jp-brand-amber'} /> : null}
              {label}
            </button>
          );
        })}
      </div>

      {/* The chart: its own horizontal scroll below `md`, so the calendar is never squeezed. */}
      <div className="mt-6 -mx-5 overflow-x-auto px-5 sm:-mx-7 sm:px-7 lg:mx-0 lg:px-0" tabIndex={0} role="region" aria-label="Procurement schedule chart">
        <div className="min-w-[34rem] border-t border-jp-border/20 md:min-w-[46rem]">
          <div className={`py-3 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-jp-text-muted md:grid ${GRID_COLUMNS} md:items-center md:gap-x-4 lg:text-[0.8125rem]`}>
            <span className="hidden md:block">Product / Material</span>
            <span className="hidden whitespace-nowrap md:block">Required On-Site</span>
            <div aria-hidden="true" className="relative h-4">
              {MONTHS.map((m, i) => (
                <span
                  key={m.label}
                  className="absolute -translate-x-1/2 text-jp-text-secondary"
                  style={{ left: `${((m.at + (MONTHS[i + 1]?.at ?? 1)) / 2) * 100}%` }}
                >
                  {m.label.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <ul>
            {SCHEDULE.map((item) => {
              const Icon = ITEM_ICON[item.id];
              return (
                <li key={item.id} className={`border-t border-jp-border/15 pt-3 md:grid ${GRID_COLUMNS} md:items-center md:gap-x-4 md:pt-0`}>
                  {/* Phones: name and RoSD on one line, the bar beneath. From `md`, three columns. */}
                  <div className="flex flex-col items-start gap-1 md:contents">
                  <div className="flex min-w-0 items-center gap-3.5 md:py-2">
                    <Icon aria-hidden="true" strokeWidth={1.4} className="size-7 shrink-0 text-jp-text-primary/80 lg:size-8" />
                    <div className="min-w-0">
                      <p className="truncate text-[0.9375rem] font-semibold text-jp-text-primary lg:text-[1rem]">{item.name}</p>
                      <p className="truncate text-[0.8125rem] text-jp-text-muted">{item.scope}</p>
                    </div>
                  </div>
                  <p className="pl-[2.625rem] font-heading text-[1rem] font-bold text-jp-brand-amber md:pl-0 lg:text-[1.0625rem]">
                    <span className="sr-only">Required on site </span>
                    <span aria-hidden="true" className="mr-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-jp-text-muted md:hidden">On site</span>
                    {shortDate(item.rosd)}
                  </p>
                  </div>
                  <div className="relative">
                    {/* Month lines behind the bar. */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 inset-x-0">
                      {MONTHS.slice(1).map((m) => (
                        <span key={m.label} className="absolute inset-y-0 w-px bg-jp-border/12" style={{ left: `${m.at * 100}%` }} />
                      ))}
                    </div>
                    <Bar item={item} filter={filter} selected={selected} onSelect={setSelected} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="mt-2 text-[0.75rem] text-jp-text-muted md:hidden">Scroll sideways to see the full calendar.</p>

      {/* The chosen activity. */}
      <div aria-live="polite" className="mt-5 rounded-xl border border-jp-border/20 bg-jp-background/35 p-4 sm:p-5">
        <Detail item={owner} activity={activity} />
      </div>

      {/* Legend: activity families (the chain palette), then the RoSD. */}
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-jp-border/20 pt-5 text-[0.8125rem] text-jp-text-secondary lg:text-[0.875rem]">
        {LEGEND.map(({ family, label }) => (
          <li key={family} className="jpd flex items-center gap-2.5">
            <span aria-hidden="true" className="block h-3.5 w-7 rounded-full" style={segmentFill(family)} />
            {label}
          </li>
        ))}
        <li className="flex items-center gap-2.5">
          <span aria-hidden="true" className="block size-3.5 rotate-45 rounded-[2px] border-2 border-jp-brand-amber bg-jp-text-primary" />
          Required On-Site Date (RoSD)
        </li>
        <li className="flex items-center gap-2.5">
          <span aria-hidden="true" className="block h-3.5 w-7 rounded-full shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--jp-text-primary)_85%,transparent)]" />
          Outlined: the selected team&apos;s work
        </li>
      </ul>
    </div>
  );
}
