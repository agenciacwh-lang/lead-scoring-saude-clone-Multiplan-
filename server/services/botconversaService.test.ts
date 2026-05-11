import { describe, expect, it, vi, beforeEach } from "vitest";
import { sendLeadToBotConversa, type BotconversaLeadPayload } from "./botconversaService";

// Mock do fetch global
global.fetch = vi.fn();

describe("BotConversa Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Restaurar a variável de ambiente
    process.env.BOTCONVERSA_WEBHOOK_URL =
      "https://new-backend.botconversa.com.br/api/v1/webhooks-automation/catch/171551/d6MvHVh47DPY/";
  });

  it("deve enviar lead com sucesso para BotConversa", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
    });
    global.fetch = mockFetch;

    const lead: BotconversaLeadPayload = {
      nome: "João Silva",
      email: "joao@example.com",
      telefone: "5531995052011",
      cidade: "Belo Horizonte",
      pontuacao: 8,
      temperatura: "Quente",
      respostas: {
        pergunta1: "Sim",
        pergunta2: "Não",
      },
    };

    const result = await sendLeadToBotConversa(lead);

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
      "https://new-backend.botconversa.com.br/api/v1/webhooks-automation/catch/171551/d6MvHVh47DPY/",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  it("deve retornar false quando webhook URL não está configurada", async () => {
    process.env.BOTCONVERSA_WEBHOOK_URL = "";

    const lead: BotconversaLeadPayload = {
      nome: "João Silva",
      email: "joao@example.com",
      telefone: "5531995052011",
      cidade: "Belo Horizonte",
      pontuacao: 8,
      temperatura: "Quente",
      respostas: {},
    };

    const result = await sendLeadToBotConversa(lead);

    expect(result).toBe(false);
  });

  it("deve retornar false quando há erro na requisição", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });
    global.fetch = mockFetch;

    const lead: BotconversaLeadPayload = {
      nome: "João Silva",
      email: "joao@example.com",
      telefone: "5531995052011",
      cidade: "Belo Horizonte",
      pontuacao: 8,
      temperatura: "Quente",
      respostas: {},
    };

    const result = await sendLeadToBotConversa(lead);

    expect(result).toBe(false);
  });
});
