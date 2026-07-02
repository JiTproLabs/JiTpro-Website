import { InteractiveProcurementSchedule } from '../components/InteractiveProcurementSchedule';

// Unlisted page — not linked from anywhere in the site.
// Houses the "Here's what it looks like" interactive procurement schedule that
// previously lived on the homepage. Reachable directly at /procurement-schedule.
export default function ProcurementSchedule() {
  return (
    <section className="min-h-screen bg-slate-950 px-6 py-24 text-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-50 mb-4 leading-snug">
            Here's what it looks like.
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            A real procurement schedule. Hover any segment to see the phase, dates, and duration. Zoom across quarters, months, weeks, or days.
          </p>
        </div>
        <InteractiveProcurementSchedule />
      </div>
    </section>
  );
}
