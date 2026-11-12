/**
 * Section 3 — the audience section (Design System Sections 46.12 and 54;
 * Decision Log 2026-11-09). Replaces *Know what's coming*, whose code stays
 * in the codebase unrendered and is preserved at tag
 * `homepage-four-step-stack-2026-11-09`.
 *
 * The reader picks who they are; a rail of tabs written for that reader
 * appears; each tab shows a headline and description beside a visual column.
 *
 *   HEADER    the eyebrow "What JiTpro means for:" (the h2), with the
 *             audience field beside it from sm: a native <select>
 *   RAIL      the selected audience's tabs as compact pills, ink on light
 *   HAIRLINE  the light-surface hairline
 *   STAGE     copy left, visual right, equal top-aligned columns from lg;
 *             the visual a 16:10 vertical sliding viewport
 *
 * TWO PRESENTATIONS, ONE SECTION (§46.12):
 *
 *   PINNED    from lg, motion allowed, and when the presentation fits the
 *             view below the navigation. A tall scroll region holds a
 *             position:sticky presentation; the reader's ordinary scrolling
 *             advances through the audience's tabs, then the section
 *             releases. SCROLL SELECTS, TRANSITIONS COMPLETE (§46.12,
 *             revised 2026-11-09): scroll progress picks a whole tab (zones
 *             with a little hysteresis, see audienceScroll.ts), and the copy
 *             and visual reach that tab's resting state through the same
 *             short, self-completing CSS transitions the unpinned form uses.
 *             Wherever the reader stops, the copy is fully opaque and the
 *             visual shows one whole panel. No wheel, key or touch
 *             interception, no snapping, no scroll lock.
 *   UNPINNED  everywhere else: the ordinary tabbed section, in normal flow,
 *             with no scroll behaviour and no added height.
 *
 * Whether to pin is re-measured on resize, zoom and content change, so a
 * zoomed or short view never pins with clipped content.
 *
 * STATE (§46.3): one value, { audienceId, tabIndex }. Unpinned, clicks set
 * it. Pinned, scroll sets the tab, and a click selects at once and scrolls
 * into that tab's zone (the tabs passed on the way are not selected), so
 * scroll and selection always agree. Choosing an audience opens its
 * first tab; pinned, the page also returns to the region's start.
 *
 * KEYBOARD (§46.12): WAI-ARIA tabs with MANUAL activation. Arrows, Home and
 * End move focus around the rail; Enter, Space, click and tap select. Hover
 * and focus never select (§46.8). Keyboard scrolling drives the pinned
 * progression exactly as the wheel does.
 *
 * NO REFLOW (§46.12): every audience's rail shares one grid cell, every
 * tab's copy another, every audience's visual track a third. Inactive ones
 * are visibility:hidden — in the document for search engines, out of the
 * accessibility tree and the tab order.
 *
 * SURFACE: --jp-surface-light, opening the light act (§54.1). No amber: on
 * this ground the amber tokens fail the contrast minimum (§8.8).
 *
 * THE IDENTIFY ADDITIONS (§54.2.1, revised 2026-11-11): a tab may carry a
 * second description paragraph and a closing statement. Today only general
 * contractors → Identify does. Both are plain copy, always shown.
 *
 * A tab may also carry a role link (between headline and description) and a
 * method checklist (beneath the description), the 2026-11-09 Identify
 * additions. No tab carries them since 2026-11-11; the support is kept.
 * The checklist's lines fade in in order once the section has been seen and
 * while the tab is selected; they reset instantly when it is left.
 *
 * THE CONNECT ADDITION (§54.2.2): a tab may carry a dependency summary
 * beneath the description, six categories in two columns. Today only general
 * contractors → Connect does. It is copy, in the document and exposed to
 * assistive technology; only its reveal belongs to the Connect visual, which
 * fades it in from its own clock as the animation comes to rest (§54.4.3).
 *
 * THE VISUAL COLUMN keeps the reserved placeholder (§46.8.1, §46.12) until
 * each visualization is specified (§54.4). It is deliberately plain. The
 * exceptions are general contractors → Identify, which turns scattered
 * project documents into a procurement inventory with its scope gaps, then
 * the register (§54.4.1, IdentifyRegisterPreview.tsx), and
 * general contractors → Plan, which builds a procurement chain backward and
 * reveals the project schedule around it (§54.4.2, PlanChainPreview.tsx).
 */

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  DraftingCompass,
  FileSignature,
  Handshake,
  HardHat,
  Landmark,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HOME_AUDIENCES, type Audience, type AudienceTab, type DependencyCategory } from '../../content/homeAudiences';
