import { Home, Heart, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const SimpleHeader = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-header p-2 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-header bg-clip-text text-transparent">
              HomeConnect
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <MessageSquare className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="gap-2">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Sign In</span>
            </Button>
            <Button className="bg-gradient-header">
              Join as Pro
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
