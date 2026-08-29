import type { AtlasData, EventRecord, JourneyRecord, PersonRecord, PlaceRecord, SourceRef, StoryRecord, VisionaryScene } from '../types/domain';
import { eventRecordSchema, journeyRecordSchema, personRecordSchema, placeRecordSchema, regionsSchema, sourceRefSchema, storyRecordSchema, visionarySceneSchema } from './schema';

const base = import.meta.env.BASE_URL;
const fallbackContentPacks = ['genesis', 'exodus-judges', 'united-monarchy', 'divided-kingdom', 'exile-restoration', 'second-temple', 'gospels', 'acts-paul', 'revelation'] as const;

async function getJson(path: string): Promise<unknown> {
  const response = await fetch(`${base}${path}`);
  if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
  return response.json() as Promise<unknown>;
}

async function loadPackIds(): Promise<string[]> {
  try {
    const raw = await getJson('data/generated/content-manifest.json') as { packs?: Array<{ id?: unknown }> };
    const ids = raw.packs?.map((pack) => pack.id).filter((id): id is string => typeof id === 'string' && /^[a-z0-9-]+$/.test(id));
    if (!ids?.length) throw new Error('Manifest has no valid pack ids');
    return ids;
  } catch {
    return [...fallbackContentPacks];
  }
}

async function loadPack(packId: string): Promise<AtlasData> {
  const packPath = `data/${packId}`;
  const visionaryPromise = packId === 'revelation' ? getJson(`${packPath}/visionary-scenes.json`) : Promise.resolve([]);
  const [placesRaw, journeysRaw, storiesRaw, peopleRaw, eventsRaw, sourcesRaw, regionsRaw, visionaryRaw] = await Promise.all([
    getJson(`${packPath}/places.json`),
    getJson(`${packPath}/journeys.json`),
    getJson(`${packPath}/stories.json`),
    getJson(`${packPath}/people.json`),
    getJson(`${packPath}/events.json`),
    getJson(`${packPath}/sources.json`),
    getJson(`${packPath}/context-regions.geojson`),
    visionaryPromise
  ]);

  return {
    places: placeRecordSchema.array().parse(placesRaw) as PlaceRecord[],
    journeys: journeyRecordSchema.array().parse(journeysRaw) as JourneyRecord[],
    stories: storyRecordSchema.array().parse(storiesRaw) as StoryRecord[],
    people: personRecordSchema.array().parse(peopleRaw) as PersonRecord[],
    events: eventRecordSchema.array().parse(eventsRaw) as EventRecord[],
    sources: sourceRefSchema.array().parse(sourcesRaw) as SourceRef[],
    regions: regionsSchema.parse(regionsRaw) as GeoJSON.FeatureCollection,
    visionaryScenes: visionarySceneSchema.array().parse(visionaryRaw) as VisionaryScene[]
  };
}

function assertUnique<T extends { id: string }>(items: T[], label: string): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`Duplicate ${label} id across content packs: ${item.id}`);
    seen.add(item.id);
  }
}

export async function loadAtlasData(): Promise<AtlasData> {
  const packIds = await loadPackIds();
  const packs = await Promise.all(packIds.map(loadPack));
  const merged: AtlasData = {
    places: packs.flatMap((pack) => pack.places),
    journeys: packs.flatMap((pack) => pack.journeys),
    stories: packs.flatMap((pack) => pack.stories),
    people: packs.flatMap((pack) => pack.people),
    events: packs.flatMap((pack) => pack.events),
    sources: packs.flatMap((pack) => pack.sources),
    regions: { type: 'FeatureCollection', features: packs.flatMap((pack) => pack.regions.features) },
    visionaryScenes: packs.flatMap((pack) => pack.visionaryScenes)
  };

  assertUnique(merged.places, 'place');
  assertUnique(merged.journeys, 'journey');
  assertUnique(merged.stories, 'story');
  assertUnique(merged.people, 'person');
  assertUnique(merged.events, 'event');
  assertUnique(merged.sources, 'source');
  assertUnique(merged.visionaryScenes, 'visionary scene');
  return merged;
}
