/**
 * Span logging utilities
 * Single Responsibility: Log trace spans with structured data
 */

export interface SpanData {
  traceId: string;
  spanId: string;
  operationName: string;
  status: 'success' | 'error';
  duration: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log a span with structured data
 * In production, this would send to a tracing backend (OpenTelemetry, Jaeger, etc.)
 */
export function logSpan(
  traceId: string,
  spanId: string,
  operationName: string,
  status: 'success' | 'error',
  duration: number,
  metadata?: Record<string, unknown>
): void {
  const span: SpanData = {
    traceId,
    spanId,
    operationName,
    status,
    duration,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  // Only log if tracing is enabled
  if (process.env['VITEST_TRACE_ENABLED'] === 'true') {
    console.log('[TRACE]', JSON.stringify(span));
  }
}

/**
 * Check if tracing is enabled
 */
export function isTracingEnabled(): boolean {
  return process.env['VITEST_TRACE_ENABLED'] === 'true';
}
