import type { Linter } from 'eslint';

export type VitestLintConfig = Linter.FlatConfig;

export async function loadKitiumVitestLintConfig(): Promise<VitestLintConfig> {
  const moduleExport = await import('@kitiumai/lint/eslint/jest.js');
  return (moduleExport.default ?? moduleExport) as VitestLintConfig;
}

export async function extendKitiumVitestLintConfig(
  overrides: Partial<VitestLintConfig> = {}
): Promise<VitestLintConfig> {
  const baseConfig = await loadKitiumVitestLintConfig();

  return {
    ...baseConfig,
    ...overrides,
    rules: {
      ...(baseConfig.rules ?? {}),
      ...(overrides.rules ?? {}),
    },
  };
}

