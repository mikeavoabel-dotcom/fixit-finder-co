import { Search, UserCheck, Calendar, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Browse",
    description: "Find professionals by service category or search for specific needs"
  },
  {
    icon: UserCheck,
    title: "Review Profiles",
    description: "Check ratings, reviews, and credentials of verified experts"
  },
  {
    icon: Calendar,
    title: "Book Service",
    description: "Schedule appointments directly with professionals at your convenience"
  },
  {
    icon: CheckCircle,
    title: "Get It Done",
    description: "Enjoy quality service and leave a review to help others"
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect with local professionals in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground mb-6 shadow-lg">
                  <step.icon className="w-10 h-10" />
                </div>
                <div className="absolute top-10 left-1/2 transform translate-x-12 hidden lg:block">
                  {index < steps.length - 1 && (
                    <div className="w-32 h-0.5 bg-border"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
