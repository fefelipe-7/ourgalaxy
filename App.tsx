import React, { useEffect, Suspense, lazy, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Letters from './pages/Home';
import LetterRead from './pages/LetterRead';
import LetterWrite from './pages/LetterWrite';
import BottomNav from './components/BottomNav';
import { Loader2 } from 'lucide-react';

// Lazy loading das páginas menos críticas/mais pesadas
const Absences = lazy(() => import('./pages/Absences'));
const Moments = lazy(() => import('./pages/Moments'));
const MomentCreate = lazy(() => import('./pages/MomentCreate'));
const MomentDetail = lazy(() => import('./pages/MomentDetail'));
const MapDetails = lazy(() => import('./pages/MapDetails'));

// URLs para pré-carregamento (Cache do navegador)
const PROFILE_IMAGES = [
  'https://i.imgur.com/SjjQo8L_d.webp?maxwidth=760&fidelity=grand',
  'https://i.imgur.com/zkL4pkx_d.webp?maxwidth=760&fidelity=grand'
];

const ImagePreloader = () => {
  useEffect(() => {
    PROFILE_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  return null;
};

// Componente de Loading Bonito para as transições
const PageLoader = () => (
  <div className="h-full w-full flex flex-col items-center justify-center text-cozy-sageLight">
    <Loader2 size={32} className="animate-spin mb-2" />
    <span className="text-xs font-bold tracking-widest uppercase opacity-70">carregando...</span>
  </div>
);

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Navigation appears on main list pages
  const showNav = ['/home', '/absences', '/moments'].includes(location.pathname);

  // Scroll to top on route change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="h-[100dvh] w-full bg-cozy-cream overflow-hidden relative font-sans flex flex-col pt-safe-top">
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar pb-32 scroll-smooth"
      >
        <Suspense fallback={<PageLoader />}>
            {/* Wrapper de Animação de Rota */}
            <div key={location.pathname} className="animate-slide-up w-full min-h-full">
                {children}
            </div>
        </Suspense>
      </div>
      {showNav && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ImagePreloader />
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Letters />} />
          <Route path="/letter/read/:id" element={<LetterRead />} />
          <Route path="/letter/write" element={<LetterWrite />} />
          
          {/* Rotas Lazy Loaded */}
          <Route path="/absences" element={<Absences />} />
          <Route path="/moments" element={<Moments />} />
          <Route path="/moment/create" element={<MomentCreate />} />
          <Route path="/moment/:id" element={<MomentDetail />} />
          <Route path="/map" element={<MapDetails />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;