import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
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
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/requests" component={Requests} />
          <Route path="/providers" component={Providers} />
          <Route path="/messages" component={Messages} />
          <Route path="/availability" component={Availability} />
          <Route path="/profile" component={Profile} />
          <Route path="/profile/:userId" component={Profile} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/admin" component={Admin} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <>
      {!isLoading && isAuthenticated ? (
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <main className="flex-1 overflow-auto">
              <Router isAuthenticated={isAuthenticated} isLoading={isLoading} />
            </main>
          </div>
        </SidebarProvider>
      ) : (
        <Router isAuthenticated={isAuthenticated} isLoading={isLoading} />
      )}
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
