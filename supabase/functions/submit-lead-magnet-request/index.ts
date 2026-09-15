import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * submit-lead-magnet-request: records one lead-magnet request and returns the
 * guide (lead-gen plan §4.3, §13; Sprint 2 proposal approved 2026-09-15).
 *
 * Fails open for guide access (Decision D5.6): every JiTpro-side failure still
 * returns the guide URL. Reads and writes only `contacts`,
 * `lead_magnet_requests`, and `lead_magnet_ip_activity`; never touches the
 * contact-form pipeline. Sprint 2 sends no fulfilment email and no internal
 * notification; `email_status` stays null until Sprint 3.
 *
 * Decisions live in the pure modules under ../_shared/lead-magnet/, which are
 * unit-tested; this file holds only the handler and its I/O.
 */

import { isConsentStatus } from "../_shared/lead-magnet/consent.ts";
import { corsHeadersFor, isAllowedOrigin } from "../_shared/lead-magnet/cors.ts";
import { classifyResendFailure, planFulfilment, shouldRecordContactSuppression } from "../_shared/lead-magnet/emailOutcome.ts";
import {
  LEAD_MAGNET_FULFILMENT_FROM,
  LEAD_MAGNET_REPLY_TO,
  renderFulfilmentEmail,
} from "../_shared/lead-magnet/fulfilmentEmail.ts";
import { renderInternalNotification } from "../_shared/lead-magnet/internalNotification.ts";
import { maskEmail, summariseError } from "../_shared/lead-magnet/logging.ts";
import {
  acceptedResponse,
  errorResponse,
  guideUrlFor,
  type FulfilmentEmailStatus,
  type LeadMagnetResponse,
} from "../_shared/lead-magnet/outcome.ts";
import {
  REQUEST_RATE_LIMIT,
  clientIpFrom,
  hashIp,
  ipActivityRetentionCutoff,
  isOverLimit,
  parseContentRangeTotal,
  rateLimitWindowStart,
} from "../_shared/lead-magnet/rateLimit.ts";
import {
  LEAD_MAGNET_NOTIFICATIONS_FROM,
  LEAD_MAGNET_NOTIFY_TO,
  renderRecoveryAlert,
} from "../_shared/lead-magnet/recoveryAlert.ts";
import { parseLeadMagnetRequest, type LeadMagnetRequestInput } from "../_shared/lead-magnet/request.ts";
import {
  describeFetchFailure,
  describeResendResponse,
  sanitiseDiagnosticText,
} from "../_shared/lead-magnet/resendDiagnostics.ts";
import {
  buildContactSuppressionPatch,
  buildEmailStatusPatch,
  buildExistingContactUpdate,
  buildNewContactRow,
  buildRequestRow,
} from "../_shared/lead-magnet/rows.ts";
import {
  TEST_FAULT_EMAIL,
  TEST_FAULT_EMAIL_SUPPRESSED,
  TEST_FAULT_HEADER,
  TEST_FAULT_PERSISTENCE,
  TEST_FAULT_SECRET_HEADER,
  isTestModeEnabled,
  isTestModeRecipientAllowed,
  requestedTestFault,
  resolveTurnstileSecret,
  type TestFaultKind,
} from "../_shared/lead-magnet/testMode.ts";

const FUNCTION_NAME = "submit-lead-magnet-request";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const TURNSTILE_TIMEOUT_MS = 5_000;
const DB_TIMEOUT_MS = 5_000;
const RESEND_TIMEOUT_MS = 8_000;

/** A database or configuration failure that must not withhold the guide. */
class PersistenceError extends Error {}

type Logger = {
  info: (message: string, fields?: Record<string, unknown>) => void;
  error: (message: string, fields?: Record<string, unknown>) => void;
};

