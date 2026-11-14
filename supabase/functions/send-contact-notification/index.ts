// deno-lint-ignore no-import-prefix no-unversioned-import
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// deno-lint-ignore no-import-prefix no-unversioned-import
import { escape as escapeHtmlEntities } from "jsr:@std/html/entities";

/**
 * The columns this notification reads from a `leads` row. The unified
 * contact form (2026-08-26) collects name, email, role, and note (stored as
 * `message`) plus hidden source/page metadata; the legacy qualification
 * columns still exist on the table but are no longer collected or rendered.
 */
interface LeadRecord {
  id: number;
  created_at: string;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string | null;
  source: string | null;
  page: string | null;
}

interface WebhookPayload {
  type: "INSERT";
  table: string;
  schema: string;
  record: LeadRecord;
  old_record: null;
}

/** rims a value to an empty string fallback, used where the raw
 *  (unescaped) value is needed.
 */
function trimOrEmpty(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

/** Trims, then escapes (via Deno's @std/html), falling back to "—" for
 *  empty/whitespace-only/null values, so every field renders consistently.
 */
function safe(value: string | null | undefined): string {
  const trimmed = trimOrEmpty(value);
  if (!trimmed) return "—";
  return escapeHtmlEntities(trimmed);
}

/**
 * Checks two secrets are identical without stopping at the first wrong
 * character. A normal `===` returns faster for a guess that starts
 * correctly, which lets an attacker find a secret one character at a time.
 */
async function secretsMatch(expectedSecret: string, presentedSecret: string): Promise<boolean> {
  const textEncoder = new TextEncoder();

  // Convert inputs to uniform 32-byte blocks using native Web Crypto
  const [expectedHash, presentedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", textEncoder.encode(expectedSecret)),
    crypto.subtle.digest("SHA-256", textEncoder.encode(presentedSecret)),
  ]);

  const expectedBytes = new Uint8Array(expectedHash);
  const presentedBytes = new Uint8Array(presentedHash);

  // Collect every difference rather than returning at the first one.
  let differences = 0;
  for (let index = 0; index < expectedBytes.length; index++) {
    differences |= expectedBytes[index] ^ presentedBytes[index];
  }

  return differences === 0;
}

type FailedEmail = "team" | "visitor";
type FailureCause = "address-problem" | "service-problem";

interface EmailFailure {
  /** Plain-words explanation shown in the alert. */
  reason: string;
  /** Decides which wording and next steps the alert uses. */
  cause: FailureCause;
}

interface FailureAlertWording {
  whatHappened: string;
  whatToDo: (leadId: number | string) => string[];
}

interface FailureAlertContent {
  subject: string;
  headline: string;
  byCause: Record<FailureCause, FailureAlertWording>;
}

const FAILURE_ALERT_CONTENT: Record<FailedEmail, FailureAlertContent> = {
  team: {
    subject: "ALERT: a contact form message was not emailed to the team",
    headline: "A contact form message was not emailed to the team",
    byCause: {
      "address-problem": {
        whatHappened:
          "Someone filled in the website contact form. Their message is saved, but the email that tells the team about it was rejected as invalid, so nobody on the team has been told about it yet.",
        whatToDo: (leadId) => [
          `Open the leads table in Supabase and find entry number ${leadId}.`,
          "Read their message and follow up with them.",
          "Ask whoever looks after the website to check the function's logs, using the reference below.",
        ],
      },
      "service-problem": {
        whatHappened:
          "Someone filled in the website contact form. Their message is saved, but the email that tells the team about it could not be sent because of a problem with the email service, so nobody on the team has been told about it yet.",
        whatToDo: (leadId) => [
          `Open the leads table in Supabase and find entry number ${leadId}.`,
          "Read their message and follow up with them.",
          "Ask whoever looks after the email service (Resend) to check for problems, using the reference below.",
        ],
      },
    },
  },
  visitor: {
    subject: "ALERT: a website visitor did not receive the thank-you email",
    headline: "A website visitor did not get the thank-you email",
    byCause: {
      "address-problem": {
        whatHappened:
          "Someone filled in the website contact form and the team was told, but the thank-you email to the visitor was rejected, most likely because their email address is mistyped.",
        whatToDo: (leadId) => [
          `Open the leads table in Supabase and find entry number ${leadId}.`,
          "Check the email address for typos.",
          "If you can, reach out another way.",
        ],
      },
      "service-problem": {
        whatHappened:
          "Someone filled in the website contact form and the team was told, but the thank-you email to the visitor could not be sent because of a problem with the email service. Their email address may be fine.",
        whatToDo: (leadId) => [
          `Open the leads table in Supabase and find entry number ${leadId}.`,
          "Send them a short thank-you yourself.",
          "Ask whoever looks after the email service (Resend) to check for problems, using the reference below.",
        ],
      },
    },
  },
};

