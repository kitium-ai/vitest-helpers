/**
 * Vitest setup utilities
 */

export * from './presets.js';
export * from './workspace.js';

/**
 * Global test setup hook
 */
export function setupVitestGlobals(): void {
  // Enable global test functions (describe, it, expect, etc.)
  // This is automatically handled when globals: true in config
}

/**
 * Setup common test patterns
 */
export function setupCommonPatterns(): void {
  // Add any common setup patterns here
  // For example, global beforeEach/afterEach hooks
}
