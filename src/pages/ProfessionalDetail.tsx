import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, DollarSign, CheckCircle2, ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import BookingDialog from "@/components/BookingDialog";
import ContactDialog from "@/components/ContactDialog";

const ProfessionalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const { data: professional, isLoading: professionalLoading } = useQuery({
    queryKey: ['professional', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const { data: ratingData } = await supabase
        .rpc('get_professional_rating', { professional_id: id });

      return {
        ...data,
        rating: ratingData?.[0]?.average_rating || 0,
        review_count: ratingData?.[0]?.review_count || 0,
      };
    },
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('professional_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (professionalLoading || !professional) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <SimpleHeader />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center">Loading...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={professional.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {professional.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{professional.name}</CardTitle>
                  {professional.verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <Badge variant="secondary" className="mb-2">
                  {professional.specialty}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{professional.rating.toFixed(1)}</span>
                    <span>({professional.review_count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${professional.hourly_rate}/hr</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setShowContactDialog(true)} variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Button onClick={() => setShowBookingDialog(true)}>
                  Book Now
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {professional.bio && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{professional.bio}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-2">Service Areas</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{professional.service_zipcodes.join(', ')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews ({professional.review_count})</CardTitle>
          </CardHeader>
          <CardContent>
            {reviewsLoading ? (
              <p className="text-center text-muted-foreground">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reviews yet. Be the first to leave a review!
              </p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review: any) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">Anonymous User</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <BottomNav />

      {showBookingDialog && professional && (
        <BookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          professionalId={professional.id}
          professionalName={professional.name}
          specialty={professional.specialty}
          hourlyRate={professional.hourly_rate}
        />
      )}

      {showContactDialog && professional && (
        <ContactDialog
          open={showContactDialog}
          onOpenChange={setShowContactDialog}
          professionalId={professional.id}
          professionalName={professional.name}
          phone={professional.phone}
          specialty={professional.specialty}
          serviceZipcodes={professional.service_zipcodes}
        />
      )}
    </div>
  );
};

export default ProfessionalDetail;
