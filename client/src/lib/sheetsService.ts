/**
 * Google Sheets Integration Service
 * Envia dados dos leads para uma planilha Google Sheets via webhook
 * 
 * Setup:
 * 1. Criar uma planilha no Google Sheets
 * 2. Usar Google Forms ou Zapier/Make para criar um webhook
 * 3. Substituir WEBHOOK_URL pela URL real
 */

import { LeadData } from "./types";
import { calculateLeadScore } from "./quizData";

// ⚠️ SUBSTITUIR PELA URL REAL DO WEBHOOK
const WEBHOOK_URL = "https://webhook.site/9499762e-d1ab-48e3-8498-9871d3a9749b";

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
    idades: {}, // Text input, mantém o valor original
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
 * Envia dados do lead para Google Sheets
 * Retorna true se bem-sucedido, false caso contrário
 */
export async function submitLeadToSheets(
  submission: LeadSubmission
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

    // Enviar via fetch com mode: no-cors para evitar CORS issues
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Com mode: no-cors, não conseguimos verificar o status real
    // Mas se chegou aqui sem erro, consideramos sucesso
    console.log("Lead enviado para Google Sheets:", payload);
    return true;
  } catch (error) {
    console.error("Erro ao enviar lead para Google Sheets:", error);
    return false;
  }
}

/**
 * Versão alternativa usando Google Apps Script (mais confiável)
 * Se você usar Google Apps Script, substitua a função acima por esta
 */
export async function submitLeadToSheetsViaAppsScript(
  submission: LeadSubmission
): Promise<boolean> {
  try {
    const formattedAnswers = formatQuizAnswers(submission.quizAnswers);

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

    // Google Apps Script URL
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbygyPf_s6pUQ5G321m-d4QiGk5nQe3fGDn-_-ohxt1XRh50yAztxFkV5dNuuw9e1haL3w/exec";

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Com mode: no-cors, não conseguimos verificar o status
    // Mas se chegou aqui sem erro, consideramos sucesso
    console.log("Lead enviado para Google Sheets");
    return true;
  } catch (error) {
    console.error("Erro ao enviar lead para Google Sheets:", error);
    return false;
  }
}