/**
 * Builds the subject, styled HTML and plain-text versions of a failure alert.
 * The plain-text copy is for mail programs that do not show styled emails.
 */
function buildFailureAlertEmail(params: {
  requestId: string;
  leadId: number | string;
  failedEmail: FailedEmail;
  failure: EmailFailure;
}): { subject: string; html: string; text: string } {
  const content = FAILURE_ALERT_CONTENT[params.failedEmail];
  const wording = content.byCause[params.failure.cause];
  const steps = wording.whatToDo(params.leadId);

  const sectionHeadingStyle =
    "margin: 0 0 6px 0; font-size: 14px; color: #475467; text-transform: uppercase; letter-spacing: 0.5px;";

  const detailRow = (label: string, value: string, monospace = false) => `
    <tr>
      <td style="padding: 4px 14px; width: 120px; vertical-align: top;">${label}</td>
      <td style="padding: 4px 14px;${monospace ? " font-family: monospace; font-size: 12px;" : ""}">${escapeHtmlEntities(value)}</td>
    </tr>`;

  const stepsHtml = steps.map((step) => `<li>${escapeHtmlEntities(step)}</li>`).join("");

  const html = `
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; border: 1px solid #e2e8f0;">
      <tr><td style="background: #b42318; color: #ffffff; padding: 12px 24px; font-size: 13px; font-weight: bold; letter-spacing: 1px;">ALERT</td></tr>
      <tr><td style="padding: 24px 24px 8px 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 20px; line-height: 1.3;">${escapeHtmlEntities(content.headline)}</h2>
        <h3 style="${sectionHeadingStyle}">What happened</h3>
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">${escapeHtmlEntities(wording.whatHappened)}</p>
        <h3 style="${sectionHeadingStyle}">What to do</h3>
        <ol style="margin: 0 0 24px 0; padding-left: 20px; font-size: 16px; line-height: 1.6;">${stepsHtml}</ol>
      </td></tr>
      <tr><td style="padding: 0 24px 24px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f4f5f7; border-radius: 6px; font-size: 13px; color: #475467;">
          <tr><td colspan="2" style="padding: 10px 14px 4px 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Details, for whoever looks into it</td></tr>
          ${detailRow("Entry number", String(params.leadId))}
          ${detailRow("Reason", params.failure.reason)}
          ${detailRow("Reference", params.requestId, true)}
        </table>
      </td></tr>
    </table>
  `;

  const text = [
    content.headline.toUpperCase(),
    "",
    "WHAT HAPPENED",
    wording.whatHappened,
    "",
    "WHAT TO DO",
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "DETAILS (for whoever looks into it)",
    `Entry number: ${params.leadId}`,
    `Reason: ${params.failure.reason}`,
    `Reference: ${params.requestId}`,
  ].join("\n");

  return { subject: content.subject, html, text };
}

/**
 * Emails the alert address when one of the two contact form emails could not
 * be sent: the one telling the team, or the thank-you to the visitor.
 *
 * The message itself is already saved in the database before this runs, so
 * nothing is lost.
 *
 * Never throws: if the alert also fails, the error is logged and the
 * function carries on as before.
 */
