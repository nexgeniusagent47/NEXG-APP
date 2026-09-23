import {StrictMode, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import { AppProviders, AppContent } from './App.tsx';
import ConsentBanner from './components/consent/ConsentBanner.tsx';
import {useAnalytics} from './hooks/useAnalytics.ts';
import {flushTelemetry} from './lib/telemetry.ts';
import './index.css';

/**
 * Consent and telemetry are mounted beside <App /> rather than inside it.
 *
 * The banner has to outlive every route change, and the click capture has to be
 * installed before the first lazily-loaded page is fetched — both are properties of
 * the document, not of a page. Importing ./lib/telemetry.ts here is also what
 * guarantees its module-level wiring (fetch tracing, vitals, consent listener) runs
 * on every load instead of only when some lazy chunk happens to import it.
 */
function ConsentAndTelemetry() {
  useAnalytics();

  useEffect(() => {
    // telemetry.ts already flushes on `pagehide`, but only because its module was
    // loaded. This listener makes the unload flush the app shell's own guarantee;
    // flushTelemetry() is a no-op when the buffer is already empty.
    window.addEventListener('pagehide', flushTelemetry);
    return () => window.removeEventListener('pagehide', flushTelemetry);
  }, []);

  return <ConsentBanner />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* The providers wrap BOTH children, not just the application.
        The banner is deliberately a sibling of <App /> — it has to outlive route changes and its
        click capture must be installed before the first lazy page loads. With the providers inside
        <App />, that sibling sat outside them, and when the banner gained a useLanguage() call the
        hook threw and the whole application rendered blank. The provider belongs above both. */}
    <AppProviders>
      <AppContent />
      <ConsentAndTelemetry />
    </AppProviders>
  </StrictMode>,
);
