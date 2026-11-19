/**
 * Preserved JiTpro Architects & Engineers section. Removed from the active
 * page because its messaging overlapped with the preceding section. Retained
 * for potential future use.
 *
 * ARCHIVED (2026-11-18, Decision Log; Design System §63). This file lives in
 * docs/design/assets/archive/architects/when-complexity-turns-into-chaos/,
 * outside src/, so it is not part of the application. Beside it:
 *   production/  the five served illustrations, formerly
 *                public/assets/roles/architect-consequences-*.webp
 *   reference/   the approved mockup and clean artwork, formerly
 *                docs/design/assets/architect-consequences/
 * To reuse it: copy this file back under src/ (it was
 * src/components/sections/WhenComplexityTurnsIntoChaos.tsx), copy production/
 * back to public/assets/roles/, import the default export, and write §63 in
 * the Design System first: it was never written, because the section was
 * removed before review (§49).
 */

/* ------------------------------------------------- 2 the consequences */

/*
 * Section 2 (Design System §63, Decision Log 2026-11-17), from the
 * founder-approved mockup and clean artwork in
 * docs/design/assets/architect-consequences.
 *
 *   HEAD   amber rule and eyebrow, the title-case h2, the introduction;
 *          the building's linework at the section's upper right
 *   GRID   four numbered panels, two by two from `lg`: an amber numeral and
 *          rule, the title, the paragraph, and the panel's illustration at
 *          its right (beside the numeral on phones)
 *
 * IMAGERY. The five illustrations are extracted from the clean artwork with
 * their dark ground subtracted to black, and screen-blended onto the navy,
 * so they carry no frame or edge of their own. Panels, borders, glows and
 * every word are CSS and HTML. All imagery is aria-hidden.
 *
 * AMBER (§63.2): the eyebrow and its rule, each numeral and its rule, the
 * panel borders' lower-left glow, and the illustrations' own accents.
 */

const CONSEQUENCE_ASSETS = `${import.meta.env.BASE_URL}assets/roles/architect-consequences`;

/** The mockup's navy: between --jp-background and --jp-surface. */
const CONSEQUENCE_GROUND = { backgroundColor: 'color-mix(in oklab, var(--jp-background) 55%, var(--jp-surface))' };

/** A panel's 1px border: neutral, warming to amber at its lower left. */
const PANEL_BORDER = {
  backgroundImage: [
    'linear-gradient(to top right, var(--jp-brand-amber) 0%, color-mix(in oklab, var(--jp-brand-amber) 45%, transparent) 14%, color-mix(in oklab, var(--jp-border) 28%, transparent) 38%, color-mix(in oklab, var(--jp-border) 38%, transparent) 100%)',
  ].join(', '),
};

/** A panel's face: the surface, lit faintly from the top and warmed at its lower left. */
const PANEL_FACE = {
  backgroundImage: [
    'radial-gradient(70% 60% at 0% 100%, color-mix(in oklab, var(--jp-brand-amber) 12%, transparent) 0%, transparent 70%)',
    'linear-gradient(160deg, color-mix(in oklab, var(--jp-surface) 85%, var(--jp-border)) 0%, color-mix(in oklab, var(--jp-surface) 70%, var(--jp-background)) 60%)',
  ].join(', '),
};

const CONSEQUENCES = [
  {
    title: 'Everything Becomes Urgent',
    text: 'RFIs, submittals, design clarifications, and owner decisions arrive with little warning. Without clear priorities and realistic deadlines, your team struggles to distinguish what truly needs attention today from what could have been addressed weeks earlier.',
    art: 'documents',
  },
  {
    title: "Your Schedule Becomes Someone Else's Recovery Plan",
    text: 'As the project falls behind, the pressure shifts to architects and engineers to respond faster, review faster, and make up for time already lost. Your other projects and commitments suffer as a result.',
    art: 'calendar',
  },
  {
    title: 'Unresolved Decisions Become Field Emergencies',
    text: "Missing selections, incomplete details, and unresolved coordination don't disappear when construction begins. They follow the project downstream until someone in the field needs an immediate answer.",
    art: 'hardhat',
  },
  {
    title: 'Relationships Begin to Fracture',
    text: 'As deadlines slip, frustration grows. Owners want answers. Contractors need solutions. Design teams feel pressured. Instead of working together, everyone becomes focused on protecting their own position.',
    art: 'people',
  },
] as const;