async function sendFailureAlert(params: {
  resendApiKey: string;
  requestId: string;
  leadId: number | string;
  alertRecipient: string;
  failedEmail: FailedEmail;
  failure: EmailFailure;
}): Promise<void> {
  try {
    const email = buildFailureAlertEmail(params);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${params.resendApiKey}`,
      },
      body: JSON.stringify({
        from: "JiTpro Alerts <info@jit-pro.com>",
        to: [params.alertRecipient],
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
    });

    if (!response.ok) {
      console.error("Failure alert email was rejected", {
        requestId: params.requestId,
        status: response.status,
      });
    }
  } catch (error) {
    console.error("Failure alert email could not be sent", { requestId: params.requestId, error });
  }
}

const UNKNOWN_EMAIL_FAILURE: EmailFailure = {
  reason: "Unknown reason",
  cause: "service-problem",
};

const EMAIL_SERVICE_UNREACHABLE: EmailFailure = {
  reason: "Could not connect to the email service",
  cause: "service-problem",
};

/**
 * Turns an HTTP status from the email service into a plain-words reason and a
 * cause. 400 and 422 mean the message itself was rejected as invalid, which for
 * the visitor email usually means a mistyped address. Anything else points to a
 * problem with permissions, limits or the service, not the visitor's address.
 * The status code stays in brackets for whoever investigates.
 */
function describeEmailRefusal(status: number): EmailFailure {
  if (status === 400 || status === 422) {
    return {
      reason: `The email service rejected the message as invalid (code ${status})`,
      cause: "address-problem",
    };
  }
  if (status === 401 || status === 403) {
    return {
      reason: `The email service did not accept our sending permission (code ${status})`,
      cause: "service-problem",
    };
  }
  if (status === 429) {
    return {
      reason: `The email service is limiting how many emails we can send (code ${status})`,
      cause: "service-problem",
    };
  }
  if (status >= 500) {
    return {
      reason: `The email service had a problem on its side (code ${status})`,
      cause: "service-problem",
    };
  }
  return {
    reason: `The email service refused the message (code ${status})`,
    cause: "service-problem",
  };
}

Deno.serve(async (req: Request) => {
  const requestId = crypto.randomUUID();
  console.log("send-contact-notification: start", { requestId });

  const expectedSecret = Deno.env.get("NOTIFY_WEBHOOK_SECRET");
  if (!expectedSecret) {
    console.error("NOTIFY_WEBHOOK_SECRET is not set; refusing all requests", { requestId });
    return new Response(
      JSON.stringify({ ok: false, error: "Server not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const presentedSecret = req.headers.get("x-notify-secret") ?? "";
  const isAuthorized = await secretsMatch(expectedSecret, presentedSecret);

  if (!isAuthorized) {
    console.warn("Request rejected: missing or wrong x-notify-secret", { requestId });
    return new Response(
      JSON.stringify({ ok: false, error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY missing", { requestId });
      return new Response(
        JSON.stringify({ ok: false, error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Where failure alerts go. The secret holds the distribution list; the
    // fallback keeps alerts flowing if it is ever missing or empty.
    const alertRecipient = Deno.env.get("ALERT_EMAIL_TO") || "info@jit-pro.com";

    const payload: WebhookPayload = await req.json();
    const lead = payload.record;

    console.log("Lead received:", {
      requestId,
      id: lead.id,
      name: `${lead.first_name} ${lead.last_name}`,
      role: lead.role,
    });

    const trimmedEmail = trimOrEmpty(lead.email);
    const cleanFirstName = safe(lead.first_name);
    const cleanLastName = safe(lead.last_name);
    const cleanRole = safe(lead.role);
    const cleanMessage = safe(lead.message);
    const name = `${cleanFirstName} ${cleanLastName}`.trim();

    const row = (label: string, value: string | null) =>
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${label}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${value || "—"}</td>
      </tr>`;

    const internalEmailHtml = `
      <h2>New JiTpro Contact Form Lead</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        ${row("Name", name)}
        ${row("Email", safe(lead.email))}
        ${row("Role", cleanRole)}
        ${row("Note", cleanMessage)}
        ${row("Source", `${safe(lead.source)} / ${safe(lead.page)}`)}
        ${row("Submitted", safe(lead.created_at))}
      </table>
    `;

    const visitorEmailHtml = `
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; font-family: sans-serif; color: #333; background-color: #ffffff;">
        <!-- LOGO HEADER -->
        <tr>
          <td align="left" style="padding: 20px 20px 12px 20px;">
            <img src="https://jit-pro.com/assets/logo/jitpro-logo-email.png" width="160" alt="JiTpro Logo" style="display: block; border: 0;">
          </td>
        </tr>
        <!-- EMAIL BODY -->
        <tr>
          <td style="padding: 5px 20px; line-height: 1.5;">
            <p style="margin: 0 0 16px 0; font-size: 16px;">Hi ${cleanFirstName},</p>
            <p style="margin: 0 0 16px 0; font-size: 16px;">Thanks for reaching out to JiTpro. I've received your message.</p>
            <p style="margin: 0 0 16px 0; font-size: 16px;">I review every inquiry personally and will follow up with you directly to learn more about your company, your project, and where you're experiencing challenges.</p>
            <p style="margin: 0 0 16px 0; font-size: 16px;">There's nothing else you need to do right now. We'll start with a conversation and see whether JiTpro is a good fit for your next project.</p>
            <p style="margin: 0 0 16px 0; font-size: 16px;">Talk soon,</p>
            <p style="margin: 0; font-size: 16px;"><strong>Jeff Kaufman</strong><br>Founder, JiTpro</p>
          </td>
        </tr>
      </table>
    `;

    console.log("Preparing outbound emails", { requestId });

    const internalEmailPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "JITpro Leads <jeff@jit-pro.com>",
        to: ["info@jit-pro.com"],
        subject: "New JiTpro Contact Form Lead",
        html: internalEmailHtml,
      }),
    });

    const visitorEmailPromise: Promise<Response | null> = trimmedEmail
      ? fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "JiTpro <info@jit-pro.com>",
            to: [trimmedEmail],
            subject: "Thank you for contacting JiTpro",
            html: visitorEmailHtml,
          }),
        })
      : Promise.resolve(null);

    const [internalEmailOutcome, visitorEmailOutcome] = await Promise.allSettled([
      internalEmailPromise,
      visitorEmailPromise,
    ]);

    let internalFailure = UNKNOWN_EMAIL_FAILURE;
    let visitorFailure = UNKNOWN_EMAIL_FAILURE;
    let internalEmailSucceeded = false;
    let visitorEmailSucceeded = false;
    let internalErrorDetails = "";

    if (internalEmailOutcome.status === "fulfilled") {
      const response = internalEmailOutcome.value;
      const body = await response.text();
      console.log("Internal email status:", { requestId, status: response.status, body });
      internalEmailSucceeded = response.ok;
      if (!response.ok) {
        internalErrorDetails = body;
        internalFailure = describeEmailRefusal(response.status);
        console.error("Internal email failed at Resend API level", { requestId, body });
      }
    } else {
      internalErrorDetails = String(internalEmailOutcome.reason);
      internalFailure = EMAIL_SERVICE_UNREACHABLE;
      console.error("Internal email connection crashed", { requestId, error: internalEmailOutcome.reason });
    }

    if (!trimmedEmail) {
      console.log("No visitor email present, skipping confirmation email", { requestId });
    } else if (visitorEmailOutcome.status === "fulfilled" && visitorEmailOutcome.value !== null) {
      const res = visitorEmailOutcome.value;
      const body = await res.text();
      console.log("Visitor email status:", { requestId, status: res.status, body });
      visitorEmailSucceeded = res.ok;
      if (!res.ok) {
        visitorFailure = describeEmailRefusal(res.status);
        console.warn("Visitor email failed at API level (likely bad email address)", { requestId, body });
      }
    } else if (visitorEmailOutcome.status === "rejected") {
      console.warn("Visitor email connection crashed", { requestId, error: visitorEmailOutcome.reason });
      visitorFailure = EMAIL_SERVICE_UNREACHABLE;
    } else {
      // Should be unreachable given the checks above — logged loudly so a
      // future change to this logic can't silently break this case.
      console.error("Unexpected visitor email outcome state — investigate", {
        requestId,
        status: visitorEmailOutcome.status,
      });
    }

    if (!internalEmailSucceeded) {
      await sendFailureAlert({
        resendApiKey,
        requestId,
        leadId: lead.id,
        alertRecipient,
        failedEmail: "team",
        failure: internalFailure,
      });
    }

    if (trimmedEmail && !visitorEmailSucceeded) {
      await sendFailureAlert({
        resendApiKey,
        requestId,
        leadId: lead.id,
        alertRecipient,
        failedEmail: "visitor",
        failure: visitorFailure,
      });
    }

    if (!internalEmailSucceeded) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Internal email send failed",
          details: internalErrorDetails,
          request_id: requestId,
          internal_sent: internalEmailSucceeded,
          visitor_sent: visitorEmailSucceeded,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({
        ok: true,
        request_id: requestId,
        internal_sent: internalEmailSucceeded,
        visitor_sent: visitorEmailSucceeded,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-contact-notification: exception", error, { requestId });
    return new Response(
      JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
