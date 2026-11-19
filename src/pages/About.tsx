import { ArrowDown, ArrowRight, ClipboardList, Handshake, HardHat, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  HowWeWorkTogetherSection,
  OurExperienceSection,
  OurInvitationSection,
  WhatWeBelieveSection,
} from '../components/about/AboutSections';
import WhatWeDoSection from '../components/about/WhatWeDoSection';

/**
 * The About page hero (Design System §74, Decision Log 2026-11-18), from the founder-approved mockup in
 * docs/design/assets/about-hero. MESSAGE: JiTpro is a hands-on, service-led procurement and project-readiness company
 * that works alongside the contractor's own team; the contractor stays in charge. Not another software platform.
 *
 *   xl+    the collaboration photograph full bleed, the three people at right; a --jp-surface wash from the left
 *          carries the copy column and is gone before the first contractor's face. Overlay only from `xl`, where the
 *          hero stays near the photograph's own proportion; narrower, the crop would put a face under the copy.
 *          Past 1280px the photograph starts at the content frame's left edge, so the copy keeps its place against
 *          the people however wide the screen; the plain --jp-surface ground runs to its left
 *   <xl    a deliberate stack: the photograph as a band showing the three people, then the copy on --jp-surface
 *
 * Amber (§8.1.1, §48.7): the eyebrow's bar, the closing statement's bar and the primary action. No motion beyond
 * the actions' hover. The photograph is decorative (the copy carries the message), so its alt is empty.
 */
const ABOUT_HERO = `${import.meta.env.BASE_URL}assets/about/jitpro-about-collaboration-hero`;

/** The action pair of the Architects hero (§61): amber primary, hairline secondary. */
const ACTION =
  'inline-flex w-full max-w-md items-center justify-center gap-2.5 rounded-xl px-4 py-4 text-center text-[0.9375rem] font-semibold transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:w-auto sm:px-7 sm:text-base';

/** From `xl`: solid --jp-surface under the copy, easing out across the first man's vest, gone before the faces. */
const HERO_WASH = {
  backgroundImage:
    'linear-gradient(90deg, var(--jp-surface) 0%, var(--jp-surface) 30%, color-mix(in oklab, var(--jp-surface) 90%, transparent) 40%, color-mix(in oklab, var(--jp-surface) 55%, transparent) 48%, transparent 58%)',
};

/** Below `xl`: the band's left edge and foot handed off to the --jp-surface ground beneath the copy. */
const BAND_FADES = {
  backgroundImage:
    'linear-gradient(0deg, var(--jp-surface) 0%, transparent 32%), linear-gradient(90deg, color-mix(in oklab, var(--jp-surface) 70%, transparent) 0%, transparent 22%)',
};

