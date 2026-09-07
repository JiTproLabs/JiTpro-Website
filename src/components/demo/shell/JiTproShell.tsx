import type { ReactNode } from 'react';
import {
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  ChevronDown,
  Folder,
  HelpCircle,
  Home,
  Layers,
  Settings,
} from 'lucide-react';
import JiTproWordmark from '../../JiTproWordmark';
import { PROJECT, USER } from '../fixtures/project';
import '../tokens.css';

/**
 * The JiTpro application shell: the chrome every representative screen shares.
 *
 * This is the production extraction of the approved Commitment Register
 * prototype (Visual Master v1). The markup and every measurement inside it are
 * carried over byte for byte from the approved build - the sidebar's 205px
 * width, the 51px nav pitch, the 5px amber indicator, the deliberate 330px void
 * above the footer, the 60px top bar that spans both the main column and the
 * detail panel. Nothing here was re-derived or "tidied" during extraction: the
 * governing standard requires that an abstraction never change the rendered
 * result, and if one did, the abstraction is what gets revised.
 *
 * THE CANVAS IS FIXED AT 1448x1086 and is never responsive. Presentation
 * scaling is the wrapper's job (DemoScreenFrame), not the shell's.
 */

export type NavKey =
  | 'Project Overview'
  | 'Scope'
  | 'Products'
  | 'Commitments'
  | 'Schedule'
  | 'Reports';

const NAV_ITEMS: NavKey[] = [
  'Project Overview',
  'Scope',
  'Products',
  'Commitments',
  'Schedule',
  'Reports',
];

const NAV_ICONS = [Home, Folder, Layers, BadgeCheck, Calendar, BarChart3];

type Props = {
  /** Which sidebar item is lit. */
  activeNav: NavKey;
  /** The main column, 989px wide. */
  children: ReactNode;
  /** The 254px detail panel. Optional: a screen may have none. */
  panel?: ReactNode;
};

export default function JiTproShell({ activeNav, children, panel }: Props) {
  const ACTIVE_NAV = NAV_ITEMS.indexOf(activeNav);

  return (
    <div className="jpd jpd-canvas">
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
          {children}
          {panel}
        </div>
      </div>
    </div>
  );
}
