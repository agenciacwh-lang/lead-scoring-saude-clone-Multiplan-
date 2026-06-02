/**
 * Router tRPC para gerenciar leads
 *
 * Fluxo de dois tempos (Carrinho Abandonado):
 *   Passo 1 — leads.submitInitial  → Salva lead com status "incompleto" + dispara BotConversa e Sheets
 *   Passo 2 — leads.submitCompleted → Atualiza lead com respostas do quiz + status "completo" + dispara integrações
 *
 * O controle de tempo (5 min) é feito exclusivamente pelo BotConversa.
 * O site apenas avisa em tempo real via esses dois endpoints.
 */

import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { sendLeadToBotConversa } from "../services/botconversaService";
import { sendLeadToFacebookCapi } from "../services/facebookCapiService";
import { eq } from "drizzle-orm";
import { saveLead, getDb, getNextLeadCode } from "../db";
import { leads } from "../../drizzle/schema";
import { sendLeadToSheets, getLeadsStats } from "../services/sheetsSync";


export const leadsRouter = router({

  /**
   * PASSO 1 — Captura Imediata
   * Disparado quando o usuário clica em "Responder perguntas".
   * Salva o lead no banco com status "incompleto" e notifica as integrações.
   * O BotConversa aguardará 5 minutos e checará se o status mudou para "completo".
   */
  submitInitial: publicProcedure
    .input(
      z.object({
        nome: z.string(),
        telefone: z.string(),
        email: z.string(),
        cidade: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Leads] PASSO 1 — Captura imediata:", input.nome, input.telefone);

      // Telefone limpo para o banco e integrações
      const telefoneLimpo = input.telefone.replace(/\D/g, "");

      // Gerar ID LEAD sequencial (0001, 0002, 0003...)
      const leadCode = await getNextLeadCode();
      console.log("[Leads] PASSO 1 — ID LEAD gerado:", leadCode);

      let leadId: number | null = null;

      // Salvar no banco com status "incompleto"
      try {
        const db = await getDb();
        if (db) {
          const result = await db.insert(leads).values({
            nome: input.nome,
            telefone: telefoneLimpo,
            email: input.email,
            cidade: input.cidade,
            tempo_compra: "",
            situacao_atual: "",
            renda: "",
            criterio_escolha: "",
            cnpj_mei: "",
            idades: "",
            pontuacao: 0,
            temperatura: "frio",
            prioridade: "Não",
            status: "incompleto",
          }).returning();
          if (result && result.length > 0) {
            leadId = result[0].id;
            console.log("[Leads] PASSO 1 — Lead salvo no banco. ID:", leadId);
          }
        }
      } catch (dbError) {
        console.error("[Leads] PASSO 1 — Erro ao salvar no banco:", dbError);
      }

      // PASSO 1: apenas salva no banco — nenhum webhook disparado aqui.
      // O disparo único e agregado acontece exclusivamente no submitCompleted (Passo 2).
      return {
        success: true,
        leadId,
        leadCode,
        message: "Lead inicial salvo no banco com sucesso",
      };
    }),

  /**
   * PASSO 2 — Atualização de Conclusão
   * Disparado quando o usuário conclui todas as perguntas do quiz.
   * Atualiza o registro existente (por telefone) com as respostas e status "completo".
   * Dispara novos webhooks para BotConversa e Sheets com status "Lead Concluiu".
   */
  submitCompleted: publicProcedure
    .input(
      z.object({
        nome: z.string(),
        telefone: z.string(),
        email: z.string(),
        cidade: z.string(),
        tempo_compra: z.string(),
        situacao_atual: z.string(),
        renda: z.string(),
        criterio_escolha: z.string(),
        cnpj_mei: z.string(),
        idades: z.string(),
        pontuacao: z.number(),
        temperatura: z.enum(["frio", "morno", "quente"]),
        prioridade: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Leads] PASSO 2 — Conclusão do quiz:", input.nome, input.telefone);

      const telefoneLimpo = input.telefone.replace(/\D/g, "");
      let leadFromDb: any = null;
      let leadCode: string = "";

      // Atualizar registro existente no banco (busca por telefone)
      try {
        const db = await getDb();
        if (db) {
          // Guard de idempotência: verificar se o lead já foi concluído (duplo clique)
          const existing = await db
            .select()
            .from(leads)
            .where(eq(leads.telefone, telefoneLimpo))
            .limit(1);

          if (existing.length > 0 && existing[0].status === "completo") {
            console.warn("[Leads] PASSO 2 — Lead já concluído anteriormente. Ignorando disparo duplicado.", existing[0].id);
            return {
              success: true,
              leadId: existing[0].id,
              botconversaSent: false,
              sheetsSent: false,
              facebookCapiSent: false,
              message: "Lead já concluído — disparo duplicado ignorado",
            };
          }

          // Tentar atualizar registro existente pelo telefone
          const updated = await db
            .update(leads)
            .set({
              tempo_compra: input.tempo_compra,
              situacao_atual: input.situacao_atual,
              renda: input.renda,
              criterio_escolha: input.criterio_escolha,
              cnpj_mei: input.cnpj_mei,
              idades: input.idades,
              pontuacao: input.pontuacao,
              temperatura: input.temperatura,
              prioridade: input.prioridade,
              status: "completo",
            })
            .where(eq(leads.telefone, telefoneLimpo))
            .returning();

          if (updated && updated.length > 0) {
            leadFromDb = updated[0];
            // Recuperar o leadCode do registro existente (salvo no Passo 1)
            leadCode = leadFromDb.leadCode ?? await getNextLeadCode();
            console.log("[Leads] PASSO 2 — Lead atualizado no banco. ID:", leadFromDb.id, "| ID LEAD:", leadCode);
          } else {
            // Fallback: inserir novo registro se não encontrou o existente
            console.warn("[Leads] PASSO 2 — Lead não encontrado pelo telefone, inserindo novo registro");
            const inserted = await db.insert(leads).values({
              nome: input.nome,
              telefone: telefoneLimpo,
              email: input.email,
              cidade: input.cidade,
              tempo_compra: input.tempo_compra,
              situacao_atual: input.situacao_atual,
              renda: input.renda,
              criterio_escolha: input.criterio_escolha,
              cnpj_mei: input.cnpj_mei,
              idades: input.idades,
              pontuacao: input.pontuacao,
              temperatura: input.temperatura,
              prioridade: input.prioridade,
              status: "completo",
            }).returning();
            if (inserted && inserted.length > 0) {
              leadFromDb = inserted[0];
            }
          }
        }
      } catch (dbError) {
        console.error("[Leads] PASSO 2 — Erro ao atualizar banco:", dbError);
      }

      const temperaturaDisplay =
        input.temperatura === "quente" ? "Quente" :
        input.temperatura === "morno" ? "Morno" : "Frio";

      // Enviar para BotConversa com status "Lead Concluiu"
      let botconversaSent = false;
      try {
        botconversaSent = await sendLeadToBotConversa({
          nome: input.nome,
          email: input.email,
          telefone: telefoneLimpo,
          cidade: input.cidade,
          pontuacao: input.pontuacao,
          temperatura: temperaturaDisplay as "Frio" | "Morno" | "Quente",
          tempo_compra: input.tempo_compra,
          situacao_atual: input.situacao_atual,
          renda: input.renda,
          criterio_escolha: input.criterio_escolha,
          cnpj_mei: input.cnpj_mei,
          idades: input.idades,
          status: "Lead Concluiu",
          lead_id: leadCode,
        });
        console.log("[Leads] PASSO 2 — BotConversa:", botconversaSent ? "✅ Enviado" : "❌ Falhou");
      } catch (botError) {
        console.error("[Leads] PASSO 2 — Erro BotConversa:", botError);
      }

      // Enviar para Google Sheets com status "completo"
      let sheetsSent = false;
      try {
        sheetsSent = await sendLeadToSheets({
          nome: input.nome,
          telefone: telefoneLimpo,
          email: input.email,
          cidade: input.cidade,
          tempo_compra: input.tempo_compra,
          situacao_atual: input.situacao_atual,
          renda: input.renda,
          criterio_escolha: input.criterio_escolha,
          cnpj_mei: input.cnpj_mei,
          idades: input.idades,
          pontuacao: input.pontuacao,
          temperatura: input.temperatura,
          prioridade: input.prioridade,
          status: "completo",
          createdAt: leadFromDb?.createdAt ?? new Date(),
          leadCode,
        });
        console.log("[Leads] PASSO 2 — Google Sheets:", sheetsSent ? "✅ Enviado" : "❌ Falhou");
      } catch (sheetsError) {
        console.error("[Leads] PASSO 2 — Erro Google Sheets:", sheetsError);
      }

      // Enviar para Facebook CAPI
      let facebookCapiSent = false;
      try {
        if (leadFromDb?.id) {
          facebookCapiSent = await sendLeadToFacebookCapi({
            leadId: leadFromDb.id,
            email: input.email,
            telefone: telefoneLimpo,
            pageUrl: undefined,
          });
          console.log("[Leads] PASSO 2 — Facebook CAPI:", facebookCapiSent ? "✅ Enviado" : "❌ Falhou");
        }
      } catch (fbError) {
        console.error("[Leads] PASSO 2 — Erro Facebook CAPI:", fbError);
      }

      return {
        success: true,
        leadId: leadFromDb?.id ?? null,
        botconversaSent,
        sheetsSent,
        facebookCapiSent,
        message: "Lead concluído com sucesso",
      };
    }),

  /**
   * LEGADO — Submeter um lead completo (mantido para compatibilidade)
   * @deprecated Use submitInitial + submitCompleted no lugar
   */
  submit: publicProcedure
    .input(
      z.object({
        nome: z.string(),
        telefone: z.string(),
        email: z.string(),
        cidade: z.string(),
        tempo_compra: z.string(),
        situacao_atual: z.string(),
        renda: z.string(),
        criterio_escolha: z.string(),
        cnpj_mei: z.string(),
        idades: z.string(),
        pontuacao: z.number(),
        temperatura: z.enum(["frio", "morno", "quente"]),
        prioridade: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log('[Leads] submit (legado) — Recebido:', input.nome, input.email);
        const result = await saveLead(input);

        let leadFromDb = null;
        if (result && Array.isArray(result) && result.length > 0) {
          leadFromDb = result[0];
        }

        const temperaturaDisplay =
          input.temperatura === "quente" ? "Quente" :
          input.temperatura === "morno" ? "Morno" : "Frio";

        const telefoneLimpo = input.telefone.replace(/\D/g, "");

        let sheetsSent = false;
        try {
          sheetsSent = await sendLeadToSheets(leadFromDb || input);
        } catch (e) { console.error('[Leads] submit — Sheets error:', e); }

        let botconversaSent = false;
        try {
          botconversaSent = await sendLeadToBotConversa({
            nome: input.nome,
            email: input.email,
            telefone: telefoneLimpo,
            cidade: input.cidade,
            pontuacao: input.pontuacao,
            temperatura: temperaturaDisplay as "Frio" | "Morno" | "Quente",
            tempo_compra: input.tempo_compra,
            situacao_atual: input.situacao_atual,
            renda: input.renda,
            criterio_escolha: input.criterio_escolha,
            cnpj_mei: input.cnpj_mei,
            idades: input.idades,
            status: "Lead Concluiu",
          });
        } catch (e) { console.error('[Leads] submit — BotConversa error:', e); }

        let facebookCapiSent = false;
        try {
          if (leadFromDb?.id) {
            facebookCapiSent = await sendLeadToFacebookCapi({
              leadId: leadFromDb.id,
              email: input.email,
              telefone: telefoneLimpo,
              pageUrl: undefined,
            });
          }
        } catch (e) { console.error('[Leads] submit — FB CAPI error:', e); }

        return { success: true, message: "Lead salvo com sucesso", result, sheetsSent, botconversaSent, facebookCapiSent };
      } catch (error) {
        console.error("Erro ao salvar lead:", error);
        return { success: false, message: "Erro ao salvar lead" };
      }
    }),

  /**
   * Obter todos os leads
   */
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    try {
      return await db.select().from(leads);
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      return [];
    }
  }),

  /**
   * Obter estatísticas dos leads
   */
  getStats: publicProcedure.query(async () => {
    return await getLeadsStats();
  }),

  /**
   * LEGADO — submitIncomplete (mantido para compatibilidade com InactivityContext)
   * @deprecated O controle de inatividade agora é feito pelo BotConversa
   */
  submitIncomplete: publicProcedure
    .input(
      z.object({
        nome: z.string(),
        telefone: z.string(),
        email: z.string(),
        cidade: z.string(),
        tempo_compra: z.string().optional(),
        situacao_atual: z.string().optional(),
        renda: z.string().optional(),
        criterio_escolha: z.string().optional(),
        cnpj_mei: z.string().optional(),
        idades: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Rota mantida para não quebrar código legado, mas o novo fluxo usa submitInitial
      console.log("[Leads] submitIncomplete (legado) chamado — use submitInitial no lugar");
      return { success: true, message: "Lead incompleto registrado (legado)" };
    }),

  /**
   * Teste de integração com BotConversa
   */
  testBotConversa: publicProcedure
    .input(
      z.object({
        nome: z.string().optional().default("Teste Lead"),
        email: z.string().optional().default("teste@example.com"),
        telefone: z.string().optional().default("11999999999"),
        cidade: z.string().optional().default("São Paulo"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await sendLeadToBotConversa({
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          cidade: input.cidade,
          pontuacao: 7,
          temperatura: "Morno",
          tempo_compra: "teste",
          situacao_atual: "teste",
          renda: "teste",
          criterio_escolha: "teste",
          cnpj_mei: "teste",
          idades: "teste",
          status: "Lead Concluiu",
        });
        return {
          success: result,
          message: result
            ? "Lead de teste enviado com sucesso para BotConversa!"
            : "Erro ao enviar lead de teste. Verifique se a URL do webhook está configurada.",
        };
      } catch (error) {
        console.error("Erro ao testar BotConversa:", error);
        return { success: false, message: `Erro: ${error instanceof Error ? error.message : "Desconhecido"}` };
      }
    }),

  /**
   * Sincronizar um lead específico com Google Sheets
   */
  syncToSheets: publicProcedure
    .input(z.object({ leadId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database não disponível" };
      try {
        const leadData = await db.select().from(leads).where(eq(leads.id, input.leadId));
        if (leadData.length === 0) return { success: false, message: "Lead não encontrado" };
        const success = await sendLeadToSheets(leadData[0]);
        return { success, message: success ? "Lead sincronizado com sucesso" : "Erro ao sincronizar" };
      } catch (error) {
        console.error("Erro ao sincronizar lead:", error);
        return { success: false, message: "Erro ao sincronizar" };
      }
    }),
});
