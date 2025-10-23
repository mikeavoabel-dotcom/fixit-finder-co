import { ChevronRight, Sparkles, Heart, FileText, Send, Settings, UserCircle, LifeBuoy, MessageCircle, Share2, Briefcase, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const menuSections = [
    {
      title: "My HomeConnect",
      items: [
        { icon: Sparkles, label: "Get inspired", path: "/inspired" },
        { icon: Heart, label: "Saved lists", path: "/saved" },
        { icon: FileText, label: "My interests", path: "/interests" },
        { icon: Send, label: "Invite friends", path: "/invite" },
      ]
    },
    {
      title: "Settings",
      items: [
        { icon: Settings, label: "Preferences", path: "/preferences" },
        { icon: UserCircle, label: "Account", path: "/account" },
      ]
    },
    {
      title: "Resources",
      items: [
        { icon: LifeBuoy, label: "Support", path: "/support" },
        { icon: MessageCircle, label: "Community and legal", path: "/community" },
        { icon: Share2, label: "Share feedback", path: "/feedback" },
        { icon: Briefcase, label: "Become a Pro", path: "/become-pro" },
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
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-background">
                  <AvatarFallback className="bg-background text-secondary text-2xl font-bold">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-secondary rounded-full border-2 border-background"></div>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-background">username</h1>
              </div>
            </div>
            <button className="relative">
              <Bell className="w-6 h-6 text-background" />
              <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                1
              </div>
            </button>
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
                return (
                  <button
                    key={item.label}
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
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          Version 1.0.0
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
