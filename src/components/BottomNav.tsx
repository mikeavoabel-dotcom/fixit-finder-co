import { Home, Mail, Search, FileText, User, ClipboardList } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Mail, label: "Inbox", path: "/inbox" },
    { icon: ClipboardList, label: "Your Quotes", path: "/your-quotes" },
    { icon: FileText, label: "Projects", path: "/projects" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 bg-background border border-border rounded-2xl shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center gap-1 min-w-[60px]"
              >
                <Icon 
                  className={`w-6 h-6 ${
                    isActive ? 'text-secondary' : 'text-muted-foreground'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