Deno.serve(async (req: Request) => {
  const requestId = crypto.randomUUID();
  const origin = req.headers.get("origin");
  const cors = corsHeadersFor(origin);
  const testMode = isTestModeEnabled(Deno.env.get("LEAD_MAGNET_TEST_MODE"));
  const environment = testMode ? "test" : "production";

  // Never log emails unmasked, IPs, IP hashes, tokens, or secrets.
  const logger: Logger = {
    info: (message, fields = {}) =>
      console.log(`${FUNCTION_NAME}: ${message}`, { requestId, environment, ...fields }),
    error: (message, fields = {}) =>
      console.error(`${FUNCTION_NAME}: ${message}`, { requestId, environment, ...fields }),
  };

  const send = ({ status, body }: LeadMagnetResponse) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  if (req.method === "OPTIONS") {
    return new Response(null, { status: isAllowedOrigin(origin) ? 204 : 403, headers: cors });
  }
  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers: { ...cors, Allow: "POST, OPTIONS" } });
  }

  const siteUrl = Deno.env.get("SITE_URL");
  let input: LeadMagnetRequestInput | null = null;
  let guideUrl: string | null = null;
  let verified = false;
  let stored = false;
  let recoveryAlertAttempted = false;
  let persisted: PersistResult | null = null;
  let emailStatus: FulfilmentEmailStatus | null = null;

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      logger.info("rejected: body is not JSON");
      return send(errorResponse("invalid_request", requestId, null));
    }

    const parsed = parseLeadMagnetRequest(body);

    if (parsed.kind === "honeypot") {
      logger.info("honeypot filled; nothing stored");
      return send(acceptedResponse(requestId, parsed.assetId ? guideUrlFor(parsed.assetId, siteUrl) : null, true));
    }

    if (parsed.kind === "invalid") {
      logger.info("rejected: validation", { error: parsed.error });
      return send(
        errorResponse(parsed.error, requestId, parsed.assetId ? guideUrlFor(parsed.assetId, siteUrl) : null),
      );
    }

    input = parsed.input;
    guideUrl = guideUrlFor(input.assetId, siteUrl);
    logger.info("request received", {
      asset: input.assetId,
      placement: input.placement,
      email: maskEmail(input.email),
    });

    // Decision 2: in test mode, refuse outside recipients before anything is stored.
    if (testMode && !isTestModeRecipientAllowed(input.email)) {
      logger.info("refused: recipient outside the test-mode domains; nothing stored");
      return send(errorResponse("test_mode_refused", requestId, guideUrl));
    }

    verified = await verifyTurnstile(input.turnstileToken, testMode, logger);
    if (!verified) {
      return send(errorResponse("verification_failed", requestId, guideUrl));
    }

    const rateLimit = await applyRequestRateLimit(req, logger);
    if (rateLimit === "limited") {
      logger.info("refused: rate limited");
      return send(errorResponse("rate_limited", requestId, guideUrl));
    }

    const fault = await testFault(req, testMode, logger);

    try {
      if (fault === TEST_FAULT_PERSISTENCE) {
        throw new PersistenceError("simulated persistence failure (test mode)");
      }
      persisted = await persistRequest(input, requestId);
      stored = true;
      logger.info("stored", { contactCreated: persisted.contactCreated, isRepeat: persisted.isRepeat });
    } catch (error) {
      const summary = summariseError(error);
      logger.error("persistence failed; granting access and sending recovery alert", { error: summary });
      recoveryAlertAttempted = true;
      await sendRecoveryAlert(input, requestId, summary, environment, logger);
    }

    // The email step never gates guide access (D5.6): its outcome is recorded
    // and reported honestly, and a failure here still returns the guide.
    if (persisted) {
      emailStatus = await fulfilAndNotify(input, requestId, persisted, fault, environment, logger);
    }

    return send(acceptedResponse(requestId, guideUrl, stored, emailStatus));
  } catch (error) {
    const summary = summariseError(error);
    logger.error("unexpected error", { error: summary });
    if (input && verified && !stored && !recoveryAlertAttempted) {
      await sendRecoveryAlert(input, requestId, `unexpected error: ${summary}`, environment, logger);
    }
    return send(errorResponse("server_error", requestId, guideUrl));
  }
});

