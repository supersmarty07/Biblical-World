import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const readJson = async (file) => JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
const errors = [];
const fail = (message) => errors.push(message);

const manifest = await readJson('public/data/immersive/manifest.json');
const gospelPlaces = await readJson('public/data/gospels/places.json');
const gospelStories = await readJson('public/data/gospels/stories.json');
const sceneIds = new Set(manifest.scenes.map((scene) => scene.id));
const requiredScenes = ['galilee-ministry-landscape', 'northern-ministry-transfiguration', 'judean-wilderness-eastern-approach'];
for (const id of requiredScenes) if (!sceneIds.has(id)) fail(`missing Batch 5 scene ${id}`);

const place = (id) => gospelPlaces.find((item) => item.id === id);
for (const id of ['cana-galilee', 'bethsaida-gospels', 'bethany-beyond-jordan', 'mount-transfiguration']) {
  const record = place(id);
  if (!record) fail(`missing Gospel place ${id}`);
  else if ('coordinates' in record) fail(`${id} must remain intentionally unpinned`);
}
const beatitudes = place('mount-beatitudes-traditional');
if (!beatitudes || beatitudes.coordinateRole !== 'traditional-site') fail('Mount of Beatitudes must remain a traditional-site orientation');

const northern = await readJson('public/data/immersive/scenes/northern-ministry-transfiguration.json');
const optionById = new Map(northern.comparison?.options?.map((item) => [item.id, item]));
if (optionById.get('unnamed-mountain')?.status !== 'unknown') fail('Transfiguration mountain must remain unknown in the comparison scene');
if (optionById.get('tabor-tradition')?.status !== 'traditional') fail('Tabor must remain traditional in the Transfiguration comparison');
if (optionById.get('hermon-proposal')?.status !== 'possible') fail('Hermon must remain a possible proposal, not established');

const expectedStoryLinks = new Map([
  ['gal-cap', 'galilee-ministry-landscape'],
  ['sea-bethsaida', 'galilee-ministry-landscape'],
  ['north-mountain', 'northern-ministry-transfiguration'],
  ['fj-olives', 'judean-wilderness-eastern-approach'],
  ['jb-wilderness', 'judean-wilderness-eastern-approach']
]);
for (const story of gospelStories) {
  for (const chapter of story.chapters || []) {
    const expected = expectedStoryLinks.get(chapter.id);
    if (expected && chapter.immersiveSceneId !== expected) fail(`${story.id}/${chapter.id} must link to ${expected}`);
    if (chapter.immersiveSceneId && !sceneIds.has(chapter.immersiveSceneId)) fail(`${story.id}/${chapter.id} links to unknown scene ${chapter.immersiveSceneId}`);
  }
}

if (errors.length) {
  console.error(`V2 Batch 5 audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log('V2 Batch 5 audit passed: Gospel uncertainty guardrails and guided-story scene links are intact.');
