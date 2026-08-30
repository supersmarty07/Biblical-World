import { atlasConfig } from '../config';
import { useAtlasStore } from '../state/useAtlasStore';
import { BookIcon, InfoIcon, LayersIcon, RouteIcon, SearchIcon } from './Icons';

export function TopBar() {
  const setSearchOpen = useAtlasStore((s) => s.setSearchOpen);
  const setInfoOpen = useAtlasStore((s) => s.setInfoOpen);
  const openStory = useAtlasStore((s) => s.openStory);
  const openJourney = useAtlasStore((s) => s.openJourney);
  const setAttributionOpen = useAtlasStore((s) => s.setAttributionOpen);
  const setImmersiveExploreOpen = useAtlasStore((s) => s.setImmersiveExploreOpen);

  return (
    <header className="topbar">
      <button className="brand brand--button" aria-label={`${atlasConfig.title}. Open immersive worlds.`} onClick={() => setImmersiveExploreOpen(true)}>
        <div className="brand__mark">BW</div>
        <div><div className="brand__title">{atlasConfig.title}</div><div className="brand__subtitle">Genesis → Revelation · V2 Immersive Preview</div></div>
      </button>
      <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search atlas">
        <SearchIcon /><span>Search places, journeys, scenes, Scripture…</span><kbd>/</kbd>
      </button>
      <div className="topbar__actions">
        <button className="icon-button" aria-label="Open guided biblical stories" onClick={() => { openStory(undefined); setInfoOpen(true); }}><BookIcon /></button>
        <button className="icon-button" aria-label="Follow biblical journeys" onClick={() => openJourney(undefined)}><RouteIcon /></button>
        <button className="icon-button" aria-label="Sources, data, and reconstruction credits" onClick={() => setAttributionOpen(true)}><InfoIcon /></button>
        <button className="icon-button topbar__layers" aria-label="Map layers" onClick={() => document.getElementById('layer-panel')?.focus()}><LayersIcon /></button>
      </div>
    </header>
  );
}
