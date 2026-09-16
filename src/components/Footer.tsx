import { Link } from 'react-router-dom';
import JiTproWordmark from './JiTproWordmark';
import LeadMagnetCTA from './lead-magnet/LeadMagnetCTA';

/**
 * The site footer.
 *
 * TOKENS IN NEW CODE ONLY. The existing links carry raw palette classes
 * (`text-slate-400`, `hover:text-slate-100`) that predate the token rules of
 * Design System §8.8, §8.9 and §45. That is a scheduled migration, not a
 * licence to add more: the two items added for the lead magnet (D6.15) use
 * token classes, and the legacy links are deliberately left untouched as
 * out of scope for that sprint. The two therefore do not match exactly until
 * the footer is migrated.
 */
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
              className="inline-flex items-center justify-center w-9 h-9 rounded-sm bg-[#0A66C2] hover:bg-[#004182] transition-colors"
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
              {/* The lead-magnet offer as a quiet footer link (D6.15). It
                  opens the approved dialog and records the page it was
                  clicked from, so the same offer is attributable to the
                  footer separately from the two bands. Token classes, per
                  the note above. */}
              <li>
                <LeadMagnetCTA placement="footer-link" variant="footer-link" />
              </li>
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
          <div className="flex items-center gap-6">
            {/* Token classes, per the note above (D6.15). */}
            <Link
              to="/privacy"
              className="inline-flex min-h-[44px] items-center text-sm text-jp-text-muted transition-colors duration-200 ease-out hover:text-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none"
            >
              Privacy
            </Link>
            <Link
              to="/investor"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              For Investors
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
