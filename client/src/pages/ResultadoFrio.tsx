/**
 * Resultado Frio Page – Leads Frios
 * Design: Hapvida – Laranja + Branco
 * Redirect: Automação (BotConversa)
 */

import { useEffect, useState } from "react";
import { Heart, CheckCircle } from "lucide-react";
import { useLeadContext } from "@/contexts/LeadContext";
import { calculateLeadScore } from "@/lib/quizData";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const COLD_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663616331473/CDTyNfiJxsVHYYAJrVSjSS/thank-you-cold-WfFUvnA2xi544eNPSPX6aP.webp";

export default function ResultadoFrio() {
  const { leadData, quizAnswers } = useLeadContext();
  const [, navigate] = useLocation();
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Enviar dados do lead para automação
  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      setHasError(false);
      // Redirecionar para home após 3 segundos
      setTimeout(() => {
        navigate("/");
      }, 3000);
    },
    onError: (error) => {
      console.error("Erro ao enviar lead:", error);
      setIsSubmitting(false);
      setHasError(true);
    },
  });

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
        temperatura: "frio" as const,
        prioridade: "Não",
      };

      // Enviar para automação
      submitLead.mutate(leadPayload);
    }
  }, [leadData, quizAnswers, submitLead]);

  // Exibir nome do lead se disponível
  const leadName = leadData?.nome?.split(" ")[0] || "Cliente";

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663616331473/CDTyNfiJxsVHYYAJrVSjSS/hero-health-bg-igbSPaoZJKBqYM9KqjBYjP.webp)`,
        }}
      />
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(231, 76, 60, 0.05) 0%, transparent 70%)",
        }}
      />

      {/* Header logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #E74C3C, #FF6B35)" }}
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
          background: "rgba(255, 255, 255, 0.95)",
          border: "1px solid rgba(231, 76, 60, 0.2)",
          boxShadow:
            "0 0 0 1px rgba(231, 76, 60, 0.1), 0 20px 60px rgba(0,0,0,0.08), 0 0 80px rgba(231, 76, 60, 0.05)",
        }}
      >
        {/* Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={COLD_IMG}
              alt="Sucesso"
              className="w-28 h-28 rounded-full object-cover"
              style={{
                boxShadow: "0 0 0 3px rgba(231, 76, 60, 0.2), 0 0 30px rgba(231, 76, 60, 0.1)",
              }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #E74C3C, #FF6B35)" }}
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3 mb-6">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "rgba(231, 76, 60, 0.1)",
              border: "1px solid rgba(231, 76, 60, 0.2)",
              color: "#E74C3C",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            ✓ Análise concluída
          </div>

          <h1
            className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Obrigado{leadName ? `, ${leadName}` : ""}! 🎉
          </h1>

          <p
            className="text-gray-600 text-sm leading-relaxed"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Seus dados foram recebidos com sucesso! Nossa equipe de especialistas da Hapvida entrará em contato em breve com as melhores opções de planos para você.
            {leadData && (
              <>
                <br />
                <span className="text-xs text-gray-500 mt-2 block">
                  Confirmando: {leadData.email}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Info boxes */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {[
            { icon: "📞", title: "Contato rápido", desc: "Ligamos em breve" },
            { icon: "💼", title: "Consultoria", desc: "Especialista dedicado" },
            { icon: "🎯", title: "Personalizado", desc: "Plano para seu perfil" },
            { icon: "✓", title: "Sem compromisso", desc: "Conheça as opções" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl p-3 text-left"
              style={{
                background: "rgba(231, 76, 60, 0.05)",
                border: "1px solid rgba(231, 76, 60, 0.1)",
              }}
            >
              <div className="text-lg mb-1">{item.icon}</div>
              <div
                className="text-xs font-semibold text-gray-800 mb-0.5"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {item.title}
              </div>
              <div
                className="text-xs text-gray-600"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Loading message */}
        <div
          className="flex items-center justify-center gap-2 py-4 rounded-xl"
          style={{
            background: "rgba(231, 76, 60, 0.1)",
            border: "1px solid rgba(231, 76, 60, 0.2)",
          }}
        >
          {isSubmitting ? (
            <>
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span
                className="text-sm font-medium text-gray-700"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Processando seus dados...
              </span>
            </>
          ) : hasError ? (
            <>
              <span className="text-lg">⚠️</span>
              <span
                className="text-sm font-medium text-red-700"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Erro ao enviar. Tente novamente.
              </span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span
                className="text-sm font-medium text-green-700"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Dados enviados com sucesso!
              </span>
            </>
          )}
        </div>

        <p
          className="text-xs text-gray-500 mt-4"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Seus dados foram registrados com segurança
        </p>
      </div>

      {/* Footer */}
      <p
        className="relative z-10 text-xs text-gray-500 mt-6"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        Suas informações são confidenciais e protegidas
      </p>
    </div>
  );
}
