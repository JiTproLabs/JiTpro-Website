import { Link } from 'react-router-dom';

export default function InvestorFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      {/* Dashboard CTA */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold text-slate-100 mb-3">Investor Dashboard</h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            A dedicated portal for investors is under development. Register your interest to receive early access.
          </p>
          <div className="inline-block px-6 py-3 bg-slate-700 text-slate-400 rounded-sm text-sm font-medium">
            Coming Soon
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} JiTpro. All rights reserved.
          </p>
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            Return to main site
          </Link>
        </div>
      </div>
    </footer>
  );
}
