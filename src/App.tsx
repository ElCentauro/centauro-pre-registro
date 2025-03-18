
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load pages to reduce initial bundle size
const Index = lazy(() => import("./pages/Index"));
const ExportPage = lazy(() => import("./pages/ExportPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Configure query client with better performance settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      gcTime: 3600000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-center">
              <p className="text-lg text-gray-600">Cargando...</p>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/export" element={<ExportPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
