import baseVitestConfig from '@kitiumai/config/vitest.config.base.js';
import { mergeConfig, type UserConfig } from 'vitest/config';
import { getPreset, type PresetName } from './preset-registry.js';

/**
 * Legacy preset names for backward compatibility
 */
export type KitiumVitestPresetName = 'local' | 'ci' | 'library' | 'browser';

/**
 * Configuration options for creating a Kitium Vitest config
 */
export interface KitiumVitestConfigOptions {
  preset?: PresetName;
  environment?: string;
  coverage?: boolean | Record<string, unknown>;
  reporters?: unknown;
  overrides?: UserConfig;
  setupFiles?: string[];
  projectName?: string;
}

/**
 * Create a Vitest configuration with Kitium presets and customizations
 */
export function createKitiumVitestConfig(options: KitiumVitestConfigOptions = {}): UserConfig {
  const {
    preset = 'local',
    environment,
    coverage,
    reporters,
    overrides,
    setupFiles,
    projectName,
  } = options;

  // Start with base config and selected preset
  const baseConfig = loadBaseVitestConfig();
  const presetConfig = getPreset(preset);

  // Build test-specific overrides
  const testOverrides: Record<string, unknown> = {};

  if (environment) {
    testOverrides['environment'] = environment;
  }

  if (coverage !== undefined) {
    testOverrides['coverage'] =
      typeof coverage === 'boolean'
        ? coverage
          ? { reporter: ['text', 'html', 'lcov'] }
          : { enabled: false }
        : coverage;
  }

  if (reporters) {
    testOverrides['reporters'] = reporters;
  }

  if (setupFiles) {
    testOverrides['setupFiles'] = setupFiles;
  }

  if (projectName) {
    testOverrides['name'] = projectName;
  }

  // Build the test overrides config
  const testConfig: UserConfig = Object.keys(testOverrides).length > 0
    ? { test: testOverrides }
    : {};

  // Merge all configs in order: base -> preset -> test overrides -> user overrides
  let result = mergeConfig(baseConfig, presetConfig);
  result = mergeConfig(result, testConfig);
  if (overrides) {
    result = mergeConfig(result, overrides);
  }

  return result;
}

/**
 * Extend Kitium Vitest config with custom overrides
 */
export function extendKitiumVitestConfig(overrides: UserConfig): UserConfig {
  return createKitiumVitestConfig({ overrides });
}

/**
 * Load the base Kitium Vitest configuration
 */
export function loadKitiumVitestBaseConfig(): UserConfig {
  return loadBaseVitestConfig();
}

/**
 * Preset factory functions for backward compatibility
 */
export const KitiumVitestPresets: Record<KitiumVitestPresetName, () => UserConfig> = {
  local: () => createKitiumVitestConfig({ preset: 'local' }),
  ci: () => createKitiumVitestConfig({ preset: 'ci' }),
  library: () => createKitiumVitestConfig({ preset: 'library' }),
  browser: () => createKitiumVitestConfig({ preset: 'browser' }),
};

/**
 * Load base Vitest configuration from @kitiumai/config
 */
function loadBaseVitestConfig(): UserConfig {
  return baseVitestConfig as UserConfig;
}

// Re-export preset registry for advanced usage
export { getPreset, type PresetName } from './preset-registry.js';
export { CoveragePresets, getCoverageConfig, createCoverageConfig } from './coverage-config.js';
