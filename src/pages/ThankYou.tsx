import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

// TODO: Replace with actual Microsoft Bookings URL
const SCHEDULER_URL = 'https://outlook.office365.com/book/PLACEHOLDER';

export default function ThankYou() {
  const location = useLocation();
  const state = location.state as { scheduleCall?: boolean } | null;
  const wantsCall = state?.scheduleCall ?? false;

  return (
    <div>
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Thank you for reaching out.
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-12">
            We've received your message and will review your information.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {wantsCall && (
              <a
                href={SCHEDULER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors"
              >
                <Calendar size={20} />
                Schedule a Call
              </a>
            )}
            <Link
              to="/"
              className={`inline-flex items-center gap-2 px-8 py-4 text-lg font-medium transition-colors ${
                wantsCall
                  ? 'border-2 border-slate-900 text-slate-900 hover:bg-slate-50'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
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
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-lg transition-colors"
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
