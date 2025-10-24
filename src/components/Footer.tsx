import { Home } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Fixific</span>
            </div>
            <p className="text-background/80 mb-4">
              Connect with local home service professionals
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-accent transition-colors">Plumbing</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Electrical</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Painting</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Roofing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Become a Pro</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
          <p>&copy; 2025 Fixific. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
