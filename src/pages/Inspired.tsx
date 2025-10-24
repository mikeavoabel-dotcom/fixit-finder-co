import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Star } from "lucide-react";

const Inspired = () => {
  const inspirationItems = [
    {
      icon: Lightbulb,
      title: "Home Renovation Ideas",
      description: "Transform your space with trending renovation projects"
    },
    {
      icon: TrendingUp,
      title: "Seasonal Services",
      description: "Popular services for this time of year"
    },
    {
      icon: Star,
      title: "Top Rated Pros",
      description: "Meet our most popular professionals"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Get Inspired</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspirationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Inspired;
