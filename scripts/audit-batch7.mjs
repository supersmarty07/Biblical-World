import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dir = path.join(root, 'public', 'data', 'second-temple');
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

for (const id of ['modein','issus-battle-region','adasa','elasa','jerusalem-acra','hasmonean-palace-jerusalem']) {
  const p = byPlace.get(id);
  if (!p) fail(`Missing uncertainty-critical place ${id}`);
  else if (p.coordinates) fail(`${id} must remain unpinned until a specific identification is defensible`);
}
for (const id of ['alexandria-egypt','antioch-orontes','ptolemais-akko','mount-gerizim-sanctuary','maresa','qumran','petra','masada','caesarea-maritima','herodium']) {
  const p = byPlace.get(id);
  if (!p?.coordinates) fail(`${id} should remain a mapped physical anchor`);
  if (!['established','probable'].includes(p?.confidence?.geographicIdentification)) fail(`${id} has unexpectedly weak geographic confidence`);
}

const exact = new Map([
  ['event-panium-200', -200],
  ['event-temple-rededication-164', -164],
  ['event-pompey-jerusalem-63', -63],
  ['event-herod-appointed-40', -40],
  ['event-herod-captures-jerusalem-37', -37],
  ['event-actium-31', -31]
]);
for (const [id, year] of exact) {
  const e = byEvent.get(id);
  if (!e) fail(`Missing date-critical event ${id}`);
  else if (e.dating?.from !== year || e.dating?.to !== year) fail(`${id} must preserve ${Math.abs(year)} BCE`);
}

const herodAppointment = byEvent.get('event-herod-appointed-40');
const herodCapture = byEvent.get('event-herod-captures-jerusalem-37');
if (!herodAppointment || !herodCapture || herodAppointment.dating?.from === herodCapture.dating?.from) fail('Herod’s 40 BCE Roman appointment and 37 BCE capture of Jerusalem must remain separate events');
if (!/does not yet control|does not.*control|appointment and effective possession are separated/i.test(herodAppointment?.historicalNote || '')) fail('Herod appointment must explicitly distinguish title from possession');

if (events.some((e) => (e.personIds || []).includes('alexander-iii') && (e.placeIds || []).includes('jerusalem'))) {
  fail('Batch 7 must not present Alexander’s Josephus-era Jerusalem-visit tradition as an independently established event');
}

const sept = byEvent.get('event-septuagint-alexandria');
if (!sept || !/(later|idealized|not.*literal|complex)/i.test(sept.historicalNote || '')) fail('Septuagint event must distinguish the historical translation process from the idealized later court narrative');

const qumran = byPlace.get('qumran');
if (!qumran || !Array.isArray(qumran.interpretations) || !qumran.interpretations.some((x) => /Essene/i.test(x.title) && x.status !== 'established')) fail('Qumran must preserve the Essene association as an interpretation rather than an established site identity');

const gerizim = byEvent.get('event-gerizim-destruction');
if (!gerizim || gerizim.confidence === 'high' || !/(correlation|interpretive)/i.test(gerizim.historicalNote || '')) fail('Gerizim destruction must distinguish archaeology from attribution to John Hyrcanus');

const idumea = byEvent.get('event-idumea-incorporation');
if (!idumea || !/(later literary|ethnic|identity|simplistic)/i.test(idumea.historicalNote || '')) fail('Idumean incorporation must preserve source criticism around identity policy');

const leontopolis = byEvent.get('event-leontopolis-temple');
if (!leontopolis || !leontopolis.personIds.includes('onias-iv') || leontopolis.personIds.includes('onias-iii')) fail('Leontopolis temple must be associated with Onias IV in the project model, not Onias III');
if (!byPerson.has('onias-iv')) fail('Onias IV person record is required');

