import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LABELS: Record<string, string> = {
  full_name: "Full Name",
  business_name: "Business Name",
  email: "Email",
  phone: "Phone",
  monthly_revenue_range: "Monthly Revenue",
  funding_needed_range: "Funding Needed",
  purpose: "Purpose",
  source: "Source",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const application = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const FROM_EMAIL =
      Deno.env.get("APPLICATION_FROM_EMAIL") ??
      "Bayview Advance <onboarding@resend.dev>";
    const TO_EMAIL =
      Deno.env.get("APPLICATION_TO_EMAIL") ?? "submissions@bayviewadvance.com";

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const rows = Object.entries(application)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;color:#475569;font-weight:600">${
            LABELS[k] ?? k
          }</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a">${
            String(v ?? "")
          }</td></tr>`,
      )
      .join("");

    const businessName = application.business_name ?? "Unknown Business";
    const subject = `New Bayview Advance application: ${businessName}`;
    const html = `
      <div style="font-family:-apple-system,system-ui,sans-serif;max-width:640px;margin:0 auto">
        <h2 style="color:#1e3a5c">New Application Received</h2>
        <p style="color:#475569">A new application was submitted through the Bayview Advance website.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">${rows}</table>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: application.email,
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(
        JSON.stringify({ error: data.message ?? "Failed to send email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-application-email error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
