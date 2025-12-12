# @kitiumai/vitest-helpers

Vitest testing helpers with framework-specific utilities for modern JavaScript/TypeScript testing.

## What is this package?

`@kitiumai/vitest-helpers` is a comprehensive testing utility library built specifically for [Vitest](https://vitest.dev/), the next-generation testing framework for JavaScript and TypeScript. It provides a rich set of utilities, presets, and enterprise-grade features to enhance your testing workflow, making it easier to write, run, and maintain tests across different frameworks and environments.

## Why do we need this package?

Modern JavaScript/TypeScript applications require robust testing strategies that go beyond basic unit tests. This package addresses several key challenges:

- **Framework Integration**: Seamless integration with popular frameworks (React, Vue, Angular, Svelte, etc.) through pre-configured presets
- **Enterprise Testing Needs**: Advanced features like visual testing, accessibility testing, security auditing, and performance monitoring
- **Team Collaboration**: Shared configurations and test reports for better team coordination
- **CI/CD Integration**: Automated testing pipelines with support for multiple CI platforms
- **Performance Optimization**: Parallel execution, caching, and memory management for faster test runs
- **Developer Experience**: Interactive CLI tools and comprehensive utilities that reduce boilerplate and improve productivity

## Competitor Comparison

| Feature | @kitiumai/vitest-helpers | Vitest Plugins | Jest Helpers | Testing Library Utils |
|---------|-------------------------|---------------|--------------|----------------------|
| **Framework Presets** | ✅ 15+ frameworks | ❌ Limited | ❌ Manual | ❌ N/A |
| **Visual Testing** | ✅ Built-in | ❌ External plugins | ❌ External | ❌ N/A |
| **Accessibility Testing** | ✅ WCAG compliance | ❌ External | ❌ External | ❌ N/A |
| **Security Auditing** | ✅ Secret detection | ❌ External | ❌ External | ❌ N/A |
| **Performance Monitoring** | ✅ Parallel execution | ❌ Basic | ❌ Basic | ❌ N/A |
| **CI/CD Integration** | ✅ 4+ platforms | ❌ Manual | ❌ Manual | ❌ N/A |
| **Team Collaboration** | ✅ Shared configs | ❌ N/A | ❌ N/A | ❌ N/A |
| **Interactive CLI** | ✅ Full-featured | ❌ N/A | ❌ N/A | ❌ N/A |
| **Enterprise Features** | ✅ Monitoring, compliance | ❌ Limited | ❌ Limited | ❌ N/A |
| **Tree-shaking** | ✅ Modular imports | ✅ Varies | ✅ Varies | ✅ Varies |

## Unique Selling Proposition (USP)

**"Enterprise-Ready Testing Ecosystem for Modern JavaScript"**

- **Framework-Agnostic Core**: Built on `@kitiumai/test-core` for consistent testing patterns across projects
- **Zero-Config Presets**: One-line setup for complex testing scenarios
- **Enterprise Features**: Visual testing, accessibility, security, and compliance reporting out-of-the-box
- **Performance First**: Optimized for speed with parallel execution and intelligent caching
- **Team-Centric**: Collaboration tools and shared configurations for large teams
- **Extensible Architecture**: Plugin system for custom testing needs
- **Production Proven**: Used in production environments with comprehensive monitoring

## Installation

```bash
npm install @kitiumai/vitest-helpers vitest
```

**Peer Dependencies:**

- `vitest` ^1.0.0 || ^2.0.0
- `typescript` ^5.0.0

**Optional:**

- `@vitest/ui` - For UI mode
- `@vitest/browser` - For browser testing

## Features

- 🎯 **Config Presets** - Pre-configured setups for React, Vue, Angular, Svelte, Solid, Next.js, Nuxt, Astro and more
- 🔧 **Workspace Support** - Multi-project testing made easy
- 🧪 **Vitest-first Helpers** - Consistent wrappers for mocks, fixtures, and async utils
- 🌐 **Browser Mode** - Browser testing helpers
- ⚡ **Benchmarks** - Performance testing utilities
- 📊 **Custom Reporters** - Enhanced test output
- 🔌 **Plugin System** - Extensible architecture for custom utilities
- 🚀 **CI/CD Integration** - Automated testing pipelines for GitHub, GitLab, CircleCI, and more
- 📈 **Monitoring** - Test performance metrics and analytics
- 👥 **Team Collaboration** - Shared configurations and test reports
- ⚡ **Performance Optimization** - Parallel execution, caching, and memory management
- 💻 **Interactive CLI** - Command-line tools for test management
- 👁️ **Visual Testing** - Screenshot comparison and UI regression testing
- ♿ **Accessibility Testing** - WCAG compliance and a11y checks
- 🔒 **Security & Compliance** - Audit logging, secret detection, and compliance reporting
- 🧰 **Framework-Agnostic** - Built on @kitiumai/test-core

## All Exported APIs

This package exports a comprehensive set of APIs organized by functionality. All APIs from `@kitiumai/test-core` are re-exported for convenience.

### Core Testing Utilities (from @kitiumai/test-core)
- `createMockFunction`, `createMockObject`, `restoreSpy`, `spyOn`
- `createFixture`, `FixtureManager`, `Fixture`, `FixtureSetup`, `FixtureTeardown`
- `createHttpMockManager`, `HttpMockManager`, `HttpMockRequest`, `HttpMockResponse`, `HttpResponses`
- `createDeferred`, `Deferred`, `parallelLimit`, `retry`, `sleep`, `waitFor`, `waitForValue`
- `Builder`, `BuilderGenerators`, `createBuilder`, `createBuilderFactory`
- `Factory`, `Sequence`, `createFactory`, `createFactoryWithBuilder`, `DataGenerators`, `Factories`
- `createLogger`, `expectLogs`, `LogLevel`, `TestLogger`, `TestLogEntry`, `LogExpectation`

### Compatibility Layer
- `createMockFn`, `mockFunction`, `delay`, `createVitestMock`

### Setup & Configuration
- `createVitestSetup`, `definePreset`, `createWorkspaceConfig`, `setupPresets`
- `developmentPreset`, `ciPreset`, `libraryPreset`, `reactPreset`, `vuePreset`, `angularPreset`, `sveltePreset`, `solidPreset`, `nextjsPreset`, `nuxtPreset`, `astroPreset`, `VitestPresets`, `createCustomPreset`

### CI/CD Integration
- `CIHelper`, `CIConfig`

### Monitoring
- `TestMonitor`, `MonitoringTestMetrics`, `MonitoringConfig`, `globalMonitor`

### Collaboration
- `CollaborationManager`, `SharedConfig`, `TestReport`, `collaborationManager`

### Performance
- `ParallelExecutor`, `CacheManager`, `MemoryOptimizer`, `ParallelConfig`, `CacheConfig`, `MemoryConfig`
- `parallelExecutor`, `cacheManager`, `memoryOptimizer`

### CLI Tools
- `VitestCLI`, `CLIConfig`, `createCLI`

### Visual Testing
- `VisualTester`, `VisualTestReporter`, `VisualTestConfig`, `VisualTestResult`
- `visualTester`, `visualReporter`

### Accessibility Testing
- `AccessibilityTester`, `AccessibilityReporter`, `AccessibilityRule`, `AccessibilityViolation`, `AccessibilityResult`
- `accessibilityTester`, `accessibilityReporter`

### Security & Compliance
- `AuditLogger`, `SecretDetector`, `ComplianceReporter`, `AuditLogEntry`, `SecretDetectionResult`, `ComplianceReport`
- `auditLogger`, `secretDetector`, `complianceReporter`

### Migration Tools
- `convertJestConfigToVitest`, `JestToVitestMapping`, `migrationSteps`, `codeTransformations`

### Additional Modules
- Benchmarks: `defineBenchmark`, `createBenchmarkSuite`, `BenchmarkReporters`
- Browser: `createBrowserConfig`, `setupBrowserPool`, `BrowserTypes`
- Reporters: `createCustomReporter`, `BuiltInReporters`
- Tracing: `enableDistributedTracing`, `createTracingContext`, `TracingIntegrations`
- Examples: `getExample`, `AvailableExamples`
- Config: `createVitestConfig`, `mergeVitestConfigs`
- Lint: `createVitestLintConfig`, `configureLinting`
- Tooling: `setupDevelopmentTools`, `createToolingConfig`
- Plugins: `pluginManager`, `monitoringPlugin`, `performancePlugin` (and more)

For detailed API documentation, see the [API References](#api-references) section below.

## Quick Start

### Using a Preset

```typescript
// vitest.config.ts
import { KitiumVitestPresets } from '@kitiumai/vitest-helpers';

export default KitiumVitestPresets.ci(); // or .local, .library, .browser
```

### Vitest convenience helpers

Use the compatibility helpers to keep mocks, fixtures, and async utilities consistent across projects:

```typescript
import { createVitestMock, createFixture, waitFor } from '@kitiumai/vitest-helpers';

const fetchMock = createVitestMock(() => Promise.resolve({ ok: true }));

const fixture = createFixture({
  setup: async () => ({ fetchMock }),
  teardown: async () => fetchMock.mockReset(),
});

await waitFor(() => expect(fetchMock).toHaveBeenCalled());
```

### Fixture and data factory workflow

Compose deterministic data and reusable fixtures to keep suites predictable across repos:

```typescript
import {
  createFixture,
  createFactory,
  Builder,
  createLogger,
  expectLogs,
} from '@kitiumai/vitest-helpers';

const userFactory = createFactory({
  name: () => 'Ada Lovelace',
  email: ({ name }) => `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
});

