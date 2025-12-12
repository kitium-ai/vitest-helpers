/**
 * Visual testing utilities for screenshot comparison and UI testing
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

type PixelmatchFunction = typeof import('pixelmatch');
// pngjs types are optional; use a loose type to avoid requiring type declarations
type PngConstructor = any;

// Dynamic imports for optional dependencies
let pixelmatch: PixelmatchFunction | null = null;
let PNG: PngConstructor | null = null;

try {
  pixelmatch = require('pixelmatch') as PixelmatchFunction;
  PNG = (require('pngjs') as any).PNG;
} catch (_error) {
  // Dependencies not available, visual testing will be limited
}

export type VisualTestConfig = {
  threshold: number; // 0-1, similarity threshold
  diffColor: [number, number, number]; // RGB color for diff pixels
  baselineDir: string;
  diffDir: string;
  updateBaselines: boolean;
};

export type VisualTestResult = {
  testName: string;
  passed: boolean;
  similarity: number;
  diffPixels: number;
  baselinePath?: string;
  actualPath: string;
  diffPath?: string;
  error?: string;
};

export class VisualTester {
  private readonly config: VisualTestConfig;

  constructor(config: Partial<VisualTestConfig> = {}) {
    this.config = {
      threshold: 0.01, // 1% difference allowed
      diffColor: [255, 0, 0], // Red for differences
      baselineDir: 'test/visual/baselines',
      diffDir: 'test/visual/diffs',
      updateBaselines: false,
      ...config,
    };
  }

  private async performImageComparison(
    baselineBuffer: Buffer,
    actualBuffer: Buffer,
    testName: string,
    baselinePath: string,
    actualPath: string,
    diffPath: string
  ): Promise<VisualTestResult> {
    if (!PNG || !pixelmatch) {
      throw new Error(
        'pngjs and pixelmatch dependencies required. Install them to use visual testing.'
      );
    }

    const baselinePng = PNG.sync.read(baselineBuffer);
    const actualPng = PNG.sync.read(actualBuffer);
    const { width, height } = baselinePng;
    const diffPng = new PNG({ width, height });

    const diffPixels = pixelmatch(baselinePng.data, actualPng.data, diffPng.data, width, height, {
      threshold: 0.1,
      diffColor: this.config.diffColor,
    });

    const totalPixels = width * height;
    const similarity = 1 - diffPixels / totalPixels;
    const passed = similarity >= 1 - this.config.threshold;

    if (!passed || this.config.updateBaselines) {
      const diffBuffer = PNG.sync.write(diffPng);
      await fs.promises.writeFile(diffPath, diffBuffer);
    }

    if (this.config.updateBaselines && !passed) {
      await fs.promises.writeFile(baselinePath, actualBuffer);
    }

    const result: VisualTestResult = {
      testName,
      passed,
      similarity,
      diffPixels,
      baselinePath,
      actualPath,
    };

    if (!passed) {
      result.diffPath = diffPath;
    }

    return result;
  }

  private async handleMissingBaseline(
    testName: string,
    actualBuffer: Buffer,
    baselinePath: string,
    actualPath: string
  ): Promise<VisualTestResult> {
    if (this.config.updateBaselines) {
      await fs.promises.mkdir(path.dirname(baselinePath), { recursive: true });
      await fs.promises.writeFile(baselinePath, actualBuffer);
      return {
        testName,
        passed: true,
        similarity: 1,
        diffPixels: 0,
        baselinePath,
        actualPath,
      };
    }

    return {
      testName,
      passed: false,
      similarity: 0,
      diffPixels: 0,
      actualPath,
      error: 'Baseline image not found. Run with updateBaselines: true to create it.',
    };
  }

  async compareScreenshots(
    testName: string,
    actualBuffer: Buffer,
    baselineName?: string
  ): Promise<VisualTestResult> {
    const baselinePath = path.join(this.config.baselineDir, baselineName || `${testName}.png`);
    const actualPath = path.join(this.config.diffDir, `${testName}-actual.png`);
    const diffPath = path.join(this.config.diffDir, `${testName}-diff.png`);

    // Ensure directories exist and save actual screenshot
    await fs.promises.mkdir(path.dirname(actualPath), { recursive: true });
    await fs.promises.mkdir(path.dirname(diffPath), { recursive: true });
    await fs.promises.writeFile(actualPath, actualBuffer);

    try {
      const baselineBuffer = await fs.promises.readFile(baselinePath);
      return await this.performImageComparison(
        baselineBuffer,
        actualBuffer,
        testName,
        baselinePath,
        actualPath,
        diffPath
      );
    } catch (_error) {
      return await this.handleMissingBaseline(testName, actualBuffer, baselinePath, actualPath);
    }
  }

  async compareHTML(
    testName: string,
    actualHTML: string,
    baselineName?: string
  ): Promise<VisualTestResult> {
    // Simple HTML comparison - in a real implementation, this would use
    // a headless browser to render and screenshot the HTML
    const baselinePath = path.join(this.config.baselineDir, baselineName || `${testName}.html`);

    try {
      const baselineHTML = await fs.promises.readFile(baselinePath, 'utf8');
      const similarity = this.calculateTextSimilarity(baselineHTML, actualHTML);

      const passed = similarity >= 1 - this.config.threshold;

      return {
        testName,
        passed,
        similarity,
        diffPixels: 0, // Not applicable for text
        baselinePath,
        actualPath: '', // Not applicable
      };
    } catch (_error) {
      if (this.config.updateBaselines) {
        await fs.promises.mkdir(path.dirname(baselinePath), { recursive: true });
        await fs.promises.writeFile(baselinePath, actualHTML);
        return {
          testName,
          passed: true,
          similarity: 1,
          diffPixels: 0,
          baselinePath,
          actualPath: '',
        };
      } else {
        return {
          testName,
          passed: false,
          similarity: 0,
          diffPixels: 0,
          actualPath: '',
          error: 'Baseline HTML not found.',
        };
      }
    }
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    // Simple Levenshtein distance-based similarity
    const longer = text1.length > text2.length ? text1 : text2;
    const shorter = text1.length > text2.length ? text2 : text1;

    if (longer.length === 0) {
      return 1;
    }

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(string1: string, string2: string): number {
    const matrix: number[][] = [];

    for (let index = 0; index <= string2.length; index++) {
      matrix[index] = [index];
    }

    for (let index = 0; index <= string1.length; index++) {
      matrix[0]![index] = index;
    }

    for (let index = 1; index <= string2.length; index++) {
      for (let index_ = 1; index_ <= string1.length; index_++) {
        if (string2.charAt(index - 1) === string1.charAt(index_ - 1)) {
          matrix[index]![index_] = matrix[index - 1]![index_ - 1]!;
        } else {
          matrix[index]![index_] = Math.min(
            matrix[index - 1]![index_ - 1]! + 1,
            matrix[index]![index_ - 1]! + 1,
            matrix[index - 1]![index_]! + 1
          );
        }
      }
    }

    return matrix[string2.length]![string1.length]!;
  }
}

export class VisualTestReporter {
  private readonly results: VisualTestResult[] = [];

  addResult(result: VisualTestResult): void {
    this.results.push(result);
  }

  getSummary() {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = total - passed;

    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? (passed / total) * 100 : 0,
      results: this.results,
    };
  }

  generateReport(): string {
    const summary = this.getSummary();

    let report = '# Visual Test Report\n\n';
    report += `## Summary\n\n`;
    report += `- Total Tests: ${summary.total}\n`;
    report += `- Passed: ${summary.passed}\n`;
    report += `- Failed: ${summary.failed}\n`;
    report += `- Pass Rate: ${summary.passRate.toFixed(2)}%\n\n`;

    if (summary.failed > 0) {
      report += `## Failed Tests\n\n`;
      summary.results
        .filter((r) => !r.passed)
        .forEach((result) => {
          report += `### ${result.testName}\n`;
          report += `- Similarity: ${(result.similarity * 100).toFixed(2)}%\n`;
          if (result.error) {
            report += `- Error: ${result.error}\n`;
          }
          report += '\n';
        });
    }

    return report;
  }
}

export const visualTester = new VisualTester();
export const visualReporter = new VisualTestReporter();
