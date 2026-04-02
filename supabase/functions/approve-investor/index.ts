import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const key = url.searchParams.get("key");

  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  if (!adminPassword || key !== adminPassword) {
    return new Response("Unauthorized: Invalid admin key.", { status: 403 });
  }

  if (!id) {
    return new Response("Error: Missing request ID.", { status: 400 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const siteUrl = Deno.env.get("SITE_URL") || "https://jit-pro.com";

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
      return new Response("Request not found.", { status: 404 });
    }

    const record = records[0];

    if (record.status === "approved") {
      const redirectUrl = `${siteUrl}/admin/approved?name=${encodeURIComponent(record.name)}&email=${encodeURIComponent(record.email)}&note=already`;
      return Response.redirect(redirectUrl, 302);
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
      return new Response("Failed to approve request.", { status: 500 });
    }

    // Send access email to investor
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (resendApiKey) {
      const accessLink = `${siteUrl}/investor?token=${accessToken}`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "JiTpro <noreply@mail.jit-pro.com>",
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

    const redirectUrl = `${siteUrl}/admin/approved?name=${encodeURIComponent(record.name)}&email=${encodeURIComponent(record.email)}`;
    return Response.redirect(redirectUrl, 302);
  } catch (error) {
    console.error("Approve error:", error);
    return new Response("An unexpected error occurred.", { status: 500 });
  }
});
