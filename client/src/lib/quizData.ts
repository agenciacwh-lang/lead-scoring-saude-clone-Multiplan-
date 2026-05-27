/**
 * LEAD SCORING QUIZ DATA
 * Design: HealthTech Premium – Space Grotesk + DM Sans, Dark Navy + Teal/Green
 *
 * Scoring System (0–10 points):
 *   0–3  → FRIO  → Simulador online
 *   4–7  → MORNO → WhatsApp (Closer/Follow-up)
 *   8–10 → QUENTE → WhatsApp (Atendimento imediato)
 *
 * Priority rules: "O quanto antes" OR "Tenho e quero trocar" → always prioritize
 */

export interface QuizOption {
  id: string;
  text: string;
  points: number;
  emoji?: string;
  label?: string; // Alias opcional para text, usado em alguns componentes
}

export interface QuizQuestion {
  id: number;
  key: string;
  title: string;
  subtitle?: string;
  icon: string;
  options: QuizOption[];
  isTextInput?: boolean; // For question 6 (ages)
  question?: string;    // Alias opcional para title, usado em QuizModal
  placeholder?: string; // Placeholder para campos de texto livre
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    key: "tempo_compra",
    title: "Quando você pretende contratar o plano?",
    subtitle: "Isso nos ajuda a entender sua urgência e priorizar seu atendimento.",
    icon: "🕐",
    options: [
      { id: "pesquisando", text: "Só estou pesquisando", points: 0, emoji: "🔍" },
      { id: "proximos_meses", text: "Nos próximos meses", points: 1, emoji: "📅" },
      { id: "esse_mes", text: "Ainda esse mês", points: 2, emoji: "⚡" },
      { id: "quanto_antes", text: "O quanto antes", points: 3, emoji: "🔥" },
    ],
  },
  {
    id: 2,
    key: "situacao_atual",
    title: "Você já tem plano de saúde hoje?",
    subtitle: "Entender sua situação atual nos permite indicar a melhor opção.",
    icon: "🏥",
    options: [
      { id: "nunca_tive", text: "Nunca tive plano", points: 1, emoji: "🆕" },
      { id: "ja_tive", text: "Já tive, mas não tenho mais", points: 2, emoji: "↩️" },
      { id: "quero_trocar", text: "Tenho e quero trocar", points: 3, emoji: "🔄" },
    ],
  },
  {
    id: 3,
    key: "renda",
    title: "Qual dessas faixas combina mais com a sua realidade hoje?",
    subtitle: "Isso me ajuda a indicar opções de plano mais confortáveis para o seu orçamento 😊",
    icon: "💰",
    options: [
      { id: "ate_1500", text: "Até R$ 1.500", points: 0 },
      { id: "1500_3000", text: "R$ 1.500 a R$ 3.000", points: 0 },
      { id: "3000_6000", text: "R$ 3.000 a R$ 6.000", points: 2 },
      { id: "acima_6000", text: "Acima de R$ 6.000", points: 3 },
    ],
  },
  {
    id: 4,
    key: "criterio_escolha",
    title: "O que é mais importante para você na escolha do plano?",
    subtitle: "Isso define qual produto será ideal para o seu perfil.",
    icon: "⭐",
    options: [
      { id: "preco", text: "Preço (o mais barato possível)", points: 0, emoji: "🏷️" },
      { id: "custo_beneficio", text: "Custo-benefício", points: 1, emoji: "⚖️" },
      { id: "qualidade", text: "Qualidade e atendimento", points: 2, emoji: "🏆" },
    ],
  },
  {
    id: 5,
    key: "cnpj_mei",
    title: "Você possui CNPJ ou MEI?",
    subtitle: "Isso pode abrir acesso a planos empresariais com melhores condições.",
    icon: "🏢",
    options: [
      { id: "sim_cnpj", text: "Sim, tenho CNPJ/MEI", points: 1, emoji: "✅" },
      { id: "nao_cnpj", text: "Não, sou pessoa física", points: 0, emoji: "👤" },
    ],
  },
  {
    id: 6,
    key: "idades",
    title: "Quais as idades de quem vai entrar no plano?",
    subtitle: "Informe as idades de todos os beneficiários (ex: 35, 32, 8).",
    icon: "👨‍👩‍👧",
    options: [], // Text input question
    isTextInput: true,
  },
];

export type LeadTemperature = "quente" | "morno" | "frio";

export interface LeadScore {
  total: number;
  temperature: LeadTemperature;
  isPriority: boolean;
}

export function calculateLeadScore(answers: Record<string, string>): LeadScore {
  let total = 0;
  let isPriority = false;

  // Check priority rules
  if (answers.tempo_compra === "quanto_antes") isPriority = true;
  if (answers.situacao_atual === "quero_trocar") isPriority = true;

  // Sum points for each answered question
  for (const question of QUIZ_QUESTIONS) {
    if (question.isTextInput) continue; // Question 6 doesn't score
    const answerId = answers[question.key];
    if (!answerId) continue;
    const option = question.options.find((o) => o.id === answerId);
    if (option) total += option.points;
  }

  // Cap at 10
  total = Math.min(total, 10);

  let temperature: LeadTemperature;
  if (total <= 3) {
    temperature = "frio";
  } else if (total <= 7) {
    temperature = "morno";
  } else {
    temperature = "quente";
  }

  // Priority override: even morno becomes treated as quente routing
  if (isPriority && temperature === "frio") {
    temperature = "morno"; // Bump frio to morno if priority flag
  }

  return { total, temperature, isPriority };
}

export const TEMPERATURE_CONFIG = {
  quente: {
    label: "Lead Quente 🔥",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    description: "Alta intenção e capacidade de compra",
  },
  morno: {
    label: "Lead Morno ⚡",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    description: "Interesse moderado com potencial de compra",
  },
  frio: {
    label: "Lead Frio ❄️",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "Em fase de pesquisa e comparação",
  },
};
