/**
 * DiscountPopup – Pop-up de desconto exclusivo
 *
 * Correção definitiva do popup duplicado:
 * - Variável de módulo `_hasTriggered` (fora do componente) persiste entre
 *   re-renders e re-montagens causadas pelo React Strict Mode (que monta,
 *   desmonta e remonta o componente em desenvolvimento).
 * - useRef `hasShown` garante proteção adicional em nível de instância.
 * - sessionStorage impede reabertura após fechar na mesma sessão.
 * - Sem botão X, sem fechamento por overlay ou ESC.
 */

import { useEffect, useRef, useState } from "react";

// ─── Singleton de módulo ──────────────────────────────────────────────────────
// Persiste entre re-montagens do Strict Mode porque vive fora do componente.
let _hasTriggered = false;

interface DiscountPopupProps {
  onAccept: () => void;
}

export default function DiscountPopup({ onAccept }: DiscountPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Proteção de instância — complementa o singleton de módulo
  const hasShown = useRef(false);

  useEffect(() => {
    // Não exibir se já foi dispensado nesta sessão
    if (sessionStorage.getItem("discount_popup_dismissed")) return;

    // Bloquear segunda abertura via singleton de módulo
    if (_hasTriggered) return;
    // Bloquear segunda abertura via ref de instância
    if (hasShown.current) return;

    _hasTriggered = true;
    hasShown.current = true;

    const timer = setTimeout(() => {
      setIsVisible(true);
      // Dois frames para garantir que o DOM foi pintado antes de animar
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimate(true));
      });
    }, 2000);

    // Bloquear tecla ESC (fase de captura para interceptar antes de qualquer handler)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []); // array vazio: roda apenas na montagem

  const closeWithAction = (callback?: () => void) => {
    sessionStorage.setItem("discount_popup_dismissed", "1");
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      callback?.();
    }, 350);
  };

  const handleConfirm = () => closeWithAction(onAccept);
  const handleDismiss = () => closeWithAction();

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay escuro — SEM onClick para não fechar ao clicar fora */}
      <div
        className={`fixed inset-0 bg-black/55 z-40 ${
          isClosing ? "animate-backdrop-out" : animate ? "animate-backdrop-in" : "opacity-0"
        }`}
        style={{ position: "fixed", inset: 0, zIndex: 40 }}
      />

      {/* Modal centralizado */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          width: "100%",
          maxWidth: "28rem",
          padding: "1rem",
        }}
        className={isClosing ? "animate-popup-out" : animate ? "animate-popup-in" : "opacity-0"}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header com gradiente — sem botão X */}
          <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 px-6 py-8">
            <div className="text-5xl mb-4 animate-bounce">🎉</div>
            <div className="animate-float-in" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-2xl font-bold text-white mb-2">
                Você está a um passo de garantir
              </h2>
              <div className="text-4xl font-black text-white drop-shadow-lg">15% OFF</div>
              <p className="text-white/90 text-sm mt-2">nas suas 3 primeiras mensalidades!</p>
            </div>
          </div>

          {/* Corpo */}
          <div className="px-6 py-6 animate-float-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-gray-700 text-center mb-8 leading-relaxed">
              Preencha os próximos dados para liberar seu desconto exclusivo e receber as melhores
              opções de plano de saúde para você.
            </p>

            {/* Botão primário */}
            <button
              onClick={handleConfirm}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              ✓ OK, QUERO MEU DESCONTO
            </button>

            {/* Botão ghost */}
            <button
              onClick={handleDismiss}
              className="w-full mt-3 text-gray-500 hover:text-gray-700 font-medium py-2 transition-all duration-200"
            >
              Talvez depois
            </button>
          </div>

          {/* Rodapé de confiança */}
          <div
            className="bg-gray-50 px-6 py-3 text-center border-t border-gray-200 animate-float-in"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-xs text-gray-600">
              ✨ Oferta exclusiva limitada • Válida apenas para novos clientes
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
