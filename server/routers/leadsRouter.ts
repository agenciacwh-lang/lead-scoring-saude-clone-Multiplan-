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
        // DEBUG LOG - Payload completo recebido
        console.log('[DEBUG] ========================================');
        console.log('[DEBUG] PAYLOAD RECEBIDO NO SERVIDOR');
        console.log('[DEBUG] ========================================');
        console.log('[DEBUG] Nome:', input.nome);
        console.log('[DEBUG] Telefone:', input.telefone);
        console.log('[DEBUG] Email:', input.email);
        console.log('[DEBUG] Cidade:', input.cidade);
        console.log('[DEBUG] Tempo Compra:', input.tempo_compra);
        console.log('[DEBUG] Situacao Atual:', input.situacao_atual);
        console.log('[DEBUG] Renda:', input.renda);
        console.log('[DEBUG] Criterio Escolha:', input.criterio_escolha);
        console.log('[DEBUG] CNPJ/MEI:', input.cnpj_mei);
        console.log('[DEBUG] Idades:', input.idades);
        console.log('[DEBUG] Pontuacao:', input.pontuacao);
        console.log('[DEBUG] Temperatura:', input.temperatura);
        console.log('[DEBUG] Prioridade:', input.prioridade);
        console.log('[DEBUG] Payload completo:', JSON.stringify(input, null, 2));
        console.log('[DEBUG] ========================================');
        
        console.log('[Leads Router] Recebido novo lead:', input.nome, input.email);
        
        // Salvar no banco de dados
        const result = await saveLead(input);
        console.log('[Leads Router] Lead salvo no banco:', result);

        // O lead já foi salvo e retornado pelo Postgres
        let leadFromDb = null;
        try {
          if (result && Array.isArray(result) && result.length > 0) {
            leadFromDb = result[0];
            console.log('[Leads Router] Lead recuperado do banco:', leadFromDb);
          }
        } catch (dbError) {
          console.error('[Leads Router] Erro ao processar lead do banco:', dbError);
        }

        // Enviar para Google Sheets (usar o lead do banco se disponivel)
        let sheetsSent = false;
        try {
          console.log('[Leads Router] Enviando lead para Google Sheets:', input.email);
          const leadToSend = leadFromDb || input;
          sheetsSent = await sendLeadToSheets(leadToSend);
          console.log('[Leads Router] Resultado Google Sheets:', sheetsSent ? 'Sucesso' : 'Falhou');
        } catch (sheetsError) {
          console.error('[Leads Router] Erro ao enviar para Google Sheets:', sheetsError);
        }

        // Enviar para BotConversa
        let botconversaSent = false;
        try {
          console.log('[Leads Router] Enviando lead para BotConversa...');
          botconversaSent = await sendLeadToBotConversa({
            nome: input.nome,
            email: input.email,
            telefone: input.telefone,
            cidade: input.cidade,
            pontuacao: input.pontuacao,
            temperatura: input.temperatura === "quente" ? "Quente" : input.temperatura === "morno" ? "Morno" : "Frio",
            tempo_compra: input.tempo_compra,
            situacao_atual: input.situacao_atual,
            renda: input.renda,
            criterio_escolha: input.criterio_escolha,
            cnpj_mei: input.cnpj_mei,
            idades: input.idades,
          });
          console.log('[Leads Router] Resultado BotConversa:', botconversaSent ? 'Sucesso' : 'Falhou');
        } catch (botError) {
          console.error('[Leads Router] Erro ao enviar para BotConversa:', botError);
        }



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
   * Submeter um lead incompleto (após timeout de inatividade)
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
      try {
        // Salvar no banco com status "incompleto"
        const result = await getDb().then((db) => {
          if (!db) throw new Error("Database não disponível");
          return db.insert(leads).values({
            nome: input.nome,
            telefone: input.telefone,
            email: input.email,
            cidade: input.cidade,
            tempo_compra: input.tempo_compra || "",
            situacao_atual: input.situacao_atual || "",
            renda: input.renda || "",
            criterio_escolha: input.criterio_escolha || "",
            cnpj_mei: input.cnpj_mei || "",
            idades: input.idades || "",
            pontuacao: 0,
            temperatura: "frio",
            prioridade: "Não",
            status: "incompleto",
          });
        });

        // Enviar para BotConversa com status "incompleto"
        const botconversaSent = await sendLeadToBotConversa({
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          cidade: input.cidade,
          pontuacao: 0,
          temperatura: "Frio",
          tempo_compra: input.tempo_compra || "",
          situacao_atual: input.situacao_atual || "",
          renda: input.renda || "",
          criterio_escolha: input.criterio_escolha || "",
          cnpj_mei: input.cnpj_mei || "",
          idades: input.idades || "",
        });

        // Enviar para Google Sheets
        const sheetsSent = await sendLeadToSheets({
          nome: input.nome,
          telefone: input.telefone,
          email: input.email,
          cidade: input.cidade,
          tempo_compra: input.tempo_compra || "",
          situacao_atual: input.situacao_atual || "",
          renda: input.renda || "",
          criterio_escolha: input.criterio_escolha || "",
          cnpj_mei: input.cnpj_mei || "",
          idades: input.idades || "",
          pontuacao: 0,
          temperatura: "frio",
          prioridade: "Não",
          status: "incompleto",
          createdAt: new Date(),
        });

        console.log("[Lead Incompleto] Lead incompleto enviado com sucesso");

        return {
          success: true,
          message: "Lead incompleto salvo com sucesso",
          result,
          sheetsSent,
          botconversaSent,
        };
      } catch (error) {
        console.error("[Lead Incompleto] Erro ao salvar lead incompleto:", error);
        return { success: false, message: "Erro ao salvar lead incompleto" };
      }
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
