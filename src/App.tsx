import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { SeoManager } from './components/SeoManager';

const PdfToolClient = lazy(() => import('./components/PdfToolClient').then(module => ({ default: module.PdfToolClient })));
const SEOContent = lazy(() => import('./components/SEOContent').then(module => ({ default: module.SEOContent })));

function AppContent() {
  const { lang, format } = useParams<{ lang: string; format?: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (lang && ['de', 'fr', 'it'].includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
      document.documentElement.lang = lang === 'de' ? 'de-CH' : lang === 'fr' ? 'fr-CH' : 'it-CH';
    } else if (lang) {
      navigate('/de/', { replace: true });
    }
  }, [lang, i18n, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col notranslate" translate="no">
      <SeoManager lang={lang || 'de'} format={format} />
      <Header />

      <main className="flex-1">
        <Hero format={format} />

        <Suspense fallback={<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>}>
          <PdfToolClient format={format} />
        </Suspense>

        <Suspense fallback={<div className="py-16 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>}>
          <SEOContent format={format} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/de/" replace />} />
      <Route path="/:lang/" element={<AppContent />} />
      <Route path="/:lang/:format" element={<AppContent />} />
    </Routes>
  );
}

export default App;