/**
 * Tracing utilities for Vitest tests
 * Provides distributed tracing capabilities for test execution
 */

import { contextManager, type LogContext } from '@kitiumai/logger';

/**
 * Trace a test operation
 */
export async function traceTest<T>(
  operationName: string,
  operation: (spanId: string) => Promise<T> | T,
  metadata?: Record<string, unknown>
): Promise<T> {
  const context = contextManager.getContext();
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
 * Trace a child operation
 */
export async function traceChild<T>(
  parentSpanId: string,
  operationName: string,
  operation: (childSpanId: string) => Promise<T> | T,
  metadata?: Record<string, unknown>
): Promise<T> {
  const context = contextManager.getContext();
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
  const traceId = generateTraceId();
  const context: LogContext = {
    traceId,
    spanId: generateSpanId(),
    metadata: { testName, timestamp: new Date().toISOString() },
  };

  contextManager.setContext(context);
  return context;
}

/**
 * End the current trace context
 */
export function endTestTrace(): void {
  contextManager.clear();
}

/**
 * Generate a unique trace ID
 */
function generateTraceId(): string {
  return `trace-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

/**
 * Generate a unique span ID
 */
function generateSpanId(): string {
  return `span-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

/**
 * Log a span
 */
function logSpan(
  traceId: string,
  spanId: string,
  operationName: string,
  status: 'success' | 'error',
  duration: number,
  metadata?: Record<string, unknown>
): void {
  // In a real implementation, this would send to a tracing backend
  // For now, we'll just structure the data
  const span = {
    traceId,
    spanId,
    operationName,
    status,
    duration,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  // Could be sent to OpenTelemetry, Jaeger, etc.
  if (process.env['VITEST_TRACE_ENABLED'] === 'true') {
    console.log('[TRACE]', JSON.stringify(span));
  }
}

/**
 * Vitest beforeEach hook to start tracing
 */
export function setupTestTracing() {
  return {
    beforeEach: (context: { task: { name: string } }) => {
      startTestTrace(context.task.name);
    },
    afterEach: () => {
      endTestTrace();
    },
  };
}
