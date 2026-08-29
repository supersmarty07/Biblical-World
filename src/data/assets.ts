import type { V2AssetManifest } from '../types/assets';

let manifestPromise: Promise<V2AssetManifest> | undefined;

export function loadV2AssetManifest(): Promise<V2AssetManifest> {
  manifestPromise ??= fetch(`${import.meta.env.BASE_URL}data/assets/manifest.json`)
    .then(async (response) => {
      if (!response.ok) throw new Error(`V2 asset manifest failed to load (${response.status}).`);
      return await response.json() as V2AssetManifest;
    });
  return manifestPromise;
}
