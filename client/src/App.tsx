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
import DiscountPopup from "./components/DiscountPopup";
import Dashboard from "./pages/Dashboard";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/obrigado" component={Obrigado} />

      <Route path="/dashboard" component={Dashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Mostrar pop-up apenas na página inicial e se não tiver sido fechado
    if (location === "/") {
      const hasClosedPopup = localStorage.getItem("discountPopupClosed");
      if (!hasClosedPopup) {
        // Mostrar pop-up após 1 segundo
        const timer = setTimeout(() => {
          setShowPopup(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setShowPopup(false);
    }
  }, [location]);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("discountPopupClosed", "true");
  };

  const handleConfirmPopup = () => {
    setShowPopup(false);
    // Pop-up fecha e o usuário continua no formulário
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LeadProvider>
          <TooltipProvider>
            <Toaster />
            {showPopup && (
              <DiscountPopup onClose={handleClosePopup} onConfirm={handleConfirmPopup} />
            )}
            <Router />
          </TooltipProvider>
        </LeadProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
