import type { AtlasData } from '../types/domain';
import type { ImmersiveSceneCatalogEntry } from '../types/immersive';

export interface SearchDocument {
  id: string;
  kind: 'place' | 'story' | 'person' | 'event' | 'journey' | 'scene';
  name: string;
  summary: string;
  aliases: string;
  scripture: string;
  date: string;
}

export interface SearchHit extends SearchDocument {
  score: number;
}

const SEARCH_FIELDS: Array<{ key: keyof Pick<SearchDocument, 'name' | 'summary' | 'aliases' | 'scripture' | 'date'>; weight: number }> = [
  { key: 'name', weight: 12 },
  { key: 'aliases', weight: 7 },
  { key: 'scripture', weight: 5 },
  { key: 'date', weight: 4 },
  { key: 'summary', weight: 2 }
];

function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/[^a-z0-9\s:'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function words(value: string): string[] {
  return normalize(value).split(/[\s:'-]+/).filter(Boolean);
}

function levenshteinAtMostTwo(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;
  const previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    let rowMin = current[0];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      rowMin = Math.min(rowMin, current[j]);
    }
    if (rowMin > 2) return 3;
    for (let j = 0; j < current.length; j += 1) previous[j] = current[j];
  }
  return previous[b.length];
}

function tokenScore(token: string, rawField: string, weight: number): number {
  const field = normalize(rawField);
  if (!field) return 0;
  if (field === token) return weight * 6;
  const fieldWords = words(field);
  if (fieldWords.includes(token)) return weight * 5;
  if (fieldWords.some((word) => word.startsWith(token))) return weight * 4;
  if (field.includes(token)) return weight * 2.5;
  if (token.length >= 4) {
    const distance = fieldWords.reduce((best, word) => Math.min(best, levenshteinAtMostTwo(token, word)), 3);
    if (distance === 1) return weight * 1.75;
    if (distance === 2 && token.length >= 6) return weight * 0.85;
  }
  return 0;
}

export function buildSearchDocuments(data: AtlasData, sceneCatalog: ImmersiveSceneCatalogEntry[] = []): SearchDocument[] {
  const placeMap = new Map(data.places.map((place) => [place.id, place.name]));
  return [
    ...data.places.map((place) => ({
      id: place.id,
      kind: 'place' as const,
      name: place.name,
      summary: place.summary,
      aliases: place.aliases.join(' '),
      scripture: [...place.scripture.map((ref) => ref.label), ...(place.textualReferences || []).map((ref) => ref.label)].join(' '),
      date: ''
    })),
    ...data.people.map((person) => ({
      id: person.id,
      kind: 'person' as const,
      name: person.name,
      summary: person.summary,
      aliases: person.aliases.join(' '),
      scripture: [...person.scripture.map((ref) => ref.label), ...(person.textualReferences || []).map((ref) => ref.label)].join(' '),
      date: ''
    })),
    ...data.events.map((event) => ({
      id: event.id,
      kind: 'event' as const,
      name: event.title,
      summary: event.summary,
      aliases: '',
      scripture: [...event.scripture.map((ref) => ref.label), ...(event.textualReferences || []).map((ref) => ref.label)].join(' '),
      date: event.dating?.label || ''
    })),
    ...data.stories.map((story) => ({
      id: story.id,
      kind: 'story' as const,
      name: story.title,
      summary: story.subtitle,
      aliases: story.chapters.map((chapter) => chapter.title).join(' '),
      scripture: story.chapters.flatMap((chapter) => [...chapter.scripture.map((ref) => ref.label), ...(chapter.textualReferences || []).map((ref) => ref.label)]).join(' '),
      date: story.chapters
        .filter((chapter) => chapter.contextYear !== undefined)
        .map((chapter) => `${Math.abs(chapter.contextYear!)} ${chapter.contextYear! < 0 ? 'BCE BC' : 'CE AD'}`)
        .join(' ')
    })),
    ...data.journeys.map((journey) => ({
      id: journey.id,
      kind: 'journey' as const,
      name: journey.name,
      summary: journey.summary,
      aliases: [journey.person, journey.personId || '', ...journey.segments.flatMap((segment) => [placeMap.get(segment.fromPlaceId) || segment.fromPlaceId, placeMap.get(segment.toPlaceId) || segment.toPlaceId])].join(' '),
      scripture: journey.segments.flatMap((segment) => segment.scripture.map((ref) => ref.label)).join(' '),
      date: ''
    })),
    ...sceneCatalog.map((scene) => ({
      id: scene.id,
      kind: 'scene' as const,
      name: scene.title,
      summary: scene.summary,
      aliases: [scene.subtitle, ...scene.tags, ...scene.placeIds.map((id) => placeMap.get(id) || id)].join(' '),
      scripture: '',
      date: ''
    }))
  ];
}

export class StaticSearchEngine {
  constructor(private readonly documents: SearchDocument[]) {}

  search(rawQuery: string, limit = 12): SearchHit[] {
    const query = normalize(rawQuery);
    const tokens = words(query);
    if (!query || tokens.length === 0) return [];

    const hits: SearchHit[] = [];
    for (const document of this.documents) {
      let score = 0;
      let matchesEveryToken = true;

      for (const token of tokens) {
        let bestTokenScore = 0;
        for (const field of SEARCH_FIELDS) {
          bestTokenScore = Math.max(bestTokenScore, tokenScore(token, document[field.key], field.weight));
        }
        if (bestTokenScore === 0) {
          matchesEveryToken = false;
          break;
        }
        score += bestTokenScore;
      }

      if (!matchesEveryToken) continue;
      const normalizedName = normalize(document.name);
      const normalizedAliases = normalize(document.aliases);
      if (normalizedName === query) score += 120;
      else if (normalizedName.startsWith(query)) score += 60;
      else if (normalizedName.includes(query)) score += 35;
      if (normalizedAliases.includes(query)) score += 18;

      hits.push({ ...document, score });
    }

    return hits
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, limit);
  }
}

export async function loadOrBuildSearch(data: AtlasData, sceneCatalog: ImmersiveSceneCatalogEntry[] = []): Promise<StaticSearchEngine> {
  // Atlas data is already resident in memory before search opens. Building the small
  // deterministic index here avoids a second ~280 KB network fetch. The build-time
  // search corpus remains available as a QA/export artifact.
  return new StaticSearchEngine(buildSearchDocuments(data, sceneCatalog));
}
