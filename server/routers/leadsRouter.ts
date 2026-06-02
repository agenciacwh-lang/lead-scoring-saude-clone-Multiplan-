/**
 * Router tRPC para gerenciar leads
 *
 * Arquitetura de dois tempos (Carrinho Abandonado):
 *   Passo 1 — leads.submitInitial   → Salva lead no banco, gera leadCode, dispara BotConversa+Sheets (Incompleto)
 *   Passo 2 — leads.submitCompleted → Recebe leadCode do frontend, calcula scoring, atualiza banco, dispara BotConversa+Sheets (Concluído)
 *
 * Regras:
 *   - O frontend DEVE armazenar o leadCode retornado no Passo 1 e enviá-lo no Passo 2
 *   - Guard de idempotência no Passo 2: se o lead já está "completo", aborta silenciosamente
 *   - Scoring calculado exclusivamente no backend (não confiar no frontend)
 *   - Sem timers no frontend — controle de tempo feito pelo BotConversa
 */

import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { sendLeadToBotConversa } from "../services/botconversaService";
import { sendLeadToFacebookCapi } from "../services/facebookCapiService";
import { eq } from "drizzle-orm";
import { saveLead, getDb, getNextLeadCode } from "../db";
import { leads } from "../../drizzle/schema";
import { sendLeadToSheets, getLeadsStats } from "../services/sheetsSync";

// ─── Lógica de Lead Scoring (espelho do frontend) ────────────────────────────
const SCORE_MAP: Record<string, number> = {
  // tempo_compra
  quanto_antes: 3,
  esse_mes: 2,
  proximo_mes: 1,
  pesquisando: 0,
  // situacao_atual
  nunca_tive: 2,
  ja_tive: 1,
  quero_trocar: 3,
  tenho_mantenho: 0,
  // renda
  acima_5000: 2,
  entre_3000_5000: 1,
  ate_3000: 0,
  // criterio_escolha
  qualidade: 2,
  preco: 1,
  rede: 1,
  cobertura: 2,
  // cnpj_mei
  sim_cnpj: 2,
  nao_cnpj: 0,
};

function calcularScoreBackend(answers: Record<string, string>): {
  total: number;
  temperatura: "frio" | "morno" | "quente";
  prioridade: "Sim" | "Não";
} {
  let total = 0;
  const campos = ["tempo_compra", "situacao_atual", "renda", "criterio_escolha", "cnpj_mei"];
  for (const campo of campos) {
    const valor = answers[campo];
    if (valor && SCORE_MAP[valor] !== undefined) {
      total += SCORE_MAP[valor];
    }
  }
  total = Math.min(total, 10);

  const isPriority =
    answers.tempo_compra === "quanto_antes" || answers.situacao_atual === "quero_trocar";

  let temperatura: "frio" | "morno" | "quente";
  if (total <= 3) {
    temperatura = "frio";
  } else if (total <= 7) {
    temperatura = "morno";
  } else {
    temperatura = "quente";
  }

  // Bump: frio com prioridade sobe para morno
  if (isPriority && temperatura === "frio") {
    temperatura = "morno";
  }

  return { total, temperatura, prioridade: isPriority ? "Sim" : "Não" };
}

