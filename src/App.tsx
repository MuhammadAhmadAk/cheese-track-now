
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { MainLayout } from "@/components/MainLayout";

import Index from "./pages/Index";
import Input from "./pages/Input";
import Inventory from "./pages/Inventory";
import Dispatch from "./pages/Dispatch";
import DeliveryNote from "./pages/DeliveryNote";
import Assortment from "./pages/Assortment";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Create a UUID package dependency
import { v4 as uuidv4 } from 'uuid';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <MainLayout>
                <Index />
              </MainLayout>
            } />
            <Route path="/input" element={
              <MainLayout>
                <Input />
              </MainLayout>
            } />
            <Route path="/inventory" element={
              <MainLayout>
                <Inventory />
              </MainLayout>
            } />
            <Route path="/dispatch" element={
              <MainLayout>
                <Dispatch />
              </MainLayout>
            } />
            <Route path="/delivery-note" element={
              <MainLayout>
                <DeliveryNote />
              </MainLayout>
            } />
            <Route path="/assortment" element={
              <MainLayout>
                <Assortment />
              </MainLayout>
            } />
            <Route path="/orders" element={
              <MainLayout>
                <Orders />
              </MainLayout>
            } />
            <Route path="/reports" element={
              <MainLayout>
                <Reports />
              </MainLayout>
            } />
            <Route path="/settings" element={
              <MainLayout>
                <Settings />
              </MainLayout>
            } />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
