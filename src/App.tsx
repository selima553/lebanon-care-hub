import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/Layout";
import SheltersPage from "@/pages/SheltersPage";
import SheltersMapPage from "@/pages/SheltersMapPage";
import HelpPage from "@/pages/HelpPage";
import DonationsPage from "@/pages/DonationsPage";
import AddMenuPage from "@/pages/AddMenuPage";
import AddShelterPage from "@/pages/AddShelterPage";
import RequestHelpPage from "@/pages/RequestHelpPage";
import ShareDonationPage from "@/pages/ShareDonationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<SheltersPage />} />
              <Route path="/shelters/map" element={<SheltersMapPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/donations" element={<DonationsPage />} />
              <Route path="/add" element={<AddMenuPage />} />
              <Route path="/add/shelter" element={<AddShelterPage />} />
              <Route path="/add/help" element={<RequestHelpPage />} />
              <Route path="/add/donation" element={<ShareDonationPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