async function verifyTurnstile(token: string | null, testMode: boolean, logger: Logger): Promise<boolean> {
  const { secret, source } = resolveTurnstileSecret({
    testMode,
    testSecret: Deno.env.get("LEAD_MAGNET_TURNSTILE_TEST_SECRET"),
    productionSecret: Deno.env.get("TURNSTILE_SECRET_KEY"),
  });

  if (!secret) {
    logger.error("verification unavailable: Turnstile secret not configured");
    return false;
  }
  if (!token) {
    logger.info("verification failed: token missing");
    return false;
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });
    const result = (await response.json()) as { success?: unknown; "error-codes"?: unknown };
    const success = result.success === true;
    logger.info("verification result", {
      success,
      source,
      errorCodes: Array.isArray(result["error-codes"]) ? result["error-codes"] : [],
    });
    return success;
  } catch (error) {
    logger.error("verification failed: siteverify unavailable", { error: summariseError(error) });
    return false;
  }
}

/** Decision 1B and the S3 email faults. Any error evaluating the hook means no fault. */
async function testFault(req: Request, testMode: boolean, logger: Logger): Promise<TestFaultKind | null> {
  if (!testMode) return null;
  try {
    const requested = await requestedTestFault({
      testMode,
      faultHeader: req.headers.get(TEST_FAULT_HEADER),
      providedSecret: req.headers.get(TEST_FAULT_SECRET_HEADER),
      configuredSecret: Deno.env.get("LEAD_MAGNET_TEST_FAULT_SECRET"),
    });
    if (requested) logger.info("test mode: simulated fault requested", { fault: requested });
    return requested;
  } catch (error) {
    logger.error("test fault check failed; continuing normally", { error: summariseError(error) });
    return null;
  }
}

type RestOptions = {
  method: "GET" | "HEAD" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  prefer?: string;
};

/** Service-role PostgREST call. Errors name the table only: no query values, no row details. */
async function rest(path: string, { method, body, prefer }: RestOptions): Promise<Response> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const table = path.split("?")[0];
  if (!supabaseUrl || !serviceRoleKey) {
    throw new PersistenceError(`${method} ${table} failed: database configuration missing`);
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(DB_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new PersistenceError(`${method} ${table} failed: ${await describeRestError(response)}`);
  }
  return response;
}

/** PostgREST `code` and `message` only; `details` can echo row values and is never read. */
async function describeRestError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { code?: unknown; message?: unknown };
    const code = typeof payload.code === "string" ? ` ${payload.code}` : "";
    const message = typeof payload.message === "string" ? `: ${payload.message.slice(0, 160)}` : "";
    return `HTTP ${response.status}${code}${message}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

/** Decision 5: every failure here skips rate limiting, is logged, and the request continues. */
async function applyRequestRateLimit(req: Request, logger: Logger): Promise<"allowed" | "limited" | "skipped"> {
  const salt = Deno.env.get("LEAD_MAGNET_IP_SALT");
  if (!salt) {
    logger.error("rate limit skipped: LEAD_MAGNET_IP_SALT not configured");
    return "skipped";
  }
  const ip = clientIpFrom(req.headers.get("x-forwarded-for"));
  if (!ip) {
    logger.error("rate limit skipped: client IP unavailable");
    return "skipped";
  }

  try {
    const now = new Date();
    const ipHash = await hashIp(ip, salt, now);

    await rest("lead_magnet_ip_activity", {
      method: "POST",
      body: { ip_hash: ipHash, activity_kind: "request" },
      prefer: "return=minimal",
    });

    const countResponse = await rest(
      `lead_magnet_ip_activity?select=id&ip_hash=eq.${ipHash}&activity_kind=eq.request` +
        `&created_at=gte.${encodeURIComponent(rateLimitWindowStart(now))}`,
      { method: "HEAD", prefer: "count=exact" },
    );
    const count = parseContentRangeTotal(countResponse.headers.get("content-range"));

    await deleteExpiredIpActivity(now, logger);

    if (count === null) {
      logger.error("rate limit skipped: count unavailable");
      return "skipped";
    }
    return isOverLimit(count, REQUEST_RATE_LIMIT) ? "limited" : "allowed";
  } catch (error) {
    logger.error("rate limit skipped: operation failed", { error: summariseError(error) });
    return "skipped";
  }
}

/** 24-hour retention (Decision D2.7), enforced opportunistically on each request. */
async function deleteExpiredIpActivity(now: Date, logger: Logger): Promise<void> {
  try {
    await rest(`lead_magnet_ip_activity?created_at=lt.${encodeURIComponent(ipActivityRetentionCutoff(now))}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
  } catch (error) {
    logger.error("expired IP activity not deleted", { error: summariseError(error) });
  }
}

