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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { serviceCategory, projectDescription, zipcode, name, email, phone, timeline, budget } = await req.json();

    console.log("Creating quote request for:", user.id, "Category:", serviceCategory);

    // Create quote request
    const { data: quoteRequest, error: quoteError } = await supabaseClient
      .from("quote_requests")
      .insert({
        customer_id: user.id,
        service_category: serviceCategory,
        project_description: projectDescription,
        zipcode: zipcode,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        timeline: timeline,
        budget: budget,
      })
      .select()
      .single();

    if (quoteError) throw quoteError;

    // Find matching professionals (search by specialty and zipcode)
    const { data: professionals, error: profError } = await supabaseClient
      .from("professionals")
      .select("id, user_id, name, specialty, service_zipcodes")
      .ilike("specialty", `%${serviceCategory}%`);

    if (profError) {
      console.error("Error finding professionals:", profError);
    }

    // Filter professionals by zipcode (client-side filtering since contains might not work as expected)
    const matchingProfessionals = professionals?.filter(prof => 
      prof.service_zipcodes && prof.service_zipcodes.includes(zipcode)
    ) || [];

    console.log(`Found ${matchingProfessionals.length} matching professionals for ${serviceCategory} in ${zipcode}`);

    // Create notifications for matching professionals
    if (matchingProfessionals.length > 0) {
      const notifications = matchingProfessionals.map(prof => ({
        user_id: prof.user_id,
        title: "New Quote Request",
        message: `New ${serviceCategory} quote request in ${zipcode}. Be one of the first 3 to respond!`,
        link: `/quote-request/${quoteRequest.id}`,
      }));

      const { error: notifError } = await supabaseClient
        .from("notifications")
        .insert(notifications);

      if (notifError) {
        console.error("Error creating notifications:", notifError);
      } else {
        console.log(`Created ${notifications.length} notifications for professionals`);
      }
    } else {
      console.log("No matching professionals found for this request");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        quoteRequestId: quoteRequest.id,
        professionalsNotified: matchingProfessionals.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error submitting quote request:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
