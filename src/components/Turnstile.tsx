import { useEffect, useRef } from 'react';
import {
  ERROR_RESET_BACKOFF_MS,
  SCRIPT_WATCHDOG_MS,
  resetDecisionFor,
  type TurnstileStatus,
} from './turnstilePolicy';

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: (code?: string) => void;
        'before-interactive-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        appearance?: 'always' | 'execute' | 'interaction-only';
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileProps {
  onToken: (token: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  /**
   * `interaction-only` keeps the widget invisible unless Cloudflare actually
   * needs a challenge, which is what lets the lead-capture dialog hold to one
   * visible field (lead-gen plan §4.2, Decision D5.4). Omitted means
   * Cloudflare's default, so the contact form is unchanged.
   */
  appearance?: 'always' | 'execute' | 'interaction-only';
  /**
   * Fires when Turnstile is about to show a challenge. Under
   * `interaction-only` this is the moment the widget stops being invisible,
   * so the caller can reveal the line that explains it.
   */
  onInteractive?: () => void;
  /**
   * Lifecycle status, for callers that need to know whether a token can still
   * arrive (Issue #54). Optional: the contact and investor forms ignore it.
   */
  onStatusChange?: (status: TurnstileStatus) => void;
  /** Wrapper classes. Defaults to the contact form's spacing. */
  className?: string;
}

/**
 * The Cloudflare Turnstile widget.
 *
 * RECOVERY (Issue #54, Decision D5.4, lead-gen plan §13.3). Expiry and error
 * used to share one handler that cleared the caller's token and did nothing
 * else, so a widget whose token expired or errored was dead for the rest of
 * its life and every later submit went out unverified. Both now recover
 * through `turnstilePolicy`: expiry always resets, an error resets only when
 * Cloudflare's own documentation calls the code retryable, and error resets
 * are capped so a configuration fault cannot spin. `reset()` preserves the
 * options the widget was rendered with, so `interaction-only`, the theme and
 * the sitekey all survive a reset untouched.
 *
 * CALLBACKS ARE HELD IN REFS so the render effect depends only on the values
 * that genuinely require a new widget. A parent re-render can no longer tear
 * down and recreate the widget mid-challenge.
 */
export default function Turnstile({
  onToken,
  onExpire,
  theme,
  appearance,
  onInteractive,
  onStatusChange,
  className = 'mt-2',
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const errorResetsRef = useRef(0);

  // Latest callbacks, so the widget effect does not depend on their identity.
  // Updated in an effect rather than during render, so a render React discards
  // cannot leave a stale or abandoned callback behind.
  const handlers = useRef({ onToken, onExpire, onInteractive, onStatusChange });
  useEffect(() => {
    handlers.current = { onToken, onExpire, onInteractive, onStatusChange };
  });

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey || !containerRef.current) return;

    let disposed = false;
    let pollId: ReturnType<typeof setInterval> | null = null;
    let watchdogId: ReturnType<typeof setTimeout> | null = null;
    let backoffId: ReturnType<typeof setTimeout> | null = null;

    const status = (next: TurnstileStatus) => {
      if (!disposed) handlers.current.onStatusChange?.(next);
    };

    const stopPolling = () => {
      if (pollId !== null) { clearInterval(pollId); pollId = null; }
      if (watchdogId !== null) { clearTimeout(watchdogId); watchdogId = null; }
    };

    const recover = (kind: 'expired' | 'error', code?: string) => {
      handlers.current.onExpire?.();

      const decision = resetDecisionFor({ kind, code, errorResets: errorResetsRef.current });
      if (decision === 'stop') {
        status(kind === 'expired' ? 'pending' : 'error');
        return;
      }

      if (kind === 'error') errorResetsRef.current += 1;

      const run = () => {
        if (disposed || widgetIdRef.current === null || !window.turnstile) return;
        window.turnstile.reset(widgetIdRef.current);
        status('pending');
      };

      // Expiry can reset at once; an error backs off so a fast-failing widget
      // cannot burn its attempts in the same tick.
      if (kind === 'expired') {
        run();
      } else {
        backoffId = setTimeout(run, ERROR_RESET_BACKOFF_MS);
      }
    };

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || disposed) return;
      if (widgetIdRef.current !== null) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          status('ready');
          handlers.current.onToken(token);
        },
        'expired-callback': () => recover('expired'),
        'error-callback': (code?: string) => recover('error', code),
        ...(onInteractive
          ? {
              'before-interactive-callback': () => {
                status('interactive');
                handlers.current.onInteractive?.();
              },
            }
          : {}),
        ...(theme ? { theme } : {}),
        ...(appearance ? { appearance } : {}),
      });
    };

    // Turnstile script may not be loaded yet.
    if (window.turnstile) {
      renderWidget();
    } else {
      pollId = setInterval(() => {
        if (window.turnstile) {
          stopPolling();
          renderWidget();
        }
      }, 100);

      // The poll used to run forever, so a blocked or stalled script produced a
      // normal-looking form that could never yield a token, with no signal of
      // any kind. It now gives up and says so.
      watchdogId = setTimeout(() => {
        stopPolling();
        status('unavailable');
      }, SCRIPT_WATCHDOG_MS);
    }

    /**
     * ONE cleanup path for every case.
     *
     * The previous version returned early from the not-yet-loaded branch with a
     * cleanup that only cleared the interval, so a widget created after the
     * script arrived was never removed and leaked its registration inside
     * Cloudflare's runtime. Clearing timers and removing the widget are now the
     * same function, and it runs whichever branch was taken.
     */
    return () => {
      disposed = true;
      stopPolling();
      if (backoffId !== null) { clearTimeout(backoffId); backoffId = null; }
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
      errorResetsRef.current = 0;
    };
    // Only values that require a genuinely different widget belong here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, appearance, Boolean(onInteractive)]);

  return <div ref={containerRef} className={className} />;
}
