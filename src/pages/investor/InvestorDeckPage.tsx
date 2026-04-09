import { useEffect, useRef, useState, createContext, useContext, type ReactNode } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   Context & Hooks
   ═══════════════════════════════════════════════════════════════════ */

const RevealContext = createContext(false);

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px 50px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

/* ═══════════════════════════════════════════════════════════════════
   Animation Primitives
   ═══════════════════════════════════════════════════════════════════ */

function Reveal({ delay = 0, children }: { delay?: number; children: ReactNode }) {
  const visible = useContext(RevealContext);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px) scale(0.97)',
        transition: 'opacity 450ms ease-out, transform 450ms ease-out',
        transitionDelay: visible ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Timeline Components
   ═══════════════════════════════════════════════════════════════════ */

function TimelineContainer({ children }: { children: ReactNode }) {
  const visible = useContext(RevealContext);
  return (
    <div className="relative pl-7 ml-1 my-6">
      <div
        className="absolute left-0 top-0 bottom-0 bg-amber-500/40 origin-top"
        style={{
          width: '1.5px',
          transform: visible ? 'scaleY(1)' : 'scaleY(0)',
          transition: 'transform 900ms ease-out',
          transitionDelay: visible ? '80ms' : '0ms',
        }}
      />
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function TimelineNode({ delay = 0, children }: { delay?: number; children: ReactNode }) {
  const visible = useContext(RevealContext);
  return (
    <div className="relative py-2">
      <div
        className="absolute w-2.5 h-2.5 rounded-full bg-amber-500"
        style={{
          left: '-1.75rem',
          top: '0.7rem',
          transform: `translateX(-50%) scale(${visible ? 1 : 0})`,
          opacity: visible ? 1 : 0,
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
          transitionDelay: visible ? `${delay}ms` : '0ms',
        }}
      />
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateX(10px)',
          transition: 'opacity 450ms ease-out, transform 450ms ease-out',
          transitionDelay: visible ? `${delay}ms` : '0ms',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Section Wrappers
   ═══════════════════════════════════════════════════════════════════ */

function DeckSection({
  id,
  children,
  className = '',
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const [ref, inView] = useInView(0.1);

  return (
    <RevealContext.Provider value={inView}>
      <section
        ref={ref}
        id={id}
        className={`pt-8 pb-16 ${className}`}
        style={{ scrollSnapAlign: 'start', scrollMarginTop: '7.5rem' }}
      >
        <div className="w-full max-w-3xl mx-auto px-6">{children}</div>
      </section>
    </RevealContext.Provider>
  );
}

function SubSection({ children, first = false }: { children: ReactNode; first?: boolean }) {
  const [ref, inView] = useInView(0.15);
  return (
    <RevealContext.Provider value={inView}>
      <div ref={ref} className={`${first ? 'pt-0 pb-16 md:pb-24' : 'py-16 md:py-24'} border-b border-slate-800/40 last:border-b-0`}>
        {children}
      </div>
    </RevealContext.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Content Helpers
   ═══════════════════════════════════════════════════════════════════ */

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500/70 block mb-3">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight leading-tight mb-8">
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight leading-tight mb-6">
      {children}
    </h3>
  );
}

function Body({ children }: { children: ReactNode }) {
  return (
    <p className="text-slate-300 leading-relaxed text-base md:text-lg mb-4">
      {children}
    </p>
  );
}

function Emphasis({ children }: { children: ReactNode }) {
  return (
    <p className="text-slate-100 font-semibold text-base md:text-lg mb-4">
      {children}
    </p>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-wider text-amber-500/80 mb-2 mt-6">
      {children}
    </p>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 mb-4 ml-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-300 text-base md:text-lg leading-relaxed">
          <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-amber-500/60 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Progress Indicator
   ═══════════════════════════════════════════════════════════════════ */

const NAV_SECTIONS = [
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'value', label: 'Value' },
  { id: 'advantage', label: 'Advantage' },
  { id: 'gtm', label: 'Go-To-Market' },
  { id: 'traction', label: 'Traction' },
  { id: 'competition', label: 'Competition' },
  { id: 'team', label: 'Team' },
  { id: 'financials', label: 'Financials' },
  { id: 'closing', label: 'Close' },
];

function ProgressIndicator({ activeId }: { activeId: string }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 120; // matches sticky nav h-28 (112px) + breathing room
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-3">
      {NAV_SECTIONS.map((s) => {
        const isActive = activeId === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => handleClick(e, s.id)}
            className="group flex items-center gap-2.5 py-0.5"
            aria-label={s.label}
          >
            <span
              className="text-[10px] font-medium tracking-wider uppercase group-hover:!opacity-100"
              style={{
                color: isActive ? 'rgb(245 158 11)' : 'rgb(100 116 139)',
                opacity: isActive ? 1 : 0,
                transition: 'color 500ms cubic-bezier(0.4,0,0.2,1), opacity 500ms cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              {s.label}
            </span>
            <span
              className="block rounded-full group-hover:!bg-slate-400"
              style={{
                width: isActive ? '10px' : '6px',
                height: isActive ? '10px' : '6px',
                backgroundColor: isActive ? 'rgb(245 158 11)' : 'rgb(71 85 105)',
                transform: isActive ? 'scale(1.25)' : 'scale(1)',
                transition: 'all 500ms cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </a>
        );
      })}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════════════ */

export default function InvestorDeckPage() {
  const [activeSection, setActiveSection] = useState('problem');
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Subtle scroll snapping for section pacing
  useEffect(() => {
    document.documentElement.style.scrollSnapType = 'y proximity';
    return () => {
      document.documentElement.style.scrollSnapType = '';
    };
  }, []);

  // Track active section by scroll position — reliable for all section heights
  useEffect(() => {
    const headerOffset = 140; // header height + breathing room
    const onScroll = () => {
      let current = NAV_SECTIONS[0].id;
      for (const { id } of NAV_SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= headerOffset) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative">
      <ProgressIndicator activeId={activeSection} />

      {/* ─── Hero ─── */}
      <section className="pt-8 pb-16" style={{ scrollSnapAlign: 'start' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'none' : 'translateY(30px)',
              transition: 'opacity 600ms ease-out, transform 600ms ease-out',
            }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 tracking-tight leading-tight mb-4">
              JiTpro Pitch Deck
            </h1>
          </div>
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'none' : 'translateY(30px)',
              transition: 'opacity 600ms ease-out, transform 600ms ease-out',
              transitionDelay: heroVisible ? '200ms' : '0ms',
            }}
          >
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed">
              Control Before Construction
            </p>
          </div>
        </div>
      </section>

      {/* ─── 1. Problem ─── */}
      <DeckSection id="problem">
        <Reveal delay={0}>
          <SectionLabel>01 — Problem</SectionLabel>
        </Reveal>
        <Reveal delay={50}>
          <SectionTitle>Construction projects are unstable before they begin.</SectionTitle>
        </Reveal>
        <TimelineContainer>
          <TimelineNode delay={130}>
            <Body>Missing design and specifications at award introduce embedded procurement constraints</Body>
          </TimelineNode>
          <TimelineNode delay={190}>
            <Body>Procurement constraints are not identified or sequenced early</Body>
          </TimelineNode>
          <TimelineNode delay={250}>
            <Body>Responsibility for missing information is undefined</Body>
          </TimelineNode>
          <TimelineNode delay={310}>
            <Body>Decision deadlines do not exist</Body>
          </TimelineNode>
          <TimelineNode delay={370}>
            <Body>Contractors commit to schedules without procurement clarity</Body>
          </TimelineNode>
          <TimelineNode delay={430}>
            <Body>Late or incorrect procurement forces costly rework and delays</Body>
          </TimelineNode>
        </TimelineContainer>
        <Reveal delay={450}>
          <Label>Failure Mechanism</Label>
          <Emphasis>Unresolved procurement constraints collide with a fixed schedule</Emphasis>
        </Reveal>
        <Reveal delay={530}>
          <Label>Result</Label>
          <Bullets
            items={[
              'Reactive procurement',
              'Missed lead times',
              'Margin compression',
              'Loss of credibility',
            ]}
          />
        </Reveal>
      </DeckSection>

      {/* ─── 2. Solution ─── */}
      <DeckSection id="solution">
        <Reveal delay={0}>
          <SectionLabel>02 — Solution</SectionLabel>
        </Reveal>
        <Reveal delay={50}>
          <SectionTitle>JiTpro establishes procurement control before mobilization.</SectionTitle>
        </Reveal>
        <TimelineContainer>
          <TimelineNode delay={130}>
            <Body>Identifies scope gaps and missing design/specification</Body>
          </TimelineNode>
          <TimelineNode delay={190}>
            <Body>Converts unknowns into tracked constraints</Body>
          </TimelineNode>
          <TimelineNode delay={250}>
            <Body>Assigns responsibility for constraint resolution</Body>
          </TimelineNode>
          <TimelineNode delay={310}>
            <Body>Aligns constraint deadlines to procurement sequencing</Body>
          </TimelineNode>
          <TimelineNode delay={370}>
            <Body>Sequences all materials to required on-site dates</Body>
          </TimelineNode>
        </TimelineContainer>
        <Reveal delay={450}>
          <Label>Output</Label>
          <Emphasis>A structured procurement execution plan tied to real constraints.</Emphasis>
        </Reveal>
      </DeckSection>

      {/* ─── 3. Unique Value Proposition ─── */}
      <DeckSection id="value">
        <Reveal delay={0}>
          <SectionLabel>03 — Unique Value Proposition</SectionLabel>
        </Reveal>
        <Reveal delay={60}>
          <SectionTitle>Procurement intelligence that protects your schedule</SectionTitle>
        </Reveal>
        <Reveal delay={160}>
          <Body>
            JiTpro enables contractors to control early execution by identifying, assigning,
            and sequencing procurement constraints before they disrupt the schedule.
          </Body>
        </Reveal>
      </DeckSection>

      {/* ─── 4. Unfair Advantage ─── */}
      <DeckSection id="advantage">
        <Reveal delay={0}>
          <SectionLabel>04 — Unfair Advantage</SectionLabel>
        </Reveal>
        <Reveal delay={50}>
          <SectionTitle>JiTpro identifies procurement risk before others do.</SectionTitle>
        </Reveal>
        <Reveal delay={120}>
          <Label>Built from</Label>
        </Reveal>
        <TimelineContainer>
          <TimelineNode delay={190}>
            <Body>Real-world failure patterns across hundreds of millions in construction</Body>
          </TimelineNode>
          <TimelineNode delay={250}>
            <Body>Deep sequencing expertise not formalized in industry tools</Body>
          </TimelineNode>
          <TimelineNode delay={310}>
            <Body>A system that converts experience into repeatable execution</Body>
          </TimelineNode>
        </TimelineContainer>
        <Reveal delay={390}>
          <Emphasis>Institutionalized construction intelligence</Emphasis>
        </Reveal>
      </DeckSection>

      {/* ─── 5. Go-To-Market ─── */}
      <DeckSection id="gtm">
        <Reveal delay={0}>
          <SectionLabel>05 — Go-To-Market Strategy</SectionLabel>
        </Reveal>
        <Reveal delay={50}>
          <SectionTitle>Go-To-Market Strategy</SectionTitle>
        </Reveal>
        <Reveal delay={120}>
          <Label>Target</Label>
          <Body>Growth-stage GCs ($1M–$50M projects)</Body>
        </Reveal>
        <Reveal delay={190}>
          <Label>Motion</Label>
          <Emphasis>High-trust → high-ticket → repeat → referral</Emphasis>
        </Reveal>
        <Reveal delay={270}>
          <Label>Channels</Label>
          <Bullets
            items={[
              'Direct founder-led outreach',
              'Industry referrals (owners, architects, subs)',
              'Credibility-based education',
              'Website as conversion layer',
            ]}
          />
        </Reveal>
      </DeckSection>

      {/* ─── 6. Traction ─── */}
      <DeckSection id="traction">
        <Reveal delay={0}>
          <SectionLabel>06 — Traction / Proof Strategy</SectionLabel>
        </Reveal>
        <Reveal delay={50}>
          <SectionTitle>Initial validation through live execution.</SectionTitle>
        </Reveal>
        <Reveal delay={120}>
          <Body>10–20 projects with target GCs</Body>
        </Reveal>
        <Reveal delay={170}>
          <Body>Delivered using JiTpro production system</Body>
        </Reveal>
        <Reveal delay={250}>
          <Label>Measured</Label>
          <Bullets
            items={[
              'Procurement plan build time (months → hours)',
              'Constraints identified pre-construction',
              'Reduction in reactive procurement',
              'Repeat and referral rate',
            ]}
          />
        </Reveal>
        <Reveal delay={340}>
          <Label>Objective</Label>
          <Emphasis>
            Prove early procurement control stabilizes execution and protects margin.
          </Emphasis>
        </Reveal>
      </DeckSection>

      {/* ─── 7. Competition ─── */}
      <DeckSection id="competition">
        <Reveal delay={0}>
          <SectionLabel>07 — Competition</SectionLabel>
        </Reveal>
        <Reveal delay={50}>
          <SectionTitle>Competitive Landscape</SectionTitle>
        </Reveal>
        <Reveal delay={120}>
          <Label>Status Quo</Label>
          <Bullets
            items={[
              'Informal procurement planning',
              'Reactive execution',
              'Spreadsheet tracking',
            ]}
          />
        </Reveal>
        <Reveal delay={220}>
          <Label>PM Platforms</Label>
          <Bullets items={['Track submittals', 'Do not sequence procurement']} />
        </Reveal>
        <Reveal delay={320}>
          <Label>JiTpro Position</Label>
          <Emphasis>Early Execution Control System for Procurement</Emphasis>
          <Body>Operates before construction begins — where no system exists.</Body>
        </Reveal>
      </DeckSection>

      {/* ─── 8. Team ─── */}
      <DeckSection id="team">
        <Reveal delay={0}>
          <SectionLabel>08 — Team</SectionLabel>
        </Reveal>
        <Reveal delay={50}>
          <SubTitle>Jeff Kaufman — Founder</SubTitle>
        </Reveal>
        <Reveal delay={130}>
          <Bullets
            items={[
              '38+ years construction experience',
              'Luxury residential + light commercial',
              'Direct exposure to procurement-driven failure',
            ]}
          />
        </Reveal>
        <Reveal delay={230}>
          <Label>Strength</Label>
          <Bullets
            items={[
              'Domain authority',
              'First-principles sequencing',
              'Practitioner-led system design',
            ]}
          />
        </Reveal>

        <Reveal delay={330}>
          <div className="border-t border-slate-800/40 mt-10 pt-10" />
          <SubTitle>Kevin Burns — Head of Sales & Field Integration</SubTitle>
        </Reveal>
        <Reveal delay={410}>
          <Bullets
            items={[
              '25+ years construction experience (Superintendent → Production Manager → General Superintendent)',
              'Led teams of 30+ across PMs, supers, and field staff',
              'Deep experience managing subcontractors, schedules, and execution under real jobsite pressure',
              'Built and enforced SOPs, safety programs, and operational systems',
              'Strong client-facing leadership and stakeholder alignment',
            ]}
          />
        </Reveal>
        <Reveal delay={490}>
          <Label>Role</Label>
          <Bullets
            items={[
              'Leads sales through operator-to-operator trust',
              'Bridges field execution → JiTpro system adoption',
              'Ensures real-world workflow alignment (not theoretical usage)',
            ]}
          />
        </Reveal>

        <Reveal delay={570}>
          <div className="border-t border-slate-800/40 mt-10 pt-10" />
          <Emphasis>Why This Team Wins</Emphasis>
          <Body>JiTpro is not sold by traditional SaaS sales.</Body>
          <Body>It is deployed by operators who have lived the failure it prevents.</Body>
        </Reveal>
      </DeckSection>

      {/* ─── 9. Financials ─── */}
      <section id="financials" className="pt-8 pb-16" style={{ scrollSnapAlign: 'start', scrollMarginTop: '7.5rem' }}>
        <div className="max-w-3xl mx-auto px-6">
          {/* Phase 1 */}
          <SubSection first>
            <Reveal delay={0}>
              <SectionLabel>09 — Financials / Business Model</SectionLabel>
            </Reveal>
            <Reveal delay={50}>
              <SubTitle>Phase 1 — Production Model</SubTitle>
            </Reveal>
            <TimelineContainer>
              <TimelineNode delay={130}>
                <Emphasis>$15,000 per project</Emphasis>
              </TimelineNode>
              <TimelineNode delay={190}>
                <Emphasis>70 projects/year → $1M ARR</Emphasis>
              </TimelineNode>
            </TimelineContainer>
            <Reveal delay={270}>
              <Label>Structure</Label>
              <Bullets
                items={[
                  'Founder (sales + QA)',
                  'Operator (production)',
                  '1 operator ≈ 70 projects/year capacity',
                ]}
              />
            </Reveal>
            <Reveal delay={350}>
              <Emphasis>Standardized output, not consulting</Emphasis>
            </Reveal>
          </SubSection>

          {/* Phase 2 */}
          <SubSection>
            <Reveal delay={0}>
              <SubTitle>Phase 2 — SaaS + Expansion Model</SubTitle>
            </Reveal>
            <Reveal delay={70}>
              <Label>JiTpro Core</Label>
              <Emphasis>$299/month per GC</Emphasis>
              <Body>Pre-bid scope + spec clarity</Body>
            </Reveal>
            <Reveal delay={170}>
              <Label>JiTpro Control Tower</Label>
              <Emphasis>~$15,000 per project</Emphasis>
              <Body>Post-award procurement execution</Body>
            </Reveal>
          </SubSection>

          {/* Revenue per GC */}
          <SubSection>
            <Reveal delay={0}>
              <SubTitle>Revenue per GC</SubTitle>
            </Reveal>
            <TimelineContainer>
              <TimelineNode delay={70}>
                <Body>Core: ~$3,600/year</Body>
              </TimelineNode>
              <TimelineNode delay={130}>
                <Body>Control Tower: ~$45K–$60K/year</Body>
              </TimelineNode>
              <TimelineNode delay={190}>
                <Body>
                  Assumption: Each GC activates Control Tower on 3–4 projects per year
                </Body>
              </TimelineNode>
            </TimelineContainer>
            <Reveal delay={280}>
              <Emphasis>Total: ~$50K–$60K per GC annually</Emphasis>
            </Reveal>
          </SubSection>

          {/* Expansion Motion */}
          <SubSection>
            <Reveal delay={0}>
              <SubTitle>Expansion Motion</SubTitle>
            </Reveal>
            <Reveal delay={70}>
              <Emphasis>Core → Win Project → Control Tower</Emphasis>
            </Reveal>
            <Reveal delay={170}>
              <Label>Upgrade trigger</Label>
              <Body>Project award (workflow-driven)</Body>
            </Reveal>
          </SubSection>

          {/* Market Opportunity */}
          <SubSection>
            <Reveal delay={0}>
              <SubTitle>Market Opportunity</SubTitle>
            </Reveal>
            <Reveal delay={70}>
              <Label>Validated Entry (California)</Label>
              <Body>5,000–15,000 GCs in ICP</Body>
            </Reveal>
            <Reveal delay={150}>
              <Label>US Market</Label>
              <Body>~40,000–60,000 GCs</Body>
            </Reveal>
            <Reveal delay={240}>
              <div className="grid grid-cols-3 gap-4 my-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    TAM
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-slate-100">$2B–$3B</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    SAM
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-slate-100">$500M–$700M</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    SOM
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-slate-100">$10M–$20M</p>
                </div>
              </div>
              <Body>SOM: 200–400 GCs</Body>
            </Reveal>
          </SubSection>

          {/* Scale Targets */}
          <SubSection>
            <Reveal delay={0}>
              <SubTitle>Scale Targets</SubTitle>
            </Reveal>
            <TimelineContainer>
              <TimelineNode delay={70}>
                <Emphasis>~$5M → ~100 GCs</Emphasis>
              </TimelineNode>
              <TimelineNode delay={150}>
                <Emphasis>~$10M → ~200 GCs</Emphasis>
              </TimelineNode>
            </TimelineContainer>
            <Reveal delay={250}>
              <Body>Revenue scales with projects per contractor — not seats.</Body>
            </Reveal>
          </SubSection>

          {/* Burn / Capital */}
          <SubSection>
            <Reveal delay={0}>
              <SubTitle>Burn / Capital Requirements (Phase 1)</SubTitle>
            </Reveal>
            <Reveal delay={70}>
              <Body>Estimated annual burn to reach $1M ARR:</Body>
            </Reveal>
            <Reveal delay={150}>
              <Bullets
                items={[
                  'Founder + Operator: $150K–$250K',
                  'Tooling / Development: $50K–$100K',
                  'Sales & Marketing: ~$60K',
                  'Operations: $20K–$40K',
                ]}
              />
            </Reveal>
            <Reveal delay={250}>
              <Label>Total Estimated Burn</Label>
              <Emphasis>~$250K–$450K to reach $1M ARR</Emphasis>
            </Reveal>
          </SubSection>
        </div>
      </section>

      {/* ─── 10. Closing ─── */}
      <DeckSection id="closing">
        <Reveal delay={0}>
          <SectionLabel>Closing</SectionLabel>
        </Reveal>
        <Reveal delay={60}>
          <SectionTitle>Construction instability is not inevitable.</SectionTitle>
        </Reveal>
        <Reveal delay={180}>
          <Body>It is created early — when procurement constraints are unmanaged.</Body>
        </Reveal>
        <Reveal delay={300}>
          <Emphasis>JiTpro prevents that.</Emphasis>
        </Reveal>
        <Reveal delay={460}>
          <p className="text-2xl md:text-3xl font-bold text-amber-500 tracking-tight mt-8">
            Control Before Construction
          </p>
        </Reveal>
      </DeckSection>
    </div>
  );
}
