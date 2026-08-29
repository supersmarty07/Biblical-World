import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const packNames = ['genesis', 'exodus-judges', 'united-monarchy', 'divided-kingdom', 'exile-restoration', 'second-temple', 'gospels', 'acts-paul', 'revelation'];
const errors = [];
const fail = (message) => errors.push(message);

async function readJson(pack, name) {
  return JSON.parse(await fs.readFile(path.join(root, 'public', 'data', pack, name), 'utf8'));
}

const packs = await Promise.all(packNames.map(async (pack) => ({
  name: pack,
  places: await readJson(pack, 'places.json'),
  journeys: await readJson(pack, 'journeys.json'),
  stories: await readJson(pack, 'stories.json'),
  people: await readJson(pack, 'people.json'),
  events: await readJson(pack, 'events.json'),
  sources: await readJson(pack, 'sources.json'),
  regions: await readJson(pack, 'context-regions.geojson'),
  licenses: await readJson(pack, 'licenses.json'),
  visionaryScenes: pack === 'revelation' ? await readJson(pack, 'visionary-scenes.json') : []
})));

const all = (key) => packs.flatMap((pack) => pack[key]);
const places = all('places');
const journeys = all('journeys');
const stories = all('stories');
const people = all('people');
const events = all('events');
const sources = all('sources');
const visionaryScenes = all('visionaryScenes');

function unique(records, label) {
  const ids = new Set();
  for (const record of records) {
    if (!record.id) fail(`${label}: missing id`);
    if (ids.has(record.id)) fail(`${label}: duplicate id ${record.id}`);
    ids.add(record.id);
  }
  return ids;
}

const placeIds = unique(places, 'places');
const sourceIds = unique(sources, 'sources');
const journeyIds = unique(journeys, 'journeys');
unique(stories, 'stories');
const personIds = unique(people, 'people');
unique(events, 'events');
const visionaryIds = unique(visionaryScenes, 'visionary scenes');

const confidenceLevels = new Set(['established', 'probable', 'possible', 'traditional', 'disputed', 'unknown', 'symbolic']);
const interpretationLevels = new Set(['high', 'moderate', 'low', 'traditional', 'symbolic']);
const coordinateRoles = new Set(['identified-site', 'approximate-area', 'candidate-site', 'traditional-site', 'display-anchor']);
const routeCertainties = new Set(['known-sequence', 'reconstructed', 'unknown']);
const characters = new Set(['abraham', 'isaac', 'jacob', 'joseph', 'moses', 'joshua', 'deborah', 'gideon', 'samson', 'ruth', 'samuel', 'saul', 'david', 'absalom', 'solomon', 'rehoboam', 'jeroboam-i', 'shoshenq-i', 'omri', 'ahab', 'jezebel', 'elijah', 'elisha', 'jehu', 'amos', 'jonah', 'isaiah', 'hezekiah', 'sargon-ii', 'sennacherib', 'josiah', 'jeremiah', 'zedekiah', 'nebuchadnezzar-ii', 'ezekiel', 'daniel', 'cyrus-ii', 'zerubbabel', 'darius-i', 'esther', 'ezra', 'nehemiah', 'alexander-iii', 'antiochus-iv', 'mattathias', 'judas-maccabeus', 'jonathan-apphus', 'simon-thassi', 'john-hyrcanus-i', 'pompey', 'herod-great', 'augustus', 'jesus', 'john-baptist', 'peter', 'mary-magdalene', 'herod-antipas', 'pontius-pilate', 'caiaphas', 'paul', 'stephen', 'philip-evangelist', 'barnabas', 'cornelius', 'silas', 'timothy', 'lydia', 'priscilla', 'aquila', 'felix', 'porcius-festus', 'herod-agrippa-ii', 'john-of-patmos', 'generic']);
const datingBases = new Set(['historical', 'conventional', 'approximate', 'textual']);

function checkSources(ids, context) {
  if (!Array.isArray(ids) || ids.length === 0) return fail(`${context}: at least one sourceId is required`);
  for (const sourceId of ids) if (!sourceIds.has(sourceId)) fail(`${context}: unknown source ${sourceId}`);
}


const textualKinds = new Set(['deuterocanonical', 'ancient-literary', 'inscription', 'documentary']);
function checkTextualReferences(refs, context) {
  if (refs === undefined) return;
  if (!Array.isArray(refs)) return fail(`${context}: textualReferences must be an array`);
  for (const ref of refs) {
    if (!ref.label || !ref.sourceId || !textualKinds.has(ref.kind)) fail(`${context}: malformed textual reference`);
    else if (!sourceIds.has(ref.sourceId)) fail(`${context}: textual reference points to unknown source ${ref.sourceId}`);
  }
}

function checkScripture(refs, context) {
  if (!Array.isArray(refs)) return fail(`${context}: scripture must be an array`);
  for (const ref of refs) {
    if (!ref.book || !Number.isInteger(ref.chapter) || ref.chapter < 1 || !ref.label) fail(`${context}: malformed Scripture reference`);
    if (ref.verseStart !== undefined && (!Number.isInteger(ref.verseStart) || ref.verseStart < 1)) fail(`${context}: invalid verseStart in ${ref.label || '?'}`);
    if (ref.verseEnd !== undefined && (!Number.isInteger(ref.verseEnd) || ref.verseEnd < (ref.verseStart ?? 1))) fail(`${context}: invalid verseEnd in ${ref.label || '?'}`);
  }
}

