import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  HelpCircle,
  LayoutList,
  Plus,
  Search,
  X,
} from 'lucide-react';
import JiTproShell from '../shell/JiTproShell';
import ProductTable from './ProductTable';
import DemoStatusBadge from '../primitives/DemoStatusBadge';
import {
  DETAIL,
  KPI_CARDS,
  KPI_GAPS,
  KPI_WIDTHS,
  PAGE,
  PAGINATION,
  TOOLBAR,
} from '../fixtures/productRegister';
import '../tokens.css';

/**
 * Product Register - the canonical representative JiTpro screen.
 *
 * A VISUAL-FIDELITY REBUILD of `assets-src/methodology/product-register.png`,
 * not a redesign. Every number in this file is a measurement from that
 * master, and the file exists once: the homepage, the Learn More page and the
 * expanded modal all render THIS component through the registry.
 *
 * The master shares its shell, header, KPI row, toolbar, table and panel
 * construction with the Commitment Register. The construction is mirrored
 * here rather than extracted from that approved screen, so the Visual Master
 * v1 stays untouched; the measured values differ where the master differs
 * (content starts at x227, cards are 98px tall, the table header is 47px,
 * the pager buttons are 36px, the panel button is 37px).
 *
 * JiTpro does not manage budgets, costs, pricing, or contract values, so no
 * financial field exists anywhere in this screen or its fixture model.
 */

const KPI_ICONS = {
  list: LayoutList,
  check: CheckCircle2,
  clock: Clock,
  alert: AlertTriangle,
  question: HelpCircle,
} as const;

const KPI_ICON_TINT: Record<string, { bg: string; fg: string }> = {
  neutral: { bg: 'var(--jpd-neutral-bg)', fg: 'var(--jpd-text-strong)' },
  ok: { bg: 'var(--jpd-ok-bg)', fg: '#1a7f37' },
  warn: { bg: 'var(--jpd-warn-bg)', fg: '#f08c00' },
  error: { bg: 'var(--jpd-error-bg)', fg: '#e5484d' },
};

