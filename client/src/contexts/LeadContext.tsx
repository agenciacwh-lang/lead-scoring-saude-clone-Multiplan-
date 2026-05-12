/**
 * LeadContext – Compartilha dados do lead durante todo o fluxo
 * Armazena: nome, telefone, e-mail, cidade, respostas do quiz
 * Persistência: localStorage para manter dados mesmo após recarregar
 */

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { LeadData } from "@/lib/types";

interface LeadContextType {
  leadData: LeadData | null;
  setLeadData: (data: LeadData) => void;
  quizAnswers: Record<string, string>;
  setQuizAnswers: (answers: Record<string, string>) => void;
  addAnswer: (key: string, value: string) => void;
  clearLeadData: () => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

const LEAD_DATA_KEY = "hapvida_lead_data";
const QUIZ_ANSWERS_KEY = "hapvida_quiz_answers";

export function LeadProvider({ children }: { children: ReactNode }) {
  // Recuperar dados do localStorage na inicialização
  const [leadData, setLeadDataState] = useState<LeadData | null>(() => {
    try {
      const stored = localStorage.getItem(LEAD_DATA_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [quizAnswers, setQuizAnswersState] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(QUIZ_ANSWERS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Salvar leadData no localStorage quando mudar
  const setLeadData = (data: LeadData) => {
    setLeadDataState(data);
    localStorage.setItem(LEAD_DATA_KEY, JSON.stringify(data));
  };

  // Salvar quizAnswers no localStorage quando mudar
  const setQuizAnswers = (answers: Record<string, string>) => {
    setQuizAnswersState(answers);
    localStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(answers));
  };

  // Limpar dados do localStorage
  const clearLeadData = () => {
    setLeadDataState(null);
    setQuizAnswersState({});
    localStorage.removeItem(LEAD_DATA_KEY);
    localStorage.removeItem(QUIZ_ANSWERS_KEY);
  };

  const addAnswer = (key: string, value: string) => {
    const newAnswers = { ...quizAnswers, [key]: value };
    setQuizAnswersState(newAnswers);
    localStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(newAnswers));
  };

  return (
    <LeadContext.Provider
      value={{
        leadData,
        setLeadData,
        quizAnswers,
        setQuizAnswers,
        addAnswer,
        clearLeadData,
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

// Hook para limpar dados após envio bem-sucedido
export function useClearLeadDataAfterSubmit() {
  const { clearLeadData } = useLeadContext();
  return clearLeadData;
}
