import { Star, MapPin, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const professionals = [
  {
    id: 1,
    name: "Mike Johnson",
    specialty: "Master Plumber",
    rating: 4.9,
    reviews: 127,
    location: "Downtown Area",
    verified: true,
    avatar: "MJ",
    rate: "$85/hr",
    jobs: 200
  },
  {
    id: 2,
    name: "Sarah Williams",
    specialty: "Licensed Electrician",
    rating: 5.0,
    reviews: 94,
    location: "North District",
    verified: true,
    avatar: "SW",
    rate: "$90/hr",
    jobs: 156
  },
  {
    id: 3,
    name: "David Chen",
    specialty: "Professional Painter",
    rating: 4.8,
    reviews: 203,
    location: "South Side",
    verified: true,
    avatar: "DC",
    rate: "$75/hr",
    jobs: 312
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    specialty: "Roofing Specialist",
    rating: 4.9,
    reviews: 88,
    location: "East End",
    verified: true,
    avatar: "ER",
    rate: "$95/hr",
    jobs: 145
  },
];

const FeaturedProfessionals = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Top-Rated Professionals
          </h2>
          <p className="text-lg text-muted-foreground">
            Vetted experts ready to help with your home projects
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {professionals.map((pro) => (
            <Card 
              key={pro.id}
              className="overflow-hidden hover:shadow-card-hover transition-all duration-300 border-border bg-card"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${pro.name}`} />
                    <AvatarFallback>{pro.avatar}</AvatarFallback>
                  </Avatar>
                  {pro.verified && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-card-foreground mb-1">
                  {pro.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {pro.specialty}
                </p>
                
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-medium text-foreground">{pro.rating}</span>
                    <span className="text-muted-foreground">({pro.reviews})</span>
                  </div>
                  <span className="text-muted-foreground">{pro.jobs} jobs</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {pro.location}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-lg font-bold text-primary">{pro.rate}</span>
                  <Button size="sm" variant="default">
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button size="lg" variant="outline">
            View All Professionals
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProfessionals;
