/**
 * CI/CD integration utilities for @kitiumai/vitest-helpers
 * Provides templates and helpers for various CI platforms
 */

export type CIConfig = {
  platform: 'github' | 'gitlab' | 'jenkins' | 'circleci' | 'azure';
  nodeVersion: string;
  testCommand: string;
  coverage: boolean;
  parallel: boolean;
  cache: boolean;
};

export const ciTemplates = {
  github: (config: CIConfig) => `
name: CI
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [${config.nodeVersion}]

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'pnpm'
    - run: pnpm install --frozen-lockfile
    - run: pnpm run build
    - run: ${config.testCommand}
    ${config.coverage ? `- run: pnpm run test:coverage` : ''}
    ${config.parallel ? `- run: pnpm run test:parallel` : ''}
  `,

  gitlab: (config: CIConfig) => `
stages:
  - test

test:
  stage: test
  image: node:${config.nodeVersion}
  before_script:
    - npm ci
  script:
    - npm run build
    - ${config.testCommand}
    ${config.coverage ? `- npm run test:coverage` : ''}
  ${config.parallel ? `parallel: ${config.parallel ? 2 : 1}` : ''}
  ${config.cache ? `cache:\n    paths:\n      - node_modules/` : ''}
  `,

  circleci: (config: CIConfig) => `
version: 2.1

executors:
  node-executor:
    docker:
      - image: cimg/node:${config.nodeVersion}

jobs:
  test:
    executor: node-executor
    steps:
      - checkout
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - run: ${config.testCommand}
      ${config.coverage ? `- run: pnpm run test:coverage` : ''}

workflows:
  test:
    jobs:
      - test
  `,

  jenkins: (config: CIConfig) => `
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
                sh '${config.testCommand}'
                ${config.coverage ? `sh 'npm run test:coverage'` : ''}
            }
        }
    }
}
  `,

  azure: (config: CIConfig) => `
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '${config.nodeVersion}'
- script: npm ci
- script: npm run build
- script: ${config.testCommand}
${config.coverage ? `- script: npm run test:coverage` : ''}
  `,
};

export class CIHelper {
  static generateConfig(platform: CIConfig['platform'], config: Partial<CIConfig> = {}): string {
    const defaultConfig: CIConfig = {
      platform,
      nodeVersion: '18',
      testCommand: 'pnpm test',
      coverage: true,
      parallel: false,
      cache: true,
      ...config,
    };

    return ciTemplates[platform](defaultConfig);
  }

  static getEnvironmentInfo(): Record<string, string> {
    return {
      CI: process.env['CI'] || 'false',
      GITHUB_ACTIONS: process.env['GITHUB_ACTIONS'] || '',
      GITLAB_CI: process.env['GITLAB_CI'] || '',
      JENKINS_HOME: process.env['JENKINS_HOME'] || '',
      CIRCLECI: process.env['CIRCLECI'] || '',
      AZURE_HTTP_USER_AGENT: process.env['AZURE_HTTP_USER_AGENT'] || '',
    };
  }

  static isCI(): boolean {
    return !!process.env['CI'];
  }

  static getPlatform(): string | null {
    if (process.env['GITHUB_ACTIONS']) {
      return 'github';
    }
    if (process.env['GITLAB_CI']) {
      return 'gitlab';
    }
    if (process.env['JENKINS_HOME']) {
      return 'jenkins';
    }
    if (process.env['CIRCLECI']) {
      return 'circleci';
    }
    if (process.env['AZURE_HTTP_USER_AGENT']) {
      return 'azure';
    }
    return null;
  }
}
