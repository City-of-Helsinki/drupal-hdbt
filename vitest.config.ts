import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Keep these in sync with the "paths" in tsconfig.json.
    alias: {
      '@/react/common': resolve(__dirname, 'src/js/react/common'),
      '@/types': resolve(__dirname, 'src/js/types'),
    },
  },
  test: {
    server: {
      deps: {
        inline: ['@testing-library/react'],
      },
    },
    coverage: {
      include: ['src/js/react/**/*.{js,jsx,ts,tsx}'],
      exclude: ['src/js/react/**/types/**', 'src/js/react/**/*.d.ts', 'src/js/react/**/index.tsx'],
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: true,
    setupFiles: ['src/js/tests/setupTests.ts'],
  },
});
