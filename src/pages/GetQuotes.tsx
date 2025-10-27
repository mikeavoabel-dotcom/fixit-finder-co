import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, MessageSquare, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GetQuotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    service: "",
    description: "",
    zipcode: "",
    timeline: "",
    budget: "",
    name: "",
    email: "",
    phone: ""
  });

  const serviceCategories = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Landscaping",
    "HVAC",
    "Roofing",
    "Appliance Repair",
    "Moving",
    "Handyman",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to request quotes",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("submit-quote-request", {
        body: {
          serviceCategory: formData.service,
          projectDescription: formData.description,
          zipcode: formData.zipcode,
          timeline: formData.timeline,
          budget: formData.budget,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Quote Request Submitted!",
        description: `${data.professionalsNotified} professionals have been notified. Up to 3 will send you quotes within 24 hours.`,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting quote request:", error);
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get 3 Free Quotes from Top Professionals
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Describe your project and receive competitive quotes from verified professionals in your area. 
            Compare prices, reviews, and availability all in one place.
          </p>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <MessageSquare className="w-12 h-12 text-primary mb-3" />
              <CardTitle>1. Describe Your Project</CardTitle>
              <CardDescription>
                Tell us what you need done and we'll match you with the right professionals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="w-12 h-12 text-primary mb-3" />
              <CardTitle>2. Get Multiple Quotes</CardTitle>
              <CardDescription>
                Receive up to 3 competitive quotes from verified professionals within 24 hours
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-primary mb-3" />
              <CardTitle>3. Choose & Book</CardTitle>
              <CardDescription>
                Compare quotes, read reviews, and hire the professional that fits your needs and budget
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quote Request Form */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Request Your Free Quotes</CardTitle>
            <CardDescription>
              Fill out the form below and we'll connect you with qualified professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What service do you need? *
                </label>
                <Select value={formData.service} onValueChange={(value) => handleChange("service", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Description *
                </label>
                <Textarea
                  placeholder="Describe your project in detail. The more information you provide, the more accurate quotes you'll receive."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={5}
                  required
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Include details like size, materials, timeline, and any specific requirements
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Zip Code *
                  </label>
                  <Input
                    type="text"
                    placeholder="12345"
                    value={formData.zipcode}
                    onChange={(e) => handleChange("zipcode", e.target.value)}
                    required
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Timeline *
                  </label>
                  <Select value={formData.timeline} onValueChange={(value) => handleChange("timeline", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="When do you need this done?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">As soon as possible</SelectItem>
                      <SelectItem value="week">Within a week</SelectItem>
                      <SelectItem value="month">Within a month</SelectItem>
                      <SelectItem value="flexible">I'm flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Budget Range *
                </label>
                <Select value={formData.budget} onValueChange={(value) => handleChange("budget", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-100">Under $100</SelectItem>
                    <SelectItem value="100-500">$100 - $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                    <SelectItem value="over-5000">Over $5,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Your Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent/50 p-4 rounded-lg">
                <p className="text-sm text-foreground/80">
                  By submitting this form, you agree to be contacted by up to 3 professionals regarding your project. 
                  No commitment required. Your information is secure and will never be shared with third parties.
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Get My Free Quotes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default GetQuotes;
