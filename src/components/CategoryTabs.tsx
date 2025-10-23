import { Wrench, Zap, PaintBucket, Home, Droplets, Hammer, Settings, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { icon: Droplets, label: "Plumbing", count: 120 },
  { icon: Zap, label: "Electrical", count: 95 },
  { icon: PaintBucket, label: "Painting", count: 85 },
  { icon: Home, label: "Roofing", count: 65 },
  { icon: Wrench, label: "Handyman", count: 150 },
  { icon: Hammer, label: "Carpentry", count: 70 },
  { icon: Settings, label: "HVAC", count: 55 },
  { icon: Trees, label: "Landscaping", count: 90 },
];

const CategoryTabs = () => {
  return (
    <div className="bg-background border-b border-border py-4 sticky top-40 z-30 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button variant="default" size="sm" className="shrink-0">
            All Services
          </Button>
          {categories.map((cat) => (
            <Button 
              key={cat.label} 
              variant="outline" 
              size="sm" 
              className="shrink-0 gap-2"
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
              <span className="text-xs text-muted-foreground">({cat.count})</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
