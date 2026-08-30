import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const pkg = json('package.json');
const alphaMatch = /^2\.0\.0-alpha\.(\d+)$/.exec(pkg.version);
if (!alphaMatch || Number(alphaMatch[1]) < 17) throw new Error(`Expected package version alpha.17 or later, found ${pkg.version}`);

const overlay = read('src/components/ImmersiveSceneOverlay.tsx');
for (const needle of [
  'scene-compact-hud',
  'SceneInfoDrawer',
  'scene-camera-float',
  'ScenePeriodCompact',
  "'system' | 'on' | 'off'",
  'biblical-world-motion-mode',
  'Motion: On to override'
]) {
  if (!overlay.includes(needle)) throw new Error(`Full-screen immersive shell missing: ${needle}`);
}
if (overlay.includes('<header className="scene-header">')) throw new Error('Legacy permanent scene header must not remain in the primary immersive world shell');

const app = read('src/App.tsx');
if (!app.includes('app-shell--scene-open')) throw new Error('App must expose a scene-open shell state so the world can take the full viewport');
const bottom = read('src/components/BottomNav.tsx');
if (!bottom.includes('if (activeSceneId) return null')) throw new Error('Bottom navigation must hide while an immersive world is open');

const css = read('src/styles.css');
for (const needle of [
  '.app-shell--scene-open .topbar { display: none; }',
  '.scene-info-drawer',
  '.scene-cinematic__compact-controls',
  '.scene-camera-float',
  '.motion-override-on',
  '@media (max-width: 860px) and (orientation: landscape)'
]) {
  if (!css.includes(needle)) throw new Error(`Alpha.17 immersive CSS missing: ${needle}`);
}
const sw = read('public/sw.js');
if (!sw.includes('v2-alpha17-runtime')) throw new Error('Service-worker runtime cache must be bumped for alpha.17');
const workflow = read('.github/workflows/deploy.yml');
if (!workflow.includes('branches: [main, BIBLE-WORLD-V4]')) throw new Error('BIBLE-WORLD-V4 deployment branch must remain active');

console.log('V2 alpha.17 audit passed: full-screen scene shell, collapsed evidence drawer, floating 3D controls, explicit motion override, landscape-phone layout, and BIBLE-WORLD-V4 deployment are protected.');
