/**
 * Home Page – Lead Form or Quiz
 * Design: HealthTech Premium
 */

import { useState } from "react";
import { useLeadContext } from "@/contexts/LeadContext";
import LeadForm from "@/components/LeadForm";
import Quiz from "@/components/Quiz";
import { ManusDialog } from "@/components/ManusDialog";
import { LeadData } from "@/lib/types";

export default function Home() {
  const { leadData, setLeadData } = useLeadContext();
  const [showDialog, setShowDialog] = useState(true);

  const handleFormSubmit = (data: LeadData) => {
    setLeadData(data);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <>
      <ManusDialog
        title="Você está a um passo de garantir 15% OFF"
        logo="https://d2xsxph8kpxj0f.cloudfront.net/310519663616331473/CDTyNfiJxsVHYYAJrVSjSS/hapvida-logo-orange_6f0208fe.png"
        open={showDialog}
        onOpenChange={setShowDialog}
        onLogin={() => setShowDialog(false)}
        onClose={handleDialogClose}
      />
      {leadData ? <Quiz /> : <LeadForm onSubmit={handleFormSubmit} />}
    </>
  );
}
