import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import SearchPage from "./pages/SearchPage";
import Projects from "./pages/Projects";
import Auth from "./pages/Auth";
import BecomePro from "./pages/BecomePro";
import MyListing from "./pages/MyListing";
import ProfessionalDetail from "./pages/ProfessionalDetail";
import Conversation from "./pages/Conversation";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import Inspired from "./pages/Inspired";
import SavedLists from "./pages/SavedLists";
import Interests from "./pages/Interests";
import Preferences from "./pages/Preferences";
import Account from "./pages/Account";
import Support from "./pages/Support";
import Community from "./pages/Community";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/conversation/:userId" element={<Conversation />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/professional/:id" element={<ProfessionalDetail />} />
          <Route path="/become-pro" element={<BecomePro />} />
          <Route path="/my-listing" element={<MyListing />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inspired" element={<Inspired />} />
          <Route path="/saved" element={<SavedLists />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/account" element={<Account />} />
          <Route path="/support" element={<Support />} />
          <Route path="/community" element={<Community />} />
          <Route path="/feedback" element={<Feedback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
