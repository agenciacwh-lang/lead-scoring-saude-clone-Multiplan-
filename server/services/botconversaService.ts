import { ENV } from "../_core/env";
import { formatAllResponses, formatFieldName } from "../utils/valueMapper";

export interface BotconversaLeadPayload {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  respostas: Record<string, string>;
  pontuacao: number;
  temperatura: "Frio" | "Morno" | "Quente";
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
 */
export async function sendLeadToBotConversa(lead: BotconversaLeadPayload): Promise<boolean> {
  if (!ENV.botconversaWebhookUrl) {
    console.warn("[BotConversa] Webhook URL não configurada. Valor: '", ENV.botconversaWebhookUrl, "'");
    return false;
  }
  
  console.log("[BotConversa] Iniciando envio para URL:", ENV.botconversaWebhookUrl);

  try {
    // Formatar as respostas para valores legíveis
    const formattedRespostas = formatAllResponses(lead.respostas);
    
    // Criar objeto com nomes de campos formatados
    const respostasFormatadas: Record<string, string> = {};
    Object.entries(formattedRespostas).forEach(([key, value]) => {
      const fieldName = formatFieldName(key);
      respostasFormatadas[fieldName] = nullToEmpty(value);
    });
    
    // Criar um texto formatado e legível com as respostas
    const respostasTexto = Object.entries(respostasFormatadas)
      .map(([pergunta, resposta]) => `${pergunta}: ${resposta}`)
      .join("\n");
    
    // Sanitizar telefone: remover +, espaços, parênteses
    const telefoneLimpo = sanitizePhone(lead.telefone);
    
    const payload = {
      nome: nullToEmpty(lead.nome),
      email: nullToEmpty(lead.email),
      telefone: telefoneLimpo,
      cidade: nullToEmpty(lead.cidade),
      pontuacao: lead.pontuacao,
      temperatura: lead.temperatura,
      respostas: respostasFormatadas,
      respostas_texto: respostasTexto,
      timestamp: new Date().toISOString(),
    };
    
    console.log("[BotConversa] Payload a enviar:", JSON.stringify(payload, null, 2));

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

    console.log("[BotConversa] ✅ Lead enviado com sucesso para automação com respostas organizadas");
    console.log("[BotConversa] Respostas formatadas:", respostasTexto);
    return true;
  } catch (error) {
    console.error("[BotConversa] ❌ Erro ao enviar lead:", error);
    return false;
  }
}
