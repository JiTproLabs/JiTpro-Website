import { useEffect } from 'react';
import { Camera } from 'lucide-react';

/**
 * /founder-story: the founder's story (Design System §73, Decision Log 2026-11-18), from the founder-approved mockup
 * in docs/design/assets/founder-story. An editorial story in three chapters, in the first person, around one
 * principle: get the field what it needs, when it needs it.
 *
 *   HERO      a full-width construction photograph under a --jp-background wash from the left; the amber eyebrow,
 *             the italic h1 and the supporting line
 *   CHAPTERS  on white, three two-column chapters (photograph left, chapter label, h2 and narrative right),
 *             divided by hairlines
 *   STATEMENT the featured statement in a light amber panel behind an amber bar
 *   CLOSING   the commitment (h2 and narrative) beside the principle, its words and the founder's name
 *
 * PHOTOGRAPHS (§73.2). Four founder-approved generated photographs, under public/assets/founder/, each encoded to
 * WebP at two widths. They are TEMPORARY: authentic photographs from the founder's career will replace them. To
 * replace one, encode the new photograph to the same two widths and point its `image.base` in PHOTOS at it; set
 * `image` to null to show the marked placeholder instead. The layout does not change either way.
 *
 * AMBER on the white ground is decorative only (§8.8): the chapter rules, the statement's bar and wash, the
 * principle's bar and highlight. Every word on white is in ink. No motion.
 */

const ASSET = import.meta.env.BASE_URL;

/** Per-page title and description; the SPA serves one index.html (FieldGuide and GeneralContractors pattern). */
const TITLE = 'The founder story | JiTpro';
const DESCRIPTION =
  'Jeff Kaufman spent nearly 40 years in construction, first in the field and then in project management. This is the story behind JiTpro, and the commitment that drives it: get the field what it needs, when it needs it.';

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const existing = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = existing?.content ?? null;
    const meta = existing ?? document.createElement('meta');
    if (!existing) {
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;

    return () => {
      document.title = previousTitle;
      if (previousDescription === null) meta.remove();
      else meta.content = previousDescription;
    };
  }, [title, description]);
}

/**
 * One photograph: `base` is the path under public/ without its width suffix; the files are `${base}-${w}.webp` for
 * each of `widths` (small, large); `width` and `height` are the large file's pixels.
 */
type PhotoImage = { base: string; widths: readonly [number, number]; width: number; height: number };

/** `image` is null to show the marked placeholder; `subject` is what the placeholder says belongs there. */
type Photo = { image: PhotoImage | null; alt: string; subject: string };

const FOUNDER = 'assets/founder';

/** The page's four photographs (temporary; see PHOTOGRAPHS above). The hero is decorative, so its `alt` is empty. */
const PHOTOS: Record<'hero' | 'field' | 'commitment' | 'founded', Photo> = {
  hero: {
    image: { base: `${FOUNDER}/founder-hero-timber-frame-sunset`, widths: [960, 1672], width: 1672, height: 941 },
    alt: '',
    subject: 'Timber framing at sunset',
  },
  field: {
    image: { base: `${FOUNDER}/founder-chapter-01-carpenter`, widths: [800, 1448], width: 1448, height: 1086 },
    alt: 'A carpenter in hearing protection and safety glasses cutting lumber with a circular saw inside a timber-framed house',
    subject: 'A carpenter actively working on a construction site',
  },
  commitment: {
    image: { base: `${FOUNDER}/founder-chapter-02-blueprint-review`, widths: [800, 1448], width: 1448, height: 1086 },
    alt: 'A project manager in a safety vest and a superintendent reviewing a set of drawings together on a construction site',
    subject: 'A project manager and superintendent coordinating construction documents in the field',
  },
  founded: {
    image: { base: `${FOUNDER}/founder-chapter-03-timber-residence`, widths: [800, 1448], width: 1448, height: 1086 },
    alt: 'A large custom timber-framed residence under construction, with stacked lumber in the foreground',
    subject: 'A high-quality custom residential construction project',
  },
};

/** The `src` and `srcSet` of a photograph. */
function sources({ base, widths }: PhotoImage) {
  return {
    src: `${ASSET}${base}-${widths[1]}.webp`,
    srcSet: widths.map((w) => `${ASSET}${base}-${w}.webp ${w}w`).join(', '),
  };
}

/** A fine grid, as on a drawing sheet, for the light placeholders. */
const SHEET_GRID = {
  backgroundImage:
    'linear-gradient(color-mix(in oklab, var(--jp-ink-secondary) 9%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--jp-ink-secondary) 9%, transparent) 1px, transparent 1px)',
  backgroundSize: '28px 28px',
  backgroundColor: 'var(--jp-surface-light)',
};