const logger = createLogger({ level: 'info' });

const userFixture = createFixture({
  setup: async () => ({ user: userFactory.build() }),
  teardown: async () => logger.flush?.(),
});

const builder = new Builder(userFactory).sequence('id');

it('creates a user deterministically', async () => {
  const { user } = await userFixture.setup();
  expect(user.email).toContain('@example.com');

  await expectLogs(logger, [{ level: 'info' }]);
});
```

### Minimal Vitest config template

Ship a single config file and keep overrides in-code:

```typescript
// vitest.config.ts
import { createKitiumVitestConfig } from '@kitiumai/vitest-helpers';

export default createKitiumVitestConfig({
  preset: process.env.CI ? 'ci' : 'local',
  projectName: 'web-app',
  setupFiles: ['./test/setup.ts'],
});
```

## Enterprise Features

### Plugin System

Extend Vitest with custom plugins for specialized testing needs:

```typescript
import {
  pluginManager,
  monitoringPlugin,
  performancePlugin,
} from '@kitiumai/vitest-helpers/plugins';

// Register built-in plugins
pluginManager.register(monitoringPlugin);
pluginManager.register(performancePlugin);

// Load all plugins
await pluginManager.load({
  /* config */
});

// Use plugin utilities
const metrics = monitoringPlugin.utilities.getMetrics();
const cache = performancePlugin.utilities.cache;
```

### CI/CD Integration

Generate CI configurations for popular platforms:

```typescript
import { CIHelper } from '@kitiumai/vitest-helpers/ci';

