import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Calendar, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const customerSteps = [
    {
      icon: Search,
      title: "1. Search for Services",
      description: "Browse categories or search for the specific service you need"
    },
    {
      icon: Users,
      title: "2. Compare Professionals",
      description: "View profiles, read reviews, and compare prices from verified pros"
    },
    {
      icon: Calendar,
      title: "3. Book & Schedule",
      description: "Contact professionals directly and schedule your service"
    },
    {
      icon: CheckCircle,
      title: "4. Get It Done",
      description: "Your chosen professional completes the work to your satisfaction"
    }
  ];

  const proSteps = [
    {
      icon: Users,
      title: "1. Create Your Profile",
      description: "Sign up and showcase your skills, experience, and services"
    },
    {
      icon: CheckCircle,
      title: "2. Get Verified",
      description: "Complete our verification process to build trust with customers"
    },
    {
      icon: Search,
      title: "3. Receive Requests",
      description: "Get contacted by customers looking for your specific services"
    },
    {
      icon: Calendar,
      title: "4. Grow Your Business",
      description: "Build your reputation with great work and positive reviews"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              How BlueCaller Works
            </h1>
            <p className="text-lg text-muted-foreground">
              Simple, transparent, and designed for success
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">For Customers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {customerSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="flex justify-center mb-4">
                        <Icon className="w-12 h-12 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">For Professionals</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {proSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="flex justify-center mb-4">
                        <Icon className="w-12 h-12 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
              <p className="text-primary-foreground/90">
                Join thousands of satisfied customers and professionals using BlueCaller
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default HowItWorks;
