/**
 * Obrigado Page – Leads Quentes e Mornos
 * Design: HealthTech Premium – Dark Navy + Teal/Green
 * Redirect: WhatsApp (Closer / Follow-up)
 */

import { useEffect, useState } from "react";
import { Heart, MessageCircle, CheckCircle, Star } from "lucide-react";
import { useLeadContext } from "@/contexts/LeadContext";
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Enviar dados para o backend
  const submitLead = trpc.leads.submit.useMutation();

  useEffect(() => {
    if (leadData && quizAnswers) {
      const score = calculateLeadScore(quizAnswers);
      const leadPayload = {
        nome: leadData.nome,
        telefone: leadData.telefone,
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
      submitLead.mutate(leadPayload);
    }
  }, [leadData, quizAnswers, submitLead]);

  // Exibir nome do lead se disponível
  const leadName = leadData?.nome?.split(" ")[0] || "Cliente";
  const isSending = submitLead.isPending;

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: "#0F172A" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663616331473/CDTyNfiJxsVHYYAJrVSjSS/hero-health-bg-igbSPaoZJKBqYM9KqjBYjP.webp)`,
        }}
      />
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Header logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #06B6D4, #10B981)" }}
        >
          <Heart className="w-4 h-4 text-white fill-white" />
        </div>
        <span
          className="font-bold text-sm"
          style={{ fontFamily: "Space Grotesk, sans-serif", color: "#E74C3C" }}
        >
          Hapvida
        </span>
      </div>

      {/* Main card */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl p-8 text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{
          background: "rgba(22, 33, 62, 0.90)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          boxShadow:
            "0 0 0 1px rgba(16, 185, 129, 0.1), 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(16, 185, 129, 0.08)",
        }}
      >
        {/* Success image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={THANK_YOU_IMG}
              alt="Sucesso"
              className="w-28 h-28 rounded-full object-cover"
              style={{
                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.3), 0 0 30px rgba(16, 185, 129, 0.2)",
              }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #06B6D4, #10B981)" }}
            >
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3 mb-6">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#10B981",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <Star className="w-3 h-3 fill-current" />
            Perfil qualificado com sucesso!
          </div>

          <h1
            className="text-2xl md:text-3xl font-bold text-white leading-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Ótimas notícias{leadName ? `, ${leadName}` : ""}! 🎉
          </h1>

          <p
            className="text-white/60 text-sm leading-relaxed"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Com base nas suas respostas, identificamos{" "}
            <strong className="text-white/85">ótimas opções de plano</strong> para o seu perfil.
            Um de nossos consultores especializados está pronto para te atender agora.
            {leadData && (
              <>
                <br />
                <span className="text-xs text-white/40 mt-2 block">
                  Seus dados foram registrados: {leadData.email}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-6">
          {[
            "Atendimento personalizado e sem enrolação",
            "Planos que cabem no seu orçamento",
            "Resposta em menos de 5 minutos",
          ].map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-2.5 text-left px-3 py-2 rounded-lg"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <CheckCircle
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "#10B981" }}
              />
              <span
                className="text-xs text-white/70"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(37, 211, 102, 0.35)",
            textDecoration: "none",
          }}
        >
          <MessageCircle className="w-5 h-5" />
          Falar com consultor no WhatsApp
        </a>

        <p
          className="text-xs text-white/25 mt-4"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Atendimento gratuito • Sem compromisso • Dados registrados
        </p>
      </div>

      {/* Footer */}
      <p
        className="relative z-10 text-xs text-white/20 mt-6"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        Suas informações são confidenciais e protegidas
      </p>
    </div>
  );
}
