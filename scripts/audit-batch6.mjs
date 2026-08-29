import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dir = path.join(root, 'public', 'data', 'exile-restoration');
const read = (name) => fs.readFile(path.join(dir, name), 'utf8').then(JSON.parse);
const [places, people, events, journeys, stories, regions, sources] = await Promise.all([
  read('places.json'), read('people.json'), read('events.json'), read('journeys.json'), read('stories.json'), read('context-regions.geojson'), read('sources.json')
]);

const errors = [];
const fail = (message) => errors.push(message);
const byPlace = new Map(places.map((x) => [x.id, x]));
const byPerson = new Map(people.map((x) => [x.id, x]));
const byEvent = new Map(events.map((x) => [x.id, x]));
const bySource = new Map(sources.map((x) => [x.id, x]));

const refs = [
  ...places.flatMap((x) => x.scripture || []),
  ...people.flatMap((x) => x.scripture || []),
  ...events.flatMap((x) => x.scripture || []),
  ...stories.flatMap((x) => x.chapters.flatMap((c) => c.scripture || []))
];
for (const book of ['2 Kings','2 Chronicles','Zephaniah','Nahum','Habakkuk','Jeremiah','Lamentations','Obadiah','Ezekiel','Daniel','Ezra','Nehemiah','Esther','Haggai','Zechariah','Malachi']) {
  if (!refs.some((ref) => ref.book === book)) fail(`Missing canonical coverage for ${book}`);
}

for (const id of ['topheth','migdol-jeremiah','perath-jeremiah','tel-abib-exile','al-yahudu','dura-plain','ahava','casiphia','second-temple-site-persian','nehemiah-wall-circuit']) {
  const p = byPlace.get(id);
  if (!p) fail(`Missing critical uncertainty record ${id}`);
  else if (p.coordinates) fail(`${id} must remain unpinned in Batch 6`);
}

for (const id of ['ketef-hinnom','ramat-rahel','carchemish','nippur','susa','persepolis','pasargadae','elephantine']) {
  const p = byPlace.get(id);
  if (!p?.coordinates) fail(`${id} should be mapped`);
  if (!['established','probable'].includes(p?.confidence?.geographicIdentification)) fail(`${id} has unexpectedly weak geographic confidence`);
}

const exact = new Map([
  ['event-nineveh-fall-612', -612],
  ['event-josiah-megiddo', -609],
  ['event-carchemish-605', -605],
  ['event-jerusalem-597', -597],
  ['event-babylon-falls-539', -539],
  ['event-elephantine-407', -407]
]);
for (const [id, year] of exact) {
  const e = byEvent.get(id);
  if (!e) fail(`Missing date-critical event ${id}`);
  else if (e.dating?.from !== year || e.dating?.to !== year) fail(`${id} must preserve ${Math.abs(year)} BCE`);
}

const destruction = byEvent.get('event-jerusalem-destruction');
if (!destruction || destruction.dating?.from !== -587 || destruction.dating?.to !== -586 || !/587\/586/.test(destruction.dating?.label || '')) {
  fail('Jerusalem destruction must preserve the 587/586 BCE chronology issue');
}

const cyrusSource = bySource.get('source-cyrus-cylinder');
if (!cyrusSource || !/(does not mention|does not name).*(Judah|Jerusalem)/i.test(cyrusSource.notes || '')) {
  fail('Cyrus Cylinder source must explicitly state that Jerusalem/Judah are not named');
}
const cyrusEvent = byEvent.get('event-cyrus-decree-ezra');
if (!cyrusEvent || !/(not direct|not.*Jerusalem decree|does not)/i.test(cyrusEvent.historicalNote || '')) {
  fail('Cyrus decree event must distinguish Ezra from the Cyrus Cylinder');
}

const dariusMede = byPerson.get('darius-the-mede');
if (!dariusMede || !/(no independently identified|unresolved|no.*consensus)/i.test(dariusMede.summary || '')) {
  fail('Darius the Mede must remain historically unresolved');
}

const kebar = byPlace.get('kebar-canal');
if (!kebar || !/not be confused with the Khabur/i.test(kebar.historicalContext || '')) fail('Kebar must be distinguished from the Khabur River');

const esther = byEvent.get('event-esther-susa-court');
if (!esther || !/(not independently|not.*attested)/i.test(esther.historicalNote || '')) fail('Esther event must distinguish historical Susa from independent attestation of the narrative');

