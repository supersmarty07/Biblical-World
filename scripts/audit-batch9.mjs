import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const pack = 'acts-paul';
const read = async (name) => JSON.parse(await fs.readFile(path.join(root, 'public', 'data', pack, name), 'utf8'));
const [places, people, events, journeys, stories, sources, regions] = await Promise.all([
  read('places.json'), read('people.json'), read('events.json'), read('journeys.json'), read('stories.json'), read('sources.json'), read('context-regions.geojson')
]);

const priorPacks = ['genesis','exodus-judges','united-monarchy','divided-kingdom','exile-restoration','second-temple','gospels'];
const priorPlaces = new Map();
for (const p of priorPacks) {
  const arr = JSON.parse(await fs.readFile(path.join(root,'public','data',p,'places.json'),'utf8'));
  for (const item of arr) priorPlaces.set(item.id,item);
}
const allPlaces = new Map([...priorPlaces, ...places.map((p) => [p.id,p])]);
const byPlace = new Map(places.map((p) => [p.id,p]));
const byPerson = new Map(people.map((p) => [p.id,p]));
const byEvent = new Map(events.map((e) => [e.id,e]));
const byJourney = new Map(journeys.map((j) => [j.id,j]));
const bySource = new Map(sources.map((s) => [s.id,s]));
const errors = [];
const fail = (m) => errors.push(m);

// Required core coverage.
for (const id of ['paul','stephen','philip-evangelist','barnabas','silas','timothy','lydia','priscilla','aquila','gallio','felix','porcius-festus','herod-agrippa-ii']) {
  if (!byPerson.has(id)) fail(`Missing key Acts/Paul person ${id}`);
}
for (const id of ['story-pentecost-jerusalem','story-stephen-philip','story-saul-to-antioch','story-peter-caesarea-agrippa','story-antioch-council','story-first-mission','story-second-mission-macedonia','story-athens-corinth','story-ephesus-third-journey','story-jerusalem-arrest','story-caesarea-trials','story-voyage-rome','story-pauline-network']) {
  if (!stories.some((s) => s.id === id)) fail(`Missing key Batch 9 story ${id}`);
}

// Uncertain micro-sites must not be turned into exact pins.
for (const id of ['beautiful-gate-temple','solomons-portico-acts','akeldama-acts','stephen-stoning-site','house-judas-damascus','arabia-galatians','derbe-acts','gangites-prayer-place','philippi-prison','hall-tyrannus','phoenix-crete','paul-shipwreck-site','three-taverns','paul-lodging-rome']) {
  const p = byPlace.get(id);
  if (!p) fail(`Missing uncertainty-sensitive place ${id}`);
  else if (p.coordinates) fail(`${id} must remain unpinned`);
}

// Derbe candidate is separate and cannot be labeled established.
const derbeCandidate = byPlace.get('kerti-hoyuk-derbe');
if (!derbeCandidate || derbeCandidate.coordinateRole !== 'candidate-site') fail('Kerti Höyük must remain a separate candidate-site for Derbe');
if (derbeCandidate?.confidence?.geographicIdentification === 'established') fail('Kerti Höyük must not be labeled the established Derbe');

// Arabia in Galatians must not silently become Petra or a recovered itinerary.
if (journeys.some((j) => (j.segments || []).some((s) => [s.fromPlaceId,s.toPlaceId].includes('arabia-galatians') || [s.fromPlaceId,s.toPlaceId].includes('petra')) && /arabia/i.test(`${j.name} ${j.summary}`))) {
  fail('Paul’s Arabia interval must remain unanimated/unrouted because Galatians supplies no recoverable city itinerary');
}

// Samaria: Acts 8 should not be forced into Sebaste as certainty.
const samaria = byEvent.get('event-philip-samaria');
if (!samaria || !samaria.placeIds?.includes('samaria-region-gospels')) fail('Philip in Samaria must use the broad Samaria-region record');
if (!/(not force|not.*certain|does not force)/i.test(samaria?.historicalNote || '')) fail('Philip in Samaria must explicitly preserve uncertainty about identifying the city with Sebaste');

// Damascus-road encounter remains road-level unknown.
const damascus = byEvent.get('event-saul-damascus');
if (!damascus || !/(exact road|exact.*unknown|not.*exact)/i.test(damascus.historicalNote || '')) fail('Damascus-road event must preserve route/location uncertainty');
if (byPlace.has('paul-damascus-road-site')) fail('No fabricated exact Damascus-road encounter site is allowed');

// Gallio is the strongest external chronological anchor in the Pauline journeys.
const gallio = byEvent.get('event-gallio-corinth');
if (!gallio || gallio.dating?.from !== 51 || gallio.dating?.to !== 52 || gallio.dating?.basis !== 'historical') fail('Gallio event must preserve c. 51–52 CE historical anchoring');
if (!gallio?.sourceIds?.includes('source-gallio-inscription')) fail('Gallio event must cite the Delphi inscription');
if (bySource.get('source-gallio-inscription')?.kind !== 'inscription') fail('Gallio source must be typed as inscription');
if (!/(does not mention Paul|not.*mention Paul)/i.test(gallio?.historicalNote || '')) fail('Gallio note must state that the Delphi inscription does not mention Paul');
const bema = byPlace.get('corinth-bema');
if (!bema || !/(not proven|interpretive|does not identify)/i.test(`${bema.confidence?.explanation || ''} ${bema.locationNote || ''}`)) fail('Corinth bema must not be presented as Paul’s proven hearing platform');

