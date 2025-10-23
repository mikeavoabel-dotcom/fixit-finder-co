import { Star, MapPin, CheckCircle2, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      className={`overflow-hidden hover:shadow-card-hover transition-all duration-300 border ${
        pro.sponsored 
          ? 'border-sponsored bg-gradient-sponsored shadow-sponsored' 
          : 'border-border bg-card'
      }`}
    >
      {pro.sponsored && (
        <div className="bg-sponsored text-sponsored-foreground px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold">
          <Crown className="w-3.5 h-3.5" />
          SPONSORED
        </div>
      )}
      <div className={pro.sponsored ? 'p-4 bg-card' : 'p-4'}>
        <div className="flex gap-3">
          <Avatar className="h-16 w-16 border-2 border-primary shrink-0">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${pro.name}`} />
            <AvatarFallback>{pro.avatar}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-card-foreground truncate">
                  {pro.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {pro.specialty}
                </p>
              </div>
              {pro.verified && (
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-3 mb-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-bold">{pro.rating}</span>
                <span className="text-muted-foreground">({pro.reviews})</span>
              </div>
              <span className="text-muted-foreground">{pro.jobs} jobs</span>
            </div>
            
            <div className="flex items-center gap-1.5 mb-3 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {pro.location}
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-2xl font-bold text-primary">{pro.rate}/hr</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Contact
                </Button>
                <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                  Book
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <section className="py-8 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        {sponsoredPros.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-3">
              {sponsoredPros.map(renderProfessionalCard)}
            </div>
          </div>
        )}
        
        <div>
          <div className="grid grid-cols-1 gap-3">
            {regularPros.map(renderProfessionalCard)}
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Button size="lg" variant="outline">
            Load More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalListings;