export default function ProductRegisterScreen() {
  return (
    <JiTproShell
      activeNav="Products"
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
          {/* 15px tall regardless of the 17px close glyph, so the row does not
              push the title down. */}
          <div className="flex items-start" style={{ height: 15 }}>
            <span className="jpd-tight-sm" style={{ fontSize: 12.5, fontWeight: 600, lineHeight: '15px' }}>
              {DETAIL.eyebrow}
            </span>
            <X size={17} strokeWidth={2} className="ml-auto" style={{ marginTop: -1 }} />
          </div>

          <div
            className="jpd-tight"
            style={{ fontSize: 16.8, fontWeight: 700, lineHeight: '20px', marginTop: 20, whiteSpace: 'nowrap' }}
          >
            {DETAIL.title}
          </div>

          <div style={{ marginTop: 6 }}>
            <DemoStatusBadge status={DETAIL.status} />
          </div>

          {/* Every margin below is measured from the master's ink rows. The
              master's rhythm is hand-set - the gap above a label varies
              between 4 and 16px section by section - and is reproduced as
              it is rather than regularised. */}
          <Rule mt={16} />

          <SectionHeading mt={16}>{DETAIL.overviewHeading}</SectionHeading>
          <Field label={DETAIL.overview[0].label} value={DETAIL.overview[0].value} mt={15} mv={2} />
          <Field label={DETAIL.overview[1].label} value={DETAIL.overview[1].value} mt={16} mv={3} />
          <Field label={DETAIL.overview[2].label} value={DETAIL.overview[2].value} mt={12} mv={2} />
          <Field label={DETAIL.overview[3].label} value={DETAIL.overview[3].value} mt={9} mv={2} />

          <Rule mt={7} />

          <SectionHeading mt={13}>{DETAIL.supplierHeading}</SectionHeading>
          <Line mt={8}>{DETAIL.supplier.name}</Line>
          <Line>{DETAIL.supplier.location}</Line>
          <Line mt={3}>{DETAIL.supplier.contact}</Line>
          <Line>{DETAIL.supplier.email}</Line>
          <Line mt={-1}>{DETAIL.supplier.phone}</Line>

          <Rule mt={9} />

          <SectionHeading mt={11}>{DETAIL.procurementHeading}</SectionHeading>
          <Field label={DETAIL.procurement[0].label} value={DETAIL.procurement[0].value} mt={6} mv={1} />
          <Field label={DETAIL.procurement[1].label} value={DETAIL.procurement[1].value} mt={8} mv={1} />
          <Field label={DETAIL.procurement[2].label} value={DETAIL.procurement[2].value} mt={6} mv={1} />

          <Rule mt={6} />

          <SectionHeading mt={10}>{DETAIL.sourceHeading}</SectionHeading>
          <Field label={DETAIL.source[0].label} value={DETAIL.source[0].value} mt={6} mv={1} />
          <Field label={DETAIL.source[1].label} value={DETAIL.source[1].value} mt={4} mv={1} />
          <Field label={DETAIL.source[2].label} value={DETAIL.source[2].value} mt={5} mv={1} />

          <Rule mt={3} />

          <SectionHeading mt={10}>{DETAIL.relatedHeading}</SectionHeading>
          {/* Three commitments where the master listed two, on a 15px pitch
              with the closing gap reduced so the action still clears the
              canvas foot. */}
          {DETAIL.related.map((r, i) => (
            <div key={r.title} className="flex" style={{ gap: 9, marginTop: i === 0 ? 9 : 5 }}>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: 'var(--jpd-text-strong)',
                  marginTop: 6,
                  flexShrink: 0,
                }}
              />
              <span>
                <span className="jpd-tight-sm block" style={{ fontSize: 12.5, lineHeight: '15px', whiteSpace: 'nowrap' }}>
                  {r.title}
                </span>
                <span className="jpd-tight-sm block" style={{ fontSize: 12.5, lineHeight: '15px' }}>
                  {r.due}
                </span>
              </span>
            </div>
          ))}

          <div
            className="jpd-tight-sm flex items-center justify-center"
            style={{
              height: 38,
              marginTop: 14,
              borderRadius: 6,
              background: 'var(--jpd-action-strong)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {DETAIL.primaryAction}
          </div>
        </aside>
      )}
    >
      {/* ============== MAIN - 989px; content spans x227-1168 =============== */}
      <main
        className="shrink-0"
        style={{ width: 989, paddingLeft: 22, paddingRight: 26, background: 'var(--jpd-surface)' }}
      >
        {/* PAGE HEADER. Title ink measured at x236, y91. */}
        <div className="flex items-start" style={{ paddingTop: 28, paddingLeft: 8 }}>
          <div>
            <h1
              className="jpd-tight"
              style={{ fontSize: 28, fontWeight: 800, lineHeight: '30px', color: 'var(--jpd-text)' }}
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
              style={{ fontSize: 13.1, lineHeight: '20px', marginTop: 12.5, color: 'var(--jpd-text-secondary)' }}
            >
              {PAGE.description}
            </div>
          </div>

          <div className="ml-auto flex items-start" style={{ gap: 25, marginTop: -2 }}>
            <div
              className="flex items-stretch overflow-hidden"
              style={{ width: 120, height: 38, borderRadius: 6, border: '1px solid var(--jpd-border)' }}
            >
              <span
                className="jpd-tight-sm flex items-center"
                style={{ gap: 8, padding: '0 12px', fontSize: 13, fontWeight: 600 }}
              >
                <Download size={14} strokeWidth={2} />
                Export
              </span>
              <span
                className="flex items-center justify-center"
                style={{ width: 34, borderLeft: '1px solid var(--jpd-border)' }}
              >
                <ChevronDown size={16} strokeWidth={2} />
              </span>
            </div>
            <div
              className="jpd-tight-sm flex items-center justify-center"
              style={{
                width: 137,
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
              {PAGE.primaryAction}
            </div>
          </div>
        </div>

        {/* KPI ROW - measured cards 98px tall at y211, 9.75px gaps */}
        <div className="flex" style={{ marginTop: 25, paddingLeft: 1 }}>
          {KPI_CARDS.map((card, i) => {
            const Icon = KPI_ICONS[card.icon];
            const tint = KPI_ICON_TINT[card.tone];
            return (
              <div
                key={card.label}
                className="flex items-center shrink-0"
                style={{
                  width: KPI_WIDTHS[i],
                  marginLeft: KPI_GAPS[i],
                  height: 98,
                  border: '1px solid var(--jpd-border)',
                  borderRadius: 6,
                  background: 'var(--jpd-surface)',
                  paddingLeft: 10,
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
                      fontSize: 20.5,
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
                      fontSize: 12,
                      marginTop: 4,
                      lineHeight: '16px',
                      color: 'var(--jpd-text-secondary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {card.label}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* TOOLBAR - measured 39px controls at y338 */}
        <div className="flex items-center" style={{ marginTop: 29, paddingLeft: 1 }}>
          <div
            className="flex items-center shrink-0"
            style={{
              width: TOOLBAR.searchWidth,
              height: 40,
              border: '1px solid var(--jpd-border)',
              borderRadius: 6,
              paddingLeft: 9,
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
                width: TOOLBAR.selectWidths[i],
                height: 40,
                marginLeft: TOOLBAR.selectGaps[i],
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
              width: TOOLBAR.filtersWidth,
              height: 40,
              marginLeft: TOOLBAR.filtersGap,
              border: '1px solid var(--jpd-border)',
              borderRadius: 6,
              gap: 6,
            }}
          >
            <Filter size={15} strokeWidth={2} />
            <span className="jpd-tight-sm" style={{ fontSize: 13.5, fontWeight: 500 }}>
              {TOOLBAR.filtersLabel}
            </span>
          </div>
        </div>

        {/* TABLE - top rule measured at y406 */}
        <div style={{ marginTop: 28 }}>
          <ProductTable />
        </div>

        {/* PAGINATION - measured band 38px at y984, buttons 36px */}
        <div className="flex items-center" style={{ marginTop: 24, paddingLeft: 2, paddingRight: 4, height: 37 }}>
          <span className="jpd-tight-sm" style={{ fontSize: 14, position: 'relative', top: 2 }}>
            {PAGINATION.showing}
          </span>
          {/* The master's button group sits 6px right of the centred position. */}
          <span className="mx-auto flex items-center" style={{ gap: 9, position: 'relative', left: 6 }}>
            <PageBtn>
              <ChevronLeft size={16} strokeWidth={2} />
            </PageBtn>
            {PAGINATION.pages.map((p, i) =>
              p === '…' ? (
                <span
                  key={`e${i}`}
                  className="flex items-center justify-center"
                  style={{ width: 23, color: 'var(--jpd-text-muted)', fontSize: 14 }}
                >
                  •••
                </span>
              ) : (
                <PageBtn key={p} current={i === 0}>
                  <span style={{ fontSize: 14, fontWeight: i === 0 ? 600 : 400 }}>{p}</span>
                </PageBtn>
              ),
            )}
            <PageBtn>
              <ChevronRight size={16} strokeWidth={2} />
            </PageBtn>
          </span>
          <span className="flex items-center" style={{ gap: 26 }}>
            <span className="jpd-tight-sm" style={{ fontSize: 14, position: 'relative', top: 2 }}>
              Rows per page:
            </span>
            <span
              className="flex items-center justify-between"
              style={{
                width: 84,
                height: 37,
                border: '1px solid var(--jpd-border)',
                borderRadius: 6,
                padding: '0 12px',
                fontSize: 14,
              }}
            >
              {PAGINATION.rowsPerPage}
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
        width: 34,
        height: 37,
        borderRadius: 6,
        border: `1px solid ${current ? 'var(--jpd-page-current)' : 'var(--jpd-border)'}`,
        background: current ? 'var(--jpd-row-tint)' : 'var(--jpd-surface)',
      }}
    >
      {children}
    </span>
  );
}

function Rule({ mt = 10 }: { mt?: number }) {
  return <div style={{ height: 1, background: 'var(--jpd-divider)', marginTop: mt }} />;
}

function SectionHeading({ children, mt = 9 }: { children: React.ReactNode; mt?: number }) {
  return (
    <div
      className="jpd-tight-sm"
      style={{ fontSize: 13, fontWeight: 700, lineHeight: '14px', marginTop: mt, color: 'var(--jpd-text-strong)' }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  mt = 10,
  mv = 2,
}: {
  label: string;
  value: string;
  /** Space above the label. */
  mt?: number;
  /** Space between label and value. */
  mv?: number;
}) {
  return (
    <>
      <div
        className="jpd-tight-sm"
        style={{ fontSize: 11.5, fontWeight: 600, lineHeight: '13px', marginTop: mt, color: 'var(--jpd-text-secondary)' }}
      >
        {label}
      </div>
      <div className="jpd-tight-sm" style={{ fontSize: 12.8, marginTop: mv, lineHeight: '19px' }}>
        {value}
      </div>
    </>
  );
}

function Line({ children, mt = 0 }: { children: React.ReactNode; mt?: number }) {
  return (
    <div className="jpd-tight-sm" style={{ fontSize: 13, lineHeight: '19px', marginTop: mt }}>
      {children}
    </div>
  );
}
