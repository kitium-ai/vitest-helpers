import path from 'node:path';
import { findFiles, getProjectRoot, log, pathExists } from '@kitiumai/scripts/utils';

const DEFAULT_PATTERN = /\.(test|spec)\.(ts|tsx|js|jsx)$/i;

export interface VitestWorkspaceDiagnostics {
  configPath: string | null;
  hasConfig: boolean;
  testFiles: string[];
  issues: string[];
}

interface DiscoveryOptions {
  root?: string;
  pattern?: RegExp;
}

export async function discoverVitestTestFiles(options: DiscoveryOptions = {}): Promise<string[]> {
  const root = options.root ?? getProjectRoot();
  const pattern = options.pattern ?? DEFAULT_PATTERN;
  return findFiles(root, pattern);
}

export async function diagnoseVitestWorkspace(
  options: {
    root?: string;
    pattern?: RegExp;
    configFilenames?: string[];
  } = {}
): Promise<VitestWorkspaceDiagnostics> {
  const root = options.root ?? getProjectRoot();
  const pattern = options.pattern ?? DEFAULT_PATTERN;
  const configFilenames = options.configFilenames ?? [
    'vitest.config.ts',
    'vitest.config.mts',
    'vitest.config.js',
    'vitest.workspace.ts',
    'vitest.workspace.mjs',
  ];

  const [testFiles, configPath] = await Promise.all([
    discoverVitestTestFiles({ root, pattern }),
    resolveConfigPath(root, configFilenames),
  ]);

  const issues: string[] = [];

  if (!configPath) {
    issues.push('Vitest config file not found');
  }

  if (testFiles.length === 0) {
    issues.push('No Vitest test files discovered');
  }

  if (issues.length === 0) {
    log('success', `Vitest workspace ready (${testFiles.length} test file(s))`);
  } else {
    issues.forEach((issue) => log('warn', issue));
  }

  return {
    configPath,
    hasConfig: Boolean(configPath),
    testFiles,
    issues,
  };
}

async function resolveConfigPath(root: string, candidates: string[]): Promise<string | null> {
  for (const candidate of candidates) {
    const fullPath = path.join(root, candidate);
    if (await pathExists(fullPath)) {
      return fullPath;
    }
  }

  return null;
}
