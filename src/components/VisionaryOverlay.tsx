import { useAtlasStore } from '../state/useAtlasStore';
import type { VisionaryVisualType } from '../types/domain';

function VisionSvg({ type }: { type: VisionaryVisualType }) {
  return (
    <svg className={`visionary-svg visionary-svg--${type}`} viewBox="0 0 960 620" role="img" aria-label="Symbolic artistic visualization; not terrestrial geography">
      <defs>
        <radialGradient id="visionGlow"><stop offset="0" stopColor="rgba(244,218,154,.58)"/><stop offset="1" stopColor="rgba(244,218,154,0)"/></radialGradient>
        <linearGradient id="visionGold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f1d89a"/><stop offset="1" stopColor="#9d7f49"/></linearGradient>
        <linearGradient id="visionWater" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#426774"/><stop offset=".5" stopColor="#b9d8d4"/><stop offset="1" stopColor="#426774"/></linearGradient>
      </defs>
      <rect width="960" height="620" className="visionary-svg__bg" />
      <circle cx="480" cy="280" r="230" fill="url(#visionGlow)" opacity=".32" />
      <g className="visionary-stars">{Array.from({length:28}).map((_,i)=><circle key={i} cx={(i*137)%920+20} cy={(i*83)%400+20} r={(i%3)+1} />)}</g>

      {type === 'throne' && <>
        <ellipse className="visionary-orbit" cx="480" cy="300" rx="220" ry="92" />
        <ellipse className="visionary-orbit visionary-orbit--two" cx="480" cy="300" rx="160" ry="65" />
        <path className="visionary-throne" d="M408 354V232h32v-50h80v50h32v122h-32v56h-80v-56Z" />
        <circle className="visionary-lamb" cx="480" cy="320" r="32" />
        <path className="visionary-scroll" d="M583 276h116v55H583c-16-7-16-48 0-55Z" />
      </>}
      {type === 'cosmos' && <>
        <g className="visionary-rings">{[70,110,150,190,230].map(r=><circle key={r} cx="480" cy="300" r={r}/>)}</g>
        <g className="visionary-trumpets">{[0,1,2,3,4,5,6].map(i=><path key={i} transform={`rotate(${i*51.4} 480 300)`} d="M480 62 458 112h44Z" />)}</g>
        <circle className="visionary-core" cx="480" cy="300" r="34" />
      </>}
      {type === 'dragon' && <>
        <circle className="visionary-sun-disc" cx="315" cy="250" r="105" />
        <path className="visionary-woman" d="M290 357c38-80 13-122 38-166 17 41 19 87 51 166Z" />
        <path className="visionary-dragon" d="M584 198c78 8 133 73 124 143-8 61-71 99-135 73 55-5 78-37 62-66-18-34-77-22-99-61-23-41 5-83 48-89Z" />
        <g className="visionary-crowns">{[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${590+i*16} ${190+(i%2)*10} l8 -15 8 15Z`}/>)}</g>
      </>}
      {type === 'beasts' && <>
        <path className="visionary-sea" d="M0 415c130-49 248 39 382 0 149-43 280 47 578-4v209H0Z" />
        <path className="visionary-beast" d="M330 407c-31-92 20-188 103-190 89-3 144 101 99 190Z" />
        <path className="visionary-beast visionary-beast--two" d="M590 421c-25-71 17-148 78-148 72 0 108 79 70 148Z" />
        <text className="visionary-number" x="480" y="175" textAnchor="middle">666</text>
      </>}
      {type === 'babylon' && <>
        <path className="visionary-city" d="M240 430V262h62v-65h58v65h72v-94h74v94h70v-55h56v55h70v168Z" />
        <path className="visionary-cracks" d="M430 172 392 263l55 48-55 119m156-220-34 82 49 48-30 93M308 258l54 52-37 120" />
        <circle className="visionary-fire" cx="480" cy="350" r="190" />
      </>}
      {type === 'armageddon' && <>
        <path className="visionary-hills" d="M0 410 180 252l124 92 164-182 151 178 119-111 222 192v199H0Z" />
        <path className="visionary-horizon" d="M85 455h790" />
        <g className="visionary-standards">{[180,280,380,580,680,780].map(x=><path key={x} d={`M${x} 420v-95m0 15 42 18-42 18`}/>)}</g>
      </>}
      {type === 'judgment' && <>
        <path className="visionary-throne visionary-throne--white" d="M392 370V230h45v-58h86v58h45v140h-45v55h-86v-55Z" />
        <path className="visionary-books" d="M233 402h150v58H233Zm344 0h150v58H577Z" />
        <path className="visionary-groundline" d="M110 490h740" />
      </>}
      {type === 'new-jerusalem' && <>
        <g className="visionary-cube"><path d="M330 170 555 110l170 105-224 65Z"/><path d="M330 170v254l171 95V280Z"/><path d="M501 280v239l224-69V215Z"/></g>
        <g className="visionary-gates">{[0,1,2].map(i=><rect key={i} x={370+i*46} y={315+i*26} width="22" height="38" rx="11"/>)}</g>
        <path className="visionary-measure" d="M268 165v270m-14-270h28m-28 270h28M316 553h420m-420-14v28m420-28v28" />
      </>}
      {(type === 'river-tree' || type === 'genesis-revelation') && <>
        <path className="visionary-river" d="M480 166c-57 70-90 135-71 205 20 74-28 119-117 178h376c-89-59-137-104-117-178 19-70-14-135-71-205Z" />
        <g className="visionary-tree"><path d="M480 430V245m0 80-92-68m92 20 98-73m-98 119 120 62m-120-91-118 70"/><circle cx="387" cy="257" r="54"/><circle cx="584" cy="207" r="57"/><circle cx="604" cy="387" r="59"/><circle cx="360" cy="365" r="54"/></g>
        {type === 'genesis-revelation' && <path className="visionary-arc" d="M170 470C228 87 730 87 790 470" />}
      </>}
    </svg>
  );
}

export function VisionaryOverlay() {
  const data = useAtlasStore((s) => s.data);
  const storyId = useAtlasStore((s) => s.activeStoryId);
  const chapterIndex = useAtlasStore((s) => s.activeChapter);
  const story = data?.stories.find((item) => item.id === storyId);
  const chapter = story?.chapters[chapterIndex];
  const scene = chapter?.visionarySceneId ? data?.visionaryScenes.find((item) => item.id === chapter.visionarySceneId) : undefined;
  if (!scene) return null;
  const sceneSources = scene.sourceIds.map((id) => data?.sources.find((source) => source.id === id)).filter(Boolean).slice(0, 3);

  return (
    <section className="visionary-overlay" aria-label={`${scene.title} visionary visualization`}>
      <div className="visionary-overlay__wash" />
      <VisionSvg type={scene.visualType} />
      <div className="visionary-overlay__caption">
        <span>VISIONARY MODE · NOT TERRESTRIAL GEOGRAPHY</span>
        <strong>{scene.title}</strong>
        <p>{scene.summary}</p>
        <div className="scripture-chips">{scene.scripture.map((r)=><span key={r.label}>{r.label}</span>)}</div>
        {scene.metrics?.length ? <div className="visionary-metrics">{scene.metrics.map((m)=><div key={m.label}><small>{m.label}</small><b>{m.value}</b>{m.note && <em>{m.note}</em>}</div>)}</div> : null}
        {sceneSources.length > 0 && <div className="visionary-sources">Sources: {sceneSources.map((source) => source?.title).join(' · ')}</div>}
      </div>
    </section>
  );
}
