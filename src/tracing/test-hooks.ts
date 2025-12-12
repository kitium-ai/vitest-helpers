/**
 * Vitest test tracing hooks
 * Single Responsibility: Integrate tracing with Vitest lifecycle
 */

import { type LogContext, withLoggingContext } from '@kitiumai/logger';

import { endTestTrace, startTestTrace } from './trace-operations.js';

/**
 * Vitest task context interface
 */
type VitestTaskContext = {
  task: {
    name: string;
  };
};

/**
 * Tracing hooks for Vitest tests
 */
export type TestTracingHooks = {
  beforeEach: (context: VitestTaskContext) => void;
  afterEach: () => void;
  withTrace: <T>(function_: () => Promise<T> | T) => Promise<T> | T;
  getCurrentTraceContext: () => LogContext | null;
};

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
    withTrace: <T>(function_: () => Promise<T> | T): Promise<T> | T => {
      if (!currentContext) {
        return function_();
      }
      // withLoggingContext expects Promise<T>, so we wrap and unwrap
      const result = withLoggingContext(currentContext, () => Promise.resolve(function_()));
      return result as Promise<T> | T;
    },

    getCurrentTraceContext: () => currentContext,
  };
}
