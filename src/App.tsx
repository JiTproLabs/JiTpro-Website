import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LearnMore from './pages/LearnMore';
import Product from './pages/Product';
import HowItWorks from './pages/HowItWorks';
import Roles from './pages/Roles';
import Why from './pages/Why';
import Documentation from './pages/Documentation';
import About from './pages/About';
import FounderStory from './pages/FounderStory';
import Demo from './pages/Demo';
import Contact from './pages/contact/Contact';
import ThankYou from './pages/ThankYou';
import GeneralContractors from './pages/roles/GeneralContractors';
import GeneralContractorsConcept from './pages/roles/GeneralContractorsConcept';
import ArchitectsEngineers from './pages/roles/ArchitectsEngineers';
import Subcontractors from './pages/roles/Subcontractors';
import OwnersDevelopers from './pages/roles/OwnersDevelopers';
import ProjectManagers from './pages/roles/ProjectManagers';
import ScrollToTop from './components/ScrollToTop';
import InvestorLayout from './components/investor/InvestorLayout';
import InvestorHome from './pages/investor/InvestorHome';
import MarketOpportunity from './pages/investor/MarketOpportunity';
import HiddenCost from './pages/investor/HiddenCost';
import WhyNow from './pages/investor/WhyNow';
import InvestorProduct from './pages/investor/InvestorProduct';
import EconomicCase from './pages/investor/EconomicCase';
import InvestorAppendix from './pages/investor/InvestorAppendix';
import InvestorDeckPage from './pages/investor/InvestorDeckPage';
import FAQ from './pages/FAQ';
import MainLayout from './components/MainLayout';
import Admin from './pages/Admin';
import AdminApproved from './pages/AdminApproved';
import BrokenBeforeJobStarts from './pages/BrokenBeforeJobStarts';
import TheRealProcurementTimeline from './pages/TheRealProcurementTimeline';
import ProcurementSchedule from './pages/ProcurementSchedule';

/* PROTOTYPE LAB - dev-only. Lazy so its CSS (which pulls a Google font) lands
   in a separate chunk instead of the production stylesheet. The lab routes are
   also DEV-gated, so the lab harness chunks are never requested in a
   production build. The procurement schedule itself is not lab-only: it lives
   in src/components/demo/screens/procurement-schedule, is a registered
   representative screen (homepage, Learn More), and also ships through the
   unlisted team review route below. One implementation; the lab is only its
   workbench. */
const DemoLab = lazy(() => import('./demo-lab/DemoLab'));
const TableFidelityTest = lazy(() => import('./demo-lab/TableFidelityTest'));
const ScheduleLab = lazy(() => import('./demo-lab/schedule/ScheduleLab'));
const ScreenCompareLab = lazy(() => import('./demo-lab/ScreenCompareLab'));
const ProductRegisterScreen = lazy(() => import('./components/demo/screens/ProductRegisterScreen'));
const CommitmentRegisterLive = lazy(() => import('./components/demo/screens/CommitmentRegisterScreen'));
const ScopeGapAnalysisScreen = lazy(() => import('./components/demo/screens/ScopeGapAnalysisScreen'));

/* TEAM REVIEW - unlisted, in the production build. The procurement schedule
   prototype behind a plain URL the team can open, rendering the same
   ScheduleViewer the lab does, so there is one schedule and nothing to drift.
   Lazy so the schedule and its stylesheet stay in their own chunk. Not linked
   from any surface; the page marks itself noindex, nofollow. */
const ProcurementScheduleReview = lazy(() => import('./pages/review/ProcurementScheduleReview'));