type PersistResult = {
  contactId: string;
  contactCreated: boolean;
  isRepeat: boolean;
  /** Set when the contact is already known to be undeliverable (D3.6). */
  contactSuppressedAt: string | null;
  /** `created_at` of the most recent successfully sent fulfilment email, the cooldown clock (S3). */
  lastSentAt: Date | null;
};

async function persistRequest(input: LeadMagnetRequestInput, requestId: string): Promise<PersistResult> {
  const nowIso = new Date().toISOString();

  // Insert-if-absent: an existing contact is never overwritten by this insert,
  // so first-touch attribution is written exactly once (Decision S2-2).
  const insertResponse = await rest("contacts?on_conflict=email&select=id", {
    method: "POST",
    body: buildNewContactRow(input, nowIso),
    prefer: "resolution=ignore-duplicates,return=representation",
  });
  const inserted = (await insertResponse.json()) as Array<{ id: string }>;

  let contactId: string;
  let contactCreated: boolean;
  let contactSuppressedAt: string | null = null;

  if (inserted.length === 1) {
    contactId = inserted[0].id;
    contactCreated = true;
  } else {
    const lookup = await rest(
      `contacts?select=id,consent_status,email_suppressed_at&email=eq.${encodeURIComponent(input.email)}&limit=1`,
      { method: "GET" },
    );
    const rows = (await lookup.json()) as Array<{
      id: string;
      consent_status: unknown;
      email_suppressed_at: string | null;
    }>;
    if (rows.length !== 1) {
      throw new PersistenceError("GET contacts failed: contact not found after insert");
    }
    contactId = rows[0].id;
    contactCreated = false;
    contactSuppressedAt = rows[0].email_suppressed_at ?? null;
    const currentStatus = isConsentStatus(rows[0].consent_status) ? rows[0].consent_status : "transactional_only";
    await rest(`contacts?id=eq.${contactId}`, {
      method: "PATCH",
      body: buildExistingContactUpdate(currentStatus, input, nowIso),
      prefer: "return=minimal",
    });
  }

  let isRepeat = false;
  let lastSentAt: Date | null = null;
  if (!contactCreated) {
    const prior = await rest(
      `lead_magnet_requests?select=id&contact_id=eq.${contactId}` +
        `&asset_id=eq.${encodeURIComponent(input.assetId)}&limit=1`,
      { method: "GET" },
    );
    isRepeat = ((await prior.json()) as unknown[]).length > 0;

    // The cooldown clock: the most recent request whose fulfilment email was
    // actually sent. Its `created_at` stands in for the send time (S3).
    const lastSent = await rest(
      `lead_magnet_requests?select=created_at&contact_id=eq.${contactId}` +
        `&email_status=eq.sent&order=created_at.desc&limit=1`,
      { method: "GET" },
    );
    const sentRows = (await lastSent.json()) as Array<{ created_at: string }>;
    if (sentRows.length === 1) lastSentAt = new Date(sentRows[0].created_at);
  }

  await rest("lead_magnet_requests", {
    method: "POST",
    body: buildRequestRow({ input, requestId, contactId, isRepeat }),
    prefer: "return=minimal",
  });

  return { contactId, contactCreated, isRepeat, contactSuppressedAt, lastSentAt };
}