for (const sourceId of ['source-1-maccabees','source-2-maccabees']) {
  const s = bySource.get(sourceId);
  if (!s || s.kind !== 'deuterocanonical-text') fail(`${sourceId} must be explicitly typed as deuterocanonical-text`);
}
for (const e of events) {
  if ((e.scripture || []).some((r) => ['1 Maccabees','2 Maccabees'].includes(r.book))) fail(`${e.id}: 1–2 Maccabees should use textualReferences, not the default BSB scripture field`);
  for (const r of e.textualReferences || []) {
    if (!bySource.has(r.sourceId)) fail(`${e.id}: textual reference points to missing source ${r.sourceId}`);
  }
}
for (const story of stories) {
  for (const c of story.chapters || []) {
    if ((c.scripture || []).some((r) => ['1 Maccabees','2 Maccabees'].includes(r.book))) fail(`${story.id}/${c.id}: deuterocanonical references belong in textualReferences`);
  }
}

const acra = byPlace.get('jerusalem-acra');
if (!acra || !/debated|disputed|proposal/i.test(`${acra.confidence?.explanation || ''} ${acra.locationNote || ''}`)) fail('Jerusalem Acra must remain explicitly debated');

const emmaus = byPlace.get('emmaus-nicopolis');
if (!emmaus || !/New Testament Emmaus/i.test(emmaus.locationNote || '')) fail('Maccabean Emmaus must explicitly avoid settling the separate New Testament Emmaus question');

const romanJudea = regions.features.find((f) => f.properties?.id === 'roman-judea-transition-b7');
if (!romanJudea || !/not a claim of direct provincial administration/i.test(romanJudea.properties?.note || '')) fail('Pre-Herodian Roman Judea region must not be mislabeled as later direct Judaea province');

for (const feature of regions.features || []) {
  if (feature.properties?.confidence === 'established') fail(`Context region ${feature.properties?.id} must not claim established border geometry`);
  if (!/(generalized|broad|not a|not an|orientation|not one|not valid as an exact)/i.test(feature.properties?.note || '')) fail(`Context region ${feature.properties?.id} lacks an uncertainty/generalization warning`);
}

for (const j of journeys) {
  for (const s of j.segments || []) {
    if (!s.note) fail(`Journey ${j.id}/${s.id} lacks an epistemic route note`);
    if (!/(generalized|reconstruct|schematic|not.*route|not.*track|not.*itinerary|not.*road|not.*path)/i.test(s.note)) fail(`Journey ${j.id}/${s.id} needs route-vs-evidence clarification`);
  }
}

const temple = byEvent.get('event-herodian-temple-expansion');
if (!temple || !/platform.*archaeological|archaeological.*platform/i.test(temple.historicalNote || '') || !/reconstruction/i.test(temple.historicalNote || '')) fail('Herodian Temple event must separate preserved platform archaeology from sanctuary reconstruction');

const qEvent = byEvent.get('event-qumran-second-temple');
if (!qEvent || !/(not.*every|identif|beyond the evidence)/i.test(qEvent.historicalNote || '')) fail('Qumran event must not equate all scrolls with a single resident community');

for (const s of sources) {
  if (typeof s.year === 'number' && s.year < 0) fail(`Ancient source ${s.id} must use dateLabel instead of negative year`);
  if (!s.kind) fail(`Batch 7 source ${s.id} must declare a source kind`);
}

for (const id of ['alexander-iii','antiochus-iv','mattathias','judas-maccabeus','jonathan-apphus','simon-thassi','john-hyrcanus-i','salome-alexandra','hyrcanus-ii','aristobulus-ii','pompey','antipater-idumaean','herod-great','augustus']) {
  if (!byPerson.has(id)) fail(`Missing key Batch 7 person ${id}`);
}
for (const id of ['story-alexander-hellenistic','story-ptolemaic-judea','story-antiochus-crisis','story-maccabean-revolt','story-hasmonean-state','story-second-temple-diversity','story-rome-enters-judea','story-herod-transition']) {
  if (!stories.some((s) => s.id === id)) fail(`Missing key Batch 7 story ${id}`);
}

if (errors.length) {
  console.error(`Batch 7 audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`Batch 7 editorial audit passed: ${places.length} places, ${people.length} people, ${events.length} events, ${journeys.length} journeys, ${stories.length} stories, ${sources.length} sources, ${regions.features.length} context regions.`);
