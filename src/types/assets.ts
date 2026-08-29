export type V2AssetStatus =
  | 'installed'
  | 'configured-external'
  | 'awaiting-source-bytes'
  | 'awaiting-derived-geometry'
  | 'awaiting-derived-terrain'
  | 'awaiting-dataset-selection'
  | 'awaiting-item-selection'
  | 'blocked-verification';

export type V2AssetKind =
  | 'terrain-pmtiles'
  | 'vector-geojson'
  | 'derived-geojson'
  | 'derived-terrain'
  | 'archaeology-dataset'
  | 'image-set';

export interface V2AssetPlanEntry {
  id: string;
  label: string;
  kind: V2AssetKind;
  runtimeKey: string;
  status: V2AssetStatus;
  delivery: string;
  sourceResourceIds: string[];
  sceneIds: string[];
  publicPath?: string;
  sha256?: string;
  sizeBytes?: number;
  envVar?: string;
  evidenceClass: string;
  citations?: string[];
  notes: string;
}

export interface V2AssetManifest {
  schemaVersion: 1;
  version: string;
  policy: {
    largeAssetHost: string;
    githubPagesRole: string;
    rangeRequestsMustBypassServiceWorker: boolean;
    historicalReconstructionRequiresExplicitUncertainty: boolean;
  };
  assets: V2AssetPlanEntry[];
}
