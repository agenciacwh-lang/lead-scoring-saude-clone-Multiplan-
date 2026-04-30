/**
 * Webhook Service - Alternativa para enviar dados dos leads
 * Usa um serviço de webhook público para testes
 */

import { LeadData } from "./types";
import { calculateLeadScore } from "./quizData";

export interface LeadSubmission {
  leadData: LeadData;
  quizAnswers: Record<string, string>;
  score: ReturnType<typeof calculateLeadScore>;
  timestamp: string;
}

/**
 * Mapeia as respostas do quiz para nomes legíveis
 */
function formatQuizAnswers(answers: Record<string, string>): Record<string, string> {
  const answerLabels: Record<string, Record<string, string>> = {
    tempo_compra: {
      pesquisando: "Só pesquisando",
      proximos_meses: "Nos próximos meses",
      esse_mes: "Ainda esse mês",
      quanto_antes: "O quanto antes",
    },
    situacao_atual: {
      nunca_tive: "Nunca tive plano",
      ja_tive: "Já tive, mas não tenho mais",
      quero_trocar: "Tenho e quero trocar",
    },
    renda: {
      ate_1500: "Até R$ 1.500",
      "1500_3000": "R$ 1.500 a R$ 3.000",
      "3000_6000": "R$ 3.000 a R$ 6.000",
      acima_6000: "Acima de R$ 6.000",
    },
    criterio_escolha: {
      preco: "Preço (o mais barato possível)",
      custo_beneficio: "Custo-benefício",
      qualidade: "Qualidade e atendimento",
    },
    cnpj_mei: {
      sim_cnpj: "Sim, tenho CNPJ/MEI",
      nao_cnpj: "Não, sou pessoa física",
    },
    idades: {},
  };

  const formatted: Record<string, string> = {};

  for (const [key, value] of Object.entries(answers)) {
    if (answerLabels[key] && answerLabels[key][value]) {
      formatted[key] = answerLabels[key][value];
    } else {
      formatted[key] = value;
    }
  }

  return formatted;
}

/**
 * Envia dados do lead para Google Sheets via webhook
 * Usa fetch com mode no-cors para contornar problemas de CORS
 */
export async function submitLeadToWebhook(
  submission: LeadSubmission,
  webhookUrl: string
): Promise<boolean> {
  try {
    const formattedAnswers = formatQuizAnswers(submission.quizAnswers);

    // Preparar dados para envio
    const payload = {
      // Dados pessoais
      nome: submission.leadData.nome,
      telefone: submission.leadData.telefone,
      email: submission.leadData.email,
      cidade: submission.leadData.cidade,

      // Respostas do quiz
      tempo_compra: formattedAnswers.tempo_compra || "",
      situacao_atual: formattedAnswers.situacao_atual || "",
      renda: formattedAnswers.renda || "",
      criterio_escolha: formattedAnswers.criterio_escolha || "",
      cnpj_mei: formattedAnswers.cnpj_mei || "",
      idades: formattedAnswers.idades || "",

      // Lead Scoring
      pontuacao: submission.score.total,
      temperatura: submission.score.temperature.toUpperCase(),
      prioridade: submission.score.isPriority ? "Sim" : "Não",

      // Timestamp
      data_hora: submission.timestamp,
    };

    console.log("Enviando dados para webhook:", webhookUrl);
    console.log("Payload:", payload);

    // Enviar via fetch com mode: no-cors
    const response = await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Lead enviado com sucesso para:", webhookUrl);
    return true;
  } catch (error) {
    console.error("Erro ao enviar lead para webhook:", error);
    return false;
  }
}

/**
 * Função auxiliar para testar com webhook.site (serviço gratuito de teste)
 * Você pode usar isso para gerar uma URL de teste em webhook.site
 */
export async function submitLeadToWebhookSite(
  submission: LeadSubmission,
  webhookUrl: string
): Promise<boolean> {
  return submitLeadToWebhook(submission, webhookUrl);
}
