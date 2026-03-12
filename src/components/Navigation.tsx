import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const roleLinks = [
  { to: '/roles/general-contractors', label: 'General Contractors' },
  { to: '/roles/architects-engineers', label: 'Architects & Engineers' },
  { to: '/roles/subcontractors', label: 'Subcontractors' },
  { to: '/roles/owners-developers', label: 'Owners & Developers' },
  { to: '/roles/project-managers', label: 'Project Managers / CMs' },
];

export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rolesDropdownOpen, setRolesDropdownOpen] = useState(false);
  const [mobileRolesOpen, setMobileRolesOpen] = useState(false);
  const links = [
    { to: '/', label: 'Home' },
    { to: '/product', label: 'Product' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/why', label: 'Why JITpro' },
    { to: '/documentation', label: 'Documentation' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isRolesActive = location.pathname.startsWith('/roles');

  useEffect(() => {
    setRolesDropdownOpen(false);
    setMobileMenuOpen(false);
    setMobileRolesOpen(false);
  }, [location.pathname]);

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

            {/* Roles dropdown */}
            <div
              className="relative"

              onMouseEnter={() => setRolesDropdownOpen(true)}
              onMouseLeave={() => setRolesDropdownOpen(false)}
            >
              <Link
                to="/roles"
                className={`text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                  isRolesActive
                    ? 'text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Roles
                <ChevronDown size={14} className={`transition-transform ${rolesDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>

              {rolesDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-2">
                    {roleLinks.map((role) => (
                      <Link
                        key={role.to}
                        to={role.to}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          isActive(role.to)
                            ? 'text-amber-600 bg-amber-50'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {role.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
          <div className="px-6 py-4 space-y-1">
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

            {/* Mobile Roles accordion */}
            <div>
              <button
                onClick={() => setMobileRolesOpen(!mobileRolesOpen)}
                className={`flex items-center justify-between w-full py-2 text-base font-medium ${
                  isRolesActive ? 'text-slate-900' : 'text-slate-600'
                }`}
              >
                Roles
                <ChevronDown size={16} className={`transition-transform ${mobileRolesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileRolesOpen && (
                <div className="pl-4 space-y-1 pb-2">
                  <Link
                    to="/roles"
                    className={`block py-1.5 text-sm ${
                      location.pathname === '/roles' ? 'text-amber-600 font-medium' : 'text-slate-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    All Roles
                  </Link>
                  {roleLinks.map((role) => (
                    <Link
                      key={role.to}
                      to={role.to}
                      className={`block py-1.5 text-sm ${
                        isActive(role.to) ? 'text-amber-600 font-medium' : 'text-slate-600'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {role.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

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
