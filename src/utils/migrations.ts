import { storageGet, storageGetJSON, storageSet, storageSetJSON } from './storage';

const SCHEMA_VERSION = 1;

export const runMigrations = async () => {
  try {
    const rawVersion = await storageGet('schema_version');
    const version = rawVersion ? Number.parseInt(rawVersion, 10) : 0;

    if (!version || Number.isNaN(version)) {
      const legalAcceptance = await storageGetJSON('legal_acceptance_v1', null);
      const accepted = await storageGet('has_accepted_terms');
      if (legalAcceptance && !accepted) {
        await storageSet('has_accepted_terms', 'true');
      }
      await storageSet('schema_version', String(SCHEMA_VERSION));
      return;
    }

    if (version < 1) {
      await storageSet('schema_version', String(SCHEMA_VERSION));
    }
  } catch (error) {
    console.error('[Migrations] Failed to run migrations', error);
  }
};
