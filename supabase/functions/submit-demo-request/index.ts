import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DemoRequest {
  name: string;
  company: string;
  email: string;
  phone: string;
  role: string;
}

Deno.serve(async (req: Request) => {
  // Generate request ID for log correlation
  const requestId = crypto.randomUUID();

  console.log("A: handler start", { requestId });

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    console.log("OPTIONS preflight handled", { requestId });
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Check environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    console.log("B: RESEND_API_KEY present:", Boolean(resendApiKey), { requestId });
    console.log("B: SUPABASE_URL present:", Boolean(supabaseUrl), { requestId });
    console.log("B: SUPABASE_SERVICE_ROLE_KEY present:", Boolean(supabaseKey), { requestId });

    // Parse request body safely
    let body: DemoRequest;
    try {
      body = await req.json();
      console.log("C: request body parsed", { requestId });
    } catch (parseError) {
      console.error("JSON parse error:", parseError, { requestId });
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Invalid JSON",
          request_id: requestId
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { name, company, email, phone, role } = body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!name) missingFields.push("name");
    if (!company) missingFields.push("company");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!role) missingFields.push("role");

    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields, { requestId });
      return new Response(
        JSON.stringify({
          ok: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
          request_id: requestId
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Store the demo request in the database
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase environment variables missing", { requestId });
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Server configuration error",
          request_id: requestId
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("C: storing to database", { requestId });
    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/demo_requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        name,
        company,
        email,
        phone,
        role,
      }),
    });

    if (!dbResponse.ok) {
      const dbError = await dbResponse.text();
      console.error("Database insert failed:", dbResponse.status, dbError, { requestId });
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Failed to store demo request",
          request_id: requestId
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("C: database insert successful", { requestId });

    // Send email notification to jeff@jit-pro.com
    let emailOk = false;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY missing; skipping email send", { requestId });
    } else {
      try {
        console.log("D: sending to Resend", { requestId });

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "JITpro Demo Requests <jeff@jit-pro.com>",
            to: ["jeff@jit-pro.com"],
            subject: `New Demo Request: ${company}`,
            html: `
              <h2>New Demo Request Submitted</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Company:</strong> ${company}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Role:</strong> ${role}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            `,
          }),
        });

        console.log("E: Resend returned", { requestId });
        console.log("Resend status:", emailResponse.status, { requestId });

        const resendBody = await emailResponse.text();
        console.log("Resend body:", resendBody, { requestId });

        emailOk = emailResponse.ok;

        if (!emailOk) {
          console.error("Resend API returned non-2xx status", {
            requestId,
            status: emailResponse.status,
            body: resendBody
          });
        }
      } catch (emailError) {
        console.error("Fetch/network error calling Resend:", emailError, { requestId });
        emailOk = false;
      }
    }

    // Always return success if DB insert worked, even if email failed
    return new Response(
      JSON.stringify({
        ok: true,
        email_ok: emailOk,
        request_id: requestId
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Z: handler exception", error, { requestId });

    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
        request_id: requestId
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
