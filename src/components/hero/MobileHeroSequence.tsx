import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ===== TIMING (all values in ms — adjust by name) =====
const TIMING = {
  DARK_HOLD: 500,           // dark screen before anything appears
  CARD_FADE_IN: 400,        // PI card fade-in duration
  STEP_HOLD: 800,           // how long each process step displays
  STEP_TRANSITION: 300,     // fade between process steps
  COMPLETION_FLASH: 700,    // "On-Time Delivery" flash duration
  CARD_FADE_OUT: 800,       // PI card fade-out duration
  HOUSE_FADE_IN: 800,       // house image fade-in duration
  HOUSE_DELAY: 200,         // pause between card out and house in
  TEXT_FADE_IN: 800,        // headline/subheadline fade-in duration
  TEXT_DELAY: 200,          // pause between house in and text in
};

// ===== PROCESS STEPS (edit labels or add/remove steps here) =====
const CARD_LABEL = 'Structural Steel';
const PROCESS_STEPS = [
  'Scope Defined',
  'Submittal Coordinated',
  'Approval Received',
  'Fabrication Complete',
  'Delivery Confirmed',
];
const COMPLETION_TEXT = 'On-Time Delivery';

type Phase = 'dark' | 'card' | 'completing' | 'cardOut' | 'house' | 'text';

export default function MobileHeroSequence() {
  const [phase, setPhase] = useState<Phase>('dark');
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setPhase('text');
      return;
    }

    let cancelled = false;
    const wait = (ms: number) => new Promise<void>(r => {
      const t = setTimeout(() => { if (!cancelled) r(); }, ms);
      if (cancelled) clearTimeout(t);
    });

    (async () => {
      // Dark hold
      await wait(TIMING.DARK_HOLD);
      if (cancelled) return;

      // Show card
      setPhase('card');
      await wait(TIMING.CARD_FADE_IN);

      // Cycle through process steps
      for (let i = 0; i < PROCESS_STEPS.length; i++) {
        if (cancelled) return;
        setStepIndex(i);
        await wait(TIMING.STEP_HOLD + TIMING.STEP_TRANSITION);
      }

      // Completion flash
      if (cancelled) return;
      setPhase('completing');
      await wait(TIMING.COMPLETION_FLASH);

      // Card fade out
      if (cancelled) return;
      setPhase('cardOut');
      await wait(TIMING.CARD_FADE_OUT + TIMING.HOUSE_DELAY);

      // House fade in
      if (cancelled) return;
      setPhase('house');
      await wait(TIMING.HOUSE_FADE_IN + TIMING.TEXT_DELAY);

      // Text fade in
      if (cancelled) return;
      setPhase('text');
    })();

    return () => { cancelled = true; };
  }, []);

  const showCard = phase === 'card' || phase === 'completing';
  const isCompleting = phase === 'completing';
  const showHouse = phase === 'house' || phase === 'text';
  const showText = phase === 'text';
  const currentStep = isCompleting ? COMPLETION_TEXT : PROCESS_STEPS[stepIndex] || PROCESS_STEPS[0];
  const progress = isCompleting ? 1 : (stepIndex + 1) / PROCESS_STEPS.length;

  return (
    <section className="relative overflow-hidden bg-[#030a19]" style={{ minHeight: '100svh' }}>

      {/* House image */}
      <AnimatePresence>
        {showHouse && (
          <motion.div
            className="absolute inset-0 flex items-end justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: TIMING.HOUSE_FADE_IN / 1000 }}
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/hero/house-render.png`}
              alt="" aria-hidden="true"
              className="w-[90%] max-w-md h-auto object-contain"
              style={{ mixBlendMode: 'lighten' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark overlay for text readability over house */}
      {showHouse && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#030a19]/60 via-[#030a19]/30 to-[#030a19]/70 pointer-events-none" />
      )}

      {/* PI Card workflow */}
      <div className="relative z-10 flex items-center justify-center px-6" style={{ minHeight: '100svh' }}>
        <AnimatePresence mode="wait">
          {showCard && (
            <motion.div
              key="pi-card"
              className="w-full max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: TIMING.CARD_FADE_IN / 1000 }}
            >
              <div className={`rounded-lg border px-5 py-4 transition-colors duration-300 ${
                isCompleting
                  ? 'border-amber-400/70 bg-amber-500/10'
                  : 'border-white/10 bg-white/[0.04]'
              }`}>
                {/* Card header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                    isCompleting ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-amber-500/50'
                  }`} />
                  <p className="text-white font-semibold text-base">{CARD_LABEL}</p>
                  {isCompleting && (
                    <motion.span
                      className="ml-auto text-amber-400 text-lg"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="h-1 w-full bg-white/10 rounded-full mb-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-amber-500"
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: TIMING.STEP_TRANSITION / 1000, ease: 'easeOut' }}
                  />
                </div>

                {/* Current step */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentStep}
                    className={`text-sm font-medium ${isCompleting ? 'text-amber-400' : 'text-slate-300'}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: TIMING.STEP_TRANSITION / 1000 }}
                  >
                    {currentStep}
                  </motion.p>
                </AnimatePresence>

                {/* Step indicators */}
                <div className="flex gap-1.5 mt-3">
                  {PROCESS_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        i <= stepIndex || isCompleting ? 'bg-amber-500/70' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Hero text — appears after card fades and house shows */}
          {showText && (
            <motion.div
              key="hero-text"
              className="text-center px-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: TIMING.TEXT_FADE_IN / 1000 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/90 mb-5 leading-relaxed">
                Construction schedules are only as reliable as the procurement plan behind them.
              </p>
              <h1 className="text-4xl font-bold text-white mb-5 tracking-tight leading-[1.08]">
                Control Before You Build.
              </h1>
              <p className="text-base text-slate-300 leading-relaxed">
                JiTpro reveals and sequences the procurement constraints your schedule depends on—before they cost you.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
