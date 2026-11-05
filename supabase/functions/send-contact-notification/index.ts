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

Deno.serve(async (req: Request) => {
  const requestId = crypto.randomUUID();
  console.log("send-contact-notification: start", { requestId });

  // Diagnostic only: log whether the request carries the expected token.
  // Nothing is rejected. The token value is never written to the logs.
  const expectedSecret = Deno.env.get("NOTIFY_WEBHOOK_SECRET");
  const presentedSecret = req.headers.get("x-notify-secret") ?? "";
  console.log("caller token check (diagnostic)", {
    requestId,
    configured: Boolean(expectedSecret),
    matches: Boolean(expectedSecret) && presentedSecret === expectedSecret,
  });

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY missing", { requestId });
      return new Response(
        JSON.stringify({ ok: false, error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

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
        console.error("Internal email failed at Resend API level", { requestId, body });
      }
    } else {
      internalErrorDetails = String(internalEmailOutcome.reason);
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
        console.warn("Visitor email failed at API level (likely bad email address)", { requestId, body });
      }
    } else if (visitorEmailOutcome.status === "rejected") {
      console.warn("Visitor email connection crashed", { requestId, error: visitorEmailOutcome.reason });
    } else {
      // Should be unreachable given the checks above — logged loudly so a
      // future change to this logic can't silently break this case.
      console.error("Unexpected visitor email outcome state — investigate", {
        requestId,
        status: visitorEmailOutcome.status,
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
