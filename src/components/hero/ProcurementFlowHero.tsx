// Minimal procurement hero — intro title crossfades into the hero copy with
// the house render fading up alongside. The full schedule-failure animation
// that used to live here is now the play-button-gated section
// ProcurementFailureSection.tsx; the previous hero is preserved at
// _archive/ProcurementFlowHero.full.tsx.
import { useState, useEffect, useRef } from 'react';
import MobileHeroSequence from './MobileHeroSequence';
import { introTitle, heroCopy, HERO_MIN_HEIGHT } from '../../content/heroAnimationData';

const TITLE_FADE_IN_MS = 700;
const TITLE_READ_MS    = 2200;
const CROSSFADE_MS     = 1500;
const TOTAL_MS = TITLE_FADE_IN_MS + TITLE_READ_MS + CROSSFADE_MS;

// Smoothstep — eases in and out so opacity curves don't snap at the endpoints.
function ease(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(mq.matches);
    const h = (e: MediaQueryListEvent) => setR(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return r;
}

// Persists across SPA navigation, resets on full refresh — returning visitors
// see the end state instantly instead of replaying the intro.
let heroPlayedThisLoad = false;

export default function ProcurementFlowHero() {
  const reducedMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(() => (heroPlayedThisLoad ? TOTAL_MS : 0));
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion || heroPlayedThisLoad) {
      setElapsed(TOTAL_MS);
      heroPlayedThisLoad = true;
      return;
    }
    const step = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const e = now - startRef.current;
      setElapsed(Math.min(e, TOTAL_MS));
      if (e < TOTAL_MS) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        heroPlayedThisLoad = true;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [reducedMotion]);

  const titleOpacity = (() => {
    if (elapsed < TITLE_FADE_IN_MS) return ease(elapsed / TITLE_FADE_IN_MS);
    if (elapsed < TITLE_FADE_IN_MS + TITLE_READ_MS) return 1;
    const intoCross = elapsed - TITLE_FADE_IN_MS - TITLE_READ_MS;
    return 1 - ease(intoCross / CROSSFADE_MS);
  })();

  const heroOpacity = (() => {
    const intoCross = elapsed - TITLE_FADE_IN_MS - TITLE_READ_MS;
    if (intoCross <= 0) return 0;
    return ease(intoCross / CROSSFADE_MS);
  })();

  const houseOpacity = heroOpacity * 0.95;

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden">
        <MobileHeroSequence />
      </div>

      {/* Desktop hero */}
      <section
        className="relative overflow-hidden bg-[#030a19] hidden lg:block"
        style={{ minHeight: `${HERO_MIN_HEIGHT}px` }}
        aria-label="Procurement control hero"
      >
        {/* House background — fades in alongside the hero copy */}
        <div
          className="absolute right-0 bottom-0 pointer-events-none"
          style={{
            width: '42%', maxWidth: '620px',
            opacity: houseOpacity,
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'destination-in',
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/hero/house-render.png`}
            alt="" aria-hidden="true"
            className="w-full h-auto object-contain"
            style={{ mixBlendMode: 'lighten' }}
          />
        </div>

        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-linear-to-r from-[#030a19]/85 via-[#030a19]/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-[#030a19]/55 via-transparent to-[#030a19]/30 pointer-events-none" />

        {/* Title and hero copy occupy the same centered slot; title fades out
            as hero copy fades in. */}
        <div
          className="relative z-10 flex items-center justify-center px-6 py-24 md:py-32 lg:pt-20 lg:pb-40 pointer-events-none"
          style={{ minHeight: `${HERO_MIN_HEIGHT}px` }}
        >
          <div className="relative w-full max-w-5xl mx-auto text-center">
            <h2
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 px-4 text-lg md:text-xl lg:text-2xl font-semibold text-amber-300/90 tracking-tight"
              style={{ opacity: titleOpacity }}
            >
              {introTitle}
            </h2>

            <div style={{ opacity: heroOpacity }}>
              <p className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-amber-300/90 mb-8 leading-relaxed">
                {heroCopy.eyebrow}
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.05]">
                {heroCopy.headline}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
                {heroCopy.subhead}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
