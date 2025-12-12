/**
 * Interactive CLI utilities for @kitiumai/vitest-helpers
 */

import * as readline from 'readline';
import { CIHelper } from '../ci';
import { TestMonitor } from '../monitoring';
import { collaborationManager } from '../collaboration';

export interface CLIConfig {
  interactive: boolean;
  verbose: boolean;
  output: 'console' | 'file' | 'both';
  outputFile?: string;
}

export class VitestCLI {
  private rl: readline.Interface | null = null;
  private config: CLIConfig;

  constructor(config: Partial<CLIConfig> = {}) {
    this.config = {
      interactive: true,
      verbose: false,
      output: 'console',
      ...config,
    };
  }

  async start(): Promise<void> {
    if (!this.config.interactive) {
      await this.runNonInteractive();
      return;
    }

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.showWelcome();
    this.showMenu();

    this.rl.on('line', async (input) => {
      await this.handleCommand(input.trim());
      this.showMenu();
    });
  }

  private showWelcome(): void {
    this.output(`
🧪 Vitest Helpers CLI
=====================

Welcome to the interactive CLI for @kitiumai/vitest-helpers!
Use the commands below to manage your testing setup.
    `);
  }

  private showMenu(): void {
    this.output(`
Available commands:
  setup-ci     - Generate CI/CD configuration
  monitor      - Start test monitoring
  collaborate  - Team collaboration tools
  performance  - Performance optimization tools
  help         - Show this help
  exit         - Exit CLI

Choose a command:
    `);
  }

  private async handleCommand(command: string): Promise<void> {
    switch (command.toLowerCase()) {
      case 'setup-ci':
        await this.setupCI();
        break;
      case 'monitor':
        await this.startMonitoring();
        break;
      case 'collaborate':
        await this.collaborationMenu();
        break;
      case 'performance':
        await this.performanceMenu();
        break;
      case 'help':
        this.showMenu();
        break;
      case 'exit':
        this.output('Goodbye! 👋');
        this.rl?.close();
        process.exit(0);
        break;
      default:
        this.output(`Unknown command: ${command}`);
    }
  }

  private async setupCI(): Promise<void> {
    const platforms = ['github', 'gitlab', 'circleci', 'jenkins', 'azure'];
    const platform = await this.prompt('Choose CI platform', platforms.join(', '));

    if (!platforms.includes(platform)) {
      this.output('Invalid platform selected.');
      return;
    }

    const nodeVersion = await this.prompt('Node.js version', '18');
    const testCommand = await this.prompt('Test command', 'pnpm test');
    const coverage = await this.confirm('Include coverage reporting?');
    const parallel = await this.confirm('Enable parallel execution?');

    const config = CIHelper.generateConfig(platform as any, {
      nodeVersion,
      testCommand,
      coverage,
      parallel,
    });

    this.output(`\nGenerated ${platform} configuration:\n${config}`);

    const save = await this.confirm('Save to file?');
    if (save) {
      const filename = await this.prompt('Filename', `.${platform}ci.yml`);
      // In a real implementation, this would write to file
      this.output(`Would save to ${filename}`);
    }
  }

  private async startMonitoring(): Promise<void> {
    const monitor = new TestMonitor({
      enabled: true,
      collectMetrics: true,
      reportToConsole: true,
    });

    this.output('Test monitoring started. Run your tests to see metrics.');
    this.output('Press Ctrl+C to stop.');

    // In a real implementation, this would integrate with Vitest
    process.on('SIGINT', () => {
      const metrics = monitor.getMetrics();
      this.output(`\nMonitoring stopped. Collected ${metrics.length} test metrics.`);
      this.rl?.close();
    });
  }

  private async collaborationMenu(): Promise<void> {
    const action = await this.prompt(
      'Collaboration action',
      'list-configs, save-config, list-reports, team-stats'
    );

    switch (action) {
      case 'list-configs':
        const configs = collaborationManager.listConfigs();
        this.output(`Found ${configs.length} shared configurations:`);
        configs.forEach(config => {
          this.output(`- ${config.name} (${config.team})`);
        });
        break;
      case 'list-reports':
        const reports = collaborationManager.listReports();
        this.output(`Found ${reports.length} test reports:`);
        reports.forEach(report => {
          this.output(`- ${report.suite} (${report.team})`);
        });
        break;
      case 'team-stats':
        const team = await this.prompt('Team name');
        const stats = collaborationManager.getTeamStats(team);
        this.output(`Team "${team}" stats:`, JSON.stringify(stats, null, 2));
        break;
      default:
        this.output('Invalid action.');
    }
  }

  private async performanceMenu(): Promise<void> {
    this.output('Performance optimization tools:');
    this.output('1. Memory optimization');
    this.output('2. Cache management');
    this.output('3. Parallel execution');

    const choice = await this.prompt('Choose tool', '1-3');

    switch (choice) {
      case '1':
        // Import memory optimizer dynamically to avoid issues
        const { memoryOptimizer } = await import('../performance');
        const stats = memoryOptimizer.getMemoryStats();
        this.output('Memory stats:', JSON.stringify(stats, null, 2));
        break;
      case '2':
        const { cacheManager } = await import('../performance');
        await cacheManager.clear();
        this.output('Cache cleared.');
        break;
      case '3':
        this.output('Parallel execution configuration:');
        this.output('- Max workers: based on CPU cores');
        this.output('- Timeout: 30 seconds');
        this.output('- Retry failed tests: enabled');
        break;
      default:
        this.output('Invalid choice.');
    }
  }

  private async runNonInteractive(): Promise<void> {
    // Non-interactive mode - could be used for automation
    this.output('Running in non-interactive mode...');
    // Add automated tasks here
  }

  private async prompt(question: string, defaultValue?: string): Promise<string> {
    return new Promise((resolve) => {
      const prompt = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;
      this.rl?.question(prompt, (answer) => {
        resolve(answer || defaultValue || '');
      });
    });
  }

  private async confirm(question: string): Promise<boolean> {
    const answer = await this.prompt(question + ' (y/n)', 'n');
    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
  }

  private output(message: string, data?: any): void {
    if (this.config.output === 'console' || this.config.output === 'both') {
      console.log(message);
      if (data) console.log(data);
    }

    if (this.config.output === 'file' || this.config.output === 'both') {
      // In a real implementation, this would write to file
      if (this.config.outputFile) {
        console.log(`Would write to ${this.config.outputFile}`);
      }
    }
  }

  close(): void {
    this.rl?.close();
  }
}

export function createCLI(config?: Partial<CLIConfig>): VitestCLI {
  return new VitestCLI(config);
}