import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import ProfessionalListings from "@/components/ProfessionalListings";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-semibold text-foreground mb-6">Search</h1>
        <div className="relative max-w-2xl mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search for services or professionals..."
            className="h-14 pl-12 pr-4 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <div className="mt-8">
            <h2 className="text-xl font-medium text-foreground mb-4">Search Results</h2>
            <ProfessionalListings searchQuery={searchQuery} />
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default SearchPage;
