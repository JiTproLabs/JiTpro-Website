import { describe, expect, it } from 'vitest';

/**
 * Proves the test runner is wired into `npm test` and CI. Kept deliberately
 * trivial: if this fails, the problem is the tooling, not the code under test.
 */
describe('test runner', () => {
  it('runs under vitest in the node environment', () => {
    expect(typeof process.version).toBe('string');
    expect(1 + 1).toBe(2);
  });
});
