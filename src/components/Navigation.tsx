import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/product', label: 'Product' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/roles', label: 'Roles' },
    { to: '/why', label: 'Why JITpro' },
    { to: '/documentation', label: 'Documentation' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img src={`${import.meta.env.BASE_URL}jitpro-logo_(1).svg`} alt="JITpro" className="h-12" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/how-it-works"
              className="bg-slate-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              How It Works
            </Link>
          </div>

          <button
            className="lg:hidden text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="px-6 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block py-2 text-base font-medium ${
                  isActive(link.to)
                    ? 'text-slate-900'
                    : 'text-slate-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/how-it-works"
              className="block bg-slate-900 text-white px-6 py-3 text-base font-medium text-center hover:bg-slate-800 transition-colors mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
