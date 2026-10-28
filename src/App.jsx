import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MatrixIntro from './components/MatrixIntro.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import ThreatScanner from './pages/ThreatScanner.jsx';
import EmailSecurity from './pages/EmailSecurity.jsx';
import ThreatDetection from './pages/ThreatDetection.jsx';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <MatrixIntro onEnter={() => { setEntered(true); window.scrollTo({ top: 0 }); }} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="scanner" element={<ThreatScanner />} />
          <Route path="email-security" element={<EmailSecurity />} />
          <Route path="threat-detection" element={<ThreatDetection />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
