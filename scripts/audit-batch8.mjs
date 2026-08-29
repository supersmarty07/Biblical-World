import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dir = path.join(root, 'public', 'data', 'gospels');
const read = (base, name) => fs.readFile(path.join(root, 'public', 'data', base, name), 'utf8').then(JSON.parse);
const [places, people, events, journeys, stories, regions, sources, genesisPlaces, exodusPlaces, monarchyPlaces, dividedPlaces, exilePlaces, secondTemplePlaces] = await Promise.all([
  read('gospels','places.json'), read('gospels','people.json'), read('gospels','events.json'), read('gospels','journeys.json'), read('gospels','stories.json'), read('gospels','context-regions.geojson'), read('gospels','sources.json'),
  read('genesis','places.json'), read('exodus-judges','places.json'), read('united-monarchy','places.json'), read('divided-kingdom','places.json'), read('exile-restoration','places.json'), read('second-temple','places.json')
]);

const errors = [];
const fail = (message) => errors.push(message);
const byPlace = new Map(places.map((x) => [x.id, x]));
const byPerson = new Map(people.map((x) => [x.id, x]));
const byEvent = new Map(events.map((x) => [x.id, x]));
const bySource = new Map(sources.map((x) => [x.id, x]));
const allPlaces = new Map([...genesisPlaces, ...exodusPlaces, ...monarchyPlaces, ...dividedPlaces, ...exilePlaces, ...secondTemplePlaces, ...places].map((x) => [x.id, x]));
const priorPlaces = new Map([...secondTemplePlaces, ...dividedPlaces].map((x) => [x.id, x]));

// Textual or disputed locations must not be converted into spurious exact coordinates.
for (const id of [
  'cana-galilee','bethsaida-gospels','gerasenes-gadarenes-region','sychar','bethany-beyond-jordan','aenon-salim',
  'upper-room-jerusalem','praetorium-pilate','gabbatha','golgotha','tomb-jesus','emmaus-luke','arimathea',
  'mount-transfiguration','galilee-resurrection-mountain'
]) {
  const p = byPlace.get(id);
  if (!p) fail(`Missing uncertainty-critical Gospel place ${id}`);
  else if (p.coordinates) fail(`${id} must remain unpinned; tradition/candidate sites should be separate records`);
}

// Strong physical anchors should remain mapped.
for (const id of ['nazareth','capernaum','sea-galilee','magdala','tiberias','machaerus','pool-bethesda','pool-siloam-second-temple','mount-hermon']) {
  const p = byPlace.get(id);
  if (!p?.coordinates) fail(`${id} should remain a mapped Gospel-era physical anchor`);
  if (!['established','probable'].includes(p?.confidence?.geographicIdentification)) fail(`${id} has unexpectedly weak geographic confidence`);
}

const cana = byPlace.get('cana-galilee');
if (!cana?.interpretations?.some((x) => /Khirbet Qana/i.test(x.title) && x.status === 'possible')) fail('Cana must preserve Khirbet Qana as a possible candidate, not an established identification');
if (!cana?.interpretations?.some((x) => /Kafr Kanna/i.test(x.title) && x.status === 'traditional')) fail('Cana must preserve Kafr Kanna as a traditional identification');
if (byPlace.get('khirbet-qana')?.coordinateRole !== 'candidate-site') fail('Khirbet Qana must be mapped as a candidate-site');
if (byPlace.get('kafr-kanna')?.coordinateRole !== 'traditional-site') fail('Kafr Kanna must be mapped as a traditional-site');

const bethsaida = byPlace.get('bethsaida-gospels');
if (!bethsaida?.interpretations?.some((x) => /el-Araj/i.test(x.title) && x.status !== 'established')) fail('Bethsaida must preserve el-Araj as a non-established candidate');
if (!bethsaida?.interpretations?.some((x) => /et-Tell/i.test(x.title) && x.status !== 'established')) fail('Bethsaida must preserve et-Tell as a non-established candidate');
for (const id of ['el-araj-bethsaida','et-tell-bethsaida']) {
  if (byPlace.get(id)?.confidence?.geographicIdentification === 'established') fail(`${id} must not be labeled established Bethsaida`);
  if (byPlace.get(id)?.coordinateRole !== 'candidate-site') fail(`${id} must use candidate-site coordinate role`);
}

