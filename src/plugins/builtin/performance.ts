/**
 * Built-in performance plugin for test optimization and caching
 */

import type { VitestPlugin } from '../index';

export type PerformanceConfig = {
  enabled: boolean;
  caching: {
    enabled: boolean;
    directory: string;
    maxAge: number; // in milliseconds
  };
  parallelization: {
    enabled: boolean;
    maxWorkers: number;
  };
  memory: {
    gcThreshold: number; // MB
    forceGC: boolean;
  };
};

const defaultConfig: PerformanceConfig = {
  enabled: true,
  caching: {
    enabled: true,
    directory: '.vitest-cache',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  parallelization: {
    enabled: true,
    maxWorkers: Math.max(1, require('node:os').cpus().length - 1),
  },
  memory: {
    gcThreshold: 512,
    forceGC: false,
  },
};

class CacheManager {
  private readonly cache = new Map<string, { data: any; timestamp: number }>();

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > defaultConfig.caching.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const performancePlugin: VitestPlugin = {
  name: 'performance',
  version: '1.0.0',
  description: 'Built-in performance plugin for test optimization and caching',

  configSchema: {
    type: 'object',
    properties: {
      enabled: { type: 'boolean' },
      caching: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean' },
          directory: { type: 'string' },
          maxAge: { type: 'number' },
        },
      },
      parallelization: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean' },
          maxWorkers: { type: 'number' },
        },
      },
      memory: {
        type: 'object',
        properties: {
          gcThreshold: { type: 'number' },
          forceGC: { type: 'boolean' },
        },
      },
    },
  },

  utilities: {
    cache: new CacheManager(),

    optimizeMemory: () => {
      const usage = process.memoryUsage();
      const usedMB = usage.heapUsed / 1024 / 1024;

      if (usedMB > defaultConfig.memory.gcThreshold) {
        if (global.gc && defaultConfig.memory.forceGC) {
          global.gc();
          return true;
        }
      }
      return false;
    },

    getPerformanceMetrics: () => {
      return {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime(),
      };
    },
  },
};