import {
  INITIAL_SELECTION,
  audienceFor,
  railFocusTarget,
  selectAudience,
  selectTab,
} from './audienceSelection';
import { STEP_OF_VIEW, progressForTab, regionDistance, tabForProgress } from './audienceScroll';
import IdentifyRegisterPreview from './IdentifyRegisterPreview';
import PlanChainPreview from './PlanChainPreview';
import OwnerVisual from './OwnerVisual';
import { isOwnerTab } from './ownerScenes';

/** The short cross-fade for the rails when the audience changes. */
const FADE =
  'transition-[opacity,visibility] duration-200 ease-out motion-reduce:transition-none';

/**
 * The copy transition (§46.12, revised 2026-11-09): the outgoing copy fades
 * out in 150 ms; the incoming copy waits for it, then fades in over 200 ms
 * while rising 8px. Two tabs' copy is never visible together, and every
 * transition runs to completion, so copy never rests part-faded.
 */
const COPY_MOTION =
  'transition-[opacity,visibility,transform] ease-out motion-reduce:transition-none';
const COPY_SHOWN = 'visible translate-y-0 opacity-100 duration-200 delay-150';
const COPY_HIDDEN = 'invisible translate-y-2 opacity-0 duration-150 delay-0';

/** The visual slide: one whole panel per tab, the incoming visual rising. */
const SLIDE = 'transition-transform duration-[450ms] ease-out motion-reduce:transition-none';

/**
 * The checklist's sequence (§54.2.1). Each line fades in and rises 4px; it
 * starts after the panel's own 150 ms + 200 ms entrance, then 675 ms apart,
 * and each check follows its line by 120 ms. Leaving the tab resets the
 * lines with no transition (the panel is already fading out).
 */
const CHECK_LINE_DELAY = ['delay-[400ms]', 'delay-[1075ms]', 'delay-[1750ms]'];
const CHECK_MARK_DELAY = ['delay-[520ms]', 'delay-[1195ms]', 'delay-[1870ms]'];
/* `translate`, not `transform`: Tailwind 4's translate-y-* sets that property. */
const CHECK_MOTION = 'transition-[opacity,translate] ease-out motion-reduce:transition-none';

/**
 * Free room beside the visual (refined 2026-11-10, §54.4.2): the copy-column
 * area beneath a tab's own copy, in the visual frame's coordinates. A visual
 * may rest content there (the Plan tab's step list) without taking room from
 * the frame. Null when the copy is not beside the visual (below lg).
 */
type SpareRect = { x: number; y: number; w: number; h: number };
/** Clear space kept between a tab's copy and anything placed beneath it. */
const SPARE_GAP = 20;

/**
 * An element's layout top within an ancestor, summed up the offsetParent
 * chain. Layout px, so transforms are ignored; and the chain matters, because
 * a transformed element (each copy panel) is its children's offsetParent.
 */
function offsetTopWithin(el: HTMLElement, ancestor: HTMLElement): number {
  let y = 0;
  for (let e: HTMLElement | null = el; e && e !== ancestor; e = e.offsetParent as HTMLElement | null) y += e.offsetTop;
  return y;
}

/** Where pinning may apply at all; fitting the view is checked separately. */
const PIN_QUERY = '(min-width: 64rem) and (prefers-reduced-motion: no-preference)';

/** The sticky navigation's h-20 bar and its 1px border. */
function navHeight(): number {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return rem * 5 + 1;
}

