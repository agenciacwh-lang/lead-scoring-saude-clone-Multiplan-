# Integração com Google Sheets – Guia de Setup

Este guia explica como configurar a integração automática de leads com Google Sheets.

## Opção 1: Google Apps Script (Recomendado) ⭐

### Passo 1: Criar uma planilha no Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Clique em **"+ Planilha em branco"**
3. Renomeie para "Leads SaúdePlan" (ou outro nome)
4. Crie as seguintes colunas na primeira linha:

```
A: Data/Hora
B: Nome
C: Telefone
D: E-mail
E: Cidade
F: Tempo de Compra
G: Situação Atual
H: Renda
I: Critério de Escolha
J: CNPJ/MEI
K: Idades
L: Pontuação
M: Temperatura
N: Prioridade
```

### Passo 2: Criar o Google Apps Script

1. Na planilha, clique em **"Extensões"** → **"Apps Script"**
2. Delete o código padrão e cole este código:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Adicionar nova linha com os dados
    sheet.appendRow([
      data.data_hora,
      data.nome,
      data.telefone,
      data.email,
      data.cidade,
      data.tempo_compra,
      data.situacao_atual,
      data.renda,
      data.criterio_escolha,
      data.cnpj_mei,
      data.idades,
      data.pontuacao,
      data.temperatura,
      data.prioridade
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Lead registrado com sucesso"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Clique em **"Salvar"** (ícone de disquete)
4. Dê um nome ao projeto: "Lead Scoring Webhook"
5. Clique em **"Deploy"** → **"New deployment"**
6. Selecione **"Type"** → **"Web app"**
7. Configure:
   - **Execute as**: Sua conta Google
   - **Who has access**: "Anyone"
8. Clique em **"Deploy"**
9. Copie a URL gerada (será algo como `https://script.google.com/macros/s/YOUR_SCRIPT_ID/usercache`)

### Passo 3: Configurar a URL no site

1. Abra o arquivo `client/src/lib/sheetsService.ts`
2. Procure por: `const APPS_SCRIPT_URL = "https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercache";`
3. Substitua pela URL que você copiou no passo anterior
4. Procure por: `export async function submitLeadToSheets(`
5. Mude a chamada de função em `client/src/pages/Obrigado.tsx` e `client/src/pages/ResultadoFrio.tsx` para usar `submitLeadToSheetsViaAppsScript` em vez de `submitLeadToSheets`

---

## Opção 2: Google Forms + Zapier/Make

Se preferir usar Google Forms (mais simples, mas menos flexível):

1. Crie um Google Form com os mesmos campos
2. Conecte o formulário a uma planilha (opção nativa do Google Forms)
3. Use Zapier ou Make para enviar dados do site para o formulário

---

## Opção 3: Usar um serviço de webhook (Webhook.cool, RequestBin, etc.)

Para testes rápidos:

1. Acesse [webhook.cool](https://webhook.cool) ou [webhook.site](https://webhook.site)
2. Copie a URL gerada
3. Substitua em `sheetsService.ts`: `const WEBHOOK_URL = "sua_url_aqui"`
4. Todos os leads serão enviados para o webhook (você pode visualizar os dados em tempo real)

---

## Testando a integração

1. Abra o site
2. Preencha o formulário com dados de teste
3. Responda o quiz
4. Verifique se os dados aparecem na planilha Google Sheets

---

## Troubleshooting

### "CORS error" ao enviar dados
- Certifique-se de que o Google Apps Script foi deployado com "Who has access: Anyone"
- Use `submitLeadToSheetsViaAppsScript` em vez de `submitLeadToSheets`

### Dados não aparecem na planilha
- Verifique se a URL está correta em `sheetsService.ts`
- Abra o console do navegador (F12) e procure por erros
- Teste a URL do webhook em um navegador ou Postman

### Preciso mudar a estrutura das colunas
- Edite o array `sheet.appendRow([...])` no Google Apps Script
- Certifique-se de que a ordem corresponde às colunas da planilha

---

## Próximos passos

- Adicionar validação de e-mail duplicado
- Enviar e-mail de confirmação ao lead
- Integrar com CRM (Pipedrive, HubSpot, etc.)
- Criar dashboard com gráficos dos leads