// Generate GitHub Actions workflow
const githubConfig = CIHelper.generateConfig('github', {
  nodeVersion: '18',
  testCommand: 'pnpm test',
  coverage: true,
  parallel: true,
});

console.log(githubConfig);
```

### Performance Optimization

Parallel test execution and caching:

```typescript
import {
  parallelExecutor,
  cacheManager,
  memoryOptimizer,
} from '@kitiumai/vitest-helpers/performance';

// Run tests in parallel
const results = await parallelExecutor.executeParallel([
  () => testFunction1(),
  () => testFunction2(),
  () => testFunction3(),
]);

// Cache expensive operations
await cacheManager.set('expensive-result', computedResult);
const cached = await cacheManager.get('expensive-result');

// Monitor memory usage
const stats = memoryOptimizer.getMemoryStats();
if (stats.shouldGC) {
  await memoryOptimizer.optimize();
}
```

### Visual Testing

Screenshot comparison for UI regression testing:

```typescript
import { visualTester, visualReporter } from '@kitiumai/vitest-helpers/visual';

// Compare screenshots
const result = await visualTester.compareScreenshots(
  'homepage',
  screenshotBuffer,
  'homepage-baseline'
);

visualReporter.addResult(result);
console.log(visualReporter.generateReport());
```

### Accessibility Testing

WCAG compliance checking:

```typescript
import { accessibilityTester, accessibilityReporter } from '@kitiumai/vitest-helpers/accessibility';

// Test HTML for accessibility
const result = await accessibilityTester.testHTML('<html>...</html>');
console.log(accessibilityReporter.generateReport(result));
```

### Security & Compliance

Audit logging and secret detection:

```typescript
import { auditLogger, secretDetector, complianceReporter } from '@kitiumai/vitest-helpers/security';

