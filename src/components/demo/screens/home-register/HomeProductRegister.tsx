import type { ReactNode } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Filter,
  Folder,
  Home,
  Layers,
  LayoutList,
  Plus,
  Search,
  X,
} from 'lucide-react';
import JiTproWordmark from '../../../JiTproWordmark';
import DemoStatusBadge from '../../primitives/DemoStatusBadge';
import { USER } from '../../fixtures/project';
import {
  HOME_CANVAS,
  HOME_KPIS,
  HOME_PAGE,
  HOME_ROWS,
  RoSD_NOT_ESTABLISHED,
  RoSD_PANEL_PLACEHOLDER,
  RoSD_PLACEHOLDER,
  SELECTED,
  workdaysLabel,
  type RoSDPresentation,
} from './homeRegisterData';
import '../../tokens.css';

/**
 * HOMEPAGE PRODUCT REGISTER - the curated Step 01 screen (Design System
 * Section 52).
 *
 * A fixed 1280 x 740 application canvas, scaled as one unit by its figure and
 * never reflowed. Built from the same tokens and primitives as the full
 * Product Register (whose screen, shell and fixture are untouched) and
 * simplified for a homepage reader: four cards, six products, six columns,
 * one selected product and a detail panel that ends on its Required On-Site
 * date - the hand-off to Step 02.
 *
 * ONE REGISTER, TWO STEPS (Section 52.5). Step 01 and Step 02 render this
 * same component. `rosd` decides only whether each Required On-Site date is
 * shown yet: Step 01 passes RoSD_NOT_ESTABLISHED (every cell and the panel
 * show a neutral placeholder); Step 02 drives four rows and the panel to
 * their dates as it establishes them. The data never changes. Each date cell
 * carries `data-rosd-cell` so Step 02 can land its markers on it.
 *
 * Inert by design: nothing here is a control. Colours are `--jpd-*` tokens
 * only.
 */

const SIDEBAR_W = 196;
const PANEL_W = 276;
const MAIN_W = HOME_CANVAS.w - SIDEBAR_W - PANEL_W; // 808
const MAIN_PAD = 24;

const NAV = [
  { label: 'Project Overview', icon: Home },
  { label: 'Scope', icon: Folder },
  { label: 'Products', icon: Layers },
  { label: 'Commitments', icon: BadgeCheck },
  { label: 'Schedule', icon: Calendar },
  { label: 'Reports', icon: BarChart3 },
];
const ACTIVE_NAV = 'Products';

const KPI_ICON = { list: LayoutList, check: CheckCircle2, clock: Clock, alert: AlertTriangle } as const;
const KPI_TINT = {
  neutral: { bg: 'var(--jpd-neutral-bg)', fg: 'var(--jpd-text-strong)' },
  ok: { bg: 'var(--jpd-ok-bg)', fg: 'var(--jpd-ok-fg)' },
  warn: { bg: 'var(--jpd-warn-bg)', fg: 'var(--jpd-warn-fg)' },
  error: { bg: 'var(--jpd-error-bg)', fg: 'var(--jpd-error-fg)' },
} as const;

/** Six columns, summing to the 760px table width. */
const COLUMNS = [
  { key: 'name', label: 'Product / Description', w: 248 },
  { key: 'category', label: 'Category', w: 112 },
  { key: 'trade', label: 'Trade', w: 76 },
  { key: 'status', label: 'Status', w: 100 },
  { key: 'fabrication', label: 'Fabrication Duration', w: 118 },
  { key: 'ros', label: 'Required On-Site', w: 106 },
] as const;
const HEADER_H = 40;
const ROW_H = 54;

