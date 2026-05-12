/**
 * Obrigado Page – Leads Quentes e Mornos
 * Design: HealthTech Premium – Dark Navy + Teal/Green
 * Redirect: WhatsApp (Closer / Follow-up)
 */

import { useEffect, useState, useRef } from "react";
import { Heart, MessageCircle, CheckCircle, Star } from "lucide-react";
import { useLeadContext, useClearLeadDataAfterSubmit } from "@/contexts/LeadContext";
import { calculateLeadScore } from "@/lib/quizData";
import { trpc } from "@/lib/trpc";

const THANK_YOU_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663616331473/CDTyNfiJxsVHYYAJrVSjSS/thank-you-warm-giqk29yEYFxKNcSRMhRrie.webp";

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
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663616331473/CDTyNfiJxsVHYYAJrVSjSS/hapvida-logo-white-3xQvCHnDvYJrMBHwBqJfZB.png"
            alt="Hapvida"
            className="h-12 mx-auto mb-6"
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Image Section */}
          <div className="relative h-64 bg-gradient-to-r from-teal-400 to-green-400 overflow-hidden">
            <img
              src={THANK_YOU_IMG}
              alt="Thank You"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-10">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-400/30 rounded-full blur-xl"></div>
                <div className="relative bg-gradient-to-br from-teal-400 to-green-400 rounded-full p-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Main Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
              Obrigado, {leadName}! 🎉
            </h1>

            <p className="text-lg text-slate-600 text-center mb-8">
              Recebemos suas informações com sucesso! Nosso time está analisando seu perfil para encontrar o melhor plano de saúde para você.
            </p>

            {/* Status Message */}
            {isSending && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin">
                    <Heart className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-blue-700 font-medium">Enviando seus dados para análise...</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-amber-700 font-medium">
                  ⚠️ Houve um pequeno problema ao enviar seus dados, mas não se preocupe! Você será redirecionado em breve.
                </p>
              </div>
            )}

            {/* Info Boxes */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Box 1 */}
              <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-lg p-4 border border-teal-200">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Próximos Passos</h3>
                    <p className="text-sm text-slate-600">
                      Um especialista entrará em contato em breve com as melhores opções para você.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Dúvidas?</h3>
                    <p className="text-sm text-slate-600">
                      Entre em contato conosco pelo WhatsApp para esclarecer qualquer dúvida.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
              </a>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Voltar ao Início
              </button>
            </div>

            {/* Footer Message */}
            {!isSending && !submitError && (
              <p className="text-center text-sm text-slate-500 mt-6">
                Obrigado por preencher o formulário! Você pode fechar esta página ou entrar em contato conosco.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
