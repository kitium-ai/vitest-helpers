/**
 * Configuration merging utilities
 * Provides consistent config merging logic across the package
 */

import { mergeConfig, type UserConfig } from 'vitest/config';

/**
 * Deeply merge multiple Vitest configurations
 * Handles test property merging correctly
 */
export function mergeConfigs(...configs: UserConfig[]): UserConfig {
  return configs.reduce(
    (accumulator, config) => mergeConfig(accumulator, config),
    {} as UserConfig
  );
}

/**
 * Merge test-specific overrides into a base config
 */
export function mergeTestConfig(
  baseConfig: UserConfig,
  testOverrides: Record<string, unknown>
): UserConfig {
  if (Object.keys(testOverrides).length === 0) {
    return baseConfig;
  }

  return mergeConfig(baseConfig, {
    test: testOverrides,
  } as UserConfig);
}
