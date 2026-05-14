# Guia de Teste: Integração com Google Sheets

## 📋 Visão Geral

A integração com Google Sheets agora está completa! Os leads serão enviados automaticamente para sua planilha quando forem criados.

**Fluxo:**
1. Usuário preenche o formulário
2. Usuário responde o quiz
3. Lead é criado no banco de dados
4. Lead é enviado automaticamente para Google Sheets
5. Lead também é enviado para BotConversa

---

## 🧪 Como Testar

### Teste 1: Criar um Lead Completo

1. **Acesse o site**: https://leadscore-cdtynfij.manus.space
2. **Preencha o formulário**:
   - Nome: "João Silva"
   - Email: "joao@example.com"
   - Telefone: "11999999999"
   - Cidade: "São Paulo"
3. **Responda o quiz** (6 perguntas)
4. **Clique em "Enviar"**
5. **Você será redirecionado para a página de agradecimento**

### Teste 2: Verificar na Planilha

1. **Abra sua planilha Google Sheets**: https://docs.google.com/spreadsheets/d/1osJ_oMeVPqSbf--2pY6TJijH3ufJ-Xgfy2gIj0fC-oY/edit
2. **Procure pela linha com o lead que você criou**
3. **Verifique se todos os dados foram preenchidos**:
   - ✅ ID (LEAD-001, LEAD-002, etc.)
   - ✅ ID_CLIENTE (CWH-001)
   - ✅ NOME (João Silva)
   - ✅ EMAIL (joao@example.com)
   - ✅ TELEFONE (11999999999)
   - ✅ CIDADE (São Paulo)
   - ✅ TEMPERATURA (Frio, Morno ou Quente)
   - ✅ RESPOSTAS (Todas as respostas do quiz)
   - ✅ DATA_CRIACAO (Data e hora atual)
   - ✅ STATUS (Prioridade ou Normal)
   - ✅ OBSERVACOES (Pontuação + Temperatura)

---

## 🔍 Estrutura da Planilha

| Coluna | Nome | Descrição |
|--------|------|-----------|
| A | ID | ID único do lead (LEAD-001, LEAD-002, etc.) |
| B | ID_CLIENTE | ID do cliente para filtrar (CWH-001) |
| C | NOME | Nome do lead |
| D | EMAIL | Email do lead |
| E | TELEFONE | Telefone do lead |
| F | CIDADE | Cidade do lead |
| G | ESTADO | Estado do lead |
| H | IDADE | Idade do lead |
| I | TEMPERATURA | Temperatura (Frio, Morno, Quente) |
| J | RESPOSTA_1 | Resposta pergunta 1 |
| K | RESPOSTA_2 | Resposta pergunta 2 |
| L | RESPOSTA_3 | Resposta pergunta 3 |
| M | RESPOSTA_4 | Resposta pergunta 4 |
| N | RESPOSTA_5 | Resposta pergunta 5 |
| O | DATA_CRIACAO | Data e hora de criação |
| P | STATUS | Status (Prioridade ou Normal) |
| Q | OBSERVACOES | Observações (Pontuação + Temperatura) |

---

## 🐛 Troubleshooting

### Problema: Lead não aparece na planilha

**Solução:**
1. Verifique se o webhook URL está correto:
   - Acesse o Google Apps Script
   - Clique em "Deploy"
   - Verifique se a URL começa com `https://script.google.com/macros/s/`

2. Verifique os logs:
   - Abra o console do navegador (F12)
   - Procure por erros de conexão
   - Verifique se há mensagens de erro

3. Teste manualmente:
   - No Google Apps Script, clique em "Executar"
   - Selecione "testWebhook"
   - Verifique se um lead de teste foi inserido

### Problema: Dados incompletos na planilha

**Solução:**
1. Verifique se o formulário foi preenchido completamente
2. Verifique se o quiz foi respondido
3. Verifique se os dados estão sendo enviados corretamente

### Problema: Erro ao enviar para Google Sheets

**Solução:**
1. Verifique se a URL do webhook está correta
2. Verifique se o Google Apps Script está publicado
3. Verifique se as permissões estão corretas (Anyone)

---

## 📊 Filtrando Leads por Cliente

Para filtrar leads por cliente:

1. **Clique na coluna B (ID_CLIENTE)**
2. **Clique em "Dados"** → **"Criar um filtro"**
3. **Clique no ícone de filtro**
4. **Selecione o cliente que deseja ver** (CWH-001, CWH-002, etc.)

---

## 📈 Próximas Melhorias

- [ ] Adicionar mais clientes (CWH-002, CWH-003, etc.)
- [ ] Criar gráficos de análise de leads
- [ ] Adicionar formatação condicional por temperatura
- [ ] Criar relatórios automáticos
- [ ] Integrar com Google Forms para feedback

---

**Pronto para testar? Crie um lead e veja aparecer na planilha! 🚀**
