import { vi } from 'vitest';

/**
 * Compatibility layer for using Vitest-specific helpers alongside test-core utilities.
 */

// Re-export test-core utilities that integrate cleanly with Vitest
export {
  createMockFn,
  createMockObject,
  restoreSpy,
  spyOn,
  type MockFunction,
} from '@kitiumai/test-core';

export {
  createFixture,
  FixtureManager,
  getGlobalFixtureManager,
  resetGlobalFixtureManager,
  type Fixture,
  type FixtureSetup,
  type FixtureTeardown,
} from '@kitiumai/test-core';

export {
  createHttpMockManager,
  getGlobalHttpMockManager,
  HttpMockManager,
  HttpResponses,
  resetGlobalHttpMockManager,
  type HttpMockHandler,
  type HttpMockRequest,
  type HttpMockResponse,
} from '@kitiumai/test-core';

export {
  waitFor,
  waitForValue,
  retry,
  sleep,
  parallelLimit,
  createDeferred,
  type Deferred,
} from '@kitiumai/test-core';

export {
  createBuilder,
  createBuilderFactory,
  Builder,
  BuilderGenerators,
  Factory,
  Sequence,
} from '@kitiumai/test-core';

export {
  createFactory,
  createFactoryWithBuilder,
  DataGenerators,
  Factories,
  type Generator,
  type PartialFactory,
} from '@kitiumai/test-core';

export {
  createLogger,
  expectLogs,
  getTestLogger,
  LogLevel,
  type GetLogsOptions,
  type LogExpectation,
  type TestLogEntry,
  type TestLogger,
} from '@kitiumai/test-core';

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
