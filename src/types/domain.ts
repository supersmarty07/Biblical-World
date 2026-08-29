export type ConfidenceLevel =
  | 'established'
  | 'probable'
  | 'possible'
  | 'traditional'
  | 'disputed'
  | 'unknown'
  | 'symbolic';

export type InterpretationConfidence = 'high' | 'moderate' | 'low' | 'traditional' | 'symbolic';
export type CoordinateRole = 'identified-site' | 'approximate-area' | 'candidate-site' | 'traditional-site' | 'display-anchor';
export type BiblicalCharacter = 'john-of-patmos' | 'abraham' | 'isaac' | 'jacob' | 'joseph' | 'moses' | 'joshua' | 'deborah' | 'gideon' | 'samson' | 'ruth' | 'samuel' | 'saul' | 'david' | 'absalom' | 'solomon' | 'rehoboam' | 'jeroboam-i' | 'shoshenq-i' | 'omri' | 'ahab' | 'jezebel' | 'elijah' | 'elisha' | 'jehu' | 'amos' | 'jonah' | 'isaiah' | 'hezekiah' | 'sargon-ii' | 'sennacherib' | 'josiah' | 'jeremiah' | 'zedekiah' | 'nebuchadnezzar-ii' | 'ezekiel' | 'daniel' | 'cyrus-ii' | 'zerubbabel' | 'darius-i' | 'esther' | 'ezra' | 'nehemiah' | 'alexander-iii' | 'antiochus-iv' | 'mattathias' | 'judas-maccabeus' | 'jonathan-apphus' | 'simon-thassi' | 'john-hyrcanus-i' | 'pompey' | 'herod-great' | 'augustus' | 'jesus' | 'john-baptist' | 'peter' | 'mary-magdalene' | 'herod-antipas' | 'pontius-pilate' | 'caiaphas' | 'paul' | 'stephen' | 'philip-evangelist' | 'barnabas' | 'cornelius' | 'silas' | 'timothy' | 'lydia' | 'priscilla' | 'aquila' | 'felix' | 'porcius-festus' | 'herod-agrippa-ii' | 'generic';

export type SourceKind = 'canonical-text' | 'deuterocanonical-text' | 'ancient-literary' | 'inscription' | 'documentary' | 'archaeology' | 'modern-scholarship' | 'project-methodology';

export interface TextualReference {
  label: string;
  sourceId: string;
  kind: 'deuterocanonical' | 'ancient-literary' | 'inscription' | 'documentary';
}

export interface SourceRef {
  id: string;
  title: string;
  organization?: string;
  author?: string;
  year?: number;
  dateLabel?: string;
  url?: string;
  license?: string;
  licenseUrl?: string;
  attribution?: string;
  verifiedAt?: string;
  notes?: string;
  kind?: SourceKind;
}

export interface ScriptureRef {
  book: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  label: string;
}

export interface InterpretationRecord {
  title: string;
  status: ConfidenceLevel;
  summary: string;
  sourceIds: string[];
}

export interface PlaceRecord {
  id: string;
  name: string;
  aliases: string[];
  coordinates?: [number, number];
  coordinateRole?: CoordinateRole;
  locationNote?: string;
  summary: string;
  historicalContext?: string;
  archaeology?: string;
  validFrom?: number;
  validTo?: number;
  category: 'city' | 'region' | 'mountain' | 'site' | 'water' | 'other';
  confidence: {
    geographicIdentification: ConfidenceLevel;
    historicalInterpretation: InterpretationConfidence;
    explanation: string;
  };
  scripture: ScriptureRef[];
  textualReferences?: TextualReference[];
  sourceIds: string[];
  externalIds?: Record<string, string>;
  interpretations?: InterpretationRecord[];
  demo?: boolean;
}

export interface JourneySegment {
  id: string;
  fromPlaceId: string;
  toPlaceId: string;
  routeCertainty: 'known-sequence' | 'reconstructed' | 'unknown';
  coordinates: [number, number][];
  scripture: ScriptureRef[];
  sourceIds: string[];
  note?: string;
}

export interface JourneyRecord {
  id: string;
  name: string;
  person: string;
  personId?: string;
  character?: BiblicalCharacter;
  summary: string;
  segments: JourneySegment[];
  demo?: boolean;
}

export interface StoryChapter {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  placeId?: string;
  journeyId?: string;
  scripture: ScriptureRef[];
  textualReferences?: TextualReference[];
  contextYear?: number;
  visionarySceneId?: string;
  camera?: {
    center: [number, number];
    zoom: number;
    pitch?: number;
    bearing?: number;
  };
}

export type VisionaryVisualType = 'throne' | 'cosmos' | 'dragon' | 'beasts' | 'babylon' | 'armageddon' | 'judgment' | 'new-jerusalem' | 'river-tree' | 'genesis-revelation';

export interface VisionaryScene {
  id: string;
  title: string;
  subtitle: string;
  visualType: VisionaryVisualType;
  summary: string;
  scripture: ScriptureRef[];
  sourceIds: string[];
  metrics?: { label: string; value: string; note?: string }[];
}

export interface StoryRecord {
  id: string;
  title: string;
  subtitle: string;
  personId?: string;
  theme?: string;
  chapters: StoryChapter[];
  demo?: boolean;
}

export interface PersonRecord {
  id: string;
  name: string;
  aliases: string[];
  era: string;
  summary: string;
  scripture: ScriptureRef[];
  textualReferences?: TextualReference[];
  relatedPlaceIds: string[];
  sourceIds: string[];
  artisticNote?: string;
}

export interface EventDating {
  from?: number;
  to?: number;
  label: string;
  basis: 'historical' | 'conventional' | 'approximate' | 'textual';
  note?: string;
}

export interface EventRecord {
  id: string;
  title: string;
  summary: string;
  confidence: InterpretationConfidence;
  placeIds: string[];
  personIds: string[];
  scripture: ScriptureRef[];
  textualReferences?: TextualReference[];
  sourceIds: string[];
  historicalNote?: string;
  dating?: EventDating;
}

export interface ContextRegion {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    validFrom?: number;
    validTo?: number;
    confidence: ConfidenceLevel;
    sourceIds?: string[];
    note?: string;
    demo?: boolean;
    family?: string;
  };
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
}

export interface AtlasData {
  places: PlaceRecord[];
  journeys: JourneyRecord[];
  stories: StoryRecord[];
  people: PersonRecord[];
  events: EventRecord[];
  sources: SourceRef[];
  regions: GeoJSON.FeatureCollection;
  visionaryScenes: VisionaryScene[];
}
