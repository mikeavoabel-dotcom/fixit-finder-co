import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Clock, DollarSign, MapPin, MessageCircle, Check, X } from "lucide-react";

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
  quote_amount: number;
  quote_details: string;
  response_order: number;
  created_at: string;
  quote_request_id: string;
  quote_requests: QuoteRequest;
  professionals: {
    name: string;
  };
}

interface MyQuoteRequest extends QuoteRequest {
  quote_responses: Array<{
    id: string;
    quote_amount: number;
    quote_details: string;
    created_at: string;
    status: string;
    professional_id: string;
    professionals: {
      name: string;
      user_id: string;
    };
  }>;
}

const YourQuotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [isProfessional, setIsProfessional] = useState(false);
  const [myRequests, setMyRequests] = useState<MyQuoteRequest[]>([]);
  const [myResponses, setMyResponses] = useState<QuoteResponse[]>([]);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
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

      setIsProfessional(!!professional);

      // Fetch quote requests made by this customer
      const { data: requests, error: requestsError } = await supabase
        .from("quote_requests")
        .select(`
          *,
          quote_responses (
            id,
            quote_amount,
            quote_details,
            created_at,
            status,
            professional_id,
            professionals (
              name,
              user_id
            )
          )
        `)
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (requestsError) throw requestsError;
      setMyRequests(requests || []);

      // If professional, fetch their quote responses
      if (professional) {
        const { data: responses, error: responsesError } = await supabase
          .from("quote_responses")
          .select(`
            *,
            quote_requests (*),
            professionals (
              name
            )
          `)
          .eq("professional_id", professional.id)
          .order("created_at", { ascending: false });

        if (responsesError) throw responsesError;
        setMyResponses(responses || []);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleUpdateQuoteStatus = async (quoteResponseId: string, newStatus: 'accepted' | 'declined') => {
    setUpdating(quoteResponseId);
    try {
      const updateData: any = { status: newStatus };
      
      // If accepting, set the accepted_at timestamp
      if (newStatus === 'accepted') {
        updateData.accepted_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from("quote_responses")
        .update(updateData)
        .eq("id", quoteResponseId);

      if (error) throw error;

      toast({
        title: newStatus === 'accepted' ? "Quote Accepted!" : "Quote Declined",
        description: newStatus === 'accepted' 
          ? "The professional has been notified and has 10 minutes to respond." 
          : "The quote has been declined.",
      });

      // Refresh quotes
      await fetchQuotes();
    } catch (error) {
      console.error("Error updating quote status:", error);
      toast({
        title: "Error",
        description: "Failed to update quote status",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleMessagePro = (userId: string) => {
    navigate(`/conversation/${userId}`);
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold mb-6">Your Quotes</h1>

        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          {/* Received Quotes (Quote Requests & Their Responses) */}
          <TabsContent value="received" className="space-y-4 mt-6">
            {myRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No quote requests yet</p>
                </CardContent>
              </Card>
            ) : (
              myRequests.map((request) => (
                <Card
                  key={request.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/quote-request/${request.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {request.service_category}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {request.zipcode}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {request.timeline}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {request.budget}
                          </div>
                        </div>
                      </div>
                      <Badge variant={request.quote_responses?.length > 0 ? "default" : "secondary"}>
                        {request.quote_responses?.length || 0} {request.quote_responses?.length === 1 ? "Quote" : "Quotes"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {request.project_description}
                    </p>
                    
                    {request.quote_responses && request.quote_responses.length > 0 && (
                      <div className="space-y-3 mt-4 pt-4 border-t">
                        <p className="text-sm font-semibold">Quotes Received:</p>
                        {request.quote_responses.map((response) => (
                          <div key={response.id} className="bg-accent/50 p-3 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{response.professionals.name}</span>
                                  {response.status !== 'pending' && (
                                    <Badge variant={response.status === 'accepted' ? 'default' : 'secondary'}>
                                      {response.status}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-lg font-bold text-primary">
                                  ${response.quote_amount}
                                </span>
                              </div>
                            </div>
                            {response.quote_details && (
                              <p className="text-sm text-muted-foreground mb-3">
                                {response.quote_details}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mb-3">
                              {formatDate(response.created_at)}
                            </p>
                            
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMessagePro(response.professionals.user_id);
                                }}
                                className="flex items-center gap-1"
                              >
                                <MessageCircle className="w-4 h-4" />
                                Message
                              </Button>
                              
                              {/* Show Accept button if not accepted yet */}
                              {response.status !== 'accepted' && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateQuoteStatus(response.id, 'accepted');
                                  }}
                                  disabled={updating === response.id}
                                  className="flex items-center gap-1"
                                >
                                  {updating === response.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Check className="w-4 h-4" />
                                  )}
                                  Accept
                                </Button>
                              )}
                              
                              {/* Show Decline button only if pending */}
                              {response.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateQuoteStatus(response.id, 'declined');
                                  }}
                                  disabled={updating === response.id}
                                  className="flex items-center gap-1"
                                >
                                  <X className="w-4 h-4" />
                                  Decline
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-4">
                      Posted {formatDate(request.created_at)}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Sent Quotes (Responses Submitted) */}
          <TabsContent value="sent" className="space-y-4 mt-6">
            {!isProfessional ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Only professionals can send quotes</p>
                </CardContent>
              </Card>
            ) : myResponses.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No quotes sent yet</p>
                </CardContent>
              </Card>
            ) : (
              myResponses.map((response) => (
                <Card
                  key={response.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/quote-request/${response.quote_request_id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {response.quote_requests.service_category}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {response.quote_requests.zipcode}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {response.quote_requests.timeline}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ${response.quote_amount}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          Quote #{response.response_order}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Project:</strong> {response.quote_requests.project_description}
                    </p>
                    
                    {response.quote_details && (
                      <div className="bg-accent/50 p-3 rounded-lg mb-3">
                        <p className="text-sm font-semibold mb-1">Your Quote Details:</p>
                        <p className="text-sm text-muted-foreground">
                          {response.quote_details}
                        </p>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      Sent {formatDate(response.created_at)}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default YourQuotes;