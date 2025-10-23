import { Star, MapPin, CheckCircle2, Crown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const professionals = [
  {
    id: 1,
    name: "Elite Plumbing Solutions",
    owner: "Mike Johnson",
    specialty: "Master Plumber",
    rating: 4.9,
    reviews: 327,
    location: "Downtown Area",
    verified: true,
    sponsored: true,
    avatar: "EP",
    rate: "$85/hr",
    jobs: 420,
    responseTime: "1 hour",
    badges: ["Top Rated", "Fast Response"]
  },
  {
    id: 2,
    name: "Spark Electric Co",
    owner: "Sarah Williams",
    specialty: "Licensed Electrician",
    rating: 5.0,
    reviews: 294,
    location: "North District",
    verified: true,
    sponsored: true,
    avatar: "SE",
    rate: "$90/hr",
    jobs: 356,
    responseTime: "30 mins",
    badges: ["Top Rated", "Quick Booking"]
  },
  {
    id: 3,
    name: "Pro Paint Masters",
    owner: "David Chen",
    specialty: "Professional Painter",
    rating: 4.8,
    reviews: 503,
    location: "South Side",
    verified: true,
    sponsored: false,
    avatar: "PP",
    rate: "$75/hr",
    jobs: 612,
    responseTime: "2 hours",
    badges: ["Popular", "High Quality"]
  },
  {
    id: 4,
    name: "A+ Roofing Experts",
    owner: "Emily Rodriguez",
    specialty: "Roofing Specialist",
    rating: 4.9,
    reviews: 188,
    location: "East End",
    verified: true,
    sponsored: false,
    avatar: "AR",
    rate: "$95/hr",
    jobs: 245,
    responseTime: "3 hours",
    badges: ["Trusted", "Insurance"]
  },
  {
    id: 5,
    name: "HandyFix Pros",
    owner: "James Thompson",
    specialty: "General Handyman",
    rating: 4.7,
    reviews: 412,
    location: "West Side",
    verified: true,
    sponsored: false,
    avatar: "HF",
    rate: "$65/hr",
    jobs: 789,
    responseTime: "1 hour",
    badges: ["Popular"]
  },
  {
    id: 6,
    name: "Precision Carpentry",
    owner: "Robert Lee",
    specialty: "Master Carpenter",
    rating: 5.0,
    reviews: 156,
    location: "Central",
    verified: true,
    sponsored: false,
    avatar: "PC",
    rate: "$80/hr",
    jobs: 198,
    responseTime: "4 hours",
    badges: ["Top Rated", "Custom Work"]
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
        <div className="bg-sponsored text-sponsored-foreground px-4 py-2 flex items-center gap-2 text-sm font-semibold">
          <Crown className="w-4 h-4" />
          SPONSORED LISTING
        </div>
      )}
      <div className={pro.sponsored ? 'p-4 bg-card' : 'p-4'}>
        <div className="flex gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${pro.name}`} />
            <AvatarFallback>{pro.avatar}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-card-foreground">
                  {pro.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  by {pro.owner} • {pro.specialty}
                </p>
              </div>
              {pro.verified && (
                <Badge variant="secondary" className="gap-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 mb-3 text-sm flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-bold text-foreground">{pro.rating}</span>
                <span className="text-muted-foreground">({pro.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                {pro.jobs} jobs completed
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {pro.badges.map(badge => (
                <Badge key={badge} variant="outline" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {pro.location} • Responds in {pro.responseTime}
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Starting at</p>
                <p className="text-2xl font-bold text-primary">{pro.rate}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Message
                </Button>
                <Button size="sm" className="bg-secondary hover:bg-secondary/90">
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
    <section className="py-8 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        {sponsoredPros.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Crown className="w-6 h-6 text-sponsored" />
              Featured Professionals
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {sponsoredPros.map(renderProfessionalCard)}
            </div>
          </div>
        )}
        
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Top Rated & Most Popular
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {regularPros.map(renderProfessionalCard)}
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button size="lg" variant="outline">
            Load More Professionals
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalListings;
