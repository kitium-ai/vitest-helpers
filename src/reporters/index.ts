/**
 * Custom Vitest reporters
 */

import { createLogger } from '@kitiumai/logger';
import type { Reporter } from 'vitest';

const logger = createLogger('development', { serviceName: 'reporters' });

/**
 * Detailed test reporter
 * Provides enhanced test output
 */
export class DetailedReporter implements Reporter {
  onInit(): void {
    logger.info('🚀 Starting Vitest tests...\n');
  }

  onFinished(): void {
    logger.info('\n✅ All tests completed');
  }

  // Implement other Reporter methods as needed
}

/**
 * Create a detailed reporter instance
 */
export function createDetailedReporter(): DetailedReporter {
  return new DetailedReporter();
}
