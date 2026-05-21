import { createHash } from "crypto";
import { ENV } from "../_core/env";

/**
 * Interface para o payload do evento CAPI do Facebook
 */
export interface FacebookCapiEventPayload {
  leadId: number;
  email: string;
  telefone: string;
  pageUrl?: string;
}

/**
 * Aplica hash SHA-256 em uma string
 * Necessário para a CAPI do Facebook (dados com hash)
 * 
 * @param value - Valor a ser hasheado
 * @returns String hasheada em SHA-256
 */
function hashSHA256(value: string): string {
  if (!value) return "";
  // Normalizar: lowercase e remover espaços
  const normalized = value.toLowerCase().trim();
  return createHash("sha256").update(normalized).digest("hex");
}

/**
 * Limpa o número de telefone removendo caracteres especiais
 * Mantém o DDI 55 (Brasil)
 * 
 * @param phone - Telefone com possível formatação
 * @returns Telefone limpo apenas com dígitos
 */
function cleanPhone(phone: string): string {
  if (!phone) return "";
  // Remove tudo que não é dígito
  return phone.replace(/\D/g, "");
}

/**
 * Envia um evento de Lead para a Facebook Conversions API (CAPI)
 * 
 * Documentação: https://developers.facebook.com/docs/marketing-api/conversions-api/
 * 
 * @param payload - Dados do lead para enviar
 * @returns true se enviado com sucesso, false caso contrário
 */
export async function sendLeadToFacebookCapi(payload: FacebookCapiEventPayload): Promise<boolean> {
  // Validar se as credenciais estão configuradas
  if (!ENV.facebookPixelId || !ENV.facebookCapiToken) {
    console.warn(
      "[Facebook CAPI] Credenciais não configuradas.",
      "FB_PIXEL_ID:", ENV.facebookPixelId ? "✓" : "✗",
      "FB_CAPI_TOKEN:", ENV.facebookCapiToken ? "✓" : "✗"
    );
    return false;
  }

  try {
    console.log("[Facebook CAPI] Iniciando envio de evento Lead...");

    // Limpar e hashear dados do usuário
    const emailHashed = hashSHA256(payload.email);
    const phoneClean = cleanPhone(payload.telefone);
    const phoneHashed = hashSHA256(phoneClean);

    // Construir o payload da CAPI
    // Documentação: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters
    const capiPayload = {
      data: [
        {
          // Event name - obrigatório
          event_name: "Lead",
          
          // Event ID para desduplicação - obrigatório
          // Usa o ID do lead como identificador único
          event_id: `lead_${payload.leadId}_${Date.now()}`,
          
          // Timestamp do evento em segundos Unix
          event_time: Math.floor(Date.now() / 1000),
          
          // Fonte da ação
          action_source: "website",
          
          // URL da página de onde o lead veio (usa SITE_URL do env)
          event_source_url: payload.pageUrl || ENV.siteUrl,
          
          // Dados do usuário (com hash SHA-256)
          user_data: {
            // Email com hash
            em: emailHashed,
            
            // Telefone com hash (formato E.164: país + número)
            ph: phoneHashed,
          },
          
          // Dados customizados (opcional)
          custom_data: {
            // Tipo de evento
            value: 1,
            currency: "BRL",
          },
        },
      ],
      // Token de acesso
      access_token: ENV.facebookCapiToken,
    };

    console.log("[Facebook CAPI] Payload a enviar:", JSON.stringify({
      ...capiPayload,
      access_token: "***REDACTED***", // Não logar o token
    }, null, 2));

    // Fazer a requisição para a Graph API do Facebook
    const url = `https://graph.facebook.com/v19.0/${ENV.facebookPixelId}/events`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(capiPayload),
    });

    // Verificar resposta
    if (!response.ok) {
      let errorBody = "";
      try {
        errorBody = await response.text();
      } catch (e) {
        errorBody = "(não foi possível ler o corpo da resposta)";
      }

      console.error("[Facebook CAPI] ❌ ERRO ao enviar evento!");
      console.error(`[Facebook CAPI] Status HTTP: ${response.status} ${response.statusText}`);
      console.error(`[Facebook CAPI] Response Body: ${errorBody}`);
      console.error(`[Facebook CAPI] Pixel ID: ${ENV.facebookPixelId}`);
      
      return false;
    }

    // Parsear resposta
    const result = await response.json();
    console.log("[Facebook CAPI] ✅ Evento Lead enviado com sucesso!");
    console.log("[Facebook CAPI] Response:", JSON.stringify(result, null, 2));

    return true;
  } catch (error) {
    console.error("[Facebook CAPI] ❌ Erro ao enviar evento:", error);
    return false;
  }
}

/**
 * Função auxiliar para testar a integração CAPI
 * Envia um evento de teste para validar as credenciais
 */
export async function testFacebookCapiConnection(): Promise<boolean> {
  console.log("[Facebook CAPI] Testando conexão...");

  const testPayload: FacebookCapiEventPayload = {
    leadId: 999,
    email: "teste@example.com",
    telefone: "5585987654321",
    pageUrl: "https://lead-scoring.manus.space/teste",
  };

  const result = await sendLeadToFacebookCapi(testPayload);

  if (result) {
    console.log("[Facebook CAPI] ✅ Teste de conexão bem-sucedido!");
  } else {
    console.log("[Facebook CAPI] ❌ Teste de conexão falhou!");
  }

  return result;
}
