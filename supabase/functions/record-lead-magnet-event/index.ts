import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * record-lead-magnet-event: records ONE anonymous funnel event
 * (lead-gen plan §4.3, §6.4, §8.1; Sprint 6 contract approved 2026-09-16).
 *
 * IT ALWAYS ANSWERS 204. A recorded event, an invalid payload and a
 * rate-limited beacon are indistinguishable to the caller, and every drop is
 * logged instead. That is deliberate: this endpoint is a `sendBeacon` target,
 * `sendBeacon` discards the response entirely, and analytics must never be
 * able to surface an error inside the visitor capture experience or provoke a
 * retry. Only a disallowed origin (403) and a wrong method (405) answer
 * otherwise, and neither can happen to a legitimate beacon.
 *
 * IT STORES NO IDENTIFIER (D4.6, D4.7, §8.4). A row is an event name, an
 * asset, a placement, a page path, an optional error kind and a timestamp. The
 * client address is used transiently to compute the daily-salted rate-limit
 * hash and is never stored beside the event. There is no email, session id,
 * visitor id, referrer, UTM or user agent anywhere in this function.
 *
 * IT NEVER READS ANYTHING BACK except its own rate-limit count, and it writes
 * only `lead_magnet_events` and `lead_magnet_ip_activity`. It has no bearing
 * on the contact-form pipeline, sends no email, and holds no email secret.
 *
 * It has NO test-mode behaviour: there is no recipient to restrict and no
 * fault worth simulating. Events written while testing are removed by the same
 * guarded cleanup as other test data.
 *
 * Decisions live in the pure modules under ../_shared/lead-magnet/, which are
 * unit-tested; this file holds only the handler and its I/O.
 */

import { corsHeadersFor, isAllowedOrigin } from "../_shared/lead-magnet/cors.ts";
import { buildEventRow, parseFunnelEvent } from "../_shared/lead-magnet/eventRequest.ts";
import { summariseError } from "../_shared/lead-magnet/logging.ts";
import {
  EVENT_RATE_LIMIT,
  clientIpFrom,
  hashIp,
  ipActivityRetentionCutoff,
  isOverLimit,
  parseContentRangeTotal,
  rateLimitWindowStart,
} from "../_shared/lead-magnet/rateLimit.ts";

const FUNCTION_NAME = "record-lead-magnet-event";
const DB_TIMEOUT_MS = 5_000;

type Logger = {
  info: (message: string, fields?: Record<string, unknown>) => void;
  error: (message: string, fields?: Record<string, unknown>) => void;
};

class PersistenceError extends Error {}

async function rest(
  path: string,
  { method, body, prefer }: { method: string; body?: unknown; prefer?: string },
): Promise<Response> {
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
    throw new PersistenceError(`${method} ${table} failed: ${response.status}`);
  }
  return response;
}

/**
 * 100 events per salted IP hash per 10 minutes (S2-4), a separate ceiling from
 * the 10 guide requests. Fails OPEN like the request limiter (Decision 5,
 * 2026-09-15): if the salt, the address, hashing or the database is
 * unavailable, the event is recorded and the reason logged, because losing
 * analytics is worse than losing a ceiling that exists only to stop flooding.
 */
async function checkRateLimit(req: Request, logger: Logger): Promise<"allowed" | "limited" | "skipped"> {
  const salt = Deno.env.get("LEAD_MAGNET_IP_SALT");
  if (!salt) {
    logger.error("rate limit skipped: salt unavailable");
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
      body: { ip_hash: ipHash, activity_kind: "event" },
      prefer: "return=minimal",
    });

    const countResponse = await rest(
      `lead_magnet_ip_activity?select=id&ip_hash=eq.${ipHash}&activity_kind=eq.event` +
        `&created_at=gte.${encodeURIComponent(rateLimitWindowStart(now))}`,
      { method: "HEAD", prefer: "count=exact" },
    );
    const count = parseContentRangeTotal(countResponse.headers.get("content-range"));

    // 24-hour retention (D2.7), enforced opportunistically.
    try {
      await rest(
        `lead_magnet_ip_activity?created_at=lt.${encodeURIComponent(ipActivityRetentionCutoff(now))}`,
        { method: "DELETE", prefer: "return=minimal" },
      );
    } catch (error) {
      logger.error("expired IP activity not deleted", { error: summariseError(error) });
    }

    if (count === null) {
      logger.error("rate limit skipped: count unavailable");
      return "skipped";
    }
    return isOverLimit(count, EVENT_RATE_LIMIT) ? "limited" : "allowed";
  } catch (error) {
    logger.error("rate limit skipped: operation failed", { error: summariseError(error) });
    return "skipped";
  }
}

Deno.serve(async (req: Request) => {
  const requestId = crypto.randomUUID();
  const origin = req.headers.get("origin");
  const cors = corsHeadersFor(origin);

  // Never log an IP, an IP hash, or any secret. There is no email here to mask.
  const logger: Logger = {
    info: (message, fields = {}) => console.log(`${FUNCTION_NAME}: ${message}`, { requestId, ...fields }),
    error: (message, fields = {}) => console.error(`${FUNCTION_NAME}: ${message}`, { requestId, ...fields }),
  };

  /** The one success-shaped answer, used for recorded and dropped alike. */
  const noContent = () => new Response(null, { status: 204, headers: cors });

  if (req.method === "OPTIONS") {
    return new Response(null, { status: isAllowedOrigin(origin) ? 204 : 403, headers: cors });
  }
  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers: { ...cors, Allow: "POST, OPTIONS" } });
  }
  if (!isAllowedOrigin(origin)) {
    logger.info("rejected: origin not allowed");
    return new Response(null, { status: 403, headers: cors });
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      logger.info("dropped: body is not JSON");
      return noContent();
    }

    const parsed = parseFunnelEvent(body);
    if (parsed.kind === "invalid") {
      logger.info("dropped: invalid event", { reason: parsed.reason });
      return noContent();
    }

    const limit = await checkRateLimit(req, logger);
    if (limit === "limited") {
      logger.info("dropped: rate limited", { event: parsed.input.eventName });
      return noContent();
    }

    await rest("lead_magnet_events", {
      method: "POST",
      body: buildEventRow(parsed.input),
      prefer: "return=minimal",
    });

    logger.info("recorded", {
      event: parsed.input.eventName,
      placement: parsed.input.placement,
      rateLimit: limit,
    });
    return noContent();
  } catch (error) {
    // Nothing reaches the visitor. The event is lost and the reason is logged.
    logger.error("dropped: record failed", { error: summariseError(error) });
    return noContent();
  }
});
