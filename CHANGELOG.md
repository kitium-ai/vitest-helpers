# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-11-25

### Added

- Initial release of `@kitiumai/vitest-helpers`
- **Setup Presets**: Pre-configured setups for common scenarios (development, CI, library, React, Vue)
- **Workspace Support**: Helpers for multi-project monorepo testing
- **Jest Compatibility**: Migration layer for easy transition from Jest
- **Framework-Agnostic Utilities**: Re-exports from `@kitiumai/test-core`
  - Mocking utilities
  - Fixture management
  - HTTP mocking
  - Async test helpers
  - Test data builders and factories
- **Tracing**: Distributed tracing support for test execution
- **Browser Mode**: Helpers for `@vitest/browser`
- **Benchmarks**: Performance testing utilities
- **Custom Reporters**: Enhanced test output
- **Migration Guide**: Comprehensive Jest to Vitest migration documentation
- **Examples**: Usage examples for common patterns

### Features

#### Configuration Presets

- `VitestPresets.development` - Fast feedback for local development
- `VitestPresets.ci` - Comprehensive testing for CI/CD
- `VitestPresets.library` - Optimized for library packages
- `VitestPresets.react` - Pre-configured for React applications
- `VitestPresets.vue` - Pre-configured for Vue applications

#### Workspace Helpers

- `createMonorepoWorkspace()` - Simple monorepo setup
- `createLayeredWorkspace()` - Separate unit/integration tests
- `setupWorkspace()` - Custom workspace configuration

#### Test Utilities

- `createMockFn()` - Framework-agnostic mock functions
- `createHttpMockManager()` - HTTP request/response mocking
- `waitFor()`, `retry()`, `sleep()` - Async test utilities
- `createBuilder()`, `createFactory()` - Test data generation

#### Tracing

- `traceTest()` - Trace test operations
- `traceChild()` - Trace child operations
- `startTestTrace()` / `endTestTrace()` - Test context management
- `setupTestTracing()` - Automatic tracing setup

#### Migration Support

- Jest API mapping reference
- Configuration converter
- Code transformation examples
- Migration checklist

### Documentation

- Comprehensive README with examples
- Migration guide from Jest
- Usage examples for all features
- TypeScript type definitions

[1.0.0]: https://github.com/kitiumai/test-utils/releases/tag/vitest-helpers-v1.0.0
