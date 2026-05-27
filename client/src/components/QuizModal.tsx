/**
 * QuizModal Component – Modal flutuante com Quiz
 * Abre como pop-up com fundo escurecido
 * Design: Premium com barra de progresso
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { QUIZ_QUESTIONS, calculateLeadScore } from "@/lib/quizData";
import { useLeadContext } from "@/contexts/LeadContext";
import { ChevronLeft, X } from "lucide-react";

export interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [, navigate] = useLocation();
  const { quizAnswers, addAnswer } = useLeadContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [textInput, setTextInput] = useState("");
  const [animating, setAnimating] = useState(false);
  const [animDir, setAnimDir] = useState<"in" | "out">("in");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const totalSteps = QUIZ_QUESTIONS.length;
  const questionIndex = currentStep - 1;
  const currentQuestion = QUIZ_QUESTIONS[questionIndex] || null;
  const progress = (currentStep / totalSteps) * 100;

  // Reset selected option when step changes
  useEffect(() => {
    setSelectedOption(null);
    setTextInput("");
  }, [currentStep]);

  // Prevenir scroll quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const goNext = useCallback(
    (answerId?: string) => {
      if (animating) return;

      // Save answer
      if (currentQuestion && answerId) {
        addAnswer(currentQuestion.key, answerId);
      }
      if (currentQuestion?.isTextInput && currentQuestion) {
        addAnswer(currentQuestion.key, textInput);
      }

      setAnimating(true);
      setAnimDir("out");

      setTimeout(() => {
        if (currentStep >= totalSteps) {
          // Calculate score and navigate
          const finalAnswers = currentQuestion?.isTextInput && currentQuestion
            ? { ...quizAnswers, [currentQuestion.key]: textInput }
            : answerId && currentQuestion
            ? { ...quizAnswers, [currentQuestion.key]: answerId }
            : quizAnswers;

          const score = calculateLeadScore(finalAnswers);

          // Fechar modal e navegar
          onClose();
          const targetRoute = score.temperature === "frio" ? "/confirmado" : "/obrigado";
          navigate(targetRoute);
          return;
        }

        setCurrentStep((s) => s + 1);
        setAnimDir("in");
        setAnimating(false);
      }, 280);
    },
    [animating, currentQuestion, currentStep, totalSteps, quizAnswers, textInput, navigate, addAnswer, onClose]
  );

  const goBack = useCallback(() => {
    if (animating || currentStep === 1) return;
    setAnimating(true);
    setAnimDir("out");

    setTimeout(() => {
      setCurrentStep((s) => s - 1);
      setAnimDir("in");
      setAnimating(false);
    }, 280);
  }, [animating, currentStep]);

  const handleClose = () => {
    setCurrentStep(1);
    setTextInput("");
    setSelectedOption(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Fundo escurecido */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal flutuante */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header com barra de progresso */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium opacity-90">
                  🎁 Responda rápido para liberar seu desconto de <span className="font-bold">15%</span>
                </p>
              </div>
              <button
                onClick={handleClose}
                className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de progresso */}
            <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs mt-2 opacity-90">
              Pergunta {currentStep} de {totalSteps}
            </p>
          </div>

          {/* Conteúdo do Quiz */}
          <div className="flex-1 overflow-y-auto p-8">
            {currentQuestion ? (
              <div
                ref={cardRef}
                className={`transition-all duration-300 ${
                  animating
                    ? animDir === "out"
                      ? "opacity-0 scale-95"
                      : "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                }`}
              >
                {/* Pergunta */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {currentQuestion.question ?? currentQuestion.title}
                </h2>

                {/* Opções */}
                {currentQuestion.isTextInput ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={currentQuestion.placeholder ?? "Digite sua resposta"}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedOption(option.id);
                          goNext(option.id);
                        }}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                          selectedOption === option.id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                        }`}
                      >
                        <p className="font-medium text-gray-900">{option.label ?? option.text}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Botão para input de texto */}
                {currentQuestion.isTextInput && (
                  <button
                    onClick={() => goNext()}
                    disabled={!textInput.trim()}
                    className="w-full mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors"
                  >
                    Próximo →
                  </button>
                )}
              </div>
            ) : null}
          </div>

          {/* Footer com botões de navegação */}
          <div className="border-t border-gray-200 p-6 flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Voltar
              </button>
            )}
            <div className="flex-1" />
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
