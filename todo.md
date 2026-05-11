# Lead Scoring Hapvida - TODO

## Mudanças Solicitadas

- [x] REMOVER página de confirmação para leads frios
- [x] Modificar fluxo de leads frios para enviar direto para automação sem confirmação
- [ ] Implementar sistema de inatividade (timeout) para detectar leads que preenchem formulário mas não completam quiz
- [ ] Enviar leads incompletos para automação com descrição "lead incompleto"
- [x] Garantir que todos os leads (quentes, mornos, frios e incompletos) sejam enviados para BotConversa

## Tarefas Técnicas

- [x] Adicionar coluna `status` na tabela leads (completo, incompleto, confirmado)
- [x] Criar página ConfirmacaoFrio.tsx para leads frios
- [ ] Implementar sistema de timeout no LeadContext (5-10 minutos de inatividade)
- [ ] Atualizar leadsRouter.ts para enviar leads incompletos
- [x] Atualizar ResultadoFrio.tsx para usar nova página de confirmação
- [ ] Adicionar logs de inatividade no dashboard

## Testes

- [ ] Testar fluxo completo de lead frio
- [ ] Testar sistema de inatividade
- [ ] Verificar se leads incompletos chegam no BotConversa com descrição correta
- [ ] Verificar se todos os leads chegam no Google Sheets