export default function HomeProductRegister({ rosd = RoSD_NOT_ESTABLISHED }: { rosd?: RoSDPresentation }) {
  return (
    <div
      className="jpd"
      style={{
        width: HOME_CANVAS.w,
        height: HOME_CANVAS.h,
        display: 'flex',
        overflow: 'hidden',
        background: 'var(--jpd-surface)',
        color: 'var(--jpd-text)',
      }}
    >
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="flex min-h-0 flex-1">
          <Main rosd={rosd} />
          <DetailPanel reveal={rosd.panel} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ chrome */

function Sidebar() {
  return (
    <aside
      className="relative shrink-0"
      style={{
        width: SIDEBAR_W,
        background: 'linear-gradient(180deg, var(--jpd-nav-bg-start), var(--jpd-nav-bg-end))',
      }}
    >
      <div style={{ paddingLeft: 22, paddingTop: 24, fontSize: 21, lineHeight: 0 }}>
        <JiTproWordmark variant="amber" className="block" />
      </div>
      <div style={{ height: 1, background: 'var(--jpd-nav-divider)', margin: '18px 18px 0' }} />

      <div className="flex items-start" style={{ padding: '14px 0 0 14px', gap: 10 }}>
        <div className="shrink-0 overflow-hidden" style={{ width: 42, height: 42, borderRadius: 9, background: 'var(--jpd-nav-active-bg)' }}>
          <img
            src={`${import.meta.env.BASE_URL}assets/hero/house-render-800.webp`}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 62%' }}
          />
        </div>
        <div style={{ paddingTop: 3 }}>
          <div style={{ fontSize: 13, fontWeight: 600, lineHeight: '15px', color: 'var(--jpd-nav-text)' }}>
            {HOME_PAGE.project}
          </div>
          <div style={{ fontSize: 11, lineHeight: '13px', marginTop: 6, color: 'var(--jpd-nav-text-dim)' }}>
            {HOME_PAGE.location}
          </div>
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--jpd-nav-divider)', margin: '16px 18px 0' }} />

      <nav style={{ marginTop: 16 }}>
        {NAV.map(({ label, icon: Icon }) => {
          const active = label === ACTIVE_NAV;
          return (
            <div key={label} className="relative flex items-center" style={{ height: 46 }}>
              {active && (
                <>
                  <span
                    className="absolute"
                    style={{
                      left: 0,
                      top: 0,
                      bottom: 1,
                      width: 188,
                      background: 'var(--jpd-nav-active-bg)',
                      borderTopRightRadius: 6,
                      borderBottomRightRadius: 6,
                    }}
                  />
                  <span className="absolute" style={{ left: 0, top: 0, bottom: 1, width: 5, background: 'var(--jpd-accent)' }} />
                </>
              )}
              <span className="relative flex shrink-0 items-center justify-center" style={{ width: 56 }}>
                <Icon size={19} strokeWidth={1.75} color={active ? 'var(--jpd-accent)' : 'var(--jpd-nav-text)'} />
              </span>
              <span className="relative" style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: 'var(--jpd-nav-text)' }}>
                {label}
              </span>
            </div>
          );
        })}
      </nav>

      <div className="absolute flex items-center" style={{ left: 14, right: 14, bottom: 22, gap: 10 }}>
        <span
          className="inline-flex shrink-0 items-center justify-center rounded-full"
          style={{ width: 34, height: 34, background: 'var(--jpd-surface)', fontSize: 12.5, fontWeight: 700, color: 'var(--jpd-text)' }}
        >
          {USER.initials}
        </span>
        <div className="min-w-0">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--jpd-nav-text)' }}>{USER.name}</div>
          <div style={{ fontSize: 11, marginTop: 3, color: 'var(--jpd-nav-text-dim)' }}>{USER.role}</div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <div
      className="flex shrink-0 items-center"
      style={{ height: 56, borderBottom: '1px solid var(--jpd-border)', paddingLeft: 20, paddingRight: 24 }}
    >
      <Building2 size={20} strokeWidth={1.75} color="var(--jpd-text-strong)" />
      <span style={{ fontSize: 14.5, fontWeight: 500, marginLeft: 11 }}>{HOME_PAGE.project}</span>
      <ChevronDown size={15} strokeWidth={2} color="var(--jpd-text-strong)" style={{ marginLeft: 10 }} />
      <div className="ml-auto flex items-center" style={{ gap: 18 }}>
        <span className="relative inline-flex">
          <Bell size={19} strokeWidth={1.75} color="var(--jpd-text-strong)" />
          <span
            className="absolute inline-flex items-center justify-center rounded-full"
            style={{
              top: -6,
              right: -7,
              width: 16,
              height: 16,
              background: 'var(--jpd-action)',
              color: 'var(--jpd-surface)',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            3
          </span>
        </span>
        <span style={{ width: 1, height: 24, background: 'var(--jpd-border)' }} />
        <span className="flex items-center" style={{ gap: 9, fontSize: 14, fontWeight: 500 }}>
          Project Team
          <ChevronDown size={15} strokeWidth={2} color="var(--jpd-text-strong)" />
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- main */

function Main({ rosd }: { rosd: RoSDPresentation }) {
  return (
    <main className="shrink-0" style={{ width: MAIN_W, padding: `22px ${MAIN_PAD}px 0`, background: 'var(--jpd-surface)' }}>
      {/* Header */}
      <div className="flex items-start">
        <div>
          <h1 className="jpd-tight" style={{ fontSize: 26, fontWeight: 800, lineHeight: '30px' }}>
            {HOME_PAGE.title}
          </h1>
          <div style={{ fontSize: 15, fontWeight: 500, lineHeight: '20px', marginTop: 6 }}>{HOME_PAGE.project}</div>
          <div style={{ fontSize: 13, lineHeight: '18px', marginTop: 6, color: 'var(--jpd-text-secondary)' }}>
            {HOME_PAGE.description}
          </div>
        </div>
        <div
          className="ml-auto flex items-center justify-center"
          style={{
            height: 36,
            padding: '0 14px',
            gap: 7,
            borderRadius: 6,
            background: 'var(--jpd-action)',
            color: 'var(--jpd-surface)',
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          {HOME_PAGE.primaryAction}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4" style={{ gap: 10, marginTop: 18 }}>
        {HOME_KPIS.map((card) => {
          const Icon = KPI_ICON[card.icon as keyof typeof KPI_ICON] ?? LayoutList;
          const tint = KPI_TINT[card.tone];
          return (
            <div
              key={card.label}
              className="flex items-center"
              style={{ height: 74, border: '1px solid var(--jpd-border)', borderRadius: 6, paddingLeft: 12, gap: 12 }}
            >
              <span className="inline-flex shrink-0 items-center justify-center rounded-full" style={{ width: 40, height: 40, background: tint.bg }}>
                <Icon size={21} strokeWidth={1.9} color={tint.fg} />
              </span>
              <span>
                <span
                  className="jpd-tight block"
                  style={{ fontSize: 22, fontWeight: 700, lineHeight: '24px', color: card.tone === 'ok' ? 'var(--jpd-ok-fg)' : 'var(--jpd-text)' }}
                >
                  {card.value}
                </span>
                <span className="block" style={{ fontSize: 12.5, marginTop: 3, lineHeight: '16px', color: 'var(--jpd-text-secondary)', whiteSpace: 'nowrap' }}>
                  {card.label}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Filter row */}
      <div className="flex items-center" style={{ marginTop: 18, gap: 10 }}>
        <Control w={240}>
          <Search size={15} strokeWidth={2} color="var(--jpd-text-muted)" />
          <span style={{ color: 'var(--jpd-text-muted)' }}>Search products...</span>
        </Control>
        {['All Statuses', 'All Categories'].map((l) => (
          <Control key={l} w={148} between>
            <span style={{ fontWeight: 500 }}>{l}</span>
            <ChevronDown size={15} strokeWidth={2} color="var(--jpd-text-strong)" />
          </Control>
        ))}
        <Control w={86} center>
          <Filter size={14} strokeWidth={2} />
          <span style={{ fontWeight: 500 }}>Filters</span>
        </Control>
      </div>

      {/* Table */}
      <div style={{ marginTop: 16, border: '1px solid var(--jpd-border)', borderRadius: 6, overflow: 'hidden' }}>
        <div className="flex" style={{ height: HEADER_H, background: 'var(--jpd-surface-header)' }}>
          {COLUMNS.map((c, i) => (
            <div
              key={c.key}
              className="flex shrink-0 items-center"
              style={{
                width: c.w - (i === COLUMNS.length - 1 ? 2 : 0),
                paddingLeft: 12,
                paddingRight: 6,
                fontSize: 11.5,
                fontWeight: 600,
                lineHeight: '14px',
                color: 'var(--jpd-text-strong)',
                borderLeft: i === 0 ? 'none' : '1px solid var(--jpd-border)',
              }}
            >
              {c.label}
            </div>
          ))}
        </div>
        {HOME_ROWS.map((row) => (
          <div
            key={row.id}
            className="relative flex"
            style={{
              height: ROW_H,
              borderTop: '1px solid var(--jpd-divider)',
              background: row.selected ? 'var(--jpd-row-tint)' : 'transparent',
            }}
          >
            {row.selected && (
              <span className="absolute" style={{ left: 0, top: 0, bottom: 0, width: 4, background: 'var(--jpd-row-bar)' }} />
            )}
            <Cell w={COLUMNS[0].w} first>
              <span
                className="block"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: '17px',
                  color: 'var(--jpd-text-strong)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {row.name}
              </span>
              <span className="block" style={{ fontSize: 12, lineHeight: '17px', color: 'var(--jpd-text-secondary)' }}>
                {row.description}
              </span>
            </Cell>
            <Cell w={COLUMNS[1].w}>{row.category}</Cell>
            <Cell w={COLUMNS[2].w}>{row.trade}</Cell>
            <Cell w={COLUMNS[3].w}>
              <DemoStatusBadge status={row.status} />
            </Cell>
            <Cell w={COLUMNS[4].w}>{workdaysLabel(row.fabricationWorkdays)}</Cell>
            <Cell w={COLUMNS[5].w - 2} strong={row.selected} rosdCell={row.id}>
              <Reveal
                t={rosd.reveal(row)}
                pending={<span style={{ color: 'var(--jpd-text-muted)', fontWeight: 400 }}>{RoSD_PLACEHOLDER}</span>}
              >
                {row.requiredOnSite}
              </Reveal>
            </Cell>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 12.5, color: 'var(--jpd-text-secondary)' }}>{HOME_PAGE.showing}</div>
    </main>
  );
}

/* ------------------------------------------------------------ detail panel */

function DetailPanel({ reveal }: { reveal: number }) {
  return (
    <aside
      className="shrink-0"
      style={{
        width: PANEL_W,
        background: 'var(--jpd-surface-sunken)',
        borderLeft: '1px solid var(--jpd-border-subtle)',
        padding: '22px 20px 0',
      }}
    >
      <div className="flex items-center">
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--jpd-text-secondary)' }}>Product Detail</span>
        <X size={16} strokeWidth={2} className="ml-auto" color="var(--jpd-text-strong)" />
      </div>

      <div className="jpd-tight" style={{ fontSize: 18, fontWeight: 700, lineHeight: '23px', marginTop: 16 }}>
        {SELECTED.name}
      </div>
      <div style={{ marginTop: 9 }}>
        <DemoStatusBadge status={SELECTED.status} />
      </div>

      <Rule />
      <Field label="Project" value={HOME_PAGE.project} />
      <Field label="Category" value={SELECTED.category} />
      <Field label="Trade" value={SELECTED.trade} />
      <Field label="Supplier" value={SELECTED.supplier} />
      <Field label="Fabrication Duration" value={workdaysLabel(SELECTED.fabricationWorkdays)} />

      <Rule />
      {/* The panel's strongest value, and the hand-off to Step 02. */}
      <div style={{ marginTop: 16, fontSize: 12, fontWeight: 600, color: 'var(--jpd-text-secondary)' }}>Required On-Site</div>
      <div className="jpd-tight" style={{ marginTop: 4, fontSize: 24, fontWeight: 800, lineHeight: '28px', color: 'var(--jpd-text)' }}>
        <Reveal
          t={reveal}
          pending={
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 0, color: 'var(--jpd-text-muted)' }}>{RoSD_PANEL_PLACEHOLDER}</span>
          }
        >
          {SELECTED.requiredOnSite}
        </Reveal>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------- atoms */

function Control({ w, children, between, center }: { w: number; children: ReactNode; between?: boolean; center?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center ${between ? 'justify-between' : center ? 'justify-center' : ''}`}
      style={{ width: w, height: 36, border: '1px solid var(--jpd-border)', borderRadius: 6, padding: '0 11px', gap: 8, fontSize: 13 }}
    >
      {children}
    </div>
  );
}

/**
 * A Required On-Site value and its not-yet-established placeholder, in one
 * grid cell so the slot never changes size. t = 0 shows the placeholder,
 * t = 1 the value; between, the placeholder clears before the value arrives,
 * so the two are never read together (Section 46.3: t is the caller's one
 * shared state).
 */
function Reveal({ t, pending, children }: { t: number; pending: ReactNode; children: ReactNode }) {
  const clamp = (x: number) => Math.min(1, Math.max(0, x));
  return (
    <span style={{ display: 'grid', alignItems: 'center' }}>
      <span style={{ gridArea: '1 / 1', opacity: clamp(1 - t * 2) }} aria-hidden={t >= 0.5 || undefined}>
        {pending}
      </span>
      <span style={{ gridArea: '1 / 1', opacity: clamp(t * 2 - 1) }} aria-hidden={t < 0.5 || undefined}>
        {children}
      </span>
    </span>
  );
}

function Cell({
  w,
  children,
  first,
  strong,
  rosdCell,
}: {
  w: number;
  children: ReactNode;
  first?: boolean;
  strong?: boolean;
  rosdCell?: string;
}) {
  return (
    <div
      data-rosd-cell={rosdCell}
      className="flex shrink-0 items-center"
      style={{
        width: w,
        paddingLeft: 12,
        paddingRight: 8,
        borderLeft: first ? 'none' : '1px solid var(--jpd-border)',
        fontSize: 12.5,
        fontWeight: strong ? 700 : 400,
        color: strong ? 'var(--jpd-text)' : 'var(--jpd-text-body)',
      }}
    >
      <span style={{ width: '100%' }}>{children}</span>
    </div>
  );
}

function Rule() {
  return <div style={{ height: 1, background: 'var(--jpd-divider)', marginTop: 18 }} />;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginTop: 13 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--jpd-text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 13.5, lineHeight: '19px', marginTop: 2 }}>{value}</div>
    </div>
  );
}