const baptismTextual = byPlace.get('bethany-beyond-jordan');
const baptismTradition = byPlace.get('al-maghtas');
if (baptismTextual?.coordinates) fail('Bethany beyond the Jordan textual place must remain unpinned');
if (baptismTradition?.confidence?.geographicIdentification !== 'traditional') fail('Al-Maghtas should remain a traditional/archaeological baptism landscape, not the established exact baptism point');
if (!/not the exact|not.*exact|not.*point/i.test(`${baptismTradition?.confidence?.explanation || ''} ${baptismTradition?.archaeology || ''}`)) fail('Al-Maghtas must explain that ancient commemoration does not prove the exact baptism point');

const johnMachaerus = byEvent.get('event-john-machaerus');
if (!johnMachaerus || !johnMachaerus.sourceIds.includes('source-josephus-ant18-b8')) fail('John/Machaerus event must cite Josephus Antiquities 18');
if (!/not named in the Gospels/i.test(johnMachaerus?.historicalNote || '')) fail('Machaerus event must state that the fortress is not named in the Gospel execution narratives');

const birth = byEvent.get('event-birth-jesus');
if (!birth || birth.confidence === 'high') fail('Birth chronology must not be presented with high historical precision');
if (!/Quirinius/i.test(birth?.historicalNote || '') || !/(6 CE|chronological problem|does not claim to solve)/i.test(birth?.historicalNote || '')) fail('Birth event must preserve the Herod/Quirinius chronology problem');

const quirinius = byEvent.get('event-quirinius-census');
if (!quirinius || quirinius.dating?.from !== 6 || quirinius.dating?.to !== 6) fail('The historically attested Quirinian Judean census must remain dated to 6 CE in this model');
if (!/does not move|not move/i.test(quirinius?.historicalNote || '')) fail('Quirinius census must explicitly avoid relocating the 6 CE census into Herod the Great’s reign');

const pilate = byEvent.get('event-pilate-prefecture');
if (!pilate || pilate.dating?.from !== 26 || pilate.dating?.to !== 36) fail('Pilate prefecture must preserve c. 26–36 CE');
if (!pilate?.sourceIds?.includes('source-pilate-stone')) fail('Pilate prefecture must cite the Caesarea inscription');
if (bySource.get('source-pilate-stone')?.kind !== 'inscription') fail('Pilate stone source must be typed as inscription');
if (bySource.get('source-tacitus-annals15')?.kind !== 'ancient-literary') fail('Tacitus Annals source must be typed as ancient-literary');
if (bySource.get('source-josephus-ant18-b8')?.kind !== 'ancient-literary') fail('Josephus Antiquities 18 source must be typed as ancient-literary');

const caiaphas = byEvent.get('event-caiaphas-high-priest');
if (!caiaphas || caiaphas.dating?.from !== 18 || caiaphas.dating?.to !== 36) fail('Caiaphas high-priesthood context must preserve c. 18–36 CE');
if (!/(not treated as|not.*conclusive|supportive.*not)/i.test(caiaphas?.historicalNote || '')) fail('Caiaphas ossuary must not be presented as conclusive personal identification');

const praetorium = byPlace.get('praetorium-pilate');
if (!praetorium || praetorium.coordinates) fail('Pilate’s Jerusalem praetorium must remain unpinned');
if (!praetorium?.interpretations?.some((x) => /Herod/i.test(x.title) && x.status !== 'established')) fail('Praetorium must preserve the Herodian western-palace interpretation');
if (!praetorium?.interpretations?.some((x) => /Antonia/i.test(x.title) && x.status !== 'established')) fail('Praetorium must preserve the Antonia/Via Dolorosa tradition separately');

