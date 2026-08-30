import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const pkg = json('package.json');
const alphaMatch = /^2\.0\.0-alpha\.(\d+)$/.exec(pkg.version);
if (!alphaMatch || Number(alphaMatch[1]) < 16) throw new Error(`Expected package version alpha.16 or later, found ${pkg.version}`);

const explore = read('src/components/ImmersiveExplore.tsx');
for (const needle of ['Jerusalem Through Time', 'The Galilee of Jesus', 'Megiddo & the Great Valley', 'Wilderness & Exodus Environment', 'Real terrain', 'Artistic reconstruction']) {
  if (!explore.includes(needle)) throw new Error(`ImmersiveExplore missing flagship-world element: ${needle}`);
}
const bottom = read('src/components/BottomNav.tsx');
for (const needle of ['Explore', 'Map', 'Stories', 'Journeys', 'Layers', 'setImmersiveExploreOpen']) {
  if (!bottom.includes(needle)) throw new Error(`BottomNav missing alpha.16 navigation: ${needle}`);
}
const layers = read('src/components/LayerControls.tsx');
if (!layers.includes('layer-panel--mobile-open') || !layers.includes('layer-sheet-backdrop')) throw new Error('Mobile layers must be a dismissible bottom sheet');
const timeline = read('src/components/Timeline.tsx');
if (!timeline.includes('timeline__mobile-toggle') || !timeline.includes('Change period')) throw new Error('Mobile timeline must collapse to a compact period control');
const store = read('src/state/useAtlasStore.ts');
if (!store.includes('journeys: !isMobileViewport') || !store.includes('regions: !isMobileViewport')) throw new Error('Mobile macro map must default to decluttered journeys/regions');
const map = read('src/components/MapView.tsx');
if (!map.includes('mobileMap ? 5.8 : 4.1') || !map.includes("'text-optional': true")) throw new Error('Mobile map label decluttering guardrails are missing');
const css = read('src/styles.css');
for (const needle of ['.immersive-explore', '.world-card--hero', '.layer-panel--mobile-open', '.timeline__mobile-toggle', '.bottom-nav button.is-active']) {
  if (!css.includes(needle)) throw new Error(`Alpha.16 mobile visual CSS missing: ${needle}`);
}
const workflow = read('.github/workflows/deploy.yml');
if (!workflow.includes('branches: [main, BIBLE-WORLD-V4]')) throw new Error('BIBLE-WORLD-V4 deployment branch must remain active');
const sw = read('public/sw.js');
if (!/v2-alpha(?:1[6-9]|[2-9]\d+)-runtime/.test(sw)) throw new Error('Service-worker runtime cache must be alpha.16 or later');
console.log('V2 alpha.16 audit passed: immersive-first mobile home, flagship worlds, map decluttering, bottom-sheet layers, compact timeline, and BIBLE-WORLD-V4 deployment are protected.');
