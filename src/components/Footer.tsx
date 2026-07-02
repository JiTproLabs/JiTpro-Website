import { Link } from 'react-router-dom';
import JiTproWordmark from './JiTproWordmark';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-heading text-xl font-bold text-slate-50 mb-4"><JiTproWordmark variant="amber" /></h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              Procurement control for construction schedule certainty.
            </p>
            <a
              href="https://www.linkedin.com/in/jeff-kaufman"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded bg-[#0A66C2] hover:bg-[#004182] transition-colors"
              aria-label="LinkedIn"
            >
              <span className="text-white text-sm font-bold leading-none">in</span>
            </a>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/product" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Single Project Approach
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-400 hover:text-slate-100 transition-colors">
                  The JiTpro Control Process
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Roles</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/roles/general-contractors" className="text-slate-400 hover:text-slate-100 transition-colors">
                  General Contractors
                </Link>
              </li>
              <li>
                <Link to="/roles/architects-engineers" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Architects & Engineers
                </Link>
              </li>
              <li>
                <Link to="/roles/subcontractors" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Subcontractors
                </Link>
              </li>
              <li>
                <Link to="/roles/owners-developers" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Owners & Developers
                </Link>
              </li>
              <li>
                <Link to="/roles/project-managers" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Project Managers / CMs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/why" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Why JiTpro
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Documentation & Risk
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-slate-100 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-slate-100 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} JiTpro. Schedule certainty through procurement control.
          </p>
          <Link
            to="/investor"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            For Investors
          </Link>
        </div>
      </div>
    </footer>
  );
}
