import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, DollarSign, MapPin, Clock, Loader2 } from "lucide-react";

interface QuoteRequest {
  id: string;
  service_category: string;
  project_description: string;
  zipcode: string;
  timeline: string;
  budget: string;
  created_at: string;
}

interface QuoteResponse {
  id: string;
  professional_id: string;
  quote_amount: number;
  quote_details: string;
  response_order: number;
  professionals: {
    name: string;
  };
}

const QuoteRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
  const [responses, setResponses] = useState<QuoteResponse[]>([]);
  const [isProfessional, setIsProfessional] = useState(false);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteDetails, setQuoteDetails] = useState("");
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    fetchQuoteRequest();
  }, [id]);

  const fetchQuoteRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user is a professional
      const { data: professional } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (professional) {
        setIsProfessional(true);
        setProfessionalId(professional.id);
      }

      // Fetch quote request
      const { data: request, error: requestError } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (requestError) throw requestError;
      if (!request) {
        toast({
          title: "Quote request not found",
          description: "This quote request may have been deleted or you don't have access to it.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      setQuoteRequest(request);

      // Fetch responses
      const { data: responsesData, error: responsesError } = await supabase
        .from("quote_responses")
        .select(`
          *,
          professionals (
            name
          )
        `)
        .eq("quote_request_id", id)
        .order("response_order", { ascending: true });

      if (responsesError) throw responsesError;
      setResponses(responsesData || []);

      // Check if current professional has responded
      if (professional && responsesData) {
        const hasResponse = responsesData.some(r => r.professional_id === professional.id);
        setHasResponded(hasResponse);
      }
    } catch (error) {
      console.error("Error fetching quote request:", error);
      toast({
        title: "Error",
        description: "Failed to load quote request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professionalId || !quoteRequest) return;

    setSubmitting(true);
    try {
      const responseOrder = responses.length + 1;

      if (responseOrder > 3) {
        toast({
          title: "Limit Reached",
          description: "This request already has 3 quotes",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("quote_responses")
        .insert({
          quote_request_id: quoteRequest.id,
          professional_id: professionalId,
          quote_amount: parseFloat(quoteAmount),
          quote_details: quoteDetails,
          response_order: responseOrder,
        });

      if (error) throw error;

      toast({
        title: "Quote Submitted!",
        description: "The customer will receive your quote shortly",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Error",
        description: "Failed to submit quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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

  if (!quoteRequest) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <SimpleHeader />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <p className="text-muted-foreground">Quote request not found</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const canRespond = isProfessional && !hasResponded && responses.length < 3;

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Quote Request</h1>
            <Badge className="bg-primary">{quoteRequest.service_category}</Badge>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <p className="text-foreground">{quoteRequest.project_description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>Zipcode: {quoteRequest.zipcode}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Timeline: {quoteRequest.timeline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>Budget: {quoteRequest.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Posted: {new Date(quoteRequest.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {responses.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Received Quotes ({responses.length}/3)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {responses.map((response, index) => (
                  <div key={response.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Quote #{index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {response.professionals.name}
                        </p>
                      </div>
                      <Badge className="bg-green-500">
                        ${response.quote_amount.toFixed(2)}
                      </Badge>
                    </div>
                    {response.quote_details && (
                      <p className="text-sm mt-2">{response.quote_details}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {canRespond ? (
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitQuote} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quote Amount ($) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter your quote amount"
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quote Details
                    </label>
                    <Textarea
                      placeholder="Provide additional details about your quote, timeline, or services included..."
                      value={quoteDetails}
                      onChange={(e) => setQuoteDetails(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Quote"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            !isProfessional && (
              <Card className="bg-accent/50">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Waiting for quotes from professionals...
                  </p>
                </CardContent>
              </Card>
            )
          )}

          {hasResponded && (
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="py-8 text-center">
                <p className="text-foreground font-medium">
                  ✓ You have already submitted a quote for this request
                </p>
              </CardContent>
            </Card>
          )}

          {isProfessional && responses.length >= 3 && !hasResponded && (
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="py-8 text-center">
                <p className="text-foreground font-medium">
                  This request already has 3 quotes
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default QuoteRequest;
