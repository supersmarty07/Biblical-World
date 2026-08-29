import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const readJson = async (file) => JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
const errors = [];
const fail = (message) => errors.push(message);

const manifest = await readJson('public/data/immersive/manifest.json');
const sceneIds = new Set(manifest.scenes.map((scene) => scene.id));
const requiredScenes = [
  'babylon-imperial-city',
  'nineveh-assyrian-city',
  'persian-royal-centers',
  'ephesus-roman-city',
  'rome-paul-imperial-city',
  'patmos-historical-island'
];
for (const id of requiredScenes) {
  if (!sceneIds.has(id)) fail(`missing Batch 7 scene ${id}`);
  const entry = manifest.scenes.find((scene) => scene.id === id);
  if (entry?.availability !== 'prototype') fail(`${id} must remain prototype until external terrain/media verification is complete`);
}

const loadPlaces = async (pack) => new Map((await readJson(`public/data/${pack}/places.json`)).map((place) => [place.id, place]));
const genesisPlaces = await loadPlaces('genesis');
const dividedPlaces = await loadPlaces('divided-kingdom');
const exilePlaces = await loadPlaces('exile-restoration');
const actsPlaces = await loadPlaces('acts-paul');
const secondTemplePlaces = await loadPlaces('second-temple');
const revelationPlaces = await loadPlaces('revelation');

const babylon = genesisPlaces.get('babylon');
if (!babylon || babylon.coordinateRole !== 'identified-site') fail('Babylon city must remain an identified archaeological site');
if (babylon?.confidence?.historicalInterpretation === 'high') fail('Genesis Babel interpretation must not be silently promoted to high historical certainty');

const nineveh = dividedPlaces.get('nineveh');
if (!nineveh || nineveh.coordinateRole !== 'identified-site' || nineveh.confidence?.geographicIdentification !== 'established') fail('Nineveh must remain a securely identified city');

for (const id of ['susa', 'persepolis']) {
  const place = exilePlaces.get(id);
  if (!place || place.coordinateRole !== 'identified-site' || place.confidence?.geographicIdentification !== 'established') fail(`${id} must remain an established identified site`);
}

for (const id of ['hall-tyrannus', 'paul-lodging-rome', 'three-taverns']) {
  const place = actsPlaces.get(id);
  if (!place) fail(`missing Acts/Paul place ${id}`);
  else if ('coordinates' in place) fail(`${id} must remain intentionally unpinned`);
}
for (const id of ['ephesus', 'ephesus-theater', 'artemision-ephesus']) {
  const place = actsPlaces.get(id);
  if (!place || place.coordinateRole !== 'identified-site') fail(`${id} must remain an identified archaeological site`);
}
const rome = secondTemplePlaces.get('rome');
if (!rome || rome.coordinateRole !== 'identified-site') fail('Rome must remain an identified city');
const patmos = revelationPlaces.get('patmos');
if (!patmos || patmos.coordinateRole !== 'approximate-area' || patmos.confidence?.geographicIdentification !== 'established') fail('Patmos must remain established at island level using an approximate-area coordinate role');
const cave = revelationPlaces.get('cave-apocalypse-patmos');
if (!cave || cave.coordinateRole !== 'traditional-site' || cave.confidence?.geographicIdentification !== 'traditional') fail('Cave of the Apocalypse must remain traditional-site');
const visionaryBabylon = revelationPlaces.get('babylon-great-revelation');
if (!visionaryBabylon) fail('missing Babylon the Great visionary record');
else {
  if ('coordinates' in visionaryBabylon) fail('Babylon the Great must remain coordinate-free');
  if (visionaryBabylon.confidence?.geographicIdentification !== 'symbolic') fail('Babylon the Great must remain symbolic');
}

const babylonScene = await readJson('public/data/immersive/scenes/babylon-imperial-city.json');
if (!babylonScene.disclaimer.toLowerCase().includes('tower of babel')) fail('Babylon scene must explicitly reject a Tower of Babel structure identification');
const palace = babylonScene.hotspots.find((hotspot) => hotspot.id === 'southern-palace');
if (!palace?.whyShown?.alternatives?.toLowerCase().includes('no excavated hall')) fail('Babylon palace hotspot must reject a Daniel 5 banquet-room identification');

const ninevehScene = await readJson('public/data/immersive/scenes/nineveh-assyrian-city.json');
const ninevehCity = ninevehScene.hotspots.find((hotspot) => hotspot.id === 'nineveh-city');
if (!ninevehCity?.whyShown?.alternatives?.toLowerCase().includes('genre')) fail('Nineveh scene must separate archaeology from Jonah genre/date/historicity questions');
const fall = ninevehScene.hotspots.find((hotspot) => hotspot.id === 'nineveh-fall');
if (!fall || !fall.periodIds?.includes('fall-612-bce')) fail('Nineveh fall hotspot must remain tied to the 612 BCE period state');

const persianScene = await readJson('public/data/immersive/scenes/persian-royal-centers.json');
const persianOptions = new Map(persianScene.comparison?.options?.map((option) => [option.id, option]));
if (persianOptions.get('susa-biblical-setting')?.status !== 'established') fail('Susa must remain established in Persian royal-centers scene');
if (persianOptions.get('persepolis-imperial-context')?.status !== 'established') fail('Persepolis must remain established as an archaeological center');
if (!persianOptions.get('persepolis-imperial-context')?.objections?.toLowerCase().includes('does not name persepolis')) fail('Persepolis scene must state that the Hebrew Bible does not name Persepolis');