// Claudius expulsion: preserve both approximate date and Chrestus ambiguity.
const expulsion = byEvent.get('event-claudius-expulsion');
if (!expulsion || expulsion.dating?.basis === 'historical') fail('Claudius expulsion must remain approximate rather than exact historical dating');
if (!expulsion?.sourceIds?.includes('source-suetonius-claudius25')) fail('Claudius expulsion must cite Suetonius');
if (!/(Chrestus.*debated|debated.*Chrestus)/i.test(expulsion?.historicalNote || '')) fail('Claudius expulsion must preserve the Chrestus interpretation problem');

// Jerusalem Council: Acts 15 and Galatians 2 are cross-referenced without being declared identical.
const council = byEvent.get('event-jerusalem-council');
if (!council || !/(relationship.*debated|without declaring.*identical|not.*identical)/i.test(council.historicalNote || '')) fail('Jerusalem Council must preserve the Acts 15 / Galatians 2 identification debate');

// Agrippa I death is a historical 44 CE anchor and uses Josephus independently.
const agrippaDeath = byEvent.get('event-agrippa-death-44');
if (!agrippaDeath || agrippaDeath.dating?.from !== 44 || agrippaDeath.dating?.to !== 44 || agrippaDeath.dating?.basis !== 'historical') fail('Agrippa I death must remain historically anchored to 44 CE');
if (!agrippaDeath?.sourceIds?.includes('source-josephus-ant19-b9')) fail('Agrippa I death must cite Josephus Antiquities 19');

// Festus accession year remains approximate.
const festus = byEvent.get('event-festus-agrippa');
if (!festus || festus.dating?.basis === 'historical' || !/(debated|often placed)/i.test(festus.historicalNote || '')) fail('Festus/Agrippa chronology must remain approximate and explicitly debated');

// Malta exact wreck bay remains unknown; mainstream island identification can be probable, not exact-bay certainty.
const malta = byPlace.get('malta-acts');
const wreck = byPlace.get('paul-shipwreck-site');
if (!malta || !['probable','possible'].includes(malta.confidence?.geographicIdentification)) fail('Malta/Melite should remain a probable/possible island identification rather than absolute exact-site certainty');
if (!wreck || wreck.coordinates) fail('Exact Malta wreck site must remain unpinned');
if (!/(St Paul.?s Bay.*not|does not equate|not.*proven)/i.test(`${wreck.locationNote || ''} ${wreck.confidence?.explanation || ''}`)) fail('Shipwreck record must explicitly reject a proven St Paul’s Bay claim');

// Areopagus physical hill vs council/speech location distinction.
const areopagus = byEvent.get('event-athens-areopagus');
if (!areopagus || !/(council|exact speech location.*interpret|exact.*location.*interpret)/i.test(areopagus.historicalNote || '')) fail('Areopagus event must distinguish the hill from the council/precise speech location');

// First journey must preserve the narrated return and end back at Antioch.
const first = byJourney.get('journey-first-mission');
if (!first) fail('Missing first missionary journey');
else {
  const seq = first.segments.flatMap((s,i) => i === 0 ? [s.fromPlaceId,s.toPlaceId] : [s.toPlaceId]);
  for (const id of ['lystra','iconium','pisidian-antioch','perga','attalia','antioch-orontes']) {
    if (!seq.includes(id)) fail(`First journey return must include ${id}`);
  }
  if (seq.at(-1) !== 'antioch-orontes') fail('First journey must return to Antioch, not stop at Attalia');
}

// Second journey must not stop prematurely at Ephesus and must not force Jerusalem into Acts 18:22.
const second = byJourney.get('journey-second-mission');
if (!second) fail('Missing second missionary journey');
else {
  const seq = second.segments.flatMap((s,i) => i === 0 ? [s.fromPlaceId,s.toPlaceId] : [s.toPlaceId]);
  for (const id of ['cenchreae','ephesus','caesarea-maritima','antioch-orontes']) if (!seq.includes(id)) fail(`Second journey must include ${id}`);
  if (seq.at(-1) !== 'antioch-orontes') fail('Second journey must end at Antioch');
  const last = second.segments.at(-1);
  if (last && /jerusalem/i.test(`${last.note || ''}`) && !/does not force|not force|does not name/i.test(last.note || '')) fail('Acts 18:22 return must not force the unnamed greeted church to Jerusalem');
}

// Third journey must represent Macedonia/Greece as regional stages rather than a fake direct Ephesus->Troas hop.
const third = byJourney.get('journey-third-return');
if (!third) fail('Missing third missionary journey');
else {
  const endpoints = new Set(third.segments.flatMap((s) => [s.fromPlaceId,s.toPlaceId]));
  for (const id of ['galatia-region-paul','phrygia-region-acts','ephesus','macedonia-region-acts','achaia-region-acts','alexandria-troas','miletus','tyre','caesarea-maritima','jerusalem']) {
    if (!endpoints.has(id)) fail(`Third journey must preserve ${id} as a regional/city stage`);
  }
}

