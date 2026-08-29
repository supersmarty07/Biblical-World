import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const packIds = ['genesis', 'exodus-judges', 'united-monarchy', 'divided-kingdom', 'exile-restoration', 'second-temple', 'gospels', 'acts-paul', 'revelation'];
const labels = {
  genesis: 'Genesis',
  'exodus-judges': 'Exodus → Judges',
  'united-monarchy': 'Ruth → United Monarchy',
  'divided-kingdom': 'Divided Kingdom + Prophets',
  'exile-restoration': 'Exile → Restoration',
  'second-temple': 'Second Temple / Intertestamental',
  gospels: 'Gospels',
  'acts-paul': 'Acts + Paul',
  revelation: 'Revelation'
};
const read = (pack, file) => fs.readFile(path.join(root, 'public', 'data', pack, file), 'utf8').then(JSON.parse);
const packageJson = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));

const packs = [];
for (const id of packIds) {
  const [places, people, events, journeys, stories, sources, regions, visionaryScenes] = await Promise.all([
    read(id, 'places.json'), read(id, 'people.json'), read(id, 'events.json'), read(id, 'journeys.json'),
    read(id, 'stories.json'), read(id, 'sources.json'), read(id, 'context-regions.geojson'),
    id === 'revelation' ? read(id, 'visionary-scenes.json') : Promise.resolve([])
  ]);
  packs.push({
    id,
    label: labels[id],
    counts: {
      places: places.length,
      people: people.length,
      events: events.length,
      journeys: journeys.length,
      stories: stories.length,
      sources: sources.length,
      regions: regions.features?.length || 0,
      visionaryScenes: visionaryScenes.length
    }
  });
}

const totals = Object.fromEntries(Object.keys(packs[0].counts).map((key) => [key, packs.reduce((sum, pack) => sum + pack.counts[key], 0)]));
const manifest = { schemaVersion: 1, atlasVersion: packageJson.version, packs, totals };
const outDir = path.join(root, 'public', 'data', 'generated');
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, 'content-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Built content manifest for ${packs.length} packs (${totals.places} places, ${totals.stories} stories).`);
