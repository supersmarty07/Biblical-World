import { describe, expect, it } from 'vitest';
import { immersiveSceneSchema } from './immersiveSchema';

const baseScene = {
  schemaVersion: 1 as const,
  id: 'test-scene',
  title: 'Test scene',
  subtitle: 'Schema fixture',
  summary: 'A minimal valid immersive scene used only by unit tests.',
  renderer: 'panorama' as const,
  availability: 'prototype' as const,
  placeIds: [],
  disclaimer: 'Test-only reconstruction disclaimer.',
  evidenceLegend: [{ class: 'artistic-reconstruction' as const, label: 'Reconstruction', description: 'Test legend.' }],
  periods: [],
  panorama: { alt: 'Test panorama', worldWidthPercent: 180, initialPan: 0.5 },
  assets: [],
  hotspots: [{
    id: 'test-hotspot',
    label: 'Test hotspot',
    summary: 'Test hotspot summary.',
    position: { kind: 'image' as const, x: 0.5, y: 0.5 },
    evidenceClass: 'artistic-reconstruction' as const,
    confidence: 'possible' as const,
    scripture: [{ book: 'Genesis', chapter: 1, label: 'Genesis 1' }],
    sourceIds: ['source-test'],
    whyShown: { evidence: 'Test evidence boundary.' }
  }]
};

describe('immersiveSceneSchema', () => {
  it('accepts a valid panorama scene', () => {
    expect(immersiveSceneSchema.parse(baseScene).id).toBe('test-scene');
  });

  it('rejects panorama scenes without panorama configuration', () => {
    const invalid = { ...baseScene, panorama: undefined };
    expect(() => immersiveSceneSchema.parse(invalid)).toThrow();
  });

  it('rejects image hotspot coordinates outside normalized bounds', () => {
    const invalid = {
      ...baseScene,
      hotspots: [{ ...baseScene.hotspots[0], position: { kind: 'image' as const, x: 1.2, y: 0.5 } }]
    };
    expect(() => immersiveSceneSchema.parse(invalid)).toThrow();
  });

  it('accepts an evidence-aware comparison scene', () => {
    const comparisonScene = {
      ...baseScene,
      comparison: {
        label: 'Test alternatives',
        intro: 'Compare alternatives without selecting a winner.',
        defaultOptionId: 'option-a',
        options: [
          { id: 'option-a', label: 'Option A', status: 'possible' as const, summary: 'First option.', rationale: 'Test rationale.', sourceIds: ['source-test'], placeIds: [], fallbackEnvironment: 'delta-marsh' as const },
          { id: 'option-b', label: 'Option B', status: 'traditional' as const, summary: 'Second option.', rationale: 'Test rationale.', sourceIds: ['source-test'], placeIds: [], fallbackEnvironment: 'gulf-coast' as const }
        ]
      },
      hotspots: [{ ...baseScene.hotspots[0], variantIds: ['option-a'] }]
    };
    expect(immersiveSceneSchema.parse(comparisonScene).comparison?.defaultOptionId).toBe('option-a');
  });

  it('rejects hotspot variants that are not declared by the comparison', () => {
    const invalid = {
      ...baseScene,
      comparison: {
        label: 'Test alternatives',
        intro: 'Compare alternatives.',
        defaultOptionId: 'option-a',
        options: [
          { id: 'option-a', label: 'Option A', status: 'possible' as const, summary: 'First option.', rationale: 'Test rationale.', sourceIds: ['source-test'], placeIds: [] },
          { id: 'option-b', label: 'Option B', status: 'possible' as const, summary: 'Second option.', rationale: 'Test rationale.', sourceIds: ['source-test'], placeIds: [] }
        ]
      },
      hotspots: [{ ...baseScene.hotspots[0], variantIds: ['missing-option'] }]
    };
    expect(() => immersiveSceneSchema.parse(invalid)).toThrow();
  });

  it('accepts period-specific hotspots and an explicitly explained period camera', () => {
    const periodScene = {
      ...baseScene,
      periods: [{
        id: 'iron-age',
        label: 'Iron Age context',
        note: 'Test period state.',
        camera: { center: [35, 32] as [number, number], zoom: 9, coordinateRole: 'display-anchor' as const, note: 'Test-only display camera.' }
      }],
      defaultPeriodId: 'iron-age',
      hotspots: [{ ...baseScene.hotspots[0], periodIds: ['iron-age'] }]
    };
    expect(immersiveSceneSchema.parse(periodScene).defaultPeriodId).toBe('iron-age');
  });

  it('rejects hotspots linked to an undeclared period', () => {
    const invalid = {
      ...baseScene,
      periods: [{ id: 'iron-age', label: 'Iron Age context', note: 'Test period state.' }],
      hotspots: [{ ...baseScene.hotspots[0], periodIds: ['missing-period'] }]
    };
    expect(() => immersiveSceneSchema.parse(invalid)).toThrow();
  });

  it('accepts a regional landscape explorer presentation', () => {
    const regionScene = {
      ...baseScene,
      comparison: {
        presentation: 'regions' as const,
        label: 'Landscape zones',
        intro: 'Explore broad zones without drawing exact boundaries.',
        defaultOptionId: 'highlands',
        options: [
          { id: 'highlands', label: 'Highlands', status: 'established' as const, summary: 'Highland zone.', rationale: 'Broad geography.', sourceIds: ['source-test'], placeIds: [], fallbackEnvironment: 'central-highlands' as const },
          { id: 'lowlands', label: 'Lowlands', status: 'established' as const, summary: 'Lowland zone.', rationale: 'Broad geography.', sourceIds: ['source-test'], placeIds: [], fallbackEnvironment: 'jezreel-lowlands' as const }
        ]
      }
    };
    expect(immersiveSceneSchema.parse(regionScene).comparison?.presentation).toBe('regions');
  });

  it('accepts a conceptual-lens presentation without treating meanings as candidate sites', () => {
    const conceptScene = {
      ...baseScene,
      comparison: {
        presentation: 'concepts' as const,
        label: 'Toponym lenses',
        intro: 'Explore textual meanings without collapsing them into one coordinate.',
        defaultOptionId: 'early-zion',
        options: [
          { id: 'early-zion', label: 'Early Zion', status: 'established' as const, summary: 'Textual use.', rationale: 'The text associates Zion with the captured stronghold.', sourceIds: ['source-test'], placeIds: [] },
          { id: 'later-zion', label: 'Later Zion', status: 'established' as const, summary: 'Expanded usage.', rationale: 'Later texts use Zion more broadly.', sourceIds: ['source-test'], placeIds: [] }
        ]
      }
    };
    expect(immersiveSceneSchema.parse(conceptScene).comparison?.presentation).toBe('concepts');
  });

});
