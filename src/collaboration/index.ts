/**
 * Team collaboration utilities for shared test configurations and reports
 */

export interface SharedConfig {
  id: string;
  name: string;
  description?: string;
  config: Record<string, any>;
  author: string;
  team: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestReport {
  id: string;
  suite: string;
  results: any[];
  metrics: any;
  author: string;
  team: string;
  timestamp: Date;
  environment: Record<string, string>;
}

export class CollaborationManager {
  private configs = new Map<string, SharedConfig>();
  private reports = new Map<string, TestReport>();

  // Shared configurations
  saveConfig(config: Omit<SharedConfig, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = this.generateId();
    const fullConfig: SharedConfig = {
      ...config,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.configs.set(id, fullConfig);
    return id;
  }

  getConfig(id: string): SharedConfig | undefined {
    return this.configs.get(id);
  }

  listConfigs(team?: string): SharedConfig[] {
    const all = Array.from(this.configs.values());
    return team ? all.filter(c => c.team === team) : all;
  }

  updateConfig(id: string, updates: Partial<SharedConfig>): boolean {
    const config = this.configs.get(id);
    if (!config) return false;

    Object.assign(config, updates, { updatedAt: new Date() });
    return true;
  }

  deleteConfig(id: string): boolean {
    return this.configs.delete(id);
  }

  // Test reports
  saveReport(report: Omit<TestReport, 'id' | 'timestamp'>): string {
    const id = this.generateId();
    const fullReport: TestReport = {
      ...report,
      id,
      timestamp: new Date(),
    };
    this.reports.set(id, fullReport);
    return id;
  }

  getReport(id: string): TestReport | undefined {
    return this.reports.get(id);
  }

  listReports(team?: string): TestReport[] {
    const all = Array.from(this.reports.values());
    return team ? all.filter(r => r.team === team) : all;
  }

  // Team management
  getTeamStats(team: string) {
    const teamConfigs = this.listConfigs(team);
    const teamReports = this.listReports(team);

    return {
      configs: teamConfigs.length,
      reports: teamReports.length,
      members: new Set([
        ...teamConfigs.map(c => c.author),
        ...teamReports.map(r => r.author),
      ]).size,
    };
  }

  // Export/Import functionality
  exportData(team?: string): string {
    const data = {
      configs: team ? this.listConfigs(team) : Array.from(this.configs.values()),
      reports: team ? this.listReports(team) : Array.from(this.reports.values()),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.configs) {
        data.configs.forEach((config: SharedConfig) => {
          this.configs.set(config.id, {
            ...config,
            createdAt: new Date(config.createdAt),
            updatedAt: new Date(config.updatedAt),
          });
        });
      }
      if (data.reports) {
        data.reports.forEach((report: TestReport) => {
          this.reports.set(report.id, {
            ...report,
            timestamp: new Date(report.timestamp),
          });
        });
      }
    } catch (error) {
      throw new Error('Invalid import data format');
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const collaborationManager = new CollaborationManager();