/**
 * Vitest workspace configuration helpers
 * Simplifies multi-project testing
 */

import { defineWorkspace } from 'vitest/config';

export interface WorkspaceProjectConfig {
  name: string;
  root: string;
  test?: Record<string, unknown>;
}

/**
 * Setup a Vitest workspace with multiple projects
 */
export function setupWorkspace(options: {
  projects: WorkspaceProjectConfig[];
  shared?: Record<string, unknown>;
}) {
  const { projects, shared = {} } = options;

  return defineWorkspace(
    projects.map((project) => ({
      test: {
        name: project.name,
        root: project.root,
        ...shared,
        ...project.test,
      },
    }))
  );
}

/**
 * Create a monorepo workspace configuration
 */
export function createMonorepoWorkspace(options: { packagePattern?: string } = {}) {
  const { packagePattern = 'packages/*/vitest.config.ts' } = options;

  return defineWorkspace([packagePattern]);
}

/**
 * Create a workspace with separate unit and integration test projects
 */
export function createLayeredWorkspace(options: {
  unitRoot?: string;
  integrationRoot?: string;
  shared?: Record<string, unknown>;
}) {
  const {
    unitRoot = './tests/unit',
    integrationRoot = './tests/integration',
    shared = {},
  } = options;

  return setupWorkspace({
    projects: [
      {
        name: 'unit',
        root: unitRoot,
        test: {
          include: ['**/*.test.ts', '**/*.spec.ts'],
          environment: 'node',
        },
      },
      {
        name: 'integration',
        root: integrationRoot,
        test: {
          include: ['**/*.integration.test.ts', '**/*.integration.spec.ts'],
          environment: 'node',
          testTimeout: 30000,
        },
      },
    ],
    shared,
  });
}