// Log security events
auditLogger.log({
  action: 'test-run',
  user: 'test-user',
  resource: 'test-suite',
  details: { testCount: 100 },
});

// Scan for secrets
const findings = await secretDetector.scanDirectory('./src');
console.log('Security findings:', findings);

// Generate compliance report
const report = await complianceReporter.generateReport(testResults);
console.log(complianceReporter.generateReportMarkdown(report));
```

### Interactive CLI

Command-line tools for test management:

```bash
npx @kitiumai/vitest-helpers/cli
```

Available commands:

- `setup-ci` - Generate CI/CD configuration
- `monitor` - Start test monitoring
- `collaborate` - Team collaboration tools
- `performance` - Performance optimization tools

## Usage & Tree-Shaking

### Subpath Imports (Recommended for Bundle Size)

The vitest-helpers package provides modular subpath exports to help bundlers tree-shake unused code. Import only what you need:

```typescript
// ✅ Minimal — only vitest setup utilities
import { createVitestSetup, setupPresets } from '@kitiumai/vitest-helpers/setup';

// ✅ Specific feature — browser testing only
import { createBrowserConfig } from '@kitiumai/vitest-helpers/browser';

// ✅ Benchmarks only — for performance testing
import { defineBenchmark } from '@kitiumai/vitest-helpers/benchmarks';

// ✅ Migration utilities only — for Jest to Vitest migration
import { migrateJestToVitest } from '@kitiumai/vitest-helpers/migration';
```

### Top-level Barrel (Works, But Larger)

If you import from the top-level barrel, modern bundlers (esbuild, Rollup, webpack with Terser) will still tree-shake unused exports:

```typescript
// ⚠️ Works but includes all exports; bundler will tree-shake unused ones
import { createVitestSetup, defineBenchmark, migrateJestToVitest } from '@kitiumai/vitest-helpers';
```

### Available Subpaths

- `@kitiumai/vitest-helpers/setup` — Vitest setup and presets
- `@kitiumai/vitest-helpers/setup/presets` — Pre-configured presets only
- `@kitiumai/vitest-helpers/setup/workspace` — Workspace configuration
- `@kitiumai/vitest-helpers/compatibility` — Jest-to-Vitest mapping and validation
- `@kitiumai/vitest-helpers/browser` — Browser mode configuration
- `@kitiumai/vitest-helpers/benchmarks` — Benchmark utilities
- `@kitiumai/vitest-helpers/reporters` — Custom reporter helpers
- `@kitiumai/vitest-helpers/tracing` — OpenTelemetry and distributed tracing
- `@kitiumai/vitest-helpers/migration` — Jest to Vitest migration tools
- `@kitiumai/vitest-helpers/config` — Vitest configuration helpers
- `@kitiumai/vitest-helpers/lint` — Linting configuration for tests
- `@kitiumai/vitest-helpers/tooling` — Development tooling setup
- `@kitiumai/vitest-helpers/plugins` — Plugin system and built-in plugins
- `@kitiumai/vitest-helpers/ci` — CI/CD integration templates
- `@kitiumai/vitest-helpers/monitoring` — Test performance monitoring
- `@kitiumai/vitest-helpers/collaboration` — Team collaboration tools
- `@kitiumai/vitest-helpers/performance` — Performance optimization utilities
- `@kitiumai/vitest-helpers/cli` — Interactive CLI tools
- `@kitiumai/vitest-helpers/visual` — Visual testing and screenshot comparison
- `@kitiumai/vitest-helpers/accessibility` — Accessibility testing and WCAG compliance
- `@kitiumai/vitest-helpers/security` — Security auditing and compliance reporting

### Build Optimization Tips

1. **Use subpath imports in production** to guarantee minimal bundle surface across all bundlers.
2. **For setup/config files**, import from `@kitiumai/vitest-helpers/setup` to avoid including browser/migration/benchmark utilities.
3. **For migration projects**, use `@kitiumai/vitest-helpers/migration` to ship only migration tools without benchmark/browser code.
4. **Verify bundling** with esbuild: `esbuild --bundle --minify --analyze src/index.ts` to see what's included.

The package provides ESM builds with `sideEffects: false`, so tree-shaking works across all modern toolchains.

## License

MIT
