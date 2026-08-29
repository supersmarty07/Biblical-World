import type { VerificationRegistry } from '../types/verification';

let registryPromise: Promise<VerificationRegistry> | undefined;

export function loadVerificationRegistry(): Promise<VerificationRegistry> {
  registryPromise ??= fetch(`${import.meta.env.BASE_URL}data/verification/registry.json`)
    .then(async (response) => {
      if (!response.ok) throw new Error(`Verification registry failed to load (${response.status}).`);
      return await response.json() as VerificationRegistry;
    });
  return registryPromise;
}
