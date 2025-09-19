/// <reference types="vitest" />

import angular from '@analogjs/vite-plugin-angular';

import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [angular(), viteTsconfigPaths()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['src/**/*.spec.ts'],
      exclude: ['tests/**', 'tests-examples/**'],
      reporters: ['default'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
