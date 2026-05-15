/**
 * Home Page – Lead Form or Quiz
 * Design: HealthTech Premium
 */

import { useLeadContext } from "@/contexts/LeadContext";
import LeadForm from "@/components/LeadForm";
import Quiz from "@/components/Quiz";
import { LeadData } from "@/lib/types";

export default function Home() {
  const { leadData, setLeadData } = useLeadContext();

  const handleFormSubmit = (data: LeadData) => {
    setLeadData(data);
  };

  return leadData ? <Quiz /> : <LeadForm onSubmit={handleFormSubmit} />;
}
