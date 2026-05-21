/**
 * Home Page – Landing Page com Oferta de 15% OFF
 * Design: Premium Conversion-Focused
 * Hero Section + Quiz Modal como "Passo a Passo" para desbloquear desconto
 */

import { useLeadContext } from "@/contexts/LeadContext";
import LeadForm from "@/components/LeadForm";
import QuizModal from "@/components/QuizModal";
import { LeadData } from "@/lib/types";
import { useState } from "react";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  const { leadData, setLeadData } = useLeadContext();
  const [showForm, setShowForm] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const handleFormSubmit = (data: LeadData) => {
    setLeadData(data);
    // Abrir o quiz modal após preencher o formulário
    setShowQuizModal(true);
  };

  // Se clicou em "Destravar Desconto" e preencheu o formulário, mostra o formulário
  if (showForm && !leadData) {
    return <LeadForm onSubmit={handleFormSubmit} />;
  }

  // Caso contrário, mostra a Hero Section com Quiz Modal
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="w-full max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/50 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-300">Oferta Exclusiva Limitada</span>
            </div>

            {/* Título Principal com Destaque */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Encontre o Plano de Saúde</span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                15% OFF
              </span>
              <br />
              <span className="text-white">Perfeito para Você</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Responda um rápido questionário (menos de 2 minutos) e desbloqueie seu desconto exclusivo em planos de saúde premium.
            </p>

            {/* CTA Principal - Abre o formulário */}
            <button
              onClick={() => setShowForm(true)}
              className="group mb-16 inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg text-lg"
            >
              <span>Quero Destravar Meus 15% OFF</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Seção de Benefícios */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {/* Benefício 1 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex justify-center mb-4">
                  <div className="bg-orange-500/20 rounded-full p-4">
                    <CheckCircle2 className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Rápido & Fácil</h3>
                <p className="text-slate-400">Menos de 2 minutos para descobrir a melhor opção</p>
              </div>

              {/* Benefício 2 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-500/20 rounded-full p-4">
                    <CheckCircle2 className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">100% Personalizado</h3>
                <p className="text-slate-400">Recomendações baseadas no seu perfil e necessidades</p>
              </div>

              {/* Benefício 3 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-500/20 rounded-full p-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Desconto Garantido</h3>
                <p className="text-slate-400">15% OFF nas 3 primeiras mensalidades</p>
              </div>
            </div>

            {/* Seção de Segurança */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <p className="text-slate-300 mb-4">
                ✅ Seus dados estão seguros e protegidos
              </p>
              <p className="text-sm text-slate-400">
                Usamos criptografia de ponta a ponta e nunca compartilhamos suas informações com terceiros.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <QuizModal 
        isOpen={showQuizModal || (leadData !== null && showForm)} 
        onClose={() => {
          setShowQuizModal(false);
          setShowForm(false);
        }} 
      />
    </>
  );
}
