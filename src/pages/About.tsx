import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in building strong connections between professionals and customers"
    },
    {
      icon: Target,
      title: "Quality Service",
      description: "Every professional is verified to ensure you get the best service possible"
    },
    {
      icon: Award,
      title: "Trust & Safety",
      description: "Our platform prioritizes secure transactions and verified reviews"
    },
    {
      icon: Heart,
      title: "Customer Care",
      description: "We're here to support both professionals and customers every step of the way"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              About Fixific
            </h1>
            <p className="text-lg text-muted-foreground">
              Connecting communities with trusted local professionals
            </p>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-muted-foreground mb-4">
                Fixific was founded with a simple mission: make it easy for homeowners to find and hire trusted local service professionals. We understand how challenging it can be to find reliable help for home repairs and improvements.
              </p>
              <p className="text-muted-foreground mb-4">
                Our platform connects skilled professionals with customers who need their services, creating a trusted marketplace where quality work meets fair prices. We've helped thousands of homeowners complete their projects and enabled countless professionals to grow their businesses.
              </p>
              <p className="text-muted-foreground">
                Today, Fixific serves communities across the country, offering services ranging from plumbing and electrical work to landscaping and home renovation. We're proud to be the bridge between talented professionals and satisfied customers.
              </p>
            </CardContent>
          </Card>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <Icon className="w-10 h-10 text-primary mb-2" />
                      <CardTitle>{value.title}</CardTitle>
                      <CardDescription>{value.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Join Our Community</CardTitle>
              <CardDescription>
                Whether you're a homeowner looking for help or a professional ready to grow your business, Fixific is here for you.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default About;
