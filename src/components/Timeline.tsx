import { useAtlasStore } from '../state/useAtlasStore';
import { formatHistoricalYear } from '../lib/time';

const marks = [-3000, -2000, -1200, -586, -332, -167, -63, 1, 30, 44, 52, 70, 95, 110];

function contextLabel(year: number): string {
  if (year <= -2000) return 'Early / Middle Bronze context';
  if (year <= -1550) return 'Middle Bronze context';
  if (year <= -1200) return 'Late Bronze context';
  if (year <= -1050) return 'Iron Age I / Judges transition context';
  if (year <= -930) return 'Early monarchy / Iron I–II transition';
  if (year <= -840) return 'Early divided monarchy / Omride context';
  if (year <= -732) return 'Israel, Judah & Aram / Assyrian expansion';
  if (year <= -701) return 'Fall of Samaria / Assyrian imperial context';
  if (year <= -609) return 'Late Iron Age II / Judah under imperial pressure';
  if (year <= -586) return 'Final Kingdom of Judah / Babylonian conquest';
  if (year <= -539) return 'Neo-Babylonian rule / exile';
  if (year <= -515) return 'Early Persian rule / return and temple restoration';
  if (year <= -445) return 'Persian Yehud / Esther–Ezra–Nehemiah world';
  if (year <= -332) return 'Later Achaemenid Persian context';
  if (year <= -301) return 'Alexander & early Successor context';
  if (year <= -200) return 'Ptolemaic Judea / Hellenistic diaspora';
  if (year <= -167) return 'Seleucid Judea / imperial transition';
  if (year <= -142) return 'Maccabean revolt';
  if (year <= -63) return 'Hasmonean state';
  if (year <= -37) return 'Roman intervention / late Hasmonean crisis';
  if (year <= -4) return 'Herodian kingdom';
  if (year <= 6) return 'Herodian succession / Archelaus transition';
  if (year <= 26) return 'Roman Judaea / Antipas & Philip tetrarchies';
  if (year <= 36) return 'Gospel ministry / Pilate–Caiaphas context';
  if (year <= 44) return 'Jerusalem church / Agrippa I context';
  if (year <= 52) return 'Antioch missions / Claudius / Gallio context';
  if (year <= 60) return 'Pauline missions / Roman provincial world';
  if (year <= 70) return 'Acts finale / Paul in Rome / early imperial church';
  if (year <= 100) return 'Revelation / Roman Asia / late first-century church';
  return 'Early second-century Roman Christian context';
}

export function Timeline() {
  const year = useAtlasStore((s) => s.year);
  const setYear = useAtlasStore((s) => s.setYear);

  return (
    <section className="timeline" aria-label="Historical context timeline">
      <div className="timeline__headline">
        <div><span className="eyebrow">Historical context lens · {contextLabel(year)}</span><strong>{formatHistoricalYear(year)}</strong></div>
        <span className="timeline__note">The slider changes time-aware context regions. Secure historical dates are used where evidence supports them; earlier narratives and ancient borders remain approximate or undated when precision would be misleading.</span>
      </div>
      <input aria-label="Historical context year" type="range" min={-3000} max={110} step={1} value={year} onChange={(event) => setYear(Number(event.target.value))} />
      <div className="timeline__marks" aria-hidden="true">{marks.map((mark) => <span key={mark}>{formatHistoricalYear(mark)}</span>)}</div>
    </section>
  );
}
