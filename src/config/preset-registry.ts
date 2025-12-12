/**
 * Unified preset registry
 * Single source of truth for all Vitest configuration presets
 */

import { defineConfig, type UserConfig } from 'vitest/config';

/**
 * Base test configuration shared across all presets
 */
const BASE_TEST_CONFIG = {
  globals: true,
  restoreMocks: true,
  clearMocks: true,
  mockReset: true,
} as const;

/**
 * Coverage exclude patterns
 */
const COVERAGE_EXCLUDE_NODE_MODULES = 'node_modules/';
const COVERAGE_EXCLUDE_DIST = 'dist/';
const COVERAGE_EXCLUDE_TEST_TS = '**/*.test.ts';
const COVERAGE_EXCLUDE_TEST_TSX = '**/*.test.tsx';
const COVERAGE_EXCLUDE_SPEC_TS = '**/*.spec.ts';
const COVERAGE_EXCLUDE_SPEC_TSX = '**/*.spec.tsx';
const COVERAGE_EXCLUDE_CONFIG_TS = '**/*.config.ts';
const COVERAGE_EXCLUDE_TYPES_TS = '**/types.ts';

/**
 * Common setup file path
 */
const VITEST_SETUP_FILE = './vitest.setup.ts';

/**
 * Preset definitions
 */
