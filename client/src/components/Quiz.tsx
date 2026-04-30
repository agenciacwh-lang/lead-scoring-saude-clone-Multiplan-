/**
 * Quiz Component – HealthTech Premium
 * Full-screen step-by-step quiz with lead scoring
 * Design: Dark Navy + Teal/Cyan + Emerald Green
 * Fonts: Space Grotesk (display) + DM Sans (body)
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { QUIZ_QUESTIONS, calculateLeadScore } from "@/lib/quizData";
import { useLeadContext } from "@/contexts/LeadContext";
import { ChevronLeft, Heart } from "lucide-react";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663616331473/CDTyNfiJxsVHYYAJrVSjSS/hero-health-bg-igbSPaoZJKBqYM9KqjBYjP.webp";

export default function Quiz() {
  const [, navigate] = useLocation();
  const { quizAnswers, addAnswer } = useLeadContext();
  const [currentStep, setCurrentStep] = useState(1); // 1-6 = questions
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

          if (score.temperature === "frio") {
            navigate("/resultado-frio");
          } else {
            navigate("/obrigado");
          }
          return;
        }

        setCurrentStep((s) => s + 1);
        setAnimDir("in");
        setAnimating(false);
      }, 280);
    },
    [animating, currentQuestion, currentStep, totalSteps, quizAnswers, textInput, navigate, addAnswer]
  );

  const goBack = useCallback(() => {
    if (animating || currentStep === 1) return;
    setAnimating(true);
    setAnimDir("out");
    setTimeout(() => {
      setCurrentStep((s) => Math.max(1, s - 1));
      setAnimDir("in");
      setAnimating(false);
    }, 280);
  }, [animating, currentStep]);

  const handleOptionClick = (optionId: string) => {
    if (animating) return;
    setSelectedOption(optionId);
    // Small delay for visual feedback before advancing
    setTimeout(() => {
      goNext(optionId);
    }, 300);
  };

  return (
    <div
      className="min-h-screen relative flex flex-col overflow-hidden"
      style={{ background: "#0F172A" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-40" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/60 to-[#0F172A]" />

      {/* Progress bar */}
      <div className="relative z-10 w-full h-1 bg-white/10">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #06B6D4, #10B981)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse-ring"
            style={{ background: "linear-gradient(135deg, #06B6D4, #10B981)" }}
          >
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span
            className="font-bold text-sm tracking-wide"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "#06B6D4" }}
          >
            SaúdePlan
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40" style={{ fontFamily: "DM Sans, sans-serif" }}>
            {currentStep} de {totalSteps}
          </span>
          {currentStep > 1 && (
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Step number ghost text */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-[120px] font-black select-none pointer-events-none"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              color: "rgba(6, 182, 212, 0.04)",
              lineHeight: 1,
            }}
          >
            {currentStep}
          </div>

          {/* Card */}
          <div
            ref={cardRef}
            className={`
              relative rounded-2xl border border-white/10 backdrop-blur-md p-6 md:p-8
              ${animating && animDir === "out" ? "animate-slide-out" : ""}
              ${animating && animDir === "in" ? "animate-slide-in" : ""}
              ${!animating ? "animate-fade-up" : ""}
            `}
            style={{
              background: "rgba(22, 33, 62, 0.85)",
              boxShadow:
                "0 0 0 1px rgba(6, 182, 212, 0.1), 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(6, 182, 212, 0.05)",
            }}
          >
            {currentQuestion ? (
              <QuestionContent
                question={currentQuestion}
                selectedOption={selectedOption}
                textInput={textInput}
                onTextChange={setTextInput}
                onOptionClick={handleOptionClick}
                onTextSubmit={() => goNext()}
                isLast={currentStep === totalSteps}
              />
            ) : null}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 px-4">
        <p className="text-xs text-white/20" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Suas informações são confidenciais e protegidas
        </p>
      </footer>
    </div>
  );
}

/* ─── Question Screen ──────────────────────────────────────── */
interface QuestionContentProps {
  question: (typeof QUIZ_QUESTIONS)[0];
  selectedOption: string | null;
  textInput: string;
  onTextChange: (v: string) => void;
  onOptionClick: (id: string) => void;
  onTextSubmit: () => void;
  isLast: boolean;
}

function QuestionContent({
  question,
  selectedOption,
  textInput,
  onTextChange,
  onOptionClick,
  onTextSubmit,
  isLast,
}: QuestionContentProps) {
  return (
    <div className="space-y-5">
      {/* Icon + Question */}
      <div className="space-y-2">
        <div className="text-3xl">{question.icon}</div>
        <h2
          className="text-xl md:text-2xl font-bold text-white leading-snug"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {question.title}
        </h2>
        {question.subtitle && (
          <p
            className="text-sm text-white/50 leading-relaxed"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            {question.subtitle}
          </p>
        )}
      </div>

      {/* Options or Text Input */}
      {question.isTextInput ? (
        <div className="space-y-4">
          <input
            type="text"
            value={textInput}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Ex: 35, 32, 8"
            className="w-full rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-all duration-200"
            style={{
              fontFamily: "DM Sans, sans-serif",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontSize: "16px",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.5)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(6, 182, 212, 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && textInput.trim()) onTextSubmit();
            }}
          />
          <button
            onClick={onTextSubmit}
            disabled={!textInput.trim()}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              background: textInput.trim()
                ? "linear-gradient(135deg, #06B6D4, #10B981)"
                : "rgba(255,255,255,0.1)",
              color: textInput.trim() ? "#0F172A" : "rgba(255,255,255,0.4)",
              boxShadow: textInput.trim()
                ? "0 4px 16px rgba(6, 182, 212, 0.3)"
                : "none",
            }}
          >
            {isLast ? "Ver meu resultado →" : "Continuar →"}
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onOptionClick(option.id)}
              className={`option-card w-full text-left flex items-center gap-3 ${
                selectedOption === option.id ? "selected" : ""
              }`}
            >
              {option.emoji && (
                <span className="text-xl flex-shrink-0">{option.emoji}</span>
              )}
              <span
                className="text-sm font-medium text-white/85"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {option.text}
              </span>
              {selectedOption === option.id && (
                <span className="ml-auto flex-shrink-0 text-primary">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
