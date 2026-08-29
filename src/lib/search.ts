import MiniSearch from 'minisearch';
import type { AtlasData } from '../types/domain';

export interface SearchDocument {
  id: string;
  kind: 'place' | 'story' | 'person' | 'event';
  name: string;
  summary: string;
  aliases: string;
  scripture: string;
  date: string;
}

const options = {
  fields: ['name', 'summary', 'aliases', 'scripture', 'date'],
  storeFields: ['id', 'kind', 'name', 'summary']
};

export function buildSearch(data: AtlasData): MiniSearch<SearchDocument> {
  const engine = new MiniSearch<SearchDocument>(options);
  const docs: SearchDocument[] = [
    ...data.places.map((place) => ({
      id: place.id, kind: 'place' as const, name: place.name, summary: place.summary,
      aliases: place.aliases.join(' '), scripture: [...place.scripture.map((ref) => ref.label), ...(place.textualReferences || []).map((ref) => ref.label)].join(' '), date: ''
    })),
    ...data.people.map((person) => ({
      id: person.id, kind: 'person' as const, name: person.name, summary: person.summary,
      aliases: person.aliases.join(' '), scripture: [...person.scripture.map((ref) => ref.label), ...(person.textualReferences || []).map((ref) => ref.label)].join(' '), date: ''
    })),
    ...data.events.map((event) => ({
      id: event.id, kind: 'event' as const, name: event.title, summary: event.summary,
      aliases: '', scripture: [...event.scripture.map((ref) => ref.label), ...(event.textualReferences || []).map((ref) => ref.label)].join(' '), date: event.dating?.label || ''
    })),
    ...data.stories.map((story) => ({
      id: story.id, kind: 'story' as const, name: story.title, summary: story.subtitle,
      aliases: story.chapters.map((chapter) => chapter.title).join(' '),
      scripture: story.chapters.flatMap((chapter) => [...chapter.scripture.map((ref) => ref.label), ...(chapter.textualReferences || []).map((ref) => ref.label)]).join(' '), date: story.chapters.filter((chapter) => chapter.contextYear !== undefined).map((chapter) => String(Math.abs(chapter.contextYear!)) + (chapter.contextYear! < 0 ? ' BCE BC' : ' CE AD')).join(' ')
    }))
  ];
  engine.addAll(docs);
  return engine;
}

export async function loadOrBuildSearch(data: AtlasData): Promise<MiniSearch<SearchDocument>> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/generated/search-index.json`);
    if (!response.ok) throw new Error('No generated search index');
    const serialized = await response.text();
    return MiniSearch.loadJSON<SearchDocument>(serialized, options);
  } catch {
    return buildSearch(data);
  }
}
