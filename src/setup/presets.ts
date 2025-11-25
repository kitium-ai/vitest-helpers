/**
 * Vitest configuration presets
 * Pre-configured setups for common scenarios
 */

import { defineConfig, type UserConfig } from 'vitest/config';

/**
 * Development preset - fast feedback
 */
export const developmentPreset = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    watch: true,
   restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    coverage: {
      enabled: false,
    },
  },
}) as UserConfig;

/**
 * CI preset - comprehensive testing
 */
export const ciPreset = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: false,
    watch: false,
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.config.ts',
        '**/types.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
}) as UserConfig;

/**
 * Library preset - for testing library packages
 */
export const libraryPreset = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: false,
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
}) as UserConfig;

/**
 * React preset - for React applications
 */
export const reactPreset = defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.tsx',
        '**/*.spec.tsx',
        '**/*.config.ts',
      ],
    },
  },
}) as UserConfig;

/**
 * Vue preset - for Vue applications
 */
export const vuePreset = defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
  },
}) as UserConfig;

/**
 * All available presets
 */
export const VitestPresets = {
  development: developmentPreset,
  ci: ciPreset,
  library: libraryPreset,
  react: reactPreset,
  vue: vuePreset,
};

/**
 * Create a custom preset by merging with a base
 */
export function createCustomPreset(
  base: keyof typeof VitestPresets,
  overrides: UserConfig
): UserConfig {
  const baseConfig = VitestPresets[base];
  return defineConfig({
    ...baseConfig,
    ...overrides,
    test: {
      ...baseConfig.test,
      ...overrides.test,
    },
  }) as UserConfig;
}
