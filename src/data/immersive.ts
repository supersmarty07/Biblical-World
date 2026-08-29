import type { ImmersiveScene, ImmersiveSceneCatalogEntry } from '../types/immersive';
import { immersiveSceneCatalogSchema, immersiveSceneSchema } from './immersiveSchema';

const base = import.meta.env.BASE_URL;
let catalogPromise: Promise<ImmersiveSceneCatalogEntry[]> | undefined;
const sceneCache = new Map<string, Promise<ImmersiveScene>>();

async function getJson(path: string): Promise<unknown> {
  const response = await fetch(`${base}${path}`);
  if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
  return response.json() as Promise<unknown>;
}

export function loadImmersiveSceneCatalog(): Promise<ImmersiveSceneCatalogEntry[]> {
  catalogPromise ??= getJson('data/immersive/manifest.json').then((raw) => immersiveSceneCatalogSchema.parse(raw).scenes as ImmersiveSceneCatalogEntry[]);
  return catalogPromise;
}

export function loadImmersiveScene(entry: ImmersiveSceneCatalogEntry): Promise<ImmersiveScene> {
  const cached = sceneCache.get(entry.id);
  if (cached) return cached;
  const request = getJson(entry.scenePath).then((raw) => {
    const scene = immersiveSceneSchema.parse(raw) as ImmersiveScene;
    if (scene.id !== entry.id) throw new Error(`Scene id mismatch for ${entry.id}`);
    if (scene.renderer !== entry.renderer) throw new Error(`Scene renderer mismatch for ${entry.id}`);
    return scene;
  });
  sceneCache.set(entry.id, request);
  request.catch(() => sceneCache.delete(entry.id));
  return request;
}
