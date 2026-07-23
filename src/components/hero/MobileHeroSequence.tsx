// Minimal mobile procurement hero — portrait mirror of the new desktop hero.
// Intro title crossfades into hero copy with the house render fading up
// alongside. The previous full mobile sequence is preserved at
// _archive/MobileHeroSequence.full.tsx for reuse.
import { useState, useEffect, useRef } from 'react';
import { introTitle, heroCopy } from '../../content/heroAnimationData';

const TITLE_FADE_IN_MS = 600;
const TITLE_READ_MS    = 1900;
const CROSSFADE_MS     = 1400;
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

let mobileHeroPlayedThisLoad = false;

export default function MobileHeroSequence() {
  const reducedMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(() => (mobileHeroPlayedThisLoad ? TOTAL_MS : 0));
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion || mobileHeroPlayedThisLoad) {
      setElapsed(TOTAL_MS);
      mobileHeroPlayedThisLoad = true;
      return;
    }
    const step = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const e = now - startRef.current;
      setElapsed(Math.min(e, TOTAL_MS));
      if (e < TOTAL_MS) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        mobileHeroPlayedThisLoad = true;
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
    <section className="relative overflow-hidden bg-[#030a19]" style={{ minHeight: '100svh' }}>
      {/* House render — fades in alongside the hero copy */}
      <div
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        style={{ opacity: houseOpacity }}
      >
        <img
          src={`${import.meta.env.BASE_URL}assets/hero/house-render.png`}
          alt="" aria-hidden="true"
          className="w-[90%] max-w-md h-auto object-contain"
          style={{ mixBlendMode: 'lighten' }}
        />
      </div>
      {houseOpacity > 0.001 && (
        <div
          className="absolute inset-0 bg-linear-to-t from-[#030a19]/60 via-[#030a19]/30 to-[#030a19]/70 pointer-events-none"
          style={{ opacity: houseOpacity }}
        />
      )}

      {/* Title and hero copy occupy the same centered slot. */}
      <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
        <div className="relative w-full text-center">
          <p
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 px-2 text-xl font-semibold leading-snug tracking-tight text-amber-300/90"
            style={{ opacity: titleOpacity }}
          >
            {introTitle}
          </p>

          <div style={{ opacity: heroOpacity }} className="px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/90 mb-5 leading-relaxed">
              {heroCopy.eyebrow}
            </p>
            <h1 className="text-4xl font-bold text-white mb-5 tracking-tight leading-[1.08]">
              {heroCopy.headline}
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              {heroCopy.subhead}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
