import { z } from 'zod';

const scriptureRefSchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive(),
  verseStart: z.number().int().positive().optional(),
  verseEnd: z.number().int().positive().optional(),
  label: z.string().min(1)
});


const textualReferenceSchema = z.object({
  label: z.string().min(1),
  sourceId: z.string().min(1),
  kind: z.enum(['deuterocanonical', 'ancient-literary', 'inscription', 'documentary'])
});

const confidenceSchema = z.enum([
  'established',
  'probable',
  'possible',
  'traditional',
  'disputed',
  'unknown',
  'symbolic'
]);

const interpretationSchema = z.object({
  title: z.string().min(1),
  status: confidenceSchema,
  summary: z.string().min(1),
  sourceIds: z.array(z.string()).min(1)
});

export const placeRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  aliases: z.array(z.string()),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90)
  ]).optional(),
  coordinateRole: z.enum(['identified-site', 'approximate-area', 'candidate-site', 'traditional-site', 'display-anchor']).optional(),
  locationNote: z.string().min(1).optional(),
  summary: z.string().min(1),
  historicalContext: z.string().min(1).optional(),
  archaeology: z.string().min(1).optional(),
  validFrom: z.number().optional(),
  validTo: z.number().optional(),
  category: z.enum(['city', 'region', 'mountain', 'site', 'water', 'other']),
  confidence: z.object({
    geographicIdentification: confidenceSchema,
    historicalInterpretation: z.enum(['high', 'moderate', 'low', 'traditional', 'symbolic']),
    explanation: z.string().min(1)
  }),
  scripture: z.array(scriptureRefSchema),
  textualReferences: z.array(textualReferenceSchema).optional(),
  sourceIds: z.array(z.string()).min(1),
  externalIds: z.record(z.string(), z.string()).optional(),
  interpretations: z.array(interpretationSchema).optional(),
  demo: z.boolean().optional()
});

export const journeyRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  person: z.string().min(1),
  personId: z.string().optional(),
  character: z.enum(['abraham', 'isaac', 'jacob', 'joseph', 'moses', 'joshua', 'deborah', 'gideon', 'samson', 'ruth', 'samuel', 'saul', 'david', 'absalom', 'solomon', 'rehoboam', 'jeroboam-i', 'shoshenq-i', 'omri', 'ahab', 'jezebel', 'elijah', 'elisha', 'jehu', 'amos', 'jonah', 'isaiah', 'hezekiah', 'sargon-ii', 'sennacherib', 'josiah', 'jeremiah', 'zedekiah', 'nebuchadnezzar-ii', 'ezekiel', 'daniel', 'cyrus-ii', 'zerubbabel', 'darius-i', 'esther', 'ezra', 'nehemiah', 'alexander-iii', 'antiochus-iv', 'mattathias', 'judas-maccabeus', 'jonathan-apphus', 'simon-thassi', 'john-hyrcanus-i', 'pompey', 'herod-great', 'augustus', 'jesus', 'john-baptist', 'peter', 'mary-magdalene', 'herod-antipas', 'pontius-pilate', 'caiaphas', 'paul', 'stephen', 'philip-evangelist', 'barnabas', 'cornelius', 'silas', 'timothy', 'lydia', 'priscilla', 'aquila', 'felix', 'porcius-festus', 'herod-agrippa-ii', 'john-of-patmos', 'generic']).optional(),
  summary: z.string().min(1),
  segments: z.array(z.object({
    id: z.string().min(1),
    fromPlaceId: z.string().min(1),
    toPlaceId: z.string().min(1),
    routeCertainty: z.enum(['known-sequence', 'reconstructed', 'unknown']),
    coordinates: z.array(z.tuple([z.number(), z.number()])).min(2),
    scripture: z.array(scriptureRefSchema),
    sourceIds: z.array(z.string()).min(1),
    note: z.string().min(1).optional()
  })).min(1),
  demo: z.boolean().optional()
});

export const storyRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  personId: z.string().optional(),
  theme: z.string().optional(),
  chapters: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    eyebrow: z.string(),
    description: z.string().min(1),
    placeId: z.string().optional(),
    journeyId: z.string().optional(),
    scripture: z.array(scriptureRefSchema),
    textualReferences: z.array(textualReferenceSchema).optional(),
    contextYear: z.number().optional(),
    visionarySceneId: z.string().min(1).optional(),
    immersiveSceneId: z.string().min(1).optional(),
    immersiveVariantId: z.string().min(1).optional(),
    immersivePeriodId: z.string().min(1).optional(),
    immersiveHotspotId: z.string().min(1).optional(),
    camera: z.object({
      center: z.tuple([z.number(), z.number()]),
      zoom: z.number(),
      pitch: z.number().optional(),
      bearing: z.number().optional()
    }).optional()
  })).min(1),
  demo: z.boolean().optional()
});

export const personRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  aliases: z.array(z.string()),
  era: z.string().min(1),
  summary: z.string().min(1),
  scripture: z.array(scriptureRefSchema),
  textualReferences: z.array(textualReferenceSchema).optional(),
  relatedPlaceIds: z.array(z.string()),
  sourceIds: z.array(z.string()).min(1),
  artisticNote: z.string().optional()
});

export const eventRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  confidence: z.enum(['high', 'moderate', 'low', 'traditional', 'symbolic']),
  placeIds: z.array(z.string()),
  personIds: z.array(z.string()),
  scripture: z.array(scriptureRefSchema),
  textualReferences: z.array(textualReferenceSchema).optional(),
  sourceIds: z.array(z.string()).min(1),
  historicalNote: z.string().optional(),
  dating: z.object({
    from: z.number().optional(),
    to: z.number().optional(),
    label: z.string().min(1),
    basis: z.enum(['historical', 'conventional', 'approximate', 'textual']),
    note: z.string().optional()
  }).optional()
});

export const sourceRefSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  organization: z.string().optional(),
  author: z.string().optional(),
  year: z.number().int().optional(),
  dateLabel: z.string().min(1).optional(),
  url: z.string().url().optional(),
  license: z.string().optional(),
  licenseUrl: z.string().url().optional(),
  attribution: z.string().optional(),
  verifiedAt: z.string().optional(),
  verificationStatus: z.enum(['project-authored', 'primary-verified', 'research-supplied', 'needs-verification']).optional(),
  verificationNote: z.string().optional(),
  accessedAt: z.string().optional(),
  doi: z.string().optional(),
  isbn: z.string().optional(),
  edition: z.string().optional(),
  pages: z.string().optional(),
  notes: z.string().optional(),
  kind: z.enum(['canonical-text', 'deuterocanonical-text', 'ancient-literary', 'inscription', 'documentary', 'archaeology', 'modern-scholarship', 'project-methodology']).optional()
});

export const regionsSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(z.unknown())
});

export const visionarySceneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  visualType: z.enum(['throne','cosmos','dragon','beasts','babylon','armageddon','judgment','new-jerusalem','river-tree','genesis-revelation']),
  summary: z.string().min(1),
  scripture: z.array(scriptureRefSchema),
  sourceIds: z.array(z.string()).min(1),
  metrics: z.array(z.object({ label: z.string().min(1), value: z.string().min(1), note: z.string().optional() })).optional()
});
