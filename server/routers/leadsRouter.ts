/**
 * Router tRPC para gerenciar leads
 */

import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { sendLeadToBotConversa } from "../services/botconversaService";
import { eq } from "drizzle-orm";
import { saveLead, getDb } from "../db";
import { leads } from "../../drizzle/schema";
import { sendLeadToSheets, getLeadsStats } from "../services/sheetsSync";

export const leadsRouter = router({
  /**
   * Submeter um novo lead
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
        // Salvar no banco de dados
        const result = await saveLead(input);

        // Enviar para Google Sheets
        const sheetsSent = await sendLeadToSheets(input);

        // Enviar para BotConversa
        const botconversaSent = await sendLeadToBotConversa({
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          cidade: input.cidade,
          pontuacao: input.pontuacao,
          temperatura: input.temperatura === "quente" ? "Quente" : input.temperatura === "morno" ? "Morno" : "Frio",
          respostas: {
            tempo_compra: input.tempo_compra,
            situacao_atual: input.situacao_atual,
            renda: input.renda,
            criterio_escolha: input.criterio_escolha,
            cnpj_mei: input.cnpj_mei,
            idades: input.idades,
          },
        });

        return {
          success: true,
          message: "Lead salvo com sucesso",
          result,
          sheetsSent,
          botconversaSent,
        };
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
    if (!db) {
      return [];
    }

    try {
      const allLeads = await db.select().from(leads);
      return allLeads;
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
          respostas: {
            teste: "true",
            timestamp: new Date().toISOString(),
          },
        });

        return {
          success: result,
          message: result
            ? "Lead de teste enviado com sucesso para BotConversa!"
            : "Erro ao enviar lead de teste. Verifique se a URL do webhook está configurada.",
        };
      } catch (error) {
        console.error("Erro ao testar BotConversa:", error);
        return {
          success: false,
          message: `Erro ao testar integração: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        };
      }
    }),

  /**
   * Sincronizar um lead específico com Google Sheets
   */
  syncToSheets: publicProcedure
    .input(z.object({ leadId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return { success: false, message: "Database não disponível" };
      }

      try {
        // Buscar o lead
        const leadData = await db.select().from(leads).where(eq(leads.id, input.leadId));

        if (leadData.length === 0) {
          return { success: false, message: "Lead não encontrado" };
        }

        // Enviar para Google Sheets
        const success = await sendLeadToSheets(leadData[0]);

        return {
          success,
          message: success ? "Lead sincronizado com sucesso" : "Erro ao sincronizar",
        };
      } catch (error) {
        console.error("Erro ao sincronizar lead:", error);
        return { success: false, message: "Erro ao sincronizar" };
      }
    }),
});
