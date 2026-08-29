import type { BiblicalCharacter } from '../types/domain';

interface CharacterPortraitProps {
  character?: BiblicalCharacter;
  label: string;
  compact?: boolean;
}

export function CharacterPortrait({ character = 'generic', label, compact = false }: CharacterPortraitProps) {
  return (
    <div className={`character-portrait character-portrait--${character} ${compact ? 'character-portrait--compact' : ''}`} role="img" aria-label={`${label} — artistic silhouette, not a historical portrait`}>
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <path className="character-portrait__ground" d="M0 126c29-10 52-10 79-4 29 7 56 2 86-4 20-4 37-1 55 6v26H0Z" />
        <circle className="character-portrait__sun" cx="170" cy="38" r="23" />
        <path className="character-portrait__ridge" d="M0 103 42 76l26 18 28-28 31 30 24-18 69 28v22H0Z" />
        <g className="character-portrait__traveler">
          <circle cx="105" cy="46" r="10" />
          <path d="M94 61c8-8 23-8 29 1l7 28-15 5-1 34H94l3-35-13-4 10-29Z" />
          <path className="character-portrait__robe" d="m98 73-8 48h31l-7-49-7 18Z" />
          <path className="character-portrait__staff" d="m136 52 7 77" />
          {(['joshua', 'gideon', 'samson', 'saul', 'david', 'absalom', 'rehoboam', 'ahab', 'jehu', 'sennacherib', 'josiah', 'zedekiah', 'nebuchadnezzar-ii', 'cyrus-ii', 'darius-i', 'alexander-iii', 'antiochus-iv', 'judas-maccabeus', 'john-hyrcanus-i', 'pompey', 'herod-great', 'pontius-pilate', 'herod-agrippa-ii'] as BiblicalCharacter[]).includes(character) && <path className="character-portrait__spear" d="m78 58-5 68" />}
          {(['solomon', 'rehoboam', 'jeroboam-i', 'omri', 'ahab', 'hezekiah', 'sargon-ii', 'sennacherib', 'josiah', 'nebuchadnezzar-ii', 'cyrus-ii', 'darius-i', 'alexander-iii', 'antiochus-iv', 'judas-maccabeus', 'john-hyrcanus-i', 'pompey', 'herod-great', 'pontius-pilate', 'herod-agrippa-ii'] as BiblicalCharacter[]).includes(character) && <path className="character-portrait__headband" d="M96 42c6-4 14-4 20 0" />}
        </g>
        <g className="character-portrait__caravan" transform="translate(22 102)">
          <path d="M0 12c7-8 15-8 23-1 6-4 14-3 20 3l-3 7H4Z" />
          <circle cx="9" cy="23" r="3" /><circle cx="34" cy="23" r="3" />
        </g>
      </svg>
      <div className="character-portrait__caption">
        <strong>{label}</strong>
        <span>Artistic reconstruction</span>
      </div>
    </div>
  );
}
