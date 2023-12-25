import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        exclude: [
          '**/*.d.ts',
          '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
          'src/router/**',
          'src/axios/**',
          'src/types/**',
          'src/main.ts',
        ],
        provider: 'v8',
        reporter: ['text', 'json-summary', 'json', 'html'],
        reportOnFailure: true,
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  }),
);
