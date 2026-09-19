/**
 * The Turnstile token gate (Issue #54).
 *
 * WHY THIS EXISTS. The form's submit control is deliberately never disabled
 * while the browser check is pending (§13.3: a check that fails, expires, or
 * never loads must still leave the visitor able to submit and receive the
 * guide). That is correct, but on 2026-09-18 a legitimate visitor submitted
 * 3.8 seconds after the form appeared, before Cloudflare had produced a token,
 * and the request went out with `turnstile_token: null`. The server rejected it
 * exactly as designed, so the lead was lost while the visitor still received
 * the guide through the fail-open outcome.
 *
 * The gate closes that window without closing the form. It holds the token in
 * a plain variable rather than in React state, and lets a caller wait a bounded
 * time for one to arrive.
 *
 * WHY NOT REACT STATE. `handleSubmit` is recreated each render and closes over
 * that render's `turnstileToken`. A token arriving after the click but before
 * the request is built is invisible to that closure, and so is one arriving
 * during the wait itself. The gate is written synchronously by Turnstile's
 * callback and read synchronously at submit, so neither window exists.
 *
 * Pure: no DOM, no React, no browser-only APIs. Every rule below is proven by
 * `tokenGate.test.ts` with fake timers rather than by clicking.
 */

/**
 * How long a submit will wait for a token that has not arrived yet.
 *
 * Five seconds, chosen for lead-capture reliability rather than for shaving
 * time off an already-abnormal state (Jeff, 2026-09-19). The ceiling is only
 * ever reached while Turnstile is *genuinely still pending*: a token already in
 * hand costs nothing, a token arriving mid-wait proceeds at once, and the
 * interactive, unavailable and error states skip the wait entirely because a
 * token cannot arrive in them.
 *
 * Controlled testing on 2026-09-18 measured Cloudflare spending ~3,672 ms
 * merely deciding to escalate to an interactive challenge. That is NOT a
 * production passive-token benchmark, but it is enough to show a three-second
 * ceiling would be unnecessarily tight for a reliability correction.
 *
 * The visitor is not left guessing: the wait runs inside the existing
 * `submitting` phase, where the button already reads "Getting your guide…"
 * (§32.1), and it stays well below that section's 15-second "Still working…"
 * line and the client's 30-second hard timeout.
 *
 * Deliberately a single named constant so it can be tuned from real data.
 */
export const TOKEN_WAIT_MS = 5000;

export type TokenGate = {
  /** Record a token. An empty string is treated as no token. */
  set(token: string): void;
  /** Forget the current token. Pending waiters keep waiting for a new one. */
  clear(): void;
  /** The current token, or null. Synchronous. */
  get(): string | null;
  /**
   * The current token if there is one, otherwise the first token to arrive
   * within `timeoutMs`, otherwise null. Never rejects.
   */
  wait(timeoutMs: number): Promise<string | null>;
};

export function createTokenGate(): TokenGate {
  let token: string | null = null;
  const waiters = new Set<(value: string | null) => void>();

  return {
    set(next: string) {
      token = next === '' ? null : next;
      if (token === null) return;

      // Copy first: a waiter may run synchronously and touch the set.
      const pending = [...waiters];
      waiters.clear();
      for (const waiter of pending) waiter(token);
    },

    clear() {
      // Deliberately does NOT settle pending waiters. An expiry mid-wait is
      // followed by a widget reset, so the right behaviour is to keep waiting
      // for the replacement token until the timeout, not to give up early.
      token = null;
    },

    get() {
      return token;
    },

    wait(timeoutMs: number) {
      if (token !== null) return Promise.resolve(token);
      if (timeoutMs <= 0) return Promise.resolve(null);

      return new Promise<string | null>((resolve) => {
        let settled = false;
        const finish = (value: string | null) => {
          if (settled) return;
          settled = true;
          waiters.delete(waiter);
          clearTimeout(timer);
          resolve(value);
        };
        const waiter = (value: string | null) => finish(value);
        const timer = setTimeout(() => finish(null), timeoutMs);
        waiters.add(waiter);
      });
    },
  };
}
