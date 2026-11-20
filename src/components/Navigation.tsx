import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

/* Direct links, no dropdowns (founder direction 2026-11-18, issue #84; Home added and About renamed 2026-11-20,
   issue #89). Every other page and route is kept; only these header links changed. Token classes per §45.5; the literal classes around them are pre-standard legacy. */
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/founder-story', label: 'Founder Story' },
  { to: '/contact', label: 'Contact Us' },
] as const;

const FOCUS = 'rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-jp-text-primary';

export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="border-b border-slate-700 bg-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img src={`${import.meta.env.BASE_URL}assets/logo/JiTpro_Amber.svg`} alt="JITpro" className="h-28" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive(link.to) ? 'page' : undefined}
                className={`text-sm font-medium transition-colors ${FOCUS} ${
                  isActive(link.to) ? 'text-jp-text-primary' : 'text-jp-text-secondary hover:text-jp-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="lg:hidden text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-700 bg-slate-800">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive(link.to) ? 'page' : undefined}
                className={`block py-2 text-base font-medium ${FOCUS} ${
                  isActive(link.to) ? 'text-jp-text-primary' : 'text-jp-text-secondary'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
