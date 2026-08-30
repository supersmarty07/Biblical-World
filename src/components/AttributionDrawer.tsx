import { useEffect, useMemo, useRef, useState } from 'react';
import { atlasConfig } from '../config';
import { loadV2AssetManifest } from '../data/assets';
import { loadVerificationRegistry } from '../data/verification';
import { useAtlasStore } from '../state/useAtlasStore';
import type { V2AssetManifest } from '../types/assets';
import type { VerificationRegistry, VerificationResource } from '../types/verification';
import { CloseIcon, InfoIcon } from './Icons';

function activeResourceIds(manifest?: V2AssetManifest): Set<string> {
  const ids = new Set<string>(['natural-earth', 'pleiades', 'wikidata']);
  if (atlasConfig.hasAnyTerrain) ids.add('copernicus-glo30');
  if (atlasConfig.romanRoadsGeojsonUrl) ids.add(atlasConfig.romanRoadsSourceId);
  for (const asset of manifest?.assets || []) {
    if (asset.status === 'installed' || asset.status === 'configured-external') {
      asset.sourceResourceIds.forEach((id) => ids.add(id));
    }
  }
  return ids;
}

function ResourceCredit({ resource }: { resource: VerificationResource }) {
  return <article className="attribution-credit">
    <div><strong>{resource.name}</strong><span>{resource.license}</span></div>
    <p>{resource.attribution}</p>
    <div className="attribution-credit__links">
      <a href={resource.sourceUrl} target="_blank" rel="noreferrer">Source</a>
      <a href={resource.licenseUrl} target="_blank" rel="noreferrer">License</a>
    </div>
  </article>;
}

export function AttributionDrawer() {
  const open = useAtlasStore((s) => s.attributionOpen);
  const setOpen = useAtlasStore((s) => s.setAttributionOpen);
  const [registry, setRegistry] = useState<VerificationRegistry>();
  const [manifest, setManifest] = useState<V2AssetManifest>();
  const [error, setError] = useState<string>();
  const drawerRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => drawerRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return; }
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = [...drawerRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter((node) => !node.hasAttribute('hidden'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      restoreFocusRef.current?.focus();
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (!open || registry) return;
    void Promise.all([loadVerificationRegistry(), loadV2AssetManifest()])
      .then(([nextRegistry, nextManifest]) => { setRegistry(nextRegistry); setManifest(nextManifest); })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)));
  }, [open, registry]);

  const credits = useMemo(() => {
    if (!registry) return [];
    const ids = activeResourceIds(manifest);
    return registry.resources.filter((resource) => ids.has(resource.id));
  }, [manifest, registry]);

  if (!open) return null;
  return <div className="attribution-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
    <aside ref={drawerRef} tabIndex={-1} className="attribution-drawer" role="dialog" aria-modal="true" aria-labelledby="attribution-title">
      <button className="icon-button attribution-drawer__close" onClick={() => setOpen(false)} aria-label="Close sources and data credits"><CloseIcon /></button>
      <header><InfoIcon /><span className="eyebrow">Sources, data & reconstruction</span><h2 id="attribution-title">What this atlas is built from</h2></header>
      <p className="attribution-drawer__intro">Only resources actually used by this build are listed as active credits. Historical interpretation, tradition, and artistic reconstruction remain separate from measured terrain or excavated evidence.</p>
      {error && <p className="demo-banner" role="alert">Credits could not load: {error}</p>}
      {credits.map((resource) => <ResourceCredit key={resource.id} resource={resource} />)}
      {atlasConfig.basemapPmtilesUrl && <article className="attribution-credit"><div><strong>External basemap</strong><span>Configured runtime layer</span></div><p>{atlasConfig.basemapAttribution}</p></article>}
      {(atlasConfig.basemapConfigurationWarning || atlasConfig.romanRoadsConfigurationWarning) && <p className="demo-banner" role="status">{atlasConfig.basemapConfigurationWarning || atlasConfig.romanRoadsConfigurationWarning}</p>}
      <section className="attribution-boundary"><strong>Research provenance</strong><p>{registry?.packet.note || 'Verification metadata is loaded from the project research registry.'}</p></section>
      <section className="attribution-boundary"><strong>Important boundary</strong><p>Modern DEM terrain is not ancient terrain. Derived coastlines, vegetation, buildings, and historical surfaces are reconstructions and must carry their own uncertainty metadata.</p></section>
      <p className="attribution-version">Asset registry: {atlasConfig.installedAssetVersion}</p>
    </aside>
  </div>;
}
