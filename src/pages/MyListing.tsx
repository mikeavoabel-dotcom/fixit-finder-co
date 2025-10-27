import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  hourly_rate: number;
  bio: string | null;
  phone: string | null;
  service_zipcodes: string[];
  is_sponsored: boolean;
  stripe_account_id: string | null;
  stripe_onboarding_complete: boolean;
}

const MyListing = () => {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfessional();
    
    // Check for payment success
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      verifyPayment(sessionId);
    }

    // Check for onboarding completion
    const onboarding = searchParams.get("onboarding");
    if (onboarding === "complete") {
      checkStripeAccount();
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-promotion-payment", {
        body: { session_id: sessionId },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Success!",
          description: "Your profile has been promoted!",
        });
        fetchProfessional();
        navigate("/my-listing", { replace: true });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const fetchProfessional = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setProfessional(data);
    } catch (error) {
      console.error("Error fetching professional:", error);
      toast({
        title: "Error",
        description: "You don't have a professional profile yet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!professional) return;

    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const zipcodes = (formData.get("zipcodes") as string).split(",").map(z => z.trim());

      const { error } = await supabase
        .from("professionals")
        .update({
          name: formData.get("name") as string,
          specialty: formData.get("specialty") as string,
          hourly_rate: parseFloat(formData.get("hourly_rate") as string),
          bio: formData.get("bio") as string,
          phone: formData.get("phone") as string,
          service_zipcodes: zipcodes,
        })
        .eq("id", professional.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your listing has been updated",
      });
      fetchProfessional();
    } catch (error) {
      console.error("Error updating professional:", error);
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePromote = async () => {
    setPromoting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-promotion-payment", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating promotion payment:", error);
      toast({
        title: "Error",
        description: "Failed to start promotion payment",
        variant: "destructive",
      });
    } finally {
      setPromoting(false);
    }
  };

  const handleConnectStripe = async () => {
    setConnectingStripe(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("connect-stripe-account", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error connecting Stripe account:", error);
      toast({
        title: "Error",
        description: "Failed to connect payment account",
        variant: "destructive",
      });
    } finally {
      setConnectingStripe(false);
    }
  };

  const checkStripeAccount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      const { data, error } = await supabase.functions.invoke("check-stripe-account", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.complete) {
        toast({
          title: "Success!",
          description: "Your payment account is now connected",
        });
        fetchProfessional();
        navigate("/my-listing", { replace: true });
      }
    } catch (error) {
      console.error("Error checking Stripe account:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <SimpleHeader />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <SimpleHeader />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">You don't have a professional profile yet</p>
            <Button onClick={() => navigate("/become-pro")}>Become a Pro</Button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-foreground">My Listing</h1>
          {professional.is_sponsored && (
            <Badge className="bg-yellow-500">
              <Sparkles className="w-4 h-4 mr-1" />
              Promoted
            </Badge>
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={professional.name}
                  required
                />
              </div>

              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  defaultValue={professional.specialty}
                  required
                />
              </div>

              <div>
                <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                <Input
                  id="hourly_rate"
                  name="hourly_rate"
                  type="number"
                  step="0.01"
                  defaultValue={professional.hourly_rate}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={professional.phone || ""}
                />
              </div>

              <div>
                <Label htmlFor="zipcodes">Service Zipcodes (comma-separated)</Label>
                <Input
                  id="zipcodes"
                  name="zipcodes"
                  defaultValue={professional.service_zipcodes.join(", ")}
                  placeholder="12345, 67890"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  defaultValue={professional.bio || ""}
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {!professional.stripe_onboarding_complete && (
          <Card className="mb-6 border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <CardTitle>⚠️ Payment Setup Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                To receive bookings and payments through BlueCaller, you need to connect your payment account. 
                This is required to ensure all transactions are secure and you get paid for your services.
              </p>
              <Button onClick={handleConnectStripe} disabled={connectingStripe} className="w-full">
                {connectingStripe ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Payment Account"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {!professional.is_sponsored && professional.stripe_onboarding_complete && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Promote Your Listing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get featured at the top of search results for 30 days. Increase your visibility and get more bookings!
              </p>
              <Button onClick={handlePromote} disabled={promoting} className="w-full">
                {promoting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Promote for $5
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default MyListing;