type ResendSendResult =
  | { ok: true; messageId: string | null }
  | { ok: false; suppressed: boolean; error: string | null; status: number | null };

/**
 * One Resend send with the approved tags and idempotency key, and a single
 * retry on a transport error or a 5xx using the same key, so a retry can never
 * double-send. Logs a marker before each attempt and a sanitised outcome after
 * (S2-20). Never logs the body, headers, recipient, or any secret.
 */
async function postResend(
  label: "fulfilment" | "internal_notification" | "recovery_alert",
  payload: Record<string, unknown>,
  idempotencyKey: string,
  logger: Logger,
): Promise<ResendSendResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    logger.error(`${label} not sent: RESEND_API_KEY not configured`);
    return { ok: false, suppressed: false, error: "RESEND_API_KEY not configured", status: null };
  }

  let lastResult: ResendSendResult = { ok: false, suppressed: false, error: "not attempted", status: null };

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const startedAt = Date.now();
    try {
      logger.info(`${label}: calling Resend`, { attempt });
      const response = await fetch(RESEND_EMAILS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
      });
      const outcome = describeResendResponse(response.status, await response.text().catch(() => ""));
      const elapsedMs = Date.now() - startedAt;

      if (outcome.ok) {
        logger.info(`${label} accepted by Resend`, {
          status: outcome.status,
          resendMessageId: outcome.messageId,
          elapsedMs,
          attempt,
        });
        return { ok: true, messageId: outcome.messageId };
      }

      const suppressed = classifyResendFailure(outcome) === "suppressed";
      logger.error(`${label} rejected by Resend`, {
        status: outcome.status,
        errorName: outcome.errorName,
        errorMessage: outcome.errorMessage,
        suppressed,
        elapsedMs,
        attempt,
      });
      lastResult = {
        ok: false,
        suppressed,
        error: outcome.errorName ?? outcome.errorMessage ?? `HTTP ${outcome.status}`,
        status: outcome.status,
      };
      // Client-side rejections will not change on a retry.
      if (outcome.status < 500) return lastResult;
    } catch (error) {
      const failure = describeFetchFailure(error);
      logger.error(`${label} failed before a Resend response`, { ...failure, elapsedMs: Date.now() - startedAt, attempt });
      lastResult = { ok: false, suppressed: false, error: failure.errorType, status: null };
    }
  }

  return lastResult;
}

/**
 * Sends the visitor's guide email, records the outcome on the request row, and
 * then sends the internal notification independently: the notification reports
 * the fulfilment status, but neither send can affect the other or the visitor's
 * access to the guide (D5.6).
 */
async function fulfilAndNotify(
  input: LeadMagnetRequestInput,
  requestId: string,
  persisted: PersistResult,
  fault: TestFaultKind | null,
  environment: string,
  logger: Logger,
): Promise<FulfilmentEmailStatus> {
  const now = new Date();
  const plan = planFulfilment({
    contactSuppressedAt: persisted.contactSuppressedAt,
    lastSentAt: persisted.lastSentAt,
    now,
  });

  let status: FulfilmentEmailStatus;
  let providerId: string | null = null;
  let error: string | null = null;

  if (plan.action === "skip") {
    status = plan.status;
    logger.info("fulfilment email not sent", { status });
  } else if (fault === TEST_FAULT_EMAIL || fault === TEST_FAULT_EMAIL_SUPPRESSED) {
    status = fault === TEST_FAULT_EMAIL_SUPPRESSED ? "suppressed" : "failed";
    error = `simulated ${fault} (test mode)`;
    logger.info("fulfilment email simulated failure (test mode)", { status });
  } else {
    const guideUrl = guideUrlFor(input.assetId, Deno.env.get("SITE_URL"));
    const email = renderFulfilmentEmail({ assetId: input.assetId, guideUrl });
    const result = await postResend(
      "fulfilment",
      {
        from: LEAD_MAGNET_FULFILMENT_FROM,
        to: [input.email],
        reply_to: LEAD_MAGNET_REPLY_TO,
        subject: email.subject,
        html: email.html,
        text: email.text,
        tags: [
          { name: "asset", value: input.assetId },
          { name: "environment", value: environment },
          { name: "message", value: "fulfilment" },
        ],
      },
      `lead-magnet-fulfilment-${requestId}`,
      logger,
    );

    if (result.ok) {
      status = "sent";
      providerId = result.messageId;
    } else {
      status = result.suppressed ? "suppressed" : "failed";
      error = result.error;
    }
  }

  await recordEmailOutcome(requestId, persisted, status, providerId, error, logger);
  await sendInternalNotification(input, requestId, persisted, status, environment, logger);
  return status;
}

