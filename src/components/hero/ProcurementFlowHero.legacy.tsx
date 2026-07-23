// LEGACY — backup of the previous PI-cards-and-streams hero.
// Replaced by the Gantt/two-scenario hero on 2026-05-28. Kept for safe revert.
// To restore: rename this back to ProcurementFlowHero.tsx (and the legacy data file).
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileHeroSequence from './MobileHeroSequence';
import {
  cardConfigs, cardGeometries, chaoticFragments, ambientFlows, ambientGlows,
  getTimingForCard, PAUSE_FRAC,
  CHAOS_MS, FLOW_MS, OVERLAP_MS,
} from '../../content/heroAnimationData.legacy';

type Phase = 'chaos' | 'flowing' | 'completing' | 'fading' | 'houseHold' | 'houseFade' | 'idle';

interface ActiveNote { id: number; text: string; x: number; y: number }

let noteIdCounter = 0;

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

const statusColors: Record<string, string> = {
  'Approved': '#34d399', 'Released': '#fbbf24', 'Complete': '#34d399',
  'Confirmed': '#6ee7b7', 'Submitted': '#38bdf8', 'Started': '#fcd34d',
  'On-Time Delivery': '#34d399',
};

function statusColor(text: string): string {
  for (const [key, color] of Object.entries(statusColors)) {
    if (text.includes(key)) return color;
  }
  return '#fbbf24';
}

