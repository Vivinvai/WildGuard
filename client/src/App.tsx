import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Discover from "@/pages/discover";
import Centers from "@/pages/centers";
import Learn from "@/pages/learn";
import About from "@/pages/about";
import Identify from "@/pages/identify";
import Chat from "@/pages/chat";
import WildlifeMap from "@/pages/map";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/discover" component={Discover} />
      <Route path="/centers" component={Centers} />
      <Route path="/learn" component={Learn} />
      <Route path="/about" component={About} />
      <Route path="/identify" component={Identify} />
      <Route path="/chat" component={Chat} />
      <Route path="/map" component={WildlifeMap} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
