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
import Home from "./pages/Home";
import Obrigado from "./pages/Obrigado";
import DiscountPopup from "./components/DiscountPopup";

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/obrigado" component={Obrigado} />
      <Route path="/confirmado" component={Obrigado} />


      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  // O DiscountPopup gerencia seu próprio estado interno via sessionStorage
  // e o delay de 2s. Só renderiza na página inicial.
  const isHome = location === "/";

  const handlePopupAccept = () => {
    // Rola até o formulário na página inicial
    const el = document.getElementById("formulario-lead") ?? document.getElementById("formulario-lead-mobile");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {isHome && <DiscountPopup onAccept={handlePopupAccept} />}
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
