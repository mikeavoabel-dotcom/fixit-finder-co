import { Home, Mail, Search, FileText, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/", badge: null },
    { icon: Mail, label: "Inbox", path: "/inbox", badge: 9 },
    { icon: Search, label: "Search", path: "/search", badge: null },
    { icon: FileText, label: "Projects", path: "/projects", badge: null },
    { icon: User, label: "Profile", path: "/profile", badge: 1 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
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
                <div className="relative">
                  <Icon 
                    className={`w-6 h-6 ${
                      isActive ? 'text-secondary' : 'text-muted-foreground'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.badge && (
                    <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
