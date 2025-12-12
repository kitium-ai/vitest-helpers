/**
 * Vitest test tracing hooks
 * Single Responsibility: Integrate tracing with Vitest lifecycle
 */

import type { LogContext } from '@kitiumai/logger';
import { withLoggingContext } from '@kitiumai/logger';
import { startTestTrace, endTestTrace } from './trace-operations.js';

/**
 * Vitest task context interface
 */
interface VitestTaskContext {
  task: {
    name: string;
  };
}

/**
 * Tracing hooks for Vitest tests
 */
export interface TestTracingHooks {
  beforeEach: (context: VitestTaskContext) => void;
  afterEach: () => void;
  withTrace: <T>(fn: () => Promise<T> | T) => Promise<T> | T;
  getCurrentTraceContext: () => LogContext | null;
}

/**
 * Setup test tracing with Vitest lifecycle hooks
 * Returns hooks that can be used with beforeEach/afterEach
 */
export function setupTestTracing(): TestTracingHooks {
  let currentContext: LogContext | null = null;

  return {
    beforeEach: (context: VitestTaskContext) => {
      currentContext = startTestTrace(context.task.name);
    },

    afterEach: () => {
      currentContext = null;
      endTestTrace();
    },

    /**
     * Wrap a test body in a logging context so traceTest/traceChild can read it
     */
    withTrace: <T>(fn: () => Promise<T> | T): Promise<T> | T => {
      if (!currentContext) {
        return fn();
      }
      // withLoggingContext expects Promise<T>, so we wrap and unwrap
      const result = withLoggingContext(currentContext, () => Promise.resolve(fn()));
      return result as Promise<T> | T;
    },

    getCurrentTraceContext: () => currentContext,
  };
}
