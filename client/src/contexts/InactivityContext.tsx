/**
 * InactivityContext – Rastreia inatividade do usuário
 * Se o usuário ficar inativo por mais de 10 minutos, envia lead incompleto
 */

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { useLeadContext } from "./LeadContext";
import { trpc } from "@/lib/trpc";

interface InactivityContextType {
  resetInactivityTimer: () => void;
}

const InactivityContext = createContext<InactivityContextType | undefined>(undefined);

// Tempo de inatividade em milissegundos (10 minutos)
const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

export function InactivityProvider({ children }: { children: ReactNode }) {
  const { leadData, quizAnswers } = useLeadContext();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const submittedRef = useRef(false);

  // Mutation para enviar lead incompleto - SEMPRE chamado, mesmo que não use
  const submitIncompleteLead = trpc.leads.submitIncomplete.useMutation({
    onSuccess: () => {
      console.log("[Inactividade] Lead incompleto enviado com sucesso");
      submittedRef.current = true;
    },
    onError: (error: any) => {
      console.error("[Inatividade] Erro ao enviar lead incompleto:", error);
    },
  });

  const resetInactivityTimer = (): void => {
    // Limpar timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Se não há dados do lead, não fazer nada
    if (!leadData) {
      return;
    }

    // Se o lead já foi submetido, não fazer nada
    if (submittedRef.current) {
      return;
    }

    // Definir novo timer
    timerRef.current = setTimeout(() => {
      // Se o lead está incompleto (não tem todas as respostas do quiz)
      const quizCompleto =
        quizAnswers &&
        quizAnswers.tempo_compra &&
        quizAnswers.situacao_atual &&
        quizAnswers.renda &&
        quizAnswers.criterio_escolha &&
        quizAnswers.cnpj_mei &&
        quizAnswers.idades;

      if (!quizCompleto) {
        console.log("[Inactividade] Lead incompleto detectado após 10 minutos de inatividade");

        // Enviar lead incompleto
        const telefoneLimpo = leadData.telefone.replace(/\D/g, "");

        submitIncompleteLead.mutate({
          nome: leadData.nome,
          telefone: telefoneLimpo,
          email: leadData.email,
          cidade: leadData.cidade,
          tempo_compra: quizAnswers?.tempo_compra || "",
          situacao_atual: quizAnswers?.situacao_atual || "",
          renda: quizAnswers?.renda || "",
          criterio_escolha: quizAnswers?.criterio_escolha || "",
          cnpj_mei: quizAnswers?.cnpj_mei || "",
          idades: quizAnswers?.idades || "",
        });
      }
    }, INACTIVITY_TIMEOUT);
  };

  // Resetar timer quando leadData ou quizAnswers mudam
  useEffect(() => {
    resetInactivityTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [leadData, quizAnswers]);

  // Resetar timer em eventos de atividade do usuário
  useEffect(() => {
    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Eventos que indicam atividade
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [leadData, quizAnswers]);

  return (
    <InactivityContext.Provider value={{ resetInactivityTimer }}>
      {children}
    </InactivityContext.Provider>
  );
}

export function useInactivity() {
  const context = useContext(InactivityContext);
  if (!context) {
    throw new Error("useInactivity deve ser usado dentro de InactivityProvider");
  }
  return context;
}
