/**
 * Migration guide from Jest to Vitest
 *
 * This module provides helpers and documentation for migrating from Jest to Vitest
 */

/**
 * Mapping of Jest APIs to Vitest equivalents
 */
export const JestToVitestMapping = {
  // Test functions
  describe: 'describe (same)',
  'it/test': 'it/test (same)',
  beforeEach: 'beforeEach (same)',
  afterEach: 'afterEach (same)',
  beforeAll: 'beforeAll (same)',
  afterAll: 'afterAll (same)',

  // Assertions
  expect: 'expect (same, with some additions)',
  'expect.assertions': 'expect.assertions (same)',
  'expect.hasAssertions': 'expect.hasAssertions (same)',

  // Mocking
  'jest.fn()': 'vi.fn()',
  'jest.mock()': 'vi.mock()',
  'jest.spyOn()': 'vi.spyOn()',
  'jest.clearAllMocks()': 'vi.clearAllMocks()',
  'jest.resetAllMocks()': 'vi.resetAllMocks()',
  'jest.restoreAllMocks()': 'vi.restoreAllMocks()',

  // Timers
  'jest.useFakeTimers()': 'vi.useFakeTimers()',
  'jest.useRealTimers()': 'vi.useRealTimers()',
  'jest.advanceTimersByTime()': 'vi.advanceTimersByTime()',
  'jest.runAllTimers()': 'vi.runAllTimers()',

  // Environment
  'process.env': 'import.meta.env (for Vite projects)',
};

/**
 * Common migration steps
 */
export const migrationSteps = [
  '1. Install Vitest: npm install -D vitest',
  '2. Replace jest.config.js with vitest.config.ts',
  '3. Update package.json scripts to use vitest',
  '4. Replace jest imports with vitest: import { describe, it, expect } from "vitest"',
  '5. Replace jest.* with vi.* for mocking',
  '6. Update test file patterns if needed',
  '7. Run tests with: vitest',
];

/**
 * Configuration migration helper
 */
export function convertJestConfigToVitest(
  jestConfig: Record<string, unknown>
): Record<string, unknown> {
  const vitestConfig: Record<string, unknown> = { test: {} };

  const configMap: Record<string, string> = {
    testMatch: 'include',
    testPathIgnorePatterns: 'exclude',
    coverageDirectory: 'coverage.reportsDirectory',
    collectCoverageFrom: 'coverage.include',
    coveragePathIgnorePatterns: 'coverage.exclude',
    setupFiles: 'setupFiles',
    setupFilesAfterEnv: 'setupFiles',
    testEnvironment: 'environment',
    globals: 'globals',
    transform: '(use Vite plugins instead)',
  };

  Object.entries(configMap)
    .filter(([jestKey]) => jestConfig[jestKey] !== undefined)
    .forEach(([jestKey, vitestPath]) => {
      applyConfigMapping(vitestConfig, vitestPath, jestConfig[jestKey]);
    });

  return vitestConfig;
}

function applyConfigMapping(
  vitestConfig: Record<string, unknown>,
  vitestPath: string,
  value: unknown
): void {
  if (vitestPath.includes('use Vite')) {
    return;
  }

  const keys = vitestPath.split('.').filter(Boolean);
  let current = (vitestConfig['test'] as Record<string, any>) ?? {};
  vitestConfig['test'] = current;

  for (let index = 0; index < keys.length - 1; index++) {
    const key = keys[index];
    if (!key) {
      continue;
    }
    current[key] = current[key] ?? {};
    current = current[key];
  }

  const targetKey = keys[keys.length - 1];
  if (targetKey) {
    current[targetKey] = value;
  }
}

/**
 * Code transformation examples
 */
export const codeTransformations = {
  imports: {
    before: `import { describe, it, expect } from '@jest/globals';`,
    after: `import { describe, it, expect, vi } from 'vitest';`,
  },
  mocking: {
    before: `const mockFn = jest.fn();
jest.mock('./module');
const spy = jest.spyOn(obj, 'method');`,
    after: `const mockFn = vi.fn();
vi.mock('./module');
const spy = vi.spyOn(obj, 'method');`,
  },
  timers: {
    before: `jest.useFakeTimers();
jest.advanceTimersByTime(1000);`,
    after: `vi.useFakeTimers();
vi.advanceTimersByTime(1000);`,
  },
};