type Geometry = {
  /** Whether the pinned presentation applies right now. */
  pinned: boolean;
  /** Scroll consumed by one tab, px. */
  step: number;
  /** Where the presentation sticks, px from the top of the view. */
  navH: number;
};

/**
 * Decides whether to pin, and with what step, from the media query and from
 * the presentation's measured height against the view below the navigation.
 * Re-measured on resize, zoom (which fires resize) and content change.
 */
function useGeometry(stickyRef: RefObject<HTMLDivElement | null>): Geometry {
  const [geometry, setGeometry] = useState<Geometry>({ pinned: false, step: 0, navH: 81 });

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const mq = window.matchMedia(PIN_QUERY);

    const measure = () => {
      const navH = navHeight();
      const fits = el.offsetHeight <= window.innerHeight - navH;
      const next: Geometry = {
        pinned: mq.matches && fits,
        step: Math.round(window.innerHeight * STEP_OF_VIEW),
        navH,
      };
      setGeometry((prev) =>
        prev.pinned === next.pinned && prev.step === next.step && prev.navH === next.navH ? prev : next,
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    mq.addEventListener('change', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      mq.removeEventListener('change', measure);
    };
  }, [stickyRef]);

  return geometry;
}

export default function AudienceSection() {
  /* The section's whole state (§46.3). */
  const [selection, setSelection] = useState(INITIAL_SELECTION);
  const audience = audienceFor(selection);
  const count = audience.tabs.length;

  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { pinned, step, navH } = useGeometry(stickyRef);
  const distance = pinned ? regionDistance(count, step) : 0;

  const uid = useId();
  const headingId = `${uid}-heading`;
  const tabId = (tab: AudienceTab) => `${uid}-tab-${tab.id}`;
  const panelId = (tab: AudienceTab) => `${uid}-panel-${tab.id}`;

  /* Whether the section has been in view. The checklist waits for it, so
     its sequence plays where the reader can see it, not at page load. */
  const [seen, setSeen] = useState(false);
  /* The Connect tab's dependency summary; its visual reveals it (§54.2.2). */
  const categoriesRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = stickyRef.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setSeen(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  /* THE SPARE ROOM beside the visual, per tab, measured in layout px (offsets
     ignore the copy panels' entrance transforms). Re-measured on resize. */
  const stageRef = useRef<HTMLDivElement>(null);
  const copyColRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [spare, setSpare] = useState<Record<string, SpareRect | null>>({});
  /* An unclipped layer the size of the frame's inner box, beside it. */
  const [asideHost, setAsideHost] = useState<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const copy = copyColRef.current;
    const visual = visualRef.current;
    if (!stage || !copy || !visual) return;
    const measure = () => {
      const beside = copy.offsetLeft + copy.offsetWidth <= visual.offsetLeft;
      // The frame's inner box (inside its 1px border), relative to the stage.
      const ox = visual.offsetLeft + 1;
      const oy = visual.offsetTop + 1;
      const next: Record<string, SpareRect | null> = {};
      for (const [id, panel] of Object.entries(panelRefs.current)) {
        if (!panel || !beside) {
          next[id] = null;
          continue;
        }
        const kids = [...panel.children] as HTMLElement[];
        const top = Math.max(...kids.map((k) => offsetTopWithin(k, stage) + k.offsetHeight)) + SPARE_GAP;
        const h = stage.offsetHeight - top;
        next[id] = h > 0 ? { x: copy.offsetLeft - ox, y: top - oy, w: copy.offsetWidth, h } : null;
      }
      setSpare((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  /* Focus targets for arrow-key movement within the visible rail. */
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  /* Each audience's visual track. */
  const trackRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /** How far into the scroll region the reader is, px (negative before it). */
  const scrolledInto = useCallback(() => {
    const section = sectionRef.current;
    return section ? navH - section.getBoundingClientRect().top : 0;
  }, [navH]);

  /** The document scroll position of a point in the region, in steps. */
  const scrollTopFor = useCallback(
    (progress: number) => window.scrollY + progress * step - scrolledInto(),
    [step, scrolledInto],
  );

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, owner: Audience, index: number) => {
    const target = railFocusTarget(event.key, index, owner.tabs.length);
    if (target === null) return;
    event.preventDefault();
    tabRefs.current[owner.tabs[target].id]?.focus();
  };

  /* Choosing a tab. It is selected at once, so the transition goes straight
     to it. Pinned, the page also scrolls smoothly into the tab's zone, and
     while that scroll is STEERING the tabs it passes are not selected. The
     steer ends on arrival, after a timeout, or the moment the reader scrolls
     for themselves (observed passively, never intercepted). */
  const steerRef = useRef<{ index: number; until: number } | null>(null);
  const chooseTab = (index: number) => {
    setSelection((s) => selectTab(s, index));
    if (pinned) {
      steerRef.current = { index, until: performance.now() + 1200 };
      window.scrollTo({ top: scrollTopFor(progressForTab(index)), behavior: 'smooth' });
    }
  };

  /* Choosing an audience opens its first tab (§46.12). Pinned and inside
     the region, the page also returns to the region's start — after the
     region has resized to the new tab count, hence the layout effect. */
  const pendingReset = useRef(false);
  const chooseAudience = (id: string) => {
    const into = scrolledInto();
    pendingReset.current = pinned && into > 0 && into <= distance;
    setSelection((s) => selectAudience(s, id));
  };
  useLayoutEffect(() => {
    if (!pendingReset.current) return;
    pendingReset.current = false;
    window.scrollTo({ top: scrollTopFor(progressForTab(0)), behavior: 'instant' });
  }, [audience.id, scrollTopFor]);

  /* PINNED: scroll progress SELECTS the tab (§46.12). Nothing else is
     written here: the copy and visual follow the selection through their
     own CSS transitions, so they always come to rest complete. */
  useEffect(() => {
    if (!pinned) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const progress = scrolledInto() / step;
      const steer = steerRef.current;
      if (steer) {
        const arrived = Math.abs(progress - progressForTab(steer.index)) < 0.02;
        if (!arrived && performance.now() < steer.until) return;
        steerRef.current = null;
      }
      setSelection((s) => {
        if (s.audienceId !== audience.id) return s;
        const index = tabForProgress(progress, count, s.tabIndex);
        return index === s.tabIndex ? s : selectTab(s, index);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    /* The reader taking over ends a click's steer. Passive: never blocks. */
    const onReaderInput = () => {
      steerRef.current = null;
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('wheel', onReaderInput, { passive: true });
    window.addEventListener('touchstart', onReaderInput, { passive: true });
    window.addEventListener('keydown', onReaderInput);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', onReaderInput);
      window.removeEventListener('touchstart', onReaderInput);
      window.removeEventListener('keydown', onReaderInput);
    };
  }, [pinned, step, count, audience.id, scrolledInto]);

  /* THE VISUAL TRACK, in both presentations: the selected audience's track
     slides one whole panel per tab (the SLIDE transition completes it); every
     other track is parked at its first tab without animating, so it never
     replays a stale slide when its audience is chosen again. */
  useEffect(() => {
    for (const owner of HOME_AUDIENCES) {
      const track = trackRefs.current[owner.id];
      if (!track) continue;
      if (owner.id === audience.id) {
        track.style.transition = '';
        track.style.transform = `translateY(${-100 * selection.tabIndex}%)`;
      } else {
        track.style.transition = 'none';
        track.style.transform = 'translateY(0)';
      }
    }
  }, [audience.id, selection.tabIndex]);

  return (
    <section ref={sectionRef} aria-labelledby={headingId} className="bg-jp-surface-light">
      {/* The presentation. Sticky only when pinned; its top is the
          navigation's height, so it holds just below it. */}
      <div
        ref={stickyRef}
        className={`px-6 py-14 sm:px-8 sm:py-16 lg:px-10 [@media(min-width:64rem)_and_(max-height:54rem)]:py-12 ${pinned ? 'sticky' : ''}`}
        style={pinned ? { top: navH } : undefined}
      >
        <div className="mx-auto max-w-7xl">
          {/* THE HEADER (§46.12): the eyebrow, then the audience field beside
              it from sm, below it on narrower views. The h2 is the eyebrow;
              it also carries the selected audience for assistive technology,
              so it is complete when read alone. Ink, never amber (§8.8). */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h2
              id={headingId}
              className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-ink-secondary sm:text-sm sm:tracking-[0.18em]"
            >
              What JiTpro means for:
              <span className="sr-only">{` ${audience.label.toLowerCase()}`}</span>
            </h2>

            <AudienceControl value={audience.id} onChange={chooseAudience} />
          </div>

          {/* THE RAIL. One tablist per audience, all in one grid cell, so the
              rail's height is the tallest audience's at this width and never
              changes when the audience does. Only the selected audience's is
              visible, focusable and exposed. Each rail packs to the top
              (content-start, items-center) so a shorter rail never stretches
              its pills to the tallest rail's height when they wrap. */}
          <div className="mt-6 grid lg:mt-8">
            {HOME_AUDIENCES.map((owner) => {
              const isShown = owner.id === audience.id;
              return (
                <div
                  key={owner.id}
                  role="tablist"
                  aria-label={`Topics for ${owner.label.toLowerCase()}`}
                  className={`col-start-1 row-start-1 flex flex-wrap content-start items-center gap-2 sm:gap-3 ${FADE} ${
                    isShown ? 'visible opacity-100' : 'invisible opacity-0'
                  }`}
                >
                  {owner.tabs.map((tab, i) => {
                    const isSelected = isShown && i === selection.tabIndex;
                    return (
                      <button
                        key={tab.id}
                        ref={(el) => {
                          tabRefs.current[tab.id] = el;
                        }}
                        type="button"
                        role="tab"
                        id={tabId(tab)}
                        aria-selected={isSelected}
                        aria-controls={panelId(tab)}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => chooseTab(i)}
                        onKeyDown={(e) => onTabKeyDown(e, owner, i)}
                        className={`inline-flex min-h-11 items-center rounded-full border px-4 py-1.5 text-[0.9375rem] leading-snug transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-background motion-reduce:transition-none sm:text-base ${
                          isSelected
                            ? 'cursor-default border-jp-background bg-jp-background/[0.05] font-semibold text-jp-background'
                            : 'cursor-pointer border-transparent font-normal text-jp-ink-secondary hover:bg-jp-ink-secondary/[0.07] hover:text-jp-background focus-visible:bg-jp-ink-secondary/[0.07] focus-visible:text-jp-background'
                        }`}
                      >
                        {/* The pill keeps its footprint whatever its weight:
                            an invisible semibold copy reserves the width, so
                            selecting a tab never nudges its neighbours. */}
                        <span className="grid justify-items-center">
                          <span aria-hidden="true" className="invisible col-start-1 row-start-1 font-semibold">
                            {tab.label}
                          </span>
                          <span className="col-start-1 row-start-1">{tab.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* THE STAGE, beneath the light-surface hairline: copy left, the
              sliding visual right, equal and top-aligned from lg. */}
          <div ref={stageRef} className="relative mt-6 grid gap-8 border-t border-jp-ink-secondary/20 pt-8 sm:gap-10 lg:mt-8 lg:grid-cols-2 lg:items-start lg:gap-x-14 lg:pt-10 xl:gap-x-20">
            {/* The copy: every tab's panel in one grid cell, so the column is
                the tallest panel's height for every selection. Each panel is
                either shown or hidden, never in between at rest. */}
            <div ref={copyColRef} className="grid min-w-0">
              {HOME_AUDIENCES.flatMap((owner) =>
                owner.tabs.map((tab, i) => {
                  const isOpen = owner.id === audience.id && i === selection.tabIndex;
                  return (
                    <div
                      key={tab.id}
                      ref={(el) => {
                        panelRefs.current[tab.id] = el;
                      }}
                      role="tabpanel"
                      id={panelId(tab)}
                      aria-labelledby={tabId(tab)}
                      tabIndex={isOpen ? 0 : -1}
                      className={`col-start-1 row-start-1 min-w-0 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-jp-background ${
                        COPY_MOTION
                      } ${isOpen ? COPY_SHOWN : COPY_HIDDEN}`}
                    >
                      <h3 className="max-w-[22ch] font-heading text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-balance text-jp-background sm:text-[2.125rem] lg:text-[2.5rem]">
                        {tab.headline}
                      </h3>
                      {tab.roleLink && <RoleLink {...tab.roleLink} />}
                      <p
                        className={`max-w-[58ch] text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:text-[1.125rem] lg:text-[1.1875rem] ${
                          tab.roleLink ? 'mt-1 sm:mt-1.5' : 'mt-5 sm:mt-6'
                        }`}
                      >
                        {tab.description}
                      </p>
                      {tab.descriptionMore && (
                        <p className="mt-3 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:text-[1.125rem] lg:text-[1.1875rem]">
                          {tab.descriptionMore}
                        </p>
                      )}
                      {tab.closing && (
                        <p className="mt-4 max-w-[58ch] font-heading text-[1.0625rem] font-semibold leading-snug text-jp-background sm:text-[1.125rem] lg:text-[1.1875rem]">
                          {tab.closing}
                        </p>
                      )}
                      {tab.checklist && <MethodChecklist lines={tab.checklist} played={isOpen && seen} />}
                      {tab.dependencyCategories && (
                        <DependencySummary listRef={categoriesRef} categories={tab.dependencyCategories} />
                      )}
                    </div>
                  );
                }),
              )}
            </div>

            {/* THE VISUAL: a vertical sliding viewport (§46.12). Each
                audience's visuals sit in one vertical track; the track moves
                so the incoming visual rises into place. One track per
                audience, layered in the frame; only the selected one shows.
                Each visual is the frame's full height, so the track moves
                by whole frames: translateY(-100% x position).
                Hidden from assistive technology: the copy carries the
                meaning (§46.2). `min-w-0` stops the 16:10 box taking a
                minimum width from its content on narrow views. */}
            <div ref={visualRef} className="relative min-w-0">
            <div
              aria-hidden="true"
              className="relative aspect-[16/10] w-full min-w-0 overflow-hidden border border-jp-ink-secondary/25 bg-jp-ink-secondary/[0.04]"
            >
              {HOME_AUDIENCES.map((owner) => (
                <div
                  key={owner.id}
                  className={`absolute inset-0 ${FADE} ${
                    owner.id === audience.id ? 'visible opacity-100' : 'invisible opacity-0'
                  }`}
                >
                  <div
                    ref={(el) => {
                      trackRefs.current[owner.id] = el;
                    }}
                    className={`h-full ${SLIDE}`}
                  >
                    {owner.tabs.map((tab, i) => {
                      /* The specified visuals (§54.4.1, §54.4.2, §54.4.3) play on
                         one state: the tab is selected and the section seen. */
                      const played = owner.id === audience.id && i === selection.tabIndex && seen;
                      if (tab.id === 'gc-identify') return <IdentifyRegisterPreview key={tab.id} played={played} />;
                      if (tab.id === 'gc-plan')
                        return (
                          <PlanChainPreview
                            key={tab.id}
                            played={played}
                            aside={{ host: asideHost, region: spare[tab.id] ?? null }}
                          />
                        );
                      if (tab.id === 'gc-connect') return <PlanChainPreview key={tab.id} played={played} variant="connect" categoriesRef={categoriesRef} />;
                      if (tab.id === 'gc-control') return <PlanChainPreview key={tab.id} played={played} variant="control" />;
                      if (isOwnerTab(tab.id)) return <OwnerVisual key={tab.id} tab={tab.id} played={played} />;
                      return <ReservedVisual key={tab.id} tab={tab} first={i === 0} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
            {/* Beside the frame, unclipped and the size of its inner box: a
                visual may rest content outside the frame, in the spare room
                (§54.4.2). Never interactive; hidden from assistive technology. */}
            <div ref={setAsideHost} aria-hidden="true" className="pointer-events-none absolute inset-px" />
            </div>
          </div>
        </div>
      </div>

      {/* The scroll region's extra height: the distance the tabs consume
          while the presentation holds. Zero when unpinned. */}
      {pinned && <div aria-hidden="true" style={{ height: distance }} />}
    </section>
  );
}

/**
 * The audience control (§46.12, revised 2026-11-09): a native <select>, so
 * keyboard, touch and screen readers get the platform's own behaviour, set
 * as a defined field beside the eyebrow at a moderate register.
 *
 * As wide as its longest audience name (the native behaviour), so the field
 * never changes size when the audience changes.
 *
 * Light-surface treatment: strongest ink over a transparent fill, a 1px
 * --jp-ink-secondary border at 70% (about 3.4:1, clearing the 3:1 interface
 * minimum, §8.8) that moves to the strongest ink on hover and focus (moving
 * up the existing scale), and the --jp-background focus outline (§46.10).
 * No amber (§8.8).
 */
function AudienceControl({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="relative grid max-w-full items-center font-heading text-base font-semibold tracking-[-0.01em] text-jp-background sm:text-[1.125rem] lg:text-[1.25rem]">
      <select
        aria-label="Choose an audience"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="col-start-1 row-start-1 min-h-11 cursor-pointer appearance-none rounded-lg border border-jp-ink-secondary/70 bg-transparent py-2 pl-4 pr-11 text-jp-background transition-colors duration-200 ease-out hover:border-jp-background focus-visible:border-jp-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-background motion-reduce:transition-none"
      >
        {HOME_AUDIENCES.map((a) => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        strokeWidth={2.25}
        className="pointer-events-none col-start-1 row-start-1 mr-4 size-[1.1em] justify-self-end"
      />
    </div>
  );
}

/**
 * A tab's role link (§54.2.1). Ink, because amber fails contrast on the
 * light surface (§8.8); amber appears only as the decorative underline.
 * The last word and the arrow never separate when the label wraps. Hover
 * moves the arrow 4px right and nothing else; none under reduced motion.
 */
function RoleLink({ label, to }: { label: string; to: string }) {
  const cut = label.lastIndexOf(' ');
  return (
    <p className="mt-1">
      <Link
        to={to}
        className="group inline-block rounded py-3 font-heading text-base font-semibold leading-snug text-jp-background underline decoration-jp-brand-amber decoration-2 underline-offset-[5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-background sm:text-[1.0625rem]"
      >
        {label.slice(0, cut + 1)}
        <span className="whitespace-nowrap">
          {label.slice(cut + 1)}
          <ArrowRight
            size={18}
            aria-hidden="true"
            className="ml-2 inline-block align-[-0.2em] transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
        </span>
      </Link>
    </p>
  );
}

/**
 * The method checklist (§54.2.1): the method's steps, stated, not a form and
 * not a record of work done, so no boxes, numbers or controls. Every line is
 * always in the document; `played` only drives the sequence. The last line,
 * the outcome, is the strongest ink and semibold. No amber (§8.8).
 */
function MethodChecklist({ lines, played }: { lines: readonly string[]; played: boolean }) {
  return (
    <ul className="mt-4 space-y-2 sm:mt-5">
      {lines.map((line, i) => {
        const last = i === lines.length - 1;
        return (
          <li
            key={line}
            className={`flex items-start gap-3 text-base leading-[1.5] sm:text-[1.0625rem] ${CHECK_MOTION} ${
              played ? `translate-y-0 opacity-100 duration-300 ${CHECK_LINE_DELAY[i] ?? ''}` : 'translate-y-1 opacity-0 duration-0'
            } ${last ? 'font-semibold text-jp-background' : 'text-jp-ink-secondary'}`}
          >
            <Check
              size={18}
              strokeWidth={2.5}
              aria-hidden="true"
              className={`mt-[0.2em] shrink-0 text-jp-ink-secondary transition-opacity ease-out motion-reduce:transition-none ${
                played ? `opacity-100 duration-200 ${CHECK_MARK_DELAY[i] ?? ''}` : 'opacity-0 duration-0'
              }`}
            />
            <span>{line}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Each dependency category's icon (§54.2.2), keyed by the content's `id`. */
const CATEGORY_ICON: Record<string, LucideIcon> = {
  'design-engineering': DraftingCompass,
  'owner-decisions': UserCheck,
  'external-inputs': Handshake,
  'scope-trade': FileSignature,
  'permits-agency': Landmark,
  'field-installation': HardHat,
};

/**
 * The dependency summary (§54.2.2): the kinds of requirement JiTpro
 * identifies across a project, as a plain two-column list of icon and label.
 * No cards, borders, fills or controls. Icons are decoration beside their
 * labels (§48.4), in --jp-ink-secondary; labels in the strongest ink. No
 * amber (§8.8).
 *
 * FIT (§54.2.2). From lg the list's spacing is set so the Connect panel is
 * no taller than the tallest panel already was, and the section's height is
 * unchanged. On a short desktop view (from lg, at most 864px tall) the
 * headline wraps to a fourth line, so the list is set a step smaller and
 * tighter there, and the presentation's vertical padding gives up 16px top
 * and bottom, which keeps the section pinned at 1280×800.
 *
 * Every item is always in the document. This component sets no opacity or
 * transform of its own: the Connect visual writes them each frame from its
 * one clock (§46.3, §54.4.3), so React never resets a reveal in progress.
 */
function DependencySummary({
  listRef,
  categories,
}: {
  listRef: RefObject<HTMLUListElement>;
  categories: readonly DependencyCategory[];
}) {
  return (
    <ul
      ref={listRef}
      className="mt-5 grid max-w-[58ch] grid-cols-2 gap-x-5 gap-y-2.5 sm:gap-x-8 [@media(min-width:64rem)_and_(max-height:54rem)]:mt-3.5 [@media(min-width:64rem)_and_(max-height:54rem)]:gap-y-1.5"
    >
      {categories.map((category) => {
        const Icon = CATEGORY_ICON[category.id];
        return (
          <li
            key={category.id}
            className="flex min-w-0 items-start gap-2.5 text-[0.875rem] font-semibold leading-5 text-jp-background sm:text-[0.9375rem] [@media(min-width:64rem)_and_(max-height:54rem)]:text-[0.8125rem] [@media(min-width:64rem)_and_(max-height:54rem)]:leading-[1.125rem]"
          >
            {Icon && (
              <Icon size={18} strokeWidth={2} aria-hidden="true" className="mt-[0.08em] shrink-0 text-jp-ink-secondary" />
            )}
            <span className="min-w-0">{category.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * One reserved visual in a track (§46.8.1, §46.12): the methodology figure's
 * reserved treatment, holding the tab's place until its visualization is
 * specified (§54.4). The frame and fill belong to the viewport around the
 * track; each visual after the first carries the frame's hairline along its
 * top, so as it rises it reads as the next sheet arriving. No illustration,
 * icon, sample data or ornament (§47.4, §48.8).
 */
function ReservedVisual({ tab, first }: { tab: AudienceTab; first: boolean }) {
  return (
    <div
      className={`flex h-full flex-col justify-between p-6 lg:p-8 ${
        first ? '' : 'border-t border-jp-ink-secondary/25'
      }`}
    >
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-jp-ink-secondary/85">
        Reserved
      </p>
      <p className="max-w-[38ch] text-[0.9375rem] leading-[1.6] text-jp-ink-secondary/85">
        {`The visualization for “${tab.label}” is in development. This area is intentionally reserved.`}
      </p>
    </div>
  );
}
