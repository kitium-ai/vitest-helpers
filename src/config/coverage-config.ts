/**
 * Centralized coverage configuration
 * Single source of truth for coverage settings
 */

export type CoverageConfig = {
  enabled?: boolean;
  provider?: 'v8' | 'istanbul' | 'c8';
  reporter?: string[];
  exclude?: string[];
  thresholds?: {
    lines?: number;
    functions?: number;
    branches?: number;
    statements?: number;
  };
};

/**
 * Common coverage exclude patterns
 */
export const DEFAULT_COVERAGE_EXCLUDES: string[] = [
  'node_modules/',
  'dist/',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.ts',
  '**/*.spec.tsx',
  '**/*.config.ts',
  '**/types.ts',
];

/**
 * Coverage configuration presets
 */
export const CoveragePresets = {
  disabled: {
    enabled: false,
  } as CoverageConfig,

  development: {
    enabled: false,
  } as CoverageConfig,

  ci: {
    enabled: true,
    provider: 'v8',
    reporter: ['text', 'json', 'html', 'lcov'],
    exclude: [...DEFAULT_COVERAGE_EXCLUDES],
    thresholds: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  } as CoverageConfig,

  library: {
    enabled: true,
    provider: 'v8',
    reporter: ['text', 'lcov'],
    exclude: [...DEFAULT_COVERAGE_EXCLUDES],
    thresholds: {
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90,
    },
  } as CoverageConfig,

  react: {
    enabled: true,
    provider: 'v8',
    reporter: ['text', 'html'],
    exclude: ['node_modules/', 'dist/', '**/*.test.tsx', '**/*.spec.tsx', '**/*.config.ts'],
  } as CoverageConfig,

  basic: {
    enabled: true,
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
  } as CoverageConfig,
};

/**
 * Get coverage configuration by preset name
 */
export function getCoverageConfig(preset: keyof typeof CoveragePresets): CoverageConfig {
  return CoveragePresets[preset];
}

/**
 * Create custom coverage configuration by merging with a preset
 */
export function createCoverageConfig(
  preset: keyof typeof CoveragePresets,
  overrides?: Partial<CoverageConfig>
): CoverageConfig {
  const baseConfig = CoveragePresets[preset];
  const result: CoverageConfig = {
    ...baseConfig,
    ...overrides,
  };

  // Merge thresholds if both exist
  if (baseConfig.thresholds && overrides?.thresholds) {
    result.thresholds = {
      ...baseConfig.thresholds,
      ...overrides.thresholds,
    };
  }

  // Merge exclude arrays if both exist
  if (baseConfig.exclude && overrides?.exclude) {
    result.exclude = [...baseConfig.exclude, ...overrides.exclude];
  }

  return result;
}