const ephesusScene = await readJson('public/data/immersive/scenes/ephesus-roman-city.json');
if (!ephesusScene.disclaimer.toLowerCase().includes('hall of tyrannus remains unpinned')) fail('Ephesus scene must keep Hall of Tyrannus unpinned');
if (!ephesusScene.disclaimer.toLowerCase().includes('coastline')) fail('Ephesus scene must state that an ancient coastline is not yet reconstructed');
if (ephesusScene.hotspots.some((hotspot) => hotspot.placeId === 'hall-tyrannus')) fail('Hall of Tyrannus must not receive a geographic hotspot');

const romeScene = await readJson('public/data/immersive/scenes/rome-paul-imperial-city.json');
const romeOptions = new Map(romeScene.comparison?.options?.map((option) => [option.id, option]));
if (!romeOptions.get('paul-arrival')?.objections?.toLowerCase().includes('three taverns')) fail('Rome scene must keep Three Taverns unpinned');
if (!romeOptions.get('revelation-rome-referent')?.objections?.toLowerCase().includes('no terrestrial coordinates')) fail('Rome/Revelation lens must keep Babylon the Great coordinate-free');
if (romeScene.hotspots.some((hotspot) => hotspot.placeId === 'paul-lodging-rome' || hotspot.placeId === 'three-taverns' || hotspot.placeId === 'babylon-great-revelation')) fail('Rome scene must not create geographic hotspots for unlocated/symbolic entities');

const patmosScene = await readJson('public/data/immersive/scenes/patmos-historical-island.json');
const patmosOptions = new Map(patmosScene.comparison?.options?.map((option) => [option.id, option]));
if (patmosOptions.get('john-location-unknown')?.status !== 'unknown') fail('John’s exact Patmos location must remain unknown');
if (patmosOptions.get('cave-tradition')?.status !== 'traditional') fail('Cave of the Apocalypse must remain traditional');
if (!patmosScene.disclaimer.toLowerCase().includes('separate non-terrestrial revelation system')) fail('Patmos scene must preserve the separate non-terrestrial visionary system');

const expectedLinks = new Map([
  ['exile-restoration/story-late-prophets/late-nineveh', ['nineveh-assyrian-city', undefined, 'fall-612-bce', 'nineveh-fall']],
  ['exile-restoration/story-babylonian-exile/exile-babylon', ['babylon-imperial-city', undefined, 'judean-exile', 'babylon-city']],
  ['exile-restoration/story-babylonian-exile/exile-yaukin', ['babylon-imperial-city', undefined, 'neo-babylonian', 'southern-palace']],
  ['exile-restoration/story-babylonian-exile/exile-communities', ['babylon-imperial-city', undefined, 'judean-exile', 'judean-exile-zone']],
  ['exile-restoration/story-daniel-imperial-world/dan-susa', ['persian-royal-centers', 'susa-biblical-setting', 'achaemenid-context', 'susa-city']],
  ['exile-restoration/story-esther-susa/esther-susa', ['persian-royal-centers', 'susa-biblical-setting', 'achaemenid-context', 'susa-city']],
  ['acts-paul/story-ephesus-third-journey/e1', ['ephesus-roman-city', 'city-archaeology', 'roman-city', 'ephesus-city']],
  ['acts-paul/story-ephesus-third-journey/e2', ['ephesus-roman-city', 'paul-ministry', 'pauline-ministry', undefined]],
  ['acts-paul/story-ephesus-third-journey/e3', ['ephesus-roman-city', 'artemis-theater', 'pauline-ministry', 'ephesus-theater']],
  ['acts-paul/story-voyage-rome/vr5', ['rome-paul-imperial-city', 'paul-arrival', 'acts-28', 'appii-forum-approx']],
  ['acts-paul/story-voyage-rome/vr6', ['rome-paul-imperial-city', 'paul-arrival', 'acts-28', 'rome-city']],
  ['revelation/story-patmos-revelation/p1', ['patmos-historical-island', 'patmos-island', 'first-century-island', 'patmos-island']],
  ['revelation/story-patmos-revelation/p2', ['patmos-historical-island', 'cave-tradition', 'first-century-island', 'cave-tradition-site']]
]);
for (const pack of ['exile-restoration', 'acts-paul', 'revelation']) {
  const stories = await readJson(`public/data/${pack}/stories.json`);
  for (const story of stories) for (const chapter of story.chapters || []) {
    const key = `${pack}/${story.id}/${chapter.id}`;
    const expected = expectedLinks.get(key);
    if (!expected) continue;
    const [sceneId, variantId, periodId, hotspotId] = expected;
    if (chapter.immersiveSceneId !== sceneId) fail(`${key} must open ${sceneId}`);
    if ((chapter.immersiveVariantId || undefined) !== variantId) fail(`${key} must select variant ${variantId || '(none)'}`);
    if ((chapter.immersivePeriodId || undefined) !== periodId) fail(`${key} must select period ${periodId || '(none)'}`);
    if ((chapter.immersiveHotspotId || undefined) !== hotspotId) fail(`${key} must select hotspot ${hotspotId || '(none)'}`);
    expectedLinks.delete(key);
  }
}
for (const key of expectedLinks.keys()) fail(`missing expected Batch 7 guided-story link ${key}`);

if (errors.length) {
  console.error(`V2 Batch 7 audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log('V2 Batch 7 imperial-city audit passed: archaeological cities remain established, unlocated Pauline sites stay unpinned, Patmos tradition stays qualified, visionary Babylon remains non-terrestrial, and guided stories deep-link to valid scene states.');
