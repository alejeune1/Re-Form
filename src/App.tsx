import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Challenges from './pages/Challenges';
import Home from './pages/Home';
import Tutorials from './pages/Tutorials';

function ScrollToLocation() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-ink">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_15%_12%,rgba(138,154,123,0.2),transparent_28%),radial-gradient(circle_at_86%_8%,rgba(232,220,200,0.7),transparent_30%),linear-gradient(135deg,#f6f0e6_0%,#efe3d1_48%,#f7f1e8_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.18] [background-image:linear-gradient(rgba(90,70,50,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(90,70,50,0.16)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="relative z-10">
        <ScrollToLocation />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutoriels" element={<Tutorials />} />
          <Route path="/defis" element={<Challenges />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </main>
  );
}