function AboutHero() {
  return (
    <section aria-labelledby="about-hero-heading" className="relative isolate overflow-hidden bg-jp-surface">
      <div aria-hidden="true" className="pointer-events-none relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/9] xl:absolute xl:inset-y-0 xl:right-0 xl:left-[max(0px,calc(50%-40rem))] xl:aspect-auto">
        <img
          src={`${ABOUT_HERO}-1672.webp`}
          srcSet={`${ABOUT_HERO}-960.webp 960w, ${ABOUT_HERO}-1672.webp 1672w`}
          sizes="100vw"
          width={1672}
          height={941}
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-[100%_45%] xl:object-[right_30%]"
        />
        <div className="absolute inset-0 xl:hidden" style={BAND_FADES} />
        <div className="absolute inset-0 hidden xl:block" style={HERO_WASH} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10 xl:flex xl:min-h-[min(54rem,51vw)] xl:items-center xl:py-[clamp(3.5rem,4.5vw,5rem)]">
        <div className="-mt-4 xl:mt-0 xl:w-full">
          {/* Authored in sentence case, uppercased in CSS (§7.7). */}
          <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-jp-text-primary sm:text-sm">
            <span aria-hidden="true" className="block h-5 w-1 shrink-0 rounded-full bg-jp-brand-amber" />
            About JiTpro
          </p>
          <h1
            id="about-hero-heading"
            className="mt-5 font-heading text-[min(2.5rem,10vw)] font-extrabold leading-[1.06] tracking-[-0.03em] text-jp-text-primary sm:text-[3.25rem] xl:text-[clamp(3rem,3.75vw,4rem)] xl:leading-[1.04]"
          >
            {/* One sentence per line on phones; from `sm`, two lines as in the mockup. */}
            <span className="block sm:inline">Your project.</span> <span className="block sm:inline">Your team.</span>{' '}
            <span className="block">Our expertise.</span>
          </h1>
          <p className="mt-6 max-w-[40rem] text-[1.1875rem] leading-[1.5] text-pretty text-jp-text-primary sm:text-[1.3125rem] xl:max-w-[min(36rem,47vw)] xl:text-[clamp(1.125rem,1.3vw,1.3125rem)]">
            We don&apos;t hand you another software platform and leave you to figure it out. We roll up our sleeves and work
            alongside you.
          </p>
          <div className="mt-5 max-w-[40rem] space-y-4 text-[1.0625rem] leading-[1.6] text-pretty text-jp-text-secondary sm:text-[1.125rem] xl:max-w-[min(36rem,47vw)] xl:space-y-3 xl:text-[clamp(1rem,1.15vw,1.125rem)] xl:leading-[1.55]">
            <p>JiTpro is a hands-on construction procurement and project-readiness service built by contractors, for contractors.</p>
            <p>
              We work side by side with you and your team to dig into the details, uncover problems before they reach the field,
              and put the planning, coordination, and accountability in place to protect your schedule, your profits, and your
              people.
            </p>
          </div>
          <div className="relative mt-7 max-w-[40rem] pl-5 sm:pl-6 xl:mt-6 xl:max-w-[min(36rem,47vw)]">
            <span aria-hidden="true" className="absolute top-1 bottom-1 left-0 w-1 rounded-full bg-jp-brand-amber" />
            <p className="font-heading text-[1.0625rem] font-bold leading-[1.45] text-pretty text-jp-text-primary sm:text-[1.1875rem] xl:text-[clamp(1.0625rem,1.25vw,1.1875rem)]">
              No new software to master. No additional full-time staff to hire. Just experienced professionals helping you get
              ahead of the problems that have held your projects back.
            </p>
          </div>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap xl:mt-8">
            <Link
              to="/contact"
              className={`${ACTION} border border-transparent bg-jp-brand-amber text-jp-background shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--jp-brand-amber)_60%,transparent)] hover:bg-jp-brand-amber-active`}
            >
              Let&apos;s talk about your project
              <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
            </Link>
            <Link
              to="/founder-story"
              className={`${ACTION} border border-jp-text-primary/70 text-jp-text-primary hover:border-jp-brand-amber-active hover:text-jp-brand-amber-active`}
            >
              Read our founder&apos;s story
              <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The section after the hero, *Why JiTpro exists* (Design System §75, Decision Log 2026-11-18), from the
 * founder-approved mockup and its text-free artwork in docs/design/assets/about-why. It replaces the page's former
 * opening section. MESSAGE: at contract award the GC's team must get the job moving and get it ready at once; the
 * first wins, the planning slips, and the cost arrives in the field. JiTpro joins the team to do that upfront work.
 * Never: the team lacks skill, must work harder, or is replaced; JiTpro takes on no one's contractual role.
 *
 *   LEFT   eyebrow, h2 and the narrative, its two turns emphasised (one behind an amber bar)
 *   RIGHT  the infographic, built in HTML on a light panel: only its photographs (the sky and crane, the two card
 *          photographs) come from the artwork, so no text depends on an image's geometry
 *
 * Two columns from `xl` (narrower, the cards crowd); stacked below it, the cards side by side from `sm`. Amber on white is decorative (§8.8): the bars, icons,
 * the award pill's fill (navy label) and the callout's edge and wash. The planning accent is navy (no blue token
 * exists). No motion.
 */
const PRESSURE = `${import.meta.env.BASE_URL}assets/about/about-pressure`;

/** Light amber and navy washes on white. */
const amberWash = (percent: number) => `color-mix(in oklab, var(--jp-brand-amber) ${percent}%, var(--jp-surface-white))`;
const navyWash = (percent: number) => `color-mix(in oklab, var(--jp-surface) ${percent}%, var(--jp-surface-white))`;

const WORKLOADS: ReadonlyArray<{
  title: string;
  body: string;
  label: string;
  photo: string;
  Icon: LucideIcon;
  accent: 'amber' | 'navy';
}> = [
  {
    title: 'Get the job moving',
    body: 'Mobilization, buyout, coordination, staffing, owner meetings, field operations',
    label: 'Immediate pressure',
    photo: `${PRESSURE}-card-moving-351.webp`,
    Icon: HardHat,
    accent: 'amber',
  },
  {
    title: 'Get the job ready',
    body: 'Scope validation, missing information, selections, approvals, commitments, procurement sequencing',
    label: 'Equally important',
    photo: `${PRESSURE}-card-ready-352.webp`,
    Icon: ClipboardList,
    accent: 'navy',
  },
];

function WhyJiTproExists() {
  return (
    <section aria-labelledby="why-jitpro-heading" className="bg-jp-surface-white">
      <div className="mx-auto grid max-w-7xl gap-y-14 px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-[clamp(5rem,7vw,6.5rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-x-[clamp(2.5rem,4vw,4.5rem)]">
        {/* ------------------------------------------------ the narrative */}
        <div className="max-w-[44rem] xl:max-w-none">
          {/* Authored in sentence case, uppercased in CSS (§7.7); slate on white, the bar amber (§8.8). */}
          <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-jp-ink-secondary sm:text-sm">
            <span aria-hidden="true" className="block h-5 w-1 shrink-0 rounded-full bg-jp-brand-amber" />
            Why JiTpro exists
          </p>
          <h2
            id="why-jitpro-heading"
            className="mt-5 font-heading text-[min(2.375rem,9.6vw)] font-extrabold leading-[1.06] tracking-[-0.03em] text-balance text-jp-background sm:text-[3rem] lg:text-[clamp(2.25rem,3.1vw,3rem)]"
          >
            The pressure starts before the project does.
          </h2>

          <div className="mt-8 space-y-4 text-[1.0625rem] leading-[1.6] text-pretty text-jp-background/85 lg:text-[clamp(1.0625rem,1.2vw,1.125rem)]">
            <p>You&apos;ve just won the job. The owner is excited. Expectations are high. Everyone wants to get moving.</p>
            <p>But the project you&apos;ve been hired to build is rarely as ready as everyone assumes.</p>
            <p>
              Drawings may be incomplete. Details remain unresolved. Selections haven&apos;t been made. Subcontractors need to be
              hired. Hundreds of products, materials, services, decisions, and approvals need to be identified, coordinated, and
              planned.
            </p>
          </div>

          <div className="relative my-7 pl-5 sm:pl-6">
            <span aria-hidden="true" className="absolute top-0.5 bottom-0.5 left-0 w-1 rounded-full bg-jp-brand-amber" />
            <p className="font-heading text-[1.3125rem] font-bold leading-[1.3] tracking-[-0.01em] text-jp-background sm:text-[1.5rem]">
              And the clock is already running.
            </p>
          </div>

          <div className="space-y-4 text-[1.0625rem] leading-[1.6] text-pretty text-jp-background/85 lg:text-[clamp(1.0625rem,1.2vw,1.125rem)]">
            <p>
              Your team is expected to mobilize, coordinate trades, establish budgets, manage the owner, and keep the project
              moving.
            </p>
            <p>
              At the very same time, they&apos;re supposed to dig into the details, uncover what&apos;s missing, establish
              responsibilities, and plan everything the field will need months from now.
            </p>
            <p className="font-semibold text-jp-background">That&apos;s two enormous jobs competing for the same people&apos;s time.</p>
            <p>And when today&apos;s demands take priority, tomorrow&apos;s planning gets pushed aside.</p>
            <p>
              Not because your people don&apos;t know how to plan. But because they&apos;re already consumed by the demands of
              getting the project underway.
            </p>
            <p>
              By the time missing decisions, incomplete scope, and procurement delays become visible in the field, the
              opportunity to solve them efficiently may already be gone.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------ the infographic */}
        <figure
          aria-labelledby="why-jitpro-graphic"
          className="relative isolate self-start overflow-hidden rounded-3xl border border-jp-ink-secondary/15 px-4 pt-8 pb-5 shadow-[0_24px_60px_-34px_color-mix(in_oklab,var(--jp-background)_45%,transparent)] sm:px-6 sm:pt-10 sm:pb-6 xl:sticky xl:top-28 xl:max-w-none max-w-[46rem]"
          style={{ backgroundColor: navyWash(2) }}
        >
          {/* The sky and crane, handed off to the panel. */}
          <img
            src={`${PRESSURE}-sky-crane-780.webp`}
            alt=""
            aria-hidden="true"
            width={780}
            height={186}
            loading="lazy"
            decoding="async"
            className="absolute inset-x-0 top-0 -z-10 h-[clamp(11rem,22vw,14rem)] w-full object-cover object-right [mask-image:linear-gradient(180deg,black_45%,transparent)]"
          />

          <div className="text-center">
            <p className="inline-block rounded-full bg-jp-brand-amber px-5 py-2 font-mono text-[0.75rem] font-bold uppercase tracking-[0.16em] text-jp-background sm:text-[0.8125rem]">
              Contract awarded
            </p>
            <h3
              id="why-jitpro-graphic"
              className="mx-auto mt-4 max-w-[26rem] font-heading text-[1.5rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-balance text-jp-background sm:text-[1.875rem]"
            >
              Two critical workloads begin at the same time.
            </h3>
          </div>

          <ul className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {WORKLOADS.map(({ title, body, label, photo, Icon, accent }) => (
              <li
                key={title}
                className="flex flex-col overflow-hidden rounded-2xl border border-jp-ink-secondary/15 bg-jp-surface-white shadow-[0_10px_26px_-20px_color-mix(in_oklab,var(--jp-background)_50%,transparent)]"
              >
                <img src={photo} alt="" aria-hidden="true" width={351} height={124} loading="lazy" decoding="async" className="aspect-[351/124] w-full object-cover" />
                <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
                  <h4 className="flex items-center gap-2.5 font-heading text-[1.1875rem] font-bold leading-[1.2] tracking-[-0.01em] text-jp-background lg:text-[clamp(1.0625rem,1.35vw,1.25rem)]">
                    <Icon aria-hidden="true" strokeWidth={1.8} className={`size-6 shrink-0 ${accent === 'amber' ? 'text-jp-brand-amber' : 'text-jp-surface'}`} />
                    {title}
                  </h4>
                  <p className="mt-2.5 flex-1 text-[0.9375rem] leading-[1.5] text-pretty text-jp-ink-secondary">{body}</p>
                  <p
                    className="mt-4 rounded-full px-4 py-2 text-center font-mono text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-jp-background sm:text-[0.75rem]"
                    style={{ backgroundColor: accent === 'amber' ? amberWash(20) : navyWash(10) }}
                  >
                    {label}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Both workloads land on the same people. */}
          <div aria-hidden="true" className="mt-6 flex items-center gap-4 px-4">
            <span className="h-px flex-1 bg-jp-ink-secondary/20" />
            <span className="flex size-9 items-center justify-center rounded-full" style={{ backgroundColor: navyWash(10) }}>
              <ArrowDown strokeWidth={2} className="size-5 text-jp-surface" />
            </span>
            <span className="h-px flex-1 bg-jp-ink-secondary/20" />
          </div>
          <div className="mt-4 px-2 text-center">
            <p className="font-heading text-[1.3125rem] font-extrabold leading-[1.2] tracking-[-0.015em] text-balance text-jp-background sm:text-[1.5rem]">
              One team. Two competing demands.
            </p>
            <p className="mx-auto mt-2 max-w-[32rem] text-[0.9375rem] leading-[1.5] text-balance text-jp-ink-secondary sm:text-[1rem]">
              The work that demands attention now often displaces the planning needed to protect the months ahead.
            </p>
          </div>

          {/* JiTpro's place: alongside the team, doing the upstream work. */}
          <div
            className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-jp-brand-amber/60 px-5 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6"
            style={{ backgroundColor: amberWash(9) }}
          >
            <Handshake aria-hidden="true" strokeWidth={1.6} className="size-10 shrink-0 text-jp-brand-amber sm:size-12" />
            <span aria-hidden="true" className="hidden w-px self-stretch bg-jp-brand-amber/70 sm:block" />
            <div>
              <h4 className="font-heading text-[1.1875rem] font-extrabold leading-[1.2] tracking-[-0.015em] text-jp-background sm:text-[1.375rem]">
                JiTpro joins your team.
              </h4>
              <p className="mt-1.5 text-[0.9375rem] leading-[1.5] text-pretty text-jp-background/85 sm:text-[1rem]">
                Dedicated expertise to execute the upstream planning while the contractor moves the project forward.
              </p>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}

/**
 * The About page (Design System §76): seven sections in the approved order. Sections 1 to 3 are designed and
 * approved (§74, §75, §77); Sections 4 to 7 are placeholders, each its own component, until they are designed.
 */
export default function About() {
  return (
    <div className="min-h-screen bg-jp-background text-jp-text-primary">
      <AboutHero />
      <WhyJiTproExists />
      <WhatWeDoSection />
      <HowWeWorkTogetherSection />
      <OurExperienceSection />
      <WhatWeBelieveSection />
      <OurInvitationSection />
    </div>
  );
}
