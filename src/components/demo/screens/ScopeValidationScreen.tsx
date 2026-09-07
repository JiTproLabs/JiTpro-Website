import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Download,
  FileCheck,
  FileText,
  Filter,
  HelpCircle,
  LayoutGrid,
  Mail,
  MessageSquareMore,
  Scroll,
  Search,
  Users,
  X,
} from 'lucide-react';
import JiTproShell from '../shell/JiTproShell';
import ScopeValidationTable from './ScopeValidationTable';
import DemoStatusBadge from '../primitives/DemoStatusBadge';
import {
  DETAIL,
  KPI_CARDS,
  KPI_GAPS,
  KPI_WIDTHS,
  PAGE,
  PAGINATION,
  SOURCES,
  SOURCES_HEADING,
  SOURCE_WIDTHS,
  TOOLBAR,
} from '../fixtures/scopeValidation';
import '../tokens.css';

/**
 * Scope Validation - the representative screen for the first methodology
 * stage, and the one that establishes the 428 scope items the later screens
 * count against.
 *
 * A VISUAL-FIDELITY REBUILD of `assets-src/methodology/scope-validation.png`.
 * Every number in this file is a measurement from that master, and the file
 * exists once: the homepage, the Learn More page and the expanded modal all
 * render THIS component through the registry.
 *
 * WHAT ONLY THIS SCREEN HAS. A Project Sources Analyzed strip between the KPI
 * row and the toolbar - six cells on inset dividers naming what the
 * validation was run against, with a zero on Specifications that the master
 * spells out in words. It is the screen's argument: single-source items exist
 * because a source type is missing, not because nobody looked.
 *
 * WHERE THE MASTER IS FOLLOWED EXACTLY. The header, the sources strip, the
 * toolbar and the table keep their measured positions: content spans x223-1081
 * throughout, the strip is 93px tall at y353, the toolbar 37px at y470, the
 * table x223-1081 from y527 with its nine columns and its measured row
 * heights, and the panel border lands on x1106.
 *
 * WHERE IT DEPARTS, AND WHY.
 *
 * 1. SIX KPI CARDS, NOT FIVE. The master's five summed 361 + 41 + 18 + 8 =
 *    428 exactly while its table showed a fifth badge, Partial, on two rows -
 *    which therefore belonged to no category. The 361 is split into 337 fully
 *    validated and 24 partially validated, and Partial gets its own card. The
 *    icon disc steps 45px to 38px to make the sixth card fit; nothing else in
 *    the row changes.
 * 2. THE EIGHTH COLUMN RULE IS DRAWN. See ScopeValidationTable.
 * 3. THE SHARED SHELL, NOT THIS MASTER'S CHROME, which drifts (197px sidebar
 *    against 205, 54px top bar against 60) as each of the five rasters
 *    drifts. Absorbed in a 901px main column, which puts the panel border
 *    back on the master's x1106 exactly. The master's top-bar overflow menu
 *    is not reproduced, because adding it would change three approved
 *    screens.
 * 4. TYPE IS MATCHED ON SET WIDTH, not cap height - the criterion tokens.css
 *    names - because this master's face runs narrower per cap height than
 *    Inter Tight.
 */

const KPI_ICONS = {
  total: LayoutGrid,
  validated: CheckCircle2,
  partial: CircleDashed,
  single: FileText,
  conflict: AlertTriangle,
  unverified: HelpCircle,
} as const;

const KPI_TINT: Record<string, { bg: string; fg: string }> = {
  neutral: { bg: 'var(--jpd-neutral-bg)', fg: 'var(--jpd-text-strong)' },
  ok: { bg: 'var(--jpd-ok-bg)', fg: 'var(--jpd-ok-fg)' },
  warn: { bg: 'var(--jpd-warn-bg)', fg: 'var(--jpd-action)' },
  error: { bg: 'var(--jpd-error-bg)', fg: 'var(--jpd-error-fg)' },
};

