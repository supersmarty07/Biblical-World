import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import MiniSearch from 'minisearch';

const root = process.cwd();
const packNames = ['genesis', 'exodus-judges', 'united-monarchy', 'divided-kingdom', 'exile-restoration', 'second-temple', 'gospels', 'acts-paul', 'revelation'];
const outDir = path.join(root, 'public', 'data', 'generated');
const read = (pack, name) => fs.readFile(path.join(root, 'public', 'data', pack, name), 'utf8').then(JSON.parse);

const packs = await Promise.all(packNames.map(async (pack) => ({
  places: await read(pack, 'places.json'),
  people: await read(pack, 'people.json'),
  events: await read(pack, 'events.json'),
  stories: await read(pack, 'stories.json')
})));
const places = packs.flatMap((p) => p.places);
const people = packs.flatMap((p) => p.people);
const events = packs.flatMap((p) => p.events);
const stories = packs.flatMap((p) => p.stories);

const options = {
  fields: ['name', 'summary', 'aliases', 'scripture', 'date'],
  storeFields: ['id', 'kind', 'name', 'summary']
};

const docs = [
  ...places.map((place) => ({
    id: place.id, kind: 'place', name: place.name, summary: place.summary,
    aliases: (place.aliases || []).join(' '), scripture: [...(place.scripture || []).map((ref) => ref.label), ...(place.textualReferences || []).map((ref) => ref.label)].join(' '), date: ''
  })),
  ...people.map((person) => ({
    id: person.id, kind: 'person', name: person.name, summary: person.summary,
    aliases: (person.aliases || []).join(' '), scripture: [...(person.scripture || []).map((ref) => ref.label), ...(person.textualReferences || []).map((ref) => ref.label)].join(' '), date: ''
  })),
  ...events.map((event) => ({
    id: event.id, kind: 'event', name: event.title, summary: event.summary,
    aliases: '', scripture: [...(event.scripture || []).map((ref) => ref.label), ...(event.textualReferences || []).map((ref) => ref.label)].join(' '), date: event.dating?.label || ''
  })),
  ...stories.map((story) => ({
    id: story.id, kind: 'story', name: story.title, summary: story.subtitle,
    aliases: (story.chapters || []).map((chapter) => chapter.title).join(' '),
    scripture: (story.chapters || []).flatMap((chapter) => [...(chapter.scripture || []).map((ref) => ref.label), ...(chapter.textualReferences || []).map((ref) => ref.label)]).join(' '), date: (story.chapters || []).filter((chapter) => chapter.contextYear !== undefined).map((chapter) => `${Math.abs(chapter.contextYear)} ${chapter.contextYear < 0 ? 'BCE BC' : 'CE AD'}`).join(' ')
  }))
];

const miniSearch = new MiniSearch(options);
miniSearch.addAll(docs);
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, 'search-index.json'), JSON.stringify(miniSearch));
console.log(`Built static Genesis → Revelation search index with ${docs.length} documents across ${packNames.length} content packs.`);
