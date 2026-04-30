/**
 * Resultado Frio Page – Leads Frios
 * Design: HealthTech Premium – Dark Navy + Teal/Cyan
 * Redirect: Simulador Online
 */

import { useEffect, useState } from "react";
import { Heart, Calculator, ArrowRight, Info } from "lucide-react";
import { useLeadContext } from "@/contexts/LeadContext";
import { submitLeadToSheetsViaAppsScript } from "@/lib/sheetsService";
import { calculateLeadScore } from "@/lib/quizData";

const COLD_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663616331473/CDTyNfiJxsVHYYAJrVSjSS/thank-you-cold-WfFUvnA2xi544eNPSPX6aP.webp";

// ⚠️ Substitua pela URL real do simulador
const SIMULADOR_URL = "https://simulador.exemplo.com.br";

export default function ResultadoFrio() {
  const { leadData, quizAnswers } = useLeadContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Enviar dados para Google Sheets
  useEffect(() => {
    if (leadData && quizAnswers) {
      const score = calculateLeadScore(quizAnswers);
      const submission = {
        leadData,
        quizAnswers,
        score,
        timestamp: new Date().toLocaleString("pt-BR"),
      };
      submitLeadToSheetsViaAppsScript(submission).catch((error) => {
        console.error("Erro ao enviar para Sheets:", error);
      });
    }
  }, [leadData, quizAnswers]);

  // Exibir nome do lead se disponível
  const leadName = leadData?.nome?.split(" ")[0] || "Cliente";

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: "#0F172A" }}
    >
      {/* Background */}
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
            "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.07) 0%, transparent 70%)",
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
          style={{ fontFamily: "Space Grotesk, sans-serif", color: "#06B6D4" }}
        >
          SaúdePlan
        </span>
      </div>

      {/* Main card */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl p-8 text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{
          background: "rgba(22, 33, 62, 0.90)",
          border: "1px solid rgba(6, 182, 212, 0.2)",
          boxShadow:
            "0 0 0 1px rgba(6, 182, 212, 0.1), 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(6, 182, 212, 0.06)",
        }}
      >
        {/* Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={COLD_IMG}
              alt="Simulador"
              className="w-28 h-28 rounded-full object-cover"
              style={{
                boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.3), 0 0 30px rgba(6, 182, 212, 0.2)",
              }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #06B6D4, #0284C7)" }}
            >
              <Calculator className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3 mb-6">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "rgba(6, 182, 212, 0.15)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              color: "#06B6D4",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <Info className="w-3 h-3" />
            Simulação personalizada disponível
          </div>

          <h1
            className="text-2xl md:text-3xl font-bold text-white leading-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Obrigado pelas respostas{leadName ? `, ${leadName}` : ""}! 😊
          </h1>

          <p
            className="text-white/60 text-sm leading-relaxed"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Preparamos uma{" "}
            <strong className="text-white/85">simulação gratuita e personalizada</strong> com os
            melhores planos disponíveis para o seu perfil. Veja os valores agora mesmo!
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

        {/* Info boxes */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {[
            { icon: "🔍", title: "Compare planos", desc: "Veja opções lado a lado" },
            { icon: "💰", title: "Valores reais", desc: "Sem surpresas na hora de contratar" },
            { icon: "⚡", title: "Resultado rápido", desc: "Simulação em segundos" },
            { icon: "🎯", title: "Personalizado", desc: "Baseado no seu perfil" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl p-3 text-left"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="text-lg mb-1">{item.icon}</div>
              <div
                className="text-xs font-semibold text-white/80 mb-0.5"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {item.title}
              </div>
              <div
                className="text-xs text-white/40"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Simulator CTA */}
        <a
          href={SIMULADOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            background: "linear-gradient(135deg, #06B6D4, #0284C7)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(6, 182, 212, 0.35)",
            textDecoration: "none",
          }}
        >
          <Calculator className="w-5 h-5" />
          Acessar simulador gratuito
          <ArrowRight className="w-4 h-4" />
        </a>

        <p
          className="text-xs text-white/25 mt-4"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Gratuito • Sem cadastro • Resultado imediato • Dados registrados
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