export default function WhenComplexityTurnsIntoChaos() {
  return (
    <section aria-labelledby="ae-consequences" className="relative isolate overflow-hidden" style={CONSEQUENCE_GROUND}>
      {/* The building's linework, upper right, screen-blended onto the navy. */}
      <img
        src={`${CONSEQUENCE_ASSETS}-building.webp`}
        width={792}
        height={278}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-0 right-0 -z-10 w-[min(100%,36rem)] opacity-60 mix-blend-screen sm:w-[min(80%,40rem)] lg:w-[min(47.5vw,49.5rem)] lg:opacity-100"
      />

      <div className="mx-auto max-w-[1672px] px-6 pt-16 pb-16 sm:px-8 sm:pt-20 sm:pb-20 lg:px-[min(5.25vw,88px)] lg:pt-[clamp(3.5rem,4.2vw,4.5rem)] lg:pb-[clamp(4rem,4.8vw,5rem)]">
        {/* Authored in sentence case, uppercased in CSS. */}
        <p className="flex items-center gap-5 text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-jp-brand-amber sm:text-[0.9375rem] lg:text-[clamp(0.9375rem,1.05vw,1.0625rem)]">
          <span aria-hidden="true" className="block h-0.5 w-10 shrink-0 bg-jp-brand-amber lg:w-12" />
          The consequences
        </p>

        {/* Title case, as approved (§63.2). */}
        <h2
          id="ae-consequences"
          className="mt-5 font-heading text-[min(2.5rem,10.5vw)] font-bold leading-[1.06] tracking-[-0.025em] text-balance text-jp-text-primary sm:text-[3rem] lg:mt-[clamp(1rem,1.3vw,1.375rem)] lg:text-[clamp(3rem,3.7vw,3.875rem)]"
        >
          When Complexity Turns Into Chaos.
        </h2>

        <p className="mt-5 max-w-[44em] text-[1.0625rem] leading-[1.5] text-pretty text-jp-text-secondary sm:text-[1.1875rem] lg:mt-[clamp(1rem,1.3vw,1.375rem)] lg:text-[clamp(1.0625rem,1.26vw,1.3125rem)]">
          Unresolved requirements don&apos;t disappear as construction moves forward. They become more urgent, more disruptive, and more
          expensive to address.
        </p>

        <ol className="mt-12 grid gap-5 sm:mt-14 lg:-mx-[min(2.2vw,36px)] lg:mt-[clamp(2.75rem,3.4vw,3.5rem)] lg:grid-cols-2 lg:gap-x-[clamp(1.25rem,1.75vw,1.875rem)] lg:gap-y-[clamp(1.25rem,1.5vw,1.625rem)]">
          {CONSEQUENCES.map(({ title, text, art }, i) => (
            <li key={title} className="rounded-2xl p-px" style={PANEL_BORDER}>
              <div
                className="relative isolate grid h-full content-start grid-cols-[minmax(0,1fr)_auto] gap-x-6 rounded-[calc(1rem-1px)] px-6 pt-6 pb-7 sm:grid-cols-[minmax(0,1fr)_clamp(9rem,22vw,11rem)] sm:px-9 sm:pt-8 sm:pb-9 lg:grid-cols-[minmax(0,1fr)_clamp(8.5rem,11.5vw,12rem)] lg:gap-x-[clamp(1rem,1.6vw,1.75rem)] lg:px-[clamp(1.75rem,2.5vw,2.625rem)] lg:pt-[clamp(1.5rem,2vw,2.125rem)] lg:pb-[clamp(1.75rem,2.4vw,2.5rem)]"
                style={PANEL_FACE}
              >
                <p className="col-start-1 row-start-1 flex items-center gap-4 self-center font-heading text-[1.0625rem] font-bold text-jp-brand-amber lg:text-[clamp(1.0625rem,1.2vw,1.25rem)]">
                  {String(i + 1).padStart(2, '0')}
                  <span aria-hidden="true" className="block h-0.5 w-14 bg-jp-brand-amber lg:w-[clamp(3.5rem,4.5vw,4.75rem)]" />
                </p>
                <img
                  src={`${CONSEQUENCE_ASSETS}-${art}.webp`}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="col-start-2 row-start-1 h-24 w-auto justify-self-end mix-blend-screen sm:row-span-3 sm:h-auto sm:w-full sm:self-center"
                />
                <h3 className="col-span-2 row-start-2 mt-4 font-heading text-[1.5rem] font-bold leading-[1.15] tracking-[-0.02em] text-balance text-jp-text-primary sm:col-span-1 sm:mt-4 sm:text-[1.75rem] lg:mt-[clamp(0.75rem,1vw,1.125rem)] lg:text-[clamp(1.5rem,1.95vw,2.0625rem)]">
                  {title}
                </h3>
                <p className="col-span-2 row-start-3 mt-4 text-[1rem] leading-[1.5] text-pretty text-jp-text-secondary sm:col-span-1 sm:text-[1.0625rem] lg:mt-[clamp(0.875rem,1.2vw,1.25rem)] lg:text-[clamp(0.9375rem,1.08vw,1.125rem)]">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
