import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles.css';
import App from './App';
import { AppErrorBoundary } from './components/AppErrorBoundary';

const root = document.getElementById('root');
if (!root) throw new Error('Application root element is missing.');

document.documentElement.dataset.appBooted = 'true';
document.getElementById('boot-fallback')?.setAttribute('hidden', '');

createRoot(root).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }).catch((error) => {
      console.warn('Service worker registration failed; continuing without offline cache.', error);
    });
  });
}
