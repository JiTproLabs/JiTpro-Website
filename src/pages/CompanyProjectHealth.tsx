import { Link } from 'react-router-dom';

const healthSignals = [
  {
    title: 'Decisions have room to breathe',
    body: 'Owners and design teams can make better decisions when they know what is needed, why it matters, and when the answer is actually required.',
  },
  {
    title: 'The team knows what comes next',
    body: 'Procurement stops being a pile of urgent requests and becomes a clear sequence of choices, approvals, releases, fabrication, and delivery.',
  },
  {
    title: 'Pressure stops landing on one person',
    body: 'JiTpro makes ownership visible early, so project managers, architects, consultants, trade partners, and owners are not forced into last-minute recovery.',
  },
];

const teamOutcomes = [
  'Project managers spend less time chasing and more time leading.',
  'Owners get decision runway instead of surprise deadlines.',
  'Architects and consultants receive questions in a sequence they can support.',
  'Trade partners get the conditions they need before the field depends on them.',
  'Company leaders reduce burnout risk and protect the people they worked hard to hire.',
];

export default function CompanyProjectHealth() {
  return (
    <div className="bg-slate-950 text-slate-100">
      <section className="px-6 py-20 md:py-28 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-500 mb-4">
            Company &amp; Project Health
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 leading-tight">
            A healthy project is a project where the team can breathe.
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-6">
            JiTpro helps construction teams set procurement before the job gets too deep, so decisions, approvals, materials, and trade readiness follow a controlled sequence instead of becoming a daily emergency.
          </p>
          <p className="text-lg text-slate-300 leading-relaxed">
            Think of JiTpro as a health spa for construction: less chaos, less overload, and more room for skilled people to do their best work.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-6">
            Project health starts before the field feels the pain
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">
            Most project stress does not begin in the field. The field reveals it.
          </p>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">
            Stress builds when decisions, approvals, lead times, scope gaps, and release requirements are not identified early enough or sequenced against the work that depends on them.
          </p>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">
            Procurement is the path from decision to delivery. When that path is clear early, the whole project has a healthier rhythm.
          </p>
          <p className="text-lg text-slate-200 leading-relaxed font-semibold">
            The goal is not to push everyone harder. The goal is to remove preventable pressure before it becomes the way the job operates.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-4xl mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
              When procurement is set early, the team can follow the steps
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              A healthy project does not eliminate complexity. It gives complexity a place, an owner, and a deadline before it overwhelms the team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {healthSignals.map((signal) => (
              <div key={signal.title} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xs">
                <h3 className="text-xl font-bold text-slate-100 mb-3">{signal.title}</h3>
                <p className="text-slate-400 leading-relaxed">{signal.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-6">
            Cognitive overload is a project risk
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">
            Construction teams are not burning out because they lack talent. They burn out when the system makes every open loop feel urgent, every answer feel late, and every recovery effort feel personal.
          </p>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">
            JiTpro reduces cognitive overload by making the next required action visible: what must be answered, who owns it, when it is needed, and what downstream work depends on it.
          </p>
          <p className="text-lg text-slate-300 leading-relaxed">
            That visibility protects the whole team, including owners, architects, consultants, trade partners, project managers, superintendents, and company leadership.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Healthier projects create healthier companies
          </h2>
          <p className="text-lg text-slate-200 leading-relaxed mb-8">
            When project teams can work in a controlled rhythm, companies reduce preventable stress, retain better people, and become more attractive to the kind of candidates who want to do excellent work without living in constant reaction.
          </p>
          <ul className="space-y-3 text-lg text-slate-200 leading-relaxed">
            {teamOutcomes.map((outcome) => (
              <li key={outcome} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-amber-400 flex-none" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-100 mb-6">
            The healthiest project is the one that never has to be rescued.
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-8">
            JiTpro gives the team a calmer way to run the path from decision to delivery before the project becomes too deep to control cleanly.
          </p>
          <Link
            to="/contact/contractor"
            className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-base font-semibold text-slate-950 transition-colors hover:bg-amber-400"
          >
            Review my next project
          </Link>
        </div>
      </section>
    </div>
  );
}
