import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function GeneralContractors() {
  return (
    <div>
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-6">
            For General Contractors
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Get Ahead of the Job Before It Gets Ahead of You
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            You win the job. You start buyout. Then the decisions start piling up — owner selections, approvals, long-lead items — and suddenly you're reacting instead of running the project. JITpro helps you take control of what needs to happen before the job starts moving, so you stay in front of it.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            The gap between winning the job and being ready to build it
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed">
              You know how it goes. You land the project, start mobilizing, and then the reality sets in: the owner hasn't made selections, submittals aren't moving, long-lead items haven't been ordered, and buyout isn't finished. There's a gap between having the contract and actually being ready to build — and that gap is where schedules start slipping.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Most of the time, it's not one big failure. It's a dozen small things that didn't get resolved early enough. A decision that needed to happen in week three gets pushed to week eight. A material with a 16-week lead time doesn't get ordered until there are 10 weeks left. And by the time you see the problem, you're already behind.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              That's the gap JITpro closes.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            How jobs go sideways
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">You find out about a lead time too late</h3>
              <p className="text-slate-600 leading-relaxed">
                That switchgear has a 20-week lead time, but nobody flagged it until week six. Now you're staring at a hole in the schedule and scrambling for options that don't exist.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Approvals sit and nobody follows up</h3>
              <p className="text-slate-600 leading-relaxed">
                You submitted it. The architect is supposed to review it. Weeks go by. By the time it comes back, you've already lost the ordering window — and the delay lands on your schedule.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">The owner hasn't made decisions yet</h3>
              <p className="text-slate-600 leading-relaxed">
                Finishes, fixtures, equipment — the owner needs to choose, but there's no hard deadline tied to the schedule. So the decisions drift until they become emergencies, and you're the one managing the fallout.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">When the schedule slips, the blame comes to you</h3>
              <p className="text-slate-600 leading-relaxed">
                Materials show up late. The schedule shifts. And when the owner asks what happened, you're the one in the hot seat — even when the delay was caused by someone else's decision that never got made.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            How JITpro keeps you in front of the job
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">See the full picture before construction starts</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                JITpro maps out every decision, approval, and long-lead item at the beginning of the project — so you know exactly what needs to happen and when, before the job gets moving. No more finding out about problems when they show up in the field.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real deadlines tied to your schedule</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                JITpro works backward from install dates to set hard deadlines for every decision. Owners and architects see exactly when their approvals are due — and what happens to the schedule if they're late. These aren't reminders. They're deadlines with consequences attached.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Everyone knows who owes what</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Every open item has a name on it and a date next to it. When an approval is pending, the person who owes it knows. When a deadline passes, the record shows it. You stop being the one chasing everyone down.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">A clear record that protects you</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                If a dispute comes up — and on bigger jobs, it will — you have a timestamped record of every decision, every approval, and every delay. You'll know exactly what happened, when, and who was responsible. That's not paperwork. That's protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            What changes on your jobs
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'You stop finding out about problems when they hit the field',
              'You spend less time chasing approvals and more time running the job',
              'Your schedule has fewer surprises because decisions are happening on time',
              'When someone else causes a delay, you have the record to prove it',
              'Your subs have better visibility into material timing, which means fewer coordination headaches',
              'You walk into owner meetings with answers, not apologies',
            ].map((benefit) => (
              <div key={benefit} className="flex gap-3 items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-lg text-slate-600 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            Bigger projects need more structure — JITpro helps you step up
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed">
              Every GC hits a point where the jobs get bigger, the teams get larger, and the stakes get higher. The way you managed a $2M project doesn't scale to a $15M one — and that's not a weakness, it's just reality.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              JITpro gives you the structure to manage larger, more complex projects with confidence. You don't need a project management certification or an enterprise software background. You just need a clear picture of what needs to happen and when — and a system that keeps everyone honest.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              That's what JITpro is. It's backup. It's control. And it grows with you.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Take control before the job takes control of you
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
            If you're between contract and construction — in buyout, in preconstruction, getting ready to break ground — this is the moment that matters most. The decisions you lock down now are the delays you prevent later.
          </p>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 text-lg font-medium hover:bg-slate-100 transition-colors"
          >
            See How JITpro Works
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
