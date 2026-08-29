import type { ConfidenceLevel, CoordinateRole, ScriptureRef } from './domain';

export type ImmersiveRenderer = 'map-terrain' | 'panorama' | 'parallax';
export type ImmersiveAvailability = 'prototype' | 'ready';
export type SchematicEnvironment =
  | 'mountain-wilderness'
  | 'delta-marsh'
  | 'gulf-coast'
  | 'arid-gulf'
  | 'coastal-plain'
  | 'central-highlands'
  | 'jezreel-lowlands'
  | 'jordan-valley'
  | 'shephelah'
  | 'galilean-hills'
  | 'negev';
export type EvidenceClass =
  | 'real-terrain'
  | 'known-archaeology'
  | 'historical-inference'
  | 'artistic-reconstruction'
  | 'tradition'
  | 'unknown-disputed';

export interface ImmersiveSceneCatalogEntry {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  renderer: ImmersiveRenderer;
  availability: ImmersiveAvailability;
  placeIds: string[];
  tags: string[];
  scenePath: string;
}

export interface ImmersiveAssetProvenance {
  verificationStatus: 'project-authored' | 'primary-verified' | 'research-supplied' | 'needs-verification';
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
  attribution?: string;
  notes: string;
}

export interface ImmersiveAsset {
  id: string;
  kind: 'image' | 'panorama' | 'overlay' | 'mask' | 'texture';
  src: string;
  mediaType?: string;
  width?: number;
  height?: number;
  hosting: 'bundled' | 'external';
  provenance: ImmersiveAssetProvenance;
}

export interface SceneEvidenceLegendItem {
  class: EvidenceClass;
  label: string;
  description: string;
}


export interface SceneCamera {
  center: [number, number];
  zoom: number;
  pitch?: number;
  bearing?: number;
  coordinateRole?: CoordinateRole;
  note?: string;
}

export interface SceneComparisonOption {
  id: string;
  label: string;
  status: ConfidenceLevel;
  summary: string;
  rationale: string;
  objections?: string;
  sourceIds: string[];
  placeIds: string[];
  camera?: SceneCamera;
  panoramaAssetId?: string;
  fallbackEnvironment?: SchematicEnvironment;
}

export interface SceneComparison {
  presentation?: 'alternatives' | 'regions' | 'concepts';
  label: string;
  intro: string;
  defaultOptionId: string;
  options: SceneComparisonOption[];
}

export interface ScenePeriod {
  id: string;
  label: string;
  from?: number;
  to?: number;
  note: string;
  camera?: SceneCamera;
}

export type SceneHotspotPosition =
  | { kind: 'image'; x: number; y: number }
  | { kind: 'geographic'; coordinates: [number, number] };

export interface SceneHotspot {
  id: string;
  label: string;
  summary: string;
  position: SceneHotspotPosition;
  evidenceClass: EvidenceClass;
  confidence: ConfidenceLevel;
  scripture: ScriptureRef[];
  sourceIds: string[];
  placeId?: string;
  variantIds?: string[];
  periodIds?: string[];
  whyShown: {
    evidence: string;
    inference?: string;
    alternatives?: string;
  };
}

export interface ImmersiveScene {
  schemaVersion: 1;
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  renderer: ImmersiveRenderer;
  availability: ImmersiveAvailability;
  placeIds: string[];
  disclaimer: string;
  evidenceLegend: SceneEvidenceLegendItem[];
  periods: ScenePeriod[];
  defaultPeriodId?: string;
  entryCamera?: SceneCamera;
  panorama?: {
    assetId?: string;
    alt: string;
    worldWidthPercent: number;
    initialPan: number;
  };
  parallax?: {
    layerAssetIds: string[];
    pointerDepth: number;
  };
  comparison?: SceneComparison;
  assets: ImmersiveAsset[];
  hotspots: SceneHotspot[];
}
