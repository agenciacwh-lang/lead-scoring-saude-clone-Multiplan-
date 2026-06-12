/**
 * Obrigado Page – Leads Quentes e Mornos
 * Design: Hapvida – Branco/Creme + Laranja Vibrante + Azul
 * Consistente com a paleta de cores do formulário
 */

import { useEffect, useState } from "react";
import { Heart, MessageCircle, CheckCircle, Star } from "lucide-react";
import { useLeadContext } from "@/contexts/LeadContext";

// ⚠️ Número de WhatsApp da Hapvida
const WHATSAPP_NUMBER = "5579888218359"; // +55 79 8821-8359
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Acabei de preencher o formulário de qualificação e gostaria de saber mais sobre os planos de saúde disponíveis para mim. 😊"
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function Obrigado() {
  const { leadData } = useLeadContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Exibir nome do lead se disponível
  const leadName = leadData?.nome?.split(" ")[0] || "Cliente";

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-slate-50 to-orange-50 flex items-center justify-center px-4 py-8 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full max-w-2xl">
        {/* Logo Hapvida no topo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/logo-hapvida.png" 
            alt="Hapvida" 
            className="h-16 md:h-20 w-auto object-contain"
          />
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-orange-200">
          {/* Header com Ícone de Sucesso */}
          <div className="relative bg-gradient-to-b from-white to-orange-50 px-8 pt-12 pb-8 text-center">
            {/* Ícone de Sucesso */}
            <div className="relative flex justify-center mb-6">
              <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl w-32 h-32 mx-auto"></div>
              <div className="relative bg-gradient-to-br from-orange-400 to-orange-500 rounded-full p-5 shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              Obrigado, {leadName}! 🎉
            </h1>
            
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Recebemos suas informações com sucesso! Nosso time está analisando seu perfil para encontrar o melhor plano de saúde para você.
            </p>
          </div>

          {/* Conteúdo Principal */}
          <div className="px-8 pb-8">
            {/* Status Message */}


            {/* Info Boxes */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Box 1 - Próximos Passos */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 rounded-full p-3 flex-shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-base">Próximos Passos</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Um especialista entrará em contato em breve com as melhores opções para você.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 2 - Dúvidas */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border-2 border-orange-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500 rounded-full p-3 flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-base">Dúvidas?</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Entre em contato conosco pelo WhatsApp para esclarecer qualquer dúvida.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button - Centralizado */}
            <div className="flex justify-center mb-8">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto max-w-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-base"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
              </a>
            </div>

            {/* Footer Message */}
            <p className="text-center text-sm text-slate-500">
              Você pode fechar esta página ou entrar em contato conosco pelo WhatsApp. Estamos aqui para ajudar! 💙
            </p>

            {/* Security Message */}
            <p className="text-center text-xs text-slate-400 mt-6">
              Seus dados são confidenciais e protegidos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
