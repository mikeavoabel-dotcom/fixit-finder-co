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
  const [notifications, setNotifications] = useState<any[]>([]);
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
      fetchNotifications();
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

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Realtime: push new notifications instantly
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        // @ts-ignore new row payload
        setNotifications((prev) => [payload.new as any, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
      
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
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
                  {notifications.some(n => !n.read) && (
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
                            !notif.read ? "bg-accent/50" : ""
                          }`}
                          onClick={() => {
                            markAsRead(notif.id);
                            if (notif.link) {
                              navigate(notif.link);
                            }
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
                                {formatTimeAgo(notif.created_at)}
                              </p>
                            </div>
                            {!notif.read && (
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