export default function ProcurementFlowHeroLegacy() {
  const reducedMotion = useReducedMotion();
  const [activeCard, setActiveCard] = useState(0);
  const [phase, setPhase] = useState<Phase>('chaos');
  const [completedCards, setCompletedCards] = useState(0);
  const completedRef = useRef(0);
  const [cardCycleKey, setCardCycleKey] = useState(0);
  const [notes, setNotes] = useState<ActiveNote[]>([]);
  const [cardStatus, setCardStatus] = useState('');
  const [prevCardIdx, setPrevCardIdx] = useState<number | null>(null);
  const [prevCardKey, setPrevCardKey] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const noteTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const showNote = useCallback((x: number, y: number, text: string) => {
    const id = ++noteIdCounter;
    setNotes(prev => [...prev, { id, text, x, y }]);
    setCardStatus(text);
    noteTimers.current.push(setTimeout(() => setNotes(prev => prev.filter(n => n.id !== id)), FLOW_MS * PAUSE_FRAC));
  }, []);

  const activeCardRef = useRef(0);

  const runCard = useCallback((cardIdx: number) => {
    clearTimers();
    noteTimers.current.forEach(clearTimeout);
    noteTimers.current = [];

    if (cardIdx > 0) {
      setPrevCardIdx(activeCardRef.current);
      setPrevCardKey(k => k + 1);
      setTimeout(() => setPrevCardIdx(null), 1800);
    }

    activeCardRef.current = cardIdx;
    setActiveCard(cardIdx);
    setPhase('chaos');
    setNotes([]);
    setCardStatus('');
    setCardCycleKey(k => k + 1);

    addTimer(() => setPhase('flowing'), CHAOS_MS);

    const flowStart = CHAOS_MS;
    const geo = cardGeometries[cardIdx];
    const config = cardConfigs[cardIdx];
    const numConv = config.processNotes.length;
    const { convFracs } = getTimingForCard(numConv);

    for (let i = 0; i < numConv; i++) {
      const [cx, cy] = geo.convergences[i];
      addTimer(() => showNote(cx, cy, config.processNotes[i]), flowStart + FLOW_MS * convFracs[i]);
    }

    addTimer(() => {
      setPhase('completing');
      setCardStatus('On-Time Delivery');
    }, CHAOS_MS + FLOW_MS);

    addTimer(() => {
      completedRef.current += 1;
      setCompletedCards(completedRef.current);

      if (cardIdx < 5) {
        runCard(cardIdx + 1);
      } else {
        clearTimers();
        setPhase('houseHold');
      }
    }, CHAOS_MS + FLOW_MS + OVERLAP_MS);
  }, [addTimer, showNote, clearTimers]);

  useEffect(() => {
    if (reducedMotion) { setPhase('houseHold'); setCompletedCards(6); return; }
    runCard(0);
    return () => { clearTimers(); noteTimers.current.forEach(clearTimeout); };
  }, [reducedMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  const config = cardConfigs[activeCard];
  const geo = cardGeometries[activeCard];
  const fragments = chaoticFragments[activeCard];
  const numConv = config.processNotes.length;
  const { convFracs } = getTimingForCard(numConv);
  const flowDurSec = FLOW_MS / 1000;
  const isFlowing = phase === 'flowing';
  const isCompleting = phase === 'completing';
  const showingCard = phase !== 'chaos' && phase !== 'houseHold' && phase !== 'houseFade' && phase !== 'idle';

  const buildProgress =
    phase === 'houseHold' ? 1
    : phase === 'houseFade' || phase === 'idle' ? 0
    : completedCards / 6;

  const [cardX, cardY] = geo.cardEndpoint;

  const networkOpacity = phase === 'houseHold' || phase === 'houseFade' || phase === 'idle' ? 0.02 : 0.6;

  return (
    <>
    <div className="lg:hidden">
      <MobileHeroSequence />
    </div>

    <section className="relative overflow-hidden bg-[#030a19] hidden lg:block" style={{ minHeight: '560px' }}>
      <motion.div
        className="absolute right-0 bottom-0 pointer-events-none hidden md:block"
        style={{
          width: '42%', maxWidth: '620px',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'destination-in',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: buildProgress * 0.95 }}
        transition={{ duration: phase === 'houseFade' || phase === 'idle' ? 3 : 2 }}
      >
        <img
          src={`${import.meta.env.BASE_URL}assets/hero/house-render.png`}
          alt="" aria-hidden="true"
          className="w-full h-auto object-contain"
          style={{ mixBlendMode: 'lighten' }}
        />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <defs>
            <filter id="lineGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            </filter>
            <filter id="dotGlow" x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
            </filter>
            <filter id="noteGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <filter id="aglow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="28" />
            </filter>
          </defs>

          {ambientGlows.map((g, i) => (
            <circle key={`ag${i}`} cx={g.cx} cy={g.cy} r={g.r} fill="rgba(160,110,30,0.04)" filter="url(#aglow)"
              style={{ animation: `heroAmbientGlow ${g.dur}s ease-in-out infinite`, animationDelay: `${i * 1.5}s` }} />
          ))}

          {prevCardIdx !== null && (() => {
            const pc = cardConfigs[prevCardIdx];
            const pg = cardGeometries[prevCardIdx];
            const [pcx, pcy] = pg.cardEndpoint;
            return (
              <motion.g
                key={`prev-${prevCardKey}`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.8 }}
              >
                {pg.streams.map((s, si) => (
                  <path key={`ps${si}`} d={s.pathStr} fill="none" stroke="rgb(245,158,11)" strokeWidth={0.8} opacity={0.2} />
                ))}
                {pg.mergedPaths.map((m, mi) => (
                  <path key={`pm${mi}`} d={m.pathStr} fill="none" stroke="rgb(251,191,36)" strokeWidth={1.2} opacity={0.4} />
                ))}
                <rect x={pcx + 8} y={pcy - 20} width={195} height={42} rx={5}
                  fill="rgba(245,158,11,0.25)" stroke="rgba(253,224,71,0.8)" strokeWidth={1.4} />
                <rect x={pcx + 8} y={pcy - 20} width={3} height={42} rx={1} fill="rgb(253,224,71)" />
                <circle cx={pcx + 22} cy={pcy} r={3} fill="rgb(253,224,71)" />
                <text x={pcx + 32} y={pcy - 5} fill="rgba(255,255,255,0.95)"
                  fontSize={10.5} fontWeight={600} fontFamily="system-ui,sans-serif">{pc.label}</text>
                <text x={pcx + 32} y={pcy + 9} fill="#34d399"
                  fontSize={8} fontFamily="system-ui,sans-serif">On-Time Delivery</text>
                <text x={pcx + 183} y={pcy + 3} fill="rgb(253,224,71)"
                  fontSize={13} fontFamily="system-ui,sans-serif">✓</text>
              </motion.g>
            );
          })()}

          <g opacity={networkOpacity} style={{ transition: 'opacity 3s' }}>
            {ambientFlows.map((af, i) => (
              <path key={`af${i}`} d={af.path} fill="none" stroke="rgb(180,130,40)" strokeWidth={0.5} opacity={af.opacity}
                style={{ strokeDasharray: `${af.dashLen} ${1400 - af.dashLen}`, animation: `heroFlowMove ${af.dur}s linear infinite`, animationDelay: `${i * 0.5}s` }} />
            ))}
          </g>

          <AnimatePresence>
            {phase !== 'houseHold' && phase !== 'houseFade' && phase !== 'idle' && (
              <motion.g key={`card-${cardCycleKey}`} exit={{ opacity: 0, transition: { duration: 1.5 } }}>

                {(phase === 'chaos' || phase === 'flowing') && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase === 'chaos' ? 0.6 : 0 }}
                    transition={{ duration: phase === 'chaos' ? 0.8 : 2 }}
                  >
                    {fragments.map((f, i) => (
                      <path key={`frag${i}`} d={f} fill="none" stroke="rgb(220,160,50)" strokeWidth={0.7}
                        opacity={0.15 + (i % 5) * 0.06}
                        style={{
                          strokeDasharray: '8 12',
                          animation: `heroFlowMove ${1.5 + (i % 4) * 0.5}s linear infinite`,
                          animationDelay: `${(i % 7) * 0.15}s`,
                        }} />
                    ))}
                  </motion.g>
                )}

                {(isFlowing || phase === 'completing') && (
                  <g>
                    {geo.streams.map((stream, si) => {
                      const targetFrac = si <= 1 ? convFracs[0] : convFracs[si - 1];
                      const dur = flowDurSec * targetFrac;
                      const depth = si / (geo.streams.length - 1);
                      const lineOp = 0.6 - depth * 0.25;
                      const glowOp = 0.25 - depth * 0.1;
                      const lineSw = 1.2 - depth * 0.4;
                      const glowSw = 4 - depth * 1.5;
                      return (
                        <g key={`stream${si}`}>
                          <path d={stream.pathStr} fill="none" stroke="rgb(180,130,40)" strokeWidth={lineSw * 0.5} opacity={0.06} />
                          <motion.path d={stream.pathStr} fill="none" stroke="rgb(245,158,11)" strokeWidth={glowSw} filter="url(#lineGlow)"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: dur, ease: 'linear' }} opacity={glowOp} />
                          <motion.path d={stream.pathStr} fill="none" stroke="rgb(245,158,11)" strokeWidth={lineSw}
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: dur, ease: 'linear' }} opacity={lineOp} />
                        </g>
                      );
                    })}

                    {geo.mergedPaths.map((merged, mi) => {
                      const startFrac = convFracs[mi] + PAUSE_FRAC;
                      const endFrac = mi < convFracs.length - 1 ? convFracs[mi + 1] : 1;
                      const dur = flowDurSec * (endFrac - startFrac);
                      const delay = flowDurSec * startFrac;
                      const t = (mi + 1) / geo.mergedPaths.length;
                      const sw = 1 + t * 1.2;
                      const glowSw = 3 + t * 4;
                      return (
                        <g key={`merged${mi}`}>
                          <motion.path d={merged.pathStr} fill="none" stroke="rgb(251,191,36)" strokeWidth={glowSw} filter="url(#lineGlow)"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: dur, delay, ease: 'linear' }} opacity={0.2 + t * 0.15} />
                          <motion.path d={merged.pathStr} fill="none" stroke="rgb(253,224,71)" strokeWidth={sw}
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: dur, delay, ease: 'linear' }} opacity={0.6 + t * 0.3} />
                        </g>
                      );
                    })}
                  </g>
                )}

                {showingCard && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase === 'fading' ? 0 : 1 }}
                    transition={{ duration: phase === 'fading' ? 0.5 : 0.6 }}
                  >
                    <rect x={cardX + 8} y={cardY - 20} width={195} height={42} rx={5}
                      fill={isCompleting ? 'rgba(245,158,11,0.25)' : 'rgba(15,23,42,0.88)'}
                      stroke={isCompleting ? 'rgba(253,224,71,0.8)' : 'rgba(245,158,11,0.35)'}
                      strokeWidth={isCompleting ? 1.4 : 0.8}
                    />
                    <rect x={cardX + 8} y={cardY - 20} width={3} height={42} rx={1}
                      fill={isCompleting ? 'rgb(253,224,71)' : 'rgb(245,158,11)'} opacity={isCompleting ? 1 : 0.6}
                    />
                    <circle cx={cardX + 22} cy={cardY} r={3}
                      fill={isCompleting ? 'rgb(253,224,71)' : 'rgba(245,158,11,0.5)'} />
                    <text x={cardX + 32} y={cardY - 5} fill="rgba(255,255,255,0.95)"
                      fontSize={10.5} fontWeight={600} fontFamily="system-ui,sans-serif">
                      {config.label}
                    </text>
                    <text x={cardX + 32} y={cardY + 9}
                      fill={statusColor(cardStatus || 'Buyout')}
                      fontSize={8} fontFamily="system-ui,sans-serif">
                      {cardStatus || 'Buyout...'}
                    </text>
                    <text x={cardX + 183} y={cardY + 3}
                      fill={isCompleting ? 'rgb(253,224,71)' : 'rgba(255,255,255,0.12)'}
                      fontSize={13} fontFamily="system-ui,sans-serif">
                      ✓
                    </text>
                    {isCompleting && (
                      <motion.rect x={cardX + 6} y={cardY - 22} width={199} height={46} rx={6}
                        fill="none" stroke="rgba(253,224,71,0.6)" strokeWidth={1.5}
                        initial={{ opacity: 0.9 }} animate={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                      />
                    )}
                  </motion.g>
                )}
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {notes.map(note => (
              <motion.g key={note.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}>
                <text x={note.x + 12} y={note.y - 14} fill="rgb(253,224,71)" fontSize={9}
                  fontWeight={500} fontFamily="system-ui,sans-serif" filter="url(#noteGlow)" opacity={0.6}>
                  {note.text}
                </text>
                <text x={note.x + 12} y={note.y - 14} fill="rgb(253,224,71)" fontSize={9}
                  fontWeight={500} fontFamily="system-ui,sans-serif" opacity={0.9}>
                  {note.text}
                </text>
                <circle cx={note.x} cy={note.y} r={4} fill="rgb(253,224,71)" opacity={0.7} />
                <circle cx={note.x} cy={note.y} r={10} fill="rgb(245,158,11)" filter="url(#dotGlow)" opacity={0.25} />
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>
      </div>

      <div className="absolute inset-0 bg-linear-to-r from-[#030a19]/90 via-[#030a19]/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-t from-[#030a19]/60 via-transparent to-[#030a19]/30 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center px-6 py-24 md:py-32 lg:py-40" style={{ minHeight: '560px' }}>
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'houseHold' ? 1 : 0 }}
          transition={{ duration: 5 }}
        >
          <p className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-amber-300/90 mb-8 leading-relaxed">
            $31.3B in U.S. construction rework is caused by poor data and miscommunication every year.¹
            <br />
            Is some of it in your projects?
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.05]">
            Control Before You Build.
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            JiTpro reveals and sequences the procurement constraints your schedule depends on—before they cost you.
          </p>
        </motion.div>
      </div>
    </section>
    </>
  );
}