/** Writes the honest outcome to the request row, and suppression to the contact. */
async function recordEmailOutcome(
  requestId: string,
  persisted: PersistResult,
  status: FulfilmentEmailStatus,
  providerId: string | null,
  error: string | null,
  logger: Logger,
): Promise<void> {
  try {
    await rest(`lead_magnet_requests?id=eq.${requestId}`, {
      method: "PATCH",
      body: buildEmailStatusPatch({ status, providerId, error: error ? sanitiseDiagnosticText(error) : null }),
      prefer: "return=minimal",
    });
  } catch (patchError) {
    logger.error("email status not recorded on the request row", { error: summariseError(patchError) });
  }

  if (!shouldRecordContactSuppression(status, persisted.contactSuppressedAt)) return;

  try {
    await rest(`contacts?id=eq.${persisted.contactId}`, {
      method: "PATCH",
      body: buildContactSuppressionPatch(new Date().toISOString()),
      prefer: "return=minimal",
    });
    logger.info("contact marked as suppressed");
  } catch (patchError) {
    logger.error("contact suppression not recorded", { error: summariseError(patchError) });
  }
}

/** §7.2. Independent of the visitor's email; its failure is logged and swallowed. */
async function sendInternalNotification(
  input: LeadMagnetRequestInput,
  requestId: string,
  persisted: PersistResult,
  emailStatus: FulfilmentEmailStatus,
  environment: string,
  logger: Logger,
): Promise<void> {
  const notification = renderInternalNotification({
    email: input.email,
    placement: input.placement,
    pagePath: input.pagePath,
    landingPath: input.landingPath,
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    referrer: input.referrer,
    isRepeat: persisted.isRepeat,
    marketingOptIn: input.marketingOptIn,
    emailStatus,
    requestId,
    timestampIso: new Date().toISOString(),
  });

  await postResend(
    "internal_notification",
    {
      from: LEAD_MAGNET_NOTIFICATIONS_FROM,
      to: [LEAD_MAGNET_NOTIFY_TO],
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
      tags: [
        { name: "asset", value: input.assetId },
        { name: "environment", value: environment },
        { name: "message", value: "internal_notification" },
      ],
    },
    `lead-magnet-notification-${requestId}`,
    logger,
  );
}

/** §7.2.1. A failure to send the alert is logged and never changes the visitor's response. */
async function sendRecoveryAlert(
  input: LeadMagnetRequestInput,
  requestId: string,
  errorSummary: string,
  environment: string,
  logger: Logger,
): Promise<void> {
  const alert = renderRecoveryAlert({
    timestampIso: new Date().toISOString(),
    requestId,
    placement: input.placement,
    pagePath: input.pagePath,
    errorSummary,
    email: input.email,
  });

  await postResend(
    "recovery_alert",
    {
      from: LEAD_MAGNET_NOTIFICATIONS_FROM,
      to: [LEAD_MAGNET_NOTIFY_TO],
      subject: alert.subject,
      html: alert.html,
      text: alert.text,
      tags: [
        { name: "asset", value: input.assetId },
        { name: "environment", value: environment },
        { name: "message", value: "recovery_alert" },
      ],
    },
    `lead-magnet-recovery-${requestId}`,
    logger,
  );
}
