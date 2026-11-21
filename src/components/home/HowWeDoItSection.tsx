import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * The *How we do it* band (Design System Section 54.1; Decision Log
 * 2026-11-09, restoring the intro panel of 2026-11-06 / heading 2026-11-07;
 * redesigned 2026-11-17 to the founder-approved Formula 1 reference
 * docs/design/assets/homepage-how-we-do-it/
 * precision-planning-peak-performance-reference.png, issue #84).
 *
 * The Formula 1 car is a metaphor for disciplined preparation, precision and
 * coordination, not for speed: it stands still, front on, in a dark studio.
 * It is a founder-approved, section-scoped exception to Sections 17.1 and
 * 48.8 (Decision Log 2026-11-17), aria-hidden with empty alt text.
 *
 * COMPOSITION
 *
 *   From `xl`: one cinematic band on --jp-background. The car photograph
 *   (its own studio, black and graphite with amber light and a glossy floor)
 *   fills the band, anchored right so the car is the dominant element; its
 *   empty left side fades into the section's navy, so the type sits on the
 *   same dark ground with no seam and no card. LEFT, vertically centred: the
 *   amber eyebrow, the h2 at a display register with "performance." in Brand
 *   Amber, the engagement's introduction label, supporting headline, two
 *   paragraphs and amber closing statement (issue #92), the short amber rule,
 *   then the band's existing closing link to /product (§54.1), kept.
 *
 *   Below `xl`: the type first, then the photograph as a full-bleed band
 *   cropped to the car (never through it), fading into the navy at its top
 *   and foot.
 *
 * AMBER (§48.7, with the 2026-11-17 and 2026-11-21 scoped exceptions): the
 * eyebrow, "performance.", the closing statement, the short rule and the
 * closing link. No motion (§46).
 */

const CAR = `${import.meta.env.BASE_URL}assets/home/how-we-do-it-f1-car`;

/** --jp-background at a given strength. */
const scrim = (percent: number) => `color-mix(in oklab, var(--jp-background) ${percent}%, transparent)`;

/** From `xl`: the studio's empty left side fades into the section's navy
 *  behind the type; a soft fade at the top and foot joins the neighbouring
 *  sections. The car itself is not darkened. */
const DESKTOP_FADES = {
  backgroundImage: [
    `linear-gradient(90deg, var(--jp-background) 0%, var(--jp-background) 22%, ${scrim(70)} 34%, transparent 46%)`,
    `linear-gradient(180deg, var(--jp-background) 0%, transparent 12%, transparent 88%, var(--jp-background) 100%)`,
  ].join(', '),
};

/** Below `xl`: the band fades into the navy at its top and foot. */
const BAND_FADES = {
  backgroundImage: `linear-gradient(180deg, var(--jp-background) 0%, transparent 18%, transparent 80%, var(--jp-background) 100%)`,
};

export default function HowWeDoItSection() {
  return (
    <section className="relative isolate overflow-hidden bg-jp-background xl:flex xl:min-h-[40vw] xl:items-center">
      {/* The car, from `xl` the band's backdrop: drawn at its own proportions (as tall as 40vw at full width) and
          centred vertically, so a taller band (issue #92) never scales the car up behind the type; its fades
          hand its top and foot to the navy. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 hidden aspect-[1981/793] -translate-y-1/2 xl:block">
        <img
          src={`${CAR}-1981.webp`}
          srcSet={`${CAR}-1200.webp 1200w, ${CAR}-1981.webp 1981w`}
          sizes="100vw"
          width={1981}
          height={793}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        <div className="absolute inset-0" style={DESKTOP_FADES} />
      </div>

      <div className="relative w-full px-6 pt-16 sm:px-8 sm:pt-20 xl:pr-0 xl:pl-[max(2.5rem,6.7vw)] xl:py-[clamp(2.5rem,4.5vw,6rem)]">
        <div className="mx-auto max-w-7xl xl:mx-0 xl:max-w-none">
          <div className="max-w-[36rem] xl:max-w-[44vw]">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-jp-brand-amber sm:text-sm sm:tracking-[0.26em]">
              How we do it
            </p>
            <h2 className="mt-5 font-heading text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-jp-text-primary sm:mt-6 sm:text-[3.5rem] xl:mt-[clamp(1rem,1.4vw,1.75rem)] xl:text-[clamp(2.75rem,4.1vw,5.25rem)]">
              <span className="sm:block">Precision planning</span>{' '}
              <span className="sm:block">
                for peak <span className="text-jp-brand-amber">performance.</span>
              </span>
            </h2>
            {/* The engagement (issue #92, §54.1): the introduction label in the eyebrow's mono register but in
                secondary ink, so the band's amber stays at four elements (§48.7); authored in sentence case,
                uppercased in CSS (§7.7). Then the supporting headline, two paragraphs and the amber closing statement. */}
            <p className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.2em] text-jp-text-secondary sm:mt-10 sm:text-sm xl:mt-[clamp(1.5rem,2.2vw,2.75rem)] xl:text-[clamp(0.8125rem,0.85vw,1rem)]">
              Introducing the JiTpro Project Readiness Engagement
            </p>
            <h3 className="mt-3 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.015em] text-jp-text-primary sm:text-[1.75rem] xl:mt-[clamp(0.5rem,0.7vw,0.875rem)] xl:text-[clamp(1.375rem,1.75vw,2.125rem)]">
              Your project. Your team. JiTpro&apos;s Playbook.
            </h3>
            <div className="mt-5 space-y-4 text-[1.125rem] leading-[1.55] text-jp-text-primary/90 sm:mt-6 sm:space-y-5 sm:text-[1.25rem] xl:mt-[clamp(0.875rem,1.2vw,1.5rem)] xl:space-y-[clamp(0.75rem,1.1vw,1.25rem)] xl:text-[clamp(1.0625rem,1.25vw,1.5rem)]">
              <p className="max-w-[44ch] xl:max-w-[34vw]">
                Our experienced construction professionals work alongside your team to develop a customized Procurement
                Playbook, identifying exactly what&apos;s needed, who&apos;s responsible, and when each action must happen
                to support the construction schedule.
              </p>
              <p className="max-w-[44ch] xl:max-w-[34vw]">
                We examine your drawings, specifications, and schedule to coordinate the decisions, approvals,
                commitments, and procurement activities required to keep the field moving.
              </p>
              {/* The closing statement, in Brand Amber at the founder's direction so it stands apart from the body
                  copy (§54.1; a scoped exception to §48.7 for this band). */}
              <p className="max-w-[44ch] font-heading font-semibold text-jp-brand-amber xl:max-w-[34vw]">
                No new software. No additional staff. Just precision, clarity, and accountability.
              </p>
            </div>
            <span aria-hidden="true" className="mt-8 block h-1 w-16 rounded-full bg-jp-brand-amber sm:mt-10 sm:w-20 xl:mt-[clamp(1.5rem,2vw,2.5rem)] xl:w-[clamp(4.5rem,5vw,6.5rem)]" />

            {/* The band's existing closing link (§54.1), kept. One link, text
                and arrow together; the 12px padding makes the 44px target. */}
            <p className="mt-5 sm:mt-6 xl:mt-[clamp(0.5rem,0.8vw,1rem)]">
              <Link
                to="/product"
                className="group inline-block rounded py-3 font-heading text-base font-semibold leading-[1.4] text-jp-brand-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-text-primary sm:text-[1.0625rem]"
              >
                One project at a time. Your team. Our{' '}
                <span className="whitespace-nowrap">
                  expertise.
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="ml-2 inline-block align-[-0.2em] transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  />
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Below `xl`: the car as a full-bleed band after the type, cropped to
          the car. */}
      <div aria-hidden="true" className="pointer-events-none relative mt-6 xl:hidden">
        <img
          src={`${CAR}-1981.webp`}
          srcSet={`${CAR}-1200.webp 1200w, ${CAR}-1981.webp 1981w`}
          sizes="(min-width: 640px) 145vw, 190vw"
          width={1981}
          height={793}
          alt=""
          loading="lazy"
          decoding="async"
          className="block aspect-[4/3] w-full object-cover object-[94%_50%] sm:aspect-[16/9] sm:object-[88%_50%]"
        />
        <div className="absolute inset-0" style={BAND_FADES} />
      </div>
    </section>
  );
}
