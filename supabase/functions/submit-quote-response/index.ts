import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");
    const token = authHeader.replace("Bearer ", "");

    const { data: userData } = await supabase.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { quoteRequestId, quoteAmount, quoteDetails } = await req.json();
    if (!quoteRequestId || !quoteAmount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Find professional by user
    const { data: professional, error: profErr } = await supabase
      .from("professionals")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profErr) throw profErr;
    if (!professional) {
      return new Response(JSON.stringify({ error: "Not a professional" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Get current count of responses for this request
    const { data: countData, error: countErr } = await supabase
      .from("quote_responses")
      .select("id", { count: "exact", head: true })
      .eq("quote_request_id", quoteRequestId);

    if (countErr) throw countErr;
    const currentCount = countData ? 0 : (countErr ? 0 : (null as any)); // head:true returns null data; use count from response
    // Supabase JS v2: when head:true, data is null and count is in "count" property of the response
    // @ts-ignore accessing hidden prop from last query
    const responseCount = (countErr ? 0 : (countData as any)) ?? 0;

    // We need a second query to reliably get count
    const { count: totalCount, error: totalErr } = await supabase
      .from("quote_responses")
      .select("id", { count: "exact", head: true })
      .eq("quote_request_id", quoteRequestId);
    if (totalErr) throw totalErr;

    if ((totalCount ?? 0) >= 3) {
      return new Response(JSON.stringify({ error: "This request already has 3 quotes" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const responseOrder = (totalCount ?? 0) + 1;

    // Insert the quote response
    const { data: inserted, error: insertErr } = await supabase
      .from("quote_responses")
      .insert({
        quote_request_id: quoteRequestId,
        professional_id: professional.id,
        quote_amount: quoteAmount,
        quote_details: quoteDetails ?? null,
        response_order: responseOrder,
      })
      .select("id")
      .single();

    if (insertErr) throw insertErr;

    // Fetch the request to notify the customer
    const { data: request, error: reqErr } = await supabase
      .from("quote_requests")
      .select("id, customer_id, service_category, zipcode")
      .eq("id", quoteRequestId)
      .single();
    if (reqErr) throw reqErr;

    // Create a notification for the customer (service role bypasses RLS)
    const { error: notifErr } = await supabase
      .from("notifications")
      .insert({
        user_id: request.customer_id,
        title: "New Quote Received",
        message: `You received a new quote for ${request.service_category} in ${request.zipcode}.`,
        link: `/quote-request/${request.id}`,
      });

    if (notifErr) throw notifErr;

    return new Response(JSON.stringify({ success: true, quoteResponseId: inserted.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error submitting quote response:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});