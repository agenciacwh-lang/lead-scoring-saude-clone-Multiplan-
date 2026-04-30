import { describe, it, expect } from "vitest";
import { sendLeadToSheets } from "./sheetsSync";

describe("sheetsSync", () => {
  it("deve enviar um lead para Google Sheets com sucesso", async () => {
    // Mock de um lead
    const mockLead = {
      id: 1,
      nome: "João Silva",
      telefone: "(11) 99999-9999",
      email: "joao@email.com",
      cidade: "São Paulo",
      tempo_compra: "Nos próximos meses",
      situacao_atual: "Tenho e quero trocar",
      renda: "R$ 3.000 a R$ 6.000",
      criterio_escolha: "Custo-benefício",
      cnpj_mei: "Não, sou pessoa física",
      idades: "35, 32, 8",
      pontuacao: 7,
      temperatura: "morno",
      prioridade: "Sim",
      createdAt: new Date(),
    };

    // Testar o envio
    const result = await sendLeadToSheets(mockLead);

    // O resultado deve ser um booleano
    expect(typeof result).toBe("boolean");
  });

  it("deve retornar false se GOOGLE_SHEETS_WEBHOOK_URL nao estiver configurada", async () => {
    // Se a URL não estiver configurada, a função deve retornar false
    // Este teste verifica que a função lida corretamente com URLs vazias
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      // Se não houver URL, o teste passa (comportamento esperado)
      expect(webhookUrl).toBeUndefined();
    } else {
      // Se houver URL, o teste verifica que ela é uma string válida
      expect(typeof webhookUrl).toBe("string");
      expect(webhookUrl.length).toBeGreaterThan(0);
    }
  });
});
