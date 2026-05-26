/**
 * WEBHOOK SERVICE - Sincronização de Status em Tempo Real
 * Sincroniza status do lead com Botconversa, Google Sheets e Supabase
 */

import fetch from "node-fetch";

export type LeadStatus = "Incompleto" | "Concluído";

export interface WebhookPayload {
  telefone: string;
  nome: string;
  email: string;
  cidade: string;
  status: LeadStatus;
  timestamp: string;
  temperature?: string; // Lead Quente, Morno, Frio
  totalScore?: number;
}

/**
 * Dispara webhook para Botconversa com tag correspondente ao status
 */
export async function sendBotconversaWebhook(payload: WebhookPayload): Promise<void> {
  const tag = payload.status === "Concluído" ? "Lead Concluiu" : "Lead Incompleto";

  const botconversaPayload = {
    phone: payload.telefone,
    name: payload.nome,
    email: payload.email,
    city: payload.cidade,
    status: payload.status,
    tag: tag,
    temperature: payload.temperature,
    score: payload.totalScore,
    timestamp: payload.timestamp,
  };

  try {
    const response = await fetch(
      "https://new-backend.botconversa.com.br/api/v1/webhooks-automation/catch/171551/d6MvHVh47DPY/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botconversaPayload),
      }
    );

    if (!response.ok) {
      console.error(
        `[Botconversa Webhook] Erro: ${response.status} - ${response.statusText}`
      );
    } else {
      console.log(`[Botconversa Webhook] Enviado com sucesso - Status: ${payload.status}`);
    }
  } catch (error) {
    console.error("[Botconversa Webhook] Erro na requisição:", error);
  }
}

/**
 * Dispara webhook para Google Sheets
 * Usa telefone como chave primária para atualizar linha existente
 */
export async function sendGoogleSheetsWebhook(payload: WebhookPayload): Promise<void> {
  const googleSheetsPayload = {
    action: "update", // Atualizar linha existente
    primaryKey: payload.telefone, // Telefone como chave primária
    data: {
      telefone: payload.telefone,
      nome: payload.nome,
      email: payload.email,
      cidade: payload.cidade,
      status: payload.status,
      temperature: payload.temperature,
      score: payload.totalScore,
      timestamp: payload.timestamp,
    },
  };

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwQfJQQriDPiG-B3KYS-b1iIaXwNFRWkQeWHYau6hkNVkAAH6YCsBS4lX2ZMnW5mp5Ijw/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleSheetsPayload),
      }
    );

    if (!response.ok) {
      console.error(
        `[Google Sheets Webhook] Erro: ${response.status} - ${response.statusText}`
      );
    } else {
      console.log(`[Google Sheets Webhook] Enviado com sucesso - Status: ${payload.status}`);
    }
  } catch (error) {
    console.error("[Google Sheets Webhook] Erro na requisição:", error);
  }
}

/**
 * Atualiza status no Supabase (Banco de Dados)
 * Usa telefone como chave primária para atualizar registro existente
 */
export async function updateSupabaseStatus(payload: WebhookPayload): Promise<void> {
  try {
    // Importar Supabase client (já está configurado no projeto)
    const { createClient } = await import("@supabase/supabase-js");

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("[Supabase] Credenciais não configuradas");
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Atualizar registro existente usando telefone como chave
    const { error } = await supabase
      .from("leads")
      .update({
        status: payload.status,
        temperature: payload.temperature,
        total_score: payload.totalScore,
        updated_at: new Date().toISOString(),
      })
      .eq("telefone", payload.telefone);

    if (error) {
      console.error("[Supabase] Erro na atualização:", error.message);
    } else {
      console.log(`[Supabase] Atualizado com sucesso - Status: ${payload.status}`);
    }
  } catch (error) {
    console.error("[Supabase] Erro na requisição:", error);
  }
}

/**
 * Função principal: Sincroniza status com todos os destinos
 */
export async function syncLeadStatus(payload: WebhookPayload): Promise<void> {
  console.log(`[Webhook Service] Sincronizando lead - Telefone: ${payload.telefone}, Status: ${payload.status}`);

  // Disparar webhooks em paralelo
  await Promise.all([
    sendBotconversaWebhook(payload),
    sendGoogleSheetsWebhook(payload),
    updateSupabaseStatus(payload),
  ]);

  console.log(`[Webhook Service] Sincronização concluída para ${payload.telefone}`);
}
