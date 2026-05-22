/**
 * Home Page – Landing Page Premium Hapvida
 * Design: Ultra-realista, sofisticado, foco em conversão
 * Layout: Hero Section + Formulário Fixo (lado direito) + Benefícios + Rodapé
 */

import { useState, useEffect } from "react";
import { Heart, Shield, Phone, Users, CheckCircle, Lock, Award, Zap } from "lucide-react";
import { useLeadContext } from "@/contexts/LeadContext";
import LeadForm from "@/components/LeadForm";
import { LeadData } from "@/lib/types";

const WHATSAPP_NUMBER = "5541991916738";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Gostaria de saber mais sobre os planos Hapvida com 15% de desconto. 😊"
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function Home() {
  const { leadData, setLeadData } = useLeadContext();
  const [formVisible, setFormVisible] = useState(true);

  const handleFormSubmit = (data: LeadData) => {
    setLeadData(data);
    // Redirecionamento será feito automaticamente pelo contexto
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 h-screen flex items-center">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div className="text-white space-y-8">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <span className="text-2xl font-bold">Hapvida</span>
              </div>

              {/* Main Title */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Garanta <span className="text-orange-400">15% de Desconto</span> no Plano Hapvida <span className="text-orange-400">Hoje Mesmo!</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                  Proteção completa para você e sua família com a melhor rede de saúde do Brasil. Telemedicina 24h, odontologia inclusa e muito mais.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setFormVisible(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Quero Meus 15% OFF
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold py-4 px-8 rounded-xl transition-all duration-200 text-lg flex items-center justify-center gap-2"
                >
                  💬 Falar no WhatsApp
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-8 border-t border-blue-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Dados Protegidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Certificado</span>
                </div>
              </div>
            </div>

            {/* Right Side - Form (Fixed) */}
            <div className="hidden lg:block">
              {formVisible && (
                <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-20 max-h-[calc(100vh-80px)] overflow-y-auto">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Responda rápido para liberar seu desconto de 15%</h2>
                    <p className="text-gray-600 text-sm">Leva menos de 2 minutos</p>
                  </div>
                  <LeadForm onSubmit={handleFormSubmit} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
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
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Por que escolher a <span className="text-orange-500">Hapvida?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proteção completa com os melhores benefícios e atendimento de qualidade
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Maior Rede Exclusiva</h3>
              <p className="text-gray-600">
                Acesso a mais de 50 mil prestadores em todo o Brasil
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Phone className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Telemedicina 24h</h3>
              <p className="text-gray-600">
                Consultas com médicos especialistas disponíveis 24 horas por dia
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Odontologia Inclusa</h3>
              <p className="text-gray-600">
                Cobertura completa de tratamentos odontológicos sem custos adicionais
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Programas de Prevenção</h3>
              <p className="text-gray-600">
                Acesso a programas de saúde preventiva e bem-estar para toda família
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Não perca essa oportunidade!</h3>
            <p className="text-lg mb-8 text-blue-100">
              15% de desconto nas 3 primeiras mensalidades. Oferta limitada!
            </p>
            <button
              onClick={() => setFormVisible(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 text-lg flex items-center justify-center gap-2 mx-auto"
            >
              <Zap className="w-5 h-5" />
              Aproveitar Desconto Agora
            </button>
          </div>
        </div>
      </section>

      {/* ========== AUTORIDADE & SEGURANÇA ========== */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 items-center">
            {/* CNPJ & Info */}
            <div className="text-center md:text-left">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">MULTIPLAN SAÚDE S/A</h4>
              <p className="text-gray-600">CNPJ: 17.197.385/0001-21</p>
              <p className="text-gray-600 text-sm mt-2">Operadora de Planos de Saúde</p>
            </div>

            {/* Security Badges */}
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">SSL Seguro</p>
              </div>
              <div className="text-center">
                <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Dados Protegidos</p>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Certificado ANS</p>
              </div>
            </div>

            {/* WhatsApp Button */}
            <div className="text-center md:text-right">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
                Falar com Consultor
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p>Seus dados são confidenciais e protegidos | © 2024 Hapvida - Todos os direitos reservados</p>
          </div>
        </div>
      </section>

      {/* Mobile Form - Visible on small screens */}
      {formVisible && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <button
              onClick={() => setFormVisible(false)}
              className="float-right text-gray-600 hover:text-gray-900 text-2xl font-bold"
            >
              ×
            </button>
            <div className="mb-6 clear-both">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Responda rápido para liberar seu desconto de 15%</h2>
              <p className="text-gray-600 text-sm">Leva menos de 2 minutos</p>
            </div>
            <LeadForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      )}
    </div>
  );
}
