/**
 * App.tsx – Lead Scoring Quiz
 * Design: HealthTech Premium – Dark Navy + Teal/Green
 * Routes:
 *   /             → Lead Form (captura de dados) + Quiz (6 questions)
 *   /obrigado     → Thank you page (leads quentes/mornos → WhatsApp)
 *   /resultado-frio → Cold lead page (leads frios → Simulador)
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LeadProvider } from "./contexts/LeadContext";
import Home from "./pages/Home";
import Obrigado from "./pages/Obrigado";
import ResultadoFrio from "./pages/ResultadoFrio";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/obrigado" component={Obrigado} />
      <Route path="/resultado-frio" component={ResultadoFrio} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LeadProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LeadProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
