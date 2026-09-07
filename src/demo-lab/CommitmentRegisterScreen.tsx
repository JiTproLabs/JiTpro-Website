import {
  AlertCircle,
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Filter,
  Folder,
  HelpCircle,
  Home,
  Layers,
  LayoutList,
  Link2,
  Package,
  Plus,
  Search,
  Settings,
  X,
} from 'lucide-react';
import JiTproWordmark from '../components/JiTproWordmark';
import CommitmentTable from './CommitmentTable';
import {
  DETAIL,
  KPI_CARDS,
  NAV_ITEMS,
  PAGE,
  PAGINATION_A,
  PAGINATION_B,
  PROJECT,
  STATUS_LABEL,
  TOOLBAR,
  USER,
  type Status,
} from './commitmentFixtures';
import './demoLab.css';

/**
 * PROTOTYPE - Commitment Register, built to the forensic Visual Reconstruction
 * Specification. TEMPORARY VALIDATION ARTIFACT, not the production system.
 *
 * ONE COMPONENT, TWO VARIANTS, BY DESIGN. Prototype B is not a second
 * implementation: it is this same tree with a different token set and three
 * bounded content/geometry switches. That is the mechanical guarantee behind
 * the gate's Section 5 requirement that A and B read as siblings rather than
 * as two competing concepts. If B ever needs its own JSX branch beyond the
 * three `isB` checks below, the refinement has exceeded its approved scope.
 *
 * EVERY NUMBER IN THIS FILE IS A MEASUREMENT from
 * `assets-src/methodology/commitment-capture.png`. None is a design choice,
 * and none may be rounded to a spacing scale: the reference does not sit on
 * one (measured gaps include 9, 14, 15, 23, 24, 26, 28, 29).
 */

type Variant = 'a' | 'b';

const NAV_ICONS = [Home, Folder, Layers, BadgeCheck, Calendar, BarChart3];
const ACTIVE_NAV = 3; // Commitments

const KPI_ICONS = {
  list: LayoutList,
  check: CheckCircle2,
  clock: Clock,
  alert: AlertTriangle,
  question: HelpCircle,
} as const;

/** Measured KPI card widths. Variant B normalizes these to equal flex. */
const KPI_WIDTHS_A = [177, 177, 182, 177, 194];

const KPI_ICON_TINT: Record<string, { bg: string; fg: string }> = {
  neutral: { bg: 'var(--jpd-neutral-bg)', fg: 'var(--jpd-text-strong)' },
  ok: { bg: 'var(--jpd-ok-bg)', fg: '#1a7f37' },
  warn: { bg: 'var(--jpd-warn-bg)', fg: '#f08c00' },
  error: { bg: 'var(--jpd-error-bg)', fg: '#e5484d' },
};

function StatusBadge({ status }: { status: Status }) {
  const map = {
    'on-track': {
      bg: 'var(--jpd-ok-bg)',
      bd: 'var(--jpd-ok-border)',
      fg: 'var(--jpd-ok-fg)',
      icon: <Check size={12} strokeWidth={3} />,
    },
    'at-risk': {
      bg: 'var(--jpd-warn-bg)',
      bd: 'var(--jpd-warn-border)',
      fg: 'var(--jpd-warn-fg)',
      icon: (
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            background: 'var(--jpd-warn-dot)',
            display: 'block',
          }}
        />
      ),
    },
    overdue: {
      bg: 'var(--jpd-error-bg)',
      bd: 'var(--jpd-error-border)',
      fg: 'var(--jpd-error-fg)',
      icon: <AlertCircle size={12} strokeWidth={2.5} />,
    },
  }[status];

  return (
    <span
      className="jpd-tight-sm inline-flex items-center gap-[5px]"
      style={{
        height: 25,
        padding: '0 9px',
        borderRadius: 5,
        background: map.bg,
        border: `1px solid ${map.bd}`,
        color: map.fg,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      {map.icon}
      {STATUS_LABEL[status]}
    </span>
  );
}

function Avatar({ initials, size = 25 }: { initials: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: '#f0f0f0',
        color: 'var(--jpd-text-strong)',
        fontSize: size * 0.4,
        fontWeight: 600,
      }}
    >
      {initials}
    </span>
  );
}

