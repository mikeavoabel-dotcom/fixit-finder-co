import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const navigate = useNavigate();
  
  const legalItems = [
    {
      icon: FileText,
      title: "Terms of Service",
      description: "Read our terms and conditions",
      path: "/terms"
    },
    {
      icon: Shield,
      title: "Privacy Policy",
      description: "How we protect your data",
      path: "/privacy"
    },
    {
      icon: Users,
      title: "Community Guidelines",
      description: "Our community standards",
      path: "/guidelines"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Community and Legal</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {legalItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(item.path)}
              >
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

export default Community;
