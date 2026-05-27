/**
 * Home Page – Landing Page Premium Multiplan
 * Fluxo de dois tempos (Carrinho Abandonado):
 *   Passo 1 → leads.submitInitial  ao clicar "Responder perguntas" (status: Incompleto)
 *   Passo 2 → leads.submitCompleted ao concluir o quiz              (status: Concluído)
 * Sem timers no frontend — controle de tempo feito pelo BotConversa.
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { useLeadContext } from "@/contexts/LeadContext";
import LeadForm from "@/components/LeadForm";
import Quiz from "@/components/Quiz";
import FormCard from "@/components/FormCard";
import { trpc } from "@/lib/trpc";
import { calculateLeadScore } from "@/lib/quizData";
import { Heart, Stethoscope, Users, Zap, Shield, Clock, Facebook, Instagram } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { leadData, setLeadData, quizAnswers } = useLeadContext();
  const [showQuiz, setShowQuiz] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // ─── Mutations tRPC ───────────────────────────────────────────────────────
  const submitInitial = trpc.leads.submitInitial.useMutation({
    onSuccess: (data) => {
      console.log("[Home] PASSO 1 — Lead inicial capturado:", data);
    },
    onError: (error) => {
      // Não bloquear o usuário em caso de falha — o quiz ainda abre
      console.error("[Home] PASSO 1 — Erro ao capturar lead inicial:", error);
    },
  });

  const submitCompleted = trpc.leads.submitCompleted.useMutation({
    onSuccess: (data) => {
      console.log("[Home] PASSO 2 — Lead concluído:", data);
    },
    onError: (error) => {
      console.error("[Home] PASSO 2 — Erro ao concluir lead:", error);
    },
  });

  // ─── Carrossel ────────────────────────────────────────────────────────────
  const carouselItems = [
    { title: "Hospital Gabriel Soares", image: "/gabriel-soares.jpg" },
    { title: "Diagnóstico Centro", image: "/diagnostico-centro.jpg" },
    { title: "Clínica Hermes Fontes", image: "/hermes-fontes.jpg" },
    { title: "Clínica São José", image: "/sao-jose.jpg" },
  ].filter((item) => item.image && item.title);

  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () => setCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  // ─── Passo 1: Formulário → Quiz ──────────────────────────────────────────
  const handleFormSubmit = (data: { nome: string; telefone: string; email: string; cidade: string }) => {
    // Salvar dados no contexto para uso posterior
    setLeadData(data);

    // Disparar captura imediata com status "Incompleto" (fire-and-forget)
    // O quiz abre independentemente do resultado da mutation
    const telefoneLimpo = data.telefone.replace(/\D/g, "");
    submitInitial.mutate({
      nome: data.nome,
      telefone: telefoneLimpo,
      email: data.email,
      cidade: data.cidade,
    });

    // Abrir o quiz imediatamente
    setShowQuiz(true);
  };

  // ─── Passo 2: Conclusão do Quiz ──────────────────────────────────────────
  const handleQuizSubmit = (
    answers: Record<string, string>,
    temperature: string,
    score: number
  ) => {
    if (!leadData?.nome) {
      console.warn("[Home] PASSO 2 — leadData ausente, redirecionando para formulário");
      setShowQuiz(false);
      return;
    }

    const telefoneLimpo = leadData.telefone.replace(/\D/g, "");
    const prioridade =
      answers.tempo_compra === "quanto_antes" || answers.situacao_atual === "quero_trocar"
        ? "Sim"
        : "Não";

    // Disparar atualização com status "Concluído" (fire-and-forget)
    submitCompleted.mutate({
      nome: leadData.nome,
      telefone: telefoneLimpo,
      email: leadData.email,
      cidade: leadData.cidade,
      tempo_compra: answers.tempo_compra ?? "",
      situacao_atual: answers.situacao_atual ?? "",
      renda: answers.renda ?? "",
      criterio_escolha: answers.criterio_escolha ?? "",
      cnpj_mei: answers.cnpj_mei ?? "",
      idades: answers.idades ?? "",
      pontuacao: score,
      temperatura: temperature as "frio" | "morno" | "quente",
      prioridade,
    });

    // Navegar para a página de obrigado imediatamente
    const targetRoute = temperature === "frio" ? "/confirmado" : "/obrigado";
    setLocation(targetRoute);
  };

  const scrollToForm = () => {
    const formElement = document.getElementById("formulario-lead");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const shouldShowQuiz = showQuiz && leadData?.nome;

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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-800/90" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-2 mb-6">
                <Heart className="w-4 h-4 text-orange-400" fill="currentColor" />
                <span className="text-sm font-medium text-orange-300">Multiplan Seguros e Planos de Saúde</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Encontre o Plano de Saúde{" "}
                <span className="text-orange-400">Ideal para Você</span>
              </h1>

              <p className="text-lg text-blue-200 mb-8 leading-relaxed">
                Responda algumas perguntas rápidas e receba uma indicação personalizada do melhor plano de saúde para o seu perfil e orçamento.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Shield, text: "Cobertura completa" },
                  { icon: Stethoscope, text: "Rede credenciada ampla" },
                  { icon: Users, text: "Planos individuais e família" },
                  { icon: Zap, text: "Atendimento rápido" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-blue-200">
                    <Icon className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <span className="text-sm">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Mobile */}
              <button
                onClick={scrollToForm}
                className="lg:hidden w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg mb-4"
              >
                Encontrar meu plano ideal →
              </button>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-sm text-blue-300">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Dados protegidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span>Leva 2 minutos</span>
                </div>
              </div>
            </div>

            {/* Right Side - Form (Fixed on Desktop) */}
            <div className="hidden lg:flex items-center justify-center h-fit overflow-visible" id="formulario-lead">
              <FormCard className="sticky top-20 h-fit">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    ✨ Responda rápido para liberar seu desconto de 15%
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Vamos fazer algumas perguntinhas rápidas para encontrar o plano de saúde ideal para você, com o melhor custo-benefício e cobertura para o que você realmente precisa!
                  </p>
                </div>

                {!shouldShowQuiz ? (
                  <LeadForm onSubmit={handleFormSubmit} />
                ) : (
                  <Quiz onSubmit={handleQuizSubmit} />
                )}
              </FormCard>
            </div>
          </div>

          {/* Mobile Form - Below Title */}
          <div className="lg:hidden mt-12" id="formulario-lead-mobile">
            <FormCard className="!rounded-2xl !p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  ✨ Responda rápido para liberar seu desconto de 15%
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Vamos fazer algumas perguntinhas rápidas para encontrar o plano de saúde ideal para você, com o melhor custo-benefício e cobertura para o que você realmente precisa!
                </p>
              </div>

              {!shouldShowQuiz ? (
                <LeadForm onSubmit={handleFormSubmit} />
              ) : (
                <Quiz onSubmit={handleQuizSubmit} />
              )}
            </FormCard>
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher a Multiplan?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Somos especialistas em planos de saúde em Aracaju e região. Encontramos a melhor opção para o seu perfil e orçamento.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Cobertura Completa",
                description: "Planos com ampla cobertura para consultas, exames, internações e cirurgias.",
              },
              {
                icon: Users,
                title: "Atendimento Personalizado",
                description: "Nossa equipe analisa seu perfil e indica o plano mais adequado para você e sua família.",
              },
              {
                icon: Zap,
                title: "Processo Rápido",
                description: "Em poucos minutos você recebe uma indicação personalizada e pode contratar online.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-orange-400" fill="currentColor" />
                <span className="font-bold text-lg">Multiplan</span>
              </div>
              <p className="text-blue-300 text-sm leading-relaxed">
                Especialistas em planos de saúde em Aracaju e região. Encontramos a melhor opção para o seu perfil.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <div className="space-y-2 text-blue-300 text-sm">
                <p>📍 Aracaju - SE</p>
                <p>📱 WhatsApp disponível</p>
                <p>✉️ Atendimento online</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Redes Sociais</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-8 text-center text-blue-400 text-sm">
            <p>© {new Date().getFullYear()} Multiplan Seguros e Planos de Saúde. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