/** A chapter's photograph, or its placeholder: one frame, one proportion, so a photograph drops in unchanged. */
function ChapterPhoto({ photo }: { photo: Photo }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-jp-ink-secondary/15 shadow-[0_14px_34px_-22px_color-mix(in_oklab,var(--jp-background)_45%,transparent)]">
      {photo.image ? (
        <img
          {...sources(photo.image)}
          sizes="(min-width: 1152px) 440px, (min-width: 1024px) 38vw, calc(100vw - 4rem)"
          width={photo.image.width}
          height={photo.image.height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className="size-full object-cover object-center"
        />
      ) : (
        <div aria-hidden="true" className="flex size-full flex-col items-center justify-center gap-3 px-8 text-center" style={SHEET_GRID}>
          <Camera strokeWidth={1.5} className="size-9 text-jp-ink-secondary/70" />
          <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-jp-ink-secondary">Photograph to come</p>
          <p className="max-w-[18rem] text-sm leading-[1.45] text-jp-ink-secondary">{photo.subject}</p>
        </div>
      )}
    </div>
  );
}

/** The hero's placeholder: timber studs against a low sunset glow, all from tokens, until the photograph is supplied. */
const HERO_PLACEHOLDER = {
  backgroundImage: [
    'radial-gradient(ellipse 55% 70% at 72% 78%, color-mix(in oklab, var(--jp-brand-amber) 38%, transparent) 0%, transparent 70%)',
    'repeating-linear-gradient(90deg, transparent 0 46px, color-mix(in oklab, var(--jp-text-primary) 9%, transparent) 46px 52px)',
    'linear-gradient(180deg, var(--jp-surface) 0%, color-mix(in oklab, var(--jp-surface) 70%, var(--jp-brand-amber)) 100%)',
  ].join(', '),
};

/** The wash from the left that keeps the hero's copy on navy, easing out across the photograph. */
const HERO_WASH = {
  backgroundImage:
    'linear-gradient(90deg, var(--jp-background) 0%, color-mix(in oklab, var(--jp-background) 94%, transparent) 34%, color-mix(in oklab, var(--jp-background) 55%, transparent) 52%, transparent 78%)',
};

/** A narrative paragraph: plain, or set in bold where the founder's copy emphasises it. */
type Paragraph = string | { strong: string };

const CHAPTERS: ReadonlyArray<{ id: string; number: string; title: string; photo: Photo; body: ReadonlyArray<Paragraph> }> = [
  {
    id: 'chapter-field',
    number: '01',
    title: 'I started in the field.',
    photo: PHOTOS.field,
    body: [
      'I spent the first half of my construction career in the field, as a carpenter, superintendent, and general contractor. I built projects, led crews, solved problems, and did whatever it took to get the work done.',
      'And I saw, firsthand, what happens when materials and products arrive late, wrong, or both.',
      "Crews ready to work with nothing to work with. Carefully planned activities disrupted because something that should have been taken care of weeks or months earlier hadn't been done.",
      'I saw the scrambling, the resequencing, the wasted labor, and the frustration.',
      'And I saw who carried the burden.',
      'The people in the field.',
      "I knew what that felt like because I'd been one of them.",
    ],
  },
  {
    id: 'chapter-commitment',
    number: '02',
    title: 'I made a commitment.',
    photo: PHOTOS.commitment,
    body: [
      'When I stepped into project management, I made a commitment to myself.',
      { strong: 'I was going to get the field what it needed, when it needed it.' },
      'That became one of my highest priorities.',
      "I didn't care whether the work fell neatly within a project manager's job description. If something needed to be done to keep the field moving, I did my best to get it done.",
      "And that didn't always mean sitting behind a desk, managing paperwork, or making phone calls.",
      'Sometimes it meant grabbing my tools and heading out to the jobsite to work through the layout of a complicated door system. Other times it meant figuring out how to template complex shapes or working directly alongside the trades to resolve something that wasn\'t coming together.',
      "I wasn't afraid to get my hands dirty. I'd spent half my career in the field, and moving into management hadn't changed the way I thought about the work.",
      "That approach didn't always sit well with my peers. More than once, I was told I was doing work that someone else should have been doing.",
      'My response was simple.',
      { strong: 'If there was a gap between what the field needed and what management was providing, I was going to do whatever I could to close it.' },
      'I never believed the office and the field should operate as separate worlds, each protecting its own responsibilities while problems fell through the cracks.',
      "The work happening upstream was supposed to support the people working downstream. If that connection broke, I wasn't going to stand around arguing about whose job it was to fix it.",
      "I wasn't interested in passing problems down the line and leaving someone else to deal with the consequences.",
      'I wanted the people depending on me to have what they needed to succeed.',
      'And I was willing to make personal sacrifices to make that happen.',
      { strong: "Because I hadn't forgotten what it was like to be on the other end." },
    ],
  },
  {
    id: 'chapter-founded',
    number: '03',
    title: 'I founded JiTpro to make that commitment scalable.',
    photo: PHOTOS.founded,
    body: [
      'The construction industry has no shortage of talented, hardworking people.',
      "I've worked alongside extraordinary craftsmen, superintendents, project managers, architects, engineers, and trade partners.",
      'Yet even the best teams find themselves fighting the same fires, project after project.',
      'Not necessarily because they lack experience or commitment.',
      'But because the information, decisions, approvals, and procurement activities that support the field are often not brought under control early enough.',
      'The greatest opportunity to protect your schedule comes long before work reaches the field.',
      'I founded JiTpro because I believe there is a better way.',
      'JiTpro gives general contractors a practical, repeatable way to establish exactly what needs to happen, who is responsible, and when it must be done, bringing clarity, control, and accountability to the work that keeps construction moving as planned.',
      'Not by asking already overwhelmed teams to work harder.',
      'But by helping them work on the right things, at the right time.',
    ],
  },
];

