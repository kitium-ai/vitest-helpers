# Migration Guide: Jest to Vitest

This guide will help you migrate from Jest to Vitest using `@kitiumai/vitest-helpers`.

## Why Vitest?

- ⚡ **10x faster** than Jest (native ESM, Vite-powered)
- 🔧 **Jest-compatible API** - most tests work without changes
- 💻 **Better DX** - instant feedback, UI mode, better errors
- 📦 **Smaller bundle** - lighter dependencies
- 🎯 **Modern** - built for ESM, TypeScript-first

## Step-by-Step Migration

### 1. Install Dependencies

```bash
# Remove Jest
npm uninstall jest @types/jest ts-jest

# Install Vitest
npm install -D vitest @kitiumai/vitest-helpers
```

### 2. Update Configuration

**Before (jest.config.js):**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
};
```

**After (vitest.config.ts):**
```typescript
import { VitestPresets } from '@kitiumai/vitest-helpers';

export default VitestPresets.ci; // or .development, .library, etc.
```

### 3. Update package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 4. Update Imports

Most imports stay the same! Vitest provides globals when `globals: true` in config.

**Option A: Use Globals (recommended)**
```typescript
// No imports needed! describe, it, expect, vi are global
describe('My test', () => {
  it('works', () => {
    expect(true).toBe(true);
  });
});
```

**Option B: Explicit Imports**
```typescript
// Change this:
import { describe, it, expect } from '@jest/globals';

// To this:
import { describe, it, expect, vi } from 'vitest';
```

### 5. Replace `jest.*` with `vi.*`

```typescript
// Before (Jest)
const mockFn = jest.fn();
jest.mock('./module');
jest.spyOn(obj, 'method');
jest.useFakeTimers();

// After (Vitest)
const mockFn = vi.fn();
vi.mock('./module');
vi.spyOn(obj, 'method');
vi.useFakeTimers();
```

### 6. Use Framework-Agnostic Helpers

For even better compatibility, use `@kitiumai/vitest-helpers`:

```typescript
import {
  createMockFn,
  createHttpMockManager,
  waitFor,
  createBuilder,
} from '@kitiumai/vitest-helpers';

// These work identically in Jest and Vitest!
const mockFn = createMockFn();
```

## API Mapping Reference

| Jest | Vitest | Notes |
|------|--------|-------|
| `jest.fn()` | `vi.fn()` | Identical API |
| `jest.mock()` | `vi.mock()` | Identical API |
| `jest.spyOn()` | `vi.spyOn()` | Identical API |
| `jest.clearAllMocks()` | `vi.clearAllMocks()` | Identical API |
| `jest.useFakeTimers()` | `vi.useFakeTimers()` | Identical API |
| `jest.advanceTimersByTime()` | `vi.advanceTimersByTime()` | Identical API |
| `process.env.VAR` | `import.meta.env.VAR` | For Vite projects only |

## Common Gotchas

### 1. ESM Hoisting

Vitest uses ESM, so `vi.mock()` calls must be at the top level:

```typescript
// ✅ Good
vi.mock('./module');

describe('test', () => {
  it('works', () => {
    // test code
  });
});

// ❌ Bad
describe('test', () => {
  vi.mock('./module'); // Won't work!
});
```

### 2. Auto-mocking

Jest auto-mocks by default, Vitest doesn't:

```typescript
// Jest: auto-mocked
jest.mock('./module');

// Vitest: need to provide factory
vi.mock('./module', () => ({
  default: { method: vi.fn() }
}));
```

### 3. Transform

Jest uses `transform`. Vitest uses Vite plugins:

```typescript
// Instead of jest transform config, use Vite plugins in vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [/* your Vite plugins */],
  test: {
    // test config
  }
});
```

## Migration Checklist

- [ ] Install vitest and @kitiumai/vitest-helpers
- [ ] Uninstall jest and related packages
- [ ] Create vitest.config.ts using presets
- [ ] Update package.json scripts
- [ ] Replace `jest.*` with `vi.*` (or use find-replace)
- [ ] Move `vi.mock()` calls to top level
- [ ] Update ESM imports if needed
- [ ] Run tests and fix any issues
- [ ] Enjoy 10x faster tests! 🚀

## Need Help?

Check the examples:
```typescript
import { examples } from '@kitiumai/vitest-helpers/examples';

console.log(examples.basic); // Basic test example
console.log(examples.httpMock); // HTTP mocking example
console.log(examples.async); // Async utilities example
```

## Full Example

**Before (Jest):**
```typescript
import { describe, it, expect } from '@jest/globals';

describe('UserService', () => {
  it('should fetch user', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      json: async () => ({ id: 1, name: 'John' })
    });
    
    global.fetch = mockFetch;
    
    const user = await userService.getUser(1);
    expect(user.name).toBe('John');
  });
});
```

**After (Vitest):**
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('UserService', () => {
  it('should fetch user', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({ id: 1, name: 'John' })
    });
    
    global.fetch = mockFetch;
    
    const user = await userService.getUser(1);
    expect(user.name).toBe('John');
  });
});
```

That's it! Most Jest tests work in Vitest with minimal changes.
