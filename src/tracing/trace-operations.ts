/**
 * Trace operation utilities
 * Single Responsibility: Execute operations with tracing context
 */

import {
  contextManager,
  type LogContext,
  withLoggingContext,
} from '@kitiumai/logger';
import { generateSpanId, generateTraceId } from './trace-id-generator.js';
import { logSpan } from './span-logger.js';

/**
 * Trace a test operation with automatic span creation and logging
 */
export async function traceTest<T>(
  operationName: string,
  operation: (spanId: string) => Promise<T> | T,
  metadata?: Record<string, unknown>,
  traceContext?: LogContext
): Promise<T> {
  const context = traceContext ?? contextManager.getContext();
  const spanId = generateSpanId();

  const startTime = Date.now();

  try {
    const result = await operation(spanId);
    const duration = Date.now() - startTime;

    // Log test span completion
    if (context.traceId) {
      logSpan(context.traceId, spanId, operationName, 'success', duration, metadata);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    if (context.traceId) {
      logSpan(context.traceId, spanId, operationName, 'error', duration, {
        ...metadata,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    throw error;
  }
}

/**
 * Trace a child operation within a parent span
 */
export async function traceChild<T>(
  parentSpanId: string,
  operationName: string,
  operation: (childSpanId: string) => Promise<T> | T,
  metadata?: Record<string, unknown>,
  traceContext?: LogContext
): Promise<T> {
  const context = traceContext ?? contextManager.getContext();
  const childSpanId = generateSpanId();

  const startTime = Date.now();

  try {
    const result = await operation(childSpanId);
    const duration = Date.now() - startTime;

    if (context.traceId) {
      logSpan(context.traceId, childSpanId, operationName, 'success', duration, {
        ...metadata,
        parentSpanId,
      });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    if (context.traceId) {
      logSpan(context.traceId, childSpanId, operationName, 'error', duration, {
        ...metadata,
        parentSpanId,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    throw error;
  }
}

/**
 * Start a new trace context for a test
 */
export function startTestTrace(testName: string): LogContext {
  return {
    traceId: generateTraceId(),
    spanId: generateSpanId(),
    metadata: { testName, timestamp: new Date().toISOString() },
  };
}

/**
 * End the current trace context
 * Note: Context is scoped by withLoggingContext; explicit clearing is unnecessary
 */
export function endTestTrace(): void {
  // Context is scoped by withLoggingContext; explicit clearing is unnecessary.
}

/**
 * Run a function within a fresh test trace context
 */
export function withTestTrace<T>(
  testName: string,
  fn: () => Promise<T> | T,
  metadata?: Record<string, unknown>
): Promise<T> | T {
  const context = startTestTrace(testName);
  if (metadata) {
    context.metadata = { ...(context.metadata ?? {}), ...metadata };
  }
  // withLoggingContext expects Promise<T>, so we wrap the function
  const result = withLoggingContext(context, () => Promise.resolve(fn()));
  return result as Promise<T> | T;
}
