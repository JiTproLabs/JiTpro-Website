import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const dropdowns = {
  howItWorks: {
    label: 'The JiTpro Control Process',
    items: [
      { to: '/product', label: 'Single Project Approach' },
      { to: '/how-it-works', label: 'The JiTpro Control Process' },
      { to: '/roles', label: 'Roles' },
    ],
  },
  why: {
    label: 'Why JiTpro',
    items: [
      { to: '/why', label: 'Why JiTpro' },
      { to: '/company-project-health', label: 'Company & Project Health' },
      { to: '/documentation', label: 'Documentation & Risk' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  about: {
    label: 'About',
    items: [
      { to: '/about', label: 'About JiTpro' },
      { to: '/founder-story', label: 'Founder Story' },
    ],
  },
  contact: {
    label: 'Contact',
    items: [
      { to: '/contact/contractor', label: 'General Contractors' },
      { to: '/contact/architect', label: 'Architects & Engineers' },
      { to: '/contact/owner', label: 'Owners & Developers' },
    ],
  },
};

const dropdownKeys = ['howItWorks', 'why', 'about', 'contact'] as const;
type DropdownKey = typeof dropdownKeys[number];

export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<DropdownKey | null>(null);
  const [openMobile, setOpenMobile] = useState<DropdownKey | null>(null);

  const isActive = (path: string) => location.pathname === path;

  const isDropdownActive = (key: DropdownKey) =>
    dropdowns[key].items.some((item) => location.pathname.startsWith(item.to));

  useEffect(() => {
    setOpenDesktop(null);
    setMobileMenuOpen(false);
    setOpenMobile(null);
  }, [location.pathname]);

  return (
    <nav className="border-b border-slate-700 bg-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img src={`${import.meta.env.BASE_URL}assets/logo/JiTpro_Amber.svg`} alt="JITpro" className="h-28" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {dropdownKeys.map((key) => {
              const dropdown = dropdowns[key];

              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setOpenDesktop(key)}
                  onMouseLeave={() => setOpenDesktop(null)}
                >
                  <button
                    className={`text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                      isDropdownActive(key)
                          ? 'text-white'
                          : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {dropdown.label}
                    <ChevronDown size={14} className={`transition-transform ${openDesktop === key ? 'rotate-180' : ''}`} />
                  </button>

                  {openDesktop === key && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="w-64 bg-slate-700 border border-slate-600 rounded-lg shadow-lg py-2">
                        {dropdown.items.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              isActive(item.to)
                                ? 'text-amber-500 bg-slate-600'
                                : 'text-slate-300 hover:text-white hover:bg-slate-600'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
            {dropdownKeys.map((key) => {
              const dropdown = dropdowns[key];
              const isOpen = openMobile === key;

              return (
                <div key={key}>
                  <button
                    onClick={() => setOpenMobile(isOpen ? null : key)}
                    className={`flex items-center justify-between w-full py-2 text-base font-medium ${
                      isDropdownActive(key)
                          ? 'text-white'
                          : 'text-slate-300'
                    }`}
                  >
                    {dropdown.label}
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="pl-4 space-y-1 pb-2">
                      {dropdown.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`block py-1.5 text-sm ${
                            isActive(item.to) ? 'text-amber-500 font-medium' : 'text-slate-400'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
