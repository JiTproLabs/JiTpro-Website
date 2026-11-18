import { ArrowUpRight, ChevronDown, Plus } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { collapseAll, expandAll, toggle, type OpenSet } from '../components/faq/accordionState';
import { FAQS, answerText, type AnswerBlock } from '../content/faqContent';

/**
 * /faq: the FAQ page (Design System §65, Decision Log 2026-11-17), built from
 * the approved reference in docs/design/assets/faq-preview and promoted from
 * the /faq-preview review route on founder approval. The original FAQ is
 * preserved, unchanged, at /faq-legacy (FAQLegacy.tsx).
 *
 *   HERO      navy; eyebrow, "Less chaos. More clarity.", lead, a jump link to
 *             the questions and a contact link; at the right, the
 *             DEFINE, CONNECT, SEQUENCE card
 *   STRIP     the amber principle line
 *   FAQ       warm neutral ground; the intro, Expand all and Collapse all,
 *             ten numbered questions
 *   CLOSE     navy; the closing message and the contact action
 *
 * Inside the site's own header and footer (MainLayout). The accordion's rules
 * live in accordionState.ts; the copy, verbatim, in faqContent.ts. Like the
 * original page, it publishes the questions as FAQPage structured data.
 * Motion: the answers open by height, and none under reduced motion.
 */

const QUESTION_IDS = FAQS.map((f) => f.number);
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** The reference's warm paper: --jp-surface-white warmed with a trace of amber (as the contractor page's light act). */
const PAPER = { backgroundColor: 'color-mix(in oklab, var(--jp-surface-white) 95%, var(--jp-brand-amber))' };
const GUTTERS = 'mx-auto max-w-[73rem] px-5 sm:px-8 lg:px-10';

/** The questions as schema.org FAQPage data, as the original FAQ page published them. */
const STRUCTURED_DATA = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: answerText(faq).replace(/\n/g, '\n\n') },
  })),
});

/** Jump to the questions without changing the route, smoothly unless motion is reduced. */
function jumpToQuestions(event: MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('questions');
  if (!target) return;
  event.preventDefault();
  const reduced = window.matchMedia(REDUCED_MOTION).matches;
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  document.getElementById('questions-heading')?.focus({ preventScroll: true });
}

const PRIMARY =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-jp-brand-amber px-6 py-3.5 text-[0.9375rem] font-bold text-jp-background transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none';

/* ------------------------------------------------------------- hero */

const STAGES = [
  { key: '01', name: 'Define', detail: 'Everything the project requires' },
  { key: '02', name: 'Connect', detail: 'Decisions, approvals & responsibilities' },
  { key: '03', name: 'Sequence', detail: 'The right work at the right time' },
] as const;

