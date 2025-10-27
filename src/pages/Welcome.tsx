import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, MessageSquare, Star, Shield, Users, Zap } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Find Professionals",
      description: "Browse and search for verified professionals in your area across dozens of service categories"
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Message professionals directly to discuss your needs, get quotes, and schedule appointments"
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description: "Read honest reviews from other customers and share your own experiences to help the community"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "All professionals are verified, and your data is protected with enterprise-grade security"
    },
    {
      icon: Users,
      title: "Join the Community",
      description: "Connect with thousands of satisfied customers and trusted professionals in our growing network"
    },
    {
      icon: Zap,
      title: "Quick & Easy",
      description: "Book services in minutes with our streamlined platform designed for your convenience"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Welcome to BlueCaller! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            We're absolutely thrilled to have you join our community! You've just taken the first step 
            towards connecting with the best professionals in your area.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/search")}>
              Find Professionals
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/how-it-works")}>
              Learn How It Works
            </Button>
          </div>
        </div>

        {/* What You Can Do Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            What You Can Do on BlueCaller
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="w-12 h-12 text-primary mb-3" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Getting Started Section */}
        <Card className="bg-accent/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Getting Started is Easy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Complete Your Profile</h3>
                <p className="text-muted-foreground">
                  Add your details so professionals can better understand your needs
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Browse Services</h3>
                <p className="text-muted-foreground">
                  Explore categories and find the perfect professional for your project
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Connect & Book</h3>
                <p className="text-muted-foreground">
                  Message professionals, discuss details, and schedule your service
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Share Your Experience</h3>
                <p className="text-muted-foreground">
                  Leave reviews to help other customers and support great professionals
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of satisfied customers who have found their perfect professionals on BlueCaller. 
            Your next great service is just a click away!
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/")}>
              Explore Home
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/become-pro")}>
              Become a Pro
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Welcome;
