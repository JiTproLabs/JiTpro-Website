import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">JITpro</h3>
            <p className="text-slate-600 leading-relaxed">
              Procurement intelligence for construction schedule control.
            </p>
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
              <li>
                <Link to="/roles" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Roles
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

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">Get Started</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
                  How it works
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
