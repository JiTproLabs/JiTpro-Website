import LeadMagnetCTA from '../components/lead-magnet/LeadMagnetCTA';

/**
 * DEV-ONLY QA HARNESS for the lead-magnet capture experience.
 *
 * Sprint 4 builds the components but registers no production placement; the
 * homepage, Learn More and the footer are Sprint 5 and are deliberately
 * untouched. This page is the "single development placement for QA" the plan
 * asks for: somewhere to exercise the §20.2 band, the dialog, the form states,
 * keyboard and focus behaviour, and the responsive passes without putting the
 * offer in front of a visitor.
 *
 * Its route is gated on `import.meta.env.DEV`, which Rollup replaces at build
 * time, so this page and its route are dropped from the production bundle
 * entirely. Not linked from any surface.
 */
export default function LeadMagnetQA() {
  return (
    <div className="bg-jp-background">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-jp-text-muted">
          Development QA harness
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-jp-text-primary">
          Lead magnet capture
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-jp-text-secondary">
          The offer band and its dialog, rendered outside any production surface. Not in the production build.
        </p>
      </div>

      <LeadMagnetCTA placement="home-band" variant="band" />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <p className="mb-3 text-sm font-semibold text-jp-text-secondary">Footer-link variant</p>
        <LeadMagnetCTA placement="footer-link" variant="footer-link" />
      </div>
    </div>
  );
}
