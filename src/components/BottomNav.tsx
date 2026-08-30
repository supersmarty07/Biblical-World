import { useAtlasStore } from '../state/useAtlasStore';
import { BookIcon, LayersIcon, MapPinIcon, PlayIcon, RouteIcon } from './Icons';

export function BottomNav() {
  const setInfoOpen = useAtlasStore((s) => s.setInfoOpen);
  const openStory = useAtlasStore((s) => s.openStory);
  const openJourney = useAtlasStore((s) => s.openJourney);
  const immersiveExploreOpen = useAtlasStore((s) => s.immersiveExploreOpen);
  const mobileLayersOpen = useAtlasStore((s) => s.mobileLayersOpen);
  const setImmersiveExploreOpen = useAtlasStore((s) => s.setImmersiveExploreOpen);
  const setMobileLayersOpen = useAtlasStore((s) => s.setMobileLayersOpen);

  const showMap = () => {
    setImmersiveExploreOpen(false);
    setMobileLayersOpen(false);
    setInfoOpen(false);
  };

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <button className={immersiveExploreOpen ? 'is-active' : ''} onClick={() => setImmersiveExploreOpen(true)}><PlayIcon /><span>Explore</span></button>
      <button className={!immersiveExploreOpen && !mobileLayersOpen ? 'is-active' : ''} onClick={showMap}><MapPinIcon /><span>Map</span></button>
      <button onClick={() => { setImmersiveExploreOpen(false); setMobileLayersOpen(false); openStory(undefined); setInfoOpen(true); }}><BookIcon /><span>Stories</span></button>
      <button onClick={() => { setImmersiveExploreOpen(false); setMobileLayersOpen(false); openJourney(undefined); }}><RouteIcon /><span>Journeys</span></button>
      <button className={mobileLayersOpen ? 'is-active' : ''} onClick={() => setMobileLayersOpen(true)}><LayersIcon /><span>Layers</span></button>
    </nav>
  );
}
