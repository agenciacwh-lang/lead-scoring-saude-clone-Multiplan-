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
      respostasFormatadas[fieldName] = value;
    });
    
    const payload = {
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      cidade: lead.cidade,
      pontuacao: lead.pontuacao,
      temperatura: lead.temperatura,
      respostas: respostasFormatadas,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(ENV.botconversaWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        `[BotConversa] Erro ao enviar lead: ${response.status} ${response.statusText}`
      );
      return false;
    }

    console.log("[BotConversa] Lead enviado com sucesso para automação com respostas formatadas");
    return true;
  } catch (error) {
    console.error("[BotConversa] Erro ao enviar lead:", error);
    return false;
  }
}
