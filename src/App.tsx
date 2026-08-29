import { useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { InfoPanel } from './components/InfoPanel';
import { LayerControls } from './components/LayerControls';
import { MapView } from './components/MapView';
import { SearchDialog } from './components/SearchDialog';
import { Timeline } from './components/Timeline';
import { TopBar } from './components/TopBar';
import { VisionaryOverlay } from './components/VisionaryOverlay';
import { loadAtlasData } from './data/load';
import { useAtlasStore } from './state/useAtlasStore';

export default function App() {
  const loading = useAtlasStore((s) => s.loading);
  const error = useAtlasStore((s) => s.error);
  const setData = useAtlasStore((s) => s.setData);
  const setError = useAtlasStore((s) => s.setError);

  useEffect(() => {
    void loadAtlasData().then(setData).catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)));
  }, [setData, setError]);

  return (
    <div className="app-shell">
      <TopBar />
      <main className="workspace">
        {loading && <div className="loading-screen"><div className="loading-orbit" /><strong>Opening the ancient world…</strong></div>}
        {error && <div className="error-screen"><strong>Atlas data could not load.</strong><span>{error}</span></div>}
        {!loading && !error && <MapView />}
        {!loading && !error && <VisionaryOverlay />}
        <LayerControls />
        <InfoPanel />
        <Timeline />
      </main>
      <BottomNav />
      <SearchDialog />
    </div>
  );
}
