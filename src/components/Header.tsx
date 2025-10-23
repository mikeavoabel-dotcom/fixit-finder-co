import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">HomeConnect</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="#professionals" className="text-foreground hover:text-primary transition-colors">
              Find Pros
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
              How It Works
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost">Sign In</Button>
            <Button variant="default">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
