import { z } from 'zod';

const evidenceClassSchema = z.enum([
  'real-terrain',
  'known-archaeology',
  'historical-inference',
  'artistic-reconstruction',
  'tradition',
  'unknown-disputed'
]);

const confidenceSchema = z.enum([
  'established',
  'probable',
  'possible',
  'traditional',
  'disputed',
  'unknown',
  'symbolic'
]);

const scriptureRefSchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive(),
  verseStart: z.number().int().positive().optional(),
  verseEnd: z.number().int().positive().optional(),
  label: z.string().min(1)
});

const rendererSchema = z.enum(['map-terrain', 'panorama', 'parallax']);
const availabilitySchema = z.enum(['prototype', 'ready']);
const coordinateRoleSchema = z.enum(['identified-site', 'approximate-area', 'candidate-site', 'traditional-site', 'display-anchor']);
const schematicEnvironmentSchema = z.enum(['mountain-wilderness', 'delta-marsh', 'gulf-coast', 'arid-gulf', 'coastal-plain', 'central-highlands', 'jezreel-lowlands', 'jordan-valley', 'shephelah', 'galilean-hills', 'galilee-lakeshore', 'judean-wilderness', 'negev']);
const sceneCameraSchema = z.object({
  center: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
  zoom: z.number(),
  pitch: z.number().min(0).max(85).optional(),
  bearing: z.number().min(-180).max(180).optional(),
  coordinateRole: coordinateRoleSchema.optional(),
  note: z.string().min(1).optional()
});

export const immersiveSceneCatalogEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  summary: z.string().min(1),
  renderer: rendererSchema,
  availability: availabilitySchema,
  placeIds: z.array(z.string()),
  tags: z.array(z.string()),
  scenePath: z.string().regex(/^data\/immersive\/scenes\/[a-z0-9-]+\.json$/)
});

export const immersiveSceneCatalogSchema = z.object({
  schemaVersion: z.literal(1),
  scenes: z.array(immersiveSceneCatalogEntrySchema)
});

const assetSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['image', 'panorama', 'overlay', 'mask', 'texture']),
  src: z.string().min(1),
  mediaType: z.string().min(1).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  hosting: z.enum(['bundled', 'external']),
  provenance: z.object({
    verificationStatus: z.enum(['project-authored', 'primary-verified', 'research-supplied', 'needs-verification']),
    sourceUrl: z.string().url().optional(),
    license: z.string().min(1).optional(),
    licenseUrl: z.string().url().optional(),
    attribution: z.string().min(1).optional(),
    notes: z.string().min(1)
  })
});

const hotspotPositionSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('image'), x: z.number().min(0).max(1), y: z.number().min(0).max(1) }),
  z.object({ kind: z.literal('geographic'), coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]) })
]);

const hotspotSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  summary: z.string().min(1),
  position: hotspotPositionSchema,
  evidenceClass: evidenceClassSchema,
  confidence: confidenceSchema,
  scripture: z.array(scriptureRefSchema),
  sourceIds: z.array(z.string()).min(1),
  placeId: z.string().optional(),
  variantIds: z.array(z.string().min(1)).optional(),
  periodIds: z.array(z.string().min(1)).optional(),
  whyShown: z.object({
    evidence: z.string().min(1),
    inference: z.string().min(1).optional(),
    alternatives: z.string().min(1).optional()
  })
});

