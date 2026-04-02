import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import JiTproWordmark, { brandText } from '../components/JiTproWordmark';

const roles = [
  {
    to: '/roles/general-contractors',
    title: 'General Contractors',
    description:
      'You carry the schedule and the risk. JITpro gives you early control over the procurement decisions that protect your project — and defensible records when delays are not your fault.',
  },
  {
    to: '/roles/architects-engineers',
    title: 'Architects & Engineers',
    description:
      'Your reviews and approvals drive procurement timing. JITpro shows you which submittals are schedule-critical so you can prioritize what matters and protect your review record.',
  },
  {
    to: '/roles/subcontractors',
    title: 'Subcontractors',
    description:
      'You feel the impact of late decisions first. JITpro gives you visibility into submittal status, upstream delays, and documentation to support your position when others cause the problem.',
  },
  {
    to: '/roles/owners-developers',
    title: 'Owners & Developers',
    description:
      'Your selections and approvals drive procurement. JITpro shows you which decisions are schedule-critical, when they are due, and what happens to the schedule if they are late.',
  },
  {
    to: '/roles/project-managers',
    title: 'Project Managers & Construction Managers',
    description:
      'You coordinate everything. JITpro gives you a single view of all procurement, automated follow-ups, and ready-made documentation — so you spend less time tracking and more time managing.',
  },
];

export default function Roles() {
  return (
    <div>
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Built for your role
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
{brandText('Every stakeholder on a construction project has a different relationship with procurement. JITpro gives each role the visibility, accountability, and documentation they need to protect the schedule and their position.')}
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {roles.map((role) => (
            <Link
              key={role.to}
              to={role.to}
              className="block border border-slate-200 rounded-xl p-8 bg-white hover:border-slate-400 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                    {role.title}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {brandText(role.description)}
                  </p>
                </div>
                <ArrowRight className="text-slate-400 group-hover:text-amber-600 transition-colors flex-shrink-0 mt-1" size={24} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Procurement affects everyone on the project
          </h2>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            When procurement decisions are visible early and accountability is clear, every stakeholder benefits. Fewer surprises, fewer disputes, and better schedule outcomes.
          </p>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors"
          >
            See how <JiTproWordmark variant="amber" /> works
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
