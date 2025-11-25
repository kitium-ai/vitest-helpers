import { createRequire } from 'node:module';
import { mergeConfig } from 'vitest/config';
import type { UserConfig } from 'vitest';

const require = createRequire(import.meta.url);

type MaybeConfigModule = UserConfig & { default?: UserConfig };

function loadBaseVitestConfig(): UserConfig {
  const moduleExport = require('@kitiumai/config/vitest.config.base.js') as MaybeConfigModule;
  return (moduleExport.default ?? moduleExport) as UserConfig;
}

type TestOverrides = Record<string, unknown>;

export interface KitiumVitestConfigOptions {
  environment?: string;
  coverage?: boolean | Record<string, unknown>;
  reporters?: unknown;
  overrides?: UserConfig;
}

export function createKitiumVitestConfig(options: KitiumVitestConfigOptions = {}): UserConfig {
  const { environment, coverage, reporters, overrides } = options;
  const baseConfig = loadBaseVitestConfig();

  const testOverrides: Partial<TestOverrides> = {};

  if (environment) {
    testOverrides['environment'] = environment;
  }

  if (coverage !== undefined) {
    testOverrides['coverage'] =
      typeof coverage === 'boolean'
        ? coverage
          ? { reporter: ['text', 'html', 'lcov'] }
          : undefined
        : coverage;
  }

  if (reporters) {
    testOverrides['reporters'] = reporters;
  }

  const optionConfig: UserConfig =
    Object.keys(testOverrides).length > 0 ? ({ test: testOverrides } as UserConfig) : {};

  const overrideConfig: UserConfig = overrides ?? {};

  return mergeConfig(baseConfig, mergeConfig(optionConfig, overrideConfig));
}

export function extendKitiumVitestConfig(overrides: UserConfig): UserConfig {
  return createKitiumVitestConfig({ overrides });
}

export function loadKitiumVitestBaseConfig(): UserConfig {
  return mergeConfig(loadBaseVitestConfig(), {});
}
