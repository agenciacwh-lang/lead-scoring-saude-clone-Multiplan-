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
import DiscountPopup from "@/components/DiscountPopup";
import RedeAtendimento from "@/components/RedeAtendimento";
import { trpc } from "@/lib/trpc";
import { Heart, Stethoscope, Users, Zap, Shield, Clock, Facebook, Instagram, MapPin, Phone, Mail, FileText, Building2 } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { leadData, setLeadData } = useLeadContext();
  const [showQuiz, setShowQuiz] = useState(false);

  // ─── Mutations tRPC ───────────────────────────────────────────────────────
  const submitInitial = trpc.leads.submitInitial.useMutation({
    onSuccess: (data) => console.log("[Home] PASSO 1 — Lead inicial capturado:", data),
    onError: (error) => console.error("[Home] PASSO 1 — Erro ao capturar lead inicial:", error),
  });

  const submitCompleted = trpc.leads.submitCompleted.useMutation({
    onSuccess: (data) => console.log("[Home] PASSO 2 — Lead concluído:", data),
    onError: (error) => console.error("[Home] PASSO 2 — Erro ao concluir lead:", error),
  });

  // ─── Scroll para o formulário ─────────────────────────────────────────────
  const scrollToForm = () => {
    const el = document.getElementById("formulario-lead") ?? document.getElementById("formulario-lead-mobile");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // ─── Passo 1: Formulário → Quiz ──────────────────────────────────────────
  const handleFormSubmit = (data: { nome: string; telefone: string; email: string; cidade: string }) => {
    setLeadData(data);
    const telefoneLimpo = data.telefone.replace(/\D/g, "");
    submitInitial.mutate({ nome: data.nome, telefone: telefoneLimpo, email: data.email, cidade: data.cidade });
    setShowQuiz(true);
  };

  // ─── Passo 2: Conclusão do Quiz ──────────────────────────────────────────
  const handleQuizSubmit = (answers: Record<string, string>, temperature: string, score: number) => {
    if (!leadData?.nome) {
      setShowQuiz(false);
      return;
    }
    const telefoneLimpo = leadData.telefone.replace(/\D/g, "");
    const prioridade =
      answers.tempo_compra === "quanto_antes" || answers.situacao_atual === "quero_trocar" ? "Sim" : "Não";

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

    setLocation(temperature === "frio" ? "/confirmado" : "/obrigado");
  };

  const shouldShowQuiz = showQuiz && leadData?.nome;

  return (
    <div className="min-h-screen bg-white">

      {/* ========== POP-UP DE DESCONTO (abre 2s após carregamento) ========== */}
      <DiscountPopup onAccept={scrollToForm} />

      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect fill="%23ffffff" width="1200" height="800" opacity="0.1"/></svg>')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-800/90" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Conteúdo esquerdo */}
            <div className="text-white">
              {/* Logo Hapvida */}
              <div className="mb-8">
                <img
                  src="/hapvida-logo.jpg"
                  alt="Hapvida"
                  className="h-20 lg:h-28 w-auto object-contain rounded-xl"
                />
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Encontre o Plano de Saúde{" "}
                <span className="text-orange-400">Ideal para Você</span>
              </h1>

              <p className="text-lg text-blue-200 mb-8 leading-relaxed">
                Responda algumas perguntas rápidas e receba uma indicação personalizada do melhor
                plano de saúde para o seu perfil e orçamento.
              </p>

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

              <button
                onClick={scrollToForm}
                className="lg:hidden w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg mb-4"
              >
                Encontrar meu plano ideal →
              </button>

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

            {/* Formulário desktop */}
            <div className="hidden lg:flex items-center justify-center h-fit overflow-visible" id="formulario-lead">
              <FormCard className="sticky top-20 h-fit">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    ✨ Responda rápido para liberar seu desconto de 15%
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Vamos fazer algumas perguntinhas rápidas para encontrar o plano de saúde ideal
                    para você, com o melhor custo-benefício e cobertura para o que você realmente
                    precisa!
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

          {/* Formulário mobile */}
          <div className="lg:hidden mt-12" id="formulario-lead-mobile">
            <FormCard className="!rounded-2xl !p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  ✨ Responda rápido para liberar seu desconto de 15%
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Vamos fazer algumas perguntinhas rápidas para encontrar o plano de saúde ideal
                  para você, com o melhor custo-benefício e cobertura para o que você realmente
                  precisa!
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

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
          <div className="text-white text-center">
            <p className="text-sm mb-2">Conheça os benefícios</p>
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ========== BENEFÍCIOS HAPVIDA ========== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              O plano de saúde ideal com um preço que{" "}
              <span className="text-orange-500">cabe no seu orçamento</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Conheça os diferenciais que fazem do Hapvida ser a maior operadora de planos de saúde do Brasil
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "Rede Própria Gigante",
                description:
                  "Mais de 86 hospitais próprios, 80 prontos atendimentos e 365 clínicas integradas — uma estrutura imbatível à sua disposição.",
              },
              {
                icon: Stethoscope,
                title: "Odontologia Completa Inclusa",
                description:
                  "Saúde integral: seu plano já vem com cobertura odontológica, incluindo prevenção, diagnóstico e urgências 24h.",
              },
              {
                icon: Users,
                title: "Maior Rede Exclusiva Pediátrica",
                description:
                  "O cuidado que seu filho merece. A maior e mais moderna rede de atendimento infantil, com UTI neonatal e acompanhamento de ponta.",
              },
              {
                icon: Zap,
                title: "Contact Center e Telemedicina 24h",
                description:
                  "Sua saúde não pode esperar. Acesse consultas, exames e atendimento médico direto pelo celular, a qualquer hora do dia.",
              },
              {
                icon: MapPin,
                title: "Líder da América Latina",
                description:
                  "A maior operadora de saúde da América Latina. Você conta com a solidez, a estrutura e a qualidade de uma verdadeira gigante do mercado, garantindo segurança total para você e sua família.",
              },
              {
                icon: Shield,
                title: "Agendamento 100% Digital",
                description:
                  "Fuja das filas e da burocracia. Todo o controle do seu plano na palma da mão pelo site ou aplicativo.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-100 transition-all duration-200">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
              </div>
            ))}
          </div>

          {/* CTA 1 — abaixo dos benefícios Hapvida */}
          <div className="mt-12 text-center">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-lg py-5 px-10 rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-200 transform hover:scale-105"
            >
              <span>🎁</span>
              <span>Quero aproveitar os 15% de desconto</span>
            </button>
            <p className="mt-3 text-sm text-gray-400">Oferta exclusiva para novos clientes • Sem compromisso</p>
          </div>
        </div>
      </section>

      {/* ========== REDE DE ATENDIMENTO EM SERGIPE ========== */}
      <RedeAtendimento />

      {/* ========== POR QUE ESCOLHER A MULTIPLAN ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a{" "}
              <span className="text-orange-500">Multiplan?</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Somos a sua corretora especialista em planos de saúde em Aracaju e região.
              Encontramos a melhor opção para o seu perfil e orçamento.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Users,
                title: "Atendimento Personalizado",
                description:
                  "Nossa equipe humana analisa o seu perfil e indica o plano ideal com o melhor custo-benefício do mercado.",
              },
              {
                icon: Zap,
                title: "Processo Rápido e Seguro",
                description:
                  "Em poucos minutos você recebe sua cotação personalizada e pode assinar seu contrato 100% online, sem burocracia.",
              },
              {
                icon: Shield,
                title: "A maior corretora de planos de saúde de Sergipe",
                description:
                  "Somos a única corretora Nível Ouro do estado, reconhecimento que reforça nossa credibilidade, experiência e compromisso em oferecer o melhor atendimento para cada cliente.",
              },
              {
                icon: Heart,
                title: "Pós-venda de verdade",
                description:
                  "Aqui, você não contrata seu plano e fica sem suporte. Nosso acompanhamento começa no primeiro atendimento e continua mesmo após a contratação, garantindo suporte, orientação e atendimento de qualidade sempre que precisar.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:border-orange-100 transition-all duration-200 text-center"
              >
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-500/20">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 2 — abaixo da seção Por que escolher a Multiplan */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-base mb-5 max-w-xl mx-auto">
            Pronto para garantir o melhor plano de saúde para você e sua família?
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-lg py-5 px-10 rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-200 transform hover:scale-105"
          >
            <span>🎁</span>
            <span>Quero aproveitar os 15% de desconto</span>
          </button>
          <p className="mt-3 text-sm text-gray-400">Oferta exclusiva para novos clientes • Sem compromisso</p>
        </div>
      </div>

      {/* ========== FOOTER OFICIAL MULTIPLAN ========== */}
      <footer className="bg-gray-950 text-white">
        {/* Faixa superior */}
        <div className="border-b border-white/5 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

              {/* Coluna 1 — Marca */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-6 h-6 text-orange-400" fill="currentColor" />
                  <span className="font-extrabold text-lg tracking-tight">MULTIPLAN</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Especialistas em planos de saúde em Aracaju e região. Encontramos a melhor opção
                  para o seu perfil e orçamento.
                </p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-9 h-9 bg-white/5 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 bg-white/5 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Coluna 2 — Endereços */}
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-orange-400 mb-5">
                  Endereços
                </h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-400 text-sm leading-relaxed">
                      R. São Cristóvão, 431<br />
                      Centro, Aracaju – SE<br />
                      CEP 49055-620
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-400 text-sm leading-relaxed">
                      R. Santa Luzia, 774<br />
                      São José, Aracaju – SE<br />
                      CEP 49015-190
                    </p>
                  </div>
                </div>
              </div>

              {/* Coluna 3 — Contato */}
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-orange-400 mb-5">
                  Contato
                </h4>
                <div className="space-y-3">
                  <a
                    href="tel:+5579999504820"
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    (79) 99950-4820
                  </a>
                  <a
                    href="mailto:comercial@multiplanvendas.com.br"
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm break-all"
                  >
                    <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    comercial@multiplanvendas.com.br
                  </a>
                </div>
              </div>

              {/* Coluna 4 — Dados Legais */}
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-orange-400 mb-5">
                  Dados Legais
                </h4>
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <FileText className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-semibold leading-snug">
                        MULTIPLAN SEGUROS E PLANOS DE SAÚDE
                      </p>
                      <p className="text-gray-500 text-xs mt-1">CNPJ: 26.200.497/0001-85</p>
                      <p className="text-gray-500 text-xs">SUSEP nº 251164987</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Faixa inferior */}
        <div className="py-5">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} Multiplan Seguros e Planos de Saúde. Todos os direitos reservados.</p>
            <p>Corretora de Seguros registrada na SUSEP</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
