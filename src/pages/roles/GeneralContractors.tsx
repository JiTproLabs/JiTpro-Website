import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Eye, Settings, Shield } from 'lucide-react';
import JiTproWordmark, { brandText } from '../../components/JiTproWordmark';

function AccordionCard({
  icon,
  title,
  bullets,
  defaultOpen = false,
}: {
  icon: React.ReactNode;
  title: string;
  bullets: string[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-slate-900">{brandText(title)}</h3>
        </div>
        <ChevronDown
          size={20}
          className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <ul className="px-6 pb-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                <span className="text-slate-600 leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function GeneralContractors() {
  return (
    <div>
      {/* 1. HERO */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-6">
            For General Contractors
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Get Ahead of the Job<br />Before It Gets Ahead of You
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
{brandText('When procurement breaks down early, the damage spreads far beyond material dates. Schedules slip, teams go reactive, quality gets compressed, and credibility with owners and consultants erodes. JITpro gives general contractors a Day One procurement execution framework that supports the schedule and protects the health of the entire project environment.')}
          </p>
          <div className="space-y-3">
            {[
              'Make ambiguity visible on Day One',
              'Stabilize the schedule before field pressure begins',
              'Protect margin, quality, and contractor credibility',
            ].map((bullet) => (
              <div key={bullet} className="flex gap-3 items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-lg text-slate-700 font-medium">{bullet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. PROBLEM FRAMING */}
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            When procurement loses control, the whole project environment degrades
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed">
              What starts as unresolved buyout, late approvals, incomplete submittals, shifting selections, or missed lead-time decisions does not stay contained. It breaks the schedule. Once the schedule becomes unstable, the job turns reactive: PMs and supers chase answers, trades resequence work, quality gets compressed, teams burn out, and owner and consultant confidence starts to slip.
            </p>
            <div className="border-l-4 border-amber-500 pl-6 space-y-2">
              <p className="text-lg text-slate-800 font-semibold">
                The schedule is the backbone of the project environment.
              </p>
              <p className="text-lg text-slate-800 font-semibold">
                When it breaks, everything around it gets harder.
              </p>
            </div>
            <p className="text-lg text-slate-700 font-medium">
              This is not a field performance problem. It is a Day One procurement control failure.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CONSEQUENCE SECTION */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            A broken schedule creates an unhealthy project environment
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            General contractors do not just pay for procurement failure in expediting costs or delayed materials. They pay for it across the entire project ecosystem: people, quality, coordination, credibility, and decision-making.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Teams spend more time reacting and less time leading',
              'Burnout pressure rises from top to bottom',
              'Quality suffers when work is compressed and resequenced',
              'Trade relationships become more strained',
              'Owners and consultants lose confidence in the contractor\u2019s control of the job',
              'Costs climb as the team shifts from planning to recovery',
            ].map((item) => (
              <div key={item} className="flex gap-3 items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-lg text-slate-600 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-lg text-slate-700 font-medium mt-8">
            Early procurement control supports the schedule, and a supported schedule protects the health of the entire project environment.
          </p>
        </div>
      </section>

      {/* 4. THREE-CARD VALUE SECTION — ACCORDIONS */}
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            What <JiTproWordmark variant="slate" /> delivers
          </h2>
          <div className="space-y-4">
            <AccordionCard
              icon={<Settings size={20} />}
              title="What you control"
              defaultOpen={true}
              bullets={[
                'Set procurement deadlines from real install dates',
                'Route buyout, approvals, and selections against those dates',
                'Escalate unresolved decisions before they compress the schedule',
              ]}
            />
            <AccordionCard
              icon={<Eye size={20} />}
              title="What you see"
              bullets={[
                'Real-time status of submittals, approvals, lead times, and deliveries',
                'Procurement risk forecast weeks ahead',
                'Clear ownership and dependency for every critical decision',
              ]}
            />
            <AccordionCard
              icon={<Shield size={20} />}
              title="What JITpro protects"
              bullets={[
                'Schedule stability before field pressure compounds',
                'A healthier, less reactive project environment',
                'Contractor credibility with owners, consultants, and trades',
              ]}
            />
          </div>
        </div>
      </section>

      {/* 5. GROWTH-STAGE GC TENSION */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            As complexity grows, project health becomes harder to protect
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed">
              Growth-stage GCs often feel the strain before they see the root cause. The schedule gets fixed while early procurement dependencies are still unresolved. As complexity rises, teams absorb the pressure through late decisions, resequencing, escalation, and constant recovery work.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Drawings continue evolving into execution',
                'Owners finalize selections after schedule lock',
                'Long-lead constraints surface too late',
                'Procurement sequencing remains informal or fragmented',
                'Teams absorb instability through fire drills and overtime pressure',
                'Operational strain grows faster than control systems',
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                  <p className="text-lg text-slate-600 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-lg text-slate-700 font-medium">
              When procurement control does not scale, the whole project environment gets more reactive, more exhausting, and harder to lead.
            </p>
          </div>
        </div>
      </section>

      {/* 6. WHAT JITPRO ACTUALLY DOES */}
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            <JiTproWordmark variant="slate" /> replaces reaction with structure
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed">
{brandText('Before field pressure begins, JITpro creates a procurement control system that turns unresolved information into managed schedule constraints. That structure does more than protect procurement. It helps preserve a healthier execution environment across the project.')}
            </p>
            <div className="space-y-3">
              {[
                'Surfaces scope gaps and unresolved information at award',
                'Assigns responsibility for missing decisions',
                'Treats missing information as schedule constraints',
                'Aligns approvals, fabrication, and deliveries to procurement deadlines',
                'Creates a weekly accountability rhythm before chaos takes over',
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                  <p className="text-lg text-slate-600 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-lg text-slate-700 font-medium">
              Better control upstream creates a healthier job downstream.
            </p>
          </div>
        </div>
      </section>

      {/* 7. OUTCOMES */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            The result
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'More stable schedule performance',
              'Less burnout and turnover pressure',
              'Better quality under less compression',
              'Fewer fire drills and blame cycles',
              'Stronger owner and consultant confidence',
              'Protected margin and stronger contractor credibility',
            ].map((item) => (
              <div key={item} className="flex gap-3 items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-lg text-slate-600 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="px-6 py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Control before construction
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-4 max-w-3xl mx-auto">
{brandText('You would never build without a schedule. You should never build without a procurement execution plan. JITpro gives general contractors the structure to capture project constraints on Day One, stabilize the schedule before field pressure begins, and protect the health of the project environment as execution ramps up.', 'amber')}
          </p>
          <p className="text-slate-400 mb-10">
            A healthier project starts with better procurement control.
          </p>
          <Link
            to="/contact/contractor"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 text-lg font-medium hover:bg-slate-100 transition-colors"
          >
            Let's Talk Procurement
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
