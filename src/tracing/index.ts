/**
 * Tracing utilities for Vitest tests
 * Provides distributed tracing capabilities for test execution
 *
 * This module has been refactored following Single Responsibility Principle.
 * Each concern is now in its own module:
 * - trace-id-generator.ts: ID generation
 * - span-logger.ts: Span logging
 * - trace-operations.ts: Tracing operations (traceTest, traceChild)
 * - test-hooks.ts: Vitest lifecycle integration
 */

// Re-export all public APIs for backward compatibility
export { isTracingEnabled, logSpan, type SpanData } from './span-logger.js';
export { setupTestTracing, type TestTracingHooks } from './test-hooks.js';
export { generateSpanId, generateTraceId } from './trace-id-generator.js';
export {
  endTestTrace,
  startTestTrace,
  traceChild,
  traceTest,
  withTestTrace,
} from './trace-operations.js';
