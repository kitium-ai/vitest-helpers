/**
 * Test file discovery utilities
 * Single Responsibility: Discover test files in a project
 */

import { findFiles, getProjectRoot } from '@kitiumai/scripts/utils';

/**
 * Default pattern for Vitest test files
 */
export const DEFAULT_TEST_PATTERN = /\.(test|spec)\.(ts|tsx|js|jsx)$/i;

/**
 * Options for test file discovery
 */
export interface DiscoveryOptions {
  root?: string;
  pattern?: RegExp;
}

/**
 * Discover Vitest test files in a project
 */
export async function discoverVitestTestFiles(options: DiscoveryOptions = {}): Promise<string[]> {
  const root = options.root ?? getProjectRoot();
  const pattern = options.pattern ?? DEFAULT_TEST_PATTERN;
  return findFiles(root, pattern);
}