// ─── Router ───────────────────────────────────────────────────────────────────
export const leadsRouter = router({

  /**
   * PASSO 1 — Captura Imediata
   * Disparado quando o usuário clica em "Responder perguntas".
   * Salva o lead no banco com status "incompleto", gera leadCode e notifica as integrações.
   * Retorna o leadCode para o frontend armazenar e usar no Passo 2.
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
            console.log("[Leads] PASSO 1 — Lead salvo no banco. ID:", leadId, "| ID LEAD:", leadCode);
          }
        }
      } catch (dbError) {
        console.error("[Leads] PASSO 1 — Erro ao salvar no banco:", dbError);
      }

      // Disparo imediato: BotConversa com status "Lead Incompleto"
      let botconversaSent = false;
      try {
        botconversaSent = await sendLeadToBotConversa({
          lead_id: leadCode,
          nome: input.nome,
          telefone: telefoneLimpo,
          email: input.email,
          cidade: input.cidade,
          status: "Lead Incompleto",
          pontuacao: 0,
          temperatura: "Frio",
          tempo_compra: "",
          situacao_atual: "",
          renda: "",
          criterio_escolha: "",
          cnpj_mei: "",
          idades: "",
        });
        console.log("[Leads] PASSO 1 — BotConversa:", botconversaSent ? "✅ Enviado" : "❌ Falhou");
      } catch (botError) {
        console.error("[Leads] PASSO 1 — Erro BotConversa:", botError);
      }

      // Disparo imediato: Google Sheets com acao "inserir" (cria linha nova)
      let sheetsSent = false;
      try {
        sheetsSent = await sendLeadToSheets({
          leadCode,
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
          createdAt: new Date(),
        }, "inserir");
        console.log("[Leads] PASSO 1 — Google Sheets:", sheetsSent ? "✅ Enviado" : "❌ Falhou");
      } catch (sheetsError) {
        console.error("[Leads] PASSO 1 — Erro Google Sheets:", sheetsError);
      }

      return {
        success: true,
        leadId,
        leadCode,   // ← Frontend DEVE armazenar e enviar no Passo 2
        botconversaSent,
        sheetsSent,
        message: "Lead inicial capturado e integrações notificadas",
      };
    }),

  /**
   * PASSO 2 — Atualização de Conclusão
   * Disparado quando o usuário conclui todas as perguntas do quiz.
   * Recebe o leadCode do Passo 1 para localizar o registro no banco.
   * Calcula scoring no backend, atualiza o banco e dispara webhooks finais.
   */
  submitCompleted: publicProcedure
    .input(
      z.object({
        leadCode: z.string(),           // ID LEAD gerado no Passo 1
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
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Leads] PASSO 2 — Conclusão do quiz:", input.nome, "| ID LEAD:", input.leadCode);

      const telefoneLimpo = input.telefone.replace(/\D/g, "");

      // Calcular scoring no backend (não confiar no frontend)
      const answers = {
        tempo_compra: input.tempo_compra,
        situacao_atual: input.situacao_atual,
        renda: input.renda,
        criterio_escolha: input.criterio_escolha,
        cnpj_mei: input.cnpj_mei,
        idades: input.idades,
      };
      const { total: pontuacao, temperatura, prioridade } = calcularScoreBackend(answers);
      console.log("[Leads] PASSO 2 — Scoring calculado:", { pontuacao, temperatura, prioridade });

      let leadFromDb: any = null;

      try {
        const db = await getDb();
        if (db) {
          // Guard de idempotência: buscar pelo leadCode (telefone como fallback)
          let existing = await db
            .select()
            .from(leads)
            .where(eq(leads.telefone, telefoneLimpo))
            .limit(1);

          // Guard: se já está completo, abortar silenciosamente
          if (existing.length > 0 && existing[0].status === "completo") {
            console.warn("[Leads] PASSO 2 — Lead já concluído. Ignorando disparo duplicado. ID:", existing[0].id);
            return {
              success: true,
              leadId: existing[0].id,
              leadCode: input.leadCode,
              pontuacao,
              temperatura,
              botconversaSent: false,
              sheetsSent: false,
              facebookCapiSent: false,
              message: "Lead já concluído — disparo duplicado ignorado",
            };
          }

          // Atualizar registro existente
          const updated = await db
            .update(leads)
            .set({
              tempo_compra: input.tempo_compra,
              situacao_atual: input.situacao_atual,
              renda: input.renda,
              criterio_escolha: input.criterio_escolha,
              cnpj_mei: input.cnpj_mei,
              idades: input.idades,
              pontuacao,
              temperatura,
              prioridade,
              status: "completo",
            })
            .where(eq(leads.telefone, telefoneLimpo))
            .returning();

          if (updated && updated.length > 0) {
            leadFromDb = updated[0];
            console.log("[Leads] PASSO 2 — Lead atualizado no banco. ID:", leadFromDb.id);
          } else {
            // Fallback: inserir novo se não encontrou pelo telefone
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
              pontuacao,
              temperatura,
              prioridade,
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
        temperatura === "quente" ? "Quente" :
        temperatura === "morno" ? "Morno" : "Frio";

      // Delay de 3 segundos para evitar race condition com o Passo 1
      // (garante que o webhook de inserção chegue ANTES do de atualização)
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("[Leads] PASSO 2 — Delay de 3s concluído. Disparando webhooks finais...");

      // Disparo final: BotConversa com status "Lead Concluiu" + scoring
      let botconversaSent = false;
      try {
        botconversaSent = await sendLeadToBotConversa({
          lead_id: input.leadCode,
          nome: input.nome,
          email: input.email,
          telefone: telefoneLimpo,
          cidade: input.cidade,
          pontuacao,
          temperatura: temperaturaDisplay as "Frio" | "Morno" | "Quente",
          tempo_compra: input.tempo_compra,
          situacao_atual: input.situacao_atual,
          renda: input.renda,
          criterio_escolha: input.criterio_escolha,
          cnpj_mei: input.cnpj_mei,
          idades: input.idades,
          status: "Lead Concluiu",
        });
        console.log("[Leads] PASSO 2 — BotConversa:", botconversaSent ? "✅ Enviado" : "❌ Falhou");
      } catch (botError) {
        console.error("[Leads] PASSO 2 — Erro BotConversa:", botError);
      }

      // Disparo final: Google Sheets com acao "atualizar" (atualiza linha existente pelo ID LEAD)
      let sheetsSent = false;
      try {
        sheetsSent = await sendLeadToSheets({
          leadCode: input.leadCode,
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
          pontuacao,
          temperatura,
          prioridade,
          status: "completo",
          createdAt: leadFromDb?.createdAt ?? new Date(),
        }, "atualizar");
        console.log("[Leads] PASSO 2 — Google Sheets:", sheetsSent ? "✅ Enviado" : "❌ Falhou");
      } catch (sheetsError) {
        console.error("[Leads] PASSO 2 — Erro Google Sheets:", sheetsError);
      }

      // Facebook CAPI
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
        leadCode: input.leadCode,
        pontuacao,
        temperatura,
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
      // Rota legada — apenas retorna sucesso sem disparar nada para evitar duplicidade
      console.log("[Leads] submit (legado) — chamada ignorada para evitar duplicidade. Use submitInitial + submitCompleted.");
      return { success: true, message: "Rota legada — sem ação" };
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
});
