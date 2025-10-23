import { Wrench, Zap, PaintBucket, Home, Droplets, Hammer, Settings, Trees } from "lucide-react";
import { Card } from "@/components/ui/card";

const categories = [
  {
    icon: Droplets,
    title: "Plumbing",
    description: "Repairs, installations & maintenance",
    count: "120+ experts"
  },
  {
    icon: Zap,
    title: "Electrical",
    description: "Wiring, fixtures & troubleshooting",
    count: "95+ experts"
  },
  {
    icon: PaintBucket,
    title: "Painting",
    description: "Interior & exterior painting",
    count: "85+ experts"
  },
  {
    icon: Home,
    title: "Roofing",
    description: "Repairs, replacement & inspection",
    count: "65+ experts"
  },
  {
    icon: Wrench,
    title: "Handyman",
    description: "General repairs & maintenance",
    count: "150+ experts"
  },
  {
    icon: Hammer,
    title: "Carpentry",
    description: "Custom builds & repairs",
    count: "70+ experts"
  },
  {
    icon: Settings,
    title: "HVAC",
    description: "Heating & cooling services",
    count: "55+ experts"
  },
  {
    icon: Trees,
    title: "Landscaping",
    description: "Lawn care & outdoor design",
    count: "90+ experts"
  },
];

const ServiceCategories = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Popular Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Browse by category to find the right expert for your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.title}
              className="p-6 hover:shadow-card-hover transition-all duration-300 cursor-pointer border-border bg-card group"
            >
              <category.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {category.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">
                {category.description}
              </p>
              <p className="text-primary font-medium text-sm">
                {category.count}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
