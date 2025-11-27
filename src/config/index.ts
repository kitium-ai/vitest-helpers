import baseVitestConfig from '@kitiumai/config/vitest.config.base.js';
import { mergeConfig } from 'vitest/config';
import type { UserConfig } from 'vitest';

type TestOverrides = Record<string, unknown>;
type VitestConfigWithTest = UserConfig & { test?: Record<string, unknown> };

export type KitiumVitestPresetName = 'local' | 'ci' | 'library' | 'browser';

export interface KitiumVitestConfigOptions {
  preset?: KitiumVitestPresetName;
  environment?: string;
  coverage?: boolean | Record<string, unknown>;
  reporters?: unknown;
  overrides?: UserConfig;
  setupFiles?: string[];
  projectName?: string;
}

const presetTestConfigs: Record<KitiumVitestPresetName, VitestConfigWithTest> = {
  local: {
    test: {
      name: 'kitium-local',
      environment: 'node',
    },
  },
  ci: {
    test: {
      name: 'kitium-ci',
      environment: 'node',
      coverage: { reporter: ['text', 'lcov', 'html'] },
      reporters: ['default'],
    },
  },
  library: {
    test: {
      name: 'kitium-library',
      environment: 'node',
      coverage: { reporter: ['text', 'lcov'] },
      reporters: ['default'],
    },
  },
  browser: {
    test: {
      name: 'kitium-browser',
      environment: 'jsdom',
      reporters: ['default'],
    },
  },
};

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

  const baseConfig = mergeConfig(loadBaseVitestConfig(), presetTestConfigs[preset]);

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

  if (setupFiles) {
    testOverrides['setupFiles'] = setupFiles;
  }

  if (projectName) {
    testOverrides['name'] = projectName;
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

export const KitiumVitestPresets: Record<KitiumVitestPresetName, () => UserConfig> = {
  local: () => createKitiumVitestConfig({ preset: 'local' }),
  ci: () => createKitiumVitestConfig({ preset: 'ci' }),
  library: () => createKitiumVitestConfig({ preset: 'library' }),
  browser: () => createKitiumVitestConfig({ preset: 'browser' }),
};

function loadBaseVitestConfig(): UserConfig {
  return baseVitestConfig as UserConfig;
}
