/**
 * Vitest workspace diagnostics
 * Single Responsibility: Diagnose and report workspace configuration issues
 */

import { getProjectRoot, log } from '@kitiumai/scripts/utils';

import { DEFAULT_CONFIG_FILENAMES, resolveConfigPath } from './config-resolver.js';
import { discoverVitestTestFiles, type DiscoveryOptions } from './file-discovery.js';

/**
 * Diagnostic results for a Vitest workspace
 */
export type VitestWorkspaceDiagnostics = {
  configPath: string | null;
  hasConfig: boolean;
  testFiles: string[];
  issues: string[];
};

/**
 * Options for workspace diagnostics
 */
export type DiagnosticsOptions = {
  configFilenames?: string[];
} & DiscoveryOptions;

/**
 * Diagnose a Vitest workspace and report issues
 * Checks for config files and test files, reports any problems found
 */
export async function diagnoseVitestWorkspace(
  options: DiagnosticsOptions = {}
): Promise<VitestWorkspaceDiagnostics> {
  const root = options.root ?? getProjectRoot();
  const configFilenames = options.configFilenames ?? DEFAULT_CONFIG_FILENAMES;

  // Run discovery and config resolution in parallel
  const discoveryOptions: DiscoveryOptions = { root };
  if (options.pattern !== undefined) {
    discoveryOptions.pattern = options.pattern;
  }

  const [testFiles, configPath] = await Promise.all([
    discoverVitestTestFiles(discoveryOptions),
    resolveConfigPath(root, configFilenames),
  ]);

  // Collect issues
  const issues = collectIssues(configPath, testFiles);

  // Log results
  logDiagnostics(issues, testFiles.length);

  return {
    configPath,
    hasConfig: Boolean(configPath),
    testFiles,
    issues,
  };
}

/**
 * Collect workspace issues
 */
function collectIssues(configPath: string | null, testFiles: string[]): string[] {
  const issues: string[] = [];

  if (!configPath) {
    issues.push('Vitest config file not found');
  }

  if (testFiles.length === 0) {
    issues.push('No Vitest test files discovered');
  }

  return issues;
}

/**
 * Log diagnostic results
 */
function logDiagnostics(issues: string[], testFileCount: number): void {
  if (issues.length === 0) {
    log('success', `Vitest workspace ready (${testFileCount} test file(s))`);
  } else {
    issues.forEach((issue) => log('warn', issue));
  }
}
