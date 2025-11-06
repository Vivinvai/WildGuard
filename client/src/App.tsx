import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import GetStarted from "@/pages/get-started";
import Home from "@/pages/home";
import Discover from "@/pages/discover";
import Centers from "@/pages/centers";
import Learn from "@/pages/learn";
import About from "@/pages/about";
import Identify from "@/pages/identify";
import Flora from "@/pages/flora";
import Gardens from "@/pages/gardens";
import Deforestation from "@/pages/deforestation";
import Chat from "@/pages/chat";
import WildlifeMap from "@/pages/map";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import ReportSighting from "@/pages/report-sighting";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={GetStarted} />
      <Route path="/home" component={Home} />
      <Route path="/discover" component={Discover} />
      <Route path="/centers" component={Centers} />
      <Route path="/learn" component={Learn} />
      <Route path="/about" component={About} />
      <Route path="/identify" component={Identify} />
      <Route path="/flora" component={Flora} />
      <Route path="/gardens" component={Gardens} />
      <Route path="/deforestation" component={Deforestation} />
      <Route path="/chat" component={Chat} />
      <Route path="/map" component={WildlifeMap} />
      <Route path="/report-sighting" component={ReportSighting} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="wildguard-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
