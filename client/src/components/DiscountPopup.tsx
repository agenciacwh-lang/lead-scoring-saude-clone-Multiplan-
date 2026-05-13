/**
 * DiscountPopup – Pop-up de desconto exclusivo
 * Aparece quando o lead entra no site
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface DiscountPopupProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DiscountPopup({ onClose, onConfirm }: DiscountPopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setAnimate(true);
  }, []);

  const handleConfirm = () => {
    setAnimate(false);
    setTimeout(() => {
      setIsVisible(false);
      onConfirm();
    }, 300);
  };

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Pop-up */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md transition-all duration-300 ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 px-6 py-8 relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Celebration emoji */}
            <div className="text-5xl mb-4 animate-bounce">🎉</div>

            {/* Main title */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Você está a um passo de garantir
            </h2>
            <div className="text-4xl font-black text-white drop-shadow-lg">15% OFF</div>
            <p className="text-white/90 text-sm mt-2">nas suas 3 primeiras mensalidades!</p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <p className="text-gray-700 text-center mb-8 leading-relaxed">
              Preencha os próximos dados para liberar seu desconto exclusivo e receber as melhores
              opções de plano de saúde para você.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleConfirm}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              ✓ OK, QUERO MEU DESCONTO
            </button>

            {/* Skip option */}
            <button
              onClick={handleClose}
              className="w-full mt-3 text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
            >
              Talvez depois
            </button>
          </div>

          {/* Footer badge */}
          <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-200">
            <p className="text-xs text-gray-600">
              ✨ Oferta exclusiva limitada • Válida apenas para novos clientes
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