export default function CommitmentRegisterScreen({ variant = 'a' }: { variant?: Variant }) {
  const isB = variant === 'b';
  const pagination = isB ? PAGINATION_B : PAGINATION_A;

  return (
    <div className={`jpd jpd-${variant} jpd-canvas`}>
      {/* ================= SIDEBAR - measured 205px, full height ============ */}
      <aside
        className="relative shrink-0"
        style={{
          width: 205,
          background: 'linear-gradient(180deg, var(--jpd-nav-bg-start), var(--jpd-nav-bg-end))',
        }}
      >
        {/* Logo. Measured glyph box x24-122 / y29-62. Per Part 1 Section 6 the
            approved wordmark asset replaces the raster's own lettering; this is
            the one sanctioned departure from literal reproduction. */}
        <div style={{ paddingLeft: 24, paddingTop: 29, fontSize: 22.67, lineHeight: 0 }}>
          <JiTproWordmark variant="amber" className="block" />
        </div>

        <div style={{ height: 1, background: 'var(--jpd-nav-divider)', margin: '21px 20px 0' }} />

        {/* Project identity. Thumbnail 48x48 r10, name 14/600, location 12/400 */}
        <div className="flex items-start" style={{ padding: '16px 0 0 15px', gap: 10 }}>
          <div
            className="shrink-0 overflow-hidden"
            style={{ width: 48, height: 48, borderRadius: 10, background: '#1b2b38' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/hero/house-render-800.webp`}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 62%' }}
            />
          </div>
          <div style={{ paddingTop: 3 }}>
            <div className="jpd-tight-sm flex items-center" style={{ gap: 6 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, lineHeight: '15px', color: 'var(--jpd-nav-text)' }}>
                {PROJECT.name}
              </span>
              <ChevronDown size={13} strokeWidth={2.25} color="var(--jpd-nav-text)" />
            </div>
            <div style={{ fontSize: 11.5, lineHeight: '13px', marginTop: 8, color: 'var(--jpd-nav-text-dim)' }}>
              {PROJECT.location}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--jpd-nav-divider)', margin: '20px 20px 0' }} />

        {/* Nav. Measured pitch 51px, active box 50px tall ending at x196,
            amber indicator 5px wide flush to the canvas edge. */}
        <nav style={{ marginTop: 20 }}>
          {NAV_ITEMS.map((label, i) => {
            const Icon = NAV_ICONS[i];
            const active = i === ACTIVE_NAV;
            return (
              <div key={label} className="relative flex items-center" style={{ height: 51 }}>
                {active && (
                  <>
                    <span
                      className="absolute"
                      style={{
                        left: 0,
                        top: 0,
                        bottom: 1,
                        width: 196,
                        background: 'var(--jpd-nav-active-bg)',
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                      }}
                    />
                    <span
                      className="absolute"
                      style={{ left: 0, top: 0, bottom: 1, width: 5, background: 'var(--jpd-accent)' }}
                    />
                  </>
                )}
                <span
                  className="relative flex items-center justify-center shrink-0"
                  style={{ width: 60 }}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    color={active ? 'var(--jpd-accent)' : 'var(--jpd-nav-text)'}
                  />
                </span>
                <span
                  className="jpd-tight-sm relative"
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: active ? '#f9fafb' : 'var(--jpd-nav-text)',
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </nav>

        {/* Footer. Measured divider y800, Settings 821-843, Help 871-893,
            user block 944-979. The 330px void above is deliberate. */}
        <div className="absolute" style={{ left: 0, right: 0, top: 800 }}>
          <div style={{ height: 1, background: 'var(--jpd-nav-divider)', margin: '0 20px' }} />
          {[
            { icon: Settings, label: 'Settings' },
            { icon: HelpCircle, label: 'Help' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center" style={{ height: 50, marginTop: 4 }}>
              <span className="flex items-center justify-center shrink-0" style={{ width: 60 }}>
                <Icon size={20} strokeWidth={1.75} color="var(--jpd-nav-text)" />
              </span>
              <span
                className="jpd-tight-sm"
                style={{ fontSize: 15, fontWeight: 500, color: 'var(--jpd-nav-text)' }}
              >
                {label}
              </span>
            </div>
          ))}

          <div className="flex items-center" style={{ paddingLeft: 15, marginTop: 38, gap: 10 }}>
            <span
              className="inline-flex shrink-0 items-center justify-center rounded-full"
              style={{ width: 36, height: 36, background: '#ffffff', fontSize: 13, fontWeight: 700, color: '#0d1b26' }}
            >
              {USER.initials}
            </span>
            <div>
              <div className="jpd-tight-sm flex items-center" style={{ gap: 24 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--jpd-nav-text)' }}>
                  {USER.name}
                </span>
                <ChevronDown size={13} strokeWidth={2.25} color="var(--jpd-nav-text)" />
              </div>
              <div style={{ fontSize: 11.5, marginTop: 4, color: 'var(--jpd-nav-text-dim)' }}>
                {USER.role}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= RIGHT OF SIDEBAR: 1243px ========================= */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOP BAR - measured 60px, spans main AND panel */}
        <div
          className="flex shrink-0 items-center"
          style={{
            height: 60,
            borderBottom: '1px solid #eff1f3',
            background: 'var(--jpd-surface)',
            paddingLeft: 18,
            paddingRight: 200,
          }}
        >
          <Building2 size={22} strokeWidth={1.75} color="var(--jpd-text-strong)" />
          <span
            className="jpd-tight-sm"
            style={{ fontSize: 15, fontWeight: 500, marginLeft: 12, color: 'var(--jpd-text)' }}
          >
            {PROJECT.name}
          </span>
          <ChevronDown size={16} strokeWidth={2} color="var(--jpd-text-strong)" style={{ marginLeft: 12 }} />

          <div className="ml-auto flex items-center" style={{ gap: 18 }}>
            <span className="relative inline-flex">
              <Bell size={20} strokeWidth={1.75} color="var(--jpd-text-strong)" />
              <span
                className="absolute inline-flex items-center justify-center rounded-full"
                style={{
                  top: -6,
                  right: -7,
                  width: 17,
                  height: 17,
                  background: 'var(--jpd-action)',
                  color: '#fff',
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                3
              </span>
            </span>
            <span style={{ width: 1, height: 26, background: '#e6e8ea' }} />
            <span className="jpd-tight-sm flex items-center" style={{ gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>Project Team</span>
              <ChevronDown size={16} strokeWidth={2} color="var(--jpd-text-strong)" />
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* ============== MAIN - measured 989px ========================== */}
          <main
            className="shrink-0"
            style={{ width: 989, paddingLeft: 18, paddingRight: 26, background: 'var(--jpd-surface)' }}
          >
            {/* PAGE HEADER. Text left edge measured x233 = 10px inside the
                card/table edge at x223. */}
            <div className="flex items-start" style={{ paddingTop: 26, paddingLeft: 10 }}>
              <div>
                <h1
                  className="jpd-tight"
                  style={{ fontSize: 27, fontWeight: 800, lineHeight: '29px', color: 'var(--jpd-text)' }}
                >
                  {PAGE.title}
                </h1>
                <div
                  className="jpd-tight-sm"
                  style={{ fontSize: 17.4, fontWeight: 500, lineHeight: '24px', marginTop: 11.5, color: 'var(--jpd-text)' }}
                >
                  {PAGE.subtitle}
                </div>
                <div
                  className="jpd-tight-sm"
                  style={{ fontSize: 13.3, lineHeight: '20px', marginTop: 8.5, color: 'var(--jpd-text-secondary)' }}
                >
                  {PAGE.description}
                </div>
              </div>

              <div className="ml-auto flex items-start" style={{ gap: 24, marginTop: 0 }}>
                <div
                  className="flex items-stretch overflow-hidden"
                  style={{ width: 121, height: 38, borderRadius: 6, border: '1px solid var(--jpd-border)' }}
                >
                  <span
                    className="jpd-tight-sm flex items-center"
                    style={{ gap: 8, padding: '0 14px', fontSize: 14, fontWeight: 600 }}
                  >
                    <Download size={16} strokeWidth={2} />
                    Export
                  </span>
                  <span
                    className="flex items-center justify-center"
                    style={{ width: 36, borderLeft: '1px solid var(--jpd-border)' }}
                  >
                    <ChevronDown size={16} strokeWidth={2} />
                  </span>
                </div>
                <div
                  className="jpd-tight-sm flex items-center justify-center"
                  style={{
                    width: 169,
                    height: 38,
                    borderRadius: 6,
                    background: 'var(--jpd-action)',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    gap: 8,
                  }}
                >
                  <Plus size={17} strokeWidth={2.5} />
                  New Commitment
                </div>
              </div>
            </div>

            {/* KPI ROW - measured cards 102px tall, 9px gaps */}
            <div className="flex" style={{ marginTop: 22.95, paddingLeft: 1, gap: 8 }}>
              {KPI_CARDS.map((card, i) => {
                const Icon = KPI_ICONS[card.icon];
                const tint = KPI_ICON_TINT[card.tone];
                return (
                  <div
                    key={card.label}
                    className="flex items-center shrink-0"
                    style={{
                      width: isB ? undefined : KPI_WIDTHS_A[i],
                      flex: isB ? '1 1 0' : undefined,
                      height: 102,
                      border: '1px solid var(--jpd-border)',
                      borderRadius: 6,
                      background: 'var(--jpd-surface)',
                      paddingLeft: 11,
                      gap: 12,
                    }}
                  >
                    <span
                      className="inline-flex shrink-0 items-center justify-center rounded-full"
                      style={{ width: 44, height: 44, background: tint.bg }}
                    >
                      <Icon size={card.icon === 'list' ? 22 : 26} strokeWidth={1.9} color={tint.fg} />
                    </span>
                    <span>
                      <span
                        className="jpd-tight block"
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          lineHeight: '24px',
                          color: card.tone === 'ok' ? '#1a7f37' : 'var(--jpd-text)',
                        }}
                      >
                        {card.value}
                      </span>
                      <span
                        className="jpd-tight-sm block"
                        style={{
                          fontSize: 13,
                          marginTop: 3,
                          lineHeight: '17px',
                          color: 'var(--jpd-text-secondary)',
                          maxWidth: 108,
                        }}
                      >
                        {card.label}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* TOOLBAR - measured 39px controls */}
            <div className="flex items-center" style={{ marginTop: 23, paddingLeft: 2, paddingRight: 2 }}>
              <div
                className="flex items-center shrink-0"
                style={{
                  width: 236,
                  height: 39,
                  border: '1px solid var(--jpd-border)',
                  borderRadius: 6,
                  paddingLeft: 12,
                  gap: 10,
                }}
              >
                <Search size={16} strokeWidth={2} color="var(--jpd-text-muted)" />
                <span className="jpd-tight-sm" style={{ fontSize: 14, color: 'var(--jpd-text-muted)' }}>
                  {TOOLBAR.searchPlaceholder}
                </span>
              </div>
              {TOOLBAR.selects.map((label, i) => (
                <div
                  key={label}
                  className="flex items-center justify-between shrink-0"
                  style={{
                    width: [132, 136, 137, 163][i],
                    height: 39,
                    marginLeft: [1, 12, 12, 13][i],
                    border: '1px solid var(--jpd-border)',
                    borderRadius: 6,
                    padding: '0 12px',
                  }}
                >
                  <span className="jpd-tight-sm" style={{ fontSize: 14, fontWeight: 500 }}>
                    {label}
                  </span>
                  <ChevronDown size={16} strokeWidth={2} color="var(--jpd-text-strong)" />
                </div>
              ))}
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 85,
                  height: 39,
                  marginLeft: 20,
                  border: '1px solid var(--jpd-border)',
                  borderRadius: 6,
                  gap: 8,
                }}
              >
                <Filter size={16} strokeWidth={2} />
                <span className="jpd-tight-sm" style={{ fontSize: 14, fontWeight: 500 }}>
                  {TOOLBAR.filtersLabel}
                </span>
              </div>
            </div>

            {/* TABLE - extracted to CommitmentTable so the fidelity test can
                render it in isolation against the reference crop. */}
            <div style={{ marginTop: 22 }}>
              <CommitmentTable />
            </div>

            {/* PAGINATION - measured band 40px, 29px below the table */}
            <div className="flex items-center" style={{ marginTop: 28, paddingLeft: 2, height: 40 }}>
              <span className="jpd-tight-sm" style={{ fontSize: 15 }}>
                {pagination.showing}
              </span>
              <span className="mx-auto flex items-center" style={{ gap: 8 }}>
                <PageBtn>
                  <ChevronLeft size={16} strokeWidth={2} />
                </PageBtn>
                {pagination.pages.map((p, i) =>
                  p === '…' ? (
                    <span
                      key={`e${i}`}
                      className="flex items-center justify-center"
                      style={{ width: 30, color: 'var(--jpd-text-muted)' }}
                    >
                      •••
                    </span>
                  ) : (
                    <PageBtn key={p} current={i === 0}>
                      <span style={{ fontSize: 15, fontWeight: i === 0 ? 600 : 400 }}>{p}</span>
                    </PageBtn>
                  ),
                )}
                <PageBtn>
                  <ChevronRight size={16} strokeWidth={2} />
                </PageBtn>
              </span>
              <span className="flex items-center" style={{ gap: 14 }}>
                <span className="jpd-tight-sm" style={{ fontSize: 15 }}>
                  Rows per page:
                </span>
                <span
                  className="flex items-center justify-between"
                  style={{
                    width: 76,
                    height: 40,
                    border: '1px solid var(--jpd-border)',
                    borderRadius: 6,
                    padding: '0 12px',
                    fontSize: 15,
                  }}
                >
                  {pagination.rowsPerPage}
                  <ChevronDown size={16} strokeWidth={2} />
                </span>
              </span>
            </div>
          </main>

          {/* ============== DETAIL PANEL - measured 254px ================== */}
          <aside
            className="shrink-0"
            style={{
              width: 254,
              background: 'var(--jpd-surface-sunken)',
              borderLeft: '1px solid var(--jpd-border-subtle)',
              paddingLeft: 20,
              paddingRight: 16,
              paddingTop: 24,
            }}
          >
            <div className="flex items-start">
              <span className="jpd-tight-sm" style={{ fontSize: 15, fontWeight: 600 }}>
                {DETAIL.eyebrow}
              </span>
              <X size={17} strokeWidth={2} className="ml-auto" />
            </div>

            <div
              className="jpd-tight"
              style={{ fontSize: 18.5, fontWeight: 700, lineHeight: '22px', marginTop: 20, whiteSpace: 'nowrap' }}
            >
              {DETAIL.title}
            </div>

            <div style={{ marginTop: 15 }}>
              <StatusBadge status={DETAIL.status} />
            </div>

            <Rule mt={27} />

            <SectionHeading>{DETAIL.overviewHeading}</SectionHeading>
            {DETAIL.fields.map((f) => (
              <Field key={f.label} label={f.label} value={f.value} />
            ))}

            <FieldLabel>{DETAIL.owner.label}</FieldLabel>
            <div className="flex items-center" style={{ gap: 10, marginTop: 6 }}>
              <Avatar initials={DETAIL.owner.initials} size={34} />
              <span>
                <span className="jpd-tight-sm block" style={{ fontSize: 14 }}>
                  {DETAIL.owner.name}
                </span>
                <span
                  className="jpd-tight-sm block"
                  style={{ fontSize: 12, marginTop: 2, color: 'var(--jpd-text-muted)' }}
                >
                  {DETAIL.owner.role}
                </span>
              </span>
            </div>

            {DETAIL.fieldsAfterOwner.map((f) => (
              <Field key={f.label} label={f.label} value={f.value} />
            ))}

            {/* mt 57, not 10: removing the Value field shortened the Overview
                block by 47px. The recovered space is absorbed here so that
                Related Information, Notes and both bottom actions stay at
                their measured positions and the panel still resolves at the
                canvas foot. Re-tuned from 57 to 19 after the COM-023 rewrite:
                the longer description and the longer "Responsible
                Organization" label reclaimed 38 of those 47px. */}
            <Rule mt={19} />

            <SectionHeading>{DETAIL.relatedHeading}</SectionHeading>
            {DETAIL.related.map((r) => {
              const Icon = r.icon === 'file' ? FileText : r.icon === 'package' ? Package : Link2;
              return (
                <div key={r.label} className="flex" style={{ gap: 10, marginTop: 12 }}>
                  <Icon size={16} strokeWidth={1.9} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>
                    <span
                      className="jpd-tight-sm block"
                      style={{ fontSize: 13, fontWeight: 600, lineHeight: '14px', color: 'var(--jpd-text-strong)' }}
                    >
                      {r.label}
                    </span>
                    {r.lines.map((l) => (
                      <span
                        key={l}
                        className="jpd-tight-sm block"
                        style={{ fontSize: 13.5, marginTop: 2, lineHeight: '18px' }}
                      >
                        {l}
                      </span>
                    ))}
                  </span>
                </div>
              );
            })}

            <Rule mt={13} />

            <SectionHeading>{DETAIL.notesHeading}</SectionHeading>
            <div
              className="jpd-tight-sm"
              style={{ fontSize: 13.5, marginTop: 10, lineHeight: '18px' }}
            >
              {DETAIL.notes}
            </div>

            <div
              className="jpd-tight-sm flex items-center justify-center"
              style={{
                height: 47,
                marginTop: 3,
                borderRadius: 6,
                background: 'var(--jpd-action-strong)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {DETAIL.primaryAction}
            </div>
            <div
              className="jpd-tight-sm flex items-center justify-center"
              style={{ height: 23, marginTop: 8, fontSize: 15 }}
            >
              {DETAIL.secondaryAction}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ atoms */

function PageBtn({ children, current }: { children: React.ReactNode; current?: boolean }) {
  return (
    <span
      className="flex items-center justify-center"
      style={{
        width: 40,
        height: 40,
        borderRadius: 6,
        border: `1px solid ${current ? 'var(--jpd-page-current)' : 'var(--jpd-border)'}`,
        background: 'var(--jpd-surface)',
      }}
    >
      {children}
    </span>
  );
}

function Rule({ mt = 10 }: { mt?: number }) {
  return <div style={{ height: 1, background: '#ebebeb', marginTop: mt }} />;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="jpd-tight-sm"
      style={{ fontSize: 14, fontWeight: 700, lineHeight: '14px', marginTop: 9, color: 'var(--jpd-text-strong)' }}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="jpd-tight-sm"
      style={{ fontSize: 12, fontWeight: 600, lineHeight: '13px', marginTop: 10, color: 'var(--jpd-text-secondary)' }}
    >
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <>
      <FieldLabel>{label}</FieldLabel>
      <div className="jpd-tight-sm" style={{ fontSize: 15, marginTop: 5, lineHeight: '19px' }}>
        {value}
      </div>
    </>
  );
}
