import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Support</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <MessageCircle className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Chat with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Chat</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Mail className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Send us an email</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Phone className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>Call us directly</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                1-800-FIXIFIC
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Support;
