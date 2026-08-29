export type VerificationPacketStatus =
  | 'production-ready'
  | 'ready-with-attribution'
  | 'non-commercial-only'
  | 'dataset-specific';

export type VerificationClaimStatus =
  | 'verified-guardrail'
  | 'verified-with-boundary'
  | 'supported-with-qualification'
  | 'contested';

export interface VerificationResource {
  id: string;
  name: string;
  category: string;
  packetStatus: VerificationPacketStatus;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  attribution: string;
  commercialUse: string;
  localHosting: string;
  derivativeUse: string;
  notes: string;
  sceneIds: string[];
}

export interface VerificationClaim {
  id: string;
  status: VerificationClaimStatus;
  statement: string;
  citations: string[];
  guardrail: string;
  sceneIds: string[];
}

export interface VerificationIdentifier {
  placeId: string;
  pleiades: string;
  wikidata?: string;
}

export interface VerificationSceneAssessment {
  sceneId: string;
  packetReadinessPercent: number;
  integrationStatus: string;
  note: string;
}

export interface VerificationRegistry {
  schemaVersion: 1;
  packet: {
    title: string;
    sourceFile: string;
    accessedAt: string;
    provenance: 'user-supplied-research-packet';
    independentLiveVerification: false;
    note: string;
  };
  resources: VerificationResource[];
  claims: VerificationClaim[];
  identifiers: VerificationIdentifier[];
  sceneAssessments: VerificationSceneAssessment[];
}
