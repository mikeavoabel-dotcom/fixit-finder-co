import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Plumbing", badge: null },
  { name: "Electrical", badge: null },
  { name: "Painting", badge: null },
  { name: "Roofing", badge: null },
  { name: "Handyman", badge: "POPULAR" },
  { name: "HVAC", badge: null },
  { name: "Carpentry", badge: null },
  { name: "Landscaping", badge: "TRENDING" },
];

const CategoryTabs = () => {
  return (
    <section className="bg-background border-b border-border py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          <div className="flex gap-3 justify-center">
            {categories.map((category) => {
              return (
                <button
                  key={category.name}
                  className="px-5 py-2 rounded-full border border-border hover:border-foreground hover:bg-accent transition-colors text-sm font-medium text-foreground whitespace-nowrap flex items-center gap-2"
                >
                  {category.name}
                  {category.badge && (
                    <Badge variant="secondary" className="bg-foreground text-background text-xs px-2 py-0">
                      {category.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default CategoryTabs;
