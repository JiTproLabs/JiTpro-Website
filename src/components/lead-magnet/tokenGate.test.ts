import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKEN_WAIT_MS, createTokenGate } from './tokenGate';

/**
 * The gate is the whole of Issue #54's bounded wait, so every rule it carries
 * is pinned here rather than proven by clicking. Fake timers make the timeout
 * exact: a test that "waits five seconds" would be both slow and unfalsifiable.
 */

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('TOKEN_WAIT_MS', () => {
  it('is the approved five seconds (Issue #54, raised from 3000 on 2026-09-19)', () => {
    expect(TOKEN_WAIT_MS).toBe(5000);
  });
});

describe('the token gate', () => {
  it('starts with no token', () => {
    expect(createTokenGate().get()).toBeNull();
  });

  it('returns a token that already exists without waiting', async () => {
    const gate = createTokenGate();
    gate.set('tok-1');

    const settled = vi.fn();
    void gate.wait(TOKEN_WAIT_MS).then(settled);

    // No timer advance at all: the healthy path must not yield.
    await Promise.resolve();
    await Promise.resolve();
    expect(settled).toHaveBeenCalledWith('tok-1');
  });

  it('resolves the moment a token arrives during the wait, not at the timeout', async () => {
    const gate = createTokenGate();
    const settled = vi.fn();
    void gate.wait(TOKEN_WAIT_MS).then(settled);

    await vi.advanceTimersByTimeAsync(800);
    expect(settled).not.toHaveBeenCalled();

    gate.set('tok-late');
    await vi.advanceTimersByTimeAsync(0);
    expect(settled).toHaveBeenCalledWith('tok-late');

    // And it does not resolve a second time when the timeout would have fired.
    await vi.advanceTimersByTimeAsync(TOKEN_WAIT_MS);
    expect(settled).toHaveBeenCalledTimes(1);
  });

  it('resolves null at the timeout when no token ever arrives', async () => {
    const gate = createTokenGate();
    const settled = vi.fn();
    void gate.wait(TOKEN_WAIT_MS).then(settled);

    await vi.advanceTimersByTimeAsync(TOKEN_WAIT_MS - 1);
    expect(settled).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(settled).toHaveBeenCalledWith(null);
  });

  it('resolves null immediately for a non-positive timeout', async () => {
    const gate = createTokenGate();
    await expect(gate.wait(0)).resolves.toBeNull();
    await expect(gate.wait(-1)).resolves.toBeNull();
  });

  it('clears the token', () => {
    const gate = createTokenGate();
    gate.set('tok-1');
    expect(gate.get()).toBe('tok-1');
    gate.clear();
    expect(gate.get()).toBeNull();
  });

  it('treats an empty token as no token', () => {
    const gate = createTokenGate();
    gate.set('');
    expect(gate.get()).toBeNull();
  });

  /**
   * An expiry mid-wait is followed by a widget reset, so giving up early would
   * throw away the replacement token the reset is about to produce.
   */
  it('keeps waiting when the token is cleared during a wait', async () => {
    const gate = createTokenGate();
    gate.set('tok-old');
    gate.clear();

    const settled = vi.fn();
    void gate.wait(TOKEN_WAIT_MS).then(settled);

    await vi.advanceTimersByTimeAsync(500);
    expect(settled).not.toHaveBeenCalled();

    gate.set('tok-new');
    await vi.advanceTimersByTimeAsync(0);
    expect(settled).toHaveBeenCalledWith('tok-new');
  });

  it('settles every concurrent waiter with the same token', async () => {
    const gate = createTokenGate();
    const first = vi.fn();
    const second = vi.fn();
    void gate.wait(TOKEN_WAIT_MS).then(first);
    void gate.wait(TOKEN_WAIT_MS).then(second);

    gate.set('tok-shared');
    await vi.advanceTimersByTimeAsync(0);

    expect(first).toHaveBeenCalledWith('tok-shared');
    expect(second).toHaveBeenCalledWith('tok-shared');
  });

  it('serves a later wait from the token the earlier one received', async () => {
    const gate = createTokenGate();
    void gate.wait(TOKEN_WAIT_MS);
    gate.set('tok-1');
    await vi.advanceTimersByTimeAsync(0);

    await expect(gate.wait(TOKEN_WAIT_MS)).resolves.toBe('tok-1');
  });
});