import HomepageConcept from './pages/HomepageConcept';
import CompanyProjectHealth from './pages/CompanyProjectHealth';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ScrollToTop />
      <Routes>
        {/* Admin — no layout wrapper */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/approved" element={<AdminApproved />} />

        {/* Unlisted LinkedIn landing page — standalone, not in main nav */}
        <Route path="/broken-before-the-job-starts" element={<BrokenBeforeJobStarts />} />
        <Route path="/the-real-procurement-timeline" element={<TheRealProcurementTimeline />} />

        {/* Unlisted team review of the procurement schedule prototype — standalone, not in nav, noindex */}
        <Route
          path="/review/procurement-schedule"
          element={<Suspense fallback={null}><ProcurementScheduleReview /></Suspense>}
        />

        {/* Investor sub-site — own nav/footer */}
        <Route path="/investor" element={<InvestorLayout />}>
          <Route index element={<InvestorHome />} />
          <Route path="market" element={<MarketOpportunity />} />
          <Route path="hidden-cost" element={<HiddenCost />} />
          <Route path="why-now" element={<WhyNow />} />
          <Route path="product" element={<InvestorProduct />} />
          <Route path="economics" element={<EconomicCase />} />
          <Route path="appendix" element={<InvestorAppendix />} />
          <Route path="deck" element={<InvestorDeckPage />} />
        </Route>

        {/* PROTOTYPE LAB - dev-only, never built into production.
            Temporary visual-validation routes for the JiTpro demo UI
            migration. `import.meta.env.DEV` is statically replaced at build
            time, so Rollup drops both these routes and the lazily-imported
            lab bundle from the production output entirely. Not in navigation,
            not in the sitemap, not linked from any surface. */}
        {import.meta.env.DEV && (
          <>
            <Route path="/demo-lab/commitment-register-a" element={<Suspense fallback={null}><DemoLab initial="a" /></Suspense>} />
            <Route path="/demo-lab/commitment-register-b" element={<Suspense fallback={null}><DemoLab initial="b" /></Suspense>} />
            <Route path="/demo-lab/commitment-register-compare" element={<Suspense fallback={null}><DemoLab initial="overlay-a" /></Suspense>} />
            <Route path="/demo-lab/table-test" element={<Suspense fallback={null}><TableFidelityTest /></Suspense>} />
            <Route path="/demo-lab/procurement-schedule" element={<Suspense fallback={null}><ScheduleLab initial="inspect" /></Suspense>} />
            <Route path="/demo-lab/procurement-schedule-compare" element={<Suspense fallback={null}><ScheduleLab initial="compare" /></Suspense>} />
            <Route path="/demo-lab/product-register" element={<Suspense fallback={null}><ScreenCompareLab component={ProductRegisterScreen} reference="product-register" title="Product Register" /></Suspense>} />
            <Route path="/demo-lab/product-register-compare" element={<Suspense fallback={null}><ScreenCompareLab component={ProductRegisterScreen} reference="product-register" title="Product Register" initial="side" /></Suspense>} />
            <Route path="/demo-lab/commitment-register-live" element={<Suspense fallback={null}><ScreenCompareLab component={CommitmentRegisterLive} reference="commitment-capture" title="Commitment Register (production)" initial="live" /></Suspense>} />
            <Route path="/demo-lab/scope-gap-analysis" element={<Suspense fallback={null}><ScreenCompareLab component={ScopeGapAnalysisScreen} reference="scope-gap-analysis" title="Scope Gap Analysis" /></Suspense>} />
            <Route path="/demo-lab/scope-gap-analysis-compare" element={<Suspense fallback={null}><ScreenCompareLab component={ScopeGapAnalysisScreen} reference="scope-gap-analysis" title="Scope Gap Analysis" initial="side" /></Suspense>} />
          </>
        )}

        {/* Main site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          {/* The homepage secondary action's destination (Design System §50). */}
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/product" element={<Product />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/roles/general-contractors" element={<GeneralContractors />} />
          <Route path="/roles/general-contractors-concept" element={<GeneralContractorsConcept />} />
          <Route path="/roles/architects-engineers" element={<ArchitectsEngineers />} />
          <Route path="/roles/subcontractors" element={<Subcontractors />} />
          <Route path="/roles/owners-developers" element={<OwnersDevelopers />} />
          <Route path="/roles/project-managers" element={<ProjectManagers />} />
          <Route path="/why" element={<Why />} />
          <Route path="/company-project-health" element={<CompanyProjectHealth />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/about" element={<About />} />
          <Route path="/founder-story" element={<FounderStory />} />
          <Route path="/contact" element={<Contact />} />
          {/* Legacy role-specific contact routes — consolidated 2026-08-26 */}
          <Route path="/contact/contractor" element={<Navigate to="/contact" replace />} />
          <Route path="/contact/architect" element={<Navigate to="/contact" replace />} />
          <Route path="/contact/owner" element={<Navigate to="/contact" replace />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/demo" element={<Demo />} />
          {/* Unlisted — not in nav. Direct-link only. Plan to re-integrate later. */}
          <Route path="/homepage-concept" element={<HomepageConcept />} />
          <Route path="/JiTpro-Website/homepage-concept" element={<HomepageConcept />} />
          <Route path="/procurement-schedule" element={<ProcurementSchedule />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