const VALUE_COLOR = {
  text: 'var(--jpd-text)',
  ok: 'var(--jpd-ok-fg)',
  error: 'var(--jpd-error-fg)',
} as const;

/** The master's evidence rhythm is hand-set - 21px then 26px between groups -
    and is reproduced as measured rather than regularised. */
const EVIDENCE_GAPS = [8, 12, 20, 23];

const SOURCE_ICONS = {
  drawings: Scroll,
  specs: FileText,
  contracts: FileCheck,
  rfis: MessageSquareMore,
  meetings: Users,
  comms: Mail,
} as const;

export default function ScopeValidationScreen() {
  return (
    <JiTproShell
      activeNav="Scope"
      panel={(
        <aside
          className="shrink-0"
          style={{
            width: 342,
            background: 'var(--jpd-surface-sunken)',
            borderLeft: '1px solid var(--jpd-border-subtle)',
            paddingLeft: 22,
            paddingRight: 22,
            paddingTop: 17,
          }}
        >
          <div className="flex items-start" style={{ height: 15 }}>
            <span className="jpd-tight-sm" style={{ fontSize: 14.6, fontWeight: 600, lineHeight: '15px' }}>
              {DETAIL.eyebrow}
            </span>
            <X size={18} strokeWidth={2} className="ml-auto" style={{ marginTop: -2 }} />
          </div>

          <div
            className="jpd-tight"
            style={{ fontSize: 20.4, fontWeight: 700, lineHeight: '24px', marginTop: 29, color: 'var(--jpd-text)' }}
          >
            {DETAIL.title}
          </div>

          <div style={{ marginTop: 12 }}>
            <DemoStatusBadge status={DETAIL.status} minWidth={80} />
          </div>

          <SectionHeading mt={22}>{DETAIL.summaryHeading}</SectionHeading>
          <div
            className="jpd-tight-sm"
            style={{ marginTop: 8, fontSize: 13.2, lineHeight: '19.5px', color: 'var(--jpd-text-body)' }}
          >
            {DETAIL.summary}
          </div>

          <div style={{ height: 1, background: 'var(--jpd-divider)', marginTop: 20 }} />

          <SectionHeading mt={9}>{DETAIL.evidenceHeading}</SectionHeading>

          {DETAIL.evidence.map((group, gi) => {
            const Icon = SOURCE_ICONS[group.icon];
            return (
              <div key={group.label} style={{ marginTop: EVIDENCE_GAPS[gi] }}>
                <div className="flex items-center" style={{ gap: 12 }}>
                  <Icon size={17} strokeWidth={1.9} color="var(--jpd-text-strong)" />
                  <span className="jpd-tight-sm" style={{ fontSize: 13.6, fontWeight: 700 }}>
                    {group.label}
                  </span>
                  {'count' in group && group.count && (
                    <span
                      className="jpd-tight-sm"
                      style={{ fontSize: 13, marginLeft: 5, color: 'var(--jpd-text-body)' }}
                    >
                      {group.count}
                    </span>
                  )}
                </div>

                {'lines' in group &&
                  group.lines?.map((l, li) => (
                    <div
                      key={l.ref}
                      className="jpd-tight-sm flex"
                      style={{
                        marginLeft: 31,
                        marginTop: li === 0 ? 11 : 8,
                        fontSize: 12.6,
                        lineHeight: '14px',
                        color: 'var(--jpd-text-body)',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: 'var(--jpd-text-strong)' }}>{l.ref}</span>
                      <span style={{ padding: '0 12px', color: 'var(--jpd-text-muted)' }}>—</span>
                      <span>{l.text}</span>
                    </div>
                  ))}

                {'more' in group && group.more && (
                  <div
                    className="jpd-tight-sm"
                    style={{ marginLeft: 31, marginTop: 5, fontSize: 12.6, color: 'var(--jpd-text-muted)' }}
                  >
                    {group.more}
                  </div>
                )}

                {'plain' in group &&
                  group.plain?.map((t, ti) => (
                    <div
                      key={t}
                      className="jpd-tight-sm"
                      style={{
                        marginLeft: 31,
                        marginTop: ti === 0 ? 8 : 5,
                        fontSize: 12.6,
                        lineHeight: '14px',
                        color: 'var(--jpd-text-body)',
                      }}
                    >
                      {t}
                    </div>
                  ))}
              </div>
            );
          })}

          <div style={{ height: 1, background: 'var(--jpd-divider)', marginTop: 37 }} />

          <SectionHeading mt={12}>{DETAIL.packagesHeading}</SectionHeading>

          {/* Four chips wrapping to two rows, 22px tall on an 8px gutter. */}
          <div className="flex flex-wrap" style={{ gap: 8, marginTop: 11 }}>
            {DETAIL.packages.map((p) => (
              <span
                key={p}
                className="jpd-tight-sm inline-flex items-center"
                style={{
                  height: 22,
                  padding: '0 10px',
                  borderRadius: 5,
                  border: '1px solid var(--jpd-border)',
                  background: 'var(--jpd-surface)',
                  fontSize: 12.4,
                  color: 'var(--jpd-text-body)',
                  whiteSpace: 'nowrap',
                }}
              >
                {p}
              </span>
            ))}
          </div>

          <div
            className="jpd-tight-sm flex items-center justify-center"
            style={{
              height: 38,
              marginTop: 20,
              borderRadius: 6,
              background: 'var(--jpd-action-strong)',
              color: '#fff',
              fontSize: 14.6,
              fontWeight: 700,
            }}
          >
            {DETAIL.primaryAction}
          </div>

          <div
            className="jpd-tight-sm flex justify-center"
            style={{ marginTop: 15, fontSize: 13.4, color: 'var(--jpd-text-body)' }}
          >
            {DETAIL.relatedAction}
          </div>
        </aside>
      )}
    >
      {/* ============ MAIN - 901px; content spans x223-1081 =============== */}
      <main
        className="shrink-0"
        style={{ width: 901, paddingLeft: 18, paddingRight: 24, background: 'var(--jpd-surface)' }}
      >
        {/* PAGE HEADER. Title ink measured at x226, y84. */}
        <div className="flex items-start" style={{ paddingTop: 21 }}>
          <div>
            <h1
              className="jpd-tight"
              style={{ fontSize: 27.5, fontWeight: 800, lineHeight: '30px', color: 'var(--jpd-text)' }}
            >
              {PAGE.title}
            </h1>
            <div
              className="jpd-tight-sm"
              style={{ fontSize: 18.5, fontWeight: 500, lineHeight: '24px', marginTop: 12, color: 'var(--jpd-text)' }}
            >
              {PAGE.subtitle}
            </div>
            <div
              className="jpd-tight-sm flex items-center"
              style={{ fontSize: 13.2, lineHeight: '20px', marginTop: 10, gap: 9, color: 'var(--jpd-text-secondary)' }}
            >
              {PAGE.meta}
              <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--jpd-text-muted)' }} />
              {PAGE.updated}
            </div>
          </div>

          {/* Export only: this screen has no primary action in the master. */}
          <div
            className="ml-auto flex items-stretch overflow-hidden"
            style={{
              width: 112,
              height: 37,
              marginTop: -3,
              borderRadius: 6,
              border: '1px solid var(--jpd-border)',
              background: 'var(--jpd-surface)',
            }}
          >
            <span
              className="jpd-tight-sm flex items-center"
              style={{ gap: 8, padding: '0 11px', fontSize: 13, fontWeight: 600 }}
            >
              <Download size={14} strokeWidth={2} />
              Export
            </span>
            <span
              className="flex items-center justify-center"
              style={{ width: 30, borderLeft: '1px solid var(--jpd-border)' }}
            >
              <ChevronDown size={15} strokeWidth={2} />
            </span>
          </div>
        </div>

        {/* KPI ROW - measured 108px tall at y194, spanning x223-1081. Six
            cards where the master had five; see the file note. */}
        <div className="flex" style={{ marginTop: 17 }}>
          {KPI_CARDS.map((card, i) => {
            const Icon = KPI_ICONS[card.icon];
            const tint = KPI_TINT[card.tone];
            return (
              <div
                key={card.label}
                className="flex shrink-0 items-start"
                style={{
                  width: KPI_WIDTHS[i],
                  marginLeft: KPI_GAPS[i],
                  height: 108,
                  border: '1px solid var(--jpd-border)',
                  borderRadius: 6,
                  background: 'var(--jpd-surface)',
                  paddingLeft: 8,
                  paddingTop: 20,
                  gap: 10,
                }}
              >
                <span
                  className="inline-flex shrink-0 items-center justify-center rounded-full"
                  style={{ width: 38, height: 38, background: tint.bg }}
                >
                  <Icon size={22} strokeWidth={1.9} color={tint.fg} />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span
                    className="jpd-tight block"
                    style={{
                      fontSize: 19.8,
                      fontWeight: 700,
                      lineHeight: '22px',
                      color: VALUE_COLOR[card.valueTone],
                    }}
                  >
                    {card.value}
                  </span>
                  <span
                    className="jpd-tight-sm block"
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      lineHeight: '19px',
                      marginTop: 11,
                      color: 'var(--jpd-text-body)',
                    }}
                  >
                    {card.label}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* PROJECT SOURCES ANALYZED - the screen's own component. Heading ink
            measured at y328; the strip is 93px tall at y353, six cells on
            inset dividers. */}
        <div
          className="jpd-tight-sm"
          style={{ marginTop: 23, fontSize: 14.6, fontWeight: 600, lineHeight: '20px', color: 'var(--jpd-text)' }}
        >
          {SOURCES_HEADING}
        </div>

        <div
          className="flex"
          style={{
            marginTop: 8,
            height: 93,
            border: '1px solid var(--jpd-border)',
            borderRadius: 6,
            background: 'var(--jpd-surface)',
          }}
        >
          {SOURCES.map((s, i) => {
            const Icon = SOURCE_ICONS[s.icon];
            return (
              <div
                key={s.label}
                className="relative flex shrink-0 items-start"
                style={{ width: SOURCE_WIDTHS[i], paddingLeft: 18, paddingTop: 21, gap: 8 }}
              >
                {/* The divider is inset from both edges, as the master draws it. */}
                {i > 0 && (
                  <span
                    className="absolute"
                    style={{ left: 0, top: 13, bottom: 13, width: 1, background: 'var(--jpd-border)' }}
                  />
                )}
                <Icon size={26} strokeWidth={1.6} color="var(--jpd-text-strong)" style={{ marginTop: 1 }} />
                <span style={{ minWidth: 0 }}>
                  <span
                    className="jpd-tight-sm block"
                    style={{ fontSize: 12.8, lineHeight: '19px', color: 'var(--jpd-text)' }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="jpd-tight block"
                    style={{ fontSize: 16.5, fontWeight: 600, lineHeight: '20px', marginTop: 3, color: 'var(--jpd-text)' }}
                  >
                    {s.value}
                  </span>
                  {'note' in s && s.note && (
                    <span
                      className="jpd-tight-sm block"
                      style={{ fontSize: 11.6, lineHeight: '15px', marginTop: 2, color: 'var(--jpd-text-muted)' }}
                    >
                      {s.note}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* TOOLBAR - measured 37px controls at y470 */}
        <div className="flex items-center" style={{ marginTop: 24 }}>
          <div
            className="flex items-center shrink-0"
            style={{
              width: TOOLBAR.searchWidth,
              height: 37,
              border: '1px solid var(--jpd-border)',
              borderRadius: 6,
              paddingLeft: 9,
              gap: 11,
            }}
          >
            <Search size={15} strokeWidth={2} color="var(--jpd-text-muted)" />
            <span className="jpd-tight-sm" style={{ fontSize: 13.4, color: 'var(--jpd-text-muted)' }}>
              {TOOLBAR.searchPlaceholder}
            </span>
          </div>
          {TOOLBAR.selects.map((label, i) => (
            <div
              key={label}
              className="flex items-center justify-between shrink-0"
              style={{
                width: TOOLBAR.selectWidths[i],
                height: 37,
                marginLeft: TOOLBAR.selectGaps[i],
                border: '1px solid var(--jpd-border)',
                borderRadius: 6,
                padding: '0 11px',
              }}
            >
              <span className="jpd-tight-sm" style={{ fontSize: 13.4, fontWeight: 500 }}>
                {label}
              </span>
              <ChevronDown size={15} strokeWidth={2} color="var(--jpd-text-strong)" />
            </div>
          ))}
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: TOOLBAR.filtersWidth,
              height: 37,
              marginLeft: TOOLBAR.filtersGap,
              border: '1px solid var(--jpd-border)',
              borderRadius: 6,
              gap: 7,
            }}
          >
            <Filter size={14} strokeWidth={2} />
            <span className="jpd-tight-sm" style={{ fontSize: 13, fontWeight: 500 }}>
              {TOOLBAR.filtersLabel}
            </span>
          </div>
        </div>

        {/* TABLE - top rule measured at y527 */}
        <div style={{ marginTop: 20 }}>
          <ScopeValidationTable />
        </div>

        {/* PAGINATION - measured 30px band at y1009, buttons 33px on a 44px
            pitch, with the master's ellipsis before the last page. */}
        <div className="flex items-center" style={{ marginTop: 17, height: 30 }}>
          <span className="jpd-tight-sm" style={{ fontSize: 13.4, position: 'relative', top: 1 }}>
            {PAGINATION.showing}
          </span>
          {/* The master's button group sits 19px right of the centred position. */}
          <span className="mx-auto flex items-center" style={{ gap: 11, position: 'relative', left: 19 }}>
            <PageBtn>
              <ChevronLeft size={15} strokeWidth={2.25} />
            </PageBtn>
            {PAGINATION.pages.map((p, i) =>
              p === '…' ? (
                <span
                  key={`e${i}`}
                  className="flex items-center justify-center"
                  style={{ width: 22, color: 'var(--jpd-text-muted)', fontSize: 13.4 }}
                >
                  •••
                </span>
              ) : (
                <PageBtn key={p} current={i === 0}>
                  <span style={{ fontSize: 13.4, fontWeight: i === 0 ? 600 : 400 }}>{p}</span>
                </PageBtn>
              ),
            )}
            <PageBtn>
              <ChevronRight size={15} strokeWidth={2.25} />
            </PageBtn>
          </span>
          <span className="flex items-center" style={{ gap: 16 }}>
            <span className="jpd-tight-sm" style={{ fontSize: 13.4, position: 'relative', top: 1 }}>
              Rows per page:
            </span>
            <span
              className="flex items-center justify-between"
              style={{
                width: 75,
                height: 30,
                border: '1px solid var(--jpd-border)',
                borderRadius: 6,
                padding: '0 10px 0 16px',
                fontSize: 13.4,
              }}
            >
              {PAGINATION.rowsPerPage}
              <ChevronDown size={15} strokeWidth={2} />
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
        width: 33,
        height: 30,
        borderRadius: 6,
        border: `1px solid ${current ? 'var(--jpd-page-current)' : 'var(--jpd-border)'}`,
        background: current ? 'var(--jpd-row-tint)' : 'var(--jpd-surface)',
      }}
    >
      {children}
    </span>
  );
}

function SectionHeading({ children, mt }: { children: React.ReactNode; mt: number }) {
  return (
    <div
      className="jpd-tight-sm"
      style={{ fontSize: 13.8, fontWeight: 700, lineHeight: '16px', marginTop: mt, color: 'var(--jpd-text)' }}
    >
      {children}
    </div>
  );
}
