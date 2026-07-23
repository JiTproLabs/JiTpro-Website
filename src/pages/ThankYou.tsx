import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

// TODO: Replace with actual Microsoft Bookings URL
const SCHEDULER_URL = 'https://outlook.office365.com/book/PLACEHOLDER';

export default function ThankYou() {
  const location = useLocation();
  const state = location.state as { scheduleCall?: boolean } | null;
  const wantsCall = state?.scheduleCall ?? false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-slate-50 mb-6">
            Thank you for reaching out.
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-12">
            We've received your message and will review your information.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {wantsCall && (
              <a
                href={SCHEDULER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-8 py-4 text-lg font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <Calendar size={20} />
                Schedule a Call
              </a>
            )}
            <Link
              to="/"
              className={`inline-flex items-center gap-2 rounded-lg px-8 py-4 text-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                wantsCall
                  ? 'border border-white/10 bg-white/3 font-medium text-slate-200 hover:border-white/20 hover:bg-white/6 focus:ring-slate-400'
                  : 'bg-amber-500 font-semibold text-slate-950 hover:bg-amber-400 focus:ring-amber-300'
              }`}
            >
              Return Home
              <ArrowRight size={20} />
            </Link>
          </div>

          {!wantsCall && (
            <div className="mt-8">
              <a
                href={SCHEDULER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-100 text-lg transition-colors"
              >
                <Calendar size={18} />
                Or schedule a call
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
