import { eslintJestConfig } from '@kitiumai/lint';
import type { Linter } from 'eslint';

export type VitestLintConfig = Linter.FlatConfig;

export function loadKitiumVitestLintConfig(): VitestLintConfig {
  return eslintJestConfig as VitestLintConfig;
}

export function extendKitiumVitestLintConfig(
  overrides: Partial<VitestLintConfig> = {}
): VitestLintConfig {
  const baseConfig = loadKitiumVitestLintConfig();

  return {
    ...baseConfig,
    ...overrides,
    rules: {
      ...(baseConfig.rules ?? {}),
      ...(overrides.rules ?? {}),
    },
  };
}
