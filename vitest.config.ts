import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
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
