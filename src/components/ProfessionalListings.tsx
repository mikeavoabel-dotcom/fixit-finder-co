import { Star, MapPin, CheckCircle2, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const professionals = [
  {
    id: 1,
    name: "Mike Johnson",
    specialty: "Master Plumber",
    rating: 4.9,
    reviews: 327,
    location: "Downtown",
    verified: true,
    sponsored: true,
    avatar: "MJ",
    rate: "$85",
    jobs: 420
  },
  {
    id: 2,
    name: "Sarah Williams",
    specialty: "Electrician",
    rating: 5.0,
    reviews: 294,
    location: "North District",
    verified: true,
    sponsored: true,
    avatar: "SW",
    rate: "$90",
    jobs: 356
  },
  {
    id: 3,
    name: "David Chen",
    specialty: "Painter",
    rating: 4.8,
    reviews: 503,
    location: "South Side",
    verified: true,
    sponsored: false,
    avatar: "DC",
    rate: "$75",
    jobs: 612
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    specialty: "Roofer",
    rating: 4.9,
    reviews: 188,
    location: "East End",
    verified: true,
    sponsored: false,
    avatar: "ER",
    rate: "$95",
    jobs: 245
  },
  {
    id: 5,
    name: "James Thompson",
    specialty: "Handyman",
    rating: 4.7,
    reviews: 412,
    location: "West Side",
    verified: true,
    sponsored: false,
    avatar: "JT",
    rate: "$65",
    jobs: 789
  },
  {
    id: 6,
    name: "Robert Lee",
    specialty: "Carpenter",
    rating: 5.0,
    reviews: 156,
    location: "Central",
    verified: true,
    sponsored: false,
    avatar: "RL",
    rate: "$80",
    jobs: 198
  },
];

const ProfessionalListings = () => {
  const sponsoredPros = professionals.filter(p => p.sponsored);
  const regularPros = professionals.filter(p => !p.sponsored).sort((a, b) => {
    // Sort by rating first, then reviews
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const renderProfessionalCard = (pro: typeof professionals[0]) => (
    <Card 
      key={pro.id}
      className={`overflow-hidden hover:shadow-card-hover transition-all duration-200 cursor-pointer ${
        pro.sponsored 
          ? 'border-sponsored/30 bg-sponsored/5' 
          : 'border-border bg-card'
      }`}
    >
      <div className="p-5">
        <div className="flex gap-4">
          <Avatar className="h-20 w-20 shrink-0">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${pro.name}`} />
            <AvatarFallback className="text-lg">{pro.avatar}</AvatarFallback>
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
              {pro.sponsored && (
                <Badge variant="secondary" className="bg-sponsored text-sponsored-foreground shrink-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Ad
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 mb-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-foreground text-foreground" />
                <span className="font-semibold text-foreground">{pro.rating}</span>
                <span className="text-muted-foreground">({pro.reviews})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                {pro.location}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <div className="text-sm text-muted-foreground">Starting at</div>
                <div className="text-2xl font-semibold text-foreground">{pro.rate}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Contact
                </Button>
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <section className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
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
          
          <div className="text-center mt-10">
            <Button size="lg" variant="outline" className="px-8">
              Load More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalListings;
