/**
 * Google Apps Script para Lead Scoring
 * 
 * INSTRUÇÕES:
 * 1. Abra sua planilha no Google Sheets
 * 2. Clique em "Extensões" → "Apps Script"
 * 3. Delete todo o código padrão
 * 4. Cole este código completo
 * 5. Clique em "Salvar"
 * 6. Clique em "Deploy" → "New deployment" → "Web app"
 * 7. Configure: Execute as = Sua conta, Who has access = Anyone
 * 8. Copie a URL gerada e use no site
 */

// Configurações
const SHEET_NAME = "Leads"; // Nome da aba onde os dados serão salvos
const HEADER_ROW = 1; // Linha do cabeçalho

/**
 * Função principal que recebe os dados via POST
 */
function doPost(e) {
  try {
    // Log para debug
    Logger.log("Requisição recebida: " + e.postData.contents);

    // Parse dos dados JSON
    const data = JSON.parse(e.postData.contents);

    // Obter a planilha ativa
    const sheet = SpreadsheetApp.getActiveSheet();

    // Verificar se precisa criar o cabeçalho
    if (sheet.getLastRow() === 0) {
      createHeader(sheet);
    }

    // Adicionar nova linha com os dados
    const newRow = [
      data.data_hora || new Date().toLocaleString("pt-BR"),
      data.nome || "",
      data.telefone || "",
      data.email || "",
      data.cidade || "",
      data.tempo_compra || "",
      data.situacao_atual || "",
      data.renda || "",
      data.criterio_escolha || "",
      data.cnpj_mei || "",
      data.idades || "",
      data.pontuacao || 0,
      data.temperatura || "",
      data.prioridade || ""
    ];

    sheet.appendRow(newRow);

    // Log de sucesso
    Logger.log("Lead adicionado com sucesso: " + data.nome);

    // Retornar resposta de sucesso
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Lead registrado com sucesso",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log de erro
    Logger.log("Erro ao processar requisição: " + error.toString());

    // Retornar resposta de erro
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Função para criar o cabeçalho da planilha
 */
function createHeader(sheet) {
  const headers = [
    "Data/Hora",
    "Nome",
    "Telefone",
    "E-mail",
    "Cidade",
    "Tempo de Compra",
    "Situação Atual",
    "Renda",
    "Critério de Escolha",
    "CNPJ/MEI",
    "Idades",
    "Pontuação",
    "Temperatura",
    "Prioridade"
  ];

  sheet.appendRow(headers);

  // Formatar o cabeçalho (opcional)
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#06B6D4");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");

  // Congelar a linha do cabeçalho
  sheet.setFrozenRows(1);
}

/**
 * Função para testar o Apps Script (opcional)
 * Execute esta função para testar se tudo está funcionando
 */
function testWebhook() {
  const testData = {
    data_hora: new Date().toLocaleString("pt-BR"),
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
    temperatura: "MORNO",
    prioridade: "Sim"
  };

  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });

  Logger.log("Resultado do teste: " + result.getContent());
}
