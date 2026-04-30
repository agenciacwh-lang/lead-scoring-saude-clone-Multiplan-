import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { saveLead } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  leads: router({
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
          const result = await saveLead(input);
          return { success: true, message: "Lead salvo com sucesso", result };
        } catch (error) {
          console.error("Erro ao salvar lead:", error);
          return { success: false, message: "Erro ao salvar lead" };
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
