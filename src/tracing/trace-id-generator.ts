/**
 * Trace and Span ID generation utilities
 * Single Responsibility: Generate unique identifiers for distributed tracing
 */

/**
 * Generate a unique identifier with a prefix
 */
function generateUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

/**
 * Generate a unique trace ID
 */
export function generateTraceId(): string {
  return generateUniqueId('trace');
}

/**
 * Generate a unique span ID
 */
export function generateSpanId(): string {
  return generateUniqueId('span');
}
