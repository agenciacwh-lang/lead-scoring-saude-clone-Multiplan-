import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { syncLeadStatus } from "../webhookService";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  /**
   * Sincroniza status do lead com Botconversa, Google Sheets e Supabase
   */
  syncLeadStatus: publicProcedure
    .input(
      z.object({
        telefone: z.string().min(1, "telefone is required"),
        nome: z.string().min(1, "nome is required"),
        email: z.string().email("email is invalid"),
        cidade: z.string().min(1, "cidade is required"),
        status: z.enum(["Incompleto", "Concluído"]),
        temperature: z.string().optional(),
        totalScore: z.number().optional(),
        timestamp: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await syncLeadStatus(input);
        return {
          success: true,
          message: "Lead status sincronizado com sucesso",
        } as const;
      } catch (error) {
        console.error("[systemRouter] Erro ao sincronizar lead:", error);
        return {
          success: false,
          message: "Erro ao sincronizar lead status",
        } as const;
      }
    }),
});
