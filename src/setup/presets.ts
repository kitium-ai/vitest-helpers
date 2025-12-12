/**
 * Vitest configuration presets
 * Pre-configured setups for common scenarios
 *
 * NOTE: This module re-exports from the centralized preset registry for backward compatibility.
 * For new code, prefer importing directly from '../config/preset-registry.js'
 */

import type { UserConfig } from 'vitest/config';

import { createCustomPreset as createPreset, PresetConfigs } from '../config/preset-registry.js';

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
 * Angular preset - for Angular applications
 */
export const angularPreset = PresetConfigs.angular;

/**
 * Svelte preset - for Svelte applications
 */
export const sveltePreset = PresetConfigs.svelte;

/**
 * SolidJS preset - for SolidJS applications
 */
export const solidPreset = PresetConfigs.solid;

/**
 * Next.js preset - for Next.js applications
 */
export const nextjsPreset = PresetConfigs.nextjs;

/**
 * Nuxt.js preset - for Nuxt.js applications
 */
export const nuxtPreset = PresetConfigs.nuxt;

/**
 * Astro preset - for Astro applications
 */
export const astroPreset = PresetConfigs.astro;

/**
 * All available presets
 */
export const VitestPresets = {
  development: developmentPreset,
  ci: ciPreset,
  library: libraryPreset,
  react: reactPreset,
  vue: vuePreset,
  angular: angularPreset,
  svelte: sveltePreset,
  solid: solidPreset,
  nextjs: nextjsPreset,
  nuxt: nuxtPreset,
  astro: astroPreset,
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
