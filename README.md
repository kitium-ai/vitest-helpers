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

## License

MIT
