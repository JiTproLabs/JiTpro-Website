import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">JITpro</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Procurement intelligence for construction schedule control.
            </p>
            <a
              href="https://www.linkedin.com/in/jeff-kaufman"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0A66C2] hover:bg-[#004182] transition-colors"
              aria-label="LinkedIn"
            >
              <span className="text-white text-sm font-bold leading-none">in</span>
            </a>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/product" className="text-slate-600 hover:text-slate-900 transition-colors">
                  What JITpro enables
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">Roles</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/roles/general-contractors" className="text-slate-600 hover:text-slate-900 transition-colors">
                  General Contractors
                </Link>
              </li>
              <li>
                <Link to="/roles/architects-engineers" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Architects & Engineers
                </Link>
              </li>
              <li>
                <Link to="/roles/subcontractors" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Subcontractors
                </Link>
              </li>
              <li>
                <Link to="/roles/owners-developers" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Owners & Developers
                </Link>
              </li>
              <li>
                <Link to="/roles/project-managers" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Project Managers / CMs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/why" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Why JITpro
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Documentation & Risk
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} JITpro. Schedule certainty through procurement intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
