/**
 * Custom Vitest reporters
 */

import type { Reporter } from 'vitest';

/**
 * Detailed test reporter
 * Provides enhanced test output
 */
export class DetailedReporter implements Reporter {
  onInit(): void {
    console.log('🚀 Starting Vitest tests...\n');
  }

  onFinished(): void {
    console.log('\n✅ All tests completed');
  }

  // Implement other Reporter methods as needed
}

/**
 * Create a detailed reporter instance
 */
export function createDetailedReporter(): DetailedReporter {
  return new DetailedReporter();
}
