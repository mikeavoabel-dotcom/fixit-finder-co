import { useState } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Briefcase, DollarSign, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const BecomePro = () => {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    hourlyRate: "",
    serviceZipcodes: "",
    bio: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to become a professional.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      // Parse zipcodes as array
      const zipcodes = formData.serviceZipcodes
        .split(',')
        .map(z => z.trim())
        .filter(z => z.length > 0);

      if (zipcodes.length === 0) {
        toast({
          title: "Zipcode Required",
          description: "Please enter at least one service zipcode.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Insert professional profile
      const { error } = await supabase
        .from('professionals')
        .insert({
          user_id: user.id,
          name: formData.name,
          specialty: formData.specialty,
          phone: formData.phone,
          hourly_rate: parseFloat(formData.hourlyRate),
          service_zipcodes: zipcodes,
          bio: formData.bio || null,
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Registered",
            description: "You already have a professional profile.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Application Submitted!",
          description: "Your professional profile has been created successfully.",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating professional profile:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Briefcase,
      title: "Grow Your Business",
      description: "Connect with customers actively looking for your services"
    },
    {
      icon: DollarSign,
      title: "Flexible Pricing",
      description: "Set your own rates and work on your own terms"
    },
    {
      icon: Clock,
      title: "Work Your Schedule",
      description: "Choose when and where you want to work"
    },
    {
      icon: CheckCircle,
      title: "Verified Badge",
      description: "Get verified to build trust with customers"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Become a Pro on BlueCaller
            </h1>
            <p className="text-lg text-muted-foreground">
              Join thousands of professionals growing their business with BlueCaller
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <Icon className="w-10 h-10 text-primary mb-2" />
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Your Professional Profile</CardTitle>
              <CardDescription>
                Fill out the form below to start receiving job requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Service Category *</Label>
                    <Input
                      id="specialty"
                      required
                      value={formData.specialty}
                      onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                      placeholder="e.g., Plumbing, Electrical"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="1"
                      step="0.01"
                      required
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                      placeholder="75"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceZipcodes">Service Zipcodes *</Label>
                  <Input
                    id="serviceZipcodes"
                    required
                    value={formData.serviceZipcodes}
                    onChange={(e) => setFormData({...formData, serviceZipcodes: e.target.value})}
                    placeholder="e.g., 10001, 10002, 10003"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter zipcodes separated by commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Tell us about yourself</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Describe your experience, certifications, and expertise..."
                    rows={5}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Create Professional Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default BecomePro;
