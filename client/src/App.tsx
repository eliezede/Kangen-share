import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppHeader } from "@/components/app-header";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/components/landing";
import Home from "@/pages/home";
import Requests from "@/pages/requests";
import Providers from "@/pages/providers";
import Messages from "@/pages/messages";
import Availability from "@/pages/availability";
import Profile from "@/pages/profile";
import Notifications from "@/pages/notifications";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

interface RouterProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

function Router({ isAuthenticated, isLoading }: RouterProps) {
  return (
    <Switch>
      {/* Landing page for unauthenticated users, Home for authenticated */}
      {isAuthenticated ? (
        <Route path="/" component={(params) => <ProtectedRoute component={Home} {...params} />} />
      ) : (
        <Route path="/" component={Landing} />
      )}
      
      {/* Protected routes - require authentication */}
      <Route path="/requests" component={(params) => <ProtectedRoute component={Requests} {...params} />} />
      <Route path="/providers" component={(params) => <ProtectedRoute component={Providers} {...params} />} />
      <Route path="/messages/:threadId" component={(params) => <ProtectedRoute component={Messages} {...params} />} />
      <Route path="/messages" component={(params) => <ProtectedRoute component={Messages} {...params} />} />
      <Route path="/availability" component={(params) => <ProtectedRoute component={Availability} {...params} />} />
      <Route path="/users/:userId" component={(params) => <ProtectedRoute component={Profile} {...params} />} />
      <Route path="/profile/:userId" component={(params) => <ProtectedRoute component={Profile} {...params} />} />
      <Route path="/profile" component={(params) => <ProtectedRoute component={Profile} {...params} />} />
      <Route path="/notifications" component={(params) => <ProtectedRoute component={Notifications} {...params} />} />
      <Route path="/admin" component={(params) => <ProtectedRoute component={Admin} {...params} />} />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Always render router; show AppHeader only when authenticated
  if (isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex flex-col">
          <AppHeader />
          <main className="flex-1 overflow-auto">
            <Router isAuthenticated={isAuthenticated} isLoading={isLoading} />
          </main>
        </div>
        <Toaster />
      </>
    );
  }

  // Unauthenticated or loading - show router without header
  return (
    <>
      <Router isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
