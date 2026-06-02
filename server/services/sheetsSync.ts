/**
 * Serviço de sincronização de leads com Google Sheets
 * Sincroniza os leads do banco de dados com uma planilha Google Sheets via webhook
 */

import { getDb } from "../db";
import { leads } from "../../drizzle/schema";
import { ENV } from "../_core/env";
import { formatAllResponses, formatFieldName } from "../utils/valueMapper";

/**
 * Formata um lead para envio ao Google Sheets
 */
function formatLeadForSheets(lead: any) {
  const createdAt = lead.createdAt ? new Date(lead.createdAt) : new Date();
  const temperatura = String(lead.temperatura || 'frio').toUpperCase();
  
  // Formatar respostas do quiz
  const respostasFormatadas = {
    "Quando pretende comprar?": lead.tempo_compra ? formatAllResponses({ tempo_compra: lead.tempo_compra }).tempo_compra : "",
    "Qual é sua situação atual?": lead.situacao_atual ? formatAllResponses({ situacao_atual: lead.situacao_atual }).situacao_atual : "",
    "Qual é sua faixa de renda?": lead.renda ? formatAllResponses({ renda: lead.renda }).renda : "",
    "O que é mais importante para você?": lead.criterio_escolha ? formatAllResponses({ criterio_escolha: lead.criterio_escolha }).criterio_escolha : "",
    "Você tem CNPJ/MEI?": lead.cnpj_mei ? formatAllResponses({ cnpj_mei: lead.cnpj_mei }).cnpj_mei : "",
    "Quais são as idades?": lead.idades || "",
  };
  
  // Normalizar status para exibição amigável
  const statusDisplay = lead.status === "completo" ? "Concluído" : "Incompleto";

  return {
    "ID LEAD": lead.leadCode ?? "",
    "Data/Hora": createdAt.toLocaleString("pt-BR"),
    "Nome": lead.nome || "",
    "Telefone": lead.telefone || "",
    "Email": lead.email || "",
    "Cidade": lead.cidade || "",
    "Status": statusDisplay,
    "Respostas": JSON.stringify(respostasFormatadas, null, 2),
    "pontuacao": lead.pontuacao ?? 0,       // chave explícita para a Coluna G da planilha
    "Pontuação": lead.pontuacao ?? 0,       // alias amigável para o cabeçalho
    "Temperatura": temperatura,
    "Prioridade": lead.prioridade || "Não",
  };
}

/**
 * Envia um lead para o Google Sheets
 * @param lead - dados do lead
 * @param acao - "inserir" (Passo 1, linha nova) ou "atualizar" (Passo 2, atualiza linha existente pelo ID LEAD)
 */
export async function sendLeadToSheets(lead: any, acao: "inserir" | "atualizar" = "inserir"): Promise<boolean> {
  const webhookUrl = ENV.googleSheetsWebhookUrl;
  if (!webhookUrl) {
    console.warn("[Sheets Sync] GOOGLE_SHEETS_WEBHOOK_URL não configurada");
    return false;
  }

  try {
    const formattedLead = formatLeadForSheets(lead);
    // Adicionar campo acao para o Google Apps Script saber se deve inserir ou atualizar
    const payload = { ...formattedLead, acao };
    console.log("[Sheets Sync] Payload formatado a enviar:", JSON.stringify(payload, null, 2));
    console.log("[Sheets Sync] Webhook URL:", webhookUrl);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("[Sheets Sync] Response status:", response.status);
    console.log("[Sheets Sync] Response ok:", response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Sheets Sync] Erro na resposta:", errorText);
      return false;
    }

    console.log("[Sheets Sync] Lead enviado com sucesso para Google Sheets com respostas organizadas:", lead.email);
    console.log("[Sheets Sync] Dados enviados:", JSON.stringify(formattedLead, null, 2));
    return true;
  } catch (error) {
    console.error("[Sheets Sync] Erro ao enviar lead para Google Sheets:", error);
    return false;
  }
}

/**
 * Sincroniza todos os leads não sincronizados com Google Sheets
 * Esta função pode ser chamada periodicamente via scheduled task
 */
export async function syncAllLeadsToSheets(): Promise<{ synced: number; failed: number }> {
  const db = await getDb();
  if (!db) {
    console.warn("[Sheets Sync] Database não disponível");
    return { synced: 0, failed: 0 };
  }

  try {
    // Buscar todos os leads
    const allLeads = await db.select().from(leads);

    let synced = 0;
    let failed = 0;

    // Enviar cada lead para Google Sheets
    for (const lead of allLeads) {
      try {
        const success = await sendLeadToSheets(lead);
        if (success) {
          synced++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error("[Sheets Sync] Erro ao sincronizar lead:", error);
        failed++;
      }
      // Pequeno delay para evitar rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(
      `[Sheets Sync] Sincronização completa: ${synced} sincronizados, ${failed} falhados`
    );
    return { synced, failed };
  } catch (error) {
    console.error("[Sheets Sync] Erro ao sincronizar leads:", error);
    return { synced: 0, failed: 0 };
  }
}

/**
 * Obtém estatísticas dos leads
 */
export async function getLeadsStats() {
  const db = await getDb();
  if (!db) {
    console.warn("[Sheets Sync] Database não disponível");
    return null;
  }

  try {
    const allLeads = await db.select().from(leads);
    const completedLeads = allLeads.filter((l) => l.status === "completo");

    const stats = {
      total: allLeads.length,
      completos: completedLeads.length,
      incompletos: allLeads.filter((l) => l.status === "incompleto").length,
      frios: completedLeads.filter((l) => l.temperatura === "frio").length,
      mornos: completedLeads.filter((l) => l.temperatura === "morno").length,
      quentes: completedLeads.filter((l) => l.temperatura === "quente").length,
      prioridade: completedLeads.filter((l) => l.prioridade === "Sim").length,
    };

    return stats;
  } catch (error) {
    console.error("[Sheets Sync] Erro ao obter estatísticas:", error);
    return null;
  }
}
