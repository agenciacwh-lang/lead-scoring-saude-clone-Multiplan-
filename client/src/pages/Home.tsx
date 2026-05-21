/**
 * Home Page – Landing Page Premium Hapvida
 * Design: Inspirado em seuplanoagora.com.br mas com melhorias
 * Cores: Azul Hapvida + Laranja + Verde
 * Layout: Hero + Formulário lado a lado + Quiz Modal
 */

import { useLeadContext } from "@/contexts/LeadContext";
import LeadForm from "@/components/LeadForm";
import QuizModal from "@/components/QuizModal";
import { LeadData } from "@/lib/types";
import { useState } from "react";
import { CheckCircle2, Heart, Zap, Users, Stethoscope, Clock } from "lucide-react";

export default function Home() {
  const { leadData, setLeadData } = useLeadContext();
  const [showForm, setShowForm] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const handleFormSubmit = (data: LeadData) => {
    setLeadData(data);
    setShowQuizModal(true);
  };

  if (showForm && !leadData) {
    return <LeadForm onSubmit={handleFormSubmit} />;
  }

  return (
    <>
      {/* Hero Section com Formulário */}
      <div className="min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Decorações de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Container principal */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Lado Esquerdo - Conteúdo */}
            <div className="text-white space-y-8">
              {/* Logo Hapvida */}
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-orange-400" />
                <span className="text-2xl font-bold">Hapvida</span>
              </div>

              {/* Título Principal */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Hapvida
                  <br />
                  <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                    Contrate seu plano de saúde aqui
                  </span>
                </h1>
                <p className="text-xl text-blue-100 max-w-md">
                  Encontre o plano perfeito para você e sua família com até <span className="font-bold text-orange-300">15% OFF</span> nas 3 primeiras mensalidades.
                </p>
              </div>



              {/* CTA Botão */}
              <button
                onClick={() => setShowForm(true)}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg text-lg w-full md:w-auto justify-center"
              >
                <span>Quero aproveitar os 15% de desconto</span>
                <Zap className="w-5 h-5" />
              </button>

              {/* Botões Secundários */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 border-2 border-green-400 text-green-400 font-bold rounded-full hover:bg-green-400/10 transition-colors">
                  💬 Simule no WhatsApp
                </button>
                <button className="px-6 py-3 border-2 border-blue-300 text-blue-300 font-bold rounded-full hover:bg-blue-300/10 transition-colors">
                  ☎️ Clique aqui para ligar
                </button>
              </div>
            </div>

            {/* Lado Direito - Formulário */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
              <LeadForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Benefícios */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Por que escolher <span className="text-orange-500">Hapvida</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefício 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Stethoscope className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Rede Exclusiva</h3>
              <p className="text-gray-600">32 Hospitais próprios, 20 Prontos atendimentos e 105 Clínicas em todo Brasil</p>
            </div>

            {/* Benefício 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Odontologia Incluída</h3>
              <p className="text-gray-600">Plano completo com prevenção, diagnóstico, urgência 24h e cobertura em todo Brasil</p>
            </div>

            {/* Benefício 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-orange-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Maior Rede Pediátrica</h3>
              <p className="text-gray-600">Infraestrutura moderna e especializada com UTI neonatal e acompanhamento infantil</p>
            </div>

            {/* Benefício 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Contact Center 24h</h3>
              <p className="text-gray-600">Marcação de consulta, exames e autorização via call center exclusivo sem esperas</p>
            </div>

            {/* Benefício 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-green-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Atendimento 11 Estados</h3>
              <p className="text-gray-600">Atendimento em todos os estados do Norte/Nordeste sem custo adicional</p>
            </div>

            {/* Benefício 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-orange-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Agendamento Online</h3>
              <p className="text-gray-600">Agendamento de consultas, autorização online e chat de atendimento 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Quer saber quanto custa o plano ideal pra você?
          </h2>
          <p className="text-2xl text-orange-300 font-bold mb-8">A partir de R$ 126,89</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg text-lg"
          >
            <span>Baixar Tabela de Preços Hapvida</span>
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </section>

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
