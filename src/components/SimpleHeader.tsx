import { Button } from "@/components/ui/button";

const SimpleHeader = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-foreground">
            homeconnect<span className="text-secondary">.</span>
          </span>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-accent">
              Join
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
