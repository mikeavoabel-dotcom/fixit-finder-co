import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative bg-gradient-hero min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="Professional home service expert" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Find Local Home Service Experts
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Connect with skilled professionals for all your home improvement needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto bg-background/95 backdrop-blur-sm p-2 rounded-lg shadow-card-hover">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="What service do you need?" 
                className="pl-10 h-12 border-none focus-visible:ring-2"
              />
            </div>
            <Button variant="hero" size="lg" className="h-12">
              Search
            </Button>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-primary-foreground/80 text-sm">
            <span>Popular:</span>
            <button className="hover:text-primary-foreground transition-colors">Plumbing</button>
            <span>•</span>
            <button className="hover:text-primary-foreground transition-colors">Electrical</button>
            <span>•</span>
            <button className="hover:text-primary-foreground transition-colors">Painting</button>
            <span>•</span>
            <button className="hover:text-primary-foreground transition-colors">Roofing</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
