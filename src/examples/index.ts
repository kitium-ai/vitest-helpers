/**
 * Usage examples for common Vitest patterns
 */

/**
 * Example: Basic test with mocking
 */
export const basicTestExample = `
import { describe, it, expect, vi } from 'vitest';
import { UserService } from './user-service';

describe('UserService', () => {
  it('should fetch user', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({ id: 1, name: 'John' })
    });
    
    global.fetch = mockFetch;
    
    const service = new UserService();
    const user = await service.getUser(1);
    
    expect(user.name).toBe('John');
    expect(mockFetch).toHaveBeenCalledWith('/api/users/1');
  });
});
`;

/**
 * Example: Using test-core builders
 */
export const builderExample = `
import { describe, it, expect } from 'vitest';
import { createBuilder, createFactory } from '@kitiumai/vitest-helpers';

interface User {
  id: number;
  name: string;
  email: string;
}

describe('User tests', () => {
  it('should create user with builder', () => {
    const user = createBuilder<User>({ id: 1 })
      .set('name', 'John')
      .set('email', 'john@example.com')
      .build();
    
    expect(user.name).toBe('John');
  });
  
  it('should create multiple users with factory', () => {
    const userFactory = createFactory<User>((seq) => ({
      id: seq,
      name: \`User \${seq}\`,
      email: \`user\${seq}@example.com\`
    }));
    
    const users = userFactory.createMany(5);
    expect(users).toHaveLength(5);
    expect(users[0].id).toBe(1);
  });
});
`;

/**
 * Example: HTTP mocking
 */
export const httpMockExample = `
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createHttpMockManager, HttpResponses } from '@kitiumai/vitest-helpers';

describe('API tests', () => {
  const httpMock = createHttpMockManager();
  
  beforeEach(() => {
    httpMock.mockGet(
      /api\\/users\\/\\d+/,
      HttpResponses.ok({ id: 1, name: 'John' })
    );
  });
  
  afterEach(() => {
    httpMock.clear();
  });
  
  it('should mock API call', async () => {
    const response = await fetch('/api/users/1');
    const data = await response.json();
    
    expect(data.name).toBe('John');
    
    const requests = httpMock.getRequestsByUrl('api/users');
    expect(requests).toHaveLength(1);
  });
});
`;

/**
 * Example: Async utilities
 */
export const asyncExample = `
import { describe, it, expect } from 'vitest';
import { waitFor, retry } from '@kitiumai/vitest-helpers';

describe('Async operations', () => {
  it('should wait for condition', async () => {
    let value = false;
    
    setTimeout(() => { value = true; }, 100);
    
    await waitFor(() => value === true, { timeout: 1000 });
    
    expect(value).toBe(true);
  });
  
  it('should retry operation', async () => {
    let attempts = 0;
    
    const result = await retry(
      async () => {
        attempts++;
        if (attempts < 3) throw new Error('Not ready');
        return 'success';
      },
      { maxAttempts: 5, delay: 10 }
    );
    
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });
});
`;

/**
 * Example: Using presets
 */
export const presetExample = `
// vitest.config.ts
import { VitestPresets } from '@kitiumai/vitest-helpers';

export default VitestPresets.ci;

// Or customize
import { createCustomPreset } from '@kitiumai/vitest-helpers';

export default createCustomPreset('development', {
  test: {
    coverage: {
      enabled: true,
      thresholds: {
        lines: 90
      }
    }
  }
});
`;

/**
 * Example: Workspace configuration
 */
export const workspaceExample = `
// vitest.workspace.ts
import { createMonorepoWorkspace } from '@kitiumai/vitest-helpers/setup';

export default createMonorepoWorkspace({
  packagePattern: 'packages/*/vitest.config.ts',
  shared: {
    coverage: {
      enabled: true,
      provider: 'v8'
    }
  }
});
`;

/**
 * All examples
 */
export const examples = {
  basic: basicTestExample,
  builder: builderExample,
  httpMock: httpMockExample,
  async: asyncExample,
  preset: presetExample,
  workspace: workspaceExample,
};
