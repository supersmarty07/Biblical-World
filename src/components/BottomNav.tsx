import { useAtlasStore } from '../state/useAtlasStore';
import { BookIcon, InfoIcon, LayersIcon, RouteIcon, SearchIcon } from './Icons';

export function BottomNav() {
  const setSearchOpen = useAtlasStore((s) => s.setSearchOpen);
  const setInfoOpen = useAtlasStore((s) => s.setInfoOpen);
  const openStory = useAtlasStore((s) => s.openStory);
  const openJourney = useAtlasStore((s) => s.openJourney);
  const setAttributionOpen = useAtlasStore((s) => s.setAttributionOpen);

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <button onClick={() => setSearchOpen(true)}><SearchIcon /><span>Search</span></button>
      <button onClick={() => { openStory(undefined); setInfoOpen(true); }}><BookIcon /><span>Stories</span></button>
      <button onClick={() => openJourney(undefined)}><RouteIcon /><span>Journeys</span></button>
      <button onClick={() => document.getElementById('layer-panel')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}><LayersIcon /><span>Layers</span></button>
      <button onClick={() => setAttributionOpen(true)}><InfoIcon /><span>Credits</span></button>
    </nav>
  );
}
