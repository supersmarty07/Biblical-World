import { atlasConfig } from '../config';
import { useAtlasStore } from '../state/useAtlasStore';
import { BookIcon, LayersIcon, SearchIcon } from './Icons';

export function TopBar() {
  const setSearchOpen = useAtlasStore((s) => s.setSearchOpen);
  const setInfoOpen = useAtlasStore((s) => s.setInfoOpen);
  const openStory = useAtlasStore((s) => s.openStory);

  return (
    <header className="topbar">
      <div className="brand" aria-label={`${atlasConfig.title}, ${atlasConfig.subtitle}`}>
        <div className="brand__mark">BW</div>
        <div><div className="brand__title">{atlasConfig.title}</div><div className="brand__subtitle">Genesis → Revelation · Complete Atlas</div></div>
      </div>
      <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search atlas">
        <SearchIcon /><span>Search places, people, events, Scripture…</span><kbd>/</kbd>
      </button>
      <div className="topbar__actions">
        <button className="icon-button" aria-label="Open guided biblical stories" onClick={() => { openStory(undefined); setInfoOpen(true); }}><BookIcon /></button>
        <button className="icon-button topbar__layers" aria-label="Map layers" onClick={() => document.getElementById('layer-panel')?.focus()}><LayersIcon /></button>
      </div>
    </header>
  );
}
