/**
 * Home Page – Landing Page Premium Hapvida
 * Design: Hero Section sofisticado + Benefícios + Formulário fixo
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLeadContext } from "@/contexts/LeadContext";
import LeadForm from "@/components/LeadForm";
import Quiz from "@/components/Quiz";
import { Heart, Stethoscope, Users, Zap, Shield, Clock, Facebook, Instagram, ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { leadData } = useLeadContext();
  const [showQuiz, setShowQuiz] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselItems = [
    {
      title: "Hospital Gabriel Soares",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop",
    },
    {
      title: "Hapclínicas Aracaju",
      image: "https://images.unsplash.com/photo-1631217b9201-d5ffd5433f13?w=800&h=500&fit=crop",
    },
    {
      title: "Pronto Atendimento 24h",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=800&h=500&fit=crop",
    },
  ];

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

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

  const scrollToForm = () => {
    const formElement = document.getElementById("formulario-lead");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
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
                  onClick={scrollToForm}
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
            <div className="hidden lg:flex items-center justify-center h-fit overflow-visible" id="formulario-lead">
              <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 sticky top-20 h-fit">
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
          <div className="lg:hidden mt-12" id="formulario-lead-mobile">
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
              Por que escolher a <span className="text-orange-500">Multiplan?</span>
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

      {/* ========== TIPOS DE PLANO ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Escolha o Plano Ideal para Você
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soluções personalizadas com a melhor cobertura e preço justo
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Individual */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">INDIVIDUAL</h3>
                <div className="h-1 w-16 bg-orange-500 rounded"></div>
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Sua saúde em primeiro lugar. Cobertura completa para consultas, exames e urgências com o melhor custo-benefício. Garanta sua tranquilidade pagando menos.
              </p>
              <button
                onClick={scrollToForm}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Simular com Desconto
              </button>
            </div>

            {/* Card 2 - Familiar */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 md:scale-105">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-orange-900 mb-2">FAMILIAR</h3>
                <div className="h-1 w-16 bg-blue-900 rounded"></div>
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Proteção para quem você mais ama. Ampla rede pediátrica e estrutura completa para cuidar de toda a sua família com mensalidades que cabem no bolso.
              </p>
              <button
                onClick={scrollToForm}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Simular com Desconto
              </button>
            </div>

            {/* Card 3 - Empresarial */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-green-900 mb-2">EMPRESARIAL (MEI / PME)</h3>
                <div className="h-1 w-16 bg-orange-500 rounded"></div>
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Saúde para o seu negócio crescer. Condições exclusivas a partir de 2 vidas (válido para MEI). Valorize sua equipe com a maior rede do Norte e Nordeste.
              </p>
              <button
                onClick={scrollToForm}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Simular com Desconto
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== REDE DE ATENDIMENTO ========== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Maior Rede Exclusiva de Sergipe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Atendimento de ponta e infraestrutura completa pertinho de você
            </p>
          </div>

          {/* Carousel */}
          <div className="relative max-w-4xl mx-auto">
            {/* Carousel Container */}
            <div className="relative h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-2xl">
              {/* Slides */}
              {carouselItems.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    index === carouselIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-8 w-full">
                      <h3 className="text-3xl font-bold text-white">{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 p-3 rounded-full shadow-lg transition-all duration-200 z-10"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 p-3 rounded-full shadow-lg transition-all duration-200 z-10"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === carouselIndex
                      ? "bg-blue-900 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
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
            Aproveite os 15% de desconto nas 3 primeiras mensalidades e comece sua jornada de saúde com a Multiplan.
          </p>
          <button
            onClick={scrollToForm}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-3">MULTIPLAN SEGUROS E PLANOS DE SAÚDE</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>CNPJ:</strong> 26.200.497/0001-85</p>
                  <p><strong>SUSEP:</strong> nº 251164987</p>
                  <p><strong>Endereço:</strong> R. São Cristóvão, 431 - Centro, Aracaju - SE, 49055-620</p>
                </div>
              </div>
            </div>

            {/* Contact & Social */}
            <div>
              <h3 className="text-white font-bold mb-4">Contato</h3>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Telefone/WhatsApp:</strong>
                  <br />
                  <a href="tel:+5579999232489" className="text-orange-400 hover:text-orange-300 transition">
                    (79) 99923-2489
                  </a>
                </p>
                <p>
                  <strong>E-mail:</strong>
                  <br />
                  <a href="mailto:comercial@multiplanvendas.com.br" className="text-orange-400 hover:text-orange-300 transition">
                    comercial@multiplanvendas.com.br
                  </a>
                </p>
              </div>

              {/* Social Media */}
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 transition"
                  title="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 transition"
                  title="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-xs">
            <p>&copy; 2026 Multiplan Seguros e Planos de Saúde. Todos os direitos reservados.</p>
            <p className="mt-2">Desenvolvido com ❤️ para sua saúde</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
