/**
 * DiscountPopup – Pop-up de desconto exclusivo
 * Aparece quando o lead entra no site com animações suaves
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface DiscountPopupProps {
  onAccept: () => void;
}

export default function DiscountPopup({ onAccept }: DiscountPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Não exibir novamente se o usuário já fechou nesta sessão
    const dismissed = sessionStorage.getItem("discount_popup_dismissed");
    if (dismissed) return;

    // Delay de 2 segundos após o carregamento da página
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setAnimate(true), 50);
    }, 2000);
    return () => clearTimeout(showTimer);
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem("discount_popup_dismissed", "1");
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onAccept();
    }, 400);
  };

  const handleClose = () => {
    sessionStorage.setItem("discount_popup_dismissed", "1");
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop com animação de fade */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 ${
          isClosing ? "animate-backdrop-out" : animate ? "animate-backdrop-in" : "opacity-0"
        }`}
        onClick={handleClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
        }}
      />

      {/* Pop-up centralizado com animação de slide + scale */}
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
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 px-6 py-8 relative">
            {/* Close button com animação hover */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Celebration emoji com bounce */}
            <div className="text-5xl mb-4 animate-bounce">🎉</div>

            {/* Main title com fade-in */}
            <div className="animate-float-in" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-2xl font-bold text-white mb-2">
                Você está a um passo de garantir
              </h2>
              <div className="text-4xl font-black text-white drop-shadow-lg">15% OFF</div>
              <p className="text-white/90 text-sm mt-2">nas suas 3 primeiras mensalidades!</p>
            </div>
          </div>

          {/* Content com animação de entrada */}
          <div className="px-6 py-6 animate-float-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-gray-700 text-center mb-8 leading-relaxed">
              Preencha os próximos dados para liberar seu desconto exclusivo e receber as melhores
              opções de plano de saúde para você.
            </p>

            {/* CTA Button com efeito glow */}
            <button
              onClick={handleConfirm}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:animate-pulse-glow"
            >
              ✓ OK, QUERO MEU DESCONTO
            </button>

            {/* Skip option com transição suave */}
            <button
              onClick={handleClose}
              className="w-full mt-3 text-gray-500 hover:text-gray-700 font-medium py-2 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Talvez depois
            </button>
          </div>

          {/* Footer badge com animação */}
          <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-200 animate-float-in" style={{ animationDelay: "0.3s" }}>
            <p className="text-xs text-gray-600">
              ✨ Oferta exclusiva limitada • Válida apenas para novos clientes
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
