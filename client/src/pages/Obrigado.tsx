/**
 * Obrigado Page – Leads Quentes e Mornos
 * Design: Hapvida – Azul Escuro + Laranja + Verde Teal
 * Consistente com o tema do site inteiro
 */

import { useEffect, useState, useRef } from "react";
import { Heart, MessageCircle, CheckCircle, Star, ArrowRight } from "lucide-react";
import { useLeadContext, useClearLeadDataAfterSubmit } from "@/contexts/LeadContext";
import { calculateLeadScore } from "@/lib/quizData";
import { trpc } from "@/lib/trpc";

// ⚠️ Substitua pelo número de WhatsApp real
const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Acabei de preencher o formulário de qualificação e gostaria de saber mais sobre os planos de saúde disponíveis para mim. 😊"
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function Obrigado() {
  const { leadData, quizAnswers } = useLeadContext();
  const clearLeadData = useClearLeadDataAfterSubmit();
  const [visible, setVisible] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  
  // Flag para garantir que o envio acontece apenas uma vez
  const sentRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Enviar dados para o backend
  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      console.log("[Lead] Lead enviado com sucesso para automação");
      clearLeadData();
      // Não redirecionar - manter na página de Obrigado
    },
    onError: (error) => {
      console.error("[Lead] Erro ao enviar lead:", error);
      setSubmitError(true);
    },
  });

  useEffect(() => {
    // Evitar múltiplos submits
    if (sentRef.current) return;
    if (!leadData || !quizAnswers) return;

    sentRef.current = true;
    const score = calculateLeadScore(quizAnswers);
    
    // Sanitizar telefone: remover caracteres não-numéricos
    const telefoneLimpo = leadData.telefone.replace(/\D/g, "");
    
    const leadPayload = {
      nome: leadData.nome,
      telefone: telefoneLimpo,
      email: leadData.email,
      cidade: leadData.cidade,
      tempo_compra: quizAnswers.tempo_compra || "",
      situacao_atual: quizAnswers.situacao_atual || "",
      renda: quizAnswers.renda || "",
      criterio_escolha: quizAnswers.criterio_escolha || "",
      cnpj_mei: quizAnswers.cnpj_mei || "",
      idades: quizAnswers.idades || "",
      pontuacao: score.total,
      temperatura: score.temperature as "frio" | "morno" | "quente",
      prioridade: score.isPriority ? "Sim" : "Não",
    };
    
    console.log("[Lead] Enviando lead para automação:", leadPayload);
    submitLead.mutate(leadPayload);
  }, [leadData, quizAnswers]);

  // Exibir nome do lead se disponível
  const leadName = leadData?.nome?.split(" ")[0] || "Cliente";
  const isSending = submitLead.isPending;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center px-4 py-8 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full max-w-2xl">
        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header com Gradiente Hapvida */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 overflow-hidden">
            {/* Decoração de fundo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
            </div>

            {/* Ícone de Sucesso */}
            <div className="relative h-full flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-400/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-teal-300 to-emerald-400 rounded-full p-6 shadow-lg">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="p-8 md:p-12">
            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-2">
              Obrigado, {leadName}! 🎉
            </h1>
            
            <p className="text-center text-slate-600 text-lg mb-8">
              Recebemos suas informações com sucesso! Nosso time está analisando seu perfil para encontrar o melhor plano de saúde para você.
            </p>

            {/* Status Message */}
            {isSending && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-center gap-3">
                <div className="animate-spin">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-blue-700 font-medium">Enviando seus dados para análise...</p>
              </div>
            )}

            {submitError && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <p className="text-amber-700 font-medium">
                  ⚠️ Houve um pequeno problema ao enviar seus dados, mas não se preocupe! Você pode tentar novamente ou entrar em contato conosco.
                </p>
              </div>
            )}

            {/* Info Boxes */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Box 1 - Próximos Passos */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full p-3 flex-shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">Próximos Passos</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Um especialista entrará em contato em breve com as melhores opções para você.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 2 - Dúvidas */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-full p-3 flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">Dúvidas?</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Entre em contato conosco pelo WhatsApp para esclarecer qualquer dúvida.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
              </a>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                Voltar ao Início
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Footer Message */}
            {!isSending && !submitError && (
              <p className="text-center text-sm text-slate-500">
                Você pode fechar esta página ou entrar em contato conosco pelo WhatsApp. Estamos aqui para ajudar! 💙
              </p>
            )}
          </div>
        </div>

        {/* Logo Hapvida no rodapé */}
        <div className="text-center mt-8">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663616331473/CDTyNfiJxsVHYYAJrVSjSS/hapvida-logo-white-3xQvCHnDvYJrMBHwBqJfZB.png"
            alt="Hapvida"
            className="h-8 mx-auto opacity-80"
          />
        </div>
      </div>
    </div>
  );
}
