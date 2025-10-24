import { useState } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Feedback = () => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feedback Submitted",
      description: "Thank you for helping us improve Fixific!",
    });
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Share Your Feedback</CardTitle>
            <CardDescription>
              We'd love to hear your thoughts on how we can improve Fixific
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us what you think..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={8}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Feedback;
