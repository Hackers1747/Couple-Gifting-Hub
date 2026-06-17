import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Create from "@/pages/Create";
import Preview from "@/pages/Preview";
import Payment from "@/pages/Payment";
import Card from "@/pages/Card";
import Dashboard from "@/pages/Dashboard";
import ExpiredCard from "@/pages/ExpiredCard";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create" component={Create} />
      <Route path="/preview/:id" component={Preview} />
      <Route path="/payment/:id" component={Payment} />
      <Route path="/card/:slug" component={Card} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/expired" component={ExpiredCard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
