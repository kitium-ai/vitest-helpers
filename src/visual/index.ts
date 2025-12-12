/**
 * Visual testing utilities for screenshot comparison and UI testing
 */

import * as fs from 'fs';
import * as path from 'path';

// Dynamic imports for optional dependencies
let pixelmatch: any = null;
let PNG: any = null;

try {
  pixelmatch = require('pixelmatch');
  PNG = require('pngjs').PNG;
} catch (error) {
  // Dependencies not available, visual testing will be limited
}

export interface VisualTestConfig {
  threshold: number; // 0-1, similarity threshold
  diffColor: [number, number, number]; // RGB color for diff pixels
  baselineDir: string;
  diffDir: string;
  updateBaselines: boolean;
}

export interface VisualTestResult {
  testName: string;
  passed: boolean;
  similarity: number;
  diffPixels: number;
  baselinePath?: string;
  actualPath: string;
  diffPath?: string;
  error?: string;
}

export class VisualTester {
  private config: VisualTestConfig;

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

  async compareScreenshots(
    testName: string,
    actualBuffer: Buffer,
    baselineName?: string
  ): Promise<VisualTestResult> {
    const baselinePath = path.join(
      this.config.baselineDir,
      baselineName || `${testName}.png`
    );
    const actualPath = path.join(this.config.diffDir, `${testName}-actual.png`);
    const diffPath = path.join(this.config.diffDir, `${testName}-diff.png`);

    // Ensure directories exist
    await fs.promises.mkdir(path.dirname(actualPath), { recursive: true });
    await fs.promises.mkdir(path.dirname(diffPath), { recursive: true });

    // Save actual screenshot
    await fs.promises.writeFile(actualPath, actualBuffer);

    try {
      // Load baseline if it exists
      const baselineBuffer = await fs.promises.readFile(baselinePath);
      if (!PNG) {
        throw new Error('pngjs dependency not available. Install pngjs to use visual testing.');
      }
      const baselinePng = PNG.sync.read(baselineBuffer);
      const actualPng = PNG.sync.read(actualBuffer);

      // Create diff image
      const { width, height } = baselinePng;
      if (!PNG) {
        throw new Error('pngjs dependency not available. Install pngjs to use visual testing.');
      }
      const diffPng = new PNG({ width, height });

      if (!pixelmatch) {
        throw new Error('pixelmatch dependency not available. Install pixelmatch to use visual testing.');
      }

      const diffPixels = pixelmatch(
        baselinePng.data,
        actualPng.data,
        diffPng.data,
        width,
        height,
        { threshold: 0.1, diffColor: this.config.diffColor }
      );

      const totalPixels = width * height;
      const similarity = 1 - (diffPixels / totalPixels);

      const passed = similarity >= (1 - this.config.threshold);

      if (!passed || this.config.updateBaselines) {
        // Save diff image
        const diffBuffer = PNG.sync.write(diffPng);
        await fs.promises.writeFile(diffPath, diffBuffer);
      }

      if (this.config.updateBaselines && !passed) {
        // Update baseline
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
    } catch (error) {
      // Baseline doesn't exist
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
      } else {
        return {
          testName,
          passed: false,
          similarity: 0,
          diffPixels: 0,
          actualPath,
          error: 'Baseline image not found. Run with updateBaselines: true to create it.',
        };
      }
    }
  }

  async compareHTML(
    testName: string,
    actualHTML: string,
    baselineName?: string
  ): Promise<VisualTestResult> {
    // Simple HTML comparison - in a real implementation, this would use
    // a headless browser to render and screenshot the HTML
    const baselinePath = path.join(
      this.config.baselineDir,
      baselineName || `${testName}.html`
    );

    try {
      const baselineHTML = await fs.promises.readFile(baselinePath, 'utf8');
      const similarity = this.calculateTextSimilarity(baselineHTML, actualHTML);

      const passed = similarity >= (1 - this.config.threshold);

      return {
        testName,
        passed,
        similarity,
        diffPixels: 0, // Not applicable for text
        baselinePath,
        actualPath: '', // Not applicable
      };
    } catch (error) {
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

    if (longer.length === 0) return 1;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0]![j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i]![j] = matrix[i - 1]![j - 1]!;
        } else {
          matrix[i]![j] = Math.min(
            matrix[i - 1]![j - 1]! + 1,
            matrix[i]![j - 1]! + 1,
            matrix[i - 1]![j]! + 1
          );
        }
      }
    }

    return matrix[str2.length]![str1.length]!;
  }
}

export class VisualTestReporter {
  private results: VisualTestResult[] = [];

  addResult(result: VisualTestResult): void {
    this.results.push(result);
  }

  getSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
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
        .filter(r => !r.passed)
        .forEach(result => {
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