import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ClipboardList,
  Download,
  File,
  FileText,
  Filter,
  Flag,
  Share2,
  Search,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import JiTproShell from '../shell/JiTproShell';
import ScopeGapTable from './ScopeGapTable';
import {
  DETAIL,
  KPI_CARDS,
  KPI_GAPS,
  KPI_WIDTHS,
  PAGE,
  PAGINATION,
  TOOLBAR,
} from '../fixtures/scopeGapAnalysis';
import '../tokens.css';

/**
 * Scope Gap Analysis - the representative screen for the second methodology
 * stage.
 *
 * A VISUAL-FIDELITY REBUILD of `assets-src/methodology/scope-gap-analysis.png`.
 * Every number in this file is a measurement from that master, and the file
 * exists once: the homepage, the Learn More page and the expanded modal all
 * render THIS component through the registry.
 *
 * WHERE THE MASTER IS FOLLOWED EXACTLY. The header, the KPI row, the toolbar
 * and the table box keep their measured positions to the pixel: KPI cards
 * 190/226/229/229 wide on 13/13/14px gaps, spanning x218-1131 at y218-347;
 * the toolbar's five controls at 228/188/174/182/82 wide, 40px tall at y374;
 * the table box x215-1141 starting at y438. The KPI row and toolbar stop at
 * x1131 while the table runs on to x1141 - a 10px overhang that is in the
 * master and is reproduced rather than tidied away.
 *
 * WHERE IT DEPARTS, AND WHY.
 *
 * 1. FIFTEEN ROWS, NOT EIGHT, on a uniform 35px pitch instead of the master's
 *    hand-set 58-74px. The canvas is fixed at 1086px, so a longer table can
 *    only come out of row pitch; the pager moves down into the 48px of dead
 *    space the master left below itself, and nothing above the table moves at
 *    all. See ScopeGapTable for what this costs.
 * 2. THE SHARED SHELL, NOT THIS MASTER'S SHELL. This raster's chrome drifts
 *    from the approved one - a 197px sidebar against 205, a 69px top bar
 *    against 60 - as each of the five rasters drifts slightly from the
 *    others. JiTproShell is the Commitment Register's, approved as Visual
 *    Master v1, and the Product Register already accepted the same kind of
 *    drift rather than forking it. Five screens with five different chromes
 *    would be the worse error, so the offset is absorbed in the main column:
 *    at 948px it puts the panel border back on the master's x1153 exactly,
 *    and every measurement above is taken from the main column's RIGHT edge
 *    for that reason. The master's top-bar overflow menu is not reproduced,
 *    because adding it would change two approved screens.
 * 3. THE PAGER COUNTS SCOPE ITEMS. See the fixture's MODEL note: the KPI row
 *    counts the 34 gaps, the pager counts the 428 reviewed items, and a
 *    validated row is one of the latter and not one of the former.
 */

/** The master's meta rhythm is hand-set - 56px then 68px between rows - and
    is reproduced as measured rather than regularised. */
/** The Gap Type colours, shared with ScopeGapTable so the panel cannot drift. */
const PANEL_TYPE_COLOR =
  DETAIL.type === 'interface'
    ? 'var(--jpd-gap-error)'
    : DETAIL.type === 'validated'
      ? 'var(--jpd-gap-ok)'
      : 'var(--jpd-gap-warn)';

const KPI_ICON_SIZE = { total: 31, definition: 31, responsibility: 42, interface: 50 } as const;

const META_GAPS = [29, 15, 27];
const META_VALUE_GAPS = [1, 6, 6];

const KPI_ICONS = {
  total: FileText,
  definition: File,
  responsibility: UserRound,
  interface: Share2,
} as const;

