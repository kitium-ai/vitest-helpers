/**
 * Security utilities for audit logging, secret detection, and compliance reporting
 */

import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { createLogger } from '@kitiumai/logger';

const logger = createLogger('development', { serviceName: 'security' });

export type AuditLogEntry = {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  resource: string;
  details: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
};

export type SecretDetectionResult = {
  file: string;
  line: number;
  type: string;
  value: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
};

export type ComplianceReport = {
  timestamp: Date;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalTests: number;
    securityTests: number;
    vulnerabilitiesFound: number;
    complianceScore: number;
  };
  findings: SecretDetectionResult[];
  auditLogs: AuditLogEntry[];
  recommendations: string[];
};

export class AuditLogger {
  private readonly logs: AuditLogEntry[] = [];
  private readonly logFile: string | undefined;

  constructor(logFile?: string) {
    this.logFile = logFile;
  }

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    this.logs.push(fullEntry);

    if (this.logFile) {
      this.appendToFile(fullEntry);
    }

    // Console logging for development
    logger.info(`${entry.action} by ${entry.user} on ${entry.resource}`);
  }

  getLogs(filter?: {
    user?: string;
    action?: string;
    resource?: string;
    since?: Date;
  }): AuditLogEntry[] {
    let filtered = this.logs;

    if (filter?.user) {
      filtered = filtered.filter((log) => log.user === filter.user);
    }
    if (filter?.action) {
      filtered = filtered.filter((log) => log.action === filter.action);
    }
    if (filter?.resource) {
      filtered = filtered.filter((log) => log.resource.includes(filter.resource!));
    }
    if (filter?.since) {
      filtered = filtered.filter((log) => log.timestamp >= filter.since!);
    }

    return filtered;
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  private appendToFile(entry: AuditLogEntry): void {
    try {
      const logLine = JSON.stringify(entry) + '\n';
      fs.appendFileSync(this.logFile!, logLine);
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }
}

export class SecretDetector {
  private readonly patterns = [
    {
      name: 'AWS Access Key',
      pattern: /AKIA[0-9A-Z]{16}/g,
      severity: 'high' as const,
      recommendation: 'Rotate AWS access keys immediately',
    },
    {
      name: 'AWS Secret Key',
      pattern: /[A-Za-z0-9+/]{40}/g, // Simplified pattern
      severity: 'critical' as const,
      recommendation: 'Rotate AWS secret keys and revoke access',
    },
    {
      name: 'Generic API Key',
      pattern: /api[_-]?key[_-]?[=:]\s*['"]?([A-Za-z0-9_-]{20,})['"]?/gi,
      severity: 'medium' as const,
      recommendation: 'Review and rotate API keys',
    },
    {
      name: 'JWT Token',
      pattern: /eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g,
      severity: 'medium' as const,
      recommendation: 'Ensure JWT tokens are properly secured',
    },
    {
      name: 'Private Key',
      pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
      severity: 'critical' as const,
      recommendation: 'Remove private keys from codebase',
    },
  ];

  async scanFile(filePath: string): Promise<SecretDetectionResult[]> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      const results: SecretDetectionResult[] = [];

      lines.forEach((line, index) => {
        this.patterns.forEach((pattern) => {
          const matches = line.match(pattern.pattern);
          if (matches) {
            matches.forEach((match) => {
              results.push({
                file: filePath,
                line: index + 1,
                type: pattern.name,
                value: match,
                severity: pattern.severity,
                recommendation: pattern.recommendation,
              });
            });
          }
        });
      });

      return results;
    } catch (error) {
      console.error(`Failed to scan file ${filePath}:`, error);
      return [];
    }
  }

  async scanDirectory(dirPath: string, exclude: string[] = []): Promise<SecretDetectionResult[]> {
    const results: SecretDetectionResult[] = [];

    const scanDir = async (currentPath: string): Promise<void> => {
      const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (exclude.some((pattern) => fullPath.includes(pattern))) {
          continue;
        }

        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (entry.isFile()) {
          const fileResults = await this.scanFile(fullPath);
          results.push(...fileResults);
        }
      }
    };

    await scanDir.call(this, dirPath);
    return results;
  }
}

export class ComplianceReporter {
  private readonly auditLogger: AuditLogger;
  private readonly secretDetector: SecretDetector;

  constructor(auditLogger: AuditLogger, secretDetector: SecretDetector) {
    this.auditLogger = auditLogger;
    this.secretDetector = secretDetector;
  }

  private async scanForSecrets(scanPaths: string[]): Promise<SecretDetectionResult[]> {
    const findings: SecretDetectionResult[] = [];
    const excludeDirs = ['node_modules', '.git', 'dist', 'build'];

    for (const scanPath of scanPaths) {
      const results = await this.secretDetector.scanDirectory(scanPath, excludeDirs);
      findings.push(...results);
    }

    return findings;
  }