// Every route segment must disclose epistemic status.
for (const j of journeys) for (const s of j.segments || []) {
  if (!s.note) fail(`${j.id}/${s.id} lacks route note`);
  if (!/(generalized|schematic|illustrative|reconstruct|not.*exact|exact.*unknown|not.*recovered|not.*surveyed|not.*road|regional anchor|does not.*route|route.*unknown|candidate|not.*city|not.*track|does not name|exact.*not)/i.test(s.note)) fail(`${j.id}/${s.id} needs stronger route-vs-evidence language`);
}

// Paul’s arrest/trials use city/precinct context, not recovered room-level locations.
for (const id of ['event-paul-jerusalem-arrest','event-paul-felix','event-festus-agrippa']) {
  const e = byEvent.get(id);
  if (!e || !/(exact|not recover|not archaeolog|not.*identified|administrative role)/i.test(e.historicalNote || '')) fail(`${id} must preserve room/precinct-level uncertainty`);
}

// Acts ends with house arrest; the project must not add martyrdom as if narrated by Acts.
if (events.some((e) => /(paul).*(martyr|execution|behead|death)|(martyr|execution|behead|death).*paul/i.test(`${e.id} ${e.title}`))) fail('Batch 9 must not present Paul’s martyrdom/death as an Acts event');
const house = byEvent.get('event-paul-rome-house-arrest');
if (!house || !/(Acts does not narrate Paul.?s death|does not narrate.*death)/i.test(house.historicalNote || '')) fail('Rome house-arrest event must state that Acts does not narrate Paul’s death');

// Pauline network: recipient geography != proven visit/composition site/authorship.
const network = byEvent.get('event-pauline-letter-network');
if (!network || !/(recipient geography|does not assert.*authorship|composition)/i.test(`${network.summary || ''} ${network.historicalNote || ''}`)) fail('Pauline network must separate recipient geography from authorship/composition-site claims');
if (journeys.some((j) => (j.segments || []).some((s) => [s.fromPlaceId,s.toPlaceId].includes('colossae')))) fail('No missionary journey should imply Acts narrates Paul visiting Colossae');
if (journeys.some((j) => (j.segments || []).some((s) => [s.fromPlaceId,s.toPlaceId].includes('illyricum-paul')))) fail('Romans 15 Illyricum reference must not be converted into a specific Acts journey');

// Reused Rhodes/Ptolemais records from Batch 7 must be used rather than duplicate Acts copies.
if (byPlace.has('rhodes-acts') || byPlace.has('ptolemais-acre')) fail('Batch 9 must reuse global Rhodes and Ptolemais records rather than clone them');
for (const id of ['rhodes','ptolemais-akko']) {
  const p = priorPlaces.get(id);
  if (!p || (p.validTo ?? -9999) < 60) fail(`Reused ${id} must remain active into the Acts period`);
}

// Context polygons are orientation layers, not survey-precise Roman borders.
for (const feature of regions.features || []) {
  if (feature.properties?.confidence === 'established') fail(`Context region ${feature.properties?.id} must not claim established border geometry`);
  if (!/(broad|general|approx|orientation|schematic|not.*survey|not a.*border|not exact|varied|regional)/i.test(feature.properties?.note || '')) fail(`Context region ${feature.properties?.id} lacks a generalization warning`);
}

// Story context years cannot make temporally inactive place records reappear.
for (const story of stories) for (const chapter of story.chapters || []) {
  if (chapter.contextYear === undefined || !chapter.placeId) continue;
  const p = allPlaces.get(chapter.placeId);
  if (!p) continue;
  if (p.validFrom !== undefined && chapter.contextYear < p.validFrom) fail(`${story.id}/${chapter.id}: ${chapter.placeId} not active at ${chapter.contextYear}`);
  if (p.validTo !== undefined && chapter.contextYear > p.validTo) fail(`${story.id}/${chapter.id}: ${chapter.placeId} expired before ${chapter.contextYear}`);
}

// Source taxonomy and ancient-date display rules.
for (const s of sources) {
  if (!s.kind) fail(`Batch 9 source ${s.id} must declare source kind`);
  if (typeof s.year === 'number' && s.year < 0) fail(`Ancient source ${s.id} must use dateLabel rather than negative numeric year`);
}
if (bySource.get('source-suetonius-claudius25')?.kind !== 'ancient-literary') fail('Suetonius must be typed as ancient-literary');
if (bySource.get('source-josephus-ant20-b9')?.kind !== 'ancient-literary') fail('Josephus Antiquities 20 must be typed as ancient-literary');

if (errors.length) {
  console.error(`Batch 9 audit failed with ${errors.length} error(s):`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}
console.log(`Batch 9 editorial audit passed: ${places.length} places, ${people.length} people, ${events.length} events, ${journeys.length} journeys, ${stories.length} stories, ${sources.length} sources, ${regions.features.length} context regions.`);