function checkCoordinate(coord, context) {
  if (!Array.isArray(coord) || coord.length !== 2) return fail(`${context}: coordinate must be [lon, lat]`);
  const [lon, lat] = coord;
  if (typeof lon !== 'number' || lon < -180 || lon > 180) fail(`${context}: invalid longitude`);
  if (typeof lat !== 'number' || lat < -90 || lat > 90) fail(`${context}: invalid latitude`);
}


function distanceKm(a, b) {
  const toRad = (value) => value * Math.PI / 180;
  const radius = 6371;
  const [lon1, lat1] = a;
  const [lon2, lat2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

for (const place of places) {
  if (place.demo) fail(`place ${place.id}: demo flag is not allowed in production data`);
  if (place.coordinates !== undefined) {
    checkCoordinate(place.coordinates, `place ${place.id}`);
    if (!coordinateRoles.has(place.coordinateRole)) fail(`place ${place.id}: mapped places require a coordinateRole`);
    if (place.confidence?.geographicIdentification === 'unknown' && place.coordinateRole === 'identified-site') fail(`place ${place.id}: unknown geography cannot be an identified-site`);
  }
  if (!confidenceLevels.has(place.confidence?.geographicIdentification)) fail(`place ${place.id}: invalid geographic confidence`);
  if (!interpretationLevels.has(place.confidence?.historicalInterpretation)) fail(`place ${place.id}: invalid interpretation confidence`);
  if (place.validFrom !== undefined && place.validTo !== undefined && place.validFrom > place.validTo) fail(`place ${place.id}: validFrom must be <= validTo`);
  checkSources(place.sourceIds, `place ${place.id}`);
  checkScripture(place.scripture, `place ${place.id}`);
  checkTextualReferences(place.textualReferences, `place ${place.id}`);
  for (const interpretation of place.interpretations || []) {
    if (!confidenceLevels.has(interpretation.status)) fail(`place ${place.id}: invalid interpretation status ${interpretation.status}`);
    checkSources(interpretation.sourceIds, `place ${place.id} interpretation ${interpretation.title}`);
  }
}

for (const person of people) {
  checkSources(person.sourceIds, `person ${person.id}`);
  checkScripture(person.scripture, `person ${person.id}`);
  checkTextualReferences(person.textualReferences, `person ${person.id}`);
  for (const id of person.relatedPlaceIds || []) if (!placeIds.has(id)) fail(`person ${person.id}: unknown place ${id}`);
}

for (const event of events) {
  if (!interpretationLevels.has(event.confidence)) fail(`event ${event.id}: invalid confidence ${event.confidence}`);
  checkSources(event.sourceIds, `event ${event.id}`);
  checkScripture(event.scripture, `event ${event.id}`);
  checkTextualReferences(event.textualReferences, `event ${event.id}`);
  for (const id of event.placeIds || []) if (!placeIds.has(id)) fail(`event ${event.id}: unknown place ${id}`);
  for (const id of event.personIds || []) if (!personIds.has(id)) fail(`event ${event.id}: unknown person ${id}`);
  if (event.dating) {
    if (!event.dating.label || !datingBases.has(event.dating.basis)) fail(`event ${event.id}: invalid dating metadata`);
    if (event.dating.from !== undefined && event.dating.to !== undefined && event.dating.from > event.dating.to) fail(`event ${event.id}: dating.from must be <= dating.to`);
  }
}

for (const journey of journeys) {
  if (journey.personId && !personIds.has(journey.personId)) fail(`journey ${journey.id}: unknown personId ${journey.personId}`);
  if (journey.character && !characters.has(journey.character)) fail(`journey ${journey.id}: unsupported character ${journey.character}`);
  if (!Array.isArray(journey.segments) || journey.segments.length === 0) fail(`journey ${journey.id}: no segments`);
  for (const segment of journey.segments || []) {
    if (!placeIds.has(segment.fromPlaceId)) fail(`journey ${journey.id}/${segment.id}: unknown fromPlaceId ${segment.fromPlaceId}`);
    if (!placeIds.has(segment.toPlaceId)) fail(`journey ${journey.id}/${segment.id}: unknown toPlaceId ${segment.toPlaceId}`);
    if (!routeCertainties.has(segment.routeCertainty)) fail(`journey ${journey.id}/${segment.id}: invalid route certainty ${segment.routeCertainty}`);
    if (!Array.isArray(segment.coordinates) || segment.coordinates.length < 2) fail(`journey ${journey.id}/${segment.id}: route must have at least two coordinates`);
    else {
      for (const coord of segment.coordinates) checkCoordinate(coord, `journey ${journey.id}/${segment.id}`);
      const fromPlace = places.find((place) => place.id === segment.fromPlaceId);
      const toPlace = places.find((place) => place.id === segment.toPlaceId);
      if (fromPlace?.coordinates && distanceKm(fromPlace.coordinates, segment.coordinates[0]) > 100) fail(`journey ${journey.id}/${segment.id}: route start is more than 100 km from ${segment.fromPlaceId}`);
      if (toPlace?.coordinates && distanceKm(toPlace.coordinates, segment.coordinates.at(-1)) > 100) fail(`journey ${journey.id}/${segment.id}: route end is more than 100 km from ${segment.toPlaceId}`);
    }
    checkSources(segment.sourceIds, `journey ${journey.id}/${segment.id}`);
    checkScripture(segment.scripture, `journey ${journey.id}/${segment.id}`);
  }
}

for (const story of stories) {
  if (story.personId && !personIds.has(story.personId)) fail(`story ${story.id}: unknown personId ${story.personId}`);
  if (!Array.isArray(story.chapters) || story.chapters.length === 0) fail(`story ${story.id}: no chapters`);
  const chapterIds = new Set();
  for (const chapter of story.chapters || []) {
    if (chapterIds.has(chapter.id)) fail(`story ${story.id}: duplicate chapter ${chapter.id}`);
    chapterIds.add(chapter.id);
    if (chapter.placeId && !placeIds.has(chapter.placeId)) fail(`story ${story.id}/${chapter.id}: unknown placeId ${chapter.placeId}`);
    if (chapter.journeyId && !journeyIds.has(chapter.journeyId)) fail(`story ${story.id}/${chapter.id}: unknown journeyId ${chapter.journeyId}`);
    if (chapter.camera?.center) {
      checkCoordinate(chapter.camera.center, `story ${story.id}/${chapter.id} camera`);
      const chapterPlace = chapter.placeId ? places.find((place) => place.id === chapter.placeId) : undefined;
      if (chapterPlace?.coordinates && distanceKm(chapterPlace.coordinates, chapter.camera.center) > 200) fail(`story ${story.id}/${chapter.id}: camera is more than 200 km from ${chapter.placeId}`);
    }
    checkScripture(chapter.scripture, `story ${story.id}/${chapter.id}`);
    checkTextualReferences(chapter.textualReferences, `story ${story.id}/${chapter.id}`);
    if (chapter.visionarySceneId && !visionaryIds.has(chapter.visionarySceneId)) fail(`story ${story.id}/${chapter.id}: unknown visionarySceneId ${chapter.visionarySceneId}`);
    if (chapter.contextYear !== undefined && (typeof chapter.contextYear !== 'number' || chapter.contextYear < -5000 || chapter.contextYear > 2100)) fail(`story ${story.id}/${chapter.id}: invalid contextYear`);
  }
}


for (const scene of visionaryScenes) {
  if (!scene.title || !scene.subtitle || !scene.visualType || !scene.summary) fail(`visionary scene ${scene.id}: malformed record`);
  checkScripture(scene.scripture, `visionary scene ${scene.id}`);
  checkSources(scene.sourceIds, `visionary scene ${scene.id}`);
  if (scene.metrics && !Array.isArray(scene.metrics)) fail(`visionary scene ${scene.id}: metrics must be an array`);
}

const regionIds = new Set();
for (const pack of packs) {
  if (pack.regions.type !== 'FeatureCollection') fail(`${pack.name}/context-regions.geojson must be a FeatureCollection`);
  for (const feature of pack.regions.features || []) {
    const id = feature.properties?.id;
    if (!id) fail(`${pack.name}: context region missing properties.id`);
    else if (regionIds.has(id)) fail(`context regions: duplicate id ${id}`);
    else regionIds.add(id);
    if (!confidenceLevels.has(feature.properties?.confidence)) fail(`context region ${id || '?'} has invalid confidence`);
    if (feature.properties?.sourceIds) checkSources(feature.properties.sourceIds, `context region ${id}`);
    if (feature.properties?.validFrom !== undefined && feature.properties?.validTo !== undefined && feature.properties.validFrom > feature.properties.validTo) fail(`context region ${id}: validFrom must be <= validTo`);
    if (feature.properties?.demo) fail(`context region ${id}: demo flag is not allowed`);
    const geom = feature.geometry;
    if (!geom || !['Polygon', 'MultiPolygon'].includes(geom.type)) fail(`context region ${id}: geometry must be Polygon or MultiPolygon`);
  }
  if (!Number.isInteger(pack.licenses.schemaVersion) || pack.licenses.schemaVersion < 2 || !Array.isArray(pack.licenses.records)) fail(`${pack.name}/licenses.json has an invalid schema`);
}

if (errors.length) {
  console.error(`Data validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`Atlas data validation passed across ${packs.length} content packs:`);
for (const pack of packs) console.log(` - ${pack.name}: ${pack.places.length} places, ${pack.people.length} people, ${pack.events.length} events, ${pack.journeys.length} journeys, ${pack.stories.length} stories, ${pack.sources.length} sources, ${pack.regions.features.length} context regions.`);
console.log(`Total: ${places.length} places, ${people.length} people, ${events.length} events, ${journeys.length} journeys, ${stories.length} stories, ${sources.length} sources, ${visionaryScenes.length} visionary scenes.`);
