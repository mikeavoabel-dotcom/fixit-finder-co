import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceCategories from "@/components/ServiceCategories";
import FeaturedProfessionals from "@/components/FeaturedProfessionals";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ServiceCategories />
        <FeaturedProfessionals />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
