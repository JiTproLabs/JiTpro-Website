import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/investor', label: 'Home' },
  { to: '/investor/market', label: 'Market' },
  { to: '/investor/hidden-cost', label: 'Hidden Cost' },
  { to: '/investor/why-now', label: 'Why Now' },
  { to: '/investor/product', label: 'Product' },
  { to: '/investor/economics', label: 'Economics' },
  { to: '/investor/appendix', label: 'Appendix' },
];

export default function InvestorNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/investor" className="flex items-center gap-3">
          <img
            src="/JiTpro-Website/assets/logo/JiTpro_Amber.svg"
            alt="JiTpro"
            className="h-7"
            onError={(e) => {
              // Fallback for local dev where base path differs
              (e.target as HTMLImageElement).src = '/assets/logo/JiTpro_Amber.svg';
            }}
          />
          <span className="text-xs font-medium tracking-widest text-slate-500 uppercase">Investor</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 text-sm rounded transition-colors ${
                pathname === link.to
                  ? 'text-amber-500 bg-slate-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-slate-400 hover:text-slate-200"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded text-sm transition-colors ${
                pathname === link.to
                  ? 'text-amber-500 bg-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
