import { METHODOLOGY_STAGES } from '../../content/methodologyStages';
import { PRODUCED_OUTPUTS, SECTION } from '../../content/learnMore';
import DemoScreenFrame from '../demo/DemoScreenFrame';
import { hasDemoScreen } from '../demo/registry';
import { NumberedSection, SectionHeader } from './LearnMoreShell';
import { TONE } from './tone';

const surface = 'light' as const;

/**
 * 05 - What JiTpro produces.
 *
 * NOT A FEATURE GRID (Sections 47.2, 48.2). Each entry leads with the
 * QUESTION the output answers, in the form the reader would ask it, and then
 * answers two more: what am I looking at, and why would I care. A tile with an
 * icon and a noun answers none of them.
 *
 * THE QUESTION-FIRST FORM IS FROM 2026-09-04, replacing a what/exposes/matters
 * triple in which the first two lines were doing similar work. Three lines, one
 * of which is now the reader's own question, is shorter and lands harder.
 *
 * THE NAMES AND THE SCREENS ARE DOCTRINE. Titles come from
 * src/content/methodologyStages.ts and are rendered unchanged; the captures
 * are the existing methodology screens with their existing alt text. That file
 * says its stage copy MUST NOT be renamed, reworded, reordered or trimmed as a
 * side effect of layout work, and this page is bound by that: what is added
 * here is the three-line explanation, never a second name for the same thing.
 *
 * THE SCREENS ARE ONE PROJECT CARRIED FORWARD (Section 46.8.1). Scope items
 * are validated, gaps are found in those items, commitments are raised against
 * those gaps. Reordering the entries or substituting a screen from elsewhere
 * breaks that traceability however real the capture is.
 *
 * PROVENANCE (Section 48.10, product interface captures): the interface is
 * authentic and everything inside it is constructed. ONE quiet provenance line
 * serves the group and sits with the screens it describes (Section 50.6). It
 * MUST NOT be removed, moved into a page footnote, or softened, and this
 * content MUST NEVER be described as a customer project or a case study.
 *
 * EVERY CAPTURED STAGE RENDERS THROUGH DemoScreenFrame, which asks the
 * representative-screen registry whether the stage has a live React screen or
 * still its raster capture, and opens the same expanded view for either. This
 * section does not know which is which.
 *
 * A stage with no capture would render text only. Borrowing a neighbouring
 * stage's screen to fill the space is prohibited (Section 46.8.1).
 */
export default function ProducesSection() {
  const tone = TONE[surface];
  const section = SECTION['05'];

  return (
    <NumberedSection section={section} surface={surface}>
      <SectionHeader
        section={section}
        surface={surface}
        heading="What your team actually ends up holding."
        lede={
          <p>
            JiTpro turns the things your project is depending on into things your team can see and manage. None of these is a report that gets read once. Each is a working record used to decide what to chase this week and what can wait, and each exists because the one before it produced what it needs.
          </p>
        }
      />

      <ol className="mt-14 lg:mt-16">
        {METHODOLOGY_STAGES.map((stage) => {
          const output = PRODUCED_OUTPUTS.find((o) => o.stageId === stage.id);
          if (!output) return null;

          const lines = [
            { label: 'The question it answers', body: output.question },
            { label: 'What it is', body: output.what },
            { label: 'Why it matters', body: output.matters },
          ];

          return (
            <li
              key={stage.id}
              className={`border-t py-10 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-14 lg:py-12 xl:gap-x-20 ${tone.rule}`}
            >
              <div>
                <h3
                  className={`font-heading text-[1.375rem] font-semibold leading-snug text-balance sm:text-[1.5rem] ${tone.heading}`}
                >
                  {stage.title}
                </h3>

                <dl className="mt-6 space-y-5">
                  {lines.map((line) => (
                    <div key={line.label}>
                      <dt className={`font-mono text-[0.6875rem] uppercase tracking-[0.2em] ${tone.muted}`}>
                        {line.label}
                      </dt>
                      <dd className={`mt-2 max-w-[56ch] text-[1rem] leading-[1.65] sm:text-[1.0625rem] ${tone.body}`}>
                        {line.body}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {stage.demo && hasDemoScreen(stage.id) ? (
                /* The stage's screen, live or raster as the registry says, in
                   the same 4:3 frame, never re-cropped (Section 46.8.1), and
                   openable. */
                <div className={`mt-8 overflow-hidden border lg:mt-0 ${tone.rule}`}>
                  <DemoScreenFrame
                    screen={stage.id}
                    label={stage.demo.alt}
                    title={stage.title}
                    file={stage.demo.file}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

    </NumberedSection>
  );
}
