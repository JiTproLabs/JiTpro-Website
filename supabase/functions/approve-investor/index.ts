import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const key = url.searchParams.get("key");

  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  if (!adminPassword || key !== adminPassword) {
    return new Response(htmlPage("Unauthorized", "Invalid admin key."), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (!id) {
    return new Response(htmlPage("Error", "Missing request ID."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Fetch the request
    const fetchResponse = await fetch(
      `${supabaseUrl}/rest/v1/investor_access?id=eq.${id}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    const records = await fetchResponse.json();
    if (!records.length) {
      return new Response(htmlPage("Not Found", "Request not found."), {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    }

    const record = records[0];

    if (record.status === "approved") {
      return new Response(
        htmlPage("Already Approved", `Access was already granted to ${record.name} (${record.email}).`),
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    // Generate access token
    const accessToken = crypto.randomUUID();

    // Update record
    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/investor_access?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          status: "approved",
          access_token: accessToken,
          approved_at: new Date().toISOString(),
        }),
      }
    );

    if (!updateResponse.ok) {
      const err = await updateResponse.text();
      console.error("Update failed:", err);
      return new Response(htmlPage("Error", "Failed to approve request."), {
        status: 500,
        headers: { "Content-Type": "text/html" },
      });
    }

    // Send access email to investor
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const siteUrl = Deno.env.get("SITE_URL") || "https://jit-pro.com/JiTpro-Website";

    if (resendApiKey) {
      const accessLink = `${siteUrl}/investor?token=${accessToken}`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "JiTpro <jeff@jit-pro.com>",
          to: [record.email],
          subject: "Your JiTpro Investor Access",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
              <h2 style="color: #1e293b; margin-bottom: 24px;">Investor Access Granted</h2>
              <p style="color: #475569; line-height: 1.6;">
                Hello ${record.name},
              </p>
              <p style="color: #475569; line-height: 1.6;">
                Your request to access the JiTpro investor briefing has been approved. Use the link below to access the investor site.
              </p>
              <p style="margin: 32px 0;">
                <a href="${accessLink}" style="display:inline-block;padding:14px 28px;background-color:#f59e0b;color:#1e293b;font-weight:bold;text-decoration:none;border-radius:4px;">
                  Access Investor Briefing
                </a>
              </p>
              <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
                This link is unique to you. Bookmark it for future access. If you have questions, reply to this email.
              </p>
            </div>
          `,
        }),
      });
    }

    return new Response(
      htmlPage(
        "Access Granted",
        `Access has been granted to <strong>${record.name}</strong> (${record.email}).<br/><br/>An email with their access link has been sent.`
      ),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("Approve error:", error);
    return new Response(htmlPage("Error", "An unexpected error occurred."), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
});

function htmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>JiTpro — ${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 40px; max-width: 480px; text-align: center; }
    h1 { color: #f59e0b; font-size: 24px; margin: 0 0 16px; }
    p { color: #94a3b8; line-height: 1.6; margin: 0; }
    strong { color: #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
