import SimpleHeader from "@/components/SimpleHeader";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import ProfessionalListings from "@/components/ProfessionalListings";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <Hero />
      <CategoryTabs />
      <main>
        <ProfessionalListings />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
