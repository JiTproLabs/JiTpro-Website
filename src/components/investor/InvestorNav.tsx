import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Download } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const investorBriefLinks = [
  { to: '/investor', label: 'Home' },
  { to: '/investor/market', label: 'Market' },
  { to: '/investor/hidden-cost', label: 'Hidden Cost' },
  { to: '/investor/why-now', label: 'Why Now' },
  { to: '/investor/product', label: 'Product' },
  { to: '/investor/economics', label: 'Economics' },
];

const dataRoomLinks = [
  { to: '/investor/deck', label: 'Deck', downloadLabel: 'Download Pitch Deck' },
];

export default function InvestorNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [dataRoomOpen, setDataRoomOpen] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);
  const dataRoomRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const isBrief = investorBriefLinks.some((l) => pathname === l.to);
  const isDataRoom = dataRoomLinks.some((l) => pathname === l.to);

  // Show download button when on a Data Room page
  const activeDataRoomPage = dataRoomLinks.find((l) => pathname === l.to);

  // Filter out Home link when already on Home
  const visibleBriefLinks = investorBriefLinks.filter(
    (l) => !(l.to === '/investor' && pathname === '/investor'),
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (briefRef.current && !briefRef.current.contains(e.target as Node)) {
        setBriefOpen(false);
      }
      if (dataRoomRef.current && !dataRoomRef.current.contains(e.target as Node)) {
        setDataRoomOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-28">
        <Link to="/investor" className="flex items-center gap-4">
          <img
            src="/JiTpro-Website/assets/logo/JiTpro_Amber_white_text.svg"
            alt="JiTpro — Just in Time Procurement"
            className="h-20"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/logo/JiTpro_Amber_white_text.svg';
            }}
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {/* Investor Brief dropdown */}
          <div ref={briefRef} className="relative">
            <button
              onClick={() => { setBriefOpen((v) => !v); setDataRoomOpen(false); }}
              className={`px-3 py-2 text-sm rounded transition-colors flex items-center gap-1 ${
                isBrief
                  ? 'text-amber-500 bg-slate-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Investor Brief
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${briefOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {briefOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-slate-900 border border-slate-800 rounded shadow-lg py-1 z-50">
                {visibleBriefLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setBriefOpen(false)}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      pathname === link.to
                        ? 'text-amber-500 bg-slate-800'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Appendix — standalone */}
          <Link
            to="/investor/appendix"
            className={`px-3 py-2 text-sm rounded transition-colors ${
              pathname === '/investor/appendix'
                ? 'text-amber-500 bg-slate-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Appendix
          </Link>

          {/* Data Room dropdown */}
          <div ref={dataRoomRef} className="relative">
            <button
              onClick={() => setDataRoomOpen((v) => !v)}
              className={`px-3 py-2 text-sm rounded transition-colors flex items-center gap-1 ${
                isDataRoom
                  ? 'text-amber-500 bg-slate-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Data Room
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${dataRoomOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {dataRoomOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-slate-900 border border-slate-800 rounded shadow-lg py-1 z-50">
                {dataRoomLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setDataRoomOpen(false)}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      pathname === link.to
                        ? 'text-amber-500 bg-slate-800'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Download button — visible only on Data Room pages */}
          {activeDataRoomPage && (
            <button
              onClick={() => {
                // TODO: wire up actual PDF download
              }}
              className="ml-2 px-3 py-2 text-sm rounded border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5"
            >
              <Download size={14} />
              {activeDataRoomPage.downloadLabel}
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-400 hover:text-slate-200"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-6 py-4 space-y-1">
          <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Investor Brief
          </p>
          {visibleBriefLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded text-sm transition-colors ${
                pathname === link.to
                  ? 'text-amber-500 bg-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-800 pt-2 mt-2">
            <Link
              to="/investor/appendix"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded text-sm transition-colors ${
                pathname === '/investor/appendix'
                  ? 'text-amber-500 bg-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Appendix
            </Link>
          </div>
          <div className="border-t border-slate-800 pt-2 mt-2">
            <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Data Room
            </p>
            {dataRoomLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
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
          {activeDataRoomPage && (
            <div className="border-t border-slate-800 pt-3 mt-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  // TODO: wire up actual PDF download
                }}
                className="w-full px-3 py-2.5 text-sm rounded border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download size={14} />
                {activeDataRoomPage.downloadLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
