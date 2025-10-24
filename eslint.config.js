// eslint.config.js
//
// Angular 20+ Best Practices (not yet enforceable by ESLint):
// - Use signals for all local state (avoid RxJS for local state)
// - Use new control flow syntax (@if, @for, @switch) instead of *ngIf, *ngFor, *ngSwitch
// - Use the 'host' property in @Component/@Directive for host bindings/listeners (do NOT use @HostBinding/@HostListener)
// - Use input() and output() functions for component inputs/outputs (not decorators)
// - Prefer standalone components (do NOT use NgModules)
// - Use ChangeDetectionStrategy.OnPush
// - Use NgOptimizedImage for static images
//
// These are not yet enforceable by ESLint, but are required by the Angular style guide and project conventions.
// Please review code for these patterns during code review.

const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    plugins: {
      '@stylistic': stylistic,
      prettier: require('eslint-plugin-prettier'),
    },
    processor: angular.processInlineTemplates,
    rules: {
      // === Angular rules (aligned with Angular 20 style guide) ===
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-standalone': 'warn',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/use-component-view-encapsulation': 'error',
      '@angular-eslint/use-injectable-provided-in': 'error',
      '@angular-eslint/no-forward-ref': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-queries-metadata-property': 'error',
      '@angular-eslint/no-pipe-impure': 'error',
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', style: 'kebab-case', prefix: ['app'] }, // 👈 Angular style guide: prefix required
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', style: 'camelCase', prefix: ['app'] },
      ],

      // === TypeScript rules ===
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-shadow': ['error', { hoist: 'all' }],
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/unified-signatures': 'error',

      // === Stylistic rules ===
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      '@stylistic/type-annotation-spacing': 'error',

      // === ESLint core rules ===
      curly: 'error',
      'dot-notation': 'off',
      'eol-last': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'object-shorthand': 'error',
      'quote-props': ['error', 'as-needed'],

      // === Prettier integration ===
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      // Add template-specific rules if needed
    },
  },
);
