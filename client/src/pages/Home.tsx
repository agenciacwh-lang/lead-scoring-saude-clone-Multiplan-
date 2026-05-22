/**
 * Home Page – Landing Page Premium Hapvida
 * Design: Hero Section sofisticado + Benefícios + Formulário fixo
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLeadContext } from "@/contexts/LeadContext";
import LeadForm from "@/components/LeadForm";
import Quiz from "@/components/Quiz";
import { Heart, Stethoscope, Users, Zap, Shield, Clock } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { leadData } = useLeadContext();
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (leadData && leadData.nome) {
      setShowQuiz(true);
    }
  }, [leadData]);

  const handleFormSubmit = () => {
    setShowQuiz(true);
  };

  const handleQuizSubmit = () => {
    setLocation("/obrigado");
  };

  return (
    <div className="min-h-screen bg-white" key="home-page">
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><filter id="blur"><feGaussianBlur in="SourceGraphic" stdDeviation="3"/></filter></defs><rect fill="%23ffffff" width="1200" height="800" opacity="0.1"/></svg>')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px)",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-800/90" />

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8 text-white flex flex-col justify-center">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-500">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <span className="text-2xl font-bold">Hapvida</span>
              </div>

              {/* Main Title */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Garanta <span className="text-orange-400">15% de Desconto</span> no Plano Hapvida Hoje Mesmo!
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Proteção completa para você e sua família com a maior rede de saúde do Brasil. Responda rápido e desbloqueie seu desconto exclusivo nas 3 primeiras mensalidades.
                </p>
              </div>

              {/* CTA Button */}
              <div>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl inline-flex items-center gap-2"
                >
                  Quero Aproveitar os 15% de Desconto
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-8 border-t border-blue-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Leva 2 minutos</span>
                </div>
              </div>
            </div>

            {/* Right Side - Form (Fixed on Desktop) */}
            <div className="hidden lg:flex items-center justify-center h-fit overflow-visible">
              <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 sticky top-20">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ✨ Responda rápido para liberar seu desconto de 15%
                  </h2>
                  <p className="text-gray-600 text-sm">Leva menos de 2 minutos</p>
                </div>

                {!showQuiz ? (
                  <LeadForm onSubmit={handleFormSubmit} />
                ) : (
                  <Quiz onSubmit={handleQuizSubmit} />
                )}
              </div>
            </div>
          </div>

          {/* Mobile Form - Below Title */}
          <div className="lg:hidden mt-12">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  ✨ Responda rápido para liberar seu desconto de 15%
                </h2>
                <p className="text-gray-600 text-sm">Leva menos de 2 minutos</p>
              </div>

              {!showQuiz ? (
                <LeadForm onSubmit={handleFormSubmit} />
              ) : (
                <Quiz onSubmit={handleQuizSubmit} />
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
          <div className="text-white text-center">
            <p className="text-sm mb-2">Conheça os benefícios</p>
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ========== BENEFÍCIOS SECTION ========== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Por que escolher a <span className="text-orange-500">Hapvida?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proteção completa com os melhores benefícios e atendimento de qualidade
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Stethoscope className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Telemedicina 24h</h3>
              <p className="text-gray-600">
                Consulte médicos especialistas a qualquer hora, de qualquer lugar, com segurança e privacidade.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Maior Rede Própria</h3>
              <p className="text-gray-600">
                Acesso a mais de 30 mil profissionais e 5 mil estabelecimentos em todo o Brasil.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Odontologia Inclusa</h3>
              <p className="text-gray-600">
                Cobertura completa em procedimentos odontológicos com profissionais qualificados.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Carências Reduzidas</h3>
              <p className="text-gray-600">
                Prazos menores para ativar seus benefícios e começar a usar seu plano.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Não deixe essa oportunidade passar!
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Aproveite os 15% de desconto nas 3 primeiras mensalidades e comece sua jornada de saúde com a Hapvida.
          </p>
          <button
            onClick={() => setShowQuiz(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl inline-flex items-center gap-2"
          >
            Quero Aproveitar os 15% de Desconto
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-orange-500 fill-orange-500" />
                <span className="text-white font-bold text-lg">Hapvida</span>
              </div>
              <p className="text-sm">Sua saúde é nossa prioridade.</p>
              <p className="text-xs mt-4">CNPJ: 17.197.385/0001-21</p>
            </div>

            {/* Security Badges */}
            <div>
              <h3 className="text-white font-bold mb-4">Segurança</h3>
              <div className="space-y-2 text-sm">
                <p>✓ Dados criptografados</p>
                <p>✓ Certificado SSL</p>
                <p>✓ Privacidade garantida</p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-4">Contato</h3>
              <div className="space-y-2 text-sm">
                <p>📞 0800 000 0000</p>
                <p>💬 WhatsApp: (11) 99999-9999</p>
                <p>📧 contato@hapvida.com.br</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-xs">
            <p>&copy; 2026 Hapvida. Todos os direitos reservados.</p>
            <p className="mt-2">Desenvolvido com ❤️ para sua saúde</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
