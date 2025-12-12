import { vi } from 'vitest';

/**
 * Compatibility layer for using Vitest-specific helpers alongside test-core utilities.
 */

// Re-export test-core utilities that integrate cleanly with Vitest
export {
  createMockFunction,
  createMockObject,
  type MockFunction,
  restoreSpy,
  spyOn,
} from '@kitiumai/test-core';

// Backward-compatible / documented aliases
import { createMockFunction as _createMockFunction, sleep as _sleep } from '@kitiumai/test-core';

/**
 * Alias for `createMockFunction` (older vitest-helpers exports).
 */
export const createMockFn = _createMockFunction;

/**
 * Alias for documented `mockFunction` API name.
 */
export const mockFunction = _createMockFunction;

/**
 * Alias for documented `delay` API name.
 */
export const delay = _sleep;

export {
  createFixture,
  type Fixture,
  FixtureManager,
  type FixtureSetup,
  type FixtureTeardown,
  getGlobalFixtureManager,
  resetGlobalFixtureManager,
} from '@kitiumai/test-core';
export {
  createHttpMockManager,
  getGlobalHttpMockManager,
  type HttpMockHandler,
  HttpMockManager,
  type HttpMockRequest,
  type HttpMockResponse,
  HttpResponses,
  resetGlobalHttpMockManager,
} from '@kitiumai/test-core';
export {
  createDeferred,
  type Deferred,
  parallelLimit,
  retry,
  sleep,
  waitFor,
  waitForValue,
} from '@kitiumai/test-core';
export {
  Builder,
  BuilderGenerators,
  createBuilder,
  createBuilderFactory,
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
  type GetLogsOptions,
  getTestLogger,
  type LogExpectation,
  LogLevel,
  type TestLogEntry,
  type TestLogger,
} from '@kitiumai/test-core';

/**
 * Vitest-specific adaptations
 */

/**
 * Create a mock compatible with Vitest's vi.fn()
 */
export const createVitestMock = <T extends (...args: any[]) => any>(
  implementation?: T
): ReturnType<typeof vi.fn<T>> => vi.fn(implementation);
