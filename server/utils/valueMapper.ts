/**
 * Mapeamento de valores de respostas do quiz para formato legível
 * Converte valores em snake_case para português formatado
 */

export const valueMapper = {
  // Tempo de compra
  tempo_compra: {
    "so_pesquisando": "Só estou pesquisando",
    "proximos_meses": "Nos próximos meses",
    "ainda_esse_mes": "Ainda esse mês",
    "quanto_antes": "O quanto antes",
  },
  
  // Situação atual
  situacao_atual: {
    "nunca_tive": "Nunca tive plano",
    "tive_nao_tenho": "Já tive, mas não tenho mais",
    "tenho_quero_trocar": "Tenho e quero trocar",
  },
  
  // Renda
  renda: {
    "ate_1500": "Até R$ 1.500",
    "1500_3000": "R$ 1.500 a R$ 3.000",
    "3000_6000": "R$ 3.000 a R$ 6.000",
    "acima_6000": "Acima de R$ 6.000",
  },
  
  // Critério de escolha
  criterio_escolha: {
    "preco": "Preço (o mais barato possível)",
    "custo_beneficio": "Custo-benefício",
    "qualidade_atendimento": "Qualidade e atendimento",
  },
  
  // CNPJ/MEI
  cnpj_mei: {
    "sim_cnpj": "Sim, tenho CNPJ/MEI",
    "nao_pessoa_fisica": "Não, sou pessoa física",
  },
};

/**
 * Formata um valor usando o mapeamento
 */
export function formatValue(fieldName: string, value: string): string {
  const mapping = valueMapper[fieldName as keyof typeof valueMapper];
  if (!mapping) return value;
  
  const formatted = mapping[value as keyof typeof mapping];
  return formatted || value;
}

/**
 * Formata todas as respostas do quiz
 */
export function formatAllResponses(responses: Record<string, string>): Record<string, string> {
  return Object.entries(responses).reduce((acc, [key, value]) => {
    acc[key] = formatValue(key, value);
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Formata nomes de campos para português
 */
export const fieldNameMapper: Record<string, string> = {
  "tempo_compra": "Previsão de Contratação",
  "situacao_atual": "Situação Atual",
  "renda": "Faixa de Renda",
  "criterio_escolha": "Principal Interesse",
  "cnpj_mei": "Possui CNPJ",
  "idades": "Idades dos Beneficiários",
};

/**
 * Formata um campo para português
 */
export function formatFieldName(fieldName: string): string {
  return fieldNameMapper[fieldName] || fieldName;
}

/**
 * Formata o payload do BotConversa com valores legíveis
 * Transforma valores "crus" do banco em strings formatadas
 * Exemplo: acima_6000 -> "Acima de R$ 6.000"
 */
export function formatarPayloadBotConversa(payload: Record<string, any>): Record<string, any> {
  const campos = ['tempo_compra', 'situacao_atual', 'renda', 'criterio_escolha', 'cnpj_mei'];
  
  const payloadFormatado = { ...payload };
  
  for (const campo of campos) {
    if (payloadFormatado[campo]) {
      payloadFormatado[campo] = formatValue(campo, payloadFormatado[campo]);
    }
  }
  
  return payloadFormatado;
}
