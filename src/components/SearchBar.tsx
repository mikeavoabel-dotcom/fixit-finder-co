import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  return (
    <div className="bg-gradient-header py-6 sticky top-16 z-40 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-3 max-w-5xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="What do you need?" 
              className="pl-10 h-12 bg-background border-0 shadow-md"
            />
          </div>
          <div className="w-full md:w-64 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Location" 
              className="pl-10 h-12 bg-background border-0 shadow-md"
            />
          </div>
          <Button size="lg" className="h-12 px-8 bg-secondary hover:bg-secondary/90">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
