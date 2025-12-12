# @kitiumai/vitest-helpers

Vitest testing helpers with framework-specific utilities for modern JavaScript/TypeScript testing.

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
