import SimpleHeader from "@/components/SimpleHeader";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import ProfessionalListings from "@/components/ProfessionalListings";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const zipcode = searchParams.get("zipcode") || "";
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      <Hero />
      <CategoryTabs />
      <main>
        <ProfessionalListings category={category} zipcode={zipcode} />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
