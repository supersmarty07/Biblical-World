import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dir = path.join(root, 'public', 'data', 'divided-kingdom');
const read = (name) => fs.readFile(path.join(dir, name), 'utf8').then(JSON.parse);
const [places, people, events, journeys, stories, regions, sources] = await Promise.all([
  read('places.json'), read('people.json'), read('events.json'), read('journeys.json'), read('stories.json'), read('context-regions.geojson'), read('sources.json')
]);

const errors = [];
const fail = (message) => errors.push(message);
const byPlace = new Map(places.map((place) => [place.id, place]));
const byEvent = new Map(events.map((event) => [event.id, event]));
const bySource = new Map(sources.map((source) => [source.id, source]));

// Canonical coverage expected for the release boundary.
const refs = [
  ...places.flatMap((item) => item.scripture || []),
  ...people.flatMap((item) => item.scripture || []),
  ...events.flatMap((item) => item.scripture || []),
  ...stories.flatMap((item) => item.chapters.flatMap((chapter) => chapter.scripture || []))
];
for (const book of ['1 Kings', '2 Kings', '2 Chronicles', 'Amos', 'Hosea', 'Jonah', 'Isaiah', 'Micah']) {
  if (!refs.some((ref) => ref.book === book)) fail(`Missing canonical coverage for ${book}`);
}

// Uncertain geography that must not be silently pinned.
for (const id of ['kerith-brook', 'tishbe-gilead', 'abel-meholah', 'ramoth-gilead', 'aphek-aram', 'tarshish', 'halah', 'libnah', 'upper-pool-conduit', 'moresheth-gath']) {
  const place = byPlace.get(id);
  if (!place) fail(`Missing critical uncertainty record ${id}`);
  else if (place.coordinates) fail(`${id} must remain unpinned in Batch 5`);
}

// Strong physical / archaeological anchors.
for (const id of ['samaria', 'mount-carmel', 'zarephath', 'nineveh', 'lachish', 'siloam-tunnel']) {
  const place = byPlace.get(id);
  if (!place?.coordinates) fail(`${id} should be mapped`);
  if (!['established', 'probable'].includes(place?.confidence?.geographicIdentification)) fail(`${id} has unexpectedly weak geographic confidence`);
}

// Tarshish must remain a real interpretive problem.
const tarshish = byPlace.get('tarshish');
if (tarshish?.confidence?.geographicIdentification !== 'disputed') fail('Tarshish must remain disputed');
if ((tarshish?.interpretations || []).length < 2) fail('Tarshish should expose multiple interpretation families');

// Extra-biblical chronological anchors must not lose their exact dating metadata.
const exactDates = new Map([
  ['event-qarqar-853', -853],
  ['event-jehu-tribute', -841],
  ['event-sennacherib-lachish', -701],
  ['event-sennacherib-jerusalem', -701]
]);
for (const [id, year] of exactDates) {
  const event = byEvent.get(id);
  if (!event) fail(`Missing date-critical event ${id}`);
  else if (event.dating?.from !== year || event.dating?.to !== year || event.dating?.basis !== 'historical') fail(`${id} must preserve its historical date ${year}`);
}

const qarqar = byEvent.get('event-qarqar-853');
if (!qarqar || (qarqar.scripture || []).length !== 0 || !/extra-biblical/i.test(qarqar.historicalNote || '')) fail('Qarqar must remain explicitly extra-biblical context rather than being given a fabricated Scripture reference');

const samariaFall = byEvent.get('event-samaria-fall');
if (!samariaFall || !/Shalmaneser/i.test(samariaFall.historicalNote || '') || !/Sargon/i.test(samariaFall.historicalNote || '') || !/debated/i.test(samariaFall.historicalNote || '')) fail('Samaria fall event must preserve Shalmaneser V / Sargon II attribution complexity');

const jerusalem701 = byEvent.get('event-sennacherib-jerusalem');
if (!jerusalem701 || !/(do not claim|non-capture|not claim)/i.test(`${jerusalem701.summary} ${jerusalem701.historicalNote || ''}`)) fail('701 Jerusalem event must state that Assyrian sources do not claim Jerusalem was captured');

const siloam = byEvent.get('event-siloam-waterworks');
if (!siloam || !/does not name Hezekiah/i.test(siloam.historicalNote || '')) fail('Siloam event must distinguish physical tunnel from royal attribution');

const jonah = byEvent.get('event-jonah-nineveh');
if (!jonah || jonah.confidence === 'symbolic') fail('Jonah geography must not encode a genre/historicity verdict as symbolic event confidence');

for (const source of sources) {
  if (typeof source.year === 'number' && source.year < 0) fail(`Ancient source ${source.id} must use dateLabel instead of a negative numeric year for display`);
}

// Political regions must remain broad, time-aware context rather than modern-looking borders.
for (const feature of regions.features || []) {
  const note = feature.properties?.note || '';
  if (!/(generalized|broad|not a|not an|orientation|not exact)/i.test(note)) fail(`Context region ${feature.properties?.id} lacks an explicit generalization warning`);
  if (feature.properties?.confidence === 'established') fail(`Context region ${feature.properties?.id} must not claim established border geometry`);
}

// Searchable polity anchors are display points, never substitutes for borders.
for (const id of ['israel-northern-kingdom', 'judah-kingdom', 'aram-damascus', 'neo-assyrian-empire']) {
  const place = byPlace.get(id);
  if (!place || place.coordinateRole !== 'display-anchor') fail(`${id} must use a display-anchor coordinate role`);
}

// Every route segment needs an epistemic note. Every story needs canonical text somewhere,
// while extra-biblical chapters are allowed to have zero Scripture references.
for (const journey of journeys) for (const segment of journey.segments || []) if (!segment.note) fail(`Journey ${journey.id}/${segment.id} lacks an uncertainty note`);
for (const story of stories) if (!story.chapters.some((chapter) => (chapter.scripture || []).length)) fail(`Story ${story.id} lacks any Scripture-bearing chapter`);

// Key figures expected in this release.
for (const id of ['rehoboam', 'jeroboam-i', 'omri', 'ahab', 'jezebel', 'elijah', 'elisha', 'jehu', 'amos', 'hosea-prophet', 'isaiah', 'micah', 'hezekiah', 'sennacherib']) {
  if (!people.some((person) => person.id === id)) fail(`Missing person ${id}`);
}

// Primary source records that make the historical layer valuable.
for (const id of ['source-shoshenq-karnak', 'source-mesha-stele', 'source-tel-dan-stele', 'source-kurkh-monolith', 'source-black-obelisk', 'source-sargon-samaria', 'source-sennacherib-701', 'source-siloam-inscription']) {
  if (!bySource.has(id)) fail(`Missing primary-evidence source ${id}`);
}

if (errors.length) {
  console.error(`Batch 5 audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`Batch 5 editorial audit passed: ${places.length} places, ${people.length} people, ${events.length} events, ${journeys.length} journeys, ${stories.length} stories, ${sources.length} sources, ${regions.features.length} context regions.`);
