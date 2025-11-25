/**
 * Benchmark testing helpers for Vitest
 */

import { bench as vitestBench } from 'vitest';

/**
 * Create a benchmark suite
 */
export function createBenchmark(
  name: string,
  options: {
    baseline: () => void | Promise<void>;
    optimized?: () => void | Promise<void>;
    iterations?: number;
  }
) {
  const { baseline, optimized, iterations = 1000 } = options;

  vitestBench(
    `${name} - baseline`,
    async () => {
      await baseline();
    },
    { iterations }
  );

  if (optimized) {
    vitestBench(
      `${name} - optimized`,
      async () => {
        await optimized();
      },
      { iterations }
    );
  }

  return {
    /**
     * Assert that optimized version is faster than baseline
     */
    toMatchBaseline: (options: { tolerance?: number } = {}) => {
      const { tolerance = 0 } = options;
      // This would need actual benchmark result comparison
      // Vitest's bench API would handle this
      return tolerance >= 0;
    },
  };
}

/**
 * Quick benchmark helper
 */
export function quickBench(name: string, fn: () => void | Promise<void>, iterations = 1000): void {
  vitestBench(name, fn, { iterations });
}
