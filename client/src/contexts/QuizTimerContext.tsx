import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface QuizTimerContextType {
  timeRemaining: number;
  isTimeoutReached: boolean;
  resetTimer: () => void;
  cancelTimer: () => void;
}

const QuizTimerContext = createContext<QuizTimerContextType | undefined>(undefined);

export function QuizTimerProvider({ children }: { children: React.ReactNode }) {
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutos em segundos
  const [isTimeoutReached, setIsTimeoutReached] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Inicia o timer de 5 minutos
   * Quando atinge 0, dispara webhook com status "Incompleto"
   */
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeRemaining(300);
    setIsTimeoutReached(false);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Timer atingiu 0 - disparar webhook de timeout
          setIsTimeoutReached(true);
          if (timerRef.current) clearInterval(timerRef.current);
          
          // Disparar evento para o componente saber que timeout foi atingido
          window.dispatchEvent(new CustomEvent("quizTimeout"));
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Reseta o timer (quando usuário interage)
   */
  const resetTimer = () => {
    startTimer();
  };

  /**
   * Cancela o timer (quando quiz é concluído)
   */
  const cancelTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeRemaining(300);
    setIsTimeoutReached(false);
  };

  // Iniciar timer quando o contexto é montado
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <QuizTimerContext.Provider
      value={{
        timeRemaining,
        isTimeoutReached,
        resetTimer,
        cancelTimer,
      }}
    >
      {children}
    </QuizTimerContext.Provider>
  );
}

export function useQuizTimer() {
  const context = useContext(QuizTimerContext);
  if (!context) {
    throw new Error("useQuizTimer deve ser usado dentro de QuizTimerProvider");
  }
  return context;
}
