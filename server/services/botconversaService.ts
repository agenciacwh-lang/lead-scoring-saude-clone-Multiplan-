import { ENV } from "../_core/env";
import { formatarPayloadBotConversa } from "../utils/valueMapper";

export interface BotconversaLeadPayload {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  pontuacao: number;
  temperatura: "Frio" | "Morno" | "Quente";
  tempo_compra: string;
  situacao_atual: string;
  renda: string;
  criterio_escolha: string;
  cnpj_mei: string;
  idades: string;
  /** Status do lead: 'Lead Incompleto' no Passo 1, 'Lead Concluiu' no Passo 2 */
  status?: string;
}

/**
 * Sanitiza o número de telefone removendo caracteres especiais
 * Exemplo: +55 (85) 98765-4321 → 5585987654321
 */
function sanitizePhone(phone: string | null | undefined): string {
  if (!phone) return "";
  // Remove tudo que não é dígito
  return phone.replace(/\D/g, "");
}

/**
 * Converte null/undefined em string vazia
 */
function nullToEmpty(value: any): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

/**
 * Envia um lead para o BotConversa via webhook
 * Payload com campos na RAIZ (não aninhados) e valores formatados
 */
export async function sendLeadToBotConversa(lead: BotconversaLeadPayload): Promise<boolean> {
  if (!ENV.botconversaWebhookUrl) {
    console.warn("[BotConversa] Webhook URL não configurada. Valor: '", ENV.botconversaWebhookUrl, "'");
    return false;
  }
  
  console.log("[BotConversa] Iniciando envio para URL:", ENV.botconversaWebhookUrl);

  try {
    // Sanitizar telefone: remover +, espaços, parênteses
    const telefoneLimpo = sanitizePhone(lead.telefone);
    
    // Payload com campos na RAIZ (estrutura esperada pelo BotConversa)
    let payload: Record<string, any> = {
      nome: nullToEmpty(lead.nome),
      email: nullToEmpty(lead.email),
      telefone: telefoneLimpo,
      cidade: nullToEmpty(lead.cidade),
      pontuacao: lead.pontuacao,
      temperatura: lead.temperatura,
      tempo_compra: nullToEmpty(lead.tempo_compra),
      situacao_atual: nullToEmpty(lead.situacao_atual),
      renda: nullToEmpty(lead.renda),
      criterio_escolha: nullToEmpty(lead.criterio_escolha),
      cnpj_mei: nullToEmpty(lead.cnpj_mei),
      idades: nullToEmpty(lead.idades),
      // Campo status para controle de funil no BotConversa
      // Passo 1 → 'Lead Incompleto' | Passo 2 → 'Lead Concluiu'
      status: lead.status ?? "Lead Incompleto",
    };
    
    // Formatar valores "crus" em strings legíveis
    // Exemplo: acima_6000 -> "Acima de R$ 6.000"
    // Exemplo: sim_cnpj -> "Sim, tenho CNPJ/MEI"
    payload = formatarPayloadBotConversa(payload);
    
    console.log("[BotConversa] Payload formatado a enviar:", JSON.stringify(payload, null, 2));

    const response = await fetch(ENV.botconversaWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Capturar o corpo da resposta para diagnóstico
      let errorBody = "";
      try {
        errorBody = await response.text();
      } catch (e) {
        errorBody = "(não foi possível ler o corpo da resposta)";
      }
      
      console.error(
        `[BotConversa] ❌ ERRO ao enviar lead!`
      );
      console.error(`[BotConversa] Status HTTP: ${response.status} ${response.statusText}`);
      console.error(`[BotConversa] Response Body: ${errorBody}`);
      console.error(`[BotConversa] Payload que foi enviado:`, JSON.stringify(payload, null, 2));
      return false;
    }

    console.log("[BotConversa] ✅ Lead enviado com sucesso para automação com valores formatados");
    return true;
  } catch (error) {
    console.error("[BotConversa] ❌ Erro ao enviar lead:", error);
    return false;
  }
}
