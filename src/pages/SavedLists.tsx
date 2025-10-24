import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const SavedLists = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Saved Lists</h1>
        
        <Card className="text-center py-16">
          <CardContent className="flex flex-col items-center gap-4">
            <Heart className="w-16 h-16 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No saved items yet</p>
            <p className="text-sm text-muted-foreground">
              Start saving professionals and services you like
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default SavedLists;
