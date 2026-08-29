export type RuntimeAssetKey = 'terrain' | 'basemap' | 'roman-roads';

export type RuntimeAssetHealthState =
  | 'not-configured'
  | 'idle'
  | 'checking'
  | 'ready'
  | 'degraded'
  | 'error';

export interface RuntimeAssetHealth {
  state: RuntimeAssetHealthState;
  message: string;
  checkedAt?: string;
  url?: string;
  httpStatus?: number;
  rangeSupported?: boolean;
}

export type RuntimeAssetHealthMap = Record<RuntimeAssetKey, RuntimeAssetHealth>;
