/**
 * DiscountPopup – Pop-up de desconto exclusivo
 *
 * Correções aplicadas:
 * 1. useRef hasShown garante que o setTimeout dispara UMA única vez,
 *    mesmo que o componente sofra re-renders pelo React.
 * 2. Botão X removido completamente.
 * 3. Clique no overlay NÃO fecha o modal (e.stopPropagation removido do modal,
 *    overlay sem onClick).
 * 4. Tecla ESC bloqueada via keydown listener.
 * 5. Única forma de fechar: botões "OK, QUERO MEU DESCONTO" ou "Talvez depois".
 */

import { useEffect, useRef, useState } from "react";

interface DiscountPopupProps {
  onAccept: () => void;
}

export default function DiscountPopup({ onAccept }: DiscountPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Flag de instância: garante que o timer só dispara uma vez por montagem,
  // independentemente de quantos re-renders ocorram
  const hasShown = useRef(false);

  useEffect(() => {
    // Não exibir se já foi dispensado nesta sessão
    if (sessionStorage.getItem("discount_popup_dismissed")) return;

    // Não disparar novamente se já foi agendado nesta montagem
    if (hasShown.current) return;
    hasShown.current = true;

    const showTimer = setTimeout(() => {
      setIsVisible(true);
      // Pequeno delay para o browser pintar o DOM antes de animar
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimate(true));
      });
    }, 2000);

    // Bloquear tecla ESC enquanto o popup estiver visível
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      clearTimeout(showTimer);
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
            {/* Emoji de celebração */}
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
