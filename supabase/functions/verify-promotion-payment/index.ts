import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { session_id } = await req.json();
    
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    console.log("Verifying payment for session:", session_id);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the session to check payment status
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    console.log("Session status:", session.payment_status, "User ID:", session.metadata?.user_id);

    if (session.payment_status === "paid" && session.metadata?.user_id) {
      const userId = session.metadata.user_id;
      
      // Get professional profile
      const { data: professional, error: fetchError } = await supabaseClient
        .from("professionals")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (fetchError || !professional) {
        console.error("Error fetching professional:", fetchError);
        throw new Error("Professional profile not found");
      }

      // Update is_sponsored to true
      const { error: updateError } = await supabaseClient
        .from("professionals")
        .update({ is_sponsored: true })
        .eq("id", professional.id);

      if (updateError) {
        console.error("Error updating sponsored status:", updateError);
        throw new Error("Failed to update sponsored status");
      }

      console.log("Successfully promoted professional:", professional.id);

      return new Response(
        JSON.stringify({ success: true, message: "Profile promoted successfully" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Payment not completed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error verifying promotion payment:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