export const PresetConfigs = {
  /**
   * Development preset - fast feedback, no coverage
   */
  development: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-development',
      environment: 'node',
      passWithNoTests: true,
      watch: true,
      coverage: {
        enabled: false,
      },
    },
  }) as UserConfig,

  /**
   * Local preset - alias for development
   */
  local: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-local',
      environment: 'node',
      passWithNoTests: true,
      coverage: {
        enabled: false,
      },
    },
  }) as UserConfig,

  /**
   * CI preset - comprehensive testing with coverage
   */
  ci: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-ci',
      environment: 'node',
      passWithNoTests: false,
      watch: false,
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          COVERAGE_EXCLUDE_NODE_MODULES,
          COVERAGE_EXCLUDE_DIST,
          COVERAGE_EXCLUDE_TEST_TS,
          COVERAGE_EXCLUDE_TEST_TSX,
          COVERAGE_EXCLUDE_SPEC_TS,
          COVERAGE_EXCLUDE_SPEC_TSX,
          COVERAGE_EXCLUDE_CONFIG_TS,
          COVERAGE_EXCLUDE_TYPES_TS,
        ],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
      reporters: ['default'],
    },
  }) as UserConfig,

  /**
   * Library preset - high coverage thresholds
   */
  library: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-library',
      environment: 'node',
      passWithNoTests: false,
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'lcov'],
        exclude: [
          COVERAGE_EXCLUDE_NODE_MODULES,
          COVERAGE_EXCLUDE_DIST,
          COVERAGE_EXCLUDE_TEST_TS,
          COVERAGE_EXCLUDE_TEST_TSX,
          COVERAGE_EXCLUDE_SPEC_TS,
          COVERAGE_EXCLUDE_SPEC_TSX,
          COVERAGE_EXCLUDE_CONFIG_TS,
          COVERAGE_EXCLUDE_TYPES_TS,
        ],
        thresholds: {
          lines: 90,
          functions: 90,
          branches: 85,
          statements: 90,
        },
      },
      reporters: ['default'],
    },
  }) as UserConfig,

  /**
   * Browser/React preset - jsdom environment
   */
  browser: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-browser',
      environment: 'jsdom',
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
      },
      reporters: ['default'],
    },
  }) as UserConfig,

  /**
   * React preset - for React applications
   */
  react: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-react',
      environment: 'jsdom',
      setupFiles: [VITEST_SETUP_FILE],
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'html'],
        exclude: [
          COVERAGE_EXCLUDE_NODE_MODULES,
          COVERAGE_EXCLUDE_DIST,
          COVERAGE_EXCLUDE_TEST_TSX,
          COVERAGE_EXCLUDE_SPEC_TSX,
          COVERAGE_EXCLUDE_CONFIG_TS,
        ],
      },
    },
  }) as UserConfig,

  /**
   * Vue preset - for Vue applications
   */
  vue: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-vue',
      environment: 'jsdom',
      setupFiles: [VITEST_SETUP_FILE],
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
      },
    },
  }) as UserConfig,

  /**
   * Angular preset - for Angular applications
   */
  angular: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-angular',
      environment: 'jsdom',
      setupFiles: [VITEST_SETUP_FILE],
      globals: false, // Angular prefers explicit imports
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        exclude: [
          COVERAGE_EXCLUDE_NODE_MODULES,
          COVERAGE_EXCLUDE_DIST,
          COVERAGE_EXCLUDE_TEST_TS,
          COVERAGE_EXCLUDE_SPEC_TS,
          COVERAGE_EXCLUDE_CONFIG_TS,
          '**/polyfills.ts',
          '**/test.ts',
        ],
      },
    },
  }) as UserConfig,

  /**
   * Svelte preset - for Svelte applications
   */
  svelte: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-svelte',
      environment: 'jsdom',
      setupFiles: [VITEST_SETUP_FILE],
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        exclude: [
          COVERAGE_EXCLUDE_NODE_MODULES,
          COVERAGE_EXCLUDE_DIST,
          COVERAGE_EXCLUDE_TEST_TS,
          COVERAGE_EXCLUDE_SPEC_TS,
          COVERAGE_EXCLUDE_CONFIG_TS,
        ],
      },
    },
  }) as UserConfig,

  /**
   * SolidJS preset - for SolidJS applications
   */
  solid: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-solid',
      environment: 'jsdom',
      setupFiles: [VITEST_SETUP_FILE],
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
      },
    },
  }) as UserConfig,

  /**
   * Next.js preset - for Next.js applications
   */
  nextjs: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-nextjs',
      environment: 'jsdom',
      setupFiles: [VITEST_SETUP_FILE],
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        exclude: [
          COVERAGE_EXCLUDE_NODE_MODULES,
          COVERAGE_EXCLUDE_DIST,
          '.next/',
          COVERAGE_EXCLUDE_TEST_TSX,
          COVERAGE_EXCLUDE_SPEC_TSX,
          COVERAGE_EXCLUDE_CONFIG_TS,
          '**/next.config.js',
          '**/next-env.d.ts',
        ],
      },
    },
  }) as UserConfig,

  /**
   * Nuxt.js preset - for Nuxt.js applications
   */
  nuxt: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-nuxt',
      environment: 'jsdom',
      setupFiles: [VITEST_SETUP_FILE],
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        exclude: [
          COVERAGE_EXCLUDE_NODE_MODULES,
          COVERAGE_EXCLUDE_DIST,
          '.nuxt/',
          COVERAGE_EXCLUDE_TEST_TS,
          COVERAGE_EXCLUDE_SPEC_TS,
          COVERAGE_EXCLUDE_CONFIG_TS,
          '**/nuxt.config.js',
        ],
      },
    },
  }) as UserConfig,

  /**
   * Astro preset - for Astro applications
   */
  astro: defineConfig({
    test: {
      ...BASE_TEST_CONFIG,
      name: 'kitium-astro',
      environment: 'jsdom',
      setupFiles: [VITEST_SETUP_FILE],
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        exclude: [
          COVERAGE_EXCLUDE_NODE_MODULES,
          COVERAGE_EXCLUDE_DIST,
          COVERAGE_EXCLUDE_TEST_TS,
          COVERAGE_EXCLUDE_SPEC_TS,
          COVERAGE_EXCLUDE_CONFIG_TS,
          '**/astro.config.mjs',
        ],
      },
    },
  }) as UserConfig,
} as const;

/**
 * Available preset names
 */
export type PresetName = keyof typeof PresetConfigs;

/**
 * Get a preset configuration by name
 */
export function getPreset(name: PresetName): UserConfig {
  return PresetConfigs[name];
}

/**
 * Check if a preset exists
 */
export function hasPreset(name: string): name is PresetName {
  return name in PresetConfigs;
}

/**
 * Get all available preset names
 */
export function getPresetNames(): PresetName[] {
  return Object.keys(PresetConfigs) as PresetName[];
}

/**
 * Create a custom preset by merging with a base preset
 */
export function createCustomPreset(base: PresetName, overrides: UserConfig): UserConfig {
  const baseConfig = getPreset(base);
  return defineConfig({
    ...baseConfig,
    ...overrides,
    test: {
      ...baseConfig.test,
      ...overrides.test,
    },
  }) as UserConfig;
}
