
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load pages with error boundaries for each route
const Index = lazy(() => import("./pages/Index"));
const ExportPage = lazy(() => import("./pages/ExportPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Configure query client with better performance settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      staleTime: 15000,
      gcTime: 60000,
      refetchOnWindowFocus: false,
      networkMode: 'always', // Always attempt network requests
    },
  },
});

// Fallback loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-blue-600 animate-spin"></div>
      <p className="text-muted-foreground">Cargando aplicación...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
