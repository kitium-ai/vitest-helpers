/**
 * Monitoring utilities for test performance and metrics
 */

export interface MonitoringTestMetrics {
  suite: string;
  test: string;
  duration: number;
  status: 'passed' | 'failed' | 'skipped';
  memoryUsage: NodeJS.MemoryUsage;
  timestamp: number;
}

export interface MonitoringConfig {
  enabled: boolean;
  collectMetrics: boolean;
  reportToConsole: boolean;
  reportToFile?: string;
  webhookUrl?: string;
  retentionPeriod: number; // in milliseconds
}

export class TestMonitor {
  private metrics: MonitoringTestMetrics[] = [];
  private config: MonitoringConfig;

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = {
      enabled: true,
      collectMetrics: true,
      reportToConsole: true,
      retentionPeriod: 24 * 60 * 60 * 1000, // 24 hours
      ...config,
    };
  }

  recordTestStart(suite: string, test: string): () => void {
    const startTime = Date.now();
    // Removed unused startMemory

    return () => {
      const duration = Date.now() - startTime;
      const endMemory = process.memoryUsage();

      const metric: MonitoringTestMetrics = {
        suite,
        test,
        duration,
        status: 'passed', // Will be updated if test fails
        memoryUsage: endMemory,
        timestamp: Date.now(),
      };

      this.metrics.push(metric);
      this.reportMetric(metric);
    };
  }

  recordTestFailure(suite: string, test: string): void {
    const metric = this.metrics.find(m => m.suite === suite && m.test === test);
    if (metric) {
      metric.status = 'failed';
    }
  }

  recordTestSkip(suite: string, test: string): void {
    const metric = this.metrics.find(m => m.suite === suite && m.test === test);
    if (metric) {
      metric.status = 'skipped';
    }
  }

  getMetrics(): MonitoringTestMetrics[] {
    return [...this.metrics];
  }

  getAggregatedMetrics() {
    const totalTests = this.metrics.length;
    const passedTests = this.metrics.filter(m => m.status === 'passed').length;
    const failedTests = this.metrics.filter(m => m.status === 'failed').length;
    const skippedTests = this.metrics.filter(m => m.status === 'skipped').length;

    const avgDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0) / totalTests;
    const maxDuration = Math.max(...this.metrics.map(m => m.duration));
    const minDuration = Math.min(...this.metrics.map(m => m.duration));

    return {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        skipped: skippedTests,
        passRate: (passedTests / totalTests) * 100,
      },
      performance: {
        avgDuration,
        maxDuration,
        minDuration,
      },
    };
  }

  clearOldMetrics(): void {
    const cutoff = Date.now() - this.config.retentionPeriod;
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
  }

  private reportMetric(metric: MonitoringTestMetrics): void {
    if (!this.config.enabled) return;

    if (this.config.reportToConsole) {
      console.log(`[MONITOR] ${metric.suite} > ${metric.test}: ${metric.duration}ms (${metric.status})`);
    }

    if (this.config.reportToFile) {
      // In a real implementation, this would write to a file
      console.log(`[MONITOR] Would write to ${this.config.reportToFile}`);
    }

    if (this.config.webhookUrl) {
      // In a real implementation, this would send to webhook
      console.log(`[MONITOR] Would send to webhook ${this.config.webhookUrl}`);
    }
  }
}

export const globalMonitor = new TestMonitor();