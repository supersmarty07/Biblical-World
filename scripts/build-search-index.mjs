import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const packNames = ['genesis', 'exodus-judges', 'united-monarchy', 'divided-kingdom', 'exile-restoration', 'second-temple', 'gospels', 'acts-paul', 'revelation'];
const outDir = path.join(root, 'public', 'data', 'generated');
const read = (pack, name) => fs.readFile(path.join(root, 'public', 'data', pack, name), 'utf8').then(JSON.parse);

const packs = await Promise.all(packNames.map(async (pack) => ({
  places: await read(pack, 'places.json'),
  people: await read(pack, 'people.json'),
  events: await read(pack, 'events.json'),
  stories: await read(pack, 'stories.json'),
  journeys: await read(pack, 'journeys.json')
})));

const immersiveManifest = JSON.parse(await fs.readFile(path.join(root, 'public', 'data', 'immersive', 'manifest.json'), 'utf8'));
const immersiveScenes = immersiveManifest.scenes || [];
const allPlaces = packs.flatMap((pack) => pack.places);
const placeMap = new Map(allPlaces.map((place) => [place.id, place.name]));

const docs = [
  ...packs.flatMap((pack) => pack.places).map((place) => ({
    id: place.id,
    kind: 'place',
    name: place.name,
    summary: place.summary,
    aliases: (place.aliases || []).join(' '),
    scripture: [...(place.scripture || []).map((ref) => ref.label), ...(place.textualReferences || []).map((ref) => ref.label)].join(' '),
    date: ''
  })),
  ...packs.flatMap((pack) => pack.people).map((person) => ({
    id: person.id,
    kind: 'person',
    name: person.name,
    summary: person.summary,
    aliases: (person.aliases || []).join(' '),
    scripture: [...(person.scripture || []).map((ref) => ref.label), ...(person.textualReferences || []).map((ref) => ref.label)].join(' '),
    date: ''
  })),
  ...packs.flatMap((pack) => pack.events).map((event) => ({
    id: event.id,
    kind: 'event',
    name: event.title,
    summary: event.summary,
    aliases: '',
    scripture: [...(event.scripture || []).map((ref) => ref.label), ...(event.textualReferences || []).map((ref) => ref.label)].join(' '),
    date: event.dating?.label || ''
  })),
  ...packs.flatMap((pack) => pack.stories).map((story) => ({
    id: story.id,
    kind: 'story',
    name: story.title,
    summary: story.subtitle,
    aliases: (story.chapters || []).map((chapter) => chapter.title).join(' '),
    scripture: (story.chapters || []).flatMap((chapter) => [...(chapter.scripture || []).map((ref) => ref.label), ...(chapter.textualReferences || []).map((ref) => ref.label)]).join(' '),
    date: (story.chapters || [])
      .filter((chapter) => chapter.contextYear !== undefined)
      .map((chapter) => `${Math.abs(chapter.contextYear)} ${chapter.contextYear < 0 ? 'BCE BC' : 'CE AD'}`)
      .join(' ')
  })),
  ...packs.flatMap((pack) => pack.journeys).map((journey) => ({
    id: journey.id,
    kind: 'journey',
    name: journey.name,
    summary: journey.summary,
    aliases: [journey.person, journey.personId || '', ...(journey.segments || []).flatMap((segment) => [placeMap.get(segment.fromPlaceId) || segment.fromPlaceId, placeMap.get(segment.toPlaceId) || segment.toPlaceId])].join(' '),
    scripture: (journey.segments || []).flatMap((segment) => (segment.scripture || []).map((ref) => ref.label)).join(' '),
    date: ''
  })),
  ...immersiveScenes.map((scene) => ({
    id: scene.id,
    kind: 'scene',
    name: scene.title,
    summary: scene.summary,
    aliases: [scene.subtitle, ...(scene.tags || []), ...(scene.placeIds || []).map((id) => placeMap.get(id) || id)].join(' '),
    scripture: '',
    date: ''
  }))
];

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, 'search-documents.json'), JSON.stringify(docs));
console.log(`Built dependency-free static search corpus with ${docs.length} documents across ${packNames.length} content packs.`);
