/**
 * Vitest configuration file resolution
 * Single Responsibility: Locate Vitest configuration files
 */

import path from 'node:path';

import { pathExists } from '@kitiumai/scripts/utils';

/**
 * Default Vitest config file names
 */
export const DEFAULT_CONFIG_FILENAMES = [
  'vitest.config.ts',
  'vitest.config.mts',
  'vitest.config.js',
  'vitest.workspace.ts',
  'vitest.workspace.mjs',
] as const;

/**
 * Resolve the path to a Vitest config file
 * Searches for config files in the specified root directory
 *
 * @param root - Root directory to search in
 * @param candidates - List of config file names to search for
 * @returns Path to the first found config file, or null if none found
 */
export async function resolveConfigPath(
  root: string,
  candidates: readonly string[] = DEFAULT_CONFIG_FILENAMES
): Promise<string | null> {
  for (const candidate of candidates) {
    const fullPath = path.join(root, candidate);
    if (await pathExists(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

/**
 * Check if a Vitest config file exists in the specified directory
 */
export async function hasVitestConfig(
  root: string,
  candidates: readonly string[] = DEFAULT_CONFIG_FILENAMES
): Promise<boolean> {
  const configPath = await resolveConfigPath(root, candidates);
  return configPath !== null;
}
