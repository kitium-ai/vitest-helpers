/**
 * Built-in monitoring plugin for test metrics and performance tracking
 */

import type { VitestPlugin } from '../index';

export type MonitoringConfig = {
  enabled: boolean;
  metrics: {
    testDuration: boolean;
    memoryUsage: boolean;
    coverage: boolean;
  };
  reporting: {
    console: boolean;
    file: string | null;
    webhook: string | null;
  };
};

const defaultConfig: MonitoringConfig = {
  enabled: true,
  metrics: {
    testDuration: true,
    memoryUsage: true,
    coverage: true,
  },
  reporting: {
    console: true,
    file: null,
    webhook: null,
  },
};

export const monitoringPlugin: VitestPlugin = {
  name: 'monitoring',
  version: '1.0.0',
  description: 'Built-in monitoring plugin for test metrics and performance tracking',

  configSchema: {
    type: 'object',
    properties: {
      enabled: { type: 'boolean' },
      metrics: {
        type: 'object',
        properties: {
          testDuration: { type: 'boolean' },
          memoryUsage: { type: 'boolean' },
          coverage: { type: 'boolean' },
        },
      },
      reporting: {
        type: 'object',
        properties: {
          console: { type: 'boolean' },
          file: { type: 'string', nullable: true },
          webhook: { type: 'string', nullable: true },
        },
      },
    },
  },

  utilities: {
    getMetrics: () => {
      return {
        timestamp: Date.now(),
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
      };
    },

    logMetric: (name: string, value: any) => {
      if (defaultConfig.reporting.console) {
        console.log(`[MONITORING] ${name}:`, value);
      }
    },
  },
};
