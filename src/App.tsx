import { useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { AttributionDrawer } from './components/AttributionDrawer';
import { InfoPanel } from './components/InfoPanel';
import { ImmersiveSceneOverlay } from './components/ImmersiveSceneOverlay';
import { ImmersiveExplore } from './components/ImmersiveExplore';
import { LayerControls } from './components/LayerControls';
import { MapView } from './components/MapView';
import { SearchDialog } from './components/SearchDialog';
import { Timeline } from './components/Timeline';
import { TopBar } from './components/TopBar';
import { VisionaryOverlay } from './components/VisionaryOverlay';
import { loadAtlasData } from './data/load';
import { loadImmersiveSceneCatalog } from './data/immersive';
import { useAtlasStore } from './state/useAtlasStore';

export default function App() {
  const loading = useAtlasStore((s) => s.loading);
  const error = useAtlasStore((s) => s.error);
  const setData = useAtlasStore((s) => s.setData);
  const setError = useAtlasStore((s) => s.setError);
  const setSceneCatalog = useAtlasStore((s) => s.setSceneCatalog);
  const setSceneError = useAtlasStore((s) => s.setSceneError);

  useEffect(() => {
    void loadAtlasData().then(setData).catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)));
    void loadImmersiveSceneCatalog()
      .then(setSceneCatalog)
      .catch((err: unknown) => setSceneError(err instanceof Error ? err.message : String(err)));
  }, [setData, setError, setSceneCatalog, setSceneError]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#atlas-workspace">Skip to atlas</a>
      <TopBar />
      <main id="atlas-workspace" className="workspace" tabIndex={-1} aria-busy={loading}>
        {loading && <div className="loading-screen" role="status" aria-live="polite"><div className="loading-orbit" aria-hidden="true" /><strong>Opening the ancient world…</strong></div>}
        {error && <div className="error-screen" role="alert"><strong>Atlas data could not load.</strong><span>{error}</span></div>}
        {!loading && !error && <MapView />}
        {!loading && !error && <ImmersiveExplore />}
        {!loading && !error && <VisionaryOverlay />}
        {!loading && !error && <ImmersiveSceneOverlay />}
        <LayerControls />
        <InfoPanel />
        <Timeline />
      </main>
      <BottomNav />
      <SearchDialog />
      <AttributionDrawer />
    </div>
  );
}
