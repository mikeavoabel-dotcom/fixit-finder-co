import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles, Heart, FileText, Send, Settings, UserCircle, LifeBuoy, MessageCircle, Share2, Briefcase, Bell, LogOut, Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import InviteFriendsDialog from "@/components/InviteFriendsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }
  const menuSections = [
    {
      title: "My Fixific",
      items: [
        { icon: Sparkles, label: "Get inspired", path: "/inspired", action: null },
        { icon: Heart, label: "Saved lists", path: "/saved", action: null },
        { icon: FileText, label: "My interests", path: "/interests", action: null },
        { icon: Send, label: "Invite friends", path: null, action: "invite" },
      ]
    },
    {
      title: "Settings",
      items: [
        { icon: Settings, label: "Preferences", path: "/preferences", action: null },
        { icon: UserCircle, label: "Account", path: "/account", action: null },
      ]
    },
    {
      title: "Resources",
      items: [
        { icon: LifeBuoy, label: "Support", path: "/support", action: null },
        { icon: MessageCircle, label: "Community and legal", path: "/community", action: null },
        { icon: Share2, label: "Share feedback", path: "/feedback", action: null },
        { icon: Pencil, label: "My Listing", path: "/my-listing", action: null },
        { icon: Briefcase, label: "Become a Pro", path: "/become-pro", action: null },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      {/* Profile Header */}
      <div className="bg-secondary py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-background">
                <AvatarFallback className="bg-background text-secondary text-2xl font-bold">
                  U
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold text-background">
                  {profile?.username || "User"}
                </h1>
                <p className="text-sm text-background/80">{user?.email}</p>
              </div>
            </div>
            <Bell className="w-6 h-6 text-background" />
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {menuSections.map((section, idx) => (
          <div key={section.title} className={idx > 0 ? "mt-8" : ""}>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                
                if (item.action === "invite") {
                  return (
                    <InviteFriendsDialog
                      key={item.label}
                      referralCode={profile?.referral_code || ""}
                      trigger={
                        <button className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors group">
                          <div className="flex items-center gap-4">
                            <Icon className="w-6 h-6 text-foreground" />
                            <span className="text-base text-foreground">{item.label}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </button>
                      }
                    />
                  );
                }
                
                return (
                  <button
                    key={item.label}
                    onClick={() => item.path && navigate(item.path)}
                    className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="w-6 h-6 text-foreground" />
                      <span className="text-base text-foreground">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Version 1.0.0
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
