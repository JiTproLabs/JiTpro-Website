import { useCallback, useEffect, useId, useReducer, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Turnstile from '../Turnstile';
import { CURRENT_CONSENT_TEXT_VERSION, CONSENT_TEXTS } from '../../content/consentTexts';
import { FIELD_GUIDE, FIELD_GUIDE_COPY, FIELD_GUIDE_ID, type LeadMagnetPlacement } from '../../content/leadMagnets';
import { resolveAttribution, type ArrivalContext } from './attribution';
import { sendFunnelEvent } from './funnel';
import { INITIAL_STATE, leadCaptureReducer, validateEmail } from './leadCaptureMachine';
import { localGuideUrl, submitLeadMagnetRequest } from './submitLeadMagnetRequest';

/**
 * The lead-capture form: one email field, one optional consent checkbox, an
 * invisible browser check, and the three outcome states of plan §13.2.
 *
 * ONE COMPONENT, TWO HOMES. The dialog and the `/field-guide` landing page
 * render this same form; only `placement` differs. A second implementation
 * would be a second set of states to keep honest.
 *
 * DESIGN SYSTEM. Field, checkbox and fine print follow §24.1; the submitting
 * state follows §32.1 (label change, no spinner, width held, `aria-busy`,
 * "Still working…" after 15 seconds); errors and outcomes follow §33.1 (no
 * semantic error colour exists, so meaning is carried by icon, text and
 * placement). All copy comes from `FIELD_GUIDE_COPY`; nothing here paraphrases
 * it.
 *
 * CONSENT (D3.4, D3.10). Requesting the guide is not marketing consent. The
 * checkbox is separate, optional, unchecked by default, and the version id of
 * the exact sentence shown is sent with the request so the record can be read
 * back against the words the visitor actually saw.
 *
 * FAIL OPEN (D5.6). Every terminal state except an invalid address offers the
 * guide. The reducer decides which; this component only renders it.
 */

/** §32.1: the muted line that appears if the request is slow. */
const STILL_WORKING_AFTER_MS = 15_000;

const FIELD_CLASSES =
  'w-full rounded-lg border bg-jp-surface px-4 py-3 text-lg text-jp-text-primary focus:border-jp-brand-amber focus:outline-hidden focus:ring-2 focus:ring-jp-brand-amber-active/30 disabled:cursor-not-allowed disabled:text-jp-text-muted';

const PRIMARY_BUTTON_CLASSES =
  'w-full rounded-lg bg-jp-brand-amber px-8 py-4 text-lg font-semibold text-jp-background transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none disabled:cursor-not-allowed disabled:bg-jp-surface disabled:text-jp-text-muted';

export type LeadCaptureFormProps = {
  placement: LeadMagnetPlacement;
  /** The path the request came from, which is not always the landing path. */
  pagePath: string;
  /**
   * Called when the form reaches an outcome, so the dialog can move focus to
   * the outcome heading (§28.1). The landing page does not need it.
   */
  onOutcome?: () => void;
  /** Rendered above the email field. The dialog supplies its own heading. */
  heading?: React.ReactNode;
};

function arrivalFromWindow(): ArrivalContext {
  if (typeof window === 'undefined') return { search: '', pathname: '/', referrer: '' };
  return {
    search: window.location.search,
    pathname: window.location.pathname,
    referrer: typeof document === 'undefined' ? '' : document.referrer,
  };
}

function sessionStore(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

export default function LeadCaptureForm({ placement, pagePath, onOutcome, heading }: LeadCaptureFormProps) {
  const [state, dispatch] = useReducer(leadCaptureReducer, INITIAL_STATE);
  const [email, setEmail] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileVisible, setTurnstileVisible] = useState(false);
  const [stillWorking, setStillWorking] = useState(false);

  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const consentId = `${fieldId}-consent`;
  const outcomeHeadingRef = useRef<HTMLHeadingElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);

  const copy = FIELD_GUIDE_COPY;
  const isSubmitting = state.phase === 'submitting';
  const isOutcome = state.phase === 'outcome';

  /* `form_view` fires once when the form is mounted, wherever it lives. */
  useEffect(() => {
    sendFunnelEvent({ event: 'form_view', assetId: FIELD_GUIDE_ID, placement, pagePath });
  }, [placement, pagePath]);

  /* §32.1: the muted line, and nothing else, after fifteen seconds. */
  useEffect(() => {
    if (!isSubmitting) {
      setStillWorking(false);
      return;
    }
    const timer = setTimeout(() => setStillWorking(true), STILL_WORKING_AFTER_MS);
    return () => clearTimeout(timer);
  }, [isSubmitting]);

  /* §33.1: focus moves to the first invalid field on a failed submit. */
  useEffect(() => {
    if (state.phase === 'idle' && state.fieldError) fieldRef.current?.focus();
  }, [state.phase, state.fieldError]);

  /* §28.1: when the state becomes an outcome, focus moves to its heading so
     the change is announced rather than silently replacing the form. */
  useEffect(() => {
    if (isOutcome) {
      outcomeHeadingRef.current?.focus();
      onOutcome?.();
    }
  }, [isOutcome, onOutcome]);

  const handleToken = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(null), []);
  const handleInteractive = useCallback(() => setTurnstileVisible(true), []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    dispatch({ type: 'submit', email });
    if (validateEmail(email)) return;

    const trimmed = email.trim();
    sendFunnelEvent({ event: 'form_submit', assetId: FIELD_GUIDE_ID, placement, pagePath });

    const fallbackGuideUrl = localGuideUrl(FIELD_GUIDE.publicPath);
    const result = await submitLeadMagnetRequest(
      {
        email: trimmed,
        assetId: FIELD_GUIDE_ID,
        placement,
        pagePath,
        marketingOptIn,
        consentTextVersion: CURRENT_CONSENT_TEXT_VERSION,
        turnstileToken,
        attribution: resolveAttribution(
          arrivalFromWindow(),
          typeof window === 'undefined' ? null : window.location.origin,
          sessionStore(),
        ),
        honeypot,
      },
      fallbackGuideUrl,
    );

    dispatch({ type: 'settled', email: trimmed, result });

    const succeeded = result.kind === 'accepted' && result.stored && result.emailStatus === 'sent';
    sendFunnelEvent({
      event: succeeded ? 'request_succeeded' : 'request_failed',
      assetId: FIELD_GUIDE_ID,
      placement,
      pagePath,
    });

    /* A failed check is reset silently so a later attempt can succeed (§13.3). */
    if (result.kind === 'rejected' && result.error === 'verification_failed') setTurnstileToken(null);
  }

  if (isOutcome) {
    const body =
      state.outcome === 'success'
        ? copy.states.success(state.submittedEmail ?? '')
        : state.outcome === 'repeat_within_hour'
          ? copy.states.repeatWithinHour(state.submittedEmail ?? '')
          : copy.states.emailNotSent;

    return (
      <div className="space-y-5">
        <h3
          ref={outcomeHeadingRef}
          tabIndex={-1}
          className="text-2xl font-semibold tracking-tight text-jp-text-primary focus:outline-hidden"
        >
          {copy.states.outcomeHeading}
        </h3>

        {/* §33.1: an outcome that reports the email was not sent carries the
            same AlertCircle the field error uses. No red, no warning band. */}
        <p className="flex gap-2 text-[0.9375rem] leading-relaxed text-jp-text-secondary">
          {state.outcome === 'email_not_sent' && (
            <AlertCircle size={16} aria-hidden="true" className="mt-1 shrink-0 text-jp-text-primary" />
          )}
          <span>{body}</span>
        </p>

        <a
          href={state.guideUrl ?? FIELD_GUIDE.publicPath}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            sendFunnelEvent({ event: 'guide_opened', assetId: FIELD_GUIDE_ID, placement, pagePath })
          }
          className={`${PRIMARY_BUTTON_CLASSES} block text-center`}
        >
          {copy.states.openButton}
          <span className="sr-only"> ({copy.states.openButtonScreenReaderNote})</span>
        </a>

        {/* §13.2: Try again appears only where retrying is genuinely useful. */}
        {state.retryable && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'retry' })}
            className="inline-flex min-h-[44px] items-center text-[0.9375rem] text-jp-text-secondary underline underline-offset-4 transition-colors duration-200 ease-out hover:text-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none"
          >
            {copy.states.tryAgain}
          </button>
        )}
      </div>
    );
  }

  const errorMessage =
    state.fieldError === 'empty'
      ? copy.states.emptyEmail
      : state.fieldError === 'invalid'
        ? copy.states.invalidEmail
        : null;

  return (
    <form onSubmit={handleSubmit} aria-busy={isSubmitting} noValidate className="space-y-5">
      {heading}

      <div>
        <label htmlFor={fieldId} className="mb-2 block text-sm font-semibold text-jp-text-secondary">
          {copy.dialog.emailLabel}
        </label>
        <input
          ref={fieldRef}
          id={fieldId}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          disabled={isSubmitting}
          aria-invalid={state.fieldError ? true : undefined}
          aria-describedby={errorMessage ? errorId : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            dispatch({ type: 'edit', value: event.target.value });
          }}
          /* §33.1: an invalid field's border rises to --jp-text-primary at 60%. */
          className={`${FIELD_CLASSES} ${state.fieldError ? 'border-jp-text-primary/60' : 'border-jp-border/30'}`}
        />

        {errorMessage && (
          <div id={errorId} role="alert" className="mt-2 flex items-center gap-2 text-[0.9375rem] text-jp-text-primary">
            <AlertCircle size={16} aria-hidden="true" className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* The honeypot. Hidden from sight and from assistive technology, never
          autofilled, and checked server-side under this exact field name. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${fieldId}-website`}>Website</label>
        <input
          id={`${fieldId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {/* §24.1 and D3.4: separate, optional, and unchecked by default.
          Requesting the guide does not create marketing consent. */}
      <label htmlFor={consentId} className="flex cursor-pointer items-start gap-3 py-2">
        <input
          id={consentId}
          type="checkbox"
          checked={marketingOptIn}
          disabled={isSubmitting}
          onChange={(event) => setMarketingOptIn(event.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded-sm border-jp-border/30 bg-jp-surface disabled:cursor-not-allowed"
          style={{ accentColor: 'var(--jp-brand-amber)' }}
        />
        <span className="text-[0.9375rem] leading-relaxed text-jp-text-secondary">
          {CONSENT_TEXTS[CURRENT_CONSENT_TEXT_VERSION].text}
        </span>
      </label>

      {/* Invisible unless Cloudflare needs a challenge. The explanatory line
          appears only when the widget actually becomes visible. */}
      {turnstileVisible && (
        <p className="text-[0.9375rem] text-jp-text-secondary">{copy.dialog.turnstileNotice}</p>
      )}
      <Turnstile
        onToken={handleToken}
        onExpire={handleExpire}
        onInteractive={handleInteractive}
        appearance="interaction-only"
        theme="dark"
        className={turnstileVisible ? 'mt-2' : 'sr-only'}
      />

      {/* Deliberately NOT disabled while the browser check is pending. Under
          §13.3 a check that fails, expires, or never loads must still leave
          the visitor able to submit and receive the guide; the server decides
          and the request fails open. Disabling here would turn a Cloudflare
          hiccup into a dead form. */}
      <div>
        <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASSES}>
          {isSubmitting ? copy.states.submitting : copy.dialog.submit}
        </button>
        {stillWorking && <p className="mt-2 text-[0.9375rem] text-jp-text-muted">{copy.states.stillWorking}</p>}
      </div>

      <p className="text-sm text-jp-text-muted">
        {copy.dialog.finePrint.before}
        <a
          href={copy.dialog.finePrint.linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 transition-colors duration-200 ease-out hover:text-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none"
        >
          {copy.dialog.finePrint.linkText}
          <span className="sr-only"> ({copy.states.openButtonScreenReaderNote})</span>
        </a>
        {copy.dialog.finePrint.after}
      </p>
    </form>
  );
}
