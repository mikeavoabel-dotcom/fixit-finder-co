import { Star, MapPin, CheckCircle2, Crown, Users, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BookingDialog from "./BookingDialog";
import ContactDialog from "./ContactDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  bio: string | null;
  hourly_rate: number;
  service_zipcodes: string[];
  phone: string | null;
  avatar_url: string | null;
  verified: boolean;
  is_sponsored: boolean;
  total_jobs: number;
  rating?: number;
  review_count?: number;
}

interface ProfessionalListingsProps {
  searchQuery?: string;
  category?: string;
  zipcode?: string;
}

const ProfessionalListings = ({ searchQuery = "", category = "", zipcode = "" }: ProfessionalListingsProps) => {
  const { toast } = useToast();
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [sortBy, setSortBy] = useState<string>("rating-high");
  
  const { data: professionals = [], isLoading } = useQuery({
    queryKey: ['professionals', zipcode],
    queryFn: async () => {
      let query = supabase
        .from('professionals')
        .select('*');
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching professionals:', error);
        throw error;
      }

      // Fetch ratings for each professional
      const professionalsWithRatings = await Promise.all(
        (data || []).map(async (pro) => {
          const { data: ratingData } = await supabase
            .rpc('get_professional_rating', { professional_id: pro.id });
          
          return {
            ...pro,
            rating: ratingData?.[0]?.average_rating || 0,
            review_count: ratingData?.[0]?.review_count || 0,
          };
        })
      );

      return professionalsWithRatings as Professional[];
    }
  });

  const filteredProfessionals = professionals.filter(p => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !category || 
      p.specialty.toLowerCase().includes(category.toLowerCase());
    
    const matchesZipcode = !zipcode || 
      p.service_zipcodes.includes(zipcode);
    
    return matchesSearch && matchesCategory && matchesZipcode;
  });

  const handleContact = (pro: Professional, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProfessional(pro);
    setShowContactDialog(true);
  };

  const handleBookNow = (pro: Professional, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProfessional(pro);
    setShowBookingDialog(true);
  };

  const handleCardClick = (pro: Professional) => {
    window.location.href = `/professional/${pro.id}`;
  };

  const sponsoredPros = filteredProfessionals.filter(p => p.is_sponsored);
  const regularPros = filteredProfessionals.filter(p => !p.is_sponsored).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.hourly_rate - b.hourly_rate;
      case "price-high":
        return b.hourly_rate - a.hourly_rate;
      case "rating-high":
        if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
        return (b.review_count || 0) - (a.review_count || 0);
      case "rating-low":
        if ((a.rating || 0) !== (b.rating || 0)) return (a.rating || 0) - (b.rating || 0);
        return (a.review_count || 0) - (b.review_count || 0);
      default:
        return 0;
    }
  });

  const renderProfessionalCard = (pro: Professional) => (
    <Card 
      key={pro.id}
      onClick={() => handleCardClick(pro)}
      className={`overflow-hidden hover:shadow-card-hover transition-all duration-200 cursor-pointer ${
        pro.is_sponsored 
          ? 'border-sponsored/30 bg-sponsored/5' 
          : 'border-border bg-card'
      }`}
    >
      <div className="p-5">
        <div className="flex gap-4">
          <Avatar className="h-20 w-20 shrink-0">
            <AvatarImage src={pro.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${pro.name}`} />
            <AvatarFallback className="text-lg">{pro.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold text-foreground truncate">
                    {pro.name}
                  </h3>
                  {pro.verified && (
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                  )}
                </div>
                <p className="text-base text-muted-foreground">
                  {pro.specialty}
                </p>
              </div>
              {pro.is_sponsored && (
                <Badge variant="secondary" className="bg-sponsored text-sponsored-foreground shrink-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Ad
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 mb-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-foreground text-foreground" />
                <span className="font-semibold text-foreground">{pro.rating || 0}</span>
                <span className="text-muted-foreground">({pro.review_count || 0})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                {pro.service_zipcodes.join(', ')}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <div className="text-sm text-muted-foreground">Hourly Rate</div>
                <div className="text-2xl font-semibold text-foreground">${pro.hourly_rate}</div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => handleContact(pro, e)}
                >
                  Contact
                </Button>
                <Button 
                  size="sm" 
                  className="bg-foreground text-background hover:bg-foreground/90"
                  onClick={(e) => handleBookNow(pro, e)}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-muted-foreground">Loading fixers...</p>
          </div>
        </div>
      </section>
    );
  }

  if (filteredProfessionals.length === 0) {
    return (
      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No fixers available yet
            </h2>
            <p className="text-muted-foreground mb-6">
              {zipcode 
                ? `No fixers found in zipcode ${zipcode}. Try a different area or check back later.`
                : "Be the first to join as a professional fixer!"}
            </p>
            <Button 
              onClick={() => window.location.href = '/become-pro'}
              className="bg-primary hover:bg-primary/90"
            >
              Become a Pro
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                {zipcode && (
                  <p className="text-muted-foreground">
                    Showing {filteredProfessionals.length} fixer{filteredProfessionals.length !== 1 ? 's' : ''} available in zipcode {zipcode}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px] bg-card">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    <SelectItem value="rating-high">Highest Rating</SelectItem>
                    <SelectItem value="rating-low">Lowest Rating</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {sponsoredPros.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 gap-4">
                  {sponsoredPros.map(renderProfessionalCard)}
                </div>
              </div>
            )}
            
            <div>
              <div className="grid grid-cols-1 gap-4">
                {regularPros.map(renderProfessionalCard)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedProfessional && (
        <>
          <BookingDialog
            open={showBookingDialog}
            onOpenChange={setShowBookingDialog}
            professionalId={selectedProfessional.id}
            professionalName={selectedProfessional.name}
            specialty={selectedProfessional.specialty}
            hourlyRate={selectedProfessional.hourly_rate}
          />
          <ContactDialog
            open={showContactDialog}
            onOpenChange={setShowContactDialog}
            professionalId={selectedProfessional.id}
            professionalName={selectedProfessional.name}
            phone={selectedProfessional.phone}
            specialty={selectedProfessional.specialty}
            serviceZipcodes={selectedProfessional.service_zipcodes}
          />
        </>
      )}
    </>
  );
};

export default ProfessionalListings;
