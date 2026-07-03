import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App.tsx';
import './i18n';
import './index.css';

if ('serviceWorker' in navigator && !sessionStorage.getItem('sw-cleaned')) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    if (registrations.length > 0) {
      const promises = registrations.map((registration) => {
        console.log('Unregistering Service Worker:', registration.scope);
        return registration.unregister();
      });

      Promise.all(promises).then(() => {
        if ('caches' in window) {
          caches.keys().then((cacheNames) => {
            if (cacheNames.length > 0) {
              console.log('Clearing', cacheNames.length, 'Service Worker caches');
              return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
              );
            }
            return Promise.resolve();
          }).then(() => {
            sessionStorage.setItem('sw-cleaned', 'true');
            console.log('Service Worker cleanup complete, reloading...');
            window.location.reload();
          });
        } else {
          sessionStorage.setItem('sw-cleaned', 'true');
          window.location.reload();
        }
      });
      return;
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);
