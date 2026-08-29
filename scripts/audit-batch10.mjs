import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root=process.cwd(), pack='revelation';
const read=(name)=>fs.readFile(path.join(root,'public','data',pack,name),'utf8').then(JSON.parse);
const [places,people,events,journeys,stories,sources,regions,scenes]=await Promise.all(['places.json','people.json','events.json','journeys.json','stories.json','sources.json','context-regions.geojson','visionary-scenes.json'].map(read));
const byPlace=new Map(places.map(x=>[x.id,x])), byPerson=new Map(people.map(x=>[x.id,x])), byEvent=new Map(events.map(x=>[x.id,x])), byScene=new Map(scenes.map(x=>[x.id,x]));
const errors=[]; const fail=(m)=>errors.push(m);
for(const id of ['patmos','smyrna','pergamum','thyatira','sardis-revelation','philadelphia-asia','roman-asia-revelation','babylon-great-revelation','har-magedon-revelation','new-jerusalem-revelation']) if(!byPlace.has(id)) fail(`Missing key Revelation place ${id}`);
for(const id of ['john-of-patmos','domitian','antipas-pergamum','jezebel-thyatira-revelation','michael-revelation']) if(!byPerson.has(id)) fail(`Missing key Revelation person ${id}`);
for(const id of ['story-patmos-revelation','story-seven-churches-revelation','story-throne-seals','story-woman-beasts','story-babylon-armageddon','story-new-creation','story-genesis-to-revelation']) if(!stories.some(s=>s.id===id)) fail(`Missing Batch 10 story ${id}`);
for(const id of ['vision-throne-lamb','vision-woman-dragon','vision-beasts','vision-babylon','vision-armageddon','vision-final-judgment','vision-new-jerusalem','vision-river-tree','vision-genesis-revelation']) if(!byScene.has(id)) fail(`Missing visionary scene ${id}`);

for(const id of ['babylon-great-revelation','har-magedon-revelation','heavenly-throne-revelation','abyss-revelation','gog-magog-revelation','lake-fire-revelation','new-jerusalem-revelation','river-life-revelation']) {
  const p=byPlace.get(id); if(!p) continue;
  if(p.coordinates) fail(`${id} must not receive terrestrial coordinates`);
  if(!['symbolic','unknown'].includes(p.confidence?.geographicIdentification)) fail(`${id} must remain symbolic/unknown geography`);
}
if(byPlace.get('cave-apocalypse-patmos')?.confidence?.geographicIdentification!=='traditional') fail('Cave of Apocalypse must remain a traditional site, not established');
if(byPlace.get('pergamum-great-altar')?.confidence?.historicalInterpretation!=='low') fail('Great Altar → Satan’s throne correlation must remain low-confidence interpretation');
if(byPlace.get('har-magedon-revelation')?.coordinates) fail('Har-Magedon must not be silently collapsed into Tell Megiddo');
if(!/Rome.*referent|Rome as.*referent/i.test(JSON.stringify(byPlace.get('babylon-great-revelation')))) fail('Babylon the Great should explain Rome as an interpretive referent without geolocating the vision to Rome');
if(!/does not name Domitian|does not name.*Domitian/i.test(byPerson.get('domitian')?.summary||'')) fail('Domitian record must state Revelation does not name him');
if(!/debated/i.test(byEvent.get('event-john-patmos')?.dating?.note||'')) fail('Revelation dating must remain explicitly debated');
if(!/not a recovered.*itinerary|not evidence.*traveled|literary order/i.test(journeys[0]?.summary+' '+JSON.stringify(journeys[0]?.segments))) fail('Seven-church sequence must not masquerade as a recovered courier itinerary');
if(journeys.some(j=>JSON.stringify(j).includes('patmos') && j.id!=='journey-seven-churches-literary-sequence')) fail('No invented John travel route to/from Patmos is allowed');
if(!/12,000 stadia/.test(JSON.stringify(byScene.get('vision-new-jerusalem')))) fail('New Jerusalem scene must preserve the text’s 12,000-stadia measure');
if(!/Approximately 2,200 km|stadion lengths varied/.test(JSON.stringify(byScene.get('vision-new-jerusalem')))) fail('New Jerusalem metric must disclose approximate conversion and stadion uncertainty');
if(!/water.*plausible|water.*proposal|not.*proven/i.test((byEvent.get('event-laodicea-revelation')?.historicalNote||''))) fail('Laodicea water-context proposal must remain explicitly non-proven');
if(byPerson.has('john-zebedee')) fail('Batch 10 must not clone John son of Zebedee; John of Patmos is intentionally a separate record');

for(const feature of regions.features||[]){ if(feature.properties?.confidence==='established') fail(`Context region ${feature.properties?.id} must not claim survey-precise established geometry`); if(!/(general|schematic|not a.*border|not.*survey|orientation)/i.test(feature.properties?.note||'')) fail(`Context region ${feature.properties?.id} lacks generalization warning`); }
for(const s of sources){ if(!s.kind) fail(`Source ${s.id} must declare kind`); if(typeof s.year==='number'&&s.year<0) fail(`Ancient source ${s.id} must use dateLabel rather than negative year`); }
for(const story of stories) for(const ch of story.chapters||[]) if(ch.visionarySceneId&&!byScene.has(ch.visionarySceneId)) fail(`${story.id}/${ch.id} references missing scene ${ch.visionarySceneId}`);

if(errors.length){console.error(`Batch 10 audit failed with ${errors.length} error(s):`); for(const e of errors) console.error(` - ${e}`); process.exit(1);}
console.log(`Batch 10 editorial audit passed: ${places.length} places, ${people.length} people, ${events.length} events, ${journeys.length} literary sequence, ${stories.length} stories, ${sources.length} sources, ${scenes.length} visionary scenes, ${regions.features.length} context regions.`);