// Passion geography: candidate/traditional sites remain distinct from textual locations.
const holy = byPlace.get('holy-sepulchre');
const garden = byPlace.get('garden-tomb');
if (holy?.confidence?.geographicIdentification === 'established') fail('Church of the Holy Sepulchre must not be labeled the established exact Golgotha/tomb');
if (garden?.confidence?.geographicIdentification === 'established') fail('Garden Tomb must not be labeled the established tomb of Jesus');
if (!/(Iron Age|earlier|pre-Roman|does not fit)/i.test(`${garden?.archaeology || ''} ${garden?.locationNote || ''} ${garden?.confidence?.explanation || ''}`)) fail('Garden Tomb record must preserve the archaeological dating problem');
if (byPlace.get('golgotha')?.coordinates || byPlace.get('tomb-jesus')?.coordinates) fail('Textual Golgotha and tomb records must remain unpinned');

const emmaus = byPlace.get('emmaus-luke');
if (!emmaus || emmaus.coordinates) fail('Luke’s Emmaus must remain unpinned');
for (const j of journeys) {
  for (const s of j.segments || []) {
    if ([s.fromPlaceId,s.toPlaceId].includes('emmaus-luke')) fail(`Journey ${j.id}/${s.id} must not draw an exact route to unlocated Emmaus`);
  }
}

const transfig = byPlace.get('mount-transfiguration');
const galileeMountain = byPlace.get('galilee-resurrection-mountain');
if (!transfig || transfig.coordinates) fail('Transfiguration mountain must remain unpinned');
if (!galileeMountain || galileeMountain.coordinates) fail('Matthew 28 Galilee mountain must remain unpinned');
const galileeAppearances = byEvent.get('event-galilee-appearances');
if (!galileeAppearances?.placeIds?.includes('galilee-resurrection-mountain') || galileeAppearances?.placeIds?.includes('mount-transfiguration')) fail('Matthew 28 Galilee mountain must remain distinct from the Transfiguration mountain');

for (const id of ['event-resurrection-tomb','event-galilee-appearances']) {
  const e = byEvent.get(id);
  if (!e) fail(`Missing ${id}`);
  else {
    if (e.confidence === 'symbolic') fail(`${id} must not encode a genre/theological verdict as “symbolic”`);
    if (!/(archaeolog|supernatural|theological|narrative geography)/i.test(e.historicalNote || '')) fail(`${id} must distinguish mapped narrative geography from archaeological adjudication of supernatural claims`);
  }
}

// Matthew and Luke infancy itineraries must remain separate rather than harmonized into one synthetic route.
for (const id of ['journey-matthew-infancy','journey-luke-infancy']) if (!journeys.some((j) => j.id === id)) fail(`Missing separate infancy itinerary ${id}`);
const canaJourney = journeys.find((j) => j.id === 'journey-cana-capernaum');
if (!canaJourney || !(canaJourney.segments || []).some((s) => /candidate|hypoth/i.test(s.note || ''))) fail('Cana journey must disclose that Khirbet Qana is a candidate/hypothesis');

for (const j of journeys) {
  for (const s of j.segments || []) {
    if (!s.note) fail(`Journey ${j.id}/${s.id} lacks an epistemic route note`);
    if (!/(generalized|reconstruct|schematic|illustrative|candidate|hypoth|not.*route|not.*track|not.*itinerary|not.*road|not.*path|textual sequence|exact.*unknown|exact.*not recovered|interpretive visualization|exact path.*unknown|traditional endpoint)/i.test(s.note)) fail(`Journey ${j.id}/${s.id} needs route-vs-evidence clarification`);
  }
}

// Context polygons are orientation tools, not modern surveyed borders.
for (const feature of regions.features || []) {
  if (feature.properties?.confidence === 'established') fail(`Context region ${feature.properties?.id} must not claim established border geometry`);
  if (!/(broad|approx|general|orientation|not a|not an|schematic|not surveyed|regional concentration|rather than a single)/i.test(feature.properties?.note || '')) fail(`Context region ${feature.properties?.id} lacks a generalization warning`);
}

