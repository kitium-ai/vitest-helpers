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
- 🔄 **Jest Migration** - Compatibility layer for easy migration
- 🌐 **Browser Mode** - Browser testing helpers
- ⚡ **Benchmarks** - Performance testing utilities
- 📊 **Custom Reporters** - Enhanced test output
- 🧰 **Framework-Agnostic** - Built on @kitiumai/test-core

## Quick Start

### Using a Preset

```typescript
// vitest.config.ts
import { VitestPresets } from '@kitiumai/vitest-helpers';

export default VitestPresets.development; // or .ci, .library, .react, .vue
```

## License

MIT
