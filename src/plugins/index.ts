/**
 * Plugin system for @kitiumai/vitest-helpers
 * Extensible architecture for custom test utilities and integrations
 */

export interface VitestPlugin {
  name: string;
  version: string;
  description?: string;

  // Lifecycle hooks
  setup?: (config: any) => Promise<void> | void;
  teardown?: () => Promise<void> | void;

  // Test hooks
  beforeAll?: (suite: any) => Promise<void> | void;
  afterAll?: (suite: any) => Promise<void> | void;
  beforeEach?: (test: any) => Promise<void> | void;
  afterEach?: (test: any) => Promise<void> | void;

  // Custom utilities
  utilities?: Record<string, any>;

  // Configuration schema
  configSchema?: any;
}

export interface PluginManager {
  register(plugin: VitestPlugin): void;
  unregister(name: string): void;
  get(name: string): VitestPlugin | undefined;
  list(): VitestPlugin[];
  load(config: any): Promise<void>;
  unload(): Promise<void>;
}

class DefaultPluginManager implements PluginManager {
  private plugins = new Map<string, VitestPlugin>();

  register(plugin: VitestPlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already registered`);
    }
    this.plugins.set(plugin.name, plugin);
  }

  unregister(name: string): void {
    this.plugins.delete(name);
  }

  get(name: string): VitestPlugin | undefined {
    return this.plugins.get(name);
  }

  list(): VitestPlugin[] {
    return Array.from(this.plugins.values());
  }

  async load(config: any): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.setup) {
        await plugin.setup(config);
      }
    }
  }

  async unload(): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.teardown) {
        await plugin.teardown();
      }
    }
  }
}

export const pluginManager = new DefaultPluginManager();

// Built-in plugins
export * from './builtin/index';