// Reused places from prior packs must remain visible during the Gospel period where the story engine needs them.
const panium = priorPlaces.get('panium');
const samariaCity = priorPlaces.get('samaria');
if (!panium || (panium.validTo ?? -9999) < 30 || !(panium.aliases || []).some((x) => /Caesarea Philippi/i.test(x))) fail('Panium must remain visible into the Gospel period and carry Caesarea Philippi as an alias');
if (!samariaCity || (samariaCity.validTo ?? -9999) < 30) fail('Samaria/Sebaste must remain visible into the Gospel period');

const samariaRegion = byPlace.get('samaria-region-gospels');
if (!samariaRegion || samariaRegion.coordinateRole !== 'display-anchor' || !/not.*city|distinguish/i.test(`${samariaRegion.summary || ''} ${samariaRegion.locationNote || ''}`)) fail('Gospel Samaria region must remain distinct from the city of Samaria/Sebaste');


// Story context years must not point at temporally inactive places, including reused records from older packs.
for (const story of stories) {
  for (const chapter of story.chapters || []) {
    if (chapter.contextYear === undefined || !chapter.placeId) continue;
    const p = allPlaces.get(chapter.placeId);
    if (!p) continue; // generic validator handles missing IDs
    if (p.validFrom !== undefined && chapter.contextYear < p.validFrom) fail(`${story.id}/${chapter.id}: ${chapter.placeId} is not active yet at contextYear ${chapter.contextYear}`);
    if (p.validTo !== undefined && chapter.contextYear > p.validTo) fail(`${story.id}/${chapter.id}: ${chapter.placeId} expires before contextYear ${chapter.contextYear}`);
  }
}
const journeyYears = new Map();
for (const story of stories) for (const chapter of story.chapters || []) if (chapter.journeyId && chapter.contextYear !== undefined) journeyYears.set(chapter.journeyId, chapter.contextYear);
for (const journey of journeys) {
  const year = journeyYears.get(journey.id);
  if (year === undefined) continue;
  for (const segment of journey.segments || []) {
    for (const pid of [segment.fromPlaceId, segment.toPlaceId]) {
      const p = allPlaces.get(pid);
      if (!p) continue;
      if (p.validFrom !== undefined && year < p.validFrom) fail(`${journey.id}/${segment.id}: ${pid} is not active yet at story contextYear ${year}`);
      if (p.validTo !== undefined && year > p.validTo) fail(`${journey.id}/${segment.id}: ${pid} expires before story contextYear ${year}`);
    }
  }
}

// No Via Dolorosa route is represented as a recovered first-century street-by-street path.
for (const j of journeys) {
  if (/via dolorosa/i.test(`${j.name || ''} ${j.summary || ''}`)) fail(`${j.id}: Via Dolorosa must not be presented as a recovered first-century itinerary`);
}

for (const id of ['jesus','john-baptist','peter','mary-magdalene','herod-antipas','pontius-pilate','caiaphas']) {
  if (!byPerson.has(id)) fail(`Missing key Gospel-era person ${id}`);
}
for (const id of ['story-infancy-gospels','story-john-baptist','story-galilee-beginnings','story-sea-galilee','story-samaria-sychar','story-northern-ministry','story-final-journey','story-first-century-jerusalem','story-final-week-gospels','story-pilate-trial','story-crucifixion-burial','story-resurrection-geography']) {
  if (!stories.some((s) => s.id === id)) fail(`Missing key Gospel story ${id}`);
}

for (const s of sources) {
  if (!s.kind) fail(`Batch 8 source ${s.id} must declare a source kind`);
  if (typeof s.year === 'number' && s.year < 0) fail(`Ancient source ${s.id} must use dateLabel instead of negative year`);
}

if (errors.length) {
  console.error(`Batch 8 audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`Batch 8 editorial audit passed: ${places.length} places, ${people.length} people, ${events.length} events, ${journeys.length} journeys, ${stories.length} stories, ${sources.length} sources, ${regions.features.length} context regions.`);
