import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-semibold text-foreground mb-6">Search</h1>
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search for services or professionals..."
            className="h-14 pl-12 pr-4 text-base"
          />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default SearchPage;
