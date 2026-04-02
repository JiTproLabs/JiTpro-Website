import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InvestorRequest {
  name: string;
  email: string;
  company: string;
  investment_interest?: string;
  website?: string; // honeypot
  turnstileToken: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body: InvestorRequest = await req.json();
    const { name, email, company, investment_interest, website, turnstileToken } =
      body;

    // Honeypot check — if filled, silently succeed
    if (website) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate required fields
    if (!name || !email || !company) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate Turnstile token
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (turnstileSecret && turnstileToken) {
      const verifyResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken,
          }),
        }
      );
      const verifyResult = await verifyResponse.json();
      if (!verifyResult.success) {
        return new Response(
          JSON.stringify({ ok: false, error: "Verification failed" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Store in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const dbResponse = await fetch(
      `${supabaseUrl}/rest/v1/investor_access`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          name,
          email,
          company,
          investment_interest: investment_interest || null,
          status: "pending",
        }),
      }
    );

    if (!dbResponse.ok) {
      const dbError = await dbResponse.text();
      console.error("DB insert failed:", dbError);
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to store request" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const [record] = await dbResponse.json();

    // Send notification email to info@jit-pro.com
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const approveUrl = `${supabaseUrl}/functions/v1/approve-investor?id=${record.id}&key=${Deno.env.get("ADMIN_PASSWORD") || ""}`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "JiTpro Investor Requests <noreply@mail.jit-pro.com>",
          to: ["info@jit-pro.com"],
          subject: `Investor Access Request: ${company}`,
          html: `
            <h2>New Investor Access Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Interest:</strong> ${investment_interest || "Not provided"}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <br/>
            <a href="${approveUrl}" style="display:inline-block;padding:12px 24px;background-color:#f59e0b;color:#1e293b;font-weight:bold;text-decoration:none;border-radius:4px;">
              Approve Access
            </a>
            <br/><br/>
            <p style="color:#999;font-size:12px;">Clicking Approve will send the investor an email with their access link.</p>
          `,
        }),
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Handler error:", error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