/** The light amber wash of the statement panel and the principle's highlight. */
const amberWash = (percent: number) => `color-mix(in oklab, var(--jp-brand-amber) ${percent}%, var(--jp-surface-white))`;

export default function FounderStory() {
  usePageMeta(TITLE, DESCRIPTION);

  return (
    <div className="bg-jp-surface-white">
      {/* ------------------------------------------------------------ hero */}
      <section aria-labelledby="founder-hero" className="relative isolate overflow-hidden bg-jp-background">
        {/* The photograph (or its placeholder) across the hero; from `lg` the copy sits on the wash at its left. */}
        <div aria-hidden="true" className="absolute inset-0 -z-20">
          {PHOTOS.hero.image ? (
            <img
              {...sources(PHOTOS.hero.image)}
              sizes="100vw"
              width={PHOTOS.hero.image.width}
              height={PHOTOS.hero.image.height}
              alt={PHOTOS.hero.alt}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="size-full object-cover object-[78%_30%] lg:object-[right_22%]"
            />
          ) : (
            <div className="size-full" style={HERO_PLACEHOLDER} />
          )}
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 hidden lg:block" style={HERO_WASH} />
        {/* Below `lg` the copy spans the hero, so the wash covers it evenly. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-jp-background/80 lg:hidden" />
        {!PHOTOS.hero.image && (
          <p aria-hidden="true" className="absolute right-6 bottom-4 font-mono text-[0.625rem] font-bold uppercase tracking-[0.16em] text-jp-text-primary/55 sm:right-8 lg:right-10">
            Photograph to come: {PHOTOS.hero.subject}
          </p>
        )}

        <div className="mx-auto flex max-w-7xl items-center px-6 py-16 sm:px-8 sm:py-20 lg:min-h-[min(30rem,42vw)] lg:px-10">
          <div className="max-w-[40rem]">
            {/* Authored in sentence case, uppercased in CSS. Amber on the navy. */}
            <p className="flex items-center gap-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]">
              The founder story
              <span aria-hidden="true" className="block h-0.5 w-12 shrink-0 bg-jp-brand-amber/80 sm:w-16" />
            </p>
            <h1
              id="founder-hero"
              className="mt-5 font-heading text-[min(2.625rem,10.5vw)] font-extrabold italic leading-[1.08] tracking-[-0.02em] text-balance text-jp-text-primary sm:text-[3.25rem] lg:text-[clamp(3rem,4.4vw,4rem)]"
            >
              Get the field what it needs, when it needs it.
            </h1>
            <p className="mt-6 text-[1.125rem] leading-[1.55] text-pretty text-jp-text-primary/90 sm:text-[1.25rem]">
              The story behind JiTpro, and the commitment that drives it.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ chapters */}
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        {CHAPTERS.map(({ id, number, title, photo, body }, i) => (
          <article
            key={id}
            aria-labelledby={id}
            className={`grid gap-y-8 py-14 sm:py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-[clamp(2.5rem,4.5vw,4.5rem)] lg:py-[clamp(4rem,6vw,5.5rem)] ${
              i > 0 ? 'border-t border-jp-ink-secondary/20' : ''
            }`}
          >
            {/* From `lg` the photograph stays in view beside the longer narrative. */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <ChapterPhoto photo={photo} />
            </div>

            <div>
              {/* Slate on white (§8.8), the rule amber. */}
              <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-ink-secondary sm:text-sm sm:tracking-[0.18em]">
                <span aria-hidden="true" className="block h-[3px] w-10 shrink-0 bg-jp-brand-amber" />
                Chapter {number}
              </p>
              <h2
                id={id}
                className="mt-4 font-heading text-[min(2rem,8.4vw)] font-extrabold leading-[1.12] tracking-[-0.025em] text-balance text-jp-background sm:text-[2.375rem] lg:text-[clamp(2.125rem,3vw,2.625rem)]"
              >
                {title}
              </h2>
              <div className="mt-6 space-y-4 text-[1.0625rem] leading-[1.65] text-pretty text-jp-background/85 lg:text-[1.125rem]">
                {body.map((paragraph) =>
                  typeof paragraph === 'string' ? (
                    <p key={paragraph}>{paragraph}</p>
                  ) : (
                    <p key={paragraph.strong}>
                      <strong className="font-semibold text-jp-background">{paragraph.strong}</strong>
                    </p>
                  ),
                )}
              </div>
            </div>
          </article>
        ))}

        {/* ------------------------------------------------------------ featured statement */}
        <figure className="relative rounded-2xl py-9 pr-7 pl-12 sm:py-12 sm:pr-12 sm:pl-16 lg:py-14 lg:pr-16 lg:pl-20" style={{ backgroundColor: amberWash(12) }}>
          <span aria-hidden="true" className="absolute top-9 bottom-9 left-6 w-1.5 rounded-full bg-jp-brand-amber sm:top-12 sm:bottom-12 sm:left-8 lg:top-14 lg:bottom-14 lg:left-10" />
          <blockquote>
            <p className="font-heading text-[1.375rem] font-bold leading-[1.32] tracking-[-0.015em] text-pretty text-jp-background sm:text-[1.75rem] lg:text-[clamp(1.75rem,2.4vw,2.125rem)]">
              For years, I compensated for weaknesses in construction management systems through personal effort and sacrifice.
              JiTpro is my attempt to build a better system so that extraordinary personal sacrifice is no longer required just to
              keep a project moving.
            </p>
          </blockquote>
        </figure>

        {/* ------------------------------------------------------------ closing */}
        <section
          aria-labelledby="founder-commitment"
          className="grid gap-y-12 pt-16 pb-20 sm:pt-20 sm:pb-24 lg:grid-cols-[minmax(0,1.3fr)_1px_minmax(0,1fr)] lg:gap-x-[clamp(2.5rem,4.5vw,4.5rem)] lg:pt-[clamp(4.5rem,6vw,5.5rem)] lg:pb-[clamp(5rem,7vw,6.5rem)]"
        >
          <div>
            {/* Title case as approved (§73.2). */}
            <h2
              id="founder-commitment"
              className="font-heading text-[min(2rem,8.4vw)] font-extrabold leading-[1.12] tracking-[-0.025em] text-balance text-jp-background sm:text-[2.375rem] lg:text-[clamp(2.125rem,3vw,2.625rem)]"
            >
              My Commitment Hasn&apos;t Changed.
            </h2>
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-[1.65] text-pretty text-jp-background/85 lg:text-[1.125rem]">
              <p>
                Nearly four decades after I first stepped onto a construction site, I still believe the people building our projects
                deserve better.
              </p>
              <p>
                They deserve accurate information. They deserve the right materials. They deserve timely decisions. They deserve to
                start their work knowing the project is ready for them.
              </p>
              <p>And the owners who trust us with their projects deserve teams that can deliver on their promises.</p>
              <p>That&apos;s what I believed when I made the transition from the field into management.</p>
              <p>It&apos;s what I believe today.</p>
            </div>
          </div>

          <span aria-hidden="true" className="hidden bg-jp-ink-secondary/20 lg:block" />

          <div className="lg:self-center">
            {/* The principle: ink on an amber highlight, behind an amber bar. */}
            <div className="relative pl-6 sm:pl-7">
              <span aria-hidden="true" className="absolute top-1 bottom-1 left-0 w-1.5 rounded-full bg-jp-brand-amber" />
              <p className="font-heading text-[1.75rem] font-extrabold italic leading-[1.25] tracking-[-0.02em] text-balance text-jp-background sm:text-[2.125rem] lg:text-[clamp(1.875rem,2.6vw,2.375rem)]">
                <span
                  className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
                  style={{ backgroundImage: `linear-gradient(transparent 58%, ${amberWash(38)} 58%, ${amberWash(38)} 92%, transparent 92%)` }}
                >
                  Get the field what it needs, when it needs it.
                </span>
              </p>
            </div>
            <div className="mt-6 space-y-1 text-[1.0625rem] leading-[1.6] text-pretty text-jp-background/85 lg:text-[1.125rem]">
              <p>That&apos;s not just the idea behind JiTpro.</p>
              <p>It&apos;s the commitment I&apos;ve spent my career trying to fulfill.</p>
            </div>

            {/* The founder's name, typographic (no signature asset exists). */}
            <p className="mt-9 border-t border-jp-ink-secondary/20 pt-6">
              <span className="block font-heading text-[1.25rem] font-bold tracking-[-0.01em] text-jp-background">Jeff Kaufman</span>
              <span className="mt-0.5 block text-[0.9375rem] text-jp-ink-secondary">Founder, JiTpro</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
