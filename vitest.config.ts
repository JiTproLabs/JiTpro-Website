import { defineConfig } from 'vitest/config';

/**
 * Unit-test runner for the marketing site (Design System-neutral; no UI).
 *
 * Deliberately separate from vite.config.ts: these tests exercise pure logic
 * (validation, attribution parsing, registries, template rendering, decision
 * functions) and need no React plugin and no browser simulation. jsdom is not
 * installed and is not to be added unless a component test genuinely needs it
 * (lead-gen plan, Decision D5.8).
 *
 * `supabase/functions/_shared` is included so the modules the edge functions
 * share with the site are tested by the same runner. Those modules must stay
 * free of Deno-specific APIs for exactly this reason.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'supabase/functions/_shared/**/*.test.ts'],
  },
});
