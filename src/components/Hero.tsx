import { Search, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [zipcode, setZipcode] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (zipcode.trim()) {
      navigate(`/?zipcode=${encodeURIComponent(zipcode)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal text-foreground mb-8 leading-tight">
            Find the perfect <span className="font-medium italic">professional</span> at your call
          </h1>
          
          {/* Get Quotes CTA */}
          <div className="mb-8">
            <Button 
              size="lg" 
              className="gap-2 text-lg px-8 py-6 h-auto"
              onClick={() => navigate("/get-quotes")}
            >
              Get 3 Free Quotes
              <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Compare quotes from top-rated professionals
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <p className="text-muted-foreground mb-4">Or browse professionals by zipcode:</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter your zipcode..."
                  className="h-14 pl-12 pr-4 text-base border-border rounded-lg shadow-sm"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={5}
                />
              </div>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-6"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
