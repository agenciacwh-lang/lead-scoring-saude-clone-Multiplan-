/**
 * InactivityContext – DESATIVADO
 *
 * O controle de inatividade (carrinho abandonado) foi migrado para o BotConversa.
 * O site agora usa o fluxo de dois tempos:
 *   Passo 1 → leads.submitInitial  (status: Incompleto) ao clicar "Responder perguntas"
 *   Passo 2 → leads.submitCompleted (status: Concluído) ao finalizar o quiz
 *
 * O BotConversa aguarda 5 minutos após o Passo 1 e verifica se o status mudou.
 * Nenhum setTimeout ou listener de atividade é necessário no frontend.
 *
 * Este provider é mantido apenas para não quebrar o wiring em main.tsx.
 */

import { createContext, useContext, ReactNode } from "react";

interface InactivityContextType {
  resetInactivityTimer: () => void;
}

const InactivityContext = createContext<InactivityContextType>({
  resetInactivityTimer: () => {},
});

export function InactivityProvider({ children }: { children: ReactNode }) {
  return (
    <InactivityContext.Provider value={{ resetInactivityTimer: () => {} }}>
      {children}
    </InactivityContext.Provider>
  );
}

export function useInactivity() {
  return useContext(InactivityContext);
}