const ezra = byEvent.get('event-ezra-journey');
if (!ezra || !/458 BCE/i.test(ezra.dating?.label || '') || !/(alternate|later)/i.test(`${ezra.dating?.label || ''} ${ezra.dating?.note || ''}`)) {
  fail('Ezra chronology must preserve the traditional 458 BCE date and alternate later chronologies');
}

const alYahudu = byEvent.get('event-al-yahudu-archive');
if (!alYahudu || !/exact.*unpinned|unpin/i.test(alYahudu.historicalNote || '')) fail('Al-Yahudu event must preserve unknown findspot');

const danielCourt = byEvent.get('event-daniel-court-setting');
if (!danielCourt || danielCourt.confidence === 'high' || !/(literary|biblical setting)/i.test(danielCourt.historicalNote || '')) {
  fail('Daniel court setting must not be presented as independently verified biography');
}
const babylonFall = byEvent.get('event-babylon-falls-539');
if (!babylonFall || (babylonFall.scripture || []).length !== 0 || babylonFall.confidence !== 'high') fail('539 BCE Babylon fall must remain independent historical context');

const elephantine = byEvent.get('event-elephantine-407');
if (!elephantine || elephantine.personIds.length !== 0 || !/sons of Sanballat/i.test(elephantine.historicalNote || '')) {
  fail('Elephantine 407 event must not list Nehemiah’s Sanballat as a direct participant; only the sons-reference may be noted');
}

const gedaliah = byEvent.get('event-gedaliah-mizpah');
if (gedaliah?.placeIds.includes('yehud-province')) fail('Gedaliah administration must not be tagged as Persian-period Yehud');

for (const id of ['neo-babylonian-empire','achaemenid-persian-empire','yehud-province','beyond-river-province']) {
  const p = byPlace.get(id);
  if (!p || p.coordinateRole !== 'display-anchor') fail(`${id} must use a display-anchor rather than imply a precise point/border`);
}

for (const feature of regions.features || []) {
  if (feature.properties?.confidence === 'established') fail(`Context region ${feature.properties?.id} must not claim established border geometry`);
  const note = feature.properties?.note || '';
  if (!/(generalized|broad|not exact|not a |not an |orientation)/i.test(note)) fail(`Context region ${feature.properties?.id} lacks a generalization warning`);
}

for (const j of journeys) {
  for (const s of j.segments || []) {
    if (!s.note) fail(`Journey ${j.id}/${s.id} lacks an epistemic note`);
    if (s.routeCertainty === 'known-sequence' && !/(text|named|route|path|road|reconstruct|destination|sequence)/i.test(s.note)) fail(`Known-sequence segment ${j.id}/${s.id} lacks route-vs-sequence clarification`);
  }
}

for (const source of sources) {
  if (typeof source.year === 'number' && source.year < 0) fail(`Ancient source ${source.id} must use dateLabel instead of negative year`);
}

for (const id of ['source-esarhaddon-manasseh','source-fall-nineveh-chronicle','source-babylonian-chronicle-5','source-jehoiachin-rations','source-lachish-letters','source-ketef-hinnom','source-al-yahudu','source-nabonidus-chronicle','source-cyrus-cylinder','source-behistun','source-elephantine-papyri']) {
  if (!bySource.has(id)) fail(`Missing primary-evidence source ${id}`);
}

for (const id of ['manasseh-judah','amon-judah','zephaniah','nahum','habakkuk','obadiah-prophet','josiah','jeremiah','jehoiachin','zedekiah','nebuchadnezzar-ii','ezekiel','daniel','cyrus-ii','zerubbabel','haggai','zechariah-prophet','esther','ezra','nehemiah']) {
  if (!byPerson.has(id)) fail(`Missing key Batch 6 person ${id}`);
}

for (const story of stories) {
  if (!story.chapters.some((c) => (c.scripture || []).length)) fail(`Story ${story.id} lacks any Scripture-bearing chapter`);
}

if (errors.length) {
  console.error(`Batch 6 audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`Batch 6 editorial audit passed: ${places.length} places, ${people.length} people, ${events.length} events, ${journeys.length} journeys, ${stories.length} stories, ${sources.length} sources, ${regions.features.length} context regions.`);
