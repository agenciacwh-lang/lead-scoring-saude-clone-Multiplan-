/**
 * Mapeamento de respostas do quiz para exibição legível
 * Converte IDs técnicos em textos formatados para exibição na planilha
 */

export const RESPONSE_LABELS: Record<string, Record<string, string>> = {
  tempo_compra: {
    pesquisando: "Só estou pesquisando",
    proximos_meses: "Nos próximos meses",
    esse_mes: "Ainda esse mês",
    quanto_antes: "O quanto antes",
  },
  situacao_atual: {
    nunca_tive: "Nunca tive plano",
    ja_tive: "Já tive, mas não tenho mais",
    quero_trocar: "Tenho e quero trocar",
  },
  renda: {
    ate_1500: "Até R$ 1.500",
    "1500_3000": "R$ 1.500 a R$ 3.000",
    "3000_6000": "R$ 3.000 a R$ 6.000",
    acima_6000: "Acima de R$ 6.000",
  },
  criterio_escolha: {
    preco: "Preço (o mais barato possível)",
    custo_beneficio: "Custo-benefício",
    qualidade: "Qualidade e atendimento",
  },
  cnpj_mei: {
    sim_cnpj: "Sim, tenho CNPJ/MEI",
    nao_cnpj: "Não, sou pessoa física",
  },
};

/**
 * Formata uma resposta individual
 */
export function formatResponse(key: string, value: string): string {
  if (!value) return "";
  
  // Se for a pergunta de idades, retorna como está (é texto livre)
  if (key === "idades") {
    return value;
  }
  
  // Procura no mapeamento
  const labels = RESPONSE_LABELS[key];
  if (labels && labels[value]) {
    return labels[value];
  }
  
  // Se não encontrar, retorna o valor original
  return value;
}

/**
 * Formata todas as respostas do quiz
 */
export function formatAllResponses(answers: Record<string, string>): Record<string, string> {
  const formatted: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(answers)) {
    formatted[key] = formatResponse(key, value);
  }
  
  return formatted;
}
