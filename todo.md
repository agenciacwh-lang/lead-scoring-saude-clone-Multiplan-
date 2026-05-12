# Lead Scoring Hapvida - TODO

## Status Geral

✅ **SISTEMA DE INATIVIDADE IMPLEMENTADO**
✅ **DASHBOARD COMPLETO COM ESTATÍSTICAS**
✅ **TODOS OS LEADS SENDO RASTREADOS (COMPLETOS E INCOMPLETOS)**

## Mudanças Solicitadas

- [x] REMOVER página de confirmação para leads frios
- [x] Modificar fluxo de leads frios para enviar direto para automação sem confirmação
- [x] Implementar sistema de inatividade (timeout) para detectar leads que preenchem formulário mas não completam quiz
- [x] Enviar leads incompletos para automação com descrição "lead incompleto"
- [x] Garantir que todos os leads (quentes, mornos, frios e incompletos) sejam enviados para BotConversa

## Tarefas Técnicas

- [x] Adicionar coluna `status` na tabela leads (completo, incompleto, confirmado)
- [x] Criar página ConfirmacaoFrio.tsx para leads frios
- [x] Implementar sistema de timeout no LeadContext (10 minutos de inatividade)
- [x] Atualizar leadsRouter.ts para enviar leads incompletos
- [x] Atualizar ResultadoFrio.tsx para usar nova página de confirmação
- [x] Adicionar coluna lastActivityAt para rastreamento de inatividade
- [x] Atualizar Dashboard para mostrar leads incompletos

## Testes

- [x] Testar fluxo completo de lead frio
- [x] Testar sistema de inatividade
- [x] Verificar se leads incompletos chegam no BotConversa com descrição correta
- [x] Verificar se todos os leads chegam no Google Sheets
- [x] Todos os testes passando (6/6 ✓)
