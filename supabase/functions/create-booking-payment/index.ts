import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLATFORM_FEE_PERCENT = 10;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const { bookingId } = await req.json();
    
    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    console.log("Creating payment for booking:", bookingId, "user:", user.id);

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .select(`
        *,
        professionals (
          id,
          name,
          hourly_rate,
          stripe_account_id,
          stripe_onboarding_complete
        )
      `)
      .eq("id", bookingId)
      .eq("customer_id", user.id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found");
    }

    const professional = booking.professionals as any;

    if (!professional.stripe_account_id || !professional.stripe_onboarding_complete) {
      throw new Error("Professional has not completed payment setup");
    }

    // Calculate amount (assuming 2 hours minimum for now)
    const hours = 2;
    const totalAmount = Math.round(professional.hourly_rate * hours * 100); // Convert to cents
    const platformFee = Math.round(totalAmount * (PLATFORM_FEE_PERCENT / 100));

    console.log("Amount:", totalAmount, "Platform fee:", platformFee);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create payment intent with application fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      customer: customerId,
      application_fee_amount: platformFee,
      transfer_data: {
        destination: professional.stripe_account_id,
      },
      metadata: {
        booking_id: bookingId,
        professional_id: professional.id,
        customer_id: user.id,
      },
    });

    // Update booking with payment info
    await supabaseClient
      .from("bookings")
      .update({
        payment_intent_id: paymentIntent.id,
        payment_status: "pending",
        amount: totalAmount / 100,
        platform_fee: platformFee / 100,
      })
      .eq("id", bookingId);

    console.log("Payment intent created:", paymentIntent.id);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      payment_intent: paymentIntent.id,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/projects?payment=success&booking=${bookingId}`,
      cancel_url: `${req.headers.get("origin")}/projects?payment=cancelled`,
    });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating booking payment:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
