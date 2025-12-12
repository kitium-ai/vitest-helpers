/**
 * Vitest configuration presets
 * Pre-configured setups for common scenarios
 *
 * NOTE: This module re-exports from the centralized preset registry for backward compatibility.
 * For new code, prefer importing directly from '../config/preset-registry.js'
 */

import type { UserConfig } from 'vitest/config';
import { PresetConfigs, createCustomPreset as createPreset } from '../config/preset-registry.js';

/**
 * Development preset - fast feedback
 */
export const developmentPreset = PresetConfigs.development;

/**
 * CI preset - comprehensive testing
 */
export const ciPreset = PresetConfigs.ci;

/**
 * Library preset - for testing library packages
 */
export const libraryPreset = PresetConfigs.library;

/**
 * React preset - for React applications
 */
export const reactPreset = PresetConfigs.react;

/**
 * Vue preset - for Vue applications
 */
export const vuePreset = PresetConfigs.vue;

/**
 * All available presets
 */
export const VitestPresets = {
  development: developmentPreset,
  ci: ciPreset,
  library: libraryPreset,
  react: reactPreset,
  vue: vuePreset,
} as const;

/**
 * Create a custom preset by merging with a base
 */
export function createCustomPreset(
  base: keyof typeof VitestPresets,
  overrides: UserConfig
): UserConfig {
  return createPreset(base, overrides);
}
