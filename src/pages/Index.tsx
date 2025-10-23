import SimpleHeader from "@/components/SimpleHeader";
import SearchBar from "@/components/SearchBar";
import CategoryTabs from "@/components/CategoryTabs";
import ProfessionalListings from "@/components/ProfessionalListings";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <SearchBar />
      <CategoryTabs />
      <main>
        <ProfessionalListings />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