export const immersiveSceneSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  summary: z.string().min(1),
  renderer: rendererSchema,
  availability: availabilitySchema,
  placeIds: z.array(z.string()),
  disclaimer: z.string().min(1),
  evidenceLegend: z.array(z.object({
    class: evidenceClassSchema,
    label: z.string().min(1),
    description: z.string().min(1)
  })).min(1),
  periods: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    from: z.number().optional(),
    to: z.number().optional(),
    note: z.string().min(1),
    camera: sceneCameraSchema.optional()
  })),
  defaultPeriodId: z.string().optional(),
  entryCamera: sceneCameraSchema.optional(),
  panorama: z.object({
    assetId: z.string().optional(),
    alt: z.string().min(1),
    worldWidthPercent: z.number().min(100).max(400),
    initialPan: z.number().min(0).max(1)
  }).optional(),
  parallax: z.object({
    layerAssetIds: z.array(z.string()),
    pointerDepth: z.number().min(0).max(40)
  }).optional(),
  comparison: z.object({
    presentation: z.enum(['alternatives', 'regions', 'concepts']).optional(),
    label: z.string().min(1),
    intro: z.string().min(1),
    defaultOptionId: z.string().min(1),
    options: z.array(z.object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      label: z.string().min(1),
      status: confidenceSchema,
      summary: z.string().min(1),
      rationale: z.string().min(1),
      objections: z.string().min(1).optional(),
      sourceIds: z.array(z.string()).min(1),
      placeIds: z.array(z.string()),
      camera: sceneCameraSchema.optional(),
      panoramaAssetId: z.string().min(1).optional(),
      fallbackEnvironment: schematicEnvironmentSchema.optional()
    })).min(2)
  }).optional(),
  assets: z.array(assetSchema),
  hotspots: z.array(hotspotSchema)
}).superRefine((scene, ctx) => {
  if (scene.renderer === 'panorama' && !scene.panorama) {
    ctx.addIssue({ code: 'custom', message: 'Panorama scenes require a panorama configuration', path: ['panorama'] });
  }
  if (scene.renderer === 'parallax' && !scene.parallax) {
    ctx.addIssue({ code: 'custom', message: 'Parallax scenes require a parallax configuration', path: ['parallax'] });
  }
  if (scene.renderer === 'map-terrain' && !scene.entryCamera) {
    ctx.addIssue({ code: 'custom', message: 'Map terrain scenes require an entryCamera', path: ['entryCamera'] });
  }
  if (scene.defaultPeriodId && !scene.periods.some((period) => period.id === scene.defaultPeriodId)) {
    ctx.addIssue({ code: 'custom', message: 'defaultPeriodId must reference a declared period', path: ['defaultPeriodId'] });
  }
  const periodIds = new Set(scene.periods.map((period) => period.id));
  for (const period of scene.periods) {
    if (period.camera && (!period.camera.coordinateRole || !period.camera.note)) {
      ctx.addIssue({ code: 'custom', message: `Period camera ${period.id} requires coordinateRole and note`, path: ['periods'] });
    }
  }
  const assetIds = new Set(scene.assets.map((asset) => asset.id));
  if (scene.panorama?.assetId && !assetIds.has(scene.panorama.assetId)) {
    ctx.addIssue({ code: 'custom', message: 'panorama.assetId must reference a declared asset', path: ['panorama', 'assetId'] });
  }
  for (const id of scene.parallax?.layerAssetIds ?? []) {
    if (!assetIds.has(id)) ctx.addIssue({ code: 'custom', message: `Unknown parallax asset ${id}`, path: ['parallax', 'layerAssetIds'] });
  }
  const comparisonIds = new Set(scene.comparison?.options.map((option) => option.id) ?? []);
  if (scene.comparison) {
    if (!comparisonIds.has(scene.comparison.defaultOptionId)) {
      ctx.addIssue({ code: 'custom', message: 'comparison.defaultOptionId must reference a declared option', path: ['comparison', 'defaultOptionId'] });
    }
    for (const option of scene.comparison.options) {
      if (option.panoramaAssetId && !assetIds.has(option.panoramaAssetId)) {
        ctx.addIssue({ code: 'custom', message: `Unknown comparison panorama asset ${option.panoramaAssetId}`, path: ['comparison', 'options'] });
      }
    }
  }
  for (const hotspot of scene.hotspots) {
    for (const variantId of hotspot.variantIds ?? []) {
      if (!comparisonIds.has(variantId)) ctx.addIssue({ code: 'custom', message: `Unknown hotspot variant ${variantId}`, path: ['hotspots'] });
    }
    for (const periodId of hotspot.periodIds ?? []) {
      if (!periodIds.has(periodId)) ctx.addIssue({ code: 'custom', message: `Unknown hotspot period ${periodId}`, path: ['hotspots'] });
    }
  }
});