export default function ScopeGapAnalysisScreen() {
  return (
    <JiTproShell
      activeNav="Scope"
      panel={(
        <aside
          className="shrink-0"
          style={{
            width: 295,
            background: 'var(--jpd-surface-sunken)',
            borderLeft: '1px solid var(--jpd-border-subtle)',
            paddingLeft: 19,
            paddingRight: 20,
            paddingTop: 33,
          }}
        >
          <div className="flex items-start" style={{ height: 15 }}>
            <span className="jpd-tight-sm" style={{ fontSize: 14, fontWeight: 600, lineHeight: '15px' }}>
              {DETAIL.eyebrow}
            </span>
            <X size={18} strokeWidth={2} className="ml-auto" style={{ marginTop: -2 }} />
          </div>

          <div
            className="jpd-tight"
            style={{ fontSize: 20.6, fontWeight: 700, lineHeight: '27px', marginTop: 27, color: 'var(--jpd-text)' }}
          >
            {DETAIL.title}
          </div>

          {/* The gap's own type, restated as the panel's one coloured line, in
              the colour the table gives that type rather than a fixed amber. */}
          <div className="flex items-center" style={{ gap: 12, marginTop: 16 }}>
            <AlertTriangle size={18} strokeWidth={2} color={PANEL_TYPE_COLOR} />
            <span
              className="jpd-tight-sm"
              style={{ fontSize: 14.1, fontWeight: 700, color: PANEL_TYPE_COLOR }}
            >
              {DETAIL.typeLabel}
            </span>
          </div>

          {DETAIL.sections.map((s, i) => {
            const Icon = s.icon === 'finding' ? Flag : s.icon === 'matters' ? ClipboardList : FileText;
            return (
              <div key={s.heading} style={{ marginTop: i === 0 ? 29 : 20 }}>
                <div className="flex items-center" style={{ gap: 12 }}>
                  <Icon size={18} strokeWidth={2} color="var(--jpd-action)" />
                  <span className="jpd-tight-sm" style={{ fontSize: 12.8, fontWeight: 700 }}>
                    {s.heading}
                  </span>
                </div>
                <div
                  className="jpd-tight-sm"
                  style={{
                    marginTop: 8,
                    marginLeft: 30,
                    fontSize: 13,
                    lineHeight: '21px',
                    color: 'var(--jpd-text-body)',
                  }}
                >
                  {s.body}
                </div>
              </div>
            );
          })}

          <div style={{ height: 1, background: 'var(--jpd-divider)', marginTop: 29 }} />

          {DETAIL.meta.map((m, i) => (
            <div key={m.label} style={{ marginTop: META_GAPS[i] }}>
              <div className="flex items-center" style={{ gap: 12 }}>
                {m.icon === 'party' ? (
                  <Users size={18} strokeWidth={1.9} color="var(--jpd-text-secondary)" />
                ) : m.icon === 'date' ? (
                  <AlertCircle size={18} strokeWidth={1.9} color="var(--jpd-text-secondary)" />
                ) : (
                  <span
                    className="inline-flex shrink-0 items-center justify-center rounded-full"
                    style={{ width: 18, height: 18, background: 'var(--jpd-error-bg)' }}
                  >
                    <span
                      style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--jpd-gap-error)' }}
                    />
                  </span>
                )}
                <span className="jpd-tight-sm" style={{ fontSize: 12.6, color: 'var(--jpd-text-body)' }}>
                  {m.label}
                </span>
              </div>
              <div
                className="jpd-tight-sm"
                style={{ marginTop: META_VALUE_GAPS[i], marginLeft: 30, fontSize: 12.6, color: 'var(--jpd-text)' }}
              >
                {m.value}
              </div>
            </div>
          ))}

          <div
            className="jpd-tight-sm flex items-center justify-center"
            style={{
              height: 46,
              marginTop: 47,
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
            className="jpd-tight-sm flex justify-center"
            style={{ marginTop: 27, fontSize: 14.4, color: 'var(--jpd-text-body)' }}
          >
            {DETAIL.relatedAction}
          </div>
        </aside>
      )}
    >
      {/* ====== MAIN - 948px. Table spans x215-1141, KPI/toolbar x218-1131 ==== */}
      <main
        className="shrink-0"
        style={{ width: 948, paddingLeft: 10, paddingRight: 11, background: 'var(--jpd-surface)' }}
      >
        {/* PAGE HEADER. Title ink measured at x225, y102. */}
        <div className="flex items-start" style={{ paddingTop: 40, paddingLeft: 10 }}>
          <div>
            <h1
              className="jpd-tight"
              style={{ fontSize: 27.5, fontWeight: 800, lineHeight: '30px', color: 'var(--jpd-text)' }}
            >
              {PAGE.title}
            </h1>
            <div
              className="jpd-tight-sm"
              style={{ fontSize: 18.5, fontWeight: 500, lineHeight: '24px', marginTop: 13, color: 'var(--jpd-text)' }}
            >
              {PAGE.subtitle}
            </div>
            <div
              className="jpd-tight-sm flex items-center"
              style={{ fontSize: 12.7, lineHeight: '20px', marginTop: 14, gap: 9, color: 'var(--jpd-text-secondary)' }}
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
              width: 122,
              height: 41,
              marginTop: -6,
              marginRight: 11,
              borderRadius: 6,
              border: '1px solid var(--jpd-border)',
              background: 'var(--jpd-surface)',
            }}
          >
            <span
              className="jpd-tight-sm flex items-center"
              style={{ gap: 9, padding: '0 13px', fontSize: 13.6, fontWeight: 600 }}
            >
              <Download size={15} strokeWidth={2} />
              Export
            </span>
            <span
              className="flex items-center justify-center"
              style={{ width: 33, borderLeft: '1px solid var(--jpd-border)' }}
            >
              <ChevronDown size={16} strokeWidth={2} />
            </span>
          </div>
        </div>

        {/* KPI ROW - measured 129px tall at y218, spanning x218-1131. Cards 3
            and 4 carry no tinted disc and the fourth's icon is red; only the
            second card colours its numeral. All four are the master's. */}
        <div className="flex" style={{ marginTop: 17, marginLeft: 3 }}>
          {KPI_CARDS.map((card, i) => {
            const Icon = KPI_ICONS[card.icon];
            const iconColor = card.iconTone === 'danger' ? 'var(--jpd-gap-error)' : 'var(--jpd-action)';
            return (
              <div
                key={card.label}
                className="flex shrink-0 items-start"
                style={{
                  width: KPI_WIDTHS[i],
                  marginLeft: KPI_GAPS[i],
                  height: 129,
                  border: '1px solid var(--jpd-border)',
                  borderRadius: 6,
                  background: 'var(--jpd-surface)',
                  paddingLeft: 11,
                  paddingTop: 20,
                  gap: 11,
                }}
              >
                <span
                  className="inline-flex shrink-0 items-center justify-center rounded-full"
                  style={{
                    width: 44,
                    height: 44,
                    background: card.tinted ? 'var(--jpd-gap-icon-tint)' : 'transparent',
                  }}
                >
                  {/* Glyph sizes, not box sizes: measured 22x28 inside the
                      disc, 28x38 for the person and 39x43 for the fork. The
                      last two have no disc and are allowed to exceed the 44px
                      slot the first two's disc defines. */}
                  <Icon
                    size={KPI_ICON_SIZE[card.icon]}
                    strokeWidth={1.9}
                    color={iconColor}
                    fill={card.icon === 'responsibility' ? iconColor : 'none'}
                    style={card.icon === 'interface' ? { transform: 'rotate(90deg)' } : undefined}
                  />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span
                    className="jpd-tight block"
                    style={{
                      fontSize: 19.7,
                      fontWeight: 700,
                      lineHeight: '22px',
                      color: card.valueTone === 'accent' ? 'var(--jpd-gap-count)' : 'var(--jpd-text)',
                    }}
                  >
                    {card.value}
                  </span>
                  <span
                    className="jpd-tight-sm block"
                    style={{
                      fontSize: 13.4,
                      fontWeight: 700,
                      lineHeight: '19px',
                      marginTop: 8,
                      color: 'var(--jpd-text)',
                    }}
                  >
                    {card.label}
                  </span>
                  {card.sub && (
                    <span
                      className="jpd-tight-sm block"
                      style={{
                        fontSize: 13.3,
                        lineHeight: '20px',
                        marginTop: 6,
                        color: 'var(--jpd-text-body)',
                      }}
                    >
                      {card.sub}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* TOOLBAR - measured 40px controls at y374 */}
        <div className="flex items-center" style={{ marginTop: 27, marginLeft: 3 }}>
          <div
            className="flex items-center shrink-0"
            style={{
              width: TOOLBAR.searchWidth,
              height: 40,
              border: '1px solid var(--jpd-border)',
              borderRadius: 6,
              paddingLeft: 11,
              gap: 11,
            }}
          >
            <Search size={16} strokeWidth={2} color="var(--jpd-text-muted)" />
            <span className="jpd-tight-sm" style={{ fontSize: 12.7, color: 'var(--jpd-text-muted)' }}>
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
                padding: '0 10px 0 12px',
              }}
            >
              <span className="jpd-tight-sm" style={{ fontSize: 12.8, fontWeight: 500 }}>
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
              gap: 8,
            }}
          >
            <Filter size={15} strokeWidth={2} />
            <span className="jpd-tight-sm" style={{ fontSize: 12.6, fontWeight: 500 }}>
              {TOOLBAR.filtersLabel}
            </span>
          </div>
        </div>

        {/* TABLE - top rule measured at y438 */}
        <div style={{ marginTop: 24 }}>
          <ScopeGapTable />
        </div>

        {/* PAGINATION - 38px band, buttons 35px wide on a 44.5px pitch. It sits
            25px lower than the master's, in the dead space the master left
            below itself, which is where the extra rows came from. */}
        <div className="flex items-center" style={{ marginTop: 17, marginLeft: 3, height: 38 }}>
          <span className="jpd-tight-sm" style={{ fontSize: 13.5, position: 'relative', top: 1, left: 2 }}>
            {PAGINATION.showing}
          </span>
          {/* The master's button group sits 11px right of the centred position. */}
          <span className="mx-auto flex items-center" style={{ gap: 9.5, position: 'relative', left: 11 }}>
            <PageBtn>
              <ChevronLeft size={16} strokeWidth={2.25} />
            </PageBtn>
            {PAGINATION.pages.map((p, i) => (
              <PageBtn key={p} current={i === 0}>
                <span style={{ fontSize: 13.5, fontWeight: i === 0 ? 600 : 400 }}>{p}</span>
              </PageBtn>
            ))}
            <PageBtn>
              <ChevronRight size={16} strokeWidth={2.25} />
            </PageBtn>
            <PageBtn>
              <ChevronsRight size={16} strokeWidth={2.25} />
            </PageBtn>
          </span>
          <span className="flex items-center" style={{ gap: 19 }}>
            <span className="jpd-tight-sm" style={{ fontSize: 13.5, position: 'relative', top: 1 }}>
              Rows per page:
            </span>
            <span
              className="flex items-center justify-between"
              style={{
                width: 78,
                height: 38,
                border: '1px solid var(--jpd-border)',
                borderRadius: 6,
                padding: '0 11px 0 19px',
                fontSize: 13.5,
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
        width: 35,
        height: 38,
        borderRadius: 6,
        border: `1px solid ${current ? 'var(--jpd-page-current)' : 'var(--jpd-border)'}`,
        background: current ? 'var(--jpd-row-tint)' : 'var(--jpd-surface)',
      }}
    >
      {children}
    </span>
  );
}
