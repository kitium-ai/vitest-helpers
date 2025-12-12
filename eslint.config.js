/* eslint-disable import/no-default-export */
import { library } from '@kitiumai/lint';

export const config = [
  ...library.flat(),
  {
    name: 'vitest-helpers/global-overrides',
    files: ['src/**/*.{ts,tsx,js,jsx}', 'types.d.ts'],
    rules: {
      // Relax rules to match legacy patterns and generated typings
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',
      'unicorn/prevent-abbreviations': 'off',
      // Disable import/order to avoid conflicts with simple-import-sort/imports
      'import/order': 'off',
    },
  },
  {
    name: 'vitest-helpers/eslint9-rule-compat',
    rules: {
      // ESLint 9 schema compatibility for lint preset
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['../../*', '../../../*'],
              message: 'Prefer module aliases over deep relative imports for maintainability.',
            },
          ],
        },
      ],
    },
  },
  {
    name: 'vitest-helpers/eslint-config-overrides',
    files: ['eslint.config.js'],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
    },
  },
];

export default config;
