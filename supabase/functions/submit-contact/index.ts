import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  const requestId = crypto.randomUUID();
  console.log("submit-contact: start", { requestId });

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!turnstileSecret || !supabaseUrl || !supabaseKey) {
      console.error("Missing environment variables", {
        requestId,
        turnstile: Boolean(turnstileSecret),
        supabaseUrl: Boolean(supabaseUrl),
        supabaseKey: Boolean(supabaseKey),
      });
      return new Response(
        JSON.stringify({ ok: false, error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { turnstileToken, ...leadData } = body;

    // Validate Turnstile token
    if (!turnstileToken) {
      console.log("Missing Turnstile token", { requestId });
      return new Response(
        JSON.stringify({ ok: false, error: "Please complete the verification challenge" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Validating Turnstile token", { requestId });

    const turnstileResponse = await fetch(
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

    const turnstileResult = await turnstileResponse.json();
    console.log("Turnstile result:", { requestId, success: turnstileResult.success });

    if (!turnstileResult.success) {
      console.log("Turnstile verification failed", { requestId, errors: turnstileResult["error-codes"] });
      return new Response(
        JSON.stringify({ ok: false, error: "Verification failed. Please try again." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert lead into database
    console.log("Inserting lead", { requestId });

    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify(leadData),
    });

    if (!dbResponse.ok) {
      const dbError = await dbResponse.text();
      console.error("Database insert failed:", { requestId, status: dbResponse.status, error: dbError });
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to submit form" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Lead inserted successfully", { requestId });

    return new Response(
      JSON.stringify({ ok: true, request_id: requestId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("submit-contact: exception", error, { requestId });
    return new Response(
      JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
