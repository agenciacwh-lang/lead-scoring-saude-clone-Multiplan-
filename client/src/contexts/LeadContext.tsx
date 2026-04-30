/**
 * LeadContext – Compartilha dados do lead durante todo o fluxo
 * Armazena: nome, telefone, e-mail, cidade, respostas do quiz
 */

import { createContext, useContext, useState, ReactNode } from "react";
import { LeadData } from "@/lib/types";

interface LeadContextType {
  leadData: LeadData | null;
  setLeadData: (data: LeadData) => void;
  quizAnswers: Record<string, string>;
  setQuizAnswers: (answers: Record<string, string>) => void;
  addAnswer: (key: string, value: string) => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const addAnswer = (key: string, value: string) => {
    setQuizAnswers((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <LeadContext.Provider
      value={{
        leadData,
        setLeadData,
        quizAnswers,
        setQuizAnswers,
        addAnswer,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export function useLeadContext() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLeadContext deve ser usado dentro de LeadProvider");
  }
  return context;
}
