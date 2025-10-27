import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Phone, Mail, FileText, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReviewDialog from "@/components/ReviewDialog";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  service_description: string;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  status: string;
  created_at: string;
  professional_id: string;
  payment_status: string;
  amount: number;
  professionals?: {
    id: string;
    name: string;
    specialty: string;
    phone: string | null;
  };
}

const Projects = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProfessional, setIsProfessional] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [payingBooking, setPayingBooking] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Get professional profile
      const { data: professional } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (professional) {
        setIsProfessional(true);
        // Fetch bookings for this professional
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("professional_id", professional.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } else {
        // Fetch bookings made by this customer
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            professionals (
              id,
              name,
              specialty,
              phone
            )
          `)
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Booking ${newStatus}`,
      });

      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const confirmCompletion = async (bookingId: string) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed_completed" })
        .eq("id", bookingId);

      if (error) throw error;

      setSelectedBooking(booking);
      setReviewDialogOpen(true);

      toast({
        title: "Completion confirmed",
        description: "Please leave a review for the professional",
      });

      fetchBookings();
    } catch (error) {
      console.error("Error confirming completion:", error);
      toast({
        title: "Error",
        description: "Failed to confirm completion",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async (bookingId: string) => {
    setPayingBooking(bookingId);
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

      const { data, error } = await supabase.functions.invoke("create-booking-payment", {
        body: { bookingId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Error creating payment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start payment",
        variant: "destructive",
      });
    } finally {
      setPayingBooking(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "completed":
        return "bg-orange-500";
      case "confirmed_completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "unpaid":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed_completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Your Bookings</h1>
          {isProfessional && (
            <Button onClick={() => navigate("/my-listing")}>
              Manage Listing
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>Loading...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No bookings yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>
                      {isProfessional ? booking.customer_name : booking.professionals?.name}
                    </CardTitle>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusLabel(booking.status)}
                      </Badge>
                      {!isProfessional && (
                        <Badge className={getPaymentStatusColor(booking.payment_status)}>
                          {booking.payment_status}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!isProfessional && booking.professionals && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {booking.professionals.specialty}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {booking.payment_status !== "paid" && !isProfessional && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium mb-2">⚠️ Payment Required</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Complete payment to confirm your booking and share your contact details with the professional.
                      </p>
                      <Button 
                        onClick={() => handlePayment(booking.id)}
                        disabled={payingBooking === booking.id}
                        className="w-full"
                      >
                        {payingBooking === booking.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay $${booking.amount.toFixed(2)}`
                        )}
                      </Button>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {isProfessional ? (
                        <>
                          {booking.payment_status === "paid" ? (
                            <>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <a href={`tel:${booking.customer_phone}`} className="text-primary hover:underline">
                                  {booking.customer_phone}
                                </a>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <a href={`mailto:${booking.customer_email}`} className="text-primary hover:underline">
                                  {booking.customer_email}
                                </a>
                              </div>
                              <div className="flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <span>{booking.customer_address}</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                              Contact details will be revealed after payment is completed.
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {booking.professionals?.phone && booking.payment_status === "paid" && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <a href={`tel:${booking.professionals.phone}`} className="text-primary hover:underline">
                                {booking.professionals.phone}
                              </a>
                            </div>
                          )}
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span>{booking.customer_address}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(booking.preferred_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.preferred_time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Service:</p>
                        <p>{booking.service_description}</p>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Notes:</p>
                          <p className="text-muted-foreground">{booking.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {isProfessional ? (
                    <>
                      {booking.status === "pending" && booking.payment_status === "paid" && (
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={() => updateStatus(booking.id, "confirmed")}
                            className="flex-1"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => updateStatus(booking.id, "cancelled")}
                            variant="destructive"
                            className="flex-1"
                          >
                            Decline
                          </Button>
                        </div>
                      )}

                      {booking.status === "confirmed" && booking.payment_status === "paid" && (
                        <Button
                          onClick={() => updateStatus(booking.id, "completed")}
                          className="w-full"
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {booking.status === "completed" && booking.payment_status === "paid" && (
                        <div className="space-y-3 pt-4">
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-medium">
                              Professional marked this job as completed
                            </span>
                          </div>
                          <Button
                            onClick={() => confirmCompletion(booking.id)}
                            className="w-full"
                          >
                            Confirm Completion & Leave Review
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <BottomNav />

      {selectedBooking && selectedBooking.professionals && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          professionalId={selectedBooking.professional_id}
          professionalName={selectedBooking.professionals.name}
          bookingId={selectedBooking.id}
          onReviewSubmitted={fetchBookings}
        />
      )}
    </div>
  );
};

export default Projects;
