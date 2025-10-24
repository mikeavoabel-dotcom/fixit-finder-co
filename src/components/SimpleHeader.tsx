import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SimpleHeader = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:text-foreground"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-accent"
                  onClick={() => navigate("/auth")}
                >
                  Join
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-foreground"
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