  private countSecurityTests(testResults: Array<{ name?: string }>): number {
    return testResults.filter((test) => {
      const testName = typeof test.name === 'string' ? test.name.toLowerCase() : '';
      return (
        testName.includes('security') || testName.includes('auth') || testName.includes('secret')
      );
    }).length;
  }

  private calculateComplianceScore(
    findings: SecretDetectionResult[],
    totalTests: number,
    securityTests: number
  ): number {
    let score = 100;
    score -= findings.length * 5;
    score -= (totalTests - securityTests) * 2;
    return Math.max(0, score);
  }

  private generateRecommendations(
    findings: SecretDetectionResult[],
    securityTests: number,
    auditLogs: AuditLogEntry[]
  ): string[] {
    const recommendations: string[] = [];

    if (findings.length > 0) {
      recommendations.push('Address all detected secrets and rotate compromised credentials');
    }
    if (securityTests === 0) {
      recommendations.push('Add security-focused tests to your test suite');
    }
    if (auditLogs.length === 0) {
      recommendations.push('Enable audit logging for better compliance tracking');
    }

    return recommendations;
  }

  async generateReport(
    testResults: Array<{ name?: string }>,
    scanPaths: string[] = ['.'],
    period?: { start: Date; end: Date }
  ): Promise<ComplianceReport> {
    const now = new Date();
    const defaultPeriod = {
      start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      end: now,
    };

    const reportPeriod = period || defaultPeriod;
    const findings = await this.scanForSecrets(scanPaths);
    const auditLogs = this.auditLogger.getLogs({ since: reportPeriod.start });
    const securityTests = this.countSecurityTests(testResults);
    const vulnerabilitiesFound = findings.filter(
      (f) => f.severity === 'high' || f.severity === 'critical'
    ).length;
    const complianceScore = this.calculateComplianceScore(
      findings,
      testResults.length,
      securityTests
    );
    const recommendations = this.generateRecommendations(findings, securityTests, auditLogs);

    return {
      timestamp: now,
      period: reportPeriod,
      metrics: {
        totalTests: testResults.length,
        securityTests,
        vulnerabilitiesFound,
        complianceScore,
      },
      findings,
      auditLogs,
      recommendations,
    };
  }

  private formatReportHeader(report: ComplianceReport): string {
    let markdown = '# Security Compliance Report\n\n';
    markdown += `## Report Period\n`;
    markdown += `- From: ${report.period.start.toISOString()}\n`;
    markdown += `- To: ${report.period.end.toISOString()}\n`;
    markdown += `- Generated: ${report.timestamp.toISOString()}\n\n`;
    markdown += `## Compliance Score: ${report.metrics.complianceScore}/100\n\n`;
    return markdown;
  }

  private formatMetricsSection(report: ComplianceReport): string {
    let markdown = `## Metrics\n\n`;
    markdown += `- Total Tests: ${report.metrics.totalTests}\n`;
    markdown += `- Security Tests: ${report.metrics.securityTests}\n`;
    markdown += `- Vulnerabilities Found: ${report.metrics.vulnerabilitiesFound}\n\n`;
    return markdown;
  }

  private formatFindingsSection(findings: SecretDetectionResult[]): string {
    if (findings.length === 0) {
      return '';
    }

    let markdown = `## Security Findings\n\n`;
    findings.forEach((finding, index) => {
      markdown += `### ${index + 1}. ${finding.type} (${finding.severity})\n`;
      markdown += `- File: ${finding.file}:${finding.line}\n`;
      markdown += `- Value: \`${finding.value}\`\n`;
      markdown += `- Recommendation: ${finding.recommendation}\n\n`;
    });
    return markdown;
  }

  private formatAuditLogsSection(auditLogs: AuditLogEntry[]): string {
    if (auditLogs.length === 0) {
      return '';
    }

    let markdown = `## Audit Logs\n\n`;
    auditLogs.slice(0, 10).forEach((log) => {
      markdown += `- ${log.timestamp.toISOString()}: ${log.action} by ${log.user} on ${log.resource}\n`;
    });
    if (auditLogs.length > 10) {
      markdown += `- ... and ${auditLogs.length - 10} more entries\n`;
    }
    markdown += '\n';
    return markdown;
  }

  private formatRecommendationsSection(recommendations: string[]): string {
    if (recommendations.length === 0) {
      return '';
    }

    let markdown = `## Recommendations\n\n`;
    recommendations.forEach((rec) => {
      markdown += `- ${rec}\n`;
    });
    markdown += '\n';
    return markdown;
  }

  generateReportMarkdown(report: ComplianceReport): string {
    return (
      this.formatReportHeader(report) +
      this.formatMetricsSection(report) +
      this.formatFindingsSection(report.findings) +
      this.formatAuditLogsSection(report.auditLogs) +
      this.formatRecommendationsSection(report.recommendations)
    );
  }
}

export const auditLogger = new AuditLogger();
export const secretDetector = new SecretDetector();
export const complianceReporter = new ComplianceReporter(auditLogger, secretDetector);
