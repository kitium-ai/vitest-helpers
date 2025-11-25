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
  const vitestConfig: Record<string, unknown> = {
    test: {},
  };

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

  for (const [jestKey, vitestPath] of Object.entries(configMap)) {
    if (jestConfig[jestKey] !== undefined) {
      const keys = vitestPath.split('.');
      const existingTestConfig = (vitestConfig['test'] as Record<string, any>) ?? {};
      vitestConfig['test'] = existingTestConfig;
      let current: Record<string, any> = existingTestConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!key) {
          continue;
        }
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }

      if (!vitestPath.includes('use Vite')) {
        const targetKey = keys[keys.length - 1];
        if (targetKey) {
          current[targetKey] = jestConfig[jestKey];
        }
      }
    }
  }

  return vitestConfig;
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
