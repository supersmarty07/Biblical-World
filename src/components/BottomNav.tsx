import { useAtlasStore } from '../state/useAtlasStore';
import { BookIcon, InfoIcon, LayersIcon, SearchIcon } from './Icons';

export function BottomNav() {
  const setSearchOpen = useAtlasStore((s) => s.setSearchOpen);
  const setInfoOpen = useAtlasStore((s) => s.setInfoOpen);
  const openStory = useAtlasStore((s) => s.openStory);

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <button onClick={() => setSearchOpen(true)}><SearchIcon /><span>Search</span></button>
      <button onClick={() => { openStory(undefined); setInfoOpen(true); }}><BookIcon /><span>Stories</span></button>
      <button onClick={() => document.getElementById('layer-panel')?.scrollIntoView({ behavior: 'smooth' })}><LayersIcon /><span>Layers</span></button>
      <button onClick={() => setInfoOpen(true)}><InfoIcon /><span>Info</span></button>
    </nav>
  );
}
