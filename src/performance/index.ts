/**
 * Performance optimization utilities for Vitest
 * Parallel execution, memory optimization, and caching
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface ParallelConfig {
  maxWorkers: number;
  timeout: number;
  retryFailed: boolean;
  maxRetries: number;
}

export interface CacheConfig {
  enabled: boolean;
  directory: string;
  maxAge: number;
  compression: boolean;
}

export interface MemoryConfig {
  gcThreshold: number;
  forceGC: boolean;
  maxHeapSize: number;
}

export class ParallelExecutor {
  // Removed unused workers property
  private config: ParallelConfig;

  constructor(config: Partial<ParallelConfig> = {}) {
    this.config = {
      maxWorkers: Math.max(1, require('os').cpus().length - 1),
      timeout: 30000,
      retryFailed: true,
      maxRetries: 3,
      ...config,
    };
  }

  async executeParallel<T>(
    tasks: (() => Promise<T>)[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<T[]> {
    const results: T[] = [];
    const errors: Error[] = [];

    // Simple parallel execution using Promise.allSettled
    const promises = tasks.map(async (task, index) => {
      try {
        const result = await this.executeWithTimeout(task(), this.config.timeout);
        results[index] = result;
        onProgress?.(results.filter(r => r !== undefined).length, tasks.length);
        return result;
      } catch (error) {
        errors.push(error as Error);
        if (this.config.retryFailed) {
          return this.retryTask(task);
        }
        throw error;
      }
    });

    await Promise.allSettled(promises);

    if (errors.length > 0) {
      throw new Error(`Parallel execution failed: ${errors.map(e => e.message).join(', ')}`);
    }

    return results;
  }

  private async executeWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Task timeout')), timeout)
      ),
    ]);
  }

  private async retryTask<T>(task: () => Promise<T>): Promise<T> {
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await this.executeWithTimeout(task(), this.config.timeout);
      } catch (error) {
        if (attempt === this.config.maxRetries) {
          throw error;
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
    throw new Error('Max retries exceeded');
  }
}

export class CacheManager {
  private config: CacheConfig;
  private cacheDir: string;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      enabled: true,
      directory: '.vitest-cache',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      compression: false,
      ...config,
    };
    this.cacheDir = path.resolve(this.config.directory);
  }

  async init(): Promise<void> {
    if (!this.config.enabled) return;
    await fs.mkdir(this.cacheDir, { recursive: true });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.config.enabled) return null;

    try {
      const filePath = this.getFilePath(key);
      const stats = await fs.stat(filePath);

      if (Date.now() - stats.mtime.getTime() > this.config.maxAge) {
        await fs.unlink(filePath);
        return null;
      }

      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (!this.config.enabled) return;

    try {
      const filePath = this.getFilePath(key);
      const data = JSON.stringify(value);
      await fs.writeFile(filePath, data);
    } catch (error) {
      console.warn('Cache write failed:', error);
    }
  }

  async clear(): Promise<void> {
    if (!this.config.enabled) return;

    try {
      const files = await fs.readdir(this.cacheDir);
      await Promise.all(
        files.map(file => fs.unlink(path.join(this.cacheDir, file)))
      );
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  }

  async cleanup(): Promise<void> {
    if (!this.config.enabled) return;

    try {
      const files = await fs.readdir(this.cacheDir);
      const now = Date.now();

      await Promise.all(
        files.map(async file => {
          const filePath = path.join(this.cacheDir, file);
          const stats = await fs.stat(filePath);

          if (now - stats.mtime.getTime() > this.config.maxAge) {
            await fs.unlink(filePath);
          }
        })
      );
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  private getFilePath(key: string): string {
    const hash = crypto.createHash('md5').update(key).digest('hex');
    return path.join(this.cacheDir, `${hash}.json`);
  }
}

export class MemoryOptimizer {
  private config: MemoryConfig;

  constructor(config: Partial<MemoryConfig> = {}) {
    this.config = {
      gcThreshold: 512, // MB
      forceGC: false,
      maxHeapSize: 1024, // MB
      ...config,
    };
  }

  shouldGC(): boolean {
    const usage = process.memoryUsage();
    const usedMB = usage.heapUsed / 1024 / 1024;
    return usedMB > this.config.gcThreshold;
  }

  async optimize(): Promise<boolean> {
    if (this.shouldGC() && global.gc && this.config.forceGC) {
      global.gc();
      return true;
    }
    return false;
  }

  getMemoryStats() {
    const usage = process.memoryUsage();
    return {
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
      external: Math.round(usage.external / 1024 / 1024),
      rss: Math.round(usage.rss / 1024 / 1024),
      threshold: this.config.gcThreshold,
      shouldGC: this.shouldGC(),
    };
  }

  monitorMemory(interval: number = 5000): () => void {
    const intervalId = setInterval(() => {
      const stats = this.getMemoryStats();
      if (stats.shouldGC) {
        console.log('[MEMORY] High memory usage detected:', stats);
        this.optimize();
      }
    }, interval);

    return () => clearInterval(intervalId);
  }
}

export const parallelExecutor = new ParallelExecutor();
export const cacheManager = new CacheManager();
export const memoryOptimizer = new MemoryOptimizer();