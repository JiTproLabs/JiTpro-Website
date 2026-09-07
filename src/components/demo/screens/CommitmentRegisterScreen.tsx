import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Filter,
  HelpCircle,
  LayoutList,
  Link2,
  Package,
  Plus,
  Search,
  X,
} from 'lucide-react';
import JiTproShell from '../shell/JiTproShell';
import CommitmentTable from './CommitmentTable';
import DemoAvatar from '../primitives/DemoAvatar';
import DemoStatusBadge from '../primitives/DemoStatusBadge';
import {
  DETAIL,
  KPI_CARDS,
  PAGE,
  PAGINATION,
  TOOLBAR,
} from '../fixtures/commitmentRegister';
import '../tokens.css';

/**
 * Commitment Register - the canonical representative JiTpro screen.
 *
 * APPROVED AS VISUAL MASTER v1. Every number in this file is a measurement
 * carried from the approved prototype, and the file exists once: the homepage,
 * the Learn More page and the expanded modal all render THIS component. There
 * is no second implementation and no "large" variant.
 *
 * PRODUCT MODEL, not merely labels:
 *   Responsible Organization - the organization or project entity that owes
 *     the commitment. Never the supplier, manufacturer, or product source.
 *   Commitment Owner - the specific named person accountable for resolving it.
 *
 * JiTpro does not manage budgets, costs, pricing, or contract values, so no
 * financial field exists anywhere in this screen or its fixture model. That is
 * a deliberate departure from the raster reference, which carried a Value
 * column, and it must not be reintroduced.
 */

const KPI_ICONS = {
  list: LayoutList,
  check: CheckCircle2,
  clock: Clock,
  alert: AlertTriangle,
  question: HelpCircle,
} as const;

/** Measured KPI card widths (177/177/182/177/194 in the reference). */
const KPI_WIDTHS = [177, 177, 182, 177, 194];

const KPI_ICON_TINT: Record<string, { bg: string; fg: string }> = {
  neutral: { bg: 'var(--jpd-neutral-bg)', fg: 'var(--jpd-text-strong)' },
  ok: { bg: 'var(--jpd-ok-bg)', fg: '#1a7f37' },
  warn: { bg: 'var(--jpd-warn-bg)', fg: '#f08c00' },
  error: { bg: 'var(--jpd-error-bg)', fg: '#e5484d' },
};

export default function CommitmentRegisterScreen() {
  const pagination = PAGINATION;

  return (
    <JiTproShell
      activeNav="Commitments"
      /* The 254px detail panel, measured. */
      panel={(
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
                <DemoStatusBadge status={DETAIL.status} />
              </div>

              <Rule mt={27} />

              <SectionHeading>{DETAIL.overviewHeading}</SectionHeading>
              {DETAIL.fields.map((f) => (
                <Field key={f.label} label={f.label} value={f.value} />
              ))}

              <FieldLabel>{DETAIL.owner.label}</FieldLabel>
              <div className="flex items-center" style={{ gap: 10, marginTop: 6 }}>
                <DemoAvatar initials={DETAIL.owner.initials} size={34} />
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
      )}
    >
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
                      width: KPI_WIDTHS[i],
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

            {/* TABLE */}
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
    </JiTproShell>
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