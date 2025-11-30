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

- 🎯 **Config Presets** - Pre-configured setups for common scenarios
- 🔧 **Workspace Support** - Multi-project testing made easy
- 🧪 **Vitest-first Helpers** - Consistent wrappers for mocks, fixtures, and async utils
- 🌐 **Browser Mode** - Browser testing helpers
- ⚡ **Benchmarks** - Performance testing utilities
- 📊 **Custom Reporters** - Enhanced test output
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

### Build Optimization Tips

1. **Use subpath imports in production** to guarantee minimal bundle surface across all bundlers.
2. **For setup/config files**, import from `@kitiumai/vitest-helpers/setup` to avoid including browser/migration/benchmark utilities.
3. **For migration projects**, use `@kitiumai/vitest-helpers/migration` to ship only migration tools without benchmark/browser code.
4. **Verify bundling** with esbuild: `esbuild --bundle --minify --analyze src/index.ts` to see what's included.

The package provides ESM builds with `sideEffects: false`, so tree-shaking works across all modern toolchains.

## License

MIT
