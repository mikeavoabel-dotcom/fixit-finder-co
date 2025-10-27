import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Send, Settings, UserCircle, LifeBuoy, MessageCircle, Share2, Briefcase, Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import InviteFriendsDialog from "@/components/InviteFriendsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Welcome to BlueCaller!", message: "Thanks for joining our community", time: "2 hours ago", unread: true },
    { id: 2, title: "Profile Update", message: "Your profile has been updated successfully", time: "1 day ago", unread: false },
    { id: 3, title: "New Message", message: "You have a new message from a professional", time: "3 days ago", unread: false },
  ]);
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
      title: "My BlueCaller",
      items: [
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
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative">
                  <Bell className="w-6 h-6 text-background" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                <ScrollArea className="h-[300px]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications yet
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 hover:bg-accent transition-colors cursor-pointer ${
                            notif.unread ? "bg-accent/50" : ""
                          }`}
                          onClick={() => {
                            setNotifications(notifications.map(n => 
                              n.id === notif.id ? { ...n, unread: false } : n
                            ));
                          }}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground text-sm">
                                {notif.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notif.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {notif.time}
                              </p>
                            </div>
                            {notif.unread && (
                              <span className="w-2 h-2 bg-primary rounded-full mt-1" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
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
