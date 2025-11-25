import { vi } from 'vitest';

/**
 * Compatibility layer for using Jest-style patterns with Vitest
 * Helps with migration from Jest to Vitest
 */

// Re-export test-core utilities that work with both Jest and Vitest
export {
  createMockFn,
  createMockObject,
  spyOn,
  type MockFunction,
} from '@kitiumai/test-core/mocks';

export {
  createFixture,
  FixtureManager,
  getGlobalFixtureManager,
  type Fixture,
} from '@kitiumai/test-core/fixtures';

export {
  createHttpMockManager,
  HttpResponses,
  type HttpMockRequest,
  type HttpMockResponse,
} from '@kitiumai/test-core/http';

export {
  waitFor,
  waitForValue,
  retry,
  sleep,
  createDeferred,
  type Deferred,
} from '@kitiumai/test-core/async';

export {
  createBuilder,
  createFactory,
  Generators,
  type Builder,
  type Factory,
} from '@kitiumai/test-core/builders';

/**
 * Vitest-specific adaptations
 */

/**
 * Create a mock compatible with Vitest's vi.fn()
 */
export function createVitestMock<T extends (...args: any[]) => any>(
  implementation?: T
): ReturnType<typeof vi.fn<T>> {
  return vi.fn(implementation);
}

/**
 * Setup Jest compatibility mode
 * Provides Jest-like APIs in Vitest
 */
export function setupJestCompatibility(): void {
  // Vitest already provides Jest-compatible APIs via globals
  // This function is a placeholder for any additional compatibility needed
}
