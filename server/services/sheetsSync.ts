/**
 * Serviço de sincronização de leads com Google Sheets
 * Sincroniza os leads do banco de dados com uma planilha Google Sheets via webhook
 */

import { getDb } from "../db";
import { leads } from "../../drizzle/schema";

// URL do Google Apps Script que você configurou
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || "";

/**
 * Formata um lead para envio ao Google Sheets
 */
function formatLeadForSheets(lead: any) {
  const createdAt = lead.createdAt ? new Date(lead.createdAt) : new Date();
  const temperatura = String(lead.temperatura || 'frio').toUpperCase();
  
  return {
    data_hora: createdAt.toLocaleString("pt-BR"),
    nome: lead.nome || "",
    telefone: lead.telefone || "",
    email: lead.email || "",
    cidade: lead.cidade || "",
    tempo_compra: lead.tempo_compra || "",
    situacao_atual: lead.situacao_atual || "",
    renda: lead.renda || "",
    criterio_escolha: lead.criterio_escolha || "",
    cnpj_mei: lead.cnpj_mei || "",
    idades: lead.idades || "",
    pontuacao: lead.pontuacao || 0,
    temperatura: temperatura,
    prioridade: lead.prioridade || "Não",
  };
}

/**
 * Envia um lead para o Google Sheets
 */
export async function sendLeadToSheets(lead: any): Promise<boolean> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[Sheets Sync] GOOGLE_SHEETS_WEBHOOK_URL não configurada");
    return false;
  }

  try {
    const payload = formatLeadForSheets(lead);
    console.log("[Sheets Sync] Payload a enviar:", JSON.stringify(payload));
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

    console.log("[Sheets Sync] Lead enviado com sucesso para Google Sheets:", lead.email);
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
      const success = await sendLeadToSheets(lead);
      if (success) {
        synced++;
      } else {
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
