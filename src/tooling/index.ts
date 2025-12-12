/**
 * Vitest tooling utilities
 * Provides file discovery, config resolution, and workspace diagnostics
 *
 * This module has been refactored following Single Responsibility Principle.
 * Each concern is now in its own module:
 * - file-discovery.ts: Discover test files
 * - config-resolver.ts: Resolve config file paths
 * - workspace-diagnostics.ts: Diagnose workspace and report issues
 */

// Re-export file discovery utilities
export {
  discoverVitestTestFiles,
  DEFAULT_TEST_PATTERN,
  type DiscoveryOptions,
} from './file-discovery.js';

// Re-export config resolution utilities
export {
  resolveConfigPath,
  hasVitestConfig,
  DEFAULT_CONFIG_FILENAMES,
} from './config-resolver.js';

// Re-export workspace diagnostics
export {
  diagnoseVitestWorkspace,
  type VitestWorkspaceDiagnostics,
  type DiagnosticsOptions,
} from './workspace-diagnostics.js';
