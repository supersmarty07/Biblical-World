import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dir = path.join(root, 'public', 'data', 'united-monarchy');
const read = (name) => fs.readFile(path.join(dir, name), 'utf8').then(JSON.parse);
const [places, people, events, journeys, stories, regions] = await Promise.all([
  read('places.json'), read('people.json'), read('events.json'), read('journeys.json'), read('stories.json'), read('context-regions.geojson')
]);
const errors = [];
const fail = (m) => errors.push(m);
const byPlace = new Map(places.map((p) => [p.id, p]));

// Canonical coverage expected for this release boundary.
const refs = [
  ...places.flatMap((x) => x.scripture || []),
  ...people.flatMap((x) => x.scripture || []),
  ...events.flatMap((x) => x.scripture || []),
  ...stories.flatMap((x) => x.chapters.flatMap((c) => c.scripture || []))
];
for (const book of ['Ruth', '1 Samuel', '2 Samuel', '1 Kings', '1 Chronicles', '2 Chronicles']) {
  if (!refs.some((r) => r.book === book)) fail(`Missing canonical coverage for ${book}`);
}

// Critical epistemic distinctions for Jerusalem and disputed geography.
for (const id of ['zion-biblical', 'first-temple-site', 'araunah-threshing-floor', 'ophir', 'ziklag', 'nob', 'forest-ephraim']) {
  const p = byPlace.get(id);
  if (!p) fail(`Missing critical uncertainty record ${id}`);
  else if (p.coordinates) fail(`${id} must remain unpinned in Batch 4`);
}
const templeMount = byPlace.get('temple-mount');
if (!templeMount?.coordinates || templeMount.confidence?.geographicIdentification !== 'established') fail('Temple Mount should be a mapped physical place distinct from the unpinned First Temple footprint');
if (byPlace.get('first-temple-site')?.confidence?.geographicIdentification === 'established') fail('First Temple exact site must not be marked established');
if (byPlace.get('zion-biblical')?.confidence?.geographicIdentification === 'established') fail('Zion changing toponym must not be reduced to an established point');

// Ensure disputed royal-building archaeology is textually caveated.
const fort = events.find((e) => e.id === 'event-solomon-fortifications');
if (!fort || fort.confidence === 'high' || !/debated/i.test(fort.historicalNote || '')) fail('Solomonic fortification event must preserve dating/attribution debate');

// Every guided story needs at least one Scripture-bearing chapter and every route needs uncertainty notes.
for (const story of stories) if (!story.chapters.some((c) => (c.scripture || []).length)) fail(`Story ${story.id} lacks Scripture references`);
for (const journey of journeys) for (const seg of journey.segments) if (!seg.note) fail(`Journey ${journey.id}/${seg.id} lacks an uncertainty note`);

// Political regions must explicitly warn that generalized polygons are not surveyed borders or precise reconstructions.
for (const f of regions.features || []) {
  const note = f.properties?.note || '';
  if (!/(not a|not an|generalized|broad|context|orientation)/i.test(note)) fail(`Context region ${f.properties?.id} lacks a generalization warning`);
}

// Main characters expected in this release.
for (const id of ['ruth','samuel','saul','jonathan','david','absalom','solomon']) if (!people.some((p) => p.id === id)) fail(`Missing person ${id}`);

if (errors.length) {
  console.error(`Batch 4 audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log(`Batch 4 editorial audit passed: ${places.length} places, ${people.length} people, ${events.length} events, ${journeys.length} journeys, ${stories.length} stories, ${regions.features.length} context regions.`);
