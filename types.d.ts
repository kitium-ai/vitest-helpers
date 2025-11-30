/**
 * @kitiumai/vitest-helpers TypeScript declarations for module augmentation and subpath support
 */

declare module '@kitiumai/vitest-helpers' {
  // Re-export all test-core utilities
  export * from '@kitiumai/test-core';

  // Vitest-specific setup utilities
  export function createVitestSetup(options?: any): any;
  export function definePreset(name: string, config: any): any;
  export function createWorkspaceConfig(options?: any): any;
  export const setupPresets: { [name: string]: any };
}

declare module '@kitiumai/vitest-helpers/setup' {
  export function createVitestSetup(options?: any): any;
  export function definePreset(name: string, config: any): any;
  export const setupPresets: { [name: string]: any };
}

declare module '@kitiumai/vitest-helpers/setup/presets' {
  export const setupPresets: { [name: string]: any };
  export function getPreset(name: string): any;
}

declare module '@kitiumai/vitest-helpers/setup/workspace' {
  export function createWorkspaceConfig(options?: any): any;
  export function defineWorkspace(config: any): any;
}

declare module '@kitiumai/vitest-helpers/compatibility' {
  export function migrateFromJest(config: any): any;
  export function validateCompatibility(config: any): any;
  export const JestToVitestMapping: Record<string, string>;
}

declare module '@kitiumai/vitest-helpers/browser' {
  export function createBrowserConfig(options?: any): any;
  export function setupBrowserPool(type: string): any;
  export const BrowserTypes: string[];
}

declare module '@kitiumai/vitest-helpers/benchmarks' {
  export function defineBenchmark(name: string, fn: () => void): any;
  export function createBenchmarkSuite(options?: any): any;
  export const BenchmarkReporters: { [name: string]: any };
}

declare module '@kitiumai/vitest-helpers/reporters' {
  export function createCustomReporter(options?: any): any;
  export const BuiltInReporters: string[];
}

declare module '@kitiumai/vitest-helpers/tracing' {
  export function enableDistributedTracing(options?: any): any;
  export function createTracingContext(): any;
  export const TracingIntegrations: { [name: string]: any };
}

declare module '@kitiumai/vitest-helpers/migration' {
  export function migrateJestToVitest(projectPath: string, options?: any): Promise<any>;
  export function validateMigration(config: any): any;
  export const MigrationTools: { [tool: string]: any };
}

declare module '@kitiumai/vitest-helpers/examples' {
  export function getExample(name: string): any;
  export const AvailableExamples: string[];
}

declare module '@kitiumai/vitest-helpers/config' {
  export function createVitestConfig(options?: any): any;
  export function mergeVitestConfigs(...configs: any[]): any;
}

declare module '@kitiumai/vitest-helpers/lint' {
  export function createVitestLintConfig(options?: any): any;
  export function configureLinting(options?: any): any;
}

declare module '@kitiumai/vitest-helpers/tooling' {
  export function setupDevelopmentTools(options?: any): any;
  export function createToolingConfig(options?: any): any;
}
