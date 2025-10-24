import { useState } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Interests = () => {
  const { toast } = useToast();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const categories = [
    "Plumbing", "Electrical", "Carpentry", "Painting", "Landscaping",
    "Cleaning", "Moving", "HVAC", "Roofing", "Flooring"
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    toast({
      title: "Interests Saved",
      description: "Your preferences have been updated",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">My Interests</CardTitle>
            <CardDescription>
              Select the services you're interested in to get personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedInterests.includes(category) ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => toggleInterest(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
            <Button onClick={handleSave} size="lg" className="w-full sm:w-auto">
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Interests;
