import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
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
  /** Wrapper classes. Defaults to the contact form's spacing. */
  className?: string;
}

export default function Turnstile({
  onToken,
  onExpire,
  theme,
  appearance,
  onInteractive,
  className = 'mt-2',
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey || !containerRef.current) return;

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) return;
      if (widgetIdRef.current !== null) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onToken,
        'expired-callback': () => {
          onExpire?.();
        },
        'error-callback': () => {
          onExpire?.();
        },
        ...(onInteractive ? { 'before-interactive-callback': onInteractive } : {}),
        ...(theme ? { theme } : {}),
        ...(appearance ? { appearance } : {}),
      });
    };

    // Turnstile script may not be loaded yet
    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onToken, onExpire, theme, appearance, onInteractive]);

  return <div ref={containerRef} className={className} />;
}
