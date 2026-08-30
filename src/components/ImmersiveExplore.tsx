import { useMemo } from 'react';
import { useAtlasStore } from '../state/useAtlasStore';
import { MapPinIcon, PlayIcon } from './Icons';

type WorldCard = {
  sceneId: string;
  region: string;
  title: string;
  period: string;
  kicker: string;
  summary: string;
  art: string[];
  accent: string;
  mode: string;
};

const worlds: WorldCard[] = [
  {
    sceneId: 'jerusalem-historical-terrain',
    region: 'Jerusalem',
    title: 'Jerusalem Through Time',
    period: '1000 BCE → 70 CE',
    kicker: 'Flagship world',
    summary: 'Move between a 3D site map and an animated reconstruction of Jerusalem’s ridges, valleys, archaeology, and changing city.',
    art: ['jerusalem/sky.svg', 'jerusalem/hills.svg', 'jerusalem/city.svg', 'jerusalem/foreground.svg'],
    accent: 'jerusalem',
    mode: '3D map + animated reconstruction'
  },
  {
    sceneId: 'galilee-ministry-landscape',
    region: 'Galilee',
    title: 'The Galilee of Jesus',
    period: 'c. 30 CE',
    kicker: 'Lake & ministry world',
    summary: 'Explore Capernaum, Magdala, the Sea of Galilee, and Bethsaida candidates through geographic evidence and cinematic reconstruction.',
    art: ['galilee/sky.svg', 'galilee/hills.svg', 'galilee/water.svg', 'galilee/foreground.svg'],
    accent: 'galilee',
    mode: 'Animated lake world + 3D sites'
  },
  {
    sceneId: 'megiddo-terrain-prototype',
    region: 'Megiddo / Jezreel',
    title: 'Megiddo & the Great Valley',
    period: 'Bronze → Iron Age',
    kicker: 'Strategic landscape',
    summary: 'See why the tel, pass, and Jezreel basin mattered, with chronology-aware archaeology and a switchable reconstructed landscape.',
    art: ['megiddo/sky.svg', 'megiddo/valley.svg', 'megiddo/tel.svg', 'megiddo/foreground.svg'],
    accent: 'megiddo',
    mode: '3D tel + animated Iron Age landscape'
  },
  {
    sceneId: 'sinai-wilderness-prototype',
    region: 'Sinai / Exodus',
    title: 'Wilderness & Exodus Environment',
    period: 'Late Bronze setting',
    kicker: 'Environment-first world',
    summary: 'Enter the wadis and mountain landscapes of Sinai without turning debated routes or Mount Sinai proposals into false certainty.',
    art: ['sinai/sky.svg', 'sinai/far-mountains.svg', 'sinai/near-mountains.svg', 'sinai/foreground.svg'],
    accent: 'sinai',
    mode: 'Animated wilderness + 3D candidates'
  }
];

function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}assets/immersive/${path}`;
}

export function ImmersiveExplore() {
  const open = useAtlasStore((s) => s.immersiveExploreOpen);
  const setOpen = useAtlasStore((s) => s.setImmersiveExploreOpen);
  const openScene = useAtlasStore((s) => s.openScene);
  const catalog = useAtlasStore((s) => s.sceneCatalog);
  const available = useMemo(() => new Set(catalog.map((entry) => entry.id)), [catalog]);

  if (!open) return null;

  return (
    <section className="immersive-explore" aria-label="Explore immersive biblical worlds">
      <div className="immersive-explore__scroll">
        <header className="immersive-explore__intro">
          <span className="eyebrow">The Biblical World · immersive atlas</span>
          <h1>Step into the biblical world.</h1>
          <p>Explore real geography, known archaeology, historical inference, and artistic reconstruction without hiding the difference between them.</p>
          <div className="immersive-explore__legend" aria-label="Evidence boundary">
            <span><i className="explore-dot explore-dot--terrain" />Real terrain</span>
            <span><i className="explore-dot explore-dot--archaeology" />Known archaeology</span>
            <span><i className="explore-dot explore-dot--reconstruction" />Artistic reconstruction</span>
          </div>
        </header>

        <div className="immersive-explore__grid">
          {worlds.map((world, index) => {
            const enabled = available.has(world.sceneId);
            return (
              <button
                type="button"
                className={`world-card world-card--${world.accent} ${index === 0 ? 'world-card--hero' : ''}`}
                key={world.sceneId}
                onClick={() => enabled && openScene(world.sceneId)}
                disabled={!enabled}
                aria-label={`Enter ${world.title}`}
              >
                <span className="world-card__art" aria-hidden="true">
                  {world.art.map((src, layer) => <img key={src} src={assetUrl(src)} alt="" loading={index === 0 && layer < 2 ? 'eager' : 'lazy'} decoding="async" />)}
                  <span className="world-card__shade" />
                </span>
                <span className="world-card__content">
                  <span className="world-card__meta"><b>{world.kicker}</b><em>{world.period}</em></span>
                  <strong>{world.title}</strong>
                  <small>{world.summary}</small>
                  <span className="world-card__enter"><PlayIcon /> Enter world</span>
                  <span className="world-card__mode">{world.mode}</span>
                </span>
              </button>
            );
          })}
        </div>

        <button type="button" className="immersive-explore__map-button" onClick={() => setOpen(false)}>
          <MapPinIcon />
          <span><strong>Open the atlas map</strong><small>Browse all 405 places, journeys, periods, and evidence layers.</small></span>
        </button>
        <p className="immersive-explore__footnote">Reconstructions are explanatory visualizations, not photographs of the past. Every immersive world keeps evidence, inference, tradition, and uncertainty visibly separate.</p>
      </div>
    </section>
  );
}