function ReadinessCard() {
  return (
    <aside
      aria-label="JiTpro's approach to procurement"
      className="rounded-2xl border border-jp-text-primary/20 bg-jp-text-primary/[0.03] p-6 shadow-[0_24px_75px_color-mix(in_oklab,var(--jp-background)_45%,transparent)] lg:rotate-2 lg:p-7"
    >
      <div className="flex items-center justify-between gap-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-jp-text-secondary">
        <span>JiTpro / Project readiness</span>
        <span className="flex items-center gap-1.5 text-jp-brand-amber">
          <span aria-hidden="true" className="block size-1.5 rounded-full bg-jp-brand-amber" />
          Early control
        </span>
      </div>
      <ol className="mt-7">
        {STAGES.map((stage, i) => (
          <li key={stage.key}>
            {i > 0 ? <span aria-hidden="true" className="ml-[1.0625rem] block h-5 border-l border-dashed border-jp-brand-amber/55" /> : null}
            <div className="flex items-center gap-3">
              <span className="grid size-[2.125rem] shrink-0 place-items-center rounded-full bg-jp-brand-amber/12 text-[0.75rem] font-extrabold text-jp-brand-amber">
                {stage.key}
              </span>
              <div className="flex-1 rounded-lg border border-jp-text-primary/15 bg-jp-surface px-4 py-3.5">
                <p className="text-[0.8125rem] font-extrabold uppercase tracking-[0.04em] text-jp-text-primary">{stage.name}</p>
                <p className="mt-1 text-[0.6875rem] text-jp-text-muted">{stage.detail}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-jp-text-primary/12 pt-4 text-[0.75rem] text-jp-text-secondary">
        <span>Not everything is urgent on day one.</span>
        <strong className="text-[0.8125rem] text-jp-brand-amber">Know when it matters.</strong>
      </div>
    </aside>
  );
}

function Hero() {
  return (
    <section aria-labelledby="faq-hero" className="relative isolate overflow-hidden bg-jp-background text-jp-text-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ backgroundImage: 'radial-gradient(ellipse at 95% 20%, color-mix(in oklab, var(--jp-brand-amber) 11%, transparent), transparent 53%)' }}
      />
      <div className={`${GUTTERS} grid gap-12 pt-16 pb-20 sm:pt-20 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-[4.5rem] lg:pt-24 lg:pb-28`}>
        <div>
          <p className="flex items-center gap-3 text-[0.75rem] font-extrabold uppercase tracking-[0.2em] text-jp-brand-amber">
            <span aria-hidden="true" className="block h-0.5 w-8 bg-jp-brand-amber" />
            The questions that matter
          </p>
          <h1
            id="faq-hero"
            className="mt-7 font-heading text-[min(3.25rem,13vw)] font-extrabold leading-[1.01] tracking-[-0.03em] sm:text-[4.25rem] lg:text-[clamp(4rem,6vw,5.25rem)]"
          >
            <span className="block">Less chaos.</span>
            <span className="block text-jp-brand-amber">More clarity.</span>
          </h1>
          <p className="mt-7 max-w-[36rem] text-[1rem] leading-[1.75] text-jp-text-secondary sm:text-[1.125rem]">
            You&apos;ve got a project to build. We&apos;ve got answers about how JiTpro helps your team get ahead of the decisions, materials,
            and commitments that make it possible.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#questions" onClick={jumpToQuestions} className={PRIMARY}>
              Explore the FAQs
              <ChevronDown size={18} aria-hidden="true" />
            </a>
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center gap-1.5 border-b border-jp-text-muted pb-1 text-[0.875rem] text-jp-text-secondary transition-colors duration-200 ease-out hover:border-jp-brand-amber-active hover:text-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-text-primary motion-reduce:transition-none"
            >
              Have a specific question?
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <ReadinessCard />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- strip */

function PrincipleStrip() {
  return (
    <div className="bg-jp-brand-amber text-jp-background">
      <div className={`${GUTTERS} flex items-center justify-between gap-5 py-5 sm:py-6`}>
        <p className="font-heading text-[0.9375rem] font-extrabold tracking-[-0.01em] sm:text-[1.0625rem]">
          We don&apos;t make everything urgent. We make the timing of everything clear.
        </p>
        <p className="hidden shrink-0 text-[0.6875rem] font-extrabold uppercase tracking-[0.16em] sm:block">One project at a time.</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- FAQ */

function Answer({ blocks }: { blocks: AnswerBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === 'callout') {
          return (
            <p key={i} className="my-6 border-l-[3px] border-jp-brand-amber py-1 pl-4 text-[1rem] font-extrabold leading-[1.55] text-jp-background sm:text-[1.0625rem]">
              {block.text}
            </p>
          );
        }
        if (block.kind === 'link') {
          return (
            <p key={i} className="mt-4">
              <Link
                to={block.to}
                className="font-bold text-jp-background underline decoration-jp-brand-amber decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-background"
              >
                {block.text}
              </Link>
            </p>
          );
        }
        return (
          <p key={i} className="mb-4 last:mb-0">
            {block.segments.map((s, j) =>
              typeof s === 'string' ? (
                s
              ) : (
                <strong key={j} className="font-bold text-jp-background">
                  {s.strong}
                </strong>
              ),
            )}
          </p>
        );
      })}
    </>
  );
}

function Questions() {
  const [open, setOpen] = useState<OpenSet>(() => new Set(['01']));

  return (
    <section id="questions" aria-labelledby="questions-heading" className="scroll-mt-24 text-jp-background" style={PAPER}>
      <div className={`${GUTTERS} py-[4.5rem] sm:py-24 lg:pt-[6.5rem] lg:pb-[7.5rem]`}>
        <div className="grid gap-4 lg:grid-cols-[0.52fr_1fr] lg:gap-20">
          <p className="pt-2.5 text-[0.75rem] font-extrabold uppercase tracking-[0.18em] text-jp-ink-secondary">Frequently asked questions / 01–10</p>
          <div>
            <h2
              id="questions-heading"
              tabIndex={-1}
              className="font-heading text-[min(2.375rem,10vw)] font-extrabold leading-[1.07] tracking-[-0.025em] text-balance outline-none sm:text-[3rem] lg:text-[clamp(2.75rem,4vw,3.5rem)]"
            >
              <span className="sm:block">Everything you need to know.</span> <span className="sm:block">Nothing you don&apos;t.</span>
            </h2>
            <p className="mt-4 max-w-[37rem] text-[0.9375rem] leading-[1.7] text-jp-ink-secondary">
              Ten straight answers about what JiTpro does, when to get us involved, and how dedicated procurement planning protects the work
              ahead.
            </p>
          </div>
        </div>

        <div className="mt-10 mb-4 flex justify-end gap-2.5 lg:mt-12">
          {(
            [
              ['Expand all', () => setOpen(expandAll(QUESTION_IDS)), '+'],
              ['Collapse all', () => setOpen(collapseAll()), '−'],
            ] as const
          ).map(([label, action, mark]) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className="min-h-11 cursor-pointer rounded-md border border-jp-ink-secondary/30 px-4 text-[0.8125rem] font-bold text-jp-ink-secondary transition-colors duration-200 ease-out hover:border-jp-ink-secondary/60 hover:bg-jp-surface-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-background motion-reduce:transition-none"
            >
              {label} <span aria-hidden="true">{mark}</span>
            </button>
          ))}
        </div>

        <ol>
          {FAQS.map((faq) => {
            const isOpen = open.has(faq.number);
            const buttonId = `faq-q${faq.number}`;
            const panelId = `faq-a${faq.number}`;
            return (
              <li
                key={faq.number}
                className={`border-t border-jp-ink-secondary/25 transition-[background-color,box-shadow] duration-200 ease-out last:border-b motion-reduce:transition-none ${
                  isOpen ? 'border-jp-ink-secondary/15 bg-jp-surface-white shadow-[0_7px_30px_color-mix(in_oklab,var(--jp-background)_6%,transparent)]' : ''
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen((current) => toggle(current, faq.number))}
                    className="grid w-full cursor-pointer grid-cols-[1.75rem_minmax(0,1fr)_2rem] items-center gap-2.5 px-3 py-6 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-jp-background sm:grid-cols-[4rem_minmax(0,1fr)_2.5rem] sm:gap-[1.125rem] sm:py-[1.875rem] sm:pr-6 sm:pl-[1.125rem]"
                  >
                    <span className="text-[0.8125rem] font-black tracking-[0.06em] text-jp-ink-secondary">{faq.number}</span>
                    <span className="font-heading text-[1.0625rem] font-extrabold leading-[1.35] tracking-[-0.01em] text-jp-background sm:text-[clamp(1.125rem,2.1vw,1.4375rem)]">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid size-8 place-items-center rounded-full border transition-[transform,background-color,border-color] duration-200 ease-out motion-reduce:transition-none sm:size-10 ${
                        isOpen ? 'rotate-45 border-jp-brand-amber bg-jp-brand-amber text-jp-background' : 'border-jp-ink-secondary/45 text-jp-background'
                      }`}
                    >
                      <Plus size={20} strokeWidth={1.5} />
                    </span>
                  </button>
                </h3>
                {/* Opens by height; hidden (and out of the tab order) when closed. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="max-w-[50rem] pr-5 pb-7 pl-[3.25rem] text-[0.9375rem] leading-[1.85] text-jp-ink-secondary sm:pr-[4.75rem] sm:pb-9 sm:pl-[6.3rem]">
                      <Answer blocks={faq.answer} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- close */

function Closing() {
  return (
    <section aria-labelledby="faq-close" className="relative isolate overflow-hidden bg-jp-surface text-jp-text-primary">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-56 -z-10 block size-[30rem] rounded-full border-[5rem] border-jp-brand-amber/10"
      />
      <div className={`${GUTTERS} py-[4.5rem] sm:py-24`}>
        <p className="flex items-center gap-3 text-[0.75rem] font-extrabold uppercase tracking-[0.2em] text-jp-brand-amber">
          <span aria-hidden="true" className="block h-0.5 w-8 bg-jp-brand-amber" />
          Break the cycle
        </p>
        <h2
          id="faq-close"
          className="mt-6 max-w-[49rem] font-heading text-[min(2.625rem,11vw)] font-extrabold leading-[1.07] tracking-[-0.03em] text-balance sm:text-[3.25rem] lg:text-[clamp(3.25rem,5.1vw,4.25rem)]"
        >
          The best time to get ahead of your next project is <span className="text-jp-brand-amber">before it starts.</span>
        </h2>
        <p className="mt-6 mb-9 max-w-[36rem] text-[1.0625rem] leading-[1.7] text-jp-text-secondary">
          Give your team clarity before urgency takes over. Start with a conversation about your upcoming project.
        </p>
        <Link to="/contact" className={PRIMARY}>
          Let&apos;s talk about your project
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default function FAQ() {
  return (
    <div className="bg-jp-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }} />
      <Hero />
      <PrincipleStrip />
      <Questions />
      <Closing />
    </div>
  );
}
