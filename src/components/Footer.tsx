import { Home } from "lucide-react";
import { Link } from "react-router-dom";

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
              <li><Link to="/?category=plumbing" className="hover:text-primary transition-colors">Plumbing</Link></li>
              <li><Link to="/?category=electrical" className="hover:text-primary transition-colors">Electrical</Link></li>
              <li><Link to="/?category=painting" className="hover:text-primary transition-colors">Painting</Link></li>
              <li><Link to="/?category=roofing" className="hover:text-primary transition-colors">Roofing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-background/80">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link to="/become-pro" className="hover:text-primary transition-colors">Become a Pro</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
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
