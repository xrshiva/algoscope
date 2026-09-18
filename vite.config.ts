import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/algoscope/',
  test: {
    include: ['src/**/*.test.ts'],
  },
});
