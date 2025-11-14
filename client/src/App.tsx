import { Route, Switch, useLocation } from "wouter";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import HostProfilePage from "./pages/host-profile";
import RequestWaterPage from "./pages/request-water";
import ChatPage from "./pages/chat";
import RateHostPage from "./pages/rate-host";
import { TopNav } from "./components/top-nav";

function App() {
  const [location] = useLocation();
  const showNavigation = location !== "/";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {showNavigation && <TopNav />}
      <Switch>
        <Route path="/" component={LoginPage} />
        <Route path="/home" component={HomePage} />
        <Route path="/host" component={HostProfilePage} />
        <Route path="/request" component={RequestWaterPage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/rate" component={RateHostPage} />
        <Route>
          <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-6 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Page not found</h1>
            <p className="mt-3 max-w-sm text-sm text-slate-500">
              The page you’re looking for doesn’t exist. Head back to the map to discover generous Kangen hosts.
            </p>
            <a href="/home" className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800">
              Return home
            </a>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
