import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import HowItWorks from './pages/HowItWorks';
import Roles from './pages/Roles';
import Why from './pages/Why';
import Documentation from './pages/Documentation';
import About from './pages/About';
import FounderStory from './pages/FounderStory';
import Demo from './pages/Demo';
import OwnerContact from './pages/contact/OwnerContact';
import ContractorContact from './pages/contact/ContractorContact';
import ArchitectContact from './pages/contact/ArchitectContact';
import ThankYou from './pages/ThankYou';
import GeneralContractors from './pages/roles/GeneralContractors';
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin — no layout wrapper */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/approved" element={<AdminApproved />} />

        {/* Unlisted LinkedIn landing page — standalone, not in main nav */}
        <Route path="/broken-before-the-job-starts" element={<BrokenBeforeJobStarts />} />
        <Route path="/the-real-procurement-timeline" element={<TheRealProcurementTimeline />} />

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

        {/* Main site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/roles/general-contractors" element={<GeneralContractors />} />
          <Route path="/roles/architects-engineers" element={<ArchitectsEngineers />} />
          <Route path="/roles/subcontractors" element={<Subcontractors />} />
          <Route path="/roles/owners-developers" element={<OwnersDevelopers />} />
          <Route path="/roles/project-managers" element={<ProjectManagers />} />
          <Route path="/why" element={<Why />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/about" element={<About />} />
          <Route path="/founder-story" element={<FounderStory />} />
          <Route path="/contact/owner" element={<OwnerContact />} />
          <Route path="/contact/contractor" element={<ContractorContact />} />
          <Route path="/contact/architect" element={<ArchitectContact />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
