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
import { maskEmail, summariseError } from "../_shared/lead-magnet/logging.ts";
import {
  acceptedResponse,
  errorResponse,
  guideUrlFor,
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
import { describeFetchFailure, describeResendResponse } from "../_shared/lead-magnet/resendDiagnostics.ts";
import { buildExistingContactUpdate, buildNewContactRow, buildRequestRow } from "../_shared/lead-magnet/rows.ts";
import {
  TEST_FAULT_HEADER,
  TEST_FAULT_SECRET_HEADER,
  isPersistenceFaultRequested,
  isTestModeEnabled,
  isTestModeRecipientAllowed,
  resolveTurnstileSecret,
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

    const simulateFailure = await persistenceFaultRequested(req, testMode, logger);

    try {
      if (simulateFailure) {
        throw new PersistenceError("simulated persistence failure (test mode)");
      }
      const result = await persistRequest(input, requestId);
      stored = true;
      logger.info("stored", { contactCreated: result.contactCreated, isRepeat: result.isRepeat });
    } catch (error) {
      const summary = summariseError(error);
      logger.error("persistence failed; granting access and sending recovery alert", { error: summary });
      recoveryAlertAttempted = true;
      await sendRecoveryAlert(input, requestId, summary, environment, logger);
    }

    return send(acceptedResponse(requestId, guideUrl, stored));
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

/** Decision 1B. Any error evaluating the hook means no simulated failure. */
async function persistenceFaultRequested(req: Request, testMode: boolean, logger: Logger): Promise<boolean> {
  if (!testMode) return false;
  try {
    const requested = await isPersistenceFaultRequested({
      testMode,
      faultHeader: req.headers.get(TEST_FAULT_HEADER),
      providedSecret: req.headers.get(TEST_FAULT_SECRET_HEADER),
      configuredSecret: Deno.env.get("LEAD_MAGNET_TEST_FAULT_SECRET"),
    });
    if (requested) logger.info("test mode: simulated persistence failure requested");
    return requested;
  } catch (error) {
    logger.error("test fault check failed; continuing normally", { error: summariseError(error) });
    return false;
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

async function persistRequest(
  input: LeadMagnetRequestInput,
  requestId: string,
): Promise<{ contactCreated: boolean; isRepeat: boolean }> {
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

  if (inserted.length === 1) {
    contactId = inserted[0].id;
    contactCreated = true;
  } else {
    const lookup = await rest(
      `contacts?select=id,consent_status&email=eq.${encodeURIComponent(input.email)}&limit=1`,
      { method: "GET" },
    );
    const rows = (await lookup.json()) as Array<{ id: string; consent_status: unknown }>;
    if (rows.length !== 1) {
      throw new PersistenceError("GET contacts failed: contact not found after insert");
    }
    contactId = rows[0].id;
    contactCreated = false;
    const currentStatus = isConsentStatus(rows[0].consent_status) ? rows[0].consent_status : "transactional_only";
    await rest(`contacts?id=eq.${contactId}`, {
      method: "PATCH",
      body: buildExistingContactUpdate(currentStatus, input, nowIso),
      prefer: "return=minimal",
    });
  }

  let isRepeat = false;
  if (!contactCreated) {
    const prior = await rest(
      `lead_magnet_requests?select=id&contact_id=eq.${contactId}` +
        `&asset_id=eq.${encodeURIComponent(input.assetId)}&limit=1`,
      { method: "GET" },
    );
    isRepeat = ((await prior.json()) as unknown[]).length > 0;
  }

  await rest("lead_magnet_requests", {
    method: "POST",
    body: buildRequestRow({ input, requestId, contactId, isRepeat }),
    prefer: "return=minimal",
  });

  return { contactCreated, isRepeat };
}

/** §7.2.1. A failure to send the alert is logged and never changes the visitor's response. */
async function sendRecoveryAlert(
  input: LeadMagnetRequestInput,
  requestId: string,
  errorSummary: string,
  environment: string,
  logger: Logger,
): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    logger.error("recovery alert not sent: RESEND_API_KEY not configured");
    return;
  }

  const alert = renderRecoveryAlert({
    timestampIso: new Date().toISOString(),
    requestId,
    placement: input.placement,
    pagePath: input.pagePath,
    errorSummary,
    email: input.email,
  });

  const startedAt = Date.now();

  try {
    logger.info("recovery alert: calling Resend");
    const response = await fetch(RESEND_EMAILS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Idempotency-Key": `lead-magnet-recovery-${requestId}`,
      },
      body: JSON.stringify({
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
      }),
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    });
    const outcome = describeResendResponse(response.status, await response.text().catch(() => ""));
    const elapsedMs = Date.now() - startedAt;
    if (outcome.ok) {
      logger.info("recovery alert accepted by Resend", {
        status: outcome.status,
        resendMessageId: outcome.messageId,
        elapsedMs,
      });
    } else {
      logger.error("recovery alert rejected by Resend", {
        status: outcome.status,
        errorName: outcome.errorName,
        errorMessage: outcome.errorMessage,
        elapsedMs,
      });
    }
  } catch (error) {
    logger.error("recovery alert failed before a Resend response", {
      ...describeFetchFailure(error),
      elapsedMs: Date.now() - startedAt,
    });
  }
}
