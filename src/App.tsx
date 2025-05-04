import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ErrorBoundary } from "@/core/components/ErrorBoundary";
import { ProtectedRoute, PublicRoute } from "@/core/components/ProtectedRoute";
import { lazyRoutes } from "@/utils/lazy";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      suspense: true,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<lazyRoutes.Index />} />
              <Route path="/login" element={
                <PublicRoute>
                  <lazyRoutes.Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <lazyRoutes.Register />
                </PublicRoute>
              } />
              <Route path="/tag/:id" element={<lazyRoutes.TagPage />} />

              {/* Admin routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireAdmin={true}>
                  <lazyRoutes.AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Regular user routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <lazyRoutes.Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/pets" element={
                <ProtectedRoute>
                  <lazyRoutes.PetsPage />
                </ProtectedRoute>
              } />
              <Route path="/pets/new" element={
                <ProtectedRoute>
                  <lazyRoutes.NewPet />
                </ProtectedRoute>
              } />
              <Route path="/pets/edit/:id" element={
                <ProtectedRoute>
                  <lazyRoutes.EditPet />
                </ProtectedRoute>
              } />
              <Route path="/scans" element={
                <ProtectedRoute>
                  <lazyRoutes.ScansPage />
                </ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute>
                  <lazyRoutes.AccountPage />
                </ProtectedRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<lazyRoutes.NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
