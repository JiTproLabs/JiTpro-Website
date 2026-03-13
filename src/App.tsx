import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import HowItWorks from './pages/HowItWorks';
import Roles from './pages/Roles';
import Why from './pages/Why';
import Documentation from './pages/Documentation';
import About from './pages/About';
import FounderStory from './pages/FounderStory';
import Demo from './pages/Demo';
import GeneralContractors from './pages/roles/GeneralContractors';
import ArchitectsEngineers from './pages/roles/ArchitectsEngineers';
import Subcontractors from './pages/roles/Subcontractors';
import OwnersDevelopers from './pages/roles/OwnersDevelopers';
import ProjectManagers from './pages/roles/ProjectManagers';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <main className="flex-1">
          <Routes>
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
            <Route path="/demo" element={<Demo />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
