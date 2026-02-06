import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
    clearMocks: true,
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
});